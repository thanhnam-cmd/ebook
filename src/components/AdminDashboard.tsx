import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  LogOut,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Settings,
  Mail,
  Plus,
  Edit2,
  Eye,
  EyeOff,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  Send,
  Download,
  Play,
  FileText,
  ArrowLeft,
  Image as ImageIcon,
} from 'lucide-react';
import { Product, Order, SePayConfig, EmailLog, BlogPost } from '../types';
import { ImageDisplayCustomizer } from './ImageDisplayCustomizer';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRefreshProducts: () => void;
  isStandalonePage?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  products,
  onRefreshProducts,
  isStandalonePage = false,
}) => {
  // Prevent background scroll while Admin Dashboard is open as a modal
  useEffect(() => {
    if (!isOpen || isStandalonePage) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen, isStandalonePage]);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'blogs' | 'config' | 'emails' | 'tester'>('orders');

  // Blogs State
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({});

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderFilter, setOrderFilter] = useState<'all' | 'paid' | 'need_check' | 'pending'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Stats State
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    paidOrders: 0,
    pendingOrders: 0,
    needCheckOrders: 0,
  });

  // Config State
  const [config, setConfig] = useState<SePayConfig>({
    bankCode: 'MB',
    accountNumber: '0987654321',
    accountName: 'NGUYEN VAN ADMIN',
    webhookToken: 'sepay_secret_token_2026',
    webhookUrl: '/api/sepay/webhook',
    autoSendEmail: true,
    testMode: true,
  });
  const [configSaved, setConfigSaved] = useState(false);

  // Email Logs State
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);

  // Product Editing / Creation State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [prodForm, setProdForm] = useState<Partial<Product>>({});

  // Webhook Tester State
  const [testOrderCode, setTestOrderCode] = useState('');
  const [testAmount, setTestAmount] = useState<number>(286000);
  const [testScenario, setTestScenario] = useState<'exact' | 'underpaid' | 'wrong_code'>('exact');
  const [testResponse, setTestResponse] = useState<any>(null);

  // SePay Live API Sync
  const [isSyncingSePay, setIsSyncingSePay] = useState(false);
  const [sepaySyncNotice, setSepaySyncNotice] = useState<string | null>(null);

  const handleSyncSePay = async () => {
    setIsSyncingSePay(true);
    setSepaySyncNotice(null);
    try {
      const res = await fetch('/api/sepay/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSepaySyncNotice(`Khớp thành công! Tổng ${data.totalTransactions} GD trên SePay, cập nhật ${data.updatedOrders} đơn.`);
        fetchDashboardData();
      } else {
        setSepaySyncNotice(`Thông báo SePay: ${data.message || data.error || 'Không có giao dịch mới'}`);
      }
    } catch (err) {
      setSepaySyncNotice('Lỗi kết nối tới SePay API.');
    } finally {
      setIsSyncingSePay(false);
      setTimeout(() => setSepaySyncNotice(null), 6000);
    }
  };

  // Check login session or trigger login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        fetchDashboardData();
      } else {
        setLoginError('Mật khẩu quản trị không đúng. (Mặc định: admin123)');
      }
    } catch (err) {
      setLoginError('Không thể kết nối đến máy chủ.');
    }
  };

  const fetchDashboardData = async () => {
    setIsLoadingOrders(true);
    try {
      const [ordersRes, statsRes, configRes, emailsRes, blogsRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/stats'),
        fetch('/api/admin/config'),
        fetch('/api/admin/emails'),
        fetch('/api/blogs?all=true'),
      ]);

      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (configRes.ok) setConfig(await configRes.json());
      if (emailsRes.ok) setEmailLogs(await emailsRes.json());
      if (blogsRes.ok) setBlogs(await blogsRes.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchDashboardData();

    // Real-time SSE synchronization for immediate live updates
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/events');
      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type !== 'init') {
            fetchDashboardData();
          }
        } catch (err) {}
      };
    } catch (err) {
      console.warn('SSE not supported, fallback to polling');
    }

    // 3-second sync check so Admin always has live state
    const interval = setInterval(() => {
      fetch('/api/sync-version')
        .then(r => r.json())
        .then(data => {
          if (data && data.version) {
            fetchDashboardData();
          }
        })
        .catch(() => {});
    }, 3000);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  // Order Actions
  const handleApproveOrder = async (code: string) => {
    if (!confirm(`Xác nhận duyệt thủ công và kích hoạt gửi ebook cho đơn ${code}?`)) return;
    try {
      const res = await fetch(`/api/admin/orders/${code}/approve`, { method: 'POST' });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      alert('Lỗi duyệt đơn');
    }
  };

  const handleResendEmail = async (code: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${code}/resend-email`, { method: 'POST' });
      if (res.ok) {
        alert('Đã gửi lại email thành công!');
        fetchDashboardData();
      }
    } catch (err) {
      alert('Lỗi gửi email');
    }
  };

  // Product Actions
  const handleToggleProductStatus = async (product: Product) => {
    const newStatus = product.status === 'active' ? 'hidden' : 'active';
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        onRefreshProducts();
      }
    } catch (err) {
      alert('Lỗi cập nhật trạng thái');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.title || !prodForm.price) {
      alert('Vui lòng nhập tên và giá');
      return;
    }

    try {
      if (isCreatingProduct) {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...prodForm,
            image_url: prodForm.image_url || '',
            image_config: prodForm.image_config,
            pages: Number(prodForm.pages) || 120,
            price: Number(prodForm.price),
            original_price: Number(prodForm.original_price) || Number(prodForm.price),
            sample_read_url: prodForm.sample_read_url || '',
            status: 'active',
            table_of_contents: prodForm.table_of_contents || ['Chương 1', 'Chương 2'],
            for_whom: prodForm.for_whom || ['Người tìm kiếm giải pháp thực chiến'],
            not_for_whom: prodForm.not_for_whom || ['Người không hành động'],
          }),
        });
        if (res.ok) {
          setIsCreatingProduct(false);
          setEditingProduct(null);
          onRefreshProducts();
        }
      } else if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...prodForm,
            image_url: prodForm.image_url || '',
            image_config: prodForm.image_config,
            pages: Number(prodForm.pages),
            price: Number(prodForm.price),
            original_price: Number(prodForm.original_price),
            sample_read_url: prodForm.sample_read_url || '',
          }),
        });
        if (res.ok) {
          setEditingProduct(null);
          onRefreshProducts();
        }
      }
    } catch (err) {
      alert('Lỗi lưu sản phẩm');
    }
  };

  // Blog Actions
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.content) {
      alert('Vui lòng nhập tiêu đề và nội dung bài viết');
      return;
    }

    try {
      if (isCreatingBlog) {
        const res = await fetch('/api/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...blogForm,
            thumbnail_url: blogForm.thumbnail_url || '',
            image_config: blogForm.image_config,
            author: blogForm.author || 'Hoàng Nguyễn',
            readTime: blogForm.readTime || '4 phút đọc',
            tags: blogForm.tags || ['Tri Thức'],
            status: 'published',
          }),
        });
        if (res.ok) {
          setIsCreatingBlog(false);
          setEditingBlog(null);
          fetchDashboardData();
        }
      } else if (editingBlog) {
        const res = await fetch(`/api/blogs/${editingBlog.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...blogForm,
            thumbnail_url: blogForm.thumbnail_url || '',
            image_config: blogForm.image_config,
          }),
        });
        if (res.ok) {
          setEditingBlog(null);
          fetchDashboardData();
        }
      }
    } catch (err) {
      alert('Lỗi lưu bài viết');
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      alert('Lỗi xóa bài viết');
    }
  };

  // Config Save
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setConfigSaved(true);
        setTimeout(() => setConfigSaved(false), 3000);
      }
    } catch (err) {
      alert('Lỗi lưu cấu hình');
    }
  };

  // Tester Run
  const handleRunTester = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testOrderCode) {
      alert('Vui lòng chọn hoặc nhập mã đơn hàng');
      return;
    }

    try {
      const res = await fetch('/api/sepay/test-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderCode: testOrderCode,
          scenario: testScenario,
          customAmount: testAmount,
        }),
      });
      const data = await res.json();
      setTestResponse(data);
      fetchDashboardData();
    } catch (err: any) {
      setTestResponse({ error: err.message });
    }
  };

  const filteredOrders = orders.filter(o => {
    if (orderFilter !== 'all' && o.status !== orderFilter) return false;
    if (orderSearch) {
      const q = orderSearch.toLowerCase();
      return (
        o.orderCode.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (!isOpen) return null;

  return (
    <div
      className={
        isStandalonePage
          ? 'min-h-screen bg-slate-950 text-slate-800 flex flex-col no-scrollbar'
          : 'fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden no-scrollbar'
      }
    >
      <div
        className={
          isStandalonePage
            ? 'w-full max-w-7xl mx-auto flex-1 flex flex-col bg-white sm:my-4 sm:rounded-2xl sm:shadow-2xl border border-slate-800/40 overflow-hidden no-scrollbar'
            : 'relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[92vh] no-scrollbar'
        }
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold tracking-tight">
                  CỔNG QUẢN TRỊ ADMIN · EBOOK &amp; SEPAY
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SePay Live Active</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Tài khoản: MBBank 5070145678888 (HOANG XUAN THUY) · Token: LXEU5BYW...
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && (
              <>
                <button
                  onClick={handleSyncSePay}
                  disabled={isSyncingSePay}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  title="Truy vấn danh sách giao dịch thực tế từ SePay"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSePay ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Đồng bộ SePay API</span>
                </button>

                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </button>
              </>
            )}

            {isStandalonePage ? (
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer border border-slate-700"
                title="Quay lại trang chủ cửa hàng"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Về trang chủ</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* SePay Sync notification banner if active */}
        {sepaySyncNotice && (
          <div className="bg-blue-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shrink-0">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{sepaySyncNotice}</span>
            </span>
            <button
              onClick={() => setSepaySyncNotice(null)}
              className="text-white/80 hover:text-white text-xs"
            >
              Đóng
            </button>
          </div>
        )}

        {/* Not Logged In View */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto my-auto w-full text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Đăng nhập Quản trị viên</h3>
              <p className="text-xs text-slate-500 mt-1">
                Bảo mật theo phân quyền hệ thống. Nhập mật khẩu quản trị để tiếp tục.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                required
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-center font-mono"
              />

              {loginError && (
                <div className="text-xs text-rose-600 font-semibold">{loginError}</div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer"
              >
                Mở Bảng Điều Khiển
              </button>

              <div className="text-[11px] text-slate-400">
                Gợi ý mật khẩu mẫu thử nghiệm: <span className="font-mono text-blue-600 font-bold">admin123</span>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Admin View */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* KPI Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 border-b border-slate-200 shrink-0">
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-[11px] text-slate-500 font-medium">Doanh thu thực tế</div>
                <div className="text-lg sm:text-xl font-black text-emerald-600 tabular-nums">
                  {stats.totalRevenue.toLocaleString('vi-VN')} ₫
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-[11px] text-slate-500 font-medium">Đã thanh toán (Paid)</div>
                <div className="text-lg sm:text-xl font-black text-blue-600 tabular-nums">
                  {stats.paidOrders} / {stats.totalOrders} đơn
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-[11px] text-slate-500 font-medium">Chờ thanh toán (Pending)</div>
                <div className="text-lg sm:text-xl font-black text-slate-700 tabular-nums">
                  {stats.pendingOrders} đơn
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-rose-200 shadow-xs bg-rose-50/30">
                <div className="text-[11px] text-rose-600 font-bold">Cần đối soát (Check)</div>
                <div className="text-lg sm:text-xl font-black text-rose-600 tabular-nums">
                  {stats.needCheckOrders} đơn
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 border-b border-slate-200 bg-white shrink-0 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'orders'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Quản lý Đơn Hàng ({orders.length})
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'products'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                CRUD Sản Phẩm ({products.length})
              </button>

              <button
                onClick={() => setActiveTab('blogs')}
                className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'blogs'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Quản lý Blog ({blogs.length})
              </button>

              <button
                onClick={() => setActiveTab('config')}
                className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'config'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Cấu hình SePay &amp; Ngân Hàng
              </button>

              <button
                onClick={() => setActiveTab('emails')}
                className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'emails'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Nhật Ký Email Đã Gửi ({emailLogs.length})
              </button>

              <button
                onClick={() => setActiveTab('tester')}
                className={`py-3.5 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'tester'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Công Cụ Test Webhook SePay
              </button>
            </div>

            {/* TAB CONTENT CONTAINER */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-50/50 no-scrollbar">
              {/* TAB 1: QUẢN LÝ ĐƠN HÀNG */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {/* Filters & Search */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-lg text-xs font-semibold">
                      <button
                        onClick={() => setOrderFilter('all')}
                        className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                          orderFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        Tất cả ({orders.length})
                      </button>
                      <button
                        onClick={() => setOrderFilter('paid')}
                        className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                          orderFilter === 'paid' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        Đã thanh toán
                      </button>
                      <button
                        onClick={() => setOrderFilter('need_check')}
                        className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                          orderFilter === 'need_check' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        Cần đối soát ({stats.needCheckOrders})
                      </button>
                      <button
                        onClick={() => setOrderFilter('pending')}
                        className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                          orderFilter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        Chờ thanh toán
                      </button>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Tìm mã đơn, email..."
                        value={orderSearch}
                        onChange={e => setOrderSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="px-4 py-3">Mã đơn</th>
                            <th className="px-4 py-3">Khách hàng</th>
                            <th className="px-4 py-3">Sản phẩm</th>
                            <th className="px-4 py-3">Số tiền</th>
                            <th className="px-4 py-3">Trạng thái</th>
                            <th className="px-4 py-3">Chi tiết chuyển khoản</th>
                            <th className="px-4 py-3 text-right">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredOrders.map(order => (
                            <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-4 py-3 font-mono font-bold text-blue-600">
                                {order.orderCode}
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-semibold text-slate-900">{order.customerName}</div>
                                <div className="text-slate-500 text-[11px]">{order.customerEmail}</div>
                              </td>
                              <td className="px-4 py-3 text-slate-700 max-w-xs truncate">
                                {order.productTitle}
                              </td>
                              <td className="px-4 py-3 font-black tabular-nums text-slate-900">
                                {order.amount.toLocaleString('vi-VN')} ₫
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                    order.status === 'paid'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : order.status === 'need_check'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {order.status === 'paid'
                                    ? 'ĐÃ THANH TOÁN'
                                    : order.status === 'need_check'
                                    ? 'CẦN ĐỐI SOÁT'
                                    : 'CHỜ THANH TOÁN'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-[11px] text-slate-600">
                                {order.paymentDetails ? (
                                  <div>
                                    <span>
                                      Thực nhận:{' '}
                                      <strong>
                                        {order.paymentDetails.transferAmount?.toLocaleString('vi-VN')} ₫
                                      </strong>
                                    </span>
                                    {order.paymentDetails.discrepancyNote && (
                                      <div className="text-rose-600 font-semibold">
                                        {order.paymentDetails.discrepancyNote}
                                      </div>
                                    )}
                                    <div className="text-slate-400 font-mono text-[10px]">
                                      Nội dung: &ldquo;{order.paymentDetails.content}&rdquo;
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-slate-400">Chưa có giao dịch</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                                {order.status === 'need_check' && (
                                  <button
                                    onClick={() => handleApproveOrder(order.orderCode)}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold transition-colors cursor-pointer"
                                  >
                                    Duyệt thủ công
                                  </button>
                                )}
                                {order.status === 'paid' && (
                                  <>
                                    <button
                                      onClick={() => handleResendEmail(order.orderCode)}
                                      className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                                      title="Gửi lại Ebook"
                                    >
                                      Gửi lại email
                                    </button>
                                    <a
                                      href={`/api/download/${order.downloadToken}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold transition-colors"
                                      title="Tải PDF"
                                    >
                                      <Download className="w-3 h-3" />
                                      <span>Tải PDF</span>
                                    </a>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CRUD SẢN PHẨM */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Danh sách 3 Sách Đơn &amp; 4 Combo ({products.length} ấn phẩm)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Quản trị viên có toàn quyền chỉnh sửa giá bán, mô tả, tệp PDF và ẩn/hiện sản phẩm.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsCreatingProduct(true);
                        setEditingProduct(null);
                        setProdForm({
                          title: '',
                          tagline: '',
                          type: 'single',
                          price: 120000,
                          original_price: 180000,
                          pages: 150,
                          status: 'active',
                          image_url: '',
                          image_config: {
                            aspectRatio: '3/4',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            borderRadius: 'xl',
                            filterPreset: 'normal',
                            hoverEffect: 'zoom',
                            overlayOpacity: 0,
                            showBorder: true,
                          },
                          file_path: '/ebooks/tai-lieu-moi.pdf',
                          table_of_contents: ['Chương 1', 'Chương 2'],
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm ấn phẩm mới</span>
                    </button>
                  </div>

                  {/* Product Form Modal / Section */}
                  {(isCreatingProduct || editingProduct) && (
                    <form
                      onSubmit={handleSaveProduct}
                      className="p-5 bg-white border-2 border-blue-500 rounded-xl space-y-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h4 className="text-sm font-bold text-blue-700">
                          {isCreatingProduct ? 'Thêm Sản Phẩm Mới' : `Chỉnh Sửa: ${editingProduct?.title}`}
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCreatingProduct(false);
                            setEditingProduct(null);
                          }}
                          className="text-xs text-slate-400 hover:text-slate-700"
                        >
                          Hủy bỏ
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Tên sản phẩm *</label>
                          <input
                            type="text"
                            required
                            value={prodForm.title || ''}
                            onChange={e => setProdForm({ ...prodForm, title: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Loại sản phẩm</label>
                          <select
                            value={prodForm.type || 'single'}
                            onChange={e => setProdForm({ ...prodForm, type: e.target.value as any })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                          >
                            <option value="single">Sách đơn lẻ (single)</option>
                            <option value="combo">Gói Combo (combo)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Giá bán thực tế (VNĐ) *</label>
                          <input
                            type="number"
                            required
                            value={prodForm.price || ''}
                            onChange={e => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Giá niêm yết gốc (VNĐ)</label>
                          <input
                            type="number"
                            value={prodForm.original_price || ''}
                            onChange={e => setProdForm({ ...prodForm, original_price: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Số trang (PDF)</label>
                          <input
                            type="number"
                            value={prodForm.pages || ''}
                            onChange={e => setProdForm({ ...prodForm, pages: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Đường dẫn file PDF</label>
                          <input
                            type="text"
                            value={prodForm.file_path || ''}
                            onChange={e => setProdForm({ ...prodForm, file_path: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-700 mb-1">
                            Link Google Drive Đọc Thử (Khách bấm Đọc thử sẽ mở link này)
                          </label>
                          <input
                            type="text"
                            placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                            value={prodForm.sample_read_url || ''}
                            onChange={e => setProdForm({ ...prodForm, sample_read_url: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-blue-700"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-700 mb-1">Tagline định vị</label>
                          <input
                            type="text"
                            value={prodForm.tagline || ''}
                            onChange={e => setProdForm({ ...prodForm, tagline: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-700 mb-1">Mô tả tóm tắt</label>
                          <textarea
                            rows={3}
                            value={prodForm.description || ''}
                            onChange={e => setProdForm({ ...prodForm, description: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                          />
                        </div>

                        {/* Image Uploader & Display Fine-Tuning Section */}
                        <div className="sm:col-span-2 pt-1">
                          <ImageDisplayCustomizer
                            target="product"
                            imageUrl={prodForm.image_url || ''}
                            config={prodForm.image_config}
                            onImageChange={(url) => setProdForm({ ...prodForm, image_url: url })}
                            onConfigChange={(cfg) => setProdForm({ ...prodForm, image_config: cfg })}
                            title="Thêm Ảnh Bìa Ấn Phẩm Ebook &amp; Tinh Chỉnh Hiển Thị"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsCreatingProduct(false);
                            setEditingProduct(null);
                          }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Lưu Ấn Phẩm
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Product List */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="px-4 py-3">Ảnh bìa</th>
                          <th className="px-4 py-3">Tên sản phẩm</th>
                          <th className="px-4 py-3">Phân loại</th>
                          <th className="px-4 py-3">Giá bán</th>
                          <th className="px-4 py-3">Số trang</th>
                          <th className="px-4 py-3">Trạng thái</th>
                          <th className="px-4 py-3 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {products.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50/80">
                            <td className="px-4 py-3">
                              {p.image_url ? (
                                <div className="w-10 h-14 rounded overflow-hidden bg-slate-900 border border-slate-300 shadow-2xs shrink-0">
                                  <img
                                    src={p.image_url}
                                    alt={p.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-10 h-14 rounded bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center text-white text-[9px] font-bold shadow-2xs shrink-0 text-center px-0.5">
                                  Bìa Số
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-bold text-slate-900">{p.title}</div>
                              <div className="text-[11px] text-slate-500 truncate max-w-sm">{p.tagline}</div>
                              {p.image_config && (
                                <div className="text-[10px] text-blue-600 font-mono mt-0.5">
                                  Tỉ lệ: {p.image_config.aspectRatio || '3/4'} · Tone: {p.image_config.filterPreset || 'normal'}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                                {p.type === 'combo' ? 'Gói Combo' : 'Sách lẻ'}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-black tabular-nums text-blue-600">
                              {p.price.toLocaleString('vi-VN')} ₫
                            </td>
                            <td className="px-4 py-3 font-mono">{p.pages} trang</td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  p.status === 'active'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                {p.status === 'active' ? 'Mở bán' : 'Tạm ẩn'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setEditingProduct(p);
                                  setIsCreatingProduct(false);
                                  setProdForm(p);
                                }}
                                className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded text-xs font-semibold cursor-pointer"
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() => handleToggleProductStatus(p)}
                                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                                  p.status === 'active'
                                    ? 'text-rose-700 bg-rose-50 hover:bg-rose-100'
                                    : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                                }`}
                              >
                                {p.status === 'active' ? 'Ẩn sách' : 'Mở bán'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2.5: QUẢN LÝ BLOG */}
              {activeTab === 'blogs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Quản lý Bài Viết Blog &amp; Góc Chia Sẻ ({blogs.length} bài)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Đăng tải kiến thức, thu hút độc giả và tự động gắn khung gợi ý mua sách ở cuối mỗi bài viết.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsCreatingBlog(true);
                        setEditingBlog(null);
                        setBlogForm({
                          title: '',
                          excerpt: '',
                          content: '',
                          author: 'Hoàng Nguyễn',
                          readTime: '5 phút đọc',
                          tags: ['Tri Thức', 'Phát Triển Bản Thân'],
                          linkedProductId: products[0]?.id || '',
                          status: 'published',
                          thumbnail_url: '',
                          image_config: {
                            aspectRatio: '16/9',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            borderRadius: 'xl',
                            filterPreset: 'normal',
                            hoverEffect: 'zoom',
                            overlayOpacity: 0,
                            showBorder: true,
                          },
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm bài viết mới</span>
                    </button>
                  </div>

                  {/* Blog Form Modal / Drawer */}
                  {(isCreatingBlog || editingBlog) && (
                    <form
                      onSubmit={handleSaveBlog}
                      className="p-5 bg-white border-2 border-blue-500 rounded-xl space-y-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h4 className="text-sm font-bold text-blue-700">
                          {isCreatingBlog ? 'Đăng Bài Viết Blog Mới' : `Chỉnh Sửa Bài Viết: ${editingBlog?.title}`}
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCreatingBlog(false);
                            setEditingBlog(null);
                          }}
                          className="text-xs text-slate-400 hover:text-slate-700"
                        >
                          Hủy bỏ
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-700 mb-1">Tiêu đề bài viết *</label>
                          <input
                            type="text"
                            required
                            placeholder="VD: 5 Thói quen buổi sáng kích hoạt trạng thái tỉnh thức"
                            value={blogForm.title || ''}
                            onChange={e => setBlogForm({ ...blogForm, title: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Thời lượng đọc</label>
                          <input
                            type="text"
                            placeholder="VD: 4 phút đọc"
                            value={blogForm.readTime || ''}
                            onChange={e => setBlogForm({ ...blogForm, readTime: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Tác giả</label>
                          <input
                            type="text"
                            value={blogForm.author || ''}
                            onChange={e => setBlogForm({ ...blogForm, author: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Sách / Combo gắn kèm ở cuối bài (Call to Action)
                          </label>
                          <select
                            value={blogForm.linkedProductId || ''}
                            onChange={e => setBlogForm({ ...blogForm, linkedProductId: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-blue-700"
                          >
                            <option value="">-- Chọn sản phẩm gợi ý mua --</option>
                            {products.map(p => (
                              <option key={p.id} value={p.id}>
                                {p.title} ({p.price.toLocaleString('vi-VN')} ₫)
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Thẻ / Chủ đề (Cách nhau bằng dấu phẩy)</label>
                          <input
                            type="text"
                            placeholder="Tỉnh Thức, Giao Tiếp, Tài Chính"
                            value={blogForm.tags?.join(', ') || ''}
                            onChange={e => setBlogForm({ ...blogForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-700 mb-1">Tóm tắt ngắn (Excerpt)</label>
                          <textarea
                            rows={2}
                            required
                            placeholder="Mô tả ngắn hiển thị ở danh sách bài viết..."
                            value={blogForm.excerpt || ''}
                            onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-700 mb-1">
                            Nội dung chi tiết bài viết * (Hỗ trợ tiêu đề ### và gạch đầu dòng - )
                          </label>
                          <textarea
                            rows={10}
                            required
                            placeholder="Nhập nội dung bài viết..."
                            value={blogForm.content || ''}
                            onChange={e => setBlogForm({ ...blogForm, content: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
                          />
                        </div>

                        {/* Thumbnail Image Uploader & Display Fine-Tuning Section */}
                        <div className="sm:col-span-2 pt-1">
                          <ImageDisplayCustomizer
                            target="blog"
                            imageUrl={blogForm.thumbnail_url || ''}
                            config={blogForm.image_config}
                            onImageChange={(url) => setBlogForm({ ...blogForm, thumbnail_url: url })}
                            onConfigChange={(cfg) => setBlogForm({ ...blogForm, image_config: cfg })}
                            title="Thêm Ảnh Thumbnail Bài Viết &amp; Tinh Chỉnh Hiển Thị"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setIsCreatingBlog(false);
                            setEditingBlog(null);
                          }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Lưu &amp; Xuất Bản Bài Viết
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Blog Posts Table */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="px-4 py-3">Thumbnail</th>
                          <th className="px-4 py-3">Tiêu đề bài viết</th>
                          <th className="px-4 py-3">Sách liên kết ở cuối</th>
                          <th className="px-4 py-3">Thời gian đọc</th>
                          <th className="px-4 py-3">Ngày đăng</th>
                          <th className="px-4 py-3 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {blogs.map(blog => {
                          const linked = products.find(p => p.id === blog.linkedProductId);

                          return (
                            <tr key={blog.id} className="hover:bg-slate-50/80">
                              <td className="px-4 py-3">
                                {blog.thumbnail_url ? (
                                  <div className="w-14 h-10 rounded overflow-hidden bg-slate-900 border border-slate-300 shadow-2xs shrink-0">
                                    <img
                                      src={blog.thumbnail_url}
                                      alt={blog.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-14 h-10 rounded bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white text-[9px] font-bold shadow-2xs shrink-0 text-center px-0.5">
                                    Gradient
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-bold text-slate-900 line-clamp-1">{blog.title}</div>
                                <div className="text-[11px] text-slate-500 line-clamp-1">{blog.excerpt}</div>
                                {blog.image_config && (
                                  <div className="text-[10px] text-blue-600 font-mono mt-0.5">
                                    Tỉ lệ: {blog.image_config.aspectRatio || '16/9'} · Tone: {blog.image_config.filterPreset || 'normal'}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                {linked ? (
                                  <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                                    {linked.title}
                                  </span>
                                ) : (
                                  <span className="text-slate-400">Chưa gắn</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-slate-600">{blog.readTime}</td>
                              <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{blog.publishedAt}</td>
                              <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                                <button
                                  onClick={() => {
                                    setEditingBlog(blog);
                                    setIsCreatingBlog(false);
                                    setBlogForm(blog);
                                  }}
                                  className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded text-xs font-semibold cursor-pointer"
                                >
                                  Sửa
                                </button>
                                <button
                                  onClick={() => handleDeleteBlog(blog.id)}
                                  className="px-2.5 py-1 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded text-xs font-semibold cursor-pointer"
                                >
                                  Xóa
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: CẤU HÌNH SEPAY & NGÂN HÀNG */}
              {activeTab === 'config' && (
                <div className="max-w-2xl bg-white p-6 rounded-xl border border-slate-200 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Cấu hình Tích hợp Cổng SePay &amp; Tài Khoản Ngân Hàng
                    </h3>
                    <p className="text-xs text-slate-500">
                      Dữ liệu này được dùng để sinh mã VietQR động và tiếp nhận webhook đối soát từ SePay.
                    </p>
                  </div>

                  <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Mã ngân hàng (VietQR)</label>
                        <select
                          value={config.bankCode}
                          onChange={e => setConfig({ ...config, bankCode: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                        >
                          <option value="MB">MBBank (Ngân hàng Quân đội)</option>
                          <option value="VCB">Vietcombank</option>
                          <option value="TCB">Techcombank</option>
                          <option value="TPB">TPBank</option>
                          <option value="VPB">VPBank</option>
                          <option value="ACB">ACB</option>
                          <option value="ICB">VietinBank</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Số tài khoản ngân hàng</label>
                        <input
                          type="text"
                          required
                          value={config.accountNumber}
                          onChange={e => setConfig({ ...config, accountNumber: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">Tên chủ tài khoản (In hoa không dấu)</label>
                        <input
                          type="text"
                          required
                          value={config.accountName}
                          onChange={e => setConfig({ ...config, accountName: e.target.value.toUpperCase() })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">SePay API Token / Webhook Secret</label>
                        <input
                          type="text"
                          value={config.webhookToken}
                          onChange={e => setConfig({ ...config, webhookToken: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">
                          Trùng khớp với API Token đã cấu hình trên bảng điều khiển my.sepay.vn.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-1">
                      <div className="font-bold text-blue-900">URL Tiếp Nhận Webhook SePay:</div>
                      <code className="text-blue-700 font-mono text-[11px] block bg-white p-2 rounded border border-blue-200">
                        {window.location.origin}/api/sepay/webhook
                      </code>
                      <p className="text-[11px] text-blue-800">
                        Hãy copy URL này và cấu hình trong mục Webhook trên website SePay.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="autoSendEmail"
                        checked={config.autoSendEmail}
                        onChange={e => setConfig({ ...config, autoSendEmail: e.target.checked })}
                        className="rounded text-blue-600"
                      />
                      <label htmlFor="autoSendEmail" className="font-semibold text-slate-700 cursor-pointer">
                        Tự động gửi email chứa file PDF ngay khi SePay đối soát thành công
                      </label>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      {configSaved && (
                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Đã lưu cấu hình thành công!
                        </span>
                      )}
                      <button
                        type="submit"
                        className="ml-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer transition-colors"
                      >
                        Lưu Cấu Hình
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 4: NHẬT KÝ EMAIL */}
              {activeTab === 'emails' && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-4 py-3">Mã đơn</th>
                        <th className="px-4 py-3">Người nhận</th>
                        <th className="px-4 py-3">Tiêu đề email</th>
                        <th className="px-4 py-3">Thời gian gửi</th>
                        <th className="px-4 py-3">Trạng thái</th>
                        <th className="px-4 py-3 text-right">Xem file</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {emailLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-mono font-bold text-blue-600">{log.orderCode}</td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900">{log.customerName}</div>
                            <div className="text-slate-500 text-[11px]">{log.toEmail}</div>
                          </td>
                          <td className="px-4 py-3 text-slate-700">{log.subject}</td>
                          <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                            {new Date(log.sentAt).toLocaleString('vi-VN')}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              ĐÃ GỬI TỰ ĐỘNG
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <a
                              href={log.downloadUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold inline-flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Link tải</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {emailLogs.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      Chưa có email nào được gửi trong phiên làm việc.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: WEBHOOK TESTER */}
              {activeTab === 'tester' && (
                <div className="max-w-2xl bg-white p-6 rounded-xl border border-slate-200 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Play className="w-4 h-4 text-blue-600" />
                      <span>Công Cụ Bắn Thử Nghiệm Webhook SePay</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Giúp bạn kiểm thử đối soát tự động: Khớp tiền, Lệch tiền, Sai nội dung, Gửi lặp (Idempotent).
                    </p>
                  </div>

                  <form onSubmit={handleRunTester} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Chọn đơn hàng thử nghiệm:</label>
                      <select
                        value={testOrderCode}
                        onChange={e => {
                          setTestOrderCode(e.target.value);
                          const sel = orders.find(o => o.orderCode === e.target.value);
                          if (sel) setTestAmount(sel.amount);
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                      >
                        <option value="">-- Chọn một đơn hàng --</option>
                        {orders.map(o => (
                          <option key={o.id} value={o.orderCode}>
                            {o.orderCode} - {o.customerName} - {o.productTitle} ({o.amount.toLocaleString('vi-VN')} ₫) - [{o.status}]
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Kịch bản thử nghiệm:</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setTestScenario('exact')}
                          className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                            testScenario === 'exact'
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                              : 'border-slate-200 bg-white text-slate-600'
                          }`}
                        >
                          <div className="font-bold">Khớp 100%</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Đủ tiền &amp; đúng mã đơn</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setTestScenario('underpaid')}
                          className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                            testScenario === 'underpaid'
                              ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold'
                              : 'border-slate-200 bg-white text-slate-600'
                          }`}
                        >
                          <div className="font-bold">Chuyển thiếu tiền</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Test trạng thái need_check</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setTestScenario('wrong_code')}
                          className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                            testScenario === 'wrong_code'
                              ? 'border-rose-500 bg-rose-50 text-rose-900 font-bold'
                              : 'border-slate-200 bg-white text-slate-600'
                          }`}
                        >
                          <div className="font-bold">Sai cú pháp</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Không tìm thấy mã đơn</div>
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Bắn Payload Webhook Giả Lập
                    </button>
                  </form>

                  {testResponse && (
                    <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 text-xs font-mono">
                      <div className="text-sky-400 font-bold">Phản hồi từ Server Webhook Handler:</div>
                      <pre className="text-[11px] overflow-x-auto text-emerald-300">
                        {JSON.stringify(testResponse, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
