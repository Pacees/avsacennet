"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { createBrowserClient } from "@supabase/ssr"
import { PROPERTIES } from "@/data/daireler"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Users, Bed, Calendar as CalendarIcon, Search, X } from "lucide-react"

export default function Home() {
  const supabase = React.useMemo(() => {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    )
  }, [])

  const [checkIn, setCheckIn] = React.useState("")
  const [checkOut, setCheckOut] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [filteredProperties, setFilteredProperties] = React.useState(PROPERTIES)
  const [isFiltered, setIsFiltered] = React.useState(false)

  // Metinleri kıyaslama için normalize eden yardımcı fonksiyon
  const normalizeText = (text: string) => {
    if (!text) return ""
    return text
      .toLowerCase()
      .trim()
      .replace(/ı/g, "i")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]/g, "") // Özel karakter ve boşlukları siler (Örn: "Daire 1" -> "daire1")
  }

  // Tarih Filtreleme Logic
  const handleFilter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkIn || !checkOut) return

    setLoading(true)

    try {
      // Çakışan (dolu) rezervasyonları Supabase'den çek
      const { data: busyReservations, error } = await supabase
        .from("rezervasyonlar")
        .select("daire_adi")
        .or("iptal.is.null,iptal.eq.false")
        .lt("giris", checkOut)
        .gt("cikis", checkIn)

      if (error) {
        console.error("Supabase sorgu hatası:", error)
        setLoading(false)
        return
      }

      console.log("Supabase'den Dönen Dolu Kayıtlar:", busyReservations)

      // Dolu dairelerin isimlerini normalize et
      const busyNormalizedNames = busyReservations
        ? busyReservations.map((r) => normalizeText(r.daire_adi))
        : []

      // Müsait olanları filtrele
      const available = PROPERTIES.filter((property) => {
        const titleNormalized = normalizeText(property.title)
        const idNormalized = normalizeText(String(property.id))

        // Dairenin title'ı, id'si veya veritabanındaki daire_adi birbiri içinde geçiyor mu?
        const isBusy = busyNormalizedNames.some((busy) => {
          if (!busy) return false
          return (
            titleNormalized.includes(busy) ||
            busy.includes(titleNormalized) ||
            busy.includes(idNormalized)
          );
        })

        return !isBusy
      })

      setFilteredProperties(available)
      setIsFiltered(true)
    } catch (err) {
      console.error("Filtreleme hatası:", err)
    } finally {
      setLoading(false)
    }
  }

  // Filtreyi Temizle
  const handleReset = () => {
    setCheckIn("")
    setCheckOut("")
    setFilteredProperties(PROPERTIES)
    setIsFiltered(false)
  }

  return (
    <main className="min-h-screen bg-orange-50/30 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Badge className="bg-orange-500 text-white hover:bg-orange-600">Avşa Kiralık Daireler</Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900">
            Avşa Cennet'ten yerinizi seçin
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
            Konforlu, temiz ve denize yakın dairelerimiz arasından seçiminizi yapın, anında rezervasyon talebi gönderin.
          </p>
        </div>

        {/* Tarih Filtreleme Barı */}
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-orange-100 max-w-3xl mx-auto">
          <form onSubmit={handleFilter} className="flex flex-col sm:flex-row items-center gap-3">
            
            {/* Giriş Tarihi */}
            <div className="w-full sm:w-1/2 relative">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Giriş Tarihi</span>
              <input
                type="date"
                required
                value={checkIn}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-orange-50/40 border border-orange-100 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-orange-500 transition"
              />
            </div>

            {/* Çıkış Tarihi */}
            <div className="w-full sm:w-1/2 relative">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Çıkış Tarihi</span>
              <input
                type="date"
                required
                value={checkOut}
                min={checkIn || new Date().toISOString().split("T")[0]}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-orange-50/40 border border-orange-100 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-orange-500 transition"
              />
            </div>

            {/* Butonlar */}
            <div className="w-full sm:w-auto flex gap-2 pt-4 sm:pt-0 self-end">
              <button
                type="submit"
                disabled={loading || !checkIn || !checkOut}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap shadow-sm shadow-orange-200"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{loading ? "Sorgulanıyor..." : "Müsait Daireler"}</span>  
              </button>

              {isFiltered && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold text-xs px-3 py-2.5 rounded-xl transition cursor-pointer"
                  title="Filtreyi Temizle"
                >
                  <X className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Temizle</span>
                </button>
              )}
            </div>

          </form>

          {/* Filtrelenmiş Bilgi Notu */}
          {isFiltered && (
            <div className="mt-3 pt-3 border-t border-orange-50 flex items-center justify-between text-xs text-orange-800">
              <span>Seçilen tarihlerde <strong>{filteredProperties.length}</strong> adet boş daire bulundu.</span>
              <span className="font-medium bg-orange-100 px-2 py-0.5 rounded text-[11px]">{checkIn} → {checkOut}</span>
            </div>
          )}
        </div>

        {/* Daire Kartları Grid'i */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-orange-100 space-y-2">
            <p className="text-gray-800 font-bold">Seçilen tarihlerde müsait daire bulunamadı.</p>
            <p className="text-xs text-gray-500">Lütfen farklı tarihler seçerek tekrar deneyin.</p>
            <button
              onClick={handleReset}
              className="mt-2 text-xs font-bold text-orange-600 hover:underline cursor-pointer"
            >
              Tüm daireleri göster
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Link key={property.id} href={`/daire/${property.id}`}>
                <Card className="overflow-hidden border-orange-100 hover:border-orange-400 hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white h-full flex flex-col justify-between">
                  <div>
                    {/* Fotoğraf */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={property.coverImage}
                        alt={property.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-gray-800 flex items-center gap-1 shadow">
                        <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                        {property.rating}
                      </div>
                    </div>

                    {/* İçerik */}
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center text-xs text-orange-600 font-medium gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {property.location}
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                        {property.title}
                      </h3>
                      
                      {/* Özellik Rozetleri */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-orange-500" /> {property.specs.guests} Kişi
                        </span>
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-orange-500" /> {property.specs.bedrooms} Odalı
                        </span>
                      </div>
                    </CardContent>
                  </div>

                  {/* Fiyat Alanı */}
                  <div className="px-5 pb-5 pt-0 flex justify-between items-center border-t border-gray-50 mt-2">
                    <span className="text-xs text-gray-400">Gecelik Fiyat</span>
                    <div className="text-right">
                      <span className="text-xl font-bold text-orange-600">₺{property.price.toLocaleString("tr-TR")}</span>
                      <span className="text-xs text-gray-500"> / gece</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}