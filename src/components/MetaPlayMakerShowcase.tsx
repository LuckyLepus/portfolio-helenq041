import { ShieldCheck } from 'lucide-react';

export default function MetaPlayMakerShowcase() {
  return (
    <section className="w-full min-h-[420px] rounded-2xl border border-white/10 bg-[#0a0a0a] px-8 py-16 flex items-center justify-center text-center">
      <div className="max-w-2xl">
        <div className="mx-auto mb-7 w-16 h-16 rounded-full border border-[#00FF85]/30 bg-[#00FF85]/10 text-[#00FF85] flex items-center justify-center">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <p className="text-xs uppercase tracking-[0.24em] text-[#00FF85] mb-4">Privacy boundary active</p>
        <h3 className="text-2xl md:text-3xl font-normal text-white mb-5">
          交互实验已从主站下线
        </h3>
        <p className="text-sm md:text-base leading-8 text-white/55">
          Railroad、Storybook 与摄像头交互实验将迁移到独立域名。新版本会默认不上传、
          不保存图片、语音和对话；只有在访客明确同意后才开启对应功能，并提供清除与到期机制。
        </p>
      </div>
    </section>
  );
}
