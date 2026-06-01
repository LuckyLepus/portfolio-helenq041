import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, MotionValue, AnimatePresence } from 'framer-motion';
import ContactPopup from '../components/ContactPopup';
import ModelViewer from '../components/ModelViewer';
import ParticleImage from '../components/ParticleImage';
import PasswordScreen from '../components/PasswordScreen';

const projects = [
  {
    id: '01',
    title: 'OFFline&ONline agencies',
    subtitle: 'Legacy PR & Integrated Marketing',
    titleZh: 'ON&OFFline方案库',
    subtitleZh: '15年信号与杂讯——传统公关传播方案库',
    path: '/project/01',
    image: '/macbook.png', // Uses transparent PNG
    pos: { top: '15%', left: '18%', width: '22vw', height: '28vw' },
    labelPos: { top: '-24px', left: '0' },
    animationClass: 'anim-float-1',
    parallax: 40
  },
  {
    id: '02',
    title: 'Future Gaze',
    subtitle: 'AI + Web3.0 Narrative Design',
    titleZh: '用AI写PPT（你懂的）',
    subtitleZh: '用新方法让“PPT”设计新叙事',
    path: '/project/02',
    image: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?q=80&w=800&auto=format&fit=crop', // Red book
    videoUrl: '/project2.mp4',
    pos: { top: '55%', left: '26%', width: '28vw', height: '15.75vw' },
    labelPos: { top: '-24px', left: '0' },
    animationClass: 'anim-float-2',
    parallax: 60
  },
  {
    id: '03',
    title: 'Synthetic SOP',
    subtitle: 'AICC Creative Logic & Infrastructure',
    titleZh: '创意工作流SOP+工作流化',
    subtitleZh: '设计AI创意全流程与 SOP',
    path: '/project/03',
    image: '/sop.png', // Uploaded UI design screenshot
    pos: { top: '10%', left: '34%', width: '24vw', height: '14.5vw' },
    labelPos: { top: '-24px', left: '0' },
    animationClass: 'anim-float-3',
    parallax: 30
  },
  {
    id: '04',
    title: 'SOUL in the Machine',
    subtitle: 'Prompt Engineer // Skillful Agents',
    titleZh: '灵魂与代码',
    subtitleZh: '致敬《攻壳机动队》，把Prompt 包装成具有生命力的“soul”。',
    path: '/project/04',
    image: '/skill-doc.png',
    pos: { top: '35%', left: '38%', width: '12vw', height: '16vw' },
    labelPos: { top: '-24px', left: '0' },
    animationClass: 'anim-float-4',
    parallax: 50
  },
  {
    id: '05',
    title: 'Subculture Lab',
    subtitle: 'Interest-driven AI Experiments',
    titleZh: '做AI产品经理',
    subtitleZh: '我的AI驱动的泛兴趣实验室',
    path: '/project/05',
    image: '/lofi.jpg', // Used as fallback/initial image
    particleImageUrl: '/lofi.jpg', // Enables particle effect
    audioUrl: '/bgm.mp3', // Audio plays on hover
    pos: { top: '45%', left: '50%', width: '15vw', height: '22vw' },
    labelPos: { top: '-24px', left: '-30px' },
    animationClass: 'anim-float-2',
    parallax: 70
  },
  {
    id: '06',
    title: 'Meta Play&Maker',
    subtitle: 'Game Design & Low-Poly Aesthetics',
    titleZh: '2.5次元非典型HCI',
    subtitleZh: '无边界探索ING-游戏与低多边形艺术实验',
    path: '/project/06',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop', // Open book
    modelUrl: 'https://helenq-assets-1317600743.cos.ap-hongkong.myqcloud.com/portfolio-helenq0414/model.glb', // Use COS hosted 3D model to bypass Vercel size limits
    pos: { top: '15%', left: '55%', width: '20vw', height: '25vw' },
    labelPos: { top: '-24px', left: '0' },
    animationClass: 'anim-float-1',
    parallax: 45
  }
];

interface ProjectBlobProps {
  project: typeof projects[0];
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
}

const ProjectBlob = ({ project, hoveredId, setHoveredId, smoothX, smoothY }: ProjectBlobProps) => {
  const isHovered = hoveredId === project.id;
  const isOtherHovered = hoveredId !== null && hoveredId !== project.id;

  // Parallax effect: objects move slightly opposite to mouse movement to create depth
  const x = useTransform(smoothX, [-1, 1], [project.parallax, -project.parallax]);
  const y = useTransform(smoothY, [-1, 1], [project.parallax, -project.parallax]);

  // 3D Tilt effect on hover
  const rotateX = useTransform(smoothY, [-1, 1], isHovered ? [15, -15] : [0, 0]);
  const rotateY = useTransform(smoothX, [-1, 1], isHovered ? [-15, 15] : [0, 0]);

  return (
    <motion.div
      className="absolute pointer-events-auto"
      style={{
        ...project.pos,
        x,
        y,
        // 上下层设计：让 3D 模型默认处于底层（0），图片处于上层（10），悬停时无论哪个都调到最前（50）
        zIndex: isHovered ? 50 : ('modelUrl' in project ? 0 : 10),
        perspective: 1000,
      }}
    >
      <Link
        to={project.path}
        className="block w-full h-full relative hoverable group"
        onMouseEnter={() => setHoveredId(project.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        <span
          className="absolute font-normal text-sm whitespace-nowrap transition-all duration-300"
          style={{
            ...project.labelPos,
            color: isHovered ? '#00FF85' : 'white',
            opacity: isOtherHovered ? 0 : 1,
            zIndex: 60
          }}
        >
          {isHovered ? `{${project.id}} ${project.title}` : `{${project.id}}`}
        </span>

        {/* The continuous animation wrapper */}
        <motion.div
          className={`w-full h-full transition-transform duration-700 ease-out ${project.animationClass}`}
          style={{
            scale: isHovered ? 1.05 : 1,
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          {'videoUrl' in project && project.videoUrl ? (
            <video
              src={project.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-all duration-700 ease-out"
              style={{
                filter: isHovered ? 'blur(0px) drop-shadow(0px 20px 30px rgba(0,0,0,0.3))' : 'blur(30px)',
                opacity: isHovered ? 1 : (isOtherHovered ? 0.2 : 0.85),
                transform: isHovered ? 'translateZ(50px)' : 'translateZ(0px)',
              }}
            />
          ) : 'modelUrl' in project && project.modelUrl ? (
            <div className="absolute w-[250%] h-[250%] transition-all duration-700 ease-out pointer-events-none"
              style={{
                top: '-75%',
                left: '-75%',
                filter: isHovered ? 'blur(0px)' : 'blur(20px)',
                opacity: isHovered ? 1 : (isOtherHovered ? 0.2 : 0.75),
                transform: isHovered ? 'translateZ(50px)' : 'translateZ(0px)',
              }}>
              <ModelViewer url={project.modelUrl} />
            </div>
          ) : 'particleImageUrl' in project && project.particleImageUrl ? (
            <div className="absolute w-[250%] h-[250%] transition-all duration-700 ease-out pointer-events-none"
              style={{
                top: '-75%',
                left: '-75%',
                filter: isHovered ? 'blur(0px)' : 'blur(20px)',
                opacity: isHovered ? 1 : (isOtherHovered ? 0.2 : 0.85),
                transform: isHovered ? 'translateZ(50px)' : 'translateZ(0px)',
              }}>
              <ParticleImage url={project.particleImageUrl} isHovered={isHovered} />
            </div>
          ) : (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-contain transition-all duration-700 ease-out"
              style={{
                filter: isHovered ? 'blur(0px) drop-shadow(0px 20px 30px rgba(0,0,0,0.3))' : 'blur(30px)',
                opacity: isHovered ? 1 : (isOtherHovered ? 0.2 : 0.85),
                // Multiply blend mode hides white backgrounds, making them look like isolated 3D objects
                // For PNG files, we use normal blend mode to preserve transparency and colors
                mixBlendMode: project.image.endsWith('.png') ? 'normal' : 'multiply',
                transform: isHovered ? 'translateZ(50px)' : 'translateZ(0px)',
              }}
              referrerPolicy="no-referrer"
            />
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default function Home() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(() => {
    try {
      return localStorage.getItem('site_unlocked') === 'true';
    } catch (e) {
      console.warn('Unable to access localStorage:', e);
      return false;
    }
  });
  const [hasInteracted, setHasInteracted] = useState(() => {
    try {
      return sessionStorage.getItem('audioUnlocked') === 'true';
    } catch (e) {
      console.warn('Unable to access sessionStorage:', e);
      return false;
    }
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle audio playback based on hover
  useEffect(() => {
    if (hoveredId === '05' && audioRef.current && hasInteracted) {
      // Attempt to play on hover
      audioRef.current.play().catch(e => console.log('Audio auto-play prevented:', e));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [hoveredId, hasInteracted]); // Re-run if interaction state changes

  const handleGlobalInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      try {
        sessionStorage.setItem('audioUnlocked', 'true');
      } catch (e) {
        console.warn('Unable to write to sessionStorage:', e);
      }
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          if (hoveredId !== '05') {
            audioRef.current?.pause();
          }
        }).catch(() => { });
      }
    } else {
      // Toggle sound off/on if they click the button later
      if (audioRef.current) {
        if (audioRef.current.volume > 0) {
          audioRef.current.volume = 0;
        } else {
          audioRef.current.volume = 1;
        }
      }
    }
  };

  // Mouse tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse movement
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 100 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position between -1 and 1
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      <AnimatePresence>
        {!isUnlocked && (
          <PasswordScreen 
            onUnlock={() => {
              try {
                localStorage.setItem('site_unlocked', 'true');
              } catch (e) {
                console.warn('Unable to write to localStorage:', e);
              }
              setIsUnlocked(true);
            }} 
          />
        )}
      </AnimatePresence>
      
      {isUnlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-screen w-screen overflow-hidden relative font-sans font-light"
        >
          {/* LEFT COLUMN */}
          <div className="absolute top-8 left-8 flex gap-4 z-50">
            <span className="font-normal text-sm whitespace-nowrap">齐婕 HELEN.Q</span>
            <p className="text-sm leading-tight pointer-events-none">
              I plan, I create, I think.<br />
              Based in Beijing.<br />
              This is my Portfolio.
            </p>
          </div>

          <div className="absolute left-8 bottom-8 flex flex-col gap-4 text-xs leading-tight z-50 whitespace-nowrap font-normal">
            {/* Audio Toggle Button - Serves as explicit interaction */}
            <button
              onClick={handleGlobalInteraction}
              className={`text-xs text-left w-fit border px-2 py-1 rounded transition-colors ${hasInteracted ? 'border-[#00FF85] text-[#00FF85]' : 'border-white/30 text-white/50 hover:border-white hover:text-white'}`}
              style={{ zIndex: 9999, pointerEvents: 'auto' }}
            >
              {hasInteracted ? 'SOUND ON' : 'CLICK TO ENABLE SOUND'}
            </button>
            <p className="uppercase">
              ROLE: CD / NARRATIVE DESIGN / AI PRACTITIONER<br />
              TYPE: INTJ ARCHITECT<br />
              FUTURE: Independent Contributors & Coaches
            </p>
          </div>

          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20">
            <h1
              className="text-[7vw] leading-none font-display font-light tracking-wider uppercase"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              HELEN.Q
            </h1>
          </div>

          {/* RIGHT COLUMN */}
          <div className="absolute top-8 right-12 flex gap-12 font-normal text-sm z-20">
            <Link to="/playground" className="hover:text-[#00FF85] transition-colors hoverable">Playground</Link>
            <Link to="/about" className="hover:text-[#00FF85] transition-colors hoverable">About</Link>
          </div>

          <div className="absolute top-1/2 right-12 -translate-y-1/2 w-64 flex flex-col z-20">
            <div className="w-full h-px bg-current opacity-20 mb-8"></div>
            {projects.map((project) => (
              <Link
                key={project.id}
                to={project.path}
                className={`block mb-6 transition-all duration-300 hoverable ${hoveredId === project.id ? 'text-[#00FF85] opacity-100' : 'text-white opacity-50'
                  }`}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="flex justify-between items-baseline">
                  <span className={`transition-all duration-300 ${hoveredId === project.id
                    ? 'font-jinshu text-[15px] tracking-wider'
                    : 'text-sm font-normal'
                    }`}>
                    {hoveredId === project.id ? project.titleZh : project.title}
                  </span>
                  <span className="text-xs font-normal">{`{${project.id}}`}</span>
                </div>
                <div className={`transition-all duration-300 mt-1.5 leading-relaxed ${hoveredId === project.id
                  ? 'text-[11px] font-normal tracking-wide opacity-90'
                  : 'text-xs mt-1'
                  }`}>
                  {hoveredId === project.id ? project.subtitleZh : project.subtitle}
                </div>
              </Link>
            ))}
          </div>

          <div className="absolute bottom-8 right-12 text-sm z-20">
            <p className="mb-1 font-normal">Talk to me..</p>
            <div className="flex gap-2 font-normal uppercase">
              <a href="#" onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }} className="underline hover:text-[#00FF85] transition-colors hoverable cursor-pointer">EMAIL /</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }} className="underline hover:text-[#00FF85] transition-colors hoverable cursor-pointer">RED /</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }} className="underline hover:text-[#00FF85] transition-colors hoverable cursor-pointer">WECHAT /</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }} className="underline hover:text-[#00FF85] transition-colors hoverable cursor-pointer">PHONE</a>
            </div>
          </div>

          {/* CENTER CANVAS (IMAGES WITH PARALLAX AND 3D ANIMATIONS) */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {projects.map((project) => (
              <ProjectBlob
                key={project.id}
                project={project}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                smoothX={smoothX}
                smoothY={smoothY}
              />
            ))}
          </div>

          <audio ref={audioRef} src="/bgm.mp3" loop preload="auto" />
          <ContactPopup isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </motion.div>
      )}
    </>
  );
}
