/** Fields of the visual card editor (an ha-form schema) with their labels in the user's language. Pure, covered by test/editor.test.mjs. */
const HAPTIC_CHOICES = ['off', 'soft', 'normal', 'strong'];

export const editorSchema = (t) => [
  { name: 'entity', required: true, selector: { entity: { domain: 'media_player', integration: 'webostv' } } },
  { name: 'name', selector: { text: {} } },
  {
    name: 'haptics',
    selector: { select: { mode: 'dropdown', options: HAPTIC_CHOICES.map((value) => ({ value, label: t(`editor.haptics.${value}`) })) } },
  },
  { name: 'auto_open_keyboard', selector: { boolean: {} } },
  { name: 'scroll_gain', selector: { number: { min: 1, max: 5, step: 0.5, mode: 'slider' } } },
  { name: 'scroll_invert', selector: { boolean: {} } },
];

export const editorLabel = (t, field) => t(`editor.${field.name}`);

/** Only some fields have a helper text; others return undefined. */
export const editorHelper = (t, field) => (['haptics', 'scroll_invert'].includes(field.name) ? t(`editor.${field.name}.helper`) : undefined);
