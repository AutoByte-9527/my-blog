import useSWR from 'swr'
import { getArticles } from '@/lib/api'
import { ArticleListItem } from '@/lib/types'
import ArticleCard from '@/components/ArticleCard'

export default function ArchivesPage() {
  const { data: articles, error } = useSWR<ArticleListItem[]>('articles', () => getArticles())

  if (error) {
    return <div className="text-center text-[var(--muted)]">加载失败</div>
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

  // 按年份分组
  const groupedArticles = articles?.reduce((acc, article) => {
    const year = new Date(article.created_at).getFullYear()
    if (!acc[year]) acc[year] = []
    acc[year].push(article)
    return acc
  }, {} as Record<number, ArticleListItem[]>)

  const years = Object.keys(groupedArticles || {}).sort((a, b) => Number(b) - Number(a))

  return (
    <>
      <h1 className="text-2xl font-semibold text-[var(--primary)] mb-8 pb-4 border-b border-[var(--foreground)]/10">
        归档
      </h1>
      {years.length === 0 ? (
        <div className="text-center text-[var(--muted)]">暂无文章</div>
      ) : (
        <div className="space-y-8">
          {years.map((year) => (
            <div key={year}>
              <h2 className="text-xl font-semibold text-[var(--accent)] mb-4">{year}</h2>
              <div className="space-y-4">
                {groupedArticles![Number(year)].map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
