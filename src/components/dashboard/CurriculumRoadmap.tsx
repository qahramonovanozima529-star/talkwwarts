"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Lock,
  PlayCircle,
  Sparkles,
  BookOpen,
  Volume2,
  ArrowRight,
  X,
  Compass,
} from "lucide-react";

export interface KeyPhrase {
  en: string;
  uz: string;
  pronunciation: string;
}

export interface TopicModule {
  id: number;
  titleUz: string;
  titleEn: string;
  stage: string;
  level: "Foundation" | "Elementary" | "Intermediate" | "Advanced" | "Expert";
  vocabCount: number;
  duration: string;
  summaryUz: string;
  keyPhrases: KeyPhrase[];
}

interface CurriculumRoadmapProps {
  faculty: string;
  completedIds: number[];
  onToggleComplete: (id: number) => void;
  onOpenPractice: (topic: TopicModule) => void;
  onOpenGame: (topic: TopicModule) => void;
}

/**
 * PROGRESSIVE CURRICULUM ENGINE
 * 
 * Strict 20-Module Pedagogical Roadmap:
 * - Modules 1-3: Strictly foundational (Greetings, Numbers/Time, Days/Calendar).
 * - Module 4: Basic feelings & first workplace context (gradual faculty injection begins!).
 * - Module 5: Family, friends, and everyday teammates.
 * - Modules 6-9: Practical conversational English (coffee chats, directions, standups, troubleshooting).
 * - Modules 10-15: Strategic professional communication (opinions, deadlines, deep-dive faculty tooling, presentations).
 * - Modules 16-20: Advanced & Executive mastery (architecture, high-stakes negotiation, governance, keynote speech).
 */
export function getCurriculumModules(faculty: string): TopicModule[] {
  const facLower = (faculty || "").toLowerCase();
  const isIT = facLower.includes("it") || facLower.includes("dastur") || facLower.includes("software");
  const isScience = facLower.includes("fan") || facLower.includes("science") || facLower.includes("texnolog");
  const isMedicine = facLower.includes("tibbi") || facLower.includes("med");
  const isBusiness = facLower.includes("biznes") || facLower.includes("moliya") || facLower.includes("finance");

  // Faculty Domain Specific Vocabulary & Phrases
  const m4FacultyPhrases: KeyPhrase[] = isIT
    ? [
        { en: "I feel motivated today. I work on my laptop to build software.", uz: "Bugun o‘zimni g‘ayratli his qilyapman. Dastur yaratish uchun noutbukimda ishlayman.", pronunciation: "Ay fiyl motiveytid tudey. Ay vork on may leptop..." },
        { en: "Our workspace is quiet, comfortable, and well-equipped.", uz: "Bizning ish joyimiz sokin, qulay va yaxshi jihozlangan.", pronunciation: "Aur vorkskeys iz kvayet, kamfortebl..." },
        { en: "I enjoy learning new programming languages.", uz: "Yangi dasturlash tillarini o‘rganish menga yoqadi.", pronunciation: "Ay enjoy lyorning nyu programing lengvijiz..." },
        { en: "Are you feeling tired after writing code all day?", uz: "Kun bo‘yi kod yozib charchadingizmi?", pronunciation: "Ar yu fiyling tayrd after rayting koud..." },
      ]
    : isScience
    ? [
        { en: "I feel curious today. I work in the research lab with scientific data.", uz: "Bugun qiziquvchanman. Ilmiy ma'lumotlar bilan tadqiqot laboratoriyasida ishlayman.", pronunciation: "Ay fiyl kyuriyes tudey. Ay vork in di riserch leb..." },
        { en: "Our laboratory is equipped with precision instruments.", uz: "Laboratoriyamiz aniq o‘lchov asboblari bilan jihozlangan.", pronunciation: "Aur laboratoriy iz ikvipt viz..." },
        { en: "I am passionate about discovering natural laws.", uz: "Tabiat qonunlarini kashf etishga ishtiyoqim baland.", pronunciation: "Ay em peshinet ebaut diskavering..." },
        { en: "Are you excited to review the experiment results?", uz: "Tajriba natijalarini ko‘rib chiqishdan xursandmisiz?", pronunciation: "Ar yu iksaytid tu rivyu di..." },
      ]
    : isMedicine
    ? [
        { en: "I feel calm and focused. I care for patients in the clinic every day.", uz: "Xotirjam va e'tiborliman. Har kuni klinikada bemorlarga g‘amxo‘rlik qilaman.", pronunciation: "Ay fiyl kam end foukast. Ay ker for peyshents..." },
        { en: "Our medical clinic is clean, modern, and compassionate.", uz: "Bizning tibbiy klinikamiz toza, zamonaviy va samimiy.", pronunciation: "Aur medikl klinik iz kliyn..." },
        { en: "Health and patient well-being are my primary goals.", uz: "Salomatlik va bemorlar farovonligi mening asosiy maqsadim.", pronunciation: "Helz end peyshent vel-biying..." },
        { en: "I am ready for my daily hospital rounds.", uz: "Kasalxonadagi kunlik ko‘rikka tayyorman.", pronunciation: "Ay em redi for may deyli raundz..." },
      ]
    : isBusiness
    ? [
        { en: "I feel energized today. I work with corporate clients in our office.", uz: "Bugun kuchga to‘laman. Ofisimizda korporativ mijozlar bilan ishlayman.", pronunciation: "Ay fiyl enerjayzd tudey. Ay vork viz korporet..." },
        { en: "Our business center promotes productivity and growth.", uz: "Biznes markazimiz unumdorlik va rivojlanishga xizmat qiladi.", pronunciation: "Aur biznes senter promouts..." },
        { en: "I enjoy analyzing revenue models and financial trends.", uz: "Daromad modellari va moliyaviy tendensiyalarni tahlil qilishni yaxshi ko‘raman.", pronunciation: "Ay enjoy enelayzing revenyu..." },
        { en: "Let's review the quarterly budget goals together.", uz: "Keling, choraklik byudjet maqsadlarini birgalikda ko‘rib chiqaylik.", pronunciation: "Lets rivyu di kvorterli badjet..." },
      ]
    : [
        { en: "I feel happy and enthusiastic about my work today.", uz: "Bugun ishimdan xursandman va katta g‘ayratdaman.", pronunciation: "Ay fiyl heppi end ensyuziyestik..." },
        { en: "Our office has a bright and friendly atmosphere.", uz: "Ofisimizda yorug‘ va do‘stona muhit hukmron.", pronunciation: "Aur ofis hez e brayt end frendli..." },
        { en: "I like solving problems and learning something new.", uz: "Muammolarni hal qilish va yangi narsalarni o‘rganishni yaxshi ko‘raman.", pronunciation: "Ay layk solving problemz..." },
        { en: "How are you feeling in your new workspace?", uz: "Yangi ish joyingizda o‘zingizni qanday his qilyapsiz?", pronunciation: "Hau ar yu fiyling in yor nyu..." },
      ];

  const m8StandupPhrases: KeyPhrase[] = isIT
    ? [
        { en: "Yesterday, I refactored the authentication service.", uz: "Kecha autentifikatsiya xizmatini qayta tartibga soldim.", pronunciation: "Yestordey, ay rifektord di osentikeytsiya..." },
        { en: "Today, I am optimizing the database indexing.", uz: "Bugun ma'lumotlar bazasi indeksatsiyasini optimallashtirmoqdaman.", pronunciation: "Tudey, ay em optimayzing di deytabeys..." },
        { en: "I don't have any blockers on my current sprint task.", uz: "Hozirgi sprint vazifamda hech qanday to‘siqlar yo‘q.", pronunciation: "Ay dount hev eni blokorz on..." },
        { en: "Could someone review my pull request later today?", uz: "Bugun kechroq kimdir mening pull requestimni tekshirib bera oladimi?", pronunciation: "Kud samvan rivyu may pul rikvest..." },
      ]
    : isScience
    ? [
        { en: "Yesterday, I finished the chemical synthesis tests.", uz: "Kecha kimyoviy sintez sinovlarini yakunladim.", pronunciation: "Yestordey, ay finishd di kemikl..." },
        { en: "Today, I am running a secondary simulation on the dataset.", uz: "Bugun ma'lumotlar to‘plami bo‘yicha ikkinchi simulyatsiyani o‘tkazyapman.", pronunciation: "Tudey, ay em raning e sekonderi..." },
        { en: "All equipment calibration benchmarks are satisfied.", uz: "Uskunalarni sozlash bo‘yicha barcha mezonlar bajarildi.", pronunciation: "Ol ikvipment kelibreyshn benchmarks..." },
        { en: "Let's verify the hypothesis results in the lab.", uz: "Keling, laboratoriyada gipoteza natijalarini tasdiqlab olamiz.", pronunciation: "Lets verifay di hayposisis..." },
      ]
    : [
        { en: "Yesterday, I completed the project milestone review.", uz: "Kecha loyiha oraliq bosqichi tahlilini yakunladim.", pronunciation: "Yestordey, ay kompliytid di projekt..." },
        { en: "Today, I am preparing the client presentation deck.", uz: "Bugun mijoz uchun taqdimot slaydlarini tayyorlayapman.", pronunciation: "Tudey, ay em pripering di klayent..." },
        { en: "Everything is on schedule with no unexpected delays.", uz: "Kutilmagan kechikishlarsiz hammasi reja bo‘yicha ketmoqda.", pronunciation: "Evrising iz on skedyul viz..." },
        { en: "I will sync with our team lead in the afternoon.", uz: "Tushdan keyin jamoa yetakchimiz bilan maslahatlashib olaman.", pronunciation: "Ay vil sink viz aur tiym..." },
      ];

  const m12DeepDivePhrases: KeyPhrase[] = isIT
    ? [
        { en: "Our cloud microservices communicate over secure gRPC protocols.", uz: "Bizning bulutli mikroservislarimiz xavfsiz gRPC protokoli orqali bog‘lanadi.", pronunciation: "Aur klaud maykroservisiz komyunikeyt..." },
        { en: "We deploy automated unit tests in our CI/CD pipeline.", uz: "CI/CD tizimimizda avtomatlashtirilgan unit testlarni ishga tushiramiz.", pronunciation: "Vi diploy otomeytd yunit tests..." },
        { en: "The API endpoint returns cached JSON payloads efficiently.", uz: "API oxirgi nuqtasi keshlashtirilgan JSON ma'lumotlarini tezkor qaytaradi.", pronunciation: "Di ey-pi-ay endpoint ritornz..." },
        { en: "Clean code practices minimize technical debt substantially.", uz: "Toza kod yozish amaliyoti texnik qarzni sezilarli darajada kamaytiradi.", pronunciation: "Kliyn koud praktisiz minimayz..." },
      ]
    : isScience
    ? [
        { en: "Our methodology utilizes double-blind empirical testing.", uz: "Bizning metodologiyamiz ikki tomonlama yopiq empirik sinovdan foydalanadi.", pronunciation: "Aur metodoloji yutilayziz dabl-blaynd..." },
        { en: "The spectrometry data revealed anomalous crystalline structures.", uz: "Spektrometriya ma'lumotlari noodatiy kristal tuzilmalarni ko‘rsatdi.", pronunciation: "Di spektrometri deyta riviyld..." },
        { en: "Peer review validates the statistical significance of our findings.", uz: "Ekspertlar tahlili kashfiyotimizning statistik ahamiyatini tasdiqlaydi.", pronunciation: "Piyr rivyu velideyts di..." },
        { en: "We must isolate confounding variables systematically.", uz: "Xalal beruvchi omillarni tizimli ravishda ajratib olishimiz shart.", pronunciation: "Vi mast aysaleyt konfaunding..." },
      ]
    : [
        { en: "Our strategic framework prioritizes high-impact operational efficiency.", uz: "Strategik rejamiz yuqori natijali operatsion samaradorlikni birinchi o‘ringa qo‘yadi.", pronunciation: "Aur stratejik freymvork prayoraytayziz..." },
        { en: "Key performance indicators indicate steady market expansion.", uz: "Asosiy samaradorlik ko‘rsatkichlari bozorning barqaror kengayishini bildiradi.", pronunciation: "Kiy performans indikeytorz..." },
        { en: "We analyze customer retention cohorts month-over-month.", uz: "Mijozlarni saqlab qolish guruhlarini oydan-oyga tahlil qilamiz.", pronunciation: "Vi enelayz kastomer ritenshn..." },
        { en: "Resource allocation is aligned with strategic objectives.", uz: "Resurslarni taqsimlash strategik maqsadlarga to‘liq moslashtirilgan.", pronunciation: "Risors elokeyshn iz elaynd..." },
      ];

  return [
    // -------------------------------------------------------------------------
    // STAGE 1: Boshlang‘ich Immersion (Modules 1 - 5) - Strictly Foundational!
    // -------------------------------------------------------------------------
    {
      id: 1,
      titleUz: "Salomlashish va Ilk So‘zlar",
      titleEn: "Greetings & First Impressions",
      stage: "1-Bosqich: Boshlang‘ich Immersion",
      level: "Foundation",
      vocabCount: 12,
      duration: "10 daq",
      summaryUz: "Ingliz tilidagi ilk xushmuomala so‘zlar: salomlashish, ismni aytish va ahvol so‘rash.",
      keyPhrases: [
        { en: "Hello! Nice to meet you.", uz: "Salom! Siz bilan tanishganimdan judayam xursandman.", pronunciation: "Helou! Nays tu miyt yu." },
        { en: "How are you doing today?", uz: "Bugun ahvolingiz qanday?", pronunciation: "Hau ar yu duing tudey?" },
        { en: "My name is Alex. What is your name?", uz: "Mening ismim Aleks. Sizning ismingiz nima?", pronunciation: "May neym iz Aleks. Vot iz yor neym?" },
        { en: "I am doing great, thank you! And you?", uz: "O‘zimni a'lo his qilyapman, rahmat! O‘zingiz-chi?", pronunciation: "Ay em duing greyt, senk yu! End yu?" },
        { en: "Good morning! Have a wonderful day ahead.", uz: "Xayrli tong! Kunningiz ajoyib va maroqli o‘tsin.", pronunciation: "Gud morning! Hev e vanderful dey ehed." },
      ],
    },
    {
      id: 2,
      titleUz: "Raqamlar, Vaqt va Kunlik Reja",
      titleEn: "Numbers, Time & Daily Routine",
      stage: "1-Bosqich: Boshlang‘ich Immersion",
      level: "Foundation",
      vocabCount: 15,
      duration: "12 daq",
      summaryUz: "1 dan 100 gacha hisoblash, soatni so‘rash va kunlik rejani oddiy so‘zlar bilan ifodalash.",
      keyPhrases: [
        { en: "Excuse me, what time is it right now?", uz: "Kechirasiz, hozir soat necha bo‘ldi?", pronunciation: "Ikskyuz miy, vot taym iz it rayt nau?" },
        { en: "It is exactly eight o'clock in the morning.", uz: "Hozir roppa-rosa ertalabki soat sakkiz bo‘ldi.", pronunciation: "It iz igzektli eyt o-klok in di morning." },
        { en: "I usually wake up at seven and have breakfast.", uz: "Odatda soat yettida uyg‘onaman va nonushta qilaman.", pronunciation: "Ay yujuali veyk ap et seven end hev brekfest." },
        { en: "Our meeting starts in fifteen minutes.", uz: "Majlisimiz o‘n besh daqiqadan so‘ng boshlanadi.", pronunciation: "Aur miyting starts in fiftiyn minits." },
        { en: "One, two, ten, twenty, one hundred.", uz: "Bir, ikki, o‘n, yigirma, bir yuz.", pronunciation: "Van, tu, ten, tventi, van handred." },
      ],
    },
    {
      id: 3,
      titleUz: "Hafta kunlari, Oylar va Fasllar",
      titleEn: "Days, Months, Seasons & Weather",
      stage: "1-Bosqich: Boshlang‘ich Immersion",
      level: "Foundation",
      vocabCount: 16,
      duration: "12 daq",
      summaryUz: "Hafta kunlari, taqvim rejalari va fasllar haqida erkin so‘zlashish.",
      keyPhrases: [
        { en: "Today is Monday, the beginning of a fresh work week.", uz: "Bugun dushanba, yangi ish haftasining boshlanishi.", pronunciation: "Tudey iz Mandey, di bigining ov e fresh vork viyk." },
        { en: "Let's schedule our meeting for Friday afternoon.", uz: "Keling, uchrashuvimizni juma kuni tushdan keyinga belgilaymiz.", pronunciation: "Lets skedyul aur miyting for Fraydey afternuwn." },
        { en: "What day of the week works best for your schedule?", uz: "Haftaning qaysi kuni sizning rejangizga eng ma'qul?", pronunciation: "Vot dey ov di viyk vorks best for yor..." },
        { en: "Spring is warm and sunny, while winter is crisp and snowy.", uz: "Bahor iliq va quyoshli, qish esa sovuq va qorli bo‘ladi.", pronunciation: "Spring iz vorm end sanni, vayl vinter iz krisp..." },
        { en: "See you tomorrow morning at nine o'clock!", uz: "Ertaga ertalab soat to‘qqizda ko‘rishguncha!", pronunciation: "Siy yu tumorrou morning et nayn o-klok!" },
      ],
    },
    {
      id: 4,
      titleUz: `His-tuyg‘ular va Ish muhiti (${faculty})`,
      titleEn: `Feelings & Workplace Context (${faculty})`,
      stage: "1-Bosqich: Boshlang‘ich Immersion",
      level: "Foundation",
      vocabCount: 16,
      duration: "14 daq",
      summaryUz: `Oddiy grammatikada his-tuyg‘ularni va tanlagan yo‘nalishingiz (${faculty}) bo‘yicha ilk ish muhiti iboralarini ishlatish.`,
      keyPhrases: m4FacultyPhrases,
    },
    {
      id: 5,
      titleUz: "Oila, Do‘stlar va Jamoadoshlar",
      titleEn: "Family, Friends & Teammates",
      stage: "1-Bosqich: Boshlang‘ich Immersion",
      level: "Foundation",
      vocabCount: 18,
      duration: "14 daq",
      summaryUz: "Yaqinlaringiz, hamkasblaringiz va jamoaviy do‘stlik haqida samimiy gaplashish.",
      keyPhrases: [
        { en: "This is my teammate Alex, we collaborate together every day.", uz: "Bu mening jamoadoshim Aleks, biz har kuni birga ishlaymiz.", pronunciation: "Dis iz may tiym-meyt Aleks, vi koleboreyt..." },
        { en: "I live with my family in a vibrant, peaceful city.", uz: "Men sokin va go‘zal shaharda oilam bilan birga yashayman.", pronunciation: "Ay liv viz may femili in e vaybrant..." },
        { en: "Our teammates are always friendly, open, and supportive.", uz: "Jamoadoshlarimiz doimo ochiqko‘ngil, do‘stona va yordamga tayyor.", pronunciation: "Aur tiym-meyts ar olveys frendli, oupen..." },
        { en: "Do you enjoy spending your free time with close friends?", uz: "Bo‘sh vaqtingizni yaqin do‘stlaringiz bilan o‘tkazishni yoqtirasizmi?", pronunciation: "Du yu enjoy spending yor friy taym..." },
        { en: "We celebrate small achievements together as a strong group.", uz: "Kichik yutuqlarni ham jamoa bilan birgalikda nishonlaymiz.", pronunciation: "Vi selibreyt smol echivments tugeder..." },
      ],
    },

    // -------------------------------------------------------------------------
    // STAGE 2: Amaliy Muloqot (Modules 6 - 10)
    // -------------------------------------------------------------------------
    {
      id: 6,
      titleUz: "Kofe, Tushlik va Norasmiy Gurung",
      titleEn: "Coffee Chats & Informal Small Talk",
      stage: "2-Bosqich: Amaliy Muloqot",
      level: "Elementary",
      vocabCount: 18,
      duration: "15 daq",
      summaryUz: "Hamkasblar bilan kofe ustida samimiy suhbat qurish, dam olish kunlarini muhokama qilish.",
      keyPhrases: [
        { en: "Would you like to grab a cup of coffee during the break?", uz: "Tanaffus paytida bir chashka kofe ichishni xohlaysizmi?", pronunciation: "Vud yu layk tu greb e kap ov kofi..." },
        { en: "How was your weekend? Did you get a chance to relax?", uz: "Dam olish kunlaringiz qanday o‘tdi? Dam olishga ulgurdingizmi?", pronunciation: "Hau vaz yor viykend? Did yu get e chens tu rilaks?" },
        { en: "I usually prefer green tea with lemon in the morning.", uz: "Ertalab odatda limonli ko‘k choyni afzal ko‘raman.", pronunciation: "Ay yujuali prefer griyn tiy viz lemon..." },
        { en: "The weather outside is genuinely pleasant today.", uz: "Bugun tashqarida havo haqiqatan ham judayam yoqimli.", pronunciation: "Di veder autsayd iz jenyuinli plezent tudey." },
        { en: "Do you know any quiet places for lunch nearby?", uz: "Yaqin atrofda tushlik qilish uchun sokin joylarni bilasizmi?", pronunciation: "Du yu nou eni kvayet pleysis for lanch..." },
      ],
    },
    {
      id: 7,
      titleUz: "Yordam so‘rash va Yo‘l-yo‘riq olish",
      titleEn: "Asking for Help & Directions",
      stage: "2-Bosqich: Amaliy Muloqot",
      level: "Elementary",
      vocabCount: 17,
      duration: "14 daq",
      summaryUz: "Ishda noaniqlik paydo bo‘lganda xushmuomalalik bilan yordam so‘rash va tushuntirish talab qilish.",
      keyPhrases: [
        { en: "Could you please help me understand this particular step?", uz: "Iltimos, ushbu bosqichni tushunishimga yordam bera olasizmi?", pronunciation: "Kud yu pliyz help miy anderstend..." },
        { en: "Excuse me, could you explain that one more time slowly?", uz: "Kechirasiz, shuni yana bir bor sekinroq tushuntirib bera olasizmi?", pronunciation: "Ikskyuz miy, kud yu ikspleyn det..." },
        { en: "I am not completely certain about this requirement.", uz: "Ushbu talab bo‘yicha to‘liq ishonchim komil emas.", pronunciation: "Ay em not kompliytli sor-ten ebaut..." },
        { en: "Thank you so much for pointing me in the right direction.", uz: "Menga to‘g‘ri yo‘nalish ko‘rsatganingiz uchun katta rahmat.", pronunciation: "Senk yu sou mach for poynting miy..." },
      ],
    },
    {
      id: 8,
      titleUz: "Kundalik Standup va Qisqa Hisobot",
      titleEn: "Daily Standup & Progress Updates",
      stage: "2-Bosqich: Amaliy Muloqot",
      level: "Intermediate",
      vocabCount: 19,
      duration: "16 daq",
      summaryUz: "Kecha nima qilganingiz, bugungi rejalaringiz va to‘siqlar yo‘qligi haqida 60 soniyada so‘zlash.",
      keyPhrases: m8StandupPhrases,
    },
    {
      id: 9,
      titleUz: "Muammoni aniqlash va Yechim taklifi",
      titleEn: "Troubleshooting & Pragmatic Solutions",
      stage: "2-Bosqich: Amaliy Muloqot",
      level: "Intermediate",
      vocabCount: 20,
      duration: "16 daq",
      summaryUz: "Nosozliklar, kutilmagan xatolar va ularni tezkor bartaraf etish yo‘llarini bayon qilish.",
      keyPhrases: [
        { en: "We encountered an unexpected bottleneck in our pipeline.", uz: "Jarayonda kutilmagan to‘siq va sekinlashuvga duch keldik.", pronunciation: "Vi inkaunterd en anikspektid batlnek..." },
        { en: "Let me inspect the system logs to identify the root cause.", uz: "Asosiy sababni aniqlash uchun tizim yozuvlarini ko‘rib chiqaman.", pronunciation: "Let miy inspekt di sistem logz..." },
        { en: "I propose we apply an immediate hotfix to stabilize the service.", uz: "Xizmatni barqarorlashtirish uchun zudlik bilan yechim kiritishni taklif qilaman.", pronunciation: "Ay propouz vi eplay en imiydiyet hotfiks..." },
        { en: "Everything is verified and restored back to normal operation.", uz: "Hammasi tekshirildi va me'yoriy holatiga qaytarildi.", pronunciation: "Evrising iz verifayd end ristord bek..." },
      ],
    },
    {
      id: 10,
      titleUz: "Fikr bildirish va Konstruktiv Munozara",
      titleEn: "Expressing Opinions & Constructive Feedback",
      stage: "2-Bosqich: Amaliy Muloqot",
      level: "Intermediate",
      vocabCount: 20,
      duration: "17 daq",
      summaryUz: "Fikringizni qat'iy lekin madaniyatli bayon qilish, boshqalarning taklifini hurmat bilan tahlil qilish.",
      keyPhrases: [
        { en: "In my honest perspective, this approach is far more sustainable.", uz: "Mening xolis fikrimcha, bu yondashuv ancha barqaror va ishonchli.", pronunciation: "In may onest perspektiv, dis eprouch..." },
        { en: "I see your valid point; however, we must factor in constraints.", uz: "Fikringizni to‘liq tushunaman, biroq mavjud cheklovlarni ham inobatga olishimiz shart.", pronunciation: "Ay siy yor velid poynt; haueve, vi mast..." },
        { en: "Let's explore a balanced compromise that serves our users best.", uz: "Foydalanuvchilarimizga eng yaxshi xizmat qiladigan muvozanatli kelishuv topaylik.", pronunciation: "Lets eksplor e belenst kompromayz..." },
        { en: "We share the exact same objective: delivering exceptional quality.", uz: "Maqsadimiz bitta: a'lo darajadagi sifatni ta'minlash.", pronunciation: "Vi sher di igzekt seym objektiv..." },
      ],
    },

    // -------------------------------------------------------------------------
    // STAGE 3: Strategik Munozara (Modules 11 - 15)
    // -------------------------------------------------------------------------
    {
      id: 11,
      titleUz: "Rejalashtirish va Muddatlarni belgilash",
      titleEn: "Task Estimation & Milestone Deadlines",
      stage: "3-Bosqich: Strategik Munozara",
      level: "Intermediate",
      vocabCount: 20,
      duration: "17 daq",
      summaryUz: "Loyihaning muddatlarini hisoblash, vazifalarni ustuvorlik bo‘yicha taqsimlash.",
      keyPhrases: [
        { en: "How much realistic time will this module require for completion?", uz: "Ushbu modulni yakunlash uchun qancha real vaqt talab etiladi?", pronunciation: "Hau mach riyelistik taym vil dis..." },
        { en: "I estimate this will take approximately three business days.", uz: "Taxminimcha, bu taxminan uch ish kunini tashkil qiladi.", pronunciation: "Ay estimeyt dis vil teyk eproksimetli..." },
        { en: "We must commit strictly to our scheduled milestone release.", uz: "Biz belgilangan oraliq chiqarilish muddatiga qat'iy amal qilishimiz shart.", pronunciation: "Vi mast komit striktli tu aur..." },
        { en: "Let's break down this complex epic into smaller, manageable tasks.", uz: "Ushbu katta vazifani kichikroq, boshqarish oson qismlarga ajrataylik.", pronunciation: "Lets breyk daun dis kompleks epik..." },
      ],
    },
    {
      id: 12,
      titleUz: `Soha Metodologiyasi va Asboblar (${faculty})`,
      titleEn: `Domain Methodology & Specialized Tooling (${faculty})`,
      stage: "3-Bosqich: Strategik Munozara",
      level: "Advanced",
      vocabCount: 22,
      duration: "18 daq",
      summaryUz: `Tanlagan sohangiz (${faculty}) bo‘yicha professional terminlar, asboblar va ilg‘or amaliyotlar.`,
      keyPhrases: m12DeepDivePhrases,
    },
    {
      id: 13,
      titleUz: "Ma'lumotlar Tahlili va Qarorlar",
      titleEn: "Data Interpretation & Analytical Decisions",
      stage: "3-Bosqich: Strategik Munozara",
      level: "Advanced",
      vocabCount: 22,
      duration: "18 daq",
      summaryUz: "Raqamlar, grafiklar va metrikalarni sof ingliz tilida tahlil qilib strategik qarorlar qabul qilish.",
      keyPhrases: [
        { en: "The quantitative metrics demonstrate a thirty percent improvement.", uz: "Raqamli ko‘rsatkichlar o‘ttiz foizlik sezilarli o‘sishni ko‘rsatmoqda.", pronunciation: "Di kvontitativ metriks demonstrat..." },
        { en: "Based on qualitative user research, we should iterate rapidly.", uz: "Foydalanuvchilarning sifatli tadqiqotiga asoslanib, tezkor qayta ishlab chiqishimiz kerak.", pronunciation: "Beyst on kvaliteytiv yuzer riserch..." },
        { en: "Our retention trajectory indicates solid product-market fit.", uz: "Mijozlarni saqlab qolish sur'ati mahsulotning bozorga mosligini tasdiqlaydi.", pronunciation: "Aur ritenshn trajektori indikeyts..." },
        { en: "Let's review the analytics dashboard to isolate anomalies.", uz: "G‘ayritabiiy og‘ishlarni aniqlash uchun analitika panelini ko‘rib chiqaylik.", pronunciation: "Lets rivyu di enelitiks deshbord..." },
      ],
    },
    {
      id: 14,
      titleUz: "Taqdimot san'ati va Yangi Mahsulot Pitch",
      titleEn: "Delivering Compelling Presentations & Pitches",
      stage: "3-Bosqich: Strategik Munozara",
      level: "Advanced",
      vocabCount: 23,
      duration: "19 daq",
      summaryUz: "Auditoriya oldida ishonchli taqdimot qilish, slaydlar bilan ishlash va tinglovchilarni rom etish.",
      keyPhrases: [
        { en: "Welcome everyone. Today I am thrilled to showcase our vision.", uz: "Hammangizga xush kelibsiz. Bugun jamoamiz g‘oyasini namoyish qilishdan mamnunman.", pronunciation: "Velkam evrivan. Tudey ay em srild..." },
        { en: "As highlighted on this slide, active engagement doubled.", uz: "Ushbu slaydda ko‘rinib turganidek, faol foydalanuvchilar ikki barobarga oshdi.", pronunciation: "Ez haylaytid on dis slayd..." },
        { en: "Our unique value proposition sets us distinctly apart from competitors.", uz: "Bizning noyob qiymat taklifimiz bizni raqobatchilardan yaqqol ajratib turadi.", pronunciation: "Aur yunik velyu propozishn..." },
        { en: "The core takeaway is that our efficiency is at an all-time peak.", uz: "Asosiy xulosa shuki, bizning samaradorligimiz har qachongidan yuqori.", pronunciation: "Di kor teykevey iz det aur..." },
      ],
    },
    {
      id: 15,
      titleUz: "Mijozlar va Hamkorlar bilan Muloqot",
      titleEn: "Client Relations & Stakeholder Alignment",
      stage: "3-Bosqich: Strategik Munozara",
      level: "Advanced",
      vocabCount: 22,
      duration: "18 daq",
      summaryUz: "Xalqaro mijozlar bilan rasmiy aloqa, talablarni boshqarish va sifat kafolatini berish.",
      keyPhrases: [
        { en: "We deeply appreciate your partnership and value your feedback.", uz: "Hamkorligingizni yuksak qadrlaymiz va bildirgan fikrlaringizga ehtirom bildiramiz.", pronunciation: "Vi diypli eprisheyte yor partnershyp..." },
        { en: "Let me clarify our strategic roadmap for the upcoming quarter.", uz: "Kelgusi chorak uchun strategik yo‘l xaritamizni aniqlashtirib berishimga ijozat bering.", pronunciation: "Let miy klerifay aur stratejik roudmep..." },
        { en: "We are fully aligned on the highest standards of excellence.", uz: "Biz eng yuqori sifat mezonlari bo‘yicha to‘liq yakdilmiz.", pronunciation: "Vi ar fuli elaynd on di hayest..." },
        { en: "Thank you for trusting our expertise to execute this initiative.", uz: "Ushbu tashabbusni amalga oshirishda bizning tajribamizga ishonganingiz uchun tashakkur.", pronunciation: "Senk yu for trasting aur ekspirtiyz..." },
      ],
    },

    // -------------------------------------------------------------------------
    // STAGE 4: Ekspert & Yetakchilik (Modules 16 - 20)
    // -------------------------------------------------------------------------
    {
      id: 16,
      titleUz: "Murakkab Tizimli Tahlil va Yechimlar",
      titleEn: "Complex System Architecture & Root Cause Analysis",
      stage: "4-Bosqich: Ekspert & Yetakchilik",
      level: "Expert",
      vocabCount: 24,
      duration: "20 daq",
      summaryUz: "Katta tizimlardagi qiyin muammolarni xalqaro muhandislik darajasida tahlil qilish va yechish.",
      keyPhrases: [
        { en: "Our investigation uncovered an insidious bottleneck under peak load.", uz: "Tekshiruvimiz eng yuqori yuklama paytida xatarli to‘siqni aniqladi.", pronunciation: "Aur investigeyshn ankavard en..." },
        { en: "We must decouple interconnected services to avoid cascading failures.", uz: "Zanjirli uzilishlarning oldini olish uchun xizmatlarni bir-biridan to‘liq ajratishimiz zarur.", pronunciation: "Vi mast di-kapl interkonektid..." },
        { en: "This architectural refactoring guarantees seamless international scale.", uz: "Ushbu arxitekturaviy qayta qurish xalqaro miqyosdagi kengayishni kafolatlaydi.", pronunciation: "Dis arkitekchural rifektoring..." },
        { en: "Telemetry data confirms zero downtime during migration.", uz: "Telemetriya ma'lumotlari ko‘chirish paytida uzilish umuman bo‘lmaganini tasdiqlaydi.", pronunciation: "Telemetri deyta konfirmz ziro..." },
      ],
    },
    {
      id: 17,
      titleUz: "Kelishuv va Muzokaralar San'ati",
      titleEn: "Strategic Negotiations & Win-Win Agreements",
      stage: "4-Bosqich: Ekspert & Yetakchilik",
      level: "Expert",
      vocabCount: 24,
      duration: "21 daq",
      summaryUz: "Yuqori darajadagi shartnomalar va kelishuvlarda o‘zaro manfaatli natijaga erishish mahorati.",
      keyPhrases: [
        { en: "We are confident that these contractual terms mutually benefit both parties.", uz: "Ushbu shartnoma bandlari har ikki tomon uchun o‘zaro manfaatli ekanligiga to‘liq ishonamiz.", pronunciation: "Vi ar konfident det diy contractual..." },
        { en: "Let's review the intellectual property and indemnification clause.", uz: "Intellektual mulk himoyasi va kafolatlar bandini qayta ko‘rib chiqaylik.", pronunciation: "Lets rivyu di intelekchual..." },
        { en: "We are prepared to execute the agreement once this condition is met.", uz: "Ushbu shart qondirilishi bilanoq bitimni imzolashga tayyormiz.", pronunciation: "Vi ar pripeard tu igzekyut di..." },
        { en: "This partnership represents a monumental milestone for both entities.", uz: "Bu hamkorlik har ikki tashkilot uchun tarixiy burilish nuqtasidir.", pronunciation: "Dis partnershyp reprizents e..." },
      ],
    },
    {
      id: 18,
      titleUz: "Strategik Rejalashtirish va Boshqaruv",
      titleEn: "Strategic Vision & Executive Governance",
      stage: "4-Bosqich: Ekspert & Yetakchilik",
      level: "Expert",
      vocabCount: 22,
      duration: "20 daq",
      summaryUz: "Direktorlar kengashi va boshqaruv oldida 5 yillik strategik rivojlanish hisobotini himoya qilish.",
      keyPhrases: [
        { en: "I am honored to present our comprehensive five-year strategic roadmap.", uz: "Besh yillik har tomonlama strategik yo‘l xaritamizni taqdim etishdan faxrlanaman.", pronunciation: "Ay em onord tu prizent aur..." },
        { en: "Our capital allocation strategy significantly maximized stakeholder value.", uz: "Kapitalni taqsimlash strategiyamiz aksiyadorlar manfaatini sezilarli darajada oshirdi.", pronunciation: "Aur kepitl elokeyshn strateji..." },
        { en: "We mitigated macroeconomic volatility through intentional diversification.", uz: "Maqsadli diversifikatsiya orqali global xatarlarni kamaytirdik.", pronunciation: "Vi mitigeidid mekruekonomik..." },
        { en: "I welcome the board's counsel as we scale globally.", uz: "Global kengayar ekanmiz, kengashning qimmatli maslahatlarini mamnuniyat bilan tinglayman.", pronunciation: "Ay velkam di bordz kaunsel..." },
      ],
    },
    {
      id: 19,
      titleUz: "Q&A va Kutilmagan Savollarga Javob",
      titleEn: "Mastering Q&A & Challenging Questions",
      stage: "4-Bosqich: Ekspert & Yetakchilik",
      level: "Expert",
      vocabCount: 22,
      duration: "19 daq",
      summaryUz: "Jurnalistlar, investorlar va qat'iy auditoriyaning qiyin savollariga bosiqlik bilan mukammal javob qaytarish.",
      keyPhrases: [
        { en: "That is a poignant question; allow me to provide essential context.", uz: "Bu juda o‘rinli savol; muhim ma'lumotlarni oydinlashtirishimga ruxsat bering.", pronunciation: "Det iz e poynyent kveshn; elau miy..." },
        { en: "While that was a valid concern previously, our latest data disproves it.", uz: "Ilgari bu xavotir o‘rinli bo‘lgan bo‘lsa-da, so‘nggi ma'lumotlarimiz buni inkor etadi.", pronunciation: "Vayl det vaz e velid konsorn..." },
        { en: "Our foundational commitment to our global community remains unwavering.", uz: "Xalqaro hamjamiyatimiz oldidagi fundamental mas'uliyatimiz o‘zgarmasdir.", pronunciation: "Aur faundeshinal komitment tu..." },
        { en: "I appreciate your critical perspective; let's discuss specifics offline.", uz: "Tanqidiy qarashingizni qadrlayman; keling, tafsilotlarni alohida muhokama qilamiz.", pronunciation: "Ay eprisheyte yor kritikl..." },
      ],
    },
    {
      id: 20,
      titleUz: "Global Minbar va Yetakchilik Nutqi",
      titleEn: "Global Keynote & Thought Leadership",
      stage: "4-Bosqich: Ekspert & Yetakchilik",
      level: "Expert",
      vocabCount: 25,
      duration: "25 daq",
      summaryUz: "Talkwarts cho‘qqisi: Dunyo miqyosidagi minbarlarda sof ingliz tilida ilhomlantiruvchi nutq so‘zlash.",
      keyPhrases: [
        { en: "True mastery of language is the supreme catalyst for human progress.", uz: "Tilni chinakam egallash — insoniyat taraqqiyotining eng buyuk omilidir.", pronunciation: "Tru masteri ov lengvij iz di syupriym ketelist..." },
        { en: "When we speak with empathy, clarity, and conviction, borders dissolve.", uz: "Hamdardlik, aniqlik va qat'iyat bilan so‘zlaganimizda, barcha chegaralar g‘oyib bo‘ladi.", pronunciation: "Ven vi spiyk viz empasi, kleriti, end konvikshn..." },
        { en: "Let our collective voices shape an enlightened and connected future.", uz: "Keling, birgalikdagi ovozimiz bilan yorug‘ va hamjihat kelajakni barpo etaylik.", pronunciation: "Let aur kolektiv voysis sheyp en inlaytend..." },
        { en: "Thank you for joining this transformative mastery journey at Talkwarts.", uz: "Talkwarts bilan birga ushbu buyuk yuksalish sayohatiga qo‘shilganingiz uchun cheksiz minnatdormiz.", pronunciation: "Senk yu for joyning dis tranzformativ..." },
      ],
    },
  ];
}

export const CurriculumRoadmap: React.FC<CurriculumRoadmapProps> = ({
  faculty,
  completedIds,
  onToggleComplete,
  onOpenPractice,
  onOpenGame,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<TopicModule | null>(null);
  const [activeVoicePlaying, setActiveVoicePlaying] = useState<string | null>(null);

  // Generate curriculum dynamically adapted to user's faculty
  const modules = getCurriculumModules(faculty);

  // 4 Main Pedagogical Stages
  const stages = [
    { name: "1-Bosqich: Boshlang‘ich Immersion", range: [1, 5] },
    { name: "2-Bosqich: Amaliy Muloqot", range: [6, 10] },
    { name: "3-Bosqich: Strategik Munozara", range: [11, 15] },
    { name: "4-Bosqich: Ekspert & Yetakchilik", range: [16, 20] },
  ];

  const completedCount = completedIds.length;
  const overallProgress = Math.round((completedCount / 20) * 100);

  // Web Speech API for TTS Audio pronunciation
  const speakText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      setActiveVoicePlaying(text);
      utterance.onend = () => setActiveVoicePlaying(null);
      utterance.onerror = () => setActiveVoicePlaying(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Curriculum Progress Card */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF9C3] text-yellow-800 text-xs font-bold mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>20 Bosqichli LingoHut O‘quv Xaritasi</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">
            Yo‘nalishingiz: <span className="text-[#CA8A04]">{faculty}</span>
          </h3>
          <p className="text-sm text-slate-500 font-medium mt-1">
            1–5 bosqichlar to‘liq poydevor (kundalik so‘zlar), 4-bosqichdan boshlab esa sohangiz asta-sekin aralashtiriladi.
          </p>
        </div>

        {/* Progress Bar & Counter */}
        <div className="flex items-center gap-5 flex-shrink-0">
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {completedCount} <span className="text-sm text-slate-400 font-medium">/ 20</span>
            </span>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Bajarildi ({overallProgress}%)
            </p>
          </div>
          <div className="w-16 h-16 rounded-full bg-[#FFFBEB] border-4 border-[#FACC15] flex items-center justify-center font-black text-slate-900 text-lg shadow-inner">
            {overallProgress}%
          </div>
        </div>
      </div>

      {/* 4 Stages Roadmap */}
      {stages.map((stage) => {
        const stageModules = modules.filter(
          (m) => m.id >= stage.range[0] && m.id <= stage.range[1]
        );
        const stageCompleted = stageModules.filter((m) =>
          completedIds.includes(m.id)
        ).length;

        return (
          <div key={stage.name} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h4 className="font-serif font-bold text-lg text-slate-900 tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FACC15]" />
                {stage.name}
              </h4>
              <span className="text-xs font-bold text-slate-400">
                {stageCompleted} / {stageModules.length} Yakunlandi
              </span>
            </div>

            {/* Grid of Topic Cards (LingoHut style, clean modern) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {stageModules.map((module) => {
                const isCompleted = completedIds.includes(module.id);
                // Module is active if previous is completed or it is module 1
                const isUnlocked =
                  module.id === 1 ||
                  completedIds.includes(module.id - 1) ||
                  isCompleted;

                return (
                  <motion.div
                    key={module.id}
                    whileHover={isUnlocked ? { y: -4 } : {}}
                    onClick={() => {
                      if (isUnlocked) setSelectedTopic(module);
                    }}
                    className={`rounded-[28px] p-5 transition-all relative flex flex-col justify-between min-h-[210px] ${
                      isUnlocked
                        ? "bg-white border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(250,204,21,0.18)] hover:border-yellow-300 cursor-pointer"
                        : "bg-slate-100/70 border border-slate-200/50 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    {/* Top Row: Module Number & State Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-full ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-800"
                            : isUnlocked
                            ? "bg-[#FEF9C3] text-yellow-900"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        #{module.id}
                      </span>

                      {isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : isUnlocked ? (
                        <div className="w-6 h-6 rounded-full bg-[#FFFBEB] text-[#CA8A04] flex items-center justify-center">
                          <PlayCircle className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    {/* Module Title & En Subtitle */}
                    <div className="space-y-1 mb-4 flex-1">
                      <h5 className="font-serif font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
                        {module.titleUz}
                      </h5>
                      <p className="text-[11px] font-medium text-slate-400 italic line-clamp-1">
                        {module.titleEn}
                      </p>
                    </div>

                    {/* Bottom Metadata: Vocab count & Duration */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <span className="bg-slate-50 px-2 py-0.5 rounded-md">
                        {module.duration}
                      </span>
                      <span className="text-slate-600">
                        {module.vocabCount} ibora
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ============================================================= */}
      {/* INTERACTIVE DETAIL MODAL / TARGET PHRASES SHEET               */}
      {/* ============================================================= */}
      <AnimatePresence>
        {selectedTopic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative overflow-hidden"
            >
              {/* Modal Top Header */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#CA8A04] bg-[#FEF9C3] px-3 py-1 rounded-full inline-block mb-2">
                    {selectedTopic.stage} • #{selectedTopic.id}
                  </span>
                  <h3 className="font-serif text-2xl font-black text-slate-900 tracking-tight">
                    {selectedTopic.titleUz}
                  </h3>
                  <p className="text-sm font-semibold text-slate-500 italic mt-0.5">
                    {selectedTopic.titleEn}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTopic(null)}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Topic Summary */}
              <p className="text-sm text-slate-600 font-medium leading-relaxed mb-5 bg-[#F8FAFC] p-4 rounded-2xl border border-slate-100">
                {selectedTopic.summaryUz}
              </p>

              {/* Target Phrases with Interactive TTS Audio & Phonetics */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
                  Darsning Asosiy Iboralari (Audio bilan tinglang):
                </h4>
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {selectedTopic.keyPhrases.map((phrase, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-yellow-300 hover:bg-[#FEF9C3]/20 transition-all flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900">
                            {phrase.en}
                          </p>
                        </div>
                        <p className="text-xs font-medium text-slate-600">
                          {phrase.uz}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400">
                          Talaffuz: {phrase.pronunciation}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => speakText(phrase.en)}
                        className={`p-2.5 rounded-xl transition-all cursor-pointer flex-shrink-0 ${
                          activeVoicePlaying === phrase.en
                            ? "bg-[#FACC15] text-slate-900 scale-105 shadow-sm"
                            : "bg-slate-100 hover:bg-yellow-100 text-slate-600 hover:text-slate-900"
                        }`}
                        title="Ovozli tinglash"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Practice, Game, Toggle Complete */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onToggleComplete(selectedTopic.id);
                  }}
                  className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    completedIds.includes(selectedTopic.id)
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completedIds.includes(selectedTopic.id)
                      ? "Bajarildi (Bekor qilish)"
                      : "Bajarildi deb belgilash"}
                  </span>
                </button>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenGame(selectedTopic);
                      setSelectedTopic(null);
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Lug‘atda mashq</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenPractice(selectedTopic);
                      setSelectedTopic(null);
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] text-slate-900 font-extrabold text-xs shadow-md shadow-yellow-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Garri AI bilan gaplashish</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
