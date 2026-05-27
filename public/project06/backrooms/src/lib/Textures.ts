export const generateWallpaperCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Base yellow damp color
  ctx.fillStyle = '#C8B97A';
  ctx.fillRect(0, 0, 512, 512);

  // Add some damp/noise
  for (let i = 0; i < 20000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const isDark = Math.random() > 0.5;
    ctx.fillStyle = isDark ? 'rgba(100, 90, 50, 0.05)' : 'rgba(230, 210, 150, 0.08)';
    ctx.fillRect(x, y, Math.random() * 3 + 1, Math.random() * 3 + 1);
  }

  // Draw some repeating subtle arrow/diamond patterns
  ctx.strokeStyle = 'rgba(100, 90, 40, 0.15)';
  ctx.lineWidth = 2;
  for (let x = 0; x < 512; x += 64) {
    for (let y = 0; y < 512; y += 128) {
      ctx.beginPath();
      ctx.moveTo(x + 32, y + 16);
      ctx.lineTo(x + 48, y + 48);
      ctx.lineTo(x + 32, y + 32);
      ctx.lineTo(x + 16, y + 48);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + 32, y + 80);
      ctx.lineTo(x + 48, y + 112);
      ctx.lineTo(x + 32, y + 96);
      ctx.lineTo(x + 16, y + 112);
      ctx.closePath();
      ctx.stroke();
    }
  }

  // Add horizontal damp lines
  for (let y = 0; y < 512; y += 4) {
    ctx.fillStyle = `rgba(50, 40, 10, ${Math.random() * 0.03})`;
    ctx.fillRect(0, y, 512, 1 + Math.random());
  }

  return canvas;
};

export const generateCeilingCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Ceiling tiles
  ctx.fillStyle = '#dedac6';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#b0ab96';
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, 256, 256);
  
  // Acoustic tile dots
  ctx.fillStyle = 'rgba(0,0,0,0.03)';
  for (let i = 0; i < 2000; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 256, Math.random() * 256, Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
};

export const generateFloorCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Damp brown/yellow carpet
  ctx.fillStyle = '#8f7e53';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 30000; i++) {
    const isDark = Math.random() > 0.5;
    ctx.fillStyle = isDark ? 'rgba(50, 40, 20, 0.1)' : 'rgba(180, 160, 100, 0.1)';
    const size = Math.random() * 2 + 1;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, size, size);
  }

  return canvas;
};
