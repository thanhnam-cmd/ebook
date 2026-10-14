import React, { useState } from 'react';
import { Mail, MessageCircle, Clock, Send, CheckCircle2, Search, Download } from 'lucide-react';

export const SupportSection: React.FC = () => {
  // Support Inquiry State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Quick Order Lookup State
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting('sending');
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
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting('');
    }
  };

  const handleLookupOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    setIsSearching(true);
    setSearchError('');
    setSearchResult(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(searchCode.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResult(data);
      } else {
        setSearchError('Không tìm thấy đơn hàng với mã này. Vui lòng kiểm tra lại mã đã nhập.');
      }
    } catch (err) {
      setSearchError('Lỗi kết nối khi tra cứu đơn hàng.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section id="support-section" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact details & Quick Order Lookup */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                KÊNH TRỢ GIÚP 24/7
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Hỗ trợ &amp; giải đáp thắc mắc
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Chưa nhận được email, cần xuất hóa đơn hoặc muốn hỏi thêm về nội dung ebook? Gửi tin nhắn, đội ngũ hỗ trợ sẽ phản hồi trong vòng <strong>15–30 phút</strong>.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Email hỗ trợ:</div>
                  <div className="text-blue-600 font-mono">hotro@ebookstore.vn</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Zalo / Messenger:</div>
                  <div className="text-emerald-700 font-mono">0987.654.321 (Hoàng Nguyễn)</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Giờ hỗ trợ:</div>
                  <div className="text-slate-600">08:00 – 22:00 hàng ngày (kể cả Lễ, Tết)</div>
                </div>
              </div>
            </div>

            {/* Quick Order Lookup Form */}
            <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-blue-700" />
                <span>Tra cứu lại đơn hàng &amp; link tải Ebook</span>
              </h4>
              <p className="text-xs text-blue-800/80 mb-3">
                Nhập mã đơn hàng của bạn (ví dụ: <span className="font-mono font-bold">MM1001</span>) để kiểm tra trạng thái và lấy link tải trực tiếp.
              </p>
              <form onSubmit={handleLookupOrder} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập mã đơn (VD: MM1024)"
                  value={searchCode}
                  onChange={e => setSearchCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs font-mono uppercase bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  {isSearching ? 'Đang tìm...' : 'Tra cứu'}
                </button>
              </form>

              {searchError && (
                <div className="mt-2 text-xs text-rose-600 font-medium">
                  {searchError}
                </div>
              )}

              {searchResult && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Mã: {searchResult.order.orderCode}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        searchResult.order.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : searchResult.order.status === 'need_check'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {searchResult.order.status === 'paid'
                        ? 'Đã thanh toán'
                        : searchResult.order.status === 'need_check'
                        ? 'Cần đối soát'
                        : 'Chờ thanh toán'}
                    </span>
                  </div>
                  <div className="text-slate-600">
                    Khách: {searchResult.order.customerName} ({searchResult.order.customerEmail})
                  </div>
                  <div className="text-slate-600">Sách: {searchResult.order.productTitle}</div>

                  {searchResult.order.status === 'paid' && (
                    <div className="pt-2">
                      <a
                        href={`/api/download/${searchResult.order.downloadToken}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Mở / Tải Ebook PDF Ngay</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Inquiry Form (Directly from Wireframe page 3) */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Gửi câu hỏi trực tiếp cho tác giả &amp; ban quản trị
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Vui lòng điền thông tin chính xác để chúng tôi gửi câu trả lời qua email hoặc tin nhắn.
              </p>

              {submitSuccess ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-900">
                    Gửi yêu cầu thành công!
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800">
                    Cảm ơn bạn. Chúng tôi đã nhận được thông điệp và sẽ phản hồi đến bạn trong thời gian sớm nhất.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-3 px-4 py-2 text-xs font-bold text-emerald-700 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    Gửi câu hỏi khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Họ tên <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="email@cuaban.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nội dung thắc mắc <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Bạn cần hỗ trợ điều gì? (Ví dụ: Chưa nhận được email sau khi quét QR đơn MM1024...)"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={Boolean(isSubmitting)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-sm shadow-blue-500/20 hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Đang gửi tin nhắn...' : 'Gửi câu hỏi'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
