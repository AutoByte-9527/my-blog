import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArticleEditor } from '../../../components/admin/ArticleEditor';
import { getAdminArticle, createAdminArticle, updateAdminArticle, getAdminCategories, getAdminTags } from '../../../lib/admin-api';

export function ArticleEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMeta();
    if (isEditing) {
      loadArticle();
    }
  }, [id]);

  const loadMeta = async () => {
    const [cats, tgs] = await Promise.all([getAdminCategories(), getAdminTags()]);
    setCategories(cats);
    setTags(tgs);
  };

  const loadArticle = async () => {
    setLoading(true);
    try {
      const article = await getAdminArticle(Number(id));
      setTitle(article.title);
      setSlug(article.slug);
      setSummary(article.summary || '');
      setContent(article.content);
      setCategoryId(article.category?.id || null);
      setTagIds(article.tags?.map((t: any) => t.id) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = () => {
    const auto = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    setSlug(auto);
  };

  const handleSave = async (_published: boolean) => {
    setSaving(true);
    try {
      const data = {
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        summary,
        content,
        categoryId,
        tagIds,
      };
      if (isEditing) {
        await updateAdminArticle(Number(id), data);
      } else {
        await createAdminArticle(data);
      }
      navigate('/admin/articles');
    } catch (err) {
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">加载中...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/articles')}
          className="px-3 py-1.5 text-sm bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 rounded-lg transition-colors"
        >
          ← 返回
        </button>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          {isEditing ? '编辑文章' : '新建文章'}
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="文章标题"
              className="w-full px-4 py-3 text-xl font-bold border border-[var(--foreground)]/20 rounded-lg focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
          <ArticleEditor content={content} onChange={setContent} />
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-[var(--foreground)]/10">
            <h3 className="font-medium text-[var(--foreground)] mb-4">文章设置</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--foreground)]/70 mb-1">Slug</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="auto-generated"
                    className="flex-1 px-3 py-2 border border-[var(--foreground)]/20 rounded focus:border-[var(--accent)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="px-2 py-1 text-sm bg-[var(--foreground)]/5 rounded hover:bg-[var(--foreground)]/10"
                  >
                    生成
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[var(--foreground)]/70 mb-1">摘要</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-[var(--foreground)]/20 rounded focus:border-[var(--accent)] focus:outline-none resize-none"
                  placeholder="文章摘要（可选）"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--foreground)]/70 mb-1">分类</label>
                <select
                  value={categoryId || ''}
                  onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-[var(--foreground)]/20 rounded focus:border-[var(--accent)] focus:outline-none"
                >
                  <option value="">未分类</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-[var(--foreground)]/70 mb-1">标签</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <label key={t.id} className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tagIds.includes(t.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTagIds([...tagIds, t.id]);
                          } else {
                            setTagIds(tagIds.filter((id) => id !== t.id));
                          }
                        }}
                      />
                      <span className="text-sm">{t.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex-1 py-2 border border-[var(--foreground)]/20 rounded-lg hover:bg-[var(--foreground)]/5 transition-colors disabled:opacity-50"
            >
              保存草稿
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex-1 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? '保存中...' : '发布'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}