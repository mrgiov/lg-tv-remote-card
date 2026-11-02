/** Tunable values and static data for the LG TV remote card. */

export const DEFAULT_ENTITY = 'media_player.lg_tv';

/** Order matters: it is the left-to-right order of the tabs and of the swipe navigation. */
export const TABS = ['dpad', 'pad', 'keys', 'apps'];

export const DEFAULT_CONFIG = {
  entity: DEFAULT_ENTITY,
  name: '', // shown in the header; empty uses the TV's own name
  favorites: ['Netflix', 'YouTube', 'Prime Video', 'Disney+', 'RaiPlay', 'Stremio'],
  hidden: ['Developer Mode', 'Memory Care', 'OfficeViewer', 'FlexIt'],
  scroll_gain: 2,
  scroll_invert: false,
  favorite_channels: [], // channel numbers listed first; the star in the channel list overrides this per device
  haptics: 'soft', // off | soft | normal | strong (true and false from older configs still work)
  auto_open_keyboard: true, // open the text sheet when the TV focuses a text field
};

export const BRAND_COLORS = {
  'Netflix': '#b1121b',
  'YouTube': '#c4302b',
  'Prime Video': '#0a5ea8',
  'Disney+': '#1a2c6b',
  'RaiPlay': '#1b6fb0',
  'Stremio': '#4a3a6b',
};
export const FALLBACK_TILE_COLOR = '#444444';

export const POINTER = {
  gain: 2.8, // finger px -> TV px
  accelerationPx: 14, // finger speed (px per event) at which the gain doubles
  tickMs: 33, // minimum interval between two move calls
  moveThresholdPx: 8, // below this a touch still counts as a tap
  tapMaxMs: 400,
  doubleTapMs: 300, // second tap within this window starts a drag
};

export const SCROLL = { tickMs: 50 };

export const SWIPE = {
  minDistancePx: 60,
  horizontalRatio: 1.5, // |dx| must exceed |dy| by this factor
  maxMs: 700,
  ghostClickMs: 350, // ignore the click the browser fires right after a swipe
};

export const REPEAT = { delayMs: 450, intervalMs: 180 }; // hold-to-repeat on volume/channel
export const KEYBOARD_EVENT = 'lgtv_pointer_keyboard'; // fired by the lgtv_pointer component
export const KEYBOARD_WATCH_RETRY_MS = 10000; // retry pause when starting the TV keyboard watch fails
export const TEXT_SYNC_MS = 250; // pause after the last keystroke before the text is sent to the TV
export const POWER_HOLD_MS = 1000;
export const WAKE_TIMEOUT_MS = 40000;
export const SLEEP_TIMEOUT_MS = 12000; // the power ring stops after this long if the TV never reports standby
export const TOAST_MS = 3500;
export const SHEET_HIDE_MS = 1400;
/**
 * Haptic strength levels. `native` names the types the Home Assistant apps understand (iOS human interface guideline
 * names); `scale` stretches the browser vibration, which Android ignores below roughly 15-20 ms.
 */
export const HAPTIC_LEVELS = {
  soft: { scale: 1, native: { tap: 'selection', step: 'selection', success: 'light', error: 'warning', heavy: 'medium' } },
  normal: { scale: 1.6, native: { tap: 'light', step: 'selection', success: 'success', error: 'warning', heavy: 'medium' } },
  strong: { scale: 2.6, native: { tap: 'medium', step: 'light', success: 'success', error: 'failure', heavy: 'heavy' } },
};

/** Browser vibration patterns in ms at scale 1. */
export const HAPTIC_PATTERNS = {
  tap: 20, // every key press
  step: 12, // a notch while dragging the volume
  success: [40, 50, 40], // a channel or source was selected
  error: [80, 60, 80], // a command failed or the number does not exist
  heavy: 80, // the TV is switching off or on
};

export const NUMBER_ENTRY = { delayMs: 1800, maxDigits: 3 }; // channel typed on the keypad goes after this pause
export const DATA_REFRESH_MS = 60000; // how often the "now playing" programme is read again
export const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // channel list and app icons change rarely
export const PROGRAM_CACHE_TTL_MS = 5 * 60 * 1000;
export const FAVORITES_FALLBACK = 8; // channels listed before the user stars any

export const POP_IDLE_MS = 3500; // the volume and channel pop-overs close after this long without a touch
export const VOLUME_SET_MS = 120; // minimum interval between two volume_set calls while dragging the slider

/** Footer tab bar geometry, shared by the CSS and by the sliding highlight. `selectedFlex` is the width of the active tab relative to 1 for the others. */
export const TAB_BAR = { gap: 4, padding: 4, selectedFlex: 1.75, animationMs: 360, stretchMax: 0.32 };
