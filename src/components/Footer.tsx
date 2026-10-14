import React, { useState } from 'react';
import { X, Shield } from 'lucide-react';
import { AppRoute } from './Navbar';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [activePolicy, setActivePolicy] = useState<string | null>(null);

  const policies: Record<string, { title: string; content: string }> = {
    privacy: {
      title: 'Chính sách bảo mật',
      content:
        'Chúng tôi cam kết bảo vệ tuyệt đối thông tin cá nhân của bạn. Địa chỉ email và họ tên được thu thập chỉ nhằm mục đích duy nhất là phân phối tài liệu ebook và hỗ trợ đơn hàng. Chúng tôi không bao giờ chia sẻ, trao đổi hoặc bán thông tin khách hàng cho bất kỳ bên thứ ba nào.',
    },
    terms: {
      title: 'Điều khoản sử dụng',
      content:
        'Toàn bộ ebook thuộc bản quyền chính thức của tác giả Hoàng Nguyễn. Quý độc giả có quyền lưu trữ, in ấn để học tập và ứng dụng cá nhân. Nghiêm cấm mọi hành vi sao chép hàng loạt, chia sẻ thương mại công khai hoặc phân phối lại khi chưa có sự đồng ý bằng văn bản của tác giả.',
    },
    refund: {
      title: 'Chính sách hoàn tiền',
      content:
        'Chúng tôi áp dụng chính sách hỗ trợ hoàn tiền 100% trong vòng 7 ngày kể từ khi mua nếu tệp PDF bị lỗi kỹ thuật không thể mở hoặc nội dung hoàn toàn không trùng khớp với mục lục đã công bố. Vui lòng liên hệ ban quản trị qua email hotro@ebookstore.vn kèm mã đơn hàng.',
    },
  };

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden shrink-0">
              <img
                src="/assets/logo.png"
                alt="ĐĂNG TRÍ"
                className="w-full h-full object-contain"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                  const parent = img.parentElement;
                  if (parent) {
                    parent.classList.remove('bg-white');
                    parent.classList.add('bg-blue-600');
                  }
                }}
              />
            </div>
            <div>
              <div className="text-white font-extrabold text-sm tracking-tight">ĐĂNG TRÍ</div>
              <div className="text-[11px] text-slate-500">
                © 2026 · Ebook được gửi qua email sau khi thanh toán VietQR
              </div>
            </div>
          </button>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-300 font-medium">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Trang chủ
            </button>
            <button
              onClick={() => onNavigate('products')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Sách &amp; Ebook
            </button>
            <button
              onClick={() => onNavigate('author')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Tác giả
            </button>
            <button
              onClick={() => onNavigate('blog')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Blog
            </button>
            <button
              onClick={() => onNavigate('faq')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Câu hỏi thường gặp
            </button>
            <button
              onClick={() => onNavigate('support')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Hỗ trợ
            </button>
            <button
              onClick={() => setActivePolicy('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Bảo mật
            </button>
            <button
              onClick={() => setActivePolicy('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Điều khoản
            </button>
            <button
              onClick={() => setActivePolicy('refund')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Hoàn tiền
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            Hệ thống tích hợp cổng thanh toán SePay tự động · Tự động đối soát biến động số dư 24/7 · Chuyển phát tài liệu tức thì
          </div>
          {/* Subtle discreet admin access link without visible button banner */}
          <div className="flex items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
            <Shield className="w-3 h-3" />
            <button
              onClick={() => onNavigate('admin')}
              className="hover:underline cursor-pointer text-slate-400"
              title="Cổng quản trị dành riêng cho quản trị viên"
            >
              Hệ thống quản trị
            </button>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {activePolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white text-slate-800 max-w-lg w-full rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {policies[activePolicy].title}
              </h3>
              <button
                onClick={() => setActivePolicy(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {policies[activePolicy].content}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActivePolicy(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
