export const PRODUCTS = [
  { id: 'p-100', name: '机械键盘', price: 299, category: '配件' },
  { id: 'p-101', name: '无线鼠标', price: 159, category: '配件' },
  { id: 'p-102', name: 'USB-C 扩展坞', price: 239, category: '配件' },
  { id: 'p-103', name: '显示器支架', price: 189, category: '办公' },
  { id: 'p-104', name: '桌面麦克风', price: 399, category: '音频' },
  { id: 'p-105', name: '降噪耳机', price: 699, category: '音频' },
  { id: 'p-106', name: '便携 SSD', price: 499, category: '存储' },
  { id: 'p-107', name: '摄像头', price: 259, category: '视频' },
];

const roundMoney = (value) => Math.round(value * 100) / 100;

export function calculateCoupon(subtotal, couponCode) {
  if (!Number.isFinite(subtotal) || subtotal < 0) {
    throw new TypeError('subtotal 必须是大于或等于 0 的数字');
  }

  const code = String(couponCode ?? '')
    .trim()
    .toUpperCase();
  let discount = 0;

  if (code === 'LAB10') {
    discount = Math.min(roundMoney(subtotal * 0.1), 50);
  } else if (code === 'FIXED20') {
    discount = Math.min(20, subtotal);
  } else if (code !== '') {
    throw new Error('优惠码无效');
  }

  return {
    subtotal: roundMoney(subtotal),
    coupon: code || null,
    discount: roundMoney(discount),
    total: roundMoney(subtotal - discount),
  };
}
