import React from 'react';
import { motion } from 'motion/react';

interface SustainabilityScoreProps {
  score: number;
  predictedScore: number;
}

export const SustainabilityScore: React.FC<SustainabilityScoreProps> = ({ score, predictedScore }) => {
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const predictedOffset = circumference - (predictedScore / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center py-20 px-8 bg-white/[0.01] backdrop-blur-3xl border border-white/[0.05] rounded-[4rem] overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-emerald-500/[0.05] blur-[120px] pointer-events-none" />
      
      <div className="relative w-80 h-80">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx="160"
            cy="160"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="12"
            className="text-white/[0.02]"
          />
          {/* Predicted Progress */}
          <motion.circle
            cx="160"
            cy="160"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: predictedOffset }}
            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-emerald-500/10"
            strokeLinecap="round"
          />
          {/* Current Progress */}
          <motion.circle
            cx="160"
            cy="160"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="text-emerald-500"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.6))' }}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="flex flex-col items-center"
          >
            <span className="text-[100px] font-display font-extrabold tracking-tighter text-white leading-none glow-text-green">
              {score}
            </span>
            <span className="text-emerald-500/40 text-[10px] font-mono font-bold uppercase tracking-[0.6em] mt-2">
              ECO INDEX
            </span>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-12 text-center max-w-md"
      >
        <h2 className="text-2xl font-display font-bold text-white tracking-tight">Intelligence Core</h2>
        <p className="text-white/40 text-xs mt-3 leading-relaxed font-mono">
          System efficiency at <span className="text-emerald-400 font-bold">{score}%</span>. 
          AI optimization potential: <span className="text-emerald-400 font-bold">+{predictedScore - score}pts</span>.
        </p>
      </motion.div>
    </div>
  );
};
