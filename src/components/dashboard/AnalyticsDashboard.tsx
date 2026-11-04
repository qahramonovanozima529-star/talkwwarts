"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Volume2,
  Calendar,
  Sparkles,
} from "lucide-react";

interface AnalyticsDashboardProps {
  userName: string;
  faculty: string;
  completedTopicsCount: number;
  onReviewWord?: (word: string) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  userName,
  faculty,
  completedTopicsCount,
  onReviewWord,
}) => {
  // Fluency breakdown skills
  const skills = [
    { name: "Talaffuz va Fonetika", score: 88, en: "Pronunciation & Intonation", color: "#FACC15" },
    { name: "Lug‘at Boyligi", score: 82, en: "Lexical Range & Nuance", color: "#F59E0B" },
    { name: "Grammatik Ishonch", score: 79, en: "Grammar Flow & Syntax", color: "#38BDF8" },
    { name: "Nutq Ravonligi va Tezligi", score: 85, en: "Pacing & Low Hesitation", color: "#34D399" },
    { name: "Eshitib Tushunish", score: 92, en: "Comprehension & Listening", color: "#A78BFA" },
  ];

  // Cognitive Load Tracking: Words requiring further spaced-repetition reinforcement
  const weakWords = [
    {
      word: "Decouple",
      ipa: "/diːˈkʌpl/",
      hesitationRate: "Yuqori (High)",
      uz: "O‘zaro bog‘liqlikdan ajratish",
      loadScore: 78,
    },
    {
      word: "Perspective",
      ipa: "/pərˈspektɪv/",
      hesitationRate: "O‘rtacha (Medium)",
      uz: "Nigoh, nuqtai nazar",
      loadScore: 65,
    },
    {
      word: "Bottleneck",
      ipa: "/ˈbɑːtlnek/",
      hesitationRate: "O‘rtacha (Medium)",
      uz: "Jarayon to‘sig‘i",
      loadScore: 60,
    },
    {
      word: "Trajectory",
      ipa: "/trəˈdʒektəri/",
      hesitationRate: "Kam (Low)",
      uz: "Rivojlanish yo‘nalishi",
      loadScore: 45,
    },
  ];

  const weekDays = [
    { day: "Dush", active: true, minutes: 22 },
    { day: "Sesh", active: true, minutes: 25 },
    { day: "Chor", active: true, minutes: 20 },
    { day: "Pay", active: true, minutes: 30 },
    { day: "Jum", active: true, minutes: 18 },
    { day: "Shan", active: true, minutes: 24 },
    { day: "Yak", active: true, minutes: 20 },
  ];

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-8">
      {/* Student Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-2">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            {userName}ning Shaxsiy Tahlili
          </h2>
          <p className="text-xs font-semibold text-slate-400">
            Fakultet: <span className="text-[#CA8A04]">{faculty}</span>
          </p>
        </div>
        <div className="self-start sm:self-auto px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
          {completedTopicsCount}/35 Dars yakunlandi
        </div>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Daily Target */}
        <div className="bg-white rounded-[28px] p-6 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFFBEB] flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
            🎯
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900">20 daqiqa</span>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Kunlik
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Rejalashtirilgan mashg‘ulot
            </p>
          </div>
        </div>

        {/* Metric 2: Overall Fluency Index */}
        <div className="bg-white rounded-[28px] p-6 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FEF9C3] flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900">84 / 100</span>
              <span className="text-[10px] font-extrabold text-[#CA8A04] bg-yellow-50 px-2 py-0.5 rounded-full">
                +6% o‘sish
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Nutq ravonlik indeksi
            </p>
          </div>
        </div>

        {/* Metric 3: Active Words */}
        <div className="bg-white rounded-[28px] p-6 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
            📚
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900">{completedTopicsCount} / 35</span>
              <span className="text-[10px] font-extrabold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                Darslar
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              O‘zlashtirilgan darslar
            </p>
          </div>
        </div>

        {/* Metric 4: Total Time */}
        <div className="bg-white rounded-[28px] p-6 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
            ⏱️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900">159 daq</span>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Bu hafta
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Umumiy mashq vaqti
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Fluency Skills & Weekly Habits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Fluency Skills Breakdown (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-[32px] p-6 sm:p-8 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Nutq Ko‘nikmalari Tahlili
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Garri AI bilan jonli suhbatlar asosida baholangan parametrlar.
              </p>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#FEF9C3] text-yellow-800 text-xs font-bold">
              AI Tahlili
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {skills.map((skill) => (
              <div key={skill.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 flex items-center gap-2">
                    {skill.name}
                    <span className="text-slate-400 font-normal italic hidden sm:inline">
                      ({skill.en})
                    </span>
                  </span>
                  <span className="text-slate-900 font-black">{skill.score}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.score}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: skill.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#FFFBEB] rounded-2xl border border-yellow-200/80 flex items-start gap-3 mt-6">
            <Sparkles className="w-5 h-5 text-[#CA8A04] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              <strong className="text-slate-900">Garri AI Tavsiyasi:</strong> Sizning talaffuzingiz va tushunishingiz a'lo darajada (88%+). Grammatik qoliplarni erkinroq ishlatish uchun "3-Bosqich: Strategik Munozara" mashg‘ulotlariga e'tibor qaratishingiz tavsiya etiladi.
            </p>
          </div>
        </div>

        {/* Right: Weekly Calendar & Rhythm (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-[32px] p-6 sm:p-8 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Haftalik Ritm
              </h3>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-400 font-medium mb-6">
              Kunlik 20 daqiqa mashq normasi bajarilishi:
            </p>

            {/* Weekday Visual Columns */}
            <div className="grid grid-cols-7 gap-2 items-end h-[160px] pb-2 border-b border-slate-100">
              {weekDays.map((d) => {
                const heightPercent = Math.min(100, Math.round((d.minutes / 30) * 100));
                return (
                  <div key={d.day} className="flex flex-col items-center gap-2 h-full justify-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.6 }}
                      className="w-full rounded-xl bg-[#FACC15] relative group cursor-pointer"
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap pointer-events-none transition-opacity">
                        {d.minutes} daq
                      </div>
                    </motion.div>
                    <span className="text-[11px] font-bold text-slate-600">
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Haftalik reja: 140 daq</span>
            <span className="text-emerald-600 font-bold">114% bajarildi ✓</span>
          </div>
        </div>
      </div>

      {/* Weak-Word Cognitive Load Tracker */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FEF9C3] flex items-center justify-center text-yellow-800">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Xotirada Mustahkamlash Kerak Bo‘lgan So‘zlar
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Nutq paytida to‘xtalish yoki ikkilanish kuzatilgan iboralar:
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {weakWords.length} ta ibora
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {weakWords.map((item) => (
            <div
              key={item.word}
              className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    {item.hesitationRate}
                  </span>
                  <button
                    type="button"
                    onClick={() => speak(item.word)}
                    className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="font-extrabold text-base text-slate-900">
                  {item.word}
                </h4>
                <p className="text-xs text-slate-400 font-mono mb-1">
                  {item.ipa}
                </p>
                <p className="text-xs font-semibold text-slate-600">
                  {item.uz}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onReviewWord) onReviewWord(item.word);
                }}
                className="mt-4 w-full py-2 rounded-xl bg-white hover:bg-yellow-50 text-slate-800 hover:text-yellow-900 border border-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Qayta mashq qilish</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
