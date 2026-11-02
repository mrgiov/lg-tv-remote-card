/** Visual editor shown in Home Assistant's card settings. Wraps ha-form around EDITOR_SCHEMA. */
import { DEFAULT_CONFIG } from './constants.js';
import { EDITOR_HELPERS, EDITOR_LABELS, EDITOR_SCHEMA } from './editor-schema.js';
import { hapticLevel } from './logic.js';

/** Home Assistant defines ha-form only once an editor needs it; opening a built-in card's editor forces that. */
async function ensureFormDefined() {
  if (customElements.get('ha-form')) return;
  try {
    const helpers = await window.loadCardHelpers?.();
    const card = await helpers?.createCardElement({ type: 'entities', entities: [] });
    await card?.constructor?.getConfigElement?.();
  } catch (error) { /* the wait below still covers a slow start */ }
  await Promise.race([customElements.whenDefined('ha-form'), new Promise((resolve) => setTimeout(resolve, 4000))]);
}

class LgTvRemoteCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = { ...config };
    ensureFormDefined().then(() => this._render());
  }

  set hass(hass) {
    this._hass = hass;
    if (this._form) this._form.hass = hass;
  }

  _render() {
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.schema = EDITOR_SCHEMA;
      this._form.computeLabel = (field) => EDITOR_LABELS[field.name] ?? field.name;
      this._form.computeHelper = (field) => EDITOR_HELPERS[field.name];
      this._form.addEventListener('value-changed', (event) => this._onChange(event));
      this.append(this._form);
    }
    this._form.hass = this._hass;
    this._form.data = {
      ...DEFAULT_CONFIG, ...this._config, haptics: hapticLevel(this._config.haptics),
    };
  }

  _onChange(event) {
    event.stopPropagation();
    this._config = { ...this._config, ...event.detail.value };
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._config }, bubbles: true, composed: true }));
  }
}

customElements.define('lg-tv-remote-card-editor', LgTvRemoteCardEditor);
