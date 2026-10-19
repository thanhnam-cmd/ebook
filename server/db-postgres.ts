import { Pool } from 'pg';
import { Product, Order, SePayConfig, EmailLog, SupportInquiry, BlogPost } from '../src/types.ts';
import { INITIAL_PRODUCTS, INITIAL_SEPAY_CONFIG } from '../src/data/initialProducts.ts';
import { INITIAL_BLOGS } from '../src/data/initialBlogs.ts';
import type { DatabaseSchema } from './db.ts';

function parseJson<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    try {
      return JSON.parse(trimmed) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

function jsonOrNull(value: unknown): unknown {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

export class PostgresDatabase {
  private data: DatabaseSchema;
  private listeners: ((event: { type: string; version: number }) => void)[] = [];
  private pool: Pool | null = null;
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

  private getPoolConfig() {
    const sslEnabled =
      (process.env.PGSSL || process.env.DATABASE_SSL || 'false').toLowerCase() === 'true';

    if (process.env.DATABASE_URL) {
      return {
        connectionString: process.env.DATABASE_URL,
        ssl: sslEnabled ? { rejectUnauthorized: false } : false,
      };
    }

    return {
      host: process.env.PGHOST || process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.PGPORT || process.env.DB_PORT || 5432),
      database: process.env.PGDATABASE || process.env.DB_NAME || 'ebook_store',
      user: process.env.PGUSER || process.env.DB_USER || 'postgres',
      password: process.env.PGPASSWORD || process.env.DB_PASSWORD || '',
      ssl: sslEnabled ? { rejectUnauthorized: false } : false,
    };
  }

  private async init() {
    try {
      this.pool = new Pool(this.getPoolConfig());
      await this.pool.query('SELECT 1');
      console.log('[DB] Da ket noi PostgreSQL:', process.env.PGDATABASE || process.env.DB_NAME || 'ebook_store');
      await this.ensureTables();
      await this.loadFromDb();
    } catch (err: any) {
      console.error('[DB] Khong the khoi tao PostgreSQL:', err?.message || err);
      console.error('[DB] Hay tao database PostgreSQL va kiem tra bien moi truong DATABASE_URL/PG*.');
    }
  }

  private async ensureTables() {
    if (!this.pool) return;

    const ddl = `
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT,
  type TEXT,
  tagline TEXT,
  description TEXT,
  price BIGINT NOT NULL DEFAULT 0,
  original_price BIGINT NOT NULL DEFAULT 0,
  pages INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  file_path TEXT,
  badge TEXT,
  image_url TEXT,
  image_config JSONB,
  table_of_contents JSONB,
  for_whom JSONB,
  not_for_whom JSONB,
  included_books JSONB,
  sample_read_url TEXT,
  sample_drive_url TEXT,
  theme_color JSONB,
  display_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS blogs (
  id TEXT PRIMARY KEY,
  slug TEXT,
  title TEXT,
  excerpt TEXT,
  content TEXT,
  author TEXT,
  thumbnail_url TEXT,
  image_config JSONB,
  cover_gradient TEXT,
  read_time TEXT,
  published_at TEXT,
  status TEXT,
  tags JSONB,
  linked_product_id TEXT,
  display_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_code TEXT NOT NULL UNIQUE,
  customer_name TEXT,
  customer_email TEXT,
  product_id TEXT REFERENCES products(id),
  product_title TEXT,
  amount BIGINT NOT NULL DEFAULT 0,
  original_amount BIGINT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  download_token TEXT,
  email_sent BOOLEAN NOT NULL DEFAULT FALSE,
  payment_details JSONB,
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS email_logs (
  id TEXT PRIMARY KEY,
  order_code TEXT REFERENCES orders(order_code) ON DELETE CASCADE,
  to_email TEXT,
  customer_name TEXT,
  product_title TEXT,
  download_url TEXT,
  sent_at TIMESTAMPTZ,
  subject TEXT,
  status TEXT,
  created_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS sepay_config (
  id INTEGER PRIMARY KEY,
  bank_code TEXT,
  account_number TEXT,
  account_name TEXT,
  api_key TEXT,
  webhook_token TEXT,
  webhook_url TEXT,
  auto_send_email BOOLEAN NOT NULL DEFAULT TRUE,
  test_mode BOOLEAN NOT NULL DEFAULT FALSE,
  smtp_host TEXT,
  smtp_port INTEGER,
  smtp_user TEXT,
  smtp_pass TEXT,
  smtp_from TEXT,
  smtp_secure BOOLEAN,
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS support_inquiries (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  message TEXT,
  created_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_order_code ON email_logs(order_code);
CREATE INDEX IF NOT EXISTS idx_support_created_at ON support_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
`;

    await this.pool.query(ddl);
  }

  private run(query: string, values: unknown[] = []) {
    if (!this.pool) return;
    this.writeChain = this.writeChain
      .then(async () => {
        if (!this.pool) return;
        await this.pool.query(query, values);
      })
      .catch((err) => {
        console.error('[DB] Loi ghi PostgreSQL:', err?.message || err);
      });
  }

  private async loadFromDb() {
    if (!this.pool) return;

    const [prodRes, blogRes, orderRes, emailRes, cfgRes, supRes] = await Promise.all([
      this.pool.query('SELECT * FROM products ORDER BY display_order ASC, id ASC'),
      this.pool.query('SELECT * FROM blogs ORDER BY display_order ASC, published_at DESC'),
      this.pool.query('SELECT * FROM orders ORDER BY created_at DESC NULLS LAST'),
      this.pool.query('SELECT * FROM email_logs ORDER BY sent_at DESC NULLS LAST'),
      this.pool.query('SELECT * FROM sepay_config WHERE id = 1'),
      this.pool.query('SELECT * FROM support_inquiries ORDER BY created_at DESC NULLS LAST'),
    ]);

    this.data.products = prodRes.rows.map((r) => this.rowToProduct(r));
    this.data.blogs = blogRes.rows.map((r) => this.rowToBlog(r));
    this.data.orders = orderRes.rows.map((r) => this.rowToOrder(r));
    this.data.emailLogs = emailRes.rows.map((r) => this.rowToEmailLog(r));
    this.data.supportInquiries = supRes.rows.map((r) => this.rowToInquiry(r));

    if (cfgRes.rows.length > 0) {
      this.data.sepayConfig = this.rowToConfig(cfgRes.rows[0]);
    } else {
      this.persistConfig(this.data.sepayConfig);
    }

    if (this.data.products.length === 0 && INITIAL_PRODUCTS.length > 0) {
      console.log('[DB] Bang products trong -> seed du lieu san pham ban dau.');
      this.data.products = INITIAL_PRODUCTS.map((p) => ({ ...p }));
      this.data.products.forEach((p) => this.persistProduct(p));
    }

    if (this.data.blogs.length === 0 && INITIAL_BLOGS.length > 0) {
      this.data.blogs = INITIAL_BLOGS.map((b) => ({ ...b }));
      this.data.blogs.forEach((b) => this.persistBlog(b));
    }

    console.log(
      `[DB] Nap xong PostgreSQL: ${this.data.products.length} san pham, ${this.data.blogs.length} blog, ${this.data.orders.length} don hang.`,
    );
  }

  private rowToProduct(r: Record<string, any>): Product {
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
      display_order: Number(r.display_order || 0),
      themeColor: parseJson(r.theme_color, undefined as any),
    };
  }

  private rowToBlog(r: Record<string, any>): BlogPost {
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
      display_order: Number(r.display_order || 0),
    };
  }

  private rowToOrder(r: Record<string, any>): Order {
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
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      paidAt: r.paid_at ? new Date(r.paid_at).toISOString() : undefined,
      downloadToken: r.download_token || '',
      emailSent: !!r.email_sent,
      paymentDetails: parseJson(r.payment_details, undefined as any),
    };
  }

  private rowToEmailLog(r: Record<string, any>): EmailLog {
    return {
      id: r.id,
      orderCode: r.order_code || '',
      toEmail: r.to_email || '',
      customerName: r.customer_name || '',
      productTitle: r.product_title || '',
      downloadUrl: r.download_url || '',
      sentAt: r.sent_at ? new Date(r.sent_at).toISOString() : '',
      subject: r.subject || '',
      status: r.status || 'pending',
    };
  }

  private rowToConfig(r: Record<string, any>): SePayConfig {
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

  private rowToInquiry(r: Record<string, any>): SupportInquiry {
    return {
      id: r.id,
      name: r.name || '',
      email: r.email || '',
      message: r.message || '',
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : '',
      status: r.status || 'new',
    };
  }

  private persistProduct(p: Product) {
    this.run(
      `INSERT INTO products (
        id, title, slug, type, tagline, description, price, original_price, pages, status,
        file_path, badge, image_url, image_config, table_of_contents, for_whom, not_for_whom,
        included_books, sample_read_url, sample_drive_url, theme_color, display_order, updated_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,
        $18,$19,$20,$21,$22,$23
      )
      ON CONFLICT (id) DO UPDATE SET
        title=EXCLUDED.title,
        slug=EXCLUDED.slug,
        type=EXCLUDED.type,
        tagline=EXCLUDED.tagline,
        description=EXCLUDED.description,
        price=EXCLUDED.price,
        original_price=EXCLUDED.original_price,
        pages=EXCLUDED.pages,
        status=EXCLUDED.status,
        file_path=EXCLUDED.file_path,
        badge=EXCLUDED.badge,
        image_url=EXCLUDED.image_url,
        image_config=EXCLUDED.image_config,
        table_of_contents=EXCLUDED.table_of_contents,
        for_whom=EXCLUDED.for_whom,
        not_for_whom=EXCLUDED.not_for_whom,
        included_books=EXCLUDED.included_books,
        sample_read_url=EXCLUDED.sample_read_url,
        sample_drive_url=EXCLUDED.sample_drive_url,
        theme_color=EXCLUDED.theme_color,
        display_order=EXCLUDED.display_order,
        updated_at=EXCLUDED.updated_at;`,
      [
        p.id,
        p.title ?? '',
        p.slug ?? null,
        p.type ?? null,
        p.tagline ?? null,
        p.description ?? null,
        Number(p.price || 0),
        Number(p.original_price || 0),
        Number(p.pages || 0),
        p.status ?? 'active',
        p.file_path ?? null,
        p.badge ?? null,
        p.image_url ?? null,
        jsonOrNull(p.image_config),
        jsonOrNull(p.table_of_contents ?? []),
        jsonOrNull(p.for_whom ?? []),
        jsonOrNull(p.not_for_whom ?? []),
        jsonOrNull(p.included_books),
        p.sample_read_url ?? null,
        p.sampleDriveUrl ?? null,
        jsonOrNull(p.themeColor),
        Number(p.display_order || 0),
        new Date().toISOString(),
      ],
    );
  }

  private persistBlog(b: BlogPost) {
    this.run(
      `INSERT INTO blogs (
        id, slug, title, excerpt, content, author, thumbnail_url, image_config, cover_gradient,
        read_time, published_at, status, tags, linked_product_id, display_order, updated_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,
        $10,$11,$12,$13,$14,$15,$16
      )
      ON CONFLICT (id) DO UPDATE SET
        slug=EXCLUDED.slug,
        title=EXCLUDED.title,
        excerpt=EXCLUDED.excerpt,
        content=EXCLUDED.content,
        author=EXCLUDED.author,
        thumbnail_url=EXCLUDED.thumbnail_url,
        image_config=EXCLUDED.image_config,
        cover_gradient=EXCLUDED.cover_gradient,
        read_time=EXCLUDED.read_time,
        published_at=EXCLUDED.published_at,
        status=EXCLUDED.status,
        tags=EXCLUDED.tags,
        linked_product_id=EXCLUDED.linked_product_id,
        display_order=EXCLUDED.display_order,
        updated_at=EXCLUDED.updated_at;`,
      [
        b.id,
        b.slug ?? null,
        b.title ?? null,
        b.excerpt ?? null,
        b.content ?? null,
        b.author ?? null,
        b.thumbnail_url ?? null,
        jsonOrNull(b.image_config),
        b.coverGradient ?? null,
        b.readTime ?? null,
        b.publishedAt ?? null,
        b.status ?? 'draft',
        jsonOrNull(b.tags ?? []),
        b.linkedProductId ?? null,
        Number(b.display_order || 0),
        new Date().toISOString(),
      ],
    );
  }

  private persistOrder(o: Order) {
    this.run(
      `INSERT INTO orders (
        id, order_code, customer_name, customer_email, product_id, product_title, amount,
        original_amount, status, created_at, paid_at, download_token, email_sent, payment_details, updated_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,
        $8,$9,$10,$11,$12,$13,$14,$15
      )
      ON CONFLICT (id) DO UPDATE SET
        order_code=EXCLUDED.order_code,
        customer_name=EXCLUDED.customer_name,
        customer_email=EXCLUDED.customer_email,
        product_id=EXCLUDED.product_id,
        product_title=EXCLUDED.product_title,
        amount=EXCLUDED.amount,
        original_amount=EXCLUDED.original_amount,
        status=EXCLUDED.status,
        created_at=EXCLUDED.created_at,
        paid_at=EXCLUDED.paid_at,
        download_token=EXCLUDED.download_token,
        email_sent=EXCLUDED.email_sent,
        payment_details=EXCLUDED.payment_details,
        updated_at=EXCLUDED.updated_at;`,
      [
        o.id,
        o.orderCode ?? null,
        o.customerName ?? null,
        o.customerEmail ?? null,
        o.productId ?? null,
        o.productTitle ?? null,
        Number(o.amount || 0),
        Number(o.originalAmount || 0),
        o.status ?? 'pending',
        o.createdAt ?? null,
        o.paidAt ?? null,
        o.downloadToken ?? null,
        !!o.emailSent,
        jsonOrNull(o.paymentDetails),
        new Date().toISOString(),
      ],
    );
  }

  private persistEmailLog(e: EmailLog) {
    this.run(
      `INSERT INTO email_logs (
        id, order_code, to_email, customer_name, product_title, download_url, sent_at, subject, status, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      ON CONFLICT (id) DO UPDATE SET
        order_code=EXCLUDED.order_code,
        to_email=EXCLUDED.to_email,
        customer_name=EXCLUDED.customer_name,
        product_title=EXCLUDED.product_title,
        download_url=EXCLUDED.download_url,
        sent_at=EXCLUDED.sent_at,
        subject=EXCLUDED.subject,
        status=EXCLUDED.status,
        created_at=EXCLUDED.created_at;`,
      [
        e.id,
        e.orderCode ?? null,
        e.toEmail ?? null,
        e.customerName ?? null,
        e.productTitle ?? null,
        e.downloadUrl ?? null,
        e.sentAt ?? null,
        e.subject ?? null,
        e.status ?? null,
        e.sentAt ?? new Date().toISOString(),
      ],
    );
  }

  private persistConfig(c: SePayConfig) {
    this.run(
      `INSERT INTO sepay_config (
        id, bank_code, account_number, account_name, api_key, webhook_token, webhook_url,
        auto_send_email, test_mode, smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from, smtp_secure, updated_at
      ) VALUES (
        1,$1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,$11,$12,$13,$14,$15
      )
      ON CONFLICT (id) DO UPDATE SET
        bank_code=EXCLUDED.bank_code,
        account_number=EXCLUDED.account_number,
        account_name=EXCLUDED.account_name,
        api_key=EXCLUDED.api_key,
        webhook_token=EXCLUDED.webhook_token,
        webhook_url=EXCLUDED.webhook_url,
        auto_send_email=EXCLUDED.auto_send_email,
        test_mode=EXCLUDED.test_mode,
        smtp_host=EXCLUDED.smtp_host,
        smtp_port=EXCLUDED.smtp_port,
        smtp_user=EXCLUDED.smtp_user,
        smtp_pass=EXCLUDED.smtp_pass,
        smtp_from=EXCLUDED.smtp_from,
        smtp_secure=EXCLUDED.smtp_secure,
        updated_at=EXCLUDED.updated_at;`,
      [
        c.bankCode ?? null,
        c.accountNumber ?? null,
        c.accountName ?? null,
        c.apiKey ?? null,
        c.webhookToken ?? null,
        c.webhookUrl ?? null,
        !!c.autoSendEmail,
        !!c.testMode,
        c.smtpHost ?? null,
        c.smtpPort ?? null,
        c.smtpUser ?? null,
        c.smtpPass ?? null,
        c.smtpFrom ?? null,
        c.smtpSecure ?? null,
        new Date().toISOString(),
      ],
    );
  }

  private persistInquiry(i: SupportInquiry) {
    this.run(
      `INSERT INTO support_inquiries (id, name, email, message, created_at, status)
      VALUES ($1,$2,$3,$4,$5,$6)
      ON CONFLICT (id) DO UPDATE SET
        name=EXCLUDED.name,
        email=EXCLUDED.email,
        message=EXCLUDED.message,
        created_at=EXCLUDED.created_at,
        status=EXCLUDED.status;`,
      [i.id, i.name ?? null, i.email ?? null, i.message ?? null, i.createdAt ?? null, i.status ?? 'new'],
    );
  }

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

  public async reorderProducts(ids: string[]): Promise<boolean> {
    if (!this.pool) return false;
    try {
      // Update in-memory first for immediate sync
      const newProducts: Product[] = [];
      ids.forEach((id, index) => {
        const p = this.data.products.find(x => x.id === id);
        if (p) {
          p.display_order = index;
          newProducts.push(p);
        }
      });
      this.data.products.forEach(p => {
        if (!ids.includes(p.id)) {
          p.display_order = newProducts.length;
          newProducts.push(p);
        }
      });
      this.data.products = newProducts;

      // Update in DB
      for (let i = 0; i < ids.length; i++) {
        this.run('UPDATE products SET display_order = $1 WHERE id = $2', [i, ids[i]]);
      }
      this.touch('products');
      return true;
    } catch (err) {
      console.error('[DB] Reorder products error:', err);
      return false;
    }
  }

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
    this.run('DELETE FROM blogs WHERE id = $1;', [id]);
    this.touch('blogs');
    return true;
  }

  public async reorderBlogs(ids: string[]): Promise<boolean> {
    if (!this.pool) return false;
    try {
      const newBlogs: BlogPost[] = [];
      ids.forEach((id, index) => {
        const b = this.data.blogs.find(x => x.id === id);
        if (b) {
          b.display_order = index;
          newBlogs.push(b);
        }
      });
      this.data.blogs.forEach(b => {
        if (!ids.includes(b.id)) {
          b.display_order = newBlogs.length;
          newBlogs.push(b);
        }
      });
      this.data.blogs = newBlogs;

      for (let i = 0; i < ids.length; i++) {
        this.run('UPDATE blogs SET display_order = $1 WHERE id = $2', [i, ids[i]]);
      }
      this.touch('blogs');
      return true;
    } catch (err) {
      console.error('[DB] Reorder blogs error:', err);
      return false;
    }
  }

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
    this.run('DELETE FROM orders WHERE id = $1;', [deleted.id]);
    this.touch('orders');
    return deleted;
  }

  public getConfig(): SePayConfig {
    return this.data.sepayConfig;
  }

  public updateConfig(updates: Partial<SePayConfig>): SePayConfig {
    this.data.sepayConfig = { ...this.data.sepayConfig, ...updates };
    this.persistConfig(this.data.sepayConfig);
    this.touch('config');
    return this.data.sepayConfig;
  }

  public getEmailLogs(): EmailLog[] {
    return this.data.emailLogs;
  }

  public addEmailLog(log: EmailLog) {
    this.data.emailLogs.unshift(log);
    this.persistEmailLog(log);
    this.touch('emails');
  }

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
    this.run('DELETE FROM support_inquiries WHERE id = $1;', [id]);
    this.touch('support');
    return deleted;
  }
}
