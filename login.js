const form = document.getElementById('loginForm');
const msg = document.getElementById('formMessage');
const btn = document.getElementById('submitBtn');

function showMessage(text) {
  msg.textContent = text;
  msg.style.color = '#b42318';
}

// already signed in? skip the form
db.auth.getSession().then(({ data }) => {
  if (data.session) window.location.replace('home.html');
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  showMessage('');
  btn.disabled = true;
  btn.textContent = 'Signing in...';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const { data, error } = await db.auth.signInWithPassword({ email, password });

  if (error) {
    showMessage('Incorrect email or password.');
    btn.disabled = false;
    btn.innerHTML = 'Sign in &rarr;';
    return;
  }

  // admins go to the admin area, everyone else to home
  const { data: profile } = await db.from('profiles')
    .select('role').eq('id', data.user.id).single();

  window.location.href = (profile && profile.role === 'admin')
    ? 'admin-users.html'
    : 'home.html';
});
