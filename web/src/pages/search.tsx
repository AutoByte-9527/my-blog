import { useSearchParams } from 'react-router'
import useSWR from 'swr'
import { searchArticles } from '@/lib/api'
import { ArticleListItem } from '@/lib/types'
import ArticleCard from '@/components/ArticleCard'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''

  const { data: articles, error } = useSWR<ArticleListItem[]>(
    q ? `search-${q}` : null,
    () => searchArticles(q)
  )

  if (error) {
    return <div className="text-center text-[var(--muted)]">搜索失败</div>
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

  return (
    <>
      <h1 className="text-2xl font-semibold text-[var(--primary)] mb-8 pb-4 border-b border-[var(--foreground)]/10">
        搜索：{q}
      </h1>
      {articles.length === 0 ? (
        <div className="text-center text-[var(--muted)]">没有找到相关文章</div>
      ) : (
        <div>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </>
  )
}
