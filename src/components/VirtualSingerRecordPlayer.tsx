import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Data for the 5 songs
const songs = [
  { id: 1, title: 'Как же хорошо, когда есть деньги', titleZh: '有钱真好', file: '/alyona/song1.mp3', cover: '/alyona/cover1.png' },
  { id: 2, title: 'Я просто люблю деньги', titleZh: '我只是喜欢钱', file: '/alyona/song2.mp3', cover: '/alyona/cover2.png' },
  { id: 3, title: 'Почему деньги труднее любви?', titleZh: '为什么金钱比爱情更难追寻？', file: '/alyona/song3.mp3', cover: '/alyona/cover3.png' },
  { id: 4, title: 'За стеклом', titleZh: '在橱窗之外', file: '/alyona/song4.mp3', cover: '/alyona/cover4.png' },
  { id: 5, title: 'ДУЛО', titleZh: '枪口', file: '/alyona/song5.mp3', cover: '/alyona/cover5.png' },
];

export default function VirtualSingerRecordPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = songs[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio play error:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % songs.length);
    setIsPlaying(true);
  };

  const handleAudioEnded = () => nextTrack();

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-16 pb-24 items-center">
      
      {/* --- RECORD PLAYER SECTION --- */}
      <div className="relative w-full max-w-[600px] aspect-[4/5] bg-[#2C3032] rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden flex flex-col mt-12">
        
        {/* Top Section (Record & Tonearm) */}
        <div className="flex-grow relative flex">
          {/* Top-left small detail mark */}
          <div className="absolute top-6 left-6 w-8 h-1 bg-[#1A1C1D] rounded-full"></div>

          {/* The Record Platter */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-[80%] aspect-square flex items-center justify-center z-10">
            {/* Base Platter shadow */}
            <div className="absolute inset-0 rounded-full bg-[#1A1C1D] translate-y-1 translate-x-1 blur-[2px]"></div>
            
            {/* The Record itself (Light Grey/Silver) */}
            <motion.div 
              className="relative w-full h-full rounded-full bg-[#D4D6D5] border-[2px] border-[#E8EAE9] flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] overflow-hidden"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            >
              {/* Record grooves detail */}
              <div className="absolute inset-4 rounded-full border border-black/5"></div>
              <div className="absolute inset-8 rounded-full border border-black/5"></div>
              <div className="absolute inset-12 rounded-full border border-black/5"></div>
              <div className="absolute inset-16 rounded-full border border-black/5"></div>
              
              {/* Center Label (Album Cover) */}
              <div className="relative w-[30%] aspect-square rounded-full border border-black/20 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentTrackIndex}
                    src={currentSong.cover} 
                    alt="Center Label" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover object-top"
                  />
                </AnimatePresence>
                {/* Center Spindle Hole */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#1A1C1D] rounded-full border border-white/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"></div>
              </div>
            </motion.div>
          </div>

          {/* Tonearm Assembly */}
          <div className="absolute right-8 top-12 bottom-0 w-32 z-20 flex flex-col items-center">
            {/* Base */}
            <div className="w-16 h-20 bg-[#D4D6D5] shadow-[0_4px_10px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center border border-white/40">
              {/* Pivot Cylinder */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E8EAE9] to-[#A0A2A1] shadow-[inset_0_2px_5px_rgba(255,255,255,0.8),0_4px_6px_rgba(0,0,0,0.3)] flex items-center justify-center border border-black/10">
                <div className="w-6 h-6 rounded-full bg-[#1A1C1D] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"></div>
              </div>
              {/* Counterweight */}
              <div className="absolute top-[-10px] w-14 h-6 bg-gradient-to-b from-[#A0A2A1] to-[#606261] rounded-sm shadow-[0_4px_6px_rgba(0,0,0,0.3)] border border-white/20"></div>
            </div>

            {/* Arm & Headshell */}
            <motion.div 
              className="absolute top-16 left-1/2 origin-top flex flex-col items-center pointer-events-none"
              initial={{ rotate: 0 }}
              animate={{ rotate: isPlaying ? 22 : 0 }}
              transition={{ type: "spring", stiffness: 40, damping: 15 }}
            >
              {/* Arm Tube */}
              <div className="w-2.5 h-[280px] bg-gradient-to-r from-[#D4D6D5] via-[#FFFFFF] to-[#A0A2A1] shadow-[2px_0_4px_rgba(0,0,0,0.2)] -ml-1"></div>
              {/* Headshell */}
              <div className="w-6 h-12 bg-[#D4D6D5] -ml-1 mt-[-2px] border border-white/50 shadow-[2px_2px_4px_rgba(0,0,0,0.3)] rounded-sm flex items-end p-1">
                <div className="w-full h-1 bg-[#1A1C1D]"></div>
              </div>
            </motion.div>
          </div>
          
          {/* Subtle text details on base */}
          <div className="absolute bottom-4 left-6 flex items-center gap-2 opacity-50">
            <div className="w-20 h-px bg-white/40"></div>
            <span className="text-[8px] tracking-[0.2em] font-mono text-white">ALYONA-01</span>
          </div>
        </div>

        {/* Bottom Section (Controls Panel) */}
        <div className="h-[25%] bg-[#252829] border-t border-[#1A1C1D] flex">
          {/* Left info area */}
          <div className="flex-grow p-6 flex flex-col justify-center border-r border-[#1A1C1D]">
            <div className="w-4 h-6 bg-white/80 mb-4 border border-black/20"></div>
            <div className="text-[8px] leading-relaxed tracking-widest font-mono text-white/40 uppercase">
              <p>ALYONA / Алёна</p>
              <p>SOVIET VAPORWAVE EXPERIMENT</p>
              <p>TRACK: {currentTrackIndex + 1} / 5</p>
            </div>
          </div>
          
          {/* Right Control area */}
          <div className="w-48 flex flex-col p-6 items-center justify-between">
            {/* Fake Sliders Graphic */}
            <div className="flex gap-8 opacity-40">
              <div className="w-1 h-12 bg-black rounded-full relative">
                <div className="absolute top-2 -left-2 w-5 h-1 bg-white"></div>
              </div>
              <div className="w-1 h-12 bg-black rounded-full relative">
                <div className="absolute top-6 -left-2 w-5 h-1 bg-white"></div>
              </div>
            </div>

            {/* Red Buttons */}
            <div className="flex gap-4 w-full justify-center">
              {/* Play/Pause Button */}
              <button 
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-[#E53935] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_4px_6px_rgba(0,0,0,0.5)] border border-[#C62828] flex items-center justify-center hover:bg-[#F44336] active:scale-95 transition-all"
              >
              </button>
              {/* Next Button */}
              <button 
                onClick={nextTrack}
                className="w-10 h-10 rounded-full bg-[#E53935] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_4px_6px_rgba(0,0,0,0.5)] border border-[#C62828] flex items-center justify-center hover:bg-[#F44336] active:scale-95 transition-all relative overflow-hidden"
              >
                {/* Visual marker to differentiate */}
                <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-black/20"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Hidden Audio Element */}
        <audio 
          ref={audioRef} 
          src={currentSong.file} 
          onEnded={handleAudioEnded}
          className="hidden"
        />
      </div>


      {/* --- CHARACTER ARCHIVE SECTION --- */}
      <div className="w-full max-w-2xl text-left flex flex-col gap-12 mt-8 px-6 font-serif">
        
        {/* Header */}
        <div className="border-b border-white/20 pb-8">
          <h1 className="text-4xl font-normal tracking-wide text-white mb-2">ALYONA</h1>
          <h2 className="text-xl font-normal text-white/50">Алёна</h2>
          <div className="mt-6 flex gap-4 text-xs font-mono text-white/40 tracking-widest uppercase">
            <span>[ 1998年·失真磁带特别版 ]</span>
          </div>
        </div>

        {/* Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-mono text-[#00FF85] uppercase tracking-widest mb-4 border-l-2 border-[#00FF85] pl-3">Artist Profile</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><span className="text-white/40 inline-block w-20">DOB</span> 1973 (Fictional)</li>
              <li><span className="text-white/40 inline-block w-20">Origin</span> Nizhny Novgorod, Russia</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-mono text-[#00FF85] uppercase tracking-widest mb-4 border-l-2 border-[#00FF85] pl-3">Style / Genre</h3>
            <ul className="space-y-1 text-sm text-white/70">
              <li>Soviet Vaporwave</li>
              <li>Post-Soviet Disco</li>
              <li>Industrial Dream Pop</li>
            </ul>
          </div>
        </div>

        {/* Elements */}
        <div>
          <h3 className="text-sm font-mono text-[#00FF85] uppercase tracking-widest mb-4 border-l-2 border-[#00FF85] pl-3">Signature Elements</h3>
          <div className="flex flex-wrap gap-3">
            {['红色长辫', '雀斑', '白皙皮肤', '黑色旧皮衣', '失真口红', '廉价香烟', '夜间高速公路', '90年代莫斯科霓虹'].map((tag, idx) => (
              <span key={idx} className="px-3 py-1 border border-white/10 rounded-sm text-xs text-white/60 bg-white/[0.02]">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Narrative */}
        <div className="prose prose-invert prose-p:text-white/70 prose-p:leading-relaxed max-w-none border-t border-white/10 pt-12">
          <h3 className="text-sm font-mono text-white/40 uppercase tracking-widest mb-6">/ Background Narrative /</h3>
          
          <p className="text-xl font-normal text-white mb-6">ALYONA 并不是“成功者”。</p>
          <p>她像是 90 年代俄罗斯资本主义浪潮中的旁观者。她经历过苏联解体后的经济崩塌，母亲在市场倒卖商品，深夜录像厅里的 VHS 盗版磁带，以及黑帮与奢侈消费同时出现的城市。“自由”在那时突然变成了金钱的价格标签。</p>
          
          <blockquote className="border-l-4 border-white/20 pl-6 my-8 italic text-white/60">
            “她渴望财富，但又意识到财富正在吞噬人与人之间的关系。”
          </blockquote>
          
          <p>因此她的音乐始终游离于<span className="text-white">浪漫、怀旧、贫穷、欲望、反讽与女性主体意识</span>之间。</p>
        </div>

        {/* Album Concept */}
        <div className="prose prose-invert prose-p:text-white/70 prose-p:leading-relaxed max-w-none border-t border-white/10 pt-12">
          <h3 className="text-sm font-mono text-white/40 uppercase tracking-widest mb-6">/ Album Concept: 《ДУЛО / 枪口》 /</h3>
          
          <p>这不是一张关于“爱情”的专辑，而是一张关于<strong className="text-white font-normal mx-1">“一个女人如何在资本主义霓虹中寻找主体性”</strong>的专辑。</p>
          
          <p>专辑中的“枪口”，既是暴力、欲望、男性的凝视、金钱的诱惑与权力的指向，也是消费主义时代里，每个人彼此瞄准的目光。</p>
        </div>

        {/* Tracklist & Final Theme */}
        <div className="border-t border-white/10 pt-12">
          <h3 className="text-sm font-mono text-white/40 uppercase tracking-widest mb-8">/ Tracklist /</h3>
          
          <div className="space-y-8">
            {songs.map((song, idx) => (
              <div key={idx} className={`group flex flex-col border-b border-white/5 pb-8 ${currentTrackIndex === idx ? 'opacity-100' : 'opacity-50 hover:opacity-100 transition-opacity'}`}>
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-xs font-mono text-white/30">0{idx + 1}</span>
                  <h4 className="text-lg text-white font-normal">{song.title}</h4>
                </div>
                <div className="pl-8">
                  <p className="text-sm text-white/60 mb-2">《{song.titleZh}》</p>
                  <p className="text-sm text-white/40">
                    {idx === 0 && "一首关于贫穷记忆的怀旧情歌。"}
                    {idx === 1 && "高速公路上的霓虹舞曲。"}
                    {idx === 2 && "枪声、无线电与夜店中的阶级凝视。"}
                    {idx === 3 && "工业摇滚蒸汽波。关于“永远晚一步”的人生。"}
                    {idx === 4 && "关于占有、欲望、爱情、金钱、男性凝视与女性主体意识的一次最终质问。"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Conclusion */}
        <div className="pt-8 pb-12 flex flex-col items-center justify-center text-center">
          <p className="text-white/50 italic mb-6">ALYONA 最终发现：</p>
          <p className="text-white/70 mb-8 leading-loose">
            男人追逐女人，就像资本追逐金钱。<br/>
            而她真正想追求的，并不是爱情，也不是财富。
          </p>
          <h2 className="text-3xl font-normal text-white tracking-[0.5em] ml-4">自由</h2>
        </div>

      </div>
    </div>
  );
}
