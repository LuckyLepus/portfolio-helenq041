import { useState, useRef, useEffect } from 'react';
import { FaceTrackingProvider, useFaceTracking } from './components/FaceTrackerProvider';
import { BackroomsScene } from './components/BackroomsScene';
import { Video, AlertCircle } from 'lucide-react';

const TrackingOverlay = () => {
  const { isTracking, headMovement, handPush, error, videoRef } = useFaceTracking();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      // Format roughly like MAR. 14 1996\nPM 03:41:22
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const month = months[d.getMonth()];
      const day = String(d.getDate()).padStart(2, '0');
      
      let p = 'AM';
      let hours = d.getHours();
      if (hours >= 12) { p = 'PM'; if (hours > 12) hours -= 12; }
      if (hours === 0) hours = 12;
      const hStr = String(hours).padStart(2, '0');
      const mStr = String(d.getMinutes()).padStart(2, '0');
      const sStr = String(d.getSeconds()).padStart(2, '0');

      setTimeStr(`${month}. ${day} 1996\n${p} ${hStr}:${mStr}:${sStr}`);
    };
    updateTime();
    const intv = setInterval(updateTime, 1000);
    return () => clearInterval(intv);
  }, []);

  return (
    <>
      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto">
          <div className="border border-red-500/50 bg-red-950/40 p-8 max-w-lg text-center flex flex-col gap-4 shadow-[0_0_50px_rgba(255,0,0,0.1)]">
            <div className="text-red-500 text-2xl font-bold tracking-widest animate-pulse">SYS_ERR: PERMISSION_DENIED</div>
            <p className="text-[#e0e0e0]/80 text-sm leading-relaxed font-mono">
              The observation window requires camera access to calculate off-axis parallax depth.<br/><br/>
              Please click the <strong className="text-white">Camera Icon</strong> in your browser's address bar to Allow access, then <strong>Refresh the entire page (F5)</strong>.
            </p>
            <div className="text-xs text-red-500/50 uppercase mt-4">RAW_ERROR: {error}</div>
          </div>
        </div>
      )}
      
      {/* HUD / OSD Overlay */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none z-30 font-mono text-[#e0e0e0]">
        
        {/* Top Bar */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
              <span className="text-xl tracking-widest text-red-500 font-bold">
                {isTracking ? 'REC' : 'WAIT'}
              </span>
            </div>
            <div className="text-sm opacity-70 mt-1 uppercase">
              {error ? `ERR: ${error}` : 'Channel 04 // LIMINAL_VOID'}
            </div>
          </div>
          <div className="text-right text-xl tracking-tighter whitespace-pre-wrap leading-tight">
            {timeStr}
          </div>
        </div>

        {/* Center Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
          <div className="w-10 h-px bg-white"></div>
          <div className="h-10 w-px bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Bottom Tracking Data */}
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <div className="text-[10px] text-[#c2ae6a] opacity-50 uppercase tracking-widest">Face_Tracking_Meta</div>
            <div className="grid grid-cols-2 gap-x-4 text-xs font-mono">
              <span className="opacity-60">COORD_X:</span> 
              <span>{isTracking ? (headMovement.x > 0 ? '+' : '') + headMovement.x.toFixed(4) : '---'}</span>
              
              <span className="opacity-60">COORD_Y:</span> 
              <span>{isTracking ? (headMovement.y > 0 ? '+' : '') + headMovement.y.toFixed(4) : '---'}</span>
              
              <span className="opacity-60">DEPTH_Z:</span> 
              <span>{isTracking ? headMovement.z.toFixed(4) : '---'}</span>
              
              <span className="opacity-60">PARALLAX:</span> 
              <span className={isTracking ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                {isTracking ? 'LOCKED' : 'NO_SIGNAL'}
              </span>

              <span className="opacity-60 text-blue-400/80">HAND_PUSH:</span> 
              <span className="text-blue-400">
                {isTracking ? `${(handPush * 100).toFixed(0)}%` : '---'}
              </span>
            </div>
          </div>
          
          <div className="w-48 h-12 bg-white/5 border border-white/10 p-2 flex items-end gap-1 overflow-hidden opacity-50">
            <div className="bg-green-500/50 w-full animate-pulse" style={{ height: '40%', animationDuration: '0.7s' }}></div>
            <div className="bg-green-500/50 w-full animate-pulse" style={{ height: '75%', animationDuration: '0.4s' }}></div>
            <div className="bg-green-500/50 w-full animate-pulse" style={{ height: '30%', animationDuration: '0.6s' }}></div>
            <div className="bg-green-500/50 w-full animate-pulse" style={{ height: '90%', animationDuration: '0.5s', animationDirection: 'reverse' }}></div>
            <div className="bg-green-500/50 w-full animate-pulse" style={{ height: '55%', animationDuration: '0.8s' }}></div>
            <div className="bg-green-500/50 w-full animate-pulse" style={{ height: '20%', animationDuration: '0.6s', animationDirection: 'reverse' }}></div>
            <div className="bg-green-500/50 w-full animate-pulse" style={{ height: '60%', animationDuration: '0.7s' }}></div>
          </div>
        </div>
      </div>
      
      {/* Glitch Artifacts purely CSS */}
      <div className="absolute top-1/3 left-0 w-full h-px bg-white/20 opacity-40 z-30 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-24 h-4 bg-blue-500/10 mix-blend-screen blur-[2px] z-30 pointer-events-none animate-pulse"></div>

      {/* Hidden video element for tracking */}
      <video
        ref={videoRef}
        className="fixed top-0 left-0 w-[160px] h-[120px] opacity-0 pointer-events-none"
        autoPlay
        playsInline
        muted
      />
    </>
  );
};

export default function App() {
  const [started, setStarted] = useState(false);
  
  // Create a 3D buzzing audio
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const startExperience = () => {
    // Init Audio Context on user interaction (required by browsers)
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const panner = ctx.createStereoPanner();

      osc.type = 'sawtooth';
      osc.frequency.value = 60; // 60Hz mains hum
      
      gain.gain.value = 0.05; // very quiet

      osc.connect(panner);
      panner.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      
      oscillatorRef.current = osc;
      pannerRef.current = panner;
      gainNodeRef.current = gain;
      
    } catch (e) {
      console.warn("Audio Context failed to start", e);
    }

    setStarted(true);
  };
  
  // Optional: Link panner to head movement via effect if we had access to the context here
  // But we wrapped it. Let's just keep the static hum for now, or update it later.

  if (!started) {
    return (
      <div className="flex h-screen w-screen bg-[#0a0a0a] text-[#c2ae6a]/70 font-mono items-center justify-center relative overflow-hidden">
        {/* Fake CRT scanlines over the whole screen */}
        <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjIiIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg==')] bg-repeat"></div>
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,1)] pointer-events-none"></div>
        
        <div className="flex flex-col items-center justify-center p-8 max-w-md w-full bg-[#1a1a1a] border border-[#333] z-10 text-center gap-6 shadow-[0_0_50px_rgba(0,0,0,1)]">
          <AlertCircle className="w-12 h-12 text-[#c2ae6a] mb-2 animate-pulse" />
          
          <h1 className="text-2xl tracking-[0.2em] uppercase font-bold text-[#e0e0e0] drop-shadow-[0_0_10px_rgba(194,174,106,0.5)]">
            Level 1<br/>Observation
          </h1>
          
          <div className="text-sm text-[#c2ae6a]/70 border-y border-[#333] py-4 leading-relaxed text-left flex flex-col gap-4">
            <p>
              This terminal connects to an off-axis viewing portal. <br/>
              Allow webcam permissions to begin observation.
            </p>
            <div className="bg-[#c2ae6a]/10 p-3 border-l-2 border-[#c2ae6a]/50">
              <strong className="text-[#e0e0e0]">1. HEAD TRACKING (PARALLAX):</strong> <br/>
              Move your head left/right/up/down to shift your perspective and peek around the corridor walls.
            </div>
            <div className="bg-[#c2ae6a]/10 p-3 border-l-2 border-[#c2ae6a]/50">
              <strong className="text-[#e0e0e0]">2. HAND TRACKING (MOVEMENT):</strong> <br/>
              Open your hand to the camera and push forward to advance deeper into the void. Keep your hand visible.
            </div>
          </div>

          <button 
            onClick={startExperience}
            className="group relative flex items-center gap-3 px-8 py-3 bg-[#c2ae6a]/10 border border-[#c2ae6a]/30 hover:bg-[#c2ae6a]/20 hover:text-[#e0e0e0] hover:border-[#c2ae6a]/80 uppercase tracking-widest text-sm transition-all duration-300"
          >
            <Video className="w-4 h-4 opacity-70 group-hover:opacity-100" />
            Initialize Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-[#0a0a0a] overflow-hidden flex items-center justify-center font-mono text-[#e0e0e0] relative select-none">
      {/* VHS Overlay Pattern */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03]" style={{ background: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)' }}></div>

      {/* Main Observation Portal */}
      <div className="relative w-full max-w-[1024px] aspect-[4/3] max-h-[85vh] border-4 border-[#333] shadow-[0_0_50px_rgba(0,0,0,1)] bg-[#1a1a1a] overflow-hidden m-4">
        <FaceTrackingProvider>
          <TrackingOverlay />
          <div className="w-full h-full relative z-10">
            <BackroomsScene />
          </div>
        </FaceTrackingProvider>
      </div>

      {/* Outer Shell UI */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-zinc-600 tracking-[1em] uppercase pointer-events-none z-0 hidden md:block">
        Observation Window System // V.0.4.2-STABLE
      </div>

      <div className="absolute bottom-4 right-8 flex gap-4 text-[9px] text-zinc-500 pointer-events-none z-0 hidden md:flex">
        <div className="px-2 py-1 border border-zinc-800">MEDIPIPE_ENGINE_ON</div>
        <div className="px-2 py-1 border border-zinc-800">VHS_EMULATION_ACTIVE</div>
        <div className="px-2 py-1 bg-zinc-800 text-zinc-300">SYSTEM_CRITICAL_DEPTH</div>
      </div>

      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex-col gap-8 opacity-20 pointer-events-none z-0 hidden xl:flex">
        <div className="w-1 h-32 bg-zinc-700 relative">
          <div className="absolute top-1/4 left-[-4px] w-3 h-3 rounded-full bg-white"></div>
        </div>
        <span className="-rotate-90 text-[10px] origin-center -translate-y-[120%] -translate-x-3 w-10">ZOOM_OPTIC</span>
      </div>
    </div>
  );
}
