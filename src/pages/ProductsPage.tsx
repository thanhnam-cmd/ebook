import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Search, BookCheck, Layers, ArrowLeft } from 'lucide-react';
import { AppRoute } from '../components/Navbar';

interface ProductsPageProps {
  products: Product[];
  initialFilter?: 'all' | 'combo' | 'single';
  onNavigate: (route: AppRoute) => void;
  onBuy: (product: Product) => void;
  onSampleRead: (product: Product) => void;
}

// Robust helper to identify whether a product is a Combo package or a single book
export const isProductCombo = (p: Product): boolean => {
  if (p.type === 'combo') return true;
  if (p.type === 'single') return false;
  if (Array.isArray(p.included_books) && p.included_books.length > 0) return true;
  const id = (p.id || '').toLowerCase();
  const title = (p.title || '').toLowerCase();
  if (id.includes('combo') || title.includes('combo')) return true;
  return false;
};

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  initialFilter = 'all',
  onNavigate,
  onBuy,
  onSampleRead,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'combo' | 'single'>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync with initialFilter if changed from navigation
  useEffect(() => {
    if (initialFilter) {
      setFilterType(initialFilter);
    }
  }, [initialFilter]);

  // Robustly partition into combo & single
  const comboProducts = products.filter(isProductCombo);
  const singleProducts = products.filter((p) => !isProductCombo(p));

  const filteredProducts = products.filter((p) => {
    const isCombo = isProductCombo(p);
    if (filterType === 'combo' && !isCombo) return false;
    if (filterType === 'single' && isCombo) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (p.title || '').toLowerCase().includes(q);
      const matchDesc = (p.description || '').toLowerCase().includes(q);
      const matchTagline = (p.tagline || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTagline) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </button>
          <span>/</span>
          <span className="text-slate-900 font-bold">Thư viện Sách &amp; Ebook</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase border border-blue-200">
              <BookCheck className="w-3.5 h-3.5" />
              <span>TẤT CẢ ẤN PHẨM ({products.length})</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight cinematic-text">
              Thư Viện Ebook Bản Quyền
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
              Chọn mua trọn bộ combo để nhận ưu đãi lên đến 48% hoặc chọn mua lẻ từng cuốn theo đúng nhu cầu học tập và chuyển hóa của bạn.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tựa sách..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
            />
          </div>
        </div>

        {/* Filter Buttons: Tất cả, Gói Combo, Sách Lẻ */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Tất cả ({products.length})
          </button>
          <button
            onClick={() => setFilterType('combo')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === 'combo'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Gói Combo ({comboProducts.length})</span>
          </button>
          <button
            onClick={() => setFilterType('single')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === 'single'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BookCheck className="w-3.5 h-3.5" />
            <span>Sách lẻ từng phần ({singleProducts.length})</span>
          </button>
        </div>
      </div>

      {/* Product List Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <BookCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy sản phẩm phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Vui lòng thử tìm với từ khóa khác hoặc chuyển bộ lọc sang "Tất cả".
          </p>
          <button
            onClick={() => {
              setFilterType('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 cursor-pointer"
          >
            Xem toàn bộ sách
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="animate-in fade-in zoom-in-[0.98] duration-200"
            >
              <ProductCard
                product={product}
                onBuy={onBuy}
                onSampleRead={onSampleRead}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
