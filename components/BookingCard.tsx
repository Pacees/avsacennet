"use client"

import * as React from "react"
import { format, startOfDay } from "date-fns"
import { tr } from "date-fns/locale"
import {
  Calendar as CalendarIcon,
  Wifi,
  Tv,
  Car,
  Coffee,
  ShieldCheck,
  User,
  Baby,
  Phone,
  Mail,
  Clock,
  UserCheck,
} from "lucide-react"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { AlertModal, AlertType } from "@/components/ui/AlertModal"

import { PROPERTIES } from "@/data/daireler"

// ============================================================================
// YARDIMCI FONKSİYONLAR
// ============================================================================
const calculateNights = (from?: Date, to?: Date): number => {
  if (!from || !to) return 0
  
  const startUTC = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())
  const endUTC = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate())
  const msPerDay = 86400000
  const diff = Math.round((endUTC - startUTC) / msPerDay)

  return diff > 0 ? diff : 0
}

const parseLocalDate = (dateInput: string | Date): Date => {
  if (typeof dateInput === 'string') {
    const cleanDate = dateInput.split('T')[0]
    const [year, month, day] = cleanDate.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  return startOfDay(dateInput)
}

// ============================================================================
// ANA BİLEŞEN
// ============================================================================
interface BookingCardProps {
  id: string
  blockedDates?: { from: string; to: string }[]
}

export function BookingCard({ id, blockedDates = [] }: BookingCardProps) {
  const property = PROPERTIES.find((p) => p.id === id)

  const CONFIG = {
    TITLE: property?.title || "Daire",
    PRICE_PER_NIGHT: property?.price || 0,
    CHECK_IN_TIME: "14:00",
    CHECK_OUT_TIME: "11:00",
    BLOCKED_RANGES: blockedDates || [],
  }

  // Form State'leri
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined)
  const [adults, setAdults] = React.useState<number>(2)
  const [children, setChildren] = React.useState<number>(0)
  const [fullName, setFullName] = React.useState<string>("")
  const [phone, setPhone] = React.useState<string>("")
  const [email, setEmail] = React.useState<string>("")
  const [loading, setLoading] = React.useState<boolean>(false)

  // Alert Popup State
  const [alertState, setAlertState] = React.useState<{
    isOpen: boolean
    type: AlertType
    title: string
    message: string
  }>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  })

  const showAlert = (type: AlertType, title: string, message: string) => {
    setAlertState({ isOpen: true, type, title, message })
  }

  // Gece ve Fiyat Hesaplamaları
  const nights = React.useMemo(
    () => calculateNights(dateRange?.from, dateRange?.to),
    [dateRange]
  )
  const totalPrice = React.useMemo(
    () => nights * CONFIG.PRICE_PER_NIGHT,
    [nights, CONFIG.PRICE_PER_NIGHT]
  )

  // 1. Kapalı Gün Kontrolü
  const isDateBlocked = (day: Date) => {
    const targetDay = startOfDay(day)
    const today = startOfDay(new Date())
    
    if (targetDay < today) return true

    return CONFIG.BLOCKED_RANGES.some((range) => {
      const from = parseLocalDate(range.from)
      const to = parseLocalDate(range.to)
      return targetDay >= from && targetDay < to
    })
  }

  // 2. Takvim Seçim Kontrolü (Aralıkta dolu gün varsa engeller)
  const handleDateSelect = (range: DateRange | undefined) => {
    if (!range?.from) {
      setDateRange(undefined)
      return
    }

    if (range.from && range.to) {
      let hasBlockedDayInside = false
      let current = new Date(range.from)

      while (current < range.to) {
        if (isDateBlocked(current)) {
          hasBlockedDayInside = true
          break
        }
        current.setDate(current.getDate() + 1)
      }

      if (hasBlockedDayInside) {
        showAlert("error", "Tarih Çakışması", "Seçtiğiniz tarihler arasında dolu günler bulunmaktadır. Lütfen farklı bir aralık seçiniz.")
        setDateRange({ from: range.from, to: undefined })
        return
      }
    }

    setDateRange(range)
  }

  // 3. Formu API Endpoint'ine Gönderme İşlemi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName || !phone || !email || !dateRange?.from || !dateRange?.to || nights === 0) {
      showAlert("info", "Eksik Bilgi", "Lütfen ad soyad, iletişim bilgileri ve tarih seçimlerini eksiksiz doldurun.")
      return
    }

    setLoading(true)

    const payload = {
      propertyId: id,
      checkIn: format(dateRange.from, "yyyy-MM-dd"),
      checkOut: format(dateRange.to, "yyyy-MM-dd"),
      adults,
      children,
      name: fullName,
      phone,
      email,
    }

    try {

      // Rezervasyonu DB'ye Kaydet
      const res = await fetch("/api/create-rez", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        showAlert("error", "Rezervasyon Hatası", data.error || "Rezervasyon oluşturulamadı.")
        return
      };

      // E-posta gönderme
      await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: payload.email,
        customerName: fullName,
        apartmentTitle: payload.propertyId,
        checkIn: payload.checkIn,
        checkOut: payload.checkOut,
        phone: payload.phone,
        adults: payload.adults,
        children: payload.children,
        totalPrice,
        deposit: data.deposit
      }),
    })

      showAlert(
        "success",
        "Talebiniz Alındı!",
        `Sayın ${fullName.split(" ").map(kelime => kelime.charAt(0).toUpperCase() + kelime.slice(1)).join(" ")},
        Rezervasyonunuzu hemen onaylayıp yerinizi ayırtmak için kapora tutarını EFT/Havale yapıp,
        dekont ve rezervasyonu yapan kişinin isim bilgisini WhatsApp üzerinden iletişim numaramızla paylaşınız.

        Toplam Tutar: ₺${totalPrice.toLocaleString("tr-TR")}

        Kapora Tutarı (EFT/Havale Yapınız):
        ₺${data.deposit.toLocaleString("tr-TR") || "Hesaplanamadı. Lütfen 0 (555) 635 41 55 ile irtibata geçiniz."}
        TR88 0001 5001 5800 7328 3126 62
        Selma Altun - Vakıfbank

        Kapora sonrası bakiye: ₺${data.deposit? (totalPrice - data.deposit).toLocaleString("tr-TR") : "-"} (Girişte tahsil edilir)

        Rezervasyon detaylarını ${email} e-posta adresinize gönderdik.
        İyi tatiller!
        `
      )
      
      // Formu Temizle
      setDateRange(undefined)
      setFullName("")
      setPhone("")
      setEmail("")
    } catch (err) {
      console.error("API İsteği Hatası:", err)
      showAlert("error", "Bağlantı Hatası", "Sunucu ile iletişim kurulurken bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card className="w-full max-w-md overflow-hidden rounded-2xl border-orange-200 bg-white shadow-lg">
        
        {/* CARD HEADER */}
        <CardHeader className="border-b border-orange-100 bg-orange-50/30 p-6">
          <div className="mb-1 flex items-center justify-between">
            <Badge className="bg-orange-500 text-white hover:bg-orange-600">
              Anında Onaylı
            </Badge>
            <div>
              <span className="text-3xl font-extrabold text-orange-600">
                ₺{CONFIG.PRICE_PER_NIGHT.toLocaleString("tr-TR")}
              </span>
              <span className="text-sm font-normal text-gray-500"> / gece</span>
            </div>
          </div>
          <CardTitle className="text-xl text-gray-900">{CONFIG.TITLE}</CardTitle>
        </CardHeader>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 p-6">
            
            {/* AMENITIES */}
            <div className="flex items-center justify-between border-y border-orange-100/70 py-2.5 text-sm text-gray-600">
              <span className="flex items-center gap-1"><Wifi className="h-4 w-4 text-orange-500" /> Wi-Fi</span>
              <span className="flex items-center gap-1"><Tv className="h-4 w-4 text-orange-500" /> Smart TV</span>
              <span className="flex items-center gap-1"><Coffee className="h-4 w-4 text-orange-500" /> Mutfak</span>
            </div>

            {/* DATE PICKER */}
<div className="space-y-1.5">
  <label className="text-xs font-semibold text-gray-700">Tarih Aralığı Seçin *</label>
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className="h-11 w-full justify-start text-left border-orange-200 shadow-sm hover:border-orange-500 focus:ring-orange-500"
      >
        <CalendarIcon className="mr-2.5 h-5 w-5 text-orange-500" />
        {dateRange?.from ? (
          dateRange.to ? (
            <span className="font-medium text-gray-900">
              {format(dateRange.from, "dd MMM yyyy", { locale: tr })} — {format(dateRange.to, "dd MMM yyyy", { locale: tr })}
            </span>
          ) : (
            <span className="font-medium text-gray-900">
              {format(dateRange.from, "dd MMM yyyy", { locale: tr })} — Çıkış Tarihi Seçin
            </span>
          )
        ) : (
          <span className="text-gray-400">Giriş - Çıkış Tarihi Seçin</span>
        )}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        mode="range"
        selected={dateRange}
        onSelect={handleDateSelect}
        numberOfMonths={1}
        disabled={isDateBlocked}
        locale={tr}             
        weekStartsOn={1}         
        className="pointer-events-auto p-3"
      />
    </PopoverContent>
  </Popover>
</div>

            {/* GUEST COUNTS */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                  <User className="h-3.5 w-3.5 text-orange-500" /> Yetişkin *
                </label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="h-10 w-full rounded-md border border-orange-200 bg-white px-3 text-sm focus:border-orange-500 focus:outline-none"
                  required
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>{num} Yetişkin</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                  <Baby className="h-3.5 w-3.5 text-orange-500" /> Çocuk
                </label>
                <select
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  className="h-10 w-full rounded-md border border-orange-200 bg-white px-3 text-sm focus:border-orange-500 focus:outline-none"
                >
                  {[0, 1, 2, 3, 4].map((num) => (
                    <option key={num} value={num}>{num} Çocuk</option>
                  ))}
                </select>
              </div>
            </div>

            {/* CONTACT INPUTS */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                <UserCheck className="h-3.5 w-3.5 text-orange-500" /> Ad Soyad *
              </label>
              <input
                type="text"
                placeholder="İsim Soyisim"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-10 w-full rounded-md border border-orange-200 px-3 text-sm focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                <Phone className="h-3.5 w-3.5 text-orange-500" /> Telefon *
              </label>
              <input
                type="tel"
                placeholder="05XX XXX XX XX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 w-full rounded-md border border-orange-200 px-3 text-sm focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                <Mail className="h-3.5 w-3.5 text-orange-500" /> E-posta *
              </label>
              <input
                type="email"
                placeholder="E-posta adresiniz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-md border border-orange-200 px-3 text-sm focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            {/* PRICE SUMMARY */}
            {nights > 0 && (
              <div className="space-y-3 rounded-xl border border-orange-100 bg-orange-50/50 p-4 shadow-inner">
                <h4 className="border-b border-orange-100/70 pb-2 text-sm font-bold text-gray-900">
                  Fiyat Detayı
                </h4>
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>₺{CONFIG.PRICE_PER_NIGHT.toLocaleString("tr-TR")} x {nights} gece</span>
                  <span className="font-semibold text-gray-900">₺{totalPrice.toLocaleString("tr-TR")}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Temizlik Ücreti</span>
                  <span>₺0 (Ücrete Dahil)</span>
                </div>
                <div className="flex items-center justify-between border-t border-orange-100 pt-2 text-lg font-extrabold text-orange-600">
                  <span>Toplam Tutar</span>
                  <span>₺{totalPrice.toLocaleString("tr-TR")}</span>
                </div>
              </div>
            )}

            {/* CHECK-IN / CHECK-OUT INFO */}
            <div className="flex items-center justify-between rounded-lg border border-gray-200/80 bg-gray-50 p-3 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 shrink-0 text-orange-500" />
                <span>Giriş: <strong className="text-gray-900">{CONFIG.CHECK_IN_TIME}</strong> sonrası</span>
              </div>
              <div className="h-3 w-px bg-gray-300" />
              <div>
                <span>Çıkış: en geç <strong className="text-gray-900">{CONFIG.CHECK_OUT_TIME}</strong></span>
              </div>
            </div>

          </CardContent>

          {/* SUBMIT BUTTON */}
          <CardFooter className="border-t border-gray-100 bg-gray-50/50 p-3">
            <Button
              type="submit"
              disabled={loading}
              className="h-14 w-full rounded-xl bg-orange-500 text-lg font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 disabled:opacity-50"
            >
              <ShieldCheck className="mr-2 h-6 w-6" /> 
              {loading ? "Gönderiliyor..." : "Rezervasyon Talebi Gönder"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* ALERT POPUP MODAL */}
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
      />
    </>
  )
}