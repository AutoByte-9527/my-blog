// ============ Tag ============

export interface Tag {
  id: number;
  name: string;
  slug: string;
  article_count: number;
}

// ============ Category ============

export interface Category {
  id: number;
  name: string;
  slug: string;
  article_count: number;
}

// ============ Article ============

export interface ArticleListItem {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  category: Category | null;
  tags: Tag[];
  created_at: string;
  viewCount?: number;
}

export interface ArticleDetail extends ArticleListItem {
  content: string;
  updated_at: string;
}

// ============ Visit Stats ============

export interface VisitStats {
  total: number;
}

// ============ Visit ============

export interface VisitData {
  article_id: number;
  user_agent: string;
  referer?: string;
  country?: string;
  city?: string;
}

// ============ API Response ============

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
