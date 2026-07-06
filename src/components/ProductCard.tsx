import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react';
import { Product } from '../types';
import { ShoppingBag, Star, Sparkles, Plus, Bookmark } from 'lucide-react';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCartDirect: (product: Product, size: string) => void;
  isWatched?: boolean;
  onToggleWatchlist?: (product: Product) => void;
}

export default function ProductCard({ 
  product, 
  onViewDetails, 
  onAddToCartDirect,
  isWatched = false,
  onToggleWatchlist
}: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Set up motion values for mouse position
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth springs for tilt
  const rotateX = useSpring(useTransform(y, [0, 1], [15, -15]), { damping: 20, stiffness: 150 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-15, 15]), { damping: 20, stiffness: 150 });

  // Gloss/glare effect position
  const glareX = useSpring(useTransform(x, [0, 1], [-10, 110]), { damping: 25, stiffness: 120 });
  const glareY = useSpring(useTransform(y, [0, 1], [-10, 110]), { damping: 25, stiffness: 120 });
  const glareOpacity = useSpring(useTransform(y, [0, 0.5, 1], [0.3, 0.1, 0.3]), { damping: 15, stiffness: 100 });

  // Transform glare positions to percentage strings at top level to satisfy Rules of Hooks
  const glareLeft = useMotionTemplate`${glareX}%`;
  const glareTop = useMotionTemplate`${glareY}%`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize values between 0 and 1
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div className="perspective-1000 w-full h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onViewDetails(product)}
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="group relative cursor-pointer rounded-none border border-zinc-800 bg-[#161616] p-4 transition-all duration-300 hover:border-[#D4AF37]/70 hover:shadow-[0_0_25px_rgba(212,175,55,0.18)] w-full h-full flex flex-col justify-between"
      >
        {/* Gloss/Glare overlays to evoke liquid glass / "Obsidian Nebula" finish */}
        {isHovered && (
          <motion.div
            style={{
              left: glareLeft,
              top: glareTop,
              opacity: glareOpacity,
            }}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-[#D4AF37] filter blur-xl mix-blend-screen"
          />
        )}

        {/* Product Image Area with transform-style 3D */}
        <div 
          style={{ transform: 'translateZ(30px)' }}
          className="aspect-[3/4] overflow-hidden bg-zinc-900 relative mb-4 border border-zinc-900 transform-style-3d group-hover:border-zinc-800 transition-colors flex-shrink-0"
        >
          <img
            src={product.image}
            alt={product.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-112"
          />

          {/* Dynamic Dark Gradient Ambient shadow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Dynamic badge tags */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
            {product.tag && (
              <span className={`text-[9px] font-mono tracking-widest font-bold px-2 py-0.5 rounded-none uppercase ${
                product.tag === 'NEW DROP' ? 'bg-[#D4AF37] text-black text-glow-gold' :
                product.tag === 'LIMITED' ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/30' :
                product.tag === 'SOLD OUT' ? 'bg-red-950/60 text-red-400 border border-red-500/30 animate-glitch-text' : 'bg-black/60 text-zinc-300'
              }`}>
                {product.tag}
              </span>
            )}
          </div>

          {/* Sold out digital glitch layer */}
          {product.soldOut && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 border border-red-950/40">
              {/* Scanlines layer */}
              <div className="absolute inset-0 opacity-[0.2] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[size:100%_4px] pointer-events-none" />
              
              {/* Corner crosshairs or indicators */}
              <div className="absolute inset-2 border border-red-500/10 pointer-events-none flex flex-col justify-between p-1">
                <div className="flex justify-between text-[6px] font-mono text-red-500/30">
                  <span>SYS_STATUS // OUT_OF_STOCK</span>
                  <span>SEC_LINE_01</span>
                </div>
                <div className="flex justify-between text-[6px] font-mono text-red-500/30">
                  <span>CODENAME // VOID</span>
                  <span>[ARCHIVED]</span>
                </div>
              </div>

              {/* Glowing Glitch Text Indicator */}
              <div className="text-center relative select-none">
                <div className="text-[8px] font-mono tracking-[0.2em] text-red-500/40 uppercase mb-0.5">
                  SEC_ARCHIVE
                </div>
                <div className="font-display text-sm font-black tracking-widest uppercase animate-glitch-text text-zinc-400">
                  SOLD OUT
                </div>
                <div className="text-[7px] font-mono tracking-wider text-zinc-600 uppercase mt-1">
                  AWAITING DROP
                </div>
              </div>
            </div>
          )}

          {/* Watchlist toggle button */}
          {onToggleWatchlist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatchlist(product);
              }}
              className="absolute top-3 right-3 z-20 p-1.5 bg-black/70 hover:bg-black/90 text-zinc-400 hover:text-[#D4AF37] border border-zinc-900 hover:border-[#D4AF37]/40 transition-all rounded-none"
              title={isWatched ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              <Bookmark className={`w-3.5 h-3.5 transition-all ${isWatched ? "fill-[#D4AF37] text-[#D4AF37]" : "text-zinc-400"}`} />
            </button>
          )}

          {/* Dynamic Quick Sizing Quick Add button on Desktop Hover */}
          {!product.soldOut && (
            <div className="absolute bottom-3 left-3 right-3 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex justify-center gap-1 bg-black/80 backdrop-blur-md p-1.5 border border-zinc-800 z-15">
              <span className="text-[8px] text-zinc-400 self-center uppercase font-mono mr-1.5">QUICK ADD:</span>
              {['S', 'M', 'L'].map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCartDirect(product, size);
                  }}
                  className="text-[10px] text-zinc-200 hover:text-[#D4AF37] hover:bg-zinc-800 px-2 py-1 font-mono transition-colors"
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Meta Section */}
        <div style={{ transform: 'translateZ(15px)' }} className="space-y-1.5 transform-style-3d flex-1 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <p className={`text-[10px] font-mono tracking-widest uppercase ${product.soldOut ? 'text-zinc-600 animate-glitch-ambient' : 'text-[#D4AF37]/80'}`}>
                {product.category}
              </p>
              <p className="text-[10px] font-mono text-zinc-500">{product.entryNumber}</p>
            </div>

            <div className="flex justify-between items-start gap-2">
              <h3 className={`font-display text-sm font-semibold tracking-tight uppercase group-hover:text-[#D4AF37] transition-colors line-clamp-1 ${product.soldOut ? 'text-zinc-500 animate-glitch-text' : 'text-zinc-100'}`}>
                {product.title}
              </h3>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {product.originalPrice && (
                  <span className="text-xs text-zinc-500 line-through font-mono">
                    ${product.originalPrice}
                  </span>
                )}
                <span className={`text-sm font-mono font-medium ${product.soldOut ? 'text-zinc-500 animate-glitch-ambient' : 'text-zinc-100'}`}>
                  ${product.price}
                </span>
              </div>
            </div>

            <p className={`text-[11px] line-clamp-2 leading-relaxed font-sans ${product.soldOut ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {product.description}
            </p>
          </div>

          {/* View Specification Button indicator */}
          <div className="pt-2 flex items-center justify-between text-[10px] text-[#D4AF37] uppercase font-mono tracking-widest border-t border-zinc-900 mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
            <span className={product.soldOut ? 'text-zinc-500 group-hover:text-[#D4AF37] transition-colors' : ''}>
              {product.soldOut ? 'ARCHIVED SPEC' : 'SPECIFICATIONS'}
            </span>
            <Plus className="w-3.5 h-3.5 transition-transform group-hover:rotate-90 duration-300" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
