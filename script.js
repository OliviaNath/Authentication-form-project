let isLogin = true;
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

document.getElementById('signup').addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = await hashPassword(document.getElementById('signup-password').value);

  localStorage.setItem(email, JSON.stringify({ username, password }));
  alert('Signup successful!');
});

document.getElementById('login').addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const email = document.getElementById('login-email').value;
  const password = await hashPassword(document.getElementById('login-password').value);

  const stored = JSON.parse(localStorage.getItem(email));
  if (stored && stored.password === password && stored.username === username) {
    alert('Login successful!');
    localStorage.setItem('sessionUser', email);
  } else {
    alert('Invalid credentials.');
  }
});
