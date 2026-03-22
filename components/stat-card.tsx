'use client';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  subtitle?: string;
  color?: string;
}

export function StatCard({ title, value, icon, subtitle, color = 'bg-accent' }: StatCardProps) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;
    const target = value ?? 0;
    if (target === 0) { setCount(0); return; }
    const duration = 800;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div ref={ref} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title ?? ''}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{count}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`${color} p-3 rounded-xl text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
