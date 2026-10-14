import React from 'react';
import { AppRoute } from '../components/Navbar';
import {
  ArrowLeft,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  Heart,
  Quote,
  ArrowRight,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { AnimatedCounter } from '../components/AnimatedCounter';

interface AuthorPageProps {
  onNavigate: (route: AppRoute) => void;
  onQuickBuy?: () => void;
}

export const AuthorPage: React.FC<AuthorPageProps> = ({ onNavigate, onQuickBuy }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
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
        <span className="text-slate-900 font-bold">Tác giả Hoàng Nguyễn</span>
      </div>

      {/* Main Author Hero Card - Text-only presentation */}
      <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/90 shadow-sm relative overflow-hidden reveal-on-scroll">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/60 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase border border-blue-200">
            <Users className="w-3.5 h-3.5" />
            <span>Tiểu Sử &amp; Sứ Mệnh Tác Giả</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight cinematic-text">
            Chuyển hóa nhận thức, neo giữ bình an và bứt phá nội lực
          </h1>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed italic border-l-4 border-blue-600 pl-4 py-1.5 bg-slate-50/60 rounded-r-xl">
            &ldquo;Tôi viết những cuốn sách này không phải để bạn tích trữ thêm thông tin, mà để bạn có thể gập sách lại và ngay lập tức đưa ra những quyết định sáng suốt hơn trong công việc và các mối quan hệ.&rdquo;
          </p>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Chào bạn, tôi là Hoàng Nguyễn. Hơn một thập kỷ qua, tôi đã đồng hành cùng hàng nghìn độc giả, chuyên gia và người khởi nghiệp trẻ vượt qua những cơn khủng hoảng hiện sinh, giải phóng tâm trí khỏi bẫy overthinking và xây dựng nền tảng tư duy vững chắc.
          </p>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Tôi không tin vào những khẩu hiệu kích động cảm xúc nhất thời. Mọi trang sách tôi viết đều bắt nguồn từ những chiêm nghiệm sâu sắc, trải nghiệm thương đau thực tế và phương pháp luận có thể đo lường được kết quả.
          </p>

          {/* Stats with Animated Counters */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 border-t border-slate-100 text-center">
            <div className="p-3 sm:p-4 bg-slate-50/80 rounded-2xl border border-slate-100 shadow-xs">
              <div className="text-2xl sm:text-4xl font-black text-blue-600 font-mono">
                <AnimatedCounter target={10} suffix="+ Năm" duration={1800} />
              </div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Năm kinh nghiệm</div>
            </div>
            <div className="p-3 sm:p-4 bg-slate-50/80 rounded-2xl border border-slate-100 shadow-xs">
              <div className="text-2xl sm:text-4xl font-black text-blue-600 font-mono">
                <AnimatedCounter target={15000} suffix="+" formatWithDots duration={2200} />
              </div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Độc giả tin tưởng</div>
            </div>
            <div className="p-3 sm:p-4 bg-slate-50/80 rounded-2xl border border-slate-100 shadow-xs">
              <div className="text-2xl sm:text-4xl font-black text-blue-600 font-mono">
                <AnimatedCounter target={99.4} decimals={1} suffix="%" duration={2000} />
              </div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Đánh giá hài lòng</div>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <button
              onClick={() => onNavigate('products')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all text-sm flex items-center gap-2 cursor-pointer btn-dynamic-primary"
            >
              <BookOpen className="w-4 h-4" />
              <span>Khám Phá Toàn Bộ Sách</span>
            </button>
            <button
              onClick={() => onNavigate('blog')}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Đọc các bài viết mới
            </button>
          </div>
        </div>
      </div>

      {/* 3 Core Principles */}
      <div className="space-y-6 reveal-on-scroll">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>Triết Lý Sáng Tác</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight cinematic-text">
            3 Nguyên Tắc Cốt Lõi Trong Mọi Cuốn Sách
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">Tính Thực Chiến Cao</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mỗi chương đều có bài tập, bảng biểu hoặc quy trình hành động cụ thể. Đọc xong là có thể áp dụng được ngay mà không cần suy đoán.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">Bảo Chứng Khoa Học</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Kết hợp giữa tâm lý học hành vi hiện đại và triết học tỉnh thức phương Đông, đảm bảo tính vững chắc và bền vững của tư duy.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">Tôn Trọng Thời Gian</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Văn phong tinh gọn, loại bỏ từ ngữ đao to búa lớn. Mỗi cuốn sách chỉ từ 140 - 180 trang nhưng hàm lượng kiến thức tương đương nhiều khóa học chuyên sâu.
            </p>
          </div>
        </div>
      </div>

      {/* Reader Quotes */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-8 sm:p-12 text-white space-y-6 reveal-on-scroll">
        <div className="flex items-center gap-2 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400" />
          ))}
          <span className="text-xs text-slate-300 ml-2">Cảm nhận từ độc giả</span>
        </div>

        <blockquote className="text-base sm:text-xl font-medium text-slate-200 leading-relaxed italic">
          &ldquo;Đọc sách của tác giả Hoàng Nguyễn giống như có một người thầy thông thái ngồi trò chuyện trực tiếp bên tách cà phê. Không phán xét, không giáo điều, chỉ có sự thấu suốt và những bước đi rõ ràng để gỡ rối tâm trí.&rdquo;
        </blockquote>

        <div className="flex items-center gap-3 pt-2">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            LH
          </div>
          <div>
            <div className="font-bold text-sm text-white">Lê Hoàng Long</div>
            <div className="text-xs text-slate-400">Founder &amp; Giám đốc điều hành Startup công nghệ</div>
          </div>
        </div>
      </div>
    </div>
  );
};
