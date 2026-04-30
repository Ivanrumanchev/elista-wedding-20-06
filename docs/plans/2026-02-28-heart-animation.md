# Heart Animation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a pulse/ripple animation to the calendar heart: two SVG rings expand outward and fade, replicating mycelebration.ru/newclassic.

**Architecture:** Two extra SVG elements are injected by `renderSaveDateCalendar()` alongside the existing static heart. Their CSS classes apply `@keyframes` that scale them up (×2 and ×3) while fading opacity to 0, on a 2s infinite loop — identical to the Tilda reference.

**Tech Stack:** Vanilla CSS (`@keyframes`), TypeScript DOM manipulation, no libraries.

---

### Task 1: Add animation CSS to index.html

**Files:**
- Modify: `index.html` — inside the `<style>` block, in the Save the Date section (currently ends around line 839)

**Step 1: Insert the following CSS immediately after the last rule in the Save the Date CSS block**

Find in `index.html`:
```css
    .calendar-day--highlighted .calendar-heart {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 3em;
      height: 2.8em;
      pointer-events: none;
      z-index: -1;
    }
```

Add directly after the closing `}` of that rule:

```css

    @keyframes calendar-heart-ripple-1 {
      0%   { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0;   transform: translate(-50%, -50%) scale(2); }
    }

    @keyframes calendar-heart-ripple-2 {
      0%   { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0;   transform: translate(-50%, -50%) scale(3); }
    }

    .calendar-heart-ripple {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 3em;
      height: 2.8em;
      pointer-events: none;
      overflow: visible;
    }

    .calendar-heart-ripple--1 {
      animation: calendar-heart-ripple-1 2s ease-in-out infinite;
    }

    .calendar-heart-ripple--2 {
      animation: calendar-heart-ripple-2 2s ease-in-out infinite;
    }
```

**Step 2: Verify** — confirm the new CSS is inside the Save the Date block, before the `@media` breakpoints.

**Step 3: Commit**

```bash
git add index.html
git commit -m "style: add heart ripple animation keyframes"
```

---

### Task 2: Add ripple SVGs in renderSaveDateCalendar()

**Files:**
- Modify: `src/main.ts` — inside `renderSaveDateCalendar()`, in the `d === highlightDay` branch

**Step 1: Find the highlighted day branch**

In `src/main.ts`, locate the `if (d === highlightDay)` block. It currently sets `cell.innerHTML` to something like:

```typescript
      cell.innerHTML = `
        ${d}
        <svg class="calendar-heart" viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M50 30 C50 15 37 5 25 10 C13 15 5 27 5 38 C5 55 25 70 50 82 C75 70 95 55 95 38 C95 27 87 15 75 10 C63 5 50 15 50 30 Z"
                stroke="var(--gold)" stroke-width="3" fill="rgba(201,169,110,0.08)"/>
        </svg>
      `;
```

**Step 2: Add two ripple SVGs after the existing heart SVG**

Replace the entire `cell.innerHTML = \`...\`` assignment with:

```typescript
      const heartPath = 'M50 30 C50 15 37 5 25 10 C13 15 5 27 5 38 C5 55 25 70 50 82 C75 70 95 55 95 38 C95 27 87 15 75 10 C63 5 50 15 50 30 Z';
      cell.innerHTML = `
        ${d}
        <svg class="calendar-heart" viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="${heartPath}" stroke="var(--gold)" stroke-width="3" fill="rgba(201,169,110,0.08)"/>
        </svg>
        <svg class="calendar-heart-ripple calendar-heart-ripple--1" viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="${heartPath}" stroke="var(--gold)" stroke-width="2" fill="none"/>
        </svg>
        <svg class="calendar-heart-ripple calendar-heart-ripple--2" viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="${heartPath}" stroke="var(--gold)" stroke-width="2" fill="none"/>
        </svg>
      `;
```

**Step 3: Build**

```bash
cd /Users/ivan/Documents/projects/elista-wedding-20-06 && npm run build
```

Expected: exits 0, no TypeScript errors.

**Step 4: Verify visually**

```bash
npm run serve
```

Open the page and scroll to the Save the Date calendar. The date 10 should show:
- Static gold heart outline (existing)
- Ring 1 expanding to ~2× size while fading out, looping every 2s
- Ring 2 expanding to ~3× size while fading out, looping every 2s

**Step 5: Commit**

```bash
git add src/main.ts dist/main.js
git commit -m "feat: add pulse ripple animation to calendar heart"
```

Note: `dist/` is in `.gitignore` — only `src/main.ts` will be staged.

---

## Done ✓

Two tasks, two commits. The heart now pulses with two outward ripple rings matching the reference animation.
