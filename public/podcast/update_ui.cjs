const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Replace text
html = html.replace(/MAGNETOLA PODCAST SYSTEM/g, 'HelenQ Opinion Channel');
html = html.replace(/MX-90/g, 'HEX-099');

// 2. Add custom CSS
const customCss = `
<style>
  /* Override styles to match the new grid design and hide unnecessary elements */
  body {
    background-color: #f2f2f2 !important;
    background-image: 
      linear-gradient(rgba(0, 0, 0, .05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 0, 0, .05) 1px, transparent 1px) !important;
    background-size: 30px 30px !important;
    background-position: center top !important;
  }
  
  /* Hide unimportant text / UI */
  .browser-topbar, .site-header, .hero-copy {
    display: none !important;
  }
  
  /* Make the frame invisible to blend with background */
  .browser-frame {
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
    backdrop-filter: none !important;
    width: 100% !important;
  }
  
  /* Center the content */
  .app-shell {
    padding: 60px 20px !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }
  
  /* Add some spacing below the player */
  .retro-player {
    margin-bottom: 30px !important;
    /* Optional: subtle shadow adjustment to match light background */
    box-shadow: inset 0 1px #ffffffeb, inset 0 -2px #0000001a, 0 20px 40px rgba(0,0,0,0.1) !important;
  }
</style>
</head>
`;

if (!html.includes('/* Override styles to match the new grid design')) {
    html = html.replace('</head>', customCss);
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Update complete');
