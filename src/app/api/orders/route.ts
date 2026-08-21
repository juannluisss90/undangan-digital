import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  let query = supabase
    .from('Order')
    .select('*, Package(*), Payment(*), Invitation(*)', { count: 'exact' })
    .order('createdAt', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (status && status !== 'ALL') query = query.eq('status', status)
  if (search) query = query.or(`customerName.ilike.%${search}%,customerEmail.ilike.%${search}%,id.ilike.%${search}%`)

  const { data, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, total: count, page, limit })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Body:', JSON.stringify(body))

    const { customerName, customerEmail, customerPhone, packageId } = body

    if (!customerName || !customerEmail || !packageId) {
      console.log('Validation failed')
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    const { data: pkg, error: pkgErr } = await supabase
      .from('Package')
      .select('price')
      .eq('id', packageId)
      .single()

    console.log('Package:', pkg, 'Error:', pkgErr?.message)

    if (!pkg) return NextResponse.json({ error: 'Paket tidak ditemukan' }, { status: 404 })

    const { data: order, error: orderErr } = await supabase
      .from('Order')
      .insert({ customerName, customerEmail, customerPhone, packageId, status: 'PENDING' })
      .select()
      .single()

    console.log('Order:', order, 'Error:', orderErr?.message)

    if (orderErr) return NextResponse.json({ error: orderErr.message }, { status: 500 })

    await supabase.from('Payment').insert({ orderId: order.id, amount: pkg.price, status: 'PENDING' })

    return NextResponse.json({ success: true, data: order })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan'
    console.log('Catch error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}