export default function Marquee() {
  const text = "Time: + Place: + Time: + Place: + Time: + Place: + Time: + Place: + Time: + Place: + ";
  
  return (
    <div className="fixed bottom-0 left-0 w-full overflow-hidden bg-[#4A3AFF] text-white py-2 z-40 border-t border-white/20">
      <div className="flex whitespace-nowrap animate-marquee font-mono text-xs tracking-widest uppercase">
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}
