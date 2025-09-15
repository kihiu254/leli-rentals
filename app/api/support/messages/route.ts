import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'support-messages.json')

async function readMessages() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    return []
  }
}

async function writeMessages(messages: any[]) {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(messages, null, 2), 'utf-8')
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const sessionId = url.searchParams.get('sessionId')
  const messages = await readMessages()
  const filtered = sessionId ? messages.filter((m: any) => m.sessionId === sessionId) : messages
  return NextResponse.json(filtered)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { sessionId, from, text } = body
    if (!sessionId || !from || !text) {
      return NextResponse.json({ error: 'sessionId, from and text are required' }, { status: 400 })
    }

    const messages = await readMessages()
    const message = {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      sessionId,
      from,
      text,
      createdAt: new Date().toISOString(),
    }
    messages.push(message)
    await writeMessages(messages)
    return NextResponse.json(message)
  } catch (err) {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }
}
