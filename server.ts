import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { db } from './server/db.ts';
import { Product, Order, EmailLog, SupportInquiry, SePayWebhookPayload, BlogPost } from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Helper: Generate Unique Order Code (e.g. MM1024, MM1025)
let orderCounter = 1024 + db.getOrders().length;
function generateOrderCode(): string {
  return `MM${orderCounter++}`;
}

// Helper: Send Ebook Delivery Email via SMTP (nodemailer)
async function sendEbookEmail(order: Order, product: Product) {
  const config = db.getConfig();
  const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
  const downloadUrl = `${baseUrl}/api/download/${order.downloadToken}`;

  const emailLog: EmailLog = {
    id: `email_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    orderCode: order.orderCode,
    toEmail: order.customerEmail,
    customerName: order.customerName,
    productTitle: product.title,
    downloadUrl,
    sentAt: new Date().toISOString(),
    subject: `[ĐĂNG TRÍ] Tải tài liệu ngay: ${product.title} (Mã đơn: ${order.orderCode})`,
    status: 'pending',
  };

  // Build email HTML with product name, code, and download link
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b;">
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 22px;">Cảm ơn bạn đã mua ebook!</h1>
      </div>
      <div style="background: #fff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">Xin chào <strong>${order.customerName}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px;">Đơn hàng của bạn đã được xác nhận thanh toán thành công. Dưới đây là thông tin tài liệu bạn đã mua:</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
          <table style="width: 100%; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; width: 40%;">Tên sản phẩm:</td>
              <td style="padding: 6px 0; font-weight: 700; color: #1e293b;">${product.title}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Mã đơn hàng:</td>
              <td style="padding: 6px 0; font-weight: 700; color: #2563eb; font-family: monospace;">${order.orderCode}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Số tiền:</td>
              <td style="padding: 6px 0; font-weight: 700; color: #1e293b;">${order.amount.toLocaleString('vi-VN')} ₫</td>
            </tr>
          </table>
        </div>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${downloadUrl}" style="display: inline-block; background: #2563eb; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 16px;">Tải ebook ngay</a>
        </div>
        <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0;">
          Nếu nút trên không hoạt động, hãy copy và dán link này vào trình duyệt:<br>
          <code style="background: #f1f5f9; padding: 4px 8px; border-radius: 4px; word-break: break-all;">${downloadUrl}</code>
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
        <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0;">
          Đây là email tự động. Vui lòng không trả lời. Nếu bạn chưa nhận được tài liệu sau 1 giờ, hãy liên hệ qua Zalo.<br>
          © ĐĂNG TRÍ — Mật Mã tri thức thực chiến.
        </p>
      </div>
    </div>
  `;

  // Try to send via SMTP if configured
  const smtpHost = config.smtpHost || process.env.SMTP_HOST;
  const smtpPort = config.smtpPort || Number(process.env.SMTP_PORT) || 587;
  const smtpUser = config.smtpUser || process.env.SMTP_USER;
  const smtpPass = config.smtpPass || process.env.SMTP_PASS;
  const smtpFrom = config.smtpFrom || process.env.SMTP_FROM || smtpUser;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: config.smtpSecure ?? smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
        tls: { rejectUnauthorized: false },
      });

      await transporter.sendMail({
        from: smtpFrom,
        to: order.customerEmail,
        subject: emailLog.subject,
        html,
      });

      emailLog.status = 'delivered';
      db.addEmailLog(emailLog);
      db.updateOrder(order.orderCode, { emailSent: true });
      console.log(`[Email] Sent ebook to ${order.customerEmail} for order ${order.orderCode}`);
      return;
    } catch (err) {
      console.error(`[Email] SMTP send failed for order ${order.orderCode}:`, err);
      emailLog.status = 'failed';
    }
  } else {
    console.warn(`[Email] SMTP not configured. Order ${order.orderCode} marked as pending. Configure SMTP in Admin Settings or .env (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS).`);
  }

  // Fallback: log email and mark pending (admin can resend later)
  db.addEmailLog(emailLog);
  db.updateOrder(order.orderCode, { emailSent: emailLog.status === 'delivered' });
}

// ==========================================
// REAL-TIME SYNCHRONIZATION (SSE & VERSION)
// ==========================================

// SSE Stream for real-time synchronization between User & Admin
app.get('/api/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Flush headers if supported
  if (typeof (res as any).flushHeaders === 'function') {
    (res as any).flushHeaders();
  }

  // Send current version immediately
  res.write(`data: ${JSON.stringify({ type: 'init', version: db.getVersion() })}\n\n`);

  const unsubscribe = db.subscribe((event) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  });

  // Heartbeat to keep connection alive
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
});

// Version check for polling
app.get('/api/sync-version', (req: Request, res: Response) => {
  return res.json({ version: db.getVersion() });
});

// ==========================================
// API ROUTES
// ==========================================

// 1. PRODUCTS API
app.get('/api/products', (req: Request, res: Response) => {
  const showAll = req.query.all === 'true';
  return res.json(db.getProducts(showAll));
});

app.post('/api/products', (req: Request, res: Response) => {
  const newProduct: Product = {
    ...req.body,
    id: req.body.id || `prod_${Date.now()}`,
    slug: req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  };
  const created = db.addProduct(newProduct);
  return res.status(201).json(created);
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateProduct(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json(updated);
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.softDeleteProduct(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json({ success: true, message: 'Product hidden successfully', product: deleted });
});

// 1.5. BLOGS API
app.get('/api/blogs', (req: Request, res: Response) => {
  const showAll = req.query.all === 'true';
  return res.json(db.getBlogs(showAll));
});

app.get('/api/blogs/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const post = db.getBlog(slug);
  if (!post) {
    return res.status(404).json({ error: 'Bài viết không tồn tại' });
  }
  return res.json(post);
});

app.post('/api/blogs', (req: Request, res: Response) => {
  const newBlog: BlogPost = {
    ...req.body,
    id: req.body.id || `blog_${Date.now()}`,
    slug: req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    publishedAt: req.body.publishedAt || new Date().toISOString().split('T')[0],
    status: req.body.status || 'published',
  };
  const created = db.addBlog(newBlog);
  return res.status(201).json(created);
});

app.put('/api/blogs/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateBlog(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Bài viết không tồn tại' });
  }
  return res.json(updated);
});

app.delete('/api/blogs/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const success = db.deleteBlog(id);
  if (!success) {
    return res.status(404).json({ error: 'Bài viết không tồn tại' });
  }
  return res.json({ success: true, message: 'Đã xóa bài viết' });
});

// 2. ORDERS API (GUEST CHECKOUT)
app.post('/api/orders', (req: Request, res: Response) => {
  const { customerName, customerEmail, productId } = req.body;

  if (!customerName || !customerEmail || !productId) {
    return res.status(400).json({ error: 'Vui lòng cung cấp Họ tên, Email và Sản phẩm.' });
  }

  const product = db.getProduct(productId);
  if (!product) {
    return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
  }

  const orderCode = generateOrderCode();
  const downloadToken = `dl_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const newOrder: Order = {
    id: `ord_${Date.now()}`,
    orderCode,
    customerName: customerName.trim(),
    customerEmail: customerEmail.trim().toLowerCase(),
    productId: product.id,
    productTitle: product.title,
    amount: product.price,
    originalAmount: product.original_price,
    status: 'pending',
    createdAt: new Date().toISOString(),
    downloadToken,
    emailSent: false,
  };

  db.addOrder(newOrder);
  const sepayConfig = db.getConfig();

  // Return QR code URLs (Both SePay dynamic QR and VietQR standard)
  const sepayQrUrl = `https://qr.sepay.vn/img?acc=${encodeURIComponent(sepayConfig.accountNumber)}&bank=${encodeURIComponent(sepayConfig.bankCode)}&amount=${newOrder.amount}&des=${encodeURIComponent(newOrder.orderCode)}`;
  const vietQrUrl = `https://img.vietqr.io/image/${sepayConfig.bankCode}-${sepayConfig.accountNumber}-compact2.png?amount=${newOrder.amount}&addInfo=${encodeURIComponent(newOrder.orderCode)}&accountName=${encodeURIComponent(sepayConfig.accountName)}`;

  return res.status(201).json({
    order: newOrder,
    bankInfo: {
      bankCode: sepayConfig.bankCode,
      accountNumber: sepayConfig.accountNumber,
      accountName: sepayConfig.accountName,
      amount: newOrder.amount,
      orderCode: newOrder.orderCode,
      sepayQrUrl,
      vietQrUrl,
    },
  });
});

// Check single order status (used by client polling)
app.get('/api/orders/:code', (req: Request, res: Response) => {
  const { code } = req.params;
  const order = db.getOrderByCode(code);
  if (!order) {
    return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
  }

  const product = db.getProduct(order.productId);

  return res.json({
    order,
    product,
  });
});

// 3. SEPAY LIVE API INTEGRATION & AUTOMATIC RECONCILIATION
async function syncSePayTransactions() {
  const sepayConfig = db.getConfig();
  const token = sepayConfig.apiKey || sepayConfig.webhookToken;
  if (!token) return { success: false, message: 'Chưa cấu hình SePay API Token' };

  try {
    const res = await fetch('https://my.sepay.vn/userapi/transactions/list?limit=50', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.warn(`[SePay Sync] SePay API responded with HTTP ${res.status}`);
      return { success: false, status: res.status, message: 'Lỗi xác thực SePay API' };
    }

    const data: any = await res.json();
    const transactions = data.transactions || [];
    let updatedCount = 0;
    const orders = db.getOrders();

    for (const t of transactions) {
      const content = (t.transaction_content || '').toUpperCase();
      const amountIn = parseFloat(t.amount_in || '0');

      // Match pending or need_check orders
      const matchedOrder = orders.find(
        o => (o.status === 'pending' || o.status === 'need_check') && content.includes(o.orderCode.toUpperCase())
      );

      if (matchedOrder && amountIn >= matchedOrder.amount) {
        const paymentDetails = {
          gateway: t.bank_brand_name || sepayConfig.bankCode,
          accountNumber: t.account_number || sepayConfig.accountNumber,
          transferAmount: amountIn,
          referenceCode: t.reference_number || `REF_${t.id}`,
          transactionId: t.id,
          content: t.transaction_content,
        };

        const updated = db.updateOrder(matchedOrder.orderCode, {
          status: 'paid',
          paidAt: t.transaction_date || new Date().toISOString(),
          paymentDetails,
        });

        const product = db.getProduct(matchedOrder.productId);
        if (product && sepayConfig.autoSendEmail && updated && !matchedOrder.emailSent) {
          await sendEbookEmail(updated, product);
        }

        updatedCount++;
        console.log(`[SePay Sync] Order ${matchedOrder.orderCode} verified and marked PAID via SePay Live API!`);
      }
    }

    return {
      success: true,
      totalTransactions: transactions.length,
      updatedOrders: updatedCount,
      transactions: transactions.slice(0, 5),
    };
  } catch (err) {
    console.error('[SePay Sync] Network error connecting to SePay:', err);
    return { success: false, error: String(err) };
  }
}

// Check single order against SePay Live API
app.get('/api/sepay/check-order/:code', async (req: Request, res: Response) => {
  const { code } = req.params;
  // Trigger sync first to pick up newest transactions
  await syncSePayTransactions();
  const order = db.getOrderByCode(code);
  if (!order) {
    return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
  }
  const product = db.getProduct(order.productId);
  return res.json({ order, product });
});

// Trigger manual SePay sync (from Admin or Checkout)
app.post('/api/sepay/sync', async (req: Request, res: Response) => {
  const result = await syncSePayTransactions();
  return res.json(result);
});

// Test SePay API Status & Bank info
app.get('/api/sepay/status', async (req: Request, res: Response) => {
  const sepayConfig = db.getConfig();
  const token = sepayConfig.apiKey || sepayConfig.webhookToken;
  try {
    const [txRes, bankRes] = await Promise.all([
      fetch('https://my.sepay.vn/userapi/transactions/list?limit=1', {
        headers: { 'Authorization': `Bearer ${token}` },
      }),
      fetch('https://my.sepay.vn/userapi/bankaccounts/list', {
        headers: { 'Authorization': `Bearer ${token}` },
      }),
    ]);

    const txOk = txRes.ok;
    const bankData = bankRes.ok ? await bankRes.json() : null;

    return res.json({
      connected: txOk,
      statusCode: txRes.status,
      bankAccounts: bankData?.bankaccounts || [],
      config: {
        bankCode: sepayConfig.bankCode,
        accountNumber: sepayConfig.accountNumber,
        accountName: sepayConfig.accountName,
        apiKeyMasked: token ? `${token.substring(0, 8)}...${token.slice(-6)}` : 'Chưa thiết lập',
      },
    });
  } catch (err) {
    return res.json({
      connected: false,
      error: String(err),
      config: {
        bankCode: sepayConfig.bankCode,
        accountNumber: sepayConfig.accountNumber,
        accountName: sepayConfig.accountName,
      },
    });
  }
});

// 3. SEPAY WEBHOOK INTEGRATION & AUTOMATIC RECONCILIATION
app.post('/api/sepay/webhook', async (req: Request, res: Response) => {
  const payload: SePayWebhookPayload = req.body;
  const authHeader = (req.headers.authorization || '').trim();
  const sepayConfig = db.getConfig();

  // Verify Webhook Token if configured
  const token = sepayConfig.apiKey || sepayConfig.webhookToken;
  if (token && token !== 'none') {
    const isApiKey = authHeader === `Apikey ${token}`;
    const isBearer = authHeader === `Bearer ${token}`;
    if (!isApiKey && !isBearer) {
      console.warn('[SePay Webhook] Unauthorized attempt:', authHeader);
      if (!sepayConfig.testMode) {
        return res.status(401).json({ error: 'Unauthorized: Invalid SePay API Token' });
      }
    }
  }

  const { content, transferAmount, id, gateway, referenceCode, accountNumber } = payload;
  console.log('[SePay Webhook] Received:', { id, transferAmount, content });

  if (!content || typeof transferAmount !== 'number') {
    return res.status(400).json({ error: 'Invalid payload: missing content or transferAmount' });
  }

  // Extract order code from content
  const contentUpper = content.toUpperCase();
  const matchedOrder = db.getOrders().find(o => contentUpper.includes(o.orderCode.toUpperCase()));

  if (!matchedOrder) {
    console.warn(`[SePay Webhook] No matching order found for content: "${content}"`);
    return res.json({
      success: false,
      message: 'Không tìm thấy mã đơn hàng trong nội dung chuyển khoản',
      unmatchedTransfer: { id, transferAmount, content },
    });
  }

  // Idempotency: If order is already paid, do not re-send email
  if (matchedOrder.status === 'paid') {
    console.log(`[SePay Webhook] Order ${matchedOrder.orderCode} was already paid. Idempotent return.`);
    return res.json({
      success: true,
      message: 'Đơn hàng đã được ghi nhận thanh toán trước đó (Idempotent)',
      order: matchedOrder,
    });
  }

  // Compare transfer amount with order amount
  if (transferAmount >= matchedOrder.amount) {
    const paymentDetails = {
      gateway: gateway || sepayConfig.bankCode,
      accountNumber: accountNumber || sepayConfig.accountNumber,
      transferAmount,
      referenceCode: referenceCode || `REF_${Date.now()}`,
      transactionId: id || Date.now(),
      content,
    };

    const updated = db.updateOrder(matchedOrder.orderCode, {
      status: 'paid',
      paidAt: new Date().toISOString(),
      paymentDetails,
    });

    const product = db.getProduct(matchedOrder.productId);
    if (product && sepayConfig.autoSendEmail && updated) {
      await sendEbookEmail(updated, product);
    }

    // Re-fetch order to reflect emailSent status updated by sendEbookEmail
    const finalOrder = db.getOrderByCode(matchedOrder.orderCode);

    console.log(`[SePay Webhook] SUCCESS: Order ${matchedOrder.orderCode} paid! Ebook triggered.`);
    return res.json({
      success: true,
      status: 'paid',
      message: 'Thanh toán thành công. Đã tự động kích hoạt gửi Ebook qua email.',
      order: finalOrder,
    });
  } else {
    // Underpaid -> Mark as NEED_CHECK & Alert admin
    const updated = db.updateOrder(matchedOrder.orderCode, {
      status: 'need_check',
      paymentDetails: {
        gateway: gateway || sepayConfig.bankCode,
        accountNumber: accountNumber || sepayConfig.accountNumber,
        transferAmount,
        referenceCode: referenceCode || `REF_${Date.now()}`,
        transactionId: id || Date.now(),
        content,
        discrepancyNote: `Khách chuyển thiếu tiền: Thực nhận ${transferAmount.toLocaleString('vi-VN')} ₫ thay vì ${matchedOrder.amount.toLocaleString('vi-VN')} ₫`,
      },
    });

    console.warn(`[SePay Webhook] UNDERPAID: Order ${matchedOrder.orderCode} needs check.`);
    return res.json({
      success: false,
      status: 'need_check',
      message: 'Số tiền chuyển khoản không đủ giá trị đơn hàng. Đã chuyển sang trạng thái cần đối soát thủ công.',
      order: updated,
    });
  }
});

// Testing Simulator for SePay Webhook
app.post('/api/sepay/test-webhook', async (req: Request, res: Response) => {
  const { orderCode, scenario, customAmount } = req.body;
  const order = db.getOrderByCode(orderCode);
  const sepayConfig = db.getConfig();

  if (!order) {
    return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
  }

  let transferAmount = order.amount;
  let content = `${order.orderCode} ${order.customerName} thanh toan`;

  if (scenario === 'underpaid') {
    transferAmount = customAmount || Math.floor(order.amount * 0.7);
  } else if (scenario === 'wrong_code') {
    content = `DH9999 sai cu phap chuyen tien`;
  }

  const simulatedPayload: SePayWebhookPayload = {
    id: Math.floor(Math.random() * 9000000) + 1000000,
    gateway: sepayConfig.bankCode,
    transactionDate: new Date().toISOString(),
    accountNumber: sepayConfig.accountNumber,
    subAccount: null,
    code: null,
    content,
    transferType: 'in',
    transferAmount,
    accumulated: 25000000,
    referenceCode: `MB${Math.floor(Math.random() * 90000000)}`,
  };

  if (scenario === 'wrong_code') {
    return res.json({
      success: false,
      scenario,
      message: 'Mô phỏng: Nội dung chuyển khoản không chứa mã đơn hàng hợp lệ.',
      payload: simulatedPayload,
    });
  }

  if (transferAmount >= order.amount) {
    const updated = db.updateOrder(order.orderCode, {
      status: 'paid',
      paidAt: new Date().toISOString(),
      paymentDetails: {
        gateway: sepayConfig.bankCode,
        accountNumber: sepayConfig.accountNumber,
        transferAmount,
        referenceCode: simulatedPayload.referenceCode,
        transactionId: simulatedPayload.id,
        content,
      },
    });

    const product = db.getProduct(order.productId);
    if (product && !order.emailSent && updated) {
      await sendEbookEmail(updated, product);
    }

    // Re-fetch order to reflect emailSent status updated by sendEbookEmail
    const finalOrder = db.getOrderByCode(order.orderCode);

    return res.json({
      success: true,
      status: 'paid',
      message: 'Mô phỏng SePay khớp 100%: Đơn hàng đã chuyển sang trạng thái ĐÃ THANH TOÁN!',
      order: finalOrder,
      payload: simulatedPayload,
    });
  } else {
    const updated = db.updateOrder(order.orderCode, {
      status: 'need_check',
      paymentDetails: {
        gateway: sepayConfig.bankCode,
        accountNumber: sepayConfig.accountNumber,
        transferAmount,
        referenceCode: simulatedPayload.referenceCode,
        transactionId: simulatedPayload.id,
        content,
        discrepancyNote: `Khách chuyển thiếu tiền: Thực nhận ${transferAmount.toLocaleString('vi-VN')} ₫ thay vì ${order.amount.toLocaleString('vi-VN')} ₫`,
      },
    });

    return res.json({
      success: false,
      status: 'need_check',
      message: 'Mô phỏng chuyển thiếu tiền: Đơn hàng chuyển sang trạng thái CẦN KIỂM TRA.',
      order: updated,
      payload: simulatedPayload,
    });
  }
});

// 4. ADMIN PORTAL APIS
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (password === 'admin123' || password === 'admin') {
    return res.json({ success: true, token: 'admin_session_token_ok', role: 'admin' });
  }
  return res.status(401).json({ error: 'Mật khẩu quản trị không chính xác' });
});

app.get('/api/admin/orders', (req: Request, res: Response) => {
  return res.json(db.getOrders());
});

app.post('/api/admin/orders/:code/approve', async (req: Request, res: Response) => {
  const { code } = req.params;
  const order = db.getOrderByCode(code);
  if (!order) {
    return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
  }

  const updated = db.updateOrder(order.orderCode, {
    status: 'paid',
    paidAt: new Date().toISOString(),
    paymentDetails: {
      ...order.paymentDetails,
      discrepancyNote: '(Đã được Admin duyệt thủ công)',
    },
  });

  const product = db.getProduct(order.productId);
  if (product && !order.emailSent && updated) {
    sendEbookEmail(updated, product);
  }

  return res.json({ success: true, order: updated });
});

app.post('/api/admin/orders/:code/resend-email', async (req: Request, res: Response) => {
  const { code } = req.params;
  const order = db.getOrderByCode(code);
  if (!order) {
    return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
  }

  const product = db.getProduct(order.productId);
  if (product) {
    await sendEbookEmail(order, product);
    return res.json({ success: true, message: 'Đã gửi lại email thành công' });
  }
  return res.status(400).json({ error: 'Không tìm thấy thông tin sản phẩm tương ứng' });
});

app.get('/api/admin/config', (req: Request, res: Response) => {
  return res.json(db.getConfig());
});

app.put('/api/admin/config', (req: Request, res: Response) => {
  const updated = db.updateConfig(req.body);
  return res.json(updated);
});

app.get('/api/admin/emails', (req: Request, res: Response) => {
  return res.json(db.getEmailLogs());
});

app.get('/api/admin/stats', (req: Request, res: Response) => {
  const orders = db.getOrders();
  const totalRevenue = orders
    .filter(o => o.status === 'paid')
    .reduce((sum, o) => sum + (o.paymentDetails?.transferAmount || o.amount), 0);
  const paidOrders = orders.filter(o => o.status === 'paid').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const needCheckOrders = orders.filter(o => o.status === 'need_check').length;

  return res.json({
    totalRevenue,
    totalOrders: orders.length,
    paidOrders,
    pendingOrders,
    needCheckOrders,
  });
});

// 5. SUPPORT & CONTACT API
app.post('/api/support', (req: Request, res: Response) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ Họ tên, Email và Nội dung thắc mắc.' });
  }

  const inquiry: SupportInquiry = {
    id: `sup_${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
    status: 'new',
  };

  db.addSupportInquiry(inquiry);
  return res.status(201).json({ success: true, message: 'Câu hỏi của bạn đã được gửi. Chúng tôi sẽ phản hồi trong 15-30 phút.' });
});

app.get('/api/admin/support', (req: Request, res: Response) => {
  return res.json(db.getSupportInquiries());
});

// 6. EBOOK FILE DOWNLOAD & READER API
app.get('/api/download/:token', (req: Request, res: Response) => {
  const { token } = req.params;
  const order = db.getOrderByDownloadToken(token);

  if (!order || order.status !== 'paid') {
    return res.status(403).send('Link tải không hợp lệ hoặc đơn hàng chưa được xác nhận thanh toán.');
  }

  const product = db.getProduct(order.productId);
  const title = product?.title || 'Ebook';

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>Tài Liệu: ${title}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; color: #1e293b; background: #f8fafc; }
        .card { background: #fff; padding: 36px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
        .header { border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; }
        h1 { color: #1e3a8a; margin: 0 0 8px 0; font-size: 24px; }
        .badge { display: inline-block; background: #dbeafe; color: #1d4ed8; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: 600; }
        .meta { color: #64748b; font-size: 14px; margin-top: 12px; }
        .toc { background: #f1f5f9; padding: 18px 24px; border-radius: 8px; margin: 24px 0; }
        .toc li { margin-bottom: 8px; }
        .content { margin-top: 24px; }
        .btn-print { background: #2563eb; color: #fff; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px; }
        .btn-print:hover { background: #1d4ed8; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <span class="badge">Bản quyền điện tử chính thức · Định dạng PDF</span>
          <h1>${title}</h1>
          <p style="margin: 6px 0 0; color: #475569;">${product?.tagline || ''}</p>
        </div>
        <div class="meta">
          <strong>Người mua:</strong> ${order.customerName} (${order.customerEmail})<br>
          <strong>Mã đơn hàng:</strong> ${order.orderCode} · <strong>Số trang:</strong> ${product?.pages || 150} trang<br>
          <strong>Ngày cấp phép:</strong> ${new Date(order.paidAt || Date.now()).toLocaleDateString('vi-VN')}
        </div>
        <div class="toc">
          <h3 style="margin-top:0;">Mục lục chi tiết tài liệu:</h3>
          <ul>
            ${product?.table_of_contents?.map(ch => `<li>${ch}</li>`).join('') || '<li>Toàn văn tài liệu</li>'}
          </ul>
        </div>
        <div class="content">
          <h3>Lời mở đầu</h3>
          <p>${product?.description || ''}</p>
          <p>Tài liệu này được tạo và gửi tự động từ hệ thống thanh toán SePay. Vui lòng không chia sẻ liên kết tải trực tiếp ra bên ngoài.</p>
          <div style="margin-top: 30px;">
            <button class="btn-print" onclick="window.print()">In hoặc Lưu dưới dạng PDF</button>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// ==========================================
// VITE DEV SERVER OR STATIC PRODUCTION
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);

    // Periodic check against SePay API when there are pending orders
    setInterval(() => {
      const pending = db.getOrders().some(o => o.status === 'pending');
      if (pending) {
        syncSePayTransactions().catch(() => {});
      }
    }, 15000);
  });
}

startServer();
