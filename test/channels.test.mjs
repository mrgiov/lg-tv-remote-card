import test from 'node:test';
import assert from 'node:assert/strict';
import {
  channelColor, channelForNumber, currentProgram, favoriteChannels, isLiveTv, normalizeChannels, parseTvTime, searchChannels, toggleFavorite,
} from '../src/channels.js';

const RAW = [
  { channelId: 'c5', channelNumber: '5', channelName: 'Canale5 HD', TV: true, Radio: false, Invisible: false },
  { channelId: 'c1', channelNumber: '1', channelName: 'Rai 1', TV: true, Radio: false, Invisible: false },
  { channelId: 'r1', channelNumber: '101', channelName: 'Rai Radio 1', TV: false, Radio: true, Invisible: false },
  { channelId: 'h1', channelNumber: '900', channelName: 'Nascosto', TV: true, Radio: false, Invisible: true },
  { channelId: 'c10', channelNumber: '10', channelName: 'Rai Premium', TV: true, Radio: false, Invisible: false },
];

test('parseTvTime reads the TV local time format', () => {
  const date = parseTvTime('2026,11,03,08,30,15');
  assert.deepEqual([date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()], [2026, 10, 3, 8, 30, 15]);
});

const PROGRAMS = [
  { programName: 'TG1', localStartTime: '2026,11,03,08,00,00', localEndTime: '2026,11,03,08,30,00' },
  { programName: 'Che tempo fa', localStartTime: '2026,11,03,08,30,00', localEndTime: '2026,11,03,08,35,00' },
];

test('currentProgram: finds the programme on air with progress and minutes left', () => {
  const program = currentProgram(PROGRAMS, new Date(2026, 10, 3, 8, 12, 0));
  assert.equal(program.name, 'TG1');
  assert.equal(Math.round(program.progress * 100), 40);
  assert.equal(program.minutesLeft, 18);
});

test('currentProgram: returns null when the list does not cover now, instead of guessing', () => {
  assert.equal(currentProgram(PROGRAMS, new Date(2026, 10, 2, 9, 51, 0)), null);
  assert.equal(currentProgram([], new Date()), null);
  assert.equal(currentProgram(undefined, new Date()), null);
});

test('normalizeChannels: keeps visible TV channels, sorted numerically', () => {
  assert.deepEqual(normalizeChannels(RAW).map((c) => c.number), ['1', '5', '10']);
  assert.deepEqual(normalizeChannels(RAW)[0], { id: 'c1', number: '1', name: 'Rai 1' });
});

test('channelForNumber: matches by value and ignores leading zeros', () => {
  const channels = normalizeChannels(RAW);
  assert.equal(channelForNumber(channels, '5').name, 'Canale5 HD');
  assert.equal(channelForNumber(channels, '05').name, 'Canale5 HD');
  assert.equal(channelForNumber(channels, '12'), null);
  assert.equal(channelForNumber(channels, ''), null);
});

test('searchChannels: matches names without accents or case, and number prefixes', () => {
  const channels = normalizeChannels(RAW);
  assert.deepEqual(searchChannels(channels, 'RAI').map((c) => c.number), ['1', '10']);
  assert.deepEqual(searchChannels(channels, '1').map((c) => c.number), ['1', '10']);
  assert.equal(searchChannels(channels, '  ').length, 3);
});

test('favourites: toggling adds and removes; an empty list falls back to the first channels', () => {
  assert.deepEqual(toggleFavorite(['1'], '5'), ['1', '5']);
  assert.deepEqual(toggleFavorite(['1', '5'], '1'), ['5']);
  const channels = normalizeChannels(RAW);
  assert.deepEqual(favoriteChannels(channels, ['10', '1']).map((c) => c.number), ['1', '10']);
  assert.deepEqual(favoriteChannels(channels, [], 2).map((c) => c.number), ['1', '5']);
});

test('channelColor is stable per name; isLiveTv reads the app id', () => {
  assert.equal(channelColor('Rai 1'), channelColor('Rai 1'));
  assert.notEqual(channelColor('Rai 1'), channelColor('Rai 2'));
  assert.equal(isLiveTv({ app_id: 'com.webos.app.livetv' }), true);
  assert.equal(isLiveTv({ app_id: 'netflix' }), false);
  assert.equal(isLiveTv(undefined), false);
});
