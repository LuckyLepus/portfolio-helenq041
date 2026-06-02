/**
 * 媒体资源配置 - GitHub Releases 托管
 *
 * 大文件统一托管在 GitHub Releases，通过此文件集中管理所有 URL。
 * 上传文件后只需在这里更新链接，无需改动各组件代码。
 *
 * 上传步骤：
 * 1. 进入 GitHub 仓库 → Releases → Draft a new release
 * 2. Tag: v1.0-assets（或更高版本号）
 * 3. 把对应文件拖进 Attach binaries 区域
 * 4. 把下方占位 URL 替换成实际的 Release asset 直链
 *    格式：https://github.com/[用户名]/[仓库名]/releases/download/[tag]/[文件名]
 */

// ─── GitHub 仓库信息（替换成你的仓库地址）─────────────────
const GITHUB_USER = 'LuckyLepus';           // ← 你的 GitHub 用户名
const GITHUB_REPO = 'portfolio-helenq041'; // ← 你的仓库名
const RELEASE_TAG = 'v1.0-assets';          // ← Release 的 tag 名称

function ghRelease(filename: string): string {
  return `https://github.com/${GITHUB_USER}/${GITHUB_REPO}/releases/download/${RELEASE_TAG}/${filename}`;
}

// ─── 3D 模型 ──────────────────────────────────────────────
export const MODEL_GLB_URL = ghRelease('model.glb');
export const ALYONA_MODEL_URL = ghRelease('alyona_model.glb');

// ─── Alyona 虚拟歌手专辑曲目 ─────────────────────────────
// 音乐文件托管在 GitHub Releases（每首 1-4MB，可接受大小）
// 封面图片保留在 public/alyona/（已压缩后约 10MB 可接受）
export const ALYONA_SONGS = [
  {
    id: 1,
    title: 'Как же хорошо, когда есть деньги',
    titleZh: '有钱真好',
    file: ghRelease('alyona_song1.mp3'),
    cover: '/alyona/cover1.png',
  },
  {
    id: 2,
    title: 'Я просто люблю деньги',
    titleZh: '我只是喜欢钱',
    file: ghRelease('alyona_song2.mp3'),
    cover: '/alyona/cover2.png',
  },
  {
    id: 3,
    title: 'Почему деньги труднее любви?',
    titleZh: '为什么金钱比爱情更难追寻？',
    file: ghRelease('alyona_song3.mp3'),
    cover: '/alyona/cover3.png',
  },
  {
    id: 4,
    title: 'За стеклом',
    titleZh: '在橱窗之外',
    file: ghRelease('alyona_song4.mp3'),
    cover: '/alyona/cover4.png',
  },
  {
    id: 5,
    title: 'ДУЛО',
    titleZh: '枪口',
    file: ghRelease('alyona_song5.mp3'),
    cover: '/alyona/cover5.png',
  },
] as const;

// ─── 播客音频 ─────────────────────────────────────────────
// 注意：podcast/index.html 是独立编译的静态文件，
// 其音频路径在 public/podcast/index.html 中硬编码。
// 上传到 GitHub Releases 后，需要同时更新 public/podcast/index.html 中的路径。
export const PODCAST_AUDIO = {
  ep01: ghRelease('podcast_web-tech-ending-ppt.m4a'),
  ep02: ghRelease('podcast_employee-fast-company-dumb-trap.m4a'),
  ep03: ghRelease('podcast_intention-over-ten-years.m4a'),
  ep04: ghRelease('podcast_who_is_betraying_female_gamers.m4a'),
  ep05: ghRelease('podcast_from_virtual_betrayal_to_financial_independence.m4a'),
  ep06: ghRelease('podcast_ai_gives_soul_to_virtual_characters.m4a'),
  ep07: ghRelease('podcast_game-algorithm-pua.m4a'),
};
