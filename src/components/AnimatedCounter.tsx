import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  target: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  formatWithDots?: boolean;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  target,
  decimals = 0,
  duration = 1800,
  prefix = '',
  suffix = '',
  formatWithDots = false,
  className = '',
}) => {
  const [count, setCount] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasStarted(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const easeOutQuart = (x: number): number => {
      return 1 - Math.pow(1 - x, 4);
    };

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);

      const currentVal = easedProgress * target;
      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [hasStarted, target, duration]);

  // Format the display string
  const formatNumber = (num: number): string => {
    if (formatWithDots) {
      return Math.round(num).toLocaleString('vi-VN');
    }
    if (decimals > 0) {
      return num.toFixed(decimals);
    }
    return Math.round(num).toString();
  };

  return (
    <span ref={ref} className={`inline-block tabular-nums transition-all ${className}`}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
};
