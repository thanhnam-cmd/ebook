import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  Loader2,
  Download,
  AlertTriangle,
  Play,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Mail,
  FileText
} from 'lucide-react';
import { Product, Order } from '../types';

interface CheckoutModalProps {
  product: Product | null;
  onClose: () => void;
  onOrderPaidSuccess?: (order: Order) => void;
}

type CheckoutStep = 'INFO' | 'QR' | 'SUCCESS';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  product,
  onClose,
  onOrderPaidSuccess,
}) => {
  const [step, setStep] = useState<CheckoutStep>('INFO');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [createError, setCreateError] = useState('');

  // Order & Bank Data from Server
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [bankInfo, setBankInfo] = useState<any>(null);

  // Copy Feedback
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Countdown timer for Screen 2 (15 minutes)
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  // Simulator state
  const [simulatorStatus, setSimulatorStatus] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Polling ref
  const pollingIntervalRef = useRef<any>(null);

  // Copy helper
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Step 1 -> Step 2: Create Order
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!customerName.trim() || !customerEmail.trim()) {
      setCreateError('Vui lòng điền đầy đủ Họ tên và Email nhận tài liệu.');
      return;
    }

    setIsCreatingOrder(true);
    setCreateError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          productId: product.id,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Lỗi khi tạo đơn hàng');
      }

      const data = await res.json();
      setCurrentOrder(data.order);
      setBankInfo(data.bankInfo);
      setTimeLeft(15 * 60);
      setStep('QR');
    } catch (err: any) {
      setCreateError(err.message || 'Không thể tạo đơn hàng, vui lòng thử lại.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Step 2: Polling for payment status against SePay Live API
  useEffect(() => {
    if (step !== 'QR' || !currentOrder) return;

    // Polling every 2.5 seconds with live SePay synchronization
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/sepay/check-order/${currentOrder.orderCode}`);
        if (res.ok) {
          const data = await res.json();
          if (data.order && data.order.status === 'paid') {
            setCurrentOrder(data.order);
            clearInterval(pollingIntervalRef.current);
            setStep('SUCCESS');
            if (onOrderPaidSuccess) {
              onOrderPaidSuccess(data.order);
            }
          } else if (data.order && data.order.status === 'need_check') {
            setCurrentOrder(data.order);
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2500);

    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [step, currentOrder, onOrderPaidSuccess]);

  // Countdown timer effect
  useEffect(() => {
    if (step !== 'QR') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  // SePay Simulator Handlers
  const handleSimulatePayment = async (scenario: 'exact' | 'underpaid' | 'wrong_code') => {
    if (!currentOrder) return;
    setIsSimulating(true);
    setSimulatorStatus(null);

    try {
      const res = await fetch('/api/sepay/test-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderCode: currentOrder.orderCode,
          scenario,
        }),
      });

      const data = await res.json();
      setSimulatorStatus(data.message);

      if (data.status === 'paid') {
        setCurrentOrder(data.order);
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        setTimeout(() => {
          setStep('SUCCESS');
          if (onOrderPaidSuccess) onOrderPaidSuccess(data.order);
        }, 1200);
      } else if (data.status === 'need_check') {
        setCurrentOrder(data.order);
      }
    } catch (err: any) {
      setSimulatorStatus('Lỗi khi giả lập SePay webhook.');
    } finally {
      setIsSimulating(false);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Lock background scroll while modal is open
  useEffect(() => {
    if (!product) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [product]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-hidden no-scrollbar">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh] no-scrollbar">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {step === 'INFO' && 'MÀN 1 · THÔNG TIN ĐẶT MUA'}
              {step === 'QR' && 'MÀN 2 · QUÉT MÃ QR (SEPAY)'}
              {step === 'SUCCESS' && 'MÀN 3 · THANH TOÁN THÀNH CÔNG'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================== */}
        {/* MÀN 1: THÔNG TIN ĐẶT MUA (GUEST CHECKOUT)                     */}
        {/* ============================================================== */}
        {step === 'INFO' && (
          <div className="p-4 sm:p-7 space-y-5 overflow-y-auto no-scrollbar flex-1">
            {/* Selected Product Summary Box */}
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                  {product.type === 'combo' ? 'Gói Combo Đã Chọn' : 'Ebook Đã Chọn'}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {product.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1">{product.tagline}</p>
                <div className="text-xs text-slate-600 flex items-center gap-2 pt-1 font-mono">
                  <span>PDF · {product.pages} trang</span>
                  {product.original_price > product.price && (
                    <span className="text-emerald-700 font-bold">
                      · Tiết kiệm {(product.original_price - product.price).toLocaleString('vi-VN')} ₫
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xl sm:text-2xl font-black text-blue-600 tabular-nums">
                  {product.price.toLocaleString('vi-VN')} ₫
                </div>
                {product.original_price > product.price && (
                  <div className="text-xs text-slate-400 line-through tabular-nums">
                    {product.original_price.toLocaleString('vi-VN')} ₫
                  </div>
                )}
              </div>
            </div>

            {/* Guest Checkout Form */}
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Họ tên của bạn <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Email nhận ebook <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="email@cuaban.com"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  File tài liệu PDF sẽ được gửi tự động đến địa chỉ email này ngay sau khi quét QR.
                </p>
              </div>

              {createError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 rounded-lg">
                  {createError}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isCreatingOrder}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isCreatingOrder ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang tạo mã đơn hàng...</span>
                    </>
                  ) : (
                    <>
                      <span>Tiếp tục thanh toán</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Giao dịch an toàn qua SePay VietQR · Bảo mật thông tin 100%</span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MÀN 2: QUÉT MÃ QR (SEPAY VIETQR)                              */}
        {/* ============================================================== */}
        {step === 'QR' && currentOrder && bankInfo && (
          <div className="p-4 sm:p-7 space-y-5 overflow-y-auto no-scrollbar flex-1">
            {/* Countdown & Status Header */}
            <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-semibold">
                <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                <span>Đang chờ thanh toán... trang tự chuyển khi SePay xác nhận.</span>
              </div>
              <span className="font-mono font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded">
                {formatTimer(timeLeft)}
              </span>
            </div>

            {/* Discrepancy warning banner if underpaid */}
            {currentOrder.status === 'need_check' && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Cảnh báo lệch số tiền:</strong> {currentOrder.paymentDetails?.discrepancyNote || 'Số tiền nhận được chưa đủ so với giá trị đơn hàng.'}
                  <div className="mt-1 text-[11px] text-rose-700">
                    Vui lòng chuyển tiếp phần còn thiếu hoặc liên hệ hỗ trợ để được duyệt thủ công.
                  </div>
                </div>
              </div>
            )}

            {/* QR Code and Bank Details Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              {/* QR Image Box */}
              <div className="sm:col-span-5 flex flex-col items-center">
                <div className="relative p-2.5 bg-white border-2 border-blue-500 rounded-2xl shadow-md group">
                  <img
                    src={bankInfo.vietQrUrl || bankInfo.sepayQrUrl}
                    alt="VietQR SePay Payment"
                    className="w-44 h-44 object-contain rounded-lg"
                    onError={(e) => {
                      // Fallback to SePay direct QR endpoint
                      (e.target as HTMLImageElement).src = bankInfo.sepayQrUrl;
                    }}
                  />
                  <div className="absolute inset-0 bg-blue-600/5 pointer-events-none rounded-xl" />
                </div>
                <div className="mt-2 text-center">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1">
                    <QrCode className="w-3.5 h-3.5 text-blue-600" />
                    <span>Quét bằng App Ngân Hàng bất kỳ</span>
                  </span>
                </div>
              </div>

              {/* Transfer Details with 1-Click Copy */}
              <div className="sm:col-span-7 space-y-2.5 text-xs">
                {/* Amount */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Số tiền thanh toán:</span>
                    <span className="font-black text-blue-600 text-base sm:text-lg tabular-nums">
                      {currentOrder.amount.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(currentOrder.amount.toString(), 'amount')}
                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                    title="Sao chép số tiền"
                  >
                    {copiedField === 'amount' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Transfer Content / Order Code */}
                <div className="p-2.5 bg-blue-50/70 border-2 border-blue-400/60 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-blue-900 font-bold block text-[11px]">
                      Nội dung chuyển khoản (Bắt buộc):
                    </span>
                    <span className="font-mono font-black text-blue-700 text-base tracking-wider">
                      {currentOrder.orderCode}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(currentOrder.orderCode, 'code')}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-blue-700 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    {copiedField === 'code' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Chép mã</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Bank & Account */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Ngân hàng / STK:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {bankInfo.bankCode} · {bankInfo.accountNumber}
                    </span>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Chủ TK: {bankInfo.accountName}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(bankInfo.accountNumber, 'acc')}
                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                    title="Sao chép số tài khoản"
                  >
                    {copiedField === 'acc' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* SEPAY TESTING SIMULATOR (Very helpful for user testing without real bank transfer!) */}
            <div className="pt-3 border-t border-slate-200">
              <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                    <Play className="w-3.5 h-3.5" />
                    <span>Bộ Giả Lập SePay Webhook (Testing Simulator)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Thử nghiệm tức thì
                  </span>
                </div>

                <p className="text-[11px] text-slate-300">
                  Bấm để mô phỏng SePay bắn webhook về máy chủ với các kịch bản đối soát:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleSimulatePayment('exact')}
                    disabled={isSimulating}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSimulating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>Giả lập Khớp 100% (Thành công)</span>
                  </button>

                  <button
                    onClick={() => handleSimulatePayment('underpaid')}
                    disabled={isSimulating}
                    className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Giả lập Chuyển thiếu tiền (Lệch)</span>
                  </button>
                </div>

                {simulatorStatus && (
                  <div className="p-2 bg-slate-800 rounded text-[11px] text-sky-300 font-mono mt-1">
                    {simulatorStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MÀN 3: THANH TOÁN THÀNH CÔNG                                  */}
        {/* ============================================================== */}
        {step === 'SUCCESS' && currentOrder && (
          <div className="p-5 sm:p-8 text-center space-y-6 overflow-y-auto no-scrollbar flex-1">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Cảm ơn bạn đã mua ebook!
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                Ebook <strong>&ldquo;{currentOrder.productTitle}&rdquo;</strong> đã được kích hoạt gửi đến hòm thư{' '}
                <strong className="text-blue-600">{currentOrder.customerEmail}</strong>.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Chưa thấy email? Vui lòng kiểm tra thư rác (Spam) hoặc liên hệ đội ngũ hỗ trợ.
              </p>
            </div>

            {/* Order Receipt Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-2 max-w-md mx-auto font-mono">
              <div className="flex justify-between text-slate-500">
                <span>Mã đơn hàng:</span>
                <span className="font-bold text-slate-900">{currentOrder.orderCode}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Số tiền đã thanh toán:</span>
                <span className="font-bold text-emerald-600">
                  {currentOrder.amount.toLocaleString('vi-VN')} ₫
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Trạng thái:</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Đã thanh toán (SePay Verified)
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Thời gian:</span>
                <span>{new Date(currentOrder.paidAt || Date.now()).toLocaleTimeString('vi-VN')}</span>
              </div>
            </div>

            {/* Actions: Download PDF directly & Go Home */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`/api/download/${currentOrder.downloadToken}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-500/25 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Tải hoặc Đọc Ebook PDF Ngay</span>
              </a>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
