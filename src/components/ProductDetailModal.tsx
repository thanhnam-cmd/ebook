import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, BookOpen, FileText, ArrowRight, ExternalLink } from 'lucide-react';
import { Product } from '../types';
import { BookCover } from './BookCover';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBuy: (product: Product) => void;
  onSampleRead: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuy,
  onSampleRead,
}) => {
  // Lock background body scroll while modal is active
  useEffect(() => {
    if (!product) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [product]);

  if (!product) return null;

  const isCombo = product.type === 'combo';
  const savings = product.original_price - product.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-hidden no-scrollbar">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] no-scrollbar">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Chi tiết ấn phẩm &amp; Mục lục</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto no-scrollbar space-y-5 flex-1">
          {/* Top Overview Split */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
            <div className="sm:col-span-5 flex justify-center">
              <div className="w-full max-w-[220px] sm:max-w-xs">
                <BookCover product={product} size="md" />
              </div>
            </div>

            <div className="sm:col-span-7 space-y-2.5">
              <span className="inline-block text-xs font-bold px-2.5 py-1 rounded bg-blue-100 text-blue-800">
                {isCombo ? 'Gói Combo Nhiều Cuốn' : 'Sách Điện Tử Đơn Lẻ'}
              </span>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {product.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 italic">
                &ldquo;{product.tagline}&rdquo;
              </p>

              <div className="py-2 border-y border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-mono">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Định dạng: PDF
                </span>
                <span>·</span>
                <span>Số trang: <strong>{product.pages} trang</strong></span>
                <span>·</span>
                <span>Bản quyền trọn đời</span>
              </div>

              <div className="pt-1 flex items-baseline gap-2.5">
                <span className="text-2xl font-black text-blue-600 tabular-nums">
                  {product.price.toLocaleString('vi-VN')} ₫
                </span>
                {product.original_price > product.price && (
                  <span className="text-xs text-slate-400 line-through tabular-nums">
                    {product.original_price.toLocaleString('vi-VN')} ₫
                  </span>
                )}
                {savings > 0 && (
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    Tiết kiệm {savings.toLocaleString('vi-VN')} ₫
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                {product.description}
              </p>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-2.5 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Mục lục chi tiết tài liệu:</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {product.table_of_contents.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Audience Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3.5 sm:p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>PHÙ HỢP VỚI:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-emerald-950">
                {product.for_whom.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 sm:p-4 bg-rose-50/70 border border-rose-200 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-800 mb-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>KHÔNG PHÙ HỢP VỚI:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-rose-950">
                {product.not_for_whom.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 px-4 sm:px-6 py-3.5 border-t border-slate-200 bg-slate-50 shrink-0">
          <button
            onClick={() => {
              onClose();
              onSampleRead(product);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-blue-600" />
            <span>Đọc thử trích đoạn (Drive)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer text-center"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                onClose();
                onBuy(product);
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/25 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Đặt mua ({product.price.toLocaleString('vi-VN')} ₫)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
