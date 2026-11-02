"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";

// --- TYPEWRITER TEXT ANIMATION COMPONENT ---
function TypewriterText({ text, className, delay = 0, as: Component = "div" }: { text: string; className?: string; delay?: number; as?: React.ElementType }) {
  const letters = Array.from(text);
  return (
    <Component className={className}>
      {letters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.12, delay: delay + index * 0.015 }}
        >
          {char}
        </motion.span>
      ))}
    </Component>
  );
}

// Shaffof rasmlar massivi
const stepImages = [
  "https://i.postimg.cc/RZtcqVB7/1e885050-822d-41d3-9af2-d77ade8a84e2-removebg-preview.png",
  "https://i.postimg.cc/pXpQbJcF/21436ce0-24ec-4ba4-bd26-f39f1842f561-1-removebg-preview.png",
  "https://i.postimg.cc/Pf6bRRys/f6036c58-93ed-4dee-8397-fbdf9ddaa710-removebg-preview.png",
  "https://i.postimg.cc/90fdfdmD/48c30c72-0b69-4826-ab8c-c4b4e28730d4-removebg-preview.png",
  "https://i.postimg.cc/NMD8YJwJ/b1211518-09b5-454f-8a7b-6525ce0ae1fe-removebg-preview.png",
  "https://i.postimg.cc/85Nd28xQ/a90373c7-065a-41e9-8e75-8fa2e6cc4743-removebg-preview.png",
];

const leftSubtitles = [
  "Sizning shaxsiy AI nutq sayohatingiz boshlanmoqda",
  "O‘z sohangizda erkin va professional muloqot",
  "To‘siqlarni yengib, ishonch bilan so‘zlang",
  "Har bir yangi so‘z — erkinlik sari yangi qadam",
  "Kuniga 20 daqiqa — kafolatlangan va doimiy natija",
  "Tabriklaymiz! Akademiyaga rasmiy qabul qilindingiz",
];

const diagnosticQuestions = [
  "Birov inglizcha gapirsa tushunaman, lekin javob qaytarishga qiynalaman.",
  "Mavzuni bilaman, lekin fanga oid so‘zlar yetishmasligi sabab to‘xtab qolaman.",
  "Grammatik xato qilib qo‘yishdan va noto‘g‘ri gapirishdan cho‘chiyman.",
  "Muntazam jonli gaplashib turish uchun suhbatdoshim yo‘q.",
];

// 20 TA YO'NALISH RO'YXATI
const allFaculties = [
  { id: "daily", title: "Kundalik muloqot" },
  { id: "it", title: "IT va Dasturlash" },
  { id: "business", title: "Biznes va Moliya" },
  { id: "travel", title: "Sayohat va Turizm" },
  { id: "medicine", title: "Tibbiyot" },
  { id: "science", title: "Ilm-fan va Texnologiya" },
  { id: "art", title: "San'at va Dizayn" },
  { id: "marketing", title: "Marketing" },
  { id: "engineering", title: "Muhandislik" },
  { id: "law", title: "Huquq va Yurisprudensiya" },
  { id: "education", title: "Ta'lim va O'qitish" },
  { id: "sports", title: "Sport va Fitnes" },
  { id: "media", title: "Kino va OAV" },
  { id: "food", title: "Pazandachilik" },
  { id: "fashion", title: "Moda va Go'zallik" },
  { id: "history", title: "Tarix va Madaniyat" },
  { id: "gaming", title: "Video O'yinlar" },
  { id: "music", title: "Musiqa" },
  { id: "literature", title: "Adabiyot" },
  { id: "psychology", title: "Psixologiya" },
];

// DARAJA VA SO'ZLAR (0-dan boshlanadi)
const levelWords = {
  "0-Daraja (Harflar va Tovushlar)": ["A, B, C...", "Hello", "Yes / No", "Thank you"],
  "A1 (Boshlang‘ich)": ["Water", "Book", "Time", "Family", "Friend"],
  "B1 (O‘rta)": ["Experience", "Society", "Achieve", "Confident", "Environment"],
  "C1 (Yuqori)": ["Fluctuate", "Paradigm", "Implement", "Crucial", "Ubiquitous"]
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [ageGroup, setAgeGroup] = useState<string>("18-24");
  const [faculties, setFaculties] = useState<string[]>(["daily"]); // Multi-select uchun array
  const [obstacles, setObstacles] = useState<Record<number, "Ha" | "Qisman" | "Yo‘q">>({
    0: "Ha", 1: "Ha", 2: "Qisman", 3: "Ha",
  });
  const [selectedWords, setSelectedWords] = useState<string[]>(["A, B, C...", "Hello"]);
  const [dailyTime, setDailyTime] = useState<string>("20min");
  const [wizardName, setWizardName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Yo'nalishlarni tanlash / olib tashlash
  const toggleFaculty = (id: string) => {
    setFaculties((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // So'zlarni tanlash / olib tashlash
  const toggleWord = (word: string) => {
    setSelectedWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  // Darajani avtomatik hisoblash
  const calculateLevel = () => {
    if (selectedWords.some(w => levelWords["C1 (Yuqori)"].includes(w))) return "C1 (Yuqori)";
    if (selectedWords.some(w => levelWords["B1 (O‘rta)"].includes(w))) return "B1 (O‘rta)";
    if (selectedWords.some(w => levelWords["A1 (Boshlang‘ich)"].includes(w))) return "A1 (Boshlang‘ich)";
    return "0-Daraja (Noldan boshlash)";
  };

  const handleNext = () => {
    if (currentStep < 6) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const saveProfile = () => {
    if (typeof window !== "undefined") {
      const finalLevel = calculateLevel();
      const selectedFacultyNames = faculties
        .map((fId) => allFaculties.find((f) => f.id === fId)?.title)
        .join(", ");

      localStorage.setItem(
        "talkwarts_user_profile",
        JSON.stringify({
          wizardName: wizardName.trim() || "Foydalanuvchi",
          ageGroup,
          faculties: selectedFacultyNames || "Kundalik muloqot",
          obstacles,
          selectedWords,
          dailyTime,
          level: finalLevel,
          completedAt: new Date().toISOString(),
        })
      );
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    saveProfile();
    try {
      const res = await signIn("google", { callbackUrl: "/dashboard", redirect: false });
      if (res?.error) {
        // Safe graceful fallback if Google OAuth credentials have local mismatch
        window.location.href = "/dashboard";
      } else if (res?.url) {
        window.location.href = res.url;
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      window.location.href = "/dashboard";
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectAccess = () => {
    saveProfile();
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch bg-white">
        
        {/* LEFT COLUMN: AESTHETIC STUDIO CARD */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#FFFDF9] to-[#FEF9EE] border border-stone-200/60 rounded-[32px] p-8 flex flex-col justify-between min-h-[550px] relative overflow-hidden shadow-sm">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="font-serif font-bold text-2xl tracking-tight text-slate-900">
              Talkwarts<span className="text-amber-500">.</span>
            </span>
            <span className="text-xs font-bold tracking-widest text-slate-600 uppercase bg-white/80 backdrop-blur-sm border border-stone-200/80 px-3.5 py-1.5 rounded-full shadow-2xs">
              0{currentStep} / 06
            </span>
          </div>

          <div className="relative z-10 flex items-center justify-center my-auto py-8">
            <AnimatePresence mode="wait">
              <motion.img
                key={`step-img-${currentStep}`}
                src={stepImages[currentStep - 1]}
                alt={`Step ${currentStep}`}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full max-w-[320px] h-auto object-contain drop-shadow-[0_12px_24px_rgba(217,119,6,0.12)]"
              />
            </AnimatePresence>
          </div>

          <div className="relative z-10 pt-4 border-t border-stone-200/60">
            <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-1">
              Aesthetic AI Journey
            </p>
            <p className="text-sm font-bold text-slate-800">
              {leftSubtitles[currentStep - 1]}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTENT CONTAINER */}
        <div className="lg:col-span-7 flex flex-col justify-between min-h-[550px] py-4 px-2">
          
          <div className="mb-6">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#FACC15] rounded-full"
                initial={{ width: "16.6%" }}
                animate={{ width: `${(currentStep / 6) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar flex flex-col justify-center">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: YOSH */}
              {currentStep === 1 && (
                <motion.div key="step-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <TypewriterText text="Sehrli so‘zlashuv ekspressiga xush kelibsiz!" className="font-serif text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight" />
                  <TypewriterText text="O‘quv dasturini moslashtirish uchun yoshingizni tanlang:" className="text-sm text-slate-500 font-medium mt-3 mb-6" delay={0.2} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: "13-17", title: "13–17 yosh", desc: "Maktab va ilk qadamlar" },
                      { id: "18-24", title: "18–24 yosh", desc: "Talaba va mutaxassis" },
                      { id: "25-34", title: "25–34 yosh", desc: "Karyera va muloqot" },
                      { id: "35+", title: "35+ yosh", desc: "Shaxsiy rivojlanish" },
                    ].map((item) => {
                      const isSelected = ageGroup === item.id;
                      return (
                        <div key={item.id} onClick={() => setAgeGroup(item.id)} className={`rounded-2xl p-4 transition-all duration-200 cursor-pointer ${isSelected ? "bg-[#FEF08A]/60 ring-2 ring-[#FACC15] shadow-xs" : "bg-[#F8FAFC] hover:bg-amber-50/60"}`}>
                          <h4 className="font-extrabold text-base text-slate-900">{item.title}</h4>
                          <p className="text-xs text-slate-500 font-medium mt-1">{item.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: YO'NALISHLAR (20 TA, MULTI-SELECT) */}
              {currentStep === 2 && (
                <motion.div key="step-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="h-full flex flex-col">
                  <TypewriterText text="Qaysi sohalarda erkin so‘zlashmoqchisiz?" className="font-serif text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight shrink-0" />
                  <TypewriterText text="Bir nechta yo‘nalishni tanlashingiz mumkin (maksimal moslashuv):" className="text-sm text-slate-500 font-medium mt-3 mb-4 shrink-0" delay={0.2} />
                  
                  {/* Skroll bo'ladigan qism */}
                  <div className="flex-1 overflow-y-auto pr-2 pb-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {allFaculties.map((item) => {
                      const isSelected = faculties.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleFaculty(item.id)}
                          className={`rounded-2xl p-3 flex items-center justify-between transition-all duration-200 cursor-pointer border ${
                            isSelected
                              ? "bg-[#FEF08A]/30 border-[#FACC15] ring-1 ring-[#FACC15] shadow-xs"
                              : "bg-white border-stone-200 hover:border-amber-300"
                          }`}
                        >
                          <h4 className={`text-[13px] leading-tight ${isSelected ? "font-extrabold text-slate-900" : "font-semibold text-slate-600"}`}>
                            {item.title}
                          </h4>
                          {isSelected && <span className="text-[#D97706] text-sm ml-2">✓</span>}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: TO'SIQLAR */}
              {currentStep === 3 && (
                <motion.div key="step-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <TypewriterText text="Nutqingizni nima to‘xtatib turibdi?" className="font-serif text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight" />
                  <TypewriterText text="Har bir holat bo‘yicha o‘zingizga mos javobni belgilang:" className="text-sm text-slate-500 font-medium mt-3 mb-6" delay={0.2} />
                  <div className="space-y-3">
                    {diagnosticQuestions.map((qText, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#F8FAFC] rounded-2xl">
                        <p className="text-sm font-medium text-slate-800 flex-1 leading-snug">{idx + 1}. {qText}</p>
                        <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
                          {(["Ha", "Qisman", "Yo‘q"] as const).map((opt) => {
                            const isChecked = obstacles[idx] === opt;
                            return (
                              <button key={opt} type="button" onClick={() => setObstacles((prev) => ({ ...prev, [idx]: opt }))} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isChecked ? "bg-[#FACC15] text-slate-900 shadow-xs" : "bg-white text-slate-500 hover:text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"}`}>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 4: DARAJANI ANIQLASH (0-DAN BOSHLAB) */}
              {currentStep === 4 && (
                <motion.div key="step-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="h-full flex flex-col">
                  <TypewriterText text="O‘zingiz bilgan so‘zlarni belgilang:" className="font-serif text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight shrink-0" />
                  <TypewriterText text="Tanlangan so‘zlar orqali darajangiz avtomatik hisoblanadi (0 dan boshlab):" className="text-sm text-slate-500 font-medium mt-3 mb-4 shrink-0" delay={0.2} />
                  
                  <div className="flex-1 overflow-y-auto pr-2 space-y-5 pb-2">
                    {Object.entries(levelWords).map(([levelName, words]) => (
                      <div key={levelName}>
                        <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5">
                          {levelName}
                        </p>
                        <div className="flex flex-wrap gap-2.5">
                          {words.map((word) => {
                            const isPicked = selectedWords.includes(word);
                            return (
                              <button
                                key={word}
                                type="button"
                                onClick={() => toggleWord(word)}
                                className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                                  isPicked
                                    ? "bg-[#FACC15] text-slate-900 shadow-xs"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                }`}
                              >
                                {word} {isPicked && "✓"}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 5: VAQT */}
              {currentStep === 5 && (
                <motion.div key="step-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  <TypewriterText text="Kuniga necha daqiqa mashq qilmoqchisiz?" className="font-serif text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight" />
                  <TypewriterText text="Doimiylik — ravon gapirishning kaliti:" className="text-sm text-slate-500 font-medium mt-3 mb-6" delay={0.2} />
                  <div className="space-y-4">
                    {[
                      { id: "10min", title: "10 daqiqa / kun", desc: "Yengil mashg‘ulot" },
                      { id: "20min", title: "20 daqiqa / kun", desc: "Optimal sur'at (Tavsiya etiladi)" },
                      { id: "30min", title: "30 daqiqa / kun", desc: "Chuqur sho‘ng‘ish" },
                    ].map((item) => {
                      const isSelected = dailyTime === item.id;
                      return (
                        <div key={item.id} onClick={() => setDailyTime(item.id)} className={`flex items-center justify-between p-5 rounded-2xl transition-all cursor-pointer ${isSelected ? "bg-[#FEF08A]/60 ring-2 ring-[#FACC15] shadow-xs" : "bg-[#F8FAFC] hover:bg-amber-50/60"}`}>
                          <div>
                            <h4 className="font-extrabold text-base text-slate-900">{item.title}</h4>
                            <p className="text-sm text-slate-500 font-medium mt-1">{item.desc}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? "bg-[#FACC15]" : "bg-slate-200"}`}>
                            {isSelected && <span className="w-2 h-2 rounded-full bg-slate-900" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 6: XULOSA */}
              {currentStep === 6 && (
                <motion.div key="step-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                   <TypewriterText text="Shaxsiy so‘zlashuv dasturingiz tayyorlandi!" className="font-serif text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight" />
                  <TypewriterText text="Tanlovingizga asosan dastur tuzildi. Davom etish uchun ismingizni kiriting:" className="text-sm text-slate-500 font-medium mt-3 mb-6" delay={0.2} />

                  <div className="bg-[#FEF9C3]/70 rounded-2xl p-5 mb-6">
                    <p className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1">
                      Dastur Xulosasi
                    </p>
                    <h4 className="text-lg font-black text-slate-900 mb-1">
                      Daraja: {calculateLevel()}
                    </h4>
                    <p className="text-sm text-slate-700 font-medium">
                      <span className="text-slate-500 block mb-0.5">Yo‘nalishlar:</span> 
                      <span className="font-bold text-slate-900">
                        {faculties.length > 0 ? faculties.map(fId => allFaculties.find(f => f.id === fId)?.title).join(", ") : "Tanlanmagan"}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      value={wizardName}
                      onChange={(e) => setWizardName(e.target.value)}
                      placeholder="Ismingizni kiriting (masalan, Nozima)"
                      className="w-full bg-slate-100 focus:bg-white focus:ring-2 focus:ring-[#FACC15] outline-none rounded-2xl p-4 text-slate-900 text-base font-semibold shadow-xs transition-all"
                    />
                    <button
                      type="button"
                      disabled={isSubmitting || faculties.length === 0}
                      onClick={handleGoogleSignIn}
                      className="w-full bg-[#FACC15] hover:bg-[#EAB308] text-slate-900 font-bold rounded-2xl py-4 shadow-md shadow-yellow-400/20 flex items-center justify-center gap-3 text-base cursor-pointer disabled:opacity-50 transition-all"
                    >
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-xs">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.17 21.32 7.23 24 12 24z" />
                          <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.18C.43 8.13 0 9.87 0 12s.43 3.87 1.18 5.39l4.09-3.15z" />
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.68 1.18 6.61l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
                        </svg>
                      </div>
                      <span>{isSubmitting ? "Bog‘lanmoqda..." : "Google orqali davom etish"}</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSubmitting || faculties.length === 0}
                      onClick={handleDirectAccess}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl py-3.5 flex items-center justify-center gap-2 text-sm cursor-pointer transition-colors"
                    >
                      <span>Platformaga to‘g‘ridan-to‘g‘ri kirish (Dashboard) →</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6 shrink-0">
            {currentStep > 1 ? (
              <button type="button" onClick={handleBack} className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-sm cursor-pointer transition-colors">
                ← Orqaga
              </button>
            ) : (
              <div />
            )}

            {currentStep < 6 && (
              <button type="button" onClick={handleNext} className="px-8 py-3 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-slate-900 font-extrabold text-sm shadow-xs cursor-pointer transition-colors">
                Davom etish →
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Tailwind's custom scrollbar utility (agar global.css da bo'lmasa, shu yerga qo'shib qo'yamiz) */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}} />
    </div>
  );
}