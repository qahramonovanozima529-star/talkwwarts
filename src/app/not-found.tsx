import React from "react";
import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-900 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white border border-stone-200/80 rounded-[32px] p-8 text-center shadow-lg shadow-amber-500/5">
        <span className="font-serif font-black text-6xl text-amber-500 block mb-2">
          404
        </span>

        <h1 className="text-xl font-bold text-slate-900 mb-2">
          Sahifa topilmadi
        </h1>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Siz qidirayotgan sahifa mavjud emas yoki boshqa manzilga ko‘chirilgan.
        </p>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="w-full bg-[#FACC15] hover:bg-[#EAB308] text-slate-900 font-bold rounded-2xl py-3.5 px-5 flex items-center justify-center gap-2 text-sm shadow-sm transition-all"
          >
            <span>Dashboardga o‘tish</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/"
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl py-3 px-5 flex items-center justify-center gap-2 text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Bosh sahifa</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
