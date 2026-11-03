import { EditorState } from '@codemirror/state';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  drawSelection,
} from '@codemirror/view';
import { defaultKeymap, history as historyExtension, historyKeymap } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

const modules = [
  ['00', 'JavaScript 基础', '闭包、原型链、事件循环', '/labs/00-basics/', '30 分钟'],
  ['01', 'Network 请求分析', 'Fetch、XHR、请求与响应', '/labs/01-network/', '40 分钟'],
  ['02', 'Bundle 与 Source Map', '模块打包、源码映射', '/labs/02-bundles/', '35 分钟'],
  ['03', 'JavaScript 混淆', '字符串表、索引映射', '/labs/03-obfuscation/', '45 分钟'],
  ['04', 'Web Crypto', 'SHA-256、HMAC、签名', '/labs/04-crypto/', '45 分钟'],
  ['05', '浏览器存储', 'Cookie、LocalStorage', '/labs/05-storage/', '25 分钟'],
  ['06', 'WebSocket', '连接、消息帧与事件', '/labs/06-websocket/', '35 分钟'],
  ['07', '综合实战', '从页面到接口的完整链路', '/labs/07-final-case/', '60 分钟'],
];
const caseItems = [
  [
    'CASE 01',
    '优惠券逻辑还原',
    '从混淆字符串表中恢复计算规则，独立编写等价函数。',
    '/cases/01-coupon-reconstruction/README.md',
    '字符串混淆 · 逻辑还原',
  ],
  [
    'CASE 02',
    'HMAC 本地 API',
    '追踪 payload、规范化序列化、签名与本地验证。',
    '/cases/02-hmac-local-api/README.md',
    'Web Crypto · HMAC',
  ],
  [
    'CASE 03',
    'Bundle 与 Source Map',
    '从打包产物定位原始模块，理解源码映射。',
    '/cases/03-source-map/README.md',
    'Vite · Source Map',
  ],
  [
    'CASE 04',
    '简单混淆识别',
    '拆解字符串数组、索引偏移和变量映射。',
    '/cases/04-obfuscation/README.md',
    'Obfuscation · 代码还原',
  ],
  [
    'CASE 05',
    'WebSocket 消息追踪',
    '从连接握手到消息帧，定位事件处理链。',
    '/cases/05-websocket/README.md',
    'WebSocket · Network',
  ],
];
const examples = {
  closure: [
    'closure.js',
    'function makeCounter() {\n  let count = 0;\n  return function increment() {\n    count += 1;\n    return count;\n  };\n}\n\nconst counter = makeCounter();\nconsole.log(counter());\nconsole.log(counter());\nconsole.log(counter());',
  ],
  prototype: [
    'prototype.js',
    "const parent = { role: 'teacher' };\nconst learner = Object.create(parent);\nlearner.name = 'student';\n\nconsole.log('自身属性:', Object.keys(learner));\nconsole.log('继承属性:', learner.role);\nconsole.log('role 是自身属性吗:', Object.hasOwn(learner, 'role'));\nconsole.log('原型是否为 parent:', Object.getPrototypeOf(learner) === parent);",
  ],
  eventloop: [
    'event-loop.js',
    "console.log('1. 同步任务');\nPromise.resolve().then(() => console.log('3. Promise 微任务'));\nsetTimeout(() => console.log('4. setTimeout 宏任务'), 0);\nconsole.log('2. 同步任务结束');",
  ],
  coupon: [
    'coupon.js',
    "function applyCoupon(subtotal, code) {\n  if (!Number.isFinite(subtotal) || subtotal < 0) throw new TypeError('小计必须是非负数字');\n  let discount = 0;\n  if (code === 'LAB10') discount = Math.min(subtotal * 0.1, 50);\n  else if (code === 'FIXED20') discount = Math.min(20, subtotal);\n  else if (code) throw new Error('优惠码无效');\n  return { subtotal, discount, total: Math.round((subtotal - discount) * 100) / 100 };\n}\nconsole.log(applyCoupon(200, 'LAB10'));\nconsole.log(applyCoupon(1000, 'LAB10'));\nconsole.log(applyCoupon(10, 'FIXED20'));",
  ],
};
const progressKey = 'js-reverse-lab-progress-v1';
let completed = new Set();
try {
  completed = new Set(JSON.parse(localStorage.getItem(progressKey) || '[]'));
} catch {
  completed = new Set();
}

function renderProgress() {
  const percent = Math.round((completed.size / modules.length) * 100);
  document.querySelector('#progress-number').textContent = percent + '%';
  document.querySelector('#progress-caption').textContent = completed.size + ' / 8 章节已完成';
  document.querySelector('#first-progress').style.width = completed.has('00') ? '100%' : '0%';
  document.querySelector('#first-progress-label').textContent = completed.has('00')
    ? '第 1 章已完成'
    : '尚未完成';
  document.querySelector('#course-nav').innerHTML = modules
    .map(
      (m) =>
        '<a class="course-link" href="' +
        m[3] +
        '">' +
        m[0] +
        '　' +
        m[1] +
        '<span style="margin-left:auto">' +
        (completed.has(m[0]) ? '✓' : '›') +
        '</span></a>',
    )
    .join('');
  document.querySelector('#module-grid').innerHTML = modules
    .map(
      (m) =>
        '<a class="module-card" href="' +
        m[3] +
        '"><small>MODULE ' +
        m[0] +
        '</small><h3>' +
        m[1] +
        '</h3><p>' +
        m[2] +
        '</p><div class="meta">' +
        m[4] +
        '　·　' +
        (completed.has(m[0]) ? '✓ 已完成' : '进入学习 →') +
        '</div></a>',
    )
    .join('');
}
renderProgress();
document.querySelector('#case-grid').innerHTML = caseItems
  .map(
    (c) =>
      '<a class="case-card" href="' +
      c[3] +
      '"><small>' +
      c[0] +
      '</small><h3>' +
      c[1] +
      '</h3><p>' +
      c[2] +
      '</p><small>' +
      c[4] +
      ' ↗</small></a>',
  )
  .join('');

const titles = { dashboard: '学习总览', workspace: '代码工作台', cases: '实战案例' };
function setView(name) {
  if (!titles[name]) name = 'dashboard';
  document
    .querySelectorAll('.view')
    .forEach((v) => v.classList.toggle('active', v.id === 'view-' + name));
  document
    .querySelectorAll('[data-view]')
    .forEach((v) => v.classList.toggle('active', v.dataset.view === name));
  document.querySelector('#crumb').textContent = titles[name];
  history.replaceState(null, '', '#' + name);
}
document.querySelectorAll('[data-view]').forEach((el) =>
  el.addEventListener('click', (event) => {
    event.preventDefault();
    setView(el.dataset.view);
  }),
);
document
  .querySelectorAll('[data-go]')
  .forEach((el) => el.addEventListener('click', () => setView(el.dataset.go)));
setView(location.hash.slice(1));
document
  .querySelector('#mobile-menu')
  .addEventListener('click', () => document.querySelector('#sidebar').classList.toggle('open'));

try {
  const response = await fetch('/api/health');
  const data = await response.json();
  document.querySelector('#api-status').textContent = data.ok ? '靶场在线' : '靶场异常';
  document.querySelector('#api-dot').classList.toggle('online', data.ok);
} catch {
  document.querySelector('#api-status').textContent = '靶场离线';
}

let editor;
let runId = 0;
const editorHost = document.querySelector('#editor');
const output = document.querySelector('#console-output');
function setEditor(code) {
  if (editor) editor.destroy();
  editor = new EditorView({
    state: EditorState.create({
      doc: code,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        drawSelection(),
        historyExtension(),
        javascript(),
        oneDark,
        keymap.of([...defaultKeymap, ...historyKeymap]),
        EditorView.updateListener.of((update) => {
          const line = update.state.doc.lineAt(update.state.selection.main.head);
          document.querySelector('#cursor-position').textContent =
            'Ln ' + line.number + ', Col ' + (update.state.selection.main.head - line.from + 1);
        }),
        EditorView.theme({ '&': { height: '100%' } }),
      ],
    }),
    parent: editorHost,
  });
}
let activeExample = 'closure';
setEditor(examples.closure[1]);
document.querySelector('#example-select').addEventListener('change', (event) => {
  activeExample = event.target.value;
  document.querySelector('#file-name').textContent = examples[activeExample][0];
  setEditor(examples[activeExample][1]);
  output.innerHTML =
    '<div class="empty"><b>示例已加载</b><small>点击运行代码查看结果。</small></div>';
  document.querySelector('#run-status').textContent = '尚未执行';
});
function renderConsole(items) {
  if (!items.length) {
    output.innerHTML =
      '<div class="empty"><b>代码已运行</b><small>没有 console 输出。</small></div>';
    return;
  }
  output.innerHTML = items
    .map((item) => {
      const safe = String(item.text).replace(
        /[&<>"]/g,
        (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c],
      );
      return (
        '<div class="console-line ' +
        (item.type === 'error' ? 'error' : item.type === 'result' ? 'result' : '') +
        '">' +
        safe +
        '</div>'
      );
    })
    .join('');
}
const runner = document.querySelector('#runner-frame');
window.addEventListener('message', (event) => {
  if (
    event.source !== runner.contentWindow ||
    event.data?.kind !== 'lab-result' ||
    event.data.id !== runId
  )
    return;
  renderConsole(event.data.items || []);
  document.querySelector('#run-status').textContent = event.data.error
    ? '运行出错'
    : '执行完成 · ' + (event.data.duration || 0) + ' ms';
});
document.querySelector('#run-code').addEventListener('click', () => {
  const code = editor.state.doc.toString();
  runId += 1;
  const id = runId;
  document.querySelector('#run-status').textContent = '运行中…';
  output.innerHTML = '<div class="console-line">正在执行隔离脚本…</div>';
  const source =
    '<!doctype html><html><body><script>const id=' +
    id +
    ';const items=[];const fmt=v=>{if(typeof v==="string")return v;try{return JSON.stringify(v,null,2)??String(v)}catch{return String(v)}};console.log=(...a)=>items.push({type:"log",text:a.map(fmt).join(" ")});console.info=console.log;console.warn=(...a)=>items.push({type:"log",text:"⚠ "+a.map(fmt).join(" ")});console.error=(...a)=>items.push({type:"error",text:a.map(fmt).join(" ")});window.addEventListener("error",e=>items.push({type:"error",text:e.message}));const started=performance.now();try{const result=(new Function(' +
    JSON.stringify(code) +
    '))();if(result!==undefined)items.push({type:"result",text:"返回值: "+fmt(result)});setTimeout(()=>parent.postMessage({kind:"lab-result",id,items,duration:Math.round(performance.now()-started)},"*"),0)}catch(e){items.push({type:"error",text:e.name+": "+e.message});parent.postMessage({kind:"lab-result",id,items,error:true},"*")}</scr' +
    'ipt></body></html>';
  runner.srcdoc = source;
});
document.querySelector('#clear-console').addEventListener('click', () => {
  output.innerHTML =
    '<div class="empty">⌁<b>输出已清空</b><small>运行代码后再次查看结果。</small></div>';
  document.querySelector('#run-status').textContent = '已清空';
});
