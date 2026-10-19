import React from 'react';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { BookCover } from '../components/BookCover';
import { Product, BlogPost } from '../types';
import { AppRoute } from '../components/Navbar';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  Star,
  Layers,
} from 'lucide-react';

interface HomePageProps {
  products: Product[];
  blogs: BlogPost[];
  onNavigate: (route: AppRoute, filter?: 'all' | 'combo' | 'single') => void;
  onBuy: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onSampleRead: (product: Product) => void;
  onSelectBlog: (blog: BlogPost) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  blogs,
  onNavigate,
  onBuy,
  onViewDetails,
  onSampleRead,
  onSelectBlog,
}) => {
  // Top 3 featured books / combo
  const featuredProducts = products.slice(0, 3);
  const featuredCombo =
    products.find((p) => p.type === 'combo' && p.id === 'combo-bo-ba-mat-ma') ||
    products.find((p) => p.type === 'combo') ||
    products[products.length - 1];
  const recentBlogs = blogs.slice(0, 3);

  return (
    <div className="space-y-14 sm:space-y-20 pb-12">
      {/* 1. Cinematic Hero Section */}
      <Hero
        onExploreClick={() => onNavigate('products')}
      />

      {/* 2. Featured Best-seller Books */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold tracking-wide uppercase border border-blue-200">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ấn phẩm nổi bật</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight cinematic-text">
              Tri thức được tuyển chọn &amp; đón nhận nhiều nhất
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
              Mỗi cuốn sách là một hệ thống hành động cô đọng, loại bỏ lý thuyết sáo rỗng để bạn ứng dụng ngay vào cuộc sống và sự nghiệp.
            </p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group cursor-pointer shrink-0"
          >
            <span>Xem toàn bộ tài liệu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="reveal-on-scroll">
              <ProductCard
                product={product}
                onBuy={onBuy}
                onViewDetails={onViewDetails}
                onSampleRead={onSampleRead}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Best-seller Combo Spotlight Banner */}
      {featuredCombo && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-blue-800/40">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Details */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  <span>GÓI TIẾT KIỆM ĐƯỢC CHỌN NHIỀU NHẤT (-48%)</span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white cinematic-text">
                  {featuredCombo.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {featuredCombo.tagline || featuredCombo.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Bao gồm đầy đủ 3 Ebook PDF bản quyền</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Cập nhật miễn phí trọn đời</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-baseline gap-3 pt-2">
                  <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                    {featuredCombo.price.toLocaleString('vi-VN')} ₫
                  </span>
                  <span className="text-sm text-slate-400 line-through font-mono">
                    {featuredCombo.original_price.toLocaleString('vi-VN')} ₫
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                    Tiết kiệm {(featuredCombo.original_price - featuredCombo.price).toLocaleString('vi-VN')} ₫
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <button
                    onClick={() => onBuy(featuredCombo)}
                    className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer btn-dynamic-primary"
                  >
                    <span>Mua Gói Combo Này Ngay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Combo Image & Navigation to Combo Products */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center gap-4">
                <div className="relative group w-full max-w-xs transform hover:scale-[1.02] transition-transform duration-300">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-400 rounded-2xl blur-md opacity-30 group-hover:opacity-50 transition duration-500" />
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900 flex justify-center">
                    <BookCover product={featuredCombo} size="lg" className="w-full" />
                  </div>
                </div>

                {/* Nút button xem tất cả combo điều hướng tới phần xem combo sản phẩm */}
                <button
                  onClick={() => onNavigate('products', 'combo')}
                  className="w-full max-w-xs inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-extrabold rounded-xl shadow-xl hover:shadow-2xl transition-all cursor-pointer text-sm group"
                >
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Xem tất cả combo</span>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Author Spotlight Preview - Text-only presentation with Animated Rolling Counters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll">
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/90 shadow-sm relative overflow-hidden">
          {/* Subtle decorative background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/80 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto space-y-6 relative z-10 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase border border-slate-200">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Về Tác Giả</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight cinematic-text">
              Đăng Trí — Đồng hành kiến tạo tư duy nội tại
            </h3>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed italic border-l-4 border-blue-600 pl-4 py-1 bg-slate-50/60 rounded-r-xl">
              &ldquo;Tôi viết những cuốn sách này không phải để bạn tích trữ thêm thông tin, mà để bạn có thể gập sách lại và ngay lập tức đưa ra những quyết định sáng suốt hơn trong công việc và các mối quan hệ.&rdquo;
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Tác giả Đăng Trí đã cố vấn và đồng hành cùng nhiều độc giả, doanh nhân trẻ và nhà quản lý vượt qua khủng hoảng tâm lý, giải phóng tâm trí khỏi bẫy overthinking để xây dựng nền tảng tư duy và tự do tài chính bền vững.
            </p>

            <div className="pt-4 flex justify-center sm:justify-start">
              <button
                onClick={() => onNavigate('author')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all cursor-pointer btn-dynamic-secondary shadow-md"
              >
                <span>Đọc toàn bộ câu chuyện tác giả</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Recent Articles Preview */}
      {recentBlogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase border border-blue-200">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Góc Nhìn &amp; Bài Viết</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 cinematic-text">
                Bài viết tri thức ứng dụng mới nhất
              </h3>
            </div>
            <button
              onClick={() => onNavigate('blog')}
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group cursor-pointer"
            >
              <span>Xem tất cả bài viết ({blogs.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentBlogs.map((blog) => (
              <div
                key={blog.id}
                onClick={() => onSelectBlog(blog)}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[11px]">
                      {blog.tags[0] || 'Tri thức'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{blog.readTime}</span>
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Đọc bài viết</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Bottom Quick Action & FAQ preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll">
        <div
          className="rounded-3xl p-8 sm:p-12 text-white text-center space-y-5 shadow-2xl relative overflow-hidden bg-cover bg-center before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/70 before:via-black/45 before:to-black/30 before:rounded-3xl"
          style={{ backgroundImage: "url('/assets/cta-bg.png')" }}
        >
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white cinematic-text">
              Sở hữu ngay bộ tài liệu thay đổi tư duy hôm nay
            </h3>
            <p className="text-sm sm:text-base text-blue-100">
              Quét mã VietQR tự động qua SePay · Nhận file PDF bản quyền qua email trong vòng 2-5 phút · Đọc không giới hạn.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('products')}
                className="px-7 py-3.5 bg-white text-blue-700 hover:bg-blue-50 font-extrabold rounded-xl shadow-lg transition-all text-sm sm:text-base cursor-pointer btn-dynamic-primary"
              >
                Khám Phá Sách &amp; Mua Ebook
              </button>
              <button
                onClick={() => onNavigate('faq')}
                className="px-6 py-3.5 bg-blue-800/60 hover:bg-blue-800 text-white font-bold rounded-xl border border-white/20 transition-all text-sm sm:text-base cursor-pointer"
              >
                Giải Đáp Câu Hỏi
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
