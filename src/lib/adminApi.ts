// Admin API client service
// Communicates with secure /api/admin/* endpoints using Bearer token stored in sessionStorage

const TOKEN_KEY = 'hnr_admin_session_token';

export function getAdminToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

async function adminFetch(endpoint: string, options: RequestInit = {}) {
  const token = getAdminToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearAdminToken();
    throw new Error('Unauthorized or expired session');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

// 1. Auth Functions
export async function loginAdmin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (res.ok && data.token) {
      setAdminToken(data.token);
      return { success: true, token: data.token };
    }
    return { success: false, error: data.error || 'Authentication failed' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

export async function verifyAdminSession(): Promise<boolean> {
  const token = getAdminToken();
  if (!token) return false;
  try {
    const res = await fetch('/api/admin/verify', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      return Boolean(data.authenticated);
    }
    clearAdminToken();
    return false;
  } catch {
    return false;
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await adminFetch('/api/admin/logout', { method: 'POST' });
  } catch {
    // Ignore error on logout
  } finally {
    clearAdminToken();
  }
}

// 2. Stats
export async function getAdminStats() {
  return adminFetch('/api/admin/stats');
}

// 3. Products
export async function getAdminProducts() {
  return adminFetch('/api/admin/products');
}

export async function createAdminProduct(productData: {
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  rating?: number;
  isAvailable?: boolean;
}) {
  return adminFetch('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
}

export async function updateAdminProduct(id: string, updates: Partial<{
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  rating: number;
  isAvailable: boolean;
}>) {
  return adminFetch(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deleteAdminProduct(id: string) {
  return adminFetch(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

// 4. Orders
export async function getAdminOrders() {
  return adminFetch('/api/admin/orders');
}

export async function updateAdminOrderStatus(id: string, status: string) {
  return adminFetch(`/api/admin/orders/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// 5. Reviews
export async function getAdminReviews() {
  return adminFetch('/api/admin/reviews');
}

export async function deleteAdminReview(id: number) {
  return adminFetch(`/api/admin/reviews/${id}`, {
    method: 'DELETE',
  });
}

// 6. Delivery Riders
export async function getAdminRiders() {
  return adminFetch('/api/admin/riders');
}

export async function createAdminRider(riderData: {
  name: string;
  phone: string;
  vehicle: string;
  status?: 'available' | 'delivering' | 'offline';
}) {
  return adminFetch('/api/admin/riders', {
    method: 'POST',
    body: JSON.stringify(riderData),
  });
}

export async function updateAdminRider(
  id: string,
  updates: Partial<{
    name: string;
    phone: string;
    vehicle: string;
    status: 'available' | 'delivering' | 'offline';
    activeOrdersCount: number;
    totalDelivered: number;
    rating: number;
  }>
) {
  return adminFetch(`/api/admin/riders/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deleteAdminRider(id: string) {
  return adminFetch(`/api/admin/riders/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function assignAdminRiderToOrder(orderId: string, riderId: string) {
  return adminFetch(`/api/admin/orders/${encodeURIComponent(orderId)}/assign-rider`, {
    method: 'POST',
    body: JSON.stringify({ riderId }),
  });
}
