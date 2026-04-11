import { useState, useEffect } from 'react';
import { getVisitStats, getVisitTrend, getTopArticles, getDeviceStats } from '../../lib/admin-api';
import { TrendChart } from '../../components/admin/charts/TrendChart';
import { PieChartComponent } from '../../components/admin/charts/PieChart';
import { BarChartComponent } from '../../components/admin/charts/BarChart';

export function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [trend, setTrend] = useState<any[]>([]);
  const [topArticles, setTopArticles] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsData, trendData, articlesData, devicesData] = await Promise.all([
        getVisitStats(),
        getVisitTrend('month'),
        getTopArticles(10),
        getDeviceStats(),
      ]);
      setStats(statsData);
      setTrend(trendData);
      setTopArticles(articlesData);
      setDevices(devicesData.map((d: any) => ({ name: d.device || 'Unknown', value: d.count })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">加载中...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">控制台</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl border border-[var(--foreground)]/10">
          <div className="text-3xl font-bold text-[var(--accent)]">{stats?.total || 0}</div>
          <div className="text-sm text-[var(--foreground)]/70">总访问量</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[var(--foreground)]/10">
          <div className="text-3xl font-bold text-[var(--accent)]">{topArticles.length}</div>
          <div className="text-sm text-[var(--foreground)]/70">热门文章</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[var(--foreground)]/10">
          <div className="text-3xl font-bold text-[var(--accent)]">{devices.length}</div>
          <div className="text-sm text-[var(--foreground)]/70">设备类型</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[var(--foreground)]/10">
          <div className="text-3xl font-bold text-[var(--accent)]">
            {devices.reduce((max: number, d: any) => Math.max(max, d.value), 0)}
          </div>
          <div className="text-sm text-[var(--foreground)]/70">最高单日访问</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-white p-6 rounded-xl border border-[var(--foreground)]/10">
          <h2 className="text-lg font-medium mb-4">访问趋势（近30天）</h2>
          <TrendChart data={trend.map((t: any) => ({ date: t.date, count: Number(t.count) }))} />
        </div>

        {/* Device Distribution */}
        <div className="bg-white p-6 rounded-xl border border-[var(--foreground)]/10">
          <h2 className="text-lg font-medium mb-4">设备分布</h2>
          <PieChartComponent data={devices} />
        </div>

        {/* Top Articles */}
        <div className="bg-white p-6 rounded-xl border border-[var(--foreground)]/10 col-span-2">
          <h2 className="text-lg font-medium mb-4">文章点击排行</h2>
          <BarChartComponent
            data={topArticles.map((a: any) => ({ name: `文章 #${a.id}`, value: Number(a.count) }))}
          />
        </div>
      </div>
    </div>
  );
}