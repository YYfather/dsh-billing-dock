window.__ModuleLoader__.load({
  id: '@yyfather/dsh-billing-dock',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useEffect, useRef, useState } = React
    const NS = 'billing-dock'
    const runtime = { ctx: null }
    let styled = false
    const CSS = ".bd-dock{position:fixed;left:12px;bottom:var(--bd-bottom,86px);width:246px;box-sizing:border-box;padding:11px 13px;border-radius:9px;z-index:3;pointer-events:none;font-family:\"Times New Roman\",\"SimSun\",\"宋体\",serif;font-size:12px;line-height:1.5;letter-spacing:.02em;transition:background .25s ease,border-color .25s ease,color .25s ease,opacity .2s ease,transform .2s ease}.bd-dock[data-collapsed]{opacity:0;transform:translateY(10px);pointer-events:none}\n.bd-dock[data-theme=dark]{background:rgba(6,8,6,.92);border:1px solid rgba(216,250,0,.22);color:rgba(242,242,238,.92);box-shadow:0 10px 26px rgba(0,0,0,.5)}\n.bd-dock[data-theme=light]{background:rgba(255,255,255,.9);border:1px solid rgba(74,123,200,.26);color:#3b6fc4;box-shadow:0 8px 22px rgba(40,70,130,.13);backdrop-filter:blur(6px)}\n.bd-head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:6px;font-size:12px;font-weight:700;letter-spacing:.06em;opacity:.9}\n.bd-row{display:flex;align-items:center;justify-content:space-between;gap:8px}\n.bd-k{opacity:.72}\n.bd-v{font-variant-numeric:tabular-nums;font-weight:800}\n.bd-clock{font-variant-numeric:tabular-nums;font-weight:800}\n.bd-dock[data-theme=dark] .bd-clock{color:#63bf8c}\n.bd-dock[data-theme=dark][data-tone=peak] .bd-clock{color:#d8a86a}\n.bd-tag{display:inline-flex;align-items:center;justify-content:center;width:auto;min-width:16px;height:16px;padding:0 4px;margin-right:4px;border-radius:4px;font-size:10px;font-weight:800}\n.bd-dock[data-theme=dark] .bd-tag{background:rgba(216,250,0,.16);color:#d8fa00}\n.bd-dock[data-theme=dark][data-tone=peak] .bd-tag{background:#f0a13a;color:#1a1207}\n.bd-dock[data-theme=light] .bd-tag{background:rgba(74,123,200,.14);color:#3b6fc4}\n.bd-dock[data-theme=light][data-tone=peak] .bd-tag{background:rgba(224,145,54,.18);color:#b4701d}\n.bd-note{margin-top:6px;padding-top:6px;font-size:10.5px;line-height:1.5;opacity:.5;border-top:1px solid currentColor}\n.bd-dock[data-theme=dark] .bd-note{border-top-color:rgba(242,242,238,.08)}\n.bd-dock[data-theme=light] .bd-note{border-top-color:rgba(59,111,196,.16)}\n.bd-dock[data-loading=1]{opacity:.6}.bd-dock[data-theme=light]{background:rgba(250,252,255,.97);border:1px solid rgba(15,35,70,.30);color:#0d1f3c;box-shadow:0 8px 22px rgba(20,40,80,.18);backdrop-filter:blur(6px)}\n.bd-dock[data-theme=light] .bd-head{color:#0d1f3c;opacity:1}\n.bd-dock[data-theme=light] .bd-k{color:#33465f;opacity:1}\n.bd-dock[data-theme=light] .bd-v{color:#0a3f8f;font-weight:800}\n.bd-dock[data-theme=light] .bd-clock{color:#0a6b3d}\n.bd-dock[data-theme=light][data-tone=peak] .bd-clock{color:#a34a00}\n.bd-dock[data-theme=light] .bd-tag{background:rgba(10,63,143,.12);color:#0a3f8f}\n.bd-dock[data-theme=light][data-tone=peak] .bd-tag{background:rgba(163,74,0,.16);color:#8a3f00}\n.bd-dock[data-theme=light] .bd-note{color:#3b4a5f;opacity:1;border-top-color:rgba(15,35,70,.16)}\n.bd-head{display:flex;align-items:center;gap:6px;margin:-1px -2px 5px;padding:1px 2px;pointer-events:auto;cursor:default;user-select:none;border-radius:5px;-webkit-user-select:none}\n.bd-head:hover,.bd-head:focus-visible{opacity:1;outline:none}\n.bd-title{margin-right:auto;white-space:nowrap}\n.bd-fold-val{flex:none;font-variant-numeric:tabular-nums;font-weight:700;white-space:nowrap;opacity:.95}\n.bd-fold{flex:none;display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;margin:-2px -3px -2px 4px;padding:0;border:0;border-radius:4px;background:transparent;color:inherit;opacity:.62;pointer-events:auto;cursor:pointer;transition:background .16s ease,opacity .16s ease}\n.bd-fold::before{content:'';display:block;width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:5px solid currentColor;transition:transform .18s ease}\n.bd-fold[data-next=\"edge\"]::before{transform:rotate(-90deg)}\n.bd-dock[data-menu=\"1\"]{overflow:visible}\n.bd-menu{position:absolute;right:0;bottom:calc(100% + 6px);min-width:108px;padding:4px;border-radius:9px;background:rgba(6,8,6,.97);border:1px solid rgba(216,250,0,.22);box-shadow:0 10px 24px rgba(0,0,0,.45);display:flex;flex-direction:column;gap:1px;pointer-events:auto}\n.bd-dock[data-theme=light] .bd-menu{background:rgba(250,252,255,.99);border-color:rgba(15,35,70,.22);box-shadow:0 10px 24px rgba(20,40,80,.2)}\n.bd-menu-item{border:0;background:transparent;color:inherit;font:inherit;font-size:11px;text-align:left;padding:5px 9px;border-radius:6px;cursor:pointer;white-space:nowrap;pointer-events:auto}\n.bd-menu-item:hover{background:rgba(128,128,128,.22)}\n.bd-menu-item[data-active=\"true\"]{background:rgba(128,128,128,.32);font-weight:700}\n.bd-fold:hover{opacity:1;background:rgba(128,128,128,.22)}\n\n.bd-dock[data-mode=\"full\"]{pointer-events:auto;cursor:grab}\n.bd-dock[data-dragging=\"1\"]{transition:none;cursor:grabbing}\n.bd-dock[data-shape=\"pill\"]{width:auto;max-width:none;padding:6px 10px;border-radius:9px;min-height:0;display:flex;align-items:center;justify-content:center;cursor:grab}\n.bd-edge-pill{font-size:11px;font-weight:700;white-space:nowrap;letter-spacing:.02em;font-variant-numeric:tabular-nums}.bd-dock{user-select:none;-webkit-user-select:none}\n.bd-dock{z-index:9990;overflow:hidden;transition:max-width .22s ease,left .22s ease,border-radius .22s ease,padding .22s ease,background .25s ease,border-color .25s ease,color .25s ease,opacity .2s ease,transform .2s ease}\n.bd-body{max-height:160px;opacity:1;transition:max-height .22s ease,opacity .16s ease;overflow:hidden}\n.bd-dock[data-mode=\"mini\"]{width:132px;max-width:none;padding:6px 9px;pointer-events:auto;cursor:pointer;overflow:hidden}\n.bd-dock[data-mode=\"mini\"] .bd-head{margin-bottom:0}\n.bd-dock[data-mode=\"mini\"] .bd-body{display:none}\n.bd-dock[data-mode=\"mini\"] .bd-title{display:none}\n.bd-dock[data-mode=\"full\"] .bd-edge,.bd-dock[data-mode=\"mini\"] .bd-edge{display:none}\n.bd-dock[data-mode=\"edge\"]{left:0;max-width:26px;min-height:66px;padding:9px 0;border-radius:0 8px 8px 0;pointer-events:auto;cursor:pointer;display:flex;align-items:center;justify-content:center}\n.bd-dock[data-mode=\"edge\"] .bd-head{display:none}\n.bd-dock[data-mode=\"edge\"] .bd-body{display:none}\n.bd-dock[data-mode=\"edge\"] .bd-edge{writing-mode:horizontal-tb;text-orientation:mixed;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:7px;font-size:11px;letter-spacing:.04em}\n.bd-dock[data-mode=\"edge\"] .bd-edge-val{writing-mode:horizontal-tb;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;font-size:10px;font-weight:700;line-height:1.15;letter-spacing:0}\n.bd-dock[data-mode=\"edge\"] .bd-edge-svg{display:block;font-family:inherit;font-variant-numeric:tabular-nums}\n.bd-edge-open{writing-mode:horizontal-tb;display:block;width:0;height:0;border-top:4px solid transparent;border-bottom:4px solid transparent;border-left:5px solid currentColor;opacity:.62}\n.bd-dock[data-mode=\"mini\"] .bd-k{flex:none;white-space:nowrap;padding:0;background:none;font-size:11px;line-height:14px;font-weight:700;opacity:1}\n\n\n.bd-dock[data-mode=\"full\"]{max-width:246px}\n.bd-head{max-height:40px;transition:max-height .2s ease,opacity .2s ease}\n.bd-dock[data-mode=\"edge\"][data-shape=\"pill\"]{width:max-content;max-width:none;min-height:0;padding:6px 10px;border-radius:9px;display:flex;align-items:center;justify-content:center;cursor:grab}.bd-tone{font-weight:800;opacity:1;letter-spacing:.02em}.bd-num{font-weight:900;-webkit-text-stroke:.2px currentColor}.bd-dock[data-theme=light] .bd-tone{color:#0a6b3d}.bd-dock[data-theme=light][data-tone=peak] .bd-tone{color:#a34a00}.bd-dock[data-theme=dark] .bd-tone{color:#63bf8c}.bd-dock[data-theme=dark][data-tone=peak] .bd-tone{color:#d8a86a}.bd-dock[data-theme=light] .bd-num{color:#0a3f8f}.bd-dock[data-theme=dark] .bd-num{color:rgba(242,242,238,.92)}"

    function ensureStyle() {
      // 复用一个可能残留的旧 <style>：直接覆盖内容，避免旧样式（例如 HMR 前注入的）
      // 与新样式同时存在时按文档顺序抢占，导致布局错乱。
      try {
        const existing = document.querySelector('style[data-plugin="' + NS + '"]')
        if (existing) {
          if (existing.textContent !== CSS) existing.textContent = CSS
          styled = true
          return
        }
      } catch (e) {}
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
      const [mode, setMode] = useState(() => {
        try {
          const saved = localStorage.getItem('billing-dock:mode')
          if (saved === 'full' || saved === 'edge') return saved
          return 'full'
        } catch (e) { return 'full' }
      })
      const dockRef = useRef(null)
      const dragRef = useRef(null)
      const [dragging, setDragging] = useState(false)
      const [pos, setPos] = useState(() => {
        try {
          const raw = localStorage.getItem('billing-dock:pos')
          const p = raw ? JSON.parse(raw) : null
          return p && Number.isFinite(p.left) && Number.isFinite(p.bottom) ? p : null
        } catch (e) { return null }
      })

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
        try { localStorage.setItem('billing-dock:mode', mode) } catch (e) {}
      }, [mode]);

      useEffect(() => {
        try { if (pos) localStorage.setItem('billing-dock:pos', JSON.stringify(pos)) } catch (e) {}
      }, [pos])

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

      const nearLeft = !pos || pos.left <= 48

      return h('div', {
        ref: dockRef,
        className: 'bd-dock',
        'data-theme': light ? 'light' : 'dark',
        'data-tone': tone,
        'data-loading': (usage || balance) ? '0' : '1',
        'data-mode': mode,
        'data-shape': mode === 'edge' ? (nearLeft ? 'strip' : 'pill') : undefined,
        'data-dragging': dragging ? '1' : '0',
        style: pos ? { left: pos.left + 'px', bottom: pos.bottom + 'px', right: 'auto' } : undefined,
        onPointerDown: (e) => {
          if (e.button !== 0) return
          const el = dockRef.current
          if (!el) return
          const rect = el.getBoundingClientRect()
          dragRef.current = { startX: e.clientX, startY: e.clientY, offX: e.clientX - rect.left, offY: e.clientY - rect.top, w: rect.width, h: rect.height, moved: false }
          const move = (ev) => {
            const d = dragRef.current
            if (!d) return
            if (!d.moved && Math.abs(ev.clientX - d.startX) + Math.abs(ev.clientY - d.startY) < 4) return
            d.moved = true
            setDragging(true)
            const left = Math.min(Math.max(0, ev.clientX - d.offX), window.innerWidth - d.w)
            const top = Math.min(Math.max(0, ev.clientY - d.offY), window.innerHeight - d.h)
            setPos({ left: Math.round(left), bottom: Math.round(window.innerHeight - top - d.h) })
          }
          const up = () => {
            document.removeEventListener('pointermove', move)
            document.removeEventListener('pointerup', up)
            setDragging(false)
            window.setTimeout(() => { dragRef.current = null }, 0)
          }
          document.addEventListener('pointermove', move)
          document.addEventListener('pointerup', up)
        },
        onClick: () => {
          if (dragRef.current && dragRef.current.moved) return
          setMode((m) => (m === 'full' ? 'edge' : 'full'))
        },
      },
        h('div', { className: 'bd-head' },
          h('span', { className: 'bd-title' }, '电费坞'),
          h('span', { className: 'bd-k bd-tone' }, peak ? (peak.offPeak ? '谷时' : '峰时') : '—')),
        h('div', { className: 'bd-edge', role: 'button', tabIndex: 0, 'aria-label': '展开电费坞', title: '点击展开电费坞',
          style: { alignItems: 'center', justifyContent: 'center', writingMode: 'horizontal-tb', width: '100%', boxSizing: 'border-box' },
          onClick: (e) => { e.stopPropagation(); setMode('full') },
          onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setMode('full') } } },
          nearLeft
            ? h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 92, writingMode: 'horizontal-tb', overflow: 'visible' } },
                h('span', { className: 'bd-tone', style: { display: 'block', transform: 'rotate(90deg)', transformOrigin: 'center center', whiteSpace: 'nowrap', fontSize: 12, fontWeight: 800, lineHeight: '14px', letterSpacing: '.02em', fontVariantNumeric: 'tabular-nums' } },
                  h('span', { className: 'bd-num' }, yuan(balance && Number.isFinite(balance.amount) ? balance.amount : NaN)),
                  peak ? ' ' + (peak.offPeak ? '谷时' : '峰时') : ''))
            : h('span', { className: 'bd-tone', style: { display: 'block', whiteSpace: 'nowrap', fontSize: 13, fontWeight: 800, lineHeight: '18px', letterSpacing: '.02em', fontVariantNumeric: 'tabular-nums' } },
                h('span', { className: 'bd-num' }, yuan(balance && Number.isFinite(balance.amount) ? balance.amount : NaN)),
                peak ? ' ' + (peak.offPeak ? '谷时' : '峰时') : '')),
        h('div', { className: 'bd-body' },
          h('div', { className: 'bd-row' },
            h('span', { className: 'bd-k' }, '账户余额'),
            h('span', { className: 'bd-v' }, balance && Number.isFinite(balance.amount) ? yuan(balance.amount) : '…')),
          h('div', { className: 'bd-row' },
            h('span', { className: 'bd-k' }, '今日电费'),
            h('span', { className: 'bd-v' }, today && Number.isFinite(today.cost) ? yuan(today.cost) : '…')),
          h('div', { className: 'bd-row' },
            h('span', { className: 'bd-k' }, peak ? peak.label : '倍率'),
            h('span', { className: 'bd-v' },
              peak ? h('span', { className: 'bd-tag' }, peak.offPeak ? '谷时' : '峰时') : null,
              left ? h('span', { className: 'bd-clock' }, clock(left)) : null)),
          h('div', { className: 'bd-note' }, peak && peak.window ? peak.window : '工作日 09–12、14–18 十倍电费，其余时段五倍')))
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
