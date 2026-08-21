'use client'

import { useState, useEffect, useCallback } from 'react'

const inputStyle = {
    width: '100%', padding: '0.65rem 0.75rem', border: '1px solid #ede5d8',
    borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'Georgia, serif',
    boxSizing: 'border-box' as const, outline: 'none'
}

const labelStyle = {
    display: 'block', fontSize: '0.8rem', fontWeight: 600,
    marginBottom: '0.4rem', color: '#555'
} as const

const sectionStyle = {
    background: '#fdfaf6', borderRadius: '12px', padding: '1.25rem'
}

const sectionTitleStyle = {
    margin: '0 0 1rem', fontSize: '0.9rem', color: '#7c5c3e',
    textTransform: 'uppercase' as const, letterSpacing: '0.05em'
}

interface InvitationForm {
    orderId: string
    templateId: string
    slug: string
    brideName: string
    groomName: string
    eventDate: string
    akadTime: string
    akadVenue: string
    resepsiTime: string
    resepsiVenue: string
    mapsUrl: string
    musicUrl: string
    bankName: string
    bankAccount: string
    bankHolder: string
}

interface OrderItem {
    id: string
    customerName: string
}

interface TemplateItem {
    id: string
    name: string
}

interface InvitationItem extends InvitationForm {
    id: string
    isActive: boolean
    Order?: { customerName: string; packageId: string }
    Template?: { name: string }
    createdAt?: string
}

// FormContent di luar komponen supaya tidak re-render setiap keystroke
function FormContent({
    form, setForm, onSubmit, onCancel, submitting, label, orders, templates
}: {
    form: InvitationForm,
    setForm: React.Dispatch<React.SetStateAction<InvitationForm>>,
    onSubmit: () => void,
    onCancel: () => void,
    submitting: boolean,
    label: string,
    orders: OrderItem[],
    templates: TemplateItem[]
}) {

    const generateSlug = (bride: string, groom: string) => {
        const clean = (s: string) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        return `${clean(groom)}-dan-${clean(bride)}`
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Data Pasangan */}
            <div style={sectionStyle}>
                <h4 style={sectionTitleStyle}>Data Pasangan</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                        <label style={labelStyle}>Nama Pengantin Wanita</label>
                        <input
                            value={form.brideName}
                            onChange={e => setForm((p: InvitationForm) => ({ ...p, brideName: e.target.value, slug: generateSlug(e.target.value, p.groomName) }))}
                            placeholder="Nama wanita"
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Nama Pengantin Pria</label>
                        <input
                            value={form.groomName}
                            onChange={e => setForm((p: InvitationForm) => ({ ...p, groomName: e.target.value, slug: generateSlug(p.brideName, e.target.value) }))}
                            placeholder="Nama pria"
                            style={inputStyle}
                        />
                    </div>
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                    <label style={labelStyle}>Slug URL <span style={{ color: '#aaa', fontWeight: 400 }}>(auto-generate)</span></label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#aaa', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>undanganku.com/</span>
                        <input
                            value={form.slug}
                            onChange={e => setForm((p: InvitationForm) => ({ ...p, slug: e.target.value }))}
                            style={inputStyle}
                        />
                    </div>
                </div>
            </div>

            {/* Pesanan & Template */}
            <div style={sectionStyle}>
                <h4 style={sectionTitleStyle}>Pesanan & Template</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                        <label style={labelStyle}>Pesanan</label>
                        <select
                            value={form.orderId}
                            onChange={e => setForm((p: InvitationForm) => ({ ...p, orderId: e.target.value }))}
                            style={{ ...inputStyle, background: '#fff' }}
                        >
                            <option value="">Pilih pesanan...</option>
                            {orders.map((o: OrderItem) => (
                                <option key={o.id} value={o.id}>{o.customerName}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Template</label>
                        <select
                            value={form.templateId}
                            onChange={e => setForm((p: InvitationForm) => ({ ...p, templateId: e.target.value }))}
                            style={{ ...inputStyle, background: '#fff' }}
                        >
                            <option value="">Pilih template...</option>
                            {templates.map((t: TemplateItem) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                    <label style={labelStyle}>Tanggal Acara</label>
                    <input
                        type="date" value={form.eventDate}
                        onChange={e => setForm((p: InvitationForm) => ({ ...p, eventDate: e.target.value }))}
                        style={inputStyle}
                    />
                </div>
            </div>

            {/* Jadwal Acara */}
            <div style={sectionStyle}>
                <h4 style={sectionTitleStyle}>Jadwal Acara</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {[
                        { label: 'Waktu Akad', key: 'akadTime' as const, placeholder: '09.00 WIB' },
                        { label: 'Lokasi Akad', key: 'akadVenue' as const, placeholder: 'Nama masjid / tempat' },
                        { label: 'Waktu Resepsi', key: 'resepsiTime' as const, placeholder: '11.00 - 14.00 WIB' },
                        { label: 'Lokasi Resepsi', key: 'resepsiVenue' as const, placeholder: 'Nama gedung / tempat' },
                    ].map(f => (
                        <div key={f.key}>
                            <label style={labelStyle}>{f.label}</label>
                            <input
                                value={form[f.key]}
                                onChange={e => setForm((p: InvitationForm) => ({ ...p, [f.key]: e.target.value }))}
                                placeholder={f.placeholder}
                                style={inputStyle}
                            />
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                    <label style={labelStyle}>Link Google Maps</label>
                    <input
                        value={form.mapsUrl}
                        onChange={e => setForm((p: InvitationForm) => ({ ...p, mapsUrl: e.target.value }))}
                        placeholder="https://maps.google.com/..."
                        style={inputStyle}
                    />
                </div>
            </div>

            {/* Amplop Digital */}
            <div style={sectionStyle}>
                <h4 style={sectionTitleStyle}>Amplop Digital</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    {[
                        { label: 'Nama Bank', key: 'bankName' as const, placeholder: 'BCA / BNI / dll' },
                        { label: 'No. Rekening', key: 'bankAccount' as const, placeholder: '1234567890' },
                        { label: 'Atas Nama', key: 'bankHolder' as const, placeholder: 'Nama pemilik' },
                    ].map(f => (
                        <div key={f.key}>
                            <label style={labelStyle}>{f.label}</label>
                            <input
                                value={form[f.key]}
                                onChange={e => setForm((p: InvitationForm) => ({ ...p, [f.key]: e.target.value }))}
                                placeholder={f.placeholder}
                                style={inputStyle}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={onCancel} style={{ flex: 1, padding: '0.8rem', background: '#f5f0eb', color: '#666', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>Batal</button>
                <button onClick={onSubmit} disabled={submitting} style={{ flex: 2, padding: '0.8rem', background: '#7c5c3e', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: 600 }}>
                    {submitting ? 'Menyimpan...' : label}
                </button>
            </div>
        </div>
    )
}

const emptyForm: InvitationForm = {
    orderId: '', templateId: '', slug: '',
    brideName: '', groomName: '', eventDate: '',
    akadTime: '', akadVenue: '',
    resepsiTime: '', resepsiVenue: '',
    mapsUrl: '', musicUrl: '',
    bankName: '', bankAccount: '', bankHolder: '',
}

export default function InvitationsPage() {
    const [invitations, setInvitations] = useState<InvitationItem[]>([])
    const [orders, setOrders] = useState<OrderItem[]>([])
    const [templates, setTemplates] = useState<TemplateItem[]>([])
    const [loading, setLoading] = useState(true)
    const [showAdd, setShowAdd] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [selected, setSelected] = useState<InvitationItem | null>(null)
    const [form, setForm] = useState<InvitationForm>(emptyForm)
    const [submitting, setSubmitting] = useState(false)

    const fetchInvitations = useCallback(async () => {
        const res = await fetch('/api/invitations')
        const json = await res.json()
        setInvitations(json.data || [])
        setLoading(false)
    }, [])

    useEffect(() => {
        let isMounted = true
        fetch('/api/invitations')
            .then(r => r.json())
            .then(j => {
                if (isMounted) {
                    setInvitations(j.data || [])
                    setLoading(false)
                }
            })
        return () => { isMounted = false }
    }, [])

    useEffect(() => {
        fetch('/api/orders?limit=100').then(r => r.json()).then(j => setOrders(j.data || []))
        fetch('/api/templates').then(r => r.json()).then(j => setTemplates(j.data || []))
    }, [])

    const handleSubmit = async () => {
        if (!form.orderId || !form.templateId || !form.brideName || !form.groomName || !form.eventDate) {
            alert('Lengkapi data pasangan, pesanan, template, dan tanggal acara')
            return
        }
        setSubmitting(true)
        const res = await fetch('/api/invitations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
        const json = await res.json()
        if (json.success) {
            setShowAdd(false)
            setForm(emptyForm)
            fetchInvitations()
        } else {
            alert(json.error || 'Terjadi kesalahan')
        }
        setSubmitting(false)
    }

    const handleUpdate = async () => {
        if (!selected) return
        setSubmitting(true)
        const res = await fetch('/api/invitations', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selected.id, ...form })
        })
        const json = await res.json()
        if (json.success) {
            setShowEdit(false)
            fetchInvitations()
        }
        setSubmitting(false)
    }

    const openEdit = (inv: InvitationItem) => {
        setSelected(inv)
        setForm({
            orderId: inv.orderId, templateId: inv.templateId, slug: inv.slug,
            brideName: inv.brideName, groomName: inv.groomName,
            eventDate: inv.eventDate?.split('T')[0] || '',
            akadTime: inv.akadTime || '', akadVenue: inv.akadVenue || '',
            resepsiTime: inv.resepsiTime || '', resepsiVenue: inv.resepsiVenue || '',
            mapsUrl: inv.mapsUrl || '', musicUrl: inv.musicUrl || '',
            bankName: inv.bankName || '', bankAccount: inv.bankAccount || '', bankHolder: inv.bankHolder || '',
        })
        setShowEdit(true)
    }

    const toggleActive = async (id: string, isActive: boolean) => {
        await fetch('/api/invitations', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, isActive: !isActive })
        })
        fetchInvitations()
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Kelola Undangan</h1>
                    <p style={{ color: '#888', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>Total {invitations.length} undangan</p>
                </div>
                <button onClick={() => { setForm(emptyForm); setShowAdd(true) }} style={{ background: '#7c5c3e', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.7rem 1.3rem', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'Georgia, serif', fontWeight: 600 }}>
                    + Buat Undangan
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#aaa' }}>Memuat...</div>
            ) : invitations.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ede5d8', padding: '4rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💌</div>
                    <h3 style={{ margin: '0 0 0.5rem' }}>Belum ada undangan</h3>
                    <p style={{ color: '#aaa', margin: '0 0 1.5rem' }}>Buat undangan pertama untuk pesanan yang masuk</p>
                    <button onClick={() => setShowAdd(true)} style={{ background: '#7c5c3e', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.7rem 1.5rem', cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: 600 }}>+ Buat Undangan</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                    {invitations.map((inv: InvitationItem) => (
                        <div key={inv.id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ede5d8', overflow: 'hidden' }}>
                            <div style={{ background: 'linear-gradient(135deg, #1a0a00, #3d1f0a)', padding: '1.5rem', color: '#f5e6d0', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem', color: '#c9a96e', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>UNDANGAN PERNIKAHAN</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{inv.groomName}</div>
                                <div style={{ color: '#c9a96e', margin: '0.25rem 0' }}>&</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{inv.brideName}</div>
                            </div>
                            <div style={{ padding: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <span style={{ background: inv.isActive ? '#f0faf4' : '#fff5f5', color: inv.isActive ? '#2d6a4f' : '#991b1b', padding: '0.2rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                                        {inv.isActive ? '✅ Aktif' : '❌ Nonaktif'}
                                    </span>
                                    <span style={{ fontSize: '0.78rem', color: '#aaa' }}>
                                        {new Date(inv.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.82rem', color: '#888', marginBottom: '1rem' }}>
                                    <div style={{ marginBottom: '0.3rem' }}>🔗 <strong style={{ color: '#7c5c3e' }}>{inv.slug}</strong></div>
                                    {inv.resepsiVenue && <div>📍 {inv.resepsiVenue}</div>}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <a href={`/${inv.slug}`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '0.6rem', background: '#fdf6ee', color: '#7c5c3e', border: '1px solid #ede5d8', borderRadius: '8px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' }}>👁 Preview</a>
                                    <button onClick={() => openEdit(inv)} style={{ flex: 1, padding: '0.6rem', background: '#7c5c3e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'Georgia, serif' }}>✏️ Edit</button>
                                    <button onClick={() => toggleActive(inv.id, inv.isActive)} style={{ padding: '0.6rem 0.75rem', background: '#f5f0eb', color: '#666', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Georgia, serif' }}>
                                        {inv.isActive ? '⏸' : '▶️'}
                                    </button>
                                </div>
                                <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${inv.slug}`)} style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem', background: 'transparent', border: '1px dashed #ede5d8', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', color: '#aaa', fontFamily: 'Georgia, serif' }}>
                                    📋 Salin Link Undangan
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            {showAdd && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem', overflowY: 'auto' }}
                    onClick={() => setShowAdd(false)}>
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '700px', width: '100%', marginTop: '1rem' }}
                        onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>💌 Buat Undangan Baru</h2>
                            <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#aaa' }}>×</button>
                        </div>
                        <FormContent form={form} setForm={setForm} onSubmit={handleSubmit} onCancel={() => setShowAdd(false)} submitting={submitting} label="Buat Undangan" orders={orders} templates={templates} />
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEdit && selected && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem', overflowY: 'auto' }}
                    onClick={() => setShowEdit(false)}>
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '700px', width: '100%', marginTop: '1rem' }}
                        onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>✏️ Edit Undangan</h2>
                            <button onClick={() => setShowEdit(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#aaa' }}>×</button>
                        </div>
                        <FormContent form={form} setForm={setForm} onSubmit={handleUpdate} onCancel={() => setShowEdit(false)} submitting={submitting} label="Simpan Perubahan" orders={orders} templates={templates} />
                    </div>
                </div>
            )}
        </div>
    )
}