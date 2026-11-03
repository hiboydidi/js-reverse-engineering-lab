import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';
import { PRODUCTS, calculateCoupon } from './data.mjs';
import { verifySignature } from './signature.mjs';

const PORT = Number(process.env.API_PORT || 3000);
const MAX_BODY_BYTES = 1024 * 32;

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  response.end(JSON.stringify(payload));
}

async function readJson(request) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
      throw new Error('请求体过大');
    }
  }
  return body ? JSON.parse(body) : {};
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || '/', 'http://localhost');

  try {
    if (request.method === 'GET' && url.pathname === '/api/health') {
      return sendJson(response, 200, { ok: true, service: 'js-reverse-lab-api' });
    }

    if (request.method === 'GET' && url.pathname === '/api/products') {
      const page = Math.max(1, Number(url.searchParams.get('page') || 1));
      const pageSize = 3;
      const start = (page - 1) * pageSize;
      const items = PRODUCTS.slice(start, start + pageSize);
      return sendJson(response, 200, {
        items,
        page,
        pageSize,
        total: PRODUCTS.length,
        nextPage: start + pageSize < PRODUCTS.length ? page + 1 : null,
      });
    }

    if (request.method === 'POST' && url.pathname === '/api/coupon/preview') {
      const body = await readJson(request);
      const result = calculateCoupon(Number(body.subtotal), body.coupon);
      return sendJson(response, 200, { ok: true, data: result });
    }

    if (request.method === 'POST' && url.pathname === '/api/signature/verify') {
      const body = await readJson(request);
      const valid = verifySignature(body.payload, body.signature);
      return sendJson(response, valid ? 200 : 401, {
        ok: valid,
        message: valid ? '本地演示签名验证通过' : '签名不匹配',
      });
    }

    if (request.method === 'GET' && url.pathname === '/api/demo-info') {
      return sendJson(response, 200, {
        purpose: '仅用于本地学习',
        signature: 'HMAC-SHA256',
        warning: '演示密钥写在浏览器代码中，不具备真实身份认证能力。',
      });
    }

    return sendJson(response, 404, { ok: false, error: 'Not found' });
  } catch (error) {
    const status = error.message === '优惠码无效' ? 400 : 400;
    return sendJson(response, status, { ok: false, error: error.message });
  }
});

const webSocketServer = new WebSocketServer({ server, path: '/ws/inventory' });

webSocketServer.on('connection', (socket) => {
  socket.send(JSON.stringify({ type: 'connected', message: '已连接本地库存推送' }));

  let stock = 12;
  const interval = setInterval(() => {
    stock = stock > 2 ? stock - 1 : 12;
    socket.send(
      JSON.stringify({
        type: 'inventory:update',
        productId: 'p-100',
        stock,
        sentAt: new Date().toISOString(),
      }),
    );
  }, 2500);

  socket.on('close', () => clearInterval(interval));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('本地 API: http://localhost:' + PORT);
  console.log('WebSocket: ws://localhost:' + PORT + '/ws/inventory');
});
