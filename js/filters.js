/* ═══════════════════════════════════════════════════
   ЮВЕНТА — Поиск и фильтрация (общий модуль)
   ═══════════════════════════════════════════════════ */

// Универсальная фильтрация карточек по data-атрибутам
function initCardFilters(filterSelector, cardSelector) {
  const filterBtns = document.querySelectorAll(filterSelector)
  const cards = document.querySelectorAll(cardSelector)

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')

      const filter = btn.dataset.filter

      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter
        card.style.display = show ? '' : 'none'
      })
    })
  })
}

// Поиск по тексту внутри карточек
function initSearch(inputSelector, cardSelector) {
  const input = document.querySelector(inputSelector)
  if (!input) return

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase()
    document.querySelectorAll(cardSelector).forEach(card => {
      const text = card.textContent.toLowerCase()
      card.style.display = text.includes(query) ? '' : 'none'
    })
  })
}
