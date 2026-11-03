const output = document.querySelector('#storage-output');

function readValues() {
  return {
    localStorage: localStorage.getItem('lab.nickname'),
    sessionStorage: sessionStorage.getItem('lab.nickname'),
    cookie: document.cookie,
  };
}

document.querySelector('#save-storage').addEventListener('click', () => {
  const nickname = document.querySelector('#nickname').value.trim();
  localStorage.setItem('lab.nickname', nickname);
  sessionStorage.setItem('lab.nickname', nickname);
  document.cookie = 'lab_nickname=' + encodeURIComponent(nickname) + '; Path=/; SameSite=Lax';
  output.textContent = JSON.stringify(readValues(), null, 2);
});

document.querySelector('#read-storage').addEventListener('click', () => {
  output.textContent = JSON.stringify(readValues(), null, 2);
});

document.querySelector('#clear-storage').addEventListener('click', () => {
  localStorage.removeItem('lab.nickname');
  sessionStorage.removeItem('lab.nickname');
  document.cookie = 'lab_nickname=; Max-Age=0; Path=/; SameSite=Lax';
  output.textContent = JSON.stringify(readValues(), null, 2);
});
