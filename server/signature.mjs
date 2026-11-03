import { createHmac, timingSafeEqual } from 'node:crypto';

export const DEMO_SECRET = 'local-only-demo-secret';

export function stableStringify(value) {
  if (Array.isArray(value)) {
    return '[' + value.map(stableStringify).join(',') + ']';
  }

  if (value && typeof value === 'object') {
    const keys = Object.keys(value).sort();
    return (
      '{' +
      keys.map((key) => JSON.stringify(key) + ':' + stableStringify(value[key])).join(',') +
      '}'
    );
  }

  return JSON.stringify(value);
}

export function signPayload(payload, secret = DEMO_SECRET) {
  return createHmac('sha256', secret).update(stableStringify(payload)).digest('hex');
}

export function verifySignature(payload, signature, secret = DEMO_SECRET) {
  if (typeof signature !== 'string' || !/^[a-f0-9]{64}$/i.test(signature)) {
    return false;
  }

  const expected = Buffer.from(signPayload(payload, secret), 'hex');
  const received = Buffer.from(signature, 'hex');

  if (expected.length !== received.length) {
    return false;
  }

  return timingSafeEqual(expected, received);
}
