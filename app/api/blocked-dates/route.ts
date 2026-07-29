import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')

    // 1. Parameter Validation
    if (!propertyId) {
      return NextResponse.json(
        { error: 'propertyId parametresi zorunludur.' },
        { status: 400 }
      )
    }

    // 2. Fetch active bookings from Supabase
    // Only fetch check_in and check_out dates for active or pending reservations
    const { data: bookings, error } = await supabase
      .from('rezervasyonlar')
      .select('giris, cikis')
      .eq('daire_adi', propertyId)
      .in('onayli_mi', [true])
      .in("iptal", [false]);

    if (error) {
      console.error('Supabase get-blocked-dates hatası:', error)
      return NextResponse.json(
        { error: 'Dolu tarihler çekilirken bir hata oluştu.' },
        { status: 500 }
      )
    }

    // 3. Format response data for react-day-picker / standard frontend calendars
    const blockedDates = bookings.map((booking) => ({
      from: booking.giris,
      to: booking.cikis,
    }))

    return NextResponse.json(
      { blockedDates },
      { status: 200 }
    )
  } catch (err) {
    console.error('Sunucu Hatası:', err)
    return NextResponse.json(
      { error: 'Beklenmeyen bir sunucu hatası oluştu.' },
      { status: 500 }
    )
  }
}