const SESSION_COOKIE = 'lab6_session';

export function hasSession() {
  return document.cookie.split(';').some((cookie) => cookie.trim() === `${SESSION_COOKIE}=signed-in`);
}

export function startSession() {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  // This cookie stores only a demo sign-in flag, never the login or password.
  document.cookie = `${SESSION_COOKIE}=signed-in; Max-Age=86400; Path=/; SameSite=Lax${secure}`;
  return hasSession();
}

export function endSession() {
  document.cookie = `${SESSION_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
}
