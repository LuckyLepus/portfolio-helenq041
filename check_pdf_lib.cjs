const { pdfToPng } = require('pdf-to-png-converter');
const path = require('path');
const fs = require('fs');

async function run() {
  const pdfPath = "E:\\2026精选案例库\\{01} ON&OFFline方案库\\二次元活动2024.pdf";
  const outputDir = path.join(__dirname, 'public', 'cases', 'anime_event_2024');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Starting conversion of PDF:', pdfPath);
  try {
    const results = await pdfToPng(pdfPath, {
      viewportScale: 2.0, // Ultra-sharp upscale
      outputFolder: outputDir,
      outputFileMask: 'page' // e.g. page_1.png, page_2.png
    });
    console.log('Conversion successful! Total pages processed:', results.length);
    console.log('Results overview:', results.map(r => r.name));
  } catch (err) {
    console.error('Error during conversion:', err);
  }
}

run();
