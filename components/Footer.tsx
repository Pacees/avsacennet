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
            <span className="font-bold text-lg text-white">Avşa adası hakkında</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Marmara Denizi ortasında Kapıdağ Yarımadası'nın uzantısında oluşmuş adalar grubundan biri. <br />
Bir ismi Avşa, diğer ismi Türkeli, halk arasında ise Şarap Adası olarak ünlenmiş. <br /> İstanbul'a çok yakın olmasına rağmen İstanbul'dan çok farklı. Marmara'dan Çanakkale Boğazı'na kucak açmış. Ege havası var.
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
              <span>Deniz Mahallesi, 5012 Sk. No:1 Avşa Adası / Marmara / Balıkesir</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-orange-500 shrink-0" />
              <a href="tel:+905556354155" className="hover:text-white transition">+90 (555) 635 41 55</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-orange-500 shrink-0" />
              <a href="mailto:avsacennet@gmail.com" className="hover:text-white transition">avsacennet@gmail.com</a>
            </li>
          </ul>
        </div>

      </div>

      {/* COPYRIGHT BARI */}
      <div className="border-t border-slate-800 bg-slate-950 py-4 px-4 sm:px-8 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Avşa Cennet Tüm hakları saklıdır.</p>
          <p className="text-slate-600">Arda Altun Tarafından Tasarlanmış & Geliştirilmiştir</p>
        </div>
      </div>
    </footer>
  )
}