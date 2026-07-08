import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, ShoppingBag, Truck, CheckCircle, Printer, Sparkles, Send, Phone, MapPin } from 'lucide-react';
import { CartItem, OrderDetails } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onClearCart: () => void;
}

export default function CheckoutModal({ isOpen, onClose, cart, onClearCart }: CheckoutModalProps) {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Guest option, 2: Shipping, 3: Payment, 4: Receipt
  
  // Shipping form state
  const [formData, setFormData] = useState<OrderDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Ghana',
    paymentMethod: 'card',
    isGuest: true,
  });

  // Credit Card state
  const [cardNo, setCardNo] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Order Details Cache
  const [orderId] = useState(() => `DPM-${Math.floor(100000 + Math.random() * 900000)}`);
  const [placedCartItems, setPlacedCartItems] = useState<CartItem[]>([]);

  const totalAmount = cart.length > 0 
    ? cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    : placedCartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleNextStepFromGuest = (isGuest: boolean) => {
    setFormData(prev => ({ ...prev, isGuest }));
    setStep(2);
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Cache the items before clearing the cart
    setPlacedCartItems([...cart]);
    setStep(4);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleFinish = () => {
    onClearCart();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      id="checkout-modal-overlay"
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col relative max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              {step === 4 ? 'Order Placed Successfully' : 'Secure Import Checkout'}
            </h2>
          </div>
          {step !== 4 && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-950 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Checkout Progress Indicator */}
        {step !== 4 && (
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-amber-600' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-amber-100 text-amber-800' : 'bg-slate-200'}`}>1</span>
              <span>Checkout Options</span>
            </div>
            <div className="h-0.5 w-6 bg-slate-200" />
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-amber-600' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-amber-100 text-amber-800' : 'bg-slate-200'}`}>2</span>
              <span>Shipping</span>
            </div>
            <div className="h-0.5 w-6 bg-slate-200" />
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-amber-600' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-amber-100 text-amber-800' : 'bg-slate-200'}`}>3</span>
              <span>Secure Payment</span>
            </div>
          </div>
        )}

        {/* Modal Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* STEP 1: Guest Checkout or Quick Login */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">How would you like to checkout?</h3>
                <p className="text-slate-500 text-xs mt-1">Select an option below to proceed securely.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Guest Option */}
                <div 
                  onClick={() => handleNextStepFromGuest(true)}
                  className="p-5 border-2 border-slate-100 hover:border-amber-500 bg-slate-50 hover:bg-amber-500/5 rounded-xl cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-amber-600" />
                      Checkout as Guest
                    </h4>
                    <p className="text-xs text-slate-500 leading-normal mt-2">
                      Fast and frictionless. No passwords or account setup required. Perfect for a quick acquisition.
                    </p>
                  </div>
                  <button className="mt-5 w-full bg-slate-900 text-white font-bold text-xs py-2.5 rounded-lg">
                    Continue as Guest
                  </button>
                </div>

                {/* Pre-authenticated User Option */}
                <div 
                  onClick={() => handleNextStepFromGuest(false)}
                  className="p-5 border-2 border-slate-100 hover:border-amber-500 bg-slate-50 hover:bg-amber-500/5 rounded-xl cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      Sign Up & Checkout
                    </h4>
                    <p className="text-xs text-slate-500 leading-normal mt-2">
                      Save shipping coordinates and track your imports, earn reward loyalty points, and receive newsletters.
                    </p>
                  </div>
                  <button className="mt-5 w-full bg-amber-500 text-slate-950 font-bold text-xs py-2.5 rounded-lg">
                    Join & Checkout
                  </button>
                </div>
              </div>

              {/* Order summary quick view */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-6 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase">Cart Subtotal ({cart.reduce((s,i)=>s+i.quantity, 0)} Items)</span>
                <span className="font-mono font-extrabold text-slate-900 text-base">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* STEP 2: Shipping and Delivery details */}
          {step === 2 && (
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">Delivery & Contact Coordinates</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="e.g. Kwame Mensah"
                    className="p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="e.g. kwame@gmail.com"
                    className="p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Phone Number (WhatsApp Preferred)</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="e.g. +233 50 123 4567"
                    className="p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">City / Suburb</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="e.g. Medie, Accra, Kumasi"
                    className="p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Physical Address / Landmark</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="e.g. House No. B12, near the Medie Police Station"
                  className="p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none bg-white"
                >
                  <option value="Ghana">Ghana (Local Delivery)</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="International">Other International</option>
                </select>
              </div>

              {/* Form Actions */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  Next: Payment Method
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Integrated secure payment gateway */}
          {step === 3 && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Select Secure Payment Channel</h3>

              {/* Selection Pills */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, paymentMethod: 'card'})}
                  className={`p-3.5 border rounded-xl flex flex-col items-center gap-1.5 transition-all ${
                    formData.paymentMethod === 'card'
                      ? 'border-amber-500 bg-amber-500/5 text-slate-900 font-bold'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-[10px] tracking-wide">Credit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, paymentMethod: 'paypal'})}
                  className={`p-3.5 border rounded-xl flex flex-col items-center gap-1.5 transition-all ${
                    formData.paymentMethod === 'paypal'
                      ? 'border-amber-500 bg-amber-500/5 text-slate-900 font-bold'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold text-xs">PayPal</span>
                  <span className="text-[10px] tracking-wide">Digital Wallet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, paymentMethod: 'applepay'})}
                  className={`p-3.5 border rounded-xl flex flex-col items-center gap-1.5 transition-all ${
                    formData.paymentMethod === 'applepay'
                      ? 'border-amber-500 bg-amber-500/5 text-slate-900 font-bold'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold text-xs"> Pay</span>
                  <span className="text-[10px] tracking-wide">Apple Wallet</span>
                </button>
              </div>

              {/* Conditional Payment Form Details */}
              {formData.paymentMethod === 'card' && (
                <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-amber-500" />
                      Stripe / Card Terminal Gateway
                    </span>
                    <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">256-Bit Encrypted</span>
                  </div>

                  <div className="flex flex-col gap-1 mt-2">
                    <label className="text-[9px] font-bold uppercase text-slate-500">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Kwame Mensah"
                      defaultValue={formData.fullName}
                      className="p-2.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase text-slate-500">Credit Card Number</label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      value={cardNo}
                      onChange={(e) => {
                        // format to card sequence
                        const v = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                        setCardNo(v);
                      }}
                      placeholder="4000 1234 5678 9010"
                      className="p-2.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold uppercase text-slate-500">Expiry Date</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={cardExp}
                        onChange={(e) => {
                          const v = e.target.value.replace('/', '').replace(/(\d{2})/g, '$1/').replace(/\/$/, '');
                          setCardExp(v);
                        }}
                        placeholder="MM/YY"
                        className="p-2.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none font-mono"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold uppercase text-slate-500">Security Code (CVV)</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className="p-2.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'paypal' && (
                <div className="p-5 bg-amber-500/5 rounded-xl border border-amber-500/10 text-center space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    You will be securely redirected to the PayPal portal to authorize payment for <span className="font-bold">${totalAmount.toFixed(2)}</span> after clicking order below.
                  </p>
                  <div className="inline-block px-4 py-2 bg-slate-900 text-amber-400 font-black text-xs rounded-lg uppercase tracking-wider font-sans">
                    PayPal checkout sandbox active
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'applepay' && (
                <div className="p-5 bg-slate-900 text-white rounded-xl text-center space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Quickly authenticate using Apple TouchID or FaceID connected securely to your digital wallets.
                  </p>
                  <button type="button" className="inline-block px-5 py-2.5 bg-white text-slate-950 font-black text-xs rounded-lg uppercase font-mono">
                     Pay with Wallet
                  </button>
                </div>
              )}

              {/* Total Summary */}
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-slate-900">
                <span className="text-xs font-extrabold text-slate-500 uppercase">Grand Total</span>
                <span className="font-mono text-xl font-black text-slate-950">${totalAmount.toFixed(2)}</span>
              </div>

              {/* Form Actions */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-slate-950 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-extrabold rounded-lg transition-all shadow-md flex items-center gap-1.5"
                >
                  Confirm & Place Order — ${totalAmount.toFixed(2)}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Beautiful Printable Order success receipt */}
          {step === 4 && (
            <div className="space-y-6">
              {/* Animated Success Badge */}
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 bg-emerald-100 text-emerald-600 rounded-full mb-2">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Purchase Successful!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your order has been logged and dispatch is already handling your premium imports. An email receipt was dispatched.
                </p>
              </div>

              {/* Printable Receipt Layout */}
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-4 print:border-none print:bg-white" id="receipt-print-area">
                <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">DEEPLOWMARK</h4>
                    <p className="text-[9px] font-bold text-amber-600 uppercase font-mono tracking-wider">Accessories & Imports</p>
                    <p className="text-[10px] text-slate-400 mt-1">📍 Medie, Accra, Ghana</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-800">Order Receipt</p>
                    <p className="text-xs font-mono font-black text-amber-600 mt-0.5">{orderId}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{new Date().toISOString().split('T')[0]}</p>
                  </div>
                </div>

                {/* Delivery details summary */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Billed & Shipped To</p>
                    <p className="font-semibold text-slate-800 mt-1">{formData.fullName}</p>
                    <p className="text-slate-500 mt-0.5">{formData.phone}</p>
                    <p className="text-slate-500 mt-0.5">{formData.email}</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Shipment Mode</p>
                    <p className="font-semibold text-slate-800 mt-1">Standard Import Airfreight</p>
                    <p className="text-slate-500 mt-0.5">{formData.address}</p>
                    <p className="text-slate-500 mt-0.5">{formData.city}, {formData.country}</p>
                  </div>
                </div>

                {/* Ordered Items summary list */}
                <div className="border-t border-slate-200 pt-3">
                  <p className="font-bold text-slate-400 uppercase text-[9px] tracking-wider mb-2">Itemized Goods</p>
                  <div className="divide-y divide-slate-100">
                    {placedCartItems.map((item) => (
                      <div key={item.product.id} className="py-2 flex justify-between items-center text-xs text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-slate-900 font-mono">[{item.quantity}x]</span>
                          <span className="font-medium">{item.product.name}</span>
                        </div>
                        <span className="font-mono font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t border-slate-200 pt-3 flex justify-between items-center font-bold text-slate-900">
                  <span className="text-xs">Paid Subtotal (Free Shipping)</span>
                  <span className="font-mono text-base font-black text-slate-950">${totalAmount.toFixed(2)}</span>
                </div>

                {/* Footnote with real brand details */}
                <div className="border-t border-dashed border-slate-200 pt-3 text-[10px] text-slate-400 text-center leading-normal">
                  <p>Have questions? Reach out immediately on WhatsApp at <span className="font-bold text-slate-700">+233 59 776 1728</span></p>
                  <p className="mt-0.5">Thank you for supporting Deeplowmark. Enjoy your imported goods!</p>
                </div>
              </div>

              {/* Success Page actions */}
              <div className="flex items-center gap-3.5 pt-4">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="flex-1 px-4 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  Print Receipt
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="flex-1 px-4 py-3 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-black rounded-xl transition-colors text-center shadow-md"
                >
                  Back to Marketplace
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
