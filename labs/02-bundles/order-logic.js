export function formatOrder(order) {
  const itemTotal = order.items.reduce((sum, item) => {
    return sum + item.quantity * item.unitPrice;
  }, 0);

  const payable = Math.max(0, itemTotal - order.couponDiscount);

  return {
    orderId: order.id,
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    itemTotal,
    couponDiscount: order.couponDiscount,
    payable,
  };
}
