import { useAdminStore } from '../stores/admin-store';

const API_BASE = '/api/admin';

async function fetchAdminApi<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = useAdminStore.getState().token;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      useAdminStore.getState().logout();
      window.location.href = '/admin/login';
    }
    throw new Error(`API Error: ${response.status}`);
  }

  const text = await response.text();
  if (!text) return undefined;
  return JSON.parse(text);
}

// Auth API
export const adminLogin = (username: string, password: string) =>
  fetchAdminApi<{ access_token: string; user: AdminUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

export const adminRegister = (username: string, password: string, nickname?: string) =>
  fetchAdminApi<{ id: number; username: string; nickname?: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, nickname }),
  });

export const adminGetProfile = () =>
  fetchAdminApi<AdminUser>('/auth/me');

// Articles API
export const getAdminArticles = (params?: { page?: number; page_size?: number; category?: string; tag?: string }) => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.page_size) searchParams.set('page_size', String(params.page_size));
  if (params?.category) searchParams.set('category', params.category);
  if (params?.tag) searchParams.set('tag', params.tag);
  const query = searchParams.toString();
  return fetchAdminApi<{ data: Article[]; total: number }>(`/articles?${query}`);
};

export const getAdminArticle = (id: number) =>
  fetchAdminApi<Article>(`/articles/${id}`);

export const createAdminArticle = (data: Partial<Article>) =>
  fetchAdminApi<Article>('/articles', { method: 'POST', body: JSON.stringify(data) });

export const updateAdminArticle = (id: number, data: Partial<Article>) =>
  fetchAdminApi<Article>(`/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteAdminArticle = (id: number) =>
  fetchAdminApi<void>(`/articles/${id}`, { method: 'DELETE' });

// Categories API
export const getAdminCategories = () => fetchAdminApi<Category[]>('/categories');
export const createAdminCategory = (data: { name: string; slug?: string }) =>
  fetchAdminApi<Category>('/categories', { method: 'POST', body: JSON.stringify(data) });
export const updateAdminCategory = (id: number, data: { name: string; slug?: string }) =>
  fetchAdminApi<Category>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAdminCategory = (id: number) =>
  fetchAdminApi<void>(`/categories/${id}`, { method: 'DELETE' });

// Tags API
export const getAdminTags = () => fetchAdminApi<Tag[]>('/tags');
export const createAdminTag = (data: { name: string; slug?: string }) =>
  fetchAdminApi<Tag>('/tags', { method: 'POST', body: JSON.stringify(data) });
export const updateAdminTag = (id: number, data: { name: string; slug?: string }) =>
  fetchAdminApi<Tag>(`/tags/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAdminTag = (id: number) =>
  fetchAdminApi<void>(`/tags/${id}`, { method: 'DELETE' });

// Visits API
export const getVisitStats = () => fetchAdminApi<{ total: number }>('/visits/stats');
export const getVisitTrend = (period: 'day' | 'week' | 'month') =>
  fetchAdminApi<{ date: string; count: number }[]>(`/visits/trend?period=${period}`);
export const getTopArticles = (limit = 10) =>
  fetchAdminApi<{ id: number; title: string; viewCount: number }[]>(`/visits/top-articles?limit=${limit}`);
export const getGeoStats = () => fetchAdminApi<{ country: string; city: string; count: number }[]>('/visits/geo');
export const getDeviceStats = () => fetchAdminApi<{ device: string; count: number }[]>('/visits/devices');
export const getBrowserStats = () => fetchAdminApi<{ browser: string; count: number }[]>('/visits/browsers');
export const getOsStats = () => fetchAdminApi<{ os: string; count: number }[]>('/visits/os');
export const getRefererStats = () => fetchAdminApi<{ referer: string; count: number }[]>('/visits/referers');

// Upload API
export const uploadImage = async (file: File): Promise<{ url: string }> => {
  const token = useAdminStore.getState().token;
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/admin/upload/image', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) throw new Error('Upload failed');
  return response.json();
};

// Types
interface AdminUser { id: number; username: string; nickname?: string; }
interface Article { id: number; title: string; slug: string; content: string; summary?: string; category?: Category; tags: Tag[]; created_at: string; viewCount: number; }
interface Category { id: number; name: string; slug: string; }
interface Tag { id: number; name: string; slug: string; }
