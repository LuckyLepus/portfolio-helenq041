/**
 * 字体子集化脚本 font_subset.cjs
 * 功能：扫描项目所有 .tsx/.ts/.css 文件中使用的文字，
 *       只保留这些字符，生成精简版 woff2 字体文件
 * 使用方式: node font_subset.cjs
 */

const fs = require('fs');
const path = require('path');
const subsetFont = require('subset-font');

// ============================================================
// 1. 收集所有源码中的文本内容
// ============================================================
const srcDir = path.join(__dirname, 'src');

function getAllTextFromFiles(dir, exts = ['.tsx', '.ts', '.css', '.html']) {
  let allText = '';
  const walk = (d) => {
    if (!fs.existsSync(d)) return;
    const items = fs.readdirSync(d);
    for (const item of items) {
      if (item === 'node_modules') continue;
      const full = path.join(d, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (exts.some(ext => item.endsWith(ext))) {
        allText += fs.readFileSync(full, 'utf-8');
      }
    }
  };
  walk(dir);
  return allText;
}

// 获取网站中所有用到的文本
let allText = getAllTextFromFiles(srcDir);
allText += fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');

// 去重，获取唯一字符集
const uniqueChars = [...new Set(allText)].join('');
console.log('共发现 ' + uniqueChars.length + ' 个不重复字符');

// 加入基本 ASCII
const basicASCII = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
const finalChars = [...new Set(uniqueChars + basicASCII)].join('');
console.log('含基础ASCII后，共 ' + finalChars.length + ' 个字符需要保留');

// ============================================================
// 2. 子集化各个字体文件
// ============================================================
const fontsDir = path.join(__dirname, 'public', 'fonts');

const fontsToProcess = [
  { input: 'GlowSansSC-Normal-Light.otf',   output: 'GlowSansSC-Light.woff2',   weight: 300 },
  { input: 'GlowSansSC-Normal-Regular.otf', output: 'GlowSansSC-Regular.woff2', weight: 400 },
  { input: 'GlowSansSC-Normal-Medium.otf',  output: 'GlowSansSC-Medium.woff2',  weight: 500 },
  { input: 'GlowSansSC-Normal-Bold.otf',    output: 'GlowSansSC-Bold.woff2',    weight: 700 },
  { input: 'ChillJinshuSong.otf',           output: 'ChillJinshuSong.woff2',    weight: 800 },
];

async function processFont(config) {
  const inputPath = path.join(fontsDir, config.input);
  const outputPath = path.join(fontsDir, config.output);

  if (!fs.existsSync(inputPath)) {
    console.warn('跳过（文件不存在）: ' + config.input);
    return;
  }

  const originalSize = fs.statSync(inputPath).size;
  console.log('\n处理: ' + config.input + ' (' + (originalSize / 1024 / 1024).toFixed(1) + 'MB)');

  try {
    const inputBuffer = fs.readFileSync(inputPath);
    const subsetBuffer = await subsetFont(inputBuffer, finalChars, {
      targetFormat: 'woff2',
    });
    
    fs.writeFileSync(outputPath, subsetBuffer);
    const newSize = fs.statSync(outputPath).size;
    const ratio = ((1 - newSize / originalSize) * 100).toFixed(0);
    console.log('   完成: ' + config.output + ' (' + (newSize / 1024).toFixed(0) + 'KB, 减少' + ratio + '%)');
  } catch (err) {
    console.error('   失败: ' + err.message);
  }
}

async function main() {
  console.log('\n开始字体子集化...\n');
  
  for (const fontConfig of fontsToProcess) {
    await processFont(fontConfig);
  }
  
  let totalOriginal = 0;
  let totalNew = 0;
  for (const f of fontsToProcess) {
    const origPath = path.join(fontsDir, f.input);
    const newPath = path.join(fontsDir, f.output);
    if (fs.existsSync(origPath)) totalOriginal += fs.statSync(origPath).size;
    if (fs.existsSync(newPath)) totalNew += fs.statSync(newPath).size;
  }
  
  console.log('\n全部完成！');
  console.log('总计: ' + (totalOriginal/1024/1024).toFixed(1) + 'MB -> ' + (totalNew/1024).toFixed(0) + 'KB');
}

main().catch(console.error);
