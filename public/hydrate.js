// Minimal hydrate-components.js for file-social
// Only implements data-style and data-title which are actually used

if (!window['hydrate-components.js']) {
  window['hydrate-components.js'] = Date.now()
  
  const log = named_log('hydrate-components.js')
  let _hydrated    
  window.hydrated = new Promise(resolve => _hydrated = resolve)

  defer(async () => {
    const title = document.title
    const subtitle = Q('meta[name=description')?.content

    const hydrate = (selector, hydration) => Promise.all((Array.isArray(selector) ? selector : QQ(`:is(${selector})[data-hydrate]:not([data-hydrated])`)).map(async (L, i, a) => {
      if (i === 0) log(a.length, Object.keys(hydrates).find(k => hydrates[k] === hydration) || selector)
      hydrate(L, hydrates.split)
      if (!await hydration(L, i, a)) {
        delete L.dataset['hydrate']
        L.dataset['hydrated'] = true
      }
    }))

    const hydrates = {
      split: L => {
        if (L.dataset['hydrate']) L.dataset['hydrate'].split(',').map(x => L.dataset[x] = '')
        return true
      },

      style: L => L.outerHTML = `<meta charset=utf-8><meta name="viewport" content="width=device-width,initial-scale=1" /><style>${css.common.base}:root{font-family:'DM Mono',monospace;min-height:max-content;${css.mixin.solarize}--background:#fdfcfa;--color:#101010;--button:#eee;}*{box-sizing:border-box;font-family:inherit;}html,body{display:flex;flex-direction:column;align-items:flex-start}html{height:100%;background:var(--background);color:var(--color);font-size:12px;}body{flex-grow:1;padding:.5em;}iframe{border:0;display:block;}a{color:inherit;text-decoration:underline;}a:not(:has(button)):hover{background:var(--color);color:var(--background);}button,a,input,*[onclick]{font-size:1em;cursor:pointer;touch-action:manipulation;}button,input:is(:not([type]),[type=text],[type=password],[type=email]){border:1px solid currentColor;border-radius:10em;padding:.1667em.67em;height:calc(100%-1px);margin:.5px 0;}button{background:var(--button);user-select:none;box-shadow:0 1px currentColor}button:active{box-shadow:none;transform:translateY(1px)}input:is(:not([type]),[type=text]){background:none;}input:is(:not([type]),[type=text],[type=password],[type=email])::placeholder{opacity:.425;}</style>`,

      title: L => {
        L.innerHTML = `<span class=title style="font-weight: bold"></span>${title ? ' ' : ''}<span class=subtitle style="font-style:italic;opacity:.67;letter-spacing:-.1em"></span>`
        Q(L, '.title').textContent = title ? `(${title})` : ''
        Q(L, '.subtitle').textContent = subtitle
      },
    }

    const _do_hydrate = async () => {
      await hydrate('*', hydrates.split)
      await hydrate('[data-style]', hydrates.style)
      await hydrate('[data-title]', hydrates.title)
    }

    Object.assign(window, {hydrate, hydrates, _do_hydrate})
    if (!window._hydrate_skip) {
      await _do_hydrate()
      _hydrated()
    }
  })
}

