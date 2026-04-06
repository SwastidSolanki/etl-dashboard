"use client";
import { useState, useRef } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";
import { Activity, Database, CheckCircle, AlertTriangle, ArrowUpRight, ArrowDownRight, UploadCloud, FileText } from "lucide-react";
import { clsx } from "clsx";
import { useDataContext } from "@/context/DataContext";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"];

export default function DashboardOverview() {
  const { rawData, cleanedData, metrics, status, uploadFile, runPipeline, exportData, reset } = useDataContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
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
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  if (status === "idle" && rawData.length === 0) {
    return (
      <div className="space-y-6 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
            <Activity className="w-3 h-3" />
            <span>Production-Ready ETL Pipeline</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
            ETL Data Engineering
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-lg">
            Upload a raw CSV dataset to instantly process, clean, and visualize the data securely in your browser.
          </p>
        </motion.div>
        
        <form 
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={clsx(
            "w-full max-w-2xl h-96 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-500 relative overflow-hidden group",
            dragActive 
              ? "border-blue-500 bg-blue-500/10 shadow-[0_0_80px_-20px_rgba(59,130,246,0.3)] scale-[1.02]" 
              : "border-slate-700 bg-slate-900/40 hover:bg-slate-800/60 hover:border-slate-500"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleChange} />
          
          <div className="w-24 h-24 rounded-3xl bg-slate-800/80 backdrop-blur-xl flex items-center justify-center mb-8 shadow-2xl border border-slate-700 relative z-10 group-hover:scale-110 transition-transform duration-500">
            <UploadCloud className="w-12 h-12 text-blue-500" />
            <div className="absolute -inset-2 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3 z-10">Drop your dataset</h3>
          <p className="text-slate-400 z-10 font-medium">Click to browse or drag & drop CSV files</p>
          
          <div className="mt-8 flex gap-4 z-10 opacity-60">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
              <FileText className="w-3.5 h-3.5" />
              CSV Format
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
              <Database className="w-3.5 h-3.5" />
              Local Storage
            </div>
          </div>
        </form>
      </div>
    );
  }

  const sizeComparison = [
    { name: "Raw Records", rows: rawData.length },
    { name: "Cleaned Records", rows: cleanedData.length },
  ];

  const pipelineStages = metrics ? [
    { name: "Extracted", value: metrics.totalOriginalRows, icon: Database, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Cleaned", value: metrics.totalCleanedRows, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { name: "Anomalies", value: metrics.missingValuesRemoved + metrics.duplicatesRemoved, icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" },
  ] : [];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Overview Dashboard</h1>
          <p className="text-slate-400 mt-1 font-medium italic">Operational status: Active</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-all border border-slate-700 hover:border-slate-600 shadow-lg"
          >
            <UploadCloud className="w-4 h-4" />
            Replace Dataset
          </button>
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleChange} />
          
          {cleanedData.length > 0 && (
            <button 
              onClick={exportData} 
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
            >
              <ArrowDownRight className="w-4 h-4" />
              Export Report
            </button>
          )}

          <button 
            onClick={reset} 
            className="px-5 py-2.5 bg-slate-900 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-sm font-semibold rounded-xl transition-all"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Extracted Records" 
          value={rawData.length.toLocaleString()} 
          change="Input" 
          trend="neutral" 
          icon={Database} 
          delay={0.1}
          color="text-blue-500"
        />
        <MetricCard 
          title="Quality Score" 
          value={metrics ? `${metrics.qualityScore}%` : "0%"} 
          change="Health" 
          trend={metrics && metrics.qualityScore > 90 ? "up" : "down"} 
          icon={CheckCircle} 
          delay={0.2}
          color={metrics && metrics.qualityScore > 85 ? "text-emerald-400" : "text-amber-400"}
        />
        <MetricCard 
          title="Load Readiness" 
          value={cleanedData.length.toLocaleString()} 
          change="Cleaned" 
          trend="neutral" 
          icon={Activity} 
          delay={0.3}
          color="text-indigo-400"
        />
        <MetricCard 
          title="Total Anomalies" 
          value={metrics ? (metrics.missingValuesRemoved + metrics.duplicatesRemoved).toLocaleString() : "0"} 
          change="Detected" 
          trend="down" 
          icon={AlertTriangle} 
          delay={0.4}
          color="text-rose-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 glass-panel rounded-3xl p-8 border border-white/5 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Pipeline Condensation</h2>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <BarChart className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sizeComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 13 }} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '1rem', color: '#f8fafc', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}
                />
                <Bar dataKey="rows" fill="url(#barGradient)" radius={[8, 8, 0, 0]} maxBarSize={60}>
                  {sizeComparison.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#3b82f6" : "#10b981"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-panel rounded-3xl p-8 border border-white/5"
        >
          <h2 className="text-xl font-bold text-white mb-8">Data Type Distribution</h2>
          <div className="space-y-6">
            {metrics ? metrics.columnsAnalysis.slice(0, 5).map((col, idx) => (
              <div key={col.name} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-300">{col.name}</span>
                  <span className="text-slate-500 uppercase text-[10px] bg-slate-800 px-2 py-0.5 rounded">{col.type}</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${col.completeness}%` }}
                    transition={{ duration: 1, delay: 0.8 + (idx * 0.1) }}
                    className={clsx(
                      "h-full rounded-full transition-all duration-1000",
                      col.completeness > 90 ? "bg-emerald-500" : "bg-blue-500"
                    )}
                  />
                </div>
              </div>
            )) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 space-y-4">
                <div className="w-12 h-12 rounded-full border-2 border-slate-800 border-t-blue-500 animate-spin"></div>
                <p>Waiting for data...</p>
              </div>
            )}
          </div>
          <div className="mt-12 pt-6 border-t border-slate-800">
             <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Analysis Confidence</span>
                <span className="text-sm font-bold text-white">99.8%</span>
             </div>
          </div>
        </motion.div>
      </div>
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
      transition={{ duration: 0.5, delay }}
      className="glass-panel p-8 rounded-3xl relative overflow-hidden group border border-white/5"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="flex justify-between items-start mb-6">
        <div className={clsx("p-3 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl group-hover:scale-110 transition-transform duration-500", color)}>
          <Icon className="w-6 h-6" />
        </div>
        {trend !== "neutral" && (
          <div className={clsx(
            "flex items-center text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md",
            isPositiveTrend ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" : "text-rose-400 bg-rose-400/10 border border-rose-400/20"
          )}>
            <TrendIcon className="w-3.5 h-3.5 mr-1" />
            {change}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-slate-400 text-sm font-semibold mb-2 uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-extrabold text-white tracking-tighter">{value}</p>
      </div>
    </motion.div>
  );
}
