import React, { useState } from 'react';
import { BlogPost, Product } from '../types';
import { AppRoute } from '../components/Navbar';
import {
  ArrowLeft,
  BookOpen,
  Search,
  Clock,
  ArrowRight,
  Tag,
  User,
} from 'lucide-react';
import { getImageContainerStyles, getImageElementProps } from '../utils/imageStyleHelper';

interface BlogPageProps {
  blogs: BlogPost[];
  products: Product[];
  onNavigate: (route: AppRoute) => void;
  onSelectBlog: (blog: BlogPost) => void;
  onBuyProduct: (product: Product) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  blogs,
  products,
  onNavigate,
  onSelectBlog,
  onBuyProduct,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all distinct tags
  const allTags = Array.from(
    new Set(blogs.flatMap((b) => b.tags || []))
  );

  const filteredBlogs = blogs.filter((b) => {
    if (selectedTag !== 'all' && !b.tags.includes(selectedTag)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = b.title.toLowerCase().includes(q);
      const matchExcerpt = (b.excerpt || '').toLowerCase().includes(q);
      const matchContent = (b.content || '').toLowerCase().includes(q);
      if (!matchTitle && !matchExcerpt && !matchContent) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button
          onClick={() => onNavigate('home')}
          className="hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Trang chủ</span>
        </button>
        <span>/</span>
        <span className="text-slate-900 font-bold">Blog Tri Thức Ứng Dụng</span>
      </div>

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase border border-blue-200">
            <BookOpen className="w-3.5 h-3.5" />
            <span>TRI THỨC THỰC CHIẾN ({blogs.length} BÀI VIẾT)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight cinematic-text">
            Góc Nhìn, Thấu Kính &amp; Bài Viết Chuyên Sâu
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            Các bài viết đúc kết từ thực nghiệm, hỗ trợ bạn tư duy sáng rõ và tìm ra giải pháp tối ưu cho những bế tắc trong công việc và tâm trí.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
          />
        </div>
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedTag('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            selectedTag === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Tất cả chủ đề
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedTag === tag
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Blog Cards Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy bài viết nào</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Thử tìm với từ khóa khác hoặc xóa bộ lọc chủ đề.
          </p>
          <button
            onClick={() => {
              setSelectedTag('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"
          >
            Xem tất cả bài viết
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredBlogs.map((blog) => {
            const linkedProduct = products.find((p) => p.id === blog.linkedProductId);

            return (
              <article
                key={blog.id}
                onClick={() => onSelectBlog(blog)}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between overflow-hidden group reveal-on-scroll"
              >
                {/* Header: Custom Thumbnail Image or Gradient Banner */}
                {blog.thumbnail_url ? (
                  (() => {
                    const container = getImageContainerStyles(blog.image_config, 'blog');
                    const imgProps = getImageElementProps(blog.image_config);
                    return (
                      <div
                        style={container.style}
                        className={`${container.combinedClassName} bg-slate-900 group`}
                      >
                        <img
                          src={blog.thumbnail_url}
                          alt={blog.title}
                          style={imgProps.style}
                          className={imgProps.className}
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-black/30 pointer-events-none"
                          style={{
                            opacity:
                              blog.image_config?.overlayOpacity !== undefined
                                ? Math.max(0.2, blog.image_config.overlayOpacity / 100)
                                : 0.4,
                          }}
                        />
                        <div className="absolute inset-0 p-4 flex flex-col justify-between text-white z-10 pointer-events-none">
                          <div className="flex items-center justify-between text-xs">
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-600/90 font-semibold shadow-xs">
                              {blog.tags[0] || 'Tri thức'}
                            </span>
                            <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full font-mono text-[11px]">
                              <Clock className="w-3.5 h-3.5 text-blue-300" />
                              <span>{blog.readTime}</span>
                            </span>
                          </div>
                          <div className="text-[11px] opacity-90 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            <span>{blog.author}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div
                    className={`h-40 bg-gradient-to-tr ${
                      blog.coverGradient || 'from-blue-600 to-indigo-800'
                    } p-5 flex flex-col justify-between text-white relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative z-10 flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs font-semibold">
                        {blog.tags[0] || 'Tri thức'}
                      </span>
                      <span className="flex items-center gap-1 opacity-90">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{blog.readTime}</span>
                      </span>
                    </div>
                    <div className="relative z-10 text-[11px] opacity-80 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>{blog.author}</span>
                    </div>
                  </div>
                )}

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">
                      {new Date(blog.publishedAt).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Đọc tiếp</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
