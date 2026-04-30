# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Стек проекта

- **TypeScript 5.4** — строгий режим, `noImplicitAny`, `strictNullChecks`
- **Vanilla HTML/CSS/TS** — без фреймворков, нативный DOM API
- **Google Fonts** — Cormorant Garamond + Montserrat

## Структура

```
index.html        — единственная страница (лендинг)
src/
  types.ts        — интерфейсы (WeddingConfig, RSVP, Countdown)
  countdown.ts    — логика обратного отсчёта
  main.ts         — инициализация, рендер, обработчики форм
dist/             — скомпилированный JS (gitignore при необходимости)
tsconfig.json
package.json
```

## Команды

```bash
npm run build   # tsc — компиляция
npm run watch   # tsc --watch
npm run serve   # локальный сервер через npx serve
```
