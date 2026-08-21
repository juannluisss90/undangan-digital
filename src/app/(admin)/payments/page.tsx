'use client'

import { useState } from 'react'


const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: 'Menunggu', color: '#b45309', bg: '#fffbeb' },
    PAID: { label: 'Lunas', color: '#2d6a4f', bg: '#f0faf4' },
    FAILED: { label: 'Gagal', color: '#991b1b', bg: '#fff5f5' },
    REFUNDED: { label: 'Dikembalikan', color: '#1a4f8a', bg: '#eff6ff' },
}

const DUMMY_PAYMENTS = [
    { id: 'PAY-001', orderId: 'ORD-001', name: 'Andi Pratama', package: 'Premium', amount: 199000, method: 'Transfer BCA', status: 'PAID', paidAt: '1 Agu 2026, 10:23', createdAt: '1 Agu 2026' },
    { id: 'PAY-002', orderId: 'ORD-002', name: 'Citra Sari', package: 'Elite', amount: 349000, method: 'QRIS', status: 'PAID', paidAt: '3 Agu 2026, 14:05', createdAt: '3 Agu 2026' },
    { id: 'PAY-003', orderId: 'ORD-003', name: 'Eka Putri', package: 'Basic', amount: 99000, method: 'Transfer BNI', status: 'PAID', paidAt: '4 Agu 2026, 09:11', createdAt: '4 Agu 2026' },
    { id: 'PAY-004', orderId: 'ORD-004', name: 'Gita Lestari', package: 'Premium', amount: 199000, method: '-', status: 'PENDING', paidAt: '-', createdAt: '4 Agu 2026' },
    { id: 'PAY-005', orderId: 'ORD-005', name: 'Indah Sari', package: 'Elite', amount: 349000, method: '-', status: 'PENDING', paidAt: '-', createdAt: '5 Agu 2026' },
    { id: 'PAY-006', orderId: 'ORD-006', name: 'Kartini', package: 'Basic', amount: 99000, method: 'Transfer Mandiri', status: 'REFUNDED', paidAt: '5 Agu 2026, 16:30', createdAt: '5 Agu 2026' },
]

function formatRupiah(n: number) {
    return 'Rp ' + n.toLocaleString('id-ID')
}

export default function PaymentsPage() {
    const [payments, setPayments] = useState(DUMMY_PAYMENTS)
    const [filterStatus, setFilterStatus] = useState('ALL')
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState<typeof DUMMY_PAYMENTS[0] | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [confirmMethod, setConfirmMethod] = useState('')

    const filtered = payments.filter(p => {
        const matchStatus = filterStatus === 'ALL' || p.status === filterStatus
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.id.toLowerCase().includes(search.toLowerCase()) ||
            p.orderId.toLowerCase().includes(search.toLowerCase())
        return matchStatus && matchSearch
    })

    const totalPaid = payments.filter(p => p.status === 'PAID').reduce((s, p) => s + p.amount, 0)
    const totalPending = payments.filter(p => p.status === 'PENDING').reduce((s, p) => s + p.amount, 0)

    const confirmPayment = () => {
        if (!selected || !confirmMethod) return
        const now = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        setPayments(prev => prev.map(p =>
            p.id === selected.id ? { ...p, status: 'PAID', method: confirmMethod, paidAt: now } : p
        ))
        setShowModal(false)
        setConfirmMethod('')
        setSelected(null)
    }

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '1.25rem' }}>
                <h1 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: 700, margin: 0 }}>Manajemen Pembayaran</h1>
                <p style={{ color: '#888', margin: '0.2rem 0 0', fontSize: '0.85rem' }}>Total {payments.length} transaksi</p>
            </div>

            {/* Summary - scrollable */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                {[
                    { label: 'Total Lunas', value: formatRupiah(totalPaid), color: '#2d6a4f', icon: '✅' },
                    { label: 'Menunggu', value: formatRupiah(totalPending), color: '#b45309', icon: '⏳' },
                    { label: 'Lunas', value: String(payments.filter(p => p.status === 'PAID').length) + ' transaksi', color: '#2d6a4f', icon: '📊' },
                    { label: 'Perlu Konfirmasi', value: String(payments.filter(p => p.status === 'PENDING').length), color: '#b45309', icon: '🔔' },
                ].map(s => (
                    <div key={s.label} style={{ background: '#fff', borderRadius: '12px', padding: '0.9rem 1rem', border: '1px solid #ede5d8', minWidth: '130px', flexShrink: 0 }}>
                        <div style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>{s.icon}</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '0.2rem' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Table card */}
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ede5d8', overflow: 'hidden' }}>
                <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #f5f0eb', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}>🔍</span>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama atau ID..."
                            style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.2rem', border: '1px solid #ede5d8', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'Georgia, serif', boxSizing: 'border-box', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.1rem' }}>
                        {['ALL', 'PENDING', 'PAID', 'FAILED', 'REFUNDED'].map(s => (
                            <button key={s} onClick={() => setFilterStatus(s)} style={{
                                padding: '0.4rem 0.75rem', borderRadius: '999px', border: 'none', cursor: 'pointer',
                                fontSize: '0.75rem', fontFamily: 'Georgia, serif', fontWeight: filterStatus === s ? 700 : 400,
                                background: filterStatus === s ? '#7c5c3e' : '#f5f0eb',
                                color: filterStatus === s ? '#fff' : '#666', whiteSpace: 'nowrap', flexShrink: 0
                            }}>{s === 'ALL' ? 'Semua' : statusConfig[s]?.label}</button>
                        ))}
                    </div>
                </div>

                {/* Mobile card view */}
                <div className="mobile-cards">
                    {filtered.map(pay => {
                        const s = statusConfig[pay.status]
                        return (
                            <div key={pay.id} style={{ padding: '1rem', borderBottom: '1px solid #f5f0eb' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{pay.name}</div>
                                        <div style={{ fontSize: '0.72rem', color: '#aaa' }}>{pay.id} · {pay.orderId}</div>
                                    </div>
                                    <span style={{ background: s.bg, color: s.color, padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{s.label}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#7c5c3e' }}>{formatRupiah(pay.amount)}</div>
                                        <div style={{ fontSize: '0.72rem', color: '#aaa' }}>{pay.method !== '-' ? pay.method : 'Belum bayar'}</div>
                                    </div>
                                    {pay.status === 'PENDING' ? (
                                        <button onClick={() => { setSelected(pay); setShowModal(true) }} style={{ padding: '0.35rem 0.75rem', background: '#f0faf4', border: '1px solid #c6e6d8', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', color: '#2d6a4f', fontFamily: 'Georgia, serif', fontWeight: 600 }}>✅ Konfirmasi</button>
                                    ) : (
                                        <button onClick={() => { setSelected(pay); setShowModal(true) }} style={{ padding: '0.35rem 0.75rem', background: '#fdf6ee', border: '1px solid #ede5d8', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', color: '#7c5c3e', fontFamily: 'Georgia, serif' }}>Detail</button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Desktop table */}
                <div className="desktop-table" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ background: '#fdfaf6' }}>
                                {['ID Bayar', 'ID Pesanan', 'Pemesan', 'Paket', 'Jumlah', 'Metode', 'Tgl Bayar', 'Status', 'Aksi'].map(h => (
                                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(pay => {
                                const s = statusConfig[pay.status]
                                return (
                                    <tr key={pay.id} style={{ borderTop: '1px solid #f5f0eb' }}
                                        onMouseEnter={e => (e.currentTarget.style.background = '#fdfaf6')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                        <td style={{ padding: '1rem', color: '#7c5c3e', fontWeight: 600 }}>{pay.id}</td>
                                        <td style={{ padding: '1rem', color: '#888', fontSize: '0.82rem' }}>{pay.orderId}</td>
                                        <td style={{ padding: '1rem', fontWeight: 600 }}>{pay.name}</td>
                                        <td style={{ padding: '1rem' }}><span style={{ background: '#fdf6ee', color: '#7c5c3e', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>{pay.package}</span></td>
                                        <td style={{ padding: '1rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{formatRupiah(pay.amount)}</td>
                                        <td style={{ padding: '1rem', color: '#666', fontSize: '0.85rem' }}>{pay.method}</td>
                                        <td style={{ padding: '1rem', color: '#888', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{pay.paidAt}</td>
                                        <td style={{ padding: '1rem' }}><span style={{ background: s.bg, color: s.color, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{s.label}</span></td>
                                        <td style={{ padding: '1rem' }}>
                                            {pay.status === 'PENDING' ? (
                                                <button onClick={() => { setSelected(pay); setShowModal(true) }} style={{ padding: '0.35rem 0.8rem', background: '#f0faf4', border: '1px solid #c6e6d8', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', color: '#2d6a4f', fontFamily: 'Georgia, serif', fontWeight: 600 }}>✅ Konfirmasi</button>
                                            ) : (
                                                <button onClick={() => { setSelected(pay); setShowModal(true) }} style={{ padding: '0.35rem 0.75rem', background: '#fdf6ee', border: '1px solid #ede5d8', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', color: '#7c5c3e', fontFamily: 'Georgia, serif' }}>Detail</button>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && selected && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
                    onClick={() => setShowModal(false)}>
                    <div style={{ background: '#fff', borderRadius: '20px 20px 0 0', padding: '1.5rem', width: '100%', maxWidth: '460px', maxHeight: '90vh', overflowY: 'auto' }}
                        onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                                {selected.status === 'PENDING' ? '✅ Konfirmasi Pembayaran' : '🧾 Detail Pembayaran'}
                            </h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#aaa' }}>×</button>
                        </div>
                        <div style={{ background: '#fdfaf6', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                            {[
                                ['ID Pembayaran', selected.id],
                                ['ID Pesanan', selected.orderId],
                                ['Pemesan', selected.name],
                                ['Paket', selected.package],
                                ['Jumlah', formatRupiah(selected.amount)],
                                ['Status', statusConfig[selected.status].label],
                            ].map(([label, val]) => (
                                <div key={String(label)} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #f0ebe3', fontSize: '0.85rem' }}>
                                    <span style={{ color: '#888' }}>{label}</span>
                                    <span style={{ fontWeight: 600 }}>{val}</span>
                                </div>
                            ))}
                        </div>
                        {selected.status === 'PENDING' && (
                            <>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.5rem', color: '#444' }}>Metode Pembayaran</label>
                                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                        {['Transfer BCA', 'Transfer BNI', 'Transfer Mandiri', 'QRIS', 'GoPay', 'OVO'].map(m => (
                                            <button key={m} onClick={() => setConfirmMethod(m)} style={{
                                                padding: '0.4rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem',
                                                fontFamily: 'Georgia, serif',
                                                border: confirmMethod === m ? '2px solid #7c5c3e' : '1px solid #ddd',
                                                background: confirmMethod === m ? '#fdf6ee' : '#fff',
                                                color: confirmMethod === m ? '#7c5c3e' : '#666',
                                                fontWeight: confirmMethod === m ? 700 : 400,
                                            }}>{m}</button>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.6rem' }}>
                                    <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.8rem', background: '#f5f0eb', color: '#666', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>Batal</button>
                                    <button onClick={confirmPayment} disabled={!confirmMethod} style={{ flex: 1, padding: '0.8rem', background: confirmMethod ? '#2d6a4f' : '#ccc', color: '#fff', border: 'none', borderRadius: '10px', cursor: confirmMethod ? 'pointer' : 'not-allowed', fontFamily: 'Georgia, serif', fontWeight: 600 }}>✅ Konfirmasi</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <style>{`
        .mobile-cards { display: none; }
        .desktop-table { display: block; }
        @media (max-width: 640px) {
          .mobile-cards { display: block; }
          .desktop-table { display: none; }
        }
      `}</style>
        </div>
    )
}