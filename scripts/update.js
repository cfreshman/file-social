#!/usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

console.log('🔄 Checking for file-social updates...\n')

// Check if this is tracking the upstream file-social repo
const isGitRepo = fs.existsSync(path.join(ROOT, '.git'))

if (isGitRepo) {
  try {
    // Check if they have the file-social remote
    const remotes = execSync('git remote -v', { encoding: 'utf8' })
    const hasFileSocialRemote = remotes.includes('cfreshman/file-social')
    
    if (hasFileSocialRemote) {
      const status = execSync('git status --porcelain', { encoding: 'utf8' })
      if (status.trim()) {
        console.log('⚠️  You have uncommitted changes.')
      }
      console.log('This is a git clone of file-social.\n')
      console.log('To update, run:')
      console.log('  git stash')
      console.log('  git pull origin m')
      console.log('  git stash pop\n')
      process.exit(0)
    }
    // Otherwise, they have their own git repo - continue with update
  } catch (e) {
    // Git command failed, continue with update
  }
}

console.log('📦 Downloading latest file-social...')

const GITHUB_ZIP = 'https://github.com/cfreshman/file-social/archive/refs/heads/m.zip'
const TEMP_DIR = path.join(ROOT, '.file-social-update')
const ZIP_FILE = path.join(TEMP_DIR, 'update.zip')

// Create temp directory
if (fs.existsSync(TEMP_DIR)) {
  fs.rmSync(TEMP_DIR, { recursive: true })
}
fs.mkdirSync(TEMP_DIR)

// Try using curl/wget first (more reliable), fall back to Node https
try {
  execSync(`curl -L -o "${ZIP_FILE}" "${GITHUB_ZIP}"`, { stdio: 'inherit' })
  
  // Verify file was downloaded
  if (!fs.existsSync(ZIP_FILE)) {
    throw new Error('File was not created')
  }
  
  const stat = fs.statSync(ZIP_FILE)
  if (stat.size === 0) {
    throw new Error('Downloaded file is empty')
  }
  
  console.log('✅ Downloaded\n')
  console.log('📂 Extracting...')
  extractAndUpdate()
} catch (curlError) {
  console.error('curl failed:', curlError.message)
  // Fall back to wget
  try {
    execSync(`wget -O "${ZIP_FILE}" "${GITHUB_ZIP}"`, { stdio: 'pipe' })
    
    // Verify file was downloaded
    const stat = fs.statSync(ZIP_FILE)
    if (stat.size === 0) {
      throw new Error('Downloaded file is empty')
    }
    
    console.log('✅ Downloaded\n')
    console.log('📂 Extracting...')
    extractAndUpdate()
  } catch (wgetError) {
    // Fall back to Node https (with better handling)
    console.log('(using Node.js download, this may be slower...)')
    
    function downloadFile(url, dest, callback) {
      const file = fs.createWriteStream(dest)
      let downloadedBytes = 0
      
      https.get(url, (response) => {
        // Follow redirects
        if (response.statusCode === 302 || response.statusCode === 301) {
          file.close()
          if (fs.existsSync(dest)) fs.unlinkSync(dest)
          downloadFile(response.headers.location, dest, callback)
          return
        }
        
        if (response.statusCode !== 200) {
          file.close()
          if (fs.existsSync(dest)) fs.unlinkSync(dest)
          callback(new Error(`Download failed with status ${response.statusCode}`))
          return
        }
        
        response.on('data', (chunk) => {
          downloadedBytes += chunk.length
        })
        
        response.pipe(file)
        
        file.on('finish', () => {
          file.close(() => {
            // Verify file was written
            const stat = fs.statSync(dest)
            if (stat.size === 0 || stat.size !== downloadedBytes) {
              callback(new Error(`File size mismatch: expected ${downloadedBytes}, got ${stat.size}`))
            } else {
              callback(null)
            }
          })
        })
        
        file.on('error', (err) => {
          file.close()
          if (fs.existsSync(dest)) fs.unlinkSync(dest)
          callback(err)
        })
      }).on('error', (err) => {
        file.close()
        if (fs.existsSync(dest)) fs.unlinkSync(dest)
        callback(err)
      })
    }
    
    downloadFile(GITHUB_ZIP, ZIP_FILE, (err) => {
      if (err) {
        console.error('❌ Download failed:', err.message)
        if (fs.existsSync(TEMP_DIR)) {
          fs.rmSync(TEMP_DIR, { recursive: true })
        }
        process.exit(1)
      }
      
      console.log('✅ Downloaded\n')
      console.log('📂 Extracting...')
      extractAndUpdate()
    })
  }
}

function extractAndUpdate() {
    // Extract zip
    try {
      execSync(`unzip -q "${ZIP_FILE}" -d "${TEMP_DIR}"`, { stdio: 'inherit' })
      
      const extractedDir = path.join(TEMP_DIR, 'file-social-m')
      
      console.log('✅ Extracted\n')
      console.log('🔄 Updating files...')
      
      // Files and directories to EXCLUDE (preserve user content)
      const exclude = new Set([
        'posts',
        'public/config',
        'public/data',
        '_01',
        'server/custom',
        'deploy/config.sh',
        '.gitignore',
        'node_modules',
        '.git'
      ])
      
      // Copy everything except excluded paths
      function copyRecursive(src, dest, relativePath = '') {
        const items = fs.readdirSync(src)
        
        items.forEach(item => {
          const srcPath = path.join(src, item)
          const destPath = path.join(dest, item)
          const relPath = relativePath ? `${relativePath}/${item}` : item
          
          // Skip if this path is excluded
          if (exclude.has(relPath)) {
            return
          }
          
          const stat = fs.statSync(srcPath)
          
          if (stat.isDirectory()) {
            // Create directory if it doesn't exist
            if (!fs.existsSync(destPath)) {
              fs.mkdirSync(destPath, { recursive: true })
            }
            // Recurse into directory
            copyRecursive(srcPath, destPath, relPath)
          } else {
            // Copy file
            fs.copyFileSync(srcPath, destPath)
          }
        })
      }
      
      copyRecursive(extractedDir, ROOT)
      
      console.log('✅ Files updated\n')
      console.log('📦 Installing dependencies...')
      
      execSync('npm install', { cwd: ROOT, stdio: 'inherit' })
      
      console.log('\n✅ Update complete!')
      console.log('\nYour content was preserved:')
      console.log('  • posts/')
      console.log('  • public/config/')
      console.log('  • public/data/')
      console.log('  • server/custom/ (if it exists)')
      console.log('  • .gitignore (if customized)')
      console.log('  • _01/')
      
      // Cleanup
      fs.rmSync(TEMP_DIR, { recursive: true })
      
    } catch (error) {
      console.error('❌ Update failed:', error.message)
      if (fs.existsSync(TEMP_DIR)) {
        fs.rmSync(TEMP_DIR, { recursive: true })
      }
      process.exit(1)
    }
}
