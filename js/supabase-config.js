// Конфигурация Supabase
// Используем переменные окружения или значения по умолчанию
const SUPABASE_URL = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_SUPABASE_URL) 
    ? process.env.NEXT_PUBLIC_SUPABASE_URL 
    : 'https://aeewpulwnamwavtejlzq.supabase.co';
    
const SUPABASE_ANON_KEY = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlZXdwdWx3bmFtd2F2dGVqbHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNjIxMDcsImV4cCI6MjA3NzczODEwN30.f1eYj60USjd9qtY-USo81LO2BrO-Zl5P4Xs2zboJvzs';
    
const STORAGE_BUCKET = 'news-images';

// Инициализация Supabase клиента
// Библиотека @supabase/supabase-js через CDN (jsdelivr) экспортирует через window.supabase
// Используем проверку готовности и правильное имя объекта
let supabase;

function initializeSupabase() {
    // Через CDN jsdelivr библиотека доступна через window.supabase или supabaseLib
    // В версии 2 это может быть supabaseLib.createClient
    
    // Проверяем различные варианты экспорта
    if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
        // Вариант 1: напрямую через window.supabase
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase инициализирован через window.supabase');
    } else if (typeof supabaseLib !== 'undefined' && typeof supabaseLib.createClient === 'function') {
        // Вариант 2: через supabaseLib (UMD экспорт)
        supabase = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase инициализирован через supabaseLib');
    } else {
        // Пробуем через некоторое время (библиотека может загружаться асинхронно)
        let attempts = 0;
        const maxAttempts = 20; // 1 секунда максимум
        
        const checkLib = setInterval(function() {
            attempts++;
            
            if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
                supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('Supabase инициализирован через window.supabase (с задержкой)');
                clearInterval(checkLib);
            } else if (typeof supabaseLib !== 'undefined' && typeof supabaseLib.createClient === 'function') {
                supabase = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('Supabase инициализирован через supabaseLib (с задержкой)');
                clearInterval(checkLib);
            } else if (attempts >= maxAttempts) {
                console.error('Не удалось загрузить Supabase библиотеку. Убедитесь, что скрипт подключен правильно.');
                clearInterval(checkLib);
            }
        }, 50);
    }
}

// Инициализируем сразу (скрипт загружается с defer)
initializeSupabase();

