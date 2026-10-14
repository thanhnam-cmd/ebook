import React from 'react';
import { BlogPost, Product } from '../types';
import { BookOpen, Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { getImageContainerStyles, getImageElementProps } from '../utils/imageStyleHelper';

interface BlogSectionProps {
  blogs: BlogPost[];
  products: Product[];
  onSelectBlog: (blog: BlogPost) => void;
  onBuyProduct: (product: Product) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  blogs,
  products,
  onSelectBlog,
  onBuyProduct,
}) => {
  return (
    <section id="blog-section" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-4 border-b border-slate-200">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>GÓC CHIA SẺ &amp; BÀI VIẾT THỰC CHIẾN</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Blog Tri Thức Ứng Dụng
            </h2>
            <p className="mt-1 text-sm text-slate-500 max-w-xl">
              Những bài phân tích chuyên sâu về quản trị cảm xúc, nghệ thuật giao tiếp và kỷ luật dòng tiền giúp bạn nâng cấp tư duy mỗi ngày.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Tổng cộng <strong>{blogs.length} bài viết</strong> được tuyển chọn
          </div>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogs.map(blog => {
            const linkedProduct = products.find(p => p.id === blog.linkedProductId);

            return (
              <article
                key={blog.id}
                onClick={() => onSelectBlog(blog)}
                className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer hover:-translate-y-1"
              >
                {/* Visual Header: Thumbnail Image with Display Config OR Cover Gradient */}
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
                        {/* Dark overlay for contrast */}
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-black/40 pointer-events-none"
                          style={{
                            opacity:
                              blog.image_config?.overlayOpacity !== undefined
                                ? Math.max(0.2, blog.image_config.overlayOpacity / 100)
                                : 0.4,
                          }}
                        />

                        {/* Overlay Info */}
                        <div className="absolute inset-0 p-3.5 flex flex-col justify-between text-white z-10 pointer-events-none">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold tracking-wider uppercase bg-blue-600/90 px-2 py-0.5 rounded-full backdrop-blur-xs shadow-xs">
                              {blog.tags[0] || 'Tri thức'}
                            </span>
                            <span className="flex items-center gap-1 text-slate-200 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs font-mono text-[10px]">
                              <Clock className="w-3 h-3 text-blue-300" />
                              {blog.readTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div
                    className={`relative h-44 bg-gradient-to-br ${
                      blog.coverGradient || 'from-blue-600 to-indigo-900'
                    } p-4 flex flex-col justify-between text-white overflow-hidden`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold tracking-wider uppercase bg-black/30 px-2 py-0.5 rounded backdrop-blur-xs">
                        {blog.tags[0] || 'Tri thức'}
                      </span>
                      <span className="flex items-center gap-1 text-slate-200">
                        <Clock className="w-3.5 h-3.5" />
                        {blog.readTime}
                      </span>
                    </div>

                    <div className="mt-auto">
                      <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>{blog.publishedAt}</span>
                      <span>·</span>
                      <span>{blog.author}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {blog.title}
                    </h3>

                    <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    {linkedProduct && (
                      <span className="text-[11px] text-blue-700 font-semibold truncate max-w-[150px]">
                        Sách: {linkedProduct.title}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 font-bold text-blue-600 group-hover:translate-x-1 transition-transform ml-auto">
                      <span>Đọc tiếp</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
