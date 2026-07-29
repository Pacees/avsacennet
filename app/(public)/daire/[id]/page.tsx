import { notFound } from "next/navigation"
import Link from "next/link"
import { PROPERTIES } from "@/data/daireler"
import { BookingCard } from "@/components/BookingCard"
import { PhotoGallery } from "@/components/PhotoGallery"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Star, Users, Bed, Bath } from "lucide-react"
import { ScrollToBookingButton } from "@/components/ScrollToBookingButton"

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params
  const property = PROPERTIES.find((p) => p.id === id)

  if (!property) {
    notFound()
  }

  // 1. Kapalı tarihleri doğrudan Sunucu Tarafında (Server Component) çekiyoruz
  let blockedDates = []
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/blocked-dates?propertyId=${id}`,
      { cache: "no-store" }
    )
    if (res.ok) {
      const data = await res.json()
      blockedDates = data.blockedDates || []
    }
  } catch (error) {
    console.error("Kapalı tarihler çekilirken hata oluştu:", error)
  }

  return (
    <main className="min-h-screen bg-orange-50/20 p-4 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Geri Dön Butonu */}
        <Link href="/">
          <Button variant="ghost" className="text-gray-600 hover:text-orange-600 hover:bg-orange-100/50">
            <ArrowLeft className="mr-2 h-4 w-4" /> Tüm Dairelere Dön
          </Button>
        </Link>

        {/* Başlık & Konum */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center text-xs font-semibold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">
              <Star className="w-3 h-3 fill-orange-500 mr-1" /> {property.rating}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-orange-500" /> {property.location}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">{property.title}</h1>
          
          {/* Mobilde Görünen Hızlı Kaydırma Butonu */}
          <ScrollToBookingButton />
        </div>

        {/* İçerik Düzeni: Sol Galeri & Detay, Sağ Rezervasyon Kartı */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Sol Kolon */}
          <div className="lg:col-span-2 space-y-6">
            <PhotoGallery images={property.images} />

            {/* Daire Özellik Detayları */}
            <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Daire Özellikleri</h2>
              <div className="grid grid-cols-3 gap-4 text-center py-2 border-y border-gray-100">
                <div className="space-y-1">
                  <Users className="w-5 h-5 mx-auto text-orange-500" />
                  <p className="text-xs text-gray-500">Kapasite</p>
                  <p className="text-sm font-semibold">{property.specs.guests} Misafir</p>
                </div>
                <div className="space-y-1">
                  <Bed className="w-5 h-5 mx-auto text-orange-500" />
                  <p className="text-xs text-gray-500">Yatak Odası</p>
                  <p className="text-sm font-semibold">{property.specs.bedrooms} Oda / {property.specs.beds} Yatak</p>
                </div>
                <div className="space-y-1">
                  <Bath className="w-5 h-5 mx-auto text-orange-500" />
                  <p className="text-xs text-gray-500">Banyo</p>
                  <p className="text-sm font-semibold">{property.specs.baths} Banyo</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed pt-2">
                {property.description} <br /> <br />Turistik Kiralama İzin Belge No: 10-2084
              </p>
            </div>
          </div>

          {/* Sağ Kolon: Rezervasyon Yapma Kartı (ID Güncellendi: rezervasyon-formu) */}
          <div className="lg:sticky lg:top-8 scroll-mt-24" id="rezervasyon-formu">
            <BookingCard id={id} blockedDates={blockedDates} />
          </div>

        </div>

      </div>
    </main>
  )
}