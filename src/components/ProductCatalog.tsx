import React, { useState } from 'react';
import { Product, ProductType } from '../types';
import { ProductCard } from './ProductCard';
import { Layers, BookCheck, BookOpen } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  onBuy: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onSampleRead: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onBuy,
  onViewDetails,
  onSampleRead,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | ProductType>('all');

  const filteredProducts = products.filter(p => {
    if (activeTab === 'all') return true;
    return p.type === activeTab;
  });

  const singleCount = products.filter(p => p.type === 'single').length;
  const comboCount = products.filter(p => p.type === 'combo').length;

  return (
    <section id="products-section" className="py-10 sm:py-16 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 pb-4 border-b border-slate-200">
          <div>
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>DANH MỤC NỔI BẬT</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sản phẩm Ebook &amp; Combo
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
              Gồm 3 tựa sách nền tảng và 4 gói Combo chuyên sâu, mỗi ấn phẩm giải quyết trọn vẹn một nút thắt tư duy và hành động.
            </p>
          </div>

          {/* Filter Segmented Control (Fully responsive, no scrollbars) */}
          <div className="w-full sm:w-auto inline-flex items-center p-1 sm:p-1.5 bg-slate-200/80 rounded-xl gap-1 shrink-0 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap text-center ${
                activeTab === 'all'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('single')}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'single'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookCheck className="w-3.5 h-3.5" />
              <span>Sách đơn lẻ ({singleCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('combo')}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'combo'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Gói Combo ({comboCount})</span>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onBuy={onBuy}
              onViewDetails={onViewDetails}
              onSampleRead={onSampleRead}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">Không có sản phẩm nào trong danh mục này.</p>
          </div>
        )}
      </div>
    </section>
  );
};
