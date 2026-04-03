# Desktop Responsive Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Добавить один `@media (min-width: 1024px)` блок в конце `<style>` тега в `index.html`, чтобы страница корректно отображалась на десктопных экранах.

**Architecture:** Все изменения — это CSS-only, только один `@media` блок в конце существующего `<style>`. Мобильные стили не трогаем. TypeScript не меняем.

**Tech Stack:** Vanilla HTML/CSS, без фреймворков. Проверка — `npm run serve` + браузер на 1280px.

---

### Task 1: Hero на десктопе

**Files:**
- Modify: `index.html` — блок `@media (min-width: 1024px)` в конце `<style>` (перед `</style>`)

**Step 1: Найти конец тега `<style>`**

В `index.html` найти строку `</style>` (она на ~964). Вставить новый `@media` блок перед ней.

**Step 2: Добавить стили Hero**

```css
@media (min-width: 1024px) {

  /* ── Hero ──────────────────────────────────────────────────── */
  .hero-photo {
    border-radius: 0 0 10% 10%;
  }
  .hero-photo-wrap::after {
    border-radius: 0 0 10% 10%;
  }
  .hero-content {
    max-width: 900px;
    margin: 0 auto;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
  }

}
```

**Step 3: Запустить сервер и проверить**

```bash
npm run serve
```

Открыть браузер, выставить ширину окна 1280px. Проверить: скругление низа hero мягкое (~10%), текст не уходит за края.

**Step 4: Commit**

```bash
git add index.html
git commit -m "style(desktop): hero border-radius and content max-width"
```

---

### Task 2: Countdown на десктопе

**Files:**
- Modify: `index.html` — добавить в существующий `@media (min-width: 1024px)` блок

**Step 1: Добавить стили Countdown в media-блок**

```css
  /* ── Countdown ─────────────────────────────────────────────── */
  .countdown-wrapper {
    max-width: 650px;
    margin: 0 auto;
  }
  .countdown-number {
    font-size: 4rem;
  }
  .countdown-label {
    font-size: 1.1rem;
  }
```

**Step 2: Проверить**

Countdown должен быть центрированным квадратом ~650px, цифры крупнее.

**Step 3: Commit**

```bash
git add index.html
git commit -m "style(desktop): countdown max-width and larger numbers"
```

---

### Task 3: Save the Date (календарь) на десктопе

**Files:**
- Modify: `index.html` — добавить в существующий `@media (min-width: 1024px)` блок

**Step 1: Добавить стили**

```css
  /* ── Save the Date ─────────────────────────────────────────── */
  .save-date-section {
    max-width: 650px;
    margin-left: auto;
    margin-right: auto;
    border-radius: 40px;
  }
```

**Step 2: Проверить**

Секция календаря центрирована, не растягивается на всю ширину.

**Step 3: Commit**

```bash
git add index.html
git commit -m "style(desktop): save-date section max-width"
```

---

### Task 4: Timeline (Программа) — горизонтальный лейаут на десктопе

**Files:**
- Modify: `index.html` — добавить в существующий `@media (min-width: 1024px)` блок

**Step 1: Добавить горизонтальный лейаут timeline**

```css
  /* ── Timeline (горизонтальный) ─────────────────────────────── */
  .schedule-section {
    padding: 3rem clamp(2rem, 5vw, 6rem);
  }
  .schedule-list {
    flex-direction: row;
    align-items: flex-start;
    max-width: 960px;
    margin: 0 auto;
    gap: 0;
  }
  .timeline-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    grid-template-columns: unset;
    padding: 0;
  }
  .timeline-icon {
    justify-content: center;
    padding-right: 0;
    padding-bottom: 0.75rem;
    align-self: auto;
  }
  .timeline-icon img {
    width: 48px;
    height: 48px;
  }
  .timeline-spine {
    width: 100%;
    height: 40px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  /* Горизонтальная линия вместо вертикальной */
  .timeline-spine::before {
    top: 50%;
    bottom: unset;
    left: 0;
    right: 0;
    width: 100%;
    height: 2px;
    transform: translateY(-50%);
  }
  .timeline-dot {
    margin-top: 0;
    flex-shrink: 0;
    z-index: 1;
  }
  .timeline-content {
    padding-left: 0;
    padding-top: 0.75rem;
    align-items: center;
    text-align: center;
    min-width: 0;
  }
  .timeline-time {
    font-size: 1.3rem;
  }
  .timeline-title {
    font-size: 0.9rem;
  }
```

**Step 2: Проверить**

События в программе должны стоять горизонтально в ряд: иконка → горизонтальная линия с точкой → время и название. Все 5 событий должны умещаться в ряд.

**Step 3: Commit**

```bash
git add index.html
git commit -m "style(desktop): horizontal timeline layout"
```

---

### Task 5: Venue (Место проведения) на десктопе

**Files:**
- Modify: `index.html` — добавить в существующий `@media (min-width: 1024px)` блок

**Step 1: Добавить стили Venue**

```css
  /* ── Venue ─────────────────────────────────────────────────── */
  .venue-section {
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }
  .venue-photo-wrap img {
    width: 35%;
  }
```

**Step 2: Проверить**

Секция venue центрирована, фотографии немного уменьшены (35% от ширины контейнера), перекрытие смотрится пропорционально.

**Step 3: Commit**

```bash
git add index.html
git commit -m "style(desktop): venue section max-width and photo sizing"
```

---

### Task 6: Details, Dresscode и прочие секции на десктопе

**Files:**
- Modify: `index.html` — добавить в существующий `@media (min-width: 1024px)` блок

**Step 1: Добавить стили**

```css
  /* ── Details ───────────────────────────────────────────────── */
  .details-section {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  /* ── Dress Code ─────────────────────────────────────────────── */
  .dresscode-section {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }
  .dresscode-text {
    max-width: 560px;
    margin-left: auto;
    margin-right: auto;
  }
  .dresscode-swatches {
    gap: 0;
  }

  /* ── Finale ─────────────────────────────────────────────────── */
  .finale-text {
    font-size: clamp(3rem, 5vw, 7rem);
    margin-top: -180px;
  }

}
/* конец @media (min-width: 1024px) */
```

**Step 2: Проверить**

Все секции должны быть центрированы и не растягиваться за 800-900px в ширину.

**Step 3: Финальная проверка всей страницы**

Прокрутить всю страницу при ширине 1280px и 1440px. Убедиться что:
- [ ] Hero — мягкое скругление внизу
- [ ] Save the Date — компактный, не на всю ширину
- [ ] Countdown — квадрат ~650px по центру
- [ ] Timeline — горизонтальный ряд из 5 событий
- [ ] Venue — фото с умеренным перекрытием
- [ ] Details, Dresscode — не расползаются

Затем проверить при 375px (iPhone SE) — мобильные стили должны быть нетронуты.

**Step 4: Commit**

```bash
git add index.html
git commit -m "style(desktop): details, dresscode, finale max-width constraints"
```
