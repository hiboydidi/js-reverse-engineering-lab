let currentPage = 1;

async function loadProducts(page) {
  const response = await fetch('/api/products?page=' + page);
  const data = await response.json();
  document.querySelector('#fetch-output').textContent = JSON.stringify(data, null, 2);
  currentPage = data.page;
  document.querySelector('#next-page').disabled = data.nextPage === null;
  return data;
}

document.querySelector('#fetch-products').addEventListener('click', () => {
  loadProducts(1).catch(showFetchError);
});

document.querySelector('#next-page').addEventListener('click', async () => {
  const nextPage = currentPage + 1;
  await loadProducts(nextPage).catch(showFetchError);
});

function showFetchError(error) {
  document.querySelector('#fetch-output').textContent = '请求失败：' + error.message;
}

document.querySelector('#xhr-products').addEventListener('click', () => {
  const request = new XMLHttpRequest();
  request.open('GET', '/api/products?page=1');
  request.setRequestHeader('x-lab-client', 'xhr-demo');
  request.onload = () => {
    document.querySelector('#xhr-output').textContent = request.responseText;
  };
  request.onerror = () => {
    document.querySelector('#xhr-output').textContent = 'XHR 网络错误';
  };
  request.send();
});
