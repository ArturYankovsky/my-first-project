/* ═══════════════════════════════════════════════════
   ЮВЕНТА — Календарь дедлайнов
   ═══════════════════════════════════════════════════ */

function renderDeadlines(items) {
  const container = document.getElementById('deadlinesContainer')
  const noResults = document.getElementById('noResults')
  container.innerHTML = ''

  if (!items.length) {
    noResults.style.display = 'block'
    return
  }
  noResults.style.display = 'none'

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  items.forEach((item, i) => {
    const deadline = item.deadline ? new Date(item.deadline) : null
    const daysLeft = deadline ? Math.ceil((deadline - today) / 86400000) : null
    const isExpired = daysLeft !== null && daysLeft < 0
    const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 14
    const isSoon = daysLeft !== null && daysLeft > 14 && daysLeft <= 30

    const row = document.createElement('div')
    row.className = 'deadline-row card'
    if (isExpired) row.classList.add('deadline-row--expired')
    if (isUrgent) row.classList.add('deadline-row--urgent')

    // Левая часть: дата
    const dateCol = document.createElement('div')
    dateCol.className = 'deadline-row__date'

    if (deadline) {
      const dateNum = document.createElement('div')
      dateNum.className = 'deadline-row__date-num'
      dateNum.textContent = deadline.getDate()
      const dateMonth = document.createElement('div')
      dateMonth.className = 'deadline-row__date-month'
      dateMonth.textContent = deadline.toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' })
      dateCol.appendChild(dateNum)
      dateCol.appendChild(dateMonth)
    } else {
      dateCol.innerHTML = '<div class="deadline-row__date-num" style="font-size:18px">—</div><div class="deadline-row__date-month">нет срока</div>'
    }

    // Центральная часть: инфо
    const info = document.createElement('div')
    info.className = 'deadline-row__info'

    const title = document.createElement('div')
    title.className = 'deadline-row__title'
    title.textContent = item.title

    const meta = document.createElement('div')
    meta.className = 'deadline-row__meta'

    const typeBadge = document.createElement('span')
    typeBadge.className = `badge badge--${item.typeColor || 'blue'}`
    typeBadge.textContent = item.typeName
    meta.appendChild(typeBadge)

    if (item.forWhomName) {
      const forBadge = document.createElement('span')
      forBadge.className = 'badge badge--gray'
      forBadge.textContent = item.forWhomName
      meta.appendChild(forBadge)
    }

    // Дней осталось
    if (daysLeft !== null) {
      const daysEl = document.createElement('span')
      if (isExpired) {
        daysEl.className = 'deadline-days deadline-days--expired'
        daysEl.textContent = 'Срок истёк'
      } else if (isUrgent) {
        daysEl.className = 'deadline-days deadline-days--urgent'
        daysEl.textContent = daysLeft === 0 ? 'Сегодня!' : `Осталось ${daysLeft} дн.`
      } else if (isSoon) {
        daysEl.className = 'deadline-days deadline-days--soon'
        daysEl.textContent = `Осталось ${daysLeft} дн.`
      } else {
        daysEl.className = 'deadline-days'
        daysEl.textContent = `Осталось ${daysLeft} дн.`
      }
      meta.appendChild(daysEl)
    }

    const desc = document.createElement('div')
    desc.className = 'deadline-row__desc'
    desc.textContent = item.description

    info.appendChild(title)
    info.appendChild(meta)
    info.appendChild(desc)

    // Правая часть: ссылка
    const actions = document.createElement('div')
    actions.className = 'deadline-row__actions'

    if (item.url) {
      const link = document.createElement('a')
      link.href = item.url
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.className = 'btn btn--outline'
      link.style.fontSize = '13px'
      link.style.padding = '7px 14px'
      link.style.whiteSpace = 'nowrap'
      const linkIcon = document.createElement('i')
      linkIcon.className = 'fa-solid fa-arrow-up-right-from-square'
      link.appendChild(linkIcon)
      link.appendChild(document.createTextNode(' Подробнее'))
      actions.appendChild(link)
    }

    row.appendChild(dateCol)
    row.appendChild(info)
    row.appendChild(actions)
    container.appendChild(row)

    setTimeout(() => row.classList.add('visible'), i * 60)
  })
}
