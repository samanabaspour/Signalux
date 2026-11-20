import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverText, setHoverText] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const springConfig = { damping: 28, stiffness: 400, mass: 0.2 };
  const mouseX = useSpring(-100, springConfig);
  const mouseY = useSpring(-100, springConfig);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('interactive');

      const cardElem = target.closest('.glass-card') || target.closest('[data-cursor-text]');
      const customText = cardElem?.getAttribute('data-cursor-text') || (cardElem ? 'مشاهده' : null);

      setIsHovered(!!isInteractive || !!customText);
      setHoverText(customText);
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, [mouseX, mouseY]);

  if (isMobile) return null;

  return (
    <>
      {/* Outer Trionn Style Cursor Ring */}
      <motion.div
        className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-400/60 flex items-center justify-center backdrop-blur-[2px]"
        style={{
          x: mouseX,
          y: mouseY,
          width: hoverText ? '72px' : isHovered ? '50px' : '32px',
          height: hoverText ? '72px' : isHovered ? '50px' : '32px',
          backgroundColor: hoverText
            ? 'rgba(212, 175, 55, 0.25)'
            : isHovered
            ? 'rgba(245, 224, 179, 0.18)'
            : 'transparent',
          boxShadow: hoverText
            ? '0 0 25px rgba(212, 175, 55, 0.45)'
            : isHovered
            ? '0 0 20px rgba(245, 224, 179, 0.35)'
            : 'none',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {hoverText && (
          <span className="text-[10px] font-mono font-bold text-amber-200 uppercase tracking-tighter animate-pulse select-none">
            {hoverText}
          </span>
        )}
      </motion.div>

      {/* Center Core Dot */}
      <motion.div
        className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gradient-to-r from-amber-300 to-yellow-500 rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
        }}
      />
    </>
  );
};
