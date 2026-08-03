import React from 'react';
import { MapPin, Navigation, Phone, Clock } from 'lucide-react'; // İkonlar için (lucide-react kurulu değilse ikonları kaldırabilirsiniz)

export const metadata = {
  title: 'Konum ve Ulaşım | Avşa Cennet',
  description: 'Avşa Cennet harita konumu, açık adres ve doğrudan yol tarifi bilgileri.',
};

export default function LocationPage() {

  const mapEmbedUrl =
    'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d189.59003311876367!2d27.501589758505585!3d40.50975306413524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1str!2str!4v1785700772487!5m2!1str!2str';
  
  const googleMapsDirectionsUrl =
    'https://www.google.com/maps/dir//40.5098598,27.5017876/@40.5097228,27.5015318,20.61z/data=!4m2!4m1!3e3?entry=ttu&g_ep=EgoyMDI2MDcyOS4wIKXMDSoASAFQAw%3D%3D';

    const appleMapsDirectionUrl = 
    "https://maps.apple.com/directions?destination=5012.+Sk.+3%2C+5012.+Sk.+3+10360+Marmara+Bal%C4%B1kesir+T%C3%BCrkiye&mode=walking"

    const yandexNaviDirectionUrl =
    "https://yandex.com.tr/maps/115884/marmara/?ll=27.501628%2C40.509851&mode=routes&rtext=~40.509860%2C27.501779&rtt=pd&ruri=~&z=20.89"

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Başlık Bölümü */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Konum ve Ulaşım
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Yerimize kolayca ulaşabilmeniz için harita konumumuz ve yol tarifi detayları aşağıda yer almaktadır.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Sol Kolon: İletişim & Yol Tarifi Butonu */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6 lg:col-span-1">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-3">
              Ulaşım Bilgileri
            </h2>

            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">Açık Adres</p>
                  <p>Deniz Mh. 5012 Sk. No: 1 Avşa Adası / Marmara / Balıkesir</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">Giriş / Çıkış Saatleri</p>
                  <p>Giriş (Check-in): 14:00</p>
                  <p>Çıkış (Check-out): 11:00</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">İletişim</p>
                  <p>+90 (555) 635 41 55</p>
                </div>
              </div>
            </div>

            {/* Yol Tarifi Al Butonu */}

            <p className="font-semibold text-gray-800">Yol Tarifi Al</p>

            <div className='flex items-center gap-10 justify-start'>
                <div className='flex flex-col items-center justify-center gap-2'><a href={googleMapsDirectionsUrl}><img src="/google-maps.png" alt="" className='h-9' /></a> <p className='text-xs text-center'>Google Maps</p> </div>
                <div className='flex flex-col items-center gap-2'><a href={appleMapsDirectionUrl}><img src="/apple-maps.png" alt="" className='h-9' /></a> <p className='text-xs text-center'>Apple Harita</p> </div>
                <div className='flex flex-col items-center gap-2'><a href={yandexNaviDirectionUrl}><img src="/yandex-navi.png" alt="" className='h-9' /></a> <p className='text-xs text-center'>Yandex Navi</p> </div>
            </div>

        </div>


          {/* Sağ Kolon: Google Maps Embed Harita */}
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 h-[450px] overflow-hidden">
            <iframe
              title="Avşa Cennet Konum Haritası"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-xl"
            />
          </div>

        </div>

      </div>
    </main>
  );
}