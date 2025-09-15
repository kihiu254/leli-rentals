// scripts/generate-placeholders.js
// Node 18+ script to generate simple SVG placeholder files per category
// Usage: node scripts/generate-placeholders.js category=tools count=600 out=public/images

import fs from 'fs'
import path from 'path'

const argv = Object.fromEntries(process.argv.slice(2).map(a => a.split('=')))
const category = argv.category || 'tools'
const count = Number(argv.count || 600)
const outRoot = argv.out || 'public/images'
const width = Number(argv.width || 800)
const height = Number(argv.height || 600)

const outDir = path.resolve(process.cwd(), outRoot, category)
fs.mkdirSync(outDir, { recursive: true })

const colorSets = [
  { bg: '#FDE68A', fg: '#92400E' },
  { bg: '#BFDBFE', fg: '#1E40AF' },
  { bg: '#D1FAE5', fg: '#065F46' },
  { bg: '#FCE7F3', fg: '#831843' },
  { bg: '#E6E6FA', fg: '#4C1D95' },
]

function makeSvg(seedText, idx) {
  const colors = colorSets[idx % colorSets.length]
  const title = `${seedText.replace(/\s+/g, ' ')} #${idx + 1}`
  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n` +
    `<rect width="100%" height="100%" fill="${colors.bg}"/>\n` +
    `<g font-family="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-weight="600">\n` +
    `<text x="50%" y="45%" text-anchor="middle" font-size="36" fill="${colors.fg}">${escapeXml(title)}</text>\n` +
    `<text x="50%" y="60%" text-anchor="middle" font-size="20" fill="${colors.fg}">Category: ${escapeXml(category)}</text>\n` +
    `</g>\n</svg>`
}

function escapeXml(str) {
  return str.replace(/[&<>\"']/g, function (c) {
    switch (c) {
      case '&': return '&amp;'
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '"': return '&quot;'
      case "'": return '&#39;'
    }
  })
}

console.log(`Generating ${count} placeholders for category: ${category} -> ${outDir}`)
for (let i = 0; i < count; i++) {
  const seed = `${category}-${i+1}`
  const svg = makeSvg(seed, i)
  const filePath = path.join(outDir, `${seed}.svg`)
  fs.writeFileSync(filePath, svg)
  if ((i+1) % 50 === 0) console.log(`Written ${i+1}/${count}`)
}
console.log('Done')
