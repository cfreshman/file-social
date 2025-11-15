// Single import file for file-social posts
// Loads all dependencies in correct order
// Usage: <script src="/lib.js"></script>

// Use document.write to inject scripts - blocks parsing but browser can parallelize fetches
document.write('<script src="/helpers.js"></script>')
document.write('<script src="/css.js"></script>')
document.write('<script src="/hydrate.js"></script>')

