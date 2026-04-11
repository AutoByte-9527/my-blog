import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/admin', label: '仪表盘', icon: '📊' },
  { path: '/admin/articles', label: '文章管理', icon: '📝' },
  { path: '/admin/categories', label: '分类管理', icon: '📁' },
  { path: '/admin/tags', label: '标签管理', icon: '🏷️' },
  { path: '/admin/visits', label: '访客统计', icon: '📈' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-[var(--background)] border-r border-[var(--foreground)]/10 min-h-screen">
      <div className="p-4 border-b border-[var(--foreground)]/10">
        <h1 className="text-xl font-bold text-[var(--foreground)]">管理后台</h1>
      </div>
      <nav className="p-4">
        {menuItems.map((item) => {
          const isActive = item.path === '/admin'
            ? location.pathname === '/admin'
            : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                  : 'text-[var(--foreground)]/70 hover:bg-[var(--foreground)]/5 hover:text-[var(--foreground)]'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
