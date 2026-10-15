import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Tôi nên đọc cuốn nào trước?',
    answer:
      'Nếu bạn hay bị cảm xúc hoặc đám đông cuốn đi, bắt đầu với Mật Mã Tỉnh Thức. Nếu bạn đang mệt vì các mối quan hệ, chọn Mật Mã Kết Nối. Nếu vấn đề lớn nhất là tiền, chọn Mật Mã Tài Chính. Nếu muốn đọc theo lộ trình, thứ tự gợi ý là Tỉnh Thức – Kết Nối – Tài Chính.',
  },
  {
    question: 'Đây có phải sách tâm lý trị liệu hay tư vấn tài chính không?',
    answer:
      'Không. Sách giúp định hình tư duy và cung cấp khung tham khảo, không thay thế tư vấn của chuyên gia tâm lý, luật sư, kế toán hay cố vấn tài chính có chứng chỉ. Nếu bạn đang đau buồn kéo dài, bị bạo hành hoặc gặp khó khăn tài chính nghiêm trọng, hãy tìm đến chuyên gia trước.',
  },
  {
    question: 'Sách có hứa giúp tôi giàu hoặc thay đổi cuộc đời không?',
    answer:
      'Không. Các cuốn sách không hứa kết quả nhanh. Chúng đưa ra cách nhìn và bài tập để bạn tự áp dụng. Kết quả phụ thuộc vào việc bạn thực hành.',
  },
  {
    question: 'Tôi có đọc thử được không?',
    answer:
      'Có. Mỗi cuốn có bản đọc thử. Bạn nên đọc thử trước khi mua.',
  },
  {
    question: 'Tôi thanh toán bằng cách nào?',
    answer:
      'Chuyển khoản ngân hàng bằng cách quét mã QR. Vui lòng giữ nguyên nội dung chuyển khoản để hệ thống tự đối soát tự động. Sau khi thanh toán thành công, bạn nhận file qua email.',
  },
  {
    question: 'Thông tin của tôi có an toàn không?',
    answer:
      'Thông tin bạn nhập chỉ được dùng để giao tài liệu và hỗ trợ đơn hàng. Chi tiết xem thêm mục Chính sách bảo mật.',
  },
  {
    question: 'Bao lâu tôi nhận được ebook?',
    answer:
      'Thông thường 2–5 phút sau khi thanh toán thành công. File được gửi tới email bạn đã nhập khi đặt hàng.',
  },
  {
    question: 'Tôi chưa nhận được file thì làm sao?',
    answer:
      'Hãy kiểm tra mục Spam/Quảng cáo trong hộp thư và xem lại email bạn đã nhập có đúng không. Nếu sau 1 giờ vẫn chưa có file, hãy liên hệ qua Zalo – gửi kèm email đặt hàng và ảnh thanh toán để được hỗ trợ.',
  },
  {
    question: 'Ebook ở định dạng nào, đọc trên thiết bị gì?',
    answer:
      'PDF. Bạn đọc được trên điện thoại, máy tính bảng và máy tính, không cần cài phần mềm đặc biệt.',
  },
  {
    question: 'Tôi được dùng ebook như thế nào?',
    answer:
      'Bạn được đọc và sử dụng cho mục đích cá nhân. Vui lòng không sao chép để bán lại, đăng công khai hoặc chia sẻ cho người không mua.',
  },
  {
    question: 'Sách có được cập nhật không?',
    answer:
      'Khi có bản cập nhật, người mua cũ được nhận miễn phí qua email.',
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
