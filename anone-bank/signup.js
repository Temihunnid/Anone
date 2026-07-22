const signupForm = document.getElementById('signup-form');
const signupSuccessEl = document.getElementById('signup-success');

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function saveUser(profile) {
  const existingUsers = JSON.parse(localStorage.getItem('anone-users') || '[]');
  const normalizedEmail = normalizeEmail(profile.email);
  const duplicate = existingUsers.some((user) => normalizeEmail(user.email) === normalizedEmail);

  if (duplicate) {
    alert('An account with this email already exists. Please sign in instead.');
    return false;
  }

  existingUsers.push(profile);
  localStorage.setItem('anone-users', JSON.stringify(existingUsers));
  localStorage.setItem('anone-current-user', JSON.stringify(profile));
  return true;
}

if (signupForm) {
  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const fullName = document.getElementById('full-name').value.trim();
    const email = normalizeEmail(document.getElementById('signup-email').value);
    const password = document.getElementById('signup-password').value;
    const confirmation = document.getElementById('confirm-password').value;

    if (!fullName || !email) {
      alert('Please provide your full name and email address.');
      return;
    }

    if (password !== confirmation) {
      alert('Passwords do not match.');
      return;
    }

    const profile = {
      fullName,
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    const saved = saveUser(profile);
    if (!saved) {
      return;
    }

    signupForm.reset();
    alert('Account created. Please sign in with your new details.');
  });
}
