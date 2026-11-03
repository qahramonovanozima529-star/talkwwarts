"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Flame,
} from "lucide-react";
import {
  dictionaryWords,
  cefrLevelsList,
  CEFRLevel,
  WordCategory,
  DictWord,
} from "@/data/dictionaryData";

// Web Audio API feedback sounds (instant, zero external audio lag)
function playAudioFeedback(isCorrect: boolean) {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (isCorrect) {
      // High pleasant chime
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } else {
      // Low buzz
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch {}
}

export const DictionaryAndGames: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState<CEFRLevel>("0-Daraja (Asosiy)");
  const [activeCategory, setActiveCategory] = useState<WordCategory>("Barchasi");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"dictionary" | "gameYesNo" | "gameListening">("dictionary");

  // LocalStorage for Mastered & Starred Words
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [starredIds, setStarredIds] = useState<string[]>([]);

  // Pagination for 5000 Words Scalability (24 words per page)
  const PAGE_SIZE = 24;
  const [currentPage, setCurrentPage] = useState(1);

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
      // Clean word text from any trailing metadata
      const cleanText = text.replace(/\s*\([^)]*\)/g, "").trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "en-US";
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Filtered words for current level
  const levelFilteredWords = useMemo(
    () => dictionaryWords.filter((w) => w.level === activeLevel),
    [activeLevel]
  );

  const wordsPool = useMemo(
    () => (levelFilteredWords.length > 0 ? levelFilteredWords : dictionaryWords),
    [levelFilteredWords]
  );

  const displayedWords = useMemo(() => {
    return levelFilteredWords.filter((w) => {
      const matchesCategory = activeCategory === "Barchasi" || w.category === activeCategory;
      const matchesSearch =
        w.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.uz.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [levelFilteredWords, activeCategory, searchQuery]);

  // Reset pagination when level, category, or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeLevel, activeCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(displayedWords.length / PAGE_SIZE));
  const paginatedWords = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return displayedWords.slice(start, start + PAGE_SIZE);
  }, [displayedWords, currentPage, PAGE_SIZE]);

  // ---------------------------------------------------------------------------
  // GAME 1: YES / NO MATCH
  // ---------------------------------------------------------------------------
  const [ynQuestionNum, setYnQuestionNum] = useState(1);
  const [ynCorrectCount, setYnCorrectCount] = useState(0);
  const [ynDisplayedUz, setYnDisplayedUz] = useState("");
  const [ynIsActualMatch, setYnIsActualMatch] = useState(true);
  const [ynFeedback, setYnFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [ynIsFinished, setYnIsFinished] = useState(false);
  const [ynCurrentWord, setYnCurrentWord] = useState<DictWord | null>(null);

  const setupYesNoRound = useCallback(
    (qNum: number) => {
      if (wordsPool.length === 0) return;
      const current = wordsPool[(qNum - 1) % wordsPool.length];
      setYnCurrentWord(current);

      const isMatch = Math.random() > 0.5;
      if (isMatch) {
        setYnDisplayedUz(current.uz);
        setYnIsActualMatch(true);
      } else {
        const others = wordsPool.filter((w) => w.id !== current.id);
        const randomOther =
          others.length > 0 ? others[Math.floor(Math.random() * others.length)] : current;
        setYnDisplayedUz(randomOther.uz);
        setYnIsActualMatch(false);
      }
      setYnFeedback("idle");
    },
    [wordsPool]
  );

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
      playAudioFeedback(true);
      speakText(ynCurrentWord.en, 1.0);
    } else {
      setYnFeedback("wrong");
      playAudioFeedback(false);
    }

    setTimeout(() => {
      if (ynQuestionNum >= 10) {
        setYnIsFinished(true);
      } else {
        setYnQuestionNum((prev) => prev + 1);
        setYnFeedback("idle");
      }
    }, 1200);
  };

  const restartYesNoGame = () => {
    setYnQuestionNum(1);
    setYnCorrectCount(0);
    setYnFeedback("idle");
    setYnIsFinished(false);
    setupYesNoRound(1);
  };

  // ---------------------------------------------------------------------------
  // GAME 2: AUDIO QUIZ (STRICTLY 5 WORDS PER STAGE, 1500MS LOCK, RANDOMIZED)
  // ---------------------------------------------------------------------------
  const [quizStage, setQuizStage] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 0 to 4
  const [stageQuestions, setStageQuestions] = useState<
    { target: DictWord; options: DictWord[] }[]
  >([]);
  const [stageCorrectCount, setStageCorrectCount] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answerResult, setAnswerResult] = useState<"idle" | "correct" | "wrong">("idle");
  const [isStageComplete, setIsStageComplete] = useState(false);
  const [isAudioRippling, setIsAudioRippling] = useState(false);

  // Setup a new randomized stage of strictly 5 questions
  const startNewStage = useCallback(
    (stageNum: number) => {
      if (wordsPool.length < 5) return;
      // 1. Shuffle words array completely
      const shuffled = [...wordsPool].sort(() => Math.random() - 0.5);
      const targets = shuffled.slice(0, 5);

      const questions = targets.map((target) => {
        const others = wordsPool.filter((w) => w.id !== target.id);
        const shuffledOthers = [...others].sort(() => Math.random() - 0.5).slice(0, 4);
        const options = [target, ...shuffledOthers].sort(() => Math.random() - 0.5);
        return { target, options };
      });

      setQuizStage(stageNum);
      setStageQuestions(questions);
      setCurrentQuestionIndex(0);
      setStageCorrectCount(0);
      setSelectedOptionId(null);
      setIsAnswered(false);
      setAnswerResult("idle");
      setIsStageComplete(false);

      // Pronounce target word
      if (questions[0]?.target) {
        setTimeout(() => {
          speakText(questions[0].target.en, 0.9);
        }, 500);
      }
    },
    [wordsPool, speakText]
  );

  // Start stage when entering listening game
  useEffect(() => {
    if (viewMode === "gameListening") {
      startNewStage(1);
    }
  }, [viewMode, activeLevel, startNewStage]);

  const activeQuestion = stageQuestions[currentQuestionIndex] || null;

  const playListenAudio = () => {
    if (!activeQuestion?.target) return;
    setIsAudioRippling(true);
    speakText(activeQuestion.target.en, 0.9);
    setTimeout(() => setIsAudioRippling(false), 1200);
  };

  // Answer handler with strict isAnswered lock and 1500ms delay
  const handleSelectListenOption = (opt: DictWord) => {
    if (isAnswered || answerResult !== "idle" || !activeQuestion) return;

    // Immediately set isAnswered lock state to true to block all rapid clicks!
    setIsAnswered(true);
    setSelectedOptionId(opt.id);

    const isCorrect = opt.id === activeQuestion.target.id;
    setAnswerResult(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      setStageCorrectCount((c) => c + 1);
    }

    // Play feedback tone
    playAudioFeedback(isCorrect);

    // Strictly 1500ms timeout before advancing to next question
    setTimeout(() => {
      if (currentQuestionIndex >= 4) {
        // Round Complete after strictly 5 questions!
        setIsStageComplete(true);
      } else {
        const nextIdx = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIdx);
        setIsAnswered(false);
        setSelectedOptionId(null);
        setAnswerResult("idle");

        // Automatically speak next word
        if (stageQuestions[nextIdx]?.target) {
          speakText(stageQuestions[nextIdx].target.en, 0.9);
        }
      }
    }, 1500);
  };

  const handleNextStage = () => {
    startNewStage(quizStage + 1);
  };

  const handleRestartQuiz = () => {
    startNewStage(1);
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
                  setCurrentPage(1);
                  setYnQuestionNum(1);
                  setYnCorrectCount(0);
                  setYnIsFinished(false);
                }}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#FACC15] text-slate-950 font-black shadow-xs"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
                }`}
              >
                {lvl}
                <span className="ml-2 text-[10px] opacity-75 font-normal">
                  (1,000 so‘z)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================= */}
      {/* 2. SUB-MODE SELECTOR: DICTIONARY / YES-NO / AUDIO QUIZ         */}
      {/* ============================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-[24px] p-3 border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
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
            <span>Lug‘at Kartalari ({levelFilteredWords.length})</span>
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
              startNewStage(1);
            }}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer ${
              viewMode === "gameListening"
                ? "bg-sky-500 text-white font-black"
                : "bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            <Ear className="w-3.5 h-3.5" />
            <span>Audio Sinov (5 Savol / Bosqich)</span>
          </button>
        </div>

        {/* Global Progress Counters */}
        <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80">
            <Check className="w-3.5 h-3.5" /> {masteredIds.length} yodlandi
          </span>
          <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80">
            <Star className="w-3.5 h-3.5 fill-current" /> {starredIds.length} yulduzcha
          </span>
        </div>
      </div>

      {/* ============================================================= */}
      {/* MODE 1: DICTIONARY CARDS (WITH PAGINATION FOR 1000 WORDS)     */}
      {/* ============================================================= */}
      {viewMode === "dictionary" && (
        <div className="space-y-6">
          {/* Search & Category Filter Bar */}
          <div className="bg-white rounded-[28px] p-4 sm:p-5 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Inglizcha yoki o‘zbekcha qidiruv..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:bg-white transition-all"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
              {(["Barchasi", "Fe'llar", "Otlar", "Sifatlar", "Kundalik iboralar"] as WordCategory[]).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                      activeCategory === cat
                        ? "bg-[#FEF08A] text-yellow-950 font-black border border-yellow-300"
                        : "bg-slate-100 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Pagination Top Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-2 font-medium">
            <span>
              Jami topildi: <strong className="text-slate-900">{displayedWords.length} ta</strong> so‘z
            </span>
            <span>
              Sahifa: <strong className="text-slate-900">{currentPage}</strong> / {totalPages}
            </span>
          </div>

          {/* Word Cards Grid (24 words per page) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedWords.map((w) => {
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
                    <p className="text-xs font-mono text-slate-400 mb-2">{w.ipa}</p>
                    <p className="text-sm font-semibold text-slate-700">{w.uz}</p>
                  </div>

                  {/* Example & Mastered Toggle */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500 italic leading-snug">"{w.exampleEn}"</p>

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

          {/* Pagination Controls Bar */}
          {totalPages > 1 && (
            <div className="bg-white rounded-[24px] p-4 border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-500 font-medium">
                Ko‘rsatilmoqda: {(currentPage - 1) * PAGE_SIZE + 1} -{" "}
                {Math.min(currentPage * PAGE_SIZE, displayedWords.length)} / {displayedWords.length} ta so‘z
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs transition-colors cursor-pointer"
                  title="Birinchi sahifa"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Oldingi</span>
                </button>

                <span className="px-3 py-1.5 bg-[#FEF08A] text-yellow-950 font-black text-xs rounded-xl">
                  {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Keyingi</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs transition-colors cursor-pointer"
                  title="Oxirgi sahifa"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* MODE 2: YES / NO GAME                                          */}
      {/* ============================================================= */}
      {viewMode === "gameYesNo" && (
        <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-stone-200/80 shadow-[0_4px_30px_rgba(0,0,0,0.04)] max-w-2xl mx-auto flex flex-col items-center text-center space-y-6">
          {ynIsFinished ? (
            <div className="space-y-6 py-6 w-full flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-400 flex items-center justify-center text-3xl shadow-lg">
                <Trophy className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                  O‘yin Yakunlandi! 🎉
                </span>
                <h3 className="font-serif text-3xl font-black text-slate-900">
                  Natijangiz: {ynCorrectCount} / 10
                </h3>
                <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
                  {ynCorrectCount >= 8
                    ? "Ajoyib xotira! Siz ko‘p so‘zlarni mukammal bilasiz."
                    : "Yaxshi natija! Lug‘at kartalarini yana bir bor takrorlang."}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={restartYesNoGame}
                  className="px-6 py-3 rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] text-slate-950 font-black text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Qayta o‘ynash</span>
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
            <>
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
                    <p className="text-xs font-mono text-slate-400">{ynCurrentWord.ipa}</p>
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
                    <p className="text-2xl font-black text-slate-900">"{ynDisplayedUz}"</p>

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
      {/* MODE 3: AUDIO QUIZ (STRICTLY 5 WORDS PER STAGE, 1500MS LOCK)  */}
      {/* ============================================================= */}
      {viewMode === "gameListening" && (
        <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-stone-200/80 shadow-[0_4px_30px_rgba(0,0,0,0.04)] max-w-2xl mx-auto flex flex-col items-center text-center space-y-6">
          {isStageComplete ? (
            /* Round Complete Screen with "Keyingi bosqichga o'tish" */
            <div className="space-y-6 py-6 w-full flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-sky-100 border-4 border-sky-400 flex items-center justify-center text-3xl shadow-lg">
                <Sparkles className="w-10 h-10 text-sky-600" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-sky-800 bg-sky-50 px-3.5 py-1 rounded-full border border-sky-200">
                  {quizStage}-Bosqich Yakunlandi! 🎧
                </span>
                <h3 className="font-serif text-3xl font-black text-slate-900">
                  Natijangiz: 5 tadan {stageCorrectCount} ta to‘g‘ri
                </h3>
                <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
                  {stageCorrectCount >= 4
                    ? "Ajoyib eshitish idroki! Yangi tasodifiy so‘zlar bilan keyingi bosqichga o‘ting."
                    : "Yaxshi urinish! Keyingi bosqichda eshitish diqqatingizni yanada charxlang."}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {/* Prominent Next Stage Button */}
                <button
                  type="button"
                  onClick={handleNextStage}
                  className="px-7 py-3.5 rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] text-slate-950 font-black text-sm shadow-md shadow-yellow-400/20 transition-all flex items-center gap-2 cursor-pointer scale-105"
                >
                  <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span>Keyingi bosqichga o‘tish ({quizStage + 1}-Bosqich) →</span>
                </button>

                <button
                  type="button"
                  onClick={handleRestartQuiz}
                  className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>1-bosqichdan boshlash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("dictionary")}
                  className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Lug‘atga qaytish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Active 5-Word Stage Gameplay */
            <>
              <div className="flex items-center justify-between w-full border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-[#CA8A04] bg-[#FEF9C3] px-3 py-1 rounded-full">
                    {activeLevel}
                  </span>
                  <span className="text-xs font-black text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                    {quizStage}-Bosqich
                  </span>
                  <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                    Savol: {currentQuestionIndex + 1} / 5
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                    To‘g‘ri: {stageCorrectCount}
                  </span>
                </div>
              </div>

              {/* Progress Bar (Strictly 5 questions per stage) */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / 5) * 100}%` }}
                />
              </div>

              {/* Audio Player Button */}
              <button
                type="button"
                onClick={playListenAudio}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer relative shadow-lg ${
                  isAudioRippling ? "bg-[#FACC15] scale-105" : "bg-sky-500 hover:bg-sky-600 text-white"
                }`}
                title="Audioni qayta tinglash"
              >
                <Volume2 className="w-8 h-8" />
                {isAudioRippling && (
                  <span className="absolute inset-0 rounded-full border-4 border-yellow-400 animate-ping pointer-events-none" />
                )}
              </button>

              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400">
                  Audioni tinglang va to‘g‘ri ma'nosini tanlang
                </p>
                {isAnswered && (
                  <p className="text-xs font-bold text-slate-600 animate-pulse">
                    Keyingi savolga 1.5 soniyada avtomatik o‘tilmoqda...
                  </p>
                )}
              </div>

              {/* 5 Options Stack with strict isAnswered disabled state */}
              {activeQuestion && (
                <div className="space-y-2.5 w-full text-left">
                  {activeQuestion.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    const isCorrect = opt.id === activeQuestion.target.id;

                    let style =
                      "bg-sky-50/80 hover:bg-sky-100 text-sky-950 border-sky-200 hover:border-sky-300";

                    if (isAnswered) {
                      if (isCorrect) {
                        style =
                          "bg-emerald-500 text-white border-emerald-600 scale-[1.01] shadow-md shadow-emerald-500/20";
                      } else if (isSelected) {
                        style =
                          "bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/20";
                      } else {
                        style = "bg-slate-100 text-slate-400 border-slate-200 opacity-40";
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => handleSelectListenOption(opt)}
                        className={`w-full p-4 rounded-2xl font-bold text-xs sm:text-sm border transition-all flex items-center justify-between cursor-pointer ${
                          isAnswered ? "pointer-events-none" : ""
                        } ${style}`}
                      >
                        <span className="text-left leading-snug">{opt.uz}</span>
                        {isAnswered && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-white" />
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 flex-shrink-0 text-white" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
