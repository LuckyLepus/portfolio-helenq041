import { useState } from 'react';
import { motion } from 'framer-motion';
import helenImg from '../assets/helen.png';

const englishText = `An AI optimist.

I started chasing AI in 2022.
Ran fast for three years,
until 2025, when I finally looked down at where I was standing.
I stopped. I recalibrated.

2026 marks the starting point of a new narrative for my creativity.

I’ve spent 15 years in PR, communications, and brand activations.
I’m used to breaking down complex problems into executable actions—
and packaging them neatly into decks for clients.

That background made me good at building “concepts,”
and telling stories that resonate.

But AI made something very clear to me:
concepts and stories alone are not enough.

A narrative has to create real change.

Part of this shift came from how I understand Ilya Sutskever—
technology is not just a form of expression,
it is a structural force in itself.

And from Jack Dorsey’s vision of future organizations—
where individuals can take on roles that once required entire systems.

AI is not a tool upgrade.
It’s not just about efficiency.

It is a structural amplifier.

It amplifies your judgment.
It amplifies your mistakes.
And because of that, for the first time,
an individual can approach the capability of an organization.

What I’m doing now is simple:

Turning creativity—and the construction of narrative—
from one-off expression
into long-term assets.

I’m no longer here to explain the world.

From this point forward,
I choose direction.

For the past 15 years:
Strategist, Creative Director, Thinker.

For what’s next:
Independent Contributor, Coach, Decision-Maker.`;

const chineseText = `一个AI乐观主义者。

从2022年开始，做追赶AI的人，
直到2025年看清自己的脚下，停下来，重新校准。

2026，是我创造力新叙事的起点。

我做了15年的公关传播与品牌活动策划，习惯把复杂的问题拆成可以执行的动作。
并用PPT呈现给客户，
曾经的行业经验让我擅长造“概念”，也擅长讲述一个足够动人的故事。

但AI让我明白，仅有概念和故事是不够的。
叙事必须带来更切实的变化。

这种认知的转变，部分来自对 Ilya Sutskever 的认同——技术不是表达，它本身就是一种结构性的力量。
也来自 Jack Dorsey 对未来组织的想象——个体可以承担过去只有组织才能完成的角色。

AI不是工具升级，也不是效率优化。
它是一个结构性的放大器。

它会放大你的判断，也放大你的错误。
也正因此，它让“个体”第一次具备了接近组织级别的可能性。

我正在做的事情很简单：
把创意，叙事的构建，从一次性表达，变成长期资产。

不再解释世界，
从接下来的每一步，我选择方向。

15年的：
策划人，创意指导，思考者。

未来的：
独立贡献者、教练和决策者。`;

export default function About() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-6 mt-16 md:mt-24 flex flex-col md:flex-row gap-12 md:gap-20 pb-24"
    >
      {/* Inspiration Credit - Fixed at bottom left */}
      <div className="fixed bottom-10 left-8 text-[10px] text-white/30 font-sans tracking-wide leading-relaxed z-40 hidden md:block">
        灵感来源于艺术家的个人网站，感谢她的启发和原创设计<br />
        <a 
          href="https://www.yaaraisraeli.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-[#00FF85] transition-colors underline cursor-pointer hoverable"
        >
          https://www.yaaraisraeli.com/
        </a>
      </div>

      {/* Left side: Image */}
      <div className="md:w-5/12 flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="sticky top-24"
        >
          <img
            src={helenImg}
            alt="Helen Q"
            className="w-full object-cover"
          />
        </motion.div>
      </div>

      {/* Right side: Text content */}
      <div className="md:w-7/12 flex flex-col">
        {/* Fixed Title */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12 border-b border-white/20 pb-8"
        >
          <h1 className="text-xl md:text-2xl font-medium leading-relaxed tracking-wide font-sans mb-4">
            我是齐婕 (HelenQ) ·<br />
            一名创意总监、叙事设计师，以及 AI 实践者。
          </h1>
          <h2 className="text-lg md:text-xl opacity-90 leading-relaxed font-serif">
            I'm HelenQ, a Creative Director, Narrative Designer, and AI Practitioner.
          </h2>
        </motion.div>

        {/* Hoverable Intro Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative cursor-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* English Text (Dictates Height) */}
          <div
            className={`space-y-6 text-sm md:text-base leading-loose font-serif transition-opacity duration-500 ease-in-out ${isHovered ? 'opacity-0' : 'opacity-80'}`}
          >
            {englishText.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="whitespace-pre-line">{paragraph}</p>
            ))}
          </div>

          {/* Chinese Text (Overlay) */}
          <div
            className={`absolute top-0 left-0 w-full space-y-6 text-sm md:text-base leading-loose font-sans tracking-wide transition-opacity duration-500 ease-in-out ${isHovered ? 'opacity-80' : 'opacity-0 pointer-events-none'}`}
          >
            {chineseText.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="whitespace-pre-line">{paragraph}</p>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
