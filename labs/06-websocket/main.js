let socket;

const status = document.querySelector('#ws-status');
const output = document.querySelector('#ws-output');
const connectButton = document.querySelector('#connect-ws');
const disconnectButton = document.querySelector('#disconnect-ws');

function appendMessage(message) {
  output.textContent = message + '\n' + output.textContent;
}

connectButton.addEventListener('click', () => {
  if (socket && socket.readyState <= WebSocket.OPEN) return;

  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  socket = new WebSocket(protocol + '//' + location.host + '/ws/inventory');
  status.textContent = '正在连接…';

  socket.addEventListener('open', () => {
    status.textContent = '已连接';
    connectButton.disabled = true;
    disconnectButton.disabled = false;
    appendMessage('WebSocket open');
  });

  socket.addEventListener('message', (event) => {
    appendMessage(event.data);
  });

  socket.addEventListener('close', () => {
    status.textContent = '已断开';
    connectButton.disabled = false;
    disconnectButton.disabled = true;
    appendMessage('WebSocket close');
  });

  socket.addEventListener('error', () => {
    status.textContent = '连接错误';
  });
});

disconnectButton.addEventListener('click', () => {
  if (socket) socket.close(1000, 'lesson complete');
});
