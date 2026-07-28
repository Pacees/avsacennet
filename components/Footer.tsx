"use client"

import * as React from "react"
import Link from "next/link"
import { Phone, Mail, MapPin, ShieldCheck } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* LOGO & KURUMSAL BİLGİ */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-lg">
              A
            </div>
            <span className="font-bold text-lg text-white">Avşa Apart</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Avşa Adası'nın kalbinde, konforlu ve huzurlu bir tatil deneyimi sunan günlük kiralık daireler ve konaklama hizmetleri.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="h-4 w-4" />
            <span>Güvenli & Onaylı Konaklama</span>
          </div>
        </div>

        {/* HIZLI ERİŞİM */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm tracking-wide">Hızlı Bağlantılar</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/" className="hover:text-orange-400 transition">Ana Sayfa</Link>
            </li>
            <li>
              <Link href="/daireler" className="hover:text-orange-400 transition">Dairelerimiz & Fiyatlar</Link>
            </li>
            <li>
              <Link href="/hakkimizda" className="hover:text-orange-400 transition">Hakkımızda</Link>
            </li>
            <li>
              <Link href="/iletisim" className="hover:text-orange-400 transition">İletişim & Ulaşım</Link>
            </li>
          </ul>
        </div>

        {/* YASAL / KURUMSAL DETAYLAR */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm tracking-wide">Yasal & Politika</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/kvkk" className="hover:text-orange-400 transition">KVKK Aydınlatma Metni</Link>
            </li>
            <li>
              <Link href="/gizlilik-politikasi" className="hover:text-orange-400 transition">Gizlilik Politikası</Link>
            </li>
            <li>
              <Link href="/iptal-kosullari" className="hover:text-orange-400 transition">İptal ve İade Koşulları</Link>
            </li>
            <li>
              <Link href="/konaklama-kurallari" className="hover:text-orange-400 transition">Mesafeli Satış Sözleşmesi</Link>
            </li>
          </ul>
        </div>

        {/* İLETİŞİM DETAYLARI */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm tracking-wide">İletişim</h4>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
              <span>Avşa Mahallesi, Okul Cad. No:12, Avşa Adası / Balıkesir</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-orange-500 shrink-0" />
              <a href="tel:+905551234567" className="hover:text-white transition">+90 (555) 123 45 67</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-orange-500 shrink-0" />
              <a href="mailto:info@avsaapart.com" className="hover:text-white transition">info@avsaapart.com</a>
            </li>
          </ul>
        </div>

      </div>

      {/* COPYRIGHT BARI */}
      <div className="border-t border-slate-800 bg-slate-950 py-4 px-4 sm:px-8 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Avşa Apart Konaklama Hizmetleri. Tüm hakları saklıdır.</p>
          <p className="text-slate-600">Tasarlanmış & Geliştirilmiştir</p>
        </div>
      </div>
    </footer>
  )
}