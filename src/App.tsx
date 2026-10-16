import React, { useState, useEffect } from 'react';
import { Navbar, AppRoute } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { AuthorPage } from './pages/AuthorPage';
import { BlogPage } from './pages/BlogPage';
import { FaqPage } from './pages/FaqPage';
import { SupportPage } from './pages/SupportPage';
import { AdminPage } from './pages/AdminPage';

import { ProductDetailModal } from './components/ProductDetailModal';
import { SampleReadModal } from './components/SampleReadModal';
import { BlogDetailModal } from './components/BlogDetailModal';
import { CheckoutModal } from './components/CheckoutModal';

import { INITIAL_PRODUCTS } from './data/initialProducts';
import { INITIAL_BLOGS } from './data/initialBlogs';
import { Product, Order, BlogPost } from './types';
import { useScrollReveal } from './hooks/useScrollReveal';

function getInitialRoute(): AppRoute {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.replace(/^\//, '').toLowerCase();
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  const target = path || hash;

  if (target === 'admin') return 'admin';
  if (target === 'products' || target === 'sach' || target === 'ebook') return 'products';
  if (target === 'author' || target === 'tac-gia') return 'author';
  if (target === 'blog' || target === 'bai-viet') return 'blog';
  if (target === 'faq' || target === 'cau-hoi') return 'faq';
  if (target === 'contact' || target === 'lien-he' || target === 'support' || target === 'ho-tro') return 'contact';
  return 'home';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getInitialRoute);
  const [productFilter, setProductFilter] = useState<'all' | 'combo' | 'single'>('all');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);

  // Modals state
  const [selectedProductForCheckout, setSelectedProductForCheckout] = useState<Product | null>(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [selectedProductForSampleRead, setSelectedProductForSampleRead] = useState<Product | null>(null);
  const [selectedBlogForDetail, setSelectedBlogForDetail] = useState<BlogPost | null>(null);

  // Trigger 250px Scroll Reveal observer on route or data changes
  useScrollReveal(currentRoute);

  // Synchronize Browser History & Popstate (Back/Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (route: AppRoute, filter?: 'all' | 'combo' | 'single') => {
    if (filter) {
      setProductFilter(filter);
    } else if (route === 'products') {
      setProductFilter('all');
    }
    setCurrentRoute(route);
    const newPath = route === 'home' ? '/' : `/${route}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({ route }, '', newPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Real-time synchronization with Backend (Server-Sent Events & Polling)
  useEffect(() => {
    fetchData();

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/events');
      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type !== 'init') {
            fetchData();
          }
        } catch (err) {}
      };
    } catch (err) {
      console.warn('SSE not available, falling back to polling');
    }

    // Polling fallback every 3 seconds to guarantee 100% two-way sync
    const interval = setInterval(() => {
      fetch('/api/sync-version')
        .then((r) => r.json())
        .then((data) => {
          if (data && data.version) {
            fetchData();
          }
        })
        .catch(() => {});
    }, 3000);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(interval);
    };
  }, []);

  // Lock body scroll when ANY modal is open to completely eliminate duplicate scrollbars
  const isAnyModalActive = Boolean(
    selectedProductForDetail ||
    selectedProductForSampleRead ||
    selectedBlogForDetail ||
    selectedProductForCheckout
  );

  useEffect(() => {
    if (isAnyModalActive) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isAnyModalActive]);

  // Fetch products and blogs from server
  const fetchData = async () => {
    try {
      const [prodRes, blogRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/blogs'),
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }
      if (blogRes.ok) {
        const blogData = await blogRes.json();
        setBlogs(blogData);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const handleBuy = (product: Product) => {
    setSelectedProductForDetail(null);
    setSelectedProductForSampleRead(null);
    setSelectedProductForCheckout(product);
  };

  const handleSampleRead = (product: Product) => {
    setSelectedProductForDetail(null);
    setSelectedProductForSampleRead(product);
  };

  const handleOrderPaidSuccess = (order: Order) => {
    console.log('Order paid successfully:', order);
    fetchData();
  };

  // 1. DEDICATED STANDALONE ADMIN ROUTE (/admin)
  if (currentRoute === 'admin') {
    return (
      <AdminPage
        products={products}
        onRefreshProducts={fetchData}
        onNavigate={navigate}
      />
    );
  }

  // 2. PUBLIC STOREFRONT (Home, Products, Author, Blog, Faq, Contact)
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 antialiased selection:bg-blue-600 selection:text-white relative no-scrollbar">
      {/* Universal Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={navigate}
        onQuickBuy={() => handleBuy(products[0])}
      />

      {/* Main Page Content */}
      <main className={`flex-1 ${currentRoute === 'home' ? '' : 'pt-16 sm:pt-[4.5rem]'}`}>
        {currentRoute === 'home' && (
          <HomePage
            products={products}
            blogs={blogs}
            onNavigate={navigate}
            onBuy={handleBuy}
            onViewDetails={(p) => setSelectedProductForDetail(p)}
            onSampleRead={handleSampleRead}
            onSelectBlog={(b) => setSelectedBlogForDetail(b)}
          />
        )}

        {currentRoute === 'products' && (
          <ProductsPage
            products={products}
            initialFilter={productFilter}
            onNavigate={navigate}
            onBuy={handleBuy}
            onSampleRead={handleSampleRead}
          />
        )}

        {currentRoute === 'author' && (
          <AuthorPage
            onNavigate={navigate}
            onQuickBuy={() => handleBuy(products[0])}
          />
        )}

        {currentRoute === 'blog' && (
          <BlogPage
            blogs={blogs}
            products={products}
            onNavigate={navigate}
            onSelectBlog={(b) => setSelectedBlogForDetail(b)}
            onBuyProduct={handleBuy}
          />
        )}

        {currentRoute === 'faq' && (
          <FaqPage onNavigate={navigate} />
        )}

        {currentRoute === 'contact' && (
          <SupportPage onNavigate={navigate} />
        )}
      </main>

      {/* Footer (with hidden admin button, multi-page links) */}
      <Footer onNavigate={navigate} />

      {/* Modals */}
      {selectedProductForDetail && (
        <ProductDetailModal
          product={selectedProductForDetail}
          onClose={() => setSelectedProductForDetail(null)}
          onBuy={handleBuy}
          onSampleRead={handleSampleRead}
        />
      )}

      {selectedProductForSampleRead && (
        <SampleReadModal
          product={selectedProductForSampleRead}
          onClose={() => setSelectedProductForSampleRead(null)}
          onBuy={handleBuy}
        />
      )}

      {selectedBlogForDetail && (
        <BlogDetailModal
          blog={selectedBlogForDetail}
          products={products}
          onClose={() => setSelectedBlogForDetail(null)}
          onBuyProduct={handleBuy}
          onOpenSampleRead={handleSampleRead}
        />
      )}

      {selectedProductForCheckout && (
        <CheckoutModal
          product={selectedProductForCheckout}
          onClose={() => setSelectedProductForCheckout(null)}
          onOrderPaidSuccess={handleOrderPaidSuccess}
          onGoHome={() => navigate('home')}
        />
      )}
    </div>
  );
}
