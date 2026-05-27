import { useState } from 'react';
import { Link } from 'react-router-dom';
import ContactPopup from './ContactPopup';

export default function Navbar() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-start z-40 text-white">
        <Link to="/" className="text-lg md:text-xl font-medium tracking-tight hoverable font-sans">
          齐婕 Helen.Q
        </Link>
        
        <div className="flex flex-col items-end space-y-1 text-sm font-medium">
          <Link to="/playground" className="hover:opacity-50 transition-opacity">Playground</Link>
          <Link to="/about" className="hover:opacity-50 transition-opacity">About</Link>
          <button onClick={() => setIsContactOpen(true)} className="hover:opacity-50 transition-opacity mt-4 cursor-none">EMAIL /</button>
          <button onClick={() => setIsContactOpen(true)} className="hover:opacity-50 transition-opacity cursor-none">RED /</button>
          <button onClick={() => setIsContactOpen(true)} className="hover:opacity-50 transition-opacity cursor-none">WECHAT /</button>
          <button onClick={() => setIsContactOpen(true)} className="hover:opacity-50 transition-opacity cursor-none">PHONE /</button>
        </div>
      </nav>
      
      <ContactPopup isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}
