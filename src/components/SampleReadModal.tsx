import React, { useEffect } from 'react';
import { X, ExternalLink, BookOpen, ArrowRight, ShieldCheck, Download } from 'lucide-react';
import { Product } from '../types';

interface SampleReadModalProps {
  product: Product | null;
  onClose: () => void;
  onBuy: (product: Product) => void;
}

export const SampleReadModal: React.FC<SampleReadModalProps> = ({
  product,
  onClose,
  onBuy,
}) => {
  // Prevent background scroll while modal is active
  useEffect(() => {
    if (!product) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [product]);

  if (!product) return null;

  // External Drive Link
  const driveUrl = product.sampleDriveUrl || product.sample_read_url || 'https://drive.google.com';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden no-scrollbar animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh] no-scrollbar">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sky-400">
                ĐỌC THỬ TRÍCH ĐOẠN MIỄN PHÍ
              </div>
              <h3 className="text-xs sm:text-base font-bold text-white truncate max-w-[200px] sm:max-w-md">
                {product.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={driveUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
              title="Mở toàn bộ bản đọc thử trên Google Drive"
            >
              <span>Mở Google Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Google Drive Banner Prompt */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-2.5 border-b border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-700">
            <svg className="w-4 h-4 text-blue-600 shrink-0" viewBox="0 0 87.3 78" fill="currentColor">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
              <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 10.15z" fill="#ea4335"/>
              <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
              <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
              <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
            </svg>
            <span className="text-[11px] sm:text-xs">
              Tài liệu đọc thử đầy đủ đã được đồng bộ lên <strong>Google Drive</strong>.
            </span>
          </div>

          <a
            href={driveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 font-bold hover:underline text-[11px] sm:text-xs"
          >
            <span>Mở xem trên Drive (Không cần đăng nhập)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Embedded Sample Document View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50 space-y-6 no-scrollbar">
          <div className="max-w-2xl mx-auto bg-white p-5 sm:p-12 rounded-xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8 font-sans">
            {/* Document Cover Header */}
            <div className="text-center pb-6 sm:pb-8 border-b border-slate-200 space-y-2.5 sm:space-y-3">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block">
                BẢN XEM TRƯỚC · ĐỌC THỬ 15 TRANG
              </span>
              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {product.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 italic">
                &ldquo;{product.tagline}&rdquo;
              </p>
              <div className="text-[11px] sm:text-xs text-slate-400 font-medium">
                Tác giả: <strong>Hoàng Nguyễn</strong> · Bản quyền xuất bản kỹ thuật số PDF
              </div>
            </div>

            {/* Introduction Excerpt */}
            <div className="space-y-3.5 sm:space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Lời tựa: Vì sao cuốn sách này ra đời?</h3>
              <p>
                Nếu bạn từng cảm thấy một ngày trôi qua trong sự bận rộn hỗn loạn nhưng khi đêm về lại thấy trống rỗng; nếu bạn từng tự hỏi tại sao mình nỗ lực rất nhiều nhưng các mục tiêu quan trọng vẫn dậm chân tại chỗ — bạn không hề cô độc.
              </p>
              <p>
                Cuốn sách này không được viết để ru ngủ bạn bằng những lý thuyết hoa mỹ hay những câu danh ngôn truyền cảm hứng sáo rỗng. Nó là cuốn cẩm nang chiến thuật được đúc kết từ 10 năm kinh nghiệm giải quyết các bài toán thực tế.
              </p>
            </div>

            {/* Core Blueprint Excerpt */}
            <div className="p-4 sm:p-5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-blue-900">
                Chương 1: Giải phóng bộ nhớ đệm và định hình tâm thế
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Khi bộ não của bạn liên tục phải lưu giữ hàng chục đầu việc chưa hoàn thành, nó rơi vào trạng thái &ldquo;rò rỉ RAM&rdquo;. Năng lượng tư duy bị tiêu hao không phải cho công việc sâu mà chỉ đơn thuần để ghi nhớ những điều lặt vặt...
              </p>
              <div className="space-y-1.5 text-xs text-blue-800 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                  <span>Quy tắc 3 giây phân loại phản xạ</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                  <span>Kỹ thuật thiết lập ranh giới chú ý trong kỷ nguyên thông tin</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                  <span>Chiến lược quản trị năng lượng sinh học</span>
                </div>
              </div>
            </div>

            {/* Sample Read Cutoff Card */}
            <div className="p-5 sm:p-6 bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl text-center space-y-3.5 shadow-lg">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-sky-400 flex items-center justify-center mx-auto border border-blue-400/30">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  Bạn vừa hoàn thành 15 trang đọc thử!
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                  Để đọc tiếp toàn bộ <strong>{product.pages} trang</strong> chuyên sâu cùng các biểu mẫu thực hành đính kèm, hãy đặt mua bản PDF chính thức.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onBuy(product);
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Mua ngay bản đầy đủ ({product.price.toLocaleString('vi-VN')} ₫)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={driveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Mở Google Drive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 px-4 sm:px-6 py-3.5 border-t border-slate-200 bg-white shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Thanh toán SePay VietQR · Nhận file tự động trong 2–5 phút</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer text-center"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                onClose();
                onBuy(product);
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Mua trọn bộ PDF</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
