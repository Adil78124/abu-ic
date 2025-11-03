# Настройка проекта для Vercel

## Переменные окружения для Vercel

После деплоя на Vercel нужно добавить переменные окружения в настройках проекта:

1. Перейдите в **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

2. Добавьте следующие переменные:

```
NEXT_PUBLIC_SUPABASE_URL=https://aeewpulwnamwavtejlzq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlZXdwdWx3bmFtd2F2dGVqbHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNjIxMDcsImV4cCI6MjA3NzczODEwN30.f1eYj60USjd9qtY-USo81LO2BrO-Zl5P4Xs2zboJvzs
```

3. После добавления переменных **пересоберите проект** (Redeploy)

## Project ID Vercel

- **Project ID**: `prj_3PXODZYgBPRucWSIPu2D1H5Vt7WN`

## Структура проекта

Проект использует статические HTML файлы, поэтому для Vercel нужен правильный конфигурационный файл.

## После деплоя

1. Проверьте работу админки: `https://your-domain.vercel.app/admin.html`
2. Проверьте загрузку новостей: `https://your-domain.vercel.app/erasmus+circulen.html`
3. Нажмите кнопку "Мигрировать старые новости" в админке (если нужно)

