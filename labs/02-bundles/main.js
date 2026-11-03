import { formatOrder } from './order-logic.js';

document.querySelector('#run-bundle').addEventListener('click', () => {
  const order = {
    id: 'order-demo-01',
    items: [
      { name: '键盘', quantity: 1, unitPrice: 299 },
      { name: '鼠标', quantity: 2, unitPrice: 159 },
    ],
    couponDiscount: 30,
  };

  document.querySelector('#bundle-output').textContent = JSON.stringify(
    formatOrder(order),
    null,
    2,
  );
});
