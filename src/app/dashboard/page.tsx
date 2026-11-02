"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Home,
  Compass,
  Layers,
  MessageSquare,
  BarChart3,
  LogOut,
  PlayCircle,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Phone,
  Send,
  Zap,
  Award,
  BookOpen,
} from "lucide-react";

import {
  curriculumModulesMeta,
  curriculumLessons,
  LessonData,
} from "@/data/curriculumData";
import { LessonStudio } from "@/components/dashboard/LessonStudio";
import { DictionaryAndGames } from "@/components/dashboard/DictionaryAndGames";
import { GarriAIChat } from "@/components/dashboard/GarriAIChat";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";

type MainNavTab = "home" | "curriculum" | "dictionary" | "garri" | "analytics";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<MainNavTab>("home");

  // User Profile State
  const [profile, setProfile] = useState<{
    wizardName: string;
    faculty: string;
    dailyTime: string;
    level: string;
  }>({
    wizardName: "Sardor Komilov",
    faculty: "IT va Dasturlash",
    dailyTime: "20 daqiqa / kun",
    level: "B1 (O‘rta)",
  });

  // Completed Lessons State (Stored in localStorage)
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([1, 2]);

  // Full-Screen Immersive Lesson Studio active state (NO small modals!)
  const [activeLesson, setActiveLesson] = useState<LessonData | null>(null);

  // Load user profile & progress from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("talkwarts_user_profile");
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setProfile({
            wizardName: parsed.wizardName || "Sardor Komilov",
            faculty: parsed.faculties || parsed.faculty || "IT va Dasturlash",
            dailyTime: parsed.dailyTime || "20 daqiqa / kun",
            level: parsed.level || "B1 (O‘rta)",
          });
        } catch {}
      }

      const savedCompleted = localStorage.getItem("talkwarts_completed_lessons");
      if (savedCompleted) {
        try {
          const parsed = JSON.parse(savedCompleted);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCompletedLessonIds(parsed);
          }
        } catch {}
      }
    }
  }, []);

  // Strict Lesson Completion Handler
  const handleLessonComplete = (lessonId: number) => {
    setCompletedLessonIds((prev) => {
      const next = prev.includes(lessonId) ? prev : [...prev, lessonId];
      if (typeof window !== "undefined") {
        localStorage.setItem("talkwarts_completed_lessons", JSON.stringify(next));
      }
      return next;
    });
    setActiveLesson(null);
  };

  // Strictly 5 exact tabs in specified order
  const navTabs = [
    {
      id: "home" as MainNavTab,
      label: "Asosiy (Dashboard)",
      icon: Home,
    },
    {
      id: "curriculum" as MainNavTab,
      label: "O‘quv Dasturi",
      icon: Compass,
    },
    {
      id: "dictionary" as MainNavTab,
      label: "1000 Lug‘at va o‘yinlar",
      icon: Layers,
    },
    {
      id: "garri" as MainNavTab,
      label: "Garri AI",
      icon: MessageSquare,
    },
    {
      id: "analytics" as MainNavTab,
      label: "Tahlil",
      icon: BarChart3,
    },
  ];

  // If user is inside the Full-Screen Immersive Lesson Studio
  if (activeLesson) {
    return (
      <LessonStudio
        lesson={activeLesson}
        onExit={() => setActiveLesson(null)}
        onLessonComplete={handleLessonComplete}
        isAlreadyCompleted={completedLessonIds.includes(activeLesson.id)}
      />
    );
  }

  // Calculate current active progress
  const currentCompletedCount = completedLessonIds.length;
  const currentProgressPercent = Math.min(
    100,
    Math.round((currentCompletedCount / curriculumLessons.length) * 100)
  );
  const nextLessonToStudy =
    curriculumLessons.find((l) => !completedLessonIds.includes(l.id)) ||
    curriculumLessons[0];

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 flex flex-col font-sans">
      {/* ============================================================= */}
      {/* 1. UNIFIED STICKY TOP NAVBAR (NO EMOJI CLUTTER BADGES!)       */}
      {/* ============================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3 transition-all shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Talkwarts. Logo */}
          <Link href="/dashboard" className="flex items-center gap-1 group flex-shrink-0">
            <span className="font-serif text-2xl font-bold tracking-tight text-slate-900 group-hover:text-yellow-600 transition-colors">
              Talkwarts<span className="text-[#FACC15]">.</span>
            </span>
          </Link>

          {/* Center: Strict 5 Tabs with Framer Motion Sliding Highlight */}
          <div className="hidden lg:flex items-center bg-slate-100/80 p-1 rounded-2xl border border-stone-200/60">
            <nav className="flex items-center gap-1">
              {navTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className="relative px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap outline-none"
                  >
                    {/* Sliding Yellow Highlight via layoutId */}
                    {isActive && (
                      <motion.div
                        layoutId="topNavPillHighlight"
                        className="absolute inset-0 bg-[#FACC15] rounded-xl shadow-xs"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 30,
                        }}
                      />
                    )}

                    <span
                      className={`relative z-10 flex items-center gap-1.5 transition-colors ${
                        isActive
                          ? "text-slate-950 font-black"
                          : "text-slate-500 hover:text-slate-900 font-bold"
                      }`}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 ${
                          isActive ? "text-slate-950" : "text-slate-400"
                        }`}
                      />
                      <span>{tab.label}</span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Minimalist User Metadata Container + Logout */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="border border-stone-200/90 rounded-2xl px-3 sm:px-4 py-1.5 flex items-center gap-2 sm:gap-3 bg-white shadow-2xs text-xs font-semibold">
              <div>
                <span className="text-slate-400 font-medium mr-1 hidden sm:inline">Talaba:</span>
                <span className="font-serif font-bold text-slate-900">{profile.wizardName}</span>
              </div>
              <div className="h-3 w-px bg-stone-200 hidden sm:block" />
              <div className="hidden md:block">
                <span className="text-slate-400 font-medium mr-1">Daraja:</span>
                <span className="font-bold text-slate-800">{profile.level}</span>
              </div>
              <div className="h-3 w-px bg-stone-200 hidden md:block" />
              <div>
                <span className="text-slate-400 font-medium mr-1 hidden sm:inline">Maqsad:</span>
                <span className="font-bold text-[#CA8A04]">{profile.dailyTime}</span>
              </div>
            </div>

            {/* Clean Logout Icon */}
            <Link
              href="/onboarding"
              className="p-2 sm:p-2.5 rounded-2xl border border-stone-200/90 text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-colors"
              title="Sozlamalarga qaytish"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar for 5 Tabs */}
        <div className="lg:hidden mt-2 pt-2 border-t border-slate-100 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#FACC15] text-slate-950 font-black shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ============================================================= */}
      {/* 2. MAIN WORKSPACE CONTAINER                                   */}
      {/* ============================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* =========================================================== */}
        {/* CONDITIONAL HERO BANNER (RENDERS ONLY ON ASOSIY TAB!)       */}
        {/* =========================================================== */}
        {activeTab === "home" && (
          <section className="bg-white rounded-[32px] p-6 sm:p-10 lg:p-12 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* Subtle Ambient Radial Lighting */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#FEF08A]/30 rounded-full blur-3xl pointer-events-none" />

            {/* Left Side: Staggered Serif Headline & Progression Narrative */}
            <div className="max-w-2xl space-y-5 relative z-10 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFBEB] text-yellow-900 text-xs font-black border border-yellow-200/80">
                <Sparkles className="w-3.5 h-3.5 text-[#FACC15] fill-[#FACC15]" />
                <span>Xush kelibsiz, {profile.wizardName}!</span>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]"
              >
                Ingliz tilida{" "}
                <span className="bg-[#FEF08A] px-2.5 py-0.5 rounded-xl text-slate-900 inline-block shadow-2xs">
                  erkin va ravon
                </span>{" "}
                so‘zlashuv maydoni.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed max-w-xl"
              >
                6 ta modul va 35 ta amaliy darslik tizimi. 0-darajadan boshlab, {profile.faculty} sohasi bo‘yicha professional muloqot va Garri AI bilan jonli nutq tajribasini oshiring.
              </motion.p>

              {/* Quick Hero Actions */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3"
              >
                <button
                  type="button"
                  onClick={() => setActiveTab("curriculum")}
                  className="px-6 py-3.5 rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-yellow-400/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Darslarni davom ettirish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("garri")}
                  className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  <span>Garri AI bilan gaplashish</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("dictionary")}
                  className="px-5 py-3.5 rounded-2xl bg-white border border-stone-200 hover:border-yellow-300 text-slate-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 text-[#CA8A04]" />
                  <span>1000 Lug‘at va o‘yinlar</span>
                </button>
              </motion.div>
            </div>

            {/* Right Side (Top-Right): Custom Enlarged Illustration (w-80 md:w-96 lg:w-[450px]) */}
            <div className="relative z-10 flex-shrink-0 flex items-center justify-center">
              <motion.img
                src="https://i.postimg.cc/Qt7jBvyt/e924fdb2-b58f-4ac0-a4c9-564f140bfc10-removebg-preview.png"
                alt="Talkwarts Learning Character"
                className="w-80 md:w-96 lg:w-[450px] h-auto scale-110 object-contain drop-shadow-md select-none pointer-events-none"
                animate={{ y: [0, -8, 0], rotate: [0, 1, -1, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </section>
        )}

        {/* =========================================================== */}
        {/* DYNAMIC CONTENT SWITCHER FOR THE 5 TABS                     */}
        {/* =========================================================== */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: ASOSIY (DASHBOARD) OVERVIEW CARDS */}
            {activeTab === "home" && (
              <motion.div
                key="tab-home"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* 3 Overview Quick Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Card 1: Navbatdagi Dars */}
                  <div className="bg-white rounded-[28px] p-6 border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase text-[#CA8A04] bg-[#FEF9C3] px-2.5 py-0.5 rounded-full">
                          Navbatdagi Dars
                        </span>
                        <PlayCircle className="w-5 h-5 text-[#CA8A04]" />
                      </div>
                      <h4 className="font-serif font-black text-lg text-slate-900 leading-snug">
                        #{nextLessonToStudy.id}. {nextLessonToStudy.titleUz}
                      </h4>
                      <p className="text-xs text-slate-400 italic mt-0.5">
                        {nextLessonToStudy.titleEn}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">
                        Davomiyligi: {nextLessonToStudy.duration}
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveLesson(nextLessonToStudy)}
                        className="px-4 py-2 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-slate-950 font-black text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Boshlash</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Umumiy O'quv Statistikasi */}
                  <div className="bg-white rounded-[28px] p-6 border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                          O‘quv Xaritasi
                        </span>
                        <BookOpen className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-slate-900">
                          {currentCompletedCount}
                        </span>
                        <span className="text-slate-400 font-bold text-sm">
                          / 35 dars yakunlandi
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Siz dasturning {currentProgressPercent}% qismini muvaffaqiyatli yakunladingiz.
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-4 border-t border-slate-100">
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#FACC15] h-full transition-all duration-300"
                          style={{ width: `${currentProgressPercent}%` }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("curriculum")}
                        className="text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1"
                      >
                        <span>To‘liq o‘quv rejasini ko‘rish</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Card 3: Garri AI Jonli Murabbiy */}
                  <div className="bg-white rounded-[28px] p-6 border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                          Jonli Nutq Mashqi
                        </span>
                        <Zap className="w-5 h-5 text-purple-500" />
                      </div>
                      <h4 className="font-serif font-black text-lg text-slate-900 leading-snug">
                        Garri AI bilan real suhbat
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Ovozli nutq qabul qilish, ielts.gg uslubidagi xatolar tahlili va jonli takliflar.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setActiveTab("garri")}
                        className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Suhbatni boshlash</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 6 Modules Quick Roadmap Preview */}
                <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Bosqichlar Ketma-ketligi
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        Har bir modul yakunida Garri AI bilan imtihon suhbati o‘tkaziladi.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("curriculum")}
                      className="text-xs font-bold text-yellow-900 bg-[#FFFBEB] hover:bg-[#FEF08A] px-4 py-2 rounded-xl border border-yellow-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Barcha darslar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {curriculumModulesMeta.map((mod) => {
                      const modLessons = curriculumLessons.filter((l) => l.moduleId === mod.id);
                      const modCompleted = modLessons.filter((l) => completedLessonIds.includes(l.id)).length;
                      const isModDone = modCompleted === modLessons.length;

                      return (
                        <div
                          key={mod.id}
                          onClick={() => setActiveTab("curriculum")}
                          className="p-5 rounded-[24px] bg-[#FAFAF9] hover:bg-white border border-stone-200/70 hover:border-yellow-300 transition-all cursor-pointer space-y-3 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-[#CA8A04] bg-[#FEF9C3] px-2.5 py-0.5 rounded-full">
                              {mod.levelBadge}
                            </span>
                            <span className="text-xs font-bold text-slate-400">
                              {modCompleted} / {modLessons.length}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-serif font-black text-slate-900 group-hover:text-yellow-600 transition-colors">
                              {mod.titleUz}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                              {mod.description}
                            </p>
                          </div>
                          <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-xs font-bold">
                            <span className={isModDone ? "text-emerald-700" : "text-slate-500"}>
                              {isModDone ? "Tamomlandi ✓" : "Jarayonda"}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: O'QUV DASTURI (6 MODUL, 35 DARS) */}
            {activeTab === "curriculum" && (
              <motion.div
                key="tab-curriculum"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-10"
              >
                {/* Top Progress Overview */}
                <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <span className="text-xs font-black uppercase text-[#CA8A04] bg-[#FEF9C3] px-3 py-1 rounded-full mb-3 inline-block">
                      6 Modulli O‘quv Xaritasi (35 Dars)
                    </span>
                    <h3 className="font-serif text-2xl font-black text-slate-900 tracking-tight">
                      Umumiy Dastur: <span className="text-[#CA8A04]">{profile.faculty}</span>
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      Darsni bosing — to‘liq ekrandagi Immersive Lesson Studio ochiladi.
                    </p>
                  </div>

                  <div className="flex items-center gap-5 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900">
                        {currentCompletedCount}{" "}
                        <span className="text-sm text-slate-400 font-medium">/ 35</span>
                      </span>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Yakunlandi ({currentProgressPercent}%)
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-[#FFFBEB] border-4 border-[#FACC15] flex items-center justify-center font-black text-slate-900 text-lg shadow-inner">
                      {currentProgressPercent}%
                    </div>
                  </div>
                </div>

                {/* 6 Distinct Modules Rendering */}
                {curriculumModulesMeta.map((moduleMeta) => {
                  const moduleLessons = curriculumLessons.filter(
                    (l) => l.moduleId === moduleMeta.id
                  );
                  const completedInModule = moduleLessons.filter((l) =>
                    completedLessonIds.includes(l.id)
                  ).length;

                  return (
                    <div key={moduleMeta.id} className="space-y-4">
                      {/* Module Header Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-2">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="w-3 h-3 rounded-full bg-[#FACC15]" />
                            <h4 className="font-serif font-black text-xl text-slate-900 tracking-tight">
                              {moduleMeta.titleUz}
                            </h4>
                            <span className="text-xs font-bold text-slate-500 hidden md:inline">
                              ({moduleMeta.titleEn})
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-0.5 ml-5">
                            {moduleMeta.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 ml-5 sm:ml-0">
                          <span className="text-xs font-bold text-[#CA8A04] bg-[#FEF9C3] px-3 py-1 rounded-full">
                            {moduleMeta.levelBadge}
                          </span>
                          <span className="text-xs font-bold text-slate-400">
                            {completedInModule} / {moduleLessons.length}
                          </span>
                        </div>
                      </div>

                      {/* Grid of Lesson Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {moduleLessons.map((l) => {
                          const isCompleted = completedLessonIds.includes(l.id);
                          const isUnlocked =
                            l.id === 1 ||
                            completedLessonIds.includes(l.id - 1) ||
                            isCompleted;

                          return (
                            <motion.div
                              key={l.id}
                              whileHover={isUnlocked ? { y: -4 } : {}}
                              onClick={() => {
                                if (isUnlocked) {
                                  setActiveLesson(l);
                                }
                              }}
                              className={`rounded-[28px] p-5 transition-all relative flex flex-col justify-between min-h-[220px] ${
                                isUnlocked
                                  ? "bg-white border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(250,204,21,0.18)] hover:border-yellow-300 cursor-pointer"
                                  : "bg-slate-100/70 border border-slate-200/50 opacity-60 cursor-not-allowed"
                              }`}
                            >
                              <div>
                                {/* Top badge row */}
                                <div className="flex items-center justify-between mb-3">
                                  <span
                                    className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                                      isCompleted
                                        ? "bg-emerald-100 text-emerald-800"
                                        : isUnlocked
                                        ? "bg-[#FEF9C3] text-yellow-900"
                                        : "bg-slate-200 text-slate-500"
                                    }`}
                                  >
                                    #{l.id}
                                  </span>

                                  {isCompleted ? (
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                                      <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                  ) : isUnlocked ? (
                                    <div className="w-6 h-6 rounded-full bg-[#FFFBEB] text-[#CA8A04] flex items-center justify-center">
                                      <PlayCircle className="w-4 h-4" />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center">
                                      <Lock className="w-3.5 h-3.5" />
                                    </div>
                                  )}
                                </div>

                                <h5 className="font-serif font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
                                  {l.titleUz}
                                </h5>
                                <p className="text-[11px] font-medium text-slate-400 italic line-clamp-1 mt-0.5">
                                  {l.titleEn}
                                </p>
                              </div>

                              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
                                <span className="bg-slate-50 px-2 py-0.5 rounded-md">
                                  {l.duration}
                                </span>
                                <span className="text-slate-600">
                                  {l.words.length} ta so‘z
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* TAB 3: 1000 LUG'AT VA O'YINLAR */}
            {activeTab === "dictionary" && (
              <motion.div
                key="tab-dictionary"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <DictionaryAndGames />
              </motion.div>
            )}

            {/* TAB 4: GARRI AI (JONLI SUHBATDOSH) */}
            {activeTab === "garri" && (
              <motion.div
                key="tab-garri"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <GarriAIChat
                  userName={profile.wizardName}
                  faculty={profile.faculty}
                  userLevel={profile.level}
                />
              </motion.div>
            )}

            {/* TAB 5: TAHLIL VA NATIJALAR */}
            {activeTab === "analytics" && (
              <motion.div
                key="tab-analytics"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <AnalyticsDashboard
                  userName={profile.wizardName}
                  faculty={profile.faculty}
                  completedTopicsCount={currentCompletedCount}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* ============================================================= */}
      {/* 3. PREMIUM FOOTER                                             */}
      {/* ============================================================= */}
      <footer className="mt-auto border-t border-stone-200/80 bg-white py-8 px-4 sm:px-8 text-xs font-semibold text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Brand & Rights */}
          <div className="space-y-1 text-center md:text-left">
            <p className="font-serif font-black text-slate-900 text-sm">
              Talkwarts<span className="text-[#FACC15]">.</span> AI Language Immersion Platform
            </p>
            <p className="text-slate-400">
              © 2026 Talkwarts. Barcha huquqlar himoyalangan.
            </p>
          </div>

          {/* Center: Direct Contact & Platform Order Action */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Telegram Link */}
            <a
              href="https://t.me/MrsMalikova"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 transition-colors font-bold"
            >
              <Send className="w-3.5 h-3.5 text-sky-600" />
              <span>Telegram: @MrsMalikova</span>
            </a>

            {/* Telephone Link */}
            <a
              href="tel:+998332295545"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors font-bold"
            >
              <Phone className="w-3.5 h-3.5 text-slate-600" />
              <span>+998 33 229 55 45</span>
            </a>

            {/* Custom Website/Platform Order CTA Button */}
            <a
              href="https://t.me/MrsMalikova"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-slate-950 font-black shadow-xs transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Sayt va Platforma Buyurtma Qilish</span>
            </a>
          </div>

          {/* Right: Security & Architecture Tags */}
          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span>6 Modul & 35 Dars</span>
            <span>•</span>
            <span>Garri AI Nutq Tahlili</span>
            <span>•</span>
            <span>ielts.gg Tizimi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
