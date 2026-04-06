"use client";
import React, { useState, useEffect } from "react";
import { Plus, Play, Calendar as CalendarIcon, Clock, Trash2, CheckCircle2, XCircle, X, Search, Zap, Hash, History, Timer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

interface Job {
  id: string;
  name: string;
  schedule: string;
  nextRun: string;
  lastStatus: "success" | "failed" | "idle";
  lastRun?: string;
  duration?: string;
}

const STORAGE_KEY = "etl_scheduled_jobs";

export default function Scheduler() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newJob, setNewJob] = useState({ name: "", schedule: "" });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load jobs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setJobs(JSON.parse(saved));
    } else {
      const initial: Job[] = [
        { 
          id: "JOB-42A", 
          name: "Global Inventory Sync", 
          schedule: "0 0 * * *", 
          nextRun: "08:12:44", 
          lastStatus: "success", 
          lastRun: "2h 45m ago",
          duration: "1m 12s" 
        },
      ];
      setJobs(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
  }, []);

  const saveJobs = (updatedJobs: Job[]) => {
    setJobs(updatedJobs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedJobs));
  };

  const addJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.name || !newJob.schedule) return;

    const job: Job = {
      id: `JOB-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
      name: newJob.name,
      schedule: newJob.schedule,
      nextRun: "04:59:59",
      lastStatus: "idle",
      lastRun: "Never",
    };

    saveJobs([...jobs, job]);
    setNewJob({ name: "", schedule: "" });
    setShowModal(false);
  };

  const removeJob = (id: string) => {
    saveJobs(jobs.filter(j => j.id !== id));
  };

  const runJob = (id: string) => {
    const updated = jobs.map(j => {
      if (j.id === id) {
        return { ...j, lastStatus: "idle" as const, duration: "Running..." };
      }
      return j;
    });
    setJobs(updated);
    
    setTimeout(() => {
      const finished = updated.map(j => {
        if (j.id === id) {
          return { 
            ...j, 
            lastStatus: "success" as const, 
            lastRun: "Just now",
            duration: `${Math.floor(Math.random() * 3) + 1}m ${Math.floor(Math.random() * 59)}s` 
          };
        }
        return j;
      });
      saveJobs(finished);
    }, 2500);
  };

  const filteredJobs = jobs.filter(j => 
    j.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 max-w-[1400px] mx-auto pb-24">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
        <div>
           <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Kernel Scheduler: Active</span>
           </div>
           <h1 className="text-4xl font-black text-white tracking-tighter">Job Automation</h1>
           <p className="text-slate-400 mt-2 font-medium max-w-lg">Orchestrate persistent ETL triggers and cross-cluster data synchronization.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6">
           <div className="relative group min-w-[320px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search index..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-2xl"
              />
           </div>
           <button 
             onClick={() => setShowModal(true)}
             className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-2xl shadow-blue-500/30 flex items-center gap-3 group active:scale-95"
           >
             <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" /> 
             <span className="uppercase text-xs tracking-widest">Register Pipeline</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredJobs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-32 rounded-[3.5rem] flex flex-col items-center justify-center text-center border border-white/5"
            >
              <div className="w-20 h-20 rounded-[2rem] bg-slate-950 flex items-center justify-center mb-6 shadow-inner border border-white/5">
                <Zap className="w-10 h-10 text-slate-700" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">Zero Indices Found</h3>
              <p className="text-slate-500 mt-2 max-w-xs font-bold uppercase text-[10px] tracking-widest">No active automation profiles detected in kernel memory.</p>
            </motion.div>
          ) : (
            filteredJobs.map((job, idx) => (
              <motion.div 
                layout
                key={job.id} 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel p-10 rounded-[3rem] flex flex-col xl:flex-row xl:items-center justify-between gap-10 border border-white/5 group hover:border-blue-500/20 hover:bg-slate-900/60 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                   <Hash className="w-16 h-16 text-white" />
                </div>

                <div className="flex items-start gap-8">
                  <div className="w-20 h-20 rounded-[2rem] bg-slate-950 border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-inner">
                    <CalendarIcon className="w-10 h-10 text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                       <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">{job.name}</h3>
                       <span className="text-[10px] uppercase font-black bg-slate-950 text-slate-500 px-3 py-1 rounded-[0.8rem] tracking-[0.2em] border border-white/5 shadow-inner">{job.id}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 mt-4">
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-950 px-4 py-2 rounded-2xl border border-white/5 shadow-xl">
                        <Clock className="w-4 h-4 text-blue-500/80" />
                        CRON: <span className="text-white font-mono text-xs">{job.schedule}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-black uppercase tracking-widest px-4 py-2">
                        <Timer className="w-4 h-4 text-emerald-500/80" />
                        NEXT RUN: <span className="text-white italic">{job.nextRun}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-10 ml-[7rem] xl:ml-0 relative z-10">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black uppercase text-slate-600 mb-2 tracking-[0.2em] flex items-center justify-end gap-2">
                       <History className="w-3 h-3" />
                       Last Signal
                    </p>
                    <div className="flex flex-col items-end gap-1">
                       <div className="flex items-center gap-3">
                          <span className={clsx(
                            "text-lg font-black tracking-tight", 
                            job.lastStatus === "success" ? "text-emerald-400" : 
                            job.lastStatus === "idle" ? "text-blue-400 animate-pulse" : "text-rose-400"
                          )}>
                            {job.duration || "N/A"}
                          </span>
                          {job.lastStatus === "success" ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                          ) : job.lastStatus === "idle" ? (
                            <div className="w-4 h-4 rounded-full border-2 border-blue-500/50 border-t-blue-500 animate-spin"></div>
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]" />
                          )}
                       </div>
                       <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{job.lastRun}</span>
                    </div>
                  </div>

                  <div className="h-16 w-px bg-slate-800 hidden xl:block"></div>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => runJob(job.id)}
                      className="p-4 rounded-[1.5rem] bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xl shadow-emerald-600/20 active:scale-95 group/btn"
                      title="Force manual execution"
                    >
                      <Play className="w-6 h-6 fill-current group-hover/btn:scale-110 transition-transform" />
                    </button>
                    <button 
                      onClick={() => removeJob(job.id)}
                      className="p-4 rounded-[1.5rem] bg-slate-900 border border-white/5 hover:border-rose-500/30 text-slate-500 hover:text-rose-500 transition-all active:scale-95"
                      title="Decommission profile"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modern Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[60]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-950 border border-white/10 rounded-[3.5rem] p-12 z-[70] shadow-[0_0_100px_-20px_rgba(0,0,0,1)]"
            >
              <div className="flex items-center justify-between mb-12">
                <div>
                   <h2 className="text-3xl font-black text-white tracking-tighter">New Pipeline</h2>
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">Registering automation profile</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 hover:bg-slate-900 rounded-[1.2rem] text-slate-500 transition-all hover:text-white border border-transparent hover:border-white/5">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={addJob} className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-600 tracking-[0.2em] ml-2">Job Descriptor</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sales Data Migration"
                    required
                    value={newJob.name}
                    onChange={(e) => setNewJob({ ...newJob, name: e.target.value })}
                    className="w-full bg-slate-900 border border-white/5 rounded-3xl px-8 py-5 text-white focus:outline-none focus:border-blue-500/50 focus:bg-slate-950 transition-all font-black"
                  />
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black uppercase text-slate-600 tracking-[0.2em] ml-2">Kernel Schedule (CRON)</label>
                      <span className="text-[10px] text-blue-500 font-black tracking-widest uppercase">Learn CRON</span>
                   </div>
                  <input 
                    type="text" 
                    placeholder="e.g. 0 12 * * *"
                    required
                    value={newJob.schedule}
                    onChange={(e) => setNewJob({ ...newJob, schedule: e.target.value })}
                    className="w-full bg-slate-900 border border-white/5 rounded-3xl px-8 py-5 text-white focus:outline-none focus:border-blue-500/50 focus:bg-slate-950 transition-all font-mono text-sm tracking-widest"
                  />
                </div>
                
                <div className="pt-6">
                  <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-3xl transition-all shadow-2xl shadow-blue-500/30 active:scale-95 uppercase text-xs tracking-[0.2em]">
                    Synchronize Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
