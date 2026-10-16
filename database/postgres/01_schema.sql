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
