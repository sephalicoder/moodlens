import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import Chat from './components/Chat'
import Auth from './components/Auth'
import History from './components/History'
import Dashboard from './components/Dashboard'

function App() {
  const { user, logout } = useAuth()
  const [page, setPage] = useState('chat')

  if (!user) return <Auth />

  const navBtn = (label, target) => (
    <button onClick={() => setPage(target)} style={{
      padding: '6px 16px', borderRadius: 20, border: 'none',
      cursor: 'pointer', fontSize: 13,
      background: page === target ? '#6C63FF' : 'transparent',
      color: page === target ? '#fff' : '#666'
    }}>{label}</button>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f' }}>
      {/* Navbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px', borderBottom: '1px solid #1a1a1a',
        background: '#0f0f0f', position: 'sticky', top: 0, zIndex: 10
      }}>
        <span style={{ fontWeight: 700, color: '#fff', fontSize: 16 }}>🧠 MoodLens</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {navBtn('💬 Chat', 'chat')}
          {navBtn('📅 History', 'history')}
          {navBtn('📊 Dashboard', 'dashboard')}
          <button onClick={logout} style={{
            padding: '6px 16px', borderRadius: 20, border: '1px solid #333',
            background: 'transparent', color: '#666', cursor: 'pointer', fontSize: 13
          }}>Sign out</button>
        </div>
      </div>

      {/* Pages */}
      {page === 'chat' && <Chat />}
      {page === 'history' && <History />}
      {page === 'dashboard' && <Dashboard />}
    </div>
  )
}

export default App