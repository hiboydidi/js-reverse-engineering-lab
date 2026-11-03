const DEMO_SECRET = 'local-only-demo-secret';

function stableStringify(value) {
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

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function createHmacKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
}

async function signPayload(payload) {
  const key = await createHmacKey(DEMO_SECRET);
  const message = new TextEncoder().encode(stableStringify(payload));
  const signature = await crypto.subtle.sign('HMAC', key, message);
  return toHex(signature);
}

document.querySelector('#sign-request').addEventListener('click', async () => {
  const output = document.querySelector('#crypto-output');
  const payload = { lesson: 'hmac', amount: 100, nonce: 'local-001' };

  try {
    const signature = await signPayload(payload);
    const response = await fetch('/api/signature/verify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ payload, signature }),
    });
    const result = await response.json();
    output.textContent = JSON.stringify({ payload, signature, server: result }, null, 2);
  } catch (error) {
    output.textContent = '执行失败：' + error.message;
  }
});
