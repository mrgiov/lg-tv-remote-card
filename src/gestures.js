/**
 * Touch gesture handlers. Each `attach*` function wires one element to a small `host`
 * object holding the card's capabilities, so nothing here knows about Home Assistant.
 */
import { POINTER, REPEAT, SCROLL } from './constants.js';
import { padGestureButton, pointerDelta, swipeTargetTab } from './logic.js';

const RELEASE_EVENTS = ['pointerup', 'pointerleave', 'pointercancel'];

/**
 * Sums small deltas and calls `send(dx, dy)` at most once per tick, with whole numbers.
 * The fractional remainder is kept for the next call, so slow movement is never lost.
 */
export function createBatcher(send, tickMs) {
  let pendingX = 0;
  let pendingY = 0;
  let timer = null;
  let lastSentAt = 0;

  const flush = () => {
    clearTimeout(timer);
    timer = null;
    const dx = Math.round(pendingX);
    const dy = Math.round(pendingY);
    if (!dx && !dy) return;
    pendingX -= dx;
    pendingY -= dy;
    lastSentAt = performance.now();
    send(dx, dy);
  };

  return {
    flush,
    reset() { pendingX = 0; pendingY = 0; },
    add(dx, dy) {
      pendingX += dx;
      pendingY += dy;
      const wait = tickMs - (performance.now() - lastSentAt);
      if (wait <= 0) flush();
      else if (timer === null) timer = setTimeout(flush, wait);
    },
  };
}

/** Calls `send(value)` at most once per interval; while waiting, only the latest value is kept. */
export function throttleLatest(send, intervalMs) {
  let latest;
  let timer = null;
  let lastSentAt = -Infinity;
  const flush = () => {
    timer = null;
    lastSentAt = performance.now();
    send(latest);
  };
  return (value) => {
    latest = value;
    const wait = intervalMs - (performance.now() - lastSentAt);
    if (wait <= 0) flush();
    else if (timer === null) timer = setTimeout(flush, wait);
  };
}

/** Pressing and holding a button repeats `press(name)`: used for volume and channel. */
export function attachRepeat(buttons, press) {
  buttons.forEach((button) => {
    let delayTimer;
    let repeatTimer;
    const stop = () => { clearTimeout(delayTimer); clearInterval(repeatTimer); };
    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      const name = button.dataset.repeat;
      press(name);
      delayTimer = setTimeout(() => { repeatTimer = setInterval(() => press(name), REPEAT.intervalMs); }, REPEAT.delayMs);
    });
    RELEASE_EVENTS.forEach((type) => button.addEventListener(type, stop));
  });
}

/** Fires `onComplete` only if the element stays pressed for `durationMs`. */
export function attachHold(element, { durationMs, enabled, onStart, onComplete, onCancel }) {
  let timer = null;
  const cancel = () => {
    if (timer === null) return;
    clearTimeout(timer);
    timer = null;
    onCancel();
  };
  element.addEventListener('pointerdown', (event) => {
    if (!enabled()) return;
    event.preventDefault();
    onStart();
    timer = setTimeout(() => { timer = null; onComplete(); }, durationMs);
  });
  RELEASE_EVENTS.forEach((type) => element.addEventListener(type, cancel));
}

/**
 * Touchpad. With the lgtv_pointer service it drives the real TV cursor (tap = click,
 * double-tap and hold = drag); without it, swipes and taps fall back to remote buttons.
 * host: { hasPointer(), pointer(service, data), press(button), buzz() }
 */
export function attachPad(pad, host) {
  const touch = { id: null, x: 0, y: 0, startX: 0, startY: 0, startedAt: 0, moved: false };
  let dragging = false;
  let lastTapAt = 0;

  const batcher = createBatcher(
    (dx, dy) => host.pointer('move', dragging ? { dx, dy, down: 1 } : { dx, dy }),
    POINTER.tickMs,
  );
  const releaseDrag = () => {
    if (!dragging) return;
    dragging = false;
    host.pointer('move', { dx: 0, dy: 0, down: 0 });
  };

  pad.addEventListener('pointerdown', (event) => {
    pad.setPointerCapture(event.pointerId);
    batcher.reset();
    dragging = host.hasPointer() && Date.now() - lastTapAt < POINTER.doubleTapMs;
    if (dragging) host.buzz();
    Object.assign(touch, {
      id: event.pointerId, x: event.clientX, y: event.clientY,
      startX: event.clientX, startY: event.clientY, startedAt: Date.now(), moved: false,
    });
  });

  pad.addEventListener('pointermove', (event) => {
    if (touch.id !== event.pointerId) return;
    const travelled = Math.abs(event.clientX - touch.startX) + Math.abs(event.clientY - touch.startY);
    if (travelled > POINTER.moveThresholdPx) touch.moved = true;
    if (!host.hasPointer()) return;
    const delta = pointerDelta(event.clientX - touch.x, event.clientY - touch.y);
    touch.x = event.clientX;
    touch.y = event.clientY;
    batcher.add(delta.x, delta.y);
  });

  pad.addEventListener('pointerup', (event) => {
    if (touch.id !== event.pointerId) return;
    touch.id = null;
    if (host.hasPointer()) {
      batcher.flush();
      if (dragging) return releaseDrag();
      const isTap = !touch.moved && Date.now() - touch.startedAt < POINTER.tapMaxMs;
      if (isTap) {
        host.buzz();
        lastTapAt = Date.now();
        host.pointer('click', {});
      }
      return;
    }
    host.press(padGestureButton({ dx: event.clientX - touch.startX, dy: event.clientY - touch.startY, moved: touch.moved }));
  });

  pad.addEventListener('pointercancel', () => {
    touch.id = null;
    batcher.flush();
    releaseDrag();
  });
}

/** Vertical strip next to the touchpad: dragging scrolls. host: { gain, send(dy) } */
export function attachStrip(strip, { gain, send }) {
  let activeId = null;
  let lastY = 0;
  const batcher = createBatcher((_dx, dy) => send(dy), SCROLL.tickMs);

  strip.addEventListener('pointerdown', (event) => {
    strip.setPointerCapture(event.pointerId);
    activeId = event.pointerId;
    lastY = event.clientY;
    batcher.reset();
  });
  strip.addEventListener('pointermove', (event) => {
    if (activeId !== event.pointerId) return;
    batcher.add(0, (event.clientY - lastY) * gain);
    lastY = event.clientY;
  });
  ['pointerup', 'pointercancel'].forEach((type) => strip.addEventListener(type, () => { activeId = null; }));
}

/**
 * Horizontal swipe on the card switches tab. Touchpad, strip, text field, power button and
 * hold-to-repeat keys keep their own gestures. host: { enabled(), currentTab(), goTo(tab, direction), buzz(), markSwiped() }
 */
export function attachSwipe(card, host) {
  const OWN_GESTURE_IDS = ['pad', 'strip', 'text', 'power', 'tabs'];
  let start = null;

  card.addEventListener('pointerdown', (event) => {
    if (!host.enabled()) { start = null; return; }
    const ownsGesture = event.composedPath().some(
      (node) => OWN_GESTURE_IDS.includes(node.id) || node.dataset?.repeat,
    );
    start = ownsGesture ? null : { id: event.pointerId, x: event.clientX, y: event.clientY, at: Date.now() };
  });

  card.addEventListener('pointerup', (event) => {
    if (!start || start.id !== event.pointerId) return;
    const gesture = { dx: event.clientX - start.x, dy: event.clientY - start.y, durationMs: Date.now() - start.at };
    start = null;
    const target = swipeTargetTab(host.currentTab(), gesture);
    if (!target) return;
    host.markSwiped();
    host.buzz();
    host.goTo(target, gesture.dx < 0 ? 1 : -1);
  });

  card.addEventListener('pointercancel', () => { start = null; });
}


/**
 * Lets the highlight of the tab bar be dragged like an iOS segmented control. Only a press that starts on the
 * highlight drags; a plain tap still selects the tab through its click. `host.move(fingerX)` gets the finger position
 * relative to the bar, `host.drop()` is called on release after a real drag.
 */
export function attachPillDrag(tabs, pill, host) {
  const DRAG_START_PX = 6;
  let drag = null;

  tabs.addEventListener('pointerdown', (event) => {
    const box = pill.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right) return;
    drag = { id: event.pointerId, startX: event.clientX, moving: false };
  });

  tabs.addEventListener('pointermove', (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    if (!drag.moving) {
      if (Math.abs(event.clientX - drag.startX) < DRAG_START_PX) return;
      drag.moving = true;
      try { tabs.setPointerCapture(event.pointerId); } catch (error) { /* synthetic or already released pointer */ }
      host.start();
    }
    host.move(event.clientX - tabs.getBoundingClientRect().left);
  });

  const finish = (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    const moved = drag.moving;
    drag = null;
    if (moved) host.drop();
  };
  tabs.addEventListener('pointerup', finish);
  tabs.addEventListener('pointercancel', finish);
}
