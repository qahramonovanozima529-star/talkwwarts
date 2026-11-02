"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Volume2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  XCircle,
  Mic,
  MicOff,
  Send,
  ArrowRight,
} from "lucide-react";
import { LessonData, DeepPhrase } from "@/data/curriculumData";
import { playCleanSpeech, stopAllSpeech, VoiceLanguage } from "@/lib/speechEngine";
import { LanguagePreference } from "@/app/api/garri-ai/route";

interface LessonStudioProps {
  lesson: LessonData;
  onExit: () => void;
  onLessonComplete: (lessonId: number) => void;
  isAlreadyCompleted: boolean;
}

type StudioStep = 1 | 2 | 3 | 4;

export const LessonStudio: React.FC<LessonStudioProps> = ({
  lesson,
  onExit,
  onLessonComplete,
  isAlreadyCompleted,
}) => {
  const [currentStep, setCurrentStep] = useState<StudioStep>(1);

  // Audio helper
  const speakText = (text: string, rate: number = 0.9) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  // ---------------------------------------------------------------------------
  // STEP 1 STATE: EXPANDED ACCORDIONS
  // ---------------------------------------------------------------------------
  const [expandedPhraseId, setExpandedPhraseId] = useState<string | null>(
    lesson.deepPhrases[0]?.id || null
  );

  const toggleAccordion = (id: string) => {
    setExpandedPhraseId((prev) => (prev === id ? null : id));
  };

  // ---------------------------------------------------------------------------
  // STEP 2 STATE: 4-QUESTION MINI QUIZ (MUST SCORE 100% TO PROCEED)
  // ---------------------------------------------------------------------------
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const handleSelectAnswer = (qId: string, answer: string) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qId]: answer }));
  };

  const handleGradeQuiz = () => {
    let correctCount = 0;
    lesson.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    setQuizScore(correctCount);
    setQuizSubmitted(true);
  };

  const handleRetryQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  // ---------------------------------------------------------------------------
  // STEP 3 STATE: AUDIO LISTENING QUIZ
  // ---------------------------------------------------------------------------
  const [audioSelectedAnswer, setAudioSelectedAnswer] = useState<string | null>(null);
  const [audioAnswerState, setAudioAnswerState] = useState<"idle" | "correct" | "wrong">("idle");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const playListeningAudio = useCallback(() => {
    setIsPlayingAudio(true);
    speakText(lesson.listeningQuiz.spokenText, 0.85);
    setTimeout(() => setIsPlayingAudio(false), 1500);
  }, [lesson.listeningQuiz.spokenText]);

  // Auto-play when entering Step 3
  useEffect(() => {
    if (currentStep === 3) {
      playListeningAudio();
    }
  }, [currentStep, playListeningAudio]);

  const handleSelectAudioOption = (opt: string) => {
    if (audioAnswerState !== "idle") return;
    setAudioSelectedAnswer(opt);
    if (opt === lesson.listeningQuiz.correctAnswer) {
      setAudioAnswerState("correct");
    } else {
      setAudioAnswerState("wrong");
    }
  };

  // ---------------------------------------------------------------------------
  // STEP 4 STATE: REAL SPEECH RECOGNITION AI SPEAKING CHECK WITH GEMINI API
  // ---------------------------------------------------------------------------
  interface SpokenMessageItem {
    sender: "user" | "garri";
    text: string;
    correctedText?: string;
    explanation?: string;
    uzbekExplanation?: string;
    aiReplyEnglish?: string;
    replyTranslation?: string;
    aiReplyUzbek?: string;
    scores?: { grammar: number; fluency: number; vocab: number };
    hints?: Array<{ en: string; translation?: string; uz?: string; ru?: string }>;
  }

  const [langPreference, setLangPreference] = useState<LanguagePreference>("uz");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("talkwarts_lang_preference");
      if (saved === "uz" || saved === "ru" || saved === "en") {
        setLangPreference(saved);
      }
    }
  }, []);

  const changeLanguagePreference = (lang: LanguagePreference) => {
    setLangPreference(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("talkwarts_lang_preference", lang);
    }
  };

  const [spokenMessages, setSpokenMessages] = useState<SpokenMessageItem[]>([
    {
      sender: "garri",
      text: `Hello! I am Garri. To complete this lesson, let's practice speaking. ${lesson.speakingPrompt.scenarioUz}`,
      aiReplyEnglish: `Hello! I am Garri. To complete this lesson, let's practice speaking. ${lesson.speakingPrompt.scenarioUz}`,
      replyTranslation:
        langPreference === "ru"
          ? `Привет! Я Гарри. Чтобы завершить этот урок, давайте потренируем разговорную речь.`
          : `Salom! Men Garri. Ushbu darsni yakunlash uchun jonli suhbatlashamiz.`,
      aiReplyUzbek: `Salom! Men Garri. Ushbu darsni yakunlash uchun jonli suhbatlashamiz.`,
    },
  ]);
  const [currentInputText, setCurrentInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isGarriThinking, setIsGarriThinking] = useState(false);
  const [activeAudioKey, setActiveAudioKey] = useState<string | null>(null);
  const [spokenSentencesCount, setSpokenSentencesCount] = useState(0);
  const [isLessonFinished, setIsLessonFinished] = useState(false);
  const [activeHints, setActiveHints] = useState<Array<{ en: string; translation: string }>>([
    { en: lesson.speakingPrompt.starterSentence, translation: "Boshlang'ich gap" },
    ...lesson.speakingPrompt.targetTasks.slice(0, 2).map((task) => ({
      en: task,
      translation: "Amaliy vazifa",
    })),
  ]);
  const recognitionRef = useRef<any>(null);
  const speakingScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    speakingScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [spokenMessages, isGarriThinking]);

  // Clean voice playback helper
  const playVoice = useCallback((text: string, lang: VoiceLanguage, key: string) => {
    if (!text || !text.trim()) return;

    if (activeAudioKey === key) {
      stopAllSpeech();
      setActiveAudioKey(null);
      return;
    }

    playCleanSpeech(text, lang, {
      onStart: () => setActiveAudioKey(key),
      onEnd: () => setActiveAudioKey(null),
      onError: () => setActiveAudioKey(null),
    });
  }, [activeAudioKey]);

  // Initialize REAL SpeechRecognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setCurrentInputText(transcript);
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Brauzeringizda ovozli mikrofondan foydalanish qo'llab-quvvatlanmadi. Iltimos, xabaringizni matn orqali yozing.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch {
        setIsRecording(false);
      }
    }
  };

  const handleSendSpeakingMessage = async (customText?: string) => {
    const textToSend = (customText || currentInputText).trim();
    if (!textToSend || isGarriThinking) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    // Add user message
    const userMsg: SpokenMessageItem = {
      sender: "user",
      text: textToSend,
    };
    const nextHistory = [...spokenMessages, userMsg];
    setSpokenMessages(nextHistory);
    setCurrentInputText("");
    setIsGarriThinking(true);

    const newCount = spokenSentencesCount + 1;
    setSpokenSentencesCount(newCount);
    if (newCount >= 3) {
      setIsLessonFinished(true);
    }

    try {
      const res = await fetch("/api/garri-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: textToSend,
          message: textToSend,
          userLevel: "B1",
          lessonTopic: `${lesson.titleUz} (${lesson.titleEn})`,
          conversationHistory: nextHistory,
          langPreference,
        }),
      });

      if (!res.ok) {
        throw new Error("Garri AI server error");
      }

      const data = await res.json();
      const replyEnglish = data.aiReplyEnglish || data.reply || "Good job! Let's continue speaking.";
      const explanation = data.explanation || data.uzbekExplanation;
      const replyTranslation = data.replyTranslation || data.aiReplyUzbek || data.replyUz;

      const garriMsg: SpokenMessageItem = {
        sender: "garri",
        text: replyEnglish,
        correctedText: data.correctedText,
        explanation,
        uzbekExplanation: explanation,
        aiReplyEnglish: replyEnglish,
        replyTranslation,
        aiReplyUzbek: replyTranslation,
        scores: data.scores,
        hints: data.hints,
      };

      setSpokenMessages((prev) => [...prev, garriMsg]);
      if (Array.isArray(data.hints) && data.hints.length > 0) {
        setActiveHints(
          data.hints.map((h: any) => ({
            en: h.en,
            translation: h.translation || h.uz || h.ru || "Taklif",
          }))
        );
      }
      setIsGarriThinking(false);

      // Play English primary speech aloud at elementary speed (0.85 rate, 1.05 pitch)
      playVoice(replyEnglish, "en", `studio-${spokenMessages.length}-en`);
    } catch {
      // Graceful fallback
      const fallbackEnglish = `I understand you clearly! What else would you like to say about ${lesson.titleUz}?`;
      const fallbackTranslation =
        langPreference === "ru"
          ? `Я вас хорошо понял! Что еще вы хотите сказать по теме ${lesson.titleUz}?`
          : `Sizni yaxshi tushundim! ${lesson.titleUz} bo'yicha yana nimalar deya olasiz?`;

      const fallbackMsg: SpokenMessageItem = {
        sender: "garri",
        text: fallbackEnglish,
        correctedText: textToSend.charAt(0).toUpperCase() + textToSend.slice(1) + (textToSend.endsWith(".") ? "" : "."),
        explanation: "Fikringiz tushunarli ifodalandi. Nutqni davom ettiring!",
        uzbekExplanation: "Fikringiz tushunarli ifodalandi. Nutqni davom ettiring!",
        aiReplyEnglish: fallbackEnglish,
        replyTranslation: fallbackTranslation,
        aiReplyUzbek: fallbackTranslation,
      };
      setSpokenMessages((prev) => [...prev, fallbackMsg]);
      setIsGarriThinking(false);
      playVoice(fallbackEnglish, "en", `studio-${spokenMessages.length}-en`);
    }
  };

  // Final Gate: Mark 100% Completed
  const handleFinalizeLesson = () => {
    onLessonComplete(lesson.id);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 flex flex-col font-sans">
      {/* ============================================================= */}
      {/* TOP STUDIO TOOLBAR & PROGRESS                                 */}
      {/* ============================================================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onExit}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Darslardan chiqish</span>
          </button>

          <div className="text-center hidden sm:block">
            <span className="text-[11px] font-black uppercase text-[#CA8A04] bg-[#FEF9C3] px-3 py-0.5 rounded-full">
              {lesson.moduleTitle} • #{lesson.id}
            </span>
            <h2 className="font-serif text-base font-bold text-slate-900 mt-0.5">
              {lesson.titleUz} ({lesson.titleEn})
            </h2>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                  currentStep === stepNum
                    ? "bg-[#FACC15] text-slate-950 scale-105 shadow-xs"
                    : currentStep > stepNum
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {currentStep > stepNum ? "✓" : stepNum}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ============================================================= */}
      {/* MAIN IMMERSIVE STUDIO CANVAS                                  */}
      {/* ============================================================= */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-8">
        
        {/* =========================================================== */}
        {/* STEP 1: WORDS & DEEP PHRASES BREAKDOWN                      */}
        {/* =========================================================== */}
        {currentStep === 1 && (
          <motion.div
            key="studio-step-1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Step Header */}
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)]">
              <span className="text-xs font-black uppercase text-[#CA8A04] bg-[#FEF9C3] px-3 py-1 rounded-full mb-3 inline-block">
                1-Bosqich: So‘zlar va Chuqur Iboralar Tahlili
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {lesson.titleUz}
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed">
                {lesson.summaryUz} Har bir ibora kartasini bosing — grammatik qoidalar, o‘zbekcha o‘qilish talaffuzi va so‘zma-so‘z tahlili ochiladi.
              </p>

              {/* Target Words Pill Strip */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase mr-1">
                  Kalit so‘zlar:
                </span>
                {lesson.words.map((w, i) => (
                  <div
                    key={i}
                    onClick={() => speakText(w.en)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-yellow-100 text-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{w.en}</span>
                    <span className="text-slate-400 font-mono text-[10px]">({w.ipa})</span>
                    <Volume2 className="w-3 h-3 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Deep-Dive Phrases Accordion List */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-black text-slate-900 px-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FACC15] fill-[#FACC15]" />
                <span>Interaktiv Chuqur Iboralar Tahlili ({lesson.deepPhrases.length} ta):</span>
              </h3>

              {lesson.deepPhrases.map((phrase: DeepPhrase) => {
                const isExpanded = expandedPhraseId === phrase.id;

                return (
                  <div
                    key={phrase.id}
                    className="bg-white rounded-[28px] border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden transition-all"
                  >
                    {/* Main Bar */}
                    <div
                      onClick={() => toggleAccordion(phrase.id)}
                      className="p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(phrase.en);
                          }}
                          className="w-12 h-12 rounded-2xl bg-[#FFFBEB] hover:bg-[#FEF08A] text-slate-900 border border-yellow-200 flex items-center justify-center transition-colors flex-shrink-0"
                          title="Talaffuzni tinglash"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                        <div>
                          <h4 className="font-serif text-base sm:text-lg font-bold text-slate-900 leading-snug">
                            {phrase.en}
                          </h4>
                          <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5">
                            {phrase.uz}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-bold text-[#CA8A04] bg-[#FEF9C3] px-2.5 py-1 rounded-full hidden sm:inline-block">
                          Batafsil tahlil
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Expandable Deep-Dive Drawer */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="border-t border-slate-100 bg-[#FAFAFA] p-5 sm:p-6 space-y-4"
                        >
                          {/* 1. Literal Word-by-Word Breakdown */}
                          <div>
                            <h5 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                              1) So‘zma-so‘z ma'no tahlili:
                            </h5>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {phrase.breakdown.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs"
                                >
                                  <span className="font-bold text-slate-900 block">
                                    {item.word}
                                  </span>
                                  <span className="text-slate-500 font-medium">
                                    {item.meaning}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 2. Grammar Structure Rule */}
                          <div className="p-3.5 rounded-xl bg-[#FFFBEB] border border-yellow-200 text-xs">
                            <span className="font-black text-yellow-900 block mb-0.5">
                              2) Grammatik qolip va qoida:
                            </span>
                            <span className="text-slate-700 font-medium">
                              {phrase.grammarRule}
                            </span>
                          </div>

                          {/* 3. Phonetic Pronunciation Guide in Uzbek Script */}
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-slate-400">
                              3) O‘zbekcha talaffuzi:
                            </span>
                            <span className="font-mono font-bold text-slate-800 bg-slate-200/70 px-2 py-0.5 rounded-md">
                              "{phrase.pronunciation}"
                            </span>
                          </div>

                          {/* 4. Alternative Real-Life Phrases */}
                          <div>
                            <h5 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">
                              4) Hayotda ishlatiladigan 2 xil muqobil variant:
                            </h5>
                            <div className="space-y-1">
                              {phrase.alternatives.map((alt, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs font-semibold text-slate-700 flex items-center gap-2"
                                >
                                  <span className="text-[#CA8A04]">•</span>
                                  <span>{alt}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Advance to Step 2 Button */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-8 py-4 rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] text-slate-950 font-black text-sm shadow-md shadow-yellow-400/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>2-Bosqich: Tekshiruv Savollariga o‘tish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* =========================================================== */}
        {/* STEP 2: MINI QUIZ (STRICT 100% PASS GATE)                    */}
        {/* =========================================================== */}
        {currentStep === 2 && (
          <motion.div
            key="studio-step-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)]">
              <span className="text-xs font-black uppercase text-[#CA8A04] bg-[#FEF9C3] px-3 py-1 rounded-full mb-3 inline-block">
                2-Bosqich: Mavzu Yuzasidan Tekshiruv Savollari
              </span>
              <h2 className="font-serif text-2xl font-black text-slate-900 tracking-tight">
                Bilimlarni Sinovdan O‘tkazish (4 ta savol)
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Ushbu darsdan keyingi bosqichga o‘tish uchun barcha 4 ta savolga 100% to‘g‘ri javob berishingiz lozim.
              </p>
            </div>

            {/* 4 Interactive Quiz Questions */}
            <div className="space-y-4">
              {lesson.quiz.map((q, idx) => {
                const selected = quizAnswers[q.id];
                const isCorrect = selected === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-[28px] p-6 border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-bold text-base text-slate-900">
                        {idx + 1}. {q.question}
                      </h4>
                      {quizSubmitted && (
                        <div>
                          {isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-600" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Multiple-Choice or Yes/No Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options?.map((opt) => {
                        const isThisSelected = selected === opt;
                        let btnStyle =
                          "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200";

                        if (isThisSelected) {
                          btnStyle = "bg-[#FEF08A] text-slate-950 border-[#FACC15] ring-2 ring-[#FACC15]";
                        }

                        if (quizSubmitted) {
                          if (opt === q.correctAnswer) {
                            btnStyle = "bg-emerald-500 text-white border-emerald-600";
                          } else if (isThisSelected) {
                            btnStyle = "bg-rose-500 text-white border-rose-600";
                          } else {
                            btnStyle = "bg-slate-100 text-slate-400 opacity-50";
                          }
                        }

                        return (
                          <button
                            key={opt}
                            type="button"
                            disabled={quizSubmitted}
                            onClick={() => handleSelectAnswer(q.id, opt)}
                            className={`p-3.5 rounded-2xl font-bold text-xs sm:text-sm text-left border transition-all cursor-pointer ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation after submission */}
                    {quizSubmitted && (
                      <p className="text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <strong>Tushuntirish:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                ← So‘zlarni qayta ko‘rish
              </button>

              {!quizSubmitted ? (
                <button
                  type="button"
                  onClick={handleGradeQuiz}
                  disabled={Object.keys(quizAnswers).length < lesson.quiz.length}
                  className="px-8 py-4 rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] disabled:opacity-50 text-slate-950 font-black text-sm shadow-md transition-all cursor-pointer"
                >
                  Javoblarni Tekshirish ({Object.keys(quizAnswers).length}/{lesson.quiz.length})
                </button>
              ) : quizScore === lesson.quiz.length ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl">
                    100% To‘g‘ri! (4/4) 🎉
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>3-Bosqich: Audio Quizga o‘tish</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-rose-600 bg-rose-50 px-4 py-2 rounded-xl">
                    Natija: {quizScore}/4. Keyingi bosqich uchun 100% kerak.
                  </span>
                  <button
                    type="button"
                    onClick={handleRetryQuiz}
                    className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
                  >
                    Qayta urinish
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* =========================================================== */}
        {/* STEP 3: AUDIO LISTENING QUIZ                                */}
        {/* =========================================================== */}
        {currentStep === 3 && (
          <motion.div
            key="studio-step-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6 max-w-2xl mx-auto text-center"
          >
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)]">
              <span className="text-xs font-black uppercase text-[#CA8A04] bg-[#FEF9C3] px-3 py-1 rounded-full mb-3 inline-block">
                3-Bosqich: Tinglab Tushunish (Audio Quiz)
              </span>
              <h2 className="font-serif text-2xl font-black text-slate-900 tracking-tight">
                Audioni Tinglang va Tarjimasini Toping
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Ovozli tugmani bosing va eshitilgan jumlaga to‘g‘ri keluvchi o‘zbekcha tarjimani tanlang.
              </p>
            </div>

            {/* Audio Station Card */}
            <div className="bg-white rounded-[32px] p-8 border border-stone-200/80 shadow-[0_4px_30px_rgba(0,0,0,0.04)] flex flex-col items-center">
              <button
                type="button"
                onClick={playListeningAudio}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all cursor-pointer relative shadow-xl ${
                  isPlayingAudio
                    ? "bg-[#FACC15] text-slate-950 scale-105 shadow-yellow-400/40"
                    : "bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/30"
                }`}
                title="Audioni tinglash"
              >
                <Volume2 className="w-10 h-10" />
                {isPlayingAudio && (
                  <span className="absolute inset-0 rounded-full border-4 border-yellow-400 animate-ping pointer-events-none" />
                )}
              </button>
              <p className="text-xs font-bold text-slate-400 mt-3 mb-6">
                Qayta eshitish uchun bosing
              </p>

              {/* Stack of 4 Options */}
              <div className="space-y-3 w-full text-left">
                {lesson.listeningQuiz.options.map((opt) => {
                  const isSelected = audioSelectedAnswer === opt;
                  const isCorrect = opt === lesson.listeningQuiz.correctAnswer;

                  let style =
                    "bg-sky-50/80 hover:bg-sky-100 text-sky-950 border-sky-200";

                  if (audioAnswerState !== "idle") {
                    if (isCorrect) {
                      style = "bg-emerald-500 text-white border-emerald-600";
                    } else if (isSelected) {
                      style = "bg-rose-500 text-white border-rose-600";
                    } else {
                      style = "bg-slate-100 text-slate-400 border-slate-200 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={audioAnswerState !== "idle"}
                      onClick={() => handleSelectAudioOption(opt)}
                      className={`w-full p-4 rounded-2xl font-bold text-sm border transition-all flex items-center justify-between cursor-pointer ${style}`}
                    >
                      <span>{opt}</span>
                      {audioAnswerState !== "idle" && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Reveal and Advance */}
              {audioAnswerState === "correct" ? (
                <div className="mt-6 w-full flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-xs font-black text-emerald-800">
                    A'lo darajada! Eshitilgan jumla: "{lesson.listeningQuiz.spokenText}"
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>4-Bosqichga o‘tish</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : audioAnswerState === "wrong" ? (
                <div className="mt-6 w-full flex items-center justify-between p-4 bg-rose-50 rounded-2xl border border-rose-200">
                  <span className="text-xs font-bold text-rose-800">
                    Noto‘g‘ri javob tanlandi. Qaytadan tinglang.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAudioAnswerState("idle");
                      setAudioSelectedAnswer(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
                  >
                    Qayta urinish
                  </button>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}

        {/* =========================================================== */}
        {/* STEP 4: FINAL BOSS — REAL SPEECH AI CONVERSATION CHECK     */}
        {/* =========================================================== */}
        {currentStep === 4 && (
          <motion.div
            key="studio-step-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-xs font-black uppercase text-[#CA8A04] bg-[#FEF9C3] px-3 py-1 rounded-full inline-block">
                    4-Bosqich: Modul Yakuniy Boss — Garri AI Nutq Sinovi
                  </span>

                  {/* 3-Language UI & Audio Switch Pill */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => changeLanguagePreference("en")}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        langPreference === "en"
                          ? "bg-[#FACC15] text-slate-950 font-black shadow-xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      🇬🇧 EN
                    </button>
                    <button
                      type="button"
                      onClick={() => changeLanguagePreference("uz")}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        langPreference === "uz"
                          ? "bg-[#FACC15] text-slate-950 font-black shadow-xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      🇺🇿 UZ
                    </button>
                    <button
                      type="button"
                      onClick={() => changeLanguagePreference("ru")}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        langPreference === "ru"
                          ? "bg-[#FACC15] text-slate-950 font-black shadow-xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      🇷🇺 RU
                    </button>
                  </div>
                </div>

                <h2 className="font-serif text-2xl font-black text-slate-900 tracking-tight">
                  Jonli Ovozli Suhbat Sinovi ({spokenSentencesCount}/3 gap)
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  {lesson.speakingPrompt.scenarioUz} O‘rganilgan so‘zlardan foydalanib, mikrofonga kamida 3 ta gap so‘zlang.
                </p>
              </div>

              {/* Completion Badge */}
              <div className="flex-shrink-0 text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-lg border-4 transition-all ${
                  isLessonFinished
                    ? "bg-emerald-500 text-white border-emerald-400"
                    : "bg-[#FFFBEB] text-slate-900 border-[#FACC15]"
                }`}>
                  {isLessonFinished ? "100%" : `${spokenSentencesCount}/3`}
                </div>
                <span className="text-[11px] font-bold text-slate-400 mt-1 block">
                  {isLessonFinished ? "Bajarildi" : "Nutq holati"}
                </span>
              </div>
            </div>

            {/* AI Chat Conversation Area */}
            <div className="bg-white rounded-[32px] border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] h-[440px] flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {spokenMessages.map((msg, idx) => {
                  const isGarri = msg.sender === "garri";
                  const isEnPlaying = activeAudioKey === `studio-${idx}-en`;
                  const isTransPlaying = activeAudioKey === `studio-${idx}-trans`;

                  const hasMistake =
                    isGarri &&
                    msg.correctedText &&
                    msg.correctedText.trim().toLowerCase() !== (msg.text || "").trim().toLowerCase();

                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 ${
                        isGarri ? "justify-start" : "justify-end"
                      }`}
                    >
                      {isGarri && (
                        <div className="w-8 h-8 rounded-full bg-[#FEF9C3] text-yellow-900 flex items-center justify-center font-black text-xs flex-shrink-0 mt-1">
                          🤖
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] sm:max-w-[78%] p-4 rounded-2xl text-sm leading-relaxed space-y-2.5 ${
                          isGarri
                            ? "bg-[#F8FAFC] text-slate-900 border border-slate-100"
                            : "bg-[#FACC15] text-slate-950 font-semibold"
                        }`}
                      >
                        {/* Real Correction Card from Gemini API */}
                        {isGarri && hasMistake && (
                          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1">
                            <div className="flex items-center justify-between font-black text-amber-900">
                              <span className="flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                {langPreference === "ru"
                                  ? "Исправленный вариант:"
                                  : langPreference === "en"
                                  ? "Corrected sentence:"
                                  : "To‘g‘rilangan variant:"}
                              </span>
                              {msg.scores?.grammar && (
                                <span className="text-[10px] bg-amber-100 px-2 py-0.5 rounded-md">
                                  Grammar: {msg.scores.grammar}%
                                </span>
                              )}
                            </div>
                            <p className="font-serif font-black text-slate-900">
                              "{msg.correctedText}"
                            </p>
                            {(msg.explanation || msg.uzbekExplanation) && (
                              <p className="text-[11px] text-amber-800 italic">
                                💡 {msg.explanation || msg.uzbekExplanation}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Garri's Main Reply with English Audio Button */}
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-medium">{msg.aiReplyEnglish || msg.text}</p>
                          {isGarri && (
                            <button
                              type="button"
                              onClick={() =>
                                playVoice(msg.aiReplyEnglish || msg.text, "en", `studio-${idx}-en`)
                              }
                              className={`p-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer flex-shrink-0 text-xs font-bold ${
                                isEnPlaying
                                  ? "bg-[#FACC15] text-slate-950 scale-105 shadow-xs"
                                  : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                              }`}
                              title="Inglizcha talaffuzni tinglash (0.85x elementary speed)"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span className="text-[10px]">EN</span>
                            </button>
                          )}
                        </div>

                        {/* Translation with Second Audio Button */}
                        {isGarri && (msg.replyTranslation || msg.aiReplyUzbek) && (
                          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                            <p className="text-xs text-slate-500 italic">
                              "{msg.replyTranslation || msg.aiReplyUzbek}"
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                playVoice(
                                  msg.replyTranslation || msg.aiReplyUzbek || "",
                                  langPreference === "ru" ? "ru" : "uz",
                                  `studio-${idx}-trans`
                                )
                              }
                              className={`p-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer text-xs font-bold flex-shrink-0 ${
                                isTransPlaying
                                  ? "bg-sky-400 text-white scale-105 shadow-xs"
                                  : "bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                              }`}
                              title={
                                langPreference === "ru"
                                  ? "Слушать на русском (0.9x)"
                                  : "O‘zbekcha tinglash"
                              }
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span className="text-[10px]">
                                {langPreference === "ru" ? "RU" : "UZ"}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* "Garri AI o'ylamoqda..." Loading Indicator */}
                {isGarriThinking && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FEF9C3] flex items-center justify-center text-xs">
                      🤖
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs font-semibold flex items-center gap-2 shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-[#FACC15] animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-[#FACC15] animate-bounce delay-150" />
                      <span className="w-2 h-2 rounded-full bg-[#FACC15] animate-bounce delay-300" />
                      <span>Garri AI o‘ylamoqda...</span>
                    </div>
                  </div>
                )}

                <div ref={speakingScrollRef} />
              </div>

              {/* Clickable Follow-up Hint Chips */}
              {activeHints.length > 0 && (
                <div className="px-4 py-2 bg-[#FFFDF9] border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
                  <span className="text-[10px] font-black uppercase text-[#CA8A04] whitespace-nowrap">
                    Takliflar:
                  </span>
                  {activeHints.map((hint, hIdx) => (
                    <button
                      key={hIdx}
                      type="button"
                      disabled={isGarriThinking}
                      onClick={() => handleSendSpeakingMessage(hint.en)}
                      className="px-3 py-1 rounded-full bg-slate-100 hover:bg-[#FEF08A] text-slate-800 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <span>{hint.en}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Bottom Real Voice Recognition Input Bar */}
              <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-3">
                {/* Real Microphone Button */}
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={isGarriThinking}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer flex-shrink-0 relative ${
                    isRecording
                      ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30"
                      : "bg-[#FFFBEB] hover:bg-[#FEF08A] text-slate-900 border border-yellow-200"
                  }`}
                  title={isRecording ? "To‘xtatish" : "Haqiqiy mikrofonda gapirish"}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  {isRecording && (
                    <span className="absolute inset-0 rounded-2xl border-2 border-red-400 animate-ping pointer-events-none" />
                  )}
                </button>

                {/* Live Input Field with Speech Recognition text */}
                <input
                  type="text"
                  value={currentInputText}
                  disabled={isGarriThinking}
                  onChange={(e) => setCurrentInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendSpeakingMessage();
                  }}
                  placeholder={
                    isRecording
                      ? "🎙️ Sizni eshityapman... Ingliz tilida gapiring"
                      : isGarriThinking
                      ? "Garri AI javob tayyorlamoqda..."
                      : "Inglizcha so‘zlang yoki yozing..."
                  }
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 focus:bg-white focus:ring-2 focus:ring-[#FACC15] text-xs sm:text-sm text-slate-900 outline-none transition-all disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => handleSendSpeakingMessage()}
                  disabled={!currentInputText.trim() || isGarriThinking}
                  className="w-12 h-12 rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] disabled:opacity-40 text-slate-900 flex items-center justify-center transition-all cursor-pointer flex-shrink-0 shadow-xs"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Final Completion Gate Button */}
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                ← Oldingi bosqich
              </button>

              <button
                type="button"
                onClick={handleFinalizeLesson}
                disabled={!isLessonFinished && !isAlreadyCompleted}
                className={`px-8 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${
                  isLessonFinished || isAlreadyCompleted
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 cursor-pointer"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {isLessonFinished || isAlreadyCompleted
                    ? "Darsni 100% Yakunlash va Chiqish ✓"
                    : `Garri AI bilan yana ${Math.max(0, 3 - spokenSentencesCount)} ta gap so‘zlang`}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

