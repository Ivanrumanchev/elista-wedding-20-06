# Save the Date Calendar — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a "Save the Date" section with a June 2026 calendar and SVG heart around the 10th, placed between Hero and Countdown.

**Architecture:** HTML shell in `index.html`, CSS in the existing `<style>` block, calendar DOM generation in `main.ts`. The function reads `WEDDING_CONFIG.date` to know which month/day to highlight. No new files needed.

**Tech Stack:** Vanilla TypeScript, HTML, CSS. Fonts already loaded: Cormorant Garamond, Pinyon Script, Montserrat.

---

## June 2026 calendar reference

June 1, 2026 = Monday. Grid (ПН..ВС):

```
ПН  ВТ  СР  ЧТ  ПТ  СБ  ВС
 1   2   3   4   5   6   7
 8   9  10  11  12  13  14   ← 10 is the wedding date (Wednesday)
15  16  17  18  19  20  21
22  23  24  25  26  27  28
29  30
```

---

### Task 1: Add CSS for the Save the Date section

**Files:**
- Modify: `index.html` — inside the existing `<style>` block, before the closing `</style>` tag (around line 776)

**Step 1: Add the following CSS block**

Insert this immediately before `</style>`:

```css
/* ── Save the Date (Календарь) ────────────────────────────────── */
.save-date-section {
  padding: var(--section-pad) 2rem;
  background: var(--cream);
  text-align: center;
}

.save-date-heading {
  font-family: var(--font-serif);
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 300;
  color: var(--brown);
  line-height: 1;
  letter-spacing: 0.1em;
}

.save-date-month {
  font-family: var(--font-script);
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  color: var(--gold);
  display: block;
  margin: 1.5rem 0 1rem;
}

.calendar-grid {
  display: inline-grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
  margin: 0 auto;
  max-width: 380px;
  width: 100%;
}

.calendar-weekday {
  font-family: var(--font-sans);
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-light);
  padding: 0.5rem 0;
  text-align: center;
}

.calendar-day {
  font-family: var(--font-serif);
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  font-weight: 300;
  color: var(--text);
  padding: 0.6rem 0;
  text-align: center;
  position: relative;
  line-height: 1;
}

.calendar-day--empty {
  visibility: hidden;
}

.calendar-day--highlighted {
  font-weight: 600;
  color: var(--brown);
  z-index: 1;
}

.calendar-day--highlighted .calendar-heart {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 3em;
  height: 2.8em;
  pointer-events: none;
  z-index: -1;
  overflow: visible;
}
```

**Step 2: Verify** — open `index.html` in editor, confirm CSS was added before `</style>`.

**Step 3: Commit**

```bash
git add index.html
git commit -m "style: add save-date calendar CSS"
```

---

### Task 2: Add HTML shell in index.html

**Files:**
- Modify: `index.html` — insert `<section>` after `</section>` of Hero (line ~813) and before the countdown `<section>` (line ~816)

**Step 1: Find the insertion point**

In `index.html`, find this comment block:
```html
  <!-- Обратный отсчёт -->
  <section class="countdown-section" id="countdown">
```

**Step 2: Insert the section before it**

```html
  <!-- Save the Date -->
  <section class="save-date-section" id="save-date">
    <h2 class="save-date-heading animate-on-scroll">
      Save<br>the Date
    </h2>
    <span class="save-date-month animate-on-scroll" id="save-date-month"></span>
    <div class="gold-line animate-on-scroll"></div>
    <div class="calendar-grid animate-on-scroll" id="calendar-grid"></div>
    <div class="gold-line animate-on-scroll"></div>
  </section>

```

**Step 3: Verify** — check the HTML structure in editor: section is between Hero `</section>` and countdown `<section>`.

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add save-date section HTML shell"
```

---

### Task 3: Add renderSaveDateCalendar() to main.ts

**Files:**
- Modify: `src/main.ts`
  - Add function `renderSaveDateCalendar()` after `renderSchedule()` (around line 69)
  - Call it inside `DOMContentLoaded` after `renderSchedule()` call (around line 202)

**Step 1: Add the function after `renderSchedule()` (after line 69)**

```typescript
// ─── Календарь Save the Date ──────────────────────────────────────────────────

function renderSaveDateCalendar(): void {
  const grid = document.getElementById('calendar-grid');
  const monthLabel = document.getElementById('save-date-month');
  if (!grid || !monthLabel) return;

  const date = WEDDING_CONFIG.date;
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based
  const highlightDay = date.getDate();

  // Month label in Russian
  const monthNames = [
    'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
    'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь',
  ];
  monthLabel.textContent = `${monthNames[month]} ${year}`;

  // Weekday headers (Mon-first)
  const weekdays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
  const fragment = document.createDocumentFragment();

  weekdays.forEach((day) => {
    const cell = document.createElement('div');
    cell.className = 'calendar-weekday';
    cell.textContent = day;
    fragment.appendChild(cell);
  });

  // First day of the month: getDay() returns 0=Sun..6=Sat, convert to Mon=0..Sun=6
  const firstDate = new Date(year, month, 1);
  const firstDow = (firstDate.getDay() + 6) % 7; // Mon=0, Sun=6

  // Empty cells before first day
  for (let i = 0; i < firstDow; i++) {
    const empty = document.createElement('div');
    empty.className = 'calendar-day calendar-day--empty';
    empty.textContent = '·';
    fragment.appendChild(empty);
  }

  // Day cells
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');

    if (d === highlightDay) {
      cell.className = 'calendar-day calendar-day--highlighted';
      cell.innerHTML = `
        ${d}
        <svg class="calendar-heart" viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M50 30 C50 15 37 5 25 10 C13 15 5 27 5 38 C5 55 25 70 50 82 C75 70 95 55 95 38 C95 27 87 15 75 10 C63 5 50 15 50 30 Z"
                stroke="var(--gold)" stroke-width="3" fill="rgba(201,169,110,0.08)"/>
        </svg>
      `;
    } else {
      cell.className = 'calendar-day';
      cell.textContent = String(d);
    }

    fragment.appendChild(cell);
  }

  grid.appendChild(fragment);
}
```

**Step 2: Call the function in DOMContentLoaded**

Find in `main.ts`:
```typescript
  renderSchedule();
```

Add the call right after it:
```typescript
  renderSchedule();
  renderSaveDateCalendar();
```

**Step 3: Build**

```bash
npm run build
```

Expected output: no TypeScript errors, `dist/main.js` updated.

**Step 4: Serve and verify visually**

```bash
npm run serve
```

Open `http://localhost:3000` (or whichever port `serve` uses). Scroll past Hero — you should see:
- "Save the Date" in large serif
- "июнь 2026" in script font
- Calendar grid with all 30 days of June
- Day 10 bold with a gold heart outline around it
- Gold divider lines above and below the calendar

**Step 5: Commit**

```bash
git add src/main.ts
git commit -m "feat: render save-date calendar with SVG heart highlight"
```

---

## Done ✓

All three tasks complete. The section is self-contained, reads date from `WEDDING_CONFIG.date`, and matches the existing visual style (same fonts, colors, `.gold-line`, `.animate-on-scroll`).
