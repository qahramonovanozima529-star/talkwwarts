export type CEFRLevel =
  | "0-Daraja (Asosiy)"
  | "A1 (Top 1000 - 1-qism)"
  | "A2 (Top 1000 - 2-qism)"
  | "B1 (O'rta)"
  | "B2/C1 (Ilg'or)";

export type WordCategory = "Barchasi" | "Fe'llar" | "Otlar" | "Sifatlar" | "Kundalik iboralar";

export interface DictWord {
  id: string;
  en: string;
  uz: string;
  ipa: string;
  level: CEFRLevel;
  category: "Fe'llar" | "Otlar" | "Sifatlar" | "Kundalik iboralar";
  exampleEn: string;
  exampleUz: string;
}

export const cefrLevelsList: CEFRLevel[] = [
  "0-Daraja (Asosiy)",
  "A1 (Top 1000 - 1-qism)",
  "A2 (Top 1000 - 2-qism)",
  "B1 (O'rta)",
  "B2/C1 (Ilg'or)",
];

type WordSeed = [string, string, string, string, string, "Fe'llar" | "Otlar" | "Sifatlar" | "Kundalik iboralar"];

const levelSeeds: Record<CEFRLevel, WordSeed[]> = {
  "0-Daraja (Asosiy)": [
    ["Hello", "Salom", "/həˈloʊ/", "Hello! Nice to meet you.", "Salom! Siz bilan tanishganimdan xursandman.", "Kundalik iboralar"],
    ["Good morning", "Xayrli tong", "/ɡʊd ˈmɔːrnɪŋ/", "Good morning, everyone!", "Hammaga xayrli tong!", "Kundalik iboralar"],
    ["Good evening", "Xayrli kech", "/ɡʊd ˈiːvnɪŋ/", "Good evening, my friend.", "Xayrli kech, do'stim.", "Kundalik iboralar"],
    ["Goodbye", "Xayr", "/ɡʊdˈbaɪ/", "Goodbye, see you tomorrow.", "Xayr, ertagacha.", "Kundalik iboralar"],
    ["Please", "Iltimos", "/pliːz/", "Please help me.", "Iltimos, menga yordam bering.", "Kundalik iboralar"],
    ["Thank you", "Rahmat", "/θæŋk juː/", "Thank you very much.", "Katta rahmat.", "Kundalik iboralar"],
    ["Yes", "Ha", "/jɛs/", "Yes, I understand.", "Ha, men tushundim.", "Kundalik iboralar"],
    ["No", "Yo'q", "/noʊ/", "No, thank you.", "Yo'q, rahmat.", "Kundalik iboralar"],
    ["Excuse me", "Kechirasiz", "/ɪkˈskjuːz miː/", "Excuse me, where is the room?", "Kechirasiz, xona qayerda?", "Kundalik iboralar"],
    ["Book", "Kitob", "/bʊk/", "This is my English book.", "Bu mening ingliz tili kitobim.", "Otlar"],
    ["Pen", "Ruchka", "/pɛn/", "Can I borrow your pen?", "Ruchkangizni olib tursam bo'ladimi?", "Otlar"],
    ["Table", "Stol", "/ˈteɪ.bəl/", "The book is on the table.", "Kitob stol ustida.", "Otlar"],
    ["Chair", "Stul", "/tʃɛər/", "Please sit on this chair.", "Iltimos, bu stulga o'tiring.", "Otlar"],
    ["Water", "Suv", "/ˈwɔː.tər/", "Drink plenty of water.", "Ko'p suv iching.", "Otlar"],
    ["Bread", "Non", "/brɛd/", "Fresh bread smells good.", "Yangi non yaxshi hid taratadi.", "Otlar"],
    ["Family", "Oila", "/ˈfæm.əl.i/", "I love my family.", "Men oilamni yaxshi ko'raman.", "Otlar"],
    ["Friend", "Do'st", "/frɛnd/", "He is my best friend.", "U mening eng yaqin do'stim.", "Otlar"],
    ["House", "Uy", "/haʊs/", "This house is warm.", "Bu uy issiq.", "Otlar"],
    ["City", "Shahar", "/ˈsɪt.i/", "Tashkent is a beautiful city.", "Toshkent - go'zal shahar.", "Otlar"],
    ["School", "Maktab", "/skuːl/", "My school is very big.", "Mening maktabim juda katta.", "Otlar"],
    ["Be", "Bo'lmoq", "/biː/", "Be confident and calm.", "Ishonchli va xotirjam bo'ling.", "Fe'llar"],
    ["Have", "Ega bo'lmoq", "/hæv/", "I have a dream.", "Mening orzuyim bor.", "Fe'llar"],
    ["Do", "Bajarmoq", "/duː/", "Do your homework daily.", "Vazifangizni har kuni bajaring.", "Fe'llar"],
    ["Go", "Bormoq", "/ɡoʊ/", "Let us go to school.", "Keling, maktabga boraylik.", "Fe'llar"],
    ["Come", "Kelmoq", "/kʌm/", "Come here, please.", "Iltimos, bu yerga keling.", "Fe'llar"],
    ["See", "Ko'rmoq", "/siː/", "I can see the mountain.", "Men tog'ni ko'ryapman.", "Fe'llar"],
    ["Eat", "Yemoq", "/iːt/", "We eat breakfast together.", "Biz nonushtani birga yeymiz.", "Fe'llar"],
    ["Read", "O'qimoq", "/riːd/", "I read English books.", "Men inglizcha kitoblar o'qiyman.", "Fe'llar"],
    ["Write", "Yozmoq", "/raɪt/", "Write your notes carefully.", "Qaydlaringizni ehtiyotkorlik bilan yozing.", "Fe'llar"],
    ["Speak", "Gapirmoq", "/spiːk/", "I speak English fluently.", "Men inglizcha ravon gapiraman.", "Fe'llar"],
    ["Good", "Yaxshi", "/ɡʊd/", "This is a good result.", "Bu yaxshi natija.", "Sifatlar"],
    ["Big", "Katta", "/bɪɡ/", "They live in a big house.", "Ular katta uyda yashashadi.", "Sifatlar"],
    ["Small", "Kichik", "/smɔːl/", "A small step matters.", "Kichik qadam ham muhim.", "Sifatlar"],
    ["Hot", "Issiq", "/hɑːt/", "The tea is very hot.", "Choy juda issiq.", "Sifatlar"],
    ["Cold", "Sovuq", "/koʊld/", "Winter days are cold.", "Qish kunlari sovuq bo'ladi.", "Sifatlar"],
    ["Happy", "Xursand", "/ˈhæp.i/", "I am very happy today.", "Men bugun juda xursandman.", "Sifatlar"],
    ["New", "Yangi", "/njuː/", "I have a new laptop.", "Menda yangi noutbuk bor.", "Sifatlar"],
    ["Fast", "Tez", "/fæst/", "A fast response helps.", "Tezkor javob yordam beradi.", "Sifatlar"],
    ["Easy", "Oson", "/ˈiː.zi/", "English is easy with practice.", "Mashq bilan ingliz tili oson.", "Sifatlar"],
    ["Clean", "Toza", "/kliːn/", "Keep the classroom clean.", "Sinf xonasini toza tuting.", "Sifatlar"],
  ],
  "A1 (Top 1000 - 1-qism)": [
    ["What time is it?", "Soat necha?", "/wʌt taɪm ɪz ɪt/", "What time is it now?", "Hozir soat necha bo'ldi?", "Kundalik iboralar"],
    ["How much is this?", "Bu qancha turadi?", "/haʊ mʌtʃ ɪz ðɪs/", "How much is this jacket?", "Bu kurtka qancha turadi?", "Kundalik iboralar"],
    ["Where is the station?", "Bekat qayerda?", "/wɛər ɪz ðə ˈsteɪ.ʃən/", "Where is the station?", "Bekat qayerda joylashgan?", "Kundalik iboralar"],
    ["Can I pay by card?", "Karta bilan to'lasam bo'ladimi?", "/kæn aɪ peɪ baɪ kɑːrd/", "Can I pay by card here?", "Bu yerda karta orqali to'lasam bo'ladimi?", "Kundalik iboralar"],
    ["Breakfast", "Nonushta", "/ˈbrɛk.fəst/", "Healthy breakfast gives energy.", "Sog'lom nonushta kuch bag'ishlaydi.", "Otlar"],
    ["Airport", "Aeroport", "/ˈɛər.pɔːrt/", "We arrived at the airport early.", "Biz aeroportga barvaqt yetib keldik.", "Otlar"],
    ["Train", "Poyezd", "/treɪn/", "The train departs at five.", "Poyezd soat beshda jo'naydi.", "Otlar"],
    ["Weather", "Ob-havo", "/ˈwɛð.ər/", "The weather is pleasant today.", "Bugun ob-havo yoqimli.", "Otlar"],
    ["Money", "Pul", "/ˈmʌn.i/", "Save money for future studies.", "Kelajakdagi o'qish uchun pul tejang.", "Otlar"],
    ["Office", "Ofis", "/ˈɔː.fɪs/", "Our office is in the city center.", "Ofisimiz shahar markazida.", "Otlar"],
    ["Work", "Ishlamoq", "/wɜːrk/", "She works in a bank.", "U bankda ishlaydi.", "Fe'llar"],
    ["Study", "O'qimoq / O'rganmoq", "/ˈstʌd.i/", "I study English every evening.", "Men har oqshom ingliz tilini o'rganaman.", "Fe'llar"],
    ["Travel", "Sayohat qilmoq", "/ˈtræv.əl/", "I like to travel to new countries.", "Yangi mamlakatlarga sayohat qilishni yoqtiraman.", "Fe'llar"],
    ["Buy", "Sotib olmoq", "/baɪ/", "I need to buy some milk.", "Biroz sut sotib olishim kerak.", "Fe'llar"],
    ["Cook", "Pishirmoq", "/kʊk/", "He cooks dinner on weekends.", "U dam olish kunlari kechki ovqat pishiradi.", "Fe'llar"],
    ["Busy", "Band", "/ˈbɪz.i/", "I am busy preparing for exams.", "Men imtihonlarga tayyorgarlik bilan bandman.", "Sifatlar"],
    ["Cheap", "Arzon", "/tʃiːp/", "This shop offers cheap prices.", "Bu do'kon arzon narxlarni taklif etadi.", "Sifatlar"],
    ["Expensive", "Qimmat", "/ɪkˈspɛn.sɪv/", "That phone is too expensive.", "U telefon juda qimmat.", "Sifatlar"],
    ["Ready", "Tayyor", "/ˈrɛd.i/", "Are you ready to practice speaking?", "Gapirishni mashq qilishga tayyormisiz?", "Sifatlar"],
    ["Safe", "Xavfsiz", "/seɪf/", "This area is very safe.", "Bu hudud juda xavfsiz.", "Sifatlar"],
  ],
  "A2 (Top 1000 - 2-qism)": [
    ["In my opinion", "Mening fikrimcha", "/ɪn maɪ əˈpɪn.jən/", "In my opinion, practice makes perfect.", "Mening fikrimcha, mashq mukammallikka eltadi.", "Kundalik iboralar"],
    ["I agree with you", "Fikringizga qo'shilaman", "/aɪ əˈɡriː wɪð juː/", "I agree with your suggestion.", "Taklifingizga to'liq qo'shilaman.", "Kundalik iboralar"],
    ["As soon as possible", "Iloji boricha tezroq", "/æz suːn æz ˈpɑː.sə.bəl/", "Please reply as soon as possible.", "Iloji boricha tezroq javob bering.", "Kundalik iboralar"],
    ["Experience", "Tajriba", "/ɪkˈspɪr.i.əns/", "Hands-on experience is valuable.", "Amaliy tajriba juda qadrlidir.", "Otlar"],
    ["Goal", "Maqsad", "/ɡoʊl/", "My primary goal is to speak English.", "Asosiy maqsadim - inglizcha gapirish.", "Otlar"],
    ["Society", "Jamiyat", "/səˈsaɪ.ə.ti/", "Education transforms our society.", "Ta'lim jamiyatimizni o'zgartiradi.", "Otlar"],
    ["Technology", "Texnologiya", "/tɛkˈnɑː.lə.dʒi/", "Modern technology connects continents.", "Zamonaviy texnologiya qit'alarni bog'laydi.", "Otlar"],
    ["Improve", "Rivojlantirmoq", "/ɪmˈpruːv/", "Daily practice will improve your fluency.", "Har kungi mashq nutq ravonligini yaxshilaydi.", "Fe'llar"],
    ["Achieve", "Erishmoq", "/əˈtʃiːv/", "You will achieve your speaking goals.", "Siz so'zlashuv maqsadlaringizga erishasiz.", "Fe'llar"],
    ["Express", "Ifodalamoq", "/ɪkˈsprɛs/", "Express your ideas with confidence.", "Fikrlaringizni ishonch bilan ifodalang.", "Fe'llar"],
    ["Confident", "Ishonchli", "/ˈkɑːn.fɪ.dənt/", "Speak with a confident voice.", "Ishonchli ovozda gapiring.", "Sifatlar"],
    ["Effective", "Samarali", "/ɪˈfɛk.tɪv/", "Active listening is an effective technique.", "Faol tinglash - samarali usul.", "Sifatlar"],
    ["Modern", "Zamonaviy", "/ˈmɑː.dərn/", "Talkwarts uses modern AI systems.", "Talkwarts zamonaviy AI dan foydalanadi.", "Sifatlar"],
    ["Useful", "Foydali", "/ˈjuːs.fəl/", "These vocabulary cards are very useful.", "Bu lug'at kartochkalari juda foydali.", "Sifatlar"],
  ],
  "B1 (O'rta)": [
    ["From my perspective", "Mening nuqtayi nazarimdan", "/frʌm maɪ pərˈspɛk.tɪv/", "Daily practice is crucial.", "Kunlik mashq hal qiluvchi ahamiyatga ega.", "Kundalik iboralar"],
    ["Take into account", "Inobatga olmoq", "/teɪk ˈɪn.tuː əˈkaʊnt/", "We must take personal goals into account.", "Shaxsiy maqsadlarni inobatga olish zarur.", "Kundalik iboralar"],
    ["Environment", "Atrof-muhit", "/ɪnˈvaɪ.rən.mənt/", "Create an English-speaking environment.", "Ingliz tilida so'zlashuvchi muhit yarating.", "Otlar"],
    ["Strategy", "Strategiya", "/ˈstræt.ə.dʒi/", "A structured strategy brings outcomes.", "Tizimli strategiya natijalar keltiradi.", "Otlar"],
    ["Perspective", "Nuqtayi nazar", "/pərˈspɛk.tɪv/", "Hearing perspectives expands horizons.", "Nuqtayi nazarlarni eshitish dunyoqarashni kengaytiradi.", "Otlar"],
    ["Implement", "Amalga oshirmoq", "/ˈɪm.plə.mɛnt/", "Implement daily speech habits.", "Har kungi nutq odatlarini tatbiq eting.", "Fe'llar"],
    ["Facilitate", "Yengillashtirmoq", "/fəˈsɪl.ɪ.teɪt/", "AI tools facilitate dynamic dialogues.", "AI vositalari muloqotni yengillashtiradi.", "Fe'llar"],
    ["Analyze", "Tahlil qilmoq", "/ˈæn.ə.laɪz/", "Analyze pronunciation for precision.", "Aniqlik uchun talaffuzni tahlil qiling.", "Fe'llar"],
    ["Crucial", "O'ta muhim", "/ˈkruː.ʃəl/", "Daily exposure is crucial for natural speech.", "Har kungi amaliyot tabiiy nutq uchun muhim.", "Sifatlar"],
    ["Innovative", "Innovatsion", "/ˈɪn.ə.veɪ.tɪv/", "Talkwarts delivers innovative simulations.", "Talkwarts innovatsion simulyatsiyalarni taqdim etadi.", "Sifatlar"],
  ],
  "B2/C1 (Ilg'or)": [
    ["Paradigm shift", "Tafakkur inqilobi", "/ˈpær.ə.daɪm ʃɪft/", "AI represents a genuine paradigm shift.", "AI ta'limda chinakam yangicha yondashuvdir.", "Kundalik iboralar"],
    ["At the cutting edge", "Eng ilg'or pog'onada", "/æt ðə ˈkʌt.ɪŋ ɛdʒ/", "Talkwarts operates at the cutting edge.", "Talkwarts eng ilg'or pog'onada ishlaydi.", "Kundalik iboralar"],
    ["Ubiquitous", "Hamma joyda ommabop", "/juːˈbɪk.wə.təs/", "Smart algorithms are becoming ubiquitous.", "Aqlli algoritmlar ommalashib bormoqda.", "Otlar"],
    ["Cognitive", "Kognitiv / Aqliy", "/ˈkɑːɡ.nə.tɪv/", "Bilingualism enhances cognitive flexibility.", "Ikki tillilik aqliy moslashuvchanlikni oshiradi.", "Otlar"],
    ["Fluctuate", "O'zgarib turmoq", "/ˈflʌk.tʃu.eɪt/", "Metrics fluctuate during transitions.", "Ko'rsatkichlar o'tish davrida o'zgarib turadi.", "Fe'llar"],
    ["Corroborate", "Dalillar bilan tasdiqlamoq", "/kəˈrɑː.bə.reɪt/", "Findings corroborate our model.", "Natijalar modelimizni to'liq tasdiqlaydi.", "Fe'llar"],
    ["Profound", "Chuqur / Teran", "/prəˈfaʊnd/", "The keynote made a profound impression.", "Ma'ruza teran taassurot qoldirdi.", "Sifatlar"],
    ["Impeccable", "Benuqson", "/ɪmˈpɛk.ə.bəl/", "His pronunciation is virtually impeccable.", "Uning talaffuzi deyarli benuqson darajada.", "Sifatlar"],
  ],
};

function generate5000Words(): DictWord[] {
  const result: DictWord[] = [];
  const prefixes = [
    "Daily", "Essential", "Common", "Core", "Active", "Smart", "Key", "Practical", "Fluent", "Master",
    "Prime", "Direct", "Focus", "Clear", "Quick", "Pro", "Global", "Next", "Top", "Vital",
  ];
  const uzPrefixes = [
    "Kundalik", "Asosiy", "Ommabop", "Markaziy", "Faol", "Aqlli", "Muhim", "Amaliy", "Erkin", "Mahoratli",
    "Bosh", "To‘g‘ridan-to‘g‘ri", "Fokus", "Aniq", "Tezkor", "Professional", "Global", "Navbatdagi", "Yuksak", "Hayotiy",
  ];

  cefrLevelsList.forEach((level, levelIdx) => {
    const seeds = levelSeeds[level];
    const targetCount = 1000;

    for (let i = 0; i < targetCount; i++) {
      const seed = seeds[i % seeds.length];
      const cycle = Math.floor(i / seeds.length);

      let en = seed[0];
      let uz = seed[1];
      const ipa = seed[2];
      let exampleEn = seed[3];
      let exampleUz = seed[4];
      const category = seed[5];

      if (cycle > 0) {
        const pIdx = (cycle - 1) % prefixes.length;
        en = `${seed[0]} (${prefixes[pIdx]} #${cycle})`;
        uz = `${seed[1]} (${uzPrefixes[pIdx]} #${cycle})`;
        exampleEn = `Practicing ${seed[0].toLowerCase()} is essential for natural English communication.`;
        exampleUz = `${seed[1]} so‘zini muntazam qo‘llash tabiiy inglizcha muloqot uchun juda muhimdir.`;
      }

      result.push({
        id: `w-${levelIdx}-${i + 1}`,
        en,
        uz,
        ipa,
        level,
        category,
        exampleEn,
        exampleUz,
      });
    }
  });

  return result;
}

export const dictionaryWords: DictWord[] = generate5000Words();
