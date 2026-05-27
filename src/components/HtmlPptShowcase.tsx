import { useState } from 'react';
import { Monitor, Smartphone, Maximize, Code2 } from 'lucide-react';

// Reusable browser frame component
function IosBrowserFrame({ title, url, iframeSrc }: { title: string, url: string, iframeSrc: string }) {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-[#00FF85]/60 shadow-[0_0_25px_rgba(0,255,133,0.15)] transition-all duration-500 flex flex-col bg-black ${deviceMode === 'desktop' ? 'aspect-[16/9]' : 'h-[850px]'}`}>
      {/* Safari Top Bar */}
      <div className="h-12 bg-[#1A1A1A] border-b border-[#00FF85]/20 flex items-center px-4 justify-between select-none">
        {/* Mac OS Window Controls */}
        <div className="flex items-center gap-2 w-20">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
        </div>
        
        {/* URL Bar */}
        <div className="flex-1 max-w-md mx-4 flex items-center justify-center bg-black/60 rounded-md py-1.5 px-3 border border-white/10 text-[10px] text-[#00FF85]/80 font-mono font-light tracking-widest truncate shadow-inner">
          <Code2 className="w-3 h-3 mr-2 text-[#00FF85]" />
          {url}
        </div>
        
        {/* View Controls */}
        <div className="flex items-center gap-3 w-20 justify-end">
          <button 
            onClick={() => setDeviceMode('mobile')}
            className={`transition-colors ${deviceMode === 'mobile' ? 'text-[#00FF85]' : 'text-white/40 hover:text-white/80'}`}
            title="Toggle Mobile View"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setDeviceMode('desktop')}
            className={`transition-colors ${deviceMode === 'desktop' ? 'text-[#00FF85]' : 'text-white/40 hover:text-white/80'}`}
            title="Toggle Desktop View"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <a 
            href={iframeSrc} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white/80 transition-colors ml-1"
            title="Open Fullscreen in New Tab"
          >
            <Maximize className="w-4 h-4" />
          </a>
        </div>
      </div>
      
      {/* Iframe Container */}
      <div className="flex-1 w-full bg-[#030303] flex items-center justify-center transition-all duration-500 overflow-hidden">
        <div className={`relative transition-all duration-500 ease-in-out ${deviceMode === 'mobile' ? 'w-[375px] h-[812px] max-h-[90%] border border-white/20 rounded-3xl overflow-hidden shadow-2xl' : 'w-full h-full'}`}>
          <iframe 
            src={iframeSrc}
            className="w-full h-full border-0"
            title={title}
            loading="lazy"
            allow="fullscreen"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default function HtmlPptShowcase() {
  return (
    <div className="flex flex-col gap-20 w-full">
      {/* Intro Section */}
      <div className="w-full bg-gradient-to-br from-[#00FF85]/10 to-transparent border border-[#00FF85]/30 rounded-2xl p-8 sm:p-10 relative overflow-hidden shadow-[0_0_30px_rgba(0,255,133,0.05)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF85]/20 rounded-full blur-[120px] pointer-events-none" />
        
        <h2 className="text-2xl sm:text-3xl font-medium text-white tracking-wide mb-4 flex items-center gap-3">
          <Code2 className="w-8 h-8 text-[#00FF85]" />
          Interactive HTML Presentations
        </h2>
        <h3 className="text-[#00FF85] font-mono text-xs tracking-[0.2em] uppercase mb-8">突破线性叙事的提案革命</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              传统的 PPT 受到平台渲染引擎与线性播放逻辑的限制。在这里，我们将提案彻底<strong className="text-[#00FF85] font-medium mx-1">网页化 (Web-Native)</strong>。
            </p>
            <p className="text-white/80 text-sm leading-relaxed">
              采用前端原生技术构建，带来了传统幻灯片无法比拟的视觉冲击力与交互深度。这些不仅仅是展示，更是可交互的、自适应的沉浸式数字艺术场域。
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 text-sm text-white/90">
              <div className="w-12 h-12 rounded-full bg-[#00FF85]/10 flex items-center justify-center flex-shrink-0 border border-[#00FF85]/20">
                <span className="font-mono text-[#00FF85] text-xs">GSAP</span>
              </div>
              <span>帧级丝滑的全局卷轴视差动画与无缝转场交互</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-white/90">
              <div className="w-12 h-12 rounded-full bg-[#00FF85]/10 flex items-center justify-center flex-shrink-0 border border-[#00FF85]/20">
                <span className="font-mono text-[#00FF85] text-xs">3D</span>
              </div>
              <span>原生内嵌可实时交互的 Three.js 高精度 WebGL 模型</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-white/90">
              <div className="w-12 h-12 rounded-full bg-[#00FF85]/10 flex items-center justify-center flex-shrink-0 border border-[#00FF85]/20">
                <span className="font-mono text-[#00FF85] text-xs">RESP</span>
              </div>
              <span>打破 16:9 局限，完美响应手机、平板与超大宽屏</span>
            </div>
          </div>
        </div>
      </div>

      {/* Showcase 1: Fosun 2026 */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 px-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00FF85]"></div>
            <h3 className="text-2xl text-white font-serif font-light tracking-wide">FOSUN TOURISM 2026</h3>
          </div>
          <p className="text-sm text-white/50 pl-5">复星旅文 2026 发布会创意方案。内嵌 3D 剧院模型，呈现顶级的沉浸式空间感。</p>
        </div>
        <IosBrowserFrame 
          title="Fosun Tourism Group 2026"
          url="fosun-tourism.helenq.dev/2026-proposal"
          iframeSrc="/cases/html-ppts/fosun/fosun_2026.html"
        />
      </div>

      {/* Showcase 2: Audi Traveler 2022 */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 px-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00FF85]"></div>
            <h3 className="text-2xl text-white font-serif font-light tracking-wide">AUDI TRAVELER 2022</h3>
          </div>
          <p className="text-sm text-white/50 pl-5">奥迪旅行车家族 2022。极简暗黑风格，巨幅视频背景与电影级别的遮罩转场。</p>
        </div>
        <IosBrowserFrame 
          title="Audi Traveler 2022"
          url="audi-traveler.helenq.dev/campaign-2022"
          iframeSrc="/cases/html-ppts/portfolio/audi_traveler_2022_v2.html"
        />
      </div>

      {/* Showcase 3: Bytedance Gongyi 2023 */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 px-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00FF85]"></div>
            <h3 className="text-2xl text-white font-serif font-light tracking-wide">BYTEDANCE GONGYI 2023</h3>
          </div>
          <p className="text-sm text-white/50 pl-5">跳动的心 · 字节公益 2023 年度报告。极具温度的动效排版与数据可视化交互。</p>
        </div>
        <IosBrowserFrame 
          title="Bytedance Gongyi 2023"
          url="bytedance-gongyi.helenq.dev/annual-report-2023"
          iframeSrc="/cases/html-ppts/portfolio/bytedance_gongyi_2023.html"
        />
      </div>

    </div>
  );
}
