import React, { useState } from 'react';
import { ShoppingBag, Search, Phone, MapPin, Sparkles } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onNavigateToShop: () => void;
  onNavigateToHome: () => void;
  onSearchChange: (search: string) => void;
  searchTerm: string;
}

export default function Header({
  cart,
  onOpenCart,
  onNavigateToShop,
  onNavigateToHome,
  onSearchChange,
  searchTerm,
}: HeaderProps) {
  const [showSearchInput, setShowSearchInput] = useState(false);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 border-b-2 border-amber-500/20 text-white" id="main-header">
      {/* Top Banner with real user coordinates */}
      <div className="w-full bg-slate-950 text-slate-400 text-[10px] uppercase font-bold tracking-widest py-1.5 px-4 flex flex-col sm:flex-row justify-between items-center gap-1.5 font-sans border-b border-slate-800">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 hover:text-amber-500 transition-colors cursor-pointer">
            <Phone className="w-2.5 h-2.5 text-amber-500" />
            <span>+233 59 776 1728</span>
          </span>
          <span className="hidden md:flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5 text-amber-500" />
            <span>Medie, Greater Accra</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-extrabold tracking-widest text-amber-500 italic">
          <Sparkles className="w-2.5 h-2.5 text-amber-500 animate-pulse" />
          <span>PREMIUM WORLDWIDE IMPORTED ACCESSORIES & GOODS</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-500">
          <span>Guest Checkout Available</span>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {/* Brand Logo */}
        <div 
          onClick={onNavigateToHome}
          className="flex flex-col cursor-pointer group"
          id="brand-logo"
        >
          <span className="font-extrabold text-xl tracking-tighter text-white group-hover:text-amber-500 transition-colors uppercase font-display">
            <span className="text-amber-500">DEEP</span>LOWMARK
          </span>
          <span className="text-[9px] tracking-[0.3em] font-bold text-slate-400 uppercase font-mono -mt-1 group-hover:text-white transition-colors">
            Accessories & Imports
          </span>
        </div>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-300">
          <button 
            onClick={onNavigateToHome}
            className="hover:text-white transition-colors duration-150 py-2 relative group"
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button 
            onClick={onNavigateToShop}
            className="hover:text-white transition-colors duration-150 py-2 relative group"
          >
            Shop All
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          {/* Interactive Search Bar */}
          <div className="relative flex items-center">
            {showSearchInput ? (
              <div className="flex items-center border border-slate-700 rounded bg-slate-800 px-3 py-1.5 w-40 sm:w-56 transition-all">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search imports..."
                  value={searchTerm}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                  }}
                  className="bg-transparent text-xs w-full focus:outline-none text-white"
                  autoFocus
                />
                <button 
                  onClick={() => {
                    onSearchChange('');
                    setShowSearchInput(false);
                  }}
                  className="text-slate-400 hover:text-white text-xs ml-1 font-bold font-sans"
                >
                  ×
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setShowSearchInput(true);
                  onNavigateToShop();
                }}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-all"
                title="Search Products"
              >
                <Search className="w-4.5 h-4.5" />
              </button>
            )}
          </div>

          {/* Cart Icon Trigger */}
          <button
            onClick={onOpenCart}
            className="p-2.5 bg-slate-800 hover:bg-amber-500 text-slate-300 hover:text-slate-900 rounded transition-all duration-300 flex items-center justify-center relative shadow-sm border border-slate-700 hover:border-amber-500"
            id="cart-trigger-btn"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 rounded-full leading-none h-4 min-w-4 flex items-center justify-center border border-slate-900 shadow-md">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
