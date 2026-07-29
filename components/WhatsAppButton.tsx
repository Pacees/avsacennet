'use client';

import React from 'react';
import { FloatingWhatsApp } from 'react-floating-whatsapp';

export function WhatsAppButton() {
  return (
    <FloatingWhatsApp
      phoneNumber="905556354155" // Başında + olmadan ülke koduyla birlikte numaranız
      accountName="Destek Hattı" // Pop-up üstündeki isim
      avatar="/whatsapp.png" // İsteğe bağlı: Public klasörünüzdeki profil resmi yolu
      statusMessage="Genellikle birkaç dakika içinde yanıt verir" // Durum metni
      chatMessage={`Merhaba! 👋 \nSize nasıl yardımcı olabiliriz?`} // Varsayılan karşılama mesajı
      placeholder="Mesajınızı yazın..." // Input yönlendirme metni
      allowClickAway={false} // Dışarı tıklayınca kapanması için
      notification={true} // Bildirim sesi/rozeti için
      notificationSound={true}
      buttonStyle={{ position: 'fixed', right: '20px', bottom: '20px' }}
    />
  );
}