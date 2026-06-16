import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const moodScore = {
  happy: 9, excited: 8, calm: 7, hopeful: 7,
  neutral: 5, confused: 4, anxious: 3, tired: 3,
  sad: 2, frustrated: 2, angry: 1, overwhelmed: 1, stressed: 1
}

const moodBgMap = {
  happy: '#EAF3DE', excited: '#FAEEDA', anxious: '#FAEEDA',
  sad: '#E6F1FB', angry: '#FCEBEB', frustrated: '#FAECE7',
  tired: '#F1EFE8', calm: '#E1F5EE', confused: '#EEEDFE',
  overwhelmed: '#F5E8F5', stressed: '#FEF0E7', neutral: '#F5F5F5'
}

const moodColorMap = {
  happy: '#3B6D11', excited: '#854F0B', anxious: '#633806',
  sad: '#0C447C', angry: '#791F1F', frustrated: '#712B13',
  tired: '#444441', calm: '#085041', confused: '#3C3489',
  overwhelmed: '#6B2D6B', stressed: '#7C2D12', neutral: '#444'
}

const PIE_COLORS = ['#6C63FF', '#FF6584', '#43C6AC', '#F7971E', '#a18cd1', '#fda085', '#84fab0', '#f6d365']

// ✅ Moved OUTSIDE the component to fix ESLint error
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#111', border: '1px solid #333', borderRadius: 8, padding: '8px 12px' }}>
        <p style={{ color: '#fff', fontSize: 13 }}>{payload[0].payload.mood}</p>
        <p style={{ color: '#6C63FF', fontSize: 12 }}>score: {payload[0].value}/10</p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`https://moodlens-backend-63tz.onrender.com/api/mood/history/${user.uid}`)
        setEntries(res.data)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    fetchData()
  }, [user])

  if (loading) return <p style={{ color: '#555', padding: '2rem' }}>Loading dashboard...</p>

  if (entries.length === 0) return (
    <div style={{ textAlign: 'center', color: '#444', marginTop: 80 }}>
      <p style={{ fontSize: 32 }}>📊</p>
      <p style={{ marginTop: 8 }}>No data yet — chat first to see your trends!</p>
    </div>
  )

  // Mood over time (last 10 entries)
  const lineData = [...entries].reverse().slice(-10).map((e, i) => ({
    name: `#${i + 1}`,
    score: moodScore[e.mood?.toLowerCase()] || 5,
    mood: e.mood
  }))

  // Mood frequency for pie chart
  const freqMap = {}
  entries.forEach(e => {
    const m = e.mood?.toLowerCase() || 'neutral'
    freqMap[m] = (freqMap[m] || 0) + 1
  })
  const pieData = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }))

  // Most common mood this week ✅ Fixed Date.now() issue
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const weekEntries = entries.filter(e => new Date(e.createdAt) > oneWeekAgo)
  const weekFreq = {}
  weekEntries.forEach(e => {
    const m = e.mood?.toLowerCase() || 'neutral'
    weekFreq[m] = (weekFreq[m] || 0) + 1
  })
  const topMoodThisWeek = Object.entries(weekFreq).sort((a, b) => b[1] - a[1])[0]

  // Average mood score
  const avgScore = (
    entries.reduce((sum, e) => sum + (moodScore[e.mood?.toLowerCase()] || 5), 0) / entries.length
  ).toFixed(1)

  const cardStyle = {
    background: '#1a1a1a', border: '1px solid #2a2a2a',
    borderRadius: 14, padding: '1.2rem 1.4rem'
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '1.5rem 1rem' }}>
      <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>📊 Your Mood Dashboard</h2>
      <p style={{ color: '#555', fontSize: 13, marginBottom: 24 }}>Insights based on {entries.length} entries</p>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div style={cardStyle}>
          <p style={{ color: '#555', fontSize: 11, marginBottom: 6 }}>TOTAL ENTRIES</p>
          <p style={{ color: '#fff', fontSize: 28, fontWeight: 700 }}>{entries.length}</p>
        </div>
        <div style={cardStyle}>
          <p style={{ color: '#555', fontSize: 11, marginBottom: 6 }}>AVG MOOD SCORE</p>
          <p style={{ color: '#6C63FF', fontSize: 28, fontWeight: 700 }}>
            {avgScore}<span style={{ fontSize: 13, color: '#444' }}>/10</span>
          </p>
        </div>
        <div style={cardStyle}>
          <p style={{ color: '#555', fontSize: 11, marginBottom: 6 }}>TOP MOOD THIS WEEK</p>
          {topMoodThisWeek ? (
            <div style={{
              display: 'inline-block', marginTop: 4, padding: '4px 10px',
              borderRadius: 20, fontSize: 13, fontWeight: 600,
              background: moodBgMap[topMoodThisWeek[0]] || '#f5f5f5',
              color: moodColorMap[topMoodThisWeek[0]] || '#444'
            }}>
              {topMoodThisWeek[0]} ({topMoodThisWeek[1]}x)
            </div>
          ) : <p style={{ color: '#444', fontSize: 13 }}>No data</p>}
        </div>
      </div>

      {/* Line chart */}
      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <p style={{ color: '#aaa', fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
          Mood score over time (last 10 entries)
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lineData}>
            <XAxis dataKey="name" stroke="#333" tick={{ fill: '#555', fontSize: 11 }} />
            <YAxis domain={[0, 10]} stroke="#333" tick={{ fill: '#555', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone" dataKey="score" stroke="#6C63FF"
              strokeWidth={2} dot={{ fill: '#6C63FF', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie chart */}
      <div style={cardStyle}>
        <p style={{ color: '#aaa', fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
          Mood frequency breakdown
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieData} cx="50%" cy="50%"
              outerRadius={80} dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Legend
              formatter={(value) => <span style={{ color: '#aaa', fontSize: 12 }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}