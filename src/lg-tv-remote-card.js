/**
 * lg-tv-remote-card: Lovelace card that turns a phone into a remote for an LG webOS TV.
 * Entry point: owns Home Assistant I/O and the DOM; behaviour lives in the sibling modules.
 */
import {
  BRAND_COLORS, DATA_REFRESH_MS, DEFAULT_CONFIG, FAVORITES_FALLBACK, KEYBOARD_EVENT, KEYBOARD_WATCH_RETRY_MS, NUMBER_ENTRY, POWER_HOLD_MS,
  POP_IDLE_MS, PROGRAM_CACHE_TTL_MS, SHEET_HIDE_MS, SLEEP_TIMEOUT_MS, SWIPE, TAB_BAR, TABS, TEXT_SYNC_MS, TOAST_MS, VOLUME_SET_MS, WAKE_TIMEOUT_MS,
} from './constants.js';
import {
  describeError, hapticFeedback, insertTextPayload, isHomeScreen, isTvOn, keyboardAutoAction, keyboardInset, statusLabel, tabIndexAt, tabPillRect,
} from './logic.js';
import {
  channelColor, channelForNumber, currentProgram, favoriteChannels, isLiveTv, normalizeChannels, toggleFavorite,
} from './channels.js';
import { loadAppIcons, loadChannelList, loadProgramInfo, readCache, writeCache } from './tv-data.js';
import { STYLES } from './styles.js';
import { cardTemplate, icon, muteIcon, padHint } from './template.js';
import { renderApps, renderInputsSheet } from './apps-view.js';
import { channelListHtml } from './channels-view.js';
import './editor.js';
import { attachHold, attachPad, attachPillDrag, attachRepeat, attachStrip, attachSwipe, throttleLatest } from './gestures.js';

/** Tabs that replace the remote area with a scrolling view instead of a fixed panel. */
const SCROLL_TABS = ['apps'];
const IME = 'com.webos.service.ime';
const POWER_BUTTON_GRACE_MS = 800; // ignore the click that follows a completed power-off hold

class LgTvRemoteCard extends HTMLElement {
  static getConfigElement() { return document.createElement('lg-tv-remote-card-editor'); }

  static getStubConfig(hass) {
    const tv = Object.keys(hass?.states ?? {}).find((id) => id.startsWith('media_player.') && /lg|webos/i.test(id));
    return { entity: tv ?? DEFAULT_CONFIG.entity };
  }

  setConfig(config) {
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._tab = TABS[0];
    this._wakeRequestedAt = 0;
    this._sleepRequestedAt = 0;
    this._powerHeldAt = 0;
    this._swipedAt = 0;
    this._sheet = null; // name of the open bottom sheet: keyboard, channels, numpad, inputs
    this._watchingKeyboard = false;
    this._keyboardWatchRetryAt = 0;
    this._channels = [];
    this._favorites = readCache('favorites') ?? this._config.favorite_channels.map(String);
    this._programs = {}; // channel number -> { ...programme, at }
    this._now = null; // channel and programme on air on the live TV source
    this._channelQuery = '';
    this._showAllChannels = false;
    this._typed = '';
    this._icons = {};
    if (!this._root) this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._subscribeKeyboardEvents();
    this._refresh();
  }

  connectedCallback() {
    this._dataTimer = setInterval(() => this._refreshNow(), DATA_REFRESH_MS);
  }

  disconnectedCallback() {
    clearInterval(this._dataTimer);
    clearTimeout(this._laterTimer);
    this._keyboardEvents?.then((unsubscribe) => unsubscribe());
    this._keyboardEvents = null;
  }

  get _keyboardOpen() { return this._sheet === 'keyboard'; }

  getCardSize() { return 12; }

  // ---- Home Assistant I/O -------------------------------------------------

  get _stateObj() { return this._hass?.states[this._config.entity]; }
  get _tvOn() { return isTvOn(this._stateObj); }
  get _hasPointer() { return Boolean(this._hass?.services.lgtv_pointer); }

  /** Calls a service; on failure shows a toast. Resolves to true on success, false otherwise. */
  async _callService(domain, service, data, context) {
    try {
      await this._hass.callService(domain, service, data);
      return true;
    } catch (error) {
      this._showError(context);
      return false;
    }
  }

  _press(button) {
    this._buzz();
    return this._callService('webostv', 'button', { entity_id: this._config.entity, button });
  }
  _command(command, payload, context) {
    return this._callService('webostv', 'command', { entity_id: this._config.entity, command, payload }, context);
  }
  _mediaPlayer(service, data = {}) {
    return this._callService('media_player', service, { entity_id: this._config.entity, ...data });
  }
  _pointer(service, data) {
    return this._callService('lgtv_pointer', service, { entity_id: this._config.entity, ...data }, 'pointer');
  }

  /** Haptic feedback at the configured strength: natively in the Home Assistant apps, by vibration in a browser. */
  _haptic(kind = 'tap') {
    const feedback = hapticFeedback(this._config.haptics, kind);
    if (!feedback || this._hass?.vibrate === false) return;
    const external = this._hass?.auth?.external;
    try {
      if (external?.fireMessage) external.fireMessage({ type: 'haptic', payload: { hapticType: feedback.native } });
      else navigator.vibrate?.(feedback.pattern);
    } catch (error) { /* haptics are optional */ }
  }

  _buzz() { this._haptic('tap'); }

  // ---- Rendering ----------------------------------------------------------

  _render() {
    this._root = this.attachShadow({ mode: 'open' });
    this._root.innerHTML = `<style>${STYLES}</style>${cardTemplate()}`;
    this._ui = this._queryElements();
    this._wire();
    this._goToTab(this._tab);
  }

  _queryElements() {
    const byId = (id) => this._root.getElementById(id);
    return {
      card: this._root.querySelector('ha-card'),
      stage: byId('stage'), center: byId('center'), body: byId('body'), tabs: byId('tabs'), tabPill: byId('tab-pill'), tabBlob: byId('tab-blob'),
      now: byId('now'), nowLogo: byId('now-logo'), nowTitle: byId('now-title'), nowSub: byId('now-sub'), nowBar: byId('now-bar'), nowFill: byId('now-fill'),
      channelList: byId('channel-list'), channelSearch: byId('channel-search'), inputsBody: byId('inputs-body'),
      numDisplay: byId('num-display'), numValue: byId('num-value'), numName: byId('num-name'), numRing: byId('num-ring'),
      name: byId('name'), status: byId('status'), mute: byId('mute'), power: byId('power'),
      pad: byId('pad'), strip: byId('strip'), apps: byId('apps'), text: byId('text'),
      dock: this._root.querySelector('.dock'), dockVolume: byId('dock-volume'), dockChannel: byId('dock-channel'), popScrim: byId('pop-scrim'),
      popVolume: byId('pop-volume'), popChannel: byId('pop-channel'), vpill: byId('vpill'), vfill: byId('vfill'), volLevel: byId('vol-level'),
      popChannelNumber: byId('pop-channel-number'), popChannelName: byId('pop-channel-name'),
      standbyTitle: byId('standby-title'), standbyHint: byId('standby-hint'), powerBig: byId('power-big'),
      backdrop: byId('kb-backdrop'), toast: byId('toast'), sheet: byId('sheet'), sheetHint: byId('sheet-hint'), sheetFill: byId('sheet-fill'),
      controls: this._root.querySelectorAll('[data-group=controls]'),
    };
  }

  _wire() {
    const ui = this._ui;
    this._root.addEventListener('click', (event) => this._onClick(event));
    ui.text.addEventListener('input', () => this._scheduleTextSync());
    ui.text.addEventListener('keydown', (event) => this._onTextKey(event));
    ui.backdrop.addEventListener('click', () => this._closeSheet());
    ui.popScrim.addEventListener('click', () => this._closePop());
    for (const pop of [ui.popVolume, ui.popChannel]) pop.addEventListener('pointerdown', () => this._armPopTimer());
    this._wireVolumeSlider();
    ui.channelSearch.addEventListener('input', () => { this._channelQuery = ui.channelSearch.value; this._renderChannelList(); });
    ui.numDisplay.addEventListener('click', () => this._confirmNumber());
    window.visualViewport?.addEventListener('resize', () => this._placeSheets());
    window.addEventListener('resize', () => { this._placeSheets(); this._placeTabPill(); });
    ui.power.addEventListener('click', () => this._onPowerClick());
    ui.powerBig.addEventListener('click', () => this._requestPowerOn());

    attachRepeat(this._root.querySelectorAll('[data-repeat]'), (button) => this._press(button));
    attachHold(ui.power, {
      durationMs: POWER_HOLD_MS,
      enabled: () => this._tvOn,
      onStart: () => this._startPowerHold(),
      onComplete: () => this._completePowerHold(),
      onCancel: () => this._cancelPowerHold(),
    });
    attachPad(ui.pad, {
      hasPointer: () => this._hasPointer,
      pointer: (service, data) => this._pointer(service, data),
      press: (button) => this._press(button),
      buzz: () => this._buzz(),
    });
    attachStrip(ui.strip, {
      gain: this._config.scroll_gain,
      send: (dy) => this._pointer('scroll', { dx: 0, dy: this._config.scroll_invert ? -dy : dy }),
    });
    attachPillDrag(ui.tabs, ui.tabPill, {
      start: () => this._startPillDrag(),
      move: (fingerX) => this._dragPill(fingerX),
      drop: () => this._dropPill(),
    });
    attachSwipe(ui.card, {
      enabled: () => !this._sheet && !this._pop,
      currentTab: () => this._tab,
      goTo: (tab, direction) => this._goToTab(tab, direction),
      buzz: () => this._buzz(),
      markSwiped: () => { this._swipedAt = Date.now(); },
    });
  }

  _refresh() {
    if (!this._ui || !this._hass) return;
    const on = this._tvOn;
    if (on) this._wakeRequestedAt = 0;
    else this._sleepRequestedAt = 0;
    const waking = this._isWaking();
    const sleeping = this._isSleeping();
    const stateObj = this._stateObj;
    const attributes = stateObj?.attributes ?? {};
    const ui = this._ui;

    this._watchTvKeyboard(on);
    ui.name.textContent = this._config.name || attributes.friendly_name || 'TV';
    ui.status.textContent = statusLabel(stateObj, { waking, sleeping });
    ui.power.classList.toggle('busy', waking || sleeping);
    ui.power.classList.toggle('off', !on); // red only while the TV is on
    ui.stage.classList.toggle('standby', !on);
    ui.controls.forEach((node) => node.classList.toggle('disabled', !on));
    ui.mute.classList.toggle('disabled', !on);

    ui.standbyTitle.textContent = waking ? 'Accensione in corso…' : stateObj?.state === 'unavailable' ? 'TV non raggiungibile' : 'Accendi la TV';
    ui.standbyHint.textContent = waking ? 'Attendi qualche secondo' : 'Ci vogliono circa 15 secondi';
    ui.powerBig.classList.toggle('busy', waking);

    const muted = Boolean(attributes.is_volume_muted);
    ui.mute.classList.toggle('alert', muted);
    ui.mute.innerHTML = muteIcon(muted);
    this._renderVolume(attributes.volume_level, muted);

    ui.strip.classList.toggle('available', this._hasPointer);
    ui.pad.innerHTML = padHint(this._hasPointer);

    const sources = attributes.source_list ?? [];
    const renderKey = `${sources.join('|')}#${attributes.source ?? ''}#${Object.keys(this._icons).length}`;
    if (renderKey !== this._appsRenderKey) {
      this._appsRenderKey = renderKey;
      this._renderSources(sources, attributes.source);
    }
    if (on) this._ensureIcons();
    const nowKey = `${on}|${attributes.app_id}|${attributes.media_title}|${attributes.source}`;
    if (nowKey !== this._nowKey) {
      this._nowKey = nowKey;
      this._now = null;
      this._refreshNow();
    }
    this._renderNow();
  }

  _renderSources(sources, current) {
    const options = { sources, current, config: this._config, icons: this._icons, showIcon: icon, onSelect: (source) => this._selectSource(source) };
    renderApps(this._ui.apps, options);
    renderInputsSheet(this._ui.inputsBody, options);
  }

  // ---- Now playing --------------------------------------------------------

  /** Reads the channel and programme on air; only meaningful on the live TV source. */
  async _refreshNow() {
    if (!this._hass || !this._tvOn || !isLiveTv(this._stateObj?.attributes) || this._nowBusy) return;
    this._nowBusy = true;
    try {
      const { channel, programList } = await loadProgramInfo(this._hass, this._config.entity);
      if (!channel) return;
      this._now = { number: String(channel.channelNumber), name: channel.channelName, program: currentProgram(programList) };
      this._renderNow();
    } catch (error) {
      /* the strip falls back to the name the media player reports */
    } finally {
      this._nowBusy = false;
    }
  }

  /** The strip shows channel and programme on live TV, otherwise the active app or input with transport keys. */
  _renderNow() {
    const attributes = this._stateObj?.attributes ?? {};
    const ui = this._ui;
    const live = isLiveTv(attributes);
    ui.now.classList.toggle('gone', isHomeScreen(attributes));
    ui.now.dataset.mode = live ? 'live' : 'app';
    ui.nowBar.style.display = 'none';
    let tint = '#1d4ed8';
    if (live) {
      const number = this._now?.number;
      const name = this._now?.name ?? attributes.media_title ?? 'Canali TV';
      const program = this._now?.program;
      ui.nowLogo.style.cssText = `--logo:${channelColor(name)}`;
      ui.nowLogo.textContent = number ?? '';
      ui.nowTitle.textContent = name;
      ui.nowSub.textContent = program ? `${program.name} · ${program.minutesLeft} min` : 'Canali TV';
      if (program) { ui.nowBar.style.display = ''; ui.nowFill.style.width = `${Math.round(program.progress * 100)}%`; }
      tint = channelColor(name);
      ui.popChannelNumber.textContent = number ?? '–';
      ui.popChannelName.textContent = name;
    } else {
      const source = attributes.source ?? 'TV';
      const iconUrl = this._icons[source];
      ui.nowLogo.style.cssText = iconUrl ? `background-image:url("${iconUrl}")` : `--logo:${BRAND_COLORS[source] ?? '#444'}`;
      ui.nowLogo.textContent = iconUrl ? '' : source.charAt(0);
      ui.nowTitle.textContent = source;
      ui.nowSub.textContent = /^HDMI/.test(source) ? 'Ingresso' : 'In riproduzione';
      tint = BRAND_COLORS[source] ?? '#1d4ed8';
      ui.popChannelNumber.textContent = '–';
      ui.popChannelName.textContent = source;
    }
    ui.card.style.setProperty('--tint', tint);
  }

  async _ensureIcons() {
    if (Object.keys(this._icons).length || (this._iconsTried && Date.now() - this._iconsTried < 60000)) return;
    this._iconsTried = Date.now();
    try {
      const icons = await loadAppIcons(this._hass, this._config.entity);
      if (Object.keys(icons).length) { this._icons = icons; this._appsRenderKey = null; this._refresh(); }
    } catch (error) {
      /* tiles keep their coloured letter */
    }
  }

  _isSleeping() {
    return this._sleepRequestedAt > 0 && Date.now() - this._sleepRequestedAt < SLEEP_TIMEOUT_MS;
  }

  /** Redraws once a waiting state has timed out, so the ring does not spin forever. */
  _refreshAfter(ms) {
    clearTimeout(this._laterTimer);
    this._laterTimer = setTimeout(() => this._refresh(), ms + 100);
  }

  _isWaking() {
    return this._wakeRequestedAt > 0 && Date.now() - this._wakeRequestedAt < WAKE_TIMEOUT_MS;
  }

  // ---- Tabs ---------------------------------------------------------------

  _goToTab(tab, direction = 0) {
    const previous = this._tab;
    this._tab = tab;
    const showScrollView = SCROLL_TABS.includes(tab);
    this._root.querySelectorAll('[data-tab]').forEach((node) => node.classList.toggle('selected', node.dataset.tab === tab));
    this._ui.body.dataset.activeTab = tab;
    this._placeTabPill();
    this._root.querySelectorAll('[data-panel]').forEach((node) => node.classList.toggle('active', node.dataset.panel === tab));
    this._root.querySelectorAll('[data-view]').forEach((node) => node.classList.toggle('active', node.dataset.view === tab));
    this._ui.center.style.display = showScrollView ? 'none' : 'flex';
    if (direction && previous !== tab) {
      const visible = showScrollView ? this._root.querySelector(`[data-view=${tab}]`) : this._ui.center;
      this._animateSlide(visible, direction);
    }
  }

  /** Slides the highlight under the selected tab; the first placement is instant. */
  _placeTabPill() {
    const { tabs, tabPill } = this._ui;
    const width = tabs.clientWidth;
    if (!width) { requestAnimationFrame(() => this._placeTabPill()); return; } // not laid out yet
    const rect = tabPillRect({
      innerWidth: width - 2 * TAB_BAR.padding, count: TABS.length, selectedIndex: TABS.indexOf(this._tab),
      gap: TAB_BAR.gap, padding: TAB_BAR.padding, selectedFlex: TAB_BAR.selectedFlex,
    });
    const travelled = Math.abs(rect.left - (this._pillLeft ?? rect.left));
    this._pillLeft = rect.left;
    tabPill.style.width = `${rect.width}px`;
    tabPill.style.transform = `translateX(${rect.left}px)`;
    if (travelled > 1 && tabs.classList.contains('settled')) this._stretchBlob(travelled);
    if (!tabs.classList.contains('settled')) requestAnimationFrame(() => requestAnimationFrame(() => tabs.classList.add('settled')));
  }

  /** The bubble stretches along its path and springs back, like a drop of liquid. */
  _stretchBlob(distance) {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const stretch = Math.min(TAB_BAR.stretchMax, distance / 360);
    this._ui.tabBlob.animate([
      { transform: 'scale(1, 1)' },
      { transform: `scale(${1 + stretch}, ${1 - stretch * 0.55})`, offset: 0.3 },
      { transform: `scale(${1 - stretch * 0.25}, ${1 + stretch * 0.3})`, offset: 0.65 },
      { transform: 'scale(1, 1)' },
    ], { duration: TAB_BAR.animationMs + 160, easing: 'ease-out' });
  }

  /** While held, the bubble shrinks to a circle as big as the tab is tall, and follows the finger. */
  _startPillDrag() {
    const { tabs } = this._ui;
    this._pillIndex = null;
    tabs.classList.add('dragging', 'grab');
    clearTimeout(this._grabTimer);
    this._grabTimer = setTimeout(() => tabs.classList.remove('grab'), 260);
  }

  _dragPill(fingerX) {
    const { tabs, tabPill } = this._ui;
    const diameter = tabPill.offsetHeight;
    const clamped = Math.min(Math.max(fingerX - diameter / 2, TAB_BAR.padding), tabs.clientWidth - TAB_BAR.padding - diameter);
    tabPill.style.width = `${diameter}px`;
    tabPill.style.transform = `translateX(${clamped}px)`;
    const speed = Math.abs(clamped - (this._pillLeft ?? clamped));
    this._pillLeft = clamped;
    tabs.style.setProperty('--sx', 1 + Math.min(0.3, speed / 50));
    tabs.style.setProperty('--sy', 1 - Math.min(0.14, speed / 110));
    const buttons = [...tabs.querySelectorAll('.tab')];
    const index = tabIndexAt(fingerX, buttons.map((b) => ({ left: b.offsetLeft, width: b.offsetWidth })));
    if (index === this._pillIndex) return;
    this._pillIndex = index;
    this._haptic('step');
    buttons.forEach((button, i) => button.classList.toggle('hover', i === index));
  }

  _dropPill() {
    const { tabs } = this._ui;
    const index = this._pillIndex ?? TABS.indexOf(this._tab);
    tabs.classList.remove('dragging', 'grab');
    tabs.style.removeProperty('--sx');
    tabs.style.removeProperty('--sy');
    tabs.querySelectorAll('.tab').forEach((button) => button.classList.remove('hover'));
    this._pillIndex = null;
    this._swipedAt = Date.now(); // the release must not also count as a tap
    this._haptic('tap');
    this._goToTab(TABS[index]);
  }

  _animateSlide(node, direction) {
    node.classList.remove('slide-forward', 'slide-back');
    void node.offsetWidth; // restart the CSS animation
    node.classList.add(direction > 0 ? 'slide-forward' : 'slide-back');
  }

  // ---- User actions -------------------------------------------------------

  _onClick(event) {
    if (Date.now() - this._swipedAt < SWIPE.ghostClickMs) return;
    const tab = event.target.closest('[data-tab]');
    if (tab) { this._buzz(); return this._goToTab(tab.dataset.tab); }
    const star = event.target.closest('[data-star]');
    if (star) return this._toggleStar(star.dataset.star);
    const channel = event.target.closest('[data-channel]');
    if (channel) return this._tuneChannel(channel.dataset.channel);
    const digit = event.target.closest('[data-digit]');
    if (digit) return this._onDigit(digit.dataset.digit);
    const button = event.target.closest('[data-button]');
    if (button) return this._press(button.dataset.button);
    const action = event.target.closest('[data-action]');
    if (action) this._runAction(action.dataset.action);
  }

  _runAction(action) {
    switch (action) {
      case 'mute': this._buzz(); return this._mediaPlayer('volume_mute', { is_volume_muted: !this._stateObj?.attributes.is_volume_muted });
      case 'play-pause': this._buzz(); return this._mediaPlayer('media_play_pause');
      case 'toggle-volume': return this._togglePop('volume');
      case 'toggle-channel': return this._togglePop('channel');
      case 'open-keyboard': return this._openSheet('keyboard');
      case 'close-sheet': return this._closeSheet();
      case 'open-now': return this._openSheet(isLiveTv(this._stateObj?.attributes) ? 'channels' : 'inputs');
      case 'open-channels': return this._openSheet('channels');
      case 'open-inputs': return this._openSheet('inputs');
      case 'open-numpad': return this._openSheet('numpad');
      case 'toggle-all-channels': this._showAllChannels = !this._showAllChannels; return this._renderChannelList();
      case 'show-all-apps': this._closeSheet(); return this._goToTab('apps');
      case 'clear-text': return this._clearText();
      case 'enter-key': return this._pressEnterKey();
      case 'dictate': return this._dictate();
      default: throw new Error(`Unknown card action: ${action}`);
    }
  }

  _selectSource(source) {
    this._haptic('success');
    this._mediaPlayer('select_source', { source });
    this._closeSheet();
  }

  /** Mirrors the field to the TV shortly after the last keystroke. */
  _scheduleTextSync() {
    clearTimeout(this._textSyncTimer);
    this._textSyncTimer = setTimeout(() => this._syncText(), TEXT_SYNC_MS);
  }

  /** Sends the field content; one request at a time. Resolves when the TV is up to date. */
  _syncText() {
    if (this._textSync) {
      this._textDirty = true;
      return this._textSync;
    }
    this._textSync = this._flushText().finally(() => { this._textSync = null; });
    return this._textSync;
  }

  /** Repeats while the field changed during a request, so the TV always ends with the latest text. */
  async _flushText() {
    let sent;
    do {
      this._textDirty = false;
      sent = await this._command(`${IME}/insertText`, insertTextPayload(this._ui.text.value), 'text');
    } while (this._textDirty && sent);
  }

  _clearText() {
    this._ui.text.value = '';
    clearTimeout(this._textSyncTimer);
    this._syncText();
  }

  async _pressEnterKey() {
    clearTimeout(this._textSyncTimer);
    await this._syncText();
    const confirmed = await this._command(`${IME}/sendEnterKey`, {}, 'text');
    if (!confirmed) return;
    this._ui.text.value = '';
    this._closeSheet();
  }

  _onTextKey(event) {
    if (event.key === 'Enter') this._pressEnterKey();
    else if (event.key === 'Escape') this._closeSheet();
  }

  // ---- Keyboard sheet -----------------------------------------------------

  /** The lgtv_pointer component fires an event whenever a text field gains or loses focus on the TV. */
  _subscribeKeyboardEvents() {
    if (!this._config.auto_open_keyboard || this._keyboardEvents || !this._hass?.connection) return;
    this._keyboardEvents = this._hass.connection.subscribeEvents(
      (event) => this._onTvKeyboardEvent(event.data), KEYBOARD_EVENT,
    );
  }

  /** Asks the component to start listening on the TV; repeated while the TV is on, until it succeeds. */
  _watchTvKeyboard(tvOn) {
    if (!this._config.auto_open_keyboard) return;
    if (!tvOn) { this._watchingKeyboard = false; return; }
    const available = this._hass.services.lgtv_pointer?.watch_keyboard;
    if (!available || this._watchingKeyboard || Date.now() < this._keyboardWatchRetryAt) return;
    this._watchingKeyboard = true;
    this._hass.callService('lgtv_pointer', 'watch_keyboard', { entity_id: this._config.entity }).catch(() => {
      this._watchingKeyboard = false;
      this._keyboardWatchRetryAt = Date.now() + KEYBOARD_WATCH_RETRY_MS;
    });
  }

  _onTvKeyboardEvent({ entity_id: entityId, focus }) {
    if (entityId !== this._config.entity) return;
    const action = keyboardAutoAction({ focus, sheetOpen: this._keyboardOpen, hasText: Boolean(this._ui.text.value) });
    if (action === 'open') this._openSheet('keyboard');
    else if (action === 'close') this._closeSheet();
  }

  // ---- Volume and channel pop-overs, expanding from the dock ---------------

  _togglePop(name) {
    this._buzz();
    if (this._pop === name) return this._closePop();
    this._pop = name;
    const { card, dock, popVolume, popChannel } = this._ui;
    const button = name === 'volume' ? this._ui.dockVolume : this._ui.dockChannel;
    const pop = name === 'volume' ? popVolume : popChannel;
    const cardBox = card.getBoundingClientRect();
    const dockBox = dock.getBoundingClientRect();
    const buttonBox = button.getBoundingClientRect();
    const popWidth = pop.offsetWidth || 104;
    const right = Math.max(8, cardBox.right - buttonBox.right - (popWidth - buttonBox.width) / 2);
    card.style.setProperty('--pop-right', `${right}px`);
    card.style.setProperty('--pop-bottom', `${cardBox.bottom - dockBox.top + 8}px`);
    const popLeft = cardBox.right - right - popWidth;
    card.style.setProperty('--pop-origin', `${buttonBox.left + buttonBox.width / 2 - popLeft}px 100%`);
    card.dataset.pop = name;
    button.classList.add('active');
    this._armPopTimer();
  }

  _closePop() {
    if (!this._pop) return;
    this._pop = null;
    delete this._ui.card.dataset.pop;
    this._ui.dockVolume.classList.remove('active');
    this._ui.dockChannel.classList.remove('active');
    clearTimeout(this._popTimer);
  }

  _armPopTimer() {
    clearTimeout(this._popTimer);
    this._popTimer = setTimeout(() => this._closePop(), POP_IDLE_MS);
  }

  /** Dragging the pill sets the level directly; calls are spaced out so the TV is not flooded. */
  _wireVolumeSlider() {
    const { vpill } = this._ui;
    const setFromPointer = (event) => {
      const box = vpill.getBoundingClientRect();
      const level = Math.min(1, Math.max(0, (box.bottom - event.clientY) / box.height));
      const notch = Math.round(level * 33); // one tick every three volume points
      if (notch !== this._volumeNotch) { this._volumeNotch = notch; this._haptic('step'); }
      this._renderVolume(level, false);
      this._volumeSetter(level);
      this._armPopTimer();
    };
    this._volumeSetter = throttleLatest((level) => this._mediaPlayer('volume_set', { volume_level: Math.round(level * 100) / 100 }), VOLUME_SET_MS);
    vpill.addEventListener('pointerdown', (event) => { vpill.setPointerCapture(event.pointerId); setFromPointer(event); });
    vpill.addEventListener('pointermove', (event) => { if (vpill.hasPointerCapture(event.pointerId)) setFromPointer(event); });
  }

  _renderVolume(level, muted) {
    const { vfill, vpill, volLevel, dockVolume } = this._ui;
    const percent = level == null ? 0 : Math.round(level * 100);
    vfill.style.height = `${percent}%`;
    vpill.classList.toggle('low', percent < 18);
    volLevel.textContent = level == null ? '–' : percent;
    dockVolume.innerHTML = icon(muted ? 'volume-off' : level != null && level < 0.34 ? 'volume-low' : 'volume-high');
  }

  // ---- Bottom sheets: keyboard, channels, number pad, inputs ----------------

  _openSheet(name) {
    this._buzz();
    this._closePop();
    this._sheet = name;
    this._ui.card.dataset.sheet = name;
    this._placeSheets();
    if (name === 'keyboard') this._ui.text.focus(); // inside the tap handler, so the phone keyboard opens right away
    if (name === 'channels') this._onChannelsOpened();
    if (name === 'numpad') this._onNumpadOpened();
    if (name === 'inputs') this._renderSources(this._stateObj?.attributes.source_list ?? [], this._stateObj?.attributes.source);
  }

  _closeSheet() {
    this._sheet = null;
    delete this._ui.card.dataset.sheet;
    this._ui.text.blur();
    this._ui.channelSearch.blur();
    this._cancelNumberTimer();
  }

  /** Lines the sheets up with the card (the page may have a sidebar) and just above the phone keyboard. */
  _placeSheets() {
    const { card } = this._ui;
    const { left, width } = card.getBoundingClientRect();
    card.style.setProperty('--kb-left', `${left}px`);
    card.style.setProperty('--kb-width', `${width}px`);
    const viewport = window.visualViewport;
    if (!viewport) return;
    const inset = keyboardInset({
      layoutHeight: window.innerHeight, visualHeight: viewport.height, visualOffsetTop: viewport.offsetTop,
    });
    card.style.setProperty('--kb-inset', `${inset}px`);
  }

  // ---- Channels -----------------------------------------------------------

  async _ensureChannels() {
    if (this._channels.length || this._loadingChannels || !this._tvOn) return;
    this._loadingChannels = true;
    try {
      this._channels = normalizeChannels(await loadChannelList(this._hass, this._config.entity));
    } catch (error) {
      this._showError('channels');
    } finally {
      this._loadingChannels = false;
    }
  }

  async _onChannelsOpened() {
    this._ui.channelSearch.value = '';
    this._channelQuery = '';
    this._renderChannelList();
    await this._ensureChannels();
    this._renderChannelList();
    this._loadListedPrograms();
  }

  _renderChannelList() {
    this._ui.channelList.innerHTML = channelListHtml({
      channels: this._channels, favorites: this._favorites, query: this._channelQuery, showAll: this._showAllChannels,
      current: this._now?.number, programs: this._programs,
    });
  }

  /** Fills in the programme of each favourite one after the other, so the list gains detail as it arrives. */
  async _loadListedPrograms() {
    const wanted = favoriteChannels(this._channels, this._favorites, FAVORITES_FALLBACK);
    for (const channel of wanted) {
      const known = this._programs[channel.number];
      if (known && Date.now() - known.at < PROGRAM_CACHE_TTL_MS) continue;
      if (this._sheet !== 'channels') return;
      try {
        const { programList } = await loadProgramInfo(this._hass, this._config.entity, channel.id);
        this._programs[channel.number] = { ...(currentProgram(programList) ?? {}), at: Date.now() };
        this._renderChannelList();
      } catch (error) {
        return; // the rows stay without a programme line
      }
    }
  }

  _toggleStar(number) {
    this._favorites = toggleFavorite(this._favorites, number);
    writeCache('favorites', this._favorites);
    this._renderChannelList();
    this._loadListedPrograms();
  }

  _tuneChannel(number) {
    this._haptic('success');
    this._mediaPlayer('play_media', { media_content_type: 'channel', media_content_id: number });
    this._closeSheet();
    setTimeout(() => { this._nowKey = null; this._refreshNow(); }, 1500);
  }

  // ---- Number entry: digits fill the display, the channel goes after a short pause ----

  _onNumpadOpened() {
    this._typed = '';
    this._renderNumpad();
    this._ensureChannels().then(() => this._renderNumpad());
  }

  _onDigit(digit) {
    this._buzz();
    if (digit === 'del') this._typed = this._typed.slice(0, -1);
    else if (this._typed.length < NUMBER_ENTRY.maxDigits) this._typed += digit;
    this._renderNumpad();
    this._armNumberTimer();
  }

  _renderNumpad() {
    const { numValue, numName } = this._ui;
    const channel = channelForNumber(this._channels, this._typed);
    numValue.textContent = this._typed;
    if (!this._typed) numName.textContent = 'Scrivi il numero del canale';
    else if (channel) numName.textContent = channel.name;
    else numName.textContent = this._typed.length >= 2 ? 'Canale non trovato' : '';
  }

  _armNumberTimer() {
    this._cancelNumberTimer();
    if (!channelForNumber(this._channels, this._typed)) return;
    const { numDisplay, numRing } = this._ui;
    const startedAt = Date.now();
    numDisplay.classList.add('counting');
    const tick = () => {
      const progress = Math.min(1, (Date.now() - startedAt) / NUMBER_ENTRY.delayMs);
      numRing.style.setProperty('--p', `${Math.round(progress * 100)}%`);
      if (progress < 1) this._numberFrame = requestAnimationFrame(tick);
    };
    tick();
    this._numberTimer = setTimeout(() => this._confirmNumber(), NUMBER_ENTRY.delayMs);
  }

  _cancelNumberTimer() {
    clearTimeout(this._numberTimer);
    cancelAnimationFrame(this._numberFrame);
    this._ui.numDisplay.classList.remove('counting');
    this._ui.numRing.style.setProperty('--p', '0%');
  }

  _confirmNumber() {
    this._cancelNumberTimer();
    const channel = channelForNumber(this._channels, this._typed);
    if (!channel) {
      const { numDisplay } = this._ui;
      numDisplay.classList.remove('bad');
      void numDisplay.offsetWidth; // restart the shake animation
      numDisplay.classList.add('bad');
      this._haptic('error');
      return;
    }
    this._typed = '';
    this._tuneChannel(channel.number);
  }

  _dictate() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      this._ui.text.placeholder = 'Usa il microfono della tastiera';
      this._ui.text.focus();
      return;
    }
    const recognition = new Recognition();
    recognition.lang = 'it-IT';
    recognition.interimResults = false;
    recognition.onresult = (event) => { this._ui.text.value = event.results[0][0].transcript; this._syncText(); };
    recognition.onerror = () => { this._ui.text.placeholder = 'Dettatura non riuscita'; };
    recognition.start();
  }

  // ---- Power --------------------------------------------------------------

  _onPowerClick() {
    const justHeld = Date.now() - this._powerHeldAt < POWER_BUTTON_GRACE_MS;
    if (!this._tvOn && !justHeld) this._requestPowerOn();
  }

  _requestPowerOn() {
    this._haptic('heavy');
    this._wakeRequestedAt = Date.now();
    this._mediaPlayer('turn_on');
    this._refresh();
    this._refreshAfter(WAKE_TIMEOUT_MS);
  }

  /** Switching off needs a one-second hold, shown as a filling bar, to avoid accidental taps. */
  _startPowerHold() {
    const { sheet, sheetHint, sheetFill, power } = this._ui;
    clearTimeout(this._sheetHideTimer);
    sheetHint.textContent = 'Tieni premuto il tasto per un secondo';
    sheet.classList.add('visible');
    power.classList.add('holding');
    this._setHoldProgress(0, 'none');
    void sheetFill.offsetWidth;
    this._setHoldProgress(100, `width ${POWER_HOLD_MS}ms linear`);
  }

  _completePowerHold() {
    this._powerHeldAt = Date.now();
    this._haptic('heavy');
    this._sleepRequestedAt = Date.now();
    this._mediaPlayer('turn_off');
    this._refresh();
    this._refreshAfter(SLEEP_TIMEOUT_MS);
    this._ui.sheet.classList.remove('visible');
    this._ui.power.classList.remove('holding');
    this._setHoldProgress(0, 'none');
  }

  _cancelPowerHold() {
    this._ui.power.classList.remove('holding');
    this._setHoldProgress(0, 'none');
    this._ui.sheetHint.textContent = 'Tieni premuto più a lungo per spegnere';
    this._sheetHideTimer = setTimeout(() => this._ui.sheet.classList.remove('visible'), SHEET_HIDE_MS);
  }

  _setHoldProgress(percent, transition) {
    this._ui.sheetFill.style.transition = transition;
    this._ui.sheetFill.style.width = `${percent}%`;
  }

  // ---- Feedback -----------------------------------------------------------

  _showError(context) {
    this._haptic('error');
    const { title, hint } = describeError({ tvOn: this._tvOn, context });
    this._ui.toast.innerHTML = `<b>${title}</b><br>${hint}`;
    this._ui.toast.classList.add('visible');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => this._ui.toast.classList.remove('visible'), TOAST_MS);
  }
}

customElements.define('lg-tv-remote-card', LgTvRemoteCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'lg-tv-remote-card',
  name: 'LG TV Remote',
  description: 'Telecomando LG webOS per smartphone: touchpad, app, testo, volume e canali',
});
