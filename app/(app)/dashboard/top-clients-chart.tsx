'use client';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#2A73E4', '#60B5FF', '#A19AD3', '#80D8C3', '#FF9149'];

export default function TopClientsChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/top-clients')
      .then((r: any) => r?.json?.())
      .then((d: any) => { setData(d ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="skeleton h-48 rounded-xl" />;
  if ((data?.length ?? 0) === 0) return <p className="text-sm text-gray-400 py-8 text-center">No document data yet</p>;

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis type="number" tickLine={false} tick={{ fontSize: 10 }} />
          <YAxis type="category" dataKey="name" width={160} tickLine={false} tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
          <Bar dataKey="docs" radius={[0, 6, 6, 0]} barSize={28}>
            {data?.map((_: any, i: number) => (
              <Cell key={i} fill={COLORS?.[i % COLORS.length] ?? '#2A73E4'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
