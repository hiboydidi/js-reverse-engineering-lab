import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCoupon } from '../../server/data.mjs';

test('LAB10 applies ten percent discount', () => {
  assert.deepEqual(calculateCoupon(200, 'LAB10'), {
    subtotal: 200,
    coupon: 'LAB10',
    discount: 20,
    total: 180,
  });
});

test('LAB10 discount is capped at 50', () => {
  assert.equal(calculateCoupon(1000, 'LAB10').discount, 50);
});

test('FIXED20 cannot discount more than subtotal', () => {
  assert.equal(calculateCoupon(10, 'FIXED20').total, 0);
});

test('empty coupon leaves subtotal unchanged', () => {
  assert.equal(calculateCoupon(19.99, '').total, 19.99);
});

test('unknown coupon throws', () => {
  assert.throws(() => calculateCoupon(100, 'NOPE'), /优惠码无效/);
});

test('negative subtotal throws', () => {
  assert.throws(() => calculateCoupon(-1, 'LAB10'), /subtotal/);
});
