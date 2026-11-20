let adminAccessToken: string | undefined;

export async function adminFetch(path: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  if (adminAccessToken) headers.set('Authorization', `Bearer ${adminAccessToken}`);
  const response = await fetch(path, { ...init, headers });
  if (response.status === 401 && adminAccessToken) {
    adminAccessToken = undefined;
    window.dispatchEvent(new Event('signalux-admin-session-ended'));
  }
  return response;
}

export async function signInAdmin(email: string, password: string): Promise<void> {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.success || typeof body.data?.accessToken !== 'string') {
    throw new Error(body?.error?.message || 'ارتباط با سرویس ورود برقرار نشد.');
  }

  const { accessToken, user } = body.data;
  if (!user?.roles?.includes('SUPER_ADMIN') && !user?.permissions?.includes('dashboard.view')) {
    await fetch('/api/v1/auth/logout', {
      method: 'POST', headers: { Authorization: `Bearer ${accessToken}` },
    }).catch(() => {});
    throw new Error('این حساب اجازهٔ ورود به پنل مدیریت را ندارد.');
  }
  adminAccessToken = accessToken;
}

export async function signOutAdmin(): Promise<void> {
  const token = adminAccessToken;
  adminAccessToken = undefined;
  if (token) {
    await fetch('/api/v1/auth/logout', {
      method: 'POST', headers: { Authorization: `Bearer ${token}` },
    });
  }
}

export function customerFetch(path: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  const token = sessionStorage.getItem('signalux_user_token');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(path, { ...init, headers });
}
