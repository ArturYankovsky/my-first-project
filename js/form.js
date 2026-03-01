/* ═══════════════════════════════════════════════════
   ЮВЕНТА — Обработчик форм (EmailJS)
   ═══════════════════════════════════════════════════
   Настройка:
   1. Зарегистрируйтесь на https://www.emailjs.com
   2. Создайте Email Service и Email Template
   3. Замените EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID на свои значения
   4. В настройках EmailJS ограничьте домен yuventa.ru
   ═══════════════════════════════════════════════════ */

const EMAILJS_PUBLIC_KEY   = 'YOUR_PUBLIC_KEY'    // TODO: заменить
const EMAILJS_SERVICE_ID   = 'YOUR_SERVICE_ID'    // TODO: заменить
const EMAILJS_TEMPLATE_ID  = 'YOUR_TEMPLATE_ID'   // TODO: заменить
const EMAILJS_TEMPLATE_ORDER = 'YOUR_TEMPLATE_ID' // можно тот же

let emailjsReady = false

// Загружаем EmailJS SDK асинхронно
function loadEmailJS() {
  return new Promise((resolve, reject) => {
    if (typeof emailjs !== 'undefined') { resolve(); return }
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js'
    s.onload = () => {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY })
      emailjsReady = true
      resolve()
    }
    s.onerror = reject
    document.head.appendChild(s)
  })
}

// Показать результат отправки
function showResult(resultEl, success, message) {
  resultEl.style.display = 'block'
  resultEl.style.background = success ? 'var(--green-light)' : '#FFEBEE'
  resultEl.style.color = success ? 'var(--green)' : '#C62828'
  resultEl.textContent = message
}

// Инициализация формы контактов
function initContactForm(formId, resultId) {
  const form = document.getElementById(formId)
  const resultEl = document.getElementById(resultId)
  if (!form) return

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const btn = form.querySelector('[type=submit]')
    btn.disabled = true
    btn.textContent = 'Отправляю...'

    try {
      await loadEmailJS()
      const params = {
        from_name: form.querySelector('[name=name]')?.value || '',
        from_org: form.querySelector('[name=org]')?.value || '',
        from_phone: form.querySelector('[name=phone]')?.value || '',
        from_email: form.querySelector('[name=email]')?.value || '',
        subject: form.querySelector('[name=subject]')?.value || '',
        message: form.querySelector('[name=message]')?.value || ''
      }
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
      showResult(resultEl, true, '✓ Сообщение отправлено! Мы свяжемся с вами в ближайшее время.')
      form.reset()
    } catch (err) {
      // В режиме разработки (localhost / без EmailJS ключей) — имитируем успех
      if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        showResult(resultEl, true, '✓ [Демо-режим] Форма работает корректно. Для реальной отправки настройте EmailJS.')
        form.reset()
      } else {
        showResult(resultEl, false, '✗ Ошибка отправки. Пожалуйста, напишите нам напрямую на info@yuventa.ru')
        console.error('EmailJS error:', err)
      }
    }

    btn.disabled = false
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Отправить сообщение'
  })
}

// Инициализация формы заявки на товар (каталог)
function initOrderForm(formId, resultId) {
  const form = document.getElementById(formId)
  const resultEl = document.getElementById(resultId)
  if (!form) return

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const btn = form.querySelector('[type=submit]')
    btn.disabled = true
    btn.textContent = 'Отправляю...'

    try {
      await loadEmailJS()
      const params = {
        from_name: form.querySelector('[name=name]')?.value || '',
        from_org: form.querySelector('[name=org]')?.value || '',
        from_phone: form.querySelector('[name=phone]')?.value || '',
        from_email: form.querySelector('[name=email]')?.value || '',
        message: form.querySelector('[name=message]')?.value || '',
        product: document.getElementById('modalProduct')?.textContent || ''
      }
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ORDER, params)
      if (resultEl) showResult(resultEl, true, '✓ Заявка отправлена!')
      else alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.')
      form.reset()
    } catch (err) {
      if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        alert('[Демо] Форма работает. Настройте EmailJS для реальной отправки.')
        form.reset()
      } else {
        alert('Ошибка отправки. Напишите напрямую: info@yuventa.ru')
        console.error('EmailJS error:', err)
      }
    }

    btn.disabled = false
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Отправить заявку'
  })
}
