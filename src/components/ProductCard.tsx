import React from 'react';
import { BookOpen, FileText, ArrowRight, ExternalLink } from 'lucide-react';
import { Product } from '../types';
import { BookCover } from './BookCover';

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  onSampleRead: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onBuy,
  onViewDetails,
  onSampleRead,
}) => {
  const isCombo = product.type === 'combo';
  const savings = product.original_price - product.price;
  const canViewDetails = typeof onViewDetails === 'function';
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Book Cover Area */}
      <div
        className={`p-4 pb-2 ${canViewDetails ? 'cursor-pointer' : ''}`}
        onClick={canViewDetails ? handleViewDetails : undefined}
      >
        <BookCover product={product} size="md" />
      </div>

      {/* Book Information */}
      <div className="p-5 pt-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Badge */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
            <span className="font-medium text-blue-600">
              {isCombo ? 'Gói Combo Tiết Kiệm' : 'Ebook Đơn Lẻ'}
            </span>
            <span className="flex items-center gap-1 font-mono text-slate-500">
              <FileText className="w-3.5 h-3.5" />
              <span>PDF · {product.pages} trang</span>
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={canViewDetails ? handleViewDetails : undefined}
            className={`text-base sm:text-lg font-bold text-slate-900 transition-colors line-clamp-1 ${
              canViewDetails ? 'group-hover:text-blue-600 cursor-pointer' : ''
            }`}
          >
            {product.title}
          </h3>

          {/* Tagline / Subtitle */}
          <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>

          {/* Included Books for Combo */}
          {isCombo && product.included_books && (
            <div className="mt-2.5 p-2 bg-blue-50/60 rounded-lg border border-blue-100 text-[11px] text-blue-900 leading-snug">
              <span className="font-semibold text-blue-800">Gồm {product.included_books.length} cuốn: </span>
              {product.included_books.join(', ')}
            </div>
          )}
        </div>

        {/* Pricing & CTA Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xl sm:text-2xl font-black text-blue-600 tabular-nums">
                {product.price.toLocaleString('vi-VN')} ₫
              </span>
              {product.original_price > product.price && (
                <span className="ml-2 text-xs text-slate-400 line-through tabular-nums">
                  {product.original_price.toLocaleString('vi-VN')} ₫
                </span>
              )}
            </div>

            {savings > 0 && (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                Tiết kiệm {savings.toLocaleString('vi-VN')} ₫
              </span>
            )}
          </div>

          {/* Secondary Action Row: Đọc thử, chỉ hiển thị chi tiết khi trang có hỗ trợ */}
          <div className={`grid gap-2 ${canViewDetails ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <button
              onClick={() => onSampleRead(product)}
              className="min-h-[38px] px-2.5 py-2 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/60 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-98"
              title="Đọc thử trích đoạn trên Google Drive"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">Đọc thử (Drive)</span>
            </button>

            {canViewDetails && (
              <button
                onClick={handleViewDetails}
                className="min-h-[38px] px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-98"
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Xem mục lục</span>
              </button>
            )}
          </div>

          {/* Primary Action Button: Mua ngay / Mua combo */}
          <button
            onClick={() => onBuy(product)}
            className={`w-full min-h-[42px] py-2.5 text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 ${
              isCombo
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
            }`}
          >
            <span>{isCombo ? 'Mua trọn gói combo' : 'Mua ngay bản PDF'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
