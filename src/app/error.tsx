"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw, AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Talkwarts Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-900 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white border border-stone-200/80 rounded-[32px] p-8 text-center shadow-lg shadow-amber-500/5">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center mx-auto mb-5 text-amber-600">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <span className="font-serif font-bold text-2xl tracking-tight text-slate-900 block mb-2">
          Talkwarts<span className="text-amber-500">.</span>
        </span>

        <h1 className="text-xl font-bold text-slate-900 mb-2">
          Kutilmagan xatolik yuz berdi
        </h1>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Xavotir olmang, profilingiz va dars natijalaringiz saqlanib qolgan. Dashboard orqali darslarni davom ettirishingiz mumkin.
        </p>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="w-full bg-[#FACC15] hover:bg-[#EAB308] text-slate-900 font-bold rounded-2xl py-3.5 px-5 flex items-center justify-center gap-2 text-sm shadow-sm transition-all"
          >
            <span>Dashboardga o‘tish</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={() => reset()}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl py-3 px-5 flex items-center justify-center gap-2 text-sm transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Qayta urinish</span>
          </button>
        </div>
      </div>
    </div>
  );
}

