import { createTracer } from './runtime.js';

self.addEventListener('message', async (event) => {
  if (event.data?.kind !== 'run' || typeof event.data.code !== 'string') return;

  const { id, code } = event.data;
  const tracer = createTracer();
  const logs = [];
  const capture =
    (level) =>
    (...items) => {
      if (logs.length < 100) logs.push({ level, items: tracer.snapshot(items) });
    };
  const log = {
    log: capture('log'),
    info: capture('info'),
    warn: capture('warn'),
    error: capture('error'),
  };

  let ok = true;
  let value;
  let error = null;
  const started = performance.now();

  try {
    // The caller provides only its own local lab example or authorized code.
    // A dedicated worker lets the parent terminate a runaway execution.
    const execute = new Function(
      'trace',
      'console',
      '"use strict";\n' + code + '\nreturn typeof result === "undefined" ? undefined : result;',
    );
    value = await execute(tracer.wrap, log);
  } catch (caught) {
    ok = false;
    error = tracer.snapshot(caught);
  }

  self.postMessage({
    kind: 'trace-result',
    id,
    ok,
    value: tracer.snapshot(value),
    error,
    logs,
    calls: tracer.calls,
    edges: tracer.edges(),
    dropped: tracer.dropped,
    durationMs: Math.round((performance.now() - started) * 100) / 100,
  });
});
