import React from 'react';
import { X, Trash2, Plus, Minus, ShieldCheck, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onTriggerCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onTriggerCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden" 
      id="cart-drawer-overlay"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs" />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          className="w-screen max-w-md bg-slate-900 text-white shadow-2xl flex flex-col border-l border-amber-500/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <h2 className="text-xs font-black uppercase tracking-widest text-white">Your Shopping Bag</h2>
              <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded font-black font-mono">
                {cart.reduce((total, item) => total + item.quantity, 0)} ITEMS
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Content / List of Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center pb-12">
                <div className="p-4 bg-slate-850 rounded text-slate-500 mb-4 border border-slate-800">
                  <ShoppingBag className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">Your bag is empty</h3>
                <p className="text-slate-400 text-xs max-w-xs mt-1 leading-relaxed">
                  Browse our high-quality imports and add some stylish accessories to your desk or outfit!
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-widest px-5 py-3 rounded transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div 
                    key={item.product.id} 
                    className="flex items-center gap-4 p-3 bg-slate-950 rounded border border-slate-800 group relative"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 bg-slate-900 rounded overflow-hidden border border-slate-800 shrink-0">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-amber-500 block">
                        {item.product.category}
                      </span>
                      <h4 className="text-white font-bold text-xs truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-slate-300 font-mono font-bold text-xs mt-0.5">
                        ${item.product.price.toFixed(2)}
                      </p>

                      {/* Quantity Selectors & Delete */}
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center border border-slate-800 rounded bg-slate-900 p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-white font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-slate-400 hover:text-white"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded hover:bg-slate-850 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer with pricing and checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-800 bg-slate-950 space-y-4 text-slate-300">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Bag Subtotal</span>
                  <span className="font-mono text-white font-bold">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Shipping & Delivery</span>
                  <span className="text-amber-500 font-bold uppercase text-[9px] tracking-widest">Free Import Shipping</span>
                </div>
                <div className="border-t border-slate-800 my-2 pt-2.5 flex justify-between text-sm font-bold text-white">
                  <span>Estimated Total</span>
                  <span className="font-black font-mono text-base text-amber-500">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Guarantees */}
              <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex items-center gap-2 text-[10px] text-slate-400 leading-normal font-sans">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>SSL Encrypted Secure Payment Sourced Safely.</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onTriggerCheckout();
                }}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-widest py-4 rounded transition-all duration-150 flex items-center justify-center gap-2 shadow-lg"
              >
                Proceed to Secure Checkout
              </button>

              <button
                onClick={onClose}
                className="w-full text-center text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors py-1"
              >
                Continue Browsing Imports
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
