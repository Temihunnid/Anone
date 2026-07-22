const loginForm = document.getElementById('login-form');

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function getStoredUsers() {
  return JSON.parse(localStorage.getItem('anone-users') || '[]');
}

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = normalizeEmail(document.getElementById('email').value);
    const password = document.getElementById('password').value;
    const users = getStoredUsers();
    const matchedUser = users.find((user) => normalizeEmail(user.email) === email && user.password === password);

    if (!matchedUser) {
      alert('No matching account found. Please create an account or use the correct credentials.');
      return;
    }

    localStorage.setItem('anone-current-user', JSON.stringify(matchedUser));
    window.location.href = 'index.html';
  });
}
