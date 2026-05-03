// Top 25 most-spoken languages in the world. Maps each one to:
//   - its ISO 639-1 code (used for OpenAI translation prompts + URLs)
//   - its Tesseract.js trained-data code (used for OCR)
//   - a slug used in our SEO URLs ("hindi", "spanish", ...)
//   - a flag emoji for the picker (best-effort, reused symbols where appropriate)
//
// This single source of truth powers the OCR language picker, the
// translate-pdf tool, the language-pair landing pages, and the blog
// posts targeting "convert X PDF to English" queries.

export type Language = {
  code: string;          // ISO 639-1 (en, es, hi, ...)
  name: string;          // English label
  nativeName?: string;   // Self-name, optional
  tesseract: string;     // Tesseract trained-data code (eng, spa, hin, ...)
  slug: string;          // URL-safe form for /tools/translate-pdf/<slug>-to-english
  flag: string;          // Emoji
};

export const LANGUAGES: Language[] = [
  { code: "en", name: "English",    nativeName: "English",        tesseract: "eng",      slug: "english",    flag: "🇬🇧" },
  { code: "zh", name: "Chinese",    nativeName: "中文",            tesseract: "chi_sim",  slug: "chinese",    flag: "🇨🇳" },
  { code: "hi", name: "Hindi",      nativeName: "हिन्दी",          tesseract: "hin",      slug: "hindi",      flag: "🇮🇳" },
  { code: "es", name: "Spanish",    nativeName: "Español",        tesseract: "spa",      slug: "spanish",    flag: "🇪🇸" },
  { code: "fr", name: "French",     nativeName: "Français",       tesseract: "fra",      slug: "french",     flag: "🇫🇷" },
  { code: "ar", name: "Arabic",     nativeName: "العربية",        tesseract: "ara",      slug: "arabic",     flag: "🇸🇦" },
  { code: "bn", name: "Bengali",    nativeName: "বাংলা",          tesseract: "ben",      slug: "bengali",    flag: "🇧🇩" },
  { code: "pt", name: "Portuguese", nativeName: "Português",      tesseract: "por",      slug: "portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian",    nativeName: "Русский",        tesseract: "rus",      slug: "russian",    flag: "🇷🇺" },
  { code: "ur", name: "Urdu",       nativeName: "اُردُو",          tesseract: "urd",      slug: "urdu",       flag: "🇵🇰" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", tesseract: "ind",    slug: "indonesian", flag: "🇮🇩" },
  { code: "de", name: "German",     nativeName: "Deutsch",        tesseract: "deu",      slug: "german",     flag: "🇩🇪" },
  { code: "ja", name: "Japanese",   nativeName: "日本語",          tesseract: "jpn",      slug: "japanese",   flag: "🇯🇵" },
  { code: "mr", name: "Marathi",    nativeName: "मराठी",           tesseract: "mar",      slug: "marathi",    flag: "🇮🇳" },
  { code: "te", name: "Telugu",     nativeName: "తెలుగు",          tesseract: "tel",      slug: "telugu",     flag: "🇮🇳" },
  { code: "tr", name: "Turkish",    nativeName: "Türkçe",         tesseract: "tur",      slug: "turkish",    flag: "🇹🇷" },
  { code: "ta", name: "Tamil",      nativeName: "தமிழ்",          tesseract: "tam",      slug: "tamil",      flag: "🇮🇳" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt",     tesseract: "vie",      slug: "vietnamese", flag: "🇻🇳" },
  { code: "tl", name: "Tagalog",    nativeName: "Tagalog",        tesseract: "tgl",      slug: "tagalog",    flag: "🇵🇭" },
  { code: "ko", name: "Korean",     nativeName: "한국어",          tesseract: "kor",      slug: "korean",     flag: "🇰🇷" },
  { code: "it", name: "Italian",    nativeName: "Italiano",       tesseract: "ita",      slug: "italian",    flag: "🇮🇹" },
  { code: "th", name: "Thai",       nativeName: "ไทย",            tesseract: "tha",      slug: "thai",       flag: "🇹🇭" },
  { code: "gu", name: "Gujarati",   nativeName: "ગુજરાતી",         tesseract: "guj",      slug: "gujarati",   flag: "🇮🇳" },
  { code: "pl", name: "Polish",     nativeName: "Polski",         tesseract: "pol",      slug: "polish",     flag: "🇵🇱" },
  { code: "nl", name: "Dutch",      nativeName: "Nederlands",     tesseract: "nld",      slug: "dutch",      flag: "🇳🇱" },
];

export function findLanguage(query: string | null | undefined): Language | undefined {
  if (!query) return undefined;
  const q = query.toLowerCase();
  return LANGUAGES.find((l) => l.code === q || l.slug === q || l.tesseract === q);
}

export function findBySlug(slug: string): Language | undefined {
  return LANGUAGES.find((l) => l.slug === slug.toLowerCase());
}

export const ENGLISH = LANGUAGES[0];
