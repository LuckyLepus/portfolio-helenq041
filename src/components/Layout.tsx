import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CustomCursor from './CustomCursor';
import Navbar from './Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isProjectPage = location.pathname.startsWith('/project');
  const isHome = location.pathname === '/';

  const isPlayground = location.pathname === '/playground';

  const showNavbar = !isHome && !isProjectPage && !isPlayground;

  // 全站素材防下载逻辑与调试防护
  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    
    // 1. 禁用右键菜单
    document.addEventListener('contextmenu', preventDefault);
    
    // 2. 禁用拖拽（防止用户拖动图片/视频到新窗口保存）
    document.addEventListener('dragstart', preventDefault);
    
    // 3. 禁用 Z 世代开发者工具快捷键
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) || 
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', preventDefault);
      document.removeEventListener('dragstart', preventDefault);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative bg-[#4A3AFF] text-white overflow-hidden select-none">
      {/* 隐藏 HTML5 视频默认下载按钮的全局样式 */}
      <style>{`
        video::-internal-media-controls-download-button {
          display: none !important;
        }
        video::-webkit-media-controls-enclosure {
          overflow: hidden !important;
        }
        video::-webkit-media-controls-panel {
          width: calc(100% + 30px) !important; /* 物理移除 Chrome 原生下载点 */
        }
      `}</style>

      <CustomCursor />
      {showNavbar && <Navbar />}
      <main className={`flex-grow w-full h-screen ${showNavbar ? 'pt-24 overflow-y-auto' : ''}`}>
        {children}
      </main>

      {/* 统一水印签名 (Z-世代科技感悬浮微光字体) */}
      <div className="fixed bottom-3 left-8 text-[9px] font-mono tracking-widest text-white/30 z-50 pointer-events-none select-none mix-blend-difference">
        by helen©&Gemini 3.5 antigravity
      </div>
    </div>
  );
}
