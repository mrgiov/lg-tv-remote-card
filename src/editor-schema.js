/** Fields of the visual card editor (an ha-form schema) and their Italian labels. Pure data, covered by test/editor.test.mjs. */
export const EDITOR_SCHEMA = [
  { name: 'entity', required: true, selector: { entity: { domain: 'media_player', integration: 'webostv' } } },
  { name: 'name', selector: { text: {} } },
  {
    name: 'haptics',
    selector: {
      select: {
        mode: 'dropdown',
        options: [
          { value: 'off', label: 'Spenta' },
          { value: 'soft', label: 'Leggera' },
          { value: 'normal', label: 'Normale' },
          { value: 'strong', label: 'Forte' },
        ],
      },
    },
  },
  { name: 'auto_open_keyboard', selector: { boolean: {} } },
  { name: 'scroll_gain', selector: { number: { min: 1, max: 5, step: 0.5, mode: 'slider' } } },
  { name: 'scroll_invert', selector: { boolean: {} } },
];

export const EDITOR_LABELS = {
  entity: 'TV',
  name: 'Nome mostrato',
  haptics: 'Vibrazione',
  auto_open_keyboard: 'Apri la tastiera quando la TV chiede un testo',
  scroll_gain: 'Velocità di scorrimento',
  scroll_invert: 'Inverti la direzione dello scorrimento',
};

export const EDITOR_HELPERS = {
  haptics: 'Si sente su Android e nell\'app di Home Assistant. Su iPhone non è disponibile.',
  scroll_invert: 'Attivala se la striscia laterale scorre al contrario.',
};
