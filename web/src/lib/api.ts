import { ArticleListItem, ArticleDetail, Tag, Category, VisitData, VisitStats } from "@my-blog/shared";

const API_BASE = import.meta.env.VITE_API_URL || '';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public isNetworkError: boolean = false,
    public isTimeout: boolean = false
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(url: string, timeout = 10000): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new ApiError(`请求失败: ${res.status}`, res.status);
    }
    return res.json();
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new ApiError("请求超时", 0, false, true);
    }
    if (err instanceof ApiError) throw err;
    throw new ApiError("网络错误", 0, true);
  }
}

export async function getArticles(params?: {
  category?: string;
  tag?: string;
  page?: number;
  page_size?: number;
}): Promise<ArticleListItem[]> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set("category", params.category);
  if (params?.tag) searchParams.set("tag", params.tag);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.page_size) searchParams.set("page_size", String(params.page_size));

  const query = searchParams.toString();
  const url = `${API_BASE}/api/articles${query ? `?${query}` : ""}`;
  return fetchApi<ArticleListItem[]>(url);
}

export async function getArticle(slug: string): Promise<ArticleDetail> {
  const url = `${API_BASE}/api/articles/${slug}`;
  return fetchApi<ArticleDetail>(url);
}

export async function getCategories(): Promise<Category[]> {
  const url = `${API_BASE}/api/categories`;
  return fetchApi<Category[]>(url);
}

export async function getTags(): Promise<Tag[]> {
  const url = `${API_BASE}/api/tags`;
  return fetchApi<Tag[]>(url);
}

export async function searchArticles(q: string): Promise<ArticleListItem[]> {
  const url = `${API_BASE}/api/search?q=${encodeURIComponent(q)}`;
  return fetchApi<ArticleListItem[]>(url);
}

export async function recordVisit(data: VisitData): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/api/visits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      console.warn("访问记录失败:", res.status);
    }
  } catch (e) {
    // 静默失败，不影响用户
    console.warn("访问记录失败:", e);
  }
}

export async function getVisitStats(): Promise<VisitStats> {
  return fetchApi<VisitStats>(`${API_BASE}/api/visits/stats`);
}
