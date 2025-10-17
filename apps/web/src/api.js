const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';
let _token;

export async function loginDev() {
  if (_token) return _token;
  const r = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ email: 'dev@example.com', password: 'dev123456' }),
  });
  if (!r.ok) throw new Error(`Login falhou: ${r.status} ${r.statusText}`);
  const j = await r.json();
  _token = j.access_token;
  return _token;
}

export async function apiFetch(path, init={}) {
  const token = await loginDev();
  const headers = new Headers(init.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  if (init.body && typeof init.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const r = await fetch(`${API}${path}`, { ...init, headers });
  if (!r.ok) {
    let msg = `${r.status} ${r.statusText}`;
    try {
      const t = await r.text();
      if (t) msg += ` — ${t}`;
    } catch {}
    throw new Error(msg);
  }
  return r.json();
}

export const endpoints = {
  summary(date, accountId) {
    const qs = new URLSearchParams({ date });
    if (accountId) qs.set('accountId', accountId);
    return apiFetch(`/dashboard/summary?${qs.toString()}`);
  },
};
