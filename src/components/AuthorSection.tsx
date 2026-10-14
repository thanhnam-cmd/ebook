import React from 'react';
import { Globe, Share2, Award, Users, BookOpen, Quote } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

export const AuthorSection: React.FC = () => {
  return (
    <section id="author-section" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 shadow-xl text-white">
          {/* Subtle background ambient styling */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative max-w-4xl mx-auto p-8 sm:p-14 space-y-6 text-center sm:text-left">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-1">
                VỀ TÁC GIẢ
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Hoàng Nguyễn (Alex Nguyen)
              </h3>
            </div>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed italic border-l-4 border-sky-400 pl-4 py-1 bg-white/5 rounded-r-xl">
              &ldquo;Hơn 10 năm kinh nghiệm tư vấn quản trị, tối ưu hóa năng suất cá nhân và hoạch định tài chính độc lập. Bộ sách &ldquo;Bộ Ba Mật Mã&rdquo; (Tỉnh Thức – Kết Nối – Tài Chính) được chắt lọc từ những vấp ngã thực tế và hàng trăm buổi cố vấn chuyên sâu cho các bạn trẻ và quản lý khởi nghiệp.&rdquo;
            </p>

            <p className="text-sm text-slate-300 leading-relaxed">
              Mục tiêu của bộ tài liệu là mang lại giải pháp tức thì, không giáo điều, giúp bạn trang bị ngay công thức giải quyết bài toán cuộc sống trong vòng 2–3 giờ đọc.
            </p>

            {/* Stats Strip with Animated Rolling Counters */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/15 text-center">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-2xl sm:text-4xl font-black text-sky-300 font-mono">
                  <AnimatedCounter target={10} suffix="+ Năm" duration={1800} />
                </div>
                <div className="text-xs text-slate-300 mt-1">Kinh nghiệm cố vấn</div>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-2xl sm:text-4xl font-black text-emerald-300 font-mono">
                  <AnimatedCounter target={15000} suffix="+" formatWithDots duration={2200} />
                </div>
                <div className="text-xs text-slate-300 mt-1">Độc giả tin tưởng</div>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-2xl sm:text-4xl font-black text-amber-300 font-mono">
                  <AnimatedCounter target={99.4} decimals={1} suffix="%" duration={2000} />
                </div>
                <div className="text-xs text-slate-300 mt-1">Phản hồi tích cực</div>
              </div>
            </div>

            {/* Social Channels */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/10 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Facebook Tác Giả</span>
              </a>
              <a
                href="https://google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/10 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Website / Blog Tri Thức</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
