/**
 * Billing Dock — host half.
 *
 *   GET /billing/usage        { ok, now, peak, today, turn }
 *   GET /billing/usage?diag=1 附带日志目录 / zstd 可用性 / 缓存计数
 *
 * 用量解析在 ./usage.js（从 @sky_wing_dn/dsh-fairy-zzz 抽出，MIT）。
 * 本插件不再依赖 fairy 包。
 */
import { collectUsage, usageDiagnostics } from './usage.js'

export const name = 'billing-dock'
export const inject = ['webServer']

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload)
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.end(body)
}

/* 3 秒内的重复请求不再扫日志（前端 20s 轮询一次，这里只是防抖） */
let memo = { at: 0, payload: null }
function usageSnapshot() {
  const now = Date.now()
  if (memo.payload && now - memo.at < 3000) return memo.payload
  const payload = collectUsage()
  memo = { at: now, payload }
  return payload
}

export function apply(ctx) {
  const webServer =
    (ctx && ctx.webServer) ||
    (ctx && typeof ctx.get === 'function' ? ctx.get('webServer') : null)
  if (!webServer || typeof webServer.register !== 'function') return
  ctx.effect(() =>
    webServer.register({
      kind: 'exact',
      path: '/billing/usage',
      handler: (req, res) => {
        try {
          let url = null
          try {
            url = new URL(req.url || '/', 'http://localhost')
          } catch {}
          if (url && url.searchParams.get('diag') === '1') {
            const payload = usageSnapshot()
            sendJson(res, 200, { ok: true, peak: payload.peak, diag: usageDiagnostics() })
            return
          }
          sendJson(res, 200, usageSnapshot())
        } catch (cause) {
          sendJson(res, 500, { ok: false, error: String((cause && cause.message) || cause) })
        }
      },
    }),
  )
}
