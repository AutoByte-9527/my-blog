import { Link } from "react-router";
import { Category } from "@/lib/types";

interface CategoryBadgeProps {
  category: Category;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="text-[var(--accent)] hover:underline cursor-pointer"
    >
      {category.name}
    </Link>
  );
}
