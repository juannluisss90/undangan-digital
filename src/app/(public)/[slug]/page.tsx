'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now()
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [targetDate])
  return timeLeft
}

interface GalleryItem {
  url: string
}

interface WishItem {
  id?: string
  name: string
  message: string
  createdAt: string | Date
}

interface InvitationData {
  id?: string
  slug?: string
  brideName?: string
  groomName?: string
  eventDate?: string | Date
  akadTime?: string
  akadVenue?: string
  resepsiTime?: string
  resepsiVenue?: string
  mapsUrl?: string
  musicUrl?: string
  bankName?: string
  bankAccount?: string
  bankHolder?: string
  Gallery?: GalleryItem[]
  Template?: { name?: string }
}

export default function InvitationPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [inv, setInv] = useState<InvitationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [opened, setOpened] = useState(false)
  const [activeTab, setActiveTab] = useState<'akad' | 'resepsi'>('akad')
  const [rsvpName, setRsvpName] = useState('')
  const [rsvpAttend, setRsvpAttend] = useState<boolean | null>(null)
  const [rsvpCount, setRsvpCount] = useState(1)
  const [rsvpSent, setRsvpSent] = useState(false)
  const [wish, setWish] = useState('')
  const [wishName, setWishName] = useState('')
  const [wishes, setWishes] = useState<WishItem[]>([])


  useEffect(() => {
    if (!slug) return
    fetch(`/api/invitations?slug=${slug}`)
      .then(r => r.json())
      .then(j => {
        if (j.data) {
          setInv(j.data)
          setWishes(j.data.Wish || [])
        } else {
          setNotFound(true)
        }
        setLoading(false)
      })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [slug])

  const countdown = useCountdown(inv?.eventDate ? new Date(inv.eventDate) : new Date())

  const formatDate = (d?: string | Date) => d ? new Date(d).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }) : ''

  const handleRsvp = async () => {
    if (!inv || !rsvpName || rsvpAttend === null) return
    await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invitationId: inv.id, guestName: rsvpName, attending: rsvpAttend, guestCount: rsvpCount })
    })
    setRsvpSent(true)
  }

  const handleWish = async () => {
    if (!inv || !wish.trim() || !wishName.trim()) return
    await fetch('/api/wishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invitationId: inv.id, name: wishName, message: wish })
    })
    setWishes(prev => [{ name: wishName, message: wish, createdAt: new Date().toISOString() }, ...prev])
    setWish('')
    setWishName('')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a0a00', color: '#c9a96e', fontFamily: 'Georgia, serif', fontSize: '1.1rem' }}>
      Memuat undangan...
    </div>
  )

  if (notFound || !inv) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fdfaf6', fontFamily: 'Georgia, serif', textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💌</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Undangan Tidak Ditemukan</h1>
      <p style={{ color: '#888' }}>Link undangan tidak valid atau sudah tidak aktif.</p>
    </div>
  )

  if (!opened) return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', textAlign: 'center',
      background: 'linear-gradient(160deg, #1a0a00 0%, #3d1f0a 50%, #1a0a00 100%)',
      color: '#f5e6d0', fontFamily: 'Georgia, serif', padding: '2rem',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', border: '1px solid rgba(255,220,150,0.15)' }} />
      <div style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '400px', height: '400px', borderRadius: '50%', border: '1px solid rgba(255,220,150,0.1)' }} />
      <p style={{ fontSize: '0.75rem', letterSpacing: '0.3em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Undangan Pernikahan</p>
      <h1 style={{ fontSize: 'clamp(1.8rem, 7vw, 3.5rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '0.5rem' }}>{inv.groomName}</h1>
      <div style={{ fontSize: '1.5rem', color: '#c9a96e', margin: '0.5rem 0' }}>&</div>
      <h1 style={{ fontSize: 'clamp(1.8rem, 7vw, 3.5rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '2rem' }}>{inv.brideName}</h1>
      <p style={{ fontSize: '0.9rem', color: '#c9a96e', marginBottom: '0.5rem' }}>Kepada Yth.</p>
      <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '2.5rem', color: '#fff' }}>Tamu Undangan</p>
      <button onClick={() => setOpened(true)} style={{
        background: 'transparent', border: '1.5px solid #c9a96e',
        color: '#c9a96e', padding: '0.85rem 2rem', borderRadius: '999px',
        fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'Georgia, serif'
      }}>💌 Buka Undangan</button>
      <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', marginTop: '3rem' }}>{formatDate(inv.eventDate)}</p>
    </div>
  )

  return (
    <div style={{ fontFamily: 'Georgia, serif', background: '#fdfaf6', color: '#1a1a1a', overflowX: 'hidden' }}>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        background: 'linear-gradient(160deg, #1a0a00 0%, #3d1f0a 50%, #1a0a00 100%)',
        color: '#f5e6d0', padding: '4rem 1.5rem', position: 'relative', overflow: 'hidden'
      }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.3em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: '2rem' }}>We Are Getting Married</p>
        <h1 style={{ fontSize: 'clamp(2rem, 8vw, 4.5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1rem' }}>{inv.groomName}</h1>
        <div style={{ fontSize: '2rem', color: '#c9a96e', margin: '0.25rem 0', fontStyle: 'italic' }}>&</div>
        <h1 style={{ fontSize: 'clamp(2rem, 8vw, 4.5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '2rem' }}>{inv.brideName}</h1>
        <div style={{ width: '50px', height: '1px', background: '#c9a96e', margin: '1rem auto' }} />
        <p style={{ fontSize: '0.95rem', color: '#c9a96e', letterSpacing: '0.05em' }}>{formatDate(inv.eventDate)}</p>
        <div style={{ position: 'absolute', bottom: '2rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>scroll ↓</div>
      </section>

      {/* COUNTDOWN */}
      <section style={{ padding: '3.5rem 1.5rem', background: '#fff', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#b08060', textTransform: 'uppercase', marginBottom: '1.75rem' }}>Menuju Hari Bahagia</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            [countdown.days, 'Hari'], [countdown.hours, 'Jam'],
            [countdown.minutes, 'Menit'], [countdown.seconds, 'Detik'],
          ].map(([val, label]) => (
            <div key={String(label)} style={{ textAlign: 'center' }}>
              <div style={{ width: 'clamp(64px, 16vw, 80px)', height: 'clamp(64px, 16vw, 80px)', borderRadius: '12px', background: '#7c5c3e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(1.4rem, 5vw, 2rem)', fontWeight: 700, margin: '0 auto 0.4rem' }}>
                {String(val).padStart(2, '0')}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DETAIL ACARA */}
      <section style={{ padding: '3.5rem 1.5rem', maxWidth: '680px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', letterSpacing: '0.2em', color: '#b08060', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Rangkaian Acara</p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 700, marginBottom: '1.75rem' }}>Jadwal Acara</h2>
        <div style={{ display: 'flex', borderBottom: '2px solid #ede5d8', marginBottom: '2rem' }}>
          {(['akad', 'resepsi'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: '0.75rem', background: 'none', border: 'none',
              borderBottom: activeTab === tab ? '2px solid #7c5c3e' : '2px solid transparent',
              marginBottom: '-2px', cursor: 'pointer', fontWeight: activeTab === tab ? 700 : 400,
              color: activeTab === tab ? '#7c5c3e' : '#888', fontSize: '0.9rem',
              fontFamily: 'Georgia, serif', textTransform: 'capitalize'
            }}>{tab === 'akad' ? 'Akad Nikah' : 'Resepsi'}</button>
          ))}
        </div>
        {activeTab === 'akad' ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🕌</div>
            <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}>Akad Nikah</h3>
            <p style={{ color: '#7c5c3e', fontWeight: 600, marginBottom: '0.5rem' }}>{inv.akadTime || '-'}</p>
            <p style={{ color: '#666', lineHeight: 1.7, fontSize: '0.9rem' }}>{inv.akadVenue || '-'}</p>
            {inv.mapsUrl && <a href={inv.mapsUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '1.5rem', padding: '0.65rem 1.5rem', background: '#7c5c3e', color: '#fff', borderRadius: '999px', textDecoration: 'none', fontSize: '0.875rem' }}>🗺️ Buka Maps</a>}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎊</div>
            <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}>Resepsi Pernikahan</h3>
            <p style={{ color: '#7c5c3e', fontWeight: 600, marginBottom: '0.5rem' }}>{inv.resepsiTime || '-'}</p>
            <p style={{ color: '#666', lineHeight: 1.7, fontSize: '0.9rem' }}>{inv.resepsiVenue || '-'}</p>
            {inv.mapsUrl && <a href={inv.mapsUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '1.5rem', padding: '0.65rem 1.5rem', background: '#7c5c3e', color: '#fff', borderRadius: '999px', textDecoration: 'none', fontSize: '0.875rem' }}>🗺️ Buka Maps</a>}
          </div>
        )}
      </section>

      {/* GALERI */}
      {inv.Gallery && inv.Gallery.length > 0 && (
        <section style={{ padding: '3.5rem 1.5rem', background: '#fdf6ee' }}>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', letterSpacing: '0.2em', color: '#b08060', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Momen Kami</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 700, marginBottom: '1.75rem' }}>Galeri Foto</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.6rem', maxWidth: '900px', margin: '0 auto' }}>
            {inv.Gallery.map((g: GalleryItem, i: number) => (
              <div key={i} style={{ aspectRatio: '1', borderRadius: '10px', overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.url} alt={`Foto ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RSVP */}
      <section style={{ padding: '3.5rem 1.5rem', maxWidth: '580px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', letterSpacing: '0.2em', color: '#b08060', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Konfirmasi Kehadiran</p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 700, marginBottom: '1.75rem' }}>RSVP</h2>
        {rsvpSent ? (
          <div style={{ background: '#f0faf4', borderRadius: '16px', padding: '2rem', textAlign: 'center', border: '1px solid #c6e6d8' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Terima Kasih!</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Konfirmasi kehadiran kamu sudah kami terima.</p>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #ede5d8' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: '#555' }}>Nama Lengkap</label>
              <input value={rsvpName} onChange={e => setRsvpName(e.target.value)} placeholder="Masukkan nama kamu"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #ddd', fontSize: '0.9rem', fontFamily: 'Georgia, serif', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: '#555' }}>Konfirmasi Kehadiran</label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {[{ val: true, label: '✅ Hadir' }, { val: false, label: '❌ Tidak Hadir' }].map(({ val, label }) => (
                  <button key={label} onClick={() => setRsvpAttend(val)} style={{
                    flex: 1, padding: '0.75rem', borderRadius: '10px', cursor: 'pointer',
                    border: rsvpAttend === val ? '2px solid #7c5c3e' : '1px solid #ddd',
                    background: rsvpAttend === val ? '#fdf6ee' : '#fff',
                    color: rsvpAttend === val ? '#7c5c3e' : '#555',
                    fontWeight: rsvpAttend === val ? 700 : 400, fontSize: '0.875rem', fontFamily: 'Georgia, serif'
                  }}>{label}</button>
                ))}
              </div>
            </div>
            {rsvpAttend && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: '#555' }}>Jumlah Tamu</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button onClick={() => setRsvpCount(Math.max(1, rsvpCount - 1))} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>−</button>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, minWidth: '2rem', textAlign: 'center' }}>{rsvpCount}</span>
                  <button onClick={() => setRsvpCount(Math.min(10, rsvpCount + 1))} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
                </div>
              </div>
            )}
            <button onClick={handleRsvp} style={{ width: '100%', padding: '0.85rem', background: '#7c5c3e', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Georgia, serif' }}>
              Kirim Konfirmasi
            </button>
          </div>
        )}
      </section>

      {/* UCAPAN */}
      <section style={{ padding: '3.5rem 1.5rem', background: '#fdf6ee' }}>
        <div style={{ maxWidth: '580px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', letterSpacing: '0.2em', color: '#b08060', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Doa & Harapan</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 700, marginBottom: '1.75rem' }}>Ucapan Selamat</h2>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #ede5d8', marginBottom: '1.25rem' }}>
            <input value={wishName} onChange={e => setWishName(e.target.value)} placeholder="Nama kamu"
              style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '0.75rem', fontSize: '0.875rem', fontFamily: 'Georgia, serif', boxSizing: 'border-box', outline: 'none' }} />
            <textarea value={wish} onChange={e => setWish(e.target.value)} placeholder="Tulis doa dan ucapan selamat..." rows={3}
              style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.875rem', fontFamily: 'Georgia, serif', resize: 'none', boxSizing: 'border-box', outline: 'none' }} />
            <button onClick={handleWish} style={{ marginTop: '0.75rem', padding: '0.65rem 1.25rem', background: '#7c5c3e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'Georgia, serif' }}>
              Kirim Ucapan 💌
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {wishes.map((w: WishItem, i: number) => (
              <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '1.1rem', border: '1px solid #ede5d8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{w.name}</span>
                  <span style={{ fontSize: '0.72rem', color: '#aaa' }}>
                    {new Date(w.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#555', lineHeight: 1.6, margin: 0 }}>{w.message}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AMPLOP DIGITAL */}
      {inv.bankName && (
        <section style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#b08060', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Hadiah</p>
            <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 700, marginBottom: '1rem' }}>Amplop Digital</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.7 }}>Bagi yang ingin memberikan hadiah, kami menyediakan rekening berikut</p>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #ede5d8', display: 'inline-block', minWidth: '260px', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏦</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem' }}>{inv.bankName}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#7c5c3e', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>{inv.bankAccount}</div>
              <div style={{ color: '#888', fontSize: '0.875rem' }}>a.n. {inv.bankHolder}</div>
              <button onClick={() => {
                const text = inv.bankAccount || ''
                if (navigator.clipboard && window.isSecureContext) {
                  navigator.clipboard.writeText(text).then(() => alert('Nomor rekening berhasil disalin!'))
                } else {
                  const el = document.createElement('textarea')
                  el.value = text
                  el.style.position = 'fixed'
                  el.style.opacity = '0'
                  document.body.appendChild(el)
                  el.focus()
                  el.select()
                  document.execCommand('copy')
                  document.body.removeChild(el)
                  alert('Nomor rekening berhasil disalin!')
                }
              }} style={{ marginTop: '1rem', padding: '0.5rem 1.2rem', background: '#f5ede3', color: '#7c5c3e', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'Georgia, serif', fontWeight: 600 }}>
                📋 Salin Nomor
              </button>
            </div>
          </div>
        </section>
      )}

      {/* PENUTUP */}
      <section style={{ padding: '4rem 1.5rem', textAlign: 'center', background: 'linear-gradient(160deg, #1a0a00 0%, #3d1f0a 100%)', color: '#f5e6d0' }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Penutup</p>
        <h2 style={{ fontSize: 'clamp(1.3rem, 4vw, 2.2rem)', fontWeight: 700, marginBottom: '1.25rem', lineHeight: 1.4 }}>
          Merupakan suatu kehormatan<br />
          <span style={{ color: '#c9a96e', fontStyle: 'italic' }}>bagi kami</span> atas kehadiran Anda
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', lineHeight: 1.7, fontSize: '0.9rem' }}>
          Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i<br />
          untuk hadir dan memberikan doa restu
        </p>
        <div style={{ fontStyle: 'italic', color: '#c9a96e', fontSize: '1.1rem' }}>
          {inv.groomName} & {inv.brideName}
        </div>
        <div style={{ marginTop: '2.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>Dibuat dengan 💌 UndanganKu</div>
      </section>
    </div>
  )
}