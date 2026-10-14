export type ProductType = 'single' | 'combo';
export type ProductStatus = 'active' | 'hidden';
export type OrderStatus = 'pending' | 'paid' | 'need_check' | 'cancelled';

export interface ImageDisplayConfig {
  aspectRatio?: '1/1' | '4/3' | '16/9' | '3/4' | '2/3' | 'auto';
  heightMode?: 'aspect' | 'fixed';
  customHeight?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  objectPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  filterPreset?: 'normal' | 'cinematic' | 'vibrant' | 'warm' | 'cool' | 'grayscale' | 'vintage';
  hoverEffect?: 'none' | 'zoom' | 'glow' | 'lift' | 'brightness';
  overlayOpacity?: number; // 0 to 80
  showBorder?: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  type: ProductType;
  tagline: string;
  description: string;
  price: number;
  original_price: number;
  pages: number;
  status: ProductStatus;
  file_path: string;
  badge?: string;
  image_url?: string;
  image_config?: ImageDisplayConfig;
  table_of_contents: string[];
  for_whom: string[];
  not_for_whom: string[];
  included_books?: string[];
  sample_read_url?: string;
  sampleDriveUrl?: string;
  themeColor?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  thumbnail_url?: string;
  image_config?: ImageDisplayConfig;
  coverGradient?: string;
  readTime: string;
  publishedAt: string;
  status: 'published' | 'draft';
  tags: string[];
  linkedProductId?: string;
}

export interface Order {
  id: string;
  orderCode: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productTitle: string;
  amount: number;
  originalAmount: number;
  status: OrderStatus;
  createdAt: string;
  paidAt?: string;
  downloadToken: string;
  emailSent: boolean;
  paymentDetails?: {
    gateway?: string;
    accountNumber?: string;
    transferAmount?: number;
    referenceCode?: string;
    transactionId?: number | string;
    content?: string;
    discrepancyNote?: string;
  };
}

export interface SePayConfig {
  bankCode: string;
  accountNumber: string;
  accountName: string;
  apiKey?: string;
  webhookToken: string;
  webhookUrl: string;
  autoSendEmail: boolean;
  testMode: boolean;
}

export interface EmailLog {
  id: string;
  orderCode: string;
  toEmail: string;
  customerName: string;
  productTitle: string;
  downloadUrl: string;
  sentAt: string;
  subject: string;
  status: 'delivered' | 'pending' | 'failed';
}

export interface SupportInquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: 'new' | 'replied';
}

export interface SePayWebhookPayload {
  id?: number | string;
  gateway?: string;
  transactionDate?: string;
  accountNumber?: string;
  subAccount?: string | null;
  code?: string | null;
  content: string;
  transferType?: string;
  transferAmount: number;
  accumulated?: number;
  referenceCode?: string;
}
