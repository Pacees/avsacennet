"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, Calendar, MapPin } from "lucide-react"

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-md">
      
      {/* ÜST BİLGİ BARI (Genişletilmiş Top Bar) */}
      <div className="bg-slate-900 text-slate-300 text-xs sm:text-sm py-3 px-6 sm:px-12 border-b border-slate-800">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-3 " >
          
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span>Deniz Mh. 5012 Sk. No: 1 <strong>Avşa Adası/Marmara/Balıkesir</strong></span>
          </div>

          <div className="flex items-center gap-8">
            <a 
              href="mailto:avsacennet@gmail.com" 
              className="flex items-center gap-2 hover:text-white transition font-medium"
            >
              <Mail className="h-4 w-4 text-orange-400" />
              <span>avsacennet@gmail.com</span>
            </a>
            <a 
              href="tel:+905556354155" 
              className="flex items-center gap-2 hover:text-white transition font-semibold text-orange-400"
            >
              <Phone className="h-4 w-4" />
              <span><strong>+90 (555) 635 41 55</strong></span>
            </a>
          </div>

        </div>
      </div>

      {/* ANA NAVİGASYON BARI (Daha Büyük & Heybetli) */}
<div className="mx-auto max-w-7xl px-4 sm:px-6 py-2.5 flex items-center justify-between">
    {/* CUSTOM PNG LOGO ALANI (Küçültüldü: h-10 w-36 / sm:h-12 sm:w-44) */}
  <Link href="/" className="flex items-center gap-2 group">
    <div className="relative h-10 w-36 sm:h-12 sm:w-44 flex items-center">
      <Image
        src="/logo.png"
        alt="Avşa Cennet Logo"
        fill
        priority
        className="object-contain object-left transition transform group-hover:scale-105"
      />
    </div>
  </Link>

  {/* MENÜ LİNKLERİ (Kompakt: text-sm, gap-6) */}
  <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-800">
    <Link href="/" className="hover:text-orange-500 transition py-1 border-b-2 border-transparent hover:border-orange-500">
      Ana Sayfa
    </Link>
    <Link href="/daireler" className="hover:text-orange-500 transition py-1 border-b-2 border-transparent hover:border-orange-500">
      Dairelerimiz
    </Link>
    <Link href="/hakkimizda" className="hover:text-orange-500 transition py-1 border-b-2 border-transparent hover:border-orange-500">
      Hakkımızda
    </Link>
    <Link href="/iletisim" className="hover:text-orange-500 transition py-1 border-b-2 border-transparent hover:border-orange-500">
      İletişim
    </Link>
  </nav>

  {/* REZERVASYON YAP BUTONU (Kompakt: px-4 py-2, text-sm) */}

</div>
    </header>
  )
}