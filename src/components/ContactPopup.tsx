import { motion, AnimatePresence } from 'framer-motion';

interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactPopup({ isOpen, onClose }: ContactPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-md font-sans font-light"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl p-8 md:p-12 rounded-3xl bg-[#4A3AFF]/80 backdrop-blur-2xl border border-white/20 text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#00FF85] hover:text-[#4A3AFF] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <h2 className="text-3xl font-normal tracking-wide mb-10 text-white">Let's Connect</h2>
            
            <div className="flex flex-col md:flex-row gap-10">
              {/* Info Column */}
              <div className="flex-1 space-y-5 font-normal text-sm md:text-base leading-relaxed">
                <div className="flex flex-col">
                  <span className="text-white/50 text-[10px] uppercase tracking-widest mb-1">Phone</span>
                  <span className="font-jinshu tracking-wide">+86 18548920669</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/50 text-[10px] uppercase tracking-widest mb-1">Email</span>
                  <span className="font-jinshu tracking-wide">flowernursery@gmail.com</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/50 text-[10px] uppercase tracking-widest mb-1">小红书 (RED)</span>
                  <span className="font-jinshu tracking-wide">DreaMaker</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/50 text-[10px] uppercase tracking-widest mb-1">微信 (WeChat)</span>
                  <span className="font-jinshu tracking-wide">Richerstar9</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/50 text-[10px] uppercase tracking-widest mb-1">GitHub</span>
                  <span className="font-jinshu tracking-wide">LuckyLepus</span>
                </div>
              </div>

              {/* QR Codes Column */}
              <div className="flex-1 flex flex-col sm:flex-row gap-6 items-center justify-center border-t md:border-t-0 md:border-l border-white/20 pt-8 md:pt-0 md:pl-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden bg-white p-2 shadow-lg hover:scale-105 transition-transform">
                    <img src="/wechat-qr.png" alt="WeChat QR Code" className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <span className="text-[10px] text-white/60 uppercase tracking-widest font-normal">WeChat</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden bg-white p-2 shadow-lg hover:scale-105 transition-transform">
                    <img src="/red-qr.jpg" alt="RED QR Code" className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <span className="text-[10px] text-white/60 uppercase tracking-widest font-normal">RED</span>
                </div>
              </div>
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
