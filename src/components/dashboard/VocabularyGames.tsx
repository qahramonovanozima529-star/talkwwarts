"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  RotateCw,
  Trophy,
  Check,
  Brain,
  Layers,
  Gamepad2,
  Ear,
  ArrowRight,
  Flame,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export interface VocabWord {
  id: string;
  en: string;
  uz: string;
  ipa: string;
  category: string;
  exampleEn: string;
  exampleUz: string;
}

const defaultVocabBank: VocabWord[] = [
  {
    id: "v1",
    en: "Architecture",
    uz: "Tizim arxitekturasi va tuzilishi",
    ipa: "/ˈɑːrkɪtektʃər/",
    category: "IT & Texnologiya",
    exampleEn: "Our team revamped the cloud architecture to handle peak traffic.",
    exampleUz: "Jamoamiz eng yuqori yuklamani ko‘tarish uchun bulutli arxitekturani yangiladi.",
  },
  {
    id: "v2",
    en: "Bottleneck",
    uz: "To‘siq, jarayonni sekinlashtiruvchi nuqta",
    ipa: "/ˈbɑːtlnek/",
    category: "IT & Texnologiya",
    exampleEn: "Database queries were the primary bottleneck in production.",
    exampleUz: "Ishchi tizimda asosiy to‘siq ma'lumotlar bazasi so‘rovlari bo‘lib chiqdi.",
  },
  {
    id: "v3",
    en: "Perspective",
    uz: "Nigoh, qarash yoki nuqtai nazar",
    ipa: "/pərˈspektɪv/",
    category: "Umumiy & Muloqot",
    exampleEn: "Her international experience brings a fresh perspective to our research.",
    exampleUz: "Uning xalqaro tajribasi tadqiqotimizga yangicha qarash olib kirdi.",
  },
  {
    id: "v4",
    en: "Decouple",
    uz: "O‘zaro bog‘liqlikdan ajratish",
    ipa: "/diːˈkʌpl/",
    category: "Muhandislik",
    exampleEn: "We must decouple the payment gateway from our core services.",
    exampleUz: "To‘lov tizimini asosiy xizmatlarimizdan to‘liq ajratishimiz lozim.",
  },
  {
    id: "v5",
    en: "Resilience",
    uz: "Chidamlilik, bardoshlilik",
    ipa: "/rɪˈzɪliəns/",
    category: "Liderlik",
    exampleEn: "The distributed network demonstrated remarkable resilience during testing.",
    exampleUz: "Taqsimlangan tarmoq sinovlar paytida ajoyib chidamlilik ko‘rsatdi.",
  },
  {
    id: "v6",
    en: "Deliverables",
    uz: "Kutilayotgan aniq natijalar yoki mahsulotlar",
    ipa: "/dɪˈlɪvərəblz/",
    category: "Biznes & Boshqaruv",
    exampleEn: "All project deliverables must be approved by client stakeholders.",
    exampleUz: "Loyiha bo‘yicha barcha kutilgan natijalar mijoz tomonidan tasdiqlanishi kerak.",
  },
  {
    id: "v7",
    en: "Trajectory",
    uz: "Rivojlanish yo‘nalishi yoki traektoriyasi",
    ipa: "/trəˈdʒektəri/",
    category: "Tahlil & Ilm-fan",
    exampleEn: "The quarterly metrics show an accelerating growth trajectory.",
    exampleUz: "Choraklik ko‘rsatkichlar tezlashib borayotgan o‘sish yo‘nalishini tasdiqlaydi.",
  },
  {
    id: "v8",
    en: "Paradigm",
    uz: "Umumiy tushuncha yoki o‘rnatilgan qolip",
    ipa: "/ˈpærədaɪm/",
    category: "Ilm-fan & Falsafa",
    exampleEn: "Artificial intelligence has shifted the entire software paradigm.",
    exampleUz: "Sun'iy intellekt dasturiy ta'minotning butun qolipini o‘zgartirib yubordi.",
  },
  {
    id: "v9",
    en: "Milestone",
    uz: "Oraliq muhim marra yoki bosqich",
    ipa: "/ˈmaɪlstoʊn/",
    category: "Loyiha Boshqaruvi",
    exampleEn: "Reaching ten thousand daily active users was a critical milestone.",
    exampleUz: "Kunlik o‘n ming faol foydalanuvchiga erishish muhim oraliq marra bo‘ldi.",
  },
  {
    id: "v10",
    en: "Compromise",
    uz: "O‘zaro kelishuv, murosa",
    ipa: "/ˈkɑːmprəmaɪz/",
    category: "Muzokara",
    exampleEn: "We found a balanced compromise that satisfied both engineering and business.",
    exampleUz: "Muhandislik va biznes manfaatlarini qanoatlantirgan muvozanatli kelishuv topdik.",
  },
  {
    id: "v11",
    en: "Consensus",
    uz: "Umumiy yakdillik, bir fikrga kelish",
    ipa: "/kənˈsensəs/",
    category: "Jamoa & Qaror",
    exampleEn: "The leadership committee reached a unanimous consensus on the roadmap.",
    exampleUz: "Rahbariyat qo‘mitasi yo‘l xaritasi bo‘yicha bir ovozdan yakdil qarorga keldi.",
  },
  {
    id: "v12",
    en: "Optimize",
    uz: "Samaradorlikni oshirish, optimallashtirish",
    ipa: "/ˈɑːptɪmaɪz/",
    category: "IT & Texnologiya",
    exampleEn: "Let's optimize our database queries to lower latency.",
    exampleUz: "Kechikishni kamaytirish uchun ma'lumotlar bazasi so‘rovlarini optimallashtiraylik.",
  },
];

type GameTabMode = "yesno" | "listening" | "flashcards" | "vocab";

export const VocabularyGames: React.FC = () => {
  const [activeMode, setActiveMode] = useState<GameTabMode>("yesno");

  // Global Audio Speech Synthesis Helper
  const speakWord = useCallback((word: string, rate: number = 0.9) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // GAME 1: YES / NO MATCH STATE
  // ---------------------------------------------------------------------------
  const [ynWordIndex, setYnWordIndex] = useState(0);
  const [ynDisplayedUz, setYnDisplayedUz] = useState("");
  const [ynIsActualMatch, setYnIsActualMatch] = useState(true);
  const [ynScore, setYnScore] = useState(0);
  const [ynStreak, setYnStreak] = useState(0);
  const [ynAnswerState, setYnAnswerState] = useState<"idle" | "correct" | "wrong">("idle");
  const [ynAnswerMessage, setYnAnswerMessage] = useState("");

  const setupYesNoRound = useCallback((index: number) => {
    const currentWord = defaultVocabBank[index % defaultVocabBank.length];
    // 50% chance to be genuinely matching, 50% chance to be mismatched
    const isMatch = Math.random() > 0.5;
    if (isMatch) {
      setYnDisplayedUz(currentWord.uz);
      setYnIsActualMatch(true);
    } else {
      // Pick a random alternative
      const otherWords = defaultVocabBank.filter((w) => w.id !== currentWord.id);
      const randomOther = otherWords[Math.floor(Math.random() * otherWords.length)];
      setYnDisplayedUz(randomOther.uz);
      setYnIsActualMatch(false);
    }
    setYnAnswerState("idle");
    setYnAnswerMessage("");
  }, []);

  useEffect(() => {
    setupYesNoRound(ynWordIndex);
  }, [ynWordIndex, setupYesNoRound]);

  const handleYesNoClick = (userAnswer: boolean) => {
    if (ynAnswerState !== "idle") return; // prevent spamming

    const isCorrect = userAnswer === ynIsActualMatch;
    const currentWord = defaultVocabBank[ynWordIndex % defaultVocabBank.length];

    if (isCorrect) {
      setYnAnswerState("correct");
      setYnScore((prev) => prev + 10);
      setYnStreak((prev) => prev + 1);
      setYnAnswerMessage("To‘g‘ri javob! +10 ball 🎉");
      speakWord(currentWord.en, 1.0);
    } else {
      setYnAnswerState("wrong");
      setYnStreak(0);
      setYnAnswerMessage(`Noto‘g‘ri! Haqiqiy tarjimasi: "${currentWord.uz}"`);
    }

    // Auto-advance after 1.2s
    setTimeout(() => {
      setYnWordIndex((prev) => prev + 1);
    }, 1200);
  };

  // ---------------------------------------------------------------------------
  // GAME 2: LISTENING COMPREHENSION STATE
  // ---------------------------------------------------------------------------
  const [listenIndex, setListenIndex] = useState(0);
  const [listenOptions, setListenOptions] = useState<VocabWord[]>([]);
  const [listenSelectedId, setListenSelectedId] = useState<string | null>(null);
  const [listenAnswerState, setListenAnswerState] = useState<"idle" | "correct" | "wrong">("idle");
  const [listenScore, setListenScore] = useState(0);
  const [listenStreak, setListenStreak] = useState(0);
  const [listenSpeed, setListenSpeed] = useState<number>(0.9);
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);

  const setupListeningRound = useCallback((index: number) => {
    const targetWord = defaultVocabBank[index % defaultVocabBank.length];
    // Gather 3-4 distractors
    const otherWords = defaultVocabBank.filter((w) => w.id !== targetWord.id);
    const shuffledOthers = [...otherWords].sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [targetWord, ...shuffledOthers].sort(() => Math.random() - 0.5);

    setListenOptions(allOptions);
    setListenSelectedId(null);
    setListenAnswerState("idle");
  }, []);

  useEffect(() => {
    setupListeningRound(listenIndex);
  }, [listenIndex, setupListeningRound]);

  const currentListeningWord = defaultVocabBank[listenIndex % defaultVocabBank.length];

  const handlePlayListeningAudio = () => {
    setIsSpeakingAudio(true);
    speakWord(currentListeningWord.en, listenSpeed);
    setTimeout(() => setIsSpeakingAudio(false), 1200);
  };

  const handleListeningSelect = (option: VocabWord) => {
    if (listenAnswerState !== "idle") return;

    setListenSelectedId(option.id);
    const isCorrect = option.id === currentListeningWord.id;

    if (isCorrect) {
      setListenAnswerState("correct");
      setListenScore((prev) => prev + 20);
      setListenStreak((prev) => prev + 1);
    } else {
      setListenAnswerState("wrong");
      setListenStreak(0);
    }
  };

  const handleNextListening = () => {
    setListenIndex((prev) => prev + 1);
  };

  // ---------------------------------------------------------------------------
  // 3D FLASHCARDS STATE
  // ---------------------------------------------------------------------------
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMastered = localStorage.getItem("talkwarts_vocab_mastered");
      if (savedMastered) {
        try {
          setMasteredIds(JSON.parse(savedMastered));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const handleMarkMastered = (id: string) => {
    setMasteredIds((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      if (typeof window !== "undefined") {
        localStorage.setItem("talkwarts_vocab_mastered", JSON.stringify(next));
      }
      return next;
    });
    setIsFlipped(false);
    if (cardIndex < defaultVocabBank.length - 1) {
      setCardIndex((prev) => prev + 1);
    }
  };

  const currentFlashcard = defaultVocabBank[cardIndex % defaultVocabBank.length];

  // ---------------------------------------------------------------------------
  // LUG'AT BANKI SEARCH STATE
  // ---------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState("");
  const filteredVocab = defaultVocabBank.filter(
    (w) =>
      w.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.uz.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* ============================================================= */}
      {/* GAME NAVIGATION SUB-BAR                                       */}
      {/* ============================================================= */}
      <div className="bg-white rounded-[28px] p-2 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {/* Game 1: Yes/No */}
          <button
            type="button"
            onClick={() => setActiveMode("yesno")}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === "yesno"
                ? "bg-[#FACC15] text-slate-950 font-black shadow-xs"
                : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>«HA / YO‘Q» Juftlik Sinovi</span>
          </button>

          {/* Game 2: Listening Comprehension */}
          <button
            type="button"
            onClick={() => setActiveMode("listening")}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === "listening"
                ? "bg-sky-500 text-white font-black shadow-md shadow-sky-500/20"
                : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
            }`}
          >
            <Ear className="w-4 h-4" />
            <span>«Eshitib Tushunish»</span>
          </button>

          {/* 3D Flashcards */}
          <button
            type="button"
            onClick={() => setActiveMode("flashcards")}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === "flashcards"
                ? "bg-[#FACC15] text-slate-950 font-black shadow-xs"
                : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
            }`}
          >
            <RotateCw className="w-4 h-4" />
            <span>3D Flashcardlar</span>
          </button>

          {/* Vocab Bank */}
          <button
            type="button"
            onClick={() => setActiveMode("vocab")}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === "vocab"
                ? "bg-[#FACC15] text-slate-950 font-black shadow-xs"
                : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Lug‘at Banki</span>
          </button>
        </div>

        {/* Mastered Counter Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFBEB] text-yellow-900 text-xs font-bold border border-yellow-200/70">
          <Brain className="w-3.5 h-3.5 text-[#CA8A04]" />
          <span>{masteredIds.length} ta ibora to‘liq yodlandi</span>
        </div>
      </div>

      {/* ============================================================= */}
      {/* MODE 1: GAME 1 — YES / NO MATCH                               */}
      {/* ============================================================= */}
      {activeMode === "yesno" && (
        <motion.div
          key="mode-yesno"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          {/* Top Score Banner */}
          <div className="bg-white rounded-[28px] p-5 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg font-black text-slate-900 tracking-tight">
                Tezkor Juftlik Sinovi (Yes / No Match)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Berilgan inglizcha so‘z va o‘zbekcha ma'no bir-biriga mos kelishini aniqlang.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-full bg-[#FFFBEB] text-yellow-900 text-xs font-black flex items-center gap-1.5 border border-yellow-200">
                <Trophy className="w-3.5 h-3.5 text-yellow-600" />
                <span>Ball: {ynScore}</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-orange-50 text-orange-700 text-xs font-black flex items-center gap-1.5 border border-orange-200">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>Streak: {ynStreak}</span>
              </div>
            </div>
          </div>

          {/* Central Interactive Match Arena */}
          <div className="bg-white rounded-[32px] p-8 sm:p-12 border border-stone-200/80 shadow-[0_4px_30px_rgba(0,0,0,0.04)] max-w-2xl mx-auto flex flex-col items-center text-center relative overflow-hidden">
            {/* Ambient Background Aura */}
            <div className="absolute top-0 w-64 h-64 bg-[#FEF9C3]/40 rounded-full blur-3xl pointer-events-none" />

            {/* Word Category Badge */}
            <span className="text-[11px] font-black uppercase tracking-wider text-[#CA8A04] bg-[#FEF9C3] px-3.5 py-1 rounded-full mb-6">
              {defaultVocabBank[ynWordIndex % defaultVocabBank.length].category}
            </span>

            {/* English Word Display */}
            <div className="flex items-center justify-center gap-3 mb-2">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                {defaultVocabBank[ynWordIndex % defaultVocabBank.length].en}
              </h2>
              <button
                type="button"
                onClick={() =>
                  speakWord(defaultVocabBank[ynWordIndex % defaultVocabBank.length].en)
                }
                className="p-2 rounded-xl bg-slate-100 hover:bg-yellow-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                title="Ovozli tinglash"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-mono text-slate-400 mb-6">
              {defaultVocabBank[ynWordIndex % defaultVocabBank.length].ipa}
            </p>

            <div className="w-16 h-0.5 bg-slate-100 mb-6" />

            {/* Prompt & Displayed Uzbek Meaning */}
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Tavsiya etilgan tarjima:
            </p>
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-slate-100 w-full mb-8">
              <p className="text-lg sm:text-xl font-bold text-slate-800">
                "{ynDisplayedUz}"
              </p>
            </div>

            {/* Feedback Alert Pill */}
            <AnimatePresence>
              {ynAnswerState !== "idle" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mb-6 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 ${
                    ynAnswerState === "correct"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {ynAnswerState === "correct" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>{ynAnswerMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* YES / NO Action Buttons (Strictly Styled) */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <button
                type="button"
                onClick={() => handleYesNoClick(true)}
                disabled={ynAnswerState !== "idle"}
                className="py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black text-base shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>HA (Yes)</span>
              </button>

              <button
                type="button"
                onClick={() => handleYesNoClick(false)}
                disabled={ynAnswerState !== "idle"}
                className="py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-base shadow-lg shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <XCircle className="w-5 h-5 stroke-[2.5]" />
                <span>YO‘Q (No)</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ============================================================= */}
      {/* MODE 2: GAME 2 — LISTENING COMPREHENSION                       */}
      {/* ============================================================= */}
      {activeMode === "listening" && (
        <motion.div
          key="mode-listening"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          {/* Header & Score */}
          <div className="bg-white rounded-[28px] p-5 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg font-black text-slate-900 tracking-tight">
                Eshitib Tushunish Mashqi (Listening Comprehension)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Audioni tinglang va mos keluvchi to‘g‘ri o‘zbekcha tarjimani ko‘k tugmalardan tanlang.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-800 text-xs font-black flex items-center gap-1.5 border border-sky-200">
                <Trophy className="w-3.5 h-3.5 text-sky-600" />
                <span>Ball: {listenScore}</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-orange-50 text-orange-700 text-xs font-black flex items-center gap-1.5 border border-orange-200">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>Streak: {listenStreak}</span>
              </div>
            </div>
          </div>

          {/* Listening Arena */}
          <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-stone-200/80 shadow-[0_4px_30px_rgba(0,0,0,0.04)] max-w-2xl mx-auto flex flex-col items-center">
            
            {/* Audio Station Player */}
            <div className="flex flex-col items-center mb-8 relative">
              <button
                type="button"
                onClick={handlePlayListeningAudio}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all cursor-pointer relative shadow-xl ${
                  isSpeakingAudio
                    ? "bg-[#FACC15] text-slate-950 scale-105 shadow-yellow-400/40"
                    : "bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/30"
                }`}
                title="Audioni tinglash"
              >
                <Volume2 className="w-10 h-10" />

                {/* Animated Ripple Waves */}
                {isSpeakingAudio && (
                  <span className="absolute inset-0 rounded-full border-4 border-yellow-400 animate-ping pointer-events-none" />
                )}
              </button>

              <p className="text-xs font-bold text-slate-500 mt-3">
                {isSpeakingAudio ? "Tinglanmoqda..." : "Audioni eshitish uchun bosing"}
              </p>

              {/* Speech Speed Controls */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setListenSpeed(0.75)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-colors ${
                    listenSpeed === 0.75
                      ? "bg-sky-100 text-sky-800"
                      : "bg-slate-100 text-slate-500 hover:text-slate-900"
                  }`}
                >
                  0.75x (Sekin)
                </button>
                <button
                  type="button"
                  onClick={() => setListenSpeed(1.0)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-colors ${
                    listenSpeed === 1.0
                      ? "bg-sky-100 text-sky-800"
                      : "bg-slate-100 text-slate-500 hover:text-slate-900"
                  }`}
                >
                  1.0x (Me'yor)
                </button>
              </div>
            </div>

            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              To‘g‘ri ma'noni tanlang:
            </p>

            {/* Stack of 4 Cyan/Blue Option Buttons */}
            <div className="space-y-3 w-full">
              {listenOptions.map((opt) => {
                const isSelected = listenSelectedId === opt.id;
                const isActualCorrect = opt.id === currentListeningWord.id;

                let buttonClass =
                  "bg-sky-50/80 hover:bg-sky-100/90 text-sky-950 border border-sky-200/80 hover:border-sky-300";

                if (listenAnswerState !== "idle") {
                  if (isActualCorrect) {
                    buttonClass = "bg-emerald-500 text-white border-emerald-600 shadow-md";
                  } else if (isSelected) {
                    buttonClass = "bg-rose-500 text-white border-rose-600 shadow-md";
                  } else {
                    buttonClass = "bg-slate-100 text-slate-400 border-slate-200 opacity-60";
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleListeningSelect(opt)}
                    disabled={listenAnswerState !== "idle"}
                    className={`w-full p-4 rounded-2xl font-bold text-sm text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${buttonClass}`}
                  >
                    <span>{opt.uz}</span>
                    {listenAnswerState !== "idle" && isActualCorrect && (
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    )}
                    {listenAnswerState !== "idle" && isSelected && !isActualCorrect && (
                      <XCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Reveal and Advance CTA */}
            {listenAnswerState !== "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-2xl bg-[#FFFBEB] border border-yellow-200 w-full text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="text-xs font-bold text-[#CA8A04] uppercase">
                    Eshitilgan so‘z:
                  </p>
                  <p className="text-base font-serif font-black text-slate-900">
                    {currentListeningWord.en}{" "}
                    <span className="text-xs font-mono font-normal text-slate-500">
                      ({currentListeningWord.ipa})
                    </span>
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    "{currentListeningWord.exampleEn}"
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleNextListening}
                  className="px-5 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-slate-900 font-black text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
                >
                  <span>Keyingi savol</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* ============================================================= */}
      {/* MODE 3: 3D FLASHCARDS                                         */}
      {/* ============================================================= */}
      {activeMode === "flashcards" && (
        <motion.div
          key="mode-flashcards"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-[28px] p-5 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg font-black text-slate-900 tracking-tight">
                3D Flashcardlar Mashqi
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Kartaning orqa tomonini ko‘rish uchun ustiga bosing.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {cardIndex + 1} / {defaultVocabBank.length}
            </span>
          </div>

          {/* 3D Flippable Card */}
          <div className="flex flex-col items-center">
            <div
              className="w-full max-w-lg h-[340px] cursor-pointer [perspective:1000px]"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <motion.div
                className="w-full h-full relative [transform-style:preserve-3d] transition-transform duration-500 rounded-[32px] shadow-[0_10px_35px_rgba(0,0,0,0.05)] border border-stone-200/80 bg-white"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
              >
                {/* FRONT FACE */}
                <div className="absolute inset-0 [backface-visibility:hidden] p-8 flex flex-col justify-between items-center text-center rounded-[32px] bg-white">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] font-black uppercase text-[#CA8A04] bg-[#FEF9C3] px-3 py-1 rounded-full">
                      {currentFlashcard.category}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWord(currentFlashcard.en);
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-yellow-100 text-slate-600 hover:text-slate-900 transition-colors"
                      title="Talaffuz"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h2 className="font-serif text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-2">
                      {currentFlashcard.en}
                    </h2>
                    <p className="text-sm font-mono text-slate-400">
                      {currentFlashcard.ipa}
                    </p>
                  </div>

                  <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5" />
                    Tarjimani ko‘rish uchun kartaga bosing
                  </p>
                </div>

                {/* BACK FACE */}
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] p-8 flex flex-col justify-between items-center text-center rounded-[32px] bg-[#FFFBEB] border border-yellow-200">
                  <span className="text-[11px] font-black uppercase text-yellow-800">
                    O‘zbekcha Ma'nosi & Misol
                  </span>

                  <div className="space-y-3">
                    <h3 className="font-serif text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                      {currentFlashcard.uz}
                    </h3>
                    <div className="p-3.5 bg-white/80 rounded-2xl border border-yellow-200/60 text-left">
                      <p className="text-xs font-bold text-slate-800 mb-1">
                        "{currentFlashcard.exampleEn}"
                      </p>
                      <p className="text-[11px] font-medium text-slate-500">
                        {currentFlashcard.exampleUz}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkMastered(currentFlashcard.id);
                    }}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                      masteredIds.includes(currentFlashcard.id)
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-[#FACC15] hover:bg-[#EAB308] text-slate-900"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>
                      {masteredIds.includes(currentFlashcard.id)
                        ? "Yodlangan ✓"
                        : "Yodladim deb belgilash"}
                    </span>
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Bottom Carousel Controls */}
            <div className="flex items-center gap-4 mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsFlipped(false);
                  setCardIndex((prev) =>
                    prev === 0 ? defaultVocabBank.length - 1 : prev - 1
                  );
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                ← Oldingi
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFlipped(false);
                  setCardIndex((prev) =>
                    prev === defaultVocabBank.length - 1 ? 0 : prev + 1
                  );
                }}
                className="px-5 py-2 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-slate-900 font-bold text-xs cursor-pointer"
              >
                Keyingi →
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ============================================================= */}
      {/* MODE 4: LUG'AT BANKI (REFERENCE VOCABULARY LIST)              */}
      {/* ============================================================= */}
      {activeMode === "vocab" && (
        <motion.div
          key="mode-vocab"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          {/* Top Search Input */}
          <div className="bg-white rounded-[28px] p-5 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg font-black text-slate-900 tracking-tight">
                Lug‘at Banki
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Barcha o‘rganilgan terminlar, ularning transkripsiyasi va talaffuzi.
              </p>
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="So‘z yoki toifa bo‘yicha qidirish..."
              className="w-full sm:w-72 px-4 py-2.5 rounded-2xl bg-slate-100 focus:bg-white focus:ring-2 focus:ring-[#FACC15] text-xs font-semibold text-slate-900 outline-none transition-all"
            />
          </div>

          {/* Vocabulary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVocab.map((w) => (
              <div
                key={w.id}
                className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-yellow-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase text-[#CA8A04] bg-[#FEF9C3] px-2.5 py-0.5 rounded-full">
                      {w.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => speakWord(w.en)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      title="Talaffuz"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-serif font-black text-lg text-slate-900">
                    {w.en}
                  </h4>
                  <p className="text-xs font-mono text-slate-400 mb-2">
                    {w.ipa}
                  </p>
                  <p className="text-xs font-semibold text-slate-700">
                    {w.uz}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 italic">
                  "{w.exampleEn}"
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
