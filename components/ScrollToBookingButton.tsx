'use client';

import { Calendar } from "lucide-react";

export function ScrollToBookingButton() {
  const handleScroll = () => {
    document.getElementById('rezervasyon-formu')?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <div className="block md:hidden my-3">
      <button
        onClick={handleScroll}
        className="flex items-center justify-center gap-2 bg-primary active:bg-chart-4 text-white py-2.5 px-4 rounded-xl font-semibold text-sm shadow-sm transition-all active:scale-[0.98]"
      >
        <Calendar className="h-4 w-4" />
        <span>Rezervasyon Yap</span>
      </button>
    </div>
  );
}