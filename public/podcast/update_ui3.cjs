const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// We will replace the previous <style> and <script> injected blocks to update them.
// Find the previous style block injected by update_ui2.cjs and remove it.
const styleStartStr = '/* Minimalist Industrial Design Tweaks */';
const scriptStartStr = 'function playClickSound(type =';

if (html.includes(styleStartStr)) {
  const styleStart = html.lastIndexOf('<style>', html.indexOf(styleStartStr));
  const styleEnd = html.indexOf('</style>', styleStart) + 8;
  html = html.substring(0, styleStart) + html.substring(styleEnd);
}

if (html.includes(scriptStartStr)) {
  const scriptStart = html.lastIndexOf('<script>', html.indexOf(scriptStartStr));
  const scriptEnd = html.indexOf('</script>', scriptStart) + 9;
  html = html.substring(0, scriptStart) + html.substring(scriptEnd);
}

// Inject new CSS and JS
const designCss = `
<style>
  /* Minimalist Industrial Design Tweaks */
  
  /* Rectangular Mic Array */
  .mic-port {
    width: 100px !important;
    height: 220px !important;
    border-radius: 12px !important;
    mask-image: none !important;
    background: radial-gradient(circle, rgba(18,18,18,.6) 2px, transparent 2.5px), linear-gradient(135deg, #f6f6f6, #e0e0e0) !important;
    background-size: 12px 12px, auto !important;
    box-shadow: inset 0 2px 5px rgba(255,255,255,0.8), inset 0 -3px 8px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.05) !important;
    border: 1px solid rgba(0,0,0,0.08) !important;
  }
  
  /* Minimalist Buttons */
  .mechanical-button {
    border-radius: 6px !important;
    background: linear-gradient(180deg, #ffffff 0%, #e6e6e6 100%) !important;
    box-shadow: 
      inset 0 1px 1px rgba(255,255,255,1), 
      inset 0 -1px 2px rgba(0,0,0,0.05), 
      0 5px 8px rgba(0,0,0,0.1),
      0 1px 2px rgba(0,0,0,0.15) !important;
    border: 1px solid rgba(0,0,0,0.12) !important;
    color: #666 !important;
    transition: all 0.1s ease !important;
  }
  
  .mechanical-button:active, .mechanical-button.is-active {
    background: linear-gradient(180deg, #e0e0e0 0%, #f4f4f4 100%) !important;
    box-shadow: 
      inset 0 2px 4px rgba(0,0,0,0.15), 
      inset 0 4px 8px rgba(0,0,0,0.05),
      0 1px 1px rgba(255,255,255,0.8) !important;
    transform: translateY(3px) !important;
    color: #333 !important;
  }
  
  .mechanical-button.is-active {
    color: #60a900 !important;
  }

  /* Slider Knob - Apple Style Round Knob */
  .slider-knob {
    border-radius: 50% !important;
    background: linear-gradient(180deg, #ffffff 0%, #e6e6e6 100%) !important;
    box-shadow: 
      0 4px 8px rgba(0,0,0,0.2),
      0 1px 2px rgba(0,0,0,0.1),
      inset 0 1px 2px rgba(255,255,255,1),
      inset 0 -1px 1px rgba(0,0,0,0.05) !important;
    border: 1px solid rgba(0,0,0,0.15) !important;
    width: 36px !important;
    height: 36px !important;
    position: absolute !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    
    /* ADD DAMPING FEEL VISUALLY */
    transition: top 0.12s cubic-bezier(0.2, 0, 0.2, 1), box-shadow 0.1s ease !important;
  }
  
  /* Orange dot in the center */
  .slider-knob::after {
    content: '' !important;
    position: absolute !important;
    top: 25% !important;
    left: 50% !important;
    width: 6px !important;
    height: 6px !important;
    background: #ff5722 !important;
    border-radius: 50% !important;
    transform: translate(-50%, -50%) !important;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.8) !important;
  }
  
  .slider-control.is-dragging .slider-knob {
    box-shadow: 
      0 2px 4px rgba(0,0,0,0.2),
      inset 0 1px 2px rgba(255,255,255,1) !important;
    /* Reduce transition delay when actively dragging so it doesn't detach too much */
    transition: top 0.05s linear, box-shadow 0.1s ease !important;
  }

  /* Slider Track adjustment */
  .slider-rail {
    background: #d4d4d4 !important;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.8) !important;
    width: 8px !important;
    left: calc(50% - 4px) !important;
    border-radius: 4px !important;
  }
</style>
`;

html = html.replace('</head>', designCss + '</head>');

// Add Interaction Sounds via Web Audio API
const interactionScript = `
<script>
  (function() {
    let audioCtx = null;
    
    function initAudio() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    }
    
    function playClickSound(type = 'button') {
      initAudio();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      if (type === 'button') {
        // Chunky mechanical switch sound
        osc.type = 'square';
        osc.frequency.setValueAtTime(120, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.06);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.06);
      } else if (type === 'slider') {
        // Clicking gear damping sound - make it more metallic
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(500, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.03);
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.03);
      }
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.06);
    }

    // Attach to buttons via mousedown
    document.addEventListener('mousedown', (e) => {
      initAudio(); // ensure unlocked
      if (e.target.closest('.mechanical-button')) {
        playClickSound('button');
      }
    }, { capture: true });
    
    // Attach to slider
    let lastSliderSoundTime = 0;
    // Track last Y to only play sound when actually moving
    let lastY = 0;
    
    document.addEventListener('mousemove', (e) => {
      if (e.buttons === 1 && e.target.closest('.slider-track-wrap')) {
        const now = Date.now();
        // Only trigger if moved significantly to simulate discrete gear steps
        if (now - lastSliderSoundTime > 50 && Math.abs(e.clientY - lastY) > 2) {
          playClickSound('slider');
          lastSliderSoundTime = now;
          lastY = e.clientY;
        }
      }
    });
    
    // Slider click (initial press)
    document.addEventListener('mousedown', (e) => {
      if (e.target.closest('.slider-knob') || e.target.closest('.slider-track-wrap')) {
        initAudio();
        playClickSound('slider');
        lastY = e.clientY;
      }
    });
    
    // Resume audio context on any user interaction
    document.addEventListener('touchstart', initAudio, { once: true });
    document.addEventListener('click', initAudio, { once: true });
  })();
</script>
`;

html = html.replace('</body>', interactionScript + '</body>');

fs.writeFileSync(filePath, html, 'utf8');
console.log('Update 3 complete');
