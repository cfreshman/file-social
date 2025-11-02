#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const now = new Date()
const year = now.getFullYear()
const month = String(now.getMonth() + 1).padStart(2, '0')
const day = String(now.getDate()).padStart(2, '0')
const timestamp = now.getTime()

const dirPath = join('posts', String(year), month, day)
const filePath = join(dirPath, `${timestamp}.html`)

// Create directory if it doesn't exist
await mkdir(dirPath, { recursive: true })

// Read template
const template = await readFile(join('public', 'template.html'), 'utf-8')

// Write new file
await writeFile(filePath, template)

console.log(`Created: ${filePath}`)

