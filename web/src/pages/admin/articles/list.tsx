import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminArticles, deleteAdminArticle } from '../../../lib/admin-api';

export function ArticleListPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, [page]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const { data, total: t } = await getAdminArticles({ page, page_size: 10 });
      setArticles(data);
      setTotal(t);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除这篇文章？')) return;
    await deleteAdminArticle(id);
    loadArticles();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">文章管理</h1>
        <Link
          to="/admin/articles/new"
          className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          新建文章
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[var(--foreground)]/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-[var(--foreground)]/5">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">标题</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">分类</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">标签</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">发布时间</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">浏览量</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-[var(--foreground)]">操作</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-t border-[var(--foreground)]/10">
                <td className="px-4 py-3 text-[var(--foreground)]">{article.title}</td>
                <td className="px-4 py-3 text-[var(--foreground)]/70">{article.category?.name || '-'}</td>
                <td className="px-4 py-3 text-[var(--foreground)]/70">
                  {article.tags?.map((t: any) => t.name).join(', ') || '-'}
                </td>
                <td className="px-4 py-3 text-[var(--foreground)]/70">
                  {new Date(article.created_at).toLocaleDateString('zh-CN')}
                </td>
                <td className="px-4 py-3 text-[var(--foreground)]/70">{article.viewCount || 0}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/admin/articles/${article.id}/edit`}
                    className="text-[var(--accent)] hover:underline mr-3"
                  >
                    编辑
                  </Link>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="text-red-500 hover:underline"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded border border-[var(--foreground)]/20 disabled:opacity-50"
        >
          上一页
        </button>
        <span className="px-3 py-1">
          第 {page} / {Math.ceil(total / 10) || 1} 页
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= Math.ceil(total / 10)}
          className="px-3 py-1 rounded border border-[var(--foreground)]/20 disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </div>
  );
}