import test from 'node:test';
import assert from 'node:assert/strict';
import { createTracer, snapshot } from '../../labs/08-trace/runtime.js';

test('records nested calls, arguments and dynamic edges', () => {
  let tick = 0;
  const tracer = createTracer({ now: () => ++tick });
  const double = tracer.wrap('double', (value) => value * 2);
  const checkout = tracer.wrap('checkout', (value) => double(value) + double(value + 1));

  assert.equal(checkout(3), 14);
  assert.equal(tracer.calls.length, 3);
  assert.deepEqual(
    tracer.calls.map((call) => call.name),
    ['checkout', 'double', 'double'],
  );
  assert.equal(tracer.calls[0].parentId, null);
  assert.equal(tracer.calls[1].parentId, tracer.calls[0].id);
  assert.deepEqual(tracer.calls[1].args, [3]);
  assert.equal(tracer.calls[0].result, 14);
  assert.deepEqual(tracer.edges(), [{ from: 'checkout', to: 'double', count: 2 }]);
});

test('preserves method this and thrown errors', () => {
  const tracer = createTracer();
  const obj = {
    value: 9,
    add: tracer.wrap('add', function (amount) {
      return this.value + amount;
    }),
  };
  assert.equal(obj.add(2), 11);

  const explode = tracer.wrap('explode', () => {
    throw new TypeError('boom');
  });
  assert.throws(() => explode(), /boom/);
  assert.equal(tracer.calls.at(-1).status, 'error');
  assert.deepEqual(tracer.calls.at(-1).result, { name: 'TypeError', message: 'boom' });
});

test('handles fulfilled and rejected promises', async () => {
  const tracer = createTracer();
  const yes = tracer.wrap('yes', async () => 42);
  const no = tracer.wrap('no', async () => {
    throw new Error('not today');
  });
  assert.equal(await yes(), 42);
  await assert.rejects(() => no(), /not today/);
  assert.equal(tracer.calls[0].status, 'ok');
  assert.equal(tracer.calls[0].result, 42);
  assert.equal(tracer.calls[1].status, 'error');
});

test('snapshots values without cycles or accessor execution', () => {
  let getterCalled = false;
  const obj = { name: 'demo', secret: 42 };
  obj.self = obj;
  Object.defineProperty(obj, 'dangerous', {
    enumerable: true,
    get() {
      getterCalled = true;
      return 'do not run';
    },
  });
  assert.deepEqual(snapshot(obj), {
    dangerous: '[accessor]',
    name: 'demo',
    secret: 42,
    self: '[circular]',
  });
  assert.equal(getterCalled, false);
  assert.equal(snapshot(12n), '12n');
  assert.equal(snapshot(undefined), '[undefined]');
});

test('caps stored trace records without stopping the function', () => {
  const tracer = createTracer({ maxCalls: 1 });
  const plusOne = tracer.wrap('plusOne', (n) => n + 1);
  assert.equal(plusOne(1), 2);
  assert.equal(plusOne(2), 3);
  assert.equal(tracer.calls.length, 1);
  assert.equal(tracer.dropped, 1);
});
