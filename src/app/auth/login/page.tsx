'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const LOGIN_BG_IMAGE = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulasi login - nanti diganti dengan API call ke Supabase
    await new Promise(r => setTimeout(r, 1000))

    if (email === 'admin@undanganku.com' && password === 'admin123') {
      // Set cookie dummy - nanti diganti dengan session Supabase
      document.cookie = 'admin-token=dummy-token; path=/'
      router.push('/dashboard')
    } else {
      setError('Email atau password salah')
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Georgia', serif",
      background: '#fdfaf6',
    }}>

      {/* LEFT - Decorative Background Image */}
      <div style={{
        flex: 1, display: 'none',
        background: `linear-gradient(rgba(26, 10, 0, 0.75), rgba(26, 10, 0, 0.85)), url('${LOGIN_BG_IMAGE}') center/cover no-repeat`,
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: '3rem', color: '#f5e6d0', position: 'relative', overflow: 'hidden'
      }} className="left-panel">
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', border: '1px solid rgba(255,220,150,0.15)' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', border: '1px solid rgba(255,220,150,0.1)' }} />

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💌</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2 }}>
            UndanganKu
          </h1>
          <p style={{ color: '#c9a96e', fontSize: '1rem', lineHeight: 1.7, maxWidth: '300px' }}>
            Platform undangan digital elegan untuk momen spesial yang tak terlupakan
          </p>
          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['500+ Undangan dibuat', '98% Pelanggan puas', 'Pengerjaan < 24 jam'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                <span style={{ color: '#c9a96e' }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT - Login Form */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', padding: '2rem'
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💌</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.25rem' }}>
              UndanganKu
            </h1>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>Admin Dashboard</p>
          </div>

          {/* Card */}
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '2.5rem',
            border: '1px solid #ede5d8', boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1a1a1a' }}>
              Selamat Datang 👋
            </h2>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Masuk ke panel admin UndanganKu
            </p>

            {error && (
              <div style={{
                background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '10px',
                padding: '0.8rem 1rem', marginBottom: '1.5rem',
                color: '#c53030', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#444' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@undanganku.com"
                  required
                  style={{
                    width: '100%', padding: '0.85rem 1rem', borderRadius: '10px',
                    border: '1.5px solid #e2d9ce', fontSize: '0.95rem',
                    fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none',
                    transition: 'border-color 0.2s', background: '#fdfaf6'
                  }}
                  onFocus={e => e.target.style.borderColor = '#7c5c3e'}
                  onBlur={e => e.target.style.borderColor = '#e2d9ce'}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#444' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      width: '100%', padding: '0.85rem 3rem 0.85rem 1rem', borderRadius: '10px',
                      border: '1.5px solid #e2d9ce', fontSize: '0.95rem',
                      fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none',
                      transition: 'border-color 0.2s', background: '#fdfaf6'
                    }}
                    onFocus={e => e.target.style.borderColor = '#7c5c3e'}
                    onBlur={e => e.target.style.borderColor = '#e2d9ce'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#aaa'
                    }}
                  >{showPass ? '🙈' : '👁️'}</button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '0.9rem', background: loading ? '#b08060' : '#7c5c3e',
                  color: '#fff', border: 'none', borderRadius: '10px',
                  fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', transition: 'background 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                }}
              >
                {loading ? (
                  <>
                    <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Masuk...
                  </>
                ) : 'Masuk ke Dashboard'}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setEmail('admin@undanganku.com')
                setPassword('admin123')
              }}
              style={{
                width: '100%', marginTop: '1.5rem', padding: '0.85rem 1rem',
                background: '#fdf6ee', border: '1px solid #ede5d8', borderRadius: '10px',
                fontSize: '0.82rem', color: '#7c5c3e', textAlign: 'center', cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f7ebdc'}
              onMouseLeave={e => e.currentTarget.style.background = '#fdf6ee'}
            >
              💡 <strong>Klik di sini</strong> untuk isi otomatis kredensial Demo<br />
              <span style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem', display: 'block' }}>
                (admin@undanganku.com / admin123)
              </span>
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#aaa' }}>
            © 2026 UndanganKu
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 768px) {
          .left-panel { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
