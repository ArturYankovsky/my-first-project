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
  const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } = docx

  const today = data.date || new Date().toLocaleDateString('ru-RU')
  const num = data.number || '___'
  const orgName = data.org || '[Наименование организации]'
  const director = data.director || '[ФИО директора]'
  const year = data.year || new Date().getFullYear()

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [new TextRun({ text: orgName.toUpperCase(), bold: true, size: 24 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 }
        }),
        new Paragraph({
          children: [new TextRun({ text: `ПРИКАЗ`, bold: true, size: 32 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 }
        }),
        new Paragraph({
          children: [new TextRun({ text: `от ${today} № ${num}`, size: 24 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: `Об утверждении рабочих программ на ${year}/${+year + 1} учебный год`, bold: true, size: 26 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 }
        }),
        makePara(`В целях обеспечения реализации образовательных программ в соответствии с требованиями ФГОС и ФОП,`),
        makePara('ПРИКАЗЫВАЮ:', { bold: true }),
        makeBlankLine(),
        makePara(`1. Утвердить рабочие программы по образовательным областям (учебным предметам) на ${year}/${+year + 1} учебный год согласно приложению к настоящему приказу.`),
        makeBlankLine(),
        makePara('2. Педагогическим работникам осуществлять образовательную деятельность в соответствии с утверждёнными рабочими программами.'),
        makeBlankLine(),
        makePara('3. Заместителю директора (заведующей) по учебно-воспитательной работе обеспечить контроль исполнения настоящего приказа.'),
        makeBlankLine(),
        makePara('4. Контроль за исполнением настоящего приказа оставляю за собой.'),
        makeBlankLine(),
        makeBlankLine(),
        new Paragraph({
          children: [
            new TextRun({ text: 'Директор / Заведующая: ', size: 24 }),
            new TextRun({ text: `________________ / ${director} /`, size: 24 })
          ],
          spacing: { after: 120 }
        }),
        makeBlankLine(),
        makePara('М.П.'),
        makeBlankLine(),
        makeBlankLine(),
        makePara('Приложение к приказу'),
        makePara('ПЕРЕЧЕНЬ РАБОЧИХ ПРОГРАММ', { bold: true }),
        makeBlankLine(),
        makePara('[Заполняется образовательной организацией]')
      ]
    }]
  })
  return doc
}

/* ───── Шаблон 2: Акт приёма-передачи оборудования ───── */
function generateActEquipment(data) {
  const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } = docx

  const today = data.date || new Date().toLocaleDateString('ru-RU')
  const num = data.number || '___'
  const orgName = data.org || '[Наименование организации]'
  const supplier = data.supplier || 'ООО «ЮВЕНТА»'
  const equipment = data.equipment || '[Наименование оборудования]'
  const quantity = data.quantity || '1'
  const price = data.price || '[Сумма]'
  const director = data.director || '[ФИО директора]'

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          children: [new TextRun({ text: `АКТ № ${num}`, bold: true, size: 32 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: 'приёма-передачи учебного оборудования', bold: true, size: 26 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: `от ${today} г.`, size: 24 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 }
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
        makeBlankLine(),
        makeBlankLine(),
        new Paragraph({
          children: [
            new TextRun({ text: 'Передал (Поставщик):  ', size: 24 }),
            new TextRun({ text: `________________ / _______________________ /`, size: 24 })
          ],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Принял (Получатель):  `, size: 24 }),
            new TextRun({ text: `________________ / ${director} /`, size: 24 })
          ],
          spacing: { after: 120 }
        }),
        makePara('М.П.')
      ]
    }]
  })
  return doc
}

/* ───── Шаблон 3: Заявка на участие в гранте ───── */
function generateGrantApplication(data) {
  const { Document, Paragraph, TextRun, AlignmentType } = docx

  const today = data.date || new Date().toLocaleDateString('ru-RU')
  const orgName = data.org || '[Наименование организации]'
  const director = data.director || '[ФИО руководителя]'
  const projectName = data.project || '[Название проекта]'
  const amount = data.amount || '[Сумма]'
  const grantName = data.grantName || '[Название гранта]'

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          children: [new TextRun({ text: `В конкурсную комиссию`, size: 24 })],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 60 }
        }),
        new Paragraph({
          children: [new TextRun({ text: grantName, size: 24, bold: true })],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 300 }
        }),
        new Paragraph({
          children: [new TextRun({ text: `от ${orgName}`, size: 24 })],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 300 }
        }),
        new Paragraph({
          children: [new TextRun({ text: 'ЗАЯВКА', bold: true, size: 32 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: 'на участие в грантовом конкурсе', size: 24 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 }
        }),
        makePara(`1. Наименование организации: ${orgName}`, { bold: true }),
        makePara(`2. Руководитель организации: ${director}`),
        makePara(`3. Название проекта: ${projectName}`),
        makePara(`4. Запрашиваемая сумма: ${amount} руб.`),
        makePara('5. Цель проекта: [Опишите цель]'),
        makePara('6. Задачи проекта:'),
        makePara('   — [Задача 1]'),
        makePara('   — [Задача 2]'),
        makePara('   — [Задача 3]'),
        makeBlankLine(),
        makePara('7. Ожидаемые результаты: [Опишите результаты]'),
        makeBlankLine(),
        makePara('8. Целевая аудитория: [Кому адресован проект]'),
        makeBlankLine(),
        makeBlankLine(),
        new Paragraph({
          children: [
            new TextRun({ text: `Дата: ${today}`, size: 24 })
          ],
          spacing: { after: 120 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Руководитель: ________________ / ${director} /`, size: 24 })
          ],
          spacing: { after: 120 }
        }),
        makePara('М.П.')
      ]
    }]
  })
  return doc
}

/* ───── Универсальная функция скачивания ───── */
async function downloadDoc(doc, filename) {
  const { Packer } = docx
  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
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
    btn.disabled = true
    btn.textContent = 'Генерирую...'
    try {
      const doc = generateOrderPrograms({
        org: document.getElementById('o_org').value,
        date: document.getElementById('o_date').value,
        number: document.getElementById('o_number').value,
        director: document.getElementById('o_director').value,
        year: document.getElementById('o_year').value
      })
      await downloadDoc(doc, `Приказ_рабочие_программы_${document.getElementById('o_year').value}.docx`)
    } catch (err) {
      alert('Ошибка генерации: ' + err.message)
    }
    btn.disabled = false
    btn.textContent = 'Скачать .docx'
  })

  // Форма 2: Акт приёмки оборудования
  document.getElementById('formAct')?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const btn = e.target.querySelector('[type=submit]')
    btn.disabled = true
    btn.textContent = 'Генерирую...'
    try {
      const doc = generateActEquipment({
        org: document.getElementById('a_org').value,
        date: document.getElementById('a_date').value,
        number: document.getElementById('a_number').value,
        supplier: document.getElementById('a_supplier').value,
        equipment: document.getElementById('a_equipment').value,
        quantity: document.getElementById('a_quantity').value,
        price: document.getElementById('a_price').value,
        director: document.getElementById('a_director').value
      })
      await downloadDoc(doc, `Акт_приёмки_оборудования.docx`)
    } catch (err) {
      alert('Ошибка генерации: ' + err.message)
    }
    btn.disabled = false
    btn.textContent = 'Скачать .docx'
  })

  // Форма 3: Заявка на грант
  document.getElementById('formGrant')?.addEventListener('submit', async (e) => {
    e.preventDefault()
    const btn = e.target.querySelector('[type=submit]')
    btn.disabled = true
    btn.textContent = 'Генерирую...'
    try {
      const doc = generateGrantApplication({
        org: document.getElementById('g_org').value,
        date: document.getElementById('g_date').value,
        director: document.getElementById('g_director').value,
        grantName: document.getElementById('g_grantname').value,
        project: document.getElementById('g_project').value,
        amount: document.getElementById('g_amount').value
      })
      await downloadDoc(doc, `Заявка_на_грант.docx`)
    } catch (err) {
      alert('Ошибка генерации: ' + err.message)
    }
    btn.disabled = false
    btn.textContent = 'Скачать .docx'
  })
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof docx !== 'undefined') {
    initGenerator()
  } else {
    console.error('docx.js не загружен')
  }
})
