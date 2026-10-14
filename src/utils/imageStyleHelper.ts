import { ImageDisplayConfig } from '../types';

export const getAspectRatioClass = (
  ratio?: string,
  target: 'product' | 'blog' = 'product'
): string => {
  switch (ratio) {
    case '3/4':
      return 'aspect-[3/4]';
    case '2/3':
      return 'aspect-[2/3]';
    case '1/1':
      return 'aspect-square';
    case '4/3':
      return 'aspect-[4/3]';
    case '16/9':
      return 'aspect-video';
    case 'auto':
      return 'aspect-auto';
    default:
      return target === 'product' ? 'aspect-[3/4]' : 'aspect-video';
  }
};

export const getRadiusClass = (radius?: string): string => {
  switch (radius) {
    case 'none':
      return 'rounded-none';
    case 'sm':
      return 'rounded-md';
    case 'md':
      return 'rounded-lg';
    case 'lg':
      return 'rounded-xl';
    case 'xl':
      return 'rounded-2xl';
    case '2xl':
      return 'rounded-3xl';
    case 'full':
      return 'rounded-full';
    default:
      return 'rounded-xl';
  }
};

export const getFilterStyle = (preset?: string): string => {
  switch (preset) {
    case 'cinematic':
      return 'contrast-115 saturate-110 brightness-95';
    case 'vibrant':
      return 'saturate-150 contrast-105';
    case 'warm':
      return 'sepia-25 saturate-120 hue-rotate-[-10deg]';
    case 'cool':
      return 'saturate-110 hue-rotate-15';
    case 'vintage':
      return 'sepia-40 contrast-90 brightness-95';
    case 'grayscale':
      return 'grayscale contrast-125';
    default:
      return '';
  }
};

export const getHoverClass = (hover?: string): string => {
  switch (hover) {
    case 'zoom':
      return 'group-hover:scale-105';
    case 'glow':
      return 'group-hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]';
    case 'lift':
      return 'group-hover:-translate-y-1.5 group-hover:shadow-xl';
    case 'brightness':
      return 'group-hover:brightness-110';
    default:
      return '';
  }
};

/**
 * Returns consistent container inline styles and classes for image wrappers
 */
export const getImageContainerStyles = (
  cfg?: ImageDisplayConfig,
  target: 'product' | 'blog' = 'product'
) => {
  const isFixed = cfg?.heightMode === 'fixed' && Boolean(cfg?.customHeight);
  const customHeight = cfg?.customHeight;

  const style: React.CSSProperties = {};
  if (isFixed && customHeight) {
    style.height = `${customHeight}px`;
  }

  const aspectClass = isFixed ? '' : getAspectRatioClass(cfg?.aspectRatio, target);
  const radiusClass = getRadiusClass(cfg?.borderRadius);
  const borderClass = cfg?.showBorder ? 'ring-1 ring-slate-900/10' : '';
  const hoverClass = getHoverClass(cfg?.hoverEffect);

  return {
    style,
    aspectClass,
    radiusClass,
    borderClass,
    hoverClass,
    combinedClassName: `relative overflow-hidden transition-all duration-300 w-full ${aspectClass} ${radiusClass} ${borderClass} ${hoverClass}`,
  };
};

/**
 * Returns consistent <img> element styles and classes
 */
export const getImageElementProps = (cfg?: ImageDisplayConfig) => {
  const filterClass = getFilterStyle(cfg?.filterPreset);
  const style: React.CSSProperties = {
    objectFit: cfg?.objectFit || 'cover',
    objectPosition: cfg?.objectPosition || 'center',
  };

  return {
    style,
    className: `w-full h-full transition-all duration-500 ${filterClass}`,
  };
};
