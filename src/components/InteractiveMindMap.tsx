import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Brain, AlertTriangle, Zap, Layers, Focus } from 'lucide-react';

type MindMapNode = {
  id: string;
  label: string;
  children?: MindMapNode[];
  color?: string;
  icon?: ReactNode;
};

const mindMapData: MindMapNode = {
  id: 'root',
  label: '价值200万的AI知识库坠机复盘总结',
  color: '#00FF85',
  icon: <Brain className="w-5 h-5" />,
  children: [
    {
      id: 'c1',
      label: '完美的执行悖论',
      color: '#FF5E62',
      icon: <AlertTriangle className="w-4 h-4" />,
      children: [
        { id: 'c1-1', label: '在错误的问题上执行得太好' },
        { id: 'c1-2', label: '否定性规则的逻辑海市蜃楼' },
        { id: 'c1-3', label: 'SOP先行的碎片化坟场' },
      ]
    },
    {
      id: 'c2',
      label: '四层认知陷阱',
      color: '#007AFF',
      icon: <Layers className="w-4 h-4" />,
      children: [
        { id: 'c2-1', label: '集合无穷大，无法穷尽未知' },
        { id: 'c2-2', label: '规则互斥需正向仲裁' },
        { id: 'c2-3', label: '语境依赖的组合爆炸' },
        { id: 'c2-4', label: '异化为权力对抗工具' },
      ]
    },
    {
      id: 'c3',
      label: '综合诊断与熔断',
      color: '#FFD700',
      icon: <Zap className="w-4 h-4" />,
      children: [
        { id: 'c3-1', label: '目标不存在或方法无法映射' },
        { id: 'c3-2', label: '系统性自我矛盾' },
        { id: 'c3-3', label: '偏差持续扩大且不收敛' },
      ]
    },
    {
      id: 'c4',
      label: '重构进化型组织大脑',
      color: '#8A2BE2',
      icon: <Brain className="w-4 h-4" />,
      children: [
        { id: 'c4-1', label: '业务价值流为底层逻辑' },
        { id: 'c4-2', label: '构建业务模块支撑目标' },
        { id: 'c4-3', label: '确定性节点SOP' },
      ]
    },
    {
      id: 'c5',
      label: '终局启示',
      color: '#00FF85',
      icon: <Focus className="w-4 h-4" />,
      children: [
        { id: 'c5-1', label: '物理真相：剥离情绪，寻找断点' },
        { id: 'c5-2', label: '架构逻辑：业务痛点还原为架构缺失' },
        { id: 'c5-3', label: '组织进化：反推业务迭代，消灭伪需求' },
      ]
    }
  ]
};

function MindMapNodeComponent({ node, level = 0 }: { node: MindMapNode, level?: number }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  
  return (
    <div className="flex flex-col relative w-full">
      {/* Node Element */}
      <div 
        className={`flex items-center gap-3 py-3 px-4 rounded-lg cursor-pointer transition-all duration-300 relative z-10 w-full sm:w-max max-w-full ${
          level === 0 
            ? 'bg-[#1A0F54]/80 border border-[#00FF85]/30 shadow-[0_4px_20px_rgba(0,255,133,0.15)] mb-6 hover:border-[#00FF85]/60' 
            : level === 1
              ? 'bg-black/40 border border-white/10 hover:border-white/30 hover:bg-black/60 shadow-lg'
              : 'bg-transparent border-l-2 border-white/10 pl-4 py-2 hover:border-white/40 hover:bg-white/[0.02]'
        }`}
        style={level === 1 ? { borderLeftColor: node.color, borderLeftWidth: '4px' } : {}}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {/* Toggle Icon */}
        {hasChildren && (
          <div className={`flex items-center justify-center w-5 h-5 rounded flex-shrink-0 transition-colors ${level === 0 ? 'bg-[#00FF85]/20 text-[#00FF85]' : 'bg-white/10 text-white/70'}`}>
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </div>
        )}
        {!hasChildren && level > 1 && (
          <div className="w-2 h-2 rounded-full bg-white/20 flex-shrink-0 mt-0.5" />
        )}
        
        {/* Node Icon */}
        {node.icon && (
          <div className="flex-shrink-0" style={{ color: node.color || '#fff' }}>
            {node.icon}
          </div>
        )}
        
        {/* Node Label */}
        <span className={`font-medium tracking-wide break-words ${
          level === 0 ? 'text-lg text-[#00FF85] font-semibold' : 
          level === 1 ? 'text-sm text-white' : 'text-sm text-white/70 font-light'
        }`}>
          {node.label}
        </span>
      </div>

      {/* Children Container */}
      <AnimatePresence initial={false}>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`flex flex-col gap-3 overflow-hidden ${
              level === 0 ? 'ml-8' : 'ml-6'
            }`}
          >
            {/* Connection Line */}
            <div className="absolute left-4 top-14 bottom-6 w-px bg-white/10 -z-10" />
            
            <div className="pt-2 pb-4 flex flex-col gap-3">
              {node.children!.map((child) => (
                <MindMapNodeComponent key={child.id} node={child} level={level + 1} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function InteractiveMindMap() {
  return (
    <div className="w-full bg-[#0D072B] border border-white/10 rounded-2xl p-6 sm:p-10 relative overflow-hidden flex flex-col items-start font-sans shadow-2xl">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF85]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#8A2BE2]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="text-xs font-mono text-[#00FF85]/60 mb-8 tracking-widest uppercase border border-[#00FF85]/20 bg-[#00FF85]/5 px-3 py-1 rounded inline-block">
        Interactive Knowledge Graph
      </div>
      
      <div className="w-full relative z-10">
        <MindMapNodeComponent node={mindMapData} />
      </div>
    </div>
  );
}
