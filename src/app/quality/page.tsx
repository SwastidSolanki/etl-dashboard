"use client";
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, FileWarning, BarChart as BarChartIcon, Target, Search } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useDataContext } from "@/context/DataContext";
import { clsx } from "clsx";
import QualityGuard from "@/components/QualityGuard";

export default function QualityDashboard() {
  const { metrics, rawData } = useDataContext();

  if (!metrics || rawData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 max-w-2xl mx-auto px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-10 bg-slate-900/40 rounded-[3rem] border border-white/5 relative overflow-hidden"
        >
           <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
           <Search className="w-16 h-16 text-blue-500/30 mx-auto mb-6" />
           <h2 className="text-2xl font-black text-white tracking-tight">Quality Intel Awaiting Data</h2>
           <p className="text-slate-500 font-medium mt-3 leading-relaxed">Initialize a pipeline from the mission control panel to enable real-time integrity telemetry.</p>
        </motion.div>
        
        <div className="w-full">
           <QualityGuard />
        </div>
      </div>
    );
  }

  const qualityDistribution = [
    { name: "Valid Records", value: metrics.cleanedCount, color: "#10b981" },
    { name: "Missing Values", value: metrics.missingValuesRemoved, color: "#f59e0b" },
    { name: "Duplicates", value: metrics.duplicatesRemoved, color: "#6366f1" },
  ].filter(item => item.value > 0);

  // Data for Completeness Heatmap
  const completenessData = metrics.columnsAnalysis.map(col => ({
    name: col.name,
    completeness: col.completeness,
    missing: 100 - col.completeness
  })).sort((a, b) => a.completeness - b.completeness);

  return (
    <div className="space-y-12 max-w-[1600px] mx-auto pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Telemetry Active</span>
           </div>
           <h1 className="text-4xl font-black text-white tracking-tighter">Quality Intelligence</h1>
           <p className="text-slate-400 mt-2 font-medium max-w-xl">Deep relational analysis of record integrity, schema consistency, and statistical drift.</p>
        </div>
        <div className="px-8 py-4 bg-emerald-600/10 border border-emerald-500/30 rounded-[2rem] shadow-2xl backdrop-blur-3xl group hover:border-emerald-500 transition-all">
           <div className="flex items-center gap-5">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                 <Target className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1.5">Kernel Trust Score</p>
                 <span className="text-2xl font-black text-white tracking-tighter">{metrics.qualityScore}%</span>
              </div>
           </div>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <QualityCard 
          icon={CheckCircle} 
          label="Consolidated Score" 
          value={`${metrics.qualityScore}%`} 
          subValue="Kernel Integrity"
          color="emerald"
          delay={0.1}
        />
        <QualityCard 
          icon={AlertTriangle} 
          label="Null Purge Impact" 
          value={metrics.missingValuesRemoved.toLocaleString()} 
          subValue={`${((metrics.missingValuesRemoved / metrics.originalCount) * 100).toFixed(1)}% of set`}
          color="amber"
          delay={0.2}
        />
        <QualityCard 
          icon={FileWarning} 
          label="Redundancy Purged" 
          value={metrics.duplicatesRemoved.toLocaleString()} 
          subValue={`${((metrics.duplicatesRemoved / metrics.originalCount) * 100).toFixed(1)}% deduplicated`}
          color="indigo"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8">
            <QualityGuard />
         </div>
         <div className="lg:col-span-4 h-full">
            <motion.div 
               initial={{ opacity: 0, x: 30 }}
               animate={{ opacity: 1, x: 0 }}
               className="glass-panel p-10 rounded-[3rem] border border-white/5 h-full relative overflow-hidden"
            >
               <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-indigo-500/10 blur-3xl opacity-30"></div>
               <h2 className="text-xl font-black text-white mb-10 border-l-4 border-indigo-500 pl-4 uppercase tracking-widest">Quality Mix</h2>
               <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={qualityDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={90}
                        outerRadius={130}
                        paddingAngle={10}
                        dataKey="value"
                        stroke="none"
                     >
                        {qualityDistribution.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Pie>
                     <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '1.5rem', color: '#f8fafc', fontWeight: 'bold' }} 
                     />
                  </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="space-y-4 mt-6">
                  {qualityDistribution.map((item) => (
                     <div key={item.name} className="flex items-center justify-between p-4 bg-slate-950/50 border border-white/5 rounded-2xl group transition-all hover:bg-slate-900/50">
                        <div className="flex items-center gap-3">
                           <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                           <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-100 transition-colors">{item.name}</span>
                        </div>
                        <span className="text-sm font-black text-white">{item.value.toLocaleString()}</span>
                     </div>
                  ))}
               </div>
            </motion.div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Column Completeness */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-10 rounded-[3rem] border border-white/5"
        >
          <div className="flex items-center justify-between mb-10">
             <h2 className="text-2xl font-black text-white tracking-tight uppercase tracking-widest">Completeness Scatter</h2>
             <div className="p-3 bg-slate-900 rounded-2xl border border-white/5">
                <BarChartIcon className="w-6 h-6 text-slate-400" />
             </div>
          </div>
          <div className="h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBar data={completenessData} layout="vertical" margin={{ left: 40, right: 30, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#1e293b" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 800 }} width={110} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,1)' }}
                />
                <Bar dataKey="completeness" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={22} name="Operational %" />
                <Bar dataKey="missing" stackId="a" fill="#1e293b" radius={[0, 8, 8, 0]} name="Incomplete %" />
              </RechartsBar>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Statistical Deviations */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-10 rounded-[3rem] border border-white/5 bg-rose-500/[0.02]"
        >
          <div className="flex items-center justify-between mb-10">
             <h2 className="text-2xl font-black text-white tracking-tight uppercase tracking-widest">Schema Drift</h2>
             <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
             </div>
          </div>
          <div className="h-[450px] flex flex-col items-center justify-center text-slate-500 space-y-6">
             <div className="w-24 h-24 rounded-full border-4 border-slate-900 border-t-emerald-500 animate-[spin_3s_linear_infinite] flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
             </div>
             <div className="text-center">
                <p className="text-lg font-black text-white">NOMINAL STABILITY</p>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mt-1">Zero critical drifts detected in the current kernel</p>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function QualityCard({ icon: Icon, label, value, subValue, color, delay }: any) {
  const colorMap = {
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-panel p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group shadow-3xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="flex items-center gap-6 mb-10">
        <div className={clsx("p-4 rounded-2xl border", colorMap[color as keyof typeof colorMap])}>
          <Icon className="w-7 h-7" />
        </div>
        <div className="flex-1 min-w-0">
           <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none mb-2">{label}</p>
           <p className="text-slate-400 text-[10px] font-bold truncate">{subValue}</p>
        </div>
      </div>
      <p className="text-5xl font-black text-white tracking-tighter leading-none">{value}</p>
    </motion.div>
  );
}
