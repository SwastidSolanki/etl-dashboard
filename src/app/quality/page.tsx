"use client";
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, FileWarning, BarChart as BarChartIcon, Target, Search } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { useDataContext } from "@/context/DataContext";
import { clsx } from "clsx";

export default function QualityDashboard() {
  const { metrics, rawData } = useDataContext();

  if (!metrics || rawData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 space-y-6">
        <div className="p-6 bg-slate-900/50 rounded-full border border-slate-800">
           <Search className="w-12 h-12 opacity-20" />
        </div>
        <p className="font-medium tracking-wide">Awaiting dataset upload for quality analysis...</p>
      </div>
    );
  }

  const qualityDistribution = [
    { name: "Valid Records", value: metrics.totalCleanedRows, color: "#10b981" },
    { name: "Missing Values", value: metrics.missingValuesRemoved, color: "#f59e0b" },
    { name: "Duplicates", value: metrics.duplicatesRemoved, color: "#6366f1" },
  ].filter(item => item.value > 0);

  // Data for Completeness Heatmap
  const completenessData = metrics.columnsAnalysis.map(col => ({
    name: col.name,
    completeness: col.completeness,
    missing: 100 - col.completeness
  })).sort((a, b) => a.completeness - b.completeness);

  // Data for Anomaly Detection
  const anomalyData = metrics.columnsAnalysis
    .filter(col => col.outliers !== undefined && col.outliers > 0)
    .map(col => ({
      name: col.name,
      outliers: col.outliers
    }))
    .sort((a, b) => (b.outliers || 0) - (a.outliers || 0));

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Quality Intelligence</h1>
          <p className="text-slate-400 mt-2 font-medium">Deep analysis of record integrity and statistical anomalies.</p>
        </div>
        <div className="px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
           <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-black text-emerald-400 uppercase tracking-widest">Trust Score: {metrics.qualityScore}%</span>
           </div>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <QualityCard 
          icon={CheckCircle} 
          label="Operational Health" 
          value={`${metrics.qualityScore}%`} 
          subValue="Consolidated Score"
          color="emerald"
          delay={0.1}
        />
        <QualityCard 
          icon={AlertTriangle} 
          label="Null Value Impact" 
          value={metrics.missingValuesRemoved.toLocaleString()} 
          subValue={`${((metrics.missingValuesRemoved / metrics.totalOriginalRows) * 100).toFixed(1)}% of dataset`}
          color="amber"
          delay={0.2}
        />
        <QualityCard 
          icon={FileWarning} 
          label="Redundancy Load" 
          value={metrics.duplicatesRemoved.toLocaleString()} 
          subValue={`${((metrics.duplicatesRemoved / metrics.totalOriginalRows) * 100).toFixed(1)}% deduplicated`}
          color="indigo"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Column Completeness */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8 rounded-[2.5rem] border border-white/5"
        >
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-xl font-bold text-white">Completeness Heatmap</h2>
             <div className="p-2 bg-slate-800 rounded-lg">
                <BarChartIcon className="w-5 h-5 text-slate-400" />
             </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBar data={completenessData} layout="vertical" margin={{ left: 40, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#1e293b" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} width={100} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', color: '#f8fafc' }}
                />
                <Bar dataKey="completeness" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={20} name="Valid %" />
                <Bar dataKey="missing" stackId="a" fill="#1e293b" radius={[0, 4, 4, 0]} name="Missing %" />
              </RechartsBar>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Anomaly Distribution */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-8 rounded-[2.5rem] border border-white/5"
        >
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-xl font-bold text-white">Anomaly Distribution</h2>
             <div className="p-2 bg-rose-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
             </div>
          </div>
          <div className="h-[400px]">
            {anomalyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBar data={anomalyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem' }}
                  />
                  <Bar dataKey="outliers" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={40} />
                </RechartsBar>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                 <CheckCircle className="w-12 h-12 text-emerald-500/20" />
                 <p className="text-xs font-black uppercase tracking-widest text-slate-600">No outliers detected in numeric fields</p>
              </div>
            )}
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
      className="glass-panel p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="flex items-center gap-4 mb-6">
        <div className={clsx("p-3 rounded-2xl border", colorMap[color as keyof typeof colorMap])}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
           <p className="text-xs font-black uppercase text-slate-500 tracking-widest">{label}</p>
           <p className="text-slate-400 text-[10px] font-bold mt-0.5">{subValue}</p>
        </div>
      </div>
      <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
    </motion.div>
  );
}
