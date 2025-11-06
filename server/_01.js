// _01 - crash-resistant file-based persistence
// Uses 3 files: "_" (flag), "0" (data), "1" (data)
//
// Good for: small state, low write frequency (<1/sec)
// Not for: high-frequency writes, large data (use a real DB)

import { writeFile } from 'fs/promises'
import { readFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const _01 = (dir = './store') => {
  const file_flag = join(dir, '_')
  const file_save_0 = join(dir, '0')
  const file_save_1 = join(dir, '1')

  // Ensure directory exists
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }

  let key, data
  const loadData = () => {
    try {
      key = existsSync(file_flag) ? parseInt(readFileSync(file_flag, 'utf8').trim()) : 0
    } catch {
      key = 0
    }
    
    const file = key === 0 ? file_save_0 : file_save_1
    try {
      data = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {}
    } catch {
      data = {}
    }
  }
  loadData()

  let saving = false
  const saveData = async () => {
    if (saving) return // Prevent concurrent saves
    saving = true
    try {
      // Write to opposite slot first
      key = key === 0 ? 1 : 0
      const file = key === 0 ? file_save_0 : file_save_1
      await writeFile(file, JSON.stringify(data, null, 2), 'utf8')
      // Then update flag
      await writeFile(file_flag, String(key), 'utf8')
    } finally {
      saving = false
    }
  }

  // Auto-save every minute
  const saveInterval = setInterval(saveData, 60_000)

  // Save on process exit (use sync for reliability on exit)
  const cleanup = async () => {
    clearInterval(saveInterval)
    await saveData()
  }
  process.on('SIGINT', () => { cleanup().then(() => process.exit()) })
  process.on('SIGTERM', () => { cleanup().then(() => process.exit()) })

  // Client API
  const store = {
    get data() { return data },
    save: () => saveData(),
  }

  return store
}

export default _01

// Example usage:
// import _01 from './_01.js'
// const store = _01('./data/mystore')
// store.data.users = []
// store.data.users.push({ name: 'Alice' })
// await store.save() // manual save (also auto-saves every minute)

