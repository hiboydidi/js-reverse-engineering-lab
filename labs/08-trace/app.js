import './style.css';

const SOURCE_SAMPLE = `// 在自己的样例函数外包一层 trace()
const lineTotal = trace('lineTotal', (item) => item.price * item.qty);
const subtotal = trace('subtotal', (items) =>
  items.reduce((sum, item) => sum + lineTotal(item), 0)
);
const discount = trace('discount', (total, rate) =>
  Math.min(30, total * rate)
);
const checkout = trace('checkout', (items, rate) => {
  const base = subtotal(items);
  const off = discount(base, rate);
  return {
    subtotal: base,
    discount: off,
    payable: Math.round((base - off) * 100) / 100
  };
});

const result = checkout([
  { price: 80, qty: 2 },
  { price: 40, qty: 1 }
], 0.1);
console.log('应付金额:', result.payable);`;

const CANDIDATE_SAMPLE = `// 不同实现，相同输出：验证行为等价
const calculateTotal = trace('calculateTotal', (items) => {
  let total = 0;
  for (const item of items) total += item.price * item.qty;
  return total;
});
const checkout = trace('checkout', (items, rate) => {
  const base = calculateTotal(items);
  const off = Math.min(base * rate, 30);
  return {
    subtotal: base,
    discount: off,
    payable: Number((base - off).toFixed(2))
  };
});

const result = checkout([
  { price: 80, qty: 2 },
  { price: 40, qty: 1 }
], 0.1);
console.log('应付金额:', result.payable);`;

const BUGGY_SAMPLE = CANDIDATE_SAMPLE.replace(
  'const off = Math.min(base * rate, 30);',
  'const off = 0; // 故意引入折扣错误',
);

const el = (id) => document.getElementById(id);
const source = el('source-code');
const candidate = el('candidate-code');
let latestReport = null;
let sequence = 0;
let running = false;

function loadSamples() {
  source.value = SOURCE_SAMPLE;
  candidate.value = CANDIDATE_SAMPLE;
  el('run-status').textContent = '演示样例已重置，点击「追踪 A」。';
}

function runInWorker(code) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    const worker = new Worker(new URL('./worker.js', import.meta.url), {
      type: 'module',
    });
    let finished = false;
    const close = () => {
      if (finished) return false;
      finished = true;
      clearTimeout(timeout);
      worker.terminate();
      return true;
    };
    const timeout = setTimeout(() => {
      if (close()) reject(new Error('运行超过 3 秒，已终止 Worker。'));
    }, 3000);

    worker.onmessage = (event) => {
      if (event.data?.kind !== 'trace-result' || event.data.id !== id) return;
      if (close()) resolve(event.data);
    };
    worker.onerror = (event) => {
      event.preventDefault();
      if (close()) reject(new Error('Worker 执行失败，请检查代码语法。'));
    };
    worker.postMessage({ kind: 'run', id, code });
  });
}

function format(value) {
  return JSON.stringify(value, null, 2) ?? String(value);
}

function renderTrace(data) {
  latestReport = data;
  el('metric-calls').textContent = String(data.calls.length);
  el('metric-edges').textContent = String(data.edges.length);
  el('metric-runtime').textContent = data.durationMs + ' ms';

  const tree = el('call-tree');
  tree.replaceChildren();
  if (!data.calls.length) {
    const item = document.createElement('li');
    item.className = 'placeholder';
    item.textContent = '没有追踪到调用。请确认函数已用 trace(name, fn) 包裹。';
    tree.append(item);
  }

  for (const call of data.calls) {
    const item = document.createElement('li');
    item.className = 'call' + (call.status === 'error' ? ' error' : '');
    item.style.paddingLeft = Math.min(call.depth, 12) * 18 + 3 + 'px';
    const title = document.createElement('span');
    title.className = 'name';
    title.textContent = call.name + '(' + format(call.args).replace(/\s+/g, ' ').slice(0, 90) + ')';
    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent =
      (call.status === 'ok' ? '✓ ' : '✗ ') +
      format(call.result).replace(/\s+/g, ' ').slice(0, 110) +
      ' · ' +
      call.durationMs +
      ' ms';
    item.append(title, meta);
    tree.append(item);
  }

  const graph = el('edge-list');
  graph.replaceChildren();
  if (!data.edges.length) {
    const item = document.createElement('li');
    item.className = 'placeholder';
    item.textContent = '当前调用没有父子关系。';
    graph.append(item);
  }
  for (const edge of data.edges) {
    const item = document.createElement('li');
    const from = document.createElement('b');
    from.textContent = edge.from;
    const arrow = document.createElement('span');
    arrow.className = 'arrow';
    arrow.textContent = '→';
    const to = document.createElement('b');
    to.textContent = edge.to;
    const count = document.createElement('span');
    count.className = 'count';
    count.textContent = '× ' + edge.count;
    item.append(from, arrow, to, count);
    graph.append(item);
  }

  el('run-output').textContent =
    (data.ok ? '✓ 执行成功' : '✗ 执行失败') +
    '\n返回值:\n' +
    format(data.ok ? data.value : data.error) +
    '\n\nConsole:\n' +
    (data.logs.length
      ? data.logs.map((entry) => '[' + entry.level + '] ' + format(entry.items)).join('\n')
      : '(无)') +
    (data.dropped ? '\n\n超出上限，忽略 ' + data.dropped + ' 次追踪。' : '');
}

function setBusy(value) {
  running = value;
  el('run-trace').disabled = value;
  el('run-compare').disabled = value;
}

async function traceSource() {
  if (running) return;
  setBusy(true);
  el('run-status').textContent = '正在隔离 Worker 中执行 A…';
  try {
    const result = await runInWorker(source.value);
    renderTrace(result);
    el('run-status').textContent = result.ok
      ? '版本 A 执行完成，已记录 ' + result.calls.length + ' 次函数调用。'
      : '版本 A 执行失败，异常已经记录。';
  } catch (error) {
    el('run-status').textContent = error.message;
  } finally {
    setBusy(false);
  }
}

async function compareBoth() {
  if (running) return;
  setBusy(true);
  el('metric-match').textContent = '比较中';
  el('run-status').textContent = '分别运行 A、B，比较顶层 result…';
  try {
    const a = await runInWorker(source.value);
    const b = await runInWorker(candidate.value);
    const same = a.ok && b.ok && JSON.stringify(a.value) === JSON.stringify(b.value);
    renderTrace(a);
    latestReport = { source: a, candidate: b, same };
    el('metric-match').textContent = same ? '一致' : '不一致';
    el('metric-match').style.color = same ? '#8de0b4' : '#ffadad';
    el('compare-output').textContent =
      (same ? '✓ MATCH · 输出一致' : '✗ MISMATCH · 输出不一致或执行出错') +
      '\n\n版本 A (' +
      (a.ok ? 'OK' : 'ERROR') +
      '):\n' +
      format(a.ok ? a.value : a.error) +
      '\n\n版本 B (' +
      (b.ok ? 'OK' : 'ERROR') +
      '):\n' +
      format(b.ok ? b.value : b.error) +
      '\n\n提示：只比较本次输入的结果，不代表所有输入等价。';
    el('run-status').textContent = same
      ? 'A / B 在当前输入下返回相同结果。'
      : '发现差异：检查候选实现与测试输入。';
  } catch (error) {
    el('metric-match').textContent = '执行失败';
    el('run-status').textContent = error.message;
    el('compare-output').textContent = error.message;
  } finally {
    setBusy(false);
  }
}

function exportReport() {
  if (!latestReport) {
    el('run-status').textContent = '请先完成一次追踪或比较。';
    return;
  }
  const blob = new Blob([JSON.stringify(latestReport, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'trace-report.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

el('run-trace').addEventListener('click', traceSource);
el('run-compare').addEventListener('click', compareBoth);
el('reset-demo').addEventListener('click', () => {
  loadSamples();
  el('metric-match').textContent = '未开始';
  el('metric-match').style.color = '';
  el('compare-output').textContent = '点击「对比 A / B」验证输出是否一致。';
});
el('inject-bug').addEventListener('click', () => {
  candidate.value = BUGGY_SAMPLE;
  el('run-status').textContent = '已在版本 B 引入折扣错误。点击「对比 A / B」观察差异。';
});
el('export-json').addEventListener('click', exportReport);
loadSamples();
