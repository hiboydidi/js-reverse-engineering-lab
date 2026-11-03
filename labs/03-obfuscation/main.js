import { applyDemoCoupon } from './sample-obfuscated.js';

document.querySelector('#run-obfuscated').addEventListener('click', () => {
  const subtotal = Number(document.querySelector('#subtotal').value);
  const coupon = document.querySelector('#coupon').value;
  try {
    const result = applyDemoCoupon(subtotal, coupon);
    document.querySelector('#obfuscation-output').textContent = JSON.stringify(result, null, 2);
  } catch (error) {
    document.querySelector('#obfuscation-output').textContent = '错误：' + error.message;
  }
});
