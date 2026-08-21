import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const invitationId = searchParams.get('invitationId')

  if (!invitationId) return NextResponse.json({ error: 'invitationId diperlukan' }, { status: 400 })

  const { data, error } = await supabase
    .from('Rsvp')
    .select('*')
    .eq('invitationId', invitationId)
    .order('createdAt', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { invitationId, guestName, attending, guestCount, message } = body

    if (!invitationId || !guestName) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('Rsvp')
      .insert({
        invitationId,
        guestName,
        attending: Boolean(attending),
        guestCount: Number(guestCount) || 1,
        message: message || null
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}