import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PasswordScreenProps {
  onUnlock: () => void;
}

export default function PasswordScreen({ onUnlock }: PasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Helen2026') {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#161616]/30 backdrop-blur-sm font-sans"
    >
      <form onSubmit={handleSubmit} className="relative flex items-center gap-3">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="请输入进入提示词"
          className={`w-72 px-6 py-3 rounded-full bg-black/30 border ${error ? 'border-red-500' : 'border-white'} text-white placeholder:text-white/40 outline-none focus:bg-black/50 transition-all font-light text-sm tracking-wider`}
          autoFocus
        />
        <button
          type="submit"
          className="px-8 py-3 rounded-full bg-[#9333ea] hover:bg-[#7e22ce] text-[#00FF85] uppercase tracking-widest text-sm font-bold transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)]"
        >
          enter
        </button>

        <AnimatePresence>
          {error && (
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -bottom-8 left-6 text-xs text-red-400 tracking-wider"
            >
              提示词错误 / Access Denied
            </motion.span>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}
