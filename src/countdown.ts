import type { CountdownResult } from './types.js';

export function calculateCountdown(targetDate: Date): CountdownResult {
  const now = new Date().getTime();
  const distance = targetDate.getTime() - now;

  if (distance <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const MS_PER_SECOND = 1000;
  const MS_PER_MINUTE = MS_PER_SECOND * 60;
  const MS_PER_HOUR = MS_PER_MINUTE * 60;
  const MS_PER_DAY = MS_PER_HOUR * 24;

  return {
    days: Math.floor(distance / MS_PER_DAY),
    hours: Math.floor((distance % MS_PER_DAY) / MS_PER_HOUR),
    minutes: Math.floor((distance % MS_PER_HOUR) / MS_PER_MINUTE),
    seconds: Math.floor((distance % MS_PER_MINUTE) / MS_PER_SECOND),
  };
}

export function startCountdown(
  targetDate: Date,
  onTick: (result: CountdownResult) => void,
): () => void {
  const tick = (): void => {
    onTick(calculateCountdown(targetDate));
  };

  tick();
  const intervalId = setInterval(tick, 1000);

  return () => clearInterval(intervalId);
}

export function formatCountdownUnit(value: number): string {
  return String(value).padStart(2, '0');
}
