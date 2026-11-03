const _0xwords = ['LAB10', 'FIXED20', 'discount', 'total', 'coupon'];
const _0xword = (index) => _0xwords[index - 0x30];

export function applyDemoCoupon(subtotal, code) {
  const _0xamount = Number(subtotal);
  if (!Number.isFinite(_0xamount) || _0xamount < 0) {
    throw new TypeError('subtotal must be a non-negative number');
  }

  let _0xcut = 0;
  if (code === _0xword(0x30)) {
    _0xcut = Math.min(Math.round(_0xamount * 10) / 100, 50);
  } else if (code === _0xword(0x31)) {
    _0xcut = Math.min(20, _0xamount);
  } else if (code) {
    throw new Error('unknown coupon');
  }

  return {
    [_0xword(0x32)]: _0xcut,
    [_0xword(0x33)]: Math.round((_0xamount - _0xcut) * 100) / 100,
    [_0xword(0x34)]: code || null,
  };
}
