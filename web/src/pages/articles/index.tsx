import useSWR from 'swr'
import { getArticles } from '@/lib/api'
import { ArticleListItem } from '@my-blog/shared'
import ArticleCard from '@/components/ArticleCard'

export default function ArticleListPage() {
  const { data: articles, error } = useSWR<ArticleListItem[]>('articles', () => getArticles())

  if (error) {
    return <div className="text-center text-[var(--muted)]">加载失败，请稍后重试</div>
  }

  if (!articles) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-8 bg-[var(--foreground)]/5 rounded w-3/4 mb-2" />
            <div className="h-4 bg-[var(--foreground)]/5 rounded w-1/4 mb-3" />
            <div className="h-16 bg-[var(--foreground)]/5 rounded w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return <div className="text-center text-[var(--muted)]">暂无文章</div>
  }

  return (
    <div>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}
