// Helper functions extracted from freshman.dev/copyright.js
// cyrus freshman > 2013

// Query selectors
window.Q = (l, s) => s ? l.querySelector(s) : document.querySelector(l)
window.QQ = (l, s) => Array.from(s ? l.querySelectorAll(s) : document.querySelectorAll(l))

// Named logger
window.named_log = (name, print=console.debug.bind(console)) => (...x) => print(`[${name}]`, ...x)

// List and set utilities
window.list = (data=[], separator=' ') => typeof(data) === 'string' ? data.split(separator) : Array.from(data)
window.set = (data=[], separator=' ') => new Set(list(data, separator))

// Event handler
window.on = (l, es, f, o=undefined) => {
  const setEventListener = action => (
    (ls, es) => ls.map(l => es.map(e => l && l[action + 'EventListener'](e, f, o)))
  )(
    [l].flatMap(x => x).flatMap(li => typeof(li) === 'string' ? QQ(li) : [li]),
    typeof(es) === 'string' ? es.split(' ') : es
  )
  setEventListener('add')
  return () => setEventListener('remove')
}

// Resolvable promise
window.resolvable = () => {
  let resolve, reject
  return Object.assign(new Promise((rs, rj) => [resolve, reject] = [rs, rj]), { resolve, reject })
}

// Defer utility
window.defer = (f=()=>{}, ms=1) => {
  const promise = resolvable()
  return Object.assign(promise, {
    handle: setTimeout(async () => promise.resolve(typeof f === 'function' ? f() : f), ms),
    interrupt(reason) {
      clearTimeout(this.handle)
      promise.reject(reason)
    },
  })
}

// Create DOM node from HTML string
window.node = (html='<div></div>', assign={}) => Object.assign(html.trim()[0] === '<' ? (x => {
  x.innerHTML = html
  return x.children[0]
})(document.createElement('div')) : node(`<${html}></${html}>`), assign)

// Display status temporarily
const _displayStatus_active = {}
window.displayStatus = async (element, status, ms=1_500) => {
  clearTimeout((x => x&&(x[0]()||x[1]))(_displayStatus_active[element]))

  const rect = element.getBoundingClientRect()
  const display = element.insertAdjacentElement('afterend', node(`<${element.tagName} class="${element.className}" style="
  ${element.style.cssText}
  min-width: ${rect.width}px;
  min-height: ${rect.height}px;
  ">${status}</${element.tagName}>`))
  element.remove()
  const undo = () => {
    display.insertAdjacentElement('beforebegin', element)
    display.remove()
  }
  
  _displayStatus_active[element] = [undo, setTimeout(() => {
    undo()
    delete _displayStatus_active[element]
  }, ms)]
}
window.display_status = displayStatus

// URL utilities
window.url = {
  replace: (href) => history.replaceState(null, '', href),
  push: (href) => history.pushState(null, '', href),
}

// Copy to clipboard
window.copy = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (e) {
    // fallback
    let textarea
    try {
      textarea = node('textarea')
      textarea.setAttribute('readonly', true)
      textarea.setAttribute('contenteditable', true)
      textarea.style.position = 'fixed'
      textarea.style.left = '-999px'
      textarea.value = text
      document.body.appendChild(textarea)
      
      // iOS selection
      const range = document.createRange()
      range.selectNodeContents(textarea)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      textarea.setSelectionRange(0, textarea.value.length)
      
      document.execCommand('copy')
      document.body.removeChild(textarea)
    } catch (err) {
      if (textarea) document.body.removeChild(textarea)
      throw err
    }
  }
}

// Device detection
window.devices = {
  is_mobile: JSON.parse(localStorage.getItem('dev-mobile') || '0') || /iPhone|iPod|Android|Pixel|Windows Phone/i.test(navigator.userAgent),
  toggle_mobile: () => {
    localStorage.setItem('dev-mobile', JSON.stringify(!devices.is_mobile))
    location.reload()
  },
  is_watch: (() => {
    // true if physical screen is small and square-ish
    const physical = {
      width: screen.width / devicePixelRatio,
      height: screen.height / devicePixelRatio,
    }
    return physical.width < 400 && Math.abs(1 - (physical.width / physical.height)) < .5
  })(),
  get is_non_watch_mobile() {return devices.is_mobile && !devices.is_watch},
  get is_mobile_not_watch() {return this.is_non_watch_mobile},
  get is_desktop() {return !devices.is_mobile},
}

console.debug('helpers.js loaded')

