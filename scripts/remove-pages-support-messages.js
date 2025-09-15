import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const target = path.join(__dirname, '..', 'pages', 'api', 'support', 'messages.ts')

console.log('Attempting to remove:', target)

try {
  await fs.unlink(target)
  console.log('File removed successfully')
} catch (err) {
  console.error('Failed to remove file:', err && err.message ? err.message : err)
  process.exitCode = 1
}
