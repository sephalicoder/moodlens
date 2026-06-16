import { useState } from 'react'
import { auth } from '../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!email || !password) return
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''))
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    background: '#1a1a1a', border: '1px solid #2a2a2a',
    color: '#f0f0f0', fontSize: 14, fontFamily: 'inherit', outline: 'none'
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f0f0f' }}>
      <div style={{ width: 360, padding: '2rem', background: '#1a1a1a', borderRadius: 16, border: '1px solid #2a2a2a' }}>

        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 6 }}>🧠 MoodLens</h1>
        <p style={{ fontSize: 13, color: '#666', marginBottom: 24 }}>
          {isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={inputStyle}
          />

          {error && (
            <p style={{ fontSize: 12, color: '#f87171', padding: '8px 12px', background: '#2a1a1a', borderRadius: 8 }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: '11px', borderRadius: 10, background: '#6C63FF',
              color: '#fff', border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 500, marginTop: 4
            }}
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>

          <p style={{ fontSize: 13, color: '#666', textAlign: 'center' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span
              onClick={() => { setIsLogin(!isLogin); setError('') }}
              style={{ color: '#6C63FF', cursor: 'pointer' }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}