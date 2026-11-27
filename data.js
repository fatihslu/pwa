// 37 yaş, 180 cm, 86 kg, masa başı çalışan, evde ayarlanabilir dambıl + mat (sehpasız)
// Haftalık düzen: Pzt, Sal, Çar, Cum, Cmt antrenman | Per, Paz dinlenme

const WARMUP_ROUTINE = [
  { id: 'w1', text: 'Boyun & Omuz Daireleri (10 öne, 10 arkaya — masa başı gerginliğini açar)' },
  { id: 'w2', text: 'Kapı/Duvar Göğüs Esnetme (Her kol 30 sn — kambur duruşu düzeltir)' },
  { id: 'w3', text: 'Bilek & Dirsek Isındırma (30 sn çevirme + hafif boş kol curl/extension)' },
  { id: 'w4', text: '20 Jumping Jack veya 1 dk yerinde tempolu yürüyüş (nabız yükseltme)' }
];

const EXERCISES = {
  bent_over_row: {
    id: 'bent_over_row',
    name: 'Eğilerek Çift Dambıl Row',
    muscle: 'Sırt & Biceps Desteği',
    visualKey: 'bent_over_row',
    sets: 4,
    reps: '10-12',
    rest: 90,
    startWeight: '2 × 8-10 kg',
    tips: [
      'Dizleri hafif bük, kalçayı geriye it ve sırtını masa gibi düz tut.',
      'Dambılları beline/kalçana doğru çek, üst noktada kürek kemiklerini 1 sn sık.',
      'Aşağı indirirken ağırlığı kontrolle bırak, belini kamburlaştırma.'
    ],
    caution: 'Masa başı çalışanlarda bel hassas olabilir; karın kaslarını sıkı tutarak belini koru.'
  },
  dumbbell_curl: {
    id: 'dumbbell_curl',
    name: 'Ayakta Dambıl Biceps Curl',
    muscle: 'Biceps (Ön Kol Pazu)',
    visualKey: 'dumbbell_curl',
    sets: 4,
    reps: '10-12',
    rest: 75,
    startWeight: '2 × 6-8 kg',
    tips: [
      'Dirseklerini vücudunun yanına kilitle; ileri-geri sallanma.',
      'Yukarı kaldırırken avuç içini tavana çevir ve tepe noktada biceps’i sık.',
      'İniş fazını 2-3 saniyede yavaş yap; asıl kas büyümesi inişte olur.'
    ],
    caution: 'Ağırlığı kaldırmak için belden ivme alma; gerekiyorsa 1-2 kg düşür.'
  },
  hammer_curl: {
    id: 'hammer_curl',
    name: 'Çekiç (Hammer) Curl',
    muscle: 'Brachialis & Ön Kol Kalınlığı',
    visualKey: 'hammer_curl',
    sets: 3,
    reps: '12',
    rest: 60,
    startWeight: '2 × 6-8 kg',
    tips: [
      'Avuç içleri birbirine baksın (çekiç tutuşu) ve bileği hiç bükme.',
      'Kolu yanlardan dikey olarak omza doğru kaldır.',
      'Bu hareket kolu yandan bakıldığında çok daha kalın ve iri gösterir.'
    ],
    caution: 'Omuzları yukarı çekme, boynunu rahat bırak.'
  },
  concentration_curl: {
    id: 'concentration_curl',
    name: 'Oturarak Konsantrasyon Curl',
    muscle: 'Biceps Zirvesi',
    visualKey: 'concentration_curl',
    sets: 3,
    reps: '12 (Her Kol)',
    rest: 60,
    startWeight: '1 × 6-8 kg',
    tips: [
      'Sandalye veya koltuk kenarına otur, dirseğini iç uyluğuna yasla.',
      'Sadece ön kolunu hareket ettirerek dambılı omzuna doğru çek.',
      'Tepe noktada 1 saniye sıkıp tam aşağı indirmeden tekrar başla.'
    ],
    caution: 'Dirseği uyluktan kaldırma; izole çalışması için sabit tut.'
  },
  wrist_curl: {
    id: 'wrist_curl',
    name: 'Ön Kol Bilek Curl',
    muscle: 'Ön Kol (Forearm)',
    visualKey: 'wrist_curl',
    sets: 3,
    reps: '15-20',
    rest: 45,
    startWeight: '2 × 4-6 kg',
    tips: [
      'Ön kollarını dizlerinin üzerine koy, bileklerin dizden dışarı taşsın.',
      'Avuç içleri yukarı bakarken sadece bileklerinle dambılı yukarı kıvır.',
      'Tişört giydiğinde bile kolların güçlü görünmesini sağlayan kilit harekettir.'
    ],
    caution: 'Bilekte keskin ağrı olursa hareket açısını küçült veya ağırlığı azalt.'
  },
  floor_press: {
    id: 'floor_press',
    name: 'Zeminde Dambıl Göğüs Press',
    muscle: 'Göğüs, Ön Omuz & Triceps',
    visualKey: 'floor_press',
    sets: 4,
    reps: '10-12',
    rest: 90,
    startWeight: '2 × 8-12 kg',
    tips: [
      'Mat üzerine sırtüstü uzan, dizlerini büküp ayak tabanlarını yere bas.',
      'Dirsekleri gövdeyle 45° açıda tut (90° T şeklinde açma).',
      'Üst kolların yere hafifçe değdiğinde patlayıcı şekilde yukarı it.'
    ],
    caution: 'Zemin dirsekleri durdurduğu için omuz eklemi için sehpadan bile güvenlidir.'
  },
  floor_fly: {
    id: 'floor_fly',
    name: 'Zeminde Dambıl Açış (Floor Fly)',
    muscle: 'Göğüs Genişliği',
    visualKey: 'floor_fly',
    sets: 3,
    reps: '12-15',
    rest: 60,
    startWeight: '2 × 5-7 kg',
    tips: [
      'Sırtüstü uzan, avuç içleri birbirine baksın, dirsekler hafif kırık kalsın.',
      'Kolları yanlara açarken üst kolun yere hafifçe değsin.',
      'Göğsünü sıkarak dambılları yukarıda birbirine yaklaştır.'
    ],
    caution: 'Dirsekleri tamamen kilitleme; hafif bükülü kalarak omuz yükünü azalt.'
  },
  lateral_raise: {
    id: 'lateral_raise',
    name: 'Yana Omuz Açış (Lateral Raise)',
    muscle: 'Yan Omuz (Geniş Görünüm)',
    visualKey: 'lateral_raise',
    sets: 4,
    reps: '12-15',
    rest: 60,
    startWeight: '2 × 4-6 kg',
    tips: [
      'Kolları yanlara doğru omuz hizasına kadar kaldır (su döker gibi hafif öne eğimli).',
      'Dirsekler ellerden biraz daha yukarıda kalsın.',
      'Geniş omuz = kolların çok daha iri ve atletik görünmesi!'
    ],
    caution: 'Ağır kilo seçip omuzları kulaklara çekme; hafif ağırlıkla temiz yap.'
  },
  overhead_triceps: {
    id: 'overhead_triceps',
    name: 'Baş Üstü Triceps Extension',
    muscle: 'Triceps Uzun Başı (Kol Hacmi)',
    visualKey: 'overhead_triceps',
    sets: 4,
    reps: '10-12',
    rest: 75,
    startWeight: '1 × 8-10 kg',
    tips: [
      'Tek dambılı iki elinle başının üstünde kavra (elmas tutuş).',
      'Dirseklerini kulaklarına yakın ve sabit tutarak dambılı ensene doğru indir.',
      'Triceps’i hissederek yukarı it; kol kalınlığının en büyük parçası burasıdır.'
    ],
    caution: 'Belini aşırı çukurlaştırma; karın kaslarını sıkılı tut.'
  },
  triceps_kickback: {
    id: 'triceps_kickback',
    name: 'Eğilerek Triceps Kickback',
    muscle: 'Triceps Arka Kol',
    visualKey: 'triceps_kickback',
    sets: 3,
    reps: '12-15',
    rest: 60,
    startWeight: '2 × 4-6 kg',
    tips: [
      'Gövdeni 45° öne eğ, dirseklerini bel hizasında gövdene sabitle.',
      'Ön kolunu geriye doğru tam düz olana kadar aç ve 1 sn sık.',
      'Üst kolun hareket boyunca yere paralel ve sabit kalsın.'
    ],
    caution: 'Savurma yapma; hafif kiloyla tam kasılma yakalamaya odaklan.'
  },
  goblet_squat: {
    id: 'goblet_squat',
    name: 'Goblet Squat',
    muscle: 'Ön Bacak, Kalça & Core',
    visualKey: 'goblet_squat',
    sets: 4,
    reps: '12-15',
    rest: 90,
    startWeight: '1 × 10-14 kg',
    tips: [
      'Tek dambılı dikey olarak göğsünün önünde iki elinle tut.',
      'Ayaklar omuz genişliğinden biraz açık, parmak uçları hafif dışa dönük.',
      'Sandalyeye oturur gibi kalçanı geriye ve aşağı indir, topuklardan güç alarak kalk.'
    ],
    caution: 'Dizlerin içe çökmesine izin verme; ayak parmaklarınla aynı yöne baksın.'
  },
  dumbbell_rdl: {
    id: 'dumbbell_rdl',
    name: 'Dambıl Rumen Deadlift (RDL)',
    muscle: 'Arka Bacak, Kalça & Bel Gücü',
    visualKey: 'dumbbell_rdl',
    sets: 4,
    reps: '10-12',
    rest: 90,
    startWeight: '2 × 8-12 kg',
    tips: [
      'Dizleri çok hafif kır ve sabit tut; kalçanı duvara doğru geriye it.',
      'Dambıllar bacaklarına sürtünerek kaval kemiği ortasına kadar insin.',
      'Arka bacakta gerilme hissedince kalçayı öne iterek dikleş.'
    ],
    caution: 'Masa başı oturmaktan kısalan arka bacağı açar; sırtını asla yuvarlama.'
  },
  reverse_lunge: {
    id: 'reverse_lunge',
    name: 'Geriye Adım Lunge',
    muscle: 'Bacak & Denge',
    visualKey: 'reverse_lunge',
    sets: 3,
    reps: '10 (Her Bacak)',
    rest: 75,
    startWeight: '2 × 5-8 kg',
    tips: [
      'İki elinde dambılla dik dur, bir ayağınla geriye büyük bir adım at.',
      'Arka diz yere yaklaşana kadar alçal, öndeki topuktan güç alıp başa dön.',
      'Geriye adım atmak öne adıma göre diz eklemi için çok daha dosttur.'
    ],
    caution: 'Gövdeni dik tut, öne eğilme.'
  },
  plank: {
    id: 'plank',
    name: 'Dirsek Üstü Plank',
    muscle: 'Core & Bel Stabilitesi',
    visualKey: 'plank',
    sets: 3,
    reps: '40-50 sn',
    rest: 45,
    startWeight: 'Vücut Ağırlığı',
    tips: [
      'Dirsekler tam omuzların altında, vücut baştan topuğa düz bir çizgi.',
      'Kalçanı sık ve karnını içeri çek; belinin aşağı çökmesine izin verme.',
      'Düzenli nefes alıp vermeyi unutma.'
    ],
    caution: 'Belde ağrı hissedersen kalçayı 1-2 cm yukarı kaldırıp tekrar sık.'
  },
  superman_hold: {
    id: 'superman_hold',
    name: 'Zeminde Sırt & Postür (Superman)',
    muscle: 'Alt Sırt & Masa Başı Postürü',
    visualKey: 'superman_hold',
    sets: 3,
    reps: '12 (2 sn tut)',
    rest: 45,
    startWeight: 'Vücut Ağırlığı',
    tips: [
      'Mat üzerine yüzüstü uzan, kolları öne veya Y şeklinde aç.',
      'Göğsünü ve bacaklarını yerden hafifçe kaldırıp kürek kemiklerini sık.',
      'Masa başı kamburluğunu tersine çeviren en iyi zemin hareketidir.'
    ],
    caution: 'Boynunu geriye bükme; bakışın yere/matın önüne odaklı kalsın.'
  },
  arnold_press: {
    id: 'arnold_press',
    name: 'Arnold Press',
    muscle: 'Tüm Omuz Başları',
    visualKey: 'arnold_press',
    sets: 4,
    reps: '10-12',
    rest: 90,
    startWeight: '2 × 6-8 kg',
    tips: [
      'Başlangıçta dambıllar çene hizasında, avuç içleri sana baksın.',
      'Yukarı iterken bilekleri döndürerek tepe noktada avuç içlerini karşıya çevir.',
      'İnerken aynı rotasyonla başlangıç pozisyonuna dön.'
    ],
    caution: 'Ayakta yaparken beli geriye bükme; gerekirse diz çökerek veya oturarak yap.'
  },
  rear_delt_fly: {
    id: 'rear_delt_fly',
    name: 'Eğilerek Arka Omuz Açış',
    muscle: 'Arka Omuz & Üst Sırt',
    visualKey: 'rear_delt_fly',
    sets: 3,
    reps: '12-15',
    rest: 60,
    startWeight: '2 × 4-5 kg',
    tips: [
      'Gövdeni yere neredeyse paralel olacak şekilde öne eğ.',
      'Dambılları yanlara ve hafif geriye doğru aç, arka omuzları sık.',
      'Masa başı duruşundan öne düşen omuzları geriye çeker.'
    ],
    caution: 'Hafif ağırlık kullan; belin yorulursa göğsünü dizlerine yaklaştır.'
  },
  dumbbell_shrug: {
    id: 'dumbbell_shrug',
    name: 'Dambıl Trapez (Shrug)',
    muscle: 'Üst Sırt & Trapez (İri Üst Çerçeve)',
    visualKey: 'dumbbell_shrug',
    sets: 3,
    reps: '15',
    rest: 60,
    startWeight: '2 × 10-14 kg',
    tips: [
      'İki elinde ağır dambıllarla dik dur.',
      'Omuzlarını kulaklarına doğru düz yukarı çek ve 2 saniye sıkılı tut.',
      'Omuzları yuvarlama, sadece dikey yukarı-aşağı hareket ettir.'
    ],
    caution: 'Boynunu öne uzatma; başın dik kalsın.'
  },
  single_arm_row: {
    id: 'single_arm_row',
    name: 'Tek Kol Dambıl Row',
    muscle: 'Sırt Genişliği (Kanat)',
    visualKey: 'single_arm_row',
    sets: 3,
    reps: '12 (Her Kol)',
    rest: 60,
    startWeight: '1 × 10-14 kg',
    tips: [
      'Bir elinle sağlam bir sandalye/koltuğa veya dizine yaslan.',
      'Diğer elindeki dambılı kalça cebine doğru çek, dirseği gövdeye yakın tut.',
      'Aşağı inerken sırtının esnediğini hisset.'
    ],
    caution: 'Gövdeyi yana döndürmeden sadece sırt ve kol ile çek.'
  },
  close_grip_floor_press: {
    id: 'close_grip_floor_press',
    name: 'Dar Tutuş Zemin Press',
    muscle: 'Triceps & İç Göğüs',
    visualKey: 'close_grip_floor_press',
    sets: 4,
    reps: '10-12',
    rest: 75,
    startWeight: '2 × 8-10 kg',
    tips: [
      'Zemine uzan, dambılları birbirine paralel (avuç içleri birbirine bakar) tut.',
      'Dirsekleri gövdene yapışık tutarak yukarı it.',
      'Normal press’e göre yükün büyük kısmını doğrudan triceps’e bindirir.'
    ],
    caution: 'Dambılları birbirine çarpma, kontrollü indir.'
  },
  zottman_curl: {
    id: 'zottman_curl',
    name: 'Zottman Curl',
    muscle: 'Biceps + Ön Kol Çift Etki',
    visualKey: 'zottman_curl',
    sets: 3,
    reps: '10-12',
    rest: 60,
    startWeight: '2 × 5-7 kg',
    tips: [
      'Yukarı kaldırırken normal curl gibi avuç içlerin yukarı baksın.',
      'Tepe noktada bilekleri çevir (avuç içleri yere baksın) ve 3 saniyede yavaşça indir.',
      'Hem biceps’i hem ön kolu aynı anda büyüten mükemmel bir hareket.'
    ],
    caution: 'İniş fazını hızlı geçme; asıl sihir yavaş inişte.'
  },
  floor_skull_crusher: {
    id: 'floor_skull_crusher',
    name: 'Zeminde Alna Triceps (Skull Crusher)',
    muscle: 'Triceps Tam Hacim',
    visualKey: 'floor_skull_crusher',
    sets: 4,
    reps: '12',
    rest: 75,
    startWeight: '2 × 5-7 kg',
    tips: [
      'Mat üzerine sırtüstü uzan, kolları yukarı uzat (avuçlar birbirine baksın).',
      'Dirsekleri sabit tutup dambılları kulaklarının yanından yere doğru indir.',
      'Yere hafifçe dokunup triceps’i sıkarak tekrar yukarı kaldır.'
    ],
    caution: 'Dirsekleri yanlara açma; tavana paralel ve sabit tut.'
  },
  reverse_curl: {
    id: 'reverse_curl',
    name: 'Ters Tutuş Ön Kol Curl',
    muscle: 'Ön Kol & Brachioradialis',
    visualKey: 'reverse_curl',
    sets: 3,
    reps: '12-15',
    rest: 45,
    startWeight: '2 × 4-6 kg',
    tips: [
      'Avuç içleri yere/vücuduna dönük şekilde dambılları tut.',
      'Dirsekler sabit, bileği bükmeden omza doğru kaldır.',
      'Kolu bilekten dirseğe kadar kalın ve damarlı gösterir.'
    ],
    caution: 'Hafif ağırlık seç, bilekleri düz tut.'
  }
};

// JS Date.getDay() -> 0: Pazar, 1: Pazartesi, 2: Salı, 3: Çarşamba, 4: Perşembe, 5: Cuma, 6: Cumartesi
const WEEKLY_PLAN = {
  1: {
    dayIndex: 1,
    short: 'Pzt',
    name: 'Pazartesi',
    title: 'Biceps, Sırt & Ön Kol',
    subtitle: 'Çekiş + Kol Kalınlığı Günü',
    isRest: false,
    duration: '~45 dk',
    focusBadge: '1. Gün • Çekiş & Biceps',
    exercises: ['bent_over_row', 'dumbbell_curl', 'hammer_curl', 'concentration_curl', 'wrist_curl']
  },
  2: {
    dayIndex: 2,
    short: 'Sal',
    name: 'Salı',
    title: 'Göğüs, Omuz & Triceps',
    subtitle: 'Zemin İtiş + Arka Kol & Omuz',
    isRest: false,
    duration: '~45 dk',
    focusBadge: '2. Gün • İtiş & Triceps',
    exercises: ['floor_press', 'floor_fly', 'lateral_raise', 'overhead_triceps', 'triceps_kickback']
  },
  3: {
    dayIndex: 3,
    short: 'Çar',
    name: 'Çarşamba',
    title: 'Alt Vücut, Core & Postür',
    subtitle: 'Metabolik Güç + Masa Başı Düzeltme',
    isRest: false,
    duration: '~40 dk',
    focusBadge: '3. Gün • Bacak & Core',
    exercises: ['goblet_squat', 'dumbbell_rdl', 'reverse_lunge', 'plank', 'superman_hold']
  },
  4: {
    dayIndex: 4,
    short: 'Per',
    name: 'Perşembe',
    title: 'Dinlenme & Aktif Toparlanma',
    subtitle: 'Kas Onarımı ve Mobilite',
    isRest: true,
    duration: '20 dk yürüyüş',
    focusBadge: 'Dinlenme Günü',
    restTasks: [
      '8.000 – 10.000 adım tempolu açık hava yürüyüşü yap.',
      'Masa başında her 1 saatte bir 2 dk ayağa kalkıp omuzlarını geriye aç.',
      'Protein hedefini (170g) ve 3.5 Litre su hedefini aksatma.',
      'Akşam 10 dk boyun, göğüs ve kalça fleksörü esnemesi uygula.'
    ]
  },
  5: {
    dayIndex: 5,
    short: 'Cum',
    name: 'Cuma',
    title: 'Omuz & Üst Sırt',
    subtitle: 'Geniş Omuz & İri Üst Vücut Çerçevesi',
    isRest: false,
    duration: '~45 dk',
    focusBadge: '4. Gün • Genişlik & Omuz',
    exercises: ['arnold_press', 'lateral_raise', 'rear_delt_fly', 'dumbbell_shrug', 'single_arm_row']
  },
  6: {
    dayIndex: 6,
    short: 'Cmt',
    name: 'Cumartesi',
    title: 'Tam Kol Günü (Pump)',
    subtitle: 'Biceps + Triceps + Ön Kol Hacim Patlaması',
    isRest: false,
    duration: '~45 dk',
    focusBadge: '5. Gün • Özel Kol Günü',
    exercises: ['close_grip_floor_press', 'zottman_curl', 'floor_skull_crusher', 'hammer_curl', 'overhead_triceps', 'reverse_curl']
  },
  0: {
    dayIndex: 0,
    short: 'Paz',
    name: 'Pazar',
    title: 'Tam Dinlenme Günü',
    subtitle: 'Büyüme, Uyku & Haftalık Ölçüm',
    isRest: true,
    duration: 'Tam Dinlenme',
    focusBadge: 'Haftalık Toparlanma',
    restTasks: [
      'Kaslar antrenmanda uyarılır, dinlenirken büyür — bugün ağır kaldırma.',
      'En az 7-8 saat kaliteli uyku almaya özen göster.',
      'İlerleme sekmesinden haftalık kilonu ve sağ/sol kol ölçünü (cm) kaydet.',
      'Pazartesi antrenmanı için dambıl ağırlıklarını gözden geçir.'
    ]
  }
};

const NUTRITION_PLAN = {
  training: {
    label: 'Antrenman Günü',
    calories: 2600,
    protein: 170,
    carbs: 280,
    fat: 75,
    waterLiters: 3.5,
    meals: [
      {
        id: 'm1',
        time: '08:30 • Kahvaltı',
        title: 'Yüksek Proteinli Güç Kahvaltısı',
        items: '3 tam yumurta + 2 yumurta beyazı (omlet/haşlama), 60g yulaf ezmesi (süt/yoğurt ile) veya 2 dilim tam buğday ekmeği, 50g lor peyniri, domates/salatalık, 5-6 zeytin.',
        macros: '42g P • 52g K • 20g Y (~560 kcal)'
      },
      {
        id: 'm2',
        time: '13:00 • Öğle',
        title: 'Tavuk/Hindi & Pirinç Tabak',
        items: '180-200g ızgara/tava tavuk göğsü (veya yağsız kıyma), 150-180g pişmiş pirinç veya bulgur pilavı, bol yeşil salata + 1 tatlı kaşığı zeytinyağı.',
        macros: '48g P • 65g K • 14g Y (~580 kcal)'
      },
      {
        id: 'm3',
        time: '17:00 • Antrenman Öncesi (45-60 dk önce)',
        title: 'Enerji & Pump Öğünü',
        items: '1 büyük muz + 1 sade Türk kahvesi veya filtre kahve + 15g çiğ badem/ceviz (istersen 1 ölçek whey veya 150g süzme yoğurt).',
        macros: '12g P • 35g K • 9g Y (~270 kcal)'
      },
      {
        id: 'm4',
        time: '19:30 • Akşam / Antrenman Sonrası',
        title: 'Kas Onarım Ana Öğünü',
        items: '200g tavuk/hindi/balık veya yağsız dana eti, 250g fırın/haşlama patates veya 180g pişmiş makarna, 1 kase yoğurt veya cacık.',
        macros: '50g P • 80g K • 18g Y (~680 kcal)'
      },
      {
        id: 'm5',
        time: '22:00 • Gece / Ara Öğün',
        title: 'Yavaş Sindirilen Protein (Kazein)',
        items: '200g süzme yoğurt veya 100g lor peyniri + 1 tatlı kaşığı bal/tarçın + 4-5 tam ceviz.',
        macros: '20g P • 18g K • 14g Y (~280 kcal)'
      }
    ]
  },
  rest: {
    label: 'Dinlenme Günü',
    calories: 2300,
    protein: 170,
    carbs: 200,
    fat: 78,
    waterLiters: 3.0,
    meals: [
      {
        id: 'r1',
        time: '09:00 • Kahvaltı',
        title: 'Protein & Sağlıklı Yağ Odaklı',
        items: '3 tam yumurta + 50g beyaz peynir/lor, 1 dilim tam buğday ekmeği, yarım avokado veya 8-10 zeytin, bol yeşillik.',
        macros: '38g P • 25g K • 26g Y (~490 kcal)'
      },
      {
        id: 'r2',
        time: '13:30 • Öğle',
        title: 'Et/Tavuk & Sebze',
        items: '200g tavuk/köfte/balık, 100g pişmiş bulgur veya karabuğday, bol zeytinyağlı salata.',
        macros: '48g P • 40g K • 18g Y (~520 kcal)'
      },
      {
        id: 'r3',
        time: '16:30 • Ara Öğün',
        title: 'Ofis/Masa Başı Pratik',
        items: '1 kase (200g) süzme yoğurt veya kefir + 1 avuç çiğ badem/fındık + 1 elma.',
        macros: '18g P • 28g K • 15g Y (~320 kcal)'
      },
      {
        id: 'r4',
        time: '19:30 • Akşam',
        title: 'Temiz Akşam Yemeği',
        items: '200g ızgara et/balık/tavuk, zeytinyağlı sebze yemeği (brokoli/kabak/fasulye), 1 kase yoğurt.',
        macros: '46g P • 35g K • 18g Y (~490 kcal)'
      },
      {
        id: 'r5',
        time: '22:00 • Gece',
        title: 'Toparlanma Desteği',
        items: '100g lor peyniri veya 150g süzme yoğurt + tarçın.',
        macros: '20g P • 8g K • 5g Y (~160 kcal)'
      }
    ]
  }
};
