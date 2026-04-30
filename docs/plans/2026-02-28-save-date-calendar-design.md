# Save the Date — Calendar Section Design

**Date:** 2026-02-28
**Feature:** Save the Date calendar with heart around wedding date

## Summary

Add a "Save the Date" section between the Hero and Countdown sections. It shows a full calendar for June 2026 with a decorative SVG heart outline around the 10th (wedding date).

## Placement

`Hero → [Save the Date] → Countdown → Story → ...`

## Visual Design

- Background: `var(--cream)` — consistent with Story section
- Heading: "SAVE" / "THE DATE" in Cormorant Garamond, large serif caps, `var(--brown)`
- Month label: Pinyon Script italic, `var(--gold)` — "июнь 2026"
- Weekday headers: Montserrat, 0.65rem, letter-spacing 0.2em, uppercase, `var(--text-light)`
- Calendar days: Cormorant Garamond, serif, `var(--text)`
- Date 10 (highlighted): bold, `var(--brown)`, SVG heart outline overlay in `var(--gold)` (stroke, no fill)
- Gold divider line (`.gold-line`) above and below calendar
- `animate-on-scroll` class for fade-in

## Heart Implementation

Inline SVG `<svg>` element positioned absolutely over the date-10 cell.
Standard heart `<path>` (cubic bezier), `stroke: var(--gold)`, `fill: rgba(201,169,110,0.08)`, no clipPath.
Sized ~56×52px, centered on the number via `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)`.

## Technical

- June 2026 starts on Monday (verified: Jan 1 2026 = Thursday, +151 days = Monday)
- Calendar rendered via `renderSaveDateCalendar()` in `main.ts`
- `WeddingConfig.date` used as the source of truth for highlighted date
- HTML shell (`<section id="save-date">`) added to `index.html`
- No new fonts needed (Cormorant Garamond, Pinyon Script, Montserrat already loaded)
- CSS added inline in `<style>` block of `index.html`
