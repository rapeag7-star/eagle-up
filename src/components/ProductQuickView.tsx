import React, { useState } from 'react';
import { Star, X, Plus, Minus, ShoppingBag, ClipboardList, MessageSquare, BadgeAlert } from 'lucide-react';
import { Product, Review } from '../types';

interface ProductQuickViewProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onAddReview: (productId: string, review: Review) => void;
}

export default function ProductQuickView({
  product,
  onClose,
  onAddToCart,
  onAddReview,
}: ProductQuickViewProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'info' | 'specs' | 'reviews'>('info');

  // Review Form States
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState(false);

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      name: reviewName,
      rating: reviewRating,
      date: new Date().toISOString().split('T')[0],
      comment: reviewComment,
    };

    onAddReview(product.id, newReview);

    // Reset Form
    setReviewName('');
    setReviewRating(5);
    setReviewComment('');
    setReviewSuccessMsg(true);

    setTimeout(() => {
      setReviewSuccessMsg(false);
    }, 4000);
  };

  // Star render helper
  const renderStars = (rating: number, interactive = false, onClick?: (rating: number) => void) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          onClick={() => interactive && onClick && onClick(i)}
          className={`w-4 h-4 ${
            i <= rating 
              ? 'fill-amber-400 text-amber-400' 
              : 'text-slate-200'
          } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
        />
      );
    }
    return stars;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
      id="product-quickview-modal"
    >
      <div 
        className="relative bg-white rounded-lg w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row my-8 max-h-[90vh] md:max-h-[85vh] border border-slate-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded text-slate-500 hover:text-slate-900 transition-colors shadow-sm"
          title="Close Dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Product Images Gallery */}
        <div className="w-full md:w-1/2 p-5 bg-slate-50 flex flex-col justify-between border-r border-slate-200">
          <div className="flex-grow flex items-center justify-center min-h-[250px] md:min-h-[350px] max-h-[400px]">
            <img
              src={product.images[activeImageIndex]}
              alt={`${product.name} Preview`}
              className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Thumbnails switcher */}
          {product.images.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 rounded overflow-hidden border-2 bg-white transition-all ${
                    idx === activeImageIndex 
                      ? 'border-amber-500 scale-102 shadow-sm' 
                      : 'border-slate-200 hover:border-slate-400 opacity-85'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Configuration */}
        <div className="w-full md:w-1/2 p-5 md:p-6 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-none">
          <div>
            {/* Category tag */}
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-sans block">
              {product.category}
            </span>

            {/* Title */}
            <h2 className="text-lg sm:text-xl font-bold text-slate-950 mt-1 tracking-tight leading-snug">
              {product.name}
            </h2>

            {/* Stars row */}
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex items-center gap-0.5">{renderStars(product.rating)}</div>
              <span className="text-[10px] text-slate-400 font-bold font-mono">
                {product.rating} / 5.0
              </span>
              <span className="text-xs text-slate-200">|</span>
              <span className="text-[10px] font-bold text-amber-600 hover:underline uppercase tracking-wider cursor-pointer" onClick={() => setActiveTab('reviews')}>
                {product.reviews.length} REVIEWS
              </span>
            </div>

            {/* Price section */}
            <div className="mt-3.5 bg-slate-50 p-3.5 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block font-sans">Import Price</span>
                <span className="text-xl font-mono font-bold text-slate-950">${product.price.toFixed(2)}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block font-sans">Availability</span>
                {product.stock > 0 ? (
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    {product.stock} IN STOCK
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                    OUT OF STOCK
                  </span>
                )}
              </div>
            </div>

            {/* Tabs Selector */}
            <div className="flex border-b border-slate-200 mt-5 gap-5">
              <button
                onClick={() => setActiveTab('info')}
                className={`pb-2 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
                  activeTab === 'info'
                    ? 'border-amber-500 text-slate-950 font-black'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
                  activeTab === 'specs'
                    ? 'border-amber-500 text-slate-950 font-black'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Specs
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
                  activeTab === 'reviews'
                    ? 'border-amber-500 text-slate-950 font-black'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Reviews ({product.reviews.length})
              </button>
            </div>

            {/* Tab content */}
            <div className="mt-3.5 min-h-[140px]">
              {activeTab === 'info' && (
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {product.description}
                </p>
              )}

              {activeTab === 'specs' && (
                <div className="border border-slate-200 rounded overflow-hidden divide-y divide-slate-200 bg-slate-50">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between p-2 text-xs">
                      <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">{key}</span>
                      <span className="text-slate-900 text-right font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-3.5">
                  {/* Reviews list */}
                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                    {product.reviews.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to leave feedback!</p>
                    ) : (
                      product.reviews.map((rev) => (
                        <div key={rev.id} className="p-2.5 bg-slate-50 rounded border border-slate-200">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-xs text-slate-800">{rev.name}</span>
                            <span className="text-[9px] text-slate-400 font-mono">{rev.date}</span>
                          </div>
                          <div className="flex items-center gap-0.5 my-1">
                            {renderStars(rev.rating)}
                          </div>
                          <p className="text-xs text-slate-600 leading-normal">{rev.comment}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Review Form */}
                  <form onSubmit={handleSubmitReview} className="border-t border-slate-200 pt-3.5 mt-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-800 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                      Write an Import Review
                    </h4>
                    {reviewSuccessMsg && (
                      <div className="my-2 p-2 bg-emerald-50 text-emerald-800 text-xs rounded font-bold border border-emerald-100 flex items-center gap-2">
                        <span>✓</span> Published successfully.
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3 mt-2.5">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="p-2 border border-slate-200 rounded text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                        required
                      />
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rating:</span>
                        <div className="flex items-center gap-0.5">{renderStars(reviewRating, true, setReviewRating)}</div>
                      </div>
                    </div>
                    <textarea
                      placeholder="Share your experience..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={2}
                      className="w-full p-2 border border-slate-200 rounded text-xs mt-2 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full mt-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-900 text-white font-bold text-[10px] uppercase tracking-widest py-2 rounded transition-colors"
                    >
                      Post Review
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Action Row: Quantity + Add to Cart */}
          {activeTab !== 'reviews' && (
            <div className="border-t border-slate-200 pt-4 mt-4 flex flex-col sm:flex-row items-center gap-3">
              {/* Quantity Selectors */}
              <div className="flex items-center border border-slate-200 rounded bg-slate-50 p-0.5">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded disabled:opacity-40"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-black text-slate-800 font-mono w-10 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add button */}
              <button
                type="button"
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
                disabled={product.stock === 0}
                className="w-full sm:flex-grow bg-slate-900 hover:bg-amber-500 hover:text-slate-900 text-white font-bold text-xs uppercase tracking-widest py-3 px-5 rounded transition-all flex items-center justify-center gap-2 shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Bag — ${(product.price * quantity).toFixed(2)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
