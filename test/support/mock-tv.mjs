/**
 * A fake LG TV behind a fake Home Assistant: it answers the same services the card calls and keeps the TV state,
 * so tests can drive the whole card without a real TV or a real Home Assistant.
 */
const CHANNEL_NAMES = ['Rai 1', 'Rai 2', 'Rai 3', 'Rete 4', 'Canale 5', 'Italia 1', 'La7', 'TV8', 'Nove', 'Rai 4', 'Iris', 'Rai 5'];
const APP_SOURCES = ['Netflix', 'YouTube', 'Prime Video', 'Disney+', 'RaiPlay', 'Stremio', 'Browser Web', 'Developer Mode'];
const INPUT_SOURCES = ['Canali TV', 'HDMI 1', 'HDMI 2', 'HDMI 3', 'HDMI 4'];
const ENTITY = 'media_player.lg_tv';
const LIVE_TV = 'com.webos.app.livetv';
const HOME = 'com.webos.app.home';

const APP_COLORS = { Netflix: '#b1121b', YouTube: '#c4302b', 'Prime Video': '#0a5ea8', 'Disney+': '#1a2c6b', RaiPlay: '#1b6fb0', Stremio: '#4a3a6b' };

/** A small coloured tile standing in for the icon the TV would serve. */
const appIcon = (name) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><title>${name}</title><rect width="64" height="64" rx="14" fill="${APP_COLORS[name] ?? '#555'}"/>`
    + `<text x="32" y="43" font-size="30" font-family="sans-serif" font-weight="700" text-anchor="middle" fill="#fff">${name.charAt(0)}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const pad = (n) => String(n).padStart(2, '0');
const tvTime = (date) => [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate()), pad(date.getHours()), pad(date.getMinutes()), '00'].join(',');

export class MockTv {
  constructor({ power = 'on', wakeDelayMs = 40, sleepDelayMs = 40, latencyMs = 0 } = {}) {
    this.entity = ENTITY;
    this.power = power; // on | off | unavailable
    this.wakeDelayMs = wakeDelayMs;
    this.sleepDelayMs = sleepDelayMs;
    this.latencyMs = latencyMs;
    this.appId = LIVE_TV;
    this.source = 'Canali TV';
    this.channelIndex = 0;
    this.volume = 13;
    this.muted = false;
    this.fieldFocused = false;
    this.text = '';
    this.calls = []; // every call the card made: { kind, domain, service, data }
    this.failNext = null; // a predicate or true: makes the next matching call throw
    this.listeners = []; // subscribeEvents callbacks
    this.onChange = () => {}; // set by the test to push the new hass into the card
    this.haptics = []; // messages sent through hass.auth.external
    this.channels = CHANNEL_NAMES.map((name, i) => ({
      channelId: `id${i + 1}`, channelNumber: String(i + 1), channelName: name, TV: true, Radio: false, Invisible: false,
    }));
  }

  // ---- what the card sees -------------------------------------------------

  get state() {
    if (this.power !== 'on') return this.power;
    return 'playing';
  }

  get attributes() {
    const base = { friendly_name: 'LG Tv', supported_features: 24509 };
    if (this.power !== 'on') return { ...base, source_list: [...INPUT_SOURCES, ...APP_SOURCES] };
    return {
      ...base,
      source_list: [...INPUT_SOURCES, ...APP_SOURCES],
      source: this.source,
      app_id: this.appId,
      media_title: this.appId === LIVE_TV ? this.channels[this.channelIndex].channelName : '',
      volume_level: this.volume / 100,
      is_volume_muted: this.muted,
    };
  }

  /** A fresh hass object every time, as Home Assistant does on each state change. */
  hass({ external = true } = {}) {
    const hass = {
      states: { [ENTITY]: { state: this.state, attributes: this.attributes } },
      services: { lgtv_pointer: { move: {}, click: {}, scroll: {}, watch_keyboard: {}, app_icons: {} } },
      connection: { subscribeEvents: async (callback) => { this.listeners.push(callback); return () => {}; } },
      callService: (domain, service, data) => this.callService(domain, service, data),
      callWS: (message) => this.callWS(message),
    };
    if (external) hass.auth = { external: { fireMessage: (message) => this.haptics.push(message) } };
    return hass;
  }

  // ---- services -----------------------------------------------------------

  async callService(domain, service, data = {}) {
    this.calls.push({ kind: 'service', domain, service, data });
    await this.#delay();
    this.#maybeFail(domain, service);
    if (domain === 'media_player') return this.#mediaPlayer(service, data);
    if (domain === 'webostv' && service === 'button') return this.#button(data.button);
    if (domain === 'webostv' && service === 'command') return this.#command(data.command, data.payload);
    if (domain === 'lgtv_pointer') return this.#requireOn();
    throw new Error(`mock TV: unknown service ${domain}.${service}`);
  }

  async callWS(message) {
    const { domain, service, service_data: data } = message;
    this.calls.push({ kind: 'ws', domain, service, data });
    await this.#delay();
    this.#maybeFail(domain, service);
    if (domain === 'lgtv_pointer' && service === 'app_icons') {
      const icons = {};
      for (const name of APP_SOURCES) icons[name] = appIcon(name);
      return { response: { icons } };
    }
    if (domain === 'webostv' && service === 'command') return { response: { [ENTITY]: this.#command(data.command, data.payload) } };
    throw new Error(`mock TV: unknown websocket service ${domain}.${service}`);
  }

  #requireOn() {
    if (this.power !== 'on') throw new Error('Device is off and cannot be controlled');
  }

  async #delay() {
    if (this.latencyMs) await new Promise((resolve) => setTimeout(resolve, this.latencyMs));
  }

  #maybeFail(domain, service) {
    if (!this.failNext) return;
    const matches = this.failNext === true || this.failNext(domain, service);
    if (!matches) return;
    this.failNext = null;
    throw new Error('mock TV: injected failure');
  }

  #changed() { this.onChange(); }

  #mediaPlayer(service, data) {
    if (service === 'turn_on') {
      setTimeout(() => { this.power = 'on'; this.appId = LIVE_TV; this.source = 'Canali TV'; this.#changed(); }, this.wakeDelayMs);
      return;
    }
    this.#requireOn();
    if (service === 'turn_off') {
      setTimeout(() => { this.power = 'off'; this.#changed(); }, this.sleepDelayMs);
    } else if (service === 'volume_mute') {
      this.muted = Boolean(data.is_volume_muted);
    } else if (service === 'volume_set') {
      this.volume = Math.round(data.volume_level * 100);
      this.muted = false;
    } else if (service === 'select_source') {
      this.source = data.source;
      this.appId = data.source === 'Canali TV' ? LIVE_TV : data.source.toLowerCase().replace(/\W/g, '');
    } else if (service === 'play_media') {
      const index = this.channels.findIndex((channel) => channel.channelNumber === String(data.media_content_id));
      if (index < 0) throw new Error('mock TV: no such channel');
      this.channelIndex = index;
      this.appId = LIVE_TV;
      this.source = 'Canali TV';
    }
    this.#changed();
  }

  #button(name) {
    this.#requireOn();
    if (name === 'VOLUMEUP') this.volume = Math.min(100, this.volume + 1);
    else if (name === 'VOLUMEDOWN') this.volume = Math.max(0, this.volume - 1);
    else if (name === 'CHANNELUP') this.channelIndex = (this.channelIndex + 1) % this.channels.length;
    else if (name === 'CHANNELDOWN') this.channelIndex = (this.channelIndex - 1 + this.channels.length) % this.channels.length;
    else if (name === 'HOME') { this.appId = HOME; this.source = ''; }
    this.#changed();
  }

  #command(command, payload = {}) {
    this.#requireOn();
    if (command === 'tv/getChannelList') return { returnValue: true, channelList: this.channels };
    if (command === 'tv/getChannelProgramInfo') {
      const channel = payload.channelId ? this.channels.find((c) => c.channelId === payload.channelId) : this.channels[this.channelIndex];
      return { returnValue: true, channel, programList: this.#programs(Number(channel.channelNumber)) };
    }
    if (command.endsWith('/insertText')) {
      if (!this.fieldFocused) throw new Error('mock TV: no text field is open');
      if (payload.replace !== true) throw new Error('mock TV: replace must be a boolean true');
      this.text = payload.text;
      return { returnValue: true };
    }
    if (command.endsWith('/sendEnterKey')) {
      if (!this.fieldFocused) throw new Error('mock TV: no text field is open');
      this.fieldFocused = false;
      this.#fireKeyboard(false);
      return { returnValue: true };
    }
    throw new Error(`mock TV: unknown command ${command}`);
  }

  /** Programmes that cover "now": each channel is 10 to 40 minutes into a 55-minute show. */
  #programs(seed) {
    const start = new Date(Date.now() - (10 + ((seed * 7) % 30)) * 60000);
    const list = [];
    for (let i = 0; i < 3; i += 1) {
      const end = new Date(start.getTime() + 55 * 60000);
      list.push({ programName: `Programma ${seed}.${i + 1}`, localStartTime: tvTime(start), localEndTime: tvTime(end) });
      start.setTime(end.getTime());
    }
    return list;
  }

  // ---- things a TV does on its own ----------------------------------------

  focusTextField(focus = true) {
    this.fieldFocused = focus;
    this.#fireKeyboard(focus);
  }

  #fireKeyboard(focus) {
    for (const listener of this.listeners) listener({ data: { entity_id: ENTITY, focus } });
  }

  goHome() { this.appId = HOME; this.source = ''; this.#changed(); }

  /** Calls the card made, filtered by service name (and optionally part of the data). */
  called(domain, service, match = {}) {
    return this.calls.filter((call) => call.domain === domain && call.service === service
      && Object.entries(match).every(([key, value]) => call.data?.[key] === value));
  }

  buttons() { return this.called('webostv', 'button').map((call) => call.data.button); }
}
