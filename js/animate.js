/* ═══════════════════════════════════════════════════
   ЮВЕНТА — Глобальные анимации (Scroll Reveal)
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Элементы, которые будут появляться при скролле
  const SELECTORS = [
    '.card',
    '.stat-card',
    '.checklist-card',
    '.deadline-row',
    '.doc-card',
    '.grant-card',
    '.news-card',
    '.template-card',
    '.section__title',
    '.section__lead',
    '.about-grid__text',
    '.about-grid__stats',
    '.page-hero',
    '.filters',
    '.gen-panel',
    '.fgos-section',
    '.compliance-table',
    '.contact-block',
    '.policy-content'
  ]

  const targets = document.querySelectorAll(SELECTORS.join(', '))

  if (!targets.length) return

  // Добавляем класс reveal (изначально скрытый)
  targets.forEach(el => {
    // Не трогаем элементы, у которых уже есть анимация через .visible
    if (!el.classList.contains('visible')) {
      el.classList.add('reveal')
    }
  })

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  })

  targets.forEach(el => observer.observe(el))

  // Счётчики: анимируем числа в .stat-card__number
  animateCounters()
})

function animateCounters() {
  const counters = document.querySelectorAll('.stat-card__number')
  if (!counters.length) return

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const el = entry.target
      const raw = el.textContent.trim()
      // Парсим число из строки вида "500+", "15 лет", "100%"
      const match = raw.match(/(\d[\d\s]*)/)
      if (!match) return
      const target = parseInt(match[1].replace(/\s/g, ''), 10)
      const suffix = raw.replace(match[1], '')
      const duration = 1200
      const start = performance.now()

      const tick = (now) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        // Easing: ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = Math.round(eased * target)
        el.textContent = current.toLocaleString('ru-RU') + suffix
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
      counterObserver.unobserve(el)
    })
  }, { threshold: 0.5 })

  counters.forEach(el => counterObserver.observe(el))
}
