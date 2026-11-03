# 案例 01 参考答案

字符串映射：

| 索引 | 字符串   | 语义           |
| ---- | -------- | -------------- |
| 0x30 | LAB10    | 百分比优惠码   |
| 0x31 | FIXED20  | 固定金额优惠码 |
| 0x32 | discount | 折扣金额       |
| 0x33 | total    | 最终金额       |
| 0x34 | coupon   | 优惠码         |

等价逻辑：

```js
function applyCoupon(subtotal, code) {
  if (!Number.isFinite(subtotal) || subtotal < 0) {
    throw new TypeError('subtotal must be a non-negative number');
  }

  let discount = 0;

  if (code === 'LAB10') {
    discount = Math.min(Math.round(subtotal * 0.1 * 100) / 100, 50);
  } else if (code === 'FIXED20') {
    discount = Math.min(20, subtotal);
  } else if (code) {
    throw new Error('unknown coupon');
  }

  return {
    discount,
    total: Math.round((subtotal - discount) * 100) / 100,
    coupon: code || null,
  };
}
```

注意浮点数金额的精度问题。真实支付系统通常使用最小货币单位整数或 Decimal 类型，而不是直接依赖二进制浮点数。
