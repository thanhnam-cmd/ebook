import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Tôi nhận ebook bằng cách nào?',
    answer:
      'Sau khi chuyển khoản thành công và được cổng SePay xác nhận tự động, hệ thống sẽ kích hoạt gửi email chứa file PDF và link tải trực tiếp đến địa chỉ email bạn đã cung cấp. Đồng thời, ngay trên màn hình thanh toán của bạn cũng xuất hiện nút "Tải ngay file PDF" để bạn có thể mở đọc tức thì.',
  },
  {
    question: 'Bao lâu thì tôi nhận được email?',
    answer:
      'Thông thường trong vòng từ 1 đến 3 phút sau khi giao dịch chuyển khoản thành công. Nếu quá 5 phút vẫn chưa thấy trong Hộp thư đến (Inbox), bạn vui lòng kiểm tra thêm mục Thư rác (Spam) hoặc mục Quảng cáo (Promotions), hoặc nhập mã đơn hàng tại mục Tra cứu Hỗ trợ bên dưới.',
  },
  {
    question: 'Tôi thanh toán bằng hình thức nào?',
    answer:
      'Bạn chuyển khoản ngân hàng bằng cách mở ứng dụng ngân hàng bất kỳ (Vietcombank, MBBank, Techcombank, TPBank, Momo...) và quét mã VietQR hiển thị trên màn hình. Hệ thống SePay sẽ tự động điền đúng Số tài khoản, Số tiền và Cú pháp nội dung chuyển khoản bắt buộc.',
  },
  {
    question: 'Ebook ở định dạng nào, đọc trên thiết bị nào?',
    answer:
      'Ebook được đóng gói ở định dạng chuẩn PDF chất lượng cao, có thể đọc mượt mà trên mọi thiết bị: iPhone, điện thoại Android, iPad, Tablet, máy tính xách tay (Laptop/MacBook) và các loại máy đọc sách hỗ trợ PDF.',
  },
  {
    question: 'Tôi có được hoàn tiền không?',
    answer:
      'Chúng tôi cam kết hoàn tiền 100% hoặc hỗ trợ đổi bản cập nhật miễn phí nếu file tài liệu bị lỗi kỹ thuật không thể mở hoặc không đầy đủ nội dung như cam kết mục lục.',
  },
  {
    question: 'Tôi nhập sai email thì làm sao?',
    answer:
      'Bạn chỉ cần liên hệ hỗ trợ kèm theo Mã đơn hàng (hoặc ảnh chụp giao dịch ngân hàng thành công). Đội ngũ quản trị viên sẽ kiểm tra trên hệ thống SePay và cập nhật lại email chính xác, sau đó kích hoạt gửi lại tài liệu cho bạn ngay lập tức.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="py-16 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>GIẢI ĐÁP THẮC MẮC</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Câu hỏi thường gặp
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto">
            Tổng hợp những câu hỏi phổ biến nhất về cách thức nhận sách, thanh toán VietQR và hỗ trợ độc giả.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full px-5 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {faq.question}
                  </span>
                  <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
