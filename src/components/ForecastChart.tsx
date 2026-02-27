import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { cn } from '../lib/utils';

interface ForecastChartProps {
  forecasts: Record<string, any[]>;
  activeMetric: string;
  setActiveMetric: (metric: string) => void;
}

const METRICS = [
  { id: 'energy', label: 'Energy', unit: 'kWh', color: 'text-emerald-400' },
  { id: 'carbon', label: 'Carbon', unit: 'kg', color: 'text-emerald-400' },
  { id: 'water', label: 'Water', unit: 'L', color: 'text-blue-400' },
  { id: 'waste', label: 'Waste', unit: 'kg', color: 'text-orange-400' },
];

export const ForecastChart: React.FC<ForecastChartProps> = ({ forecasts, activeMetric, setActiveMetric }) => {
  const metric = METRICS.find(m => m.id === activeMetric)!;
  const data = forecasts[activeMetric] || [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0a0a0a]/90 backdrop-blur-2xl p-6 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-white/10">
          <p className="text-white/20 text-[10px] font-mono font-bold uppercase tracking-[0.3em] mb-4">{label}</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-16">
              <span className="text-white/40 text-xs font-medium">Baseline</span>
              <span className="text-white/60 font-mono text-xs font-bold">{payload[0].value} {metric.unit}</span>
            </div>
            <div className="flex items-center justify-between gap-16">
              <span className="text-emerald-400 text-xs font-bold">Optimized</span>
              <span className="text-emerald-400 font-mono text-xs font-bold glow-text-green">{payload[1].value} {metric.unit}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass rounded-[4rem] p-12 h-[650px] group">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-16">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h3 className="text-white font-display font-bold text-3xl tracking-tight group-hover:glow-text-green transition-all duration-500">Neural Forecast</h3>
            <span className={cn("text-[10px] font-mono font-black px-4 py-1 rounded-full border border-white/5 bg-white/[0.02] uppercase tracking-widest transition-colors", metric.color)}>
              {metric.label}
            </span>
          </div>
          <p className="text-white/20 text-[10px] font-mono font-medium mt-2 tracking-wider uppercase">48-Hour Predictive Modeling Engine v4.0</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-white/[0.02] border border-white/[0.05] p-2 rounded-2xl">
          {METRICS.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveMetric(m.id)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[9px] font-mono font-black uppercase tracking-widest transition-all duration-500",
                activeMetric === m.id 
                ? "bg-emerald-500 text-black shadow-[0_0_25px_rgba(16,185,129,0.3)]" 
                : "text-white/20 hover:text-white/60 hover:bg-white/[0.05]"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex gap-10 text-[9px] font-mono font-bold uppercase tracking-[0.4em]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse" />
            <span className="text-emerald-400">Optimized</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-white/10" />
            <span className="text-white/20">Baseline</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 60 }}>
          <defs>
            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="12 12" stroke="#ffffff05" vertical={false} />
          <XAxis 
            dataKey="timestamp" 
            tick={{ fill: '#ffffff40', fontSize: 10, fontFamily: 'Space Grotesk', fontWeight: 700 }}
            tickLine={false}
            axisLine={false}
            dy={15}
          />
          <YAxis 
            tick={{ fill: '#ffffff40', fontSize: 10, fontFamily: 'Space Grotesk', fontWeight: 700 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}${metric.unit}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff08', strokeWidth: 2 }} />
          <Area
            type="monotone"
            dataKey="baseline"
            stroke="#ffffff10"
            strokeWidth={2}
            fill="transparent"
            strokeDasharray="5 5"
          />
          <Area
            type="monotone"
            dataKey="predicted"
            stroke="#10b981"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorPredicted)"
            className="drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
