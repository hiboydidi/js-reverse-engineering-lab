const MAX_DEPTH = 5;
const MAX_ITEMS = 40;
const MAX_TEXT = 400;

function snapshotValue(value, seen, depth) {
  if (value === null || typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.length > MAX_TEXT ? value.slice(0, MAX_TEXT) + '…' : value;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : String(value);
  }
  if (typeof value === 'undefined') return '[undefined]';
  if (typeof value === 'bigint') return value.toString() + 'n';
  if (typeof value === 'symbol') return String(value);
  if (typeof value === 'function') return '[Function ' + (value.name || 'anonymous') + ']';
  if (depth >= MAX_DEPTH) return '[max depth]';
  if (seen.has(value)) return '[circular]';

  seen.add(value);
  try {
    if (value instanceof Error) {
      return { name: value.name, message: value.message };
    }
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? '[Invalid Date]' : value.toISOString();
    }
    if (Array.isArray(value)) {
      const result = value.slice(0, MAX_ITEMS).map((item) => snapshotValue(item, seen, depth + 1));
      if (value.length > MAX_ITEMS) result.push('[truncated]');
      return result;
    }
    const output = {};
    const descriptors = Object.getOwnPropertyDescriptors(value);
    const keys = Object.keys(descriptors).sort();
    for (const key of keys.slice(0, MAX_ITEMS)) {
      const descriptor = descriptors[key];
      output[key] =
        'value' in descriptor ? snapshotValue(descriptor.value, seen, depth + 1) : '[accessor]';
    }
    if (keys.length > MAX_ITEMS) output['…'] = '[truncated]';
    return output;
  } catch {
    return '[uninspectable]';
  } finally {
    seen.delete(value);
  }
}

export function snapshot(value) {
  return snapshotValue(value, new WeakSet(), 0);
}

/**
 * Opt-in instrumentation for code we own. The tracer never rewrites or hooks
 * third-party scripts. An async call's children after await are not attributed
 * to the original parent in this first iteration.
 */
export function createTracer({ now = () => performance.now(), maxCalls = 300 } = {}) {
  const calls = [];
  const stack = [];
  let sequence = 0;
  let dropped = 0;

  function wrap(name, fn) {
    if (typeof fn !== 'function') throw new TypeError('trace(name, fn) needs a function');
    const label = String(name || fn.name || '(anonymous)');

    return function traced(...args) {
      if (calls.length >= maxCalls) {
        dropped += 1;
        return Reflect.apply(fn, this, args);
      }

      const started = now();
      const entry = {
        id: ++sequence,
        parentId: stack.length ? stack[stack.length - 1] : null,
        depth: stack.length,
        name: label,
        args: snapshot(args),
        status: 'running',
        result: null,
        durationMs: null,
      };
      calls.push(entry);
      stack.push(entry.id);

      const finish = (status, value) => {
        entry.status = status;
        entry.result = snapshot(value);
        entry.durationMs = Math.max(0, Math.round((now() - started) * 100) / 100);
      };

      let result;
      try {
        result = Reflect.apply(fn, this, args);
      } catch (error) {
        stack.pop();
        finish('error', error);
        throw error;
      }
      stack.pop();

      if (result && typeof result.then === 'function') {
        return Promise.resolve(result).then(
          (value) => {
            finish('ok', value);
            return value;
          },
          (error) => {
            finish('error', error);
            throw error;
          },
        );
      }
      finish('ok', result);
      return result;
    };
  }

  function edges() {
    const byId = new Map(calls.map((call) => [call.id, call.name]));
    const counts = new Map();
    for (const call of calls) {
      if (call.parentId === null) continue;
      const from = byId.get(call.parentId);
      if (!from) continue;
      const key = JSON.stringify([from, call.name]);
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return [...counts].map(([key, count]) => {
      const [from, to] = JSON.parse(key);
      return { from, to, count };
    });
  }

  return {
    wrap,
    calls,
    edges,
    snapshot,
    get dropped() {
      return dropped;
    },
  };
}
