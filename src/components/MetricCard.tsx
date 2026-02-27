import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  trend: number;
  color: 'lime' | 'emerald' | 'aqua' | 'coral';
  description: string;
  size?: 'large' | 'small';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title, value, unit, icon: Icon, trend, color, description, size = 'large'
}) => {
  const colorClasses = {
    lime: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    aqua: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    coral: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  };

  const glowClasses = {
    lime: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]',
    emerald: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]',
    aqua: 'hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]',
    coral: 'hover:shadow-[0_0_40px_rgba(251,146,60,0.15)]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={cn(
        "relative glass glass-hover rounded-[3rem] overflow-hidden group transition-all duration-500",
        size === 'large' ? "p-10" : "p-8",
        glowClasses[color]
      )}
    >
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-10">
          <div className={cn("p-5 rounded-3xl border transition-transform duration-500 group-hover:scale-110", colorClasses[color])}>
            <Icon size={size === 'large' ? 32 : 24} strokeWidth={1.5} />
          </div>
          <div className={cn(
            "text-[10px] font-mono font-black px-4 py-1.5 rounded-full uppercase tracking-widest",
            trend < 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"
          )}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        </div>
        
        <div>
          <p className="text-white/20 text-[9px] font-mono font-bold uppercase tracking-[0.4em] mb-3 group-hover:text-white/40 transition-colors">{title}</p>
          <div className="flex items-baseline gap-3">
            <h3 className={cn(
              "font-mono font-bold text-white tabular-nums tracking-tighter transition-all duration-500 group-hover:glow-text-green",
              size === 'large' ? "text-5xl" : "text-4xl"
            )}>
              {value}
            </h3>
            <span className="text-white/20 text-xs font-mono font-bold">{unit}</span>
          </div>
          <p className="text-white/30 text-[11px] mt-6 leading-relaxed font-medium group-hover:text-white/50 transition-colors">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
