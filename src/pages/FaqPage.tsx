import React, { useState } from 'react';
import { AppRoute } from '../components/Navbar';
import {
  ArrowLeft,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  MessageCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';

interface FaqPageProps {
  onNavigate: (route: AppRoute) => void;
}

interface FaqItem {
  id: string;
  category: 'payment' | 'delivery' | 'device' | 'policy';
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'payment',
    question: 'Hệ thống SePay tự động hoạt động như thế nào?',
    answer:
      'Khi bạn nhấn "Mua ngay", hệ thống sẽ tạo một mã đơn hàng duy nhất (ví dụ MM1024) kèm mã VietQR chứa sẵn số tài khoản MBBank, tên người nhận và số tiền chính xác. Bạn chỉ cần mở app ngân hàng bất kỳ để quét mã và chuyển tiền. Cổng SePay tự động đọc biến động số dư và kích hoạt gửi file ebook qua email trong 2-5 phút mà không cần nhân viên duyệt thủ công.',
  },
  {
    id: 'faq-2',
    category: 'payment',
    question: 'Nếu tôi chuyển khoản sai nội dung hoặc thiếu tiền thì sao?',
    answer:
      'Đừng lo lắng! Toàn bộ giao dịch đều được ghi lại trong cơ sở dữ liệu. Nếu bạn chuyển thiếu tiền hoặc quên ghi mã đơn hàng, hệ thống sẽ lưu vào mục "Cần đối soát". Bạn chỉ cần vào trang Hỗ trợ, nhập mã giao dịch hoặc chụp ảnh biên lai gửi về cho chúng tôi. Đội ngũ kỹ thuật sẽ xác nhận và gửi sách cho bạn ngay trong 15-30 phút.',
  },
  {
    id: 'faq-3',
    category: 'delivery',
    question: 'Tôi sẽ nhận được Ebook qua phương thức nào?',
    answer:
      'Ngay sau khi thanh toán thành công, hệ thống sẽ gửi một email tự động tới địa chỉ email bạn đã cung cấp khi mua. Email có chứa đường link tải trực tiếp định dạng PDF bản quyền chất lượng cao, đồng thời lưu trữ liên kết trọn đời để bạn có thể tải lại bất cứ khi nào đổi thiết bị.',
  },
  {
    id: 'faq-4',
    category: 'device',
    question: 'Tôi có thể đọc Ebook trên điện thoại, iPad hoặc máy đọc sách Kindle không?',
    answer:
      'Có! Tài liệu được thiết kế tối ưu hóa định dạng chuẩn PDF, có thể mở mượt mà trên iPhone, iPad, Android, máy tính Mac/Windows và các dòng máy đọc sách Kindle/Kobo/Boox. Bạn cũng có thể in ra giấy để ghi chú cá nhân.',
  },
  {
    id: 'faq-5',
    category: 'policy',
    question: 'Chính sách hoàn tiền của Ebook Store như thế nào?',
    answer:
      'Chúng tôi cam kết hoàn tiền 100% trong vòng 7 ngày nếu tài liệu bị lỗi kỹ thuật không thể mở hoặc nội dung hoàn toàn không trùng khớp với mục lục đã công bố. Bạn chỉ cần gửi email tới hotro@ebookstore.vn kèm mã đơn hàng.',
  },
  {
    id: 'faq-6',
    category: 'policy',
    question: 'Tôi có được cập nhật khi sách có phiên bản mới không?',
    answer:
      'Tất cả độc giả mua sách lẻ hoặc gói Combo đều được hưởng đặc quyền nhận bản cập nhật tái bản bổ sung hoàn toàn miễn phí trọn đời qua email đã đăng ký.',
  },
];

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'payment' | 'delivery' | 'device' | 'policy'>('all');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-3']);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFaq = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQS.filter((faq) => {
    if (activeCategory !== 'all' && faq.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
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
        <span className="text-slate-900 font-bold">Câu hỏi thường gặp</span>
      </div>

      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase border border-blue-200">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>TRUNG TÂM TRỢ GIÚP &amp; GIẢI ĐÁP</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight cinematic-text">
          Những Câu Hỏi Thường Gặp
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Mọi thông tin về cổng thanh toán tự động VietQR SePay, phương thức giao nhận ebook và chính sách bảo hành trọn đời.
        </p>

        {/* Search */}
        <div className="relative max-w-md mx-auto pt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm câu hỏi (SePay, nhận sách, Kindle...)"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Tất cả câu hỏi
        </button>
        <button
          onClick={() => setActiveCategory('payment')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'payment'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Thanh toán SePay VietQR
        </button>
        <button
          onClick={() => setActiveCategory('delivery')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'delivery'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Nhận Ebook qua Email
        </button>
        <button
          onClick={() => setActiveCategory('device')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'device'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Thiết bị đọc (Kindle, iPad)
        </button>
        <button
          onClick={() => setActiveCategory('policy')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'policy'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Chính sách &amp; Hoàn tiền
        </button>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openIds.includes(faq.id);
          return (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all reveal-on-scroll"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                  {faq.question}
                </span>
                <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/50">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help box */}
      <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-6 text-center space-y-3">
        <MessageCircle className="w-8 h-8 text-blue-600 mx-auto" />
        <h3 className="text-base font-bold text-blue-950">Chưa tìm thấy giải đáp cho vấn đề của bạn?</h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Đội ngũ hỗ trợ của chúng tôi sẵn sàng phản hồi trong vòng 15-30 phút để giúp bạn giải quyết thắc mắc hoặc kiểm tra đơn hàng.
        </p>
        <button
          onClick={() => onNavigate('support')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm shadow-blue-500/25 inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>Gửi yêu cầu hỗ trợ ngay</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
