import React from 'react';
import { BookOpen, Star, ShieldCheck, TrendingUp, Layers } from 'lucide-react';
import { Product } from '../types';
import { getImageContainerStyles, getImageElementProps } from '../utils/imageStyleHelper';

interface BookCoverProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({ product, size = 'md', className = '' }) => {
  const isCombo = product.type === 'combo';

  // Determine cover palette based on product ID (for fallback gradient cover)
  let bgGradient = 'from-blue-600 via-indigo-700 to-slate-900';
  let accentColor = 'text-sky-300';
  let badgeBg = 'bg-blue-500/30 text-blue-200 border-blue-400/30';
  let IconComponent = BookOpen;

  if (product.id.includes('tinh-thuc')) {
    bgGradient = 'from-sky-600 via-blue-700 to-indigo-950';
    accentColor = 'text-amber-300';
    badgeBg = 'bg-sky-500/30 text-sky-200 border-sky-400/30';
    IconComponent = Star;
  } else if (product.id.includes('ket-noi')) {
    bgGradient = 'from-blue-700 via-indigo-800 to-slate-950';
    accentColor = 'text-emerald-300';
    badgeBg = 'bg-indigo-500/30 text-indigo-200 border-indigo-400/30';
    IconComponent = ShieldCheck;
  } else if (product.id.includes('tai-chinh')) {
    bgGradient = 'from-emerald-700 via-teal-800 to-slate-950';
    accentColor = 'text-yellow-300';
    badgeBg = 'bg-emerald-500/30 text-emerald-200 border-emerald-400/30';
    IconComponent = TrendingUp;
  } else if (isCombo) {
    bgGradient = 'from-blue-800 via-indigo-900 to-slate-950';
    accentColor = 'text-amber-300';
    badgeBg = 'bg-amber-500/20 text-amber-200 border-amber-400/30';
    IconComponent = Layers;
  }

  const heightClass = size === 'sm' ? 'h-48' : size === 'lg' ? 'h-96' : 'h-64';

  const cfg = product.image_config;
  const hasCustomImage = Boolean(product.image_url);

  if (hasCustomImage) {
    const container = getImageContainerStyles(cfg, 'product');
    const imgProps = getImageElementProps(cfg);

    return (
      <div
        style={container.style}
        className={`${container.combinedClassName} shadow-lg group-hover:shadow-2xl ${className}`}
      >
        <img
          src={product.image_url}
          alt={product.title}
          style={imgProps.style}
          className={imgProps.className}
        />

        {/* Optional Dark / Dimming Overlay */}
        {cfg?.overlayOpacity && cfg.overlayOpacity > 0 ? (
          <div
            className="absolute inset-0 bg-slate-950 pointer-events-none transition-opacity"
            style={{ opacity: cfg.overlayOpacity / 100 }}
          />
        ) : null}

        {/* Book Spine Simulation (Left Edge 3D Spine) */}
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/40 via-white/20 to-transparent pointer-events-none z-10" />

        {/* Top Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
          {product.badge ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600/90 text-white shadow-xs backdrop-blur-xs uppercase tracking-wider">
              {product.badge}
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/80 text-slate-200 shadow-xs backdrop-blur-xs uppercase tracking-wider">
              {isCombo ? 'COMBO' : 'EBOOK'}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Fallback: Gradient Book Cover
  return (
    <div
      className={`relative overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl ${heightClass} rounded-xl ${className}`}
    >
      {/* Background Gradient & Book Texture */}
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient}`} />

      {/* Book Spine Simulation (Left Edge 3D Highlight) */}
      <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/40 via-white/20 to-transparent pointer-events-none z-10" />
      <div className="absolute left-3 top-0 bottom-0 w-px bg-white/15 pointer-events-none z-10" />

      {/* Decorative Geometric Line & Ambient Glow */}
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-blue-400/10 rounded-full blur-xl pointer-events-none" />

      {/* Book Cover Content */}
      <div className="relative h-full flex flex-col justify-between p-4 sm:p-5 text-white z-0">
        {/* Top: Category & Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wider uppercase text-slate-300">
            <IconComponent className="w-3.5 h-3.5 text-blue-300" />
            <span>{isCombo ? 'GÓI COMBO ĐẶC BIỆT' : 'EBOOK BẢN QUYỀN'}</span>
          </div>
          {product.badge && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${badgeBg}`}
            >
              {product.badge}
            </span>
          )}
        </div>

        {/* Center: Title & Subtitle */}
        <div className="my-auto py-2">
          <h4 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug drop-shadow-sm line-clamp-2">
            {product.title}
          </h4>
          <p className="mt-1.5 text-xs text-slate-200/90 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>

          {isCombo && product.included_books && (
            <div className="mt-2.5 pt-2 border-t border-white/15 flex flex-wrap gap-1 text-[10px] text-amber-200">
              {product.included_books.map((b, i) => (
                <span key={i} className="bg-black/30 px-1.5 py-0.5 rounded">
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom: Format, Pages & Author */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
          <span className="font-medium text-white/90">Tác giả: Hoàng Nguyễn</span>
          <span className="font-mono text-slate-300">PDF · {product.pages} trang</span>
        </div>
      </div>
    </div>
  );
};
