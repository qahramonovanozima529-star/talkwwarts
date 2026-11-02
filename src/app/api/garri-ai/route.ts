import { NextResponse } from "next/server";
import { sanitizeQuery } from "@/lib/mongodb";

export type LanguagePreference = "uz" | "ru" | "en";

export interface GarriAIAnalysis {
  hasError: boolean;
  userSaid: string;
  betterWay: string;
  explanationUz: string;
  grammarScore: number;
  vocabularyScore: number;
  fluencyScore: number;
}

export interface GarriAIHint {
  en: string;
  translation: string;
  uz?: string;
  ru?: string;
}

export interface GarriAIResponse {
  correctedText: string;
  explanation: string;
  uzbekExplanation: string; // compatibility
  aiReplyEnglish: string;
  replyTranslation: string;
  aiReplyUzbek: string;     // compatibility
  scores: {
    grammar: number;
    fluency: number;
    vocab: number;
  };
  hints: GarriAIHint[];
  langPreference: LanguagePreference;
  // Compatibility aliases
  reply?: string;
  replyUz?: string;
  analysis?: GarriAIAnalysis;
}

// Multi-language smart fallback engine
function generateSmartFallback(
  userText: string,
  _userLevel: string,
  lessonTopic: string,
  langPreference: LanguagePreference
): GarriAIResponse {
  let correctedText = userText.trim();
  let hasMistake = false;
  let grammarScore = 95;
  const fluencyScore = 92;
  const vocabScore = 90;

  let explanation = "";
  let aiReplyEnglish = "";
  let replyTranslation = "";

  // Common spelling and grammar fixes
  if (/\bquiestion\b/i.test(correctedText)) {
    correctedText = correctedText.replace(/quiestion/gi, "question");
    hasMistake = true;
    grammarScore = 80;
  }
  if (/\bi am agree\b|\bi'm agree\b/i.test(correctedText)) {
    correctedText = correctedText.replace(/i am agree|i'm agree/gi, "I agree");
    hasMistake = true;
    grammarScore = 78;
  }
  if (/\b(he|she|it) go\b/i.test(correctedText)) {
    correctedText = correctedText.replace(/\b(he|she|it) go\b/gi, "$1 goes");
    hasMistake = true;
    grammarScore = 75;
  }

  // Capitalize first letter and add punctuation
  if (correctedText.length > 0) {
    correctedText = correctedText.charAt(0).toUpperCase() + correctedText.slice(1);
    if (!/[.?!]$/.test(correctedText)) {
      correctedText += ".";
    }
  }

  // Elementary dialogue sentence in English (4-8 words) + conversational question
  const lower = userText.toLowerCase();
  if (lower.includes("don't you have") || lower.includes("question for me") || lower.includes("ask me")) {
    aiReplyEnglish = "Yes! How do you practice English daily?";
  } else if (lower.includes("hello") || lower.includes("hi")) {
    aiReplyEnglish = "Hello! Are you ready to speak today?";
  } else {
    aiReplyEnglish = "I hear you! What is your favorite hobby?";
  }

  // Explanations & translations based on langPreference
  if (langPreference === "ru") {
    explanation = hasMistake
      ? "В предложении исправлена пунктуация и грамматическая форма слова."
      : "Отличное и понятное построение фразы!";
    if (lower.includes("don't you have") || lower.includes("question for me") || lower.includes("ask me")) {
      replyTranslation = "Да! Как вы ежедневно практикуете английский?";
    } else if (lower.includes("hello") || lower.includes("hi")) {
      replyTranslation = "Привет! Вы готовы сегодня попрактиковаться?";
    } else {
      replyTranslation = "Я вас понял! Какое у вас любимое хобби?";
    }
  } else if (langPreference === "en") {
    explanation = hasMistake
      ? "Spelling, capitalization, and punctuation have been refined."
      : "Great job! Your sentence is clear and natural.";
    replyTranslation = aiReplyEnglish;
  } else {
    // Uzbek default
    explanation = hasMistake
      ? "Jumlada imlo, bosh harf yoki grammatik shakl to‘g‘rilandi."
      : "Gap tuzilishi to‘g‘ri va ravon!";
    if (lower.includes("don't you have") || lower.includes("question for me") || lower.includes("ask me")) {
      replyTranslation = "Ha, albatta! Har kuni ingliz tilini qanday mashq qilasiz?";
    } else if (lower.includes("hello") || lower.includes("hi")) {
      replyTranslation = "Salom! Bugun suhbatlashishga tayyormisiz?";
    } else {
      replyTranslation = "Sizni tushundim! Qiziqqan mashg‘ulotingiz nima?";
    }
  }

  const hints: GarriAIHint[] = [
    {
      en: "I study new words every day.",
      translation:
        langPreference === "ru"
          ? "Я учу новые слова каждый день."
          : langPreference === "en"
          ? "I study new words every day."
          : "Men har kuni yangi so'zlarni o'rganaman.",
      uz: "Men har kuni yangi so'zlarni o'rganaman.",
      ru: "Я учу новые слова каждый день.",
    },
    {
      en: "Could you repeat that more slowly?",
      translation:
        langPreference === "ru"
          ? "Не могли бы вы повторить медленнее?"
          : langPreference === "en"
          ? "Could you repeat that more slowly?"
          : "Buni sekinroq takrorlay olasizmi?",
      uz: "Buni sekinroq takrorlay olasizmi?",
      ru: "Не могли бы вы повторить медленнее?",
    },
    {
      en: `I want to improve my speaking in ${lessonTopic}.`,
      translation:
        langPreference === "ru"
          ? `Я хочу улучшить разговорную речь в ${lessonTopic}.`
          : langPreference === "en"
          ? `I want to improve my speaking in ${lessonTopic}.`
          : `Men ${lessonTopic} mavzusida nutqimni oshirmoqchiman.`,
      uz: `Men ${lessonTopic} mavzusida nutqimni oshirmoqchiman.`,
      ru: `Я хочу улучшить разговорную речь в ${lessonTopic}.`,
    },
  ];

  return {
    correctedText,
    explanation,
    uzbekExplanation: explanation,
    aiReplyEnglish,
    replyTranslation,
    aiReplyUzbek: replyTranslation,
    scores: {
      grammar: grammarScore,
      fluency: fluencyScore,
      vocab: vocabScore,
    },
    hints,
    langPreference,
    reply: aiReplyEnglish,
    replyUz: replyTranslation,
    analysis: {
      hasError: hasMistake,
      userSaid: userText,
      betterWay: correctedText,
      explanationUz: explanation,
      grammarScore,
      vocabularyScore: vocabScore,
      fluencyScore,
    },
  };
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const body = sanitizeQuery(rawBody);

    const userMessage = (body.userMessage || body.message || "").trim();
    const userLevel = (body.userLevel || "B1").trim();
    const lessonTopic = (body.lessonTopic || body.faculty || "General Speaking").trim();
    const conversationHistory = Array.isArray(body.conversationHistory)
      ? body.conversationHistory
      : [];
    const langPreference = (
      body.langPreference === "ru" ? "ru" : body.langPreference === "en" ? "en" : "uz"
    ) as LanguagePreference;

    if (!userMessage) {
      return NextResponse.json(
        { error: "Xabar matni kiritilmagan." },
        { status: 400 }
      );
    }

    // Read and sanitize Gemini API Key
    const apiKey = (
      process.env.GEMINI_API_KEY ||
      process.env.AI_API_KEY ||
      ""
    ).replace(/^["']|["']$/g, "").trim();

    if (apiKey && apiKey.length > 10) {
      // Build conversation context
      const formattedHistory = conversationHistory
        .slice(-6)
        .map((m: any) => `${m.sender === "user" ? "User" : "Garri AI"}: ${m.text || m.aiReplyEnglish || ""}`)
        .join("\n");

      const systemInstruction = `You are Garri AI, an elite bilingual speaking coach on Talkwarts.
The user is learning English at CEFR level: ${userLevel}.
Lesson topic: ${lessonTopic}.
User preferred explanation and translation language: '${langPreference.toUpperCase()}'.
Recent conversation history:
${formattedHistory || "None"}

CRITICAL RULES:
1. Fix ALL spelling, grammar, capitalization, and punctuation mistakes in the user's message (e.g. 'okay i understand don't you have quiestion for me' -> 'Okay, I understand. Don't you have a question for me?').
2. Provide the mistake explanation in 'explanation':
   - If langPreference === 'ru', write the explanation in warm, simple, encouraging Russian.
   - If langPreference === 'uz', write the explanation in warm, simple, encouraging Uzbek.
   - If langPreference === 'en', write the explanation in clear, simple English.
3. PRIMARY DIALOGUE SENTENCE ('aiReplyEnglish'):
   - Keep the main reply sentence in short, elementary 4–8 word English (very clear and friendly for beginner/elementary learners).
   - Follow it immediately with a direct conversational question tied to the active lesson topic.
4. TRANSLATION ('replyTranslation'):
   - If langPreference === 'ru', provide the exact Russian translation of 'aiReplyEnglish'.
   - If langPreference === 'uz', provide the exact Uzbek translation of 'aiReplyEnglish'.
   - If langPreference === 'en', provide the same English sentence.
5. Provide 3 short follow-up hints in 'hints' with 'en' and 'translation' in the user's selected language.
6. Provide scores (0-100) for grammar, fluency, and vocab.

Return ONLY a valid JSON object matching this schema without markdown fences:
{
  "correctedText": "string",
  "explanation": "string",
  "aiReplyEnglish": "string (4-8 elementary words + question)",
  "replyTranslation": "string",
  "scores": {
    "grammar": 90,
    "fluency": 85,
    "vocab": 88
  },
  "hints": [
    { "en": "string", "translation": "string" },
    { "en": "string", "translation": "string" },
    { "en": "string", "translation": "string" }
  ]
}`;

      // Models to try in order
      const modelsToTry = [
        "gemini-3.8-flash",
        "gemini-flash-latest",
        "gemini-2.5-flash",
        "gemini-3.1-flash-lite",
      ];

      for (const model of modelsToTry) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const res = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `${systemInstruction}\n\nUser Message: "${userMessage}"`,
                    },
                  ],
                },
              ],
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.65,
              },
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const rawResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (rawResponseText) {
              const cleanedText = rawResponseText.trim().replace(/^```json\s*|\s*```$/g, "");
              const parsed = JSON.parse(cleanedText);

              const explanation =
                parsed.explanation ||
                parsed.uzbekExplanation ||
                (langPreference === "ru" ? "Отличный ответ!" : "Ajoyib natija!");

              const replyTranslation =
                parsed.replyTranslation ||
                parsed.aiReplyUzbek ||
                "";

              const hints: GarriAIHint[] = Array.isArray(parsed.hints) && parsed.hints.length > 0
                ? parsed.hints.map((h: any) => ({
                    en: h.en || "",
                    translation: h.translation || h.uz || h.ru || "",
                    uz: h.uz || h.translation || "",
                    ru: h.ru || h.translation || "",
                  }))
                : [
                    {
                      en: "I understand clearly.",
                      translation: langPreference === "ru" ? "Я всё понял." : "Men aniq tushundim.",
                    },
                    {
                      en: "Can we practice more?",
                      translation: langPreference === "ru" ? "Можем попрактиковаться ещё?" : "Yana mashq qilamizmi?",
                    },
                    {
                      en: "Let's move forward.",
                      translation: langPreference === "ru" ? "Давайте продолжим." : "Davom etaylik.",
                    },
                  ];

              const result: GarriAIResponse = {
                correctedText: parsed.correctedText || userMessage,
                explanation,
                uzbekExplanation: explanation,
                aiReplyEnglish: parsed.aiReplyEnglish || "Great job! Let's continue speaking.",
                replyTranslation,
                aiReplyUzbek: replyTranslation,
                scores: {
                  grammar: Number(parsed.scores?.grammar) || 90,
                  fluency: Number(parsed.scores?.fluency) || 88,
                  vocab: Number(parsed.scores?.vocab) || 85,
                },
                hints,
                langPreference,
                // Compatibility aliases
                reply: parsed.aiReplyEnglish,
                replyUz: replyTranslation,
                analysis: {
                  hasError: (parsed.correctedText || userMessage).trim() !== userMessage.trim(),
                  userSaid: userMessage,
                  betterWay: parsed.correctedText || userMessage,
                  explanationUz: explanation,
                  grammarScore: Number(parsed.scores?.grammar) || 90,
                  vocabularyScore: Number(parsed.scores?.vocab) || 85,
                  fluencyScore: Number(parsed.scores?.fluency) || 88,
                },
              };

              return NextResponse.json(result);
            }
          }
        } catch (callErr) {
          console.warn(`Gemini model ${model} call error:`, callErr);
        }
      }
    }

    // Fallback if key missing or external model is unreachable
    const fallback = generateSmartFallback(userMessage, userLevel, lessonTopic, langPreference);
    return NextResponse.json(fallback);
  } catch (error: any) {
    console.error("Garri AI API Route Error:", error);
    return NextResponse.json(
      { error: "Garri AI xizmatida kutilmagan xatolik yuz berdi." },
      { status: 500 }
    );
  }
}
