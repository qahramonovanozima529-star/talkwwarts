"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Compass,
  Layers,
  MessageSquare,
  BarChart3,
  Flame,
  LogOut,
  Sparkles,
} from "lucide-react";

export type DashboardTab = "curriculum" | "vocabulary" | "garri" | "analytics";

export interface UserProfileData {
  wizardName: string;
  faculty: string;
  dailyTime: string;
  level: string;
}

interface DashboardHeaderProps {
  profile: UserProfileData;
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  profile,
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    {
      id: "curriculum" as DashboardTab,
      label: "Mavzular (20 Bosqich)",
      icon: Compass,
    },
    {
      id: "vocabulary" as DashboardTab,
      label: "Lug‘at va O‘yinlar",
      icon: Layers,
    },
    {
      id: "garri" as DashboardTab,
      label: "Garri AI (Suhbat xonasi)",
      icon: MessageSquare,
    },
    {
      id: "analytics" as DashboardTab,
      label: "Tahlil va Natijalar",
      icon: BarChart3,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all">
      {/* 1. TOP NAVBAR ROW: Profile on Left, Badges on Right */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 border-b border-slate-100">
        
        {/* Left Side: Brand & User Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 group mr-1 sm:mr-2">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-yellow-600 transition-colors">
              Talkwarts<span className="text-[#FACC15]">.</span>
            </span>
          </Link>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* User Profile Snapshot */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFFBEB] border-2 border-[#FACC15] flex items-center justify-center font-black text-slate-900 text-sm shadow-xs flex-shrink-0">
              {profile.wizardName ? profile.wizardName.charAt(0).toUpperCase() : "T"}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-serif text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  {profile.wizardName}
                </h2>
                <Sparkles className="w-3.5 h-3.5 text-[#FACC15] fill-[#FACC15]" />
              </div>
              <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <span>⏱️ Maqsad:</span>
                <span className="text-slate-700 font-bold">{profile.dailyTime}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Badges (Faculty, Level, Streak) + Exit */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Faculty Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFBEB] border border-yellow-200/80 text-yellow-900 text-xs font-bold shadow-2xs">
            <span>🎓</span>
            <span className="truncate max-w-[140px]">{profile.faculty}</span>
          </div>

          {/* Level Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-sky-800 text-xs font-bold shadow-2xs">
            <span>⚡</span>
            <span>{profile.level}</span>
          </div>

          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-bold shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span className="whitespace-nowrap">7 Kunlik Streak</span>
          </div>

          {/* Exit / Re-onboard Link */}
          <Link
            href="/onboarding"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors ml-1"
            title="Sozlamalar va qayta saralash"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 2. NAVIGATION TAB BAR: Smooth Framer Motion Sliding Pill */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="relative px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap outline-none"
              >
                {/* Sliding Yellow Background Pill via layoutId */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicatorPill"
                    className="absolute inset-0 bg-[#FACC15] rounded-2xl shadow-xs"
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 32,
                    }}
                  />
                )}

                <span
                  className={`relative z-10 flex items-center gap-2 transition-colors duration-150 ${
                    isActive
                      ? "text-slate-950 font-black"
                      : "text-slate-500 hover:text-slate-900 font-bold"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
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
    </header>
  );
};

