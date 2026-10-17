-- =========================================================================
-- BAZA_SHOP: SUPABASE XAVFSIZLIKNI QATTIQ HIMOYA QILISH (SECURITY HARDENING)
-- Ushbu SQL buyruqlarini Supabase Dashboard -> SQL Editor bo'limiga qo'yib
-- "Run" tugmasini bir marta bosish kifoya (100% BEPUL).
-- =========================================================================

-- 1. BARCHA JADVALLARDA RLS (ROW LEVEL SECURITY) QATTIQ FAOL QILINADI
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banner ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 2. ESKI OCHIQ POLISLARNI O'CHIRISH (AGAR BOR BO'LSA)
DROP POLICY IF EXISTS "Allow public read orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public update orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public delete orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public insert products" ON public.products;
DROP POLICY IF EXISTS "Allow public update products" ON public.products;
DROP POLICY IF EXISTS "Allow public delete products" ON public.products;
DROP POLICY IF EXISTS "Allow public insert banner" ON public.banner;
DROP POLICY IF EXISTS "Allow public update banner" ON public.banner;

-- 3. TOVARLARNI HIMOYA QILISH (PRODUCTS)
-- Oddiy tashrif buyuruvchilar faqat tovarlarni KO'RISHI mumkin.
-- Narxlarni o'zgartirish, o'chirish yoki yangi tovar tiqish begonalarga QAT'IYAN TAQIQLANADI!
DROP POLICY IF EXISTS "Public read products only" ON public.products;
CREATE POLICY "Public read products only" 
ON public.products FOR SELECT 
USING (true);

-- 4. BANNERNI HIMOYA QILISH (BANNER)
-- Tashrif buyuruvchilar faqat asosiy banner ma'lumotlarini o'qiy oladi.
DROP POLICY IF EXISTS "Public read banner only" ON public.banner;
CREATE POLICY "Public read banner only" 
ON public.banner FOR SELECT 
USING (true);

-- 5. BUYURTMARNI HIMOYA QILISH (ORDERS - MIJOZLAR MAXFIYLIGI)
-- Xaridorlar faqat yangi buyurtma YUBORA OLADI (INSERT).
-- Begona odamlar bazadagi boshqa mijozlarning telefon raqami, ismi va
-- manzillarini KO'RA OLMAYDI (SELECT taqiqlangan)!
DROP POLICY IF EXISTS "Public insert orders only" ON public.orders;
CREATE POLICY "Public insert orders only" 
ON public.orders FOR INSERT 
WITH CHECK (true);

-- 6. STATUS USTUNINI TEKSHIRISH VA QO'SHISH
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'yangi';

-- =========================================================================
-- NATIJA:
-- Endi tashqi xakerlar Anon Key orqali:
-- 1. Tovar narxlarini soxtalashtira olmaydi (Update/Delete yo'q).
-- 2. Boshqa mijozlarning shaxsiy raqam va manzillarini o'g'irlay olmaydi.
-- 3. Sayt faqat tovar ko'rsatish va buyurtma qabul qilish rejimida ishlaydi.
-- =========================================================================
