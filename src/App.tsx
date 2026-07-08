import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  ArrowRight, 
  SlidersHorizontal, 
  RotateCcw, 
  Check, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  MessageSquare, 
  Facebook, 
  ChevronRight,
  PhoneCall,
  Inbox,
  UserCheck,
  X
} from 'lucide-react';
import { Product, CartItem, Review } from './types';
import { PRODUCTS, CATEGORIES } from './data';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import ProductQuickView from './components/ProductQuickView';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';

export default function App() {
  // App States
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeView, setActiveView] = useState<'home' | 'shop'>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(250); // slider max
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  // Newsletter signup state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Contact support click simulation
  const [chatOpened, setChatOpened] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                              p.description.toLowerCase().includes(search.toLowerCase()) ||
                              p.category.toLowerCase().includes(search.toLowerCase());
        
        // Category
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
        
        // Price
        const matchesPrice = p.price <= priceRange;
        
        // Rating
        const matchesRating = p.rating >= minRating;

        return matchesSearch && matchesCategory && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // default: featured first, then bestSeller, then id
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        if (a.bestSeller !== b.bestSeller) return a.bestSeller ? -1 : 1;
        return a.id.localeCompare(b.id);
      });
  }, [products, search, selectedCategories, priceRange, minRating, sortBy]);

  // Cart Operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        const newQty = newCart[existingIndex].quantity + quantity;
        newCart[existingIndex].quantity = Math.min(newQty, product.stock);
        return newCart;
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId) {
            return { ...item, quantity: Math.max(1, quantity) };
          }
          return item;
        });
    });
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Add Dynamic Review
  const handleAddReview = (productId: string, newReview: Review) => {
    setProducts((prevProducts) => {
      return prevProducts.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [newReview, ...p.reviews];
          // Recalculate average rating
          const avgRating = Number(
            (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
          );
          return {
            ...p,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: avgRating,
          };
        }
        return p;
      });
    });

    // If currently viewing details, update the modal product reference too
    setSelectedProduct((prev) => {
      if (prev && prev.id === productId) {
        const updatedReviews = [newReview, ...prev.reviews];
        const avgRating = Number(
          (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
        );
        return {
          ...prev,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: avgRating,
        };
      }
      return prev;
    });
  };

  // Toggle Categories selection helper
  const handleToggleCategory = (category: string) => {
    setSelectedCategories((prev) => 
      prev.includes(category) 
        ? prev.filter((c) => c !== category) 
        : [...prev, category]
    );
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setPriceRange(250);
    setMinRating(0);
    setSortBy('featured');
  };

  // Newsletters form submit
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSuccess(false), 5000);
  };

  // Categories quick-link click helper
  const handleQuickCategoryClick = (category: string) => {
    setSelectedCategories([category]);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featuredList = useMemo(() => products.filter(p => p.featured), [products]);
  const bestSellerList = useMemo(() => products.filter(p => p.bestSeller), [products]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-900" id="deeplowmark-app">
      
      {/* HEADER SECTION */}
      <Header 
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateToShop={() => {
          setActiveView('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToHome={() => {
          setActiveView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSearchChange={(val) => {
          setSearch(val);
          setActiveView('shop');
        }}
        searchTerm={search}
      />

      {/* CORE PAGE VIEWS */}
      <main className="flex-grow">
        
        {/* VIEW 1: HOMEPAGE */}
        {activeView === 'home' && (
          <div className="space-y-16 pb-20" id="homepage-view">
            
            {/* Bold Hero Section */}
            <section className="relative bg-slate-900 text-white overflow-hidden py-24 sm:py-32">
              {/* Dynamic Abstract Background Elements */}
              <div className="absolute inset-0 bg-radial-[at_50%_40%] from-blue-900/40 via-transparent to-transparent opacity-80" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-3xl space-y-6">
                  {/* Small trusted label */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold tracking-wide">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>CURATED CODES OF LIVING</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none">
                    Importing Sleek Utility & <span className="text-amber-500">Premium Design</span>
                  </h1>
                  
                  <p className="text-slate-300 text-sm sm:text-lg leading-relaxed max-w-xl">
                    Deeplowmark specializes in handpicked, high-grade tech essentials, modern apparel imports, and minimalist home upgrades curated directly from global creators.
                  </p>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={() => {
                        setActiveView('shop');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded transition-all duration-150 flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      Shop New Arrivals
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCategories([]);
                        setActiveView('shop');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-6 py-3 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded transition-all duration-150 text-center cursor-pointer"
                    >
                      Browse All Imports
                    </button>
                  </div>
                </div>
              </div>

              {/* Minimal Trust Indicator Footers */}
              <div className="border-t border-slate-800/80 mt-16 pt-8 bg-slate-950/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-6 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-500" />
                    <span>Free Shipping on All Orders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>256-bit Encrypted Checkout Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-500" />
                    <span>Direct WhatsApp Query Resolvers</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Category Browsing */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-2 mb-10">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">Curated Import Lines</h2>
                <p className="text-slate-500 text-sm">Select a dynamic category range to target your needs</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CATEGORIES.map((cat, idx) => {
                  const images = [
                    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80', // Tech
                    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80', // Fashion
                    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80'  // Home
                  ];
                  return (
                    <div 
                      key={cat}
                      onClick={() => handleQuickCategoryClick(cat)}
                      className="group relative h-64 rounded-lg overflow-hidden cursor-pointer shadow-xs border border-slate-200"
                    >
                      <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors z-10" />
                      <img 
                        src={images[idx]} 
                        alt={cat} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-6 left-6 z-20 text-white">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono">Category</span>
                        <h3 className="text-lg sm:text-xl font-extrabold tracking-tight mt-0.5">{cat}</h3>
                        <p className="text-xs text-slate-300 mt-1.5 flex items-center gap-1 group-hover:text-amber-300 transition-colors">
                          Explore Collection
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Featured Products Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1 font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Trending Now</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Featured Masterpieces</h2>
                </div>
                <button
                  onClick={() => {
                    setSortBy('featured');
                    setActiveView('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-sm font-bold text-slate-900 hover:text-amber-600 transition-colors flex items-center gap-1 group"
                >
                  View All Featured
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredList.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setSelectedProduct(p)}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                  />
                ))}
              </div>
            </section>

            {/* High Impact About Us section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-900 rounded-lg text-white relative overflow-hidden border border-slate-800 shadow-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8 sm:p-12 relative z-10 items-center">
                <div className="space-y-6">
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-widest font-mono">About Deeplowmark</span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Curating Uncompromised Global Excellence</h2>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    Based locally out of Medie, Greater Accra, we source elite accessories and designer utilities from premier international manufacturing hubs. By forming direct supply partnerships and enforcing strict quality-assurance parameters, we bring you premium imports without the premium markups.
                  </p>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    We specialize in high-concept desktop tech, luxury apparel accessories, and minimalist homeware designed to simplify, elevate, and inspire your daily workflows.
                  </p>
                  <div className="flex flex-wrap gap-6 pt-2 text-xs font-bold text-amber-400">
                    <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Accra - Kumasi Fast Dispatch</span>
                    <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Verified Quality Assured</span>
                    <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> 24/7 Support</span>
                  </div>
                </div>

                {/* Aesthetic Collage Placeholder / Image */}
                <div className="relative h-72 sm:h-96 rounded-lg overflow-hidden border border-slate-800 shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80" 
                    alt="Premium imported ceramics" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end p-6">
                    <div>
                      <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">Artisanal Import Series</p>
                      <h4 className="text-white font-extrabold text-base tracking-tight mt-1">Kyoto Stoneware Collections</h4>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Best Sellers Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1 font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Customer Favorites</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Best Sellers</h2>
                </div>
                <button
                  onClick={() => {
                    setSortBy('rating');
                    setActiveView('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-sm font-bold text-slate-900 hover:text-amber-600 transition-colors flex items-center gap-1 group"
                >
                  View All Best Sellers
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestSellerList.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setSelectedProduct(p)}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                  />
                ))}
              </div>
            </section>

            {/* Dynamic Newsletter & Trust section */}
            <section className="bg-slate-100 py-16 px-4">
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <div className="inline-flex p-3 bg-white text-amber-500 rounded-full shadow-sm">
                  <Inbox className="w-6 h-6 animate-bounce" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">Join the Import VIP List</h3>
                <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                  Subscribe to receive first-look notices on limited shipment arrivals, private clearance sales, and custom curated drops.
                </p>

                {newsletterSuccess ? (
                  <div className="p-4 bg-emerald-50 text-emerald-800 text-sm font-semibold rounded-xl max-w-md mx-auto border border-emerald-100">
                    🎉 Outstanding! You are now subscribed to the Deeplowmark Elite newsletter list.
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="flex-grow p-3.5 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3.5 bg-slate-950 hover:bg-amber-500 hover:text-slate-950 text-white font-extrabold text-sm rounded-xl transition-all"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
                <p className="text-[10px] text-slate-400">Zero spam. Secure privacy protection always active.</p>
              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: PRODUCT CATALOG PAGE */}
        {activeView === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="shop-catalog-view">
            
            {/* Header / Breadcrumb / Banner */}
            <div className="bg-slate-900 rounded-lg p-6 sm:p-10 text-white relative overflow-hidden mb-10 border border-slate-800 shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-950/60 to-transparent z-10" />
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
              <div className="max-w-lg relative z-20 space-y-2">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest font-mono">Deeplowmark Marketplace</span>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Curated Import Catalog</h1>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Seamlessly filter, sort, and procure stylish accessories and lifestyle imports with local dispatch.
                </p>
              </div>
            </div>

            {/* Layout Grid: Sidebar Filter + Catalog display */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* DESKTOP SIDEBAR FILTER */}
              <aside className="hidden lg:block space-y-5 shrink-0 w-64" id="desktop-filter-sidebar">
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 shadow-xs space-y-5">
                  {/* Title & Reset Row */}
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
                    <h3 className="font-extrabold text-[10px] text-slate-800 uppercase tracking-widest flex items-center gap-1.5 font-sans">
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      Filter Options
                    </h3>
                    <button
                      onClick={handleResetFilters}
                      className="text-slate-400 hover:text-amber-600 transition-colors flex items-center gap-1 text-[9px] font-black uppercase tracking-widest"
                      title="Reset all filters"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      Reset
                    </button>
                  </div>

                  {/* Search box within sidebar */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest font-sans">Keywords</span>
                    <input
                      type="text"
                      placeholder="Type model name..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  {/* Categories Filter */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block font-sans">Categories</span>
                    <div className="space-y-1.5">
                      {CATEGORIES.map((cat) => (
                        <label 
                          key={cat} 
                          className="flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat)}
                            onChange={() => handleToggleCategory(cat)}
                            className="w-3.5 h-3.5 accent-amber-500 border-slate-200 rounded text-amber-500 focus:ring-transparent focus:outline-none"
                          />
                          <span>{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400 tracking-widest font-sans">
                      <span>Max Price Limit</span>
                      <span className="text-slate-900 font-bold font-mono">${priceRange.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={250}
                      step={5}
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono">
                      <span>$10</span>
                      <span>$250</span>
                    </div>
                  </div>

                  {/* Minimum Rating Filter */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest font-sans block">Min Customer Rating</span>
                    <div className="space-y-1">
                      {[0, 4, 4.5, 4.8].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setMinRating(rating)}
                          className={`w-full text-left px-2 py-1.5 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-between ${
                            minRating === rating
                              ? 'bg-amber-500/10 text-amber-900 border-l-2 border-amber-500 font-black'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-[10px]">{rating === 0 ? 'All Ratings' : `${rating} stars & up`}</span>
                          {minRating === rating && <Check className="w-3 h-3 text-amber-600" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sorting Filter */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest font-sans block">Sort Order</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full p-2 border border-slate-200 rounded text-xs bg-white focus:outline-none font-medium text-slate-700"
                    >
                      <option value="featured">Featured Curations</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Top Rated First</option>
                    </select>
                  </div>

                </div>
              </aside>

              {/* MOBILE FILTER TRIGGER AND MODAL */}
              <div className="lg:hidden flex flex-col sm:flex-row gap-3.5 mb-6 w-full" id="mobile-filter-bar">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex-1 bg-white border border-slate-200 px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                  Filter & Sort ({selectedCategories.length + (minRating > 0 ? 1 : 0) + (priceRange < 250 ? 1 : 0)})
                </button>
                
                {/* Mobile Sort shortcut */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="flex-1 bg-white border border-slate-200 px-4 py-3 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-low">Sort: Price Low-High</option>
                  <option value="price-high">Sort: Price High-Low</option>
                  <option value="rating">Sort: Top Rated</option>
                </select>
              </div>

              {/* Mobile Filter Modal overlay */}
              {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs lg:hidden">
                  <div className="bg-white rounded-2xl w-full max-w-sm p-6 space-y-6 max-h-[85vh] overflow-y-auto">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <h3 className="font-extrabold text-sm text-slate-900 uppercase">Filters</h3>
                      <button onClick={() => setMobileFiltersOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-900">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Keywords */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Keywords</span>
                      <input
                        type="text"
                        placeholder="Search model name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none"
                      />
                    </div>

                    {/* Categories Checkboxes */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Categories</span>
                      <div className="space-y-2">
                        {CATEGORIES.map((cat) => (
                          <label key={cat} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(cat)}
                              onChange={() => handleToggleCategory(cat)}
                              className="w-4 h-4 accent-amber-500 rounded text-amber-500"
                            />
                            <span>{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        <span>Max Price Limit</span>
                        <span className="text-slate-800 font-extrabold font-mono">${priceRange.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={250}
                        step={5}
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>

                    {/* Minimum Rating */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Min Rating</span>
                      <div className="grid grid-cols-2 gap-2">
                        {[0, 4, 4.5, 4.8].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setMinRating(rating)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                              minRating === rating
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-50 text-slate-600'
                            }`}
                          >
                            {rating === 0 ? 'All' : `${rating}★ & up`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Apply & Reset Buttons */}
                    <div className="pt-4 border-t border-slate-100 flex gap-2">
                      <button
                        onClick={() => {
                          handleResetFilters();
                          setMobileFiltersOpen(false);
                        }}
                        className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                      >
                        Reset All
                      </button>
                      <button
                        onClick={() => setMobileFiltersOpen(false)}
                        className="flex-1 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-lg"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* CATALOG DISPLAY REGION */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Active Filter Pill lists */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="text-xs text-slate-500 font-medium">
                    Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span> luxury goods found
                  </p>

                  {(search || selectedCategories.length > 0 || priceRange < 250 || minRating > 0) && (
                    <div className="flex flex-wrap items-center gap-2">
                      {search && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200">
                          Search: "{search}"
                          <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600 font-bold ml-0.5">×</button>
                        </span>
                      )}
                      {selectedCategories.map((cat) => (
                        <span key={cat} className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/20">
                          {cat}
                          <button onClick={() => handleToggleCategory(cat)} className="text-amber-600 hover:text-amber-800 font-bold ml-0.5">×</button>
                        </span>
                      ))}
                      {priceRange < 250 && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200">
                          Max: ${priceRange}
                          <button onClick={() => setPriceRange(250)} className="text-slate-400 hover:text-slate-600 font-bold ml-0.5">×</button>
                        </span>
                      )}
                      {minRating > 0 && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200">
                          {minRating}★ & up
                          <button onClick={() => setMinRating(0)} className="text-slate-400 hover:text-slate-600 font-bold ml-0.5">×</button>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Main Product Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center space-y-4 shadow-xs">
                    <div className="inline-flex p-4 bg-slate-50 text-slate-400 rounded-full">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                    <h3 className="text-slate-900 font-extrabold text-base sm:text-lg">No matching goods found</h3>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
                      Adjust your categories checkboxes, raise the max price limit, or clear terms to view all pristine imported inventory.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-amber-500 hover:text-slate-950 transition-colors"
                    >
                      Reset Filter Criteria
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onQuickView={(p) => setSelectedProduct(p)}
                        onAddToCart={(p) => handleAddToCart(p, 1)}
                      />
                    ))}
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

      </main>

      {/* FOOTER SECTION with real contact coordinates */}
      <Footer 
        onNavigateToHome={() => {
          setActiveView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToShop={() => {
          setActiveView('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* QUICK VIEW MODAL COMPONENT */}
      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onAddReview={handleAddReview}
        />
      )}

      {/* CART DRAWER SIDEBAR COMPONENT */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onTriggerCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* CHECKOUT FLOW COMPONENT */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onClearCart={handleClearCart}
      />

      {/* Simulated Floating Chat Support Badge for High Fidelity */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end">
        {chatOpened ? (
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-2xl border border-slate-800 w-72 sm:w-80 space-y-3.5 mb-3 transition-all duration-300 transform scale-100 origin-bottom-right">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-xs font-black tracking-wider text-amber-400 uppercase">Live Import Desk</span>
              </div>
              <button onClick={() => setChatOpened(false)} className="text-slate-400 hover:text-white font-bold text-xs">×</button>
            </div>
            <p className="text-xs text-slate-300 leading-normal">
              Greetings! Have questions on wholesale imports, custom orders, or delivery to Accra/Kumasi? Talk directly on WhatsApp.
            </p>
            <a 
              href="https://wa.me/233597761728" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Chat on WhatsApp Now
            </a>
          </div>
        ) : (
          <button
            onClick={() => setChatOpened(true)}
            className="p-4 bg-amber-500 hover:bg-amber-400 text-slate-950 hover:scale-105 rounded-full shadow-2xl flex items-center justify-center gap-2 transition-all group"
            title="Chat with Deeplowmark support"
          >
            <MessageSquare className="w-5 h-5 group-hover:rotate-6 transition-transform" />
            <span className="hidden sm:inline text-xs font-extrabold uppercase tracking-wider">Chat support</span>
          </button>
        )}
      </div>

    </div>
  );
}
