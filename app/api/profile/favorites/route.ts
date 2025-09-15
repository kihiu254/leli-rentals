import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'user-favorites.json')

async function readFavorites() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    return []
  }
}

async function writeFavorites(favs: any[]) {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(favs, null, 2), 'utf-8')
}

export async function GET() {
  const favs = await readFavorites()
  return NextResponse.json(favs)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const favs = await readFavorites()
    const newFav = {
      id: `fav-${Date.now()}-${Math.floor(Math.random()*10000)}`,
      title: body.title || 'Untitled',
      description: body.description || '',
      price: body.price || 0,
      category: body.category || 'misc',
      image: body.image || '/placeholder.svg',
      rating: body.rating || 0,
      reviews: body.reviews || 0,
      location: body.location || '',
      owner: body.owner || '',
      createdAt: new Date().toISOString(),
    }
    favs.unshift(newFav)
    await writeFavorites(favs)
    return NextResponse.json(newFav)
  } catch (err) {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const favs = await readFavorites()
  const filtered = favs.filter((f: any) => f.id !== id)
  await writeFavorites(filtered)
  return NextResponse.json({ success: true })
}
