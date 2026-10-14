import React from 'react';
import { ShoppingCart, QrCode, Mail, ChevronRight } from 'lucide-react';

export const ProcessSteps: React.FC = () => {
  return (
    <section className="bg-white py-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center">
          {/* Step 1 */}
          <div className="flex items-center gap-4 group">
            <div className="w-13 h-13 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
              <ShoppingCart className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h4 className="text-sm font-bold text-slate-900">Chọn ebook</h4>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Bấm &ldquo;Mua ngay&rdquo; hoặc &ldquo;Mua combo&rdquo; ở ấn phẩm bạn cần.
              </p>
            </div>
            <ChevronRight className="hidden md:block w-5 h-5 text-slate-300 shrink-0" />
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-4 group">
            <div className="w-13 h-13 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
              <QrCode className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h4 className="text-sm font-bold text-slate-900">Quét mã QR thanh toán</h4>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Chuyển khoản qua SePay VietQR, hệ thống tự động đối soát trong 30s.
              </p>
            </div>
            <ChevronRight className="hidden md:block w-5 h-5 text-slate-300 shrink-0" />
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-4 group">
            <div className="w-13 h-13 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
              <Mail className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h4 className="text-sm font-bold text-slate-900">Nhận ebook qua email</h4>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                File PDF gửi thẳng đến hộp thư email, kèm link tải trực tiếp ngay trên web.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
