/* ============================================================================
   EBOOK STORE — SCHEMA SQL SERVER (SSMS)
   Chạy file này trong SQL Server Management Studio (SSMS) để tạo cơ sở dữ liệu thật.
   Tương thích: SQL Server 2016 trở lên.

   CÁCH CHẠY:
   1. Mở SSMS → kết nối tới máy chủ SQL Server của bạn.
   2. File → Open → File... → chọn file 01_schema.sql này.
   3. Bấm "Execute" (hoặc F5). Toàn bộ script chạy 1 lần là xong.
   4. Sau khi chạy, cấu hình file .env của dự án (xem README.md cùng thư mục).

   LƯU Ý: Script an toàn khi chạy lại nhiều lần (không tạo trùng bảng/chỉ mục/khóa).
   ============================================================================ */

/* ---------------------------------------------------------------------------
   1. TẠO DATABASE
   --------------------------------------------------------------------------- */
IF DB_ID('ebook_store') IS NULL
BEGIN
    CREATE DATABASE ebook_store;
END
GO

USE ebook_store;
GO

SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

/* ---------------------------------------------------------------------------
   2. BẢNG SẢN PHẨM (EBOOK / COMBO)
   - Các trường danh sách/đối tượng phức tạp lưu dạng JSON trong NVARCHAR(MAX)
   --------------------------------------------------------------------------- */
IF OBJECT_ID('dbo.products', 'U') IS NULL
CREATE TABLE dbo.products (
    id                  NVARCHAR(100)  NOT NULL CONSTRAINT PK_products PRIMARY KEY,
    title               NVARCHAR(255)  NOT NULL,
    slug                NVARCHAR(255)  NULL,
    [type]              NVARCHAR(20)   NULL,          -- 'single' | 'combo'
    tagline             NVARCHAR(500)  NULL,
    [description]       NVARCHAR(MAX)  NULL,
    price               BIGINT         NOT NULL CONSTRAINT DF_products_price DEFAULT 0,
    original_price      BIGINT         NOT NULL CONSTRAINT DF_products_original_price DEFAULT 0,
    pages               INT            NOT NULL CONSTRAINT DF_products_pages DEFAULT 0,
    [status]            NVARCHAR(20)   NOT NULL CONSTRAINT DF_products_status DEFAULT 'active',  -- 'active' | 'hidden'
    file_path           NVARCHAR(500)  NULL,
    badge               NVARCHAR(255)  NULL,
    image_url           NVARCHAR(1000) NULL,
    image_config        NVARCHAR(MAX)  NULL,          -- JSON: cấu hình hiển thị ảnh
    table_of_contents   NVARCHAR(MAX)  NULL,          -- JSON array: mục lục
    for_whom            NVARCHAR(MAX)  NULL,          -- JSON array
    not_for_whom        NVARCHAR(MAX)  NULL,          -- JSON array
    included_books      NVARCHAR(MAX)  NULL,          -- JSON array: sách trong combo
    sample_read_url     NVARCHAR(1000) NULL,
    sample_drive_url    NVARCHAR(1000) NULL,
    theme_color         NVARCHAR(MAX)  NULL,          -- JSON: { primary, secondary, accent }
    updated_at          NVARCHAR(50)   NULL
);
GO

/* ---------------------------------------------------------------------------
   3. BẢNG BÀI VIẾT (BLOG)
   --------------------------------------------------------------------------- */
IF OBJECT_ID('dbo.blogs', 'U') IS NULL
CREATE TABLE dbo.blogs (
    id                  NVARCHAR(100)  NOT NULL CONSTRAINT PK_blogs PRIMARY KEY,
    slug                NVARCHAR(255)  NULL,
    title               NVARCHAR(500)  NULL,
    excerpt             NVARCHAR(MAX)  NULL,
    [content]           NVARCHAR(MAX)  NULL,
    author              NVARCHAR(255)  NULL,
    thumbnail_url       NVARCHAR(1000) NULL,
    image_config        NVARCHAR(MAX)  NULL,          -- JSON
    cover_gradient      NVARCHAR(255)  NULL,
    read_time           NVARCHAR(100)  NULL,
    published_at        NVARCHAR(50)   NULL,
    [status]            NVARCHAR(20)   NULL,          -- 'published' | 'draft'
    tags                NVARCHAR(MAX)  NULL,          -- JSON array
    linked_product_id   NVARCHAR(100)  NULL,
    updated_at          NVARCHAR(50)   NULL
);
GO

/* ---------------------------------------------------------------------------
   4. BẢNG ĐƠN HÀNG
   - order_code là mã khách chuyển khoản (VD: MM1024) → đặt UNIQUE để tra cứu & làm khóa ngoại.
   - product_id tham chiếu products (KHÔNG xóa cứng sản phẩm, chỉ ẩn/hiện).
   --------------------------------------------------------------------------- */
IF OBJECT_ID('dbo.orders', 'U') IS NULL
CREATE TABLE dbo.orders (
    id                  NVARCHAR(80)   NOT NULL CONSTRAINT PK_orders PRIMARY KEY,
    order_code          NVARCHAR(50)   NOT NULL,
    customer_name       NVARCHAR(255)  NULL,
    customer_email      NVARCHAR(255)  NULL,
    product_id          NVARCHAR(100)  NULL,
    product_title       NVARCHAR(255)  NULL,
    amount              BIGINT         NOT NULL CONSTRAINT DF_orders_amount DEFAULT 0,
    original_amount     BIGINT         NOT NULL CONSTRAINT DF_orders_original_amount DEFAULT 0,
    [status]            NVARCHAR(20)   NOT NULL CONSTRAINT DF_orders_status DEFAULT 'pending', -- pending | paid | need_check | cancelled
    created_at          NVARCHAR(50)   NULL,
    paid_at             NVARCHAR(50)   NULL,
    download_token      NVARCHAR(100)  NULL,
    email_sent          BIT            NOT NULL CONSTRAINT DF_orders_email_sent DEFAULT 0,
    payment_details     NVARCHAR(MAX)  NULL,          -- JSON: thông tin giao dịch SePay
    updated_at          NVARCHAR(50)   NULL
);
GO

/* ---------------------------------------------------------------------------
   5. NHẬT KÝ EMAIL ĐÃ GỬI
   - order_code tham chiếu orders(order_code) với ON DELETE CASCADE:
     xóa 1 đơn hàng sẽ tự động xóa sạch nhật ký email của đơn đó.
   --------------------------------------------------------------------------- */
IF OBJECT_ID('dbo.email_logs', 'U') IS NULL
CREATE TABLE dbo.email_logs (
    id                  NVARCHAR(120)  NOT NULL CONSTRAINT PK_email_logs PRIMARY KEY,
    order_code          NVARCHAR(50)   NULL,
    to_email            NVARCHAR(255)  NULL,
    customer_name       NVARCHAR(255)  NULL,
    product_title       NVARCHAR(255)  NULL,
    download_url        NVARCHAR(1000) NULL,
    sent_at             NVARCHAR(50)   NULL,
    [subject]           NVARCHAR(500)  NULL,
    [status]            NVARCHAR(20)   NULL,          -- delivered | pending | failed
    created_at          NVARCHAR(50)   NULL
);
GO

/* ---------------------------------------------------------------------------
   6. CẤU HÌNH SEPAY + SMTP (chỉ 1 dòng id = 1)
   --------------------------------------------------------------------------- */
IF OBJECT_ID('dbo.sepay_config', 'U') IS NULL
CREATE TABLE dbo.sepay_config (
    id                  INT            NOT NULL CONSTRAINT PK_sepay_config PRIMARY KEY,
    bank_code           NVARCHAR(50)   NULL,
    account_number      NVARCHAR(100)  NULL,
    account_name        NVARCHAR(255)  NULL,
    api_key             NVARCHAR(500)  NULL,          -- SePay API Token
    webhook_token       NVARCHAR(500)  NULL,
    webhook_url         NVARCHAR(500)  NULL,
    auto_send_email     BIT            NOT NULL CONSTRAINT DF_sepay_auto_send_email DEFAULT 1,
    test_mode           BIT            NOT NULL CONSTRAINT DF_sepay_test_mode DEFAULT 0,
    smtp_host           NVARCHAR(255)  NULL,
    smtp_port           INT            NULL,
    smtp_user           NVARCHAR(255)  NULL,
    smtp_pass           NVARCHAR(500)  NULL,
    smtp_from           NVARCHAR(255)  NULL,
    smtp_secure         BIT            NULL,
    updated_at          NVARCHAR(50)   NULL
);
GO

/* ---------------------------------------------------------------------------
   7. PHẢN HỒI LIÊN HỆ TỪ KHÁCH HÀNG (trang /contact)
   --------------------------------------------------------------------------- */
IF OBJECT_ID('dbo.support_inquiries', 'U') IS NULL
CREATE TABLE dbo.support_inquiries (
    id                  NVARCHAR(80)   NOT NULL CONSTRAINT PK_support_inquiries PRIMARY KEY,
    [name]              NVARCHAR(255)  NULL,
    email               NVARCHAR(255)  NULL,
    [message]           NVARCHAR(MAX)  NULL,
    created_at          NVARCHAR(50)   NULL,
    [status]            NVARCHAR(20)   NOT NULL CONSTRAINT DF_support_status DEFAULT 'new'  -- new | replied
);
GO

/* ---------------------------------------------------------------------------
   8. CHỈ MỤC (INDEX) — tăng tốc truy vấn
   --------------------------------------------------------------------------- */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UX_orders_order_code' AND object_id = OBJECT_ID('dbo.orders'))
    CREATE UNIQUE INDEX UX_orders_order_code ON dbo.orders(order_code);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_orders_created_at' AND object_id = OBJECT_ID('dbo.orders'))
    CREATE INDEX IX_orders_created_at ON dbo.orders(created_at DESC);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_orders_status' AND object_id = OBJECT_ID('dbo.orders'))
    CREATE INDEX IX_orders_status ON dbo.orders([status]);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_email_logs_order_code' AND object_id = OBJECT_ID('dbo.email_logs'))
    CREATE INDEX IX_email_logs_order_code ON dbo.email_logs(order_code);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_support_created_at' AND object_id = OBJECT_ID('dbo.support_inquiries'))
    CREATE INDEX IX_support_created_at ON dbo.support_inquiries(created_at DESC);
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_products_status' AND object_id = OBJECT_ID('dbo.products'))
    CREATE INDEX IX_products_status ON dbo.products([status]);
GO

/* ---------------------------------------------------------------------------
   9. KHÓA NGOẠI (FOREIGN KEY) — bảo đảm toàn vẹn + xóa liên hoàn
   - orders.product_id        → products.id        (không cascade: sản phẩm chỉ ẩn, không xóa cứng)
   - email_logs.order_code    → orders.order_code  (ON DELETE CASCADE)
   --------------------------------------------------------------------------- */
IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_orders_products')
    ALTER TABLE dbo.orders
        ADD CONSTRAINT FK_orders_products FOREIGN KEY (product_id) REFERENCES dbo.products(id);
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_email_logs_orders')
    ALTER TABLE dbo.email_logs
        ADD CONSTRAINT FK_email_logs_orders FOREIGN KEY (order_code)
        REFERENCES dbo.orders(order_code) ON DELETE CASCADE;
GO

/* ---------------------------------------------------------------------------
   10. DỮ LIỆU KHỞI TẠO CHO CẤU HÌNH SEPAY (1 dòng duy nhất)
   - Bạn có thể sửa trực tiếp sau này trong SSMS hoặc trong trang Admin.
   --------------------------------------------------------------------------- */
IF NOT EXISTS (SELECT 1 FROM dbo.sepay_config WHERE id = 1)
    INSERT INTO dbo.sepay_config (id, bank_code, account_number, account_name, webhook_url, auto_send_email, test_mode, updated_at)
    VALUES (1, 'MB', '0987654321', 'DANG TRI', '/api/sepay/webhook', 1, 0, CONVERT(NVARCHAR(50), SYSDATETIME(), 126));
GO

/* ---------------------------------------------------------------------------
   HOÀN TẤT. Danh sách 7 sản phẩm & bài viết sẽ được backend tự động nạp (seed)
   trong lần chạy đầu tiên, hoặc bạn có thể thêm/sửa trực tiếp trong trang Admin.
   --------------------------------------------------------------------------- */
SELECT 'Tạo cơ sở dữ liệu ebook_store thành công!' AS KetQua;
GO
