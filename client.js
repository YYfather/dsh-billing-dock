window.__ModuleLoader__.load({
  id: '@yyfather/dsh-billing-dock',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useEffect, useRef, useState } = React
    const NS = 'billing-dock'
    const runtime = { ctx: null }
    let styled = false
    const CSS = ".bd-dock{position:fixed;left:12px;bottom:var(--bd-bottom,86px);width:246px;box-sizing:border-box;padding:11px 13px;border-radius:9px;z-index:3;pointer-events:none;font-family:var(--dsw-font-mono,ui-monospace,SFMono-Regular,Menlo,monospace);font-size:12px;line-height:1.5;letter-spacing:.02em;transition:background .25s ease,border-color .25s ease,color .25s ease,opacity .2s ease,transform .2s ease}.bd-dock[data-collapsed]{opacity:0;transform:translateY(10px);pointer-events:none}\n.bd-dock[data-theme=dark]{background:rgba(6,8,6,.92);border:1px solid rgba(216,250,0,.22);color:rgba(242,242,238,.92);box-shadow:0 10px 26px rgba(0,0,0,.5)}\n.bd-dock[data-theme=light]{background:rgba(255,255,255,.9);border:1px solid rgba(74,123,200,.26);color:#3b6fc4;box-shadow:0 8px 22px rgba(40,70,130,.13);backdrop-filter:blur(6px)}\n.bd-head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:6px;font-size:12px;font-weight:700;letter-spacing:.06em;opacity:.9}\n.bd-row{display:flex;align-items:center;justify-content:space-between;gap:8px}\n.bd-k{opacity:.72}\n.bd-v{font-variant-numeric:tabular-nums;font-weight:600}\n.bd-clock{font-variant-numeric:tabular-nums;font-weight:600}\n.bd-dock[data-theme=dark] .bd-clock{color:#63bf8c}\n.bd-dock[data-theme=dark][data-tone=peak] .bd-clock{color:#d8a86a}\n.bd-tag{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;margin-right:4px;border-radius:4px;font-size:10px;font-weight:700}\n.bd-dock[data-theme=dark] .bd-tag{background:rgba(216,250,0,.16);color:#d8fa00}\n.bd-dock[data-theme=dark][data-tone=peak] .bd-tag{background:#f0a13a;color:#1a1207}\n.bd-dock[data-theme=light] .bd-tag{background:rgba(74,123,200,.14);color:#3b6fc4}\n.bd-dock[data-theme=light][data-tone=peak] .bd-tag{background:rgba(224,145,54,.18);color:#b4701d}\n.bd-note{margin-top:6px;padding-top:6px;font-size:10.5px;line-height:1.5;opacity:.5;border-top:1px solid currentColor}\n.bd-dock[data-theme=dark] .bd-note{border-top-color:rgba(242,242,238,.08)}\n.bd-dock[data-theme=light] .bd-note{border-top-color:rgba(59,111,196,.16)}\n.bd-dock[data-loading=1]{opacity:.6}.bd-dock[data-theme=light]{background:rgba(250,252,255,.97);border:1px solid rgba(15,35,70,.30);color:#0d1f3c;box-shadow:0 8px 22px rgba(20,40,80,.18);backdrop-filter:blur(6px)}\n.bd-dock[data-theme=light] .bd-head{color:#0d1f3c;opacity:1}\n.bd-dock[data-theme=light] .bd-k{color:#33465f;opacity:1}\n.bd-dock[data-theme=light] .bd-v{color:#0a3f8f;font-weight:700}\n.bd-dock[data-theme=light] .bd-clock{color:#0a6b3d}\n.bd-dock[data-theme=light][data-tone=peak] .bd-clock{color:#a34a00}\n.bd-dock[data-theme=light] .bd-tag{background:rgba(10,63,143,.12);color:#0a3f8f}\n.bd-dock[data-theme=light][data-tone=peak] .bd-tag{background:rgba(163,74,0,.16);color:#8a3f00}\n.bd-dock[data-theme=light] .bd-note{color:#3b4a5f;opacity:1;border-top-color:rgba(15,35,70,.16)}"

    function ensureStyle() {
      if (styled) return
      styled = true
      try {
        const style = document.createElement('style')
        style.setAttribute('data-plugin', NS)
        style.textContent = CSS
        document.head.appendChild(style)
      } catch (e) {}
    }

    /* 跟随宿主主题：优先 ctx.theme.getTheme()，退回 <html> 属性 / class / prefers-color-scheme */
    function isLight() {
      try {
        const theme = runtime.ctx && runtime.ctx.theme
        const t = theme && typeof theme.getTheme === 'function' ? theme.getTheme() : null
        const v = typeof t === 'string' ? t : t && (t.scheme || t.name || t.mode)
        if (v === 'light') return true
        if (v === 'dark') return false
      } catch (e) {}
      try {
        const root = document.documentElement
        const attr = String(root.getAttribute('data-theme') || root.getAttribute('data-color-scheme') || '').toLowerCase()
        if (attr.indexOf('light') >= 0) return true
        if (attr.indexOf('dark') >= 0) return false
        const cls = String(root.className || '').toLowerCase()
        if (cls.indexOf('light') >= 0) return true
        if (cls.indexOf('dark') >= 0) return false
        return !window.matchMedia('(prefers-color-scheme: dark)').matches
      } catch (e) { return false }
    }

    function yuan(value) {
      if (!Number.isFinite(value)) return '—'
      if (value === 0) return '¥0'
      if (value < 0.01) return '¥' + value.toFixed(4)
      if (value < 10) return '¥' + value.toFixed(3).replace(/0+$/, '')
      return '¥' + value.toFixed(2)
    }

    function clock(ms) {
      const total = Math.max(0, Math.floor(ms / 1000))
      const hh = String(Math.floor(total / 3600)).padStart(2, '0')
      const mm = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
      const ss = String(total % 60).padStart(2, '0')
      return hh + ':' + mm + ':' + ss
    }

    async function readBalance() {
      const ctx = runtime.ctx
      if (!ctx) return null
      let account = null
      try { account = (ctx.remote && ctx.remote.account) || null } catch (e) { return null }
      if (!account || typeof account.getBalance !== 'function') return null
      try {
        const res = await account.getBalance({
          version: '0.2.1-rc.2',
          locale: navigator.language || 'zh-CN',
          timezoneOffsetSeconds: -new Date().getTimezoneOffset() * 60,
        })
        if (!res || !res.ok) return null
        const raw = res.value
        const pick = (list) => (Array.isArray(list) ? list.filter((it) => it && Number.isFinite(Number(it.balance))) : [])
        let wallets = pick(raw)
        if (!wallets.length && raw && !Array.isArray(raw)) {
          wallets = pick(raw.wallets)
          if (!wallets.length) wallets = pick(raw.value)
          if (!wallets.length) wallets = pick(raw.bonusWallets)
        }
        if (!wallets.length) return null
        const cny = wallets.filter((it) => (it.currency || 'CNY') === 'CNY')
        const use = cny.length ? cny : wallets
        return { amount: use.reduce((sum, it) => sum + Number(it.balance), 0) }
      } catch (e) { return null }
    }

    async function readUsage() {
      try {
        const res = await fetch('/billing/usage', { cache: 'no-store' })
        if (!res.ok) return null
        return await res.json()
      } catch (e) { return null }
    }

    function Dock() {
      const [usage, setUsage] = useState(null)
      const [balance, setBalance] = useState(null)
      const [tick, setTick] = useState(() => Date.now())
      const [light, setLight] = useState(() => isLight())
      const dockRef = useRef(null)

      useEffect(() => {
        const applyTheme = () => setLight(isLight())
        applyTheme()
        let observer = null
        try {
          observer = new MutationObserver(applyTheme)
          observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-color-scheme', 'style'] })
        } catch (e) {}
        let mq = null
        const onScheme = () => applyTheme()
        try {
          mq = window.matchMedia('(prefers-color-scheme: dark)')
          if (mq.addEventListener) mq.addEventListener('change', onScheme)
        } catch (e) {}
        return () => {
          if (observer) observer.disconnect()
          try { if (mq && mq.removeEventListener) mq.removeEventListener('change', onScheme) } catch (e) {}
        };
      }, []);

      useEffect(() => {
        let alive = true
        const load = async () => {
          const u = await readUsage()
          if (alive && u) setUsage(u)
          const b = await readBalance()
          if (alive && b) setBalance(b)
        };
        load()
        const slow = window.setInterval(load, 20000)
        const fast = window.setInterval(() => setTick(Date.now()), 1000)
        return () => { alive = false; window.clearInterval(slow); window.clearInterval(fast) };
      }, []);

      useEffect(() => {
        const root = document.documentElement
        let timer = null
        let observer = null
        const apply = () => {
          const dock = dockRef.current
          const foot = document.querySelector('[class*="_footArea"]')
          if (!dock) return false
          if (!foot) { dock.dataset.collapsed = '1'; return false }
          const fr = foot.getBoundingClientRect()
          if (fr.height <= 0 || fr.width < 200) { dock.dataset.collapsed = '1'; return false }
          delete dock.dataset.collapsed
          root.style.setProperty('--bd-bottom', Math.max(8, Math.round(window.innerHeight - fr.top + 6)) + 'px')
          return true
        }
        apply()
        const onResize = () => {
          if (timer) return
          timer = window.setTimeout(() => { timer = null; try { apply() } catch (e) {} }, 120)
        }
        window.addEventListener('resize', onResize)
        try {
          const foot = document.querySelector('[class*="_footArea"]')
          if (foot && typeof ResizeObserver === 'function') {
            observer = new ResizeObserver(() => { try { apply() } catch (e) {} })
            observer.observe(foot)
          }
        } catch (e) {}
        return () => {
          if (timer) window.clearTimeout(timer)
          window.removeEventListener('resize', onResize)
          if (observer) observer.disconnect()
          root.style.removeProperty('--bd-bottom')
        };
      }, []);

      const peak = usage && usage.peak ? usage.peak : null
      const today = usage && usage.today ? usage.today : null
      const nextAt = peak && peak.nextAt ? peak.nextAt : 0
      const left = nextAt ? nextAt - tick : 0
      const tone = peak && peak.offPeak ? 'valley' : 'peak'

      return h('div', {
        ref: dockRef,
        className: 'bd-dock',
        'data-theme': light ? 'light' : 'dark',
        'data-tone': tone,
        'data-loading': (usage || balance) ? '0' : '1',
      },
        h('div', { className: 'bd-head' },
          h('span', null, '电费坞'),
          h('span', { className: 'bd-k' }, peak ? (peak.offPeak ? '谷时' : '峰时') : '')),
        h('div', { className: 'bd-row' },
          h('span', { className: 'bd-k' }, '账户余额'),
          h('span', { className: 'bd-v' }, balance && Number.isFinite(balance.amount) ? yuan(balance.amount) : '…')),
        h('div', { className: 'bd-row' },
          h('span', { className: 'bd-k' }, '今日电费'),
          h('span', { className: 'bd-v' }, today && Number.isFinite(today.cost) ? yuan(today.cost) : '…')),
        h('div', { className: 'bd-row' },
          h('span', { className: 'bd-k' }, peak ? peak.label : '倍率'),
          h('span', { className: 'bd-v' },
            peak ? h('span', { className: 'bd-tag' }, peak.offPeak ? '谷' : '峰') : null,
            left ? h('span', { className: 'bd-clock' }, clock(left)) : null)),
        h('div', { className: 'bd-note' }, peak && peak.window ? peak.window : '工作日 09–12、14–18 十倍电费，其余时段五倍'))
    }

    return {
      inject: ['slots', 'theme', 'remote', 'remote.account'],
      apply(ctx) {
        runtime.ctx = ctx
        ensureStyle()
        try {
          ctx.slots.inject('shell.overlay', () => {
            ctx.slots.register({ name: 'shell.overlay', id: 'billing-dock', order: 30 }, Dock)
          })
        } catch (e) { console.warn('[billing-dock] mount failed', e) }
      },
    }
  },
})
