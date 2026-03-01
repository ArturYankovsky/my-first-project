/* ═══════════════════════════════════════════════════
   ЮВЕНТА — Глобальные анимации
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal()
  animateCounters()
  initLogoAnimation()
})

/* ── Scroll reveal ── */
function initScrollReveal() {
  const SELECTORS = [
    '.card', '.stat-card', '.checklist-card', '.deadline-row',
    '.doc-card', '.grant-card', '.news-card', '.template-card',
    '.section__title', '.section__lead',
    '.about-grid__text', '.about-grid__stats',
    '.page-hero', '.filters', '.gen-panel',
    '.fgos-section', '.compliance-table',
    '.contact-block', '.policy-content'
  ]

  const targets = document.querySelectorAll(SELECTORS.join(', '))
  if (!targets.length) return

  targets.forEach(el => {
    if (!el.classList.contains('visible')) el.classList.add('reveal')
  })

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })

  targets.forEach(el => observer.observe(el))
}

/* ── Счётчики (цифры в блоке статистики) ── */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-card__number')
  if (!counters.length) return

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const el = entry.target
      const raw = el.textContent.trim()
      const match = raw.match(/(\d[\d\s]*)/)
      if (!match) return
      const target = parseInt(match[1].replace(/\s/g, ''), 10)
      const suffix = raw.replace(match[1], '')
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min((now - start) / 1200, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        el.textContent = Math.round(eased * target).toLocaleString('ru-RU') + suffix
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
      obs.unobserve(el)
    })
  }, { threshold: 0.5 })

  counters.forEach(el => obs.observe(el))
}

/* ── Анимации логотипа в шапке ── */
function initLogoAnimation() {
  const img  = document.querySelector('.header .logo .logo__img')
  const logo = document.querySelector('.header .logo')
  if (!img || !logo) return

  // Если пользователь предпочитает без движения — не анимируем
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  // ─── 1. Вход: логотип вылетает слева ───────────────────────────
  // Устанавливаем начальное состояние сразу (без transition)
  img.style.opacity = '0'
  img.style.transform = 'translateX(-28px) scale(0.75)'
  img.style.transition = 'none'

  // Двойной requestAnimationFrame гарантирует, что браузер
  // отрисовал начальное состояние перед стартом перехода
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      img.style.transition =
        'opacity 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), ' +
        'transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)'
      img.style.opacity = '1'
      img.style.transform = 'translateX(0) scale(1)'

      // После окончания входа: убираем inline-стили и запускаем пульс
      setTimeout(() => {
        img.style.transition = ''
        img.style.opacity    = ''
        img.style.transform  = ''
        img.classList.add('logo-pulse')
      }, 950)
    })
  })

  // ─── 2. Блик: пробегает через 1.2 с ───────────────────────────
  setTimeout(() => {
    logo.classList.add('logo-shimmer')
    // Удаляем класс после окончания анимации (700 мс)
    setTimeout(() => logo.classList.remove('logo-shimmer'), 750)
  }, 1200)
}
