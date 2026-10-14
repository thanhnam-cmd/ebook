import React from 'react';
import { ArrowRight, UserCheck, BookOpen, GraduationCap, ShieldCheck, Truck, Headphones } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onAuthorClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onAuthorClick }) => {
  const trustBadges = [
    { icon: GraduationCap, title: 'Kiến thức chất lượng', desc: 'Từ các chuyên gia hàng đầu' },
    { icon: ShieldCheck, title: 'Bảo mật tuyệt đối', desc: 'Thanh toán an toàn' },
    { icon: Truck, title: 'Giao hàng nhanh', desc: 'Toàn quốc' },
    { icon: Headphones, title: 'Hỗ trợ 24/7', desc: 'Luôn đồng hành cùng bạn' },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#102744]">
      {/* Hero Image - 100% hiển thị không cắt (object-contain), nền #102744 lấp khoảng trống */}
      <div className="relative w-full min-h-[380px] sm:min-h-[480px] lg:min-h-[600px]">
        <img
          src="/assets/hero-books.png"
          alt="Sách trên bàn làm việc với view thành phố hoàng hôn"
          className="absolute inset-0 w-full h-full object-contain"
          loading="eager"
        />

        {/* Overlay tối chỉ ~1/4 từ trái để chữ nổi, phần lớn ảnh hiển thị rõ */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#102744]/85 via-[#102744]/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102744]/50 via-transparent to-[#102744]/10" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 sm:pt-28 sm:pb-14 lg:pt-32 lg:pb-20">
          <div className="max-w-2xl space-y-3 sm:space-y-5">
            {/* Kicker badge */}
            

            {/* Main Title - ảnh chữ nền trong suốt do người dùng cung cấp */}
            <img
              src="/assets/hero-title.png"
              alt="Tri thức thực chiến, đóng gói gọn trong từng cuốn ebook"
              className="w-full max-w-2xl h-auto drop-shadow-[0_2px_8px_rgba(10,20,40,0.45)]"
              loading="eager"
            />

            

            {/* CTAs - Inter 600-700 */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 sm:pt-2">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#2D6CDF] hover:bg-[#2560c7] text-white rounded-xl shadow-lg shadow-blue-900/40 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer group"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 'clamp(0.875rem, 1.8vw, 1rem)' }}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Xem 7 Ebook &amp; Combo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              <button
                onClick={onAuthorClick}
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/30 backdrop-blur-md transition-all cursor-pointer"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 'clamp(0.875rem, 1.8vw, 1rem)' }}
              >
                <UserCheck className="w-4 h-4 text-[#F0BC64] shrink-0" />
                <span>Về tác giả</span>
              </button>
            </div>

            {/* Trust highlights nhỏ */}
            <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-slate-300 border-t border-white/15" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span>Thanh toán tự động VietQR</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                <span>Không cần đăng ký</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F0BC64] shrink-0" />
                <span>Nhận PDF tức thì</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges với icons */}
      <div className="relative border-t border-white/10 bg-[#102744]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {trustBadges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                  <badge.icon className="w-5 h-5 text-[#F0BC64]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{badge.title}</div>
                  <div className="text-[10px] sm:text-xs text-[#9CA3AF] leading-tight truncate" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>{badge.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
