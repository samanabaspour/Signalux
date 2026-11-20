import React from 'react';

interface KineticMarqueeProps {
  items?: string[];
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
}

export const KineticMarquee: React.FC<KineticMarqueeProps> = ({
  items = [
    'UI/UX ARCHITECTURE',
    'HIGH-PERFORMANCE FRONTEND',
    'TECHNICAL SEO & DATA',
    'CREATIVE DIRECTION',
    '3D INTERACTIVE WEBGL',
    'BRAND STRATEGY & GROWTH'
  ],
  direction = 'left',
  className = ''
}) => {
  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className={`relative w-full overflow-hidden py-6 bg-[#070609] border-y border-amber-500/15 select-none ${className}`}>
      {/* Side Vignette Fades */}
      <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#070609] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#070609] to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-marquee whitespace-nowrap">
        {repeatedItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 mx-6 group cursor-default">
            <span className="text-2xl sm:text-4xl lg:text-5xl font-black font-mono uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-100/90 via-amber-200/70 to-amber-500/40 group-hover:from-amber-200 group-hover:via-amber-400 group-hover:to-amber-100 transition-all duration-300">
              {item}
            </span>
            <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 shadow-[0_0_12px_rgba(212,175,55,0.9)] inline-block group-hover:scale-150 transition-transform" />
          </div>
        ))}
      </div>
    </div>
  );
};
