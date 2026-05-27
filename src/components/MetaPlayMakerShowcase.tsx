import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Train, Eye } from 'lucide-react';

const tabs = [
  { id: 'storybook', label: '不完美记忆事件', icon: BookOpen, url: '/project06/storybook/index.html' },
  { id: 'railroad', label: 'Railroad.ai 树洞列车', icon: Train, url: '/project06/railroad.html' },
  { id: 'backrooms', label: 'Backrooms Parallax', icon: Eye, url: '/project06/backrooms/dist/index.html' },
];

export default function MetaPlayMakerShowcase() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex justify-center gap-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-3 flex items-center gap-2 rounded-full border transition-all duration-300 ${
                isActive 
                  ? 'bg-white/10 border-white/20 text-white' 
                  : 'bg-transparent border-white/5 text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm tracking-wide">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 border border-white/30 rounded-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Iframe Container */}
      <div className="relative w-full h-[700px] bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <iframe
              src={tabs.find(t => t.id === activeTab)?.url}
              className="w-full h-full border-none"
              title={activeTab}
              allow="camera; microphone"
            ></iframe>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Disclaimer / Instruction text */}
      <div className="text-center text-xs text-white/40 tracking-widest mt-2">
        {activeTab === 'backrooms' && 'TIP: BACKROOMS PARALLAX REQUIRES WEBCAM ACCESS FOR PARALLAX EFFECT'}
      </div>
    </div>
  );
}
