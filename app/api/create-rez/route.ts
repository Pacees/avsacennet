import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { PROPERTIES } from '@/data/daireler';


export const dynamic = 'force-dynamic';
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

        const property = PROPERTIES.filter(item => item.id == propertyId);
        if(!property) {
            return NextResponse.json(
        { error: 'Geçersiz daire seçimi.' },
        { status: 400 }
      )};

      if (!checkIn || !checkOut || !name || !phone || !email) {
      return NextResponse.json(
        { error: 'Lütfen tüm zorunlu alanları eksiksiz doldurun.' },
        { status: 400 }
      );

      }
        if(!adults) {
        return NextResponse.json(
        { error: 'Bir hata oluştu. Rezervasyon için lütfen 0 (555) 635 41 55 telefon numarası ile bizimle iletişime geçin.' },
        { status: 400 })};

        //Gece Sayısını Backend'de Güvenli Olarak Hesapla
    const startDate = new Date(checkIn)
    const endDate = new Date(checkOut)

    // Tarih geçerliliği ve mantık kontrolü (Çıkış tarihi girişten önce veya eşit olamaz)
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate <= startDate) {
      return NextResponse.json(
        { error: 'Geçersiz giriş veya çıkış tarihi seçildi.' },
        { status: 400 }
      )
    }

    // İki tarih arasındaki gece sayısını milisaniye üzerinden hesapla
    const diffInMs = endDate.getTime() - startDate.getTime()
    const nights = Math.round(diffInMs / (1000 * 60 * 60 * 24))


        // Toplam Fiyat Hesaplaması
        console.log(property);
        const calculatedTotalPrice = property[0].price * nights;

        //Kapora Hesaplama
        const calculatedDeposit = calculatedTotalPrice / 5;
        const roundedDeposit = Math.round(calculatedDeposit / 50) * 50;


            // DB'den tarih kontrolü
        const { data: existingBookings, error: checkError } = await supabase
        .from('rezervasyonlar')
        .select('daire_adi')
        .eq('daire_adi', propertyId)
        .eq('onayli_mi', true)
        .eq("iptal",false)
        .lt('giris', checkOut)
        .gt('cikis', checkIn);

      if (checkError) {
      console.error('Supabase Sorgu Hatası:', checkError)
      return NextResponse.json(
        { error: 'Tarih kontrolü yapılırken bir hata oluştu.' },
        { status: 500 }
      )
    };

    if (existingBookings && existingBookings.length > 0) {
      return NextResponse.json(
        { error: 'Seçilen tarihler arasında daire doludur.' },
        { status: 409 }
      )
    };

    //DB'ye kayıt
    const { data: newBooking, error: insertError } = await supabase
      .from('rezervasyonlar')
      .insert([
        {
          daire_adi: propertyId,
          giris: checkIn,
          cikis: checkOut,
          gece: nights,
          yetiskin: adults,
          cocuk: children || 0,
          isim: name,
          telefon: phone,
          mail: email,
          fiyat: calculatedTotalPrice,
          kapora: roundedDeposit
        },
      ])
      .select()
      .single();

      if(insertError) {
        console.log(insertError);
         return NextResponse.json(
        { error: 'Hata.' },
        { status: 409 }
      )
      }

        console.log(property);
        console.log(propertyId);

        return NextResponse.json(
      { message: 'Rezervasyon talebiniz alındı!',
        deposit: roundedDeposit
      },
      { status: 201 }
    )
    } catch(error){
        console.log(error);

        return NextResponse.json(
        { error: 'Hata.' },
        { status: 409 }
      )
    }




}