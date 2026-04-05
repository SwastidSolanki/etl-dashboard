"use client";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, XCircle, FileWarning } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useDataContext } from "@/context/DataContext";

export default function QualityDashboard() {
  const { metrics, rawData } = useDataContext();

  if (!metrics || rawData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        No data available. Upload a CSV to view quality analytics.
      </div>
    );
  }

  const qualityDistribution = [
    { name: "Valid Records", value: metrics.totalCleanedRows, color: "#10b981" },
    { name: "Missing Values", value: metrics.missingValuesRemoved, color: "#f59e0b" },
    { name: "Duplicates", value: metrics.duplicatesRemoved, color: "#6366f1" },
  ].filter(item => item.value > 0);

  // Take top 8 columns with issues
  const validationByColumn = [...metrics.columnsAnalysis]
    .sort((a, b) => b.invalid - a.invalid)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Data Quality Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Detailed analysis of data integrity from the uploaded CSV dataset.</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border-emerald-500/20">
          <div className="flex items-center gap-3 text-emerald-400 mb-2">
            <CheckCircle className="w-5 h-5" />
            <h3 className="font-semibold text-sm">Overall Health Score</h3>
          </div>
          <p className="text-3xl font-bold text-white">{metrics.qualityScore}%</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl border-amber-500/20">
          <div className="flex items-center gap-3 text-amber-400 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold text-sm">Missing Values Found</h3>
          </div>
          <p className="text-3xl font-bold text-white">{metrics.missingValuesRemoved}</p>
          <p className="text-xs text-slate-400 mt-2">{((metrics.missingValuesRemoved / metrics.totalOriginalRows) * 100).toFixed(1)}% of total rows</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl border-indigo-500/20">
          <div className="flex items-center gap-3 text-indigo-400 mb-2">
            <FileWarning className="w-5 h-5" />
            <h3 className="font-semibold text-sm">Exact Duplicates Removed</h3>
          </div>
          <p className="text-3xl font-bold text-white">{metrics.duplicatesRemoved}</p>
          <p className="text-xs text-slate-400 mt-2">{((metrics.duplicatesRemoved / metrics.totalOriginalRows) * 100).toFixed(1)}% of total rows</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-2xl"
        >
          <h2 className="text-lg font-semibold text-white mb-6">Record Composition</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={qualityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {qualityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center flex-wrap gap-4 mt-6">
            {qualityDistribution.map(metric => (
              <div key={metric.name} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: metric.color }}></span>
                <span className="text-slate-300">{metric.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Column Health */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-2xl"
        >
          <h2 className="text-lg font-semibold text-white mb-6">Validation by Derived Column</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBar data={validationByColumn} layout="vertical" margin={{ left: 50, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13 }} width={120} />
                <RechartsTooltip 
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem' }}
                />
                <Bar dataKey="valid" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={24} name="Valid %" />
                <Bar dataKey="invalid" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} name="Missing %" />
              </RechartsBar>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
