'use client'

import { useRouter } from 'next/navigation'


const stats = [
  { icon: '📋', label: 'Total Pesanan', value: '128', change: '+12 bulan ini', color: '#7c5c3e', bg: '#fdf6ee' },
  { icon: '💳', label: 'Pendapatan', value: 'Rp 18,4 jt', change: '+Rp 3,2 jt bulan ini', color: '#2d6a4f', bg: '#f0faf4' },
  { icon: '💌', label: 'Undangan Aktif', value: '54', change: '6 baru minggu ini', color: '#1a4f8a', bg: '#f0f4ff' },
  { icon: '✅', label: 'RSVP Masuk', value: '1.240', change: '+89 hari ini', color: '#7b2d8b', bg: '#faf0ff' },
]

const recentOrders = [
  { id: 'ORD-001', name: 'Andi & Bela', package: 'Premium', date: '10 Okt 2026', status: 'DONE', amount: 'Rp 199.000' },
  { id: 'ORD-002', name: 'Citra & Danu', package: 'Elite', date: '15 Okt 2026', status: 'IN_PROGRESS', amount: 'Rp 349.000' },
  { id: 'ORD-003', name: 'Eka & Fajar', package: 'Basic', date: '20 Okt 2026', status: 'CONFIRMED', amount: 'Rp 99.000' },
  { id: 'ORD-004', name: 'Gita & Hendra', package: 'Premium', date: '22 Okt 2026', status: 'PENDING', amount: 'Rp 199.000' },
  { id: 'ORD-005', name: 'Indah & Joko', package: 'Elite', date: '25 Okt 2026', status: 'PENDING', amount: 'Rp 349.000' },
]

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Menunggu', color: '#b45309', bg: '#fffbeb' },
  CONFIRMED: { label: 'Dikonfirmasi', color: '#1a4f8a', bg: '#eff6ff' },
  IN_PROGRESS: { label: 'Dikerjakan', color: '#7b2d8b', bg: '#faf0ff' },
  DONE: { label: 'Selesai', color: '#2d6a4f', bg: '#f0faf4' },
  CANCELLED: { label: 'Batal', color: '#991b1b', bg: '#fff5f5' },
}

const recentRsvp = [
  { name: 'Siti Rahma', invitation: 'Andi & Bela', attending: true, count: 2, time: '10 menit lalu' },
  { name: 'Budi Setiawan', invitation: 'Andi & Bela', attending: true, count: 3, time: '25 menit lalu' },
  { name: 'Maya Putri', invitation: 'Citra & Danu', attending: false, count: 0, time: '1 jam lalu' },
  { name: 'Riko Saputra', invitation: 'Andi & Bela', attending: true, count: 1, time: '2 jam lalu' },
]

export default function DashboardPage() {
  const router = useRouter()

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', fontWeight: 700, margin: 0, color: '#1a1a1a' }}>
          Selamat Datang 👋
        </h1>
        <p style={{ color: '#888', marginTop: '0.25rem', fontSize: '0.875rem' }}>
          Ringkasan bisnis UndanganKu hari ini
        </p>
      </div>

      {/* Stats Grid - 2x2 on mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#96a041ff', borderRadius: '14px', padding: '1rem', border: '1px solid #ede5d8' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', marginBottom: '0.6rem' }}>
              {s.icon}
            </div>
            <div style={{ fontSize: 'clamp(1.1rem, 3vw, 1.6rem)', fontWeight: 700, color: '#1a1a1a', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '0.25rem' }}>{s.label}</div>
            <div style={{ fontSize: '0.68rem', color: s.color, fontWeight: 600, marginTop: '0.25rem' }}>↑ {s.change}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #ede5d8', padding: '1rem', marginBottom: '1.25rem' }}>
        <h3 style={{ margin: '0 0 0.875rem', fontSize: '0.95rem', fontWeight: 700 }}>Aksi Cepat</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          {[
            { icon: '➕', label: 'Buat Undangan', path: '/invitations', color: '#7c5c3e', bg: '#fdf6ee' },
            { icon: '📋', label: 'Pesanan Baru', path: '/orders', color: '#1a4f8a', bg: '#eff6ff' },
            { icon: '💳', label: 'Konfirmasi Bayar', path: '/payments', color: '#2d6a4f', bg: '#f0faf4' },
            { icon: '📈', label: 'Lihat Laporan', path: '/reports', color: '#7b2d8b', bg: '#faf0ff' },
          ].map(a => (
            <button key={a.label} onClick={() => router.push(a.path)} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.7rem', background: a.bg, border: 'none',
              borderRadius: '10px', cursor: 'pointer', textAlign: 'left', width: '100%',
              fontFamily: 'Georgia, serif',
            }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{a.icon}</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: a.color, lineHeight: 1.3 }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Orders - card on mobile, table on desktop */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #ede5d8', overflow: 'hidden', marginBottom: '1.25rem' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #ede5d8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Pesanan Terbaru</h3>
          <button onClick={() => router.push('/orders')} style={{ background: '#fdf6ee', border: '1px solid #ede5d8', borderRadius: '8px', padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.75rem', color: '#7c5c3e', fontFamily: 'Georgia, serif' }}>
            Lihat Semua →
          </button>
        </div>

        {/* Mobile cards */}
        <div className="mobile-orders">
          {recentOrders.map(order => {
            const s = statusConfig[order.status]
            return (
              <div key={order.id} style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #f5f0eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{order.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#aaa', marginTop: '0.15rem' }}>{order.package} · {order.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ background: s.bg, color: s.color, padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 600 }}>{s.label}</span>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', marginTop: '0.25rem' }}>{order.amount}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop table */}
        <div className="desktop-orders" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#fdfaf6' }}>
                {['ID', 'Nama', 'Paket', 'Tgl Acara', 'Status', 'Total'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => {
                const s = statusConfig[order.status]
                return (
                  <tr key={order.id} style={{ borderTop: '1px solid #f5f0eb' }}>
                    <td style={{ padding: '1rem', color: '#7c5c3e', fontWeight: 600 }}>{order.id}</td>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{order.name}</td>
                    <td style={{ padding: '1rem', color: '#666' }}>{order.package}</td>
                    <td style={{ padding: '1rem', color: '#666', whiteSpace: 'nowrap' }}>{order.date}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ background: s.bg, color: s.color, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{s.label}</span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{order.amount}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RSVP Terbaru */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #ede5d8', padding: '1rem', marginBottom: '1.25rem' }}>
        <h3 style={{ margin: '0 0 0.875rem', fontSize: '0.95rem', fontWeight: 700 }}>RSVP Terbaru</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {recentRsvp.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: i < recentRsvp.length - 1 ? '1px solid #f5f0eb' : 'none' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, background: r.attending ? '#f0faf4' : '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                {r.attending ? '✅' : '❌'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                <div style={{ fontSize: '0.72rem', color: '#aaa' }}>{r.invitation} · {r.time}</div>
              </div>
              {r.attending && (
                <span style={{ fontSize: '0.72rem', color: '#2d6a4f', fontWeight: 600, background: '#f0faf4', padding: '0.15rem 0.5rem', borderRadius: '6px', flexShrink: 0 }}>
                  {r.count} org
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Paket terlaris */}
      <div style={{ background: 'linear-gradient(135deg, #1a0a00 0%, #3d1f0a 100%)', borderRadius: '14px', padding: '1.25rem', color: '#f5e6d0' }}>
        <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 700 }}>Paket Terlaris</h3>
        {[
          { name: 'Premium', pct: 65, count: 83 },
          { name: 'Elite', pct: 25, count: 32 },
          { name: 'Basic', pct: 10, count: 13 },
        ].map(p => (
          <div key={p.name} style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
              <span style={{ color: '#c9a96e', fontWeight: 600 }}>{p.name}</span>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>{p.count} pesanan</span>
            </div>
            <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${p.pct}%`, height: '100%', background: '#c9a96e', borderRadius: '999px' }} />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .mobile-orders { display: none; }
        .desktop-orders { display: block; }
        @media (max-width: 640px) {
          .mobile-orders { display: block; }
          .desktop-orders { display: none; }
        }
      `}</style>
    </div>
  )
}