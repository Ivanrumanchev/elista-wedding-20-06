import type { WeddingConfig } from './types.js';
import { startCountdown, formatCountdownUnit } from './countdown.js';
import { pluralize } from './pluralize.js';

// ─── Конфигурация свадьбы ────────────────────────────────────────────────────

const WEDDING_CONFIG: WeddingConfig = {
  bride: 'Яна',
  groom: 'Иван',
  date: new Date('2026-06-10T09:40:00'),
  venue: {
    name: 'Русская рыбалка в Комарово',
    address: 'пос. Комарово, Приморское шоссе, 452',
    mapUrl: 'https://maps.google.com/maps?q=Русская+рыбалка+Комарово',
  },
  schedule: [
    { time: '9:40',  title: 'Регистрация брака',                      iconUrl: 'https://cdn-icons-png.flaticon.com/128/706/706455.png' },
    { time: '15:00', title: 'Сбор гостей',                             iconUrl: 'https://cdn-icons-png.flaticon.com/128/2776/2776074.png' },
    { time: '16:00', title: 'Церемония и банкет',                      iconUrl: 'https://cdn-icons-png.flaticon.com/128/3314/3314457.png' },
    { time: '22:00', title: 'Торт и танцы',                            iconUrl: 'https://cdn-icons-png.flaticon.com/128/4214/4214366.png' },
    { time: '23:00', title: 'Завершение банкета, трансфер до метро',   iconUrl: 'https://cdn-icons-png.flaticon.com/128/4274/4274245.png' },
  ],
  hashtag: '#ИванИЯна2026',
} as const;

// ─── Обратный отсчёт ─────────────────────────────────────────────────────────

function initCountdown(): void {
  const days = document.getElementById('countdown-days');
  const hours = document.getElementById('countdown-hours');
  const minutes = document.getElementById('countdown-minutes');
  const seconds = document.getElementById('countdown-seconds');
  const daysLabel = document.getElementById('countdown-days-label');
  const hoursLabel = document.getElementById('countdown-hours-label');
  const minutesLabel = document.getElementById('countdown-minutes-label');
  const secondsLabel = document.getElementById('countdown-seconds-label');
  if (!days || !hours || !minutes || !seconds) return;

  startCountdown(WEDDING_CONFIG.date, (result) => {
    days.textContent = formatCountdownUnit(result.days);
    hours.textContent = formatCountdownUnit(result.hours);
    minutes.textContent = formatCountdownUnit(result.minutes);
    seconds.textContent = formatCountdownUnit(result.seconds);
    if (daysLabel)    daysLabel.textContent    = pluralize(result.days,    'день',   'дня',    'дней');
    if (hoursLabel)   hoursLabel.textContent   = pluralize(result.hours,   'час',    'часа',   'часов');
    if (minutesLabel) minutesLabel.textContent = pluralize(result.minutes, 'минута', 'минуты', 'минут');
    if (secondsLabel) secondsLabel.textContent = pluralize(result.seconds, 'секунда','секунды','секунд');
  });
}

// ─── Расписание ───────────────────────────────────────────────────────────────

function renderSchedule(): void {
  const container = document.getElementById('schedule-list');
  if (!container) return;

  container.innerHTML = WEDDING_CONFIG.schedule.map(({ time, title, iconUrl }) => `
    <div class="timeline-item">
      <div class="timeline-icon"><img src="${iconUrl}" alt="" width="60" height="60" loading="lazy" decoding="async"></div>
      <div class="timeline-spine"><div class="timeline-dot"></div></div>
      <div class="timeline-content">
        <span class="timeline-time">${time}</span>
        <span class="timeline-title">${title}</span>
      </div>
    </div>
  `).join('');
}

// ─── Календарь Save the Date ──────────────────────────────────────────────────

function renderSaveDateCalendar(): void {
  const grid = document.getElementById('calendar-grid');
  if (!grid) return;

  const date = WEDDING_CONFIG.date;
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based
  const highlightDay = date.getDate();

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
    empty.setAttribute('aria-hidden', 'true');
    fragment.appendChild(empty);
  }

  // Day cells
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');

    if (d === highlightDay) {
      cell.className = 'calendar-day calendar-day--highlighted';
      const heartPath = 'M50 30 C50 15 37 5 25 10 C13 15 5 27 5 38 C5 55 25 70 50 82 C75 70 95 55 95 38 C95 27 87 15 75 10 C63 5 50 15 50 30 Z';
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
    } else {
      cell.className = 'calendar-day';
      cell.textContent = String(d);
    }

    fragment.appendChild(cell);
  }

  grid.appendChild(fragment);
}


// ─── Анимации при прокрутке ───────────────────────────────────────────────────

function initScrollAnimations(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.05 },
  );

  document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
}

// ─── Инициализация ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Вставляем данные из конфига
  const groomEl = document.querySelectorAll('[data-groom]');
  const brideEl = document.querySelectorAll('[data-bride]');
  const venueEl = document.querySelectorAll('[data-venue]');
  const hashtagEl = document.querySelectorAll('[data-hashtag]');

  groomEl.forEach((el) => (el.textContent = WEDDING_CONFIG.groom));
  brideEl.forEach((el) => (el.textContent = WEDDING_CONFIG.bride));
  venueEl.forEach((el) => (el.textContent = WEDDING_CONFIG.venue.name));
  hashtagEl.forEach((el) => (el.textContent = WEDDING_CONFIG.hashtag));

  const mapLink = document.getElementById('venue-map-link') as HTMLAnchorElement | null;
  if (mapLink) mapLink.href = WEDDING_CONFIG.venue.mapUrl;

  const addressEl = document.getElementById('venue-address');
  if (addressEl) addressEl.textContent = WEDDING_CONFIG.venue.address;

  // Запускаем модули
  initCountdown();
  renderSchedule();
  renderSaveDateCalendar();
  initScrollAnimations();

});
