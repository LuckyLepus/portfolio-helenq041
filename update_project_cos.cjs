const fs = require('fs');
const path = require('path');

const projectFile = path.join(__dirname, 'src/pages/Project.tsx');
let content = fs.readFileSync(projectFile, 'utf-8');

// 1. Revert Bilibili media types to video
content = content.replace(/mediaType: 'bilibili'/g, "mediaType: 'video'");

// 2. We can remove bvid if we want, but it doesn't hurt to leave them. Let's leave them.

// 3. Update the GITHUB_MEDIA_BASE_URL to COS_BASE
content = content.replace(
  /const GITHUB_MEDIA_BASE_URL: string = '';/,
  `import { COS_BASE } from '../config/mediaAssets';\nconst GITHUB_MEDIA_BASE_URL: string = COS_BASE;`
);

// 4. Update the fallback logic for image slider and pdf to correctly use COS_BASE
// Currently ImageSlider uses baseUrl directly. Let's just modify the mediaUrl and images in the casesTimeline array directly to use COS_BASE?
// No, the rendering logic at line 826 does:
// return `${GITHUB_MEDIA_BASE_URL.replace(/\\/$/, '')}/${item.fileName}`;
// This is PERFECT for videos and PDFs because the user uploaded them flat (e.g. /portfolio-helenq0414/filename.mp4).
// Let's check ImageSlider:
content = content.replace(
  /<img\s+src=\{img\}\s+alt=/g,
  `<img src={baseUrl ? \`\${baseUrl.replace(/\\/$/, '')}/\${img.split('/').slice(-2).join('/')}\` : img} alt=`
);
// This changes `img` (e.g. '/cases/anime_event_2024/slide1.png') to `baseUrl + '/anime_event_2024/slide1.png'`, assuming the user uploaded the folder directly to COS.

fs.writeFileSync(projectFile, content, 'utf-8');
console.log('Project.tsx successfully updated for COS!');
