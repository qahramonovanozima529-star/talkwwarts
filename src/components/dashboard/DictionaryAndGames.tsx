"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Volume2,
  Search,
  Check,
  Star,
  Gamepad2,
  Ear,
  Layers,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  dictionaryWords,
  cefrLevelsList,
  CEFRLevel,
  WordCategory,
  DictWord,
} from "@/data/dictionaryData";

export const DictionaryAndGames: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState<CEFRLevel>("0-Daraja (Asosiy)");
  const [activeCategory, setActiveCategory] = useState<WordCategory>("Barchasi");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"dictionary" | "gameYesNo" | "gameListening">("dictionary");

  // LocalStorage for Mastered & Starred Words
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [starredIds, setStarredIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMastered = localStorage.getItem("talkwarts_mastered_words");
      if (savedMastered) {
        try {
          setMasteredIds(JSON.parse(savedMastered));
        } catch {}
      }
      const savedStarred = localStorage.getItem("talkwarts_starred_words");
      if (savedStarred) {
        try {
          setStarredIds(JSON.parse(savedStarred));
        } catch {}
      }
    }
  }, []);

  const toggleMastered = (id: string) => {
    setMasteredIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (typeof window !== "undefined") {
        localStorage.setItem("talkwarts_mastered_words", JSON.stringify(next));
      }
      return next;
    });
  };

  const toggleStarred = (id: string) => {
    setStarredIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (typeof window !== "undefined") {
        localStorage.setItem("talkwarts_starred_words", JSON.stringify(next));
      }
      return next;
    });
  };

  const speakText = useCallback((text: string, rate: number = 0.9) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Filtered words for current level, category, and search
  const levelFilteredWords = dictionaryWords.filter((w) => w.level === activeLevel);
  const wordsPool = levelFilteredWords.length > 0 ? levelFilteredWords : dictionaryWords;

  const displayedWords = levelFilteredWords.filter((w) => {
    const matchesCategory = activeCategory === "Barchasi" || w.category === activeCategory;
    const matchesSearch =
      w.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.uz.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ---------------------------------------------------------------------------
  // GAME 1: YES / NO MATCH (10-QUESTION ROUND LOOP WITH 800MS DELAY)
  // ---------------------------------------------------------------------------
  const [ynQuestionNum, setYnQuestionNum] = useState(1); // 1 to 10
  const [ynCorrectCount, setYnCorrectCount] = useState(0);
  const [ynDisplayedUz, setYnDisplayedUz] = useState("");
  const [ynIsActualMatch, setYnIsActualMatch] = useState(true);
  const [ynFeedback, setYnFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [ynIsFinished, setYnIsFinished] = useState(false);
  const [ynCurrentWord, setYnCurrentWord] = useState<DictWord | null>(null);

  const setupYesNoRound = useCallback((qNum: number) => {
    if (wordsPool.length === 0) return;
    const current = wordsPool[(qNum - 1) % wordsPool.length];
    setYnCurrentWord(current);

    const isMatch = Math.random() > 0.5;
    if (isMatch) {
      setYnDisplayedUz(current.uz);
      setYnIsActualMatch(true);
    } else {
      const others = wordsPool.filter((w) => w.id !== current.id);
      const randomOther = others.length > 0 ? others[Math.floor(Math.random() * others.length)] : current;
      setYnDisplayedUz(randomOther.uz);
      setYnIsActualMatch(false);
    }
    setYnFeedback("idle");
  }, [wordsPool]);

  useEffect(() => {
    if (viewMode === "gameYesNo" && !ynIsFinished) {
      setupYesNoRound(ynQuestionNum);
    }
  }, [viewMode, ynQuestionNum, ynIsFinished, setupYesNoRound]);

  const handleYesNoAnswer = (userSaidYes: boolean) => {
    if (ynFeedback !== "idle" || !ynCurrentWord) return;
    const isCorrect = userSaidYes === ynIsActualMatch;

    if (isCorrect) {
      setYnFeedback("correct");
      setYnCorrectCount((prev) => prev + 1);
      speakText(ynCurrentWord.en, 1.0);
    } else {
      setYnFeedback("wrong");
    }

    // 800ms visual feedback delay before next question
    setTimeout(() => {
      if (ynQuestionNum >= 10) {
        setYnIsFinished(true);
      } else {
        setYnQuestionNum((prev) => prev + 1);
        setYnFeedback("idle");
      }
    }, 800);
  };

  const restartYesNoGame = () => {
    setYnQuestionNum(1);
    setYnCorrectCount(0);
    setYnFeedback("idle");
    setYnIsFinished(false);
    setupYesNoRound(1);
  };

  // ---------------------------------------------------------------------------
  // GAME 2: 5-OPTION LISTENING QUIZ (10-QUESTION ROUND LOOP WITH 800MS DELAY)
  // ---------------------------------------------------------------------------
  const [listenQuestionNum, setListenQuestionNum] = useState(1); // 1 to 10
  const [listenCorrectCount, setListenCorrectCount] = useState(0);
  const [listenOptions, setListenOptions] = useState<DictWord[]>([]);
  const [listenSelectedId, setListenSelectedId] = useState<string | null>(null);
  const [listenState, setListenState] = useState<"idle" | "correct" | "wrong">("idle");
  const [listenIsFinished, setListenIsFinished] = useState(false);
  const [isAudioRippling, setIsAudioRippling] = useState(false);
  const [currentListenTarget, setCurrentListenTarget] = useState<DictWord | null>(null);

  const setupListeningRound = useCallback((qNum: number) => {
    if (wordsPool.length === 0) return;
    const target = wordsPool[(qNum - 1) % wordsPool.length];
    setCurrentListenTarget(target);

    const others = wordsPool.filter((w) => w.id !== target.id);
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5).slice(0, 4);
    const all5 = [target, ...shuffledOthers].sort(() => Math.random() - 0.5);

    setListenOptions(all5);
    setListenSelectedId(null);
    setListenState("idle");
  }, [wordsPool]);

  useEffect(() => {
    if (viewMode === "gameListening" && !listenIsFinished) {
      setupListeningRound(listenQuestionNum);
    }
  }, [viewMode, listenQuestionNum, listenIsFinished, setupListeningRound]);

  const playListenAudio = () => {
    if (!currentListenTarget) return;
    setIsAudioRippling(true);
    speakText(currentListenTarget.en, 0.9);
    setTimeout(() => setIsAudioRippling(false), 1200);
  };

  const handleSelectListenOption = (word: DictWord) => {
    if (listenState !== "idle" || !currentListenTarget) return;
    setListenSelectedId(word.id);

    const isCorrect = word.id === currentListenTarget.id;
    if (isCorrect) {
      setListenState("correct");
      setListenCorrectCount((c) => c + 1);
    } else {
      setListenState("wrong");
    }

    // 800ms visual delay before moving to next question
    setTimeout(() => {
      if (listenQuestionNum >= 10) {
        setListenIsFinished(true);
      } else {
        setListenQuestionNum((prev) => prev + 1);
        setListenState("idle");
        setListenSelectedId(null);
      }
    }, 900);
  };

  const restartListeningGame = () => {
    setListenQuestionNum(1);
    setListenCorrectCount(0);
    setListenState("idle");
    setListenSelectedId(null);
    setListenIsFinished(false);
    setupListeningRound(1);
  };

  return (
    <div className="space-y-6">
      {/* ============================================================= */}
      {/* 1. CEFR LEVEL TABS BAR                                         */}
      {/* ============================================================= */}
      <div className="bg-white rounded-[28px] p-2 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
          {cefrLevelsList.map((lvl) => {
            const isActive = activeLevel === lvl;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => {
                  setActiveLevel(lvl);
                  setYnQuestionNum(1);
                  setYnCorrectCount(0);
                  setYnIsFinished(false);
                  setListenQuestionNum(1);
                  setListenCorrectCount(0);
                  setListenIsFinished(false);
                }}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#FACC15] text-slate-950 font-black shadow-xs"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================= */}
      {/* 2. SUB-MODE SELECTOR: DICTIONARY / YES-NO / LISTENING          */}
      {/* ============================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-[24px] p-3 border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode("dictionary")}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer ${
              viewMode === "dictionary"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Lug‘at Kartalari</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode("gameYesNo");
              restartYesNoGame();
            }}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer ${
              viewMode === "gameYesNo"
                ? "bg-[#FACC15] text-slate-950 font-black"
                : "bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>«HA / YO‘Q» O‘yini (10 Savol)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode("gameListening");
              restartListeningGame();
            }}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer ${
              viewMode === "gameListening"
                ? "bg-sky-500 text-white font-black"
                : "bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            <Ear className="w-3.5 h-3.5" />
            <span>5-Variantli Audio Quiz (10 Savol)</span>
          </button>
        </div>

        <div className="text-xs font-bold text-slate-400">
          Ushbu darajada: <span className="text-slate-900 font-black">{levelFilteredWords.length} ta so‘z</span>
        </div>
      </div>

      {/* ============================================================= */}
      {/* MODE 1: LUG'AT KARTALARI & QIDIRUV                            */}
      {/* ============================================================= */}
      {viewMode === "dictionary" && (
        <div className="space-y-6">
          {/* Instant Search Bar & Category Filter Pills */}
          <div className="bg-white rounded-[28px] p-5 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="So‘z yoki tarjimani qidiring (masalan: book, tajriba)..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 focus:bg-white focus:ring-2 focus:ring-[#FACC15] text-xs sm:text-sm font-semibold text-slate-900 outline-none transition-all"
                />
              </div>

              {/* Categories */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
                {(["Barchasi", "Fe'llar", "Otlar", "Sifatlar", "Kundalik iboralar"] as WordCategory[]).map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        activeCategory === cat
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Word Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedWords.map((w) => {
              const isMastered = masteredIds.includes(w.id);
              const isStarred = starredIds.includes(w.id);

              return (
                <div
                  key={w.id}
                  className="bg-white rounded-[28px] p-5 border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-yellow-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Top metadata */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase text-[#CA8A04] bg-[#FEF9C3] px-2.5 py-0.5 rounded-full">
                        {w.category}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => toggleStarred(w.id)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isStarred
                              ? "text-amber-500 bg-amber-50"
                              : "text-slate-300 hover:text-slate-600"
                          }`}
                          title="Qiyin so'z / Belgilash"
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                        <button
                          type="button"
                          onClick={() => speakText(w.en)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Talaffuzni tinglash"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-serif font-black text-xl text-slate-900 leading-tight">
                      {w.en}
                    </h4>
                    <p className="text-xs font-mono text-slate-400 mb-2">
                      {w.ipa}
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {w.uz}
                    </p>
                  </div>

                  {/* Example & Mastered Toggle */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500 italic leading-snug">
                      "{w.exampleEn}"
                    </p>

                    <button
                      type="button"
                      onClick={() => toggleMastered(w.id)}
                      className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                        isMastered
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isMastered ? "Yod olindi ✓" : "Yod oldim deb belgilash"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODE 2: YES / NO MATCH (10-QUESTION ROUND LOOP)               */}
      {/* ============================================================= */}
      {viewMode === "gameYesNo" && (
        <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-stone-200/80 shadow-[0_4px_30px_rgba(0,0,0,0.04)] max-w-2xl mx-auto flex flex-col items-center text-center space-y-6">
          {ynIsFinished ? (
            /* Celebration Screen */
            <div className="space-y-6 py-6 w-full flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#FEF9C3] border-4 border-[#FACC15] flex items-center justify-center text-3xl shadow-lg">
                <Trophy className="w-10 h-10 text-yellow-600" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-yellow-800 bg-[#FFFBEB] px-3.5 py-1 rounded-full border border-yellow-200">
                  Raund Yakunlandi! 🎉
                </span>
                <h3 className="font-serif text-3xl font-black text-slate-900">
                  Natijangiz: {ynCorrectCount} / 10
                </h3>
                <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
                  {ynCorrectCount >= 8
                    ? "Fantastik natija! Siz bu darajadagi so‘zlarni deyarli mukammal o‘zlashtirdingiz."
                    : ynCorrectCount >= 5
                    ? "Yaxshi natija! Bir necha marta takrorlab, 10/10 natijaga erishing."
                    : "Yomon emas! Lug‘at kartalarini qayta ko‘rib chiqib, o‘yinni yana sinab ko‘ring."}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={restartYesNoGame}
                  className="px-6 py-3 rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] text-slate-950 font-black text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Qaytadan o‘ynash</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("dictionary")}
                  className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Lug‘atga qaytish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Active 10-Question Gameplay */
            <>
              {/* Question Progress Header */}
              <div className="flex items-center justify-between w-full border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-[#CA8A04] bg-[#FEF9C3] px-3 py-1 rounded-full">
                    {activeLevel}
                  </span>
                  <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                    Savol: {ynQuestionNum} / 10
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    To‘g‘ri: {ynCorrectCount}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#FACC15] h-full transition-all duration-300"
                  style={{ width: `${(ynQuestionNum / 10) * 100}%` }}
                />
              </div>

              {ynCurrentWord && (
                <>
                  <div className="space-y-1">
                    <h3 className="font-serif text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                      {ynCurrentWord.en}
                    </h3>
                    <p className="text-xs font-mono text-slate-400">
                      {ynCurrentWord.ipa}
                    </p>
                  </div>

                  <div
                    className={`w-full p-6 rounded-2xl border transition-all ${
                      ynFeedback === "correct"
                        ? "bg-emerald-50 border-emerald-400 scale-[1.02]"
                        : ynFeedback === "wrong"
                        ? "bg-rose-50 border-rose-400 scale-[1.02]"
                        : "bg-[#F8FAFC] border-slate-200"
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Mos keluvchi tarjima deb o‘ylaysizmi?
                    </p>
                    <p className="text-2xl font-black text-slate-900">
                      "{ynDisplayedUz}"
                    </p>

                    {ynFeedback === "correct" && (
                      <p className="text-xs font-black text-emerald-700 mt-2 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> To‘g‘ri topdingiz!
                      </p>
                    )}
                    {ynFeedback === "wrong" && (
                      <p className="text-xs font-black text-rose-700 mt-2 flex items-center justify-center gap-1">
                        <XCircle className="w-4 h-4" /> Noto‘g‘ri! Haqiqiy ma'nosi: "{ynCurrentWord.uz}"
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full">
                    <button
                      type="button"
                      onClick={() => handleYesNoAnswer(true)}
                      disabled={ynFeedback !== "idle"}
                      className="py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>HA (Mos)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleYesNoAnswer(false)}
                      disabled={ynFeedback !== "idle"}
                      className="py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>YO‘Q (Mos emas)</span>
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* MODE 3: 5-OPTION LISTENING QUIZ (10-QUESTION ROUND LOOP)      */}
      {/* ============================================================= */}
      {viewMode === "gameListening" && (
        <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-stone-200/80 shadow-[0_4px_30px_rgba(0,0,0,0.04)] max-w-2xl mx-auto flex flex-col items-center text-center space-y-6">
          {listenIsFinished ? (
            /* Celebration Screen */
            <div className="space-y-6 py-6 w-full flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-sky-100 border-4 border-sky-400 flex items-center justify-center text-3xl shadow-lg">
                <Sparkles className="w-10 h-10 text-sky-600" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-sky-800 bg-sky-50 px-3.5 py-1 rounded-full border border-sky-200">
                  Audio Sinov Yakunlandi! 🎧
                </span>
                <h3 className="font-serif text-3xl font-black text-slate-900">
                  Natijangiz: {listenCorrectCount} / 10
                </h3>
                <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
                  {listenCorrectCount >= 8
                    ? "Ajoyib eshitish idroki! Siz talaffuz qilingan so‘zlarni bir zumda aniqlay oldingiz."
                    : "Yaxshi urinish! Quloqni inglizcha ohangga moslashtirish uchun darslarni davom ettiring."}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={restartListeningGame}
                  className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-black text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Qaytadan boshlash</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("dictionary")}
                  className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Lug‘atga qaytish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Active 10-Question Gameplay */
            <>
              <div className="flex items-center justify-between w-full border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-[#CA8A04] bg-[#FEF9C3] px-3 py-1 rounded-full">
                    {activeLevel}
                  </span>
                  <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                    Savol: {listenQuestionNum} / 10
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                    To‘g‘ri: {listenCorrectCount}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full transition-all duration-300"
                  style={{ width: `${(listenQuestionNum / 10) * 100}%` }}
                />
              </div>

              {/* Audio Player Button */}
              <button
                type="button"
                onClick={playListenAudio}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer relative shadow-lg ${
                  isAudioRippling ? "bg-[#FACC15] scale-105" : "bg-sky-500 hover:bg-sky-600 text-white"
                }`}
                title="Audioni tinglash"
              >
                <Volume2 className="w-8 h-8" />
                {isAudioRippling && (
                  <span className="absolute inset-0 rounded-full border-4 border-yellow-400 animate-ping pointer-events-none" />
                )}
              </button>
              <p className="text-xs font-bold text-slate-400">
                Audioni tinglang va to‘g‘ri ma'nosini tanlang (800ms avtomatik o‘tish)
              </p>

              {/* 5 Options Stack */}
              <div className="space-y-2.5 w-full text-left">
                {listenOptions.map((opt) => {
                  const isSelected = listenSelectedId === opt.id;
                  const isCorrect = opt.id === currentListenTarget?.id;

                  let style = "bg-sky-50/80 hover:bg-sky-100 text-sky-950 border-sky-200";

                  if (listenState !== "idle") {
                    if (isCorrect) {
                      style = "bg-emerald-500 text-white border-emerald-600 scale-[1.01]";
                    } else if (isSelected) {
                      style = "bg-rose-500 text-white border-rose-600";
                    } else {
                      style = "bg-slate-100 text-slate-400 border-slate-200 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={listenState !== "idle"}
                      onClick={() => handleSelectListenOption(opt)}
                      className={`w-full p-3.5 rounded-2xl font-bold text-xs sm:text-sm border transition-all flex items-center justify-between cursor-pointer ${style}`}
                    >
                      <span>{opt.uz}</span>
                      {listenState !== "idle" && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
