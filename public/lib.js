// Single import file for file-social posts
// Loads all dependencies in correct order
// Usage: <script src="/lib.js"></script>

(async () => {
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve()
        return
      }
      const script = document.createElement('script')
      script.src = src
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  // Load in correct order
  await loadScript('/helpers.js')
  await loadScript('/css.js')
  await loadScript('/hydrate.js')
})()

