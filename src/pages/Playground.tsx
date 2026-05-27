import { useState } from 'react';
import { Link } from 'react-router-dom';
import ContactPopup from '../components/ContactPopup';

export default function Playground() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden relative font-sans font-light bg-[#f6f5ef] text-[#161616]">
      
      {/* FIXED UI */}
      <div className="absolute top-8 left-8 flex gap-4 z-50 pointer-events-none">
        <Link to="/" className="font-normal text-sm whitespace-nowrap pointer-events-auto hover:text-[#60a900] transition-colors hoverable">齐婕 Helen.Q</Link>
      </div>

      <div className="absolute top-8 right-12 flex gap-12 font-normal text-sm z-50">
        <Link to="/playground" className="hover:text-[#60a900] transition-colors hoverable font-bold">Playground</Link>
        <Link to="/about" className="hover:text-[#60a900] transition-colors hoverable">About</Link>
      </div>

      <div className="absolute bottom-8 right-12 text-sm z-50 text-right">
        <p className="mb-1 font-normal opacity-80">Talk to me..</p>
        <div className="flex gap-2 font-normal uppercase justify-end">
          <a href="#" onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }} className="underline hover:text-[#60a900] transition-colors hoverable cursor-pointer">EMAIL /</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }} className="underline hover:text-[#60a900] transition-colors hoverable cursor-pointer">RED /</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }} className="underline hover:text-[#60a900] transition-colors hoverable cursor-pointer">WECHAT /</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsContactOpen(true); }} className="underline hover:text-[#60a900] transition-colors hoverable cursor-pointer">PHONE</a>
        </div>
      </div>

      {/* Podcast Recorder Iframe */}
      <iframe 
        src="/podcast/index.html" 
        className="absolute inset-0 w-full h-full border-none z-10"
        title="Podcast Recorder"
        allow="autoplay"
      />

      <ContactPopup isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
