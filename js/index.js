document.addEventListener("DOMContentLoaded", () => {
  console.log('DOM загружен, инициализация JavaScript...');
  // === ЯЗЫКОВОЙ ПЕРЕКЛЮЧАТЕЛЬ ===
  const languages = ["KZ", "RU", "EN"];
  let currentIndex = 0;

  const button = document.getElementById("language-button");
  const label = document.getElementById("language-label");

  if (button && label) {
    button.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % languages.length;
      label.textContent = languages[currentIndex];
    });
  }

  // === СЛАЙДЕР НОВОСТЕЙ ===
  const slider = document.querySelector(".news__slider-wrapper");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (slider && prevBtn && nextBtn) {
    const slideStep = 446 + 24;
    nextBtn.addEventListener("click", () => slider.scrollBy({ left: slideStep, behavior: "smooth" }));
    prevBtn.addEventListener("click", () => slider.scrollBy({ left: -slideStep, behavior: "smooth" }));
  }

  // === БУРГЕР-МЕНЮ ===
  const burgerBtn = document.getElementById('burger-button');
  const menuBody = document.getElementById('menu-body');
  const menuPages = document.querySelector('.menu__pages');
  const submenuToggles = document.querySelectorAll('.submenu-toggle');
  console.log('Найдено элементов submenu-toggle:', submenuToggles.length);

  // Функция для закрытия меню
  function closeMenu() {
    menuBody.classList.remove('active');
    menuPages.classList.remove('active');
    document.querySelectorAll('.has-submenu.active').forEach(item => {
      item.classList.remove('active');
    });
  }

  // Функция для открытия меню
  function openMenu() {
    menuBody.classList.add('active');
    menuPages.classList.add('active');
  }

  if (burgerBtn && menuBody && menuPages) {
    burgerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Бургер кликнут!');
      
      if (menuBody.classList.contains('active')) {
        closeMenu();
        console.log('Меню закрыто');
      } else {
        openMenu();
        console.log('Меню открыто');
      }
    });
  }

  // === ЗАКРЫТИЕ МЕНЮ ПРИ КЛИКЕ НА ССЫЛКИ ===
  const menuLinks = document.querySelectorAll('.menu__pages a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMenu();
      }
    });
  });

  // === ЗАКРЫТИЕ МЕНЮ ПРИ КЛИКЕ ВНЕ МЕНЮ ===
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      const isClickInsideMenu = menuBody.contains(e.target);
      const isClickOnBurger = burgerBtn.contains(e.target);
      
      if (!isClickInsideMenu && !isClickOnBurger && menuBody.classList.contains('active')) {
        closeMenu();
      }
    }
  });

  submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Клик по подменю:', toggle.textContent.trim());
      const parent = toggle.closest('.has-submenu');
      console.log('Родительский элемент найден:', parent);

      document.querySelectorAll('.has-submenu').forEach(item => {
        if (item !== parent) {
          item.classList.remove('active');
          console.log('Закрыто подменю:', item);
        }
      });

      parent.classList.toggle('active');
      console.log('Подменю переключено. Активно:', parent.classList.contains('active'));
      
      // Дополнительная проверка
      const submenu = parent.querySelector('.submenu');
      if (submenu) {
        console.log('Подменю элемент найден:', submenu);
        console.log('Стили подменю:', window.getComputedStyle(submenu).display);
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      menuPages?.classList.remove('active');
      document.querySelectorAll('.submenu.active').forEach(sub => sub.classList.remove('active'));
    }
  });

  // === АККОРДЕОНЫ ===
  document.querySelectorAll('.accordion-toggle').forEach(button => {
    button.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') return;
      const content = button.nextElementSibling;
      if (!content || !content.classList.contains('accordion-content')) return;

      document.querySelectorAll('.accordion-content').forEach(el => {
        if (el !== content) el.style.display = 'none';
      });

      content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });
  });

  // === УТИЛИТА ДЛЯ ЗАКРЫТИЯ ВСЕХ МОДАЛОК ===
  function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.style.display = 'none';
    });
  }

  // === УНИВЕРСАЛЬНАЯ НАСТРОЙКА МОДАЛКИ ===
  function setupModal(openId, modalId, closeId) {
    const openBtn = document.getElementById(openId);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeId);

    if (openBtn && modal && closeBtn) {
      openBtn.addEventListener("click", () => {
        closeAllModals();
        modal.style.display = "flex";
      });

      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });

      window.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });
    }
  }

  // === 🇰🇿 МОДАЛКИ СТРАН ===
  setupModal("openModalKazakhstan", "modalKazakhstan", "closeModalKazakhstan");
  setupModal("openModalSemey", "modalSemey", "closeModalSemey");

  // ===  МОДАЛКИ УНИВЕРСИТЕТОВ ===
  document.querySelectorAll('.btn-universities').forEach(button => {
    button.addEventListener('click', () => {
      const country = button.getAttribute('data-country');
      const modal = document.getElementById(`modal-${country}`);
      if (modal) {
        closeAllModals();
        modal.style.display = "flex";
      }
    });
  });

  // === ЗАКРЫТИЕ ПО X ===
  document.querySelectorAll('.modal .close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) modal.style.display = 'none';
    });
  });

  // === ЗАКРЫТИЕ ПО ФОНУ ===
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  });

  // === НА СТАРТЕ — ВСЕ МОДАЛКИ СКРЫТЫ ===
  closeAllModals();
});


// === ЗАКРЫТИЕ ВЫПАДАЮЩИХ МЕНЮ ПРИ КЛИКЕ ВНЕ ===
document.addEventListener('click', (e) => {
  const isInsideMenu = e.target.closest('.has-submenu');
  const isToggleButton = e.target.classList.contains('submenu-toggle');

  if (!isInsideMenu && !isToggleButton) {
    document.querySelectorAll('.has-submenu.active').forEach(item => {
      item.classList.remove('active');
    });
  }
});
