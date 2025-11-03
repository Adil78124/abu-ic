// Скрипт для миграции новостей из localStorage в Supabase
// Запустите этот скрипт один раз в консоли браузера на странице админки
// или добавьте его временно в admin.html

async function migrateNewsToSupabase() {
    try {
        // Проверяем, что Supabase инициализирован
        if (typeof supabase === 'undefined') {
            console.error('Supabase не инициализирован!');
            return;
        }

        // Загружаем новости из localStorage
        const storedNews = localStorage.getItem('abu_news');
        if (!storedNews) {
            console.log('Новостей в localStorage не найдено');
            return;
        }

        const localNews = JSON.parse(storedNews);
        console.log(`Найдено ${localNews.length} новостей в localStorage`);

        if (localNews.length === 0) {
            console.log('Нет новостей для миграции');
            return;
        }

        // Проверяем, какие новости уже есть в Supabase
        const { data: existingNews } = await supabase
            .from('news')
            .select('id, title, created_at');

        const existingTitles = new Set(existingNews?.map(n => n.title) || []);

        let migrated = 0;
        let skipped = 0;
        let errors = 0;

        // Мигрируем каждую новость
        for (const news of localNews) {
            // Пропускаем, если уже существует
            if (existingTitles.has(news.title)) {
                console.log(`Пропущена: "${news.title}" (уже существует)`);
                skipped++;
                continue;
            }

            try {
                // Формируем данные для Supabase
                const newsData = {
                    title: news.title,
                    image_url: news.imageUrl || news.image || null,
                    author: 'Admin'
                };

                // Сохраняем многоязычные данные в JSON
                const multilangData = {
                    main: news.content || '',
                    description: news.description || '',
                    title_ru: news.title_ru || news.title,
                    title_en: news.title_en || news.title,
                    title_kz: news.title_kz || news.title,
                    description_ru: news.description_ru || news.description || '',
                    description_en: news.description_en || news.description || '',
                    description_kz: news.description_kz || news.description || '',
                    date: news.date || news.createdAt || new Date().toISOString()
                };

                newsData.content = JSON.stringify(multilangData);

                // Если есть изображение в base64, нужно его загрузить в Storage
                // Пока сохраняем только URL
                if (news.image && news.image.startsWith('data:')) {
                    console.warn(`Изображение в base64 для "${news.title}" нужно загрузить вручную`);
                }

                // Вставляем новость
                const { data, error } = await supabase
                    .from('news')
                    .insert([newsData])
                    .select()
                    .single();

                if (error) {
                    throw error;
                }

                console.log(`✓ Мигрирована: "${news.title}"`);
                migrated++;

            } catch (error) {
                console.error(`✗ Ошибка при миграции "${news.title}":`, error);
                errors++;
            }
        }

        console.log('\n=== Результаты миграции ===');
        console.log(`Успешно мигрировано: ${migrated}`);
        console.log(`Пропущено (уже существуют): ${skipped}`);
        console.log(`Ошибок: ${errors}`);
        console.log(`Всего обработано: ${localNews.length}`);

        if (migrated > 0) {
            alert(`Миграция завершена!\nУспешно: ${migrated}\nПропущено: ${skipped}\nОшибок: ${errors}`);
        }

    } catch (error) {
        console.error('Критическая ошибка миграции:', error);
        alert('Ошибка миграции: ' + error.message);
    }
}

// Экспортируем для использования
if (typeof window !== 'undefined') {
    window.migrateNewsToSupabase = migrateNewsToSupabase;
}

