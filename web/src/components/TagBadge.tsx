import { Link } from "react-router";
import { Tag } from "@my-blog/shared";

interface TagBadgeProps {
  tag: Tag;
}

export default function TagBadge({ tag }: TagBadgeProps) {
  return (
    <Link
      to={`/tags/${tag.slug}`}
      className="inline-block px-3 py-1 text-xs text-[var(--secondary)] bg-[var(--foreground)]/5 hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] rounded-full transition-colors cursor-pointer"
    >
      #{tag.name}
    </Link>
  );
}
