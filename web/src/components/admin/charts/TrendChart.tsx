import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendChartProps {
  data: { date: string; count: number }[];
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,45,45,0.1)" />
        <XAxis dataKey="date" stroke="#6B6B6B" fontSize={12} />
        <YAxis stroke="#6B6B6B" fontSize={12} />
        <Tooltip
          contentStyle={{ background: '#fff', border: '1px solid rgba(45,45,45,0.1)', borderRadius: '8px' }}
        />
        <Line type="monotone" dataKey="count" stroke="#8B4513" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}