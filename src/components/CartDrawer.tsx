import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle, Ticket } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export default function CartDrawer({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, onClearCart }: CartDrawerProps) {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Sizing and totals
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const finalTotal = subtotal - discountAmount;

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'ECLIPSE') {
      setDiscountPercent(15);
      setPromoApplied(true);
    } else if (promoCode.trim().toUpperCase() === 'BLACKSUN') {
      setDiscountPercent(20);
      setPromoApplied(true);
    } else {
      setPromoError('INVALID AUTHENTICATION KEY');
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsCheckingOut(true);
    // Simulate high-security obsidian-nebula digital transaction
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderCompleted(true);
      setOrderNumber(`BS-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 2000);
  };

  const handleResetOrder = () => {
    onClearCart();
    setOrderCompleted(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm"
    >
      {/* Backdrop clickable space */}
      <div className="absolute inset-0 cursor-crosshair" onClick={onClose} />

      {/* Cart Container */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className="relative z-10 w-full max-w-md h-full bg-[#111] border-l border-zinc-800 flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-900 bg-[#161616]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-display text-base font-bold text-zinc-100 uppercase">Shopping Bag</h3>
            <span className="bg-zinc-800 text-zinc-300 font-mono text-[10px] px-2 py-0.5 font-bold">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success screen after order completion */}
        {orderCompleted ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#D4AF37]">
              <CheckCircle className="w-10 h-10 animate-pulse text-[#D4AF37]" />
            </div>

            <div className="space-y-2">
              <h4 className="font-display text-lg font-bold text-white uppercase tracking-tight">ECLIPSE COMPLETE</h4>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed font-sans">
                Your architectural garments have been secured. Standard telemetry shipping protocols activated.
              </p>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 p-4 w-full text-left font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500">ORDER DEPLOYMENT:</span>
                <span className="text-[#D4AF37] font-semibold">{orderNumber}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-900 pt-2">
                <span className="text-zinc-500">TELEMETRY SECURED:</span>
                <span className="text-zinc-300">EST. 3-5 DAYS</span>
              </div>
              <div className="flex justify-between border-t border-zinc-900 pt-2">
                <span className="text-zinc-500">DIGITAL ACCESS KEY:</span>
                <span className="text-cyan-400">CIPHER-{Math.floor(1000 + Math.random() * 9000)}</span>
              </div>
            </div>

            <button
              onClick={handleResetOrder}
              className="w-full bg-[#D4AF37] hover:bg-[#e9c349] text-black font-bold py-4 text-xs font-mono uppercase tracking-widest transition-colors shadow-lg shadow-[#D4AF37]/10"
            >
              CONTINUE EXPLORING
            </button>
          </div>
        ) : (
          <>
            {/* Items view */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <ShoppingBag className="w-12 h-12 text-zinc-700 animate-pulse" />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-400 font-display uppercase tracking-tight">Your bag is vacant</h4>
                    <p className="text-xs text-zinc-600 mt-1 max-w-xs leading-relaxed font-sans">
                      Drape your silhouette in premium high-end technical street style. Select from the curated archive list.
                    </p>
                  </div>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div 
                    key={`${item.product.id}-${item.selectedSize}`} 
                    className="flex gap-4 bg-zinc-950 border border-zinc-900 p-3 relative group"
                  >
                    {/* Image */}
                    <div className="w-16 h-20 bg-zinc-900 overflow-hidden border border-zinc-900 flex-shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    {/* Meta */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className="text-xs font-bold text-zinc-100 font-display uppercase truncate max-w-[150px]">
                            {item.product.title}
                          </h4>
                          <span className="text-xs font-mono font-medium text-zinc-100">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex gap-2 text-[9px] font-mono text-zinc-500 mt-1">
                          <span>SIZE: {item.selectedSize}</span>
                          <span>|</span>
                          <span className="text-[#D4AF37]/80">{item.product.entryNumber}</span>
                        </div>
                      </div>

                      {/* Incrementor */}
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex border border-zinc-900 bg-[#161616] text-[10px] font-mono">
                          <button
                            onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
                            className="px-2 py-1 text-zinc-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-2.5 py-1 text-zinc-100 self-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                            className="px-2 py-1 text-zinc-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(index)}
                          className="text-zinc-600 hover:text-rose-400 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Subtotal, Promo, and Checkout Panel */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-zinc-900 bg-[#161616] space-y-4">
                {/* Promo Code Input */}
                <form onSubmit={applyPromo} className="flex gap-2 border-b border-zinc-900 pb-3.5">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="ENTER AUTH KEY (ECLIPSE / BLACKSUN)"
                    disabled={promoApplied}
                    className="flex-1 bg-zinc-950 border border-zinc-900 focus:border-[#D4AF37] text-[10px] text-white px-3 py-2 outline-none font-mono placeholder-zinc-600 uppercase"
                  />
                  <button
                    type="submit"
                    disabled={!promoCode.trim() || promoApplied}
                    className="border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 text-[10px] px-3 font-mono uppercase tracking-wider transition-colors disabled:opacity-40"
                  >
                    {promoApplied ? 'APPLIED' : 'AUTH'}
                  </button>
                </form>

                {/* Subtotal breakdown */}
                <div className="space-y-1.5 font-mono text-[11px] text-zinc-400">
                  <div className="flex justify-between">
                    <span>CAD ARCHIVE SUB-TOTAL:</span>
                    <span className="text-zinc-200">${subtotal.toFixed(2)}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-emerald-400">
                      <span>ECLIPSE VIP DISCOUNT ({discountPercent}%):</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>TELEMETRY SECURE SHIPPING:</span>
                    <span className="text-zinc-200">FREE</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-white pt-2 border-t border-zinc-900">
                    <span className="text-[#D4AF37]">OBSIDIAN GRAND TOTAL:</span>
                    <span className="text-glow-gold">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Trigger Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-[#D4AF37] hover:bg-[#e9c349] text-black font-bold py-4 text-xs font-mono uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#D4AF37]/10"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>INITIALIZING SECURE LINK...</span>
                    </>
                  ) : (
                    <>
                      <span>INITIATE TRANSACTION DIRECT</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[8px] text-zinc-500 font-mono uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>ECC END-TO-END OBSERVATION NODES ENCRYPTED</span>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
