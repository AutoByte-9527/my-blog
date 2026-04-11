import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../stores/admin-store';

export function Header() {
  const { user, logout } = useAdminStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="h-16 bg-[var(--background)] border-b border-[var(--foreground)]/10 flex items-center justify-between px-6">
      <div className="text-sm text-[var(--foreground)]/50">
        {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-[var(--foreground)]">
          {user?.nickname || user?.username}
        </span>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-sm bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 rounded-lg transition-colors"
        >
          登出
        </button>
      </div>
    </header>
  );
}
