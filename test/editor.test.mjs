import test from 'node:test';
import assert from 'node:assert/strict';
import { EDITOR_LABELS, EDITOR_SCHEMA } from '../src/editor-schema.js';
import { DEFAULT_CONFIG } from '../src/constants.js';
import { hapticLevel } from '../src/logic.js';

test('editor: every field has a label and a default the card understands', () => {
  for (const field of EDITOR_SCHEMA) {
    assert.ok(EDITOR_LABELS[field.name], `label for ${field.name}`);
    assert.ok(field.name in DEFAULT_CONFIG, `default for ${field.name}`);
  }
});

test('editor: the vibration choices are exactly the levels the card supports', () => {
  const haptics = EDITOR_SCHEMA.find((field) => field.name === 'haptics');
  const values = haptics.selector.select.options.map((option) => option.value);
  assert.deepEqual(values, ['off', 'soft', 'normal', 'strong']);
  for (const value of values) assert.equal(hapticLevel(value), value);
});
