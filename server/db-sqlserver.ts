import sql from 'mssql';
import { Product, Order, SePayConfig, EmailLog, SupportInquiry, BlogPost } from '../src/types.ts';
import { INITIAL_PRODUCTS, INITIAL_SEPAY_CONFIG } from '../src/data/initialProducts.ts';
import { INITIAL_BLOGS } from '../src/data/initialBlogs.ts';

export interface DatabaseSchema {
  products: Product[];
  blogs: BlogPost[];
  orders: Order[];
  sepayConfig: SePayConfig;
  emailLogs: EmailLog[];
  supportInquiries: SupportInquiry[];
  dataVersion: number;
}

function parseJson<T>(value: any, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== 'string') return value as T;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    return fallback;
  }
}

function jsonOrNull(value: any): string | null {
  if (value === undefined || value === null) return null;
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}

/**
 * SQL Server (SSMS) backed database.
 *
 * Kiến trúc: giữ một bản cache trên RAM để toàn bộ API hiện tại (SSE realtime, sync-version)
 * hoạt động y nguyên, mọi thao tác ghi sẽ được đẩy xuống SQL Server (write-through).
 * Khi khởi động, dữ liệu được nạp 1 lần từ SQL Server; nếu bảng rỗng sẽ tự seed từ INITIAL_*.
 */
export class SqlServerDatabase {
  private data: DatabaseSchema;
  private listeners: ((event: { type: string; version: number }) => void)[] = [];
  private pool: any = null;
  // Hàng đợi tuần tự: bảo đảm mọi thao tác ghi xuống SQL Server chạy lần lượt,
  // tránh tranh chấp (race) giữa các request ghi gần nhau.
  private writeChain: Promise<unknown> = Promise.resolve();
  public ready: Promise<void>;

  constructor() {
    this.data = {
      products: [],
      blogs: [],
      orders: [],
      sepayConfig: { ...INITIAL_SEPAY_CONFIG },
      emailLogs: [],
      supportInquiries: [],
      dataVersion: 1,
    };
    this.ready = this.init();
  }

  // --- CONNECTION & SCHEMA ---
  private getPoolConfig(): any {
    return {
      server: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 1433),
      database: process.env.DB_NAME || 'ebook_store',
      user: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD || '',
      options: {
        encrypt: (process.env.DB_ENCRYPT || 'false').toLowerCase() === 'true',
        trustServerCertificate: true,
      },
      pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
    };
  }

  private async init() {
    try {
      this.pool = await new sql.ConnectionPool(this.getPoolConfig()).connect();
      console.log('[DB] Đã kết nối SQL Server:', process.env.DB_NAME || 'ebook_store');
      await this.ensureTables();
      await this.loadFromDb();
    } catch (err: any) {
      console.error('[DB] Không thể khởi tạo SQL Server:', err?.message || err);
      console.error('[DB] Hãy chạy file database/sqlserver/01_schema.sql trong SSMS và kiểm tra biến môi trường DB_*.');
    }
  }

  private async ensureTables() {
    if (!this.pool) return;
    const ddl = `
IF OBJECT_ID('dbo.products', 'U') IS NULL
CREATE TABLE dbo.products (
  id NVARCHAR(100) NOT NULL PRIMARY KEY,
  title NVARCHAR(255) NOT NULL,
  slug NVARCHAR(255) NULL,
  [type] NVARCHAR(20) NULL,
  tagline NVARCHAR(500) NULL,
  [description] NVARCHAR(MAX) NULL,
  price BIGINT NOT NULL DEFAULT 0,
  original_price BIGINT NOT NULL DEFAULT 0,
  pages INT NOT NULL DEFAULT 0,
  [status] NVARCHAR(20) NOT NULL DEFAULT 'active',
  file_path NVARCHAR(500) NULL,
  badge NVARCHAR(255) NULL,
  image_url NVARCHAR(1000) NULL,
  image_config NVARCHAR(MAX) NULL,
  table_of_contents NVARCHAR(MAX) NULL,
  for_whom NVARCHAR(MAX) NULL,
  not_for_whom NVARCHAR(MAX) NULL,
  included_books NVARCHAR(MAX) NULL,
  sample_read_url NVARCHAR(1000) NULL,
  sample_drive_url NVARCHAR(1000) NULL,
  theme_color NVARCHAR(MAX) NULL,
  updated_at NVARCHAR(50) NULL
);

IF OBJECT_ID('dbo.blogs', 'U') IS NULL
CREATE TABLE dbo.blogs (
  id NVARCHAR(100) NOT NULL PRIMARY KEY,
  slug NVARCHAR(255) NULL,
  title NVARCHAR(500) NULL,
  excerpt NVARCHAR(MAX) NULL,
  [content] NVARCHAR(MAX) NULL,
  author NVARCHAR(255) NULL,
  thumbnail_url NVARCHAR(1000) NULL,
  image_config NVARCHAR(MAX) NULL,
  cover_gradient NVARCHAR(255) NULL,
  read_time NVARCHAR(100) NULL,
  published_at NVARCHAR(50) NULL,
  [status] NVARCHAR(20) NULL,
  tags NVARCHAR(MAX) NULL,
  linked_product_id NVARCHAR(100) NULL,
  updated_at NVARCHAR(50) NULL
);

IF OBJECT_ID('dbo.orders', 'U') IS NULL
CREATE TABLE dbo.orders (
  id NVARCHAR(80) NOT NULL PRIMARY KEY,
  order_code NVARCHAR(50) NOT NULL,
  customer_name NVARCHAR(255) NULL,
  customer_email NVARCHAR(255) NULL,
  product_id NVARCHAR(100) NULL,
  product_title NVARCHAR(255) NULL,
  amount BIGINT NOT NULL DEFAULT 0,
  original_amount BIGINT NOT NULL DEFAULT 0,
  [status] NVARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at NVARCHAR(50) NULL,
  paid_at NVARCHAR(50) NULL,
  download_token NVARCHAR(100) NULL,
  email_sent BIT NOT NULL DEFAULT 0,
  payment_details NVARCHAR(MAX) NULL,
  updated_at NVARCHAR(50) NULL
);

IF OBJECT_ID('dbo.email_logs', 'U') IS NULL
CREATE TABLE dbo.email_logs (
  id NVARCHAR(120) NOT NULL PRIMARY KEY,
  order_code NVARCHAR(50) NULL,
  to_email NVARCHAR(255) NULL,
  customer_name NVARCHAR(255) NULL,
  product_title NVARCHAR(255) NULL,
  download_url NVARCHAR(1000) NULL,
  sent_at NVARCHAR(50) NULL,
  [subject] NVARCHAR(500) NULL,
  [status] NVARCHAR(20) NULL,
  created_at NVARCHAR(50) NULL
);

IF OBJECT_ID('dbo.sepay_config', 'U') IS NULL
CREATE TABLE dbo.sepay_config (
  id INT NOT NULL PRIMARY KEY,
  bank_code NVARCHAR(50) NULL,
  account_number NVARCHAR(100) NULL,
  account_name NVARCHAR(255) NULL,
  api_key NVARCHAR(500) NULL,
  webhook_token NVARCHAR(500) NULL,
  webhook_url NVARCHAR(500) NULL,
  auto_send_email BIT NOT NULL DEFAULT 1,
  test_mode BIT NOT NULL DEFAULT 0,
  smtp_host NVARCHAR(255) NULL,
  smtp_port INT NULL,
  smtp_user NVARCHAR(255) NULL,
  smtp_pass NVARCHAR(500) NULL,
  smtp_from NVARCHAR(255) NULL,
  smtp_secure BIT NULL,
  updated_at NVARCHAR(50) NULL
);

IF OBJECT_ID('dbo.support_inquiries', 'U') IS NULL
CREATE TABLE dbo.support_inquiries (
  id NVARCHAR(80) NOT NULL PRIMARY KEY,
  [name] NVARCHAR(255) NULL,
  email NVARCHAR(255) NULL,
  [message] NVARCHAR(MAX) NULL,
  created_at NVARCHAR(50) NULL,
  [status] NVARCHAR(20) NOT NULL DEFAULT 'new'
);

-- Ràng buộc & chỉ mục (bảo đảm tính toàn vẹn + xóa liên hoàn)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='UX_orders_order_code' AND object_id=OBJECT_ID('dbo.orders'))
  CREATE UNIQUE INDEX UX_orders_order_code ON dbo.orders(order_code);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_orders_created_at' AND object_id=OBJECT_ID('dbo.orders'))
  CREATE INDEX IX_orders_created_at ON dbo.orders(created_at DESC);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_email_logs_order_code' AND object_id=OBJECT_ID('dbo.email_logs'))
  CREATE INDEX IX_email_logs_order_code ON dbo.email_logs(order_code);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_support_created_at' AND object_id=OBJECT_ID('dbo.support_inquiries'))
  CREATE INDEX IX_support_created_at ON dbo.support_inquiries(created_at DESC);
IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_email_logs_orders')
  ALTER TABLE dbo.email_logs WITH NOCHECK
    ADD CONSTRAINT FK_email_logs_orders FOREIGN KEY (order_code)
    REFERENCES dbo.orders(order_code) ON DELETE CASCADE;
IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_orders_products')
  ALTER TABLE dbo.orders WITH NOCHECK
    ADD CONSTRAINT FK_orders_products FOREIGN KEY (product_id)
    REFERENCES dbo.products(id);
`;
    await this.pool.request().query(ddl);
  }

  // --- LOW-LEVEL WRITE HELPER (tuần tự hoá) ---
  private run(query: string, params: Record<string, { type: any; value: any }> = {}) {
    if (!this.pool) return;
    this.writeChain = this.writeChain.then(async () => {
      if (!this.pool) return;
      const request = this.pool.request();
      for (const [key, def] of Object.entries(params)) {
        request.input(key, def.type, def.value);
      }
      await request.query(query);
    }).catch((err) => {
      console.error('[DB] Lỗi ghi SQL Server:', err?.message || err);
    });
  }

  // --- LOAD & SEED ---
  private async loadFromDb() {
    if (!this.pool) return;

    const [prodRes, blogRes, orderRes, emailRes, cfgRes, supRes] = await Promise.all([
      this.pool.request().query('SELECT * FROM dbo.products'),
      this.pool.request().query('SELECT * FROM dbo.blogs'),
      this.pool.request().query('SELECT * FROM dbo.orders ORDER BY created_at DESC'),
      this.pool.request().query('SELECT * FROM dbo.email_logs ORDER BY sent_at DESC'),
      this.pool.request().query('SELECT * FROM dbo.sepay_config WHERE id = 1'),
      this.pool.request().query('SELECT * FROM dbo.support_inquiries ORDER BY created_at DESC'),
    ]);

    this.data.products = prodRes.recordset.map((r: any) => this.rowToProduct(r));
    this.data.blogs = blogRes.recordset.map((r: any) => this.rowToBlog(r));
    this.data.orders = orderRes.recordset.map((r: any) => this.rowToOrder(r));
    this.data.emailLogs = emailRes.recordset.map((r: any) => this.rowToEmailLog(r));
    this.data.supportInquiries = supRes.recordset.map((r: any) => this.rowToInquiry(r));

    if (cfgRes.recordset.length > 0) {
      this.data.sepayConfig = this.rowToConfig(cfgRes.recordset[0]);
    } else {
      this.persistConfig(this.data.sepayConfig);
    }

    // Auto-seed nếu database còn trống (lần chạy đầu tiên)
    if (this.data.products.length === 0 && INITIAL_PRODUCTS.length > 0) {
      console.log('[DB] Bảng products trống → seed dữ liệu sản phẩm ban đầu.');
      this.data.products = INITIAL_PRODUCTS.map((p) => ({ ...p }));
      this.data.products.forEach((p) => this.persistProduct(p));
    }
    if (this.data.blogs.length === 0 && INITIAL_BLOGS.length > 0) {
      this.data.blogs = INITIAL_BLOGS.map((b) => ({ ...b }));
      this.data.blogs.forEach((b) => this.persistBlog(b));
    }

    console.log(`[DB] Nạp xong: ${this.data.products.length} sản phẩm, ${this.data.blogs.length} blog, ${this.data.orders.length} đơn hàng.`);
  }

  // --- ROW MAPPERS ---
  private rowToProduct(r: any): Product {
    return {
      id: r.id,
      title: r.title || '',
      slug: r.slug || '',
      type: r.type || 'single',
      tagline: r.tagline || '',
      description: r.description || '',
      price: Number(r.price || 0),
      original_price: Number(r.original_price || 0),
      pages: Number(r.pages || 0),
      status: r.status || 'active',
      file_path: r.file_path || '',
      badge: r.badge ?? undefined,
      image_url: r.image_url ?? undefined,
      image_config: parseJson(r.image_config, undefined as any),
      table_of_contents: parseJson(r.table_of_contents, [] as string[]),
      for_whom: parseJson(r.for_whom, [] as string[]),
      not_for_whom: parseJson(r.not_for_whom, [] as string[]),
      included_books: parseJson(r.included_books, undefined as any),
      sample_read_url: r.sample_read_url ?? undefined,
      sampleDriveUrl: r.sample_drive_url ?? undefined,
      themeColor: parseJson(r.theme_color, undefined as any),
    };
  }

  private rowToBlog(r: any): BlogPost {
    return {
      id: r.id,
      slug: r.slug || '',
      title: r.title || '',
      excerpt: r.excerpt || '',
      content: r.content || '',
      author: r.author || '',
      thumbnail_url: r.thumbnail_url ?? undefined,
      image_config: parseJson(r.image_config, undefined as any),
      coverGradient: r.cover_gradient ?? undefined,
      readTime: r.read_time || '',
      publishedAt: r.published_at || '',
      status: r.status || 'draft',
      tags: parseJson(r.tags, [] as string[]),
      linkedProductId: r.linked_product_id ?? undefined,
    };
  }

  private rowToOrder(r: any): Order {
    return {
      id: r.id,
      orderCode: r.order_code,
      customerName: r.customer_name || '',
      customerEmail: r.customer_email || '',
      productId: r.product_id || '',
      productTitle: r.product_title || '',
      amount: Number(r.amount || 0),
      originalAmount: Number(r.original_amount || 0),
      status: r.status || 'pending',
      createdAt: r.created_at || new Date().toISOString(),
      paidAt: r.paid_at ?? undefined,
      downloadToken: r.download_token || '',
      emailSent: !!r.email_sent,
      paymentDetails: parseJson(r.payment_details, undefined as any),
    };
  }

  private rowToEmailLog(r: any): EmailLog {
    return {
      id: r.id,
      orderCode: r.order_code || '',
      toEmail: r.to_email || '',
      customerName: r.customer_name || '',
      productTitle: r.product_title || '',
      downloadUrl: r.download_url || '',
      sentAt: r.sent_at || '',
      subject: r.subject || '',
      status: r.status || 'pending',
    };
  }

  private rowToConfig(r: any): SePayConfig {
    return {
      bankCode: r.bank_code || '',
      accountNumber: r.account_number || '',
      accountName: r.account_name || '',
      apiKey: r.api_key ?? undefined,
      webhookToken: r.webhook_token || '',
      webhookUrl: r.webhook_url || '',
      autoSendEmail: !!r.auto_send_email,
      testMode: !!r.test_mode,
      smtpHost: r.smtp_host ?? undefined,
      smtpPort: r.smtp_port ?? undefined,
      smtpUser: r.smtp_user ?? undefined,
      smtpPass: r.smtp_pass ?? undefined,
      smtpFrom: r.smtp_from ?? undefined,
      smtpSecure: r.smtp_secure === null || r.smtp_secure === undefined ? undefined : !!r.smtp_secure,
    };
  }

  private rowToInquiry(r: any): SupportInquiry {
    return {
      id: r.id,
      name: r.name || '',
      email: r.email || '',
      message: r.message || '',
      createdAt: r.created_at || '',
      status: r.status || 'new',
    };
  }

  // --- PERSIST HELPERS (UPSERT: tránh xóa dòng cha làm mất dữ liệu con qua CASCADE) ---
  private persistProduct(p: Product) {
    this.run(
      `UPDATE dbo.products SET
         title=@title, slug=@slug, [type]=@type, tagline=@tagline, [description]=@description,
         price=@price, original_price=@original_price, pages=@pages, [status]=@status,
         file_path=@file_path, badge=@badge, image_url=@image_url, image_config=@image_config,
         table_of_contents=@toc, for_whom=@for_whom, not_for_whom=@not_for_whom,
         included_books=@included_books, sample_read_url=@sample_read_url,
         sample_drive_url=@sample_drive_url, theme_color=@theme_color, updated_at=@updated_at
       WHERE id=@id;
       IF @@ROWCOUNT = 0
       INSERT INTO dbo.products
         (id, title, slug, [type], tagline, [description], price, original_price, pages, [status],
          file_path, badge, image_url, image_config, table_of_contents, for_whom, not_for_whom,
          included_books, sample_read_url, sample_drive_url, theme_color, updated_at)
       VALUES
         (@id, @title, @slug, @type, @tagline, @description, @price, @original_price, @pages, @status,
          @file_path, @badge, @image_url, @image_config, @toc, @for_whom, @not_for_whom,
          @included_books, @sample_read_url, @sample_drive_url, @theme_color, @updated_at);`,
      {
        id: { type: sql.NVarChar(100), value: p.id },
        title: { type: sql.NVarChar(255), value: p.title ?? '' },
        slug: { type: sql.NVarChar(255), value: p.slug ?? null },
        type: { type: sql.NVarChar(20), value: p.type ?? null },
        tagline: { type: sql.NVarChar(500), value: p.tagline ?? null },
        description: { type: sql.NVarChar(sql.MAX), value: p.description ?? null },
        price: { type: sql.BigInt, value: Number(p.price || 0) },
        original_price: { type: sql.BigInt, value: Number(p.original_price || 0) },
        pages: { type: sql.Int, value: Number(p.pages || 0) },
        status: { type: sql.NVarChar(20), value: p.status ?? 'active' },
        file_path: { type: sql.NVarChar(500), value: p.file_path ?? null },
        badge: { type: sql.NVarChar(255), value: p.badge ?? null },
        image_url: { type: sql.NVarChar(1000), value: p.image_url ?? null },
        image_config: { type: sql.NVarChar(sql.MAX), value: jsonOrNull(p.image_config) },
        toc: { type: sql.NVarChar(sql.MAX), value: jsonOrNull(p.table_of_contents ?? []) },
        for_whom: { type: sql.NVarChar(sql.MAX), value: jsonOrNull(p.for_whom ?? []) },
        not_for_whom: { type: sql.NVarChar(sql.MAX), value: jsonOrNull(p.not_for_whom ?? []) },
        included_books: { type: sql.NVarChar(sql.MAX), value: jsonOrNull(p.included_books) },
        sample_read_url: { type: sql.NVarChar(1000), value: p.sample_read_url ?? null },
        sample_drive_url: { type: sql.NVarChar(1000), value: p.sampleDriveUrl ?? null },
        theme_color: { type: sql.NVarChar(sql.MAX), value: jsonOrNull(p.themeColor) },
        updated_at: { type: sql.NVarChar(50), value: new Date().toISOString() },
      }
    );
  }

  private persistBlog(b: BlogPost) {
    this.run(
      `UPDATE dbo.blogs SET
         slug=@slug, title=@title, excerpt=@excerpt, [content]=@content, author=@author,
         thumbnail_url=@thumbnail_url, image_config=@image_config, cover_gradient=@cover_gradient,
         read_time=@read_time, published_at=@published_at, [status]=@status, tags=@tags,
         linked_product_id=@linked_product_id, updated_at=@updated_at
       WHERE id=@id;
       IF @@ROWCOUNT = 0
       INSERT INTO dbo.blogs
         (id, slug, title, excerpt, [content], author, thumbnail_url, image_config, cover_gradient,
          read_time, published_at, [status], tags, linked_product_id, updated_at)
       VALUES
         (@id, @slug, @title, @excerpt, @content, @author, @thumbnail_url, @image_config, @cover_gradient,
          @read_time, @published_at, @status, @tags, @linked_product_id, @updated_at);`,
      {
        id: { type: sql.NVarChar(100), value: b.id },
        slug: { type: sql.NVarChar(255), value: b.slug ?? null },
        title: { type: sql.NVarChar(500), value: b.title ?? null },
        excerpt: { type: sql.NVarChar(sql.MAX), value: b.excerpt ?? null },
        content: { type: sql.NVarChar(sql.MAX), value: b.content ?? null },
        author: { type: sql.NVarChar(255), value: b.author ?? null },
        thumbnail_url: { type: sql.NVarChar(1000), value: b.thumbnail_url ?? null },
        image_config: { type: sql.NVarChar(sql.MAX), value: jsonOrNull(b.image_config) },
        cover_gradient: { type: sql.NVarChar(255), value: b.coverGradient ?? null },
        read_time: { type: sql.NVarChar(100), value: b.readTime ?? null },
        published_at: { type: sql.NVarChar(50), value: b.publishedAt ?? null },
        status: { type: sql.NVarChar(20), value: b.status ?? null },
        tags: { type: sql.NVarChar(sql.MAX), value: jsonOrNull(b.tags ?? []) },
        linked_product_id: { type: sql.NVarChar(100), value: b.linkedProductId ?? null },
        updated_at: { type: sql.NVarChar(50), value: new Date().toISOString() },
      }
    );
  }

  private persistOrder(o: Order) {
    this.run(
      `UPDATE dbo.orders SET
         order_code=@order_code, customer_name=@customer_name, customer_email=@customer_email,
         product_id=@product_id, product_title=@product_title, amount=@amount,
         original_amount=@original_amount, [status]=@status, created_at=@created_at, paid_at=@paid_at,
         download_token=@download_token, email_sent=@email_sent, payment_details=@payment_details,
         updated_at=@updated_at
       WHERE id=@id;
       IF @@ROWCOUNT = 0
       INSERT INTO dbo.orders
         (id, order_code, customer_name, customer_email, product_id, product_title, amount,
          original_amount, [status], created_at, paid_at, download_token, email_sent, payment_details, updated_at)
       VALUES
         (@id, @order_code, @customer_name, @customer_email, @product_id, @product_title, @amount,
          @original_amount, @status, @created_at, @paid_at, @download_token, @email_sent, @payment_details, @updated_at);`,
      {
        id: { type: sql.NVarChar(80), value: o.id },
        order_code: { type: sql.NVarChar(50), value: o.orderCode ?? null },
        customer_name: { type: sql.NVarChar(255), value: o.customerName ?? null },
        customer_email: { type: sql.NVarChar(255), value: o.customerEmail ?? null },
        product_id: { type: sql.NVarChar(100), value: o.productId ?? null },
        product_title: { type: sql.NVarChar(255), value: o.productTitle ?? null },
        amount: { type: sql.BigInt, value: Number(o.amount || 0) },
        original_amount: { type: sql.BigInt, value: Number(o.originalAmount || 0) },
        status: { type: sql.NVarChar(20), value: o.status ?? 'pending' },
        created_at: { type: sql.NVarChar(50), value: o.createdAt ?? null },
        paid_at: { type: sql.NVarChar(50), value: o.paidAt ?? null },
        download_token: { type: sql.NVarChar(100), value: o.downloadToken ?? null },
        email_sent: { type: sql.Bit, value: !!o.emailSent },
        payment_details: { type: sql.NVarChar(sql.MAX), value: jsonOrNull(o.paymentDetails) },
        updated_at: { type: sql.NVarChar(50), value: new Date().toISOString() },
      }
    );
  }

  private persistEmailLog(e: EmailLog) {
    this.run(
      `DELETE FROM dbo.email_logs WHERE id=@id;
       INSERT INTO dbo.email_logs
         (id, order_code, to_email, customer_name, product_title, download_url, sent_at, [subject], [status], created_at)
       VALUES
         (@id, @order_code, @to_email, @customer_name, @product_title, @download_url, @sent_at, @subject, @status, @created_at);`,
      {
        id: { type: sql.NVarChar(120), value: e.id },
        order_code: { type: sql.NVarChar(50), value: e.orderCode ?? null },
        to_email: { type: sql.NVarChar(255), value: e.toEmail ?? null },
        customer_name: { type: sql.NVarChar(255), value: e.customerName ?? null },
        product_title: { type: sql.NVarChar(255), value: e.productTitle ?? null },
        download_url: { type: sql.NVarChar(1000), value: e.downloadUrl ?? null },
        sent_at: { type: sql.NVarChar(50), value: e.sentAt ?? null },
        subject: { type: sql.NVarChar(500), value: e.subject ?? null },
        status: { type: sql.NVarChar(20), value: e.status ?? null },
        created_at: { type: sql.NVarChar(50), value: e.sentAt ?? new Date().toISOString() },
      }
    );
  }

  private persistConfig(c: SePayConfig) {
    this.run(
      `DELETE FROM dbo.sepay_config WHERE id=1;
       INSERT INTO dbo.sepay_config
         (id, bank_code, account_number, account_name, api_key, webhook_token, webhook_url,
          auto_send_email, test_mode, smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from, smtp_secure, updated_at)
       VALUES
         (1, @bank_code, @account_number, @account_name, @api_key, @webhook_token, @webhook_url,
          @auto_send_email, @test_mode, @smtp_host, @smtp_port, @smtp_user, @smtp_pass, @smtp_from, @smtp_secure, @updated_at);`,
      {
        bank_code: { type: sql.NVarChar(50), value: c.bankCode ?? null },
        account_number: { type: sql.NVarChar(100), value: c.accountNumber ?? null },
        account_name: { type: sql.NVarChar(255), value: c.accountName ?? null },
        api_key: { type: sql.NVarChar(500), value: c.apiKey ?? null },
        webhook_token: { type: sql.NVarChar(500), value: c.webhookToken ?? null },
        webhook_url: { type: sql.NVarChar(500), value: c.webhookUrl ?? null },
        auto_send_email: { type: sql.Bit, value: !!c.autoSendEmail },
        test_mode: { type: sql.Bit, value: !!c.testMode },
        smtp_host: { type: sql.NVarChar(255), value: c.smtpHost ?? null },
        smtp_port: { type: sql.Int, value: c.smtpPort ?? null },
        smtp_user: { type: sql.NVarChar(255), value: c.smtpUser ?? null },
        smtp_pass: { type: sql.NVarChar(500), value: c.smtpPass ?? null },
        smtp_from: { type: sql.NVarChar(255), value: c.smtpFrom ?? null },
        smtp_secure: { type: sql.Bit, value: c.smtpSecure ?? null },
        updated_at: { type: sql.NVarChar(50), value: new Date().toISOString() },
      }
    );
  }

  private persistInquiry(i: SupportInquiry) {
    this.run(
      `DELETE FROM dbo.support_inquiries WHERE id=@id;
       INSERT INTO dbo.support_inquiries (id, [name], email, [message], created_at, [status])
       VALUES (@id, @name, @email, @message, @created_at, @status);`,
      {
        id: { type: sql.NVarChar(80), value: i.id },
        name: { type: sql.NVarChar(255), value: i.name ?? null },
        email: { type: sql.NVarChar(255), value: i.email ?? null },
        message: { type: sql.NVarChar(sql.MAX), value: i.message ?? null },
        created_at: { type: sql.NVarChar(50), value: i.createdAt ?? null },
        status: { type: sql.NVarChar(20), value: i.status ?? 'new' },
      }
    );
  }

  // --- VERSION / REALTIME ---
  private touch(eventType: string) {
    this.data.dataVersion = (this.data.dataVersion || 0) + 1;
    this.notify(eventType);
  }

  private notify(eventType: string) {
    const payload = { type: eventType, version: this.data.dataVersion };
    for (const listener of this.listeners) {
      try {
        listener(payload);
      } catch (err) {
        console.error('[DB] Listener error:', err);
      }
    }
  }

  public subscribe(listener: (event: { type: string; version: number }) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getVersion(): number {
    return this.data.dataVersion || 1;
  }

  // --- PRODUCTS ---
  public getProducts(showAll = false): Product[] {
    if (showAll) return this.data.products;
    return this.data.products.filter((p) => p.status === 'active');
  }

  public getProduct(id: string): Product | undefined {
    return this.data.products.find((p) => p.id === id);
  }

  public addProduct(product: Product): Product {
    this.data.products.unshift(product);
    this.persistProduct(product);
    this.touch('products');
    return product;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.persistProduct(this.data.products[idx]);
    this.touch('products');
    return this.data.products[idx];
  }

  public softDeleteProduct(id: string): Product | null {
    return this.updateProduct(id, { status: 'hidden' });
  }

  // --- BLOGS ---
  public getBlogs(showAll = false): BlogPost[] {
    if (showAll) return this.data.blogs;
    return this.data.blogs.filter((b) => b.status === 'published');
  }

  public getBlog(slugOrId: string): BlogPost | undefined {
    return this.data.blogs.find((b) => b.slug === slugOrId || b.id === slugOrId);
  }

  public addBlog(blog: BlogPost): BlogPost {
    this.data.blogs.unshift(blog);
    this.persistBlog(blog);
    this.touch('blogs');
    return blog;
  }

  public updateBlog(id: string, updates: Partial<BlogPost>): BlogPost | null {
    const idx = this.data.blogs.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    this.data.blogs[idx] = { ...this.data.blogs[idx], ...updates };
    this.persistBlog(this.data.blogs[idx]);
    this.touch('blogs');
    return this.data.blogs[idx];
  }

  public deleteBlog(id: string): boolean {
    const idx = this.data.blogs.findIndex((b) => b.id === id);
    if (idx === -1) return false;
    this.data.blogs.splice(idx, 1);
    this.run('DELETE FROM dbo.blogs WHERE id=@id;', { id: { type: sql.NVarChar(100), value: id } });
    this.touch('blogs');
    return true;
  }

  // --- ORDERS ---
  public getOrders(): Order[] {
    return this.data.orders;
  }

  public getOrderByCode(code: string): Order | undefined {
    return this.data.orders.find((o) => o.orderCode.toLowerCase() === code.toLowerCase());
  }

  public getOrderByDownloadToken(token: string): Order | undefined {
    return this.data.orders.find((o) => o.downloadToken === token);
  }

  public addOrder(order: Order): Order {
    this.data.orders.unshift(order);
    this.persistOrder(order);
    this.touch('orders');
    return order;
  }

  public updateOrder(code: string, updates: Partial<Order>): Order | null {
    const idx = this.data.orders.findIndex((o) => o.orderCode.toLowerCase() === code.toLowerCase());
    if (idx === -1) return null;
    this.data.orders[idx] = { ...this.data.orders[idx], ...updates };
    this.persistOrder(this.data.orders[idx]);
    this.touch('orders');
    return this.data.orders[idx];
  }

  public deleteOrder(code: string): Order | null {
    const idx = this.data.orders.findIndex((o) => o.orderCode.toLowerCase() === code.toLowerCase());
    if (idx === -1) return null;
    const [deleted] = this.data.orders.splice(idx, 1);
    this.run('DELETE FROM dbo.orders WHERE id=@id;', { id: { type: sql.NVarChar(80), value: deleted.id } });
    this.touch('orders');
    return deleted;
  }

  // --- SEPAY CONFIG ---
  public getConfig(): SePayConfig {
    return this.data.sepayConfig;
  }

  public updateConfig(updates: Partial<SePayConfig>): SePayConfig {
    this.data.sepayConfig = { ...this.data.sepayConfig, ...updates };
    this.persistConfig(this.data.sepayConfig);
    this.touch('config');
    return this.data.sepayConfig;
  }

  // --- EMAIL LOGS ---
  public getEmailLogs(): EmailLog[] {
    return this.data.emailLogs;
  }

  public addEmailLog(log: EmailLog) {
    this.data.emailLogs.unshift(log);
    this.persistEmailLog(log);
    this.touch('emails');
  }

  // --- SUPPORT ---
  public getSupportInquiries(): SupportInquiry[] {
    return this.data.supportInquiries;
  }

  public addSupportInquiry(inquiry: SupportInquiry) {
    this.data.supportInquiries.unshift(inquiry);
    this.persistInquiry(inquiry);
    this.touch('support');
  }

  public updateSupportInquiry(id: string, updates: Partial<SupportInquiry>): SupportInquiry | null {
    const idx = this.data.supportInquiries.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.supportInquiries[idx] = { ...this.data.supportInquiries[idx], ...updates };
    this.persistInquiry(this.data.supportInquiries[idx]);
    this.touch('support');
    return this.data.supportInquiries[idx];
  }

  public deleteSupportInquiry(id: string): SupportInquiry | null {
    const idx = this.data.supportInquiries.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    const [deleted] = this.data.supportInquiries.splice(idx, 1);
    this.run('DELETE FROM dbo.support_inquiries WHERE id=@id;', { id: { type: sql.NVarChar(80), value: id } });
    this.touch('support');
    return deleted;
  }
}
