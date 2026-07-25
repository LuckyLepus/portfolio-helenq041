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

            <h2 className="text-3xl font-normal tracking-wide mb-3 text-white">Let's Connect</h2>
            <p className="text-sm text-white/70 mb-10">
              为降低身份聚合风险，本站仅保留业务邮箱。
            </p>
            
            <div className="grid gap-5 md:grid-cols-2">
              <a
                href="mailto:flowernursery@gmail.com"
                className="rounded-2xl border border-white/20 bg-white/10 p-5 transition-colors hover:bg-white/20"
              >
                <span className="block text-white/50 text-[10px] uppercase tracking-widest mb-2">
                  International / 境外
                </span>
                <span className="font-jinshu tracking-wide break-all">
                  flowernursery@gmail.com
                </span>
              </a>
              <a
                href="mailto:lucky_rabbit@foxmail.com"
                className="rounded-2xl border border-white/20 bg-white/10 p-5 transition-colors hover:bg-white/20"
              >
                <span className="block text-white/50 text-[10px] uppercase tracking-widest mb-2">
                  Mainland China / 境内
                </span>
                <span className="font-jinshu tracking-wide break-all">
                  lucky_rabbit@foxmail.com
                </span>
              </a>
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
