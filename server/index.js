import express from 'express'
import { readdir, readFile, mkdir } from 'fs/promises'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { existsSync } from 'fs'
import config from '../config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, '..')

// Ensure posts directory exists
const postsPath = join(ROOT, config.postsDir)
if (!existsSync(postsPath)) {
  await mkdir(postsPath, { recursive: true })
  console.log(`Created posts directory: ${postsPath}`)
}

// Constants
const METADATA_PREFIX = '-'
const HIDDEN_PREFIX = '.'
const COMMENT_PREFIX = '//'
const MEDIA_EXTENSIONS = ['.html', '.htm', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.mp4', '.webm', '.url']

const app = express()

// Serve text files wrapped in HTML template (must come before static middleware)
app.get('/posts/*', async (req, res, next) => {
  // Security: prevent directory traversal
  const requestedPath = req.path.replace('/posts/', '')
  if (requestedPath.includes('..')) {
    return res.status(403).send('Forbidden')
  }
  
  const filePath = join(ROOT, config.postsDir, requestedPath)
  const ext = extname(filePath).toLowerCase()
  
  // Only wrap text files (not .html, not images, etc.)
  if (!MEDIA_EXTENSIONS.includes(ext)) {
    try {
      const content = await readFile(filePath, 'utf-8')
      const template = await readFile(join(ROOT, config.publicDir, 'template.html'), 'utf-8')
      
      // Replace entire body with text content
      const html = template.replace(
        /<body>[\s\S]*<\/body>/,
        `<body>\n\n  <div style="white-space: pre-wrap;">${content}</div>\n\n</body>`
      )
      
      res.setHeader('Content-Type', 'text/html')
      res.send(html)
      return
    } catch (e) {
      // File doesn't exist or can't be read, fall through to next handler
      return next()
    }
  }
  
  next()
})

// Serve static files
app.use(express.static(join(ROOT, config.publicDir)))
app.use('/posts', express.static(join(ROOT, config.postsDir)))

// Server-side render index with metadata for social sharing
app.get('/', async (req, res) => {
  try {
    const item = new URLSearchParams(req.url.split('?')[1] || '').get('')?.split('?')[0]
    let html = await readFile(join(ROOT, config.publicDir, 'index.html'), 'utf-8')
    
    if (item) {
      // Security: prevent directory traversal
      if (item.includes('..')) {
        return res.status(403).send('Forbidden')
      }
      
      // Extract metadata from the item
      const itemPath = join(ROOT, config.postsDir, item)
      try {
        const itemHtml = await readFile(itemPath, 'utf-8')
        const titleMatch = /<title>([^<]+)<\/title>/i.exec(itemHtml)
        const imgMatch = /<img[^>]+src=["']([^"']+)["']/i.exec(itemHtml)
        
        const title = titleMatch?.[1] || item
        let icon = imgMatch?.[1] || ''
        if (icon && !icon.startsWith('http')) {
          icon = `${config.baseUrl}/posts/${item.split('/').slice(0, -1).join('/')}/${icon}`
        }
        
        // Replace meta tags
        html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
        html = html.replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${title}">`)
        html = html.replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${icon}">`)
        html = html.replace(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${icon}">`)
      } catch (e) {
        console.error('Error reading item for metadata:', e)
      }
    }
    
    res.send(html)
  } catch (error) {
    console.error('Error serving index:', error)
    res.status(500).send('Error loading page')
  }
})

// API: Get all posts (sorted by path descending)
app.get('/api/posts', async (req, res) => {
  try {
    const postsPath = join(ROOT, config.postsDir)
    const posts = await scanPosts(postsPath)
    
    // Sort by path descending (newest dates first: 2025 > 2024, 12 > 01, etc)
    posts.sort((a, b) => b.path.localeCompare(a.path))
    
    res.json({ posts })
  } catch (error) {
    console.error('Error reading posts:', error)
    res.status(500).json({ error: 'Failed to read posts' })
  }
})

// API endpoint to list config/tag files
app.get('/api/config', async (req, res) => {
  try {
    const configPath = join(ROOT, config.publicDir, 'config')
    const files = await readdir(configPath)
    
    // Filter to only files starting with '-'
    const configFiles = files.filter(f => f.startsWith('-') && !f.endsWith('.gitkeep'))
    
    res.json({ files: configFiles })
  } catch (error) {
    console.error('Error reading config:', error)
    res.status(500).json({ error: 'Failed to read config' })
  }
})

// Recursively scan posts directory
async function scanPosts(dir, basePath = '') {
  const posts = []
  const entries = await readdir(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    const relativePath = join(basePath, entry.name)
    
    if (entry.isDirectory()) {
      // Recurse into subdirectories
      const subPosts = await scanPosts(fullPath, relativePath)
      posts.push(...subPosts)
    } else if (!entry.name.startsWith(METADATA_PREFIX) && !entry.name.startsWith(HIDDEN_PREFIX)) {
      // Skip metadata files like -pins, -best and hidden files like .gitkeep
      posts.push({
        path: relativePath,
        name: entry.name,
        ext: extname(entry.name),
        basename: basename(entry.name, extname(entry.name))
      })
    }
  }
  
  return posts
}

app.listen(config.port, () => {
  console.log(`${config.name} running on http://localhost:${config.port}`)
})

