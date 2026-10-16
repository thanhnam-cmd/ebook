import React, { useState } from 'react';
import { AppRoute } from '../components/Navbar';
import {
  ArrowLeft,
  MessageSquareText,
  Mail,
  Send,
  Phone,
  Clock,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface SupportPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

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
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || 'Gửi thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      setSubmitError('Lỗi kết nối máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
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
          <span>LIÊN HỆ</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight cinematic-text">
          Liên Hệ Hỗ Trợ
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Bạn có thắc mắc về sản phẩm, đơn hàng hay cần hỗ trợ tải tài liệu? Hãy gửi thông tin cho chúng tôi,
          đội ngũ sẽ phản hồi qua email trong thời gian sớm nhất.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6 reveal-on-scroll">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <span>Gửi liên hệ cho chúng tôi</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Điền thông tin và mô tả thắc mắc của bạn, chúng tôi sẽ phản hồi qua email.
            </p>
          </div>

          {submitSuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2 text-center">
              <CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm sm:text-base">Đã gửi liên hệ thành công!</h4>
              <p className="text-xs sm:text-sm text-emerald-700">
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
            <form onSubmit={handleSubmitInquiry} className="space-y-4">
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
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-600"
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
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung thắc mắc hoặc sự cố *</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mô tả sự cố hoặc câu hỏi của bạn (kèm mã đơn nếu có)..."
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-600"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Kênh liên hệ trực tiếp</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="break-all">bookdangtri@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>0948889944</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Xử lý đơn hàng SePay tự động 24/7/365</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Bạn cần tư vấn nhanh?</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Xem trước danh mục sách &amp; combo để chọn đúng tài liệu phù hợp với bạn.
            </p>
            <button
              onClick={() => onNavigate('products')}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Xem Sách &amp; Ebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
