"use client"

import * as React from "react"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export type AlertType = "success" | "error" | "info"

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  type?: AlertType
  title: string
  message: string
  buttonText?: string
}

export function AlertModal({
  isOpen,
  onClose,
  type = "info",
  title,
  message,
  buttonText = "Tamam",
}: AlertModalProps) {
  if (!isOpen) return null

  // Alert Türüne Göre Renk ve İkon Mantığı
  const config = {
    success: {
      icon: <CheckCircle2 className="h-10 w-10 text-emerald-500" />,
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      btnBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    error: {
      icon: <AlertCircle className="h-10 w-10 text-red-500" />,
      badgeBg: "bg-red-50 text-red-700 border-red-200",
      btnBg: "bg-red-600 hover:bg-red-700 text-white",
    },
    info: {
      icon: <Info className="h-10 w-10 text-orange-500" />,
      badgeBg: "bg-orange-50 text-orange-700 border-orange-200",
      btnBg: "bg-orange-500 hover:bg-orange-600 text-white",
    },
  }[type]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Kartı */}
      <div 
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Kapat Butonu (X) */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* İkon ve İçerik */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className={`p-3 rounded-full border ${config.badgeBg}`}>
            {config.icon}
          </div>

          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          
          <p className="text-sm text-gray-600 leading-relaxed">
            {message}
          </p>

          {/* Eylem Butonu */}
          <div className="w-full pt-2">
            <Button
              onClick={onClose}
              className={`w-full h-11 rounded-xl font-semibold text-base shadow-sm transition-all ${config.btnBg}`}
            >
              {buttonText}
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}