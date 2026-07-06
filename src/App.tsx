import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { products } from './data';
import { Product, CartItem } from './types';
import ProductCard from './components/ProductCard';
import ProductDetails from './components/ProductDetails';
import CartDrawer from './components/CartDrawer';
import WatchlistDrawer from './components/WatchlistDrawer';
import { 
  ShoppingBag, 
  Search, 
  Sparkles, 
  Mail, 
  Menu, 
  X, 
  Clock, 
  Instagram, 
  ArrowUpRight, 
  Check, 
  ChevronRight,
  ShieldCheck,
  Compass,
  FileText,
  Bookmark
} from 'lucide-react';

export default function App() {
  // Navigation & View overlays
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  
  // Search & Sorting state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([...products].sort((a, b) => b.id.localeCompare(a.id)));

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  // Watchlist state
  const [watchlist, setWatchlist] = useState<Product[]>([]);

  // Scroll progress state
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Email capture state
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState<boolean>(false);

  // Next drop countdown state (Seconds remaining to UTC Midnight)
  const [countdown, setCountdown] = useState({ hours: '00', minutes: '00', seconds: '00' });

  // Update filtered products based on search and sorting criteria
  useEffect(() => {
    let result = [...products];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) || 
        p.entryNumber.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // 'newest' (Highest ID corresponds to newest drops)
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    setFilteredProducts(result);
  }, [searchQuery, sortBy]);

  // Sync cart with local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('blacksun_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('blacksun_cart', JSON.stringify(newCart));
  };

  // Sync watchlist with local storage
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('blacksun_watchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
  }, []);

  const saveWatchlist = (newWatchlist: Product[]) => {
    setWatchlist(newWatchlist);
    localStorage.setItem('blacksun_watchlist', JSON.stringify(newWatchlist));
  };

  const handleToggleWatchlist = (product: Product) => {
    const exists = watchlist.some(p => p.id === product.id);
    let updatedWatchlist = [];
    if (exists) {
      updatedWatchlist = watchlist.filter(p => p.id !== product.id);
    } else {
      updatedWatchlist = [...watchlist, product];
    }
    saveWatchlist(updatedWatchlist);
  };

  const handleRemoveFromWatchlist = (product: Product) => {
    const updatedWatchlist = watchlist.filter(p => p.id !== product.id);
    saveWatchlist(updatedWatchlist);
  };

  const handleClearWatchlist = () => {
    saveWatchlist([]);
  };

  // Scroll progress listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Next-drop countdown timer logic (ticks every second toward next UTC Midnight)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const utcMidnight = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0, 0, 0
      ));
      
      const difference = utcMidnight.getTime() - now.getTime();
      let timeLeft = { hours: '00', minutes: '00', seconds: '00' };

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        timeLeft = {
          hours: hours.toString().padStart(2, '0'),
          minutes: minutes.toString().padStart(2, '0'),
          seconds: seconds.toString().padStart(2, '0')
        };
      }
      return timeLeft;
    };

    setCountdown(calculateTimeLeft());
    const interval = setInterval(() => {
      setCountdown(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Cart management methods
  const handleAddToCart = (product: Product, size: string, quantity: number) => {
    const existingIndex = cart.findIndex(item => item.product.id === product.id && item.selectedSize === size);
    let updatedCart = [...cart];
    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({ product, selectedSize: size, quantity });
    }
    saveCart(updatedCart);
    setIsCartOpen(true);
  };

  const handleAddToCartDirect = (product: Product, size: string) => {
    handleAddToCart(product, size, 1);
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    let updatedCart = [...cart];
    updatedCart[index].quantity = quantity;
    saveCart(updatedCart);
  };

  const handleRemoveItem = (index: number) => {
    let updatedCart = cart.filter((_, idx) => idx !== index);
    saveCart(updatedCart);
  };

  const handleClearCart = () => {
    saveCart([]);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  // Scroll smoothly to curations archive
  const handleScrollToArchive = () => {
    document.getElementById('archive-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#131313] text-zinc-100 font-sans antialiased overflow-x-hidden relative">
      
      {/* Dynamic Gold Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-zinc-950 z-50">
        <motion.div
          className="h-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]"
          style={{ scaleX: scrollProgress, transformOrigin: 'left' }}
        />
      </div>
      
      {/* Liquid atmospheric noise overlay for "Obsidian Nebula" aesthetic */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-40 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Sticky High-Contrast Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#131313]/70 backdrop-blur-xl border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Elegant Branding logo-4 image & wordmark combo in Montserrat display */}
            <div 
              onClick={handleScrollToArchive} 
              className="flex items-center gap-2.5 select-none cursor-pointer group"
            >
              <img
                src="/images/logo_four_1783344568895.jpg"
                alt="BLACK SUN Logo"
                referrerPolicy="no-referrer"
                className="h-7 w-auto object-contain brightness-110 group-hover:scale-105 transition-transform duration-300"
              />
              <span className="font-display font-extrabold text-base sm:text-lg tracking-widest text-[#D4AF37] uppercase">
                BLACK SUN
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-widest text-zinc-400">
              <button onClick={handleScrollToArchive} className="hover:text-[#D4AF37] transition-colors">Curated drops</button>
              <a href="#about" className="hover:text-[#D4AF37] transition-colors">Manifesto</a>
              <a href="#newsletter" className="hover:text-[#D4AF37] transition-colors">Pre-Access</a>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Toggle button */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              className="p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all rounded-none border border-transparent hover:border-zinc-800"
              title="Search Drop Entries"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Watchlist Toggle with count badge */}
            <button 
              onClick={() => setIsWatchlistOpen(true)}
              className="p-2.5 text-zinc-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all rounded-none border border-transparent hover:border-[#D4AF37]/20 relative"
              title="View Watchlist"
            >
              <Bookmark className="w-4 h-4" />
              {watchlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] text-black text-[9px] font-bold font-mono rounded-full flex items-center justify-center">
                  {watchlist.length}
                </span>
              )}
            </button>

            {/* Bag Toggle with count badge */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 text-zinc-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all rounded-none border border-transparent hover:border-[#D4AF37]/20 relative"
              title="View Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] text-black text-[9px] font-bold font-mono rounded-full flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            {/* Mobile Menu Icon */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time search tray drop-down */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-zinc-900 bg-[#161616] overflow-hidden"
            >
              <div className="max-w-4xl mx-auto px-4 sm:px-8 py-5 flex items-center gap-3">
                <Search className="w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH SPEC ENTRIES... (e.g., VEST, HOOD, CARGO, DROP 042)"
                  className="flex-1 bg-transparent border-none text-xs text-white placeholder-zinc-600 font-mono focus:ring-0 outline-none uppercase"
                  autoFocus
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-[10px] text-zinc-500 hover:text-white font-mono uppercase"
                  >
                    CLEAR
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Drawer Navigation overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-6"
          >
            <div className="flex justify-between items-center">
              <span className="font-display font-extrabold tracking-tighter text-[#D4AF37] text-lg uppercase">BLACK SUN</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 border border-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-6 text-xl font-display font-bold uppercase tracking-widest text-center">
              <button 
                onClick={() => { setMobileMenuOpen(false); handleScrollToArchive(); }} 
                className="text-[#D4AF37]"
              >
                THE ARCHIVE
              </button>
              <a 
                href="#about" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-400"
              >
                MANIFESTO
              </a>
              <a 
                href="#newsletter" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-400"
              >
                PRE-ACCESS
              </a>
            </nav>

            <div className="border-t border-zinc-900 pt-6 text-center space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block">Follow the Eclipse</span>
              <div className="flex justify-center gap-6 text-[#D4AF37]">
                <Instagram className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-16">
        
        {/* Editorial Immersive Hero Section */}
        <section className="relative h-[85vh] sm:h-[90vh] flex items-center justify-center overflow-hidden bg-zinc-950">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDM2pnyvKbgbyf8bQCmBFesme7NW6OZixlnScaUiLWLGRia2HaTkfKmyk1LOp5I9Dym8GBSD_XBMbQfFS7JiSwNxcwnayTey_9sAJn6o-BEiHoQAKWOltCUDTAOI_663Dv3Ewn9n324QOCha_1fl8Qs8mb5mWMjYmnGCRKBr6lvq3R1_mLyPVIXyGFdMcPu_UUTqpTWR1C6zrnP6zQo2FSM4iwt4XCUjhojTBj0yNQV2mSCTCV3clO0xmGZXjsCW-aru0Jc63U91W0" 
              alt="BLACK SUN Heavyweight Hoodie Hero Spec" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-60 scale-100 transition-transform duration-[10000ms] ease-out hover:scale-105" 
            />
            {/* Dark Editorial Gradient Masking */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/80 border border-zinc-800 text-[#D4AF37] font-mono text-[9px] uppercase tracking-[0.25em]">
              <Sparkles className="w-3 h-3 text-[#D4AF37] animate-pulse" />
              <span>V.04 // HEAVYWEIGHT CHROMATIC INTEGRITY</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-7xl md:text-8xl tracking-tight leading-none text-white uppercase italic text-glow-gold">
              ELEVATED <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-cyan-400 to-purple-500 font-bold">
                VISION
              </span>
            </h1>

            <p className="max-w-lg mx-auto text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              A physical manifestation of technical utility and dark minimalism. Constructed for the visionary, sculpted in Obsidian Black with high-contrast hardware details.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <button 
                onClick={handleScrollToArchive}
                className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-[#e9c349] transition-all scale-100 active:scale-95 shadow-lg shadow-[#D4AF37]/10"
              >
                EXPLORE ARCHIVE
              </button>
              <a 
                href="#about"
                className="w-full sm:w-auto px-8 py-4 border border-zinc-800 hover:border-zinc-500 text-zinc-300 font-mono font-medium text-xs uppercase tracking-widest backdrop-blur-md hover:bg-zinc-900/40 transition-all text-center"
              >
                OUR MANIFESTO
              </a>
            </div>
          </div>

          {/* Smooth bouncy anchor scroll pointer */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-50 select-none pointer-events-none">
            <span className="text-[8px] font-mono uppercase tracking-[0.3em]">SCROLL</span>
            <div className="w-[1px] h-8 bg-zinc-700 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#D4AF37] animate-bounce" />
            </div>
          </div>
        </section>

        {/* Real-Time Drop Countdown Strip */}
        <section className="bg-[#181818] border-y border-zinc-900/60 py-4.5 px-4 overflow-hidden relative">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full animate-pulse" />
              <span className="font-mono text-[10px] tracking-widest text-[#D4AF37] uppercase">
                OBSIDIAN NETWORK: NEXT ENCRYPTED MIDNIGHT DROP
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex gap-4 font-mono text-center">
                <div>
                  <span className="block text-sm sm:text-base font-bold text-zinc-100">{countdown.hours}</span>
                  <span className="text-[8px] text-zinc-500 uppercase">HRS</span>
                </div>
                <div className="text-zinc-600 self-center font-bold">:</div>
                <div>
                  <span className="block text-sm sm:text-base font-bold text-zinc-100">{countdown.minutes}</span>
                  <span className="text-[8px] text-zinc-500 uppercase">MIN</span>
                </div>
                <div className="text-zinc-600 self-center font-bold">:</div>
                <div>
                  <span className="block text-sm sm:text-base font-bold text-[#D4AF37]">{countdown.seconds}</span>
                  <span className="text-[8px] text-zinc-500 uppercase">SEC</span>
                </div>
              </div>

              <a 
                href="#newsletter"
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[#D4AF37] px-4 py-1.5 rounded-none text-[9px] font-mono uppercase tracking-wider transition-colors"
              >
                SECURE KEY
              </a>
            </div>
          </div>
        </section>

        {/* Curated Archive Product Section */}
        <section id="archive-grid" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-900 pb-8">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span className="text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase">ENTRY MATRIX</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white italic">
                THE ARCHIVE
              </h2>
            </div>
            
            <p className="max-w-md text-xs text-zinc-500 leading-relaxed font-sans md:text-right">
              Meticulously categorized and structured entries. Hover elements to activate 3D CAD simulation coordinates and explore sizing specs.
            </p>
          </div>

          {/* Controls: Sorting Dropdown & Filter Info */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-zinc-950 p-4 border border-zinc-900 text-xs font-mono">
            <div className="flex items-center gap-2.5 text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {searchQuery 
                  ? `FILTERED MATCHES: ${filteredProducts.length} ITEMS FOUND FOR "${searchQuery.toUpperCase()}"` 
                  : `ACTIVE INVENTORY: ${filteredProducts.length} SECURE SPECIFICATIONS LOADED`}
              </span>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="text-[#D4AF37] hover:underline uppercase text-[10px] ml-2"
                >
                  [RESET]
                </button>
              )}
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-3">
              <span className="text-zinc-500 uppercase tracking-wider text-[10px]">SORT PROTOCOL //</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#131313] border border-zinc-800 text-[#D4AF37] hover:text-[#e9c349] hover:border-zinc-700 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-none cursor-pointer outline-none transition-all"
                >
                  <option value="newest">NEWEST DROPS</option>
                  <option value="price-desc">PRICE: HIGH TO LOW</option>
                  <option value="price-asc">PRICE: LOW TO HIGH</option>
                </select>
              </div>
            </div>
          </div>

          {/* Curated Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-850 space-y-3">
              <span className="text-zinc-500 block font-mono text-xs">NO ENTRIES MATCHED YOUR FILTER</span>
              <button 
                onClick={() => setSearchQuery('')}
                className="px-5 py-2.5 bg-zinc-900 text-xs text-white border border-zinc-800 uppercase font-mono tracking-wider hover:bg-zinc-800"
              >
                SHOW ALL SPECIFICATIONS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onViewDetails={setSelectedProduct}
                  onAddToCartDirect={handleAddToCartDirect}
                  isWatched={watchlist.some(w => w.id === prod.id)}
                  onToggleWatchlist={handleToggleWatchlist}
                />
              ))}
            </div>
          )}
        </section>

        {/* Brand Manifesto Section */}
        <section id="about" className="py-24 border-t border-zinc-900 bg-[#101010] relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7 space-y-6">
              <span className="font-mono text-[9px] tracking-[0.4em] text-[#D4AF37] uppercase block">BLACK SUN MANIFESTO</span>
              <h3 className="font-display font-bold text-2xl sm:text-4xl text-white uppercase tracking-tight leading-snug">
                WE DO NOT CONFORM. <br />
                WE OBSERVE THE <span className="text-[#D4AF37] italic">ECLIPSE</span>.
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                At the intersection of digital hardware, tactile heavy garments, and dark minimalist poetry, BLACK SUN operates as a closed-loop creative node.
              </p>
              <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-sans">
                We design garments that act as defensive silhouettes against urban hyper-stimulation. Every pocket position, drape vector, and fabric density rating is engineered to preserve physical and emotional focus.
              </p>
            </div>

            <div className="md:col-span-5 flex justify-center">
              <div className="w-56 h-56 rounded-full border border-zinc-800 flex flex-col items-center justify-center p-6 text-center bg-zinc-950/40 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <Compass className="w-8 h-8 text-[#D4AF37] mb-4 animate-spin-slow" style={{ animationDuration: '20s' }} />
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest leading-normal">
                  MMXXIV // VOID <br />
                  LATITUDE: NULL <br />
                  <span className="text-[#D4AF37] font-semibold text-[9px]">SECURE COMM-NET</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Join the Eclipse Newsletter Capture */}
        <section id="newsletter" className="py-24 border-t border-zinc-900 bg-[#131313]">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-8">
            <div className="inline-flex p-3 rounded-full bg-zinc-900 border border-zinc-800 text-[#D4AF37]">
              <Mail className="w-5 h-5" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight italic">
                JOIN THE ECLIPSE
              </h2>
              <p className="max-w-md mx-auto text-xs text-zinc-400 font-sans leading-relaxed">
                Unlock encrypted pre-drop access keys, VIP lookbook telemetry, and premium architectural rewards.
              </p>
            </div>

            {newsletterSubscribed ? (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-5 bg-zinc-950 border border-[#D4AF37]/30 max-w-md mx-auto space-y-2 text-center"
              >
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#D4AF37]">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">ECLIPSE VIP PASS GENERATED</h4>
                <p className="text-[10px] text-zinc-500 font-mono">
                  ACCESS ID: ECLIPSE-{Math.floor(100000 + Math.random() * 900000)} SENT TO YOUR TELEMETRY INBOX.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="AUTHENTICATE EMAIL PROTOCOL..."
                  className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-[#D4AF37] text-xs text-white px-4 py-3.5 outline-none font-mono placeholder-zinc-700 uppercase"
                />
                <button
                  type="submit"
                  className="bg-[#D4AF37] hover:bg-[#e9c349] text-black font-mono font-bold text-xs uppercase tracking-widest px-8 py-3.5 transition-all active:scale-95"
                >
                  SUBSCRIBE
                </button>
              </form>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[9px] text-zinc-600 font-mono uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Obsidian network does not distribute telemetry addresses to external parties</span>
            </div>
          </div>
        </section>
      </main>

      {/* Corporate / Architectural Legal Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-zinc-400">
          
          <div className="space-y-4">
            <h4 className="font-display font-extrabold text-[#D4AF37] tracking-tighter uppercase">
              BLACK SUN
            </h4>
            <p className="text-xs leading-relaxed font-sans text-zinc-500 max-w-xs">
              Architectural structural vestments and high-end techwear silhouettes created for extreme modern resilience.
            </p>
            <div className="flex gap-4 text-zinc-500">
              <a href="#" className="hover:text-[#D4AF37] transition-colors"><Instagram className="w-4 h-4" /></a>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="font-mono text-[10px] text-zinc-200 uppercase tracking-widest font-bold">EXPLORATION</h5>
            <ul className="space-y-2 text-xs font-mono">
              <li><button onClick={handleScrollToArchive} className="hover:text-white transition-colors">THE ARCHIVE</button></li>
              <li><a href="#about" className="hover:text-white transition-colors">OUR MANIFESTO</a></li>
              <li><a href="#newsletter" className="hover:text-white transition-colors">PRE-DROP VIP</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-mono text-[10px] text-zinc-200 uppercase tracking-widest font-bold">CLIENT NODE</h5>
            <ul className="space-y-2 text-xs font-mono">
              <li><span className="text-zinc-500">LATITUDE: TOKYO / NYC</span></li>
              <li><span className="text-zinc-500">TELEPHONE: 08122911210</span></li>
              <li><span className="text-zinc-500">WHATSAPP: 08122911210, 09134935919</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-mono text-[10px] text-zinc-200 uppercase tracking-widest font-bold">TERMS & CREDITS</h5>
            <ul className="space-y-2 text-xs font-mono">
              <li><a href="#" className="hover:text-white transition-colors">PRIVACY POLICY</a></li>
              <li><a href="#" className="hover:text-white transition-colors">TERMS OF DEPLOYMENT</a></li>
              <li><span className="text-zinc-600">© 2026 BLACK SUN. ALL SPECS PERSISTED.</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-900/40 text-center">
          <p className="font-mono text-[8px] tracking-[0.4em] text-zinc-600 uppercase">
            SECURE INTEGRATED OBSERVATION AND TRADING SPACES
          </p>
        </div>
      </footer>

      {/* Sizing matrix detail drawer */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>

      {/* Interactive Cart sliding drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
          />
        )}
      </AnimatePresence>

      {/* Interactive Watchlist sliding drawer */}
      <AnimatePresence>
        {isWatchlistOpen && (
          <WatchlistDrawer
            isOpen={isWatchlistOpen}
            onClose={() => setIsWatchlistOpen(false)}
            watchlist={watchlist}
            onRemoveFromWatchlist={handleRemoveFromWatchlist}
            onClearWatchlist={handleClearWatchlist}
            onViewProduct={setSelectedProduct}
            onAddToCartDirect={handleAddToCartDirect}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
