"use client";
import { useState, useRef } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";
import { Activity, Database, CheckCircle, AlertTriangle, ArrowUpRight, ArrowDownRight, UploadCloud, FileText } from "lucide-react";
import { clsx } from "clsx";
import { useDataContext } from "@/context/DataContext";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"];

export default function DashboardOverview() {
  const { rawData, cleanedData, metrics, status, uploadFile, runPipeline } = useDataContext();
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
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">ETL Data Engineering</h1>
          <p className="text-slate-400 max-w-lg mx-auto">Upload a raw CSV dataset to instantly process, clean, and visualize the data securely in your browser.</p>
        </div>
        
        <form 
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={clsx(
            "w-full max-w-2xl h-80 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
            dragActive ? "border-blue-500 bg-blue-500/10 shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)] scale-105" : "border-slate-700 bg-slate-900/50 hover:bg-slate-800/80 hover:border-slate-500"
          )}
        >
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleChange} />
          
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6 shadow-xl relative group">
            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <UploadCloud className="w-10 h-10 text-blue-500" />
          </div>
          
          <h3 className="text-2xl font-semibold text-white mb-2">Upload Raw dataset</h3>
          <p className="text-sm text-slate-400">Drag & drop your .csv file here or click to browse</p>
        </form>
      </div>
    );
  }

  // Generate visualization data dynamically from actual metrics
  const sizeComparison = [
    { name: "Original Size", rows: rawData.length },
    { name: "Cleaned Size", rows: cleanedData.length },
  ];

  const beforeAfterDistribution = metrics ? [
    { name: "Valid Data", value: metrics.totalCleanedRows },
    { name: "Missing Values", value: metrics.missingValuesRemoved },
    { name: "Duplicates", value: metrics.duplicatesRemoved },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time ETL processing metrics and health status.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700">
            Upload new CSV
          </button>
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleChange} />
          {status === 'idle' && (
            <button onClick={runPipeline} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20">
              Run Pipeline manually
            </button>
          )}
          {status !== 'idle' && status !== 'success' && status !== 'error' && (
             <span className="px-4 py-2 bg-amber-500/10 text-amber-500 text-sm font-medium rounded-lg border border-amber-500/20 animate-pulse">
               Processing...
             </span>
          )}
           {status === 'success' && (
             <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 text-sm font-medium rounded-lg border border-emerald-500/20">
               Pipeline Complete
             </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Records Extracted" 
          value={rawData.length.toLocaleString()} 
          change="Input Data" 
          trend="neutral" 
          icon={Database} 
          delay={0.1}
        />
        <MetricCard 
          title="Data Quality Score" 
          value={metrics ? `${metrics.qualityScore}%` : "0%"} 
          change="After rules" 
          trend={metrics && metrics.qualityScore > 90 ? "up" : "down"} 
          icon={CheckCircle} 
          delay={0.2}
          color={metrics && metrics.qualityScore > 90 ? "text-emerald-500" : "text-amber-500"}
        />
        <MetricCard 
          title="Cleaned Records Loaded" 
          value={cleanedData.length.toLocaleString()} 
          change="Ready to query" 
          trend="neutral" 
          icon={Activity} 
          delay={0.3}
          color="text-indigo-500"
        />
        <MetricCard 
          title="Rows Dropped" 
          value={metrics ? (metrics.missingValuesRemoved + metrics.duplicatesRemoved).toLocaleString() : "0"} 
          change="Anomalies detected" 
          trend="down" 
          icon={AlertTriangle} 
          delay={0.4}
          color="text-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 glass-panel rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-6">Data Condensation (Row Count)</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sizeComparison} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 13 }} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', color: '#f8fafc' }}
                />
                <Bar dataKey="rows" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={100}>
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
          className="glass-panel rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-6">Pipeline Transformations</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {metrics ? (
                <PieChart>
                  <Pie
                    data={beforeAfterDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {beforeAfterDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend iconType="circle" />
                </PieChart>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">
                  Run pipeline to see chart
                </div>
              )}
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Total Rows Extracted:</span>
              <span className="text-white font-medium">{rawData.length.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, trend, icon: Icon, delay, color = "text-blue-500" }: any) {
  const isPositiveTrend = trend === "up";
  const TrendIcon = isPositiveTrend ? ArrowUpRight : ArrowDownRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-panel p-6 rounded-2xl relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex justify-between items-start mb-4">
        <div className={clsx("p-2 rounded-lg bg-slate-800", color)}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== "neutral" && (
          <div className={clsx(
            "flex items-center text-xs font-medium px-2 py-1 rounded-full",
            isPositiveTrend && color !== "text-amber-500" ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"
          )}>
            <TrendIcon className="w-3 h-3 mr-1" />
            {change}
          </div>
        )}
        {trend === "neutral" && (
          <div className="flex items-center text-xs font-medium px-2 py-1 rounded-full text-slate-400 bg-slate-800">
            {change}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </motion.div>
  );
}
