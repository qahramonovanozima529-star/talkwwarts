/**
 * Talkwarts Multi-Language Speech Synthesis Engine
 * Provides clean, elementary-paced, accent-separated audio playback for EN, UZ, and RU.
 */

export type VoiceLanguage = "en" | "ru" | "uz";

export function getBestVoice(
  voices: SpeechSynthesisVoice[],
  lang: VoiceLanguage
): SpeechSynthesisVoice | null {
  if (lang === "en") {
    // Strictly filter for friendly en-US or en-GB voices (prefer Google US English, Microsoft Jenny, Samantha)
    return (
      voices.find((v) => /Google.*(US|UK).*English/i.test(v.name)) ||
      voices.find((v) => /Jenny|Samantha|Zira|Natural.*English/i.test(v.name)) ||
      voices.find((v) => v.lang === "en-US") ||
      voices.find((v) => v.lang.startsWith("en-US")) ||
      voices.find((v) => v.lang.startsWith("en-GB")) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      null
    );
  }

  if (lang === "ru") {
    // Strictly filter for ru-RU voices (e.g. Google русский, Microsoft Irina/Dariya/Pavel)
    return (
      voices.find((v) => /Google.*русский/i.test(v.name)) ||
      voices.find((v) => /Irina|Dariya|Pavel|Natural.*Russian/i.test(v.name)) ||
      voices.find((v) => v.lang === "ru-RU") ||
      voices.find((v) => v.lang.startsWith("ru")) ||
      null
    );
  }

  if (lang === "uz") {
    // If native uz-UZ voice exists, use it. Never force Russian or English accents onto Uzbek text!
    return (
      voices.find((v) => v.lang.startsWith("uz")) ||
      voices.find((v) => /uzbek|o'zbek/i.test(v.name)) ||
      null
    );
  }

  return null;
}

export function playCleanSpeech(
  text: string,
  lang: VoiceLanguage,
  options?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: () => void;
  }
): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    options?.onError?.();
    return false;
  }

  // Cancel any ongoing speech to prevent overlapping or mixing languages
  window.speechSynthesis.cancel();

  const cleanText = text.trim();
  if (!cleanText) {
    options?.onEnd?.();
    return false;
  }

  const voices = window.speechSynthesis.getVoices();
  const voice = getBestVoice(voices, lang);

  // If Uzbek and no native voice exists, DO NOT force English or Russian accents onto Uzbek text
  if (lang === "uz" && !voice) {
    options?.onEnd?.();
    return false;
  }

  const utterance = new SpeechSynthesisUtterance(cleanText);

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = lang === "en" ? "en-US" : lang === "ru" ? "ru-RU" : "en-US";
  }

  if (lang === "en") {
    utterance.rate = 0.85; // Clear, slow, elementary speed
    utterance.pitch = 1.05; // Warm, welcoming tone
  } else if (lang === "ru") {
    utterance.rate = 0.9; // Gentle elementary intonation
    utterance.pitch = 1.0;
  } else {
    utterance.rate = 0.88;
    utterance.pitch = 1.0;
  }

  utterance.onstart = () => {
    options?.onStart?.();
  };

  utterance.onend = () => {
    options?.onEnd?.();
  };

  utterance.onerror = () => {
    options?.onError?.();
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopAllSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

