import React, { useState } from 'react';
import { AppRoute } from '../components/Navbar';
import { Order, Product } from '../types';
import {
  ArrowLeft,
  MessageSquareText,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Mail,
  Send,
  Phone,
  RefreshCw,
} from 'lucide-react';

interface SupportPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ onNavigate }) => {
  const [lookupCode, setLookupCode] = useState('');
  const [isSearchingOrder, setIsSearchingOrder] = useState(false);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);
  const [lookupError, setLookupError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleLookup = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const code = lookupCode.trim().toUpperCase();
    if (!code) {
      setLookupError('Vui lòng nhập mã đơn hàng (ví dụ: MM1024).');
      return;
    }

    setIsSearchingOrder(true);
    setLookupError('');
    setFoundOrder(null);
    setFoundProduct(null);

    try {
      const res = await fetch(`/api/sepay/check-order/${encodeURIComponent(code)}`);
      if (res.ok) {
        const data = await res.json();
        setFoundOrder(data.order);
        setFoundProduct(data.product);
      } else {
        const fallbackRes = await fetch(`/api/orders/${encodeURIComponent(code)}`);
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          setFoundOrder(data.order);
          setFoundProduct(data.product);
        } else {
          setLookupError('Không tìm thấy đơn hàng với mã này. Vui lòng kiểm tra lại mã trên màn hình chuyển tiền hoặc trong email.');
        }
      }
    } catch (err) {
      setLookupError('Lỗi kết nối máy chủ. Vui lòng thử lại sau.');
    } finally {
      setIsSearchingOrder(false);
    }
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setSubmitError('Vui lòng điền đầy đủ Họ tên, Email và Nội dung cần hỗ trợ.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        const data = await res.json();
        setSubmitError(data.error || 'Gửi thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      setSubmitError('Lỗi kết nối máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button
          onClick={() => onNavigate('home')}
          className="hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Trang chủ</span>
        </button>
        <span>/</span>
        <span className="text-slate-900 font-bold">Liên hệ</span>
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase border border-blue-200">
          <MessageSquareText className="w-3.5 h-3.5" />
          <span>LIÊN HỆ & TRA CỨU ĐƠN HÀNG</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight cinematic-text">
          Liên Hệ Hỗ Trợ & Tra Cứu Đơn Hàng
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
          Kiểm tra trạng thái thanh toán VietQR SePay theo thời gian thực hoặc gửi yêu cầu liên hệ để được hỗ trợ về tải file, email nhận sách và các vấn đề kỹ thuật.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6 reveal-on-scroll">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              <span>Tra cứu đơn hàng tức thì</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Nhập mã đơn hàng bạn đã nhận khi quét mã thanh toán (ví dụ: MM1024, MM1026).
            </p>
          </div>

          <form onSubmit={handleLookup} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={lookupCode}
                onChange={(e) => setLookupCode(e.target.value)}
                placeholder="Nhập mã đơn hàng (VD: MM1024)"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
            <button
              type="submit"
              disabled={isSearchingOrder}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-500/25 flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
            >
              {isSearchingOrder ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>Kiểm tra</span>
            </button>
          </form>

          {lookupError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{lookupError}</span>
            </div>
          )}

          {foundOrder && (
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="text-xs text-slate-500">Mã đơn hàng:</div>
                  <div className="text-base font-extrabold text-slate-900 font-mono">
                    {foundOrder.orderCode}
                  </div>
                </div>
                <div>
                  {foundOrder.status === 'paid' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã thanh toán thành công</span>
                    </span>
                  )}
                  {foundOrder.status === 'pending' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Đang chờ chuyển khoản</span>
                    </span>
                  )}
                  {foundOrder.status === 'need_check' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Cần đối soát</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-500">Khách hàng:</span>
                  <div className="font-bold text-slate-900">{foundOrder.customerName}</div>
                </div>
                <div>
                  <span className="text-slate-500">Email:</span>
                  <div className="font-bold text-slate-900">{foundOrder.customerEmail}</div>
                </div>
                <div>
                  <span className="text-slate-500">Sản phẩm:</span>
                  <div className="font-bold text-slate-900">{foundOrder.productTitle}</div>
                  {foundProduct?.tagline && (
                    <div className="text-[11px] text-slate-500 mt-1">{foundProduct.tagline}</div>
                  )}
                </div>
                <div>
                  <span className="text-slate-500">Số tiền:</span>
                  <div className="font-bold text-blue-600 font-mono">
                    {foundOrder.amount.toLocaleString('vi-VN')} ₫
                  </div>
                </div>
              </div>

              {foundOrder.status === 'paid' ? (
                <div className="pt-3 border-t border-slate-200">
                  <a
                    href={`/api/download/${foundOrder.downloadToken}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 text-sm transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải & Đọc Ebook PDF Ngay Bây Giờ</span>
                  </a>
                  <p className="text-[11px] text-slate-500 text-center mt-2">
                    Link tải đã được gửi tới email {foundOrder.customerEmail}
                  </p>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-2">
                  <p>
                    Đơn hàng đang chờ thanh toán hoặc đang được cổng SePay ghi nhận. Nếu bạn đã chuyển khoản, hãy bấm nút dưới để hệ thống đối soát trực tiếp với SePay API.
                  </p>
                  <button
                    onClick={() => handleLookup()}
                    className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Đối soát lại với SePay ngay</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5 reveal-on-scroll">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <span>Gửi liên hệ cho chúng tôi</span>
              </h2>
              <p className="text-xs text-slate-500">
                Phản hồi nhanh trong vòng 15-30 phút qua email hoặc điện thoại.
              </p>
            </div>

            {submitSuccess ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm">Đã gửi liên hệ thành công!</h4>
                <p className="text-xs text-emerald-700">
                  Chúng tôi đã tiếp nhận thông tin và sẽ liên hệ hỗ trợ bạn sớm nhất.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 cursor-pointer"
                >
                  Gửi yêu cầu khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-3">
                {submitError && (
                  <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs">
                    {submitError}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email nhận phản hồi *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung thắc mắc hoặc sự cố *</label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Mô tả sự cố hoặc câu hỏi của bạn (kèm mã đơn nếu có)..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Gửi liên hệ</span>
                </button>
              </form>
            )}
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Kênh liên hệ trực tiếp</h3>
            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>hotro@ebookstore.vn</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>0987 654 321 (Hotline 8:00 - 22:00)</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Xử lý đơn hàng SePay tự động 24/7/365</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
