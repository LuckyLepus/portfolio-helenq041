import { ArrowLeft, ShieldCheck, TrainFront } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

const Section = ({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) => (
  <section className="grid gap-5 border-t border-white/10 py-10 md:grid-cols-[120px_1fr] md:py-14">
    <p className="text-xs tracking-[0.2em] text-[#9387ff]">{number}</p>
    <div>
      <h2 className="mb-6 text-2xl font-normal text-white md:text-3xl">{title}</h2>
      <div className="space-y-5 text-[15px] leading-8 text-white/62">{children}</div>
    </div>
  </section>
);

export default function RailroadNote() {
  return (
    <main className="min-h-screen bg-[#090712] text-white">
      <article className="mx-auto max-w-5xl px-6 pb-24 pt-8 md:px-10 md:pt-12">
        <nav className="mb-20 flex items-center justify-between text-xs">
          <Link
            to="/project/06"
            className="flex items-center gap-2 text-white/55 transition-colors hover:text-[#00FF85]"
          >
            <ArrowLeft className="h-4 w-4" />
            BACK TO META LAB
          </Link>
          <span className="tracking-[0.18em] text-white/30">HELEN.Q / NOTES</span>
        </nav>

        <header className="mb-20">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-[#9387ff]/30 bg-[#9387ff]/10 text-[#aaa1ff]">
            <TrainFront className="h-7 w-7" />
          </div>
          <p className="mb-5 text-xs uppercase tracking-[0.25em] text-[#9387ff]">
            Product Retrospective · AI intimacy & privacy
          </p>
          <h1 className="max-w-4xl text-4xl font-normal leading-tight md:text-7xl">
            把一列 AI 树洞列车
            <br />
            停下来之后
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-white/50 md:text-lg">
            一个 Gemini 多模态情绪对话原型，如何从“很有氛围”走到“必须认真谈论边界”。
            这不是一次功能展示，而是一次关于产品克制的复盘。
          </p>
        </header>

        <aside className="mb-14 flex gap-4 rounded-2xl border border-[#00FF85]/20 bg-[#00FF85]/5 p-6 text-sm leading-7 text-white/58">
          <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#00FF85]" />
          <p>
            原在线对话功能已经下线。本文不包含任何访客图片、语音、对话记录或模型输出，
            也不会加载 Gemini 接口。
          </p>
        </aside>

        <Section number="01" title="为什么是一列深夜列车">
          <p>
            Railroad 最初不是为了做一个“万能聊天机器人”。我想做的是一种进入情绪的仪式：
            访客投递一张窗外风景，画面变成车窗，列车启动，乘务广播在夜色里问出第一句话。
          </p>
          <p>
            列车是一个很好的叙事容器。它有方向，却不要求人立刻抵达；它允许沉默，也允许陌生人
            在一段有限的旅程里说出白天没有说出口的话。
          </p>
        </Section>

        <Section number="02" title="原型是怎样工作的">
          <p>
            原型把几种能力串成一条完整体验：图片进入 Gemini 视觉模型，模型生成破冰问题；
            访客可以打字或说话，多轮对话继续推进；模型再通过语音合成回复。旅程结束后，
            对话还可以被包装成一张“声音车票”。
          </p>
          <p>
            从交互设计看，它是连贯的：图片不是附件，而是车窗；回复不是消息，而是广播；
            存档不是数据库条目，而是一张纪念车票。叙事让技术获得了意义。
          </p>
        </Section>

        <Section number="03" title="最迷人的地方，也最危险">
          <p>
            当图片、声音和情绪文本被放进同一次交互，产品会迅速制造一种“它真的理解我”的感受。
            这种亲密感很迷人，却不能只被当作留存指标。
          </p>
          <p>
            一张风景照可能包含位置线索；一段语音可能包含声纹和背景信息；情绪对话可能暴露关系、
            健康或工作状态。即便内容只暂存在浏览器，第三方模型调用、前端密钥、日志和默认保存
            都会形成新的信任边界。
          </p>
        </Section>

        <Section number="04" title="为什么决定把它停下来">
          <p>
            停下不是因为概念失败，而是因为原型已经跨过了“好玩的小实验”与“需要承担责任的产品”
            之间的线。继续上线，需要真正的服务端密钥管理、逐项同意、数据最小化、明确保留期限、
            一键删除、危机场景提示和第三方数据处理说明。
          </p>
          <p>
            在这些条件没有成熟之前，最诚实的选择不是用一句“我们重视隐私”继续运行，而是关闭
            数据入口，只保留可以被公开讨论的设计经验。
          </p>
        </Section>

        <Section number="05" title="留下来的设计原则">
          <ul className="space-y-3">
            <li>01 — 亲密感不是默认授权；每一种敏感输入都需要单独、可理解的同意。</li>
            <li>02 — 能在本地完成的计算，不发送到云端。</li>
            <li>03 — 不把“保存回忆”设成默认选项，保存必须有期限，也必须能真正删除。</li>
            <li>04 — 模型应该解释为什么提出某个问题，而不是伪装成无所不知的陪伴者。</li>
            <li>05 — 情绪产品不能暗示替代真实的人际支持或专业帮助。</li>
          </ul>
        </Section>

        <Section number="06" title="列车没有消失">
          <p>
            Railroad 现在不再是一项在线服务，而是一张设计草图：它提醒我，好的 AI 体验不只是
            把更多模型能力接进来，也包括知道什么时候不该采集、什么时候必须解释，以及什么时候
            应该让一列看起来很美的列车停站。
          </p>
          <p>
            被保留下来的不是访客的秘密，而是一次关于叙事、技术与克制的判断。
          </p>
        </Section>

        <footer className="mt-8 flex items-center justify-between border-t border-white/10 pt-8 text-xs text-white/35">
          <span>HELEN.Q / PRODUCT NOTE</span>
          <Link to="/project/06" className="transition-colors hover:text-[#00FF85]">
            RETURN TO LAB →
          </Link>
        </footer>
      </article>
    </main>
  );
}
