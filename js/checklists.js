/* ═══════════════════════════════════════════════════
   ЮВЕНТА — Интерактивные чеклисты с localStorage
   ═══════════════════════════════════════════════════ */

const STORAGE_KEY = 'yuventa_checklists'

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch { /* localStorage недоступен */ }
}

function renderChecklists(data) {
  const container = document.getElementById('checklistsContainer')
  const progress = loadProgress()
  container.innerHTML = ''

  data.forEach(checklist => {
    const saved = progress[checklist.id] || {}

    const section = document.createElement('div')
    section.className = 'checklist-section card'
    section.dataset.id = checklist.id

    // Заголовок чеклиста
    const header = document.createElement('div')
    header.className = 'checklist__header'

    const iconWrap = document.createElement('div')
    iconWrap.className = `checklist__icon checklist__icon--${checklist.color}`
    const icon = document.createElement('i')
    icon.className = `fa-solid ${checklist.icon}`
    iconWrap.appendChild(icon)

    const titleWrap = document.createElement('div')
    titleWrap.style.flex = '1'
    const title = document.createElement('h2')
    title.className = 'checklist__title'
    title.textContent = checklist.title
    const subtitle = document.createElement('div')
    subtitle.className = 'checklist__subtitle'
    subtitle.textContent = checklist.subtitle
    titleWrap.appendChild(title)
    titleWrap.appendChild(subtitle)

    const resetBtn = document.createElement('button')
    resetBtn.className = 'btn btn--outline checklist__reset'
    resetBtn.style.fontSize = '13px'
    resetBtn.style.padding = '6px 12px'
    resetBtn.textContent = 'Сбросить'
    resetBtn.addEventListener('click', () => resetChecklist(checklist.id, section))

    header.appendChild(iconWrap)
    header.appendChild(titleWrap)
    header.appendChild(resetBtn)

    // Прогресс-бар
    const progressWrap = document.createElement('div')
    progressWrap.className = 'checklist__progress-wrap'

    const progressBar = document.createElement('div')
    progressBar.className = 'checklist__progress-bar'
    const progressFill = document.createElement('div')
    progressFill.className = `checklist__progress-fill checklist__progress-fill--${checklist.color}`
    progressBar.appendChild(progressFill)

    const progressText = document.createElement('div')
    progressText.className = 'checklist__progress-text'

    progressWrap.appendChild(progressBar)
    progressWrap.appendChild(progressText)

    // Группировка пунктов
    const groups = {}
    checklist.items.forEach(item => {
      if (!groups[item.group]) groups[item.group] = []
      groups[item.group].push(item)
    })

    const itemsContainer = document.createElement('div')
    itemsContainer.className = 'checklist__items'

    Object.entries(groups).forEach(([groupName, items]) => {
      const groupEl = document.createElement('div')
      groupEl.className = 'checklist__group'

      const groupTitle = document.createElement('div')
      groupTitle.className = 'checklist__group-title'
      groupTitle.textContent = groupName
      groupEl.appendChild(groupTitle)

      items.forEach(item => {
        const row = document.createElement('label')
        row.className = 'checklist__item'
        if (saved[item.id]) row.classList.add('checklist__item--done')

        const cb = document.createElement('input')
        cb.type = 'checkbox'
        cb.checked = !!saved[item.id]
        cb.addEventListener('change', () => {
          row.classList.toggle('checklist__item--done', cb.checked)
          const p = loadProgress()
          if (!p[checklist.id]) p[checklist.id] = {}
          if (cb.checked) {
            p[checklist.id][item.id] = true
          } else {
            delete p[checklist.id][item.id]
          }
          saveProgress(p)
          updateProgress(checklist, section)
        })

        const text = document.createElement('span')
        text.textContent = item.text

        row.appendChild(cb)
        row.appendChild(text)
        groupEl.appendChild(row)
      })

      itemsContainer.appendChild(groupEl)
    })

    section.appendChild(header)
    section.appendChild(progressWrap)
    section.appendChild(itemsContainer)
    container.appendChild(section)

    updateProgress(checklist, section)
  })
}

function updateProgress(checklist, section) {
  const progress = loadProgress()
  const saved = progress[checklist.id] || {}
  const total = checklist.items.length
  const done = checklist.items.filter(i => saved[i.id]).length
  const pct = total ? Math.round(done / total * 100) : 0

  const fill = section.querySelector('.checklist__progress-fill')
  const text = section.querySelector('.checklist__progress-text')

  fill.style.width = pct + '%'
  text.textContent = `Выполнено: ${done} из ${total} (${pct}%)`

  if (pct === 100) {
    text.style.color = 'var(--green)'
    text.textContent = `✓ Все пункты выполнены (${done}/${total})`
  } else {
    text.style.color = ''
  }
}

function resetChecklist(id, section) {
  if (!confirm('Сбросить прогресс этого чеклиста?')) return
  const progress = loadProgress()
  delete progress[id]
  saveProgress(progress)

  section.querySelectorAll('input[type=checkbox]').forEach(cb => {
    cb.checked = false
    cb.closest('.checklist__item')?.classList.remove('checklist__item--done')
  })

  const checklist = window._checklistData?.find(c => c.id === id)
  if (checklist) updateProgress(checklist, section)
}
