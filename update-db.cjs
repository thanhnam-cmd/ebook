const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const updates = {
  'mat-ma-tinh-thuc': {
    title: 'Mật Mã Tỉnh Thức',
    tagline: 'Tỉnh thức không phải là một cảm giác. Đó là một năng lực có thể rèn luyện',
    description: 'Bạn đã cố thay đổi nhiều lần, nhưng vẫn thấy mình phản ứng theo một kiểu, chọn theo một kiểu, rồi mệt theo một kiểu. Điều đó không có nghĩa là bạn kém ý chí. Chỉ là bạn chưa nhìn thấy cơ chế đang vận hành phía sau. Phần lớn người ta nghĩ tỉnh thức là một trạng thái bình an, là ngồi thiền, là sống chậm lại. Mật Mã Tỉnh Thức nhìn nó theo cách khác: tỉnh thức là năng lực nhận ra, ngay trong khoảnh khắc, rằng bạn đang phản ứng theo bản năng, theo cảm xúc hay theo đám đông, thay vì đang thật sự quyết định. Người tỉnh thức không phải người ít cảm xúc hơn. Họ là người có thêm một khoảng dừng giữa điều xảy ra và cách mình phản ứng, và chính khoảng dừng đó là nơi quyền chọn lựa xuất hiện. Mật Mã Tỉnh Thức chỉ ra bốn lớp đang vận hành ngầm trong bạn: cảm xúc, bản năng, đám đông và luật chơi xã hội, rồi hướng dẫn bạn gỡ từng lớp. Sách không hứa phép màu và không bảo bạn chờ may mắn. Tỉnh thức cũng không phải đích đến để đạt một lần rồi thôi. Đó là trạng thái cần giữ mỗi ngày: hôm nay tỉnh, ngày mai vẫn có thể ngủ lại nếu mất cảnh giác. Vì vậy, thứ cuốn sách trao cho bạn không phải một cảm giác dễ chịu, mà là một bộ công cụ để nhận ra mình đang bị dẫn dắt và lấy lại quyền điều khiển. Mỗi chương kết thúc bằng một bài thực hành ngắn, để bạn làm ngay trong cuộc sống hằng ngày. Hiểu mình là bước đầu, thay đổi bắt đầu từ việc bạn làm khác đi.',
    price: 116000,
    original_price: 168000,
    pages: 10,
    for_whom: [
      'Người học nhiều nhưng thay đổi ít',
      'Người dễ bị cuốn theo cảm xúc hoặc đám đông',
      'Người muốn có bài tập thực hành, không chỉ lý thuyết'
    ],
    not_for_whom: [
      'Người chỉ muốn được an ủi, động viên',
      'Người đang trải qua sang chấn hoặc cảm xúc tiêu cực kéo dài: nên tìm chuyên gia tâm lý trước'
    ],
    table_of_contents: [
      'Phần I – Bóc tách chính mình',
      'Chương 1: Kẻ ngủ mê tưởng mình đã thức',
      'Chương 2: Cảm xúc – con rối của kẻ yếu',
      'Chương 3: Bản năng – kẻ địch ngồi chung bàn ăn',
      'Phần II – Bóc tách đám đông',
      'Chương 4: Đám đông – cỗ máy sản xuất sự yên tâm giả',
      'Chương 5: Bẫy thao túng – khi bạn là con mồi mà không biết',
      'Chương 6: Lưới lọc xã hội – ai được ở lại, ai bị đào thải',
      'Phần III – Làm chủ vận mệnh',
      'Chương 7: Cường giả không sinh ra, cường giả được lập trình lại',
      'Chương 8: Ranh giới – vũ khí của người làm chủ cuộc chơi',
      'Chương 9: La bàn – tự do rồi, đi về đâu?',
      'Chương 10: Tàn cuộc – sống như kẻ đã nhìn thấu bàn cờ'
    ]
  },
  'mat-ma-ket-noi': {
    title: 'Mật Mã Kết Nối',
    tagline: 'Không ai thoát khỏi luật chơi của nhân tính. Nhưng bạn có thể chọn mình chơi ở vị trí nào',
    description: 'Bạn có hay tự hỏi: người ấy thật sự nghĩ gì về mình, mối quan hệ này nên giữ hay buông, sao mình cho đi nhiều mà vẫn thiệt? Mật Mã Kết Nối trả lời bằng một cách nhìn khác: mọi mối quan hệ đều là một cuộc trao đổi ngầm về nhu cầu, nỗi sợ và lợi ích. Sách đi qua tình thân, tình yêu, tình bạn và công sở. Bạn sẽ học cách nhận ra những đòn khiến mình nghi ngờ chính mình hay áp lên mình cảm giác tội lỗi, hiểu phần mình đang góp vào vòng lặp, và có công cụ để nói không, đặt giới hạn, đứng dậy sau tổn thương. Đây không phải sách dạy bạn nghi ngờ mọi người. Sau khi đọc Mật Mã Kết Nối, bạn nhận ra mình đang bị lợi dụng ở đâu và nhận diện được thao túng từ người thân quen ngay khi nó xảy ra. Bạn biết ai đang nắm quyền trong từng mối quan hệ, nói "không" mà không cảm thấy tội lỗi, quyết định ở lại hay dứt hẳn một mối quan hệ bằng tiêu chí rõ ràng thay vì cảm tính. Bạn có công cụ để tự bảo vệ ở công sở, chọn đúng người để tin và đứng dậy sau phản bội theo một kế hoạch cụ thể. Quan trọng nhất, bạn hiểu lòng người mà không trở nên cay độc: tỉnh táo, ấm áp có chọn lọc, kết nối vì muốn chứ không vì sợ cô đơn.',
    price: 127000,
    original_price: 188000,
    pages: 14,
    for_whom: [
      'Người hay nhường nhịn, cho đi nhiều, dễ kiệt sức vì quan hệ',
      'Người từng bị phản bội hoặc dứt một mối quan hệ và muốn đứng dậy',
      'Người muốn hiểu cách vận hành của quan hệ gia đình, tình bạn, tình yêu, công sở'
    ],
    not_for_whom: [
      'Người tìm mẹo lấy lòng hay "yêu sao cho khéo"',
      'Người đang bị bạo hành, đe dọa hoặc bị kiểm soát nặng: cần tìm người thân tin cậy, chuyên gia hoặc đường dây hỗ trợ trước'
    ],
    table_of_contents: [
      'Phần I – Bóc tách ma trận quan hệ',
      'Chương 1: Người tốt và cái bẫy ơn nghĩa',
      'Chương 2: Giao dịch ngầm và nỗi sợ cô đơn',
      'Chương 3: Tình yêu và hôn nhân',
      'Chương 4: Mặt tối của chính bạn',
      'Phần II – Nhận diện thao túng và luật ngầm trong từng vùng quan hệ',
      'Chương 5: Bản đồ thao túng và vòng xoay ba vai',
      'Chương 6: Hai đòn đánh vào bên trong',
      'Chương 7: Tình bạn',
      'Chương 8: Công sở và bầy đàn',
      'Chương 9: Phản bội, ghen tị và đố kỵ',
      'Phần III – Giành lại quyền kiểm soát',
      'Chương 10: Ai cần ai hơn và cách đổi thế',
      'Chương 11: Nói không dứt khoát với người thân',
      'Chương 12: Sau tổn thương – đứng dậy khi bị phản bội hoặc dứt một mối quan hệ',
      'Phần IV – Sống độc lập, không lệ thuộc cảm xúc',
      'Chương 13: Kết nối vì muốn và giữ vững vị thế',
      'Chương 14: Bản đồ lòng người – những quy luật không đổi'
    ]
  },
  'mat-ma-tai-chinh': {
    title: 'Mật Mã Tài Chính',
    tagline: 'Bóc tách ma trận dòng tiền. Từ con mồi thành kẻ làm chủ cuộc chơi',
    description: 'Bạn có hay tự hỏi: bao giờ mình khá lên, tiền bạc có ổn không, công việc này có đáng không? Mật Mã Tài Chính không dự đoán và không hứa làm giàu. Sách giúp bạn tự trả lời bằng chính số liệu của mình. Lộ trình gồm bốn giai đoạn: nhìn rõ tiền đang đi đâu, cầm máu dòng tiền bằng bảng cân đối cá nhân và quỹ khẩn cấp, tăng giá trị bản thân để tăng thu nhập, rồi phân bổ tài sản và xây dòng tiền thụ động. Nguyên tắc xuyên suốt là phòng thủ trước, tấn công sau. Sách có bài test tự chẩn đoán và khung thực hành cụ thể, dễ làm theo kể cả khi bạn chưa học tài chính bao giờ. Nội dung mang tính tham khảo, không thay thế tư vấn từ chuyên gia tài chính có chứng chỉ.',
    price: 138000,
    original_price: 198000,
    pages: 12,
    for_whom: [
      'Người đi làm thấy lương tăng nhưng cuộc sống không khá hơn',
      'Freelancer có dòng tiền bấp bênh',
      'Chủ doanh nghiệp nhỏ đang kiệt sức',
      'Nhà đầu tư mới cần bộ lọc phân biệt cơ hội thật và bẫy'
    ],
    not_for_whom: [
      'Người tìm cách làm giàu nhanh hoặc mẹo đầu tư "chắc thắng"',
      'Người cần tư vấn thuế, pháp lý, đầu tư cá nhân hóa: nên gặp chuyên gia có chứng chỉ'
    ],
    table_of_contents: [
      'Phần I – Bóc tách ma trận',
      'Chương 1: Giải mã bản chất của tiền và ma trận thu nhập',
      'Chương 2: Bẫy lạm phát lối sống và ma trận tiêu dùng',
      'Chương 3: Nô lệ công sở và ảo tưởng an toàn',
      'Phần II – Cầm máu dòng tiền, dựng lá chắn an toàn',
      'Chương 4: Tái cấu trúc bảng cân đối kế toán cá nhân',
      'Chương 5: Thiết lập quỹ khẩn cấp và quỹ an ninh',
      'Chương 6: Kỷ luật dòng tiền và tâm lý chi tiêu',
      'Phần III – Gia tăng thu nhập và xây dựng đế chế tài chính',
      'Chương 7: Tăng giá trị bản thân trong chuỗi giá trị',
      'Chương 8: Từ bán thời gian sang bán quy mô',
      'Chương 9: Tư duy sở hữu tài sản sản xuất',
      'Phần IV – Kiến tạo cỗ máy tự do',
      'Chương 10: Tư duy phân bổ tài sản và quản trị rủi ro',
      'Chương 11: Xây dựng cỗ máy dòng tiền thụ động',
      'Chương 12: Kiến tạo di sản và tự do lựa chọn'
    ]
  },
  'combo-thau-suot-ket-noi': {
    title: 'Combo Mật Mã Tỉnh Thức + Mật Mã Kết Nối',
    tagline: 'Hiểu chính mình để đứng vững trong mọi mối quan hệ',
    description: 'Có những mối quan hệ khiến bạn mệt, nhưng bạn vẫn ở lại. Có những lời nói khiến bạn khó chịu, nhưng bạn vẫn gật đầu. Có những lần bạn tự hứa sẽ đặt giới hạn, rồi đến lúc cần lại im lặng. Nguyên nhân hiếm khi chỉ nằm ở người đối diện. Rất nhiều khi, nó nằm ở những phản xạ bên trong chính bạn. Combo này kết hợp hai góc nhìn bổ sung cho nhau. Mật Mã Tỉnh Thức giúp bạn nhìn rõ cảm xúc, bản năng và áp lực đám đông đang điều khiển phản ứng của mình, kèm các bài thực hành như Tách vai và Ba câu hỏi trước khi gật đầu. Mật Mã Kết Nối đưa bạn đi qua luật ngầm trong tình thân, tình yêu, tình bạn và công sở: cách nhận ra những đòn khiến bạn nghi ngờ chính mình hay mang cảm giác tội lỗi, cách nói không, đặt giới hạn, và đứng dậy sau những tổn thương.',
    price: 207000,
    original_price: 243000,
    pages: 24
  },
  'combo-tinh-thuc-thinh-vuong': {
    title: 'Combo Mật Mã Tỉnh Thức + Mật Mã Tài Chính',
    tagline: 'Làm chủ chính mình để làm chủ tiền bạc',
    description: 'Nhiều người biết mình nên tiết kiệm, nên đầu tư thận trọng, nên ngừng chi tiêu theo cảm xúc, nhưng đến lúc quyết định vẫn làm ngược lại. Vấn đề hiếm khi nằm ở việc thiếu kiến thức. Phần lớn nằm ở những lực ngầm đứng sau mỗi lần bạn mở ví. Combo này ghép hai mảnh còn thiếu của nhau. Mật Mã Tỉnh Thức giúp bạn nhìn rõ cảm xúc, bản năng, áp lực đám đông và những đòn tâm lý đang kéo quyết định của bạn đi, kèm các kỹ thuật thực hành. Mật Mã Tài Chính đưa bạn qua lộ trình bốn giai đoạn: hiểu tiền đang đi đâu, cầm máu dòng tiền, tăng thu nhập, rồi xây dòng tiền thụ động. Đọc cuốn đầu để giữ được đầu óc tỉnh táo, đọc cuốn sau để biến sự tỉnh táo đó thành một hệ thống tiền bạc cụ thể. Sách không hứa làm giàu nhanh. Đây là bộ công cụ cho người muốn tự chịu trách nhiệm với quyết định của mình.',
    price: 216000,
    original_price: 254000,
    pages: 22
  },
  'combo-dong-hanh-toan-dien': {
    title: 'Combo Mật Mã Kết Nối + Mật Mã Tài Chính',
    tagline: 'Giữ vững các mối quan hệ, giữ chắc túi tiền',
    description: 'Tiền không nằm trong một chiếc hộp riêng biệt. Nó đi qua gia đình, tình yêu, bạn bè, đồng nghiệp, đối tác. Có người kiếm không ít nhưng vẫn cạn vì những khoản chi do áp lực từ người khác. Có người đủ năng lực để tăng thu nhập nhưng lại ngại lên tiếng, ngại đặt giới hạn, ngại nói không. Combo này ghép hai nửa của cùng một bài toán. Mật Mã Kết Nối giúp bạn hiểu luật ngầm trong tình thân, tình yêu, tình bạn và công sở, nhận ra những đòn khiến bạn nghi ngờ chính mình hay mang cảm giác tội lỗi, và học cách nói không, đặt giới hạn. Mật Mã Tài Chính đưa bạn qua lộ trình bốn giai đoạn: hiểu tiền đang đi đâu, cầm máu dòng tiền, tăng thu nhập, rồi xây dòng tiền thụ động. Cuốn đầu giúp bạn đứng vững trước con người, cuốn sau giúp bạn đứng vững trước tiền bạc. Khi cả hai cùng vững, bạn bớt bị cuốn vào những quyết định không thuộc về mình. Sách không hứa làm giàu nhanh và cũng không dạy bạn nghi ngờ mọi người. Đây là bộ công cụ cho người muốn tỉnh táo hơn trong các mối quan hệ và tài chính.',
    price: 226000,
    original_price: 265000,
    pages: 26
  },
  'combo-bo-ba-mat-ma': {
    title: 'Combo 3 cuốn Bộ Ba Mật Mã',
    tagline: 'Ba nền tảng để làm chủ cuộc sống: bản thân, các mối quan hệ, tiền bạc',
    description: 'Phần lớn những khó khăn của chúng ta quy về ba chuyện: mình đang sống với chính mình ra sao, mình đang đối xử với người khác và được đối xử ra sao, và mình đang đứng ở đâu với tiền bạc. Ba chuyện này không tách rời nhau. Một người dễ bị cảm xúc cuốn đi thường dễ bị người khác dẫn dắt, và một người khó nói không thường khó giữ được tiền. Bộ ba Mật Mã đi theo đúng thứ tự đó. Mật Mã Tỉnh Thức giúp bạn nhìn rõ cảm xúc, bản năng và áp lực đám đông đang điều khiển quyết định của mình, kèm các bài thực hành như Tách vai và Trì hoãn 10 giây. Mật Mã Kết Nối đưa bạn đi qua luật ngầm trong tình thân, tình yêu, tình bạn và công sở, giúp bạn nhận ra khi lòng tốt bị lợi dụng, biết nói không và đặt giới hạn. Mật Mã Tài Chính dẫn bạn qua lộ trình bốn giai đoạn: hiểu tiền đang đi đâu, cầm máu dòng tiền, tăng thu nhập, rồi xây dòng tiền thụ động. Ba cuốn bổ trợ cho nhau: đầu óc tỉnh táo giúp bạn chọn đúng người, quan hệ lành mạnh giúp bạn không bị rút cạn năng lượng và nền tài chính vững giúp bạn có quyền lựa chọn. Bộ sách không hứa phép màu hay làm giàu nhanh. Đây là bộ công cụ cho người muốn tự chịu trách nhiệm với cuộc sống của mình, từng bước một. Thứ tự đọc gợi ý: Tỉnh Thức, rồi Kết Nối, rồi Tài Chính. Có thể đọc theo vấn đề bạn đang gặp nhất.',
    price: 286000,
    original_price: 381000,
    pages: 36
  }
};

let count = 0;
db.products = db.products.map(p => {
  if (updates[p.id]) {
    count++;
    return { ...p, ...updates[p.id] };
  }
  return p;
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`Updated ${count} products`);
