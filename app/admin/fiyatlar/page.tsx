'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

// Veritabanındaki 'fiyatlar' tablonun yapısı
interface FiyatItem {
  id: string
  daire_adi: string
  varsayilan_fiyat: number
  fiyatlar: string
}

export default function AdminFiyatlarPage() {
  const router = useRouter()

  // Supabase browser client'ı güvenli bir şekilde başlatıyoruz
  const supabase = React.useMemo(() => {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
  }, []);

  
}