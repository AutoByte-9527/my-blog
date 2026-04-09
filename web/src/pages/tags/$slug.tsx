import { useParams } from 'react-router'
import useSWR from 'swr'
import { getArticles } from '@/lib/api'
import { ArticleListItem } from '@my-blog/shared'
import ArticleCard from '@/components/ArticleCard'

export default function TagPage() {
  const { slug } = useParams()

  const { data: articles, error } = useSWR<ArticleListItem[]>(
    slug ? `articles-tag-${slug}` : null,
    () => getArticles({ tag: slug })
  )

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

  return (
    <>
      <h1 className="text-2xl font-semibold text-[var(--primary)] mb-8 pb-4 border-b border-[var(--foreground)]/10">
        标签：{decodeURIComponent(slug || '')}
      </h1>
      {articles.length === 0 ? (
        <div className="text-center text-[var(--muted)]">该标签下暂无文章</div>
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
