import { useEffect } from 'react';

/**
 * Universal Scroll Reveal with 300px offset threshold.
 * Uses IntersectionObserver configured with rootMargin '0px 0px -300px 0px'.
 * When an element enters within 300px of the viewport, it triggers the 'is-revealed' class.
 */
export function useScrollReveal(dependencyKey?: any) {
  useEffect(() => {
    // If IntersectionObserver is not supported, reveal everything immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal-on-scroll, [data-reveal]').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    // 300px bottom margin threshold (triggers when element is within 300px of viewport)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            // Unobserve once revealed for performance
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -300px 0px',
        threshold: 0.05,
      }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll, [data-reveal]');
    elements.forEach((el) => observer.observe(el));

    // Also check elements that are already above the fold or in small screens
    const timeout = setTimeout(() => {
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
          el.classList.add('is-revealed');
        }
      });
    }, 200);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [dependencyKey]);
}
