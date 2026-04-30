# Schedule Timeline Redesign

**Date:** 2026-04-02

## Goal

Replace the current schedule list with a vertical timeline: SVG icons on the left, a centered vertical line with dots, and time + label on the right.

## Layout

CSS Grid per row: `1fr 40px 1fr`

```
[SVG icon]  ●  9:40
            │       Регистрация брака...
[SVG icon]  ●  15:00
            │       Сбор гостей...
```

- Left cell: SVG illustration, centered, ~60px wide, white stroke
- Center cell: white filled circle (dot) with a vertical line connecting to the next item
- Right cell: time (large, Cormorant Garamond serif, white) + description (small, Montserrat, white)

## SVG Icons (white, thin stroke ~1.5px)

| Item | Icon |
|------|------|
| 9:40 — Регистрация | Two overlapping rings |
| 15:00 — Сбор гостей | Location pin (teardrop + inner circle) |
| 16:00 — Церемония | Two champagne flutes |
| 22:00 — Торт | Layered cake with candle |
| 23:00 — Трансфер | Bus (rectangle + wheels) |

## Visual Style

- Background: existing sage `#a4b5c4`
- Line color: white, semi-transparent (~0.5 opacity)
- Dot color: white filled circle, ~10px diameter
- Section title "Программа" unchanged

## Changes Required

1. **`src/main.ts`** — update `renderSchedule()` to output new timeline HTML structure with inline SVGs; add `svg` field to schedule config items
2. **`index.html` CSS** — replace `.schedule-item`, `.schedule-icon`, `.schedule-time`, `.schedule-title` styles with new `.timeline-*` classes
