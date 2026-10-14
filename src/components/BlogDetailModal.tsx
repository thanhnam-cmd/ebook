import React, { useEffect, useState } from 'react';
import { X, Calendar, Clock, Tag, BookOpen, ArrowRight, ExternalLink, Share2, Check } from 'lucide-react';
import { BlogPost, Product } from '../types';
import { BookCover } from './BookCover';
import { getImageContainerStyles, getImageElementProps } from '../utils/imageStyleHelper';

interface BlogDetailModalProps {
  blog: BlogPost | null;
  products: Product[];
  onClose: () => void;
  onBuyProduct: (product: Product) => void;
  onOpenSampleRead: (product: Product) => void;
}

export const BlogDetailModal: React.FC<BlogDetailModalProps> = ({
  blog,
  products,
  onClose,
  onBuyProduct,
  onOpenSampleRead,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  // Prevent background scroll while modal is active
  useEffect(() => {
    if (!blog) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [blog]);

  if (!blog) return null;

  // Find linked product if specified
  const linkedProduct = products.find(p => p.id === blog.linkedProductId) || products[0];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden no-scrollbar animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh] no-scrollbar">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-white sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>GÓC CHIA SẺ &amp; BÀI VIẾT</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs"
              title="Chia sẻ bài viết"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Đã sao chép' : 'Chia sẻ'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Article Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 no-scrollbar">
          {/* Article Header */}
          <div className="space-y-3.5 border-b border-slate-100 pb-5">
            <div className="flex flex-wrap items-center gap-2">
              {blog.tags.map(t => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200"
                >
                  <Tag className="w-3 h-3" />
                  <span>{t}</span>
                </span>
              ))}
              <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
                <Clock className="w-3.5 h-3.5" />
                {blog.readTime}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {blog.title}
            </h1>

            <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
              <span className="font-semibold text-slate-800">Tác giả: {blog.author}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {blog.publishedAt}
              </span>
            </div>
          </div>

          {/* Featured Hero Thumbnail Image */}
          {blog.thumbnail_url && (
            (() => {
              const container = getImageContainerStyles(blog.image_config, 'blog');
              const imgProps = getImageElementProps(blog.image_config);
              return (
                <div className="w-full flex justify-center">
                  <div
                    style={container.style}
                    className={`${container.combinedClassName} shadow-md bg-slate-900 max-h-96`}
                  >
                    <img
                      src={blog.thumbnail_url}
                      alt={blog.title}
                      style={imgProps.style}
                      className={imgProps.className}
                    />
                    {blog.image_config?.overlayOpacity && blog.image_config.overlayOpacity > 0 ? (
                      <div
                        className="absolute inset-0 bg-slate-950 pointer-events-none transition-opacity"
                        style={{ opacity: blog.image_config.overlayOpacity / 100 }}
                      />
                    ) : null}
                  </div>
                </div>
              );
            })()
          )}

          {/* Article Content */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {blog.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-base sm:text-lg font-bold text-slate-900 pt-3 border-t border-slate-100">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n- ');
                return (
                  <ul key={index} className="space-y-1.5 list-disc list-inside bg-slate-50 p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm">
                    {items.map((it, i) => (
                      <li key={i} className="text-slate-800">
                        {it.replace('- ', '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              return <p key={index}>{paragraph}</p>;
            })}
          </div>

          {/* ======================================================= */}
          {/* INTEGRATED PRODUCT CALLOUT BOX (SPECIAL USER REQUEST)    */}
          {/* ======================================================= */}
          {linkedProduct && (
            <div className="mt-8 p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-indigo-50/60 to-white border-2 border-blue-200 rounded-2xl shadow-sm space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-800">
                <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                <span>TÀI LIỆU ỨNG DỤNG ĐƯỢC NHẮC ĐẾN TRONG BÀI VIẾT:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Book Cover Preview */}
                <div className="sm:col-span-4 max-w-[160px] sm:max-w-[180px] mx-auto sm:mx-0 w-full">
                  <BookCover product={linkedProduct} size="sm" />
                </div>

                {/* Book Details & CTA Buttons */}
                <div className="sm:col-span-8 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                      {linkedProduct.type === 'combo' ? 'Gói Combo' : 'Ebook PDF'}
                    </span>
                    {linkedProduct.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                        {linkedProduct.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {linkedProduct.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {linkedProduct.tagline}
                  </p>

                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="text-lg sm:text-xl font-black text-blue-600 tabular-nums">
                      {linkedProduct.price.toLocaleString('vi-VN')} ₫
                    </span>
                    {linkedProduct.original_price > linkedProduct.price && (
                      <span className="text-xs text-slate-400 line-through tabular-nums">
                        {linkedProduct.original_price.toLocaleString('vi-VN')} ₫
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-slate-500">
                      · PDF {linkedProduct.pages} trang
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                    <button
                      onClick={() => onOpenSampleRead(linkedProduct)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg border border-slate-300 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>Đọc thử (Drive)</span>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onBuyProduct(linkedProduct);
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm shadow-blue-500/20 hover:shadow-md transition-all cursor-pointer whitespace-nowrap"
                    >
                      <span>Mua ngay bản đầy đủ</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50 shrink-0">
          <div className="text-xs text-slate-500 truncate mr-2">
            Bài viết chia sẻ kiến thức · Bản quyền Hoàng Nguyễn
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg border border-slate-300 transition-colors cursor-pointer shrink-0"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
