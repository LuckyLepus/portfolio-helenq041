import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Printer } from 'lucide-react';
import { spiderPromptMarkdown } from '../data/spiderPrompt';

// 8-bit Spider Component
const PixelSpider = ({ isPrinting }: { isPrinting: boolean }) => (
  <motion.div
    animate={{ 
      y: isPrinting ? [0, -5, 0] : [0, -15, 0],
    }}
    transition={{ 
      duration: isPrinting ? 0.5 : 3,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="relative z-10"
  >
    {/* Spider Web Thread */}
    <motion.div 
      className="absolute left-1/2 top-[-200px] w-0.5 bg-[#00FF85]/30 -translate-x-1/2"
      animate={{ height: isPrinting ? 200 : 200 }}
      style={{ height: 200 }}
    />
    
    {/* The Spider SVG */}
    <motion.svg 
      viewBox="0 0 16 16" 
      className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-[0_0_15px_rgba(0,255,133,0.8)] fill-[#00FF85]"
      animate={{
        scale: isPrinting ? [1, 1.05, 1] : 1
      }}
      transition={{
        duration: 0.5,
        repeat: isPrinting ? Infinity : 0
      }}
    >
      {/* Body */}
      <rect x="5" y="4" width="6" height="6" />
      <rect x="4" y="5" width="8" height="4" />
      <rect x="6" y="3" width="4" height="8" />
      
      {/* Eyes (Blinking Animation) */}
      <motion.g
        animate={{ opacity: [1, 1, 0, 1, 1] }}
        transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.92, 0.94, 1] }}
        className="fill-black"
      >
        <rect x="5" y="6" width="2" height="2" />
        <rect x="9" y="6" width="2" height="2" />
        {/* Cute eye highlight */}
        <rect x="6" y="6" width="1" height="1" className="fill-white" />
        <rect x="10" y="6" width="1" height="1" className="fill-white" />
      </motion.g>
      
      {/* Legs - Left (Wiggling) */}
      <motion.g
        animate={{ y: [0, 1, 0, -1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      >
        <rect x="3" y="4" width="2" height="1" />
        <rect x="2" y="5" width="1" height="2" />
        <rect x="1" y="7" width="1" height="2" />
        
        <rect x="3" y="8" width="1" height="1" />
        <rect x="2" y="9" width="1" height="2" />
        <rect x="1" y="11" width="1" height="2" />
      </motion.g>
      <motion.g
        animate={{ y: [0, -1, 0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      >
        <rect x="3" y="6" width="1" height="1" />
        <rect x="2" y="7" width="1" height="2" />
        <rect x="1" y="9" width="1" height="2" />
        
        <rect x="4" y="9" width="1" height="1" />
        <rect x="3" y="10" width="1" height="2" />
        <rect x="2" y="12" width="1" height="2" />
      </motion.g>

      {/* Legs - Right (Wiggling) */}
      <motion.g
        animate={{ y: [0, 1, 0, -1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      >
        <rect x="11" y="4" width="2" height="1" />
        <rect x="13" y="5" width="1" height="2" />
        <rect x="14" y="7" width="1" height="2" />
        
        <rect x="12" y="8" width="1" height="1" />
        <rect x="13" y="9" width="1" height="2" />
        <rect x="14" y="11" width="1" height="2" />
      </motion.g>
      <motion.g
        animate={{ y: [0, -1, 0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      >
        <rect x="12" y="6" width="1" height="1" />
        <rect x="13" y="7" width="1" height="2" />
        <rect x="14" y="9" width="1" height="2" />
        
        <rect x="11" y="9" width="1" height="1" />
        <rect x="12" y="10" width="1" height="2" />
        <rect x="13" y="12" width="1" height="2" />
      </motion.g>
    </motion.svg>
  </motion.div>
);

export default function CyberSpiderPet() {
  const [isPrinting, setIsPrinting] = useState(false);
  const [printedText, setPrintedText] = useState('');

  // Typewriter effect for the printed text
  useEffect(() => {
    if (isPrinting) {
      let index = 0;
      setPrintedText('');
      const interval = setInterval(() => {
        setPrintedText(spiderPromptMarkdown.substring(0, index));
        index += 5; // Print 5 characters at a time for speed
        if (index > spiderPromptMarkdown.length + 5) {
          clearInterval(interval);
        }
      }, 10);
      return () => clearInterval(interval);
    } else {
      setPrintedText('');
    }
  }, [isPrinting]);

  return (
    <div className="w-full flex flex-col items-center justify-start min-h-[800px] mt-12 relative font-mono">
      
      {/* The 8-bit Spider */}
      <PixelSpider isPrinting={isPrinting} />
      
      {/* Control Terminal (The Register) */}
      <div className="relative z-20 w-full max-w-sm mt-8">
        <div className="bg-[#111] border-2 border-[#00FF85] rounded-xl p-4 shadow-[0_0_30px_rgba(0,255,133,0.2)] flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4 text-[#00FF85]">
            <Terminal className="w-4 h-4" />
            <span className="text-xs tracking-[0.2em] uppercase">Soul Sync Protocol</span>
          </div>
          
          <button
            onClick={() => setIsPrinting(!isPrinting)}
            className={`w-full py-3 rounded uppercase tracking-widest text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              isPrinting 
                ? 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                : 'bg-[#00FF85]/10 text-[#00FF85] border border-[#00FF85]/50 hover:bg-[#00FF85]/20 shadow-[0_0_15px_rgba(0,255,133,0.4)]'
            }`}
          >
            <Printer className="w-4 h-4" />
            {isPrinting ? 'STOP SEQUENCE' : 'PRINT SYSTEM PROMPT'}
          </button>
        </div>
        
        {/* Receipt Slot */}
        <div className="w-4/5 h-2 bg-black mx-auto mt-2 rounded-full border border-white/10 shadow-inner overflow-hidden flex justify-center">
          <div className="w-full h-px bg-white/5 mt-1"></div>
        </div>
      </div>

      {/* The Receipt */}
      <div className="w-full max-w-2xl relative z-10 flex flex-col items-center mt-[-4px]">
        <AnimatePresence>
          {isPrinting && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 2, ease: "linear" }}
              className="w-11/12 sm:w-full bg-[#fdfaf6] text-[#1a1a1a] p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 24px, rgba(0,0,0,0.05) 24px, rgba(0,0,0,0.05) 25px)',
                backgroundSize: '100% 25px'
              }}
            >
              {/* Jagged bottom edge (SVG filter approach or css) */}
              <div className="absolute bottom-0 left-0 w-full h-4 bg-repeat-x" style={{
                backgroundImage: 'linear-gradient(-45deg, transparent 75%, #030303 75%), linear-gradient(45deg, transparent 75%, #030303 75%)',
                backgroundSize: '10px 10px',
                backgroundPosition: '0 0, 0 0'
              }}></div>

              <div className="border-b-2 border-dashed border-[#1a1a1a]/30 pb-6 mb-6 text-center">
                <h3 className="text-xl font-bold tracking-widest uppercase mb-2">System Memory Dump</h3>
                <p className="text-xs text-[#1a1a1a]/50">ID: 1779545571554</p>
                <p className="text-xs text-[#1a1a1a]/50">{new Date().toLocaleString()}</p>
              </div>

              <div className="pb-8">
                <pre className="whitespace-pre-wrap leading-[25px] text-xs sm:text-sm font-mono text-[#222]">
                  {printedText}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
