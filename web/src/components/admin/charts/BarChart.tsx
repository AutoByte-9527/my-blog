import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: { name: string; value: number }[];
}

export function BarChartComponent({ data }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,45,45,0.1)" />
        <XAxis type="number" stroke="#6B6B6B" fontSize={12} />
        <YAxis dataKey="name" type="category" stroke="#6B6B6B" fontSize={12} width={100} />
        <Tooltip
          contentStyle={{ background: '#fff', border: '1px solid rgba(45,45,45,0.1)', borderRadius: '8px' }}
        />
        <Bar dataKey="value" fill="#8B4513" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}