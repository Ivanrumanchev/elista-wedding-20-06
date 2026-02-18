# Visual Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Улучшить визуальную составляющую свадебного лендинга: скриптовый шрифт для имён, masonry-галерея с lightbox, гамбургер-меню на мобиле, правки типографики.

**Architecture:** Vanilla TypeScript + HTML/CSS, без фреймворков. Логика галереи выносится в `src/gallery.ts`. CSS пишется инлайн в `<style>` тега `index.html` (существующий паттерн проекта). Сборка через `tsc`.

**Tech Stack:** TypeScript 5.4, Vanilla DOM API, Google Fonts (Pinyon Script), CSS columns для masonry, Playwright MCP для визуальной проверки.

---

### Task 1: Правки типографики и шрифт Pinyon Script

**Files:**
- Modify: `index.html` (секция `<style>` и `<head>`)

**Шаг 1: Подключить Pinyon Script в `<head>`**

Найти строку с Google Fonts link (строка ~10 в `index.html`). Добавить `Pinyon+Script` к параметрам запроса:

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500&family=Pinyon+Script&display=swap" rel="stylesheet" />
```

**Шаг 2: Добавить CSS-переменную и применить шрифт**

В секции `:root` добавить:
```css
--font-script: 'Pinyon Script', cursive;
```

Найти `.hero-names` (строка ~141) и добавить:
```css
.hero-names {
  font-family: var(--font-script);  /* было: var(--font-serif) */
  letter-spacing: -0.02em;          /* новое */
  /* остальные свойства без изменений */
}
```

Найти `.footer-names` (строка ~566) и добавить:
```css
.footer-names {
  font-family: var(--font-script);  /* было: var(--font-serif) */
  /* остальные свойства без изменений */
}
```

**Шаг 3: Правки типографики**

В `.story-text` изменить `line-height: 1.8` → `line-height: 2`.

В конце секции `<style>` добавить медиа-запрос:
```css
@media (max-width: 640px) {
  :root { --section-pad: 3rem; }
}
```

**Шаг 4: Проверить сборку**

```bash
npm run build
```
Ожидаем: 0 ошибок TypeScript (мы меняли только HTML/CSS, но проверить не помешает).

**Шаг 5: Визуально проверить через Playwright**

Запустить локальный сервер: `npm run serve`
Открыть `http://localhost:3000` в Playwright, сделать скриншот hero и footer — убедиться что шрифт красивый.

**Шаг 6: Коммит**

```bash
git add index.html
git commit -m "feat: add Pinyon Script font for names, fix typography"
```

---

### Task 2: Мобильная гамбургер-навигация

**Files:**
- Modify: `index.html` (HTML навигации + CSS секции nav)

**Шаг 1: Обновить HTML навигации**

Найти `<nav class="nav">` и обернуть ссылки в `<div class="nav-links">`. Добавить кнопку гамбургера:

```html
<nav class="nav">
  <button class="nav-toggle" aria-label="Открыть меню" aria-expanded="false">
    <span class="nav-toggle-icon">☰</span>
  </button>
  <div class="nav-links">
    <a href="#story">История</a>
    <a href="#gallery">Фото</a>
    <a href="#schedule">Программа</a>
    <a href="#venue">Место</a>
    <a href="#rsvp">Ответ</a>
  </div>
</nav>
```

Обрати внимание: добавлена ссылка `#gallery` — галерея будет добавлена в Task 3.

**Шаг 2: Добавить CSS для гамбургера**

Найти существующий CSS навигации (`.nav`, `.nav a`) и добавить после него:

```css
/* Гамбургер: скрыт на десктопе */
.nav-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.4rem;
  color: var(--text-light);
  padding: 0.3rem;
  line-height: 1;
}

@media (max-width: 640px) {
  .nav {
    flex-direction: column;
    align-items: flex-start;
    padding: 0.8rem 1.5rem;
    gap: 0;
  }

  .nav-toggle {
    display: block;
    align-self: flex-end;
    margin-top: -1.8rem; /* выровнять по центру высоты nav */
  }

  .nav-links {
    display: none;
    flex-direction: column;
    gap: 0;
    width: 100%;
    padding: 0.5rem 0 0.3rem;
  }

  .nav-links.is-open {
    display: flex;
  }

  .nav-links a {
    padding: 0.7rem 0;
    border-bottom: 1px solid rgba(201,169,110,0.15);
    font-size: 0.7rem;
  }

  .nav-links a:last-child {
    border-bottom: none;
  }
}
```

**Шаг 3: Добавить JS в `src/main.ts`**

Добавить функцию `initMobileNav` и вызвать её в `DOMContentLoaded`:

```typescript
function initMobileNav(): void {
  const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle');
  const links = document.querySelector<HTMLDivElement>('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.querySelector('.nav-toggle-icon')!.textContent = isOpen ? '✕' : '☰';
  });

  // Закрыть меню при клике на ссылку
  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.querySelector('.nav-toggle-icon')!.textContent = '☰';
    });
  });
}
```

В `DOMContentLoaded` добавить вызов: `initMobileNav();`

**Шаг 4: Сборка**

```bash
npm run build
```
Ожидаем: 0 ошибок.

**Шаг 5: Проверить через Playwright**

Открыть страницу, сжать окно до 375px, убедиться что кнопка ☰ появилась и меню работает.

**Шаг 6: Коммит**

```bash
git add index.html src/main.ts
git commit -m "feat: add mobile hamburger navigation"
```

---

### Task 3: Masonry-галерея с JS-lightbox

**Files:**
- Create: `src/gallery.ts`
- Modify: `index.html` (секция gallery + CSS + импорт gallery)
- Modify: `src/main.ts` (вызов initGallery)

**Шаг 1: Создать `src/gallery.ts`**

```typescript
interface GalleryState {
  images: HTMLElement[];
  currentIndex: number;
}

export function initGallery(): void {
  const grid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox') as HTMLElement | null;
  const lightboxImg = document.querySelector<HTMLImageElement>('.lightbox-img');
  const closeBtn = document.querySelector<HTMLButtonElement>('.lightbox-close');
  const prevBtn = document.querySelector<HTMLButtonElement>('.lightbox-prev');
  const nextBtn = document.querySelector<HTMLButtonElement>('.lightbox-next');

  if (!grid || !lightbox || !lightboxImg || !closeBtn || !prevBtn || !nextBtn) return;

  const state: GalleryState = {
    images: Array.from(grid.querySelectorAll<HTMLElement>('.gallery-item')),
    currentIndex: 0,
  };

  function openLightbox(index: number): void {
    state.currentIndex = index;
    const item = state.images[index];
    const src = item.getAttribute('data-full') ?? (item.querySelector('img')?.src ?? '');
    lightboxImg!.src = src;
    lightbox!.classList.add('lightbox--visible');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox(): void {
    lightbox!.classList.remove('lightbox--visible');
    document.body.style.overflow = '';
    lightboxImg!.src = '';
  }

  function showPrev(): void {
    openLightbox((state.currentIndex - 1 + state.images.length) % state.images.length);
  }

  function showNext(): void {
    openLightbox((state.currentIndex + 1) % state.images.length);
  }

  // Клики по фото
  state.images.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  // Закрытие по Escape и клику на фон
  document.addEventListener('keydown', (e) => {
    if (!lightbox!.classList.contains('lightbox--visible')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Свайп на мобиле
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? showNext() : showPrev();
    }
  }, { passive: true });
}
```

**Шаг 2: Добавить секцию галереи в `index.html`**

Вставить между секциями `#story` и `#schedule`:

```html
<!-- Галерея -->
<section class="gallery-section" id="gallery">
  <h2 class="section-title animate-on-scroll">Наши моменты</h2>
  <span class="section-subtitle animate-on-scroll">фотографии</span>

  <div class="gallery-grid animate-on-scroll" id="gallery-grid">
    <!-- Плейсхолдеры: заменить на реальные фото <img src="photos/1.jpg" data-full="photos/1.jpg"> -->
    <div class="gallery-item" data-full="" style="--ph-color:#e8d5b0"><div class="gallery-placeholder"></div></div>
    <div class="gallery-item" data-full="" style="--ph-color:#d4b896"><div class="gallery-placeholder gallery-placeholder--tall"></div></div>
    <div class="gallery-item" data-full="" style="--ph-color:#c9a96e"><div class="gallery-placeholder"></div></div>
    <div class="gallery-item" data-full="" style="--ph-color:#b8945a"><div class="gallery-placeholder gallery-placeholder--tall"></div></div>
    <div class="gallery-item" data-full="" style="--ph-color:#e8d5b0"><div class="gallery-placeholder"></div></div>
    <div class="gallery-item" data-full="" style="--ph-color:#d4b896"><div class="gallery-placeholder gallery-placeholder--tall"></div></div>
    <div class="gallery-item" data-full="" style="--ph-color:#c9a96e"><div class="gallery-placeholder"></div></div>
    <div class="gallery-item" data-full="" style="--ph-color:#b8945a"><div class="gallery-placeholder"></div></div>
    <div class="gallery-item" data-full="" style="--ph-color:#e8d5b0"><div class="gallery-placeholder gallery-placeholder--tall"></div></div>
  </div>

  <!-- Lightbox -->
  <div id="lightbox" class="lightbox" role="dialog" aria-modal="true">
    <button class="lightbox-close" aria-label="Закрыть">✕</button>
    <button class="lightbox-prev" aria-label="Предыдущее фото">‹</button>
    <img class="lightbox-img" alt="Фото" />
    <button class="lightbox-next" aria-label="Следующее фото">›</button>
  </div>
</section>
```

**Шаг 3: Добавить CSS галереи и lightbox**

Добавить в `<style>` (после `.story-divider::before, .story-divider::after`):

```css
/* ── Галерея ──────────────────────────────────────────────── */
.gallery-section {
  padding: var(--section-pad) clamp(1rem, 5vw, 4rem);
  background: var(--ivory);
}

.gallery-grid {
  columns: 3;
  column-gap: 0.8rem;
  max-width: 1000px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .gallery-grid { columns: 2; }
}

@media (max-width: 480px) {
  .gallery-grid { columns: 1; }
}

.gallery-item {
  break-inside: avoid;
  margin-bottom: 0.8rem;
  cursor: pointer;
  overflow: hidden;
  border-radius: var(--radius);
}

.gallery-item img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.4s ease;
}

.gallery-item:hover img {
  transform: scale(1.03);
}

/* Плейсхолдеры (убрать когда добавите реальные фото) */
.gallery-placeholder {
  width: 100%;
  height: 200px;
  background: var(--ph-color, var(--gold-light));
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.5);
  font-family: var(--font-serif);
  font-size: 2rem;
  transition: transform 0.4s ease;
}

.gallery-placeholder--tall { height: 300px; }

.gallery-item:hover .gallery-placeholder {
  transform: scale(1.03);
}

/* ── Lightbox ─────────────────────────────────────────────── */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(43, 29, 17, 0.96);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.lightbox--visible {
  opacity: 1;
  pointer-events: all;
}

.lightbox-img {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: var(--radius);
}

.lightbox-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: var(--gold-light);
  font-size: 1.8rem;
  cursor: pointer;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.lightbox-close:hover { opacity: 1; }

.lightbox-prev,
.lightbox-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--gold-light);
  font-size: 3rem;
  cursor: pointer;
  padding: 1rem;
  opacity: 0.6;
  transition: opacity 0.2s;
  line-height: 1;
}

.lightbox-prev:hover,
.lightbox-next:hover { opacity: 1; }

.lightbox-prev { left: 1rem; }
.lightbox-next { right: 1rem; }

@media (max-width: 480px) {
  .lightbox-prev { left: 0.2rem; }
  .lightbox-next { right: 0.2rem; }
}
```

**Шаг 4: Подключить gallery в `src/main.ts`**

В начало файла добавить импорт:
```typescript
import { initGallery } from './gallery.js';
```

В `DOMContentLoaded` добавить вызов:
```typescript
initGallery();
```

**Шаг 5: Сборка**

```bash
npm run build
```
Ожидаем: 0 ошибок. Должен появиться `dist/gallery.js`.

**Шаг 6: Проверить через Playwright**

- Открыть страницу, проскроллить до галереи — 9 плейсхолдеров в masonry-сетке
- Кликнуть на один — lightbox открывается
- Проверить клавиши ← → Escape
- Сжать окно до 375px — 1 колонка

**Шаг 7: Коммит**

```bash
git add src/gallery.ts src/main.ts index.html
git commit -m "feat: add masonry photo gallery with JS lightbox"
```

---

### Task 4: Финальная проверка и деплой

**Шаг 1: Полная сборка**

```bash
npm run build
```
Ожидаем: 0 ошибок, файлы в `dist/`.

**Шаг 2: Локальный сервер + финальная проверка**

```bash
npm run serve
```

Чеклист проверки:
- [ ] Имена в hero/footer отображаются красивым скриптовым шрифтом
- [ ] На мобиле (≤640px) появляется гамбургер ☰
- [ ] Клик по ☰ открывает меню, клик по ссылке — закрывает
- [ ] Секция #gallery видна между "Историей" и "Программой"
- [ ] 9 плейсхолдеров в masonry (3 колонки на десктопе, 2 на планшете, 1 на мобиле)
- [ ] Клик по плейсхолдеру открывает lightbox
- [ ] Навигация стрелками и Escape работают
- [ ] Типографика: шрифт в hero красивый, отступы секций на мобиле меньше

**Шаг 3: Пуш и деплой**

```bash
git push origin main
```
GitHub Actions автоматически задеплоит на GitHub Pages.

---

## Как заменить плейсхолдеры на реальные фото

1. Положить фото в папку `photos/` (создать в корне)
2. В каждом `.gallery-item` заменить:
   ```html
   <!-- было: -->
   <div class="gallery-item" data-full="" style="--ph-color:#e8d5b0">
     <div class="gallery-placeholder"></div>
   </div>

   <!-- стало: -->
   <div class="gallery-item" data-full="photos/1.jpg">
     <img src="photos/1.jpg" alt="Иван и Яна" loading="lazy" />
   </div>
   ```
3. Удалить CSS-блок плейсхолдеров (`.gallery-placeholder`, `.gallery-placeholder--tall`)
