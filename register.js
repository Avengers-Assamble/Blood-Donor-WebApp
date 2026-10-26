const form = document.getElementById('registerForm');
const msg = document.getElementById('formMessage');
const btn = document.getElementById('submitBtn');

function showMessage(text, isError = true) {
  msg.textContent = text;
  msg.style.color = isError ? '#b42318' : '#067647';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  showMessage('');

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirmPassword').value;

  if (password !== confirm) {
    return showMessage('Passwords do not match.');
  }
  if (!/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    return showMessage('Password needs at least one number and one symbol.');
  }

  btn.disabled = true;
  btn.textContent = 'Creating account...';

  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: firstName + ' ' + lastName, phone },
      emailRedirectTo: new URL('login.html', window.location.href).href
    }
  });

  if (error) {
    showMessage(error.message);
    btn.disabled = false;
    btn.innerHTML = 'Create account &rarr;';
    return;
  }

  if (data.session) {
    window.location.href = 'home.html';
  } else {
    showMessage('Account created. Check your email to confirm it, then sign in.', false);
    btn.innerHTML = 'Create account &rarr;';
  }
});
