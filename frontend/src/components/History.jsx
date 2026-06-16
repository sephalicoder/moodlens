import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

function getMoodColor(mood) {
  const colors = {
    happy: { bg: '#EAF3DE', color: '#3B6D11' },
    excited: { bg: '#FAEEDA', color: '#854F0B' },
    anxious: { bg: '#FAEEDA', color: '#633806' },
    sad: { bg: '#E6F1FB', color: '#0C447C' },
    angry: { bg: '#FCEBEB', color: '#791F1F' },
    frustrated: { bg: '#FAECE7', color: '#712B13' },
    tired: { bg: '#F1EFE8', color: '#444441' },
    calm: { bg: '#E1F5EE', color: '#085041' },
    confused: { bg: '#EEEDFE', color: '#3C3489' },
    overwhelmed: { bg: '#F5E8F5', color: '#6B2D6B' },
    stressed: { bg: '#FEF0E7', color: '#7C2D12' },
  }
  return colors[mood?.toLowerCase()] || { bg: '#F5F5F5', color: '#444' }
}

export default function History() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await axios.get(`http://localhost:5000/api/mood/history/${user.uid}`)
        setEntries(res.data)
      } catch (err) {
        console.error('Failed to fetch history', err)
      }
      setLoading(false)
    }
    fetchHistory()
  }, [user])

  function formatDate(dateStr) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '1.5rem 1rem' }}>
      <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>📅 Mood History</h2>
      <p style={{ color: '#555', fontSize: 13, marginBottom: 24 }}>Your last 50 mood entries</p>

      {loading && <p style={{ color: '#555' }}>Loading...</p>}

      {!loading && entries.length === 0 && (
        <div style={{ textAlign: 'center', color: '#444', marginTop: 60 }}>
          <p style={{ fontSize: 32 }}>🧠</p>
          <p style={{ marginTop: 8 }}>No entries yet — go chat to get started!</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {entries.map((entry) => {
          const style = getMoodColor(entry.mood)
          return (
            <div key={entry._id} style={{
              background: '#1a1a1a', border: '1px solid #2a2a2a',
              borderRadius: 12, padding: '14px 16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{
                  padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                  background: style.bg, color: style.color
                }}>
                  {entry.emoji} {entry.mood} · {entry.intensity}
                </span>
                <span style={{ fontSize: 11, color: '#444' }}>{formatDate(entry.createdAt)}</span>
              </div>
              <p style={{ fontSize: 13, color: '#aaa', marginBottom: 6 }}>"{entry.message}"</p>
              <p style={{ fontSize: 11, color: '#555' }}>💡 {entry.signals}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}