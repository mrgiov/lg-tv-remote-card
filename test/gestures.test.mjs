import test from 'node:test';
import assert from 'node:assert/strict';
import { throttleLatest } from '../src/gestures.js';

test('throttleLatest: the first value goes at once, a burst keeps only the last value', async () => {
  const sent = [];
  const push = throttleLatest((value) => sent.push(value), 30);
  push(1);
  push(2);
  push(3);
  assert.deepEqual(sent, [1]);
  await new Promise((resolve) => setTimeout(resolve, 60));
  assert.deepEqual(sent, [1, 3]);
});
