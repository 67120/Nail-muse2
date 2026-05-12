import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Star, CheckCircle, Bell, X, Sparkles, Heart, Palette, Mail, Brush, Camera, Diamond, Layers, Gem, ArrowRight, Instagram } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './lib/firebase';

// Types
type LeadData = {
  email: string;
  consent: boolean;
  createdAt: any;
};

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleBuyClick = async () => {
    setIsModalOpen(true);
    try {
      await fetch('/api/notify-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'BUY_BUTTON_CLICK' }),
      });
    } catch (err) {
      console.error('Failed to log click', err);
    }
  };

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError('Моля, дайте своето съгласие за обработка на данни.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    const leadPath = 'leads';
    
    try {
      const leadsRef = collection(db, leadPath);
      
      const writePromise = addDoc(leadsRef, {
        email,
        consent,
        source: 'nail_muse_landing',
        createdAt: serverTimestamp(),
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firestore timeout')), 5000)
      );

      try {
        await Promise.race([writePromise, timeoutPromise]);
      } catch (fError) {
        console.warn("Firestore write skipped, notifying via email", fError);
      }

      await fetch('/api/notify-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'EMAIL_CAPTURE' }),
      });
      
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Submission technical error:', err);
      setError('Възникна грешка. Моля, опитайте отново.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg font-sans text-brand-accent flex flex-col selection:bg-brand-secondary/30 italic-headings transition-all duration-500">
      {/* Top Header Rail */}
      <div className="bg-brand-accent text-rose-50 text-[10px] py-3 px-8 flex justify-between items-center uppercase tracking-[0.3em] font-black">
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline opacity-60">Ексклузивно</span>
          <span>Безплатна доставка над 50 лв</span>
        </div>
        <div className="flex space-x-8">
          <span className="hidden sm:inline opacity-60">24/7 Поддръжка</span>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-brand-secondary transition-colors">
            <Instagram size={12} /> <span className="hidden sm:inline">@nailmuse_bg</span>
          </a>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 md:px-16 py-8 bg-white/95 backdrop-blur-xl sticky top-0 z-50 border-b border-brand-secondary/20">
        <div className="flex items-center space-x-6">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.6 }}
            className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center shadow-2xl shadow-brand-primary/20"
          >
             <Sparkles size={24} className="text-white" />
          </motion.div>
          <span className="font-serif text-3xl font-bold tracking-tight text-brand-accent italic">Nail Muse</span>
        </div>
        
        <div className="hidden lg:flex space-x-12 text-[11px] font-black text-brand-accent/40 uppercase tracking-[0.3em]">
          <a href="#categories" className="hover:text-brand-primary transition-colors relative group">
            Колекции
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-brand-primary transition-all group-hover:w-full"></span>
          </a>
          <a href="#gallery" className="hover:text-brand-primary transition-colors relative group">
            Вдъхновение
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-brand-primary transition-all group-hover:w-full"></span>
          </a>
          <a href="#why-us" className="hover:text-brand-primary transition-colors relative group">
            Философия
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-brand-primary transition-all group-hover:w-full"></span>
          </a>
        </div>

        <button 
          onClick={handleBuyClick}
          className="flex items-center gap-4 px-10 py-4 bg-brand-accent text-white font-bold rounded-full shadow-2xl shadow-brand-accent/20 hover:bg-brand-primary hover:-translate-y-0.5 transition-all uppercase text-[10px] tracking-[0.2em] group"
        >
          КУПИ СЕГА
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </nav>

      {/* Hero: Editorial Impact (Recipe 2/11/12) */}
      <main className="relative min-h-[90vh] flex flex-col lg:flex-row overflow-hidden">
        {/* Sales Copy */}
        <div className="w-full lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center bg-white relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="text-brand-secondary font-serif italic text-xl mb-6 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-brand-secondary/30"></span>
              The Art of Manicure
            </div>
            <h1 className="text-7xl md:text-[140px] font-serif font-bold text-brand-accent leading-[0.82] mb-12 tracking-tighter italic">
              Твоят <br />
              <span className="text-brand-primary font-light not-italic">стил,</span> <br />
              твоето аз
            </h1>
            <p className="text-2xl text-brand-accent/50 mb-16 leading-[1.6] max-w-md font-medium italic">
              От дискретни детайли до смел блясък – изрази себе си точно така, както го чувстваш.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8">
              <button 
                onClick={handleBuyClick}
                className="px-14 py-7 bg-brand-primary text-white font-black rounded-2xl shadow-[0_20px_50px_-10px_rgba(114,36,67,0.4)] hover:bg-brand-accent hover:-translate-y-1 transition-all uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 group"
              >
                РАЗГЛЕДАЙ МАГИЯТА
              </button>
              <div className="flex items-center px-8 text-brand-accent/40 text-[10px] uppercase tracking-[0.2em] font-black border-l border-brand-secondary/20">
                12k+ Инспирации <br /> споделени днес
              </div>
            </div>
          </motion.div>
        </div>

        {/* Immersive Visual */}
        <div className="w-full lg:w-1/2 relative min-h-[500px] lg:min-h-0 bg-brand-bg">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="h-full w-full"
          >
            <img 
              src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=1400" 
              alt="Luxury Manicure" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent hidden lg:block"></div>
          </motion.div>
          
          {/* Aesthetic Overlay Card */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-12 right-12 bg-white/20 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl border border-white/30 z-20 max-w-xs text-white"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">Ново Зареждане</div>
            <div className="text-3xl font-serif italic mb-6">"Diamonds are a nail's best friend"</div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center">
                <Diamond size={16} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Rhinestone Max</span>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Categories: Systematic Precision (Recipe 1/9/12) */}
      <section id="categories" className="py-40 px-8 bg-white border-b border-brand-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-32 gap-8">
            <div className="max-w-3xl">
              <div className="text-brand-primary font-black text-[10px] uppercase tracking-[0.4em] mb-6">Твоят избор</div>
              <h2 className="text-6xl md:text-8xl font-serif italic font-bold text-brand-accent leading-tight">Стил за <br /> всяка от вас</h2>
            </div>
            <div className="text-brand-accent/30 font-serif italic text-2xl max-w-xl">
              Намери твоето вдъхновение, независимо дали търсиш класика или нещо съвсем ново.
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <CategoryCard 
              index="01"
              icon={<Diamond size={32} />}
              title="Rhinestones"
              subtitle="Кристален блясък"
              desc="За блясък, който не остава незабелязан. Сложи един акцент или направи пълен сет – ти решаваш нивото на лукса."
              img="https://images.unsplash.com/photo-1632345031435-08ca0692468d?auto=format&fit=crop&q=80&w=800"
            />
            <CategoryCard 
              index="02"
              icon={<Layers size={32} />}
              title="Art Stickers"
              subtitle="Твоето изкуство"
              desc="Най-лесният начин за ефектни резултати. Деликатни линии или цели композиции – за тези, които обичат детайлите."
              img="https://images.unsplash.com/photo-1610992015762-375e37604319?auto=format&fit=crop&q=80&w=800"
            />
            <CategoryCard 
              index="03"
              icon={<Gem size={32} />}
              title="Luxury Charms"
              subtitle="3D акценти"
              desc="Бижута, с които ще заблестиш. Перфектни за специален повод или просто за моментите, в които искаш да си различна."
              img="https://images.unsplash.com/photo-1607530664987-920401d4a04d?auto=format&fit=crop&q=80&w=800"
            />
          </div>
        </div>
      </section>

      {/* Results Gallery: Visual Proof (Success Model) */}
      <section id="gallery" className="py-40 px-8 bg-brand-bg/50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            <div className="relative">
                <div className="absolute -top-12 -left-12 text-[180px] font-serif font-black text-brand-secondary/10 leading-none select-none">MUSE</div>
                <div className="relative z-10">
                    <h2 className="text-5xl md:text-7xl font-serif italic font-bold text-brand-accent mb-10">Твоите нокти, <br /> твоята история</h2>
                    <p className="text-xl text-brand-accent/50 leading-relaxed mb-16 max-w-sm">
                        Виж как момичетата вече промениха играта. От минималистичен детайл до пълен блясък - ти решаваш.
                    </p>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="text-4xl font-serif italic text-brand-primary">98%</div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent/40">Доволни клиенти</div>
                        </div>
                        <div className="space-y-4">
                            <div className="text-4xl font-serif italic text-brand-primary">24h</div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent/40">Обработка на поръчка</div>
                        </div>
                    </div>
                </div>
            </div>

              <div className="grid grid-cols-2 gap-6 relative">
              <div className="space-y-6">
                <GalleryItem url="https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?auto=format&fit=crop&q=80&w=400" label="Celestial Gold" />
                <GalleryItem url="https://images.unsplash.com/photo-1610992015762-375e37604319?auto=format&fit=crop&q=80&w=400" label="Butterfly Garden" />
              </div>
              <div className="space-y-6 pt-16">
                <GalleryItem url="https://images.unsplash.com/photo-1607530664987-920401d4a04d?auto=format&fit=crop&q=80&w=400" label="Zircon Alloy" />
                <GalleryItem url="https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=400" label="Luminous Art" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy / Why Us (Recipe 1: Grid Structure) */}
      <section id="why-us" className="py-40 bg-white border-y border-brand-secondary/10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-32">
            <h2 className="text-4xl md:text-6xl font-serif italic font-bold text-brand-accent mb-8">Защо ще ни обикнеш</h2>
            <div className="w-32 h-[1px] bg-brand-secondary/30 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-brand-secondary/10">
            <PhilosophyCard 
              icon={<Palette size={24} />} 
              title="Разнообразие без граници" 
              desc="От вечните класики до най-смелите експерименти – събрахме всичко на едно място, за да имаш избор." 
            />
            <PhilosophyCard 
              icon={<Brush size={24} />} 
              title="Става за секунди" 
              desc="Няма нужда да си професионалист. Декорациите ни са създадени за лесно и бързо нанасяне с гарантиран ефект, сякаш току-що излизаш от салона." 
            />
            <PhilosophyCard 
              icon={<Camera size={24} />} 
              title="Ready for Insta" 
              desc="Твоите нокти ще изглеждат впечатляващо на живо и ще са звездата на всяко твое стори." 
            />
          </div>
        </div>
      </section>

      {/* Social Proof Hero */}
      <section className="py-40 bg-brand-accent text-rose-50 overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 flex items-center justify-center pointer-events-none">
            <div className="text-[300px] font-serif italic font-black whitespace-nowrap">LOVE NAIL MUSE</div>
         </div>
         <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
            <div className="flex justify-center gap-2 mb-12">
               {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="#D8A7B1" className="text-brand-secondary" />)}
            </div>
            <h2 className="text-4xl md:text-6xl font-serif italic mb-16 leading-tight font-light">
              "Това е мястото, откъдето поръчвам всяка декорация. Блясъкът е ненадминат, а доставката е винаги навреме."
            </h2>
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 rounded-full border-2 border-brand-primary/30 overflow-hidden mb-6">
                  <img src="https://i.pravatar.cc/100?img=42" alt="Reviewer" referrerPolicy="no-referrer" />
               </div>
               <div className="font-black text-[11px] uppercase tracking-[0.4em]">Елена Иванова</div>
               <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mt-2">Nail Designer & Influencer</div>
            </div>
         </div>
      </section>

      {/* Final Footer */}
      <footer className="py-32 px-16 bg-white flex flex-col md:flex-row justify-between items-center gap-16 border-t border-brand-secondary/10">
        <div className="flex items-center space-x-6">
           <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center shadow-xl shadow-brand-primary/20">
              <Sparkles size={20} className="text-white" />
           </div>
           <span className="font-serif text-2xl font-bold tracking-tight text-brand-accent italic">Nail Muse</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-12 text-[10px] uppercase tracking-[0.4em] font-black text-brand-accent/30">
          <a href="#" className="hover:text-brand-primary transition-colors">Поръчки</a>
          <a href="#" className="hover:text-brand-primary transition-colors">Доставка</a>
          <a href="#" className="hover:text-brand-primary transition-colors">Политика</a>
          <a href="#" className="hover:text-brand-primary transition-colors">Контакти</a>
        </div>
        
        <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-accent/20">
          © 2024 NAIL MUSE STUDIO • Sofia, BG
        </div>
      </footer>

      {/* Out of Stock: Personalized Invitation (Success Focus) */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-accent/80 backdrop-blur-3xl"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-white rounded-[4rem] p-10 md:p-24 max-w-2xl w-full relative shadow-2xl border border-brand-secondary/10"
            >
              <button 
                onClick={() => { setIsModalOpen(false); setIsSubmitted(false); }}
                className="absolute top-12 right-12 text-brand-accent/10 hover:text-brand-primary transition-colors"
              >
                <X size={32} />
              </button>

              {!isSubmitted ? (
                <>
                  <div className="text-center mb-16">
                    <div className="w-24 h-24 bg-brand-bg text-brand-primary rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                      <Sparkles size={48} />
                    </div>
                    <div className="text-brand-secondary font-serif italic text-lg mb-4">Awaiting Restock</div>
                    <h3 className="text-4xl md:text-5xl font-serif font-bold text-brand-accent mb-8 tracking-tighter">Ексклузивна Покана</h3>
                    <p className="text-brand-accent/40 leading-relaxed font-medium text-lg">
                      Поради огромния интерес, текущите ни наличности са напълно изчерпани. <br /><br />
                      Проявете интерес сега и ще получите <span className="text-brand-primary font-bold underline underline-offset-8">-15% отстъпка</span> и приоритетен достъп до следващата колекция.
                    </p>
                  </div>

                  <form onSubmit={handleNotifySubmit} className="space-y-10">
                    <div className="relative group">
                      <Mail className="absolute left-8 top-1/2 -translate-y-1/2 text-brand-secondary/40 group-focus-within:text-brand-primary transition-colors" size={24} />
                      <input 
                        type="email" 
                        required
                        placeholder="Вашият личен имейл адрес..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-brand-bg/50 border border-brand-secondary/10 rounded-3xl py-7 pl-20 pr-8 focus:outline-none focus:border-brand-primary focus:bg-white transition-all text-lg placeholder:text-brand-secondary/30"
                      />
                    </div>
                    
                    <div className="space-y-6">
                        <button 
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-8 bg-brand-accent text-white font-black rounded-3xl hover:bg-brand-primary transition-all uppercase text-[11px] tracking-[0.4em] disabled:opacity-50 shadow-2xl flex items-center justify-center gap-4 group"
                        >
                          {isSubmitting ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          ) : (
                                <>
                                    ПРИСЪЕДИНИ СЕ КЪМ СПИСЪКА
                                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                </>
                          )}
                        </button>
                        
                        <label className="flex items-start space-x-6 cursor-pointer group px-4">
                          <div className="relative flex items-center mt-1">
                            <input 
                              type="checkbox" 
                              required
                              checked={consent}
                              onChange={(e) => setConsent(e.target.checked)}
                              className="w-6 h-6 rounded-xl border-brand-secondary/20 text-brand-primary focus:ring-brand-primary cursor-pointer appearance-none border-2 checked:bg-brand-primary checked:border-brand-primary transition-all"
                            />
                            <CheckCircle size={14} className="absolute left-1.5 top-1.5 text-white scale-0 group-has-[:checked]:scale-100 transition-transform pointer-events-none" />
                          </div>
                          <span className="text-[10px] text-brand-accent/30 group-hover:text-brand-accent/60 transition-colors uppercase tracking-[0.1em] leading-[1.6] font-bold">
                            Да, желая да получавам ексклузивни предложения и новини от Nail Muse Studio ✨
                          </span>
                        </label>
                    </div>
                    {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em] text-center">{error}</p>}
                  </form>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-32 h-32 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-12 shadow-inner">
                    <CheckCircle size={64} />
                  </div>
                  <h3 className="text-5xl font-serif italic font-bold text-brand-accent mb-8 tracking-tighter uppercase text-center">Добре дошли!</h3>
                  <p className="text-brand-accent/40 leading-relaxed font-medium mb-20 text-xl max-w-sm mx-auto">
                    Вашият имейл бе добавен успешно. <br /> Подгответе се за следващото ниво на блясък!
                  </p>
                  <button 
                    onClick={() => { setIsModalOpen(false); setIsSubmitted(false); }}
                    className="w-full py-7 border-2 border-brand-secondary/10 text-brand-secondary/50 text-[10px] font-black uppercase tracking-[0.4em] rounded-3xl hover:bg-brand-bg transition-all"
                  >
                    ПРОДЪЛЖЕТЕ РАЗГЛЕЖДАНЕТО
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CategoryCard({ index, icon, title, subtitle, desc, img }: { index: string, icon: any, title: string, subtitle: string, desc: string, img: string }) {
  return (
    <motion.div 
      whileHover={{ y: -20 }}
      className="group relative bg-white rounded-[4rem] overflow-hidden shadow-[0_60px_100px_-30px_rgba(114,36,67,0.1)] border border-brand-secondary/20 transition-all duration-700"
    >
      <div className="aspect-[4/5] overflow-hidden relative">
        <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms]" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-brand-accent/20 group-hover:opacity-10 transition-opacity"></div>
        <div className="absolute top-10 right-10 text-white flex flex-col items-end">
            <span className="text-[40px] font-serif italic font-black opacity-30 select-none tracking-tighter">{index}</span>
        </div>
      </div>
      <div className="p-16 relative">
        <div className="flex justify-between items-start mb-10">
            <div>
                <div className="text-brand-primary font-serif italic text-lg mb-2">{subtitle}</div>
                <h3 className="text-4xl font-serif font-bold text-brand-accent tracking-tighter">{title}</h3>
            </div>
            <div className="w-16 h-16 bg-brand-bg text-brand-primary rounded-3xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-700 shadow-sm">
                {icon}
            </div>
        </div>
        <p className="text-brand-accent/40 font-medium leading-relaxed mb-12 text-lg italic">{desc}</p>
        <div className="flex items-center gap-6 group/btn cursor-pointer">
            <div className="w-12 h-12 border border-brand-secondary/20 rounded-full flex items-center justify-center group-hover:bg-brand-accent group-hover:text-white transition-all duration-500">
                <ArrowRight size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent/30 group-hover:text-brand-accent transition-colors">Научи Повече</span>
        </div>
      </div>
    </motion.div>
  );
}

function GalleryItem({ url, label }: { url: string, label: string }) {
    return (
        <motion.div 
            whileHover={{ scale: 1.05, y: -10 }}
            className="relative group rounded-[3rem] overflow-hidden shadow-2xl cursor-pointer"
        >
            <img src={url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-brand-accent/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-10">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary mb-2">Inspiration</div>
                <div className="text-2xl font-serif italic text-white flex items-center justify-between">
                    {label}
                    <Sparkles size={20} />
                </div>
            </div>
        </motion.div>
    )
}

function PhilosophyCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-16 group hover:bg-brand-bg transition-colors">
      <div className="w-14 h-14 bg-brand-bg text-brand-primary rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-serif italic font-bold mb-6 text-brand-accent">{title}</h3>
      <p className="text-brand-accent/40 leading-relaxed font-medium italic text-lg">{desc}</p>
    </div>
  );
}
