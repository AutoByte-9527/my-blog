import { useParams } from 'react-router'
import { useEffect, useRef } from 'react'
import useSWR from 'swr'
import { getArticle, recordVisit } from '@/lib/api'
import { ArticleDetail } from '@/lib/types'
import TagBadge from '@/components/TagBadge'
import CategoryBadge from '@/components/CategoryBadge'

function processContent(content: string): string {
  return content.replace(/src="\/uploads\//g, 'src="/api/uploads/')
}

export default function ArticleDetailPage() {
  const { slug } = useParams()
  const visited = useRef(false)

  const { data: article, error } = useSWR<ArticleDetail>(
    slug ? `article-${slug}` : null,
    () => getArticle(slug!)
  )

  useEffect(() => {
    if (article && !visited.current) {
      visited.current = true
      recordVisit({
        article_id: article.id,
        user_agent: navigator.userAgent,
        referer: document.referrer,
      }).catch(console.error)
    }
  }, [article])

  if (error) {
    return <div className="text-center text-[var(--muted)]">文章不存在</div>
  }

  if (!article) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-[var(--foreground)]/5 rounded w-3/4" />
        <div className="h-4 bg-[var(--foreground)]/5 rounded w-1/4" />
        <div className="h-64 bg-[var(--foreground)]/5 rounded w-full" />
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <article>
      <h1 className="text-3xl md:text-4xl font-semibold text-[var(--primary)] mb-4">
        {article.title}
      </h1>
      <div className="flex items-center gap-4 text-sm text-[var(--muted)] mb-8 pb-8 border-b border-[var(--foreground)]/10">
        <time>{formatDate(article.created_at)}</time>
        {article.category && <CategoryBadge category={article.category} />}
        <span>{article.viewCount?.toLocaleString() || 0} 阅读</span>
      </div>
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {article.tags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>
      )}
      <div className="article-content text-[var(--foreground)] leading-loose">
        <div dangerouslySetInnerHTML={{ __html: processContent(article.content) }} />
      </div>
    </article>
  )
}
