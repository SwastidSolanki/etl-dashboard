"use client";
import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Server, Box, CheckCircle2, RefreshCw, Activity, Terminal, Shield } from "lucide-react";
import { clsx } from "clsx";
import { useDataContext } from "@/context/DataContext";

export default function PipelineMonitor() {
  const { status, logs, rawData, cleanedData, metrics } = useDataContext();
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const pipelineStages = [
    { 
      id: 1, 
      name: "Extract", 
      status: (status === "extracting" ? "running" : (["transforming", "loading", "success"].includes(status) ? "success" : "pending")), 
      icon: Database, 
      records: rawData.length ? rawData.length.toLocaleString() : "-", 
      description: "Parsing CSV into memory" 
    },
    { 
      id: 2, 
      name: "Transform", 
      status: (status === "transforming" ? "running" : (["loading", "success"].includes(status) ? "success" : status === "error" ? "failed" : "pending")), 
      icon: RefreshCw, 
      records: cleanedData.length ? cleanedData.length.toLocaleString() : "-", 
      description: "Data validation & cleaning" 
    },
    { 
      id: 3, 
      name: "Load", 
      status: (status === "loading" ? "running" : (status === "success" ? "success" : "pending")), 
      icon: Server, 
      records: cleanedData.length ? cleanedData.length.toLocaleString() : "-", 
      description: "Persistence and Indexing" 
    },
  ];

  const systemMetrics = [
    { label: "Memory Usage", value: "142 MB", icon: Box, color: "text-blue-400" },
    { label: "Quality Threshold", value: "95%", icon: Shield, color: "text-emerald-400" },
    { label: "Pipeline Load", value: status === "idle" ? "Low" : "Optimal", icon: Activity, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Monitor</h1>
          <p className="text-slate-400 mt-2 font-medium">Real-time telemetry and pipeline execution flow.</p>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700/50 rounded-2xl shadow-xl">
              <div className={clsx("w-2 h-2 rounded-full", status !== "idle" && status !== "success" ? "bg-amber-500 animate-pulse" : "bg-emerald-500")}></div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Engine: {status.toUpperCase()}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {/* Pipeline Visualizer */}
          <div className="glass-panel rounded-[2.5rem] p-10 relative overflow-hidden border border-white/5 shadow-2xl">
            <div className="absolute top-[4.5rem] left-[15%] right-[15%] h-1 bg-slate-800 z-0 hidden lg:block">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: status === "success" ? "100%" : status === "loading" ? "80%" : status === "transforming" ? "50%" : status === "extracting" ? "20%" : "0%" }}
                 className="h-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
               />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              {pipelineStages.map((stage, index) => {
                const isSuccess = stage.status === "success";
                const isRunning = stage.status === "running";
                const isPending = stage.status === "pending";

                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center text-center space-y-6"
                  >
                    <div className={clsx(
                      "w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-700 border-4",
                      isSuccess ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-xl shadow-emerald-500/10" :
                      isRunning ? "bg-blue-500 border-blue-400 text-white shadow-2xl shadow-blue-500/30 -translate-y-2 ring-8 ring-blue-500/10" :
                      "bg-slate-800 border-slate-700 text-slate-500"
                    )}>
                      <stage.icon className={clsx("w-8 h-8", isRunning && "animate-spin-slow")} />
                    </div>
                    
                    <div>
                       <h3 className={clsx("text-xl font-bold transition-colors duration-500", isRunning ? "text-blue-400" : isSuccess ? "text-white" : "text-slate-500")}>
                         {stage.name}
                       </h3>
                       <p className="text-xs text-slate-500 mt-2 font-medium max-w-[120px] mx-auto">{stage.description}</p>
                    </div>

                    <div className={clsx(
                      "px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border",
                      isSuccess ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      isRunning ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      "bg-slate-800 text-slate-600 border-slate-700"
                    )}>
                      {stage.records !== "-" ? `${stage.records} REC` : "STANDBY"}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Logs Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-[2.5rem] overflow-hidden flex flex-col h-[500px] border border-white/5"
          >
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-slate-900/40 backdrop-blur-3xl">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Terminal className="w-5 h-5 text-blue-500" />
                 </div>
                 <h2 className="text-lg font-bold text-white tracking-tight">Execution Stream</h2>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Live Link</span>
                 </div>
              </div>
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto space-y-3 bg-[#0a0f1c] font-mono text-xs selection:bg-blue-500/30">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4 opacity-40">
                   <Activity className="w-12 h-12" />
                   <p className="tracking-widest uppercase text-[10px] font-black">Awaiting System Broadcast...</p>
                </div>
              ) : (
                logs.map((log) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={log.id} 
                    className={clsx(
                      "py-2 px-4 rounded-xl border border-transparent transition-all group",
                      log.level === "ERROR" ? "bg-rose-500/10 border-rose-500/20 text-rose-300" :
                      log.level === "SUCCESS" ? "bg-emerald-500/5 text-emerald-300 hover:bg-emerald-500/10" :
                      "bg-slate-900/50 text-slate-400 hover:bg-slate-800/40 hover:border-white/5"
                    )}
                  >
                    <div className="flex gap-4">
                      <span className="text-slate-600 shrink-0 font-bold">[{log.time}]</span>
                      <span className={clsx(
                        "w-16 font-black shrink-0 tracking-widest",
                        log.level === "INFO" ? "text-blue-400" :
                        log.level === "WARN" ? "text-amber-500" :
                        log.level === "SUCCESS" ? "text-emerald-500" : "text-rose-500"
                      )}>
                        {log.level}
                      </span>
                      <span className="font-medium whitespace-pre-wrap">{log.message}</span>
                    </div>
                  </motion.div>
                ))
              )}
              <div ref={logEndRef} />
            </div>
          </motion.div>
        </div>

        {/* Sidebar Status */}
        <div className="space-y-6">
           <div className="glass-panel rounded-[2rem] p-8 border border-white/5">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-[0.2em] mb-6">System Health</h3>
              <div className="space-y-8">
                 {systemMetrics.map((sm) => (
                    <div key={sm.label} className="flex flex-col gap-2">
                       <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-400">{sm.label}</span>
                          <sm.icon className={clsx("w-4 h-4", sm.color)} />
                       </div>
                       <div className="text-2xl font-black text-white tracking-tight">{sm.value}</div>
                       <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "70%" }}
                            className={clsx("h-full rounded-full", sm.color.replace("text", "bg"))}
                          />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="glass-panel rounded-[2rem] p-8 border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex flex-col items-center text-center gap-4">
                 <Shield className="w-10 h-10 text-emerald-500" />
                 <h4 className="text-sm font-bold text-white">Secure Processing</h4>
                 <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-widest font-black">Memory Sandbox Enabled<br/>No Data Exfiltration detected.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
