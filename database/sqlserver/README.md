# HƯỚNG DẪN DÙNG CƠ SỞ DỮ LIỆU THẬT SQL SERVER (SSMS)

Tài liệu này hướng dẫn từng bước để đưa website EBOOK STORE sang dùng **SQL Server thật**
thay cho file `data/database.json`, **giữ nguyên 100%** chức năng thanh toán SePay (VietQR)
và gửi email tự động.

---

## 0. Cách hệ thống hoạt động sau khi chuyển sang SQL Server

- Backend vẫn giữ **một bản cache trên RAM** để các API cũ (SSE realtime, `/api/sync-version`) chạy y như trước.
- Mọi thao tác **thêm / sửa / xóa** trong trang Admin đều được **ghi ngay xuống SQL Server** (write-through).
- Khi server khởi động, dữ liệu được **đọc 1 lần từ SQL Server**. Nếu bảng `products` còn trống, backend tự **seed** 7 sản phẩm + bài viết ban đầu.
- Vì reads lấy từ cache (được cập nhật tức thời) + SSE/polling 3 giây → **giao diện người dùng cập nhật realtime** ngay khi bạn sửa trong Admin.

> Vì vậy: **SePay webhook, VietQR, gửi email qua SMTP, link tải ebook… hoạt động y như cũ**, chỉ khác nơi lưu dữ liệu.

---

## 1. Chạy file tạo bảng trong SSMS

1. Mở **SQL Server Management Studio (SSMS)** và kết nối tới máy chủ SQL Server của bạn.
2. Menu **File → Open → File...** → chọn file:

   `database/sqlserver/01_schema.sql`

3. Bấm **Execute** (hoặc nhấn **F5**).
4. Khi thành công, bạn sẽ thấy dòng kết quả: `Tạo cơ sở dữ liệu ebook_store thành công!`
5. Ở cột trái (Object Explorer), mở **Databases → ebook_store → Tables**, bạn sẽ thấy 6 bảng:
   `products`, `blogs`, `orders`, `email_logs`, `sepay_config`, `support_inquiries`.

> Script **an toàn khi chạy lại nhiều lần**: bảng/chỉ mục/khóa đã có sẽ được bỏ qua, không tạo trùng.

---

## 2. Bật kết nối cho Node.js (chỉ làm 1 lần)

Node.js kết nối qua giao thức TCP/IP. Cần kiểm tra 2 điều:

### 2.1. Bật TCP/IP cho SQL Server

1. Mở **SQL Server Configuration Manager** (Start → gõ tên).
2. **SQL Server Network Configuration → Protocols for [tên instance]** → chuột phải **TCP/IP → Enable**.
3. Vào tab **IP Addresses**, kéo xuống mục **IPAll**:
   - **TCP Dynamic Ports**: để trống
   - **TCP Port**: `1433`
4. Khởi động lại dịch vụ **SQL Server (MSSQLSERVER)** trong **SQL Server Services**.

### 2.2. Bật đăng nhập bằng tài khoản SQL (khuyên dùng `sa`)

1. Trong SSMS: chuột phải máy chủ → **Properties → Security** → chọn **SQL Server and Windows Authentication mode** → OK → khởi động lại dịch vụ SQL Server.
2. Mở **Security → Logins → sa** → chuột phải → **Properties**:
   - Tab **General**: đặt mật khẩu (ví dụ `Abc@12345`).
   - Tab **Status**: **Login = Enabled**.
3. Nếu tên máy chủ của bạn là `SQLEXPRESS`, khi cấu hình `DB_HOST` hãy ghi `localhost\SQLEXPRESS`.

---

## 3. Cấu hình file `.env`

Mở file `.env` ở thư mục gốc dự án và sửa:

```env
# Chuyển sang SQL Server
DB_PROVIDER=sqlserver

DB_HOST=localhost
DB_PORT=1433
DB_NAME=ebook_store
DB_USER=sa
DB_PASSWORD=Abc@12345
DB_ENCRYPT=false
```

- `DB_HOST`: giữ `localhost` nếu SQL Server chạy cùng máy; dùng `localhost\SQLEXPRESS` nếu là bản Express; hoặc IP máy chủ nếu chạy ở máy khác (khi đó cần mở firewall cổng 1433).
- `DB_ENCRYPT`: để `false` khi chạy nội bộ. Nếu SQL Server yêu cầu mã hóa thì đặt `true`.

> Muốn quay lại dùng file JSON như cũ: chỉ cần đổi `DB_PROVIDER=json`.

---

## 4. Khởi động lại dự án

```powershell
npm run dev
```

Xem log trong terminal:

- `[Database] Nhà cung cấp dữ liệu: SQL Server (SSMS)`
- `[DB] Đã kết nối SQL Server: ebook_store`
- `[DB] Nạp xong: 7 sản phẩm, ... blog, ... đơn hàng.` (lần đầu có thể seed 7 sản phẩm)

Sau đó mở `http://localhost:3000` để kiểm tra.

---

## 5. Kiểm thử đúng theo yêu cầu

1. Vào trang **Admin** (`/admin`, mật khẩu mặc định `admin123`).
2. **Sửa / thêm / xóa** một sản phẩm → quay lại trang bán hàng → thông tin **đổi ngay** (realtime).
3. Bấm **mua** thử một ebook → quét QR (hoặc để SePay webhook thật gọi vào) → đơn chuyển **Đã thanh toán** và **email tự động** được gửi.
4. Vào tab **Phản Hồi Liên Hệ** trong Admin: các yêu cầu khách gửi từ trang `/contact` hiện ở đây; có thể **đánh dấu đã phản hồi** hoặc **xóa** (có hộp thoại xác nhận).
5. Vào **SSMS**, chuột phải bảng tương ứng → **Select Top 1000 Rows** để thấy dữ liệu thật đã được ghi xuống.

---

## 6. Xóa dữ liệu liên hoàn (cascade) đã được thiết lập

- Xóa 1 **đơn hàng** → tự động xóa sạch **nhật ký email** của đơn đó
  (nhờ khóa ngoại `FK_email_logs_orders ... ON DELETE CASCADE`).
- **Sản phẩm** không bị xóa cứng — chỉ chuyển `status = 'hidden'` để bảo toàn lịch sử đơn hàng
  (đúng theo nguyên tắc an toàn dữ liệu).

---

## 7. Xử lý sự cố thường gặp

| Lỗi | Nguyên nhân & cách xử lý |
|---|---|
| `ConnectionError: Failed to connect to localhost:1433` | Chưa bật **TCP/IP** hoặc chưa set cổng 1433 (mục 2.1), hoặc dịch vụ SQL Server chưa chạy. |
| `Login failed for user 'sa'` | Sai mật khẩu, hoặc `sa` đang bị **Disabled**, hoặc chưa bật **SQL Server Authentication** (mục 2.2). |
| `Cannot open database "ebook_store"` | Chưa chạy `01_schema.sql`, hoặc `DB_NAME` ghi sai. |
| `Invalid object name 'dbo.products'` | Bảng chưa được tạo → chạy lại `01_schema.sql`. |
| `self signed certificate` / lỗi TLS | Đặt `DB_ENCRYPT=false`, hoặc đặt `true` nếu máy chủ yêu cầu mã hóa. |
| Sửa trong Admin nhưng SQL không đổi | Kiểm tra log terminal có dòng `[DB] Lỗi ghi SQL Server: ...` không (sai kiểu dữ liệu/khóa ngoại). |

---

## 8. Lưu ý khi deploy lên Render

Render **không cung cấp SQL Server managed**. Nếu muốn giữ SQL Server cho production, bạn cần:

- Một VPS / máy chủ Windows hoặc **Azure SQL Database**, rồi trỏ `DB_HOST`, `DB_USER`, `DB_PASSWORD` tới đó; **và** cấu hình firewall cho phép Render kết nối cổng 1433.
- Hoặc giữ `DB_PROVIDER=json` (kèm **Persistent Disk**) cho tới khi có SQL Server sẵn sàng.

Dù chọn cách nào, **webhook SePay và gửi email tự động không thay đổi** — bạn chỉ cần cập nhật URL webhook trên SePay trỏ về domain thật.

---

## 9. Cấu trúc thư mục

```
database/sqlserver/
  ├── 01_schema.sql   → chạy file này trong SSMS
  └── README.md       → tài liệu bạn đang đọc
```

Backend liên quan:

```
server/db.ts            → lớp lưu JSON (giữ nguyên, dùng khi DB_PROVIDER=json)
server/db-sqlserver.ts  → lớp lưu SQL Server (write-through + realtime)
server/store.ts         → chọn nhà cung cấp dữ liệu theo biến DB_PROVIDER
```
