import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product, Order, SePayConfig, EmailLog, SupportInquiry, BlogPost } from '../src/types.ts';
import { INITIAL_PRODUCTS, INITIAL_SEPAY_CONFIG } from '../src/data/initialProducts.ts';
import { INITIAL_BLOGS } from '../src/data/initialBlogs.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export interface DatabaseSchema {
  products: Product[];
  blogs: BlogPost[];
  orders: Order[];
  sepayConfig: SePayConfig;
  emailLogs: EmailLog[];
  supportInquiries: SupportInquiry[];
  dataVersion: number;
}

class PersistentDatabase {
  private data: DatabaseSchema;
  private listeners: ((event: { type: string; version: number }) => void)[] = [];

  constructor() {
    this.data = this.loadInitialData();
  }

  private loadInitialData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        console.log(`[Database] Loaded persistent data from ${DB_FILE}`);
        return {
          products: parsed.products || [...INITIAL_PRODUCTS],
          blogs: parsed.blogs || [...INITIAL_BLOGS],
          orders: parsed.orders || [],
          sepayConfig: parsed.sepayConfig || { ...INITIAL_SEPAY_CONFIG },
          emailLogs: parsed.emailLogs || [],
          supportInquiries: parsed.supportInquiries || [],
          dataVersion: parsed.dataVersion || 1,
        };
      }
    } catch (err) {
      console.error('[Database] Failed to read database.json, initializing fresh data:', err);
    }

    // Default Seed Data
    const seedOrder: Order = {
      id: 'order_seed_01',
      orderCode: 'MM1001',
      customerName: 'Trần Văn Hoàng',
      customerEmail: 'hoang.tran@gmail.com',
      productId: 'combo-bo-ba-mat-ma',
      productTitle: 'Combo Trọn Bộ Ba Mật Mã',
      amount: 286000,
      originalAmount: 554000,
      status: 'paid',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      paidAt: new Date(Date.now() - 3600000 * 4.9).toISOString(),
      downloadToken: 'dl_seed_1001',
      emailSent: true,
      paymentDetails: {
        gateway: 'MBBank',
        accountNumber: '0987654321',
        transferAmount: 286000,
        referenceCode: 'MB9823411',
        transactionId: 104829,
        content: 'MM1001 Tran Van Hoang chuyen khoan',
      },
    };

    const seedEmail: EmailLog = {
      id: 'email_seed_01',
      orderCode: 'MM1001',
      toEmail: 'hoang.tran@gmail.com',
      customerName: 'Trần Văn Hoàng',
      productTitle: 'Combo Trọn Bộ Ba Mật Mã',
      downloadUrl: `/api/download/dl_seed_1001`,
      sentAt: new Date(Date.now() - 3600000 * 4.9).toISOString(),
      subject: '[EBOOK STORE] Tài liệu của bạn đã sẵn sàng - Combo Trọn Bộ Ba Mật Mã',
      status: 'delivered',
    };

    const initialSchema: DatabaseSchema = {
      products: [...INITIAL_PRODUCTS],
      blogs: [...INITIAL_BLOGS],
      orders: [seedOrder],
      sepayConfig: { ...INITIAL_SEPAY_CONFIG },
      emailLogs: [seedEmail],
      supportInquiries: [],
      dataVersion: 1,
    };

    this.saveToDisk(initialSchema);
    return initialSchema;
  }

  private saveToDisk(schemaToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data = schemaToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Database] Failed to write database.json:', err);
    }
  }

  private touch(eventType: string) {
    this.data.dataVersion = (this.data.dataVersion || 0) + 1;
    this.saveToDisk();
    this.notify(eventType);
  }

  private notify(eventType: string) {
    const payload = { type: eventType, version: this.data.dataVersion };
    for (const listener of this.listeners) {
      try {
        listener(payload);
      } catch (err) {
        console.error('[Database] Listener error:', err);
      }
    }
  }

  public subscribe(listener: (event: { type: string; version: number }) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getVersion(): number {
    return this.data.dataVersion || 1;
  }

  // --- PRODUCTS ---
  public getProducts(showAll = false): Product[] {
    if (showAll) return this.data.products;
    return this.data.products.filter(p => p.status === 'active');
  }

  public getProduct(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public addProduct(product: Product): Product {
    this.data.products.unshift(product);
    this.touch('products');
    return product;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.touch('products');
    return this.data.products[idx];
  }

  public softDeleteProduct(id: string): Product | null {
    return this.updateProduct(id, { status: 'hidden' });
  }

  // --- BLOGS ---
  public getBlogs(showAll = false): BlogPost[] {
    if (showAll) return this.data.blogs;
    return this.data.blogs.filter(b => b.status === 'published');
  }

  public getBlog(slugOrId: string): BlogPost | undefined {
    return this.data.blogs.find(b => b.slug === slugOrId || b.id === slugOrId);
  }

  public addBlog(blog: BlogPost): BlogPost {
    this.data.blogs.unshift(blog);
    this.touch('blogs');
    return blog;
  }

  public updateBlog(id: string, updates: Partial<BlogPost>): BlogPost | null {
    const idx = this.data.blogs.findIndex(b => b.id === id);
    if (idx === -1) return null;
    this.data.blogs[idx] = { ...this.data.blogs[idx], ...updates };
    this.touch('blogs');
    return this.data.blogs[idx];
  }

  public deleteBlog(id: string): boolean {
    const idx = this.data.blogs.findIndex(b => b.id === id);
    if (idx === -1) return false;
    this.data.blogs.splice(idx, 1);
    this.touch('blogs');
    return true;
  }

  // --- ORDERS ---
  public getOrders(): Order[] {
    return this.data.orders;
  }

  public getOrderByCode(code: string): Order | undefined {
    return this.data.orders.find(o => o.orderCode.toLowerCase() === code.toLowerCase());
  }

  public getOrderByDownloadToken(token: string): Order | undefined {
    return this.data.orders.find(o => o.downloadToken === token);
  }

  public addOrder(order: Order): Order {
    this.data.orders.unshift(order);
    this.touch('orders');
    return order;
  }

  public updateOrder(code: string, updates: Partial<Order>): Order | null {
    const idx = this.data.orders.findIndex(o => o.orderCode.toLowerCase() === code.toLowerCase());
    if (idx === -1) return null;
    this.data.orders[idx] = { ...this.data.orders[idx], ...updates };
    this.touch('orders');
    return this.data.orders[idx];
  }

  // --- SEPAY CONFIG ---
  public getConfig(): SePayConfig {
    return this.data.sepayConfig;
  }

  public updateConfig(updates: Partial<SePayConfig>): SePayConfig {
    this.data.sepayConfig = { ...this.data.sepayConfig, ...updates };
    this.touch('config');
    return this.data.sepayConfig;
  }

  // --- EMAIL LOGS ---
  public getEmailLogs(): EmailLog[] {
    return this.data.emailLogs;
  }

  public addEmailLog(log: EmailLog) {
    this.data.emailLogs.unshift(log);
    this.touch('emails');
  }

  // --- SUPPORT ---
  public getSupportInquiries(): SupportInquiry[] {
    return this.data.supportInquiries;
  }

  public addSupportInquiry(inquiry: SupportInquiry) {
    this.data.supportInquiries.unshift(inquiry);
    this.touch('support');
  }
}

export const db = new PersistentDatabase();
