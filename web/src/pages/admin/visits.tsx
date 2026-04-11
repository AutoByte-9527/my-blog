import { useState, useEffect } from 'react';
import {
  getVisitTrend,
  getGeoStats,
  getDeviceStats,
  getBrowserStats,
  getOsStats,
  getRefererStats,
} from '../../lib/admin-api';
import { TrendChart } from '../../components/admin/charts/TrendChart';
import { PieChartComponent } from '../../components/admin/charts/PieChart';

type Tab = 'trend' | 'geo' | 'devices' | 'browsers' | 'os' | 'referers';

export function VisitsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('trend');
  const [trend, setTrend] = useState<any[]>([]);
  const [geo, setGeo] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [browsers, setBrowsers] = useState<any[]>([]);
  const [os, setOs] = useState<any[]>([]);
  const [referers, setReferers] = useState<any[]>([]);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [trendData, geoData, devicesData, browsersData, osData, referersData] = await Promise.all([
        getVisitTrend(period),
        getGeoStats(),
        getDeviceStats(),
        getBrowserStats(),
        getOsStats(),
        getRefererStats(),
      ]);
      setTrend(trendData);
      setGeo(geoData);
      setDevices(devicesData.map((d: any) => ({ name: d.device || 'Unknown', value: d.count })));
      setBrowsers(browsersData.map((b: any) => ({ name: b.browser || 'Unknown', value: b.count })));
      setOs(osData.map((o: any) => ({ name: o.os || 'Unknown', value: o.count })));
      setReferers(referersData.map((r: any) => ({ name: r.referer || 'Unknown', value: r.count })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'trend', label: '访问趋势' },
    { key: 'geo', label: '地域分布' },
    { key: 'devices', label: '设备分布' },
    { key: 'browsers', label: '浏览器分布' },
    { key: 'os', label: '操作系统' },
    { key: 'referers', label: '来源分析' },
  ];

  if (loading) return <div className="p-4">加载中...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">访客统计</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[var(--foreground)]/10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--foreground)]/70 hover:text-[var(--foreground)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-xl border border-[var(--foreground)]/10">
        {activeTab === 'trend' && (
          <>
            <div className="flex gap-2 mb-6">
              {(['day', 'week', 'month'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded text-sm ${
                    period === p ? 'bg-[var(--accent)] text-white' : 'bg-[var(--foreground)]/5'
                  }`}
                >
                  {p === 'day' ? '24小时' : p === 'week' ? '近7天' : '近30天'}
                </button>
              ))}
            </div>
            <TrendChart data={trend.map((t: any) => ({ date: t.date, count: Number(t.count) }))} />
          </>
        )}

        {activeTab === 'geo' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--foreground)]/5">
                <tr>
                  <th className="px-4 py-2 text-left">国家</th>
                  <th className="px-4 py-2 text-left">城市</th>
                  <th className="px-4 py-2 text-right">访问量</th>
                </tr>
              </thead>
              <tbody>
                {geo.map((g: any, i) => (
                  <tr key={i} className="border-t border-[var(--foreground)]/10">
                    <td className="px-4 py-2">{g.country || '-'}</td>
                    <td className="px-4 py-2">{g.city || '-'}</td>
                    <td className="px-4 py-2 text-right">{g.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'devices' && <PieChartComponent data={devices} />}
        {activeTab === 'browsers' && <PieChartComponent data={browsers} />}
        {activeTab === 'os' && <PieChartComponent data={os} />}
        {activeTab === 'referers' && <PieChartComponent data={referers} />}
      </div>
    </div>
  );
}