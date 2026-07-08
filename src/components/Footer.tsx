import React from 'react';
import { Phone, MapPin, Mail, Facebook, Sparkles, MessageSquare } from 'lucide-react';

interface FooterProps {
  onNavigateToHome: () => void;
  onNavigateToShop: () => void;
}

export default function Footer({ onNavigateToHome, onNavigateToShop }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t-2 border-amber-500/30" id="main-footer">
      {/* Decorative Brand Trust Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-900 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-amber-500/10 text-amber-500">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm">Curated Import Quality</h4>
            <p className="text-slate-400 text-xs mt-1">Hand-selected accessory batches from premier manufacturers.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-amber-500/10 text-amber-500">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm">Immediate Customer Support</h4>
            <p className="text-slate-400 text-xs mt-1">Direct reach on WhatsApp, ensuring 100% resolution confidence.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-amber-500/10 text-amber-500">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm">Physical Hub Presence</h4>
            <p className="text-slate-400 text-xs mt-1">Conveniently located at Medie, Greater Accra for verified trust.</p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* About & Branding Column */}
        <div className="md:col-span-1.5 flex flex-col gap-4">
          <div className="flex flex-col cursor-pointer" onClick={onNavigateToHome}>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              DEEPLOWMARK
            </span>
            <span className="text-xs tracking-[0.25em] font-bold text-amber-500 uppercase font-mono -mt-1">
              Accessories & Imports
            </span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mt-2">
            Deeplowmark specializes in top-tier imported products, cutting-edge electronics, fashion accents, and curated minimalist home goods. Bringing global excellence directly to you.
          </p>
          {/* Social Icons based on actual brand details */}
          <div className="flex items-center gap-3 mt-4">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white hover:bg-amber-500 hover:scale-105 transition-all duration-200"
              title="Facebook: Deeplowmark Accessories & import"
            >
              <Facebook className="w-4 h-4" />
            </a>
            {/* TikTok represented as MessageSquare/Music */}
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white hover:bg-amber-500 hover:scale-105 transition-all duration-200 flex items-center justify-center font-mono text-[10px] font-black"
              title="TikTok: Deeplowmark Accessories & import"
            >
              <span>🎵</span>
            </a>
            <a 
              href="https://wa.me/233597761728" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white hover:bg-amber-500 hover:scale-105 transition-all duration-200"
              title="WhatsApp: +233 59 776 1728"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Navigation Links Column */}
        <div>
          <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-4 font-sans">Explore Shop</h3>
          <ul className="space-y-3 text-xs text-slate-400">
            <li>
              <button onClick={onNavigateToHome} className="hover:text-amber-500 transition-colors">
                Home Showcase
              </button>
            </li>
            <li>
              <button onClick={onNavigateToShop} className="hover:text-amber-500 transition-colors">
                Product Catalog
              </button>
            </li>
            <li>
              <button onClick={onNavigateToShop} className="hover:text-amber-500 transition-colors">
                Tech Accessories
              </button>
            </li>
            <li>
              <button onClick={onNavigateToShop} className="hover:text-amber-500 transition-colors">
                Fashion Imports
              </button>
            </li>
            <li>
              <button onClick={onNavigateToShop} className="hover:text-amber-500 transition-colors">
                Home Decor Goods
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Coordinates Column (Exactly matched to User Uploaded Image) */}
        <div className="md:col-span-1.5">
          <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-4 font-sans">Official Contacts</h3>
          <ul className="space-y-3 text-xs text-slate-400">
            <li className="flex items-start gap-3">
              <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">WhatsApp / Call</p>
                <p className="text-[11px] text-slate-400 mt-0.5">+233 59 776 1728</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Email Inquiry</p>
                <p className="text-[11px] text-slate-400 mt-0.5 hover:text-white transition-colors cursor-pointer">
                  rapeag7@gmail.com
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
              <div>
                <p className="text-white font-medium">Main Office Location</p>
                <p className="text-xs text-slate-400 mt-0.5">Medie, Greater Accra, Ghana</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-slate-950/70 border-t border-slate-900 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 text-center md:text-left">
          <p>© {currentYear} Deeplowmark Accessories & Imports. All Rights Reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Guaranteed Premium Shipments</span>
            <span className="text-slate-700">•</span>
            <span>Accra - Kumasi - Global Delivery</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
