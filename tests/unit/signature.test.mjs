import test from 'node:test';
import assert from 'node:assert/strict';
import { signPayload, verifySignature } from '../../server/signature.mjs';

test('signature is stable regardless of object key order', () => {
  const first = signPayload({ amount: 100, lesson: 'hmac' });
  const second = signPayload({ lesson: 'hmac', amount: 100 });
  assert.equal(first, second);
});

test('valid signature verifies', () => {
  const payload = { lesson: 'hmac', amount: 100 };
  const signature = signPayload(payload);
  assert.equal(verifySignature(payload, signature), true);
});

test('modified payload fails verification', () => {
  const payload = { lesson: 'hmac', amount: 100 };
  const signature = signPayload(payload);
  assert.equal(verifySignature({ ...payload, amount: 101 }, signature), false);
});

test('malformed signature fails safely', () => {
  assert.equal(verifySignature({ ok: true }, 'not-a-signature'), false);
});
