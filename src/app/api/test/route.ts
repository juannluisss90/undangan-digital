import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const { data, error } = await supabase.from('User').select('*').limit(1)


    return NextResponse.json({
        keyLength: key.length,
        data,
        error: error?.message
    })
}