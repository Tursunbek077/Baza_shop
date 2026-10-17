// ============================================================================
// BAZA_SHOP — Internationalization (i18n) & Smart Translation Service
// Provides bilingual (Uzbek & Russian) dictionaries, category/color mappings,
// and bi-directional auto-translation via free Google Translate API.
// ============================================================================

export const LANG_STORAGE_KEY = 'baza_shop_language_v1';

export const DICTIONARY = {
  uz: {
    // Header & Announcement
    deliveryNotice: '🚚 Barcha viloyatlarga bepul yetkazib berish!',
    customerGreeting: '👋 Salom',
    login: 'Kirish',
    register: 'Ro‘yxatdan o‘tish',
    staffLogin: 'Xodimlar kirishi',
    phone: '📞 +998 (90) 123-45-67',
    boutiqueSubtitle: 'Haute Couture • Butik',
    navHome: 'Asosiy',
    navCollection: 'Kolleksiya',
    navFeatures: 'Afzalliklar',
    navContact: 'Aloqa',
    searchPlaceholder: 'Libos yoki kategoriya qidirish...',
    wishlist: 'Sevimlilar',
    cart: 'Savatcha',
    lightMode: 'Yorug‘ rejim',
    darkMode: 'Tungi rejim',

    // Hero Banner
    heroExclusiveBadge: '✨ EKSKLYUZIV -25%',
    heroWeekFavorite: '🌸 HAFTA SEVIMLISI',
    heroTagline: 'BAZA_SHOP • BAHOR-YOZ \'26 YANGI KOLLEKSIYASI',
    heroHeadline: 'Nafislik va Go‘zallik Timsoli',
    heroSubheadline: 'Italiya ipaklari va tabiiy matolardan tikilgan cheklangan ayollar liboslari',
    heroBuyButton: 'Libosni xarid qilish',
    heroExploreButton: 'Kolleksiyani ko‘rish',
    heroGuarantee1: '100% Asl Matolar',
    heroGuarantee2: 'Bepul O‘lchab Ko‘rish',

    // Features
    feat1Title: 'Premium Matolar',
    feat1Desc: '100% tabiiy ipak, kashmer va parij tyvid matolari',
    feat2Title: 'Tezkor & Bepul Yetkazish',
    feat2Desc: 'O‘zbekiston bo‘ylab 24 soat ichida eshigingizgacha',
    feat3Title: 'O‘lcham Kafolati',
    feat3Desc: 'Razmer to‘g‘ri kelmasa 3 kun ichida bepul almashtirib beramiz',
    feat4Title: 'Cheklangan Kolleksiya',
    feat4Desc: 'Har bir libos cheklangan miqdorda takrorlanmas tikiladi',

    // Catalog & Products
    catalogSub: 'Baza_Shop Kolleksiyasi',
    catalogTitle: 'Eng Nafis Ayollar Liboslari',
    catalogCountSuffix: 'ta eksklyuziv mahsulot',
    sortDefault: 'Tavsiya etilgan',
    sortPriceAsc: 'Narx: Arzondan qimmatga',
    sortPriceDesc: 'Narx: Qimmatdan arzonga',
    categoryAll: 'Barchasi',
    noProductsFound: 'Ushbu kategoriyada liboslar topilmadi.',
    badgeTrending: '🌸 HAFTA TRENDI',
    badgeSale: 'AKSIYA',
    badgeInStock: 'Mavjud',
    badgeOutOfStock: 'Tugagan',
    quickView: 'Ko‘rish',
    quickBuy: 'Tezkor xarid',
    addToCart: 'Savatchaga qo‘shish',
    som: 'so‘m',

    // Product Detail Modal
    selectSize: 'O‘lchamni tanlang (Razmer):',
    selectColor: 'Rangi:',
    quantity: 'Miqdor:',
    addedToCartSuccess: '✓ Savatchaga qo‘shildi!',
    orderNow: 'Hozir xarid qilish',
    deliveryPromise: 'Toshkent bo‘ylab 24 soatda, viloyatlarga 2 kunda yetkaziladi',
    qualityPromise: '100% haqiqiy matolar va o‘lcham kafolati',

    // Cart Drawer
    cartTitle: 'Xarid Savatchasi',
    cartEmptyTitle: 'Savatchangiz hozircha bo‘sh',
    cartEmptyDesc: 'Kolleksiyadan o‘zingizga yoqqan nafis libosni tanlang',
    orderFormTitle: 'Yetkazib berish ma\'lumotlari',
    nameLabel: 'Ismingiz va Familiyangiz',
    namePlaceholder: 'Masalan: Malika Rahimova',
    phoneLabel: 'Telefon raqamingiz',
    addressLabel: 'Yetkazib berish manzili',
    addressPlaceholder: 'Toshkent sh., Chilonzor tumani, 9-mavze, 12-uy...',
    orderSummary: 'Buyurtma hisobi',
    totalAmount: 'Jami to‘lov:',
    freeDeliveryBadge: 'Yetkazib berish: Bepul',
    submittingOrder: 'Buyurtma yuborilmoqda...',
    completeOrder: 'Buyurtmani tasdiqlash',

    // Wishlist Drawer
    wishlistTitle: 'Sevimli Liboslar',
    wishlistCountSuffix: 'ta libos',
    wishlistEmptyTitle: 'Sevimli liboslar ro‘yxati bo‘sh',
    wishlistEmptyDesc: 'Katalogdan o‘zingizga ma’qul kelgan nafis liboslarga yurakcha belgisini bosing.',
    exploreCatalog: 'Kolleksiyani ko‘rish',
    moveToCart: 'Savatchaga qo‘shish',
    removeFromWishlist: 'Ro‘yxatdan o‘chirish',

    // Order Success Modal
    orderSuccessTitle: 'Buyurtmangiz Qabul Qilindi!',
    orderSuccessDesc: 'Tez orada menejerimiz siz bilan bog‘lanib, buyurtmangizni tasdiqlaydi.',
    orderCode: 'Buyurtma kodi:',
    closeModal: 'Vitrinaga qaytish',

    // Auth & Profile Modal
    cabinetTitle: 'Mijoz Kabineti',
    myOrders: 'Mening Buyurtmalarim',
    logout: 'Chiqish',
    statusNew: 'Yangi',
    statusDelivering: 'Yetkazilmoqda',
    statusCompleted: 'Yakunlandi',
    statusCancelled: 'Bekor qilingan',

    // Footer
    footerBrandDesc: 'Italiya ipaklari va eksklyuziv ayollar liboslari butigi.',
    footerColCollections: 'Kolleksiyalar',
    footerColServices: 'Xizmat',
    footerColContact: 'Aloqa',
    footerEveningDresses: 'Oqshom Ko‘ylaklari',
    footerTweedSuits: 'Tyvid Kostyumlari',
    footerSilkBlouses: 'Shoyi Bluzkalar',
    footerCashmereCoats: 'Kashmer Paltolar',
    footerFreeDelivery: 'Bepul yetkazish',
    footerSizeGuide: 'O‘lcham jadvali',
    footerQualityGuarantee: '100% Sifat kafolati',
    footerReturnPolicy: 'Almashtirish qoidasi',
    footerCity: 'Toshkent',
    footerCopyright: '© 2026 Baza_Shop Haute Couture. Barcha huquqlar himoyalangan.',
  },

  ru: {
    // Header & Announcement
    deliveryNotice: '🚚 Бесплатная доставка по всем регионам!',
    customerGreeting: '👋 Привет',
    login: 'Войти',
    register: 'Регистрация',
    staffLogin: 'Вход для сотрудников',
    phone: '📞 +998 (90) 123-45-67',
    boutiqueSubtitle: 'Haute Couture • Бутик',
    navHome: 'Главная',
    navCollection: 'Коллекция',
    navFeatures: 'Преимущества',
    navContact: 'Контакты',
    searchPlaceholder: 'Поиск платья или категории...',
    wishlist: 'Избранное',
    cart: 'Корзина',
    lightMode: 'Светлая тема',
    darkMode: 'Темная тема',

    // Hero Banner
    heroExclusiveBadge: '✨ ЭКСКЛЮЗИВ -25%',
    heroWeekFavorite: '🌸 ХИТ НЕДЕЛИ',
    heroTagline: 'BAZA_SHOP • НОВАЯ КОЛЛЕКЦИЯ ВЕСНА-ЛЕТО \'26',
    heroHeadline: 'Воплощение Изящества и Стиля',
    heroSubheadline: 'Лимитированные женские платья из натурального итальянского шелка и премиальных тканей',
    heroBuyButton: 'Купить наряд',
    heroExploreButton: 'Смотреть коллекцию',
    heroGuarantee1: '100% Натуральные ткани',
    heroGuarantee2: 'Бесплатная примерка',

    // Features
    feat1Title: 'Премиум Ткани',
    feat1Desc: '100% натуральный шелк, кашемир и парижский твид',
    feat2Title: 'Быстрая & Бесплатная Доставка',
    feat2Desc: 'Доставка до вашей двери по всему Узбекистану за 24 часа',
    feat3Title: 'Гарантия Размера',
    feat3Desc: 'Если размер не подошел, заменим бесплатно в течение 3 дней',
    feat4Title: 'Лимитированная Коллекция',
    feat4Desc: 'Каждое платье отшивается ограниченным тиражом без повторов',

    // Catalog & Products
    catalogSub: 'Коллекция Baza_Shop',
    catalogTitle: 'Изысканные Женские Наряды',
    catalogCountSuffix: 'эксклюзивных нарядов',
    sortDefault: 'Рекомендуемые',
    sortPriceAsc: 'Цена: по возрастанию',
    sortPriceDesc: 'Цена: по убыванию',
    categoryAll: 'Все платья',
    noProductsFound: 'В этой категории нарядов пока нет.',
    badgeTrending: '🌸 ТРЕНД НЕДЕЛИ',
    badgeSale: 'АКЦИЯ',
    badgeInStock: 'В наличии',
    badgeOutOfStock: 'Распродано',
    quickView: 'Просмотр',
    quickBuy: 'Быстрая покупка',
    addToCart: 'В корзину',
    som: 'сум',

    // Product Detail Modal
    selectSize: 'Выберите размер:',
    selectColor: 'Цвет:',
    quantity: 'Количество:',
    addedToCartSuccess: '✓ Добавлено в корзину!',
    orderNow: 'Купить сейчас',
    deliveryPromise: 'Доставка по Ташкенту за 24 часа, в регионы за 2 дня',
    qualityPromise: '100% гарантия качества и бесплатный возврат размера',

    // Cart Drawer
    cartTitle: 'Корзина Покупок',
    cartEmptyTitle: 'Ваша корзина пуста',
    cartEmptyDesc: 'Выберите изысканный наряд из нашей коллекции',
    orderFormTitle: 'Данные для доставки',
    nameLabel: 'Ваше Имя и Фамилия',
    namePlaceholder: 'Например: Малика Рахимова',
    phoneLabel: 'Номер телефона',
    addressLabel: 'Адрес доставки',
    addressPlaceholder: 'г. Ташкент, Чиланзарский район, кв-л 9, дом 12...',
    orderSummary: 'Итог заказа',
    totalAmount: 'Итого к оплате:',
    freeDeliveryBadge: 'Доставка: Бесплатно',
    submittingOrder: 'Оформление заказа...',
    completeOrder: 'Подтвердить заказ',

    // Wishlist Drawer
    wishlistTitle: 'Избранные Наряды',
    wishlistCountSuffix: 'нарядов',
    wishlistEmptyTitle: 'Список избранного пока пуст',
    wishlistEmptyDesc: 'Нажмите на сердечко у понравившихся нарядов в каталоге, чтобы сохранить их здесь.',
    exploreCatalog: 'Смотреть коллекцию',
    moveToCart: 'В корзину',
    removeFromWishlist: 'Удалить из избранного',

    // Order Success Modal
    orderSuccessTitle: 'Ваш Заказ Принят!',
    orderSuccessDesc: 'Наш менеджер свяжется с вами в ближайшее время для подтверждения заказа.',
    orderCode: 'Номер заказа:',
    closeModal: 'Вернуться в бутик',

    // Auth & Profile Modal
    cabinetTitle: 'Личный Кабинет',
    myOrders: 'Мои Заказы',
    logout: 'Выйти',
    statusNew: 'Новый',
    statusDelivering: 'В пути',
    statusCompleted: 'Завершен',
    statusCancelled: 'Отменен',

    // Footer
    footerBrandDesc: 'Бутик эксклюзивных женских платьев из итальянского шелка.',
    footerColCollections: 'Коллекции',
    footerColServices: 'Сервис',
    footerColContact: 'Контакты',
    footerEveningDresses: 'Вечерние платья',
    footerTweedSuits: 'Твидовые костюмы',
    footerSilkBlouses: 'Шелковые блузы',
    footerCashmereCoats: 'Пальто из кашемира',
    footerFreeDelivery: 'Бесплатная доставка',
    footerSizeGuide: 'Таблица размеров',
    footerQualityGuarantee: '100% Гарантия качества',
    footerReturnPolicy: 'Правила обмена',
    footerCity: 'г. Ташкент',
    footerCopyright: '© 2026 Baza_Shop Haute Couture. Все права защищены.',
  },
};

// ============================================================================
// CATEGORY & COLOR MAPPINGS (UZ <-> RU)
// ============================================================================

export const CATEGORY_TRANSLATIONS = {
  'Barchasi': { uz: 'Barchasi', ru: 'Все' },
  'Ko‘ylaklar': { uz: 'Ko‘ylaklar', ru: 'Платья' },
  'Kostyumlar': { uz: 'Kostyumlar', ru: 'Костюмы' },
  'Bluzkalar': { uz: 'Bluzkalar', ru: 'Блузки' },
  'Ustki Kiyim': { uz: 'Ustki Kiyim', ru: 'Верхняя одежда' },
  'Shimlar': { uz: 'Shimlar', ru: 'Брюки' },
  'Oqshom liboslari': { uz: 'Oqshom liboslari', ru: 'Вечерние платья' },
  'Parij tyvid': { uz: 'Parij tyvid', ru: 'Парижский твид' },
  'Kashmer kolleksiya': { uz: 'Kashmer kolleksiya', ru: 'Кашемир' },
  'Ipak to‘plami': { uz: 'Ipak to‘plami', ru: 'Шелковая коллекция' },
  // Reverse lookups
  'Все': { uz: 'Barchasi', ru: 'Все' },
  'Платья': { uz: 'Ko‘ylaklar', ru: 'Платья' },
  'Костюмы': { uz: 'Kostyumlar', ru: 'Костюмы' },
  'Блузки': { uz: 'Bluzkalar', ru: 'Блузки' },
  'Верхняя одежда': { uz: 'Ustki Kiyim', ru: 'Верхняя одежда' },
  'Брюки': { uz: 'Shimlar', ru: 'Брюки' },
  'Вечерние платья': { uz: 'Oqshom liboslari', ru: 'Вечерние платья' },
  'Парижский твид': { uz: 'Parij tyvid', ru: 'Парижский твид' },
  'Кашемир': { uz: 'Kashmer kolleksiya', ru: 'Кашемир' },
  'Шелковая коллекция': { uz: 'Ipak to‘plami', ru: 'Шелковая коллекция' },
};

export const COLOR_TRANSLATIONS = {
  'Klassik Qora': { uz: 'Klassik Qora', ru: 'Классический черный' },
  'Qaymoqrang / Oq': { uz: 'Qaymoqrang / Oq', ru: 'Кремовый / Белый' },
  'Krem / Oqish': { uz: 'Krem / Oqish', ru: 'Кремовый / Белый' },
  'To‘q ko‘k': { uz: 'To‘q ko‘k', ru: 'Темно-синий' },
  'Pushti': { uz: 'Pushti', ru: 'Розовый' },
  'Sariq': { uz: 'Sariq', ru: 'Желтый' },
  'Yashil': { uz: 'Yashil', ru: 'Зеленый' },
  'Kulrang': { uz: 'Kulrang', ru: 'Серый' },
  'Bardoviy': { uz: 'Bardoviy', ru: 'Бордовый' },
  'Pudra Pushti': { uz: 'Pudra Pushti', ru: 'Пудрово-розовый' },
  'Zumrad Yashil': { uz: 'Zumrad Yashil', ru: 'Изумрудно-зеленый' },
  'Bordo Vino': { uz: 'Bordo Vino', ru: 'Винно-бордовый' },
  'Zangori Moviy': { uz: 'Zangori Moviy', ru: 'Небесно-голубой' },
  'Shokolad': { uz: 'Shokolad', ru: 'Шоколадный' },
  'Krem Bej': { uz: 'Krem Bej', ru: 'Кремово-бежевый' },
  'Parij Qizili': { uz: 'Parij Qizili', ru: 'Парижский красный' },
  'Pushti Atirgul': { uz: 'Pushti Atirgul', ru: 'Розовая роза' },
  'Dengiz Moviy': { uz: 'Dengiz Moviy', ru: 'Морской синий' },
  'Qora': { uz: 'Qora', ru: 'Черный' },
  'Oq': { uz: 'Oq', ru: 'Белый' },
  'Qizil': { uz: 'Qizil', ru: 'Красный' },
  'Moviy': { uz: 'Moviy', ru: 'Синий' },
  'Binafsha': { uz: 'Binafsha', ru: 'Фиолетовый' },
  'Jigarrang': { uz: 'Jigarrang', ru: 'Коричневый' },
};

// ============================================================================
// HELPER FUNCTIONS & NORMALIZATION
// ============================================================================

export function normalizeText(str = '') {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[‘’`ʼʻ'"]/g, "'")
    .trim()
    .toLowerCase();
}

export const PRODUCT_FALLBACK_TRANSLATIONS = {
  'prod-1': {
    name_uz: 'Klassik Ipak Oqshom Ko‘ylagi (Silk Slip Dress)',
    name_ru: 'Классическое Шелковое Вечернее Платье',
    description_uz: '100% tabiiy ipakdan tikilgan, nafis va oqshom tantanalari uchun mos libos.',
    description_ru: 'Платье из 100% натурального шелка, элегантное и идеально подходящее для торжественных вечеров.',
  },
  'prod-2': {
    name_uz: 'Fransuz Tyvid Kostyum & Yubka To‘plami',
    name_ru: 'Французский Твидовый Костюм с Юбкой',
    description_uz: 'Parij uslubidagi premium tyvid matoli qulay va zamonaviy ikki qismli kostyum.',
    description_ru: 'Двусоставный костюм в парижском стиле из премиального твида — стильный и удобный.',
  },
  'prod-3': {
    name_uz: 'Bahorgi Nafis Shifon Gullik Ko‘ylak',
    name_ru: 'Весеннее Изящное Шифоновое Платье с Цветами',
    description_uz: 'Yengil shifon, mayin gulli print va nozik belbog‘li ko‘rkam libos.',
    description_ru: 'Легкий шифон, нежный цветочный принт и изящный поясок для безупречного образа.',
  },
  'prod-4': {
    name_uz: 'Oq Shoyi Bluzka & Nafis Yoqa',
    name_ru: 'Белая Шелковая Блузка с Изящным Воротником',
    description_uz: 'Ofis va uchrashuvlar uchun eng mukammal nafis klassik shoyi bluzka.',
    description_ru: 'Идеальная классическая шелковая блузка для офиса и деловых встреч.',
  },
  'prod-5': {
    name_uz: 'Kashmer Qish-Bahor Palto (Cashmere Coat)',
    name_ru: 'Кашемировое Пальто Демисезон (Cashmere Coat)',
    description_uz: 'Yumshoq kashmer junidan tayyorlangan premium ayollar paltosi.',
    description_ru: 'Премиальное женское пальто из мягкой натуральной кашемировой шерсти.',
  },
  'prod-6': {
    name_uz: 'Klassik Palatso Shim',
    name_ru: 'Классические Брюки Палаццо',
    description_uz: 'Yuqori bel, keng bichimli nafis va qulay ayollar shimi.',
    description_ru: 'Элегантные женские брюки с высокой посадкой и свободным кроем палаццо.',
  },
};

export const PRODUCT_NAME_FALLBACKS = {
  'klassik ipak oqshom': 'Классическое Шелковое Вечернее Платье',
  'silk slip dress': 'Классическое Шелковое Вечернее Платье',
  'fransuz tyvid kostyum': 'Французский Твидовый Костюм с Юбкой',
  'bahorgi nafis shifon': 'Весеннее Изящное Шифоновое Платье с Цветами',
  'oq shoyi bluzka': 'Белая Шелковая Блузка с Изящным Воротником',
  'kashmer qish-bahor palto': 'Кашемировое Пальто Демисезон',
  'cashmere coat': 'Кашемировое Пальто Демисезон',
  'klassik palatso shim': 'Классические Брюки Палаццо',
};

export function t(key, lang = 'uz') {
  const currentLang = lang === 'ru' ? 'ru' : 'uz';
  return DICTIONARY[currentLang]?.[key] || DICTIONARY.uz[key] || key;
}

export function translateCategory(catName, lang = 'uz') {
  if (!catName) return '';
  if (CATEGORY_TRANSLATIONS[catName]) {
    return CATEGORY_TRANSLATIONS[catName][lang] || catName;
  }
  const normalized = normalizeText(catName);
  for (const [key, value] of Object.entries(CATEGORY_TRANSLATIONS)) {
    if (normalizeText(key) === normalized) {
      return value[lang] || catName;
    }
  }
  return catName;
}

export function translateColor(colorName, lang = 'uz') {
  if (!colorName) return '';
  if (COLOR_TRANSLATIONS[colorName]) {
    return COLOR_TRANSLATIONS[colorName][lang] || colorName;
  }
  const normalized = normalizeText(colorName);
  for (const [key, value] of Object.entries(COLOR_TRANSLATIONS)) {
    if (normalizeText(key) === normalized) {
      return value[lang] || colorName;
    }
  }
  return colorName;
}

/**
 * Returns localized product name based on current language
 */
export function getLocalizedProductName(product, lang = 'uz') {
  if (!product) return '';
  if (lang === 'ru') {
    if (product.name_ru && product.name_ru.trim()) return product.name_ru;
    if (product.nameRu && product.nameRu.trim()) return product.nameRu;

    // Check by product ID in fallback table
    if (product.id && PRODUCT_FALLBACK_TRANSLATIONS[product.id]?.name_ru) {
      return PRODUCT_FALLBACK_TRANSLATIONS[product.id].name_ru;
    }

    // Check by normalized name
    const rawName = normalizeText(product.name || product.name_uz || '');
    for (const [key, ruVal] of Object.entries(PRODUCT_NAME_FALLBACKS)) {
      if (rawName.includes(normalizeText(key))) {
        return ruVal;
      }
    }

    return product.name || product.name_uz || '';
  }

  return product.name_uz || product.nameUz || product.name || '';
}

/**
 * Returns localized product description based on current language
 */
export function getLocalizedProductDescription(product, lang = 'uz') {
  if (!product) return '';
  if (lang === 'ru') {
    if (product.description_ru && product.description_ru.trim()) return product.description_ru;
    if (product.descriptionRu && product.descriptionRu.trim()) return product.descriptionRu;

    // Check by product ID in fallback table
    if (product.id && PRODUCT_FALLBACK_TRANSLATIONS[product.id]?.description_ru) {
      return PRODUCT_FALLBACK_TRANSLATIONS[product.id].description_ru;
    }

    return product.description || product.description_uz || '';
  }

  return product.description_uz || product.descriptionUz || product.description || '';
}

// ============================================================================
// FREE BI-DIRECTIONAL AUTO-TRANSLATION MODULE (Google Translate Endpoint)
// ============================================================================

/**
 * Detects whether the input text is primarily Russian (Cyrillic) or Uzbek (Latin)
 */
export function detectLanguage(text = '') {
  if (!text || typeof text !== 'string') return 'uz';
  // Check for Cyrillic letters (Russian)
  const cyrillicMatch = text.match(/[\u0400-\u04FF]/g);
  if (cyrillicMatch && cyrillicMatch.length >= 2) {
    return 'ru';
  }
  return 'uz';
}

/**
 * Free auto-translator using Google Translate public endpoint
 * @param {string} text - The input text to translate
 * @param {string} sourceLang - 'uz' or 'ru' (or 'auto')
 * @param {string} targetLang - 'ru' or 'uz'
 * @returns {Promise<string>} Translated text
 */
export async function autoTranslateText(text, sourceLang = 'auto', targetLang = 'ru') {
  if (!text || !text.trim()) return '';

  try {
    const sl = sourceLang === 'auto' ? 'auto' : (sourceLang === 'ru' ? 'ru' : 'uz');
    const tl = targetLang === 'uz' ? 'uz' : 'ru';

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text.trim())}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Translation HTTP error: ${response.status}`);
    }

    const data = await response.json();
    if (data && Array.isArray(data[0])) {
      const translated = data[0].map(item => item[0]).join('');
      return translated || text;
    }
    return text;
  } catch (error) {
    console.warn('Auto-translate notice (fallback applied):', error);
    return text;
  }
}
