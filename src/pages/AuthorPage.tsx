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
        <span className="text-slate-900 font-bold">Tác giả Đăng Trí</span>
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
            Hiểu mình, hiểu người, hiểu tiền bạc
          </h1>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed italic border-l-4 border-blue-600 pl-4 py-1.5 bg-slate-50/60 rounded-r-xl">
            &ldquo;Tôi chọn cách viết thẳng, không tô vẽ và không hứa hẹn những điều phi thực tế. Mong rằng những gì tôi đã trải qua, học hỏi và đúc kết có thể giúp bạn hiểu mình rõ hơn, nhìn cuộc sống sáng suốt hơn và tránh được một vài vòng lặp không cần thiết trên hành trình của chính mình.&rdquo;
          </p>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Tôi là Đăng Trí. Tôi lớn lên giữa Sài Gòn, tốt nghiệp cử nhân kinh tế trước khi bước vào công ty của gia đình. Không lâu sau, tôi dựng thêm một doanh nghiệp riêng và đi song song hai con đường. Bề ngoài, mọi thứ trông vững vàng: công việc, gia đình và những trách nhiệm thường ngày. Nhưng phía sau đó, tôi đã trải qua nhiều năm khó khăn trong đời sống riêng, và chính những trải nghiệm ấy dần khiến tôi nhìn lại cách mình sống, cách mình suy nghĩ và cách mình đối diện với những vấn đề của cuộc đời.
          </p>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Áp lực tiền bạc, cách con người đối xử với nhau, cảm giác lạc mất chính mình: tôi không còn né những điều đó được nữa. Tôi bắt đầu tìm hiểu, quan sát và thử nghiệm trên chính bản thân mình và dần nhận ra rằng, để thay đổi cuộc sống, đôi khi chúng ta cần bắt đầu bằng việc hiểu rõ hơn những gì đang diễn ra bên trong mình. Tôi đặc biệt quan tâm đến tâm lý con người: vì sao chúng ta suy nghĩ, phản ứng và đưa ra những lựa chọn nhất định, vì sao có những vấn đề liên tục lặp lại dù đã nhiều lần cố gắng thay đổi.
          </p>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Kiến thức tôi chia sẻ xuất phát từ niềm tin rằng, một đời sống tốt cần được xây dựng trên những nền móng vững chắc. Với tôi, ba nền móng đầu tiên là hiểu và làm chủ chính mình, xây dựng các mối quan hệ lành mạnh và quản lý tiền bạc có kỷ luật. Tôi không cho rằng một cuốn sách có thể giải quyết mọi vấn đề, cũng không tin rằng có một công thức phù hợp với tất cả mọi người. Điều tôi mong muốn là chia sẻ những góc nhìn, kiến thức và bài học đã được đúc kết, để bạn có thêm cơ sở nhìn nhận hoàn cảnh của mình và tự đưa ra những lựa chọn phù hợp.
          </p>

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
        </div>

        <blockquote className="text-base sm:text-xl font-medium text-slate-200 leading-relaxed italic">
          &ldquo;Một góc nhìn mới đôi khi không lập tức giải quyết được mọi khó khăn, nhưng có thể giúp một người hiểu điều gì đang xảy ra, nhận ra những lựa chọn mình chưa từng nghĩ đến và bắt đầu thay đổi từ những điều có thể làm được.&rdquo;
        </blockquote>

        <div className="flex items-center gap-3 pt-2">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            ĐT
          </div>
          <div>
            <div className="font-bold text-sm text-white">Đăng Trí</div>
          </div>
        </div>
      </div>
    </div>
  );
};
