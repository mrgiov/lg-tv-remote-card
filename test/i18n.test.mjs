import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { DICTIONARIES, languageOf, translator } from '../src/i18n.js';
import { describeError, statusLabel } from '../src/logic.js';

test('both dictionaries have exactly the same keys', () => {
  assert.deepEqual(Object.keys(DICTIONARIES.it).sort(), Object.keys(DICTIONARIES.en).sort());
});

test('both dictionaries use the same {placeholders} and have no empty texts', () => {
  const holes = (text) => (text.match(/\{\w+\}/g) ?? []).sort().join();
  for (const key of Object.keys(DICTIONARIES.en)) {
    assert.ok(DICTIONARIES.en[key] && DICTIONARIES.it[key], `${key} is empty`);
    assert.equal(holes(DICTIONARIES.it[key]), holes(DICTIONARIES.en[key]), key);
  }
});

test('every literal t(\'key\') or t(`key`) used in src/ exists in the dictionaries', () => {
  for (const file of readdirSync(new URL('../src/', import.meta.url))) {
    const code = readFileSync(new URL(`../src/${file}`, import.meta.url), 'utf8');
    for (const [, key] of code.matchAll(/\bt\('([\w.]+)'/g)) assert.ok(key in DICTIONARIES.en, `${file}: missing key ${key}`);
  }
});

test('languageOf: Italian for it*, English for everything else or nothing', () => {
  assert.equal(languageOf({ locale: { language: 'it' } }), 'it');
  assert.equal(languageOf({ locale: { language: 'it-IT' } }), 'it');
  assert.equal(languageOf({ language: 'it' }), 'it'); // older Home Assistant: no hass.locale
  assert.equal(languageOf({ locale: { language: 'en' }, language: 'it' }), 'en'); // locale wins
  assert.equal(languageOf({ locale: { language: 'fr' } }), 'en');
  assert.equal(languageOf({ locale: { language: 'ita' } }), 'en');
  assert.equal(languageOf({}), 'en');
  assert.equal(languageOf(undefined), 'en');
});

test('translator: interpolates, falls back to English, then to the key', () => {
  assert.equal(translator('it')('now.minutes', { n: 5 }), '5 min');
  assert.equal(translator('xx')('status.off'), 'Off');
  assert.equal(translator('it')('status.off'), 'Spenta');
  assert.equal(translator('en')('no.such.key'), 'no.such.key');
});

test('pure logic speaks the language it is given', () => {
  const off = { state: 'off', attributes: {} };
  assert.equal(statusLabel(off, { waking: false, t: translator('en') }), 'Off');
  assert.equal(statusLabel(off, { waking: true, t: translator('en') }), 'Switching on…');
  assert.equal(describeError({ tvOn: true, context: 'text', t: translator('en') }).title, 'No text field open');
});
