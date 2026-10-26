async function requireLogin() {
  const { data: { session } } = await db.auth.getSession();
  if (!session) {
    window.location.replace('login.html');
    return null;
  }
  return session;
}

async function requireAdmin() {
  const session = await requireLogin();
  if (!session) return null;
  const { data } = await db.from('profiles')
    .select('role').eq('id', session.user.id).single();
  if (!data || data.role !== 'admin') {
    window.location.replace('home.html');
    return null;
  }
  return session;
}

async function logout() {
  await db.auth.signOut();
  window.location.replace('index.html');
}
