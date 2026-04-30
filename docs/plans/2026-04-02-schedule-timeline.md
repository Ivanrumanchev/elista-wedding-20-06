# Schedule Timeline Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the emoji-based schedule list with a vertical timeline — SVG icons left, centered line with dots, time + label right.

**Architecture:** Update `types.ts` to replace `icon: string` with `svg: string`, update `WEDDING_CONFIG` with inline SVG strings, rewrite `renderSchedule()` to emit timeline HTML, replace CSS schedule rules with timeline rules.

**Tech Stack:** TypeScript 5.4, vanilla HTML/CSS, no test framework — verify via `npm run build` + browser.

---

### Task 1: Update `ScheduleItem` type

**Files:**
- Modify: `src/types.ts:17-21`

**Step 1: Replace `icon` field with `svg`**

```ts
export interface ScheduleItem {
  readonly time: string;
  readonly title: string;
  readonly svg: string;
}
```

**Step 2: Build to confirm no other errors yet (expect errors in main.ts — that's fine)**

```bash
npm run build 2>&1 | head -20
```

**Step 3: Commit**

```bash
git add src/types.ts
git commit -m "refactor: replace icon string with svg in ScheduleItem"
```

---

### Task 2: Update `WEDDING_CONFIG` schedule items with SVG icons

**Files:**
- Modify: `src/main.ts:15-21`

**Step 1: Replace the schedule array**

```ts
schedule: [
  {
    time: '9:40',
    title: 'Регистрация брака во Дворце бракосочетания №2 (для желающих)',
    svg: `<svg viewBox="0 0 60 60" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><circle cx="22" cy="30" r="13"/><circle cx="38" cy="30" r="13"/></svg>`,
  },
  {
    time: '15:00',
    title: 'Сбор гостей в "Русской рыбалке"',
    svg: `<svg viewBox="0 0 60 60" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M30 8C19 8 11 17 11 27C11 40 30 54 30 54C30 54 49 40 49 27C49 17 41 8 30 8Z"/><circle cx="30" cy="27" r="7"/></svg>`,
  },
  {
    time: '16:00',
    title: 'Церемония бракосочетания и начало программы',
    svg: `<svg viewBox="0 0 60 60" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M20 10L15 32H25Z"/><line x1="20" y1="32" x2="20" y2="50"/><line x1="14" y1="50" x2="26" y2="50"/><path d="M40 10L35 32H45Z"/><line x1="40" y1="32" x2="40" y2="50"/><line x1="34" y1="50" x2="46" y2="50"/></svg>`,
  },
  {
    time: '22:00',
    title: 'Торт и танцы',
    svg: `<svg viewBox="0 0 60 60" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><line x1="30" y1="10" x2="30" y2="17"/><ellipse cx="30" cy="8" rx="2.5" ry="3.5"/><rect x="18" y="19" width="24" height="9" rx="2"/><rect x="13" y="28" width="34" height="9" rx="2"/><rect x="10" y="37" width="40" height="10" rx="2"/></svg>`,
  },
  {
    time: '23:00',
    title: 'Завершение вечера, трансфер до метро',
    svg: `<svg viewBox="0 0 60 60" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><rect x="7" y="15" width="46" height="26" rx="5"/><line x1="7" y1="27" x2="53" y2="27"/><rect x="11" y="18" width="11" height="8" rx="1"/><rect x="25" y="18" width="11" height="8" rx="1"/><circle cx="17" cy="44" r="5"/><circle cx="43" cy="44" r="5"/><line x1="22" y1="41" x2="38" y2="41"/></svg>`,
  },
],
```

**Step 2: Build — expect errors only in `renderSchedule` (uses old `icon`)**

```bash
npm run build 2>&1 | grep error
```

**Step 3: Commit**

```bash
git add src/main.ts
git commit -m "feat: add SVG icons to schedule config items"
```

---

### Task 3: Rewrite `renderSchedule()` for timeline layout

**Files:**
- Modify: `src/main.ts:49-67`

**Step 1: Replace the function body**

```ts
function renderSchedule(): void {
  const container = document.getElementById('schedule-list');
  if (!container) return;

  const fragment = document.createDocumentFragment();

  WEDDING_CONFIG.schedule.forEach(({ time, title, svg }, index) => {
    const isLast = index === WEDDING_CONFIG.schedule.length - 1;
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML = `
      <div class="timeline-icon">${svg}</div>
      <div class="timeline-spine">
        <div class="timeline-dot"></div>
        ${isLast ? '' : '<div class="timeline-line"></div>'}
      </div>
      <div class="timeline-content">
        <span class="timeline-time">${time}</span>
        <span class="timeline-title">${title}</span>
      </div>
    `;
    fragment.appendChild(item);
  });

  container.appendChild(fragment);
}
```

**Step 2: Build — should compile clean**

```bash
npm run build
```

Expected: no errors.

**Step 3: Commit**

```bash
git add src/main.ts
git commit -m "feat: rewrite renderSchedule as vertical timeline"
```

---

### Task 4: Replace schedule CSS with timeline styles

**Files:**
- Modify: `index.html` — find the block from `.schedule-section {` to `.schedule-title { ... }` (lines ~275–320) and replace entirely

**Step 1: Remove old rules and add new ones**

Find this entire block and replace:

```css
/* OLD — remove all of this */
.schedule-section { ... }
.schedule-section .section-title { ... }
.schedule-list { ... }
.schedule-item { ... }
.schedule-item:last-child { ... }
.schedule-icon { ... }
.schedule-time { ... }
.schedule-title { ... }
```

Replace with:

```css
.schedule-section {
  padding: var(--section-pad) clamp(1.5rem, 8vw, 6rem);
  background: #a4b5c4;
  border-radius: 50px;
  overflow: hidden;
  position: relative;
  z-index: 0;
  margin: 0 15px;
}

.schedule-section .section-title { font-family: 'Philosopher', var(--font-sans); }

.schedule-list {
  max-width: 520px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: grid;
  grid-template-columns: 1fr 40px 1fr;
  align-items: flex-start;
  min-height: 70px;
}

.timeline-icon {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding-top: 4px;
  padding-right: 0;
}

.timeline-icon svg {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
}

.timeline-spine {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 8px;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  flex-shrink: 0;
}

.timeline-line {
  width: 2px;
  flex: 1;
  min-height: 54px;
  background: rgba(255, 255, 255, 0.5);
  margin-top: 4px;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  padding-left: 12px;
  padding-top: 2px;
  gap: 4px;
}

.timeline-time {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  font-weight: 300;
  color: white;
  line-height: 1;
}

.timeline-title {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 400;
  color: white;
  letter-spacing: 0.03em;
  line-height: 1.4;
  opacity: 0.9;
}
```

**Step 2: Also find and update the mobile override** (around line 633):

Find:
```css
.schedule-item { grid-template-columns: 2rem 5rem 1fr; gap: 0.5rem; }
```

Replace with:
```css
.timeline-item { grid-template-columns: 1fr 32px 1fr; }
.timeline-icon svg { width: 40px; height: 40px; }
.timeline-time { font-size: 1.2rem; }
.timeline-title { font-size: 0.8rem; }
```

**Step 3: Build and open in browser**

```bash
npm run build && npm run serve
```

Open `http://localhost:3000` and verify:
- SVG icons visible on the left
- Vertical line with dots in center
- Time + text on the right
- Mobile view looks correct

**Step 4: Commit**

```bash
git add index.html
git commit -m "style: timeline layout for schedule section"
```
