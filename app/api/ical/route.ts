import { NextResponse } from 'next/server';
import { createEvents, EventAttributes } from 'ics';

// BURA YERİNE KENDİ VERİTABANI/REZERVASYON ÇEKME FONKSİYONUNUZU KOYUN
async function getMyBookings() {
  // Örnek: Veritabanınızdan veya state'inizden gelen aktif rezervasyonlar
  return [
    {
      id: 'res-1',
      checkIn: '2026-08-10',  // YYYY-MM-DD
      checkOut: '2026-08-15',
      title: 'Dolu - Avşa Cennet',
    },
  ];
}

export async function GET() {
  try {
    const bookings = await getMyBookings();

    const events: EventAttributes[] = bookings.map((b) => {
      const start = new Date(b.checkIn);
      const end = new Date(b.checkOut);

      return {
        start: [start.getFullYear(), start.getMonth() + 1, start.getDate()],
        end: [end.getFullYear(), end.getMonth() + 1, end.getDate()],
        title: b.title || 'Dolu',
        description: 'Avşa Cennet Web Sitesi Rezervasyonu',
      };
    });

    const { error, value } = createEvents(events);

    if (error || !value) {
      return NextResponse.json({ error: 'iCal oluşturulamadı' }, { status: 500 });
    }

    // .ics formatında yanıt döndür yapısı
    return new NextResponse(value, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="avsacennet.ics"',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}