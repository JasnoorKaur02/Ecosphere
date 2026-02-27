import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Droplets, 
  Trash2, 
  Leaf, 
  TrendingDown, 
  Cpu, 
  Building2, 
  RefreshCw,
  ChevronRight,
  Sparkles,
  AlertCircle,
  FileUp,
  FileDown
} from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { SustainabilityScore } from './components/SustainabilityScore';
import { ForecastChart } from './components/ForecastChart';
import { generateBuildingData, generateForecast } from './services/simulationService';
import { getSustainabilityInsights } from './services/geminiService';
import { BuildingData, BuildingType, OptimizationResult } from './types';
import { cn } from './lib/utils';

import { LandingPage } from './components/LandingPage';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [institutionName, setInstitutionName] = useState('');
  const [buildingType, setBuildingType] = useState<BuildingType>('Campus');
  const [data, setData] = useState<BuildingData[]>([]);
  const [forecast, setForecast] = useState<Record<string, any[]>>({});
  const [activeMetric, setActiveMetric] = useState('energy');
  const [insights, setInsights] = useState<OptimizationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchBuildingData = () => {
    setLoading(true);
    const simulatedData = generateBuildingData(buildingType);
    setData(simulatedData);
    setForecast(generateForecast(simulatedData));
    setLoading(false);
    return simulatedData;
  };

  const fetchInsights = async (currentData: BuildingData[]) => {
    setInsightsLoading(true);
    const aiInsights = await getSustainabilityInsights(currentData, buildingType, activeMetric);
    setInsights(aiInsights);
    setInsightsLoading(false);
  };

  useEffect(() => {
    const simulatedData = fetchBuildingData();
    fetchInsights(simulatedData);
  }, [buildingType]);

  useEffect(() => {
    if (data.length > 0) {
      fetchInsights(data);
    }
  }, [activeMetric]);

  const current = data[data.length - 1] || { 
    energy: 0, 
    water: 0, 
    waste: 0, 
    carbon: 0, 
    occupancy: 0, 
    temperature: 0, 
    timestamp: new Date().toISOString() 
  } as BuildingData;
  const prev = data[data.length - 2] || current;
  
  const getTrend = (curr: number, p: number) => {
    if (p === 0) return 0;
    return Math.round(((curr - p) / p) * 100);
  };

  const baseScore = 68;
  const potentialImprovement = insights.reduce((acc, i) => acc + i.impact, 0) / 4;
  const predictedScore = Math.min(100, Math.round(baseScore + potentialImprovement));

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      
      const parsedData: BuildingData[] = lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.split(',');
        const entry: any = {};
        headers.forEach((header, index) => {
          const key = header.trim().toLowerCase();
          const val = values[index]?.trim();
          entry[key] = isNaN(Number(val)) ? val : Number(val);
        });
        return entry as BuildingData;
      });

      if (parsedData.length > 0) {
        setData(parsedData);
        setForecast(generateForecast(parsedData));
        fetchInsights(parsedData);
      }
    };
    reader.readAsText(file);
  };

  const handleExportReport = () => {
    const reportContent = `
# ECOSPHERE AI - Sustainability Report
Generated on: ${new Date().toLocaleString()}
Building Type: ${buildingType}

## Current Metrics
- Energy Consumption: ${current.energy} kWh
- Carbon Footprint: ${current.carbon} kg CO2
- Water Usage: ${current.water} L
- Waste Generation: ${current.waste} kg
- Occupancy: ${current.occupancy}%
- Temperature: ${current.temperature}°C

## Sustainability Score
- Current Score: ${baseScore}
- Predicted Score (Optimized): ${predictedScore}

## Active Optimization Protocols
${insights.filter(i => i.type === activeMetric).map(i => `- ${i.title}: ${i.description} (Impact: -${i.impact}%)`).join('\n')}

---
EcoSphere AI v4.0.2 Stable Build
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EcoSphere_Report_${buildingType}_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLaunch = (name: string, type: BuildingType) => {
    setInstitutionName(name);
    setBuildingType(type);
    setView('dashboard');
  };

  if (view === 'landing') {
    return <LandingPage onLaunch={handleLaunch} />;
  }

  if (loading && data.length === 0) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="flex flex-col items-center gap-10">
          <div className="relative">
            <div className="w-24 h-24 border-2 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
            <div className="absolute inset-0 w-24 h-24 bg-emerald-500/20 blur-2xl animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-white font-display font-bold text-4xl tracking-tighter animate-pulse glow-text-green">ECOSPHERE</p>
            <p className="text-emerald-500/40 text-[10px] font-mono font-bold uppercase tracking-[0.6em] mt-4">Syncing Core Intelligence</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-emerald-500/[0.05] blur-[160px] rounded-full animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-500/[0.05] blur-[160px] rounded-full animate-pulse-glow" style={{ animationDelay: '-2s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-12 py-8 flex justify-between items-center border-b border-white/[0.03]">
        <div className="flex items-center gap-6 group cursor-pointer">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform duration-500">
            <Leaf className="text-black" size={24} strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-display font-bold tracking-tighter leading-none group-hover:glow-text-green transition-all duration-500">ECOSPHERE <span className="text-emerald-500">AI</span></h1>
              {institutionName && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05]">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-mono font-bold text-white/40 uppercase tracking-widest">{institutionName}</span>
                </div>
              )}
            </div>
            <p className="text-[9px] text-white/20 font-mono font-bold uppercase tracking-[0.5em] mt-2">v4.0.2 Stable Build</p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="hidden lg:flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-2">
            {(['Campus', 'Office', 'Residential', 'Hospital'] as BuildingType[]).map((type) => (
              <button
                key={type}
                onClick={() => setBuildingType(type)}
                className={`px-6 py-2 rounded-xl text-[9px] font-mono font-bold uppercase tracking-widest transition-all duration-500 ${
                  buildingType === type 
                  ? 'bg-emerald-500 text-black shadow-[0_0_25px_rgba(16,185,129,0.3)]' 
                  : 'text-white/20 hover:text-white/60 hover:bg-white/[0.05]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCsvUpload}
              accept=".csv"
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 flex items-center justify-center bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:bg-white/[0.08] hover:border-emerald-500/30 transition-all duration-500 group"
              title="Upload CSV Data"
            >
              <FileUp size={18} className="text-white/20 group-hover:text-emerald-400 transition-all duration-500" />
            </button>
            <button 
              onClick={handleExportReport}
              className="w-12 h-12 flex items-center justify-center bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:bg-white/[0.08] hover:border-blue-500/30 transition-all duration-500 group"
              title="Export Sustainability Report"
            >
              <FileDown size={18} className="text-white/20 group-hover:text-blue-400 transition-all duration-500" />
            </button>
            <button 
              onClick={() => {
                const simulatedData = fetchBuildingData();
                fetchInsights(simulatedData);
              }}
              className="w-12 h-12 flex items-center justify-center bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:bg-white/[0.08] hover:border-emerald-500/30 transition-all duration-500 group"
              title="Refresh Data"
            >
              <RefreshCw size={18} className={cn("transition-all duration-500", loading ? 'animate-spin text-emerald-500' : 'text-white/20 group-hover:text-emerald-400')} />
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-20 space-y-40">
        
        {/* Section 1: Hero Score */}
        <section className="flex flex-col items-center">
          <div className="w-full max-w-5xl">
            <SustainabilityScore score={baseScore} predictedScore={predictedScore} />
          </div>
        </section>

        {/* Section 2: Primary Metrics (Energy & Carbon) */}
        <section className="space-y-16">
          <div className="flex items-center justify-between px-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-display font-bold tracking-tight text-white">Primary Systems</h2>
              <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.3em]">Critical Infrastructure Monitoring</p>
            </div>
            <div className="flex items-center gap-4 text-emerald-400 text-[9px] font-mono font-bold uppercase tracking-[0.4em] bg-emerald-500/5 px-5 py-2.5 rounded-full border border-emerald-500/10">
              <Sparkles size={14} className="animate-pulse" />
              <span>Neural Analysis Active</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <MetricCard
              title="Energy Consumption"
              value={current.energy}
              unit="kWh"
              icon={Zap}
              trend={getTrend(current.energy, prev.energy)}
              color="lime"
              description="Total building electrical load including HVAC, lighting, and server infrastructure."
            />
            <MetricCard
              title="Carbon Footprint"
              value={current.carbon}
              unit="kg CO2"
              icon={Leaf}
              trend={getTrend(current.carbon, prev.carbon)}
              color="emerald"
              description="Estimated emissions based on dynamic energy source mix and grid intensity."
            />
          </div>
        </section>

        {/* Section 3: Secondary Metrics (Water & Waste) */}
        <section className="space-y-16">
          <div className="flex items-center justify-between px-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-display font-bold tracking-tight text-white">Resource Flow</h2>
              <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.3em]">Auxiliary System Tracking</p>
            </div>
            <div className="text-white/20 font-mono text-[9px] font-bold uppercase tracking-[0.4em]">Zone: Alpha-7</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <MetricCard
              title="Water Usage"
              value={current.water}
              unit="Liters"
              icon={Droplets}
              trend={getTrend(current.water, prev.water)}
              color="aqua"
              size="small"
              description="Real-time flow rate across all building zones with anomaly detection."
            />
            <MetricCard
              title="Waste Generation"
              value={current.waste}
              unit="kg"
              icon={Trash2}
              trend={getTrend(current.waste, prev.waste)}
              color="coral"
              size="small"
              description="Daily waste accumulation and automated segregation efficiency tracking."
            />
          </div>
        </section>

        {/* Section 4: Predictive Intelligence */}
        <section className="pt-20">
          <ForecastChart 
            forecasts={forecast} 
            activeMetric={activeMetric}
            setActiveMetric={setActiveMetric}
          />
        </section>

        {/* Section 5: AI Insights & Optimization */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-20 pt-20">
          <div className="lg:col-span-5 space-y-12">
            <div className="px-6 space-y-3">
              <h2 className="text-4xl font-display font-bold tracking-tight text-white capitalize">{buildingType} {activeMetric} Optimization</h2>
              <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.3em]">Neural Insights & Protocols</p>
            </div>
            
            <div className="space-y-6">
              {insightsLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-8 glass rounded-[3rem] animate-pulse">
                      <div className="h-6 bg-white/5 rounded w-3/4 mb-4" />
                      <div className="h-4 bg-white/5 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                insights
                  .filter(insight => insight.type === activeMetric) // Strict filtering for personalization
                  .map((insight, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.6 }}
                      className="group p-8 glass glass-hover rounded-[3rem] cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-5">
                        <div className="flex items-center gap-4">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] group-hover:scale-125 transition-transform duration-500" />
                          <h4 className="font-display font-bold text-lg text-white group-hover:glow-text-green transition-all duration-500">{insight.title}</h4>
                        </div>
                        <span className="text-[9px] font-mono font-black text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-emerald-500/20">
                          -{insight.impact}%
                        </span>
                      </div>
                      <p className="text-[11px] text-white/30 leading-relaxed mb-8 font-medium group-hover:text-white/50 transition-colors">
                        {insight.description}
                      </p>
                      <div className="flex items-center justify-between pt-6 border-t border-white/[0.03]">
                        <span className="text-[9px] text-white/20 uppercase font-mono font-black tracking-[0.4em] group-hover:text-emerald-400 transition-colors">{insight.action}</span>
                        <ChevronRight size={16} className="text-white/10 group-hover:text-emerald-500 transition-all duration-500 group-hover:translate-x-2" />
                      </div>
                    </motion.div>
                  ))
              )}
              {!insightsLoading && insights.filter(insight => insight.type === activeMetric).length === 0 && (
                <div className="p-8 glass rounded-[3rem] text-center">
                  <p className="text-white/20 font-mono text-[10px] uppercase tracking-widest">No specific {activeMetric} protocols detected for this cycle.</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-12">
            <div className="glass rounded-[4rem] p-12 h-full flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-center mb-12">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-display font-bold tracking-tight text-white group-hover:glow-text-green transition-all duration-500">Impact Matrix</h3>
                    <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.3em]">{buildingType} {activeMetric} Protocol Simulation</p>
                  </div>
                  <button 
                    onClick={() => setIsOptimizing(!isOptimizing)}
                    className={`px-10 py-5 rounded-[1.5rem] font-mono font-black text-[9px] uppercase tracking-[0.4em] transition-all duration-500 ${
                      isOptimizing 
                      ? 'bg-emerald-500 text-black shadow-[0_0_50px_rgba(16,185,129,0.4)] scale-105' 
                      : 'bg-white/[0.03] text-white/30 hover:bg-white/[0.08] hover:text-white/60 border border-white/[0.05]'
                    }`}
                  >
                    {isOptimizing ? 'Neural Sync Active' : 'Execute Protocol'}
                  </button>
                </div>

                <div className="space-y-8">
                  {[
                    activeMetric === 'energy' && { 
                      label: buildingType === 'Hospital' ? 'Life Support Efficiency' : 'Operational Cost', 
                      before: `$${Math.round(current.energy * 0.15)}`, 
                      after: `$${Math.round(current.energy * (buildingType === 'Hospital' ? 0.13 : 0.12))}`, 
                      icon: TrendingDown, 
                      color: 'text-emerald-400' 
                    },
                    activeMetric === 'carbon' && { 
                      label: buildingType === 'Campus' ? 'Campus Footprint' : 'Carbon Offset', 
                      before: '0 kg', 
                      after: `${Math.round(current.carbon * (buildingType === 'Office' ? 0.22 : 0.18))} kg`, 
                      icon: Leaf, 
                      color: 'text-blue-400' 
                    },
                    activeMetric === 'water' && { 
                      label: buildingType === 'Residential' ? 'Community Recovery' : 'Water Recovery', 
                      before: '0 L', 
                      after: `${Math.round(current.water * (buildingType === 'Residential' ? 0.30 : 0.25))} L`, 
                      icon: Droplets, 
                      color: 'text-cyan-400' 
                    },
                    activeMetric === 'waste' && { 
                      label: buildingType === 'Hospital' ? 'Bio-Waste Diversion' : 'Diversion Rate', 
                      before: '45%', 
                      after: buildingType === 'Hospital' ? '94%' : '82%', 
                      icon: Trash2, 
                      color: 'text-orange-400' 
                    },
                    { 
                      label: `${buildingType} Efficiency`, 
                      before: '0%', 
                      after: buildingType === 'Office' ? '22.1%' : '18.4%', 
                      icon: Zap, 
                      color: 'text-orange-400' 
                    },
                  ].filter(Boolean).map((item: any, idx) => (
                    <div key={idx} className="p-10 bg-white/[0.01] rounded-[2.5rem] border border-white/[0.02] flex items-center justify-between group/item hover:bg-white/[0.03] hover:border-white/[0.05] transition-all duration-500">
                      <div className="flex items-center gap-8">
                        <div className="w-14 h-14 rounded-2xl bg-white/[0.02] flex items-center justify-center text-white/10 group-hover/item:text-white/30 group-hover/item:scale-110 transition-all duration-500 shadow-inner">
                          <item.icon size={28} strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-[9px] font-mono font-black text-white/20 uppercase tracking-[0.4em] mb-2">{item.label}</p>
                          <p className="text-2xl font-mono font-bold text-white/40 line-through decoration-white/10">{item.before}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-mono font-black text-emerald-500 uppercase tracking-[0.4em] mb-2">Target</p>
                        <p className={cn("text-4xl font-mono font-bold glow-text-green", item.color)}>{item.after}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-16 p-8 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-[2rem] flex items-start gap-6 group/alert hover:bg-emerald-500/[0.04] transition-all duration-500">
                <AlertCircle className="text-emerald-500/40 mt-1 group-hover/alert:scale-110 transition-transform duration-500" size={28} />
                <p className="text-xs text-white/30 leading-relaxed font-mono group-hover:text-white/50 transition-colors">
                  <span className="text-emerald-400 font-bold uppercase tracking-widest block mb-1">System Alert:</span>
                  Neural engine detected a 12% increase in peak demand for the next cycle. 
                  Optimization protocols are recommended to maintain index stability.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-16 py-32 mt-40 border-t border-white/[0.03] bg-gradient-to-b from-transparent to-black/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-20">
          <div className="flex flex-col items-center md:items-start gap-8">
            <div className="flex items-center gap-6 group cursor-pointer">
              <Leaf className="text-emerald-500 group-hover:scale-125 transition-transform duration-500" size={36} />
              <span className="text-4xl font-display font-bold tracking-tighter text-white group-hover:glow-text-green transition-all duration-500">ECOSPHERE AI</span>
            </div>
            <p className="text-[10px] text-white/20 font-mono font-bold uppercase tracking-[0.6em]">Intelligence for a sustainable future</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-16 text-[10px] font-mono font-black text-white/20 uppercase tracking-[0.4em]">
            <a href="#" className="hover:text-emerald-400 transition-colors">Network</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Protocols</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Intelligence</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Security</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-16 border-t border-white/[0.02] flex justify-between items-center text-[10px] font-mono font-bold text-white/10 uppercase tracking-[0.5em]">
          <span>© 2026 ECOSPHERE INTELLIGENCE CORP</span>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>v4.0.2-STABLE_BUILD</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
