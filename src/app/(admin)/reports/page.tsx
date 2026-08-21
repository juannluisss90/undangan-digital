'use client'

import { useState } from 'react'

const MONTHLY_DATA = [
    { month: 'Mar', orders: 8, revenue: 1240000 },
    { month: 'Apr', orders: 12, revenue: 1980000 },
    { month: 'Mei', orders: 15, revenue: 2450000 },
    { month: 'Jun', orders: 11, revenue: 1870000 },
    { month: 'Jul', orders: 19, revenue: 3210000 },
    { month: 'Agu', orders: 24, revenue: 4180000 },
]

const PACKAGE_DATA = [
    { name: 'Basic', count: 13, revenue: 1287000, color: '#c9a96e', pct: 10 },
    { name: 'Premium', count: 83, revenue: 16517000, color: '#7c5c3e', pct: 65 },
    { name: 'Elite', count: 32, revenue: 11168000, color: '#3d1f0a', pct: 25 },
]

const TOP_INVITATIONS = [
    { name: 'Andi & Bela', rsvp: 245, views: 1240, package: 'Premium' },
    { name: 'Citra & Danu', rsvp: 198, views: 980, package: 'Elite' },
    { name: 'Eka & Fajar', rsvp: 134, views: 670, package: 'Basic' },
    { name: 'Gita & Hendra', rsvp: 89, views: 430, package: 'Premium' },
    { name: 'Indah & Joko', rsvp: 67, views: 310, package: 'Elite' },
]

function formatRupiah(n: number) {
    if (n >= 1000000) return 'Rp ' + (n / 1000000).toFixed(1) + ' jt'
    return 'Rp ' + n.toLocaleString('id-ID')
}

function BarChart({ data }: { data: typeof MONTHLY_DATA }) {
    const maxRevenue = Math.max(...data.map(d => d.revenue))
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '140px', padding: '0 0.25rem' }}>
            {data.map(d => (
                <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ fontSize: '0.55rem', color: '#aaa', marginBottom: '2px' }}>{formatRupiah(d.revenue)}</div>
                    <div style={{ width: '100%', background: 'linear-gradient(180deg, #7c5c3e, #3d1f0a)', borderRadius: '4px 4px 0 0', height: `${(d.revenue / maxRevenue) * 100}px`, minHeight: '4px' }} />
                    <div style={{ fontSize: '0.65rem', color: '#888', fontWeight: 600 }}>{d.month}</div>
                </div>
            ))}
        </div>
    )
}

export default function ReportsPage() {
    const [period, setPeriod] = useState<'6bln' | '3bln' | '1bln'>('6bln')

    const totalRevenue = MONTHLY_DATA.reduce((s, d) => s + d.revenue, 0)
    const totalOrders = MONTHLY_DATA.reduce((s, d) => s + d.orders, 0)
    const avgOrder = Math.round(totalRevenue / totalOrders)

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                    <h1 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: 700, margin: 0 }}>Laporan & Statistik</h1>
                    <p style={{ color: '#888', margin: '0.2rem 0 0', fontSize: '0.85rem' }}>Performa bisnis UndanganKu</p>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {(['6bln', '3bln', '1bln'] as const).map(p => (
                        <button key={p} onClick={() => setPeriod(p)} style={{
                            padding: '0.4rem 0.75rem', borderRadius: '999px', border: 'none', cursor: 'pointer',
                            fontSize: '0.78rem', fontFamily: 'Georgia, serif',
                            background: period === p ? '#7c5c3e' : '#f5f0eb',
                            color: period === p ? '#fff' : '#666', fontWeight: period === p ? 700 : 400,
                        }}>{p === '6bln' ? '6 Bulan' : p === '3bln' ? '3 Bulan' : '1 Bulan'}</button>
                    ))}
                </div>
            </div>

            {/* Summary Stats - 2x2 grid on mobile */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {[
                    { icon: '💰', label: 'Total Pendapatan', value: formatRupiah(totalRevenue), sub: '+23% vs bulan lalu', color: '#2d6a4f' },
                    { icon: '📋', label: 'Total Pesanan', value: String(totalOrders), sub: '+4 vs bulan lalu', color: '#1a4f8a' },
                    { icon: '📊', label: 'Rata-rata/Pesanan', value: formatRupiah(avgOrder), sub: 'per transaksi', color: '#7b2d8b' },
                    { icon: '⭐', label: 'Rating Kepuasan', value: '4.9 / 5', sub: 'dari 128 ulasan', color: '#b45309' },
                ].map(s => (
                    <div key={s.label} style={{ background: '#fff', borderRadius: '12px', padding: '1rem', border: '1px solid #ede5d8' }}>
                        <div style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                        <div style={{ fontSize: 'clamp(0.9rem, 3vw, 1.2rem)', fontWeight: 700, color: '#1a1a1a' }}>{s.value}</div>
                        <div style={{ fontSize: '0.7rem', color: '#888', margin: '0.2rem 0' }}>{s.label}</div>
                        <div style={{ fontSize: '0.68rem', color: s.color, fontWeight: 600 }}>↑ {s.sub}</div>
                    </div>
                ))}
            </div>

            {/* Bar Chart */}
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #ede5d8', padding: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Pendapatan Bulanan</h3>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#aaa' }}>6 bulan terakhir</p>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#7c5c3e' }}>{formatRupiah(totalRevenue)}</div>
                </div>
                <BarChart data={MONTHLY_DATA} />
            </div>

            {/* Paket Terlaris */}
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #ede5d8', padding: '1.25rem', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 700 }}>Distribusi Paket</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <svg viewBox="0 0 120 120" style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                        {(() => {
                            const r = 40, cx = 60, cy = 60, circ = 2 * Math.PI * r
                            const circlesData: Array<{ p: typeof PACKAGE_DATA[number]; rot: number }> = []
                            let offset = 0
                            for (const p of PACKAGE_DATA) {
                                circlesData.push({ p, rot: (offset / 100) * 360 - 90 })
                                offset += p.pct
                            }
                            return circlesData.map(({ p, rot }) => {
                                const dash = (p.pct / 100) * circ
                                const gap = circ - dash
                                return (
                                    <circle key={p.name} cx={cx} cy={cy} r={r}
                                        fill="none" stroke={p.color} strokeWidth="20"
                                        strokeDasharray={`${dash} ${gap}`}
                                        style={{ transform: `rotate(${rot}deg)`, transformOrigin: `${cx}px ${cy}px` }}
                                    />
                                )
                            })
                        })()}
                        <text x="60" y="56" textAnchor="middle" fontSize="11" fill="#1a1a1a" fontWeight="700">{totalOrders}</text>
                        <text x="60" y="70" textAnchor="middle" fontSize="9" fill="#aaa">pesanan</text>
                    </svg>
                    <div style={{ flex: 1 }}>
                        {PACKAGE_DATA.map(p => (
                            <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{p.name}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{p.pct}%</div>
                                    <div style={{ fontSize: '0.68rem', color: '#aaa' }}>{p.count} pesanan</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ borderTop: '1px solid #f5f0eb', paddingTop: '0.875rem' }}>
                    {PACKAGE_DATA.map(p => (
                        <div key={p.name} style={{ marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                                <span style={{ color: '#555' }}>{p.name}</span>
                                <span style={{ fontWeight: 700 }}>{formatRupiah(p.revenue)}</span>
                            </div>
                            <div style={{ height: '4px', background: '#f5f0eb', borderRadius: '999px', overflow: 'hidden' }}>
                                <div style={{ width: `${p.pct}%`, height: '100%', background: p.color, borderRadius: '999px' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Undangan */}
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #ede5d8', padding: '1.25rem', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: '0 0 0.875rem', fontSize: '0.95rem', fontWeight: 700 }}>Undangan Paling Aktif</h3>
                {TOP_INVITATIONS.map((inv, i) => (
                    <div key={inv.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: i < TOP_INVITATIONS.length - 1 ? '1px solid #f5f0eb' : 'none' }}>
                        <div style={{
                            width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                            background: i === 0 ? '#f0c040' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : '#f5f0eb',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.78rem', fontWeight: 700, color: i < 3 ? '#fff' : '#888'
                        }}>{i + 1}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{inv.name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#aaa' }}>{inv.package}</div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#7c5c3e' }}>{inv.rsvp} RSVP</div>
                            <div style={{ fontSize: '0.68rem', color: '#aaa' }}>{inv.views} views</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* RSVP Summary */}
            <div style={{ background: 'linear-gradient(135deg, #1a0a00, #3d1f0a)', borderRadius: '14px', padding: '1.25rem', color: '#f5e6d0' }}>
                <p style={{ margin: '0 0 0.875rem', fontSize: '0.78rem', color: '#c9a96e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ringkasan RSVP</p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {[
                        { label: 'Total RSVP', value: '1.240' },
                        { label: 'Hadir', value: '1.089' },
                        { label: 'Tidak Hadir', value: '151' },
                    ].map(s => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 'clamp(1rem, 4vw, 1.3rem)', fontWeight: 700 }}>{s.value}</div>
                            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}