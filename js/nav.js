/* ═══════════════════════════════════════════════════
   ЮВЕНТА — Навигация, бургер-меню, анимации
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Бургер-меню ─── */
  const burger = document.getElementById('burger')
  const nav    = document.getElementById('nav')

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open')
      burger.classList.toggle('active', isOpen)
      burger.setAttribute('aria-expanded', isOpen)
      document.body.style.overflow = isOpen ? 'hidden' : ''
    })

    // Закрыть при клике на ссылку
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open')
        burger.classList.remove('active')
        burger.setAttribute('aria-expanded', 'false')
        document.body.style.overflow = ''
      })
    })

    // Закрыть при клике вне меню
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !burger.contains(e.target)) {
        nav.classList.remove('open')
        burger.classList.remove('active')
        burger.setAttribute('aria-expanded', 'false')
        document.body.style.overflow = ''
      }
    })
  }

  /* ─── Scroll-анимация карточек (Intersection Observer) ─── */
  // Не запускаем если пользователь отключил анимации
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!prefersReduced) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Небольшая задержка для каскадного появления карточек
          setTimeout(() => {
            entry.target.classList.add('visible')
          }, index * 80)
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })

    document.querySelectorAll('.card').forEach(card => observer.observe(card))
  } else {
    // Если анимации отключены — сразу показываем все карточки
    document.querySelectorAll('.card').forEach(card => card.classList.add('visible'))
  }

  /* ─── Активный пункт навигации ─── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html'
  document.querySelectorAll('.nav__link, .dropdown a').forEach(link => {
    const href = link.getAttribute('href')
    if (href === currentPath) {
      link.style.color = 'var(--green)'
      link.style.fontWeight = '700'
    }
  })

  /* ─── Закрытие dropdown по Escape ─── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      nav?.classList.remove('open')
      burger?.classList.remove('active')
      document.body.style.overflow = ''
    }
  })

})
