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
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-3">
          
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span>Deniz Mh. 5012 Sk. Avşa / Marmara / Balıkesir</span>
          </div>

          <div className="flex items-center gap-8">
            <a 
              href="mailto:bilgi@avsacennet.com" 
              className="flex items-center gap-2 hover:text-white transition font-medium"
            >
              <Mail className="h-4 w-4 text-orange-400" />
              <span>bilgi@avsacennet.com</span>
            </a>
            <a 
              href="tel:+905551234567" 
              className="flex items-center gap-2 hover:text-white transition font-semibold text-orange-400"
            >
              <Phone className="h-4 w-4" />
              <span>+90 (555) 635 41 55</span>
            </a>
          </div>

        </div>
      </div>

      {/* ANA NAVİGASYON BARI (Daha Büyük & Heybetli) */}
      <div className="mx-auto max-w-7xl px-6 sm:px-12 py-6 flex items-center justify-between">
        
        {/* CUSTOM PNG LOGO ALANI */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative h-14 w-48 sm:h-16 sm:w-56 flex items-center">
            <Image
              src="/logo.png" // public/logo.png konumundaki görselin
              alt="Avşa Apart Logo"
              fill
              priority
              className="object-contain object-left transition transform group-hover:scale-105"
            />
          </div>
        </Link>

        {/* MENÜ LİNKLERİ (Büyütülmüş Yazı Tipi & Aralıklar) */}
        <nav className="hidden md:flex items-center gap-10 text-base font-bold text-slate-800">
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

        {/* REZERVASYON YAP BUTONU (Büyütülmüş Buton) */}
        <Link 
          href="/#rezervasyon"
          className="flex items-center gap-2.5 bg-orange-500 hover:bg-orange-600 text-white px-7 py-3.5 rounded-2xl font-bold text-base transition shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
        >
          <Calendar className="h-5 w-5" />
          <span>Hemen Rezerve Et</span>
        </Link>

      </div>
    </header>
  )
}