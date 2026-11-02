import test from 'node:test';
import assert from 'node:assert/strict';
import {
  describeError,
  groupSources,
  hapticFeedback,
  hapticLevel,
  insertTextPayload,
  isHomeScreen,
  isTvOn,
  keyboardAutoAction,
  keyboardInset,
  padGestureButton,
  pointerDelta,
  statusLabel,
  swipeTargetTab,
  tabIndexAt,
  tabPillRect,
} from '../src/logic.js';
import { POINTER } from '../src/constants.js';

test('isTvOn: only reachable, non-standby states count', () => {
  assert.equal(isTvOn({ state: 'playing' }), true);
  assert.equal(isTvOn({ state: 'on' }), true);
  assert.equal(isTvOn({ state: 'off' }), false);
  assert.equal(isTvOn({ state: 'unavailable' }), false);
  assert.equal(isTvOn(undefined), false);
});

test('groupSources: favourites keep configured order, inputs and hidden apps are separated', () => {
  const sources = ['Developer Mode', 'HDMI 1', 'YouTube', 'Canali TV', 'Netflix', 'Copilot', 'Fotocamera'];
  const groups = groupSources(sources, { favorites: ['Netflix', 'YouTube', 'Disney+'], hidden: ['Developer Mode'] });
  assert.deepEqual(groups.favorites, ['Netflix', 'YouTube']);
  assert.deepEqual(groups.inputs, ['HDMI 1', 'Canali TV']);
  assert.deepEqual(groups.others, ['Copilot', 'Fotocamera']);
});

test('swipeTargetTab: left goes forward, right goes back, edges stop', () => {
  const swipe = (dx, dy = 0, durationMs = 200) => ({ dx, dy, durationMs });
  assert.equal(swipeTargetTab('dpad', swipe(-120)), 'pad');
  assert.equal(swipeTargetTab('pad', swipe(120)), 'dpad');
  assert.equal(swipeTargetTab('dpad', swipe(120)), null);
  assert.equal(swipeTargetTab('apps', swipe(-120)), null);
});

test('swipeTargetTab: rejects short, diagonal and slow gestures', () => {
  assert.equal(swipeTargetTab('dpad', { dx: -40, dy: 0, durationMs: 100 }), null);
  assert.equal(swipeTargetTab('dpad', { dx: -100, dy: 90, durationMs: 100 }), null);
  assert.equal(swipeTargetTab('dpad', { dx: -100, dy: 0, durationMs: 900 }), null);
});

test('padGestureButton: tap is OK, swipes map to arrows', () => {
  assert.equal(padGestureButton({ dx: 0, dy: 0, moved: false }), 'ENTER');
  assert.equal(padGestureButton({ dx: 30, dy: 5, moved: true }), 'RIGHT');
  assert.equal(padGestureButton({ dx: -30, dy: 5, moved: true }), 'LEFT');
  assert.equal(padGestureButton({ dx: 3, dy: 30, moved: true }), 'DOWN');
  assert.equal(padGestureButton({ dx: 3, dy: -30, moved: true }), 'UP');
});

test('pointerDelta: slow movement uses the base gain, fast movement up to double', () => {
  const slow = pointerDelta(1, 0);
  assert.ok(slow.x > POINTER.gain && slow.x < POINTER.gain * 1.2);
  const fast = pointerDelta(POINTER.accelerationPx * 3, 0);
  assert.equal(fast.x, POINTER.accelerationPx * 3 * POINTER.gain * 2);
  assert.equal(pointerDelta(0, 0).x, 0);
});

test('statusLabel: covers missing, waking, unavailable, off and playing states', () => {
  assert.equal(statusLabel(undefined, { waking: false }), 'Entità non trovata');
  assert.equal(statusLabel({ state: 'off', attributes: {} }, { waking: true }), 'Accensione…');
  assert.equal(statusLabel({ state: 'unavailable', attributes: {} }, { waking: false }), 'Non raggiungibile');
  assert.equal(statusLabel({ state: 'off', attributes: {} }, { waking: false }), 'Spenta');
  assert.equal(
    statusLabel({ state: 'on', attributes: { source: 'Canali TV', media_title: 'Rai 1' } }, { waking: false }),
    'Canali TV · Rai 1',
  );
  assert.equal(statusLabel({ state: 'on', attributes: { source: 'HDMI 1' } }, { waking: false }), 'HDMI 1');
  assert.equal(statusLabel({ state: 'on', attributes: {} }, { waking: false }), 'Accesa');
});

test('insertTextPayload: replace is a strict boolean (the TV ignores 0/1)', () => {
  assert.deepEqual(insertTextPayload('ciao'), { text: 'ciao', replace: true });
  assert.strictEqual(insertTextPayload('').replace, true);
});

test('keyboardAutoAction: opens on focus, closes on blur only when nothing is typed', () => {
  assert.equal(keyboardAutoAction({ focus: true, sheetOpen: false, hasText: false }), 'open');
  assert.equal(keyboardAutoAction({ focus: true, sheetOpen: true, hasText: false }), null);
  assert.equal(keyboardAutoAction({ focus: false, sheetOpen: true, hasText: false }), 'close');
  assert.equal(keyboardAutoAction({ focus: false, sheetOpen: true, hasText: true }), null);
  assert.equal(keyboardAutoAction({ focus: false, sheetOpen: false, hasText: false }), null);
});

test('keyboardInset: overlay keyboards leave a gap, resizing keyboards and no keyboard give 0', () => {
  assert.equal(keyboardInset({ layoutHeight: 800, visualHeight: 500, visualOffsetTop: 0 }), 300);
  assert.equal(keyboardInset({ layoutHeight: 500, visualHeight: 500, visualOffsetTop: 0 }), 0);
  assert.equal(keyboardInset({ layoutHeight: 800, visualHeight: 800, visualOffsetTop: 0 }), 0);
  assert.equal(keyboardInset({ layoutHeight: 800, visualHeight: 450, visualOffsetTop: 100 }), 250);
  assert.equal(keyboardInset({ layoutHeight: 700, visualHeight: 800, visualOffsetTop: 0 }), 0);
});

test('describeError: an unreachable TV wins over the specific context', () => {
  assert.equal(describeError({ tvOn: false, context: 'text' }).title, 'TV non raggiungibile');
  assert.equal(describeError({ tvOn: true, context: 'text' }).title, 'Nessun campo di testo aperto');
  assert.equal(describeError({ tvOn: true, context: 'pointer' }).title, 'Puntatore non disponibile');
  assert.equal(describeError({ tvOn: true }).title, 'Comando non riuscito');
});

test('isHomeScreen: the launcher, or no app at all, counts as home', () => {
  assert.equal(isHomeScreen({ app_id: 'com.webos.app.home' }), true);
  assert.equal(isHomeScreen({}), true);
  assert.equal(isHomeScreen(undefined), true);
  assert.equal(isHomeScreen({ app_id: 'netflix' }), false);
  assert.equal(isHomeScreen({ app_id: 'com.webos.app.livetv' }), false);
});

test('hapticLevel: older true/false configs and unknown values are understood', () => {
  assert.equal(hapticLevel(false), 'off');
  assert.equal(hapticLevel('off'), 'off');
  assert.equal(hapticLevel(true), 'soft');
  assert.equal(hapticLevel(undefined), 'soft');
  assert.equal(hapticLevel('strong'), 'strong');
  assert.equal(hapticLevel('loud'), 'soft');
});

test('hapticFeedback: off sends nothing, stronger levels stretch the browser pattern and change the native type', () => {
  assert.equal(hapticFeedback('off', 'tap'), null);
  const soft = hapticFeedback('soft', 'tap');
  const strong = hapticFeedback('strong', 'tap');
  assert.equal(soft.native, 'selection');
  assert.equal(strong.native, 'medium');
  assert.ok(strong.pattern > soft.pattern);
  assert.deepEqual(hapticFeedback('soft', 'success').pattern, [40, 50, 40]);
  assert.equal(hapticFeedback('normal', 'error').native, 'warning');
});

test('tabPillRect: the highlight spans the selected tab and tracks its position', () => {
  const geometry = { innerWidth: 344, count: 4, gap: 4, padding: 4, selectedFlex: 2.2 };
  const first = tabPillRect({ ...geometry, selectedIndex: 0 });
  const second = tabPillRect({ ...geometry, selectedIndex: 1 });
  const last = tabPillRect({ ...geometry, selectedIndex: 3 });
  assert.equal(first.left, 4);
  assert.ok(second.left > first.left && last.left > second.left);
  assert.ok(Math.abs(first.width - second.width) < 1e-9);
  assert.ok(Math.abs(last.left + last.width - (4 + 344)) < 1e-9); // the last tab ends at the inner edge
});

test('tabIndexAt: finds the tab under a point, or the nearest one across a gap or past the ends', () => {
  const rects = [{ left: 4, width: 90 }, { left: 98, width: 190 }, { left: 292, width: 90 }];
  assert.equal(tabIndexAt(50, rects), 0);
  assert.equal(tabIndexAt(200, rects), 1);
  assert.equal(tabIndexAt(96, rects), 0); // in the gap, closer to the first
  assert.equal(tabIndexAt(-30, rects), 0);
  assert.equal(tabIndexAt(900, rects), 2);
});

test('statusLabel: switching off shows a label of its own, ahead of the waking one', () => {
  assert.equal(statusLabel({ state: 'on', attributes: {} }, { waking: false, sleeping: true }), 'Spegnimento…');
  assert.equal(statusLabel({ state: 'off', attributes: {} }, { waking: true }), 'Accensione…');
});
