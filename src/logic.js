/** Pure functions: no DOM, no Home Assistant. Covered by test/logic.test.mjs. */
import { HAPTIC_LEVELS, HAPTIC_PATTERNS, POINTER, SWIPE, TABS } from './constants.js';

const HDMI_INPUT = /^HDMI \d+$/;
const LIVE_TV = 'Canali TV';

/** True when the media_player is reachable and not in standby. */
export const isTvOn = (stateObj) =>
  Boolean(stateObj) && stateObj.state !== 'off' && stateObj.state !== 'unavailable';

/** Splits the TV's source list into favourite apps, inputs, and the remaining visible apps. */
export function groupSources(sources, { favorites, hidden }) {
  const favoriteApps = favorites.filter((name) => sources.includes(name));
  const inputs = sources.filter((name) => HDMI_INPUT.test(name) || name === LIVE_TV);
  const others = sources.filter(
    (name) => !favoriteApps.includes(name) && !inputs.includes(name) && !hidden.includes(name),
  );
  return { favorites: favoriteApps, inputs, others };
}

/** Returns the tab a horizontal swipe leads to, or null if the gesture is not a valid swipe. */
export function swipeTargetTab(currentTab, { dx, dy, durationMs }) {
  const longEnough = Math.abs(dx) >= SWIPE.minDistancePx;
  const horizontal = Math.abs(dx) >= Math.abs(dy) * SWIPE.horizontalRatio;
  if (!longEnough || !horizontal || durationMs > SWIPE.maxMs) return null;
  const step = dx < 0 ? 1 : -1;
  return TABS[TABS.indexOf(currentTab) + step] ?? null;
}

/** Fallback touchpad (no real pointer): maps a touch to a remote button. */
export function padGestureButton({ dx, dy, moved }) {
  if (!moved) return 'ENTER';
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'RIGHT' : 'LEFT';
  return dy > 0 ? 'DOWN' : 'UP';
}

/** Scales a finger movement into a TV pointer movement; faster gestures travel further. */
export function pointerDelta(fingerDx, fingerDy) {
  const speedBoost = 1 + Math.min(1, Math.hypot(fingerDx, fingerDy) / POINTER.accelerationPx);
  const scale = POINTER.gain * speedBoost;
  return { x: fingerDx * scale, y: fingerDy * scale };
}

/**
 * Payload for com.webos.service.ime/insertText. The whole field content is sent each time and
 * replaces what the TV shows. `replace` must be a real boolean: a number (0/1) gets no reply.
 */
export const insertTextPayload = (text) => ({ text, replace: true });

/**
 * Height of the on-screen keyboard that covers the page, so a bottom sheet can sit above it.
 * Android resizes the layout viewport (inset 0); iOS only shrinks the visual viewport.
 */
export function keyboardInset({ layoutHeight, visualHeight, visualOffsetTop }) {
  return Math.max(0, Math.round(layoutHeight - visualHeight - visualOffsetTop));
}

/** What the keyboard sheet does when the TV reports a text field gaining or losing focus. */
export function keyboardAutoAction({ focus, sheetOpen, hasText }) {
  if (focus) return sheetOpen ? null : 'open';
  return sheetOpen && !hasText ? 'close' : null; // never close on someone who is mid-sentence
}

/** One-line subtitle shown under the TV name. */
export function statusLabel(stateObj, { waking, sleeping = false }) {
  if (!stateObj) return 'Entità non trovata';
  if (sleeping) return 'Spegnimento…';
  if (waking) return 'Accensione…';
  if (stateObj.state === 'unavailable') return 'Non raggiungibile';
  if (stateObj.state === 'off') return 'Spenta';
  const { source, media_title: title } = stateObj.attributes;
  if (source && title) return `${source} · ${title}`;
  return source || 'Accesa';
}

/** User-facing message for a failed command. `context` narrows the cause when known. */
export function describeError({ tvOn, context }) {
  if (!tvOn) return { title: 'TV non raggiungibile', hint: 'Accendila e riprova.' };
  if (context === 'text') {
    return { title: 'Nessun campo di testo aperto', hint: 'Apri una ricerca sulla TV e riprova.' };
  }
  if (context === 'pointer') {
    return { title: 'Puntatore non disponibile', hint: 'Riprova tra un attimo.' };
  }
  return { title: 'Comando non riuscito', hint: 'Riprova.' };
}

/** True on the webOS launcher: nothing is playing, so the "now playing" strip has nothing to show. */
export const isHomeScreen = (attributes) => !attributes?.app_id || attributes.app_id === 'com.webos.app.home';

/** Reads the `haptics` option: off | soft | normal | strong, with true/false from older configs. Unknown values mean soft. */
export function hapticLevel(option) {
  if (option === false || option === 'off') return 'off';
  return option in HAPTIC_LEVELS ? option : 'soft';
}

/** What to send for one kind of feedback at the configured strength; null when haptics are off. */
export function hapticFeedback(option, kind) {
  const level = hapticLevel(option);
  if (level === 'off') return null;
  const { scale, native } = HAPTIC_LEVELS[level];
  const base = HAPTIC_PATTERNS[kind];
  const pattern = Array.isArray(base) ? base.map((ms) => Math.round(ms * scale)) : Math.round(base * scale);
  return { native: native[kind], pattern };
}

/** Where the sliding highlight sits for the selected tab, so it can glide there while the tabs resize. */
export function tabPillRect({ innerWidth, count, selectedIndex, gap, padding, selectedFlex }) {
  const unit = (innerWidth - gap * (count - 1)) / (count - 1 + selectedFlex);
  return { left: padding + selectedIndex * (unit + gap), width: unit * selectedFlex };
}

/** The tab under a point (the middle of a dragged highlight), or the nearest one when the point is in a gap. */
export function tabIndexAt(x, tabRects) {
  let best = 0;
  let bestDistance = Infinity;
  tabRects.forEach(({ left, width }, index) => {
    const distance = x < left ? left - x : x > left + width ? x - (left + width) : 0;
    if (distance < bestDistance) { best = index; bestDistance = distance; }
  });
  return best;
}
