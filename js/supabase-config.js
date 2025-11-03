// Конфигурация Supabase
const SUPABASE_URL = 'https://aeewpulwnamwavtejlzq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlZXdwdWx3bmFtd2F2dGVqbHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNjIxMDcsImV4cCI6MjA3NzczODEwN30.f1eYj60USjd9qtY-USo81LO2BrO-Zl5P4Xs2zboJvzs';
const STORAGE_BUCKET = 'news-images';

// Инициализация Supabase клиента
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

