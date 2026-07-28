"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Search, 
  Calendar, 
  User, 
  Phone, 
  Home,
  RefreshCw,
  Save,
  X,
  Users,
  Ban,
  Mail,
  LogOut
} from "lucide-react"

interface Reservation {
  id: string
  daire_adi: string
  isim: string
  telefon?: string
  mail?: string
  giris: string
  cikis: string
  gece?: number
  yetiskin?: number
  cocuk?: number
  onayli_mi: boolean | null
  iptal: boolean
  kapora?: number
  odenen?: number
  fiyat?: number
  created_at: string
}

export default function AdminPage() {
  const router = useRouter()
  const supabase = React.useMemo(() => {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    )
  }, [])

  const [checkingAuth, setCheckingAuth] = React.useState<boolean>(true)
  const [reservations, setReservations] = React.useState<Reservation[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [searchTerm, setSearchTerm] = React.useState<string>("")
  const [filterStatus, setFilterStatus] = React.useState<"all" | "approved" | "pending" | "cancelled">("all")

  // Düzenleme Modali State'leri
  const [editingRes, setEditingRes] = React.useState<Reservation | null>(null)
  const [editGiris, setEditGiris] = React.useState<string>("")
  const [editCikis, setEditCikis] = React.useState<string>("")
  const [editKapora, setEditKapora] = React.useState<number>(0)
  const [editOdenen, setEditOdenen] = React.useState<number>(0)
  const [editFiyat, setEditFiyat] = React.useState<number>(0)
  const [saving, setSaving] = React.useState<boolean>(false)

  // Oturum Kontrolü
  React.useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
      } else {
        setCheckingAuth(false)
        fetchReservations()
      }
    }
    checkUser()
  }, [router, supabase])

  // Tarihi GG/AA/YYYY formatına çeviren yardımcı fonksiyon
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ""
    const parts = dateStr.split("-")
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`
    }
    return dateStr
  }

  // Verileri Çek
  const fetchReservations = React.useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("rezervasyonlar")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      alert("Veriler yüklenirken hata oluştu: " + error.message)
      console.error("Supabase Hatası:", error)
    } else if (data) {
      setReservations(data as Reservation[])
    }
    setLoading(false)
  }, [supabase])

  // Çıkış Yap
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  // Onay Durumunu Değiştir
  const toggleApproval = async (id: string, currentStatus: boolean | null) => {
    const newStatus = !currentStatus

    const { error } = await supabase
      .from("rezervasyonlar")
      .update({ onayli_mi: newStatus })
      .eq("id", id)

    if (error) {
      alert("Durum güncellenemedi: " + error.message)
    } else {
      setReservations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, onayli_mi: newStatus } : item))
      )
    }
  }

  // İptal Durumunu Değiştir (Soft Delete / Cancel)
  const toggleCancel = async (id: string, currentCancelStatus: boolean) => {
    const newStatus = !currentCancelStatus

    const { error } = await supabase
      .from("rezervasyonlar")
      .update({ iptal: newStatus })
      .eq("id", id)

    if (error) {
      alert("İptal durumu güncellenemedi: " + error.message)
    } else {
      setReservations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, iptal: newStatus } : item))
      )
    }
  }

  // Düzenleme Modalini Aç
  const openEditModal = (res: Reservation) => {
    setEditingRes(res)
    setEditGiris(res.giris)
    setEditCikis(res.cikis)
    setEditKapora(res.kapora || 0)
    setEditOdenen(res.odenen || 0)
    setEditFiyat(res.fiyat || 0)
  }

  // Güncellemeyi Kaydet
  const handleSaveEdit = async () => {
    if (!editingRes) return
    setSaving(true)

    const { error } = await supabase
      .from("rezervasyonlar")
      .update({
        giris: editGiris,
        cikis: editCikis,
        kapora: editKapora,
        odenen: editOdenen,
        fiyat: editFiyat
      })
      .eq("id", editingRes.id)

    if (error) {
      alert("Güncelleme başarısız: " + error.message)
    } else {
      setReservations((prev) =>
        prev.map((item) =>
          item.id === editingRes.id
            ? { 
                ...item, 
                giris: editGiris, 
                cikis: editCikis, 
                kapora: editKapora, 
                odenen: editOdenen,
                fiyat: editFiyat
              }
            : item
        )
      )
      setEditingRes(null)
    }
    setSaving(false)
  }

  // Arama ve Filtreleme
  const filteredReservations = reservations.filter((res) => {
    const matchesSearch =
      (res.isim && res.isim.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (res.daire_adi && res.daire_adi.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (res.telefon && res.telefon.includes(searchTerm)) ||
      (res.mail && res.mail.toLowerCase().includes(searchTerm.toLowerCase()))

    const isApproved = Boolean(res.onayli_mi)
    const isCancelled = Boolean(res.iptal)

    if (filterStatus === "cancelled") return matchesSearch && isCancelled
    if (filterStatus === "approved") return matchesSearch && isApproved && !isCancelled
    if (filterStatus === "pending") return matchesSearch && !isApproved && !isCancelled
    return matchesSearch
  })

  // Yetki Kontrolü Sırasındaki Yükleme Ekranı
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500 font-medium">
        Yetki kontrol ediliyor...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* ÜST BAŞLIK BARI */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Rezervasyon Yönetim Paneli</h1>
            <p className="text-sm text-slate-500">Tüm talepleri inceleyin, onaylayın veya tarihlerini ve ödeme detaylarını güncelleyin.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchReservations}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Yenile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-100 transition cursor-pointer border border-rose-200"
              title="Çıkış Yap"
            >
              <LogOut className="h-4 w-4" /> Çıkış
            </button>
          </div>
        </div>

        {/* FİLTRELEME VE ARAMA BARI */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="İsim, mail, daire veya telefon ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer whitespace-nowrap ${
                filterStatus === "all" ? "bg-orange-500 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Tümü ({reservations.length})
            </button>
            <button
              onClick={() => setFilterStatus("approved")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer whitespace-nowrap ${
                filterStatus === "approved" ? "bg-emerald-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Onaylılar
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer whitespace-nowrap ${
                filterStatus === "pending" ? "bg-amber-500 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Bekleyenler
            </button>
            <button
              onClick={() => setFilterStatus("cancelled")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer whitespace-nowrap ${
                filterStatus === "cancelled" ? "bg-rose-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              İptal Edilenler
            </button>
          </div>
        </div>

        {/* REZERVASYON TABLOSU */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Müşteri / İletişim</th>
                  <th className="px-6 py-4">Daire & Kişi Sayısı</th>
                  <th className="px-6 py-4">Tarihler</th>
                  <th className="px-6 py-4">Ödeme / Kapora / Kalan</th>
                  <th className="px-6 py-4">Durum</th>
                  <th className="px-6 py-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                      Veriler getiriliyor...
                    </td>
                  </tr>
                ) : filteredReservations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                      Hiç kayıt bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map((res) => {
                    const kalan = (res.fiyat || 0) - (res.odenen || 0)
                    const isApproved = Boolean(res.onayli_mi)
                    const isCancelled = Boolean(res.iptal)

                    return (
                      <tr 
                        key={res.id} 
                        className={`hover:bg-slate-50/50 transition ${isCancelled ? "bg-rose-50/30 opacity-75" : ""}`}
                      >
                        
                        {/* MÜŞTERİ BİLGİSİ */}
                        <td className="px-6 py-4">
                          <div className={`font-semibold flex items-center gap-1.5 ${isCancelled ? "line-through text-slate-500" : "text-slate-900"}`}>
                            <User className="h-4 w-4 text-slate-400" /> {res.isim || "İsimsiz"}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone className="h-3 w-3" /> {res.telefon || "Belirtilmedi"}
                          </div>
                          {res.mail && (
                            <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail className="h-3 w-3" /> {res.mail}
                            </div>
                          )}
                        </td>

                        {/* DAIRE VE KİŞİ SAYISI */}
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                            <Home className="h-4 w-4 text-orange-500" /> {res.daire_adi}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                            <Users className="h-3.5 w-3.5 text-slate-400" />
                            <span>{res.yetiskin || 0} Yetişkin</span>
                            {(res.cocuk || 0) > 0 && <span>, {res.cocuk} Çocuk</span>}
                          </div>
                        </td>

                        {/* TARİHLER */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>{formatDate(res.giris)}</span> → <span>{formatDate(res.cikis)}</span>
                          </div>
                          {res.gece && (
                            <div className="text-xs text-slate-400 mt-0.5 font-medium">
                              {res.gece} Gece
                            </div>
                          )}
                        </td>

                        {/* ÖDEME / KAPORA / KALAN */}
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">
                            ₺{(res.odenen || 0).toLocaleString("tr-TR")}{" "}
                            <span className="text-xs font-normal text-slate-400">/ ₺{(res.fiyat || 0).toLocaleString("tr-TR")}</span>
                          </div>
                          
                          {/* Kapora Bilgisi */}
                          <div className="text-xs text-blue-600 font-medium mt-0.5">
                            Kapora: ₺{(res.kapora || 0).toLocaleString("tr-TR")}
                          </div>

                          {/* Kalan Tutar Bilgisi */}
                          <div className={`text-xs mt-0.5 font-medium ${kalan > 0 ? "text-red-500" : "text-emerald-600"}`}>
                            {kalan > 0 ? `Kalan: ₺${kalan.toLocaleString("tr-TR")}` : "Tamamı Ödendi"}
                          </div>
                        </td>

                        {/* DURUM */}
                        <td className="px-6 py-4">
                          {isCancelled ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
                              <Ban className="h-3.5 w-3.5" /> İptal Edildi
                            </span>
                          ) : isApproved ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                              <CheckCircle className="h-3.5 w-3.5" /> Onaylı
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                              <XCircle className="h-3.5 w-3.5" /> Bekliyor
                            </span>
                          )}
                        </td>

                        {/* İŞLEMLER */}
                        <td className="px-6 py-4 text-right space-x-1.5">
                          {!isCancelled && (
                            <button
                              onClick={() => toggleApproval(res.id, res.onayli_mi)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                isApproved
                                  ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"
                              }`}
                            >
                              {isApproved ? "Beklemeye Al" : "Onayla"}
                            </button>
                          )}

                          <button
                            onClick={() => toggleCancel(res.id, res.iptal)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                              isCancelled
                                ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                                : "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
                            }`}
                          >
                            {isCancelled ? "Geri Al" : "İptal Et"}
                          </button>

                          <button
                            onClick={() => openEditModal(res)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition inline-flex items-center cursor-pointer"
                            title="Düzenle"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </td>

                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* DÜZENLEME MODALI */}
      {editingRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900">Rezervasyon Düzenle</h3>
              <button onClick={() => setEditingRes(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Müşteri / Daire</label>
                <div className="text-sm font-bold text-slate-800">{editingRes.isim} - {editingRes.daire_adi}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Giriş Tarihi</label>
                  <input
                    type="date"
                    value={editGiris}
                    onChange={(e) => setEditGiris(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Çıkış Tarihi</label>
                  <input
                    type="date"
                    value={editCikis}
                    onChange={(e) => setEditCikis(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Toplam Fiyat (₺)</label>
                <input
                  type="number"
                  value={editFiyat}
                  onChange={(e) => setEditFiyat(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Kapora (₺)</label>
                  <input
                    type="number"
                    value={editKapora}
                    onChange={(e) => setEditKapora(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Ödenen Tutar (₺)</label>
                  <input
                    type="number"
                    value={editOdenen}
                    onChange={(e) => setEditOdenen(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <button
                onClick={() => setEditingRes(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Save className="h-4 w-4" /> {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}