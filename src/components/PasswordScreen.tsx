import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PasswordScreenProps {
  onUnlock: () => void;
}

export default function PasswordScreen({ onUnlock }: PasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isQRActive, setIsQRActive] = useState(false);

  // 动态计算基于日期的密码（防止静态密码泄露或长期传播）
  const getValidPasswords = () => {
    const today = new Date();
    // 1. 今天的密码：Helen + MMDD (例如 6月1日为 Helen0601)
    const mmToday = String(today.getMonth() + 1).padStart(2, '0');
    const ddToday = String(today.getDate()).padStart(2, '0');
    const todayPwd = `Helen${mmToday}${ddToday}`;

    // 2. 昨天的密码（用于跨天容错，如前一天深夜付款的HR在第二天上午输入）
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const mmYesterday = String(yesterday.getMonth() + 1).padStart(2, '0');
    const ddYesterday = String(yesterday.getDate()).padStart(2, '0');
    const yesterdayPwd = `Helen${mmYesterday}${ddYesterday}`;

    // 3. 万能备用静态密码
    const backupPwd = 'Helen2026';

    return { todayPwd, yesterdayPwd, backupPwd };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPwd = password.trim();
    const { todayPwd, yesterdayPwd, backupPwd } = getValidPasswords();

    if (cleanPwd === todayPwd || cleanPwd === yesterdayPwd || cleanPwd === backupPwd) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#090b14] overflow-hidden font-sans"
    >
      {/* 极奢流动背景与炫光虚影 */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 50, -20, 0],
            y: [0, -30, 40, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-[#6366f1] opacity-[0.08] filter blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -40, 60, 0],
            y: [0, 40, -30, 0],
            scale: [1, 0.95, 1.05, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 3 }}
          className="absolute -bottom-[10%] -right-[10%] w-[450px] h-[450px] rounded-full bg-[#d946ef] opacity-[0.08] filter blur-[120px]"
        />
      </div>

      {/* 极奢磨砂玻璃卡片 (Coffee-Gated Paywall) */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-[92%] max-w-[540px] bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 md:p-12 text-center shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
      >
        {/* 咖啡杯锁图标 */}
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <span className="text-2xl">☕</span>
        </div>

        <h2 className="font-display font-medium text-2xl md:text-3xl text-white mb-4 tracking-tight">
          解锁 HelenQ 案例库
        </h2>
        <p className="text-white/60 text-sm leading-relaxed mb-6 font-light">
          这里涵盖巨量引擎、火山引擎千万级品牌策划与 GEO 方法论。为了将有限精力倾注于更深度、懂价值的合作伙伴，本站案例库已启用轻量阻尼。
        </p>

        {/* 诚意阻尼卡片 */}
        <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-5 text-left text-xs leading-relaxed text-white/70 mb-8 space-y-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-medium">
            <span>🤝</span>
            <span>「诚意对赌协议」</span>
          </div>
          <p>
            支付 <strong className="text-white">9.9 元</strong> 一杯咖啡钱即可获取解锁暗号。这不仅是一个高效过滤机制，更是对彼此时间价值的共同认可。
          </p>
          <p className="text-white/40 italic">
            💡 若后续我们面谈，这杯咖啡我将以双倍（19.8元）的价格回请您，感恩您的诚意与认可。
          </p>
        </div>

        {/* 交互输入区域 */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setIsQRActive(true)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-medium text-sm transition-all shadow-[0_10px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_15px_30px_rgba(99,102,241,0.35)] hover:-translate-y-[1px] active:translate-y-0"
          >
            ☕ 扫码请 Helen 喝咖啡（获取暗号）
          </button>

          <form onSubmit={handleSubmit} className="relative flex items-center gap-3 mt-2">
            <div className="relative flex-1">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入解锁暗号..."
                className={`w-full px-5 py-4 rounded-2xl bg-black/40 border ${error ? 'border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/10'} text-white placeholder:text-white/20 text-sm outline-none focus:border-indigo-500/50 focus:bg-black/60 transition-all tracking-wider`}
                autoFocus
              />
              <AnimatePresence>
                {error && (
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-6 left-4 text-[11px] text-red-400 font-light tracking-wide"
                  >
                    暗号不正确，请重新输入或加微信索要
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <button
              type="submit"
              className="px-6 py-4 rounded-2xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-white/90 active:scale-[0.98] transition-all"
            >
              解锁
            </button>
          </form>
        </div>
      </motion.div>

      {/* 扫码支付弹出模态框 */}
      <AnimatePresence>
        {isQRActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[380px] bg-[#11131c] border border-white/10 rounded-[28px] p-8 text-center shadow-2xl"
            >
              {/* 关闭按钮 */}
              <button
                onClick={() => setIsQRActive(false)}
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all cursor-pointer"
              >
                &times;
              </button>

              <h3 className="font-medium text-lg text-white mb-1">
                微信扫码请 Helen 喝咖啡
              </h3>
              <p className="text-xs text-white/40 mb-6">
                支付 9.9 元以获取今日解密口令
              </p>

              {/* 微信收款码 */}
              <div className="w-[180px] h-[180px] bg-white rounded-2xl flex items-center justify-center p-2.5 mx-auto mb-6 border-4 border-white/5 shadow-inner">
                <img
                  src="/wechat-qr.png"
                  alt="WeChat QR Code"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // 兼容 jpg 格式
                    (e.target as HTMLImageElement).src = '/wechat-qr.jpg';
                  }}
                />
              </div>

              {/* 密码指引说明 */}
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 text-xs text-white/60 leading-relaxed text-left space-y-1">
                <div className="text-white font-medium mb-1 flex items-center gap-1">
                  <span>🗝️</span>
                  <span>如何获取暗号？</span>
                </div>
                <p>
                  1. 付款备注里已写好专属口令：<strong className="text-amber-400">Helen2026</strong>；
                </p>
                <p>
                  2. 或今天的动态暗号为：<strong className="text-indigo-400">Helen + 付款当天月日4位数字</strong>。
                </p>
                <p className="text-[10px] text-white/30 italic">
                  (例如：6月1日扫码付款，今天的暗号即为 Helen0601)
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
