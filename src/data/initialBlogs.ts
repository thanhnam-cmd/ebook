import { BlogPost } from '../types';

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog_01',
    slug: '5-thoi-quen-buoi-sang-tinh-thuc',
    title: '5 Thói quen buổi sáng kích hoạt trạng thái tỉnh thức & giải phóng lo âu',
    excerpt: 'Cách bạn bắt đầu 60 phút đầu ngày quyết định 90% hiệu suất và sự bình an nội tại. Khám phá 5 nghi thức nhỏ giúp thanh lọc tâm trí trước khi bước vào guồng quay công việc.',
    author: 'Đăng Trí',
    readTime: '4 phút đọc',
    publishedAt: '2026-10-10',
    status: 'published',
    tags: ['Tỉnh Thức', 'Phát Triển Bản Thân', 'Năng Suất'],
    linkedProductId: 'mat-ma-tinh-thuc',
    coverGradient: 'from-sky-600 via-blue-700 to-indigo-900',
    thumbnail_url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80',
    image_config: {
      aspectRatio: '16/9',
      objectFit: 'cover',
      objectPosition: 'center',
      borderRadius: 'xl',
      filterPreset: 'warm',
      hoverEffect: 'zoom',
      overlayOpacity: 35,
      showBorder: true,
    },
    content: `
Trong kỷ nguyên của thông báo mạng xã hội và nhịp sống gấp gáp, hầu hết chúng ta bắt đầu ngày mới bằng việc với tay lấy điện thoại, nạp vào đầu hàng trăm tin tức giật gân và email tồn đọng. Điều này vô tình kích hoạt hệ thần kinh giao cảm (Sympathetic Nervous System), đẩy cơ thể vào trạng thái "chiến đấu hoặc bỏ chạy" ngay khi vừa thức giấc.

Dưới đây là 5 thói quen đã được đúc kết giúp bạn tái thiết lập năng lượng và neo giữ bình an:

### 1. Quy tắc "Không màn hình" trong 30 phút đầu tiên
Hãy để não bộ chuyển đổi từ từ từ sóng não Theta sang Alpha. Dành 30 phút này cho việc uống một ly nước ấm, hít thở sâu và cảm nhận sự hiện diện của cơ thể trong không gian yên tĩnh.

### 2. Ba phút quan sát hơi thở tỉnh thức
Ngồi thẳng lưng, nhắm mắt và chỉ đơn giản đếm hơi thở vào - ra. Đừng cố gắng kiểm soát nhịp thở, chỉ quan sát luồng không khí đi qua cánh mũi. Sự tĩnh lặng này là liều thuốc giải độc cho tâm trí hay bị phân tán.

### 3. Viết ra 3 điều biết ơn cụ thể
Thay vì viết những điều vĩ mô, hãy biết ơn những chi tiết nhỏ: ly cà phê thơm, cơn gió mát ban sớm, hay một giấc ngủ trọn vẹn. Lòng biết ơn chuyển hóa não bộ từ trạng thái thiếu thốn (Scarcity) sang đủ đầy (Abundance).

### 4. Vận động nhẹ nhàng kích hoạt tuần hoàn
5 đến 10 phút kéo giãn cơ bắp hoặc vài động tác yoga chào mặt trời giúp đưa oxy lên não, giải phóng cortisol dư thừa tích tụ qua đêm.

### 5. Xác định một "Ưu tiên tối thượng" trong ngày (The ONE Thing)
Đừng lập danh sách 20 việc cần làm. Hãy tự hỏi: "Nếu hôm nay chỉ hoàn thành đúng 1 việc để cảm thấy ngày trọn vẹn, đó là việc gì?". Hãy giải quyết nó vào khung giờ năng lượng cao nhất.
    `.trim(),
  },
  {
    id: 'blog_02',
    slug: 'nghe-thuat-lang-nghe-chu-dong',
    title: 'Nghệ thuật lắng nghe chủ động: Bí quyết tạo thiện cảm và thấu cảm sâu sắc',
    excerpt: 'Lắng nghe không chỉ là im lặng để chờ đến lượt mình nói. Lắng nghe thực sự là nghệ thuật bước vào thế giới quan của người khác mà không phán xét.',
    author: 'Đăng Trí',
    readTime: '5 phút đọc',
    publishedAt: '2026-10-08',
    status: 'published',
    tags: ['Giao Tiếp', 'Mối Quan Hệ', 'Đàm Phán'],
    linkedProductId: 'mat-ma-ket-noi',
    coverGradient: 'from-blue-700 via-indigo-800 to-slate-900',
    thumbnail_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80',
    image_config: {
      aspectRatio: '16/9',
      objectFit: 'cover',
      objectPosition: 'center',
      borderRadius: 'xl',
      filterPreset: 'cinematic',
      hoverEffect: 'zoom',
      overlayOpacity: 35,
      showBorder: true,
    },
    content: `
Nhà tâm lý học Carl Rogers từng nói: "Khi ai đó thực sự lắng nghe bạn mà không phán xét hay cố gắng uốn nắn bạn, cảm giác đó giống như được chữa lành."

Trong giao tiếp hàng ngày, chúng ta thường mắc bẫy "lắng nghe để phản hồi" thay vì "lắng nghe để thấu hiểu". Để trở thành một người giao tiếp tinh tế, bạn cần làm chủ 3 tầng bậc lắng nghe sau:

### Tầng 1: Lắng nghe nội tâm (Internal Listening)
Ở tầng này, sự chú ý vẫn hướng về chính bạn: "Họ nói điều này thì mình phải đáp lại thế nào?", "Ý kiến của mình có hay hơn không?". Đây là kiểu lắng nghe khiến đối phương cảm thấy xa cách.

### Tầng 2: Lắng nghe tập trung (Focused Listening)
Toàn bộ năng lượng và ánh mắt của bạn hướng trọn về người đối diện. Bạn chú ý không chỉ câu từ họ nói, mà cả tốc độ giọng nói, ánh mắt ngập ngừng và những khoảng dừng hơi thở.

### Tầng 3: Lắng nghe toàn cảnh & bắt sóng cảm xúc (Global Listening)
Bạn cảm nhận được bầu không khí, cảm xúc ngầm ẩn sau câu chuyện và những điều họ chưa thể diễn đạt thành lời. 

**Kỹ thuật thực hành ngay:**
- **Kỹ thuật phản chiếu (Mirroring):** Lặp lại 2-3 từ khóa cuối cùng của đối phương kèm ngữ điệu tò mò, nhẹ nhàng.
- **Xác nhận cảm xúc (Validation):** "Nghe có vẻ như tuần qua anh đã chịu rất nhiều áp lực trong dự án đó nhỉ?"
- **Khoảng lặng vàng (The Golden Pause):** Đợi 2 giây sau khi họ dứt lời trước khi trả lời. Khoảng lặng này thể hiện bạn đang suy ngẫm chân thành về lời nói của họ.
    `.trim(),
  },
  {
    id: 'blog_03',
    slug: 'cong-thuc-5-hu-tai-chinh-thuc-chien',
    title: 'Mô hình phân bổ 5 hũ tài chính thông minh: Bịt kín lỗ rò rỉ dòng tiền',
    excerpt: 'Kiếm được tiền là kỹ năng, giữ được tiền và biến tiền sinh lời là kỷ luật. Hướng dẫn phân bổ thu nhập cá nhân không cần bằng cấp kinh tế.',
    author: 'Đăng Trí',
    readTime: '6 phút đọc',
    publishedAt: '2026-10-05',
    status: 'published',
    tags: ['Tài Chính Cá Nhân', 'Quản Lý Dòng Tiền', 'Đầu Tư'],
    linkedProductId: 'mat-ma-tai-chinh',
    coverGradient: 'from-emerald-700 via-teal-800 to-slate-900',
    thumbnail_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1000&q=80',
    image_config: {
      aspectRatio: '16/9',
      objectFit: 'cover',
      objectPosition: 'center',
      borderRadius: 'xl',
      filterPreset: 'vibrant',
      hoverEffect: 'zoom',
      overlayOpacity: 35,
      showBorder: true,
    },
    content: `
Rất nhiều người đi làm có mức lương tăng dần theo số năm kinh nghiệm, nhưng sau 5 năm nhìn lại số dư tài khoản vẫn chẳng đáng là bao. Hiện tượng này trong kinh tế học gọi là "Lifestyle Creep" – tiêu dùng tự động nở rộng theo thu nhập.

Để không bị cuốn vào vòng xoáy kiếm bao nhiêu tiêu hết bấy nhiêu, bạn cần thiết lập một hệ thống tự động ngay khi lương về tài khoản.

### Hũ 1: Chi phí sinh hoạt thiết yếu (55%)
Tiền thuê nhà, ăn uống cơ bản, điện nước, di chuyển. Nếu chi phí thiết yếu vượt quá 60%, bạn đang sống quá giới hạn an toàn tài chính và cần rà soát cắt giảm các khoản phí ẩn.

### Hũ 2: Quỹ dự phòng khẩn cấp & Bảo hiểm (10%)
Mục tiêu là tích lũy từ 3 đến 6 tháng chi phí sinh hoạt tối thiểu. Khoản tiền này gửi tiết kiệm kỳ hạn ngắn hoặc tài khoản sinh lời linh hoạt, tuyệt đối không dùng vào đầu tư mạo hiểm. Đây là lá chắn giúp bạn ngủ ngon trước mọi biến cố sa thải hay ốm đau.

### Hũ 3: Đầu tư gia tăng tài sản dài hạn (15%)
Tiền mua chứng chỉ quỹ, cổ phiếu giá trị hoặc đầu tư vào chuyên môn nâng cao giá trị bản thân. Hãy nhớ nguyên tắc: "Trả cho mình trước khi trả cho người khác".

### Hũ 4: Phát triển bản thân & Giáo dục (10%)
Sách, khóa học chất lượng, công cụ làm việc chuyên nghiệp. Đây là khoản đầu tư có tỉ suất sinh lời (ROI) cao nhất mà không thị trường nào đánh thuế được.

### Hũ 5: Hưởng thụ & Cho đi (10%)
Một bữa tối ấm cúng cùng người thương, một món quà nhỏ cho gia đình hoặc chuyến đi tái tạo năng lượng. Kỷ luật tài chính không phải là khắc khổ, mà là tận hưởng có chủ đích.
    `.trim(),
  },
  {
    id: 'blog_04',
    slug: 'bo-ba-mat-ma-nang-tam-ban-than',
    title: 'Bộ ba chuyển hóa Thân - Tâm - Trí: Lộ trình 90 ngày bứt phá toàn diện',
    excerpt: 'Tỉnh thức định tâm, giao tiếp kết nối và tài chính vững vàng. Ba chân kiềng không thể thiếu cho bất kỳ ai muốn tự do và tự chủ trong cuộc sống.',
    author: 'Đăng Trí',
    readTime: '5 phút đọc',
    publishedAt: '2026-10-01',
    status: 'published',
    tags: ['Tổng Hợp', 'Lộ Trình', 'Combo'],
    linkedProductId: 'combo-bo-ba-mat-ma',
    coverGradient: 'from-blue-800 via-indigo-900 to-slate-950',
    thumbnail_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80',
    image_config: {
      aspectRatio: '16/9',
      objectFit: 'cover',
      objectPosition: 'center',
      borderRadius: 'xl',
      filterPreset: 'cinematic',
      hoverEffect: 'zoom',
      overlayOpacity: 30,
      showBorder: true,
    },
    content: `
Chúng ta thường cố gắng giải quyết một bài toán tài chính bằng cách cày cuốc nhiều hơn, nhưng lại kiệt sức vì tâm trí luôn bất an. Hoặc chúng ta có chuyên môn giỏi nhưng không thăng tiến được vì thiếu năng lực giao tiếp thấu cảm.

Ba khía cạnh: **Tỉnh Thức – Kết Nối – Tài Chính** thực chất là một chỉnh thể hữu cơ, tác động qua lại lẫn nhau mỗi ngày:

- **Khi có Tỉnh Thức:** Bạn kiểm soát được cảm xúc, không bị cuốn vào bẫy chi tiêu vô thức (FOMO) và đưa ra quyết định sáng suốt.
- **Khi có Kết Nối:** Bạn xây dựng được mạng lưới quan hệ chất lượng cao, mở ra những cơ hội hợp tác và gia tăng thu nhập bền vững.
- **Khi có Tài Chính:** Bạn có được sự an tâm và tự do để tiếp tục theo đuổi những giá trị tinh thần sâu sắc mà không bị cơm áo gạo tiền ghì chặt.

Hãy bắt đầu lộ trình 90 ngày của bạn ngay hôm nay bằng cách xây dựng từng thói quen nhỏ nhất!
    `.trim(),
  },
];
