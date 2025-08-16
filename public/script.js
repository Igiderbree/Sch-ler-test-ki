async function login(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  const message = document.getElementById('message');
  if (res.ok) {
    localStorage.setItem('user', JSON.stringify(data));
    message.textContent = `Eingeloggt als ${data.role}`;
    window.location.href = '/dashboard.html';
  } else {
    message.textContent = data.error || 'Fehler beim Login';
  }
}

document.getElementById('loginForm').addEventListener('submit', login);
