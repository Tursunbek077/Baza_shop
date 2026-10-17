# Stark Shop Admin — Kiyim Do'koni Boshqaruv Tizimi

Ushbu loyiha **React 19 + Tailwind CSS** asosida, yuqori konversiyali e-commerce boshqaruv arxitekturasi bilan ishlab chiqilgan.

## 🚀 Qanday ishga tushiriladi?
1. Papkadagi **`start.bat`** faylini sichqoncha bilan 2 marta bosing.
2. Tizim avtomatik brauzeringizda ochiladi (`http://localhost:5173`).

Yoki terminal orqali:
```bash
npm run dev
```

---

## 📁 Arxitektura va Papkalar Strukturasi
```text
shop-admin/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # Tizim bosh qismi, preview va tezkor tugmalar
│   │   ├── StatCards.jsx           # Jami tovarlar, ombor va trend ko'rsatkichlari
│   │   ├── BannerManager.jsx       # Bosh sahifa bannerini va trend kiyimni boshqarish
│   │   ├── ProductForm.jsx         # Yangi tovar qo'shish modali (razmerlar, narx, rasm)
│   │   ├── ProductTable.jsx        # Narxlarni tezkor tahrirlash va ombor jadvali
│   │   └── CustomerStorePreview.jsx # Xaridor ko'radigan jonli vitrina (1-click checkout)
│   ├── data/
│   │   └── initialData.js          # Dastlabki tovarlar va banner sozlamalari
│   ├── utils/
│   │   └── storage.js              # Brauzer xotirasida (localStorage) ma'lumotlarni saqlash
│   ├── App.jsx                     # Markaziy boshqaruvchi
│   ├── index.css                   # Tailwind CSS stillari
│   └── main.jsx                    # React kirish nuqtasi
├── start.bat                       # 1 bosishda ishga tushirish skripti
└── package.json
```

---

## ⚡ Asosiy Imkoniyatlar
1. **Banner & Trend Kiyimni 1 bosishda almashtirish**: Ro'yxatdagi istalgan kiyim yonidagi `⭐ Bannerga qo'yish` tugmasini bosishingiz bilan bosh sahifadagi katta banner o'sha kiyimning rasmi va narxi bilan yangilanadi.
2. **Narxni joyida tahrirlash (Inline Edit)**: Jadvaldagi narx ustiga bosib yangi raqamni kiritasiz va Enter bosasiz.
3. **Jonli Vitrina (Customer Preview)**: "Vitrani Ko'rish" tugmasini bosib xaridorlar saytni qanday ko'rishini va savatga solib buyurtma berish jarayonini sinab ko'rishingiz mumkin.
4. **Xavfsiz va Mahalliy**: Ma'lumotlar brauzeringizning shaxsiy xotirasida saqlanadi, tashqariga sizib chiqmaydi.
