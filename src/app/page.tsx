'use client'

import { useState, useEffect } from 'react'

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main style={{ fontFamily: "'Georgia', serif", background: '#a17337ff', color: '#ebe1e1ff', overflowX: 'hidden' }}>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '0.9rem 1.25rem',
        background: scrolled || menuOpen ? 'rgba(253,250,246,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        borderBottom: scrolled ? '1px solid #e8e0d5' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#7c5c3e' }}>💌 UndanganKu</span>

          {/* Desktop menu */}
          <div className="desktop-menu" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="#paket" style={{ textDecoration: 'none', color: '#555', fontSize: '0.9rem' }}>Paket</a>
            <a href="#fitur" style={{ textDecoration: 'none', color: '#555', fontSize: '0.9rem' }}>Fitur</a>
            <a href="#pesan" style={{
              textDecoration: 'none', color: '#fff', fontSize: '0.85rem',
              background: '#7c5c3e', padding: '0.5rem 1.1rem', borderRadius: '999px', whiteSpace: 'nowrap'
            }}>Pesan Sekarang</a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#7c5c3e', padding: '0.25rem' }}
          >{menuOpen ? '✕' : '☰'}</button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="mobile-menu" style={{ paddingTop: '1rem', paddingBottom: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['#paket', '#fitur'].map((href, i) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: '#555', fontSize: '0.95rem', padding: '0.25rem 0' }}>
                {['Paket', 'Fitur'][i]}
              </a>
            ))}
            <a href="#pesan" onClick={() => setMenuOpen(false)} style={{
              textDecoration: 'none', color: '#fff', fontSize: '0.9rem',
              background: '#7c5c3e', padding: '0.75rem 1rem', borderRadius: '10px', textAlign: 'center', fontWeight: 600
            }}>Pesan Sekarang</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        textAlign: 'center', padding: '7rem 1.5rem 4rem',
        background: 'linear-gradient(160deg, rgba(26,10,0,0.6) 0%, rgba(61,31,10,0.5) 60%, rgba(26,10,0,0.6) 100%), url("images/cover/wedding-cover.jpeg") center/cover no-repeat',
      }}>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#b08060', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
          Undangan Digital Elegan
        </p>
        <h1 style={{
          fontSize: 'clamp(2rem, 8vw, 4.5rem)',
          fontWeight: 700, lineHeight: 1.15,
          letterSpacing: '-0.02em', marginBottom: '1.25rem',
          maxWidth: '700px',
          color: '#fff',
        }}>
          Ceritakan Cinta<br />
          <span style={{ color: '#f5d9b0', fontStyle: 'italic' }}>Lewat Undangan</span><br />
          yang Tak Terlupakan
        </h1>
        <p style={{ fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', color: 'rgba(255,255,255,0.85)', maxWidth: '480px', lineHeight: 1.7, marginBottom: '2rem' }}>          Undangan digital cantik dengan RSVP, galeri foto, musik, countdown, dan peta lokasi.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#pesan" style={{
            background: '#7c5c3e', color: '#fff', padding: '0.85rem 1.75rem',
            borderRadius: '999px', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600
          }}>Buat Undangan →</a>
          <a href="#fitur" style={{
            background: 'transparent', color: '#7c5c3e', padding: '0.85rem 1.75rem',
            borderRadius: '999px', textDecoration: 'none', fontSize: '0.95rem',
            border: '1.5px solid #7c5c3e'
          }}>Lihat Fitur</a>
        </div>
        <div style={{ display: 'flex', gap: '2rem', marginTop: '3.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[['500+', 'Undangan dibuat'], ['98%', 'Pelanggan puas'], ['24 jam', 'Pengerjaan']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#7c5c3e' }}>{num}</div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.2rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FITUR */}
      <section id="fitur" style={{ padding: '4rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', letterSpacing: '0.2em', color: '#b08060', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Fitur Lengkap</p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 4vw, 2.3rem)', fontWeight: 700, marginBottom: '2.5rem', letterSpacing: '-0.02em' }}>
          Semua yang Kamu Butuhkan
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {[
            { icon: '🎵', title: 'Musik Latar', desc: 'Putar lagu favorit sebagai musik latar undangan' },
            { icon: '📸', title: 'Galeri Foto', desc: 'Tampilkan hingga 20 foto momen spesial' },
            { icon: '⏳', title: 'Countdown', desc: 'Hitung mundur menuju hari bahagia' },
            { icon: '✉️', title: 'RSVP Online', desc: 'Tamu konfirmasi kehadiran dari undangan' },
            { icon: '🗺️', title: 'Peta Lokasi', desc: 'Integrasi Google Maps untuk navigasi mudah' },
            { icon: '💌', title: 'Ucapan Tamu', desc: 'Tamu kirim doa dan ucapan selamat' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{
              background: '#fff', borderRadius: '14px', padding: '1.5rem',
              border: '1px solid #ede5d8',
            }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.4rem', fontSize: '1rem' }}>{title}</h3>
              <p style={{ color: '#777', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PAKET */}
      <section id="paket" style={{ padding: '4rem 1.5rem', background: '#fdf6ee' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', letterSpacing: '0.2em', color: '#b08060', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Harga Transparan</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 4vw, 2.3rem)', fontWeight: 700, marginBottom: '2.5rem', letterSpacing: '-0.02em' }}>
            Pilih Paket yang Cocok
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', alignItems: 'center' }}>
            {[
              { name: 'Basic', price: 'Rp 99.000', popular: false, features: ['Template standar', 'RSVP online', 'Countdown timer', 'Peta lokasi', 'Aktif 7 hari'] },
              { name: 'Premium', price: 'Rp 199.000', popular: true, features: ['Semua fitur Basic', 'Galeri 20 foto', 'Musik latar', 'Ucapan tamu', 'Aktif 30 hari'] },
              { name: 'Elite', price: 'Rp 349.000', popular: false, features: ['Semua fitur Premium', 'Animasi premium', 'Prioritas revisi', 'Aktif 90 hari', 'Support prioritas'] },
            ].map(({ name, price, popular, features }) => (
              <div key={name} style={{
                background: popular ? '#7c5c3e' : '#fff',
                color: popular ? '#fff' : '#1a1a1a',
                borderRadius: '18px', padding: '1.75rem',
                border: popular ? 'none' : '1px solid #ede5d8',
                position: 'relative',
              }}>
                {popular && (
                  <div style={{
                    position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                    background: '#f0c040', color: '#1a1a1a', fontSize: '0.7rem',
                    fontWeight: 700, padding: '0.25rem 0.9rem', borderRadius: '999px', whiteSpace: 'nowrap'
                  }}>TERPOPULER</div>
                )}
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.4rem' }}>{name}</h3>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.25rem', color: popular ? '#f5d9b0' : '#7c5c3e' }}>{price}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {features.map(f => (
                    <li key={f} style={{ fontSize: '0.875rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ color: popular ? '#f5d9b0' : '#7c5c3e', flexShrink: 0 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href="#pesan" style={{
                  display: 'block', textAlign: 'center', padding: '0.75rem',
                  borderRadius: '999px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
                  background: popular ? '#fff' : '#7c5c3e',
                  color: popular ? '#7c5c3e' : '#fff',
                }}>Pilih {name}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pesan" style={{
        padding: '4rem 1.5rem', textAlign: 'center',
        background: '#5a3e28', color: '#fff'
      }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          Siap Buat Undangan Impianmu?
        </h2>
        <p style={{ fontSize: '0.95rem', opacity: 0.8, marginBottom: '2rem', lineHeight: 1.6 }}>
          Hubungi kami via WhatsApp dan undanganmu siap dalam 24 jam
        </p>
        <a href="https://wa.me/628xxxxxxxxxx" style={{
          background: '#25D366', color: '#fff', padding: '0.9rem 2rem',
          borderRadius: '999px', textDecoration: 'none', fontSize: '1rem', fontWeight: 700,
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
        }}>💬 Chat WhatsApp Sekarang</a>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '1.5rem', textAlign: 'center', background: '#1a1a1a', color: '#888', fontSize: '0.8rem' }}>
        © 2026 UndanganKu · Dibuat dengan ❤️ untuk momen spesialmu
      </footer>

      <style>{`
        .desktop-menu { display: flex !important; }
        .mobile-menu-btn { display: none !important; }
        .mobile-menu { display: none !important; }
        @media (max-width: 640px) {
          .desktop-menu { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .mobile-menu { display: flex !important; }
        }
      `}</style>
    </main>
  )
}