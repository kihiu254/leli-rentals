"use client"

import React, { useEffect, useState } from 'react'

export default function SupportAdmin() {
  const [sessions, setSessions] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [reply, setReply] = useState('')

  useEffect(() => {
    async function fetchAll() {
      const res = await fetch('/api/support/messages')
      const all = await res.json()
      const s = Array.from(new Set(all.map((m: any) => m.sessionId))) as string[]
      setSessions(s)
    }
    fetchAll()
  }, [])

  useEffect(() => {
    if (!selected) return
    let t: any
    async function fetchMsgs() {
      const res = await fetch(`/api/support/messages?sessionId=${encodeURIComponent(selected ?? '')}`)
      const data = await res.json()
      setMessages(data)
    }
    fetchMsgs()
    t = setInterval(fetchMsgs, 2000)
    return () => clearInterval(t)
  }, [selected])

  return (
    <div className="flex gap-5 p-5">
      <aside className="w-60 border-r border-gray-200 pr-3">
        <h3 className="text-lg font-semibold mb-4">Sessions</h3>
        <ul className="list-none p-0 space-y-1">
          {sessions.map((s) => (
            <li key={s}>
              <button 
                onClick={() => setSelected(s)} 
                className={`w-full text-left px-2 py-2 border-none rounded transition-colors ${
                  selected === s 
                    ? 'bg-green-600 text-white' 
                    : 'bg-transparent text-black hover:bg-gray-100'
                }`}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="flex-1">
        <h3 className="text-lg font-semibold mb-4">Messages {selected ? `- ${selected}` : ''}</h3>
        <div className="max-h-[60vh] overflow-auto border border-gray-200 p-3 rounded">
          {messages.map((m) => (
            <div key={m.id} className="mb-2">
              <strong>{m.from}</strong>: {m.text}
            </div>
          ))}
        </div>

        {selected && (
          <div className="mt-3 flex gap-2">
            <input 
              value={reply} 
              onChange={(e) => setReply(e.target.value)} 
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
              placeholder="Type reply..." 
            />
            <button 
              onClick={async () => {
                if (!reply.trim()) return
                await fetch('/api/support/messages', { 
                  method: 'POST', 
                  headers: { 'Content-Type': 'application/json' }, 
                  body: JSON.stringify({ sessionId: selected, from: 'agent', text: reply.trim() }) 
                })
                setReply('')
              }} 
              className="px-3 py-2 bg-green-600 text-white border-none rounded hover:bg-green-700 transition-colors"
            >
              Send
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
