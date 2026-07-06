import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { X, Bookmark, Trash2, Eye, Plus } from 'lucide-react';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: Product[];
  onRemoveFromWatchlist: (product: Product) => void;
  onClearWatchlist: () => void;
  onViewProduct: (product: Product) => void;
  onAddToCartDirect: (product: Product, size: string) => void;
}

export default function WatchlistDrawer({
  isOpen,
  onClose,
  watchlist,
  onRemoveFromWatchlist,
  onClearWatchlist,
  onViewProduct,
  onAddToCartDirect
}: WatchlistDrawerProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 cursor-crosshair" onClick={onClose} />

      {/* Drawer Container */}
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
            <Bookmark className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]/20" />
            <h3 className="font-display text-base font-bold text-zinc-100 uppercase">My Watchlist</h3>
            <span className="bg-[#D4AF37] text-black font-mono text-[10px] px-2 py-0.5 font-bold">
              {watchlist.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {watchlist.length > 0 && (
              <button
                onClick={onClearWatchlist}
                className="text-[10px] font-mono tracking-wider text-zinc-500 hover:text-red-400 transition-colors uppercase mr-2"
              >
                Clear All
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Watchlist Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
          <AnimatePresence initial={false}>
            {watchlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 space-y-4">
                <Bookmark className="w-12 h-12 text-zinc-800 stroke-[1]" />
                <div>
                  <h4 className="text-sm font-semibold text-zinc-300 uppercase font-display">Watchlist Empty</h4>
                  <p className="text-xs text-zinc-500 max-w-xs mt-1 leading-relaxed">
                    Bookmark your favorite ARCHIVE and LIMITED drops to keep track of them here.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-[#D4AF37] border border-zinc-800 hover:border-[#D4AF37]/30 text-xs font-mono tracking-widest uppercase transition-all"
                >
                  Explore Archive
                </button>
              </div>
            ) : (
              watchlist.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="flex gap-4 p-3 bg-zinc-950/80 border border-zinc-900 hover:border-zinc-800 transition-all relative group"
                >
                  {/* Product Image */}
                  <div 
                    onClick={() => {
                      onViewProduct(product);
                      onClose();
                    }}
                    className="w-20 h-24 flex-shrink-0 bg-zinc-900 border border-zinc-800 overflow-hidden cursor-pointer relative"
                  >
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Info and action panel */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-[8px] font-mono tracking-widest text-[#D4AF37]/80 uppercase">
                          {product.category}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-600">
                          {product.entryNumber}
                        </span>
                      </div>
                      <h4 
                        onClick={() => {
                          onViewProduct(product);
                          onClose();
                        }}
                        className="text-xs font-bold text-zinc-100 uppercase hover:text-[#D4AF37] transition-colors cursor-pointer mt-0.5"
                      >
                        {product.title}
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono mt-1">${product.price}</p>
                    </div>

                    {/* Sizing quick add to cart */}
                    {!product.soldOut ? (
                      <div className="mt-2 flex items-center gap-1.5 pt-2 border-t border-zinc-900/60">
                        <span className="text-[8px] text-zinc-500 font-mono">QUICK ADD:</span>
                        <div className="flex gap-1">
                          {['S', 'M', 'L'].map((size) => (
                            <button
                              key={size}
                              onClick={() => onAddToCartDirect(product, size)}
                              className="text-[9px] font-mono text-zinc-300 hover:text-black hover:bg-[#D4AF37] border border-zinc-800 hover:border-[#D4AF37] px-1.5 py-0.5 transition-all"
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 pt-2 border-t border-zinc-900/60">
                        <span className="text-[8px] font-mono text-red-500/70 uppercase">
                          DROP SOLD OUT
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveFromWatchlist(product)}
                    className="absolute top-2 right-2 p-1.5 text-zinc-600 hover:text-red-400 transition-colors"
                    title="Remove from watchlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer info panel */}
        <div className="p-5 border-t border-zinc-900 bg-[#141414] text-center">
          <p className="text-[10px] font-mono text-zinc-500 tracking-wider uppercase">
            BLACK SUN — BOOKMARKED SPECIFICATIONS
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
