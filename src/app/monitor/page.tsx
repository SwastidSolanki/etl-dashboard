"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Server, Box, CheckCircle2, RefreshCw, Activity, Terminal, Shield, Play, Pause, XCircle, Save, RotateCcw } from "lucide-react";
import { clsx } from "clsx";
import { useDataContext } from "@/context/DataContext";

export default function PipelineMonitor() {
  const { status, logs, rawData, cleanedData, metrics, reset, saveSnapshot, loadSnapshot, hasSnapshot } = useDataContext();
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const memoryUsage = React.useMemo(() => {
    if (rawData.length === 0) return "0 MB";
    const bytes = new TextEncoder().encode(JSON.stringify(rawData)).length;
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }, [rawData]);

  const pipelineStages = [
    { 
      id: 1, 
      name: "Extract", 
      status: (status === "extracting" ? "running" : (["transforming", "loading", "success"].includes(status) ? "success" : "pending")), 
      icon: Database, 
      records: rawData.length ? rawData.length.toLocaleString() : "-", 
      description: "Parsing CSV into memory",
      progress: status === "extracting" ? 65 : (["transforming", "loading", "success"].includes(status) ? 100 : 0)
    },
    { 
      id: 2, 
      name: "Transform", 
      status: (status === "transforming" ? "running" : (["loading", "success"].includes(status) ? "success" : status === "error" ? "failed" : "pending")), 
      icon: RefreshCw, 
      records: cleanedData.length ? cleanedData.length.toLocaleString() : "-", 
      description: "Data validation & cleaning",
      progress: status === "transforming" ? 40 : (["loading", "success"].includes(status) ? 100 : 0)
    },
    { 
      id: 3, 
      name: "Load", 
      status: (status === "loading" ? "running" : (status === "success" ? "success" : "pending")), 
      icon: Server, 
      records: cleanedData.length ? cleanedData.length.toLocaleString() : "-", 
      description: "Persistence and Indexing",
      progress: status === "loading" ? 20 : (status === "success" ? 100 : 0)
    },
  ];

  const systemMetrics = [
    { label: "Heap Allocation", value: memoryUsage, icon: Box, color: "text-blue-400", pct: Math.min(parseFloat(memoryUsage) * 2, 100) },
    { label: "Stability Index", value: metrics ? `${metrics.qualityScore}%` : "0%", icon: Shield, color: "text-emerald-400", pct: metrics?.qualityScore || 0 },
    { label: "Pipeline Pressure", value: status === "idle" || status === "success" ? "Low" : "High", icon: Activity, color: "text-amber-400", pct: status === "idle" || status === "success" ? 10 : 85 },
  ];

  return (
    <div className="space-y-12 max-w-[1600px] mx-auto pb-24">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Signal: Active</span>
           </div>
           <h1 className="text-4xl font-black text-white tracking-tighter">System Telemetry</h1>
           <p className="text-slate-400 mt-2 font-medium max-w-lg">Observe live pipeline execution and relational data flow in real-time.</p>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
           <div className="flex items-center gap-3 px-6 py-3 bg-slate-900 border border-white/5 rounded-2xl shadow-2xl">
              <div className={clsx(
                "w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]", 
                status !== "idle" && status !== "success" && status !== "error" ? "bg-amber-500 animate-pulse" : status === "error" ? "bg-rose-500" : "bg-emerald-500"
              )}></div>
              <span className="text-xs font-black uppercase text-slate-300 tracking-widest">{status === "idle" ? "Standby" : status}</span>
           </div>
           <button 
             onClick={reset}
             className="flex items-center gap-2.5 px-6 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 text-xs font-black rounded-2xl transition-all uppercase tracking-widest"
           >
             <XCircle className="w-4 h-4" />
             Emergency Stop
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-12 xl:col-span-9 space-y-10">
          {/* Pipeline Visualizer */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-[3rem] p-12 relative overflow-hidden border border-white/5 shadow-2xl"
          >
            <div className="absolute top-[6.5rem] left-[15%] right-[15%] h-px bg-slate-800 z-0 hidden xl:block">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: status === "success" ? "100%" : status === "loading" ? "80%" : status === "transforming" ? "50%" : status === "extracting" ? "20%" : "0%" }}
                 className="h-full bg-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.8)]"
               />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
              {pipelineStages.map((stage, index) => {
                const isSuccess = stage.status === "success";
                const isRunning = stage.status === "running";
                const isPending = stage.status === "pending";

                return (
                  <div key={stage.id} className="flex flex-col items-center group">
                    <div className="relative mb-10">
                       <AnimatePresence>
                         {isRunning && (
                           <motion.div 
                             initial={{ scale: 0.8, opacity: 0 }}
                             animate={{ scale: 1.2, opacity: 1 }}
                             exit={{ scale: 1.5, opacity: 0 }}
                             className="absolute -inset-6 bg-blue-500/10 blur-3xl rounded-full"
                           />
                         )}
                       </AnimatePresence>
                       <div className={clsx(
                         "w-24 h-24 rounded-[2.5rem] flex items-center justify-center transition-all duration-700 border-2 relative z-10",
                         isSuccess ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.2)]" :
                         isRunning ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_60px_rgba(59,130,246,0.5)] -translate-y-3" :
                         "bg-slate-900 border-white/5 text-slate-600 hover:border-slate-700"
                       )}>
                         <stage.icon className={clsx("w-10 h-10", isRunning && "animate-spin-slow")} />
                         
                         {isSuccess && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2 bg-emerald-500 text-slate-950 p-1 rounded-full border-4 border-slate-950"
                            >
                               <CheckCircle2 className="w-4 h-4" />
                            </motion.div>
                         )}
                       </div>
                    </div>
                    
                    <div className="text-center space-y-4 w-full">
                       <div>
                          <h3 className={clsx("text-2xl font-black tracking-tight transition-colors duration-500", isRunning ? "text-blue-400" : isSuccess ? "text-white" : "text-slate-600")}>
                            {stage.name}
                          </h3>
                          <p className="text-[10px] text-slate-500 mt-2 font-black uppercase tracking-widest">{stage.description}</p>
                       </div>

                       <div className="space-y-4">
                          <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden shadow-inner">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${stage.progress}%` }}
                               className={clsx(
                                 "h-full transition-all duration-1000",
                                 isSuccess ? "bg-emerald-500" : "bg-blue-500"
                               )}
                             />
                          </div>
                          
                          <div className={clsx(
                            "inline-block px-5 py-2 rounded-2xl text-[10px] font-black tracking-[0.2em] border shadow-2xl transition-all duration-500",
                            isSuccess ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                            isRunning ? "bg-blue-600 shadow-blue-500/20 text-white border-blue-400" :
                            "bg-slate-950 text-slate-700 border-white/5"
                          )}>
                            {stage.records !== "-" ? `${stage.records} REC` : "STANDBY"}
                          </div>
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Logs Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-[3rem] overflow-hidden flex flex-col h-[600px] border border-white/5 shadow-2xl"
          >
            <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-slate-950/40 backdrop-blur-3xl">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-blue-500/10 rounded-[1.2rem] border border-blue-500/20">
                    <Terminal className="w-6 h-6 text-blue-500" />
                 </div>
                 <div>
                    <h2 className="text-xl font-black text-white tracking-tight">Execution Stream</h2>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">Live kernel message bus</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-xl border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Kernel Node: 01</span>
                 </div>
              </div>
            </div>
            
            <div className="p-10 flex-1 overflow-y-auto space-y-4 bg-[#020617] font-mono text-xs selection:bg-blue-500/40 custom-scrollbar">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-800 space-y-6 opacity-30">
                   <Activity className="w-16 h-16" />
                   <p className="tracking-[0.4em] uppercase text-xs font-black">Waiting for system handshake</p>
                </div>
              ) : (
                logs.map((log) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={log.id} 
                    className={clsx(
                      "py-3 px-6 rounded-2xl border border-transparent transition-all group relative overflow-hidden",
                      log.level === "ERROR" ? "bg-rose-500/5 border-rose-500/10 text-rose-400" :
                      log.level === "SUCCESS" ? "bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10" :
                      "bg-slate-900/40 text-slate-400 hover:bg-slate-800/60 hover:border-white/5"
                    )}
                  >
                    <div className="flex gap-6 relative z-10">
                      <span className="text-slate-700 shrink-0 font-black">[{log.time}]</span>
                      <span className={clsx(
                        "w-20 font-black shrink-0 tracking-widest uppercase text-[10px] mt-0.5",
                        log.level === "INFO" ? "text-blue-500/80" :
                        log.level === "WARN" ? "text-amber-500/80" :
                        log.level === "SUCCESS" ? "text-emerald-500/80" : "text-rose-500/80"
                      )}>
                        {log.level}
                      </span>
                      <span className="font-bold leading-relaxed">{log.message}</span>
                    </div>
                  </motion.div>
                ))
              )}
              <div ref={logEndRef} />
            </div>
          </motion.div>
        </div>

        {/* Sidebar Status */}
        <div className="lg:col-span-12 xl:col-span-3 space-y-10">
           {/* Snapshot Control */}
           <motion.div 
             initial={{ opacity: 0, x: 30 }}
             animate={{ opacity: 1, x: 0 }}
             className="glass-panel rounded-[2.5rem] p-10 border border-blue-500/20 bg-blue-500/5 shadow-2xl"
           >
              <div className="flex items-center gap-4 mb-8">
                 <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                    <Database className="w-6 h-6 text-blue-500" />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-white tracking-tight">Kernel Snapshot</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mt-1">Local Buffer Management</p>
                 </div>
              </div>
              
              <div className="space-y-4">
                 <button 
                   onClick={saveSnapshot}
                   disabled={status !== "success"}
                   className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-white text-[10px] font-black rounded-2xl transition-all border border-white/5 shadow-xl uppercase tracking-widest"
                 >
                   <Save className="w-4 h-4 text-blue-500" />
                   Buffer Current State
                 </button>
                 
                 {hasSnapshot && (
                    <button 
                      onClick={loadSnapshot}
                      className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-2xl transition-all shadow-xl shadow-blue-500/20 uppercase tracking-widest"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Restore From Buffer
                    </button>
                 )}
              </div>

              {hasSnapshot && (
                 <div className="mt-8 flex items-center gap-3 px-4 py-3 bg-slate-950 border border-white/5 rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Snapshot Cluster Detected</span>
                 </div>
              )}
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: 30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.1 }}
             className="glass-panel rounded-[2.5rem] p-10 border border-white/5 shadow-2xl"
           >
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-[0.3em] mb-12 border-l-4 border-blue-500 pl-4">Engine Telemetry</h3>
              <div className="space-y-12">
                 {systemMetrics.map((sm) => (
                    <div key={sm.label} className="space-y-4">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{sm.label}</span>
                          <div className={clsx("p-2 rounded-xl bg-slate-900 border border-white/5", sm.color)}>
                             <sm.icon className="w-5 h-5" />
                          </div>
                       </div>
                       <div className="text-4xl font-black text-white tracking-tighter">{sm.value}</div>
                       <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${sm.pct}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={clsx("h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]", sm.color.replace("text", "bg"))}
                          />
                       </div>
                    </div>
                 ))}
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="glass-panel rounded-[2.5rem] p-10 border border-emerald-500/20 bg-emerald-500/5 shadow-2xl"
           >
              <div className="flex flex-col items-center text-center gap-6">
                 <div className="p-5 bg-emerald-500/10 rounded-[2rem] border border-emerald-500/20">
                    <Shield className="w-12 h-12 text-emerald-500" />
                 </div>
                 <div>
                    <h4 className="text-lg font-black text-white tracking-tight">Security Hardened</h4>
                    <p className="text-[10px] text-slate-400 mt-2 leading-relaxed uppercase tracking-[0.2em] font-black">Isolated memory context active. <br/> Zero external footprints.</p>
                 </div>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
