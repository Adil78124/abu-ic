// Админ-панель новостей - JavaScript функционал

class NewsAdmin {
    constructor() {
        this.news = this.loadNewsFromStorage();
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupImageUpload();
        this.setupLanguageTabs();
        this.setCurrentDate();
        this.renderNewsList();
    }

    setupEventListeners() {
        // Форма добавления новости
        const newsForm = document.getElementById('newsForm');
        newsForm.addEventListener('submit', (e) => this.handleSubmit(e));

        // Кнопка предварительного просмотра
        const previewBtn = document.getElementById('previewBtn');
        previewBtn.addEventListener('click', () => this.showPreview());

        // Кнопка обновления списка
        const refreshBtn = document.getElementById('refreshBtn');
        refreshBtn.addEventListener('click', () => this.renderNewsList());

        // Модальные окна
        this.setupModalListeners();

        // URL изображения
        const imageUrlInput = document.getElementById('newsImageUrl');
        imageUrlInput.addEventListener('input', (e) => this.handleImageUrlChange(e));
    }

    setupImageUpload() {
        const imageInput = document.getElementById('newsImage');
        const imagePreview = document.getElementById('imagePreview');

        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.previewImage(file, imagePreview);
            }
        });

        // Drag and drop для изображений
        imagePreview.addEventListener('dragover', (e) => {
            e.preventDefault();
            imagePreview.style.borderColor = '#2a5298';
            imagePreview.style.background = '#f0f4ff';
        });

        imagePreview.addEventListener('dragleave', (e) => {
            e.preventDefault();
            imagePreview.style.borderColor = '#dee2e6';
            imagePreview.style.background = '#f8f9fa';
        });

        imagePreview.addEventListener('drop', (e) => {
            e.preventDefault();
            imagePreview.style.borderColor = '#dee2e6';
            imagePreview.style.background = '#f8f9fa';

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.type.startsWith('image/')) {
                    imageInput.files = files;
                    this.previewImage(file, imagePreview);
                }
            }
        });
    }

    previewImage(file, previewElement) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewElement.innerHTML = `
                <img src="${e.target.result}" alt="Предварительный просмотр">
                <span>${file.name}</span>
            `;
            previewElement.classList.add('has-image');
        };
        reader.readAsDataURL(file);
    }

    handleImageUrlChange(e) {
        const url = e.target.value;
        const imagePreview = document.getElementById('imagePreview');
        
        if (url) {
            // Проверяем, что это валидный URL изображения
            const img = new Image();
            img.onload = () => {
                imagePreview.innerHTML = `
                    <img src="${url}" alt="Предварительный просмотр">
                    <span>Изображение по URL</span>
                `;
                imagePreview.classList.add('has-image');
            };
            img.onerror = () => {
                imagePreview.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Не удалось загрузить изображение</span>
                `;
                imagePreview.classList.remove('has-image');
            };
            img.src = url;
        } else {
            imagePreview.innerHTML = `
                <i class="fas fa-image"></i>
                <span>Выберите изображение</span>
            `;
            imagePreview.classList.remove('has-image');
        }
    }

    setupLanguageTabs() {
        const tabs = document.querySelectorAll('.lang-tab');
        const panels = document.querySelectorAll('.lang-panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const lang = tab.dataset.lang;
                
                // Убираем активный класс со всех табов и панелей
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                
                // Добавляем активный класс к выбранному табу и панели
                tab.classList.add('active');
                document.querySelector(`.lang-panel[data-lang="${lang}"]`).classList.add('active');
            });
        });
    }

    setupModalListeners() {
        // Предварительный просмотр
        const previewModal = document.getElementById('previewModal');
        const closePreview = document.getElementById('closePreview');
        
        closePreview.addEventListener('click', () => {
            previewModal.style.display = 'none';
        });

        // Редактирование
        const editModal = document.getElementById('editModal');
        const closeEdit = document.getElementById('closeEdit');
        
        closeEdit.addEventListener('click', () => {
            editModal.style.display = 'none';
        });

        // Закрытие по клику вне модального окна
        window.addEventListener('click', (e) => {
            if (e.target === previewModal) {
                previewModal.style.display = 'none';
            }
            if (e.target === editModal) {
                editModal.style.display = 'none';
            }
        });
    }

    setCurrentDate() {
        const dateInput = document.getElementById('newsDate');
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const newsData = this.collectFormData(formData);
        
        if (this.validateNewsData(newsData)) {
            if (this.currentEditId) {
                this.updateNews(this.currentEditId, newsData);
            } else {
                this.addNews(newsData);
            }
            
            this.resetForm();
            this.renderNewsList();
            this.showNotification('Новость успешно сохранена!', 'success');
        }
    }

    collectFormData(formData) {
        const imageFile = formData.get('image');
        const imageUrl = formData.get('imageUrl');
        
        return {
            id: this.currentEditId || this.generateId(),
            title: formData.get('title'),
            date: formData.get('date'),
            description: formData.get('description'),
            content: formData.get('content'),
            image: imageFile && imageFile.size > 0 ? this.fileToBase64(imageFile) : null,
            imageUrl: imageUrl || null,
            // Многоязычные версии
            title_ru: formData.get('title_ru') || formData.get('title'),
            title_en: formData.get('title_en') || formData.get('title'),
            title_kz: formData.get('title_kz') || formData.get('title'),
            description_ru: formData.get('description_ru') || formData.get('description'),
            description_en: formData.get('description_en') || formData.get('description'),
            description_kz: formData.get('description_kz') || formData.get('description'),
            createdAt: this.currentEditId ? this.news.find(n => n.id === this.currentEditId)?.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    fileToBase64(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
        });
    }

    async addNews(newsData) {
        if (newsData.image) {
            newsData.image = await newsData.image;
        }
        
        this.news.unshift(newsData);
        this.saveNewsToStorage();
    }

    async updateNews(id, newsData) {
        const index = this.news.findIndex(n => n.id === id);
        if (index !== -1) {
            if (newsData.image) {
                newsData.image = await newsData.image;
            }
            this.news[index] = { ...this.news[index], ...newsData };
            this.saveNewsToStorage();
        }
    }

    deleteNews(id) {
        if (confirm('Вы уверены, что хотите удалить эту новость?')) {
            this.news = this.news.filter(n => n.id !== id);
            this.saveNewsToStorage();
            this.renderNewsList();
            this.showNotification('Новость удалена!', 'success');
        }
    }

    editNews(id) {
        const news = this.news.find(n => n.id === id);
        if (news) {
            this.currentEditId = id;
            this.populateEditForm(news);
            document.getElementById('editModal').style.display = 'block';
        }
    }

    populateEditForm(news) {
        const editForm = document.getElementById('editForm');
        
        // Заполняем основную форму
        editForm.querySelector('[name="title"]').value = news.title || '';
        editForm.querySelector('[name="date"]').value = news.date || '';
        editForm.querySelector('[name="description"]').value = news.description || '';
        editForm.querySelector('[name="content"]').value = news.content || '';
        editForm.querySelector('[name="imageUrl"]').value = news.imageUrl || '';
        
        // Заполняем многоязычные поля
        editForm.querySelector('[name="title_ru"]').value = news.title_ru || '';
        editForm.querySelector('[name="title_en"]').value = news.title_en || '';
        editForm.querySelector('[name="title_kz"]').value = news.title_kz || '';
        editForm.querySelector('[name="description_ru"]').value = news.description_ru || '';
        editForm.querySelector('[name="description_en"]').value = news.description_en || '';
        editForm.querySelector('[name="description_kz"]').value = news.description_kz || '';
        
        // Показываем изображение если есть
        if (news.image || news.imageUrl) {
            const imagePreview = editForm.querySelector('.image-preview');
            const imageSrc = news.image || news.imageUrl;
            imagePreview.innerHTML = `
                <img src="${imageSrc}" alt="Текущее изображение">
                <span>Текущее изображение</span>
            `;
            imagePreview.classList.add('has-image');
        }
    }

    showPreview() {
        const formData = new FormData(document.getElementById('newsForm'));
        const newsData = this.collectFormData(formData);
        
        if (this.validateNewsData(newsData)) {
            this.renderPreview(newsData);
            document.getElementById('previewModal').style.display = 'block';
        }
    }

    renderPreview(newsData) {
        const previewContent = document.getElementById('previewContent');
        const imageSrc = newsData.imageUrl || (newsData.image ? 'data:image/jpeg;base64,' + newsData.image : 'img/news_first_card.jpg');
        
        previewContent.innerHTML = `
            <div class="preview-news">
                <img src="${imageSrc}" alt="${newsData.title}" class="preview-image">
                <div class="preview-content">
                    <h3 class="preview-title">${newsData.title}</h3>
                    <div class="preview-date">${this.formatDate(newsData.date)}</div>
                    <p class="preview-description">${newsData.description}</p>
                </div>
            </div>
        `;
    }

    renderNewsList() {
        const newsList = document.getElementById('newsList');
        
        if (this.news.length === 0) {
            newsList.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-newspaper" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    <p>Новостей пока нет. Добавьте первую новость!</p>
                </div>
            `;
            return;
        }

        newsList.innerHTML = this.news.map(news => `
            <div class="news-item">
                <div class="news-item-header">
                    <div class="news-item-info">
                        <h4 class="news-item-title">${news.title}</h4>
                        <div class="news-item-date">${this.formatDate(news.date)}</div>
                        <p class="news-item-description">${news.description}</p>
                    </div>
                    ${news.image || news.imageUrl ? `
                        <img src="${news.image || news.imageUrl}" alt="${news.title}" class="news-item-image">
                    ` : ''}
                </div>
                <div class="news-item-actions">
                    <button class="btn btn-secondary" onclick="newsAdmin.editNews('${news.id}')">
                        <i class="fas fa-edit"></i>
                        Редактировать
                    </button>
                    <button class="btn btn-outline" onclick="newsAdmin.showPreview('${news.id}')">
                        <i class="fas fa-eye"></i>
                        Просмотр
                    </button>
                    <button class="btn btn-danger" onclick="newsAdmin.deleteNews('${news.id}')">
                        <i class="fas fa-trash"></i>
                        Удалить
                    </button>
                </div>
            </div>
        `).join('');
    }

    validateNewsData(data) {
        if (!data.title.trim()) {
            this.showNotification('Заголовок новости обязателен!', 'error');
            return false;
        }
        if (!data.date) {
            this.showNotification('Дата публикации обязательна!', 'error');
            return false;
        }
        if (!data.description.trim()) {
            this.showNotification('Описание новости обязательно!', 'error');
            return false;
        }
        if (!data.content.trim()) {
            this.showNotification('Содержание новости обязательно!', 'error');
            return false;
        }
        if (!data.image && !data.imageUrl) {
            this.showNotification('Необходимо добавить изображение!', 'error');
            return false;
        }
        return true;
    }

    resetForm() {
        document.getElementById('newsForm').reset();
        this.currentEditId = null;
        this.setCurrentDate();
        
        // Сбрасываем превью изображения
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.innerHTML = `
            <i class="fas fa-image"></i>
            <span>Выберите изображение</span>
        `;
        imagePreview.classList.remove('has-image');
    }

    showNotification(message, type = 'info') {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Удаляем через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    generateId() {
        return 'news_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Работа с localStorage
    loadNewsFromStorage() {
        try {
            const stored = localStorage.getItem('abu_news');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Ошибка загрузки новостей:', error);
            return [];
        }
    }

    saveNewsToStorage() {
        try {
            localStorage.setItem('abu_news', JSON.stringify(this.news));
        } catch (error) {
            console.error('Ошибка сохранения новостей:', error);
        }
    }

    // Экспорт новостей для интеграции с основной страницей
    exportNews() {
        return this.news;
    }
}

// Добавляем CSS для анимаций уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Инициализация при загрузке страницы
let newsAdmin;

// Проверяем, нужно ли инициализировать админку
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем только если админка должна быть показана
    const hash = window.location.hash;
    const isAdminPath = hash === '#admin' || hash === '#/admin';
    
    // Также проверяем, есть ли элемент админки на странице и должен ли он быть показан
    const adminPanel = document.getElementById('adminPanel');
    const shouldInit = isAdminPath || (adminPanel && adminPanel.style.display !== 'none');
    
    if (shouldInit) {
        newsAdmin = new NewsAdmin();
        window.newsAdmin = newsAdmin;
    }
});

// Экспортируем функцию для ручной инициализации
window.initNewsAdmin = function() {
    if (!newsAdmin && typeof NewsAdmin !== 'undefined') {
        newsAdmin = new NewsAdmin();
        window.newsAdmin = newsAdmin;
        return newsAdmin;
    }
    return newsAdmin;
};
