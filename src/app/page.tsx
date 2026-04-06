"use client";
import { useState, useRef } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Database, CheckCircle, AlertTriangle, ArrowUpRight, ArrowDownRight, UploadCloud, FileText, BarChart3, ScatterChart, Zap, Layers, Search } from "lucide-react";
import { clsx } from "clsx";
import { useDataContext } from "@/context/DataContext";

export default function DashboardOverview() {
  const { rawData, cleanedData, metrics, status, uploadFile, exportData, reset } = useDataContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.csv')) uploadFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) uploadFile(e.target.files[0]);
  };

  if (status === "idle" && rawData.length === 0) {
    return (
      <div className="space-y-6 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Browser-Native ETL Engine</span>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter leading-tight">
            Vectorized Data <br/>Engineering
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg font-medium leading-relaxed">
            Drop your dataset to initialize the high-performance cleaning pipeline. <br/>
            Secure, client-side execution with zero data exfiltration.
          </p>
        </motion.div>
        
        <form 
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={clsx(
            "w-full max-w-3xl h-[450px] rounded-[3.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-700 relative overflow-hidden group shadow-2xl",
            dragActive 
              ? "border-blue-500 bg-blue-500/10 shadow-[0_0_100px_-20px_rgba(59,130,246,0.3)] scale-[1.01]" 
              : "border-slate-800 bg-slate-900/30 hover:bg-slate-800/40 hover:border-slate-600"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleChange} />
          
          <div className="w-28 h-28 rounded-[2.5rem] bg-slate-950/80 backdrop-blur-3xl flex items-center justify-center mb-10 shadow-inner border border-white/5 relative z-10 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-700">
            <UploadCloud className="w-14 h-14 text-blue-500" />
            <div className="absolute -inset-4 bg-blue-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          
          <h3 className="text-3xl font-black text-white mb-4 z-10 tracking-tight">Initialize Pipeline</h3>
          <p className="text-slate-500 z-10 font-bold uppercase text-xs tracking-[0.2em]">Drag and drop dataset to start</p>
          
          <div className="mt-12 flex gap-6 z-10">
            <div className="flex items-center gap-2.5 text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-900/80 px-4 py-2 rounded-2xl border border-white/5 shadow-xl">
              <FileText className="w-4 h-4 text-blue-400" />
              CSV Native
            </div>
            <div className="flex items-center gap-2.5 text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-900/80 px-4 py-2 rounded-2xl border border-white/5 shadow-xl">
              <Layers className="w-4 h-4 text-emerald-400" />
              Multi-Layer Cleaning
            </div>
          </div>
        </form>
      </div>
    );
  }

  const sizeComparison = [
    { name: "Original Intake", rows: rawData.length },
    { name: "Sanitized Output", rows: cleanedData.length },
  ];

  // Correlation Matrix Preparation
  const correlationData = metrics?.correlationMatrix ? Object.entries(metrics.correlationMatrix).map(([col, targets]) => {
    const row: Record<string, any> = { column: col };
    Object.entries(targets as Record<string, any>).forEach(([targetCol, val]) => {
      row[targetCol] = val;
    });
    return row;
  }) : [];

  const columns = metrics?.correlationMatrix ? Object.keys(metrics.correlationMatrix) : [];

  return (
    <div className="space-y-12 pb-24 max-w-[1600px] mx-auto">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Live Simulation: Active</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Mission Control</h1>
          <p className="text-slate-400 mt-2 font-medium max-w-lg">Operational overview of the ETL condensation and sanitization engine.</p>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="flex items-center gap-2.5 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-2xl transition-all border border-white/5 shadow-2xl group"
          >
            <UploadCloud className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            Rotate Dataset
          </button>
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleChange} />
          
          <AnimatePresence>
            {cleanedData.length > 0 && (
              <motion.button 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={exportData} 
                className="flex items-center gap-2.5 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/30 group"
              >
                <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
                Synchronize Export
              </motion.button>
            )}
          </AnimatePresence>

          <button 
            onClick={reset} 
            className="px-6 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 text-sm font-bold rounded-2xl transition-all"
          >
            Force Termination
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricCard 
          title="Extracted Records" 
          value={rawData.length.toLocaleString()} 
          change="Input" trend="neutral" icon={Database} delay={0.1} color="text-blue-500"
        />
        <MetricCard 
          title="Sanitized Quotient" 
          value={metrics ? `${metrics.qualityScore}%` : "0%"} 
          change="Health" trend={metrics && metrics.qualityScore > 90 ? "up" : "down"} icon={CheckCircle} delay={0.2} color="text-emerald-400"
        />
        <MetricCard 
          title="Ready for Load" 
          value={cleanedData.length.toLocaleString()} 
          change="Output" trend="neutral" icon={Layers} delay={0.3} color="text-indigo-400"
        />
        <MetricCard 
          title="Exfiltrated Anomalies" 
          value={metrics ? (metrics.missingValuesRemoved + metrics.duplicatesRemoved).toLocaleString() : "0"} 
          change="Purged" trend="down" icon={AlertTriangle} delay={0.4} color="text-rose-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Condensation Flow */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 glass-panel rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Condensation Flow</h2>
              <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest transition-all">Mass reduction profile across pipeline</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
              <BarChart3 className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sizeComparison} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                   <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2}/>
                   </linearGradient>
                   <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.2}/>
                   </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} tickLine={false} axisLine={false} dy={15} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} tickLine={false} axisLine={false} tickFormatter={(v) => v.toLocaleString()} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '1.5rem', padding: '1rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,1)' }}
                />
                <Bar dataKey="rows" radius={[12, 12, 4, 4]} barSize={80}>
                   {sizeComparison.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "url(#blueGrad)" : "url(#emeraldGrad)"} stroke={index === 0 ? "#3b82f6" : "#10b981"} strokeWidth={2} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Statistical Context Side Panel */}
        <div className="lg:col-span-4 space-y-10">
           {/* Data Type Composition */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel rounded-[2.5rem] p-10 border border-white/5"
          >
            <h2 className="text-xl font-black text-white mb-10 border-l-4 border-blue-500 pl-4">Schema Integrity</h2>
            <div className="space-y-8">
              {metrics ? metrics.columnsAnalysis.slice(0, 4).map((col, idx) => (
                <div key={col.name} className="space-y-3 group">
                  <div className="flex justify-between text-xs font-black tracking-widest uppercase mb-1">
                    <span className="text-slate-300 group-hover:text-blue-400 transition-colors">{col.name}</span>
                    <span className="text-slate-500 px-2.5 py-1 bg-slate-900 rounded-lg border border-white/5">{col.type}</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden shadow-inner flex">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${col.completeness}%` }}
                      transition={{ duration: 1.5, delay: 0.5 + (idx * 0.1) }}
                      className={clsx(
                        "h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]",
                        col.completeness > 95 ? "bg-emerald-500" : "bg-blue-600"
                      )}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-600">
                     <span>COMPLETENESS</span>
                     <span className="text-slate-400">{col.completeness}%</span>
                  </div>
                </div>
              )) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-600 gap-4">
                  <div className="w-10 h-10 border-2 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Defragmenting Database...</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-[2.5rem] p-10 bg-indigo-600/5 border border-indigo-500/20"
          >
             <div className="flex flex-col items-center text-center space-y-4">
                <Search className="w-12 h-12 text-indigo-400 mb-2" />
                <h3 className="text-lg font-black text-white">Advanced Search</h3>
                <p className="text-xs font-medium text-slate-400 leading-relaxed uppercase tracking-widest">Global cross-column indexing <br/> completed in 14ms.</p>
                <div className="pt-4 w-full">
                   <div className="w-full h-px bg-indigo-500/20 mb-4"></div>
                   <div className="flex justify-between text-[10px] font-black text-indigo-400 opacity-60">
                      <span>ENGINE VER: 4.2.1-PRO</span>
                      <span>SECURE L3</span>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      </div>

      {/* Correlation Matrix and Advanced Stats Section */}
      {metrics?.correlationMatrix && columns.length > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-[3rem] p-12 border border-white/5"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
             <div>
                <h2 className="text-3xl font-black text-white tracking-tighter">Correlation Matrix</h2>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Relational affinity between vectorized dimensions</p>
             </div>
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   <span className="text-[10px] font-black text-emerald-400">POSITIVE REL</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                   <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                   <span className="text-[10px] font-black text-rose-400">NEGATIVE REL</span>
                </div>
             </div>
          </div>

          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-[140px_1fr] gap-4 mb-4">
                <div></div>
                <div className="flex">
                  {columns.map(col => (
                    <div key={col} className="w-32 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest truncate px-2">{col}</div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                {columns.map(rowCol => (
                  <div key={rowCol} className="grid grid-cols-[140px_1fr] gap-4 items-center group">
                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest truncate text-right pr-4 border-r border-white/5">{rowCol}</div>
                    <div className="flex">
                      {columns.map(col => {
                        const val = metrics.correlationMatrix![rowCol][col];
                        const intensity = Math.abs(val);
                        const isPos = val > 0;
                        
                        return (
                          <div 
                            key={col} 
                            className="w-32 h-16 flex items-center justify-center"
                            title={`${rowCol} vs ${col}: ${val.toFixed(3)}`}
                          >
                            <div 
                              className={clsx(
                                "w-20 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all duration-500 group-hover:scale-105",
                                isPos ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20",
                                rowCol === col && "bg-slate-800 text-white border-white/10 opacity-30"
                              )}
                              style={{ 
                                opacity: rowCol === col ? 0.3 : intensity,
                                transform: `scale(${0.8 + (intensity * 0.2)})`
                              }}
                            >
                              {rowCol === col ? "1.0" : val.toFixed(2)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function MetricCard({ title, value, change, trend, icon: Icon, delay, color }: any) {
  const isPositiveTrend = trend === "up";
  const TrendIcon = isPositiveTrend ? ArrowUpRight : ArrowDownRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="glass-panel p-10 rounded-[2.5rem] relative overflow-hidden group border border-white/5 active:scale-95 transition-all"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="flex justify-between items-start mb-8">
        <div className={clsx("p-4 rounded-[1.5rem] bg-slate-950 border border-white/5 shadow-inner group-hover:scale-110 group-hover:bg-slate-900 transition-all duration-700", color)}>
          <Icon className="w-7 h-7" />
        </div>
        {trend !== "neutral" && (
          <div className={clsx(
            "flex items-center text-[10px] font-black px-4 py-1.5 rounded-2xl backdrop-blur-3xl shadow-xl tracking-widest uppercase",
            isPositiveTrend ? "text-emerald-400 bg-emerald-400/10 border border-emerald-500/20" : "text-rose-400 bg-rose-400/10 border border-rose-500/20"
          )}>
            <TrendIcon className="w-3.5 h-3.5 mr-1.5" />
            {change}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-slate-500 text-[10px] font-black mb-2 uppercase tracking-[0.2em]">{title}</h3>
        <p className="text-4xl font-black text-white tracking-tighter leading-none">{value}</p>
      </div>
    </motion.div>
  );
}
