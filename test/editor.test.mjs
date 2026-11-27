import test from 'node:test';
import assert from 'node:assert/strict';
import { editorHelper, editorLabel, editorSchema } from '../src/editor-schema.js';
import { translator } from '../src/i18n.js';
import { DEFAULT_CONFIG } from '../src/constants.js';
import { hapticLevel } from '../src/logic.js';

for (const language of ['it', 'en']) {
  const t = translator(language);
  test(`editor (${language}): every field has a label and a default the card understands`, () => {
    for (const field of editorSchema(t)) {
      assert.notEqual(editorLabel(t, field), `editor.${field.name}`, `label for ${field.name}`);
      assert.ok(field.name in DEFAULT_CONFIG, `default for ${field.name}`);
    }
    assert.ok(editorHelper(t, { name: 'haptics' }));
    assert.equal(editorHelper(t, { name: 'name' }), undefined);
  });
}

test('editor: the vibration choices are exactly the levels the card supports', () => {
  const haptics = editorSchema(translator('en')).find((field) => field.name === 'haptics');
  const values = haptics.selector.select.options.map((option) => option.value);
  assert.deepEqual(values, ['off', 'soft', 'normal', 'strong']);
  for (const value of values) assert.equal(hapticLevel(value), value);
  assert.deepEqual(haptics.selector.select.options.map((option) => option.label), ['Off', 'Light', 'Normal', 'Strong']);
});
