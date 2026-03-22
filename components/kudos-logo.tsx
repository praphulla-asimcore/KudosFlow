'use client';
export function KudosLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims = size === 'sm' ? 'h-7' : size === 'lg' ? 'h-12' : 'h-9';
  return (
    <div className={`flex items-center gap-1 ${dims}`}>
      <svg viewBox="0 0 200 60" className={dims} fill="none" xmlns="https://www.shutterstock.com/image-vector/handwritten-design-featuring-word-kudos-260nw-2627979709.jpg">
        {/* Kudos wordmark */}
        <text x="4" y="40" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="38" fill="currentColor">
          Kudos
        </text>
        {/* Blue arc around 'os' */}
        <ellipse cx="155" cy="30" rx="32" ry="26" stroke="#2A73E4" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* Subtitle */}
        <text x="4" y="56" fontFamily="Inter, sans-serif" fontWeight="400" fontSize="10" fill="#94a3b8">
          By your side
        </text>
      </svg>
    </div>
  );
}
