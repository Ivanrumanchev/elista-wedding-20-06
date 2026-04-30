# Sage Green Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Полностью переработать визуальный стиль свадебного лендинга с тёплой золотой палитры на шалфейно-зелёную, добавив арки, сердечки-разделители и pill-таймер по образцу `wd_example.jpg`.

**Architecture:** Все изменения только в `index.html` и `src/main.ts`. CSS-переменные заменяются глобально, секции получают новые классы фона, структура HTML минимально расширяется (heart-dividers, section-arch классы).

**Tech Stack:** Vanilla HTML/CSS, TypeScript 5.4, `npm run build` (tsc), `npm run serve`

---

### Task 1: Заменить CSS-переменные (цветовая палитра)

**Files:**
- Modify: `index.html:15-33` (блок `:root {}`)

**Шаг 1: Заменить весь блок `:root` в index.html**

Найти:
```css
:root {
  --cream:       #faf6f1;
  --ivory:       #f5ede0;
  --gold:        #c9a96e;
  --gold-light:  #e8d5b0;
  --gold-dark:   #a07c40;
  --brown:       #5c3d2e;
  --dark:        #2b1d11;
  --text:        #4a3728;
  --text-light:  #8a7060;
  --white:       #ffffff;

  --font-serif:  'Cormorant Garamond', Georgia, serif;
  --font-sans:   'Montserrat', sans-serif;
  --font-script: 'Pinyon Script', cursive;

  --section-pad: clamp(4rem, 10vw, 8rem);
  --radius:      4px;
}
```

Заменить на:
```css
:root {
  --sage:        #4a7a78;
  --sage-dark:   #3a6360;
  --sage-light:  #6a9e9b;
  --white:       #ffffff;
  --off-white:   #f5f5f3;
  --text:        #2c2c2c;
  --text-muted:  #666660;
  --text-on-sage:#ffffff;

  --font-serif:  'Cormorant Garamond', Georgia, serif;
  --font-sans:   'Montserrat', sans-serif;
  --font-script: 'Pinyon Script', cursive;

  --section-pad: clamp(4rem, 10vw, 8rem);
  --radius:      4px;
}
```

**Шаг 2: Проверить компиляцию**

```bash
npm run build
```
Ожидание: exit 0, ноль ошибок.

**Шаг 3: Commit**

```bash
git add index.html
git commit -m "style: replace warm palette with sage green CSS variables"
```

---

### Task 2: Обновить базовые стили (body, типографика, nav, кнопки)

**Files:**
- Modify: `index.html` — секции CSS: body, `.section-title`, `.section-subtitle`, `.gold-line`, `.ornament`, `.nav`, `.btn`

**Шаг 1: Обновить `body` и базовую типографику**

```css
body {
  font-family: var(--font-sans);
  background: var(--off-white);
  color: var(--text);
  line-height: 1.7;
  overflow-x: hidden;
}

h1, h2, h3 { font-family: var(--font-serif); font-weight: 300; }

.section-title {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  color: var(--sage);
  text-align: center;
  margin-bottom: 0.5rem;
  font-family: var(--font-sans);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

/* На зелёном фоне заголовок белый */
.section--sage .section-title { color: var(--text-on-sage); }

.section-subtitle {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  text-align: center;
  margin-bottom: 3rem;
  display: block;
}
.section--sage .section-subtitle { color: rgba(255,255,255,0.7); }

/* Убрать .gold-line — заменить на .sage-line */
.sage-line {
  width: 40px;
  height: 2px;
  background: var(--sage-light);
  margin: 1rem auto 2rem;
}
.section--sage .sage-line { background: rgba(255,255,255,0.4); }
```

**Шаг 2: Обновить навигацию**

```css
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  padding: 1.2rem 2rem;
  background: rgba(74,122,120,0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.nav a { color: rgba(255,255,255,0.8); }
.nav a:hover { color: var(--white); }

/* mobile nav */
.nav-links { /* сохранить структуру, изменить цвета */ }
/* На мобайле: background: rgba(58,99,96,0.97) */
```

**Шаг 3: Обновить кнопки**

```css
.btn {
  display: inline-block;
  padding: 0.8rem 2.5rem;
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-decoration: none;
  border: 2px solid var(--sage);
  border-radius: 999px;
  color: var(--sage);
  background: transparent;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}
.btn:hover { background: var(--sage); color: var(--white); }

/* Кнопка на зелёном фоне */
.section--sage .btn {
  border-color: var(--white);
  color: var(--white);
}
.section--sage .btn:hover { background: var(--white); color: var(--sage); }
```

**Шаг 4: В HTML — заменить все `class="gold-line"` на `class="sage-line"`** (4 вхождения)

**Шаг 5: Проверить компиляцию**

```bash
npm run build
```

**Шаг 6: Commit**

```bash
git add index.html
git commit -m "style: update base styles, nav, buttons to sage green"
```

---

### Task 3: Hero и Save the Date секции

**Files:**
- Modify: `index.html` — CSS `.hero`, `.save-date-section`, `.save-date-heading`, `.save-date-month`, `.calendar-*`
- Modify: `index.html` — HTML hero и save-date секции
- Modify: `src/main.ts:122-133` — цвет SVG сердечек в календаре

**Шаг 1: Обновить стили hero**

```css
.hero {
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  background: var(--off-white);
  overflow: hidden;
}

/* Убрать .hero::before, .hero::after с gold-градиентом — не нужны */

.hero-eyebrow {
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--sage-light);
  margin-bottom: 2rem;
}

.hero-names {
  font-family: var(--font-script);
  font-size: clamp(3.5rem, 12vw, 8rem);
  color: var(--sage-dark);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.hero-ampersand { color: var(--sage-light); }

.hero-date { color: var(--text-muted); letter-spacing: 0.15em; }
.hero-venue-name { color: var(--sage); letter-spacing: 0.2em; text-transform: uppercase; }
.hero-scroll { color: var(--text-muted); }
```

**Шаг 2: Добавить `.section--sage` класс к Save the Date и обновить его CSS**

В HTML изменить:
```html
<section class="save-date-section section--sage" id="save-date">
```

CSS для секции:
```css
.save-date-section {
  padding: var(--section-pad) 2rem calc(var(--section-pad) + 60px);
  background: var(--sage);
  text-align: center;
  position: relative;
}

/* Арка снизу — белый полукруг, перекрывает переход */
.save-date-section::after {
  content: '';
  position: absolute;
  bottom: 0; left: -5%;
  width: 110%;
  height: 80px;
  background: var(--off-white);
  border-radius: 50% 50% 0 0;
}

.save-date-heading {
  font-family: var(--font-sans);
  font-size: clamp(2.5rem, 10vw, 5rem);
  font-weight: 700;
  color: var(--white);
  line-height: 1;
  letter-spacing: 0.25em;
  text-transform: uppercase;
}

.save-date-month {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255,255,255,0.7);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  display: block;
  margin: 1.5rem 0 1rem;
}

.calendar-weekday { color: rgba(255,255,255,0.6); }
.calendar-day { color: rgba(255,255,255,0.9); }
.calendar-day--highlighted { color: var(--white); isolation: isolate; }
```

**Шаг 3: Обновить цвет SVG сердечек в `src/main.ts`**

Найти строки 126-132 с `stroke="var(--gold)"` и `fill="rgba(201,169,110,0.08)"`:

```typescript
cell.innerHTML = `
  ${d}
  <svg class="calendar-heart" viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="${heartPath}" stroke="rgba(255,255,255,0.9)" stroke-width="3" fill="rgba(255,255,255,0.12)"/>
  </svg>
  <svg class="calendar-heart-ripple calendar-heart-ripple--1" viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="${heartPath}" stroke="rgba(255,255,255,0.7)" stroke-width="2" fill="none"/>
  </svg>
  <svg class="calendar-heart-ripple calendar-heart-ripple--2" viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="${heartPath}" stroke="rgba(255,255,255,0.5)" stroke-width="2" fill="none"/>
  </svg>
`;
```

**Шаг 4: В HTML — обновить текст заголовка save-date**

```html
<h2 class="save-date-heading animate-on-scroll">КОГДА?</h2>
```

**Шаг 5: Проверить компиляцию**

```bash
npm run build
```

**Шаг 6: Commit**

```bash
git add index.html src/main.ts
git commit -m "style: hero off-white, save-date section sage green with arch"
```

---

### Task 4: Обратный отсчёт — pill-бейджи

**Files:**
- Modify: `index.html` — CSS `.countdown-section`, `.countdown-grid`, `.countdown-item`, `.countdown-number`, `.countdown-label`, `.countdown-separator`

**Шаг 1: Обновить стили countdown**

```css
.countdown-section {
  padding: var(--section-pad) 2rem;
  background: var(--off-white);
  color: var(--text);
  text-align: center;
}

.countdown-section .section-title { color: var(--sage); }
.countdown-section .section-subtitle { color: var(--text-muted); }

.countdown-grid {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.countdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  background: var(--sage);
  border-radius: 999px;
  padding: 1.2rem 1.5rem;
  min-width: 70px;
}

.countdown-number {
  font-family: var(--font-sans);
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  font-weight: 700;
  color: var(--white);
  line-height: 1;
  min-width: 2ch;
  text-align: center;
}

.countdown-label {
  font-size: 0.55rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.75);
}

/* Убрать countdown-separator — не нужен в pill-стиле */
.countdown-separator { display: none; }
```

**Шаг 2: Проверить компиляцию и commit**

```bash
npm run build
git add index.html
git commit -m "style: countdown pill badges on off-white background"
```

---

### Task 5: История, Галерея, Программа, Место, RSVP, Футер

**Files:**
- Modify: `index.html` — CSS и HTML оставшихся секций

**Шаг 1: История (sage)**

В HTML добавить класс:
```html
<section class="story-section section--sage" id="story">
```

CSS:
```css
.story-section {
  padding: var(--section-pad) clamp(1.5rem, 8vw, 6rem) calc(var(--section-pad) + 60px);
  background: var(--sage);
  position: relative;
}
/* Арка снизу */
.story-section::after {
  content: '';
  position: absolute;
  bottom: 0; left: -5%;
  width: 110%;
  height: 80px;
  background: var(--white);
  border-radius: 50% 50% 0 0;
}

.story-year { color: rgba(255,255,255,0.5); }
.story-subtitle { color: rgba(255,255,255,0.6); }
.story-text { color: rgba(255,255,255,0.9); }
.story-divider span { color: rgba(255,255,255,0.4); }
.story-divider::before, .story-divider::after { background: rgba(255,255,255,0.2); }
```

**Шаг 2: Галерея (white)**

```css
.gallery-section {
  padding: var(--section-pad) clamp(1rem, 5vw, 4rem);
  background: var(--white);
}
/* placeholder-ы: сделать серо-зелёными */
.gallery-placeholder { background: var(--ph-color, #c5dbd9); }
```

Обновить цвета плейсхолдеров в HTML (9 элементов) с gold на sage-тона:
- `#c5dbd9`, `#a8c9c7`, `#8ab8b6`, `#6aa6a4` (вариации sage-light)

**Шаг 3: Программа (sage)**

```html
<section class="schedule-section section--sage" id="schedule">
```

```css
.schedule-section {
  padding: var(--section-pad) clamp(1.5rem, 8vw, 6rem) calc(var(--section-pad) + 60px);
  background: var(--sage);
  position: relative;
}
.schedule-section::after {
  content: '';
  position: absolute;
  bottom: 0; left: -5%;
  width: 110%;
  height: 80px;
  background: var(--white);
  border-radius: 50% 50% 0 0;
}

.schedule-item { border-bottom: 1px solid rgba(255,255,255,0.15); }
.schedule-time { color: rgba(255,255,255,0.7); }
.schedule-title { color: var(--white); }
.schedule-icon { /* сохранить */ }
```

**Шаг 4: Место (white)**

```css
.venue-section {
  padding: var(--section-pad) clamp(1.5rem, 8vw, 6rem);
  background: var(--white);
  text-align: center;
}
.venue-card {
  border: 1px solid rgba(74,122,120,0.2);
  background: var(--off-white);
}
.venue-name { color: var(--sage-dark); }
.venue-address { color: var(--text-muted); }
```

**Шаг 5: RSVP (sage)**

```html
<section class="rsvp-section section--sage" id="rsvp">
```

```css
.rsvp-section {
  padding: var(--section-pad) clamp(1.5rem, 8vw, 6rem) calc(var(--section-pad) + 60px);
  background: var(--sage);
  text-align: center;
  position: relative;
}
.rsvp-section::after {
  content: '';
  position: absolute;
  bottom: 0; left: -5%;
  width: 110%;
  height: 80px;
  background: var(--sage-dark);
  border-radius: 50% 50% 0 0;
}

.rsvp-intro { color: rgba(255,255,255,0.8); }
.form-label { color: rgba(255,255,255,0.7); }
.form-input, .form-select, .form-textarea {
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.25);
  color: var(--white);
}
.form-input::placeholder { color: rgba(255,255,255,0.4); }
.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: rgba(255,255,255,0.6);
}
.radio-label { color: rgba(255,255,255,0.9); }
```

Обновить заголовок секции RSVP в HTML:
```html
<h2 class="section-title animate-on-scroll">Анкета гостя</h2>
<span class="section-subtitle animate-on-scroll">пожалуйста заполните анкету, чтобы мы знали, что вы придёте</span>
```

**Шаг 6: Футер (sage-dark)**

```css
.footer {
  padding: 3rem 2rem;
  background: var(--sage-dark);
  text-align: center;
}
.footer-names { color: rgba(255,255,255,0.9); }
.footer-date { color: rgba(255,255,255,0.4); }
.footer-hashtag { color: rgba(255,255,255,0.3); }
```

**Шаг 7: Уведомления — обновить цвета**

```css
.notification--success { background: var(--sage-dark); color: rgba(255,255,255,0.9); }
.notification--error { background: #8b3a3a; color: #f5d0d0; }
```

**Шаг 8: Проверить компиляцию**

```bash
npm run build
```

**Шаг 9: Commit**

```bash
git add index.html
git commit -m "style: story/schedule/rsvp sage, gallery/venue white, footer sage-dark"
```

---

### Task 6: Белые сердечки-разделители + финальные правки

**Files:**
- Modify: `index.html` — HTML (добавить heart-dividers), CSS (`.section-heart`, анимации, адаптив)

**Шаг 1: Добавить CSS для сердечек-разделителей**

```css
.section-heart {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem 0;
  position: relative;
  z-index: 1;
}
.section-heart svg {
  width: 28px;
  height: 28px;
}
```

**Шаг 2: Добавить HTML сердечки в конце каждой зелёной секции**

SVG сердечко (outline, белое):
```html
<div class="section-heart">
  <svg viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M50 30 C50 15 37 5 25 10 C13 15 5 27 5 38 C5 55 25 70 50 82 C75 70 95 55 95 38 C95 27 87 15 75 10 C63 5 50 15 50 30 Z"
          stroke="white" stroke-width="4" fill="rgba(255,255,255,0.15)"/>
  </svg>
</div>
```

Вставить перед закрывающим `</section>` в: save-date, story, schedule, rsvp секциях.

**Шаг 3: Обновить mobile-адаптив (убрать gold-зависимые цвета)**

```css
@media (max-width: 640px) {
  :root { --section-pad: 3rem; }
  .nav-links {
    background: rgba(58,99,96,0.97);
  }
  .nav-links a {
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
}
```

**Шаг 4: Добавить `prefers-reduced-motion` для ripple-анимаций**

```css
@media (prefers-reduced-motion: reduce) {
  .calendar-heart-ripple--1,
  .calendar-heart-ripple--2 {
    animation: none;
  }
}
```

**Шаг 5: Проверить компиляцию**

```bash
npm run build
```

**Шаг 6: Финальный commit**

```bash
git add index.html src/main.ts
git commit -m "style: add heart dividers, arch transitions, reduced-motion guard"
```

---

## Итоговая проверка

Запустить локальный сервер и визуально пройти все секции:

```bash
npm run serve
```

Чеклист:
- [ ] Nav — полупрозрачный зелёный
- [ ] Hero — светлый фон, зелёные акценты
- [ ] Save the Date — зелёный фон, белый календарь, пульсирующее белое сердечко, арка снизу
- [ ] Countdown — светлый фон, pill-бейджи
- [ ] История — зелёный фон, белый текст, арка снизу
- [ ] Галерея — белый фон
- [ ] Программа — зелёный фон, арка снизу
- [ ] Место — белый фон
- [ ] RSVP — зелёный фон, поля с белым текстом, арка снизу
- [ ] Footer — тёмно-зелёный
- [ ] Сердечки-разделители видны в конце зелёных секций
- [ ] Переходы между секциями плавные (арки)
