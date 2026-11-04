"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  Sparkles,
  RotateCcw,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { GarriAIAnalysis, GarriAIHint, LanguagePreference } from "@/app/api/garri-ai/route";
import { playCleanSpeech, stopAllSpeech, VoiceLanguage } from "@/lib/speechEngine";

export interface ChatMessage {
  id: string;
  sender: "garri" | "user";
  text: string;
  correctedText?: string;
  explanation?: string;
  replyTranslation?: string;
  translationUz?: string; // compatibility
  analysis?: GarriAIAnalysis;
  scores?: { grammar: number; fluency: number; vocab: number };
  timestamp: string;
}

interface GarriAIChatProps {
  userName: string;
  faculty: string;
  userLevel?: string;
}

export const GarriAIChat: React.FC<GarriAIChatProps> = ({
  userName,
  faculty,
  userLevel = "B1 (O‘rta)",
}) => {
  // 1. Language Preference: Saved to localStorage ('uz' | 'ru' | 'en')
  const [langPreference, setLangPreference] = useState<LanguagePreference>("uz");

  // Load saved language preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("talkwarts_lang_preference");
      if (savedLang === "uz" || savedLang === "ru" || savedLang === "en") {
        setLangPreference(savedLang);
      }
    }
  }, []);

  const changeLanguagePreference = (lang: LanguagePreference) => {
    setLangPreference(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("talkwarts_lang_preference", lang);
    }
  };

  const initialConversation: ChatMessage[] = [
    {
      id: "m1",
      sender: "garri",
      text: "Hello! I am Garri, your personal speaking coach. Are you ready to speak today?",
      explanation: "Welcome to your interactive speaking lesson!",
      replyTranslation:
        langPreference === "ru"
          ? "Привет! Я Гарри, ваш речевой наставник. Вы готовы сегодня попрактиковаться?"
          : "Salom! Men Garri — sizning nutq murabbiyingizman. Bugun gapirishga tayyormisiz?",
      translationUz: "Salom! Men Garri — sizning nutq murabbiyingizman. Bugun gapirishga tayyormisiz?",
      timestamp: "12:00",
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialConversation);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isGarriTyping, setIsGarriTyping] = useState(false);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);

  // Dynamic live hint chips (3 suggested phrases)
  const [liveHints, setLiveHints] = useState<GarriAIHint[]>([
    {
      en: "Hello Garri, let's practice speaking!",
      translation:
        langPreference === "ru"
          ? "Привет Гарри, давай попрактикуемся!"
          : "Salom Garri, suhbatlashishni boshlaymiz!",
      uz: "Salom Garri, suhbatlashishni boshlaymiz!",
      ru: "Привет Гарри, давай попрактикуемся!",
    },
    {
      en: `How can I speak more fluently in ${faculty}?`,
      translation:
        langPreference === "ru"
          ? `Как я могу говорить более свободно в сфере ${faculty}?`
          : `${faculty} sohasida qanday qilib ravonroq gapirsam bo'ladi?`,
      uz: `${faculty} sohasida qanday qilib ravonroq gapirsam bo'ladi?`,
      ru: `Как я могу говорить более свободно в сфере ${faculty}?`,
    },
    {
      en: "Could you ask me a question?",
      translation:
        langPreference === "ru"
          ? "Не могли бы вы задать мне вопрос?"
          : "Menga birorta savol bera olasizmi?",
      uz: "Menga birorta savol bera olasizmi?",
      ru: "Не могли бы вы задать мне вопрос?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGarriTyping]);

  // Setup Web SpeechRecognition: defaults to en-US for English speech training
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
          let liveTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            liveTranscript += event.results[i][0].transcript;
          }
          setInputText(liveTranscript);
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

  // Voice playback using the Clean Speech Synthesis Engine
  const playVoice = useCallback((text: string, lang: VoiceLanguage, audioId: string) => {
    if (!text || !text.trim()) return;

    if (activeAudioId === audioId) {
      stopAllSpeech();
      setActiveAudioId(null);
      return;
    }

    setSpeechNotice(null);

    const started = playCleanSpeech(text, lang, {
      onStart: () => setActiveAudioId(audioId),
      onEnd: () => setActiveAudioId(null),
      onError: () => setActiveAudioId(null),
    });

    if (!started && lang === "uz") {
      setSpeechNotice("O‘zbekcha nutq sintezi tizimingizda mavjud emas. Matn ko‘rinishida o‘qing.");
      setTimeout(() => setSpeechNotice(null), 3500);
    }
  }, [activeAudioId]);

  // Toggle voice recording
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert(
        "Brauzeringizda ovozli nutq qabul qilish tizimi qo'llab-quvvatlanmadi. Iltimos, xabarni klaviatura orqali yozing."
      );
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

  // Send message to backend /api/garri-ai
  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || isGarriTyping) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsGarriTyping(true);

    try {
      const res = await fetch("/api/garri-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: textToSend,
          message: textToSend,
          userLevel,
          lessonTopic: faculty,
          faculty,
          conversationHistory: messages,
          langPreference,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to contact Garri AI server");
      }

      const data = await res.json();
      const replyText = data.replyEn || data.aiReplyEnglish || data.reply || "";
      const correctedSentence = data.correctedSentence || data.correctedText || "";
      const explanation = data.explanationUz || data.explanation || data.uzbekExplanation || "";
      const replyTranslation = data.replyUz || data.replyTranslation || data.aiReplyUzbek || "";
      const grammarScore = Number(data.grammarScore ?? data.scores?.grammar ?? 85);
      const fluencyScore = Number(data.fluencyScore ?? data.scores?.fluency ?? 85);

      const garriMsg: ChatMessage = {
        id: `g-${Date.now()}`,
        sender: "garri",
        text: replyText,
        correctedText: correctedSentence,
        explanation,
        replyTranslation,
        translationUz: replyTranslation,
        scores: {
          grammar: grammarScore,
          fluency: fluencyScore,
          vocab: Number(data.scores?.vocab) || Math.round((grammarScore + fluencyScore) / 2),
        },
        analysis: data.analysis || {
          hasError: Boolean(correctedSentence && correctedSentence.trim().toLowerCase() !== textToSend.trim().toLowerCase()),
          userSaid: textToSend,
          betterWay: correctedSentence || textToSend,
          explanationUz: explanation,
          grammarScore,
          vocabularyScore: Math.round((grammarScore + fluencyScore) / 2),
          fluencyScore,
        },
        timestamp: timeStr,
      };

      setMessages((prev) => [...prev, garriMsg]);
      if (Array.isArray(data.hints) && data.hints.length > 0) {
        setLiveHints(data.hints);
      }
      setIsGarriTyping(false);

      // Play English primary speech aloud at elementary speed
      playVoice(replyText, "en", `${garriMsg.id}-en`);
    } catch {
      // Graceful local fallback
      const fallbackReply = `I understand you, ${userName}! How do you practice daily?`;
      const fallbackTranslation =
        langPreference === "ru"
          ? `Я вас понял, ${userName}! Как вы практикуетесь ежедневно?`
          : `Sizni tushundim, ${userName}! Har kuni qanday mashq qilasiz?`;

      const garriMsg: ChatMessage = {
        id: `g-${Date.now()}`,
        sender: "garri",
        text: fallbackReply,
        explanation: "Grammatik tuzilishi yaxshi tuzilgan.",
        replyTranslation: fallbackTranslation,
        translationUz: fallbackTranslation,
        analysis: {
          hasError: false,
          userSaid: textToSend,
          betterWay: textToSend,
          explanationUz: "Grammatik tuzilishi yaxshi tuzilgan.",
          grammarScore: 92,
          vocabularyScore: 88,
          fluencyScore: 90,
        },
        timestamp: timeStr,
      };

      setMessages((prev) => [...prev, garriMsg]);
      setIsGarriTyping(false);
      playVoice(fallbackReply, "en", `${garriMsg.id}-en`);
    }
  };

  const handleResetChat = () => {
    stopAllSpeech();
    setMessages(initialConversation);
  };

  return (
    <div className="bg-white rounded-[32px] border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex flex-col h-[760px] overflow-hidden">
      {/* ============================================================= */}
      {/* 1. TOP HEADER & MULTI-LANGUAGE SWITCH PILL (EN / UZ / RU)    */}
      {/* ============================================================= */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] border-2 border-[#FACC15] flex items-center justify-center text-xl flex-shrink-0 shadow-xs">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-base sm:text-lg font-black text-slate-900 leading-tight">
                Garri AI (Jonli Suhbatdosh)
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-slate-400 font-medium">
              CEFR {userLevel} • {faculty} yo‘nalishi
            </p>
          </div>
        </div>

        {/* 3-Language UI & Audio Switch Pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-bold shadow-2xs">
            <button
              type="button"
              onClick={() => changeLanguagePreference("en")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                langPreference === "en"
                  ? "bg-[#FACC15] text-slate-950 font-black shadow-xs scale-102"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="English interface and explanations"
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>

            <button
              type="button"
              onClick={() => changeLanguagePreference("uz")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                langPreference === "uz"
                  ? "bg-[#FACC15] text-slate-950 font-black shadow-xs scale-102"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="O‘zbekcha izoh va tarjimalar"
            >
              <span>🇺🇿</span>
              <span>O‘zbekcha</span>
            </button>

            <button
              type="button"
              onClick={() => changeLanguagePreference("ru")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                langPreference === "ru"
                  ? "bg-[#FACC15] text-slate-950 font-black shadow-xs scale-102"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Объяснения и перевод на русском"
            >
              <span>🇷🇺</span>
              <span>Русский</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetChat}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Suhbatni yangilash"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gentle notice if speech synthesis is omitted for pure visual display */}
      {speechNotice && (
        <div className="bg-amber-50 text-amber-900 text-xs px-4 py-2 border-b border-amber-200 text-center font-medium">
          {speechNotice}
        </div>
      )}

      {/* ============================================================= */}
      {/* 2. CHAT MESSAGES SCROLL AREA WITH DUAL SPEAKER BUTTONS        */}
      {/* ============================================================= */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#FAFAF9]/60">
        {messages.map((msg) => {
          const isGarri = msg.sender === "garri";
          const isEnglishAudioPlaying = activeAudioId === `${msg.id}-en`;
          const isTransAudioPlaying = activeAudioId === `${msg.id}-trans`;

          const hasAnalysis =
            isGarri &&
            Boolean(msg.correctedText && (msg.explanation || msg.scores));

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isGarri ? "justify-start" : "justify-end"
              }`}
            >
              {isGarri && (
                <div className="w-9 h-9 rounded-2xl bg-[#FFFBEB] border border-yellow-200 flex items-center justify-center font-black text-sm flex-shrink-0 mt-0.5 shadow-2xs">
                  🤖
                </div>
              )}

              <div className={`max-w-[88%] sm:max-w-[76%] space-y-3`}>
                {/* 1. MISTAKE CORRECTION & ANALYSIS CARD */}
                {isGarri && hasAnalysis && (
                  <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                        <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
                        <span>
                          {langPreference === "ru"
                            ? "Исправление и анализ речи"
                            : langPreference === "en"
                            ? "Speech Analysis & Correction"
                            : "Nutq Tahlili va To‘g‘rilash"}
                        </span>
                      </div>

                      {msg.scores?.grammar && (
                        <div className="flex items-center gap-1.5 text-[10px] font-black">
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                            Grammar: {msg.scores.grammar}%
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                            Fluency: {msg.scores.fluency}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-start gap-2 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100">
                        <span className="font-bold text-emerald-800 whitespace-nowrap">
                          {langPreference === "ru"
                            ? "Правильный вариант:"
                            : langPreference === "en"
                            ? "Natural phrasing:"
                            : "To‘g‘ri variant:"}
                        </span>
                        <span className="font-serif font-black text-emerald-950">
                          "{msg.correctedText}"
                        </span>
                      </div>

                      {msg.explanation && (
                        <p className="text-[11px] text-slate-600 italic pl-1">
                          💡 {msg.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. PRIMARY GARRI AI DIALOGUE BUBBLE WITH DUAL SPEAKERS */}
                <div
                  className={`p-4 sm:p-5 rounded-[24px] text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isGarri
                      ? "bg-white text-slate-900 border border-stone-200/80 rounded-tl-sm"
                      : "bg-[#FACC15] text-slate-950 font-semibold rounded-tr-sm"
                  }`}
                >
                  {/* Primary English Text */}
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium text-slate-900 leading-relaxed">
                      {msg.text}
                    </p>

                    {/* Independent English Speaker Button */}
                    {isGarri && (
                      <button
                        type="button"
                        onClick={() => playVoice(msg.text, "en", `${msg.id}-en`)}
                        className={`p-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer flex-shrink-0 text-xs font-bold ${
                          isEnglishAudioPlaying
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

                  {/* Translated Explanation / Reply Subtitle with Second Speaker Button */}
                  {isGarri && msg.replyTranslation && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <p className="text-xs text-slate-500 font-medium italic">
                        "{msg.replyTranslation}"
                      </p>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {/* Speaker Button for Russian or Uzbek voice */}
                        <button
                          type="button"
                          onClick={() =>
                            playVoice(
                              msg.replyTranslation || "",
                              langPreference === "ru" ? "ru" : "uz",
                              `${msg.id}-trans`
                            )
                          }
                          className={`p-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer text-xs font-bold ${
                            isTransAudioPlaying
                              ? "bg-sky-400 text-white scale-105 shadow-xs"
                              : "bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                          }`}
                          title={
                            langPreference === "ru"
                              ? "Слушать на русском языке (0.9x)"
                              : "O‘zbekcha tinglash"
                          }
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span className="text-[10px]">
                            {langPreference === "ru" ? "RU" : "UZ"}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end px-1">
                  <span className="text-[10px] font-semibold text-slate-400">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* "Garri AI o'ylamoqda..." Loading Indicator */}
        {isGarriTyping && (
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

        <div ref={messagesEndRef} />
      </div>

      {/* ============================================================= */}
      {/* 3. INTERACTIVE 3 LIVE HINT CHIPS WITH TTS AUDIO PREVIEW       */}
      {/* ============================================================= */}
      <div className="px-4 py-3 bg-[#FFFDF9] border-t border-stone-200/80 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-black uppercase text-[#CA8A04] flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3" />
            <span>
              {langPreference === "ru"
                ? "Варианты ответа (нажмите, чтобы сказать):"
                : langPreference === "en"
                ? "Suggested replies (click to speak):"
                : "Javob variantlari (Tanlang yoki eshiting):"}
            </span>
          </span>
          <span className="text-[10px] font-bold text-slate-400">
            3 ta taklif
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {liveHints.map((hint, idx) => (
            <div
              key={idx}
              className="bg-white border border-stone-200/90 hover:border-yellow-300 rounded-2xl p-2.5 transition-all flex items-start justify-between gap-2 shadow-2xs group"
            >
              <button
                type="button"
                onClick={() => handleSendMessage(hint.en)}
                className="text-left flex-1 cursor-pointer"
              >
                <p className="font-serif font-black text-xs text-slate-900 group-hover:text-yellow-600 leading-tight">
                  {hint.en}
                </p>
                <p className="text-[10px] text-slate-400 font-medium italic mt-0.5 line-clamp-1">
                  {hint.translation || hint.uz || hint.ru}
                </p>
              </button>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => playVoice(hint.en, "en", `hint-${idx}`)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Talaffuzini oldindan tinglash"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage(hint.en)}
                  className="p-1 rounded-lg bg-yellow-50 text-yellow-800 hover:bg-[#FACC15] hover:text-slate-950 transition-colors cursor-pointer"
                  title="Yuborish"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================= */}
      {/* 4. REAL SPEECH RECOGNITION & MESSAGE INPUT BAR                */}
      {/* ============================================================= */}
      <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-3 flex-shrink-0">
        {/* Real Microphone Button */}
        <button
          type="button"
          onClick={toggleRecording}
          disabled={isGarriTyping}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer flex-shrink-0 relative ${
            isRecording
              ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30"
              : "bg-[#FFFBEB] hover:bg-[#FEF08A] text-slate-900 border border-yellow-200"
          }`}
          title={isRecording ? "Tinglashni to‘xtatish" : "Ovoz orqali inglizcha gapirish"}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}

          {/* Sound Wave Ripple Effect when Recording */}
          {isRecording && (
            <span className="absolute inset-0 rounded-2xl border-2 border-red-400 animate-ping pointer-events-none" />
          )}
        </button>

        {/* Text Input with Real Live Transcript */}
        <input
          type="text"
          value={inputText}
          disabled={isGarriTyping}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={
            isRecording
              ? "🎙️ Sizni tinglamoqdaman... (ingliz tilida so‘zlang)"
              : isGarriTyping
              ? "Garri AI javob tayyorlamoqda..."
              : "Inglizcha xabaringizni yozing yoki mikrofonga bosing..."
          }
          className="flex-1 px-4 py-3.5 rounded-2xl bg-slate-100 focus:bg-white focus:ring-2 focus:ring-[#FACC15] text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all font-medium disabled:opacity-60"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isGarriTyping}
          className="w-12 h-12 rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] disabled:opacity-40 text-slate-900 flex items-center justify-center transition-all shadow-md shadow-yellow-400/20 cursor-pointer flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
