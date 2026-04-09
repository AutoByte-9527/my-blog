import { Tag, Category, ArticleListItem, ArticleDetail } from '@my-blog/shared';

export class ArticleResponseDto implements ArticleListItem {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  category: Category | null;
  tags: Tag[];
  created_at: string;
  viewCount: number;
}

export class ArticleDetailResponseDto
  extends ArticleResponseDto
  implements ArticleDetail
{
  content: string;
  updated_at: string;
}
