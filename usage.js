/**
 * Usage parser for billing-dock.
 *
 * 从 @sky_wing_dn/dsh-fairy-zzz (MIT) 抽出的会话日志解析：
 * 数据源 <DSH_HOME>/sessions/<项目>/<会话>/session.v4.jsonl.zstd，
 * 多帧 zstd 拼接，逐帧解压后每行一个事件，只取 assistant/message 的 data.usage。
 * 本文件让 billing-dock 不再依赖 fairy 包。
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'
import zlib from 'node:zlib'

const DSH_ROOT = process.env.DSH_HOME || join(homedir(), '.dsh')
const SESSIONS_ROOT = join(DSH_ROOT, 'sessions')

/* DeepSeek 官方价目（元 / 百万 token），下标 0 = 空闲时段，1 = 高峰时段 */
const PRICES = {
  'deepseek-flash': { hit: [0.02, 0.04], miss: [1, 2], out: [4, 8] },
  'deepseek-v4-pro': { hit: [0.15, 0.3], miss: [4.5, 9], out: [13.5, 27] },
}
const DEFAULT_PRICE = PRICES['deepseek-flash']

const BJ_OFFSET = 8 * 60 * 60 * 1000
const PEAK_RANGES = [[9 * 60, 12 * 60], [14 * 60, 18 * 60]]

/* 2026 年法定节假日（首尾都算）；新年份补一行，缺年份按纯工作日算 */
const HOLIDAY_RANGES = [
  ['2026-01-01', '2026-01-03'],
  ['2026-02-15', '2026-02-23'],
  ['2026-04-04', '2026-04-06'],
  ['2026-05-01', '2026-05-05'],
  ['2026-06-19', '2026-06-21'],
  ['2026-09-25', '2026-09-27'],
  ['2026-10-01', '2026-10-07'],
]
const HOLIDAY_DAYS = new Set()
for (const [from, to] of HOLIDAY_RANGES) {
  for (let t = Date.parse(from + 'T00:00:00Z'); t <= Date.parse(to + 'T00:00:00Z'); t += 86_400_000) {
    HOLIDAY_DAYS.add(new Date(t).toISOString().slice(0, 10))
  }
}

function beijingStamp(ms) {
  const d = new Date(ms + BJ_OFFSET)
  return {
    date: d.toISOString().slice(0, 10),
    weekday: d.getUTCDay(),
    minute: d.getUTCHours() * 60 + d.getUTCMinutes(),
  }
}

function isPeakAt(ms) {
  const s = beijingStamp(ms)
  if (s.weekday === 0 || s.weekday === 6) return false
  if (HOLIDAY_DAYS.has(s.date)) return false
  return PEAK_RANGES.some(([from, to]) => s.minute >= from && s.minute < to)
}

function nextPeakFlip(ms) {
  const current = isPeakAt(ms)
  let t = Math.ceil(ms / 60_000) * 60_000
  const limit = t + 7 * 86_400_000
  while (t < limit) {
    if (isPeakAt(t) !== current) return t
    t += 60_000
  }
  return t
}

function formatLeft(ms) {
  const total = Math.max(0, Math.round(ms / 60_000))
  const hours = Math.floor(total / 60)
  const minutes = total % 60
  if (hours && minutes) return hours + ' 小时 ' + minutes + ' 分'
  if (hours) return hours + ' 小时'
  if (minutes) return minutes + ' 分'
  return '不到 1 分'
}

function peakState(now = new Date()) {
  const time = now.getTime()
  const offPeak = !isPeakAt(time)
  const flipAt = nextPeakFlip(time)
  const remainMs = Math.max(0, flipAt - time)
  const next = new Date(flipAt + BJ_OFFSET)
  const hh = String(next.getUTCHours()).padStart(2, '0')
  const mm = String(next.getUTCMinutes()).padStart(2, '0')
  return {
    offPeak,
    label: offPeak ? '五倍电费' : '十倍电费',
    window: '工作日 09–12、14–18 十倍电费，其余时段五倍电费',
    remainMs,
    nextAt: flipAt,
    nextClock: hh + ':' + mm,
    next: formatLeft(remainMs) + '后转' + (offPeak ? '十倍电费' : '五倍电费'),
  }
}

const ZSTD_MAGIC = [0x28, 0xb5, 0x2f, 0xfd]
const USAGE_CACHE_MAX = 256
const usageCache = new Map()

function sessionFiles() {
  const out = []
  let projects = []
  try {
    projects = readdirSync(SESSIONS_ROOT, { withFileTypes: true })
  } catch {
    return out
  }
  for (const project of projects) {
    if (!project.isDirectory()) continue
    const dir = join(SESSIONS_ROOT, project.name)
    let sessions = []
    try {
      sessions = readdirSync(dir, { withFileTypes: true })
    } catch {
      continue
    }
    for (const session of sessions) {
      if (!session.isDirectory()) continue
      const file = join(dir, session.name, 'session.v4.jsonl.zstd')
      if (existsSync(file)) out.push(file)
    }
  }
  return out
}

function zstdFrameLength(buf, start) {
  const size = buf.length
  if (start + 4 > size) return -1
  if (buf[start] !== ZSTD_MAGIC[0] || buf[start + 1] !== ZSTD_MAGIC[1] || buf[start + 2] !== ZSTD_MAGIC[2] || buf[start + 3] !== ZSTD_MAGIC[3]) return -1
  let p = start + 4
  if (p + 1 > size) return -1
  const descriptor = buf[p]
  p += 1
  const fcsFlag = descriptor >> 6
  const singleSegment = (descriptor >> 5) & 1
  const hasChecksum = (descriptor >> 2) & 1
  const dictFlag = descriptor & 3
  if (!singleSegment) {
    if (p + 1 > size) return -1
    p += 1
  }
  p += [0, 1, 2, 4][dictFlag]
  let fcsSize = 0
  if (fcsFlag === 0) fcsSize = singleSegment ? 1 : 0
  else if (fcsFlag === 1) fcsSize = 2
  else if (fcsFlag === 2) fcsSize = 4
  else fcsSize = 8
  p += fcsSize
  for (;;) {
    if (p + 3 > size) return -1
    const header = buf[p] | (buf[p + 1] << 8) | (buf[p + 2] << 16)
    const last = header & 1
    const type = (header >> 1) & 3
    const blockSize = header >> 3
    p += 3
    if (type === 0 || type === 2) p += blockSize
    else if (type === 1) p += 1
    else return -1
    if (last) break
    if (p > size) return -1
  }
  if (hasChecksum) p += 4
  return p > size ? -1 : p - start
}

export function readUsageEvents(file, known, pruneBefore = 0) {
  let st = known
  if (!st) {
    try {
      st = statSync(file)
    } catch {
      return []
    }
  }
  const cached = usageCache.get(file)
  if (cached && cached.mtimeMs === st.mtimeMs && cached.size === st.size) {
    if (pruneBefore > 0 && cached.pruneBefore !== pruneBefore) {
      cached.events = cached.events.filter((ev) => ev.time >= pruneBefore)
      cached.pruneBefore = pruneBefore
    }
    return cached.events
  }
  if (typeof zlib.zstdDecompressSync !== 'function') return []

  let buf
  try {
    buf = readFileSync(file)
  } catch {
    return []
  }
  const size = buf.length
  let from = 0
  let events = []
  if (cached && size > cached.size && cached.parsedTo >= 0 && cached.parsedTo < size) {
    const at = cached.parsedTo
    if (buf[at] === ZSTD_MAGIC[0] && buf[at + 1] === ZSTD_MAGIC[1] && buf[at + 2] === ZSTD_MAGIC[2] && buf[at + 3] === ZSTD_MAGIC[3]) {
      from = at
      events = cached.events
    }
  }

  let parsedTo = size
  let cursor = from
  while (cursor < size) {
    const frameLen = zstdFrameLength(buf, cursor)
    if (frameLen < 0) {
      parsedTo = cursor
      break
    }
    let text = ''
    try {
      text = zlib.zstdDecompressSync(buf.subarray(cursor, cursor + frameLen)).toString('utf8')
    } catch {
      parsedTo = cursor
      break
    }
    for (const line of text.split('\n')) {
      if (!line) continue
      let ev
      try {
        ev = JSON.parse(line)
      } catch {
        continue
      }
      if (ev?.type !== 'assistant/message') continue
      const usage = ev?.data?.usage
      const time = ev?.time
      if (!usage || typeof time !== 'number') continue
      events.push({
        time,
        turn: ev?.data?.turn,
        model: ev?.data?.message?.source?.model || '',
        input: Number(usage.inputTokens) || 0,
        output: Number(usage.outputTokens) || 0,
        hit: Number(usage.cacheReadTokens) || 0,
        write: Number(usage.cacheWriteTokens) || 0,
      })
    }
    cursor += frameLen
  }
  if (pruneBefore > 0 && events.length > 0) {
    events = events.filter((ev) => ev.time >= pruneBefore)
  }

  while (usageCache.size >= USAGE_CACHE_MAX && !usageCache.has(file)) {
    const oldest = usageCache.keys().next()
    if (oldest.done) break
    usageCache.delete(oldest.value)
  }
  usageCache.set(file, { mtimeMs: st.mtimeMs, size, events, parsedTo, pruneBefore })
  return events
}

function emptyBucket(extra) {
  return { hit: 0, miss: 0, out: 0, cost: 0, calls: 0, ...extra }
}

function addToBucket(bucket, ev) {
  const price = PRICES[ev.model] || DEFAULT_PRICE
  const priceIndex = isPeakAt(ev.time) ? 1 : 0
  const miss = ev.input + ev.write
  bucket.hit += ev.hit
  bucket.miss += miss
  bucket.out += ev.output
  bucket.calls += 1
  bucket.cost += (ev.hit * price.hit[priceIndex] + miss * price.miss[priceIndex] + ev.output * price.out[priceIndex]) / 1e6
}

let usageLastRun = { at: 0, files: 0, recent: 0, ms: 0 }

export function collectUsage() {
  const started = Date.now()
  const now = new Date()
  const stamp = beijingStamp(now.getTime())
  const todayStart = Date.parse(stamp.date + 'T00:00:00+08:00')
  const peak = peakState(now)

  const today = emptyBucket()
  let total = 0
  let recent = 0
  let latest = null
  for (const file of sessionFiles()) {
    total += 1
    let st
    try {
      st = statSync(file)
    } catch {
      continue
    }
    if (st.mtimeMs < todayStart - 2 * 86400000) continue
    recent += 1
    const events = readUsageEvents(file, st, todayStart)
    if (latest === null || st.mtimeMs > latest.mtimeMs) latest = { file, mtimeMs: st.mtimeMs, events }
    for (const ev of events) {
      if (ev.time < todayStart) continue
      addToBucket(today, ev)
    }
  }

  let turn = null
  if (latest && latest.events.length > 0) {
    const last = latest.events[latest.events.length - 1]
    if (typeof last.turn === 'number') {
      turn = emptyBucket({ turn: last.turn })
      for (const ev of latest.events) {
        if (ev.turn === last.turn) addToBucket(turn, ev)
      }
    }
  }

  usageLastRun = { at: Date.now(), files: total, recent, ms: Date.now() - started }
  return { ok: true, now: now.getTime(), peak, today, turn }
}

export function usageDiagnostics() {
  return {
    root: SESSIONS_ROOT,
    zstd: typeof zlib.zstdDecompressSync === 'function',
    cached: usageCache.size,
    files: usageLastRun.files,
    recent: usageLastRun.recent,
    ms: usageLastRun.ms,
    at: usageLastRun.at,
  }
}
