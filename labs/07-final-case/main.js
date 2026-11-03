let selectedProducts = [];

function getSubtotal() {
  return selectedProducts.reduce((sum, product) => sum + product.price, 0);
}

function renderProducts(products) {
  const catalog = document.querySelector('#catalog');
  catalog.innerHTML = '';

  for (const product of products) {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = product.id;
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        selectedProducts = [...selectedProducts, product];
      } else {
        selectedProducts = selectedProducts.filter((item) => item.id !== product.id);
      }
      document.querySelector('#subtotal').textContent = getSubtotal().toFixed(2);
    });

    const text = document.createElement('span');
    text.textContent = product.name + ' · ¥' + product.price;
    label.append(checkbox, text);
    catalog.append(label);
  }
}

document.querySelector('#load-catalog').addEventListener('click', async () => {
  const response = await fetch('/api/products?page=1');
  const data = await response.json();
  selectedProducts = [];
  document.querySelector('#subtotal').textContent = '0.00';
  renderProducts(data.items);
});

document.querySelector('#preview-coupon').addEventListener('click', async () => {
  const output = document.querySelector('#checkout-output');
  try {
    const response = await fetch('/api/coupon/preview', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        subtotal: getSubtotal(),
        coupon: document.querySelector('#coupon-code').value,
      }),
    });
    const data = await response.json();
    output.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    output.textContent = '请求失败：' + error.message;
  }
});
