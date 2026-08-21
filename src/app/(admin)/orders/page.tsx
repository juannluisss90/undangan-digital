'use client'

import { useState, useEffect, useCallback } from 'react'

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: 'Menunggu', color: '#b45309', bg: '#fffbeb' },
    CONFIRMED: { label: 'Dikonfirmasi', color: '#1a4f8a', bg: '#eff6ff' },
    IN_PROGRESS: { label: 'Dikerjakan', color: '#7b2d8b', bg: '#faf0ff' },
    DONE: { label: 'Selesai', color: '#2d6a4f', bg: '#f0faf4' },
    CANCELLED: { label: 'Batal', color: '#991b1b', bg: '#fff5f5' },
}

function formatRupiah(n: number) {
    return 'Rp ' + n.toLocaleString('id-ID')
}

interface PackageItem {
    id: string
    name: string
    price: number
}

interface OrderItem {
    id: string
    customerName: string
    customerEmail: string
    customerPhone?: string
    status: string
    createdAt: string
    Package?: PackageItem
    Payment?: Array<{ status: string }>
    Invitation?: Array<{ id: string; slug: string }>
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderItem[]>([])
    const [packages, setPackages] = useState<PackageItem[]>([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('ALL')
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState<OrderItem | null>(null)
    const [showDetail, setShowDetail] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [total, setTotal] = useState(0)
    const [form, setForm] = useState({ customerName: '', customerEmail: '', customerPhone: '', packageId: '' })
    const [submitting, setSubmitting] = useState(false)

    const fetchOrders = useCallback(async () => {
        const params = new URLSearchParams({ limit: '50' })
        if (filterStatus !== 'ALL') params.set('status', filterStatus)
        if (search) params.set('search', search)
        const res = await fetch(`/api/orders?${params}`)
        const json = await res.json()
        setOrders(json.data || [])
        setTotal(json.total || 0)
        setLoading(false)
    }, [filterStatus, search])

    useEffect(() => {
        let isMounted = true
        const params = new URLSearchParams({ limit: '50' })
        if (filterStatus !== 'ALL') params.set('status', filterStatus)
        if (search) params.set('search', search)
        fetch(`/api/orders?${params}`)
            .then(r => r.json())
            .then(json => {
                if (isMounted) {
                    setOrders(json.data || [])
                    setTotal(json.total || 0)
                    setLoading(false)
                }
            })
        return () => { isMounted = false }
    }, [filterStatus, search])

    useEffect(() => {
        fetch('/api/packages').then(r => r.json()).then(j => setPackages(j.data || []))
    }, [])

    const updateStatus = async (id: string, status: string) => {
        await fetch(`/api/orders/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
        fetchOrders()
        if (selected?.id === id) setSelected((prev: OrderItem | null) => prev ? { ...prev, status } : null)
    }

    const handleAddOrder = async () => {
        if (!form.customerName || !form.customerEmail || !form.packageId) return
        setSubmitting(true)
        try {
            const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
            const json = await res.json()
            if (json.success) {
                setShowAdd(false)
                setForm({ customerName: '', customerEmail: '', customerPhone: '', packageId: '' })
                fetchOrders()
            }
        } catch (e) { console.error(e) }
        setSubmitting(false)
    }

    const totalByStatus = (s: string) => orders.filter(o => o.status === s).length
    const totalRevenue = orders.filter(o => o.status === 'DONE').reduce((sum: number, o: OrderItem) => sum + (o.Package?.price || 0), 0)


    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                    <h1 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: 700, margin: 0 }}>Manajemen Pesanan</h1>
                    <p style={{ color: '#888', margin: '0.2rem 0 0', fontSize: '0.85rem' }}>Total {total} pesanan</p>
                </div>
                <button onClick={() => setShowAdd(true)} style={{ background: '#7c5c3e', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.65rem 1.1rem', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'Georgia, serif', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    + Pesanan Baru
                </button>
            </div>

            {/* Summary cards - scrollable on mobile */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                {[
                    { label: 'Menunggu', status: 'PENDING' },
                    { label: 'Dikerjakan', status: 'IN_PROGRESS' },
                    { label: 'Selesai', status: 'DONE' },
                ].map(({ label, status }) => {
                    const cfg = statusConfig[status]
                    return (
                        <div key={status} style={{ background: '#fff', border: '1px solid #ede5d8', borderRadius: '12px', padding: '0.9rem 1rem', minWidth: '100px', flexShrink: 0 }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: cfg.color }}>{totalByStatus(status)}</div>
                            <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem' }}>{label}</div>
                        </div>
                    )
                })}
                <div style={{ background: '#fff', border: '1px solid #ede5d8', borderRadius: '12px', padding: '0.9rem 1rem', minWidth: '130px', flexShrink: 0 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#7c5c3e' }}>{formatRupiah(totalRevenue)}</div>
                    <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem' }}>Pendapatan</div>
                </div>
            </div>

            {/* Filter & Table */}
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ede5d8', overflow: 'hidden' }}>
                <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #f5f0eb', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}>🔍</span>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama, ID, atau email..."
                            style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.2rem', border: '1px solid #ede5d8', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'Georgia, serif', boxSizing: 'border-box', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.1rem' }}>
                        {['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'DONE', 'CANCELLED'].map(s => (
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
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}>Memuat...</div>
                    ) : orders.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}>Belum ada pesanan</div>
                    ) : orders.map(order => {
                        const s = statusConfig[order.status]
                        return (
                            <div key={order.id} style={{ padding: '1rem', borderBottom: '1px solid #f5f0eb' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{order.customerName}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#aaa' }}>{order.customerEmail}</div>
                                    </div>
                                    <span style={{ background: s.bg, color: s.color, padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{s.label}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <span style={{ background: '#fdf6ee', color: '#7c5c3e', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>{order.Package?.name || '-'}</span>
                                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{formatRupiah(order.Package?.price || 0)}</span>
                                    </div>
                                    <button onClick={() => { setSelected(order); setShowDetail(true) }} style={{ padding: '0.3rem 0.75rem', background: '#fdf6ee', border: '1px solid #ede5d8', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', color: '#7c5c3e', fontFamily: 'Georgia, serif' }}>Detail</button>
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
                                {['ID', 'Pemesan', 'Paket', 'Tgl Pesan', 'Total', 'Status', 'Aksi'].map(h => (
                                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}>Memuat...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}>Belum ada pesanan</td></tr>
                            ) : orders.map(order => {
                                const s = statusConfig[order.status]
                                return (
                                    <tr key={order.id} style={{ borderTop: '1px solid #f5f0eb' }}
                                        onMouseEnter={e => (e.currentTarget.style.background = '#fdfaf6')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                        <td style={{ padding: '1rem', color: '#7c5c3e', fontWeight: 600, fontSize: '0.8rem' }}>{order.id.slice(0, 8)}...</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                                            <div style={{ fontSize: '0.78rem', color: '#aaa' }}>{order.customerEmail}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ background: '#fdf6ee', color: '#7c5c3e', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>{order.Package?.name || '-'}</span>
                                        </td>
                                        <td style={{ padding: '1rem', color: '#666', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>{new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
                                        <td style={{ padding: '1rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{formatRupiah(order.Package?.price || 0)}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ background: s.bg, color: s.color, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{s.label}</span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <button onClick={() => { setSelected(order); setShowDetail(true) }} style={{ padding: '0.35rem 0.75rem', background: '#fdf6ee', border: '1px solid #ede5d8', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', color: '#7c5c3e', fontFamily: 'Georgia, serif' }}>Detail</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {showAdd && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0' }}
                    onClick={() => setShowAdd(false)}>
                    <div style={{ background: '#fff', borderRadius: '20px 20px 0 0', padding: '1.5rem', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}
                        onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>+ Pesanan Baru</h2>
                            <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#aaa' }}>×</button>
                        </div>
                        {[
                            { label: 'Nama Pemesan', key: 'customerName', placeholder: 'Nama lengkap', type: 'text' },
                            { label: 'Email', key: 'customerEmail', placeholder: 'email@example.com', type: 'email' },
                            { label: 'No. HP / WhatsApp', key: 'customerPhone', placeholder: '08xxxxxxxxxx', type: 'text' },
                        ].map(f => (
                            <div key={f.key} style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: '#444' }}>{f.label}</label>
                                <input type={f.type} value={form[f.key as keyof typeof form]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ede5d8', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'Georgia, serif', boxSizing: 'border-box', outline: 'none' }} />
                            </div>
                        ))}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: '#444' }}>Paket</label>
                            <div style={{ display: 'flex', gap: '0.6rem' }}>
                                {packages.map((pkg: PackageItem) => (
                                    <button key={pkg.id} onClick={() => setForm(prev => ({ ...prev, packageId: pkg.id }))} style={{
                                        flex: 1, padding: '0.65rem 0.5rem', borderRadius: '10px', cursor: 'pointer',
                                        border: form.packageId === pkg.id ? '2px solid #7c5c3e' : '1px solid #ede5d8',
                                        background: form.packageId === pkg.id ? '#fdf6ee' : '#fff',
                                        fontFamily: 'Georgia, serif', textAlign: 'center'
                                    }}>
                                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: form.packageId === pkg.id ? '#7c5c3e' : '#1a1a1a' }}>{pkg.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem' }}>{formatRupiah(pkg.price)}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '0.8rem', background: '#f5f0eb', color: '#666', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>Batal</button>
                            <button onClick={handleAddOrder} disabled={submitting} style={{ flex: 1, padding: '0.8rem', background: '#7c5c3e', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: 600 }}>
                                {submitting ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetail && selected && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
                    onClick={() => setShowDetail(false)}>
                    <div style={{ background: '#fff', borderRadius: '20px 20px 0 0', padding: '1.5rem', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}
                        onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Detail Pesanan</h2>
                            <button onClick={() => setShowDetail(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#aaa' }}>×</button>
                        </div>
                        <div style={{ background: '#fdfaf6', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                            {[
                                ['Pemesan', selected.customerName],
                                ['Email', selected.customerEmail],
                                ['No. HP', selected.customerPhone],
                                ['Paket', selected.Package?.name || '-'],
                                ['Total', formatRupiah(selected.Package?.price || 0)],
                                ['Tgl Pesan', new Date(selected.createdAt).toLocaleDateString('id-ID')],
                            ].map(([label, val]) => (
                                <div key={String(label)} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #f0ebe3', fontSize: '0.85rem' }}>
                                    <span style={{ color: '#888' }}>{label}</span>
                                    <span style={{ fontWeight: 600, maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' }}>{val}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.6rem', color: '#444' }}>Update Status</label>
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                {Object.entries(statusConfig).map(([key, cfg]) => (
                                    <button key={key} onClick={() => updateStatus(selected.id, key)} style={{
                                        padding: '0.35rem 0.75rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.75rem',
                                        fontFamily: 'Georgia, serif', fontWeight: selected.status === key ? 700 : 400,
                                        border: selected.status === key ? `2px solid ${cfg.color}` : '1px solid #ddd',
                                        background: selected.status === key ? cfg.bg : '#fff',
                                        color: selected.status === key ? cfg.color : '#666',
                                    }}>{cfg.label}</button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.6rem' }}>
                            <button style={{ flex: 1, padding: '0.75rem', background: '#7c5c3e', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'Georgia, serif', fontWeight: 600 }}>💌 Buat Undangan</button>
                            <a href={`https://wa.me/${selected.customerPhone}`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '0.75rem', background: '#f0faf4', color: '#2d6a4f', border: '1px solid #c6e6d8', borderRadius: '10px', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'Georgia, serif', fontWeight: 600, textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💬 WA</a>
                        </div>
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