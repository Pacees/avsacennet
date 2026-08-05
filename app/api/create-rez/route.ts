import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { PROPERTIES } from '@/data/daireler';

export const dynamic = 'force-dynamic';

function nightsBetween(startISO: string, endISO: string) {
  const s = new Date(startISO);
  const e = new Date(endISO);
  const utcStart = Date.UTC(s.getFullYear(), s.getMonth(), s.getDate());
  const utcEnd = Date.UTC(e.getFullYear(), e.getMonth(), e.getDate());
  return Math.floor((utcEnd - utcStart) / (1000 * 60 * 60 * 24));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      propertyId,
      checkIn,
      checkOut,
      adults,
      children,
      name,
      phone,
      email,
    } = body;

    // Basic validation
    if (!propertyId) {
      return NextResponse.json({ error: 'propertyId parametresi gereklidir.' }, { status: 400 });
    }

    // Normalize property id to string for comparison with PROPERTIES
    const property = PROPERTIES.find((item) => String(item.id) === String(propertyId));
    if (!property) {
      return NextResponse.json({ error: 'Geçersiz daire seçimi.' }, { status: 400 });
    }

    if (!checkIn || !checkOut || !name || !phone || !email) {
      return NextResponse.json({ error: 'Lütfen tüm zorunlu alanları eksiksiz doldurun.' }, { status: 400 });
    }

    if (!adults) {
      return NextResponse.json(
        { error: 'Bir hata oluştu. Rezervasyon için lütfen 0 (555) 635 41 55 telefon numarası ile bizimle iletişime geçin.' },
        { status: 400 }
      );
    }

    // Gece sayısını güvenli hesapla
    const nights = nightsBetween(checkIn, checkOut);
    if (isNaN(nights) || nights <= 0) {
      return NextResponse.json({ error: 'Geçersiz giriş veya çıkış tarihi seçildi.' }, { status: 400 });
    }

    // Toplam Fiyat Hesaplaması
    const calculatedTotalPrice = (property as any).price * nights;

    //Kapora Hesaplama - sabit olarak bırakıldı
    const roundedDeposit = 5000;

    // DB'den tarih kontrolü (normalize propertyId to string)
    const { data: existingBookings, error: checkError } = await supabase
      .from('rezervasyonlar')
      .select('daire_adi')
      .eq('daire_adi', String(propertyId))
      .eq('onayli_mi', true)
      .eq('iptal', false)
      .lt('giris', checkOut)
      .gt('cikis', checkIn);

    if (checkError) {
      console.error('Supabase Sorgu Hatası:', checkError);
      return NextResponse.json({ error: 'Tarih kontrolü yapılırken bir hata oluştu.' }, { status: 500 });
    }

    if (existingBookings && existingBookings.length > 0) {
      return NextResponse.json({ error: 'Seçilen tarihler arasında daire doludur.' }, { status: 409 });
    }

    //DB'ye kayıt
    const { data: newBooking, error: insertError } = await supabase
      .from('rezervasyonlar')
      .insert([
        {
          daire_adi: String(propertyId),
          giris: checkIn,
          cikis: checkOut,
          gece: nights,
          yetiskin: adults,
          cocuk: children || 0,
          isim: name,
          telefon: phone,
          mail: email,
          fiyat: calculatedTotalPrice,
          kapora: roundedDeposit,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Supabase Insert Hatası:', insertError);
      return NextResponse.json({ error: 'Rezervasyon kaydı sırasında bir hata oluştu.' }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: 'Rezervasyon talebiniz alındı!',
        deposit: roundedDeposit,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('create-rez hata:', error);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
