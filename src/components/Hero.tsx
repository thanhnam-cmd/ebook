import React from 'react';
import { ArrowRight, UserCheck, BookOpen, ShoppingCart, QrCode, Mail } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onAuthorClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onAuthorClick }) => {
  const processSteps = [
    { icon: ShoppingCart, step: '1', title: 'Chọn ebook', desc: 'Bấm "Mua ngay" hoặc "Mua combo" ở ấn phẩm bạn cần.' },
    { icon: QrCode, step: '2', title: 'Quét mã QR thanh toán', desc: 'Chuyển khoản qua SePay VietQR, hệ thống tự động đối soát.' },
    { icon: Mail, step: '3', title: 'Nhận ebook qua email', desc: 'File PDF gửi thẳng đến hộp thư, kèm link tải ngay trên web.' },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#102744]">
      {/* Hero Image - 100% hiển thị không cắt (object-contain), nền #102744 lấp khoảng trống */}
      <div className="relative w-full min-h-[380px] sm:min-h-[480px] lg:min-h-[600px]">
        {/* Mobile & Tablet: ảnh poster dọc */}
        <img
          src="/assets/hero-poster.png"
          alt="Sách trên bàn làm việc với view thành phố hoàng hôn"
          className="lg:hidden absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        {/* Desktop: ảnh rộng gốc */}
        <img
          src="/assets/hero-books.png"
          alt="Sách trên bàn làm việc với view thành phố hoàng hôn"
          className="hidden lg:block absolute inset-0 w-full h-full object-contain"
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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 sm:pt-2">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto min-h-[36px] sm:min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 sm:px-5 py-2 sm:py-3 bg-[#2D6CDF] hover:bg-[#2560c7] text-white rounded-lg shadow-lg shadow-blue-900/40 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer group"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 'clamp(0.75rem, 1.4vw, 0.9375rem)' }}
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>Xem Ebook &amp; Combo</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              <button
                onClick={onAuthorClick}
                className="w-full sm:w-auto min-h-[36px] sm:min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/30 backdrop-blur-md transition-all cursor-pointer"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 'clamp(0.75rem, 1.4vw, 0.9375rem)' }}
              >
                <UserCheck className="w-3.5 h-3.5 text-[#F0BC64] shrink-0" />
                <span>Về tác giả</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Process Steps - 3 bước thay thế trust badges */}
      <div className="relative border-t border-white/10 bg-[#102744]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {processSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-3 sm:gap-4">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-[#F0BC64]" />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#2D6CDF] text-white text-[11px] font-bold flex items-center justify-center border-2 border-[#102744]">
                    {step.step}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{step.title}</div>
                  <div className="text-[11px] sm:text-xs text-[#9CA3AF] leading-tight" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
