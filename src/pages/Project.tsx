import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FileText, ExternalLink, FileDown, ChevronDown, Shield, X, Loader2 } from 'lucide-react';
import ContactPopup from '../components/ContactPopup';
import InteractiveMindMap from '../components/InteractiveMindMap';
import HtmlPptShowcase from '../components/HtmlPptShowcase';
import CyberSpiderPet from '../components/CyberSpiderPet';
import VirtualSingerRecordPlayer from '../components/VirtualSingerRecordPlayer';
import MetaPlayMakerShowcase from '../components/MetaPlayMakerShowcase';

// 配置 GitHub 托管媒体文件的根路径 (如果用户想使用 GitHub 托管)
// 例如: 'https://raw.githubusercontent.com/[Username]/[Repo]/[Branch]/public/cases'
// 留空则默认读取本地项目 `public/cases` 目录下的素材
const GITHUB_MEDIA_BASE_URL: string = 'https://helenq-assets-1317600743.cos.ap-hongkong.myqcloud.com/portfolio-helenq0414';

interface TimelineItem {
  id: string;
  year: string;
  month: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  mediaUrl: string;
  mediaType: 'video' | 'gif' | 'pdf' | 'images';
  fileName: string;
  images?: string[];
}

interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  titleZh: string;
  subtitleZh: string;
  description: string;
  location: string;
  tags: string;
  images: string[];
  timelineItems?: TimelineItem[];
}

function ImageSlider({ images, baseUrl }: { images: string[], baseUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Mouse Drag to Scroll State & Refs
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft: sLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(sLeft > 10);
      setShowRightArrow(sLeft + clientWidth < scrollWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      containerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDown.current = true;
    containerRef.current.style.cursor = 'grabbing';
    containerRef.current.style.scrollBehavior = 'auto'; // Disable smooth scroll temporarily to prevent drag lag
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    if (!isDown.current) return;
    isDown.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
      containerRef.current.style.scrollBehavior = 'smooth';
    }
  };

  const handleMouseUp = () => {
    if (!isDown.current) return;
    isDown.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
      containerRef.current.style.scrollBehavior = 'smooth';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Drag sensitivity
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div className="w-full relative overflow-hidden rounded bg-black/20 border border-white/5 hover:border-[#00FF85]/20 transition-colors duration-300 py-3 group/slider">
      {/* Dynamic Styles for Custom Scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 133, 0.25);
          border-radius: 3px;
          transition: background 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 133, 0.65);
        }
      `}</style>

      {/* Navigation Buttons (Left) */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/70 border border-[#00FF85]/20 text-white hover:text-[#00FF85] hover:border-[#00FF85]/60 hover:bg-black/90 transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-md shadow-[0_0_12px_rgba(0,0,0,0.5)]"
          title="向左滚动"
        >
          ←
        </button>
      )}

      {/* Navigation Buttons (Right) */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/70 border border-[#00FF85]/20 text-white hover:text-[#00FF85] hover:border-[#00FF85]/60 hover:bg-black/90 transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-md shadow-[0_0_12px_rgba(0,0,0,0.5)]"
          title="向右滚动"
        >
          →
        </button>
      )}

      {/* Action Indicators */}
      <div className="absolute right-3 top-3 text-[10px] font-mono text-[#00FF85]/60 bg-[#161616]/80 px-2 py-0.5 rounded border border-[#00FF85]/20 flex items-center gap-1 z-10 pointer-events-none select-none">
        <span>DRAG OR SCROLL →</span>
      </div>
      
      {/* Scrollable Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex gap-4 overflow-x-auto px-4 py-2 snap-x snap-mandatory scroll-smooth custom-scrollbar select-none"
        style={{
          cursor: 'grab',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0, 255, 133, 0.3) rgba(255, 255, 255, 0.02)'
        }}
      >
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            className="flex-shrink-0 w-80 aspect-[16/9] rounded overflow-hidden border border-white/10 relative snap-center group/img pointer-events-none select-none"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <img
              src={(() => {
                if (baseUrl) {
                  const relPath = img.replace(/^\/cases\//, '');
                  return `${baseUrl.replace(/\/$/, '')}/${relPath}`;
                }
                return img;
              })()}
              alt={`Slide ${idx + 1}`}
              className="w-full h-full object-cover select-none pointer-events-none"
              loading="lazy"
            />
            <div className="absolute bottom-2 left-2 text-[9px] font-mono text-white/50 bg-[#161616]/70 px-1.5 py-0.5 rounded">
              PAGE {String(idx + 1).padStart(2, '0')}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SOPStack() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const sopItems = [
    {
      id: 'sop01',
      tabTitle: 'PROGRAM 01',
      titleZh: '活动行业 AI 驱动设计工作流',
      titleEn: 'AI-Driven Design Workflow',
      subtitle: '面向线下活动全球全生命周期的 3D 与视觉 AI 工业化全流程',
      tag: 'Workflow / Midjourney / Stable Diffusion',
      imagePath: '/sop/活动行业AI驱动设计工作流.png',
      accentColor: '#00FF85'
    },
    {
      id: 'sop02',
      tabTitle: 'PROGRAM 02',
      titleZh: 'ComfyUI 工作流 3D 设计流程示意',
      titleEn: 'ComfyUI 3D Design Graph',
      subtitle: '基于节点化逻辑控制与高精度渲染图生图控制流程',
      tag: 'ComfyUI / Nodes / 3D Blender Control',
      imagePath: '/sop/活动行业AI驱动设计工作流--comfUI工作流3D设计示意.png',
      accentColor: '#007AFF'
    },
    {
      id: 'sop03',
      tabTitle: 'PROGRAM 03',
      titleZh: 'Prompt 工程经验汇总手册',
      titleEn: 'Prompt Engineering Manual',
      subtitle: '大模型系统提示词与商业落地实践策略',
      tag: 'LLM / System Prompt / Codex',
      imagePath: '/sop/prompt工程经验汇总.png',
      accentColor: '#FF5E62'
    },
    {
      id: 'sop04',
      tabTitle: 'PROGRAM 04',
      titleZh: '公司级智能操作系统底层框架说明书',
      titleEn: 'Intelligent Enterprise OS Architecture',
      subtitle: '构建高并发与灵活拓展的超级个体 AI 底层架构',
      tag: 'Agents / Workflow / AI Infrastructure',
      imagePath: '/sop/公司级智能操作系统底层框架说明书.png',
      accentColor: '#8A2BE2'
    },
    {
      id: 'sop05',
      tabTitle: 'PROGRAM 05',
      titleZh: 'CODEX 个人经验谈',
      titleEn: 'CODEX Methodology & Experience',
      subtitle: '打破学科壁垒，从策略构建到代码落地的高效秘籍',
      tag: 'Methodology / Executive SOP / Super Individual',
      imagePath: '/sop/CODEX个人经验谈.png',
      accentColor: '#FFD700'
    }
  ];

  return (
    <div className="w-full flex flex-col gap-6 relative select-none">
      {/* Dynamic Style injection for custom scrollbars & folder curves */}
      <style>{`
        .sop-card-shadow {
          box-shadow: 0 -12px 30px -10px rgba(0, 0, 0, 0.5), 
                      0 20px 40px -15px rgba(0, 0, 0, 0.7),
                      inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
        }
        .sop-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .sop-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .sop-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .sop-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 133, 0.4);
        }
      `}</style>

      {/* Stack Container */}
      <div className="relative flex flex-col w-full min-h-[580px] py-6">
        {sopItems.map((item, idx) => {
          const isActive = activeId === item.id;
          const isHovered = hoveredId === item.id;
          
          // Calculate overlap translations when nothing is expanded
          // Each card is offset vertically by 72px, creating a gorgeous layered stack
          const collapsedY = idx * 72;
          
          // Z-index layering: active card has highest priority, otherwise natural index order
          const zIndex = isActive ? 50 : (isHovered ? 40 : 10 + idx);

          return (
            <motion.div
              key={item.id}
              layout
              onClick={() => {
                if (isActive) {
                  setActiveId(null);
                } else {
                  setActiveId(item.id);
                }
              }}
              onMouseEnter={() => !activeId && setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`w-full bg-[#1A0F54]/95 border border-white/12 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 select-none sop-card-shadow ${
                isActive 
                  ? 'relative z-50 ring-1 ring-white/20' 
                  : 'absolute left-0 right-0'
              }`}
              style={{
                zIndex,
                borderLeftColor: item.accentColor,
                borderLeftWidth: '5px'
              }}
              animate={isActive ? {
                y: 0,
                scale: 1,
                rotate: 0,
                marginBottom: '24px',
              } : {
                // When collapsed, stack them neatly, giving them a slight tilt when hovered
                y: collapsedY,
                scale: isHovered ? 1.01 : 1,
                rotate: isHovered ? (idx % 2 === 0 ? 0.5 : -0.5) : 0,
                // Make non-hovered items slightly darker to emphasize depth
                filter: activeId && !isActive ? 'brightness(0.3) blur(2px)' : 'brightness(1)'
              }}
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 26,
              }}
            >
              {/* Folder Tab Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 gap-4 border-b border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest text-black"
                      style={{ backgroundColor: item.accentColor }}
                    >
                      {item.tabTitle}
                    </span>
                    <span className="text-[11px] font-mono text-white/40 tracking-wider">
                      ID: {item.id.toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-normal text-white tracking-wide mt-1 flex items-baseline gap-2">
                    <span className="font-semibold">{item.titleZh}</span>
                    <span className="text-xs text-white/50 font-light italic font-serif hidden md:inline">
                      {item.titleEn}
                    </span>
                  </h3>
                  
                  <p className="text-xs text-white/60 font-light leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1 md:self-center">
                  <span className="text-[10px] font-mono text-white/40 border border-white/10 px-2 py-0.5 rounded bg-white/[0.02]">
                    {item.tag}
                  </span>
                  
                  {!isActive && (
                    <span className="text-[9px] font-mono text-[#00FF85]/60 mt-1 uppercase tracking-widest animate-pulse">
                      CLICK TO EXPAND SOP ↓
                    </span>
                  )}
                  {isActive && (
                    <span className="text-[9px] font-mono text-white/30 mt-1 uppercase tracking-widest">
                      CLICK TO COLLAPSE ↑
                    </span>
                  )}
                </div>
              </div>

              {/* Collapsible Content Area */}
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-black/40 flex justify-center border-t border-white/5">
                      <div className="w-full max-h-[750px] overflow-y-auto rounded-lg border border-white/10 bg-[#0D072B] relative sop-scrollbar select-none">
                        <img
                          src={item.imagePath}
                          alt={item.titleZh}
                          className="w-full h-auto object-contain pointer-events-none select-none"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-transparent pointer-events-none" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const casesTimeline: TimelineItem[] = [
  {
    id: 'c01',
    year: '2019',
    month: '12',
    title: '极客公园大事件活动创造指南',
    titleEn: 'GeekPark Innovation Festival Campaign',
    description: '面向新锐科技精英的年度思想碰撞盛宴。以极简极客美学为骨架，打造无界灵感实验室，策划高品质圆桌对话与黑科技交互展区，定制独一无二的科技漫游指南。',
    descriptionEn: 'An intellectual feast for cutting-edge tech elites. Built upon minimalist hacker aesthetics, creating boundless inspiration labs, roundtables, and high-tech experiential zones.',
    mediaUrl: '/cases/2020IF2019极客公园大事件活动创造指南NO.01.mp4',
    mediaType: 'video',
    fileName: '2020IF2019极客公园大事件活动创造指南NO.01.mp4'
  },
  {
    id: 'c02',
    year: '2020',
    month: '06',
    title: '汽车之家 818 中国汽车新消费论坛暨展览',
    titleEn: 'Autohome 818 New Consumption Forum & Exhibition',
    description: '针对后疫情时代汽车消费信心的重塑，策划“中国汽车新消费论坛暨展览”，线上线下双驱融合，以全景式数字化展厅及领袖级峰会为行业注入强心剂。',
    descriptionEn: 'Designed a dual-drive online-offline integration for the post-pandemic automotive market, establishing a panoramic digital exhibition hall and a top-tier summit to rebuild market confidence.',
    mediaUrl: '/cases/2020汽车之家818中国汽车新消费论坛暨展览0605【未压缩原版】.mp4',
    mediaType: 'video',
    fileName: '2020汽车之家818中国汽车新消费论坛暨展览0605【未压缩原版】.mp4'
  },
  {
    id: 'c03',
    year: '2020',
    month: '08',
    title: '京东全球科技探索者大会线上整合项目',
    titleEn: 'JD Discovery Tech Conference Online Integration',
    description: '京东年度核心科技盛会线上全案策划。突破传统论坛桎梏，设计多维沉浸式虚拟会场，融合AI/Web3前沿视听，实现亿级声量曝光与科技叙事沉浸式感知。',
    descriptionEn: 'Full strategic planning for JD\'s annual flagship tech conference. Broke the boundaries of traditional forums by designing multi-dimensional immersive virtual venues with cutting-edge AV technology.',
    mediaUrl: '/cases/2020年京东全球科技探索者大会线上整合项目方案【0812】未压缩.mp4',
    mediaType: 'video',
    fileName: '2020年京东全球科技探索者大会线上整合项目方案【0812】未压缩.mp4'
  },
  {
    id: 'c04',
    year: '2020',
    month: '09',
    title: '大众点评年终盛典创意建议方案',
    titleEn: 'Dianping Annual Gala Creative Campaign',
    description: '大众点评年度旗舰项目创意提案。以城市生活温度为核心底色，融合潮流地标打卡与线上年终大数据盘点，构建专属于当代都市青年的“烟火气”荣誉圣殿。',
    descriptionEn: 'A creative pitch for Dianping\'s flagship annual campaign. Highlighting urban lifestyle warmth, it fused physical landmark check-ins with digital year-end reviews to build a sanctuary of urban life.',
    mediaUrl: '/cases/2020大众点评年终盛典2020创意建议方案【0914】完全版.mp4',
    mediaType: 'video',
    fileName: '2020大众点评年终盛典2020创意建议方案【0914】完全版.mp4'
  },
  {
    id: 'c05',
    year: '2020',
    month: '10',
    title: '领克粤海区域线上整合营销方案',
    titleEn: 'Lynk & Co Yuehai Regional Marketing Campaign',
    description: '针对领克粤海区域打造的线上整合营销与传播方案。精选多维度的创意社交海报与数字化互动媒介，以新锐潮流视觉链接区域年轻 Z 世代受众，引爆线上社交声量。',
    descriptionEn: 'An integrated online marketing and communication campaign tailored for Lynk & Co in the Yuehai region. Incorporates trendsetting social posters and digital interactive media to engage local Gen Z consumers.',
    mediaUrl: '/cases/2020领克粤海区域营销方案/幻灯片2.JPG',
    mediaType: 'images',
    fileName: '2020领克粤海区域营销方案',
    images: [
      '/cases/2020领克粤海区域营销方案/幻灯片2.JPG',
      '/cases/2020领克粤海区域营销方案/幻灯片3.JPG',
      '/cases/2020领克粤海区域营销方案/幻灯片5.JPG',
      '/cases/2020领克粤海区域营销方案/幻灯片8.JPG',
      '/cases/2020领克粤海区域营销方案/幻灯片12.JPG',
      '/cases/2020领克粤海区域营销方案/幻灯片20.JPG',
      '/cases/2020领克粤海区域营销方案/幻灯片26.JPG',
      '/cases/2020领克粤海区域营销方案/幻灯片32.JPG'
    ]
  },
  {
    id: 'c06',
    year: '2021',
    month: '07',
    title: '新浪微博粉丝嘉年华创意激活',
    titleEn: 'Sina Weibo Fans Carnival Campaign',
    description: '微博超级IP粉丝狂欢盛宴线下创意激活。打造多重破圈粉丝互动展位、应援打卡区与沉浸式潮流集市，以年轻态设计语言建立品牌与Z世代用户的超链接。',
    descriptionEn: 'Offline creative activation for Weibo\'s massive fan-culture IP. Designed interactive fan booths, fandom check-ins, and pop-up markets, building a direct hyperlink between brand and Gen Z.',
    mediaUrl: '/cases/2021新浪微博粉丝嘉年华创意方案【0713】.gif',
    mediaType: 'gif',
    fileName: '2021新浪微博粉丝嘉年华创意方案【0713】.gif'
  },
  {
    id: 'c07',
    year: '2021',
    month: '11',
    title: '新浪造浪 CITY 节日计划创意方案',
    titleEn: 'Sina Wave-Making CITY Festival Plan',
    description: '聚焦青年先锋文化的城市级节日计划提案。融合街头潮流、潮流艺术、先锋音乐与市集文化，为城市定制专属的造浪节日，释放圈层青年力与潮流商业潜力。',
    descriptionEn: 'A city-level festival strategy focusing on youth vanguard culture. Blends street fashion, contemporary art, indie music, and curated markets to unleash local community subculture energy.',
    mediaUrl: '/cases/2021新浪2021年度造浪CITY节日计划创意方案【1103】2.0.gif',
    mediaType: 'gif',
    fileName: '2021新浪2021年度造浪CITY节日计划创意方案【1103】2.0.gif'
  },
  {
    id: 'c08',
    year: '2022',
    month: '01',
    title: 'MasterGo 创造力峰会创意方案',
    titleEn: 'MasterGo Creativity Summit Campaign',
    description: '专为数字界面设计师打造的创造力年度峰会提案。以“协同无界，灵感共生”为视觉与叙事核心，采用大色块与极简主义流动线条，昭示国产协同设计工具时代的到来。',
    descriptionEn: 'Annual design summit pitch for MasterGo. With "Boundless Collaboration, Shared Inspiration" as the visual backbone, utilizing fluid lines and solid colors to herald a new era of collaborative UI tools.',
    mediaUrl: '/cases/2022MasterGo创造力峰会项目方案创意部分-0125 2351.gif',
    mediaType: 'gif',
    fileName: '2022MasterGo创造力峰会项目方案创意部分-0125 2351.gif'
  },
  {
    id: 'c09',
    year: '2022',
    month: '05',
    title: '西瓜 PLAY 嘉年华项目方案',
    titleEn: 'Xigua PLAY Carnival Creative Strategy',
    description: '中视频创作者年度奥德赛之旅。以“登岛漫游”为核心概念，设计集海岛露营、颁奖盛典、共创工坊于一体的沉浸式线下狂欢，强化平台凝聚力与深度社交联结。',
    descriptionEn: 'An annual odyssey for video creators. Grounded in the "Island Roaming" concept, it designed a multi-day immersive camping, award gala, and workshops to foster platform cohesion.',
    mediaUrl: '/cases/2022西瓜PLAY嘉年华2022项目方案Final-byUnison【0517】.gif',
    mediaType: 'gif',
    fileName: '2022西瓜PLAY嘉年华2022项目方案Final-byUnison【0517】.gif'
  },
  {
    id: 'c10',
    year: '2022',
    month: '10',
    title: '巨量引擎年度商业大会 (引擎大会)',
    titleEn: 'OceanEngine Annual Partner Summit',
    description: '字节跳动巨量引擎年度核心商业大会创意方案。以数字化商业增长引擎为灵感，构建金属感与流动粒子融合的光影空间，演绎数据、流量与创意协同爆发的商业艺术。',
    descriptionEn: 'OceanEngine\'s annual premier business summit. Inspired by digital growth engines, we crafted a high-tech metallic aesthetic with particle-driven visuals showing the power of data.',
    mediaUrl: '/cases/2022引擎大会2022项目建议方案【1015】.mp4',
    mediaType: 'video',
    fileName: '2022引擎大会2022项目建议方案【1015】.mp4'
  },
  {
    id: 'c11',
    year: '2024',
    month: '06',
    title: '次元引力：二次元文化活动企划',
    titleEn: 'Subculture Gravity: ACG Event Strategy',
    description: '探索年轻一代精神乌托邦的二次元专属企划。打通动漫、游戏与同人圈层，以精美的跨次元布景与互动SOP，为ACG同好群体构建充满归属感的梦幻引力场。',
    descriptionEn: 'Exploring the spiritual utopia of Gen Z subcultures. Seamlessly bridged anime, gaming, and doujin spheres, planning cross-dimensional spaces and curated interactions to build community.',
    mediaUrl: '/cases/anime_event_2024/二次元活动2024_page_1.png',
    mediaType: 'images',
    fileName: 'anime_event_2024',
    images: [
      '/cases/anime_event_2024/二次元活动2024_page_1.png',
      '/cases/anime_event_2024/二次元活动2024_page_2.png',
      '/cases/anime_event_2024/二次元活动2024_page_3.png',
      '/cases/anime_event_2024/二次元活动2024_page_5.png',
      '/cases/anime_event_2024/二次元活动2024_page_8.png',
      '/cases/anime_event_2024/二次元活动2024_page_12.png',
      '/cases/anime_event_2024/二次元活动2024_page_18.png',
      '/cases/anime_event_2024/二次元活动2024_page_25.png',
      '/cases/anime_event_2024/二次元活动2024_page_35.png',
      '/cases/anime_event_2024/二次元活动2024_page_45.png',
      '/cases/anime_event_2024/二次元活动2024_page_57.png'
    ]
  },
  {
    id: 'c12',
    year: '2025',
    month: '01',
    title: '抖音甄选餐厅榜单年度发布会',
    titleEn: 'Douyin Selected Restaurant Award Ceremony',
    description: '抖音高奢餐饮盛会创意方案。聚焦精致餐饮美学，以“烟火与诗意”为设计核心，打造光影流转的品鉴艺术长廊，彰显高端品质生活格调与内容生态势能。',
    descriptionEn: 'An ultra-luxury culinary awards gala for Douyin. Blending "poetic vibes and local flavors", it introduced dynamic projection galleries showcasing gastronomy culture and platform prestige.',
    mediaUrl: '/cases/2025抖音甄选餐厅榜单发布会创意方案-by thinkpark【0116】.mp4',
    mediaType: 'video',
    fileName: '2025抖音甄选餐厅榜单发布会创意方案-by thinkpark【0116】.mp4'
  },
  {
    id: 'c13',
    year: '2025',
    month: '03',
    title: '珀莱雅双抗精华 4.0 全球发布会',
    titleEn: 'PROYA Anti-Oxidant & Anti-Aging Essence 4.0 Launch',
    description: '国货美妆巨头旗舰爆款迭代发布的创意全案。以“科研抗衰，光芒无惧”为视听主轴，利用高科技环幕投影与流光溢彩的科技美学，诠释护肤新纪元的极致科研能量。',
    descriptionEn: 'The global product launch campaign for PROYA\'s blockbuster essence. Fusing scientific rigors with dazzling digital art, featuring panoramic projections to express ultimate beauty biotech.',
    mediaUrl: '/cases/2025珀莱雅双抗精华4.0发布会-0320.gif',
    mediaType: 'gif',
    fileName: '2025珀莱雅双抗精华4.0发布会-0320.gif'
  },
  {
    id: 'c14',
    year: '2025',
    month: '10',
    title: '复星集团年度创意规划方案 (FORZHUO-AI)',
    titleEn: 'Fosun Creative & Strategic Planning Proposal',
    description: '结合AI前沿工具辅助产出的复星品牌战略创意规划。深入洞察大健康与家庭消费场景，重塑造品牌与消费者的生命情感联结，融合数字分身与多维场景共鸣。',
    descriptionEn: 'An AI-augmented strategic proposal for Fosun\'s brand identity. Fused digital humans with household scenes, creating deep emotional resonances across healthcare and retail portfolios.',
    mediaUrl: '/cases/2025复星2025创意规划方案【1024】FORZHUO-AI.mp4',
    mediaType: 'video',
    fileName: '2025复星2025创意规划方案【1024】FORZHUO-AI.mp4'
  }
];

const projectsData: Record<string, ProjectItem> = {
  '01': {
    id: '01',
    title: 'OFFline&ONline agencies',
    subtitle: 'Legacy PR & Integrated Marketing',
    titleZh: '方法论与积淀',
    subtitleZh: '15年 信号与杂讯——传统公关传播方案库',
    description: '这里收录了我过去 15 年在传统公关传播、线上线下整合营销及大型品牌战役中的核心实践方案与创意积淀。\n\n从互联网巨头的高光时刻、科技巨擘的行业峰会，到潮流新锐的跨界狂欢，每一个案例都是我们在瞬息万变的市场杂讯中，为品牌捕捉并释放的独特信号。\n\n这是对方法论的不断淬炼，也是公关传播从‘传统’迈向‘数字化与智能化’演进轨迹的真实写照。',
    location: 'Beijing & Greater China, 2020-2025',
    tags: 'Integrated PR. Campaign Strategy. Event SOP. Media Relations. Event Curation.',
    images: [],
    timelineItems: casesTimeline
  },
  '02': {
    id: '02',
    title: 'Future Gaze',
    subtitle: 'AI + Web3.0 Narrative Design',
    titleZh: '新技术与叙事',
    subtitleZh: '用新方法让“PPT”设计新叙事',
    description: '由 HelenQ 与 Gemini 共同打造的革命性 Web-Native 提案体验。彻底打破传统线性幻灯片的束缚，借助现代前端技术，融合丝滑的卷轴视差动画与实时可交互的 3D 模型，带来跨平台、沉浸式的交互叙事艺术场域。',
    location: 'Co-created by HelenQ & Gemini, 2026',
    tags: 'Interactive Presentations. Web-Native Narratives. 3D WebGL.',
    images: [
      'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
    ]
  },
  '03': {
    id: '03',
    title: 'Synthetic SOP & Autopsy',
    subtitle: 'AICC Creative Logic & Failure Review',
    titleZh: '效率骨架与坠机复盘',
    subtitleZh: 'AI创意全流程SOP与知识库失败复盘',
    description: '这里汇总了我在探索 AICC 工作流过程中的核心经验与实践成果，以及对价值200万AI知识库项目的完整失败复盘。\n\n从提炼 Prompt 工程策略、搭建底层框架的效率工具箱；到深入解构“完美的执行悖论”，探讨为什么用错误的方法解决错误的问题会导致系统崩溃。\n\n无论是可复制的自动化流程骨架，还是重构进化型组织大脑的深度审计，都在于帮助团队实现灵感的精准落地与系统迭代进化。',
    location: 'Beijing, 2023-2026',
    tags: 'AI Workflow. SOP. Prompt Engineering. System Architecture. Autopsy.',
    images: []
  },
  '04': {
    id: '04',
    title: 'SOUL in the Machine',
    subtitle: 'Prompt Engineer // Skillful Agents',
    titleZh: '灵魂与代码',
    subtitleZh: '致敬《攻壳机动队》，把Prompt包装成具有生命力的“soul”',
    description: '一只潜伏在代码深处的赛博小蜘蛛。它不织寻常的蛛网，而是用字符编织精确的 Prompt 与系统指令。\n\n作为致敬《攻壳机动队》的数字生命体，它将冰冷的代码封装成具有自主意识的“灵魂（Soul）”，在无形的赛博空间中穿梭，为 AI Agent 注入执行复杂任务的能力。',
    location: 'Cyber Space, 2024',
    tags: 'Prompt Engineering. AI Agents. Cyberpunk. Digital Life.',
    images: [
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
    ]
  },
  '05': {
    id: '05',
    title: 'Subculture Lab',
    subtitle: 'Interest-driven AI Experiments',
    titleZh: '实验与审美',
    subtitleZh: '我的AI驱动的泛兴趣实验室',
    description: 'ALYONA Алёна - 诞生于 AI 与复古蒸汽波美学融合的虚拟俄罗斯女歌手。本项目探索了合成人声、生成式视觉与次文化音乐运动的交汇点。通过她的首张 5 轨可交互唱片，带你体验霓虹闪烁的怀旧情结与数字时代特有的忧郁情绪。',
    location: 'Cyberspace, 2026',
    tags: 'Virtual Singer. Vaporwave. AI Generation. 3D WebGL.',
    images: []
  },
  '06': {
    id: '06',
    title: 'Meta Play&Maker',
    subtitle: 'Game Design & Low-Poly Aesthetics',
    titleZh: '交互与边界',
    subtitleZh: '无边界探索ING-游戏与低多边形艺术实验',
    description: '探索游戏、交互与三维空间的视觉诗歌。当低多边形艺术与交互代码交融，设计的边界开始消融，开启了数字感官体验的新维度。',
    location: 'Beijing & Cyberspace, 2026',
    tags: 'HCI Exploration. WebGL Experiential. Webcam Parallax. Low-Poly Aesthetics. Interactive Design.',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=1200&auto=format&fit=crop',
    ]
  }
};

const allProjects = Object.values(projectsData);

export default function Project() {
  const { id } = useParams<{ id: string }>();
  const project = id ? projectsData[id] : null;
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });

  const isProject01 = project?.id === '01';
  const isProject02 = project?.id === '02';
  const isProject03 = project?.id === '03';
  const isProject04 = project?.id === '04';
  const isProject05 = project?.id === '05';
  const isProject06 = project?.id === '06';

  // Transforms for stacking effect
  const titleY = useTransform(scrollY, [0, 300], [0, -100]);
  const titleOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const desc1Y = useTransform(scrollY, [0, 300], [0, -30]);
  const desc2Y = useTransform(scrollY, [0, 300], [0, -80]);
  const desc3Y = useTransform(scrollY, [0, 300], [0, -130]);
  const descOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  if (!project) {
    return <div className="text-center mt-32 font-serif text-2xl">Project not found</div>;
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative font-sans font-light flex">
      
      {/* LEFT COLUMN (FIXED) */}
      <div className="w-80 h-full flex-shrink-0 flex flex-col justify-between p-8 z-20 relative">
        <div className="flex gap-4">
          <Link to="/" className="font-normal text-sm whitespace-nowrap hoverable hover:text-[#00FF85] transition-colors">齐婕 Helen.Q</Link>
          <p className="text-sm leading-tight">
            I plan, I create, I think.<br />
            Based in Beijing.<br />
            This is my Portfolio.
          </p>
        </div>

        <div className="text-sm leading-relaxed pr-4 flex flex-col gap-4">
          {project.description.split('\n\n').map((para, i) => {
            const yTransforms = [desc1Y, desc2Y, desc3Y];
            return (
              <motion.p
                key={i}
                style={isProject01 ? { y: yTransforms[i % 3], opacity: descOpacity } : {}}
              >
                {para}
              </motion.p>
            );
          })}
        </div>

        <motion.div
          className="text-sm leading-tight"
          style={isProject01 ? { y: desc3Y, opacity: descOpacity } : {}}
        >
          <p>{project.location}</p>
          <p>{project.tags}</p>
        </motion.div>
      </div>

      {/* CENTER COLUMN (SCROLLABLE) */}
      <div ref={scrollRef} className="flex-grow h-full overflow-y-auto z-10 relative hide-scrollbar">
        <div className={`py-12 px-8 flex flex-col items-center gap-16 mx-auto relative transition-all duration-300 ${isProject03 ? 'max-w-5xl' : 'max-w-4xl'}`}>
          <motion.h1
            className="text-4xl font-normal tracking-tight mb-4"
            style={isProject01 ? { y: titleY, opacity: titleOpacity } : {}}
          >
            {project.title}
          </motion.h1>
          
          <div className="w-full relative">
            {/* Vertical Line for Timeline */}
            {isProject01 && (
              <div className="absolute left-10 top-2 bottom-2 w-px bg-[#00FF85]/20 z-0"></div>
            )}

            <div className="flex flex-col gap-24 w-full">
              {isProject01 && project.timelineItems ? (
                project.timelineItems.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="w-full relative flex gap-8 items-start group"
                  >
                    {/* Timeline Node */}
                    <div className="w-20 flex-shrink-0 flex flex-col items-center justify-start pt-1.5 relative z-10">
                      <div className="text-xs font-mono font-semibold tracking-wider text-[#00FF85] mb-2 bg-[#161616] px-2 py-0.5 rounded border border-[#00FF85]/30 shadow-[0_0_8px_rgba(0,255,133,0.15)]">
                        {item.year}/{item.month}
                      </div>
                      <div className="w-3 h-3 rounded-full bg-[#00FF85] shadow-[0_0_12px_#00FF85] group-hover:scale-125 transition-transform duration-300"></div>
                    </div>

                    {/* Timeline Content Card */}
                    <div className="flex-grow bg-white/[0.02] border border-white/[0.06] group-hover:border-[#00FF85]/20 group-hover:bg-white/[0.04] p-6 rounded transition-all duration-300 relative overflow-hidden backdrop-blur-md">
                      {/* Background glow on hover */}
                      <div className="absolute -inset-px bg-gradient-to-r from-[#00FF85]/0 via-[#00FF85]/5 to-[#00FF85]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded" />
                      
                      {/* Text info */}
                      <div className="mb-6 relative z-10">
                        <h2 className="text-xl font-normal text-white tracking-wide mb-1 leading-snug">
                          {item.title}
                        </h2>
                        <h3 className="text-xs text-[#00FF85]/80 font-normal italic tracking-wide uppercase mb-3">
                          {item.titleEn}
                        </h3>
                        <p className="text-sm text-white/80 leading-relaxed font-light mb-3">
                          {item.description}
                        </p>
                        <p className="text-xs text-white/50 leading-relaxed font-light italic">
                          {item.descriptionEn}
                        </p>
                      </div>

                      {/* Interactive Media Container */}
                      <div className="relative z-10 mt-4">
                        {item.mediaType === 'video' ? (
                          <div className="w-full aspect-video rounded overflow-hidden bg-black/60 border border-white/5 group-hover:border-[#00FF85]/20 transition-colors duration-300">
                            <video
                              src={(() => {
                                if (GITHUB_MEDIA_BASE_URL) {
                                  return `${GITHUB_MEDIA_BASE_URL.replace(/\/$/, '')}/${item.fileName}`;
                                }
                                return item.mediaUrl;
                              })()}
                              controls
                              preload="metadata"
                              className="w-full h-full object-contain"
                              playsInline
                            />
                          </div>
                        ) : item.mediaType === 'gif' ? (
                          <div className="w-full rounded overflow-hidden bg-black/40 border border-white/5 group-hover:border-[#00FF85]/20 transition-colors duration-300">
                            <img
                              src={(() => {
                                if (GITHUB_MEDIA_BASE_URL) {
                                  return `${GITHUB_MEDIA_BASE_URL.replace(/\/$/, '')}/${item.fileName}`;
                                }
                                return item.mediaUrl;
                              })()}
                              alt={item.title}
                              className="w-full h-auto object-cover"
                              loading="lazy"
                            />
                          </div>
                        ) : item.mediaType === 'images' ? (
                          <ImageSlider
                            images={item.images || []}
                            baseUrl={GITHUB_MEDIA_BASE_URL}
                          />
                        ) : (
                          <a
                            href={(() => {
                              if (GITHUB_MEDIA_BASE_URL) {
                                return `${GITHUB_MEDIA_BASE_URL.replace(/\/$/, '')}/${item.fileName}`;
                              }
                              return item.mediaUrl;
                            })()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 rounded bg-white/[0.03] border border-white/10 hover:border-[#00FF85]/40 hover:bg-white/[0.08] transition-all duration-300 group/pdf"
                          >
                            <div className="w-12 h-12 rounded bg-[#00FF85]/10 flex items-center justify-center text-[#00FF85] group-hover/pdf:scale-105 transition-transform duration-300">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="text-sm font-normal text-white truncate">{item.title}</p>
                              <p className="text-xs text-white/40 truncate font-mono mt-0.5">{item.fileName}</p>
                            </div>
                            <div className="text-white/40 group-hover/pdf:text-[#00FF85] transition-colors">
                              <ExternalLink className="w-5 h-5" />
                            </div>
                          </a>
                        )}
                      </div>

                      {/* Exact Filename Tag */}
                      <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-white/30 relative z-10">
                        <span>CASE ID: {item.id.toUpperCase()}</span>
                        <span>[ 文件名: {item.fileName} ]</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : isProject02 ? (
                <div className="w-full">
                  <HtmlPptShowcase />
                </div>
              ) : isProject03 ? (
                <div className="flex flex-col gap-12 w-full">
                  <SOPStack />
                  
                  {/* Scroll Down Indicator */}
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full flex flex-col items-center justify-center mt-8 mb-2 pointer-events-none"
                  >
                    <span className="text-[10px] font-mono text-[#00FF85]/80 mb-2 tracking-[0.2em] uppercase">Scroll For Autopsy Report</span>
                    <ChevronDown className="w-8 h-8 text-[#00FF85] drop-shadow-[0_0_8px_rgba(0,255,133,0.5)]" />
                  </motion.div>
                  
                  <div className="w-full h-px bg-white/10 mb-8 mt-4"></div>
                  
                  <div className="mb-4">
                    <h2 className="text-2xl font-normal text-white tracking-wide mb-2">Failure Case Review</h2>
                    <p className="text-sm text-white/50">深入解构价值200万的AI知识库崩溃陷阱与进化型组织重构</p>
                  </div>
                  
                  <InteractiveMindMap />
                  
                  {/* Secure PDF Online Viewer Section */}
                  <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-[#00FF85]/10 flex items-center justify-center text-[#00FF85] mb-6 shadow-[0_0_20px_rgba(0,255,133,0.1)]">
                      <Shield className="w-8 h-8 animate-pulse" />
                    </div>
                    <h3 className="text-xl text-white font-medium mb-3">《价值200万的AI知识库坠机复盘》安全阅览室</h3>
                    <p className="text-sm text-white/50 mb-8 max-w-md mx-auto leading-relaxed">
                      系统已启用数字防盗加密沙箱，您可在此直接畅读包含 15 页详细解构与进化型组织重构方案的完整复盘报告。
                    </p>
                    <button
                      onClick={() => setIsPdfOpen(true)}
                      className="inline-flex items-center gap-3 bg-[#00FF85]/10 hover:bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30 hover:border-[#00FF85]/60 px-8 py-3 rounded-full transition-all duration-300 font-mono text-sm tracking-widest hover:shadow-[0_0_15px_rgba(0,255,133,0.3)] cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      READ FULL REPORT
                    </button>
                  </div>
                </div>
              ) : isProject04 ? (
                <div className="w-full flex justify-center">
                  <CyberSpiderPet />
                </div>
              ) : isProject05 ? (
                <div className="w-full flex justify-center">
                  <VirtualSingerRecordPlayer />
                </div>
              ) : isProject06 ? (
                <div className="w-full flex justify-center">
                  <MetaPlayMakerShowcase />
                </div>
              ) : (
                project.images.map((img, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="w-full relative flex flex-col"
                  >
                    <div className="flex-grow">
                      <img 
                        src={img} 
                        alt={`${project.title} detail ${idx + 1}`} 
                        className="w-full h-auto object-cover rounded-sm"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
          
          {/* Spacer for bottom */}
          <div className="h-24"></div>
        </div>
      </div>

      {/* RIGHT COLUMN (FIXED) */}
      <div className="w-80 h-full flex-shrink-0 flex flex-col justify-between p-8 z-20 relative">
        <div className="flex flex-col gap-8">
          <div className="flex gap-12 font-normal text-sm justify-end">
            <Link to="/playground" className="hover:text-[#00FF85] transition-colors hoverable">Playground</Link>
            <Link to="/about" className="hover:text-[#00FF85] transition-colors hoverable">About</Link>
          </div>
          <div className="w-full h-px bg-current opacity-20"></div>
        </div>

        <div className="flex flex-col w-64 self-end flex-grow mt-8 overflow-y-auto hide-scrollbar">
          {allProjects.map((p) => {
            const isHoveredOrActive = hoveredId === p.id || project.id === p.id;
            return (
            <Link
              key={p.id}
              to={`/project/${p.id}`}
              className={`block mb-6 transition-all duration-300 hoverable ${
                isHoveredOrActive ? 'text-[#00FF85] opacity-100' : 'text-white opacity-50'
              }`}
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex justify-between items-baseline">
                <span className={`transition-all duration-300 ${
                  isHoveredOrActive 
                    ? 'font-jinshu text-[15px] tracking-wider' 
                    : 'text-sm font-normal'
                }`}>
                  {isHoveredOrActive ? p.titleZh : p.title}
                </span>
                <span className="text-xs font-normal">{`{${p.id}}`}</span>
              </div>
              <div className={`transition-all duration-300 mt-1.5 leading-relaxed ${
                isHoveredOrActive 
                  ? 'text-[11px] font-normal tracking-wide opacity-90' 
                  : 'text-xs mt-1'
              }`}>
                {isHoveredOrActive ? p.subtitleZh : p.subtitle}
              </div>
            </Link>
          )})}
        </div>

        <div className="text-sm self-end text-right">
          <p className="mb-1 font-normal">Talk to me..</p>
          <div className="flex gap-2 font-normal uppercase justify-end">
            <a href="#" onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }} className="underline hover:text-[#00FF85] transition-colors hoverable cursor-pointer">EMAIL /</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }} className="underline hover:text-[#00FF85] transition-colors hoverable cursor-pointer">RED /</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }} className="underline hover:text-[#00FF85] transition-colors hoverable cursor-pointer">WECHAT /</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }} className="underline hover:text-[#00FF85] transition-colors hoverable cursor-pointer">PHONE</a>
          </div>
        </div>
      </div>

      <ContactPopup isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <PdfViewerModal 
        isOpen={isPdfOpen} 
        onClose={() => setIsPdfOpen(false)} 
        pdfSrc="/cases/The_$2M_AI_Knowledge_Autopsy.pdf#toolbar=0" 
      />
    </div>
  );
}

// ==========================================
// SECURE PDF PREVIEW MODAL COMPONENT (ANTI-DOWNLOAD)
// ==========================================
interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfSrc: string;
}

function PdfViewerModal({ isOpen, onClose }: PdfViewerModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const numPages = 15;
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth visual loading skeleton screen transition
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 400); // 400ms premium skeletal pulse
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll propagation when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 md:p-6"
          onClick={onClose}
        >
          {/* Modal Card Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-5xl h-[85vh] bg-[#0A061C]/95 border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,255,133,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Area */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0F0A27]/90 select-none">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00FF85]/10 flex items-center justify-center text-[#00FF85] border border-[#00FF85]/20 animate-pulse">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-normal text-white tracking-wide flex items-center gap-2">
                    <span>在线安全阅读器</span>
                    <span className="text-[9px] font-mono font-bold text-[#00FF85]/80 bg-[#00FF85]/10 px-1.5 py-0.5 rounded border border-[#00FF85]/20 tracking-wider">
                      SECURE PREVIEW
                    </span>
                  </h3>
                  <p className="text-[10px] text-white/40 mt-0.5 tracking-wider uppercase font-mono">
                    THE $2M AI KNOWLEDGE AUTOPSY REPORT
                  </p>
                </div>
              </div>

              {/* Exit Button */}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all duration-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Red Alert Banner */}
            <div className="bg-[#FF3E6C]/10 border-b border-[#FF3E6C]/20 px-6 py-2 flex items-center gap-2 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3E6C] animate-ping" />
              <span className="text-[10px] md:text-xs font-light text-[#FF3E6C]/90 tracking-wide">
                🔒 安全隔离：系统已对当前文档启用数字图像加密重绘。物理阻断了任何 PDF 原始数据流，禁止另存及导出。
              </span>
            </div>

            {/* Core PDF View Port */}
            <div 
              ref={containerRef}
              className="flex-grow w-full relative bg-[#04020B] overflow-y-auto p-4 md:p-8 flex flex-col items-center gap-6 select-none scroll-smooth"
              style={{ maxHeight: 'calc(85vh - 120px)' }}
              onContextMenu={(e) => e.preventDefault()}
            >
              
              {/* Fully transparent blocker to overlay the entire viewport and intercept right clicks */}
              <div 
                className="absolute inset-0 bg-transparent z-20 cursor-default"
                onContextMenu={(e) => e.preventDefault()}
              />

              {/* High-Tech Loading Skeleton Screen */}
              {isLoading && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#070415] gap-4 animate-fade-in">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#00FF85]/80 animate-spin" />
                    <Shield className="w-4 h-4 text-[#00FF85] absolute" />
                  </div>
                  <div className="flex flex-col items-center gap-1.5 text-center px-4 max-w-xs select-none">
                    <span className="text-xs font-mono tracking-widest text-[#00FF85] uppercase">Encrypting secure link...</span>
                    <span className="text-[9px] text-white/30 tracking-wider">
                      Decrypting & rendering encrypted image layers
                    </span>
                  </div>
                </div>
              )}

              {/* Rendered Image list */}
              {!isLoading && Array.from({ length: numPages }).map((_, i) => {
                const pageStr = String(i + 1).padStart(2, '0');
                const imgSrc = `/cases/The_$2M_AI_Knowledge_Autopsy/The_$2M_AI_Knowledge_Autopsy_页面_${pageStr}_图像_0001.jpg`;

                return (
                  <div 
                    key={i} 
                    className="relative rounded-lg border border-white/10 bg-[#080516] shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden w-full max-w-3xl transition-all duration-300 min-h-[300px] flex items-center justify-center"
                  >
                    {/* The Safe Image with full browser protections */}
                    <img
                      src={imgSrc}
                      alt={`Autopsy report page ${i + 1}`}
                      className="block w-full h-auto select-none pointer-events-none"
                      loading="lazy"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    />
                    {/* Page index tag */}
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-black/60 border border-white/10 text-[9px] font-mono text-white/60 tracking-wider select-none backdrop-blur-sm">
                      PAGE {i + 1} / {numPages}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Watermark */}
            <div className="px-6 py-3 border-t border-white/10 bg-[#0F0A27]/60 flex items-center justify-between text-[9px] font-mono text-white/20 select-none">
              <span>IMAGE SHIELD // ANTIGRAVITY ENGINE v3.5</span>
              <span>RESTRICTED SECURE IMAGE VIEW ONLY</span>
              <span>SYSTEM DYNAMIC SECURITY SHIELD ACTIVE</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
