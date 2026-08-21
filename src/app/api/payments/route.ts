import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabase
        .from('Payment')
        .select('*, Order(customerName, customerEmail, Package(name))')
        .order('createdAt', { ascending: false })

    if (status && status !== 'ALL') query = query.eq('status', status)

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, status, method } = body

        if (!id || !status) return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })

        const updates: Record<string, string> = {
            status,
            updatedAt: new Date().toISOString()
        }
        if (method) updates.method = method
        if (status === 'PAID') updates.paidAt = new Date().toISOString()

        const { data, error } = await supabase
            .from('Payment')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })

        // Update order status jika payment PAID
        if (status === 'PAID' && data.orderId) {
            await supabase.from('Order').update({ status: 'CONFIRMED' }).eq('id', data.orderId)
        }

        return NextResponse.json({ success: true, data })
    } catch {
        return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
    }
}