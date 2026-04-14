import { Link } from "react-router";
import { ArticleListItem } from "@/lib/types";
import TagBadge from "./TagBadge";
import CategoryBadge from "./CategoryBadge";

interface ArticleCardProps {
  article: ArticleListItem;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className="border-b border-[var(--foreground)]/10 pb-6 mb-6">
      {/* Title - clickable link */}
      <h2 className="text-xl md:text-2xl font-semibold mb-2">
        <Link
          to={`/articles/${article.slug}`}
          className="text-[var(--primary)] hover:text-[var(--accent)] transition-colors cursor-pointer"
        >
          {article.title}
        </Link>
      </h2>

      {/* Meta */}
      <div className="flex items-center gap-3 text-sm text-[var(--muted)] mb-3">
        <time>{formatDate(article.created_at)}</time>
        {article.category && <CategoryBadge category={article.category} />}
      </div>

      {/* Summary */}
      {article.summary && (
        <p className="text-[var(--secondary)] leading-relaxed line-clamp-2">
          {article.summary}
        </p>
      )}

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {article.tags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>
      )}
    </article>
  );
}
