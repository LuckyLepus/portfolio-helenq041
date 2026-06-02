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

// ─── 腾讯云 COS 资源配置 ─────────────────────────────────────
export const COS_BASE = 'https://helenq-assets-1317600743.cos.ap-hongkong.myqcloud.com/portfolio-helenq0414';

export function cosUrl(filename: string): string {
  // 如果已经是绝对路径或带 /cases/ 等前缀，根据实际情况拼接
  if (filename.startsWith('/')) {
    return `${COS_BASE}${filename}`;
  }
  return `${COS_BASE}/${filename}`;
}

// ─── 3D 模型 ──────────────────────────────────────────────
export const MODEL_GLB_URL = '/model.glb';
export const ALYONA_MODEL_URL = '/alyona/model.glb';

// ─── Alyona 虚拟歌手专辑曲目 ─────────────────────────────
// 音乐文件托管在 COS
export const ALYONA_SONGS = [
  {
    id: 1,
    title: 'Как же хорошо, когда есть деньги',
    titleZh: '有钱真好',
    file: cosUrl('alyona_song1.mp3'),
    cover: '/alyona/cover1.png',
  },
  {
    id: 2,
    title: 'Я просто люблю деньги',
    titleZh: '我只是喜欢钱',
    file: cosUrl('alyona_song2.mp3'),
    cover: '/alyona/cover2.png',
  },
  {
    id: 3,
    title: 'Почему деньги труднее любви?',
    titleZh: '为什么金钱比爱情更难追寻？',
    file: cosUrl('alyona_song3.mp3'),
    cover: '/alyona/cover3.png',
  },
  {
    id: 4,
    title: 'За стеклом',
    titleZh: '在橱窗之外',
    file: cosUrl('alyona_song4.mp3'),
    cover: '/alyona/cover4.png',
  },
  {
    id: 5,
    title: 'ДУЛО',
    titleZh: '枪口',
    file: cosUrl('alyona_song5.mp3'),
    cover: '/alyona/cover5.png',
  },
] as const;

// ─── 播客音频 ─────────────────────────────────────────────
// 音频文件托管在 COS
export const PODCAST_AUDIO = {
  ep01: cosUrl('podcast_web-tech-ending-ppt.m4a'),
  ep02: cosUrl('podcast_employee-fast-company-dumb-trap.m4a'),
  ep03: cosUrl('podcast_intention-over-ten-years.m4a'),
  ep04: cosUrl('podcast_who_is_betraying_female_gamers.m4a'),
  ep05: cosUrl('podcast_from_virtual_betrayal_to_financial_independence.m4a'),
  ep06: cosUrl('podcast_ai_gives_soul_to_virtual_characters.m4a'),
  ep07: cosUrl('podcast_game-algorithm-pua.m4a'),
};
