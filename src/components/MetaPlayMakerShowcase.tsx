import { BookOpen, ExternalLink, Hand, NotebookPen, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const experiments = [
  {
    title: '不完美记忆事件',
    eyebrow: 'Interactive Storybook',
    description: '一册可翻阅的在线绘本。纯静态运行，不采集或保存访客数据。',
    href: '/lab/storybook/index.html',
    icon: BookOpen,
    badge: 'NO DATA COLLECTION',
  },
  {
    title: 'Backrooms Gesture Portal',
    eyebrow: 'On-device Gesture Study',
    description: '用本地脸部与手势坐标控制后室视差。摄像头画面不上传、不保存，离开页面自动停止。',
    href: '/lab/backrooms/index.html',
    icon: Hand,
    badge: 'LOCAL CAMERA ONLY',
  },
];

export default function MetaPlayMakerShowcase() {
  return (
    <section className="w-full space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        {experiments.map(({ title, eyebrow, description, href, icon: Icon, badge }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group min-h-[310px] rounded-2xl border border-white/10 bg-[#090909] p-7 flex flex-col justify-between transition-all hover:border-[#00FF85]/40 hover:-translate-y-1"
          >
            <div>
              <div className="mb-10 flex items-start justify-between">
                <div className="h-12 w-12 rounded-full border border-[#00FF85]/25 bg-[#00FF85]/10 text-[#00FF85] flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <ExternalLink className="h-4 w-4 text-white/30 transition-colors group-hover:text-[#00FF85]" />
              </div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-[#00FF85]">{eyebrow}</p>
              <h3 className="mb-4 text-2xl font-normal text-white">{title}</h3>
              <p className="text-sm leading-7 text-white/50">{description}</p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-[9px] tracking-[0.16em] text-white/35">
              <ShieldCheck className="h-3.5 w-3.5 text-[#00FF85]/70" />
              {badge}
            </div>
          </a>
        ))}
      </div>

      <Link
        to="/notes/railroad-treehole"
        className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#171328] to-[#090909] p-7 md:p-9 flex flex-col gap-7 md:flex-row md:items-center md:justify-between transition-colors hover:border-[#8b7cff]/45"
      >
        <div className="flex gap-5">
          <div className="h-12 w-12 shrink-0 rounded-full border border-[#8b7cff]/30 bg-[#8b7cff]/10 text-[#a99fff] flex items-center justify-center">
            <NotebookPen className="h-5 w-5" />
          </div>
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[#a99fff]">Product Note</p>
            <h3 className="mb-3 text-xl md:text-2xl font-normal text-white">
              把一列 AI 树洞列车停下来之后
            </h3>
            <p className="max-w-2xl text-sm leading-7 text-white/50">
              Railroad 从 Gemini 多模态情绪对话原型，转化为一篇关于叙事、亲密感与隐私边界的产品复盘。
            </p>
          </div>
        </div>
        <span className="shrink-0 text-xs tracking-[0.16em] text-white/45 transition-colors group-hover:text-[#a99fff]">
          READ NOTE →
        </span>
      </Link>
    </section>
  );
}
