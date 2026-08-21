import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (slug) {
        const { data, error } = await supabase
            .from('Invitation')
            .select('*, Gallery(*), Rsvp(*), Wish(*), Template(*)')
            .eq('slug', slug)
            .eq('isActive', true)
            .single()

        if (error) return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 })
        return NextResponse.json({ data })
    }

    const { data, error } = await supabase
        .from('Invitation')
        .select('*, Order(*), Template(*)')
        .order('createdAt', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            orderId, templateId, slug, brideName, groomName, eventDate,
            akadTime, akadVenue, resepsiTime, resepsiVenue, mapsUrl,
            musicUrl, bankName, bankAccount, bankHolder
        } = body

        if (!orderId || !templateId || !slug || !brideName || !groomName || !eventDate) {
            return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
        }

        // Check slug unique
        const { data: existing } = await supabase.from('Invitation').select('id').eq('slug', slug).single()
        if (existing) return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 409 })

        const { data, error } = await supabase
            .from('Invitation')
            .insert({
                orderId, templateId, slug, brideName, groomName,
                eventDate, akadTime, akadVenue, resepsiTime, resepsiVenue,
                mapsUrl, musicUrl, bankName, bankAccount, bankHolder,
                isActive: true
            })
            .select()
            .single()

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ success: true, data })
    } catch {
        return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, ...updates } = body

        if (!id) return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 })

        const { data, error } = await supabase
            .from('Invitation')
            .update({ ...updates, updatedAt: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single()

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ success: true, data })
    } catch {
        return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
    }
}