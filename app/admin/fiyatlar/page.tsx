import { PROPERTIES } from '@/data/daireler'
import PricesManager from './fiyatlar/PricesManager'

export default function AdminFiyatlarPage() {
  // server component: render initial UI and pass default daire
  const initialDaire = PROPERTIES[0]?.id || ''

  // fetch initial data? We'll let client component load when admin selects

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Fiyatlar Yönetimi</h1>
      <p className="mb-4">Daire seçin, takvimden günleri seçip günlük fiyatı uygulayın.</p>
      <PricesManager initialDaire={initialDaire} initialData={{ varsayilan_fiyat: PROPERTIES[0]?.price || 0, fiyatlar: [] }} />
    </div>
  )
}
