import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pluralize } from './pluralize.js';

const д = (n: number) => pluralize(n, 'день', 'дня', 'дней');
const ч = (n: number) => pluralize(n, 'час', 'часа', 'часов');
const м = (n: number) => pluralize(n, 'минута', 'минуты', 'минут');
const с = (n: number) => pluralize(n, 'секунда', 'секунды', 'секунд');

test('1, 21, 31, 101 → одиночная форма', () => {
  assert.equal(д(1),   'день');
  assert.equal(д(21),  'день');
  assert.equal(д(31),  'день');
  assert.equal(д(101), 'день');
  assert.equal(ч(1),   'час');
  assert.equal(ч(21),  'час');
});

test('2–4, 22–24 → форма родительного', () => {
  assert.equal(д(2),  'дня');
  assert.equal(д(3),  'дня');
  assert.equal(д(4),  'дня');
  assert.equal(д(22), 'дня');
  assert.equal(д(23), 'дня');
  assert.equal(д(24), 'дня');
  assert.equal(ч(2),  'часа');
  assert.equal(м(3),  'минуты');
  assert.equal(с(4),  'секунды');
});

test('5–20 → форма множественного', () => {
  assert.equal(д(5),  'дней');
  assert.equal(д(10), 'дней');
  assert.equal(д(11), 'дней');
  assert.equal(д(12), 'дней');
  assert.equal(д(13), 'дней');
  assert.equal(д(14), 'дней');
  assert.equal(д(19), 'дней');
  assert.equal(д(20), 'дней');
  assert.equal(ч(11), 'часов');
  assert.equal(м(12), 'минут');
  assert.equal(с(15), 'секунд');
});

test('111–114 → множественное (исключение, не единица)', () => {
  assert.equal(д(111), 'дней');
  assert.equal(д(112), 'дней');
  assert.equal(д(113), 'дней');
  assert.equal(д(114), 'дней');
});

test('0 → форма множественного', () => {
  assert.equal(д(0), 'дней');
  assert.equal(ч(0), 'часов');
  assert.equal(м(0), 'минут');
  assert.equal(с(0), 'секунд');
});
