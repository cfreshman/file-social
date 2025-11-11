#!/usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import readline from 'readline'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('\n⚠️  About to eject from file-social\n')
console.log('💡 This is the recommended setup for non-technical users!\n')
console.log('This will:')
console.log('  • Delete .git and create a fresh repo for YOUR content only')
console.log('  • You\'ll use "npm run update" to get app updates')
console.log('  • Your posts, config, and data will be tracked by git')
console.log('  • Core app files will be ignored (no merge conflicts!)\n')
console.log('⚠️  This cannot be undone!\n')

rl.question('Continue? (y/N) ', (answer) => {
  if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
    console.log('\nEject cancelled.')
    rl.close()
    process.exit(0)
  }
  
  try {
    const gitDir = path.join(ROOT, '.git')
    const isGitRepo = fs.existsSync(gitDir)
    
    // Save current version before deleting .git
    if (isGitRepo) {
      try {
        const commit = execSync('git rev-parse HEAD', { cwd: ROOT, encoding: 'utf8' }).trim()
        fs.writeFileSync(path.join(ROOT, '.file-social-version'), commit)
        console.log('\n💾 Saved current version:', commit.substring(0, 7))
      } catch (e) {
        // Couldn't get commit hash, create with "unknown"
        fs.writeFileSync(path.join(ROOT, '.file-social-version'), 'unknown')
      }
      
      console.log('🗑️  Deleting .git directory...')
      fs.rmSync(gitDir, { recursive: true, force: true })
      console.log('✅ Removed .git')
    } else {
      // Not a git repo (downloaded zip), create version file
      fs.writeFileSync(path.join(ROOT, '.file-social-version'), 'unknown')
      console.log('\n💾 Created version file')
    }
    
    // Switch .gitignore
    const contentOnlyIgnore = path.join(ROOT, '.gitignore.content-only')
    const gitignore = path.join(ROOT, '.gitignore')
    
    if (!fs.existsSync(contentOnlyIgnore)) {
      console.error('\n❌ .gitignore.content-only not found')
      rl.close()
      process.exit(1)
    }
    
    fs.copyFileSync(contentOnlyIgnore, gitignore)
    console.log('✅ Switched to content-only .gitignore')
    
    // Initialize fresh git repo
    console.log('\n🎬 Initializing fresh git repo...')
    execSync('git init', { cwd: ROOT, stdio: 'pipe' })
    execSync('git add .', { cwd: ROOT, stdio: 'pipe' })
    execSync('git commit -m "Initial commit (ejected from file-social)"', { cwd: ROOT, stdio: 'pipe' })
    console.log('✅ Initialized fresh repo with content')
    
    console.log('\n✅ Ejected successfully!')
    console.log('\nYour git repo now tracks only:')
    console.log('  • posts/')
    console.log('  • public/config/')
    console.log('  • public/data/')
    console.log('  • server/custom/')
    console.log('\nUse "npm run update" to get app updates.\n')
    
  } catch (error) {
    console.error('\n❌ Eject failed:', error.message)
    process.exit(1)
  }
  
  rl.close()
})

