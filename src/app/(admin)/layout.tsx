'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const menuItems = [
  { icon: '📊', label: 'Dashboard', path: '/dashboard' },
  { icon: '📋', label: 'Pesanan', path: '/orders' },
  { icon: '💌', label: 'Undangan', path: '/invitations' },
  { icon: '🎨', label: 'Template', path: '/templates' },
  { icon: '💳', label: 'Pembayaran', path: '/payments' },
  { icon: '📈', label: 'Laporan', path: '/reports' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleLogout = () => {
    document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/auth/login')
  }

  const navigate = (path: string) => {
    router.push(path)
    setMobileOpen(false)
  }

  const renderSidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.4rem' }}>💌</span>
          <span style={{ color: '#f5e6d0', fontWeight: 700, fontSize: '1.05rem', fontFamily: 'Georgia, serif' }}>UndanganKu</span>
        </div>
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '1.2rem', padding: '0.25rem' }}>✕</button>
        )}
      </div>
      <nav style={{ flex: 1, padding: '0.75rem 0' }}>
        {menuItems.map(item => {
          const active = pathname === item.path
          return (
            <button key={item.path} onClick={() => navigate(item.path)} style={{
              width: '100%', padding: '0.85rem 1.5rem',
              display: 'flex', alignItems: 'center', gap: '0.85rem',
              background: active ? 'rgba(201,169,110,0.15)' : 'none',
              border: 'none', borderLeft: active ? '3px solid #c9a96e' : '3px solid transparent',
              color: active ? '#c9a96e' : 'rgba(255,255,255,0.65)',
              cursor: 'pointer', fontSize: '0.92rem', fontFamily: 'Georgia, serif',
              textAlign: 'left',
            }}>
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontWeight: active ? 600 : 400 }}>{item.label}</span>
            </button>
          )
        })}
      </nav>
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#c9a96e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a0a00', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>A</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#f5e6d0', fontSize: '0.82rem', fontWeight: 600 }}>Admin</div>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#c9a96e', fontSize: '0.72rem', cursor: 'pointer', padding: 0, fontFamily: 'Georgia, serif' }}>Keluar →</button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f5f0', fontFamily: 'Georgia, serif' }}>

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div style={{
          width: '220px', minHeight: '100vh', flexShrink: 0,
          background: 'linear-gradient(180deg, #1a0a00 0%, #3d1f0a 100%)',
          position: 'fixed', top: 0, left: 0, zIndex: 100,
          boxShadow: '4px 0 20px rgba(0,0,0,0.15)'
        }}>
          {renderSidebarContent()}
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
          <div onClick={() => setMobileOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
          <div style={{ width: '260px', background: 'linear-gradient(180deg, #1a0a00 0%, #3d1f0a 100%)', position: 'relative', zIndex: 1, boxShadow: '4px 0 20px rgba(0,0,0,0.3)' }}>
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* Main content */}
      <main style={{
        flex: 1,
        minHeight: '100vh',
        marginLeft: isMobile ? 0 : '220px',
        width: isMobile ? '100%' : 'calc(100% - 220px)',
        maxWidth: isMobile ? '100vw' : 'calc(100% - 220px)',
        overflowX: 'hidden',
      }}>
        {/* Top bar */}
        <div style={{
          background: '#fff', borderBottom: '1px solid #ede5d8',
          padding: '0.875rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            {isMobile && (
              <button onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: '#7c5c3e', padding: '0.25rem', flexShrink: 0 }}>☰</button>
            )}
            <div style={{ minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {menuItems.find(m => m.path === pathname)?.label || 'Admin'}
              </h2>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#aaa' }}>
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <button style={{ background: '#fdf6ee', border: '1px solid #ede5d8', borderRadius: '999px', padding: '0.45rem 0.9rem', cursor: 'pointer', fontSize: '0.8rem', color: '#7c5c3e', fontFamily: 'Georgia, serif', flexShrink: 0 }}>🔔</button>
        </div>

        {/* Page content */}
        <div style={{ padding: isMobile ? '1rem' : '1.5rem 1.25rem', overflowX: 'hidden' }}>
          {children}
        </div>
      </main>
    </div>
  )
}