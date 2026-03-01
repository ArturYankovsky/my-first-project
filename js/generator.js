/* ═══════════════════════════════════════════════════
   ЮВЕНТА — Генератор документов
   Использует docx.js (https://docx.js.org)
   ═══════════════════════════════════════════════════ */

/* Вспомогательные функции docx */
function makeHeading(text, level) {
  const { Paragraph, TextRun, HeadingLevel } = docx
  const levels = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3]
  return new Paragraph({
    text,
    heading: levels[level - 1] || HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 100 }
  })
}

function makePara(text, options = {}) {
  const { Paragraph, TextRun } = docx
  return new Paragraph({
    children: [new TextRun({ text, bold: options.bold, italics: options.italic, size: options.size || 24 })],
    spacing: { after: options.spaceBefore ? 0 : 120 },
    alignment: options.align || 'left'
  })
}

function makeBlankLine() {
  const { Paragraph } = docx
  return new Paragraph({ text: '' })
}

/* ───── Шаблон 1: Приказ об утверждении рабочих программ ───── */
function generateOrderPrograms(data) {
  const { Document, Packer, Paragraph, TextRun, AlignmentType } = docx

  const today   = data.date     || new Date().toLocaleDateString('ru-RU')
  const num     = data.number   || '___'
  const orgName = data.org      || '[Наименование организации]'
  const director = data.director || '[ФИО]'
  const role    = data.role     || 'Директор'
  const year    = data.year     || new Date().getFullYear()

  const doc = new Document({
    sections: [{ properties: {}, children: [
      new Paragraph({
        children: [new TextRun({ text: orgName.toUpperCase(), bold: true, size: 24 })],
        alignment: AlignmentType.CENTER, spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: 'ПРИКАЗ', bold: true, size: 32 })],
        alignment: AlignmentType.CENTER, spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: `от ${today} № ${num}`, size: 24 })],
        alignment: AlignmentType.CENTER, spacing: { after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: `Об утверждении рабочих программ на ${year}/${+year + 1} учебный год`, bold: true, size: 26 })],
        alignment: AlignmentType.CENTER, spacing: { after: 300 }
      }),
      makePara('В целях обеспечения реализации образовательных программ в соответствии с требованиями ФГОС и ФОП,'),
      makePara('ПРИКАЗЫВАЮ:', { bold: true }),
      makeBlankLine(),
      makePara(`1. Утвердить рабочие программы по образовательным областям (учебным предметам) на ${year}/${+year + 1} учебный год согласно приложению к настоящему приказу.`),
      makeBlankLine(),
      makePara('2. Педагогическим работникам осуществлять образовательную деятельность в соответствии с утверждёнными рабочими программами.'),
      makeBlankLine(),
      makePara('3. Заместителю руководителя по учебно-воспитательной работе обеспечить контроль исполнения настоящего приказа.'),
      makeBlankLine(),
      makePara('4. Контроль за исполнением настоящего приказа оставляю за собой.'),
      makeBlankLine(), makeBlankLine(),
      new Paragraph({
        children: [
          new TextRun({ text: `${role}: `, size: 24 }),
          new TextRun({ text: `________________ / ${director} /`, size: 24 })
        ], spacing: { after: 120 }
      }),
      makeBlankLine(),
      makePara('М.П.'),
      makeBlankLine(), makeBlankLine(),
      makePara('Приложение к приказу'),
      makePara('ПЕРЕЧЕНЬ РАБОЧИХ ПРОГРАММ', { bold: true }),
      makeBlankLine(),
      makePara('[Заполняется образовательной организацией]')
    ]}]
  })
  return doc
}

/* ───── Шаблон 2: Акт приёма-передачи оборудования ───── */
function generateActEquipment(data) {
  const { Document, Paragraph, TextRun, AlignmentType } = docx

  const today    = data.date      || new Date().toLocaleDateString('ru-RU')
  const num      = data.number    || '___'
  const orgName  = data.org       || '[Наименование организации]'
  const supplier = data.supplier  || 'ООО «ЮВЕНТА»'
  const equipment = data.equipment || '[Наименование оборудования]'
  const quantity = data.quantity  || '1'
  const price    = data.price     || '[Сумма]'
  const director = data.director  || '[ФИО]'
  const role     = data.role      || 'Директор'

  const doc = new Document({
    sections: [{ children: [
      new Paragraph({
        children: [new TextRun({ text: `АКТ № ${num}`, bold: true, size: 32 })],
        alignment: AlignmentType.CENTER, spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: 'приёма-передачи учебного оборудования', bold: true, size: 26 })],
        alignment: AlignmentType.CENTER, spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: `от ${today} г.`, size: 24 })],
        alignment: AlignmentType.CENTER, spacing: { after: 300 }
      }),
      makePara(`Мы, нижеподписавшиеся, представитель Поставщика — ${supplier}, и представитель Получателя — ${orgName}, составили настоящий акт о нижеследующем:`),
      makeBlankLine(),
      makePara('Поставщик передал, а Получатель принял учебное оборудование в соответствии с договором:'),
      makeBlankLine(),
      makePara(`Наименование: ${equipment}`, { bold: true }),
      makePara(`Количество: ${quantity} шт.`),
      makePara(`Стоимость: ${price} руб. (НДС по ставке, установленной законодательством)`),
      makeBlankLine(),
      makePara('Оборудование передано в исправном состоянии, комплектность соответствует договору. Претензий по качеству, количеству и комплектности нет.'),
      makeBlankLine(), makeBlankLine(),
      new Paragraph({
        children: [
          new TextRun({ text: 'Передал (Поставщик):  ', size: 24 }),
          new TextRun({ text: '________________ / _______________________ /', size: 24 })
        ], spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: `Принял (${role}):  `, size: 24 }),
          new TextRun({ text: `________________ / ${director} /`, size: 24 })
        ], spacing: { after: 120 }
      }),
      makePara('М.П.')
    ]}]
  })
  return doc
}

/* ───── Шаблон 3: Заявка на участие в гранте ───── */
function generateGrantApplication(data) {
  const { Document, Paragraph, TextRun, AlignmentType } = docx

  const today      = data.date      || new Date().toLocaleDateString('ru-RU')
  const orgName    = data.org       || '[Наименование организации]'
  const director   = data.director  || '[ФИО руководителя]'
  const role       = data.role      || 'Директор'
  const projectName = data.project  || '[Название проекта]'
  const amount     = data.amount    || '[Сумма]'
  const grantName  = data.grantName || '[Название гранта]'

  const doc = new Document({
    sections: [{ children: [
      new Paragraph({ children: [new TextRun({ text: 'В конкурсную комиссию', size: 24 })], alignment: AlignmentType.RIGHT, spacing: { after: 60 } }),
      new Paragraph({ children: [new TextRun({ text: grantName, size: 24, bold: true })], alignment: AlignmentType.RIGHT, spacing: { after: 300 } }),
      new Paragraph({ children: [new TextRun({ text: `от ${orgName}`, size: 24 })], alignment: AlignmentType.RIGHT, spacing: { after: 300 } }),
      new Paragraph({ children: [new TextRun({ text: 'ЗАЯВКА', bold: true, size: 32 })], alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
      new Paragraph({ children: [new TextRun({ text: 'на участие в грантовом конкурсе', size: 24 })], alignment: AlignmentType.CENTER, spacing: { after: 300 } }),
      makePara(`1. Наименование организации: ${orgName}`, { bold: true }),
      makePara(`2. Руководитель организации: ${director}`),
      makePara(`3. Название проекта: ${projectName}`),
      makePara(`4. Запрашиваемая сумма: ${amount} руб.`),
      makePara('5. Цель проекта: [Опишите цель]'),
      makePara('6. Задачи проекта:'),
      makePara('   — [Задача 1]'), makePara('   — [Задача 2]'), makePara('   — [Задача 3]'),
      makeBlankLine(),
      makePara('7. Ожидаемые результаты: [Опишите результаты]'),
      makeBlankLine(),
      makePara('8. Целевая аудитория: [Кому адресован проект]'),
      makeBlankLine(), makeBlankLine(),
      new Paragraph({ children: [new TextRun({ text: `Дата: ${today}`, size: 24 })], spacing: { after: 120 } }),
      new Paragraph({ children: [new TextRun({ text: `${role}: ________________ / ${director} /`, size: 24 })], spacing: { after: 120 } }),
      makePara('М.П.')
    ]}]
  })
  return doc
}

/* ───── Шаблон 4: Приказ о создании комиссии по приёмке ───── */
function generateOrderCommission(data) {
  const { Document, Paragraph, TextRun, AlignmentType } = docx

  const today   = data.date     || new Date().toLocaleDateString('ru-RU')
  const num     = data.number   || '___'
  const orgName = data.org      || '[Наименование организации]'
  const director = data.director || '[ФИО]'
  const role    = data.role     || 'Директор'
  const chair   = data.chair    || '[ФИО председателя комиссии]'
  const equipment = data.equipment || '[Наименование оборудования]'

  const doc = new Document({
    sections: [{ properties: {}, children: [
      new Paragraph({
        children: [new TextRun({ text: orgName.toUpperCase(), bold: true, size: 24 })],
        alignment: AlignmentType.CENTER, spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: 'ПРИКАЗ', bold: true, size: 32 })],
        alignment: AlignmentType.CENTER, spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: `от ${today} № ${num}`, size: 24 })],
        alignment: AlignmentType.CENTER, spacing: { after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: 'О создании комиссии по приёмке учебного оборудования', bold: true, size: 26 })],
        alignment: AlignmentType.CENTER, spacing: { after: 300 }
      }),
      makePara('В связи с поставкой учебного оборудования и в целях обеспечения надлежащей приёмки,'),
      makePara('ПРИКАЗЫВАЮ:', { bold: true }),
      makeBlankLine(),
      makePara(`1. Создать комиссию по приёмке учебного оборудования: ${equipment}.`),
      makeBlankLine(),
      makePara(`2. Назначить председателем комиссии: ${chair}.`),
      makeBlankLine(),
      makePara('3. Членами комиссии назначить:'),
      makePara('   — [ФИО, должность]'),
      makePara('   — [ФИО, должность]'),
      makeBlankLine(),
      makePara('4. Комиссии провести приёмку в соответствии с условиями договора, составить акт приёма-передачи.'),
      makeBlankLine(),
      makePara('5. Контроль за исполнением приказа оставляю за собой.'),
      makeBlankLine(), makeBlankLine(),
      new Paragraph({
        children: [
          new TextRun({ text: `${role}: `, size: 24 }),
          new TextRun({ text: `________________ / ${director} /`, size: 24 })
        ], spacing: { after: 120 }
      }),
      makeBlankLine(),
      makePara('М.П.')
    ]}]
  })
  return doc
}

/* ───── Шаблон 5: Служебная записка о закупке оборудования ───── */
function generateMemo(data) {
  const { Document, Paragraph, TextRun, AlignmentType } = docx

  const today     = data.date      || new Date().toLocaleDateString('ru-RU')
  const orgName   = data.org       || '[Наименование организации]'
  const toName    = data.toName    || '[Кому: должность, ФИО]'
  const fromName  = data.fromName  || '[От кого: должность, ФИО]'
  const equipment = data.equipment || '[Наименование оборудования]'
  const amount    = data.amount    || '[Сумма]'
  const reason    = data.reason    || 'обеспечения требований ФГОС и ФОП'

  const doc = new Document({
    sections: [{ children: [
      new Paragraph({
        children: [new TextRun({ text: orgName.toUpperCase(), bold: true, size: 22 })],
        alignment: AlignmentType.CENTER, spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Кому: ', size: 24, bold: true }),
          new TextRun({ text: toName, size: 24 })
        ], spacing: { after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'От: ', size: 24, bold: true }),
          new TextRun({ text: fromName, size: 24 })
        ], spacing: { after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Дата: ', size: 24, bold: true }),
          new TextRun({ text: today, size: 24 })
        ], spacing: { after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: 'СЛУЖЕБНАЯ ЗАПИСКА', bold: true, size: 28 })],
        alignment: AlignmentType.CENTER, spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: `о необходимости закупки учебного оборудования`, size: 24 })],
        alignment: AlignmentType.CENTER, spacing: { after: 300 }
      }),
      makePara(`В целях ${reason} прошу рассмотреть возможность закупки следующего учебного оборудования:`),
      makeBlankLine(),
      makePara(`Наименование: ${equipment}`, { bold: true }),
      makePara(`Ориентировочная стоимость: ${amount} руб.`),
      makeBlankLine(),
      makePara('Обоснование необходимости закупки:'),
      makePara('Данное оборудование необходимо для реализации образовательной программы в соответствии с требованиями ФГОС. Приобретение позволит обеспечить современную образовательную среду и повысить качество учебного процесса.'),
      makeBlankLine(),
      makePara('Источник финансирования: [субсидия / грант / внебюджетные средства]'),
      makeBlankLine(), makeBlankLine(),
      new Paragraph({
        children: [new TextRun({ text: `${fromName}:  ________________`, size: 24 })],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [new TextRun({ text: `Дата: ${today}`, size: 24 })],
        spacing: { after: 120 }
      })
    ]}]
  })
  return doc
}

/* ───── Универсальная функция скачивания ───── */
async function downloadDoc(doc, filename) {
  const { Packer } = docx
  const blob = await Packer.toBlob(doc)
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/* ───── Обработчики форм ───── */
function initGenerator() {
  // Форма 1: Приказ о рабочих программах
  document.getElementById('formOrder')?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const btn = e.target.querySelector('[type=submit]')
    btn.disabled = true; btn.textContent = 'Генерирую...'
    try {
      const doc = generateOrderPrograms({
        org:      document.getElementById('o_org').value,
        date:     document.getElementById('o_date').value,
        number:   document.getElementById('o_number').value,
        director: document.getElementById('o_director').value,
        role:     document.getElementById('o_role').value,
        year:     document.getElementById('o_year').value
      })
      await downloadDoc(doc, `Приказ_рабочие_программы_${document.getElementById('o_year').value}.docx`)
    } catch (err) { alert('Ошибка генерации: ' + err.message) }
    btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-download"></i> Скачать .docx'
  })

  // Форма 2: Акт приёмки оборудования
  document.getElementById('formAct')?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const btn = e.target.querySelector('[type=submit]')
    btn.disabled = true; btn.textContent = 'Генерирую...'
    try {
      const doc = generateActEquipment({
        org:       document.getElementById('a_org').value,
        date:      document.getElementById('a_date').value,
        number:    document.getElementById('a_number').value,
        supplier:  document.getElementById('a_supplier').value,
        equipment: document.getElementById('a_equipment').value,
        quantity:  document.getElementById('a_quantity').value,
        price:     document.getElementById('a_price').value,
        director:  document.getElementById('a_director').value,
        role:      document.getElementById('a_role').value
      })
      await downloadDoc(doc, 'Акт_приёмки_оборудования.docx')
    } catch (err) { alert('Ошибка генерации: ' + err.message) }
    btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-download"></i> Скачать .docx'
  })

  // Форма 3: Заявка на грант
  document.getElementById('formGrant')?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const btn = e.target.querySelector('[type=submit]')
    btn.disabled = true; btn.textContent = 'Генерирую...'
    try {
      const doc = generateGrantApplication({
        org:       document.getElementById('g_org').value,
        date:      document.getElementById('g_date').value,
        director:  document.getElementById('g_director').value,
        role:      document.getElementById('g_role').value,
        grantName: document.getElementById('g_grantname').value,
        project:   document.getElementById('g_project').value,
        amount:    document.getElementById('g_amount').value
      })
      await downloadDoc(doc, 'Заявка_на_грант.docx')
    } catch (err) { alert('Ошибка генерации: ' + err.message) }
    btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-download"></i> Скачать .docx'
  })

  // Форма 4: Приказ о создании комиссии
  document.getElementById('formCommission')?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const btn = e.target.querySelector('[type=submit]')
    btn.disabled = true; btn.textContent = 'Генерирую...'
    try {
      const doc = generateOrderCommission({
        org:       document.getElementById('c_org').value,
        date:      document.getElementById('c_date').value,
        number:    document.getElementById('c_number').value,
        director:  document.getElementById('c_director').value,
        role:      document.getElementById('c_role').value,
        chair:     document.getElementById('c_chair').value,
        equipment: document.getElementById('c_equipment').value
      })
      await downloadDoc(doc, 'Приказ_комиссия_приёмка.docx')
    } catch (err) { alert('Ошибка генерации: ' + err.message) }
    btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-download"></i> Скачать .docx'
  })

  // Форма 5: Служебная записка о закупке
  document.getElementById('formMemo')?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const btn = e.target.querySelector('[type=submit]')
    btn.disabled = true; btn.textContent = 'Генерирую...'
    try {
      const doc = generateMemo({
        org:       document.getElementById('m_org').value,
        date:      document.getElementById('m_date').value,
        toName:    document.getElementById('m_to').value,
        fromName:  document.getElementById('m_from').value,
        equipment: document.getElementById('m_equipment').value,
        amount:    document.getElementById('m_amount').value,
        reason:    document.getElementById('m_reason').value
      })
      await downloadDoc(doc, 'Служебная_записка_закупка.docx')
    } catch (err) { alert('Ошибка генерации: ' + err.message) }
    btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-download"></i> Скачать .docx'
  })
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof docx !== 'undefined') {
    initGenerator()
  } else {
    console.error('docx.js не загружен')
  }
})
