import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dir = path.join(__dirname, '..', 'pages', 'api', 'support')

try {
  const items = await fs.readdir(dir)
  console.log('Files in', dir)
  for (const name of items) {
    const codes = Array.from(name).map((c) => c.codePointAt(0))
    console.log('-', name, 'codes:', codes.join(','))
  }
} catch (err) {
  console.error('Failed to read dir:', err && err.message ? err.message : err)
  process.exitCode = 1
}
