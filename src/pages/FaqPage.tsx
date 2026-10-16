import React, { useState } from 'react';
import { AppRoute } from '../components/Navbar';
import {
  ArrowLeft,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  MessageCircle,
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
    category: 'delivery',
    question: 'Tôi nên đọc cuốn nào trước?',
    answer:
      'Nếu bạn hay bị cảm xúc hoặc đám đông cuốn đi, bắt đầu với Mật Mã Tỉnh Thức. Nếu bạn đang mệt vì các mối quan hệ, chọn Mật Mã Kết Nối. Nếu vấn đề lớn nhất là tiền, chọn Mật Mã Tài Chính. Nếu muốn đọc theo lộ trình, thứ tự gợi ý là Tỉnh Thức – Kết Nối – Tài Chính.',
  },
  {
    id: 'faq-2',
    category: 'policy',
    question: 'Đây có phải sách tâm lý trị liệu hay tư vấn tài chính không?',
    answer:
      'Không. Sách giúp định hình tư duy và cung cấp khung tham khảo, không thay thế tư vấn của chuyên gia tâm lý, luật sư, kế toán hay cố vấn tài chính có chứng chỉ. Nếu bạn đang đau buồn kéo dài, bị bạo hành hoặc gặp khó khăn tài chính nghiêm trọng, hãy tìm đến chuyên gia trước.',
  },
  {
    id: 'faq-3',
    category: 'policy',
    question: 'Sách có hứa giúp tôi giàu hoặc thay đổi cuộc đời không?',
    answer:
      'Không. Các cuốn sách không hứa kết quả nhanh. Chúng đưa ra cách nhìn và bài tập để bạn tự áp dụng. Kết quả phụ thuộc vào việc bạn thực hành.',
  },
  {
    id: 'faq-4',
    category: 'delivery',
    question: 'Tôi có đọc thử được không?',
    answer:
      'Có. Mỗi cuốn có bản đọc thử. Bạn nên đọc thử trước khi mua.',
  },
  {
    id: 'faq-5',
    category: 'payment',
    question: 'Tôi thanh toán bằng cách nào?',
    answer:
      'Chuyển khoản ngân hàng bằng cách quét mã QR. Vui lòng giữ nguyên nội dung chuyển khoản để hệ thống tự đối soát tự động. Sau khi thanh toán thành công, bạn nhận file qua email.',
  },
  {
    id: 'faq-6',
    category: 'policy',
    question: 'Thông tin của tôi có an toàn không?',
    answer:
      'Thông tin bạn nhập chỉ được dùng để giao tài liệu và hỗ trợ đơn hàng. Chi tiết xem thêm mục Chính sách bảo mật.',
  },
  {
    id: 'faq-7',
    category: 'delivery',
    question: 'Bao lâu tôi nhận được ebook?',
    answer:
      'Thông thường 2–5 phút sau khi thanh toán thành công. File được gửi tới email bạn đã nhập khi đặt hàng.',
  },
  {
    id: 'faq-8',
    category: 'delivery',
    question: 'Tôi chưa nhận được file thì làm sao?',
    answer:
      'Hãy kiểm tra mục Spam/Quảng cáo trong hộp thư và xem lại email bạn đã nhập có đúng không. Nếu sau 1 giờ vẫn chưa có file, hãy liên hệ qua Zalo – gửi kèm email đặt hàng và ảnh thanh toán để được hỗ trợ.',
  },
  {
    id: 'faq-9',
    category: 'device',
    question: 'Ebook ở định dạng nào, đọc trên thiết bị gì?',
    answer:
      'PDF. Bạn đọc được trên điện thoại, máy tính bảng và máy tính, không cần cài phần mềm đặc biệt.',
  },
  {
    id: 'faq-10',
    category: 'policy',
    question: 'Tôi được dùng ebook như thế nào?',
    answer:
      'Bạn được đọc và sử dụng cho mục đích cá nhân. Vui lòng không sao chép để bán lại, đăng công khai hoặc chia sẻ cho người không mua.',
  },
  {
    id: 'faq-11',
    category: 'policy',
    question: 'Sách có được cập nhật không?',
    answer:
      'Khi có bản cập nhật, người mua cũ được nhận miễn phí qua email.',
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
          Hãy gửi email về <span className="font-semibold text-slate-800">hotro@ebookstore.vn</span> kèm mã đơn hàng và ảnh thanh toán nếu bạn cần chúng tôi kiểm tra thủ công.
        </p>
        <button
          onClick={() => onNavigate('contact')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm shadow-blue-500/25 inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>Đi tới trang Liên hệ</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
