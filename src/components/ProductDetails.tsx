import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ChatMessage } from '../types';
import { 
  X, 
  ShoppingBag, 
  Sparkles, 
  Send, 
  ChevronRight, 
  Cpu, 
  Info, 
  Check, 
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';

interface ProductDetailsProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
}

export default function ProductDetails({ product, onClose, onAddToCart }: ProductDetailsProps) {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'consultant'>('specs');
  
  // Aether Co-Pilot Styling Consultant State
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isConsultantLoading, setIsConsultantLoading] = useState<boolean>(false);
  const [consultantError, setConsultantError] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll AI Consultant thread
  useEffect(() => {
    if (activeTab === 'consultant') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  // Seed AI welcome message specific to the selected product
  useEffect(() => {
    setChatMessages([
      {
        id: 'welcome-advisor',
        sender: 'assistant',
        text: `Welcome to the Obsidian Terminal. I am Aether, your architectural design co-pilot.\n\nI have loaded the blueprint files for **${product.entryNumber} - ${product.title}**.\n\nAsk me how to drape, layer, or color-pair this artifact within your wardrobe, or request custom styling lookbook ideas.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatInput('');
    setConsultantError('');
  }, [product]);

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, quantity);
  };

  const handleSendStylingQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isConsultantLoading) return;

    const userQuery = chatInput;
    setChatInput('');
    setIsConsultantLoading(true);
    setConsultantError('');

    const newUserMsg: ChatMessage = {
      id: `styling-user-${Date.now()}`,
      sender: 'user',
      text: userQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedThread = [...chatMessages, newUserMsg];
    setChatMessages(updatedThread);

    try {
      // Prompt specifically customized for high-end streetwear styling advisor
      const systemInstruction = `You are "Aether", an expert luxury architectural streetwear designer and stylist with an "Obsidian Nebula" dark minimalist brand identity. Provide highly styled, avant-garde wardrobe coordination advice for the "${product.title}" (${product.category}). Use technical fashion terminology such as "drape", "silhouette", "volumetric structure", "chromatic accents", "layering matrices", and "monochromatic gradients". Keep advice atmospheric, concise, inspiring, and fully on-brand. Avoid standard generic suggestions. Always sound extremely premium and high-end.`;

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: updatedThread,
          systemInstruction: systemInstruction
        }),
      });

      if (!res.ok) throw new Error('Aether styling engine unavailable.');

      const data = await res.json();
      
      const assistantMsg: ChatMessage = {
        id: `styling-ai-${Date.now()}`,
        sender: 'assistant',
        text: data.text || 'I analyzed your sizing matrix and fit, but could not produce style notes.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setConsultantError('Connection to Obsidian AI node lost. Retrying orbital sync...');
    } finally {
      setIsConsultantLoading(false);
    }
  };

  // Find volumetric dimensions of selected size
  const activeSizing = product.volumetricSizing.find(s => s.size === selectedSize) || product.volumetricSizing[2];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-black/85 backdrop-blur-sm"
    >
      {/* Tap outside backdrop */}
      <div className="absolute inset-0 cursor-crosshair" onClick={onClose} />

      {/* Slideout Panel */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className="relative z-10 flex flex-col w-full max-w-2xl h-full bg-[#111] border-l border-zinc-800 shadow-2xl overflow-hidden"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-900 bg-[#161616]">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono tracking-widest text-[#D4AF37]/80 uppercase">{product.category}</span>
            <h2 className="font-display text-base font-bold text-zinc-100 uppercase">{product.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Dual Tab Controls */}
        <div className="flex border-b border-zinc-900 bg-[#141414] text-xs font-mono uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('specs')}
            className={`flex-1 py-3 text-center transition-all ${
              activeTab === 'specs' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] bg-zinc-900/40 font-semibold' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            SPECIFICATIONS MATRIX
          </button>
          <button
            onClick={() => setActiveTab('consultant')}
            className={`flex-1 py-3 text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'consultant' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] bg-zinc-900/40 font-semibold' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            AETHER AI STYLE CONSULTANT
          </button>
        </div>

        {/* Content Region */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'specs' ? (
            <div className="space-y-6">
              {/* Product Spline / Immersive Graphic */}
              <div className="aspect-[16/9] w-full bg-zinc-950 overflow-hidden relative border border-zinc-900">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-80" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase bg-black/75 px-2.5 py-1">
                  {product.entryNumber} CAD DEPLOYMENT
                </span>
              </div>

              {/* Dynamic Sizing selector */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Select Size</span>
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase">Volumetric Fit Specifications Loaded</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.volumetricSizing.map((dim) => (
                    <button
                      key={dim.size}
                      onClick={() => setSelectedSize(dim.size)}
                      className={`px-4 py-2.5 border text-xs font-mono transition-all ${
                        selectedSize === dim.size
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] font-bold'
                          : 'border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {dim.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volumetric sizing grid details */}
              <div className="bg-zinc-950 border border-zinc-900 p-4 space-y-3">
                <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-2">
                  <Info className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">Sizing Dimension Matrix ({selectedSize})</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-zinc-900/50 p-2.5 border border-zinc-900">
                    <span className="block text-[8px] font-mono text-zinc-500 uppercase">Shoulder Width</span>
                    <span className="text-sm font-mono font-semibold text-zinc-200">{activeSizing.shoulder}</span>
                  </div>
                  <div className="bg-zinc-900/50 p-2.5 border border-zinc-900">
                    <span className="block text-[8px] font-mono text-zinc-500 uppercase">Chest Circumference</span>
                    <span className="text-sm font-mono font-semibold text-zinc-200">{activeSizing.chest}</span>
                  </div>
                  <div className="bg-zinc-900/50 p-2.5 border border-zinc-900">
                    <span className="block text-[8px] font-mono text-zinc-500 uppercase">Back Length</span>
                    <span className="text-sm font-mono font-semibold text-zinc-200">{activeSizing.length}</span>
                  </div>
                </div>
              </div>

              {/* Technical features list */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Technical Specifications</h4>
                <ul className="space-y-2.5 text-xs text-zinc-300">
                  {product.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2.5 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            /* Aether AI Style Consultant inside drawer */
            <div className="flex flex-col h-full bg-zinc-950 border border-zinc-900 overflow-hidden relative min-h-[400px]">
              {/* Messages viewport */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[420px]">
                {chatMessages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3.5 border ${
                        isUser 
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-200 rounded-none' 
                          : 'bg-[#141414] border-zinc-900 text-zinc-300 rounded-none'
                      }`}>
                        <div className="flex items-center justify-between gap-6 mb-1">
                          <span className={`text-[8px] font-mono tracking-widest font-bold uppercase ${isUser ? 'text-zinc-400' : 'text-[#D4AF37]'}`}>
                            {isUser ? 'VISITOR' : 'AETHER'}
                          </span>
                          <span className="text-[8px] font-mono text-zinc-500">{msg.timestamp}</span>
                        </div>
                        <p className="text-xs leading-relaxed whitespace-pre-line">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}

                {isConsultantLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#141414] border border-zinc-900 p-4 w-[75%] space-y-2">
                      <div className="flex items-center gap-1.5 text-[8px] font-mono text-[#D4AF37] tracking-widest uppercase animate-pulse">
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                        Aether styling co-pilot thinking...
                      </div>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Consultation prompt input */}
              <form onSubmit={handleSendStylingQuery} className="border-t border-zinc-900 p-3 bg-zinc-950 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask Aether how to layer, fit or style this garment..."
                  disabled={isConsultantLoading}
                  className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-[#D4AF37] text-xs text-white px-3 py-2.5 outline-none font-mono placeholder-zinc-600"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isConsultantLoading}
                  className="bg-[#D4AF37] hover:bg-[#e9c349] text-black font-bold px-4 py-2 text-xs uppercase font-mono tracking-widest flex items-center gap-1.5 disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {consultantError && (
                <div className="absolute top-2 left-2 right-2 p-2 bg-rose-950/80 border border-rose-500/20 text-[10px] text-rose-300 font-mono text-center flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {consultantError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions area */}
        <div className="p-5 border-t border-zinc-900 bg-[#161616] space-y-3 flex-shrink-0">
          {product.soldOut ? (
            <button
              disabled
              className="w-full bg-zinc-800 text-zinc-500 border border-zinc-700 py-4 text-xs font-mono uppercase tracking-widest cursor-not-allowed"
            >
              ARCHIVED / SOLD OUT
            </button>
          ) : (
            <div className="flex gap-3">
              <div className="flex border border-zinc-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 text-zinc-400 hover:text-white hover:bg-zinc-900 font-mono text-sm"
                >
                  -
                </button>
                <span className="px-4 py-3 bg-zinc-950 font-mono text-xs text-white self-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 text-zinc-400 hover:text-white hover:bg-zinc-900 font-mono text-sm"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#D4AF37] hover:bg-[#e9c349] text-black font-bold py-4 text-xs uppercase font-mono tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/10"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>DEPLOY TO BAG — ${(product.price * quantity).toFixed(2)}</span>
              </button>
            </div>
          )}
          <p className="text-center text-[9px] text-zinc-600 font-mono uppercase tracking-widest">
            SECURE RE-ROUTING INFRASTRUCTURE COMPLIANT. FREE SHIPPINGS WORLDWIDE.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
