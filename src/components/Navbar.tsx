import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Menu,
  X,
  ArrowRight,
  BookCheck,
  Users,
  HelpCircle,
  Home,
} from 'lucide-react';

export type AppRoute = 'home' | 'products' | 'author' | 'blog' | 'faq' | 'admin';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onQuickBuy?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onQuickBuy,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = currentRoute === 'home';
  const isTransparent = isHome && !scrolled;

  // Detect scroll to toggle navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [mobileMenuOpen]);

  const handleMobileNav = (route: AppRoute) => {
    setMobileMenuOpen(false);
    onNavigate(route);
  };

  const navLinks: { route: AppRoute; label: string; icon: React.ReactNode }[] = [
    { route: 'home', label: 'Trang chủ', icon: <Home className="w-4 h-4" /> },
    { route: 'products', label: 'Sách & Ebook', icon: <BookCheck className="w-4 h-4" /> },
    { route: 'author', label: 'Tác giả', icon: <Users className="w-4 h-4" /> },
    { route: 'blog', label: 'Blog', icon: <BookOpen className="w-4 h-4" /> },
    { route: 'faq', label: 'Câu hỏi', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 select-none ${
          isTransparent
            ? 'bg-[#102744]/55 backdrop-blur-md border-b border-white/10'
            : 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3">
          {/* Zone 1: Brand Wordmark - Logo ĐĂNG TRÍ */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 sm:gap-3 shrink-0 group text-left cursor-pointer"
          >
            <img
              src="/assets/logo.png"
              alt="ĐĂNG TRÍ"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-contain shrink-0"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div>
              <div className={`text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-1.5 leading-none ${isTransparent ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800 }}>
                <span>ĐĂNG TRÍ</span>
              </div>
              <div className={`text-[11px] sm:text-xs font-medium tracking-tight mt-0.5 ${isTransparent ? 'text-white/70' : 'text-slate-500'}`} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                Tri thức thay đổi cuộc sống
              </div>
            </div>
          </button>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 text-sm font-semibold">
            {navLinks.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => onNavigate(item.route)}
                  className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 text-xs lg:text-sm font-bold ${
                    isTransparent
                      ? isActive
                        ? 'text-white bg-white/20'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                      : isActive
                      ? 'text-blue-700 bg-blue-50 shadow-xs'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Mobile Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-colors cursor-pointer active:scale-95 shrink-0 ${
                isTransparent ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
              aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu điều hướng'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-start bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-hidden no-scrollbar">
          {/* Backdrop Click to close */}
          <div className="absolute inset-0" onClick={() => setMobileMenuOpen(false)} />

          <div className="relative z-10 bg-white border-b border-slate-200 shadow-2xl px-4 py-5 animate-in slide-in-from-top-4 duration-200 max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/logo.png"
                  alt="ĐĂNG TRÍ"
                  className="w-7 h-7 rounded-lg object-contain shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span className="font-extrabold text-slate-900 text-sm">ĐĂNG TRÍ</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="flex flex-col space-y-1.5">
              {navLinks.map((item) => {
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.route}
                    onClick={() => handleMobileNav(item.route)}
                    className={`w-full min-h-[46px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm font-bold transition-colors ${
                      isActive
                        ? 'text-blue-700 bg-blue-50 border border-blue-200/60'
                        : 'text-slate-800 hover:bg-slate-50 hover:text-blue-600'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-blue-600' : 'text-slate-500'}>{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                    <ArrowRight className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
