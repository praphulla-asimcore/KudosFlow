'use client';

export function SkeletonTable({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows })?.map((_: any, i: number) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols })?.map((_: any, j: number) => (
            <div key={j} className="skeleton h-8 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
