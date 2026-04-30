# Heart Animation Design

**Date:** 2026-02-28
**Feature:** Pulse/ripple animation on the calendar heart, matching mycelebration.ru/newclassic

## What the reference does

Two SVG heart images are layered on top of the static heart. Both animate simultaneously:
- Ring 1: `scale(1) → scale(2)`, `opacity 1 → 0`, 2s ease-in-out, infinite
- Ring 2: `scale(1) → scale(3)`, `opacity 1 → 0`, 2s ease-in-out, infinite

Creates an outward ripple effect of two waves expanding from the heart center.

## Approach: JS-generated ripple SVGs (Option A)

### CSS changes (`index.html` `<style>` block)

Add two `@keyframes` and one new class:

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
  transform: translate(-50%, -50%);
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

### JS changes (`src/main.ts`)

In `renderSaveDateCalendar()`, inside the `d === highlightDay` branch, add two ripple SVGs after the existing static heart SVG. Same heart path, same `stroke="var(--gold)"`, no fill.

### Result

The highlighted date (10) shows:
1. Static heart outline (existing)
2. Ring 1: expands to 2× and fades over 2s, loops
3. Ring 2: expands to 3× and fades over 2s, loops
