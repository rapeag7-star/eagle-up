import React from 'react';
import { Star, Eye, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView, onAddToCart }: ProductCardProps) {
  // Render star ratings based on rating number
  const renderStars = (rating: number) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />);
      } else if (i === floorRating + 1 && rating % 1 >= 0.5) {
        stars.push(
          <div key={i} className="relative">
            <Star className="w-3.5 h-3.5 text-slate-200" />
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-slate-200" />);
      }
    }
    return stars;
  };

  return (
    <div 
      className="group bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-amber-500/50 hover:shadow-md transition-all duration-200 flex flex-col h-full relative"
      id={`product-card-${product.id}`}
    >
      {/* Image Container with overlays */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden cursor-pointer border-b border-slate-100" onClick={() => onQuickView(product)}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.bestSeller && (
            <span className="px-1.5 py-0.5 text-[8px] font-black tracking-widest text-slate-900 bg-amber-500 uppercase rounded">
              Best Seller
            </span>
          )}
          {product.featured && !product.bestSeller && (
            <span className="px-1.5 py-0.5 text-[8px] font-black tracking-widest text-white bg-slate-900 uppercase rounded">
              Featured
            </span>
          )}
        </div>

        {/* Hover Action Overlays - Compact and High Density styled */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="bg-amber-500 text-slate-900 font-bold text-[10px] tracking-wider uppercase px-3 py-1.5 rounded shadow-lg hover:bg-amber-600 transition-colors"
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-3.5 flex flex-col flex-grow">
        {/* Category Tag */}
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 font-sans">
          {product.category}
        </span>

        {/* Row with Title and Price */}
        <div className="flex justify-between items-start gap-2 mb-1.5">
          <h3 
            onClick={() => onQuickView(product)}
            className="text-slate-950 font-bold text-xs sm:text-sm tracking-tight hover:text-amber-600 transition-colors cursor-pointer line-clamp-1 leading-snug"
          >
            {product.name}
          </h3>
          <span className="text-amber-600 font-mono font-bold text-xs sm:text-sm shrink-0">
            GH₵{product.price.toFixed(2)}
          </span>
        </div>

        {/* Snippet / Subtitle */}
        <p className="text-[11px] text-slate-500 line-clamp-1 mb-2 italic">
          Imported Quality Goods
        </p>

        {/* Rating and Add to Cart action row */}
        <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">{renderStars(product.rating)}</div>
            <span className="text-[10px] text-slate-400 font-bold ml-1 font-mono">
              ({product.reviewsCount})
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="px-2.5 py-1 bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-900 rounded text-[10px] font-bold uppercase tracking-wider transition-all duration-150 flex items-center gap-1 border border-slate-900 hover:border-amber-500"
          >
            <ShoppingCart className="w-3 h-3" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
