import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const moodColors = {
  happy: '#3B6D11', excited: '#854F0B',
  anxious: '#633806', sad: '#0C447C',
  angry: '#791F1F', frustrated: '#712B13',
  tired: '#444441', calm: '#085041',
  confused: '#3C3489', overwhelmed: '#6B2D6B',
  stressed: '#7C2D12', neutral: '#444'
}

const moodBg = {
  happy: '#EAF3DE', excited: '#FAEEDA',
  anxious: '#FAEEDA', sad: '#E6F1FB',
  angry: '#FCEBEB', frustrated: '#FAECE7',
  tired: '#F1EFE8', calm: '#E1F5EE',
  confused: '#EEEDFE', overwhelmed: '#F5E8F5',
  stressed: '#FEF0E7', neutral: '#F5F5F5'
}

function getMoodStyle(mood) {
  const key = mood?.toLowerCase()
  return { bg: moodBg[key] || '#F5F5F5', color: moodColors[key] || '#444' }
}

export default function Chat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hey! I'm MoodLens 🧠 — just talk to me like a friend. I'll detect your mood and reflect it back to you.", mood: null }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentMood, setCurrentMood] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || loading) return

    const userMsg = { role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post('http://localhost:5000/api/mood/analyze', {
        message: input,
        userId: user?.uid
      })

      const { mood, emoji, intensity, signals, response } = res.data
      setCurrentMood({ mood, emoji, intensity })
      setMessages(prev => [...prev, { role: 'bot', text: response, mood, emoji, intensity, signals }])

    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Something went wrong. Please try again.', mood: null }])
    }

    setLoading(false)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const style = currentMood ? getMoodStyle(currentMood.mood) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 53px)', maxWidth: 700, margin: '0 auto', padding: '1rem' }}>

      {/* Mood badge */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '1rem', borderBottom: '1px solid #222', marginBottom: '1rem' }}>
        {currentMood && (
          <div style={{ padding: '6px 14px', borderRadius: 20, background: style.bg, color: style.color, fontSize: 13, fontWeight: 500 }}>
            {currentMood.emoji} {currentMood.mood} · {currentMood.intensity}
          </div>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%', padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
              background: msg.role === 'user' ? '#1a1a2e' : '#1a1a1a',
              border: '1px solid #2a2a2a', fontSize: 14, lineHeight: 1.6, color: '#f0f0f0'
            }}>
              {msg.text}
            </div>

            {msg.role === 'bot' && msg.mood && (() => {
              const s = getMoodStyle(msg.mood)
              return (
                <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '80%' }}>
                  <span style={{ padding: '3px 10px', borderRadius: 20, background: s.bg, color: s.color, fontSize: 12, fontWeight: 500 }}>
                    {msg.emoji} {msg.mood} · {msg.intensity} intensity
                  </span>
                  <p style={{ fontSize: 11, color: '#555', paddingLeft: 4 }}>💡 {msg.signals}</p>
                </div>
              )
            })()}
          </div>
        ))}

        {loading && (
          <div style={{ alignSelf: 'flex-start', padding: '10px 14px', background: '#1a1a1a', borderRadius: '14px 14px 14px 2px', border: '1px solid #2a2a2a', color: '#555', fontSize: 14 }}>
            analyzing your mood...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 8, marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #222' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="How are you feeling? Just talk..."
          rows={2}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 12, background: '#1a1a1a',
            border: '1px solid #2a2a2a', color: '#f0f0f0', fontSize: 14,
            resize: 'none', fontFamily: 'inherit', outline: 'none'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: '0 20px', borderRadius: 12,
            background: loading ? '#222' : '#6C63FF',
            color: '#fff', border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 14, fontWeight: 500
          }}
        >
          {loading ? '...' : 'Send →'}
        </button>
      </div>
    </div>
  )
}