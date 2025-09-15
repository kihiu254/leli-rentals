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
    <div style={{ display: 'flex', gap: 20, padding: 20 }}>
      <aside style={{ width: 240, borderRight: '1px solid #eee', paddingRight: 12 }}>
        <h3>Sessions</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {sessions.map((s) => (
            <li key={s}><button onClick={() => setSelected(s)} style={{ background: selected === s ? '#0f9d58' : 'transparent', color: selected === s ? '#fff' : '#000', border: 'none', padding: '8px 6px', width: '100%', textAlign: 'left' }}>{s}</button></li>
          ))}
        </ul>
      </aside>

      <section style={{ flex: 1 }}>
        <h3>Messages {selected ? `- ${selected}` : ''}</h3>
        <div style={{ maxHeight: '60vh', overflow: 'auto', border: '1px solid #eee', padding: 12 }}>
          {messages.map((m) => (<div key={m.id} style={{ marginBottom: 8 }}><strong>{m.from}</strong>: {m.text}</div>))}
        </div>

        {selected && (
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <input value={reply} onChange={(e) => setReply(e.target.value)} style={{ flex: 1, padding: '8px 10px' }} placeholder="Type reply..." />
            <button onClick={async () => {
              if (!reply.trim()) return
              await fetch('/api/support/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: selected, from: 'agent', text: reply.trim() }) })
              setReply('')
            }} style={{ padding: '8px 12px', background: '#0f9d58', color: '#fff', border: 'none', borderRadius: 6 }}>Send</button>
          </div>
        )}
      </section>
    </div>
  )
}
