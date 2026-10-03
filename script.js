/**
 * Danil Lisenko — Tutor & Software Engineer Landing Page
 * Interactive Logic & UI Controllers
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. ШАПКА ПРИ СКРОЛЛЕ
     ========================================================================== */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ==========================================================================
     2. МОБИЛЬНОЕ МЕНЮ (DRAWER)
     ========================================================================== */
  const burgerBtn = document.getElementById('burgerBtn');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  function openDrawer() {
    mobileDrawer.classList.add('active');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (burgerBtn) burgerBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  document.querySelectorAll('.mobile-nav-list a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  /* ==========================================================================
     3. МОДАЛЬНОЕ ОКНО ЗАПИСИ
     ========================================================================== */
  const bookingModal = document.getElementById('bookingModal');
  const modalCloseBtns = document.querySelectorAll('[data-close-modal]');
  const modalServiceSelect = document.getElementById('modalService');

  function openBookingModal(serviceName = null, formatName = null) {
    if (serviceName && modalServiceSelect) {
      for (let option of modalServiceSelect.options) {
        if (option.value.includes(serviceName) || serviceName.includes(option.value)) {
          option.selected = true;
          break;
        }
      }
    }
    if (formatName) {
      const modalFormatSelect = document.getElementById('modalFormat');
      if (modalFormatSelect) {
        for (let option of modalFormatSelect.options) {
          if (option.value.includes(formatName)) {
            option.selected = true;
            break;
          }
        }
      }
    }
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeBookingModal() {
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
      const serviceType = btn.getAttribute('data-service-type');
      openBookingModal(serviceType);
    });
  });

  modalCloseBtns.forEach(btn => btn.addEventListener('click', closeBookingModal));

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeBookingModal();
    });
  }

  /* ==========================================================================
     4. ОБРАБОТКА МЕССЕНДЖЕРА МАКС (КОПИРОВАНИЕ ТЕЛЕФОНА И ПЕРЕХОД)
     ========================================================================== */
  const MAX_PROFILE_URL = 'https://max.ru/u/f9LHodD0cOLxJzj63nASr6si_iYuyGz2HY-qIaEtjhyqRDN6lv5kBx9fHdI';
  const PHONE_NUMBER = '+79512605911';

  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((resolve, reject) => {
        try {
          document.execCommand('copy') ? resolve() : reject();
        } catch (err) {
          reject(err);
        } finally {
          textArea.remove();
        }
      });
    }
  }

  function showToast(message, duration = 3500) {
    let toast = document.getElementById('siteToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'siteToast';
      toast.className = 'site-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  document.querySelectorAll('[data-messenger="max"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
      copyToClipboard(PHONE_NUMBER).catch(() => {});
      showToast('📋 Телефон <strong>+7 (951) 260-59-11</strong> скопирован! Открываем профиль в Макс...', 3500);
      setTimeout(() => {
        window.open(MAX_PROFILE_URL, '_blank', 'noopener,noreferrer');
      }, 250);
    });
  });

  /* ==========================================================================
     5. ЛАЙТБОКС (ПРОСМОТР ДИПЛОМОВ И СЕРТИФИКАТОВ)
     ========================================================================== */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('[data-lightbox]').forEach(card => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-lightbox');
      const caption = card.getAttribute('data-caption') || '';
      if (lightboxImage && lightboxCaption && lightboxModal) {
        lightboxImage.src = src;
        lightboxCaption.textContent = caption;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeBookingModal();
      closeMaxModal();
      closeLightbox();
      closeSentModal();
      closeDrawer();
    }
  });

  /* ==========================================================================
     6. АККОРДЕОН FAQ
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer');

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Закрываем остальные
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherAns = other.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
      }
    });
  });

  /* ==========================================================================
     7. ИНТЕРАКТИВНЫЙ КАЛЬКУЛЯТОР / КВИЗ ПОДБОРА ПРОГРАММЫ
     ========================================================================== */
  let selectedSubject = 'Информатика';
  let selectedFormat = 'Онлайн';

  const subjectChips = document.querySelectorAll('#subjectOptions .calc-chip');
  subjectChips.forEach(chip => {
    chip.addEventListener('click', () => {
      subjectChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedSubject = chip.getAttribute('data-subject');
      updateCalcRecommendation();
    });
  });

  const formatChips = document.querySelectorAll('#formatOptions .calc-chip');
  formatChips.forEach(chip => {
    chip.addEventListener('click', () => {
      formatChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedFormat = chip.getAttribute('data-format');
      updateCalcRecommendation();
    });
  });

  const levelSelect = document.getElementById('levelSelect');
  if (levelSelect) {
    levelSelect.addEventListener('change', updateCalcRecommendation);
  }

  const recommendationText = document.getElementById('recommendationText');
  const calcTrialPriceEl = document.getElementById('calcTrialPrice');
  const calcMainPriceEl = document.getElementById('calcMainPrice');

  function updateCalcRecommendation() {
    if (!levelSelect) return;
    const level = levelSelect.value;
    const isOffline = selectedFormat.toLowerCase().includes('челябинск') || selectedFormat.toLowerCase().includes('выезд');

    let trialPrice = isOffline ? '800 ₽' : '600 ₽';
    let mainPrice = isOffline ? '1 500 ₽' : '1 200 ₽';
    let recommendation = '1–2 занятия в неделю';

    if (level.includes('5-8')) {
      mainPrice = isOffline ? '1 500 ₽' : '1 200 ₽';
      recommendation = '1–2 занятия в неделю (школьная программа, устранение пробелов)';
    } else if (level.includes('9 класс') || level.includes('ОГЭ')) {
      mainPrice = isOffline ? '1 500 ₽' : '1 200 ₽';
      recommendation = '2 занятия в неделю по 60 мин (упор на практику ОГЭ)';
    } else if (level.includes('10-11') || level.includes('ЕГЭ')) {
      mainPrice = isOffline ? '1 800 ₽' : '1 500 ₽';
      recommendation = '2 занятия в неделю (глубокий разбор КИМ ЕГЭ)';
    } else if (level.includes('Python') || level.includes('IT') || level.includes('Программирование') || selectedSubject.includes('IT')) {
      mainPrice = isOffline ? '1 700 ₽' : '1 400 ₽';
      recommendation = '1–2 занятия в неделю (Python, проекты, сайты, игры)';
    } else if (level.includes('Студент') || level.includes('ВУЗ') || level.includes('работа')) {
      trialPrice = 'от 800 ₽';
      mainPrice = 'от 800 ₽';
      recommendation = 'Индивидуальный срок и расчет по сложности ТЗ';
    }

    if (calcTrialPriceEl) calcTrialPriceEl.textContent = trialPrice;
    if (calcMainPriceEl) calcMainPriceEl.textContent = mainPrice;
    if (recommendationText) recommendationText.textContent = recommendation;
  }

  // Первичный расчет при загрузке
  updateCalcRecommendation();

  const calcBookBtn = document.getElementById('calcBookBtn');
  if (calcBookBtn) {
    calcBookBtn.addEventListener('click', () => {
      const level = levelSelect ? levelSelect.value : '';
      const serviceName = `${selectedSubject} (${level})`;
      openBookingModal(serviceName, selectedFormat);
    });
  }

  /* ==========================================================================
     8. ОБРАБОТКА ФОРМ ЗАПИСИ И ТЕЛЕГРАМ-УВЕДОМЛЕНИЯ
     ========================================================================== */
  const requestSentModal = document.getElementById('requestSentModal');
  const sentSummaryCard = document.getElementById('sentSummaryCard');
  const sentCloseBtns = document.querySelectorAll('[data-close-sent-modal]');

  const TG_BOT_TOKEN = '8820987856:AAGTFlpUPsl2Jhs4pe07zEi8hq5N5od1Czk';
  const TG_CHAT_IDS = ['1002500917', '-1001002500917', '-1002500917'];

  function sendTelegramNotification(name, contact, messenger, service, format, message) {
    const formattedText = 
      `⚡ <b>Новая заявка с сайта!</b>\n\n` +
      `👤 <b>Имя:</b> ${escapeHtml(name)}\n` +
      `📞 <b>Контакт:</b> ${escapeHtml(contact)}\n` +
      `💬 <b>Мессенджер:</b> ${escapeHtml(messenger)}\n` +
      `📚 <b>Программа:</b> ${escapeHtml(service)}\n` +
      `📍 <b>Формат:</b> ${escapeHtml(format)}\n` +
      (message ? `📝 <b>Пожелание:</b> ${escapeHtml(message)}\n` : '') +
      `⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}`;

    TG_CHAT_IDS.forEach(chatId => {
      try {
        fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: formattedText,
            parse_mode: 'HTML'
          })
        }).catch(() => {});
      } catch (e) {}
    });
  }

  function closeSentModal() {
    if (requestSentModal) {
      requestSentModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  sentCloseBtns.forEach(btn => btn.addEventListener('click', closeSentModal));

  function handleBookingSubmit(name, contact, messenger, service, format, message) {
    const summaryHtml = `
      <div style="margin-bottom:6px;"><strong>Ученик:</strong> ${escapeHtml(name)}</div>
      <div style="margin-bottom:6px;"><strong>Контакт:</strong> ${escapeHtml(contact)} (${escapeHtml(messenger)})</div>
      <div style="margin-bottom:6px;"><strong>Услуга:</strong> ${escapeHtml(service)}</div>
      <div style="margin-bottom:6px;"><strong>Формат:</strong> ${escapeHtml(format)}</div>
      ${message ? `<div style="margin-bottom:6px;"><strong>Пожелание:</strong> ${escapeHtml(message)}</div>` : ''}
    `;

    if (sentSummaryCard) sentSummaryCard.innerHTML = summaryHtml;

    // Мгновенная отправка в Telegram репетитору
    sendTelegramNotification(name, contact, messenger, service, format, message);

    // Дополнительная фоновая отправка через Web3Forms
    try {
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: '8a19a2f0-0799-406b-b27f-827f5e982745',
          subject: 'Новая заявка с сайта репетитора Данила Лисенко',
          from_name: 'Сайт Репетитора Данила Лисенко',
          name: name,
          contact: contact,
          messenger: messenger,
          service: service,
          format: format,
          message: message || 'Без комментария'
        })
      }).catch(() => {});
    } catch (e) {}

    closeBookingModal();
    if (requestSentModal) {
      requestSentModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Основная форма в футере
  const mainForm = document.getElementById('mainBookingForm');
  if (mainForm) {
    mainForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName').value;
      const contact = document.getElementById('clientContact').value;
      const messenger = mainForm.querySelector('input[name="preferredMessenger"]:checked')?.value || 'telegram';
      const service = document.getElementById('serviceSelect').value;
      const format = document.getElementById('formatSelect').value;
      const message = document.getElementById('clientMessage').value;

      handleBookingSubmit(name, contact, messenger, service, format, message);
      mainForm.reset();
    });
  }

  // Модальная форма
  const modalForm = document.getElementById('modalBookingForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modalName').value;
      const contact = document.getElementById('modalContact').value;
      const messenger = modalForm.querySelector('input[name="preferredMessenger"]:checked')?.value || 'telegram';
      const service = document.getElementById('modalService').value;
      const format = document.getElementById('modalFormat').value;
      const message = document.getElementById('modalMessage').value;

      handleBookingSubmit(name, contact, messenger, service, format, message);
      modalForm.reset();
    });
  }

  /* ==========================================================================
     9. ПЛАВАЮЩИЙ ВИДЖЕТ МЕССЕНДЖЕРОВ (FAB)
     ========================================================================== */
  const widgetToggle = document.getElementById('widgetToggle');
  const widgetMenu = document.getElementById('widgetMenu');
  const floatingWidget = document.querySelector('.floating-messengers-widget');

  if (widgetToggle && widgetMenu && floatingWidget) {
    widgetToggle.addEventListener('click', () => {
      const isOpen = widgetMenu.classList.contains('active');
      if (isOpen) {
        widgetMenu.classList.remove('active');
        floatingWidget.classList.remove('open');
      } else {
        widgetMenu.classList.add('active');
        floatingWidget.classList.add('open');
      }
    });

    document.addEventListener('click', (e) => {
      if (!floatingWidget.contains(e.target)) {
        widgetMenu.classList.remove('active');
        floatingWidget.classList.remove('open');
      }
    });
  }

  /* ==========================================================================
     10. АНИМАЦИИ ПРИ ПРОКРУТКЕ (INTERSECTION OBSERVER)
     ========================================================================== */
  const animatedElements = document.querySelectorAll('.fade-in-on-scroll');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    animatedElements.forEach(el => el.classList.add('visible'));
  }

});
