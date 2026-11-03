const status = document.querySelector('#api-status');

try {
  const response = await fetch('/api/health');
  const data = await response.json();
  status.textContent = data.ok ? '本地 API：已连接' : '本地 API：异常';
} catch {
  status.textContent = '本地 API：未连接，请确认 npm run dev 已启动';
}
