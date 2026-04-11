import { useState, useEffect } from 'react';
import { getAdminCategories, createAdminCategory, updateAdminCategory, deleteAdminCategory } from '../../lib/admin-api';

export function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await getAdminCategories();
    setCategories(data);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (editing) {
      await updateAdminCategory(editing.id, { name, slug });
    } else {
      await createAdminCategory({ name, slug });
    }
    setShowModal(false);
    setEditing(null);
    setName('');
    setSlug('');
    loadCategories();
  };

  const handleEdit = (cat: any) => {
    setEditing(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除？')) return;
    await deleteAdminCategory(id);
    loadCategories();
  };

  const openCreate = () => {
    setEditing(null);
    setName('');
    setSlug('');
    setShowModal(true);
  };

  if (loading) return <div className="p-4">加载中...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">分类管理</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          新建分类
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[var(--foreground)]/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-[var(--foreground)]/5">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">名称</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Slug</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-[var(--foreground)]">操作</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t border-[var(--foreground)]/10">
                <td className="px-4 py-3 text-[var(--foreground)]">{cat.name}</td>
                <td className="px-4 py-3 text-[var(--foreground)]/70">{cat.slug}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleEdit(cat)} className="text-[var(--accent)] hover:underline mr-3">
                    编辑
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:underline">
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editing ? '编辑分类' : '新建分类'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--foreground)]/70 mb-1">名称</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--foreground)]/20 rounded focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--foreground)]/70 mb-1">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--foreground)]/20 rounded focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">
                  取消
                </button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg">
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}