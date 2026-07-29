"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Maximize2, X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
};

const GALLERY_IMAGES: GalleryImage[] = [
  { src: '/gallery/home/1.jpg', alt: 'bir başka', title: "Avşa'da gün batımı" },
  { src: '/gallery/home/0.jpg', alt: 'bir başka', title: "Avşa'da huzur" },
  { src: '/gallery/home/3.jpg', alt: '', title: "Temiz plajlar" },
  { src: '/gallery/home/2.jpg', alt: '', title: "Avşa'ya kuş bakışı" },
  { src: '/gallery/home/5.jpg', alt: '', title: 'Adanın eşsiz koylarını keşfedin' },
];

export function HomeGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev === 0 ? GALLERY_IMAGES.length - 1 : (prev as number) - 1));
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev === GALLERY_IMAGES.length - 1 ? 0 : (prev as number) + 1));
    }
  };

  // Alt section'a yumuşak kaydırma fonksiyonu
  const scrollToReservation = () => {
    // 1. Hedef elementi ID ile bul (İsimlerin birebir aynı olması şart)
    const targetElement = document.getElementById('rezervasyon-alani');

    if (targetElement) {
      // 2. Element bulunduysa kaydır
      targetElement.scrollIntoView({ 
        behavior: 'smooth', // Yumuşak kaydırma
        block: 'start'      // Elementin başını ekranın tepesine hizala
      });
    } else {
      // 3. Element bulunamazsa konsola hata yaz (Hata ayıklama için kritik)
      console.error("HATA: #rezervasyon-alani ID'li element sayfa üzerinde bulunamadı!");
      alert("Rezervasyon bölümü şu an bulunamadı, lütfen sayfayı yenileyin.");
    }
  };


  return (
    <section className="py-8 md:py-16 bg-orange-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Başlık Alanı */}
        <div className="text-center max-w-2xl mx-auto mb-6 md:mb-10 space-y-1.5">
          <span className="text-orange-600 font-semibold text-xs uppercase tracking-wider bg-orange-100 px-3 py-1 rounded-full inline-block">
            Avşa'da Tatil
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900">
            Cennet’ten Kareler
          </h2>
          <p className="text-gray-600 text-xs md:text-base">
            Adamızın eşsiz güzelliklerinden öne çıkan karelere göz atın.
          </p>

          {/* SADECE MOBİLDE GÖRÜNEN HIZLI REZERVASYON BUTONU */}
          <div className="block md:hidden pt-3">
            <button
              onClick={scrollToReservation}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 active:bg-orange-600 text-white py-2.5 px-4 rounded-xl font-semibold text-sm shadow-sm transition-all active:scale-[0.98]"
            >
              <Calendar className="h-4 w-4" />
              <span>Hemen Rezerve Et</span>
            </button>
          </div>
        </div>

        {/* Mobilde 2 Kolonlu Kompakt Grid / Masaüstünde Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 h-auto md:h-[500px]">
          {GALLERY_IMAGES.map((img, index) => {
            const isFeatured = index === 0;

            return (
              <div
                key={index}
                onClick={() => openLightbox(index)}
                className={`relative group overflow-hidden rounded-xl md:rounded-2xl cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 w-full ${
                  isFeatured 
                    ? 'col-span-2 row-span-1 md:row-span-2 aspect-[16/9] md:aspect-auto md:h-full' 
                    : 'col-span-1 aspect-square md:aspect-auto md:h-full'
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5 md:p-4 text-white">
                  <div className="flex items-end justify-between gap-1">
                    <div>
                      <p className="font-bold text-xs md:text-base leading-tight">{img.title}</p>
                      <p className="text-[10px] md:text-xs text-gray-200 line-clamp-1 hidden sm:block">{img.alt}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md p-1 md:p-2 rounded-full shrink-0">
                      <Maximize2 className="w-3.5 h-3.5 md:w-5 md:h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox / Tam Ekran Modal */}
      {selectedIndex !== null && (
        <div 
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
        >
          {/* Kapat Butonu */}
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Sol Ok */}
          <button 
            onClick={prevImage}
            className="absolute left-2 md:left-6 z-50 text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Görsel Alanı */}
          <div className="relative w-full h-[75vh] max-w-5xl flex items-center justify-center">
            <Image
              src={GALLERY_IMAGES[selectedIndex].src}
              alt={GALLERY_IMAGES[selectedIndex].alt}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Sağ Ok */}
          <button 
            onClick={nextImage}
            className="absolute right-2 md:right-6 z-50 text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Alt Bilgi */}
          <div className="absolute bottom-4 text-center text-white space-y-1 px-4">
            <p className="font-semibold text-sm md:text-base">{GALLERY_IMAGES[selectedIndex].title}</p>
            <p className="text-xs text-gray-400">{selectedIndex + 1} / {GALLERY_IMAGES.length}</p>
          </div>
        </div>
      )}
    </section>
  );
}