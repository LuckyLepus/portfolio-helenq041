const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Add custom CSS for new minimalist design
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
    background: linear-gradient(180deg, #fefefe 0%, #ebebeb 100%) !important;
    box-shadow: 
      inset 0 1px 1px rgba(255,255,255,1), 
      inset 0 -1px 2px rgba(0,0,0,0.05), 
      0 5px 8px rgba(0,0,0,0.1),
      0 1px 2px rgba(0,0,0,0.15) !important;
    border: 1px solid rgba(0,0,0,0.12) !important;
    color: #777 !important;
    text-transform: uppercase !important;
    font-weight: 700 !important;
    letter-spacing: 0.08em !important;
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  
  .mechanical-button:active, .mechanical-button.is-active {
    background: linear-gradient(180deg, #e6e6e6 0%, #f4f4f4 100%) !important;
    box-shadow: 
      inset 0 2px 4px rgba(0,0,0,0.1), 
      inset 0 4px 8px rgba(0,0,0,0.05),
      0 1px 1px rgba(255,255,255,0.8) !important;
    transform: translateY(3px) !important;
    color: #333 !important;
    border: 1px solid rgba(0,0,0,0.2) !important;
  }
  
  /* Active minimalist button (e.g. Pause) */
  .mechanical-button.is-active {
    color: #60a900 !important;
  }

  /* Minimalist Slider Knob */
  .slider-knob {
    border-radius: 4px !important;
    background: linear-gradient(180deg, #fefefe 0%, #ebebeb 100%) !important;
    box-shadow: 
      inset 0 1px 2px rgba(255,255,255,0.9), 
      0 4px 6px rgba(0,0,0,0.15),
      0 1px 3px rgba(0,0,0,0.1) !important;
    border: 1px solid rgba(0,0,0,0.15) !important;
    width: 48px !important;
    height: 22px !important;
    position: relative !important;
  }
  
  /* Horizontal line on slider */
  .slider-knob::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 20%;
    right: 20%;
    height: 2px;
    background: rgba(0,0,0,0.2);
    transform: translateY(-50%);
    border-radius: 1px;
    box-shadow: inset 0 1px 1px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.8);
  }
  
  .slider-control.is-dragging .slider-knob {
    box-shadow: 
      inset 0 1px 2px rgba(255,255,255,0.9), 
      0 2px 3px rgba(0,0,0,0.1) !important;
  }

  /* Slider Track adjustment */
  .slider-rail {
    background: linear-gradient(90deg, #d4d4d4, #f4f4f4) !important;
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.8) !important;
    width: 6px !important;
    left: calc(50% - 3px) !important;
  }
  
  .slider-slots span {
    background: rgba(0,0,0,0.1) !important;
    box-shadow: 0 1px 0 rgba(255,255,255,0.8) !important;
  }

</style>
`;

if (!html.includes('/* Minimalist Industrial Design Tweaks */')) {
    html = html.replace('</head>', designCss + '</head>');
}

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
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      if (type === 'button') {
        // Chunky mechanical switch sound
        osc.type = 'square';
        osc.frequency.setValueAtTime(180, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.04);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);
      } else if (type === 'slider') {
        // Clicking gear damping sound
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.02);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.02);
      }
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    }

    // Attach to buttons
    document.addEventListener('mousedown', (e) => {
      if (e.target.closest('.mechanical-button')) {
        playClickSound('button');
      }
    });
    
    // Attach to slider
    let lastSliderSoundTime = 0;
    document.addEventListener('mousemove', (e) => {
      if (e.buttons === 1 && e.target.closest('.slider-track-wrap')) {
        const now = Date.now();
        if (now - lastSliderSoundTime > 60) {
          playClickSound('slider');
          lastSliderSoundTime = now;
        }
      }
    });
    
    // Slider click (initial press)
    document.addEventListener('mousedown', (e) => {
      if (e.target.closest('.slider-knob') || e.target.closest('.slider-track-wrap')) {
        playClickSound('slider');
      }
    });
    
    // Resume audio context on any user interaction
    document.addEventListener('click', initAudio, { once: true });
  })();
</script>
`;

if (!html.includes('function playClickSound(type =')) {
    html = html.replace('</body>', interactionScript + '</body>');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Update 2 complete');
