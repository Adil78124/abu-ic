-- ============================================
-- Настройка Row Level Security (RLS) для Supabase
-- Выполните эти команды в SQL Editor вашего проекта Supabase
-- ============================================

-- 1. Включаем Row Level Security для таблицы news
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- 2. Политика для ЧТЕНИЯ (SELECT) - разрешает всем читать новости
CREATE POLICY "Разрешить чтение новостей всем"
ON public.news
FOR SELECT
USING (true);

-- 3. Политика для ВСТАВКИ (INSERT) - разрешает анонимным пользователям добавлять новости
CREATE POLICY "Разрешить добавление новостей анонимным пользователям"
ON public.news
FOR INSERT
TO anon
WITH CHECK (true);

-- 4. Политика для ОБНОВЛЕНИЯ (UPDATE) - разрешает анонимным пользователям обновлять новости
CREATE POLICY "Разрешить обновление новостей анонимным пользователям"
ON public.news
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- 5. Политика для УДАЛЕНИЯ (DELETE) - разрешает анонимным пользователям удалять новости
CREATE POLICY "Разрешить удаление новостей анонимным пользователям"
ON public.news
FOR DELETE
TO anon
USING (true);

-- ============================================
-- Настройка Storage для bucket news-images
-- ============================================

-- Создаём политику для ЗАГРУЗКИ файлов в bucket news-images
CREATE POLICY "Разрешить загрузку файлов в news-images"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'news-images' AND auth.role() = 'anon');

-- Создаём политику для ЧТЕНИЯ файлов из bucket news-images (публичный доступ)
CREATE POLICY "Разрешить публичное чтение файлов из news-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'news-images');

-- Создаём политику для УДАЛЕНИЯ файлов из bucket news-images
CREATE POLICY "Разрешить удаление файлов из news-images"
ON storage.objects
FOR DELETE
TO anon
USING (bucket_id = 'news-images' AND auth.role() = 'anon');

-- ============================================
-- ПРИМЕЧАНИЯ:
-- ============================================
-- 1. Эти политики дают полный доступ через anon key
-- 2. Для продакшена рекомендуется ограничить доступ:
--    - Только определенным пользователям
--    - Добавить проверки прав доступа
--    - Использовать service_role key для админки
--
-- 3. Если политики уже существуют, вы получите ошибку
--    Удалите старые политики командой:
--    DROP POLICY "название_политики" ON public.news;
-- ============================================

