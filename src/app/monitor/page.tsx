"use client";
import { motion } from "framer-motion";
import { Database, Server, Box, CheckCircle2, RefreshCw } from "lucide-react";
import { clsx } from "clsx";
import { useDataContext } from "@/context/DataContext";

export default function PipelineMonitor() {
  const { status, logs, rawData, cleanedData } = useDataContext();

  const pipelineStages = [
    { 
      id: 1, 
      name: "Extract", 
      status: (status === "extracting" ? "running" : (status === "transforming" || status === "loading" || status === "success" ? "success" : "pending")), 
      icon: Database, 
      records: rawData.length ? rawData.length.toLocaleString() : "-", 
      description: "Parsing and loading CSV into memory" 
    },
    { 
      id: 2, 
      name: "Transform", 
      status: (status === "transforming" ? "running" : (status === "loading" || status === "success" ? "success" : "pending")), 
      icon: RefreshCw, 
      records: cleanedData.length ? cleanedData.length.toLocaleString() : "-", 
      description: "Cleaning data & dropping invalid rows" 
    },
    { 
      id: 3, 
      name: "Load", 
      status: (status === "loading" ? "running" : (status === "success" ? "success" : "pending")), 
      icon: Server, 
      records: cleanedData.length ? cleanedData.length.toLocaleString() : "-", 
      description: "Ready for Visualization" 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">ETL Pipeline Monitor</h1>
          <p className="text-sm text-slate-400 mt-1">Live tracking of active processing</p>
        </div>
        <div className="flex gap-2">
          {status === "idle" && (
            <span className="px-3 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-full text-xs font-semibold flex items-center gap-1.5 text-center px-4">
              Awaiting Start
            </span>
          )}
          {(status === "extracting" || status === "transforming" || status === "loading") && (
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-semibold flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> RUNNING
            </span>
          )}
          {status === "success" && (
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> COMPLETED
            </span>
          )}
        </div>
      </div>

      {/* Pipeline Visualizer */}
      <div className="glass-panel rounded-2xl p-8 relative">
        <div className="absolute top-1/2 left-10 right-10 h-1 bg-slate-800 -translate-y-1/2 z-0 hidden md:block"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {pipelineStages.map((stage, index) => {
            const Icon = stage.icon;
            const isSuccess = stage.status === "success";
            const isRunning = stage.status === "running";
            const isPending = stage.status === "pending";

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={clsx(
                  "bg-slate-900 border rounded-xl p-5 shadow-xl transition-all",
                  isSuccess ? "border-emerald-500/50 shadow-emerald-500/5 bg-slate-800/50" :
                  isRunning ? "border-blue-500 shadow-blue-500/20 ring-1 ring-blue-500/50" :
                  "border-slate-800 opacity-60"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={clsx(
                    "p-2.5 rounded-lg",
                    isSuccess ? "bg-emerald-500/10 text-emerald-400" :
                    isRunning ? "bg-blue-500/10 text-blue-400" :
                    "bg-slate-800 text-slate-500"
                  )}>
                    <Icon className={clsx("w-6 h-6", isRunning && "animate-spin-slow")} />
                  </div>
                  {isSuccess && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                  {isRunning && <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />}
                  {isPending && <Box className="w-6 h-6 text-slate-600" />}
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1">{stage.name}</h3>
                <p className="text-xs text-slate-400 mb-4 h-8">{stage.description}</p>
                
                <div className="pt-4 border-t border-slate-800 flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Rows: <span className="text-slate-300">{stage.records}</span></span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Logs Panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-panel rounded-2xl overflow-hidden flex flex-col h-[400px]"
      >
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-400" /> Live Execution Logs
          </h2>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto space-y-1 bg-[#0a0f1c] font-mono text-xs flex flex-col-reverse">
          <div className="flex flex-col gap-1">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className={clsx(
                  "py-1.5 px-3 rounded hover:bg-slate-800/50 transition-colors flex gap-4",
                  log.level === "ERROR" && "bg-red-500/10 text-red-400 hover:bg-red-500/20",
                  log.level === "WARN" && "text-amber-400",
                  log.level === "SUCCESS" && "text-emerald-400"
                )}
              >
                <span className="text-slate-500 shrink-0">[{log.time}]</span>
                <span className={clsx(
                  "w-16 font-semibold shrink-0",
                  log.level === "INFO" ? "text-blue-400" :
                  log.level === "WARN" ? "text-amber-500" :
                  log.level === "SUCCESS" ? "text-emerald-500" : "text-red-500"
                )}>
                  {log.level}
                </span>
                <span className={clsx(
                  log.level === "INFO" && "text-slate-300",
                  log.level === "WARN" && "text-amber-200",
                  log.level === "SUCCESS" && "text-emerald-200"
                )}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
          {(status === "extracting" || status === "transforming" || status === "loading") && (
            <div className="py-2 px-3 flex items-center gap-2 text-slate-500 mt-2 mb-4">
              <span className="w-2 h-4 bg-slate-500 animate-pulse"></span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
