"use client";
import React, { useState, useEffect } from "react";
import { Plus, Play, Calendar as CalendarIcon, Clock, Trash2, CheckCircle2, XCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

interface Job {
  id: string;
  name: string;
  schedule: string;
  nextRun: string;
  lastStatus: "success" | "failed" | "idle";
  duration?: string;
}

const STORAGE_KEY = "etl_scheduled_jobs";

export default function Scheduler() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newJob, setNewJob] = useState({ name: "", schedule: "" });

  // Load jobs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setJobs(JSON.parse(saved));
    } else {
      // Default initial state if empty
      const initial = [
        { id: "JOB-1", name: "Daily User Sync", schedule: "0 0 * * *", nextRun: "Today, 12:00 AM", lastStatus: "success" as const, duration: "4m 12s" },
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
      id: `JOB-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      name: newJob.name,
      schedule: newJob.schedule,
      nextRun: "Next expected interval",
      lastStatus: "idle",
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
        return { ...j, lastStatus: "success" as const, duration: "Processing..." };
      }
      return j;
    });
    setJobs(updated);
    setTimeout(() => {
      const finished = updated.map(j => {
        if (j.id === id) {
          return { ...j, duration: `${Math.floor(Math.random() * 5) + 1}m ${Math.floor(Math.random() * 59)}s` };
        }
        return j;
      });
      saveJobs(finished);
    }, 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Automation Scheduler</h1>
          <p className="text-slate-400 mt-2 font-medium">Manage and monitor automated ETL pipeline triggers.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2 group w-fit"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> 
          <span>Create New Job</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {jobs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel p-20 rounded-3xl flex flex-col items-center justify-center text-center opacity-60"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
                <CalendarIcon className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-white">No active schedules</h3>
              <p className="text-slate-400 mt-1 max-w-xs">Start by creating a new automated job trigger.</p>
            </motion.div>
          ) : (
            jobs.map((job) => (
              <motion.div 
                layout
                key={job.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel p-6 rounded-[2rem] flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-white/5 group hover:border-blue-500/30 hover:bg-slate-800/40 transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                    <CalendarIcon className="w-7 h-7 text-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                       <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{job.name}</h3>
                       <span className="text-[10px] uppercase font-black bg-slate-800 text-slate-400 px-2 py-0.5 rounded tracking-widest">{job.id}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      <div className="flex items-center gap-2 text-sm text-slate-400 font-medium bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700/50">
                        <Clock className="w-3.5 h-3.5 text-blue-500/60" />
                        Cron: <span className="text-white font-mono">{job.schedule}</span>
                      </div>
                      <span className="text-xs text-slate-500 flex items-center gap-1.5 px-3 py-1">
                        Next Run: <span className="text-slate-300 italic">{job.nextRun}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 ml-[4.5rem] lg:ml-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black uppercase text-slate-500 mb-1 tracking-widest">Last Execution</p>
                    <div className="flex items-center justify-end gap-2.5">
                      {job.lastStatus === "success" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : job.lastStatus === "failed" ? (
                        <XCircle className="w-4 h-4 text-rose-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-700"></div>
                      )}
                      <span className={clsx(
                        "text-sm font-bold", 
                        job.lastStatus === "success" ? "text-emerald-400" : 
                        job.lastStatus === "failed" ? "text-rose-400" : "text-slate-500"
                      )}>
                        {job.duration || "Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="h-12 w-px bg-slate-800 hidden lg:block"></div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => runJob(job.id)}
                      className="p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-all border border-emerald-500/20"
                      title="Run manual trigger"
                    >
                      <Play className="w-5 h-5 fill-current" />
                    </button>
                    <button 
                      onClick={() => removeJob(job.id)}
                      className="p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-all border border-rose-500/20"
                      title="Delete profile"
                    >
                      <Trash2 className="w-5 h-5" />
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
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 z-50 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">New Job Profile</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={addJob} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1">Job Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sales Data Migration"
                    required
                    value={newJob.name}
                    onChange={(e) => setNewJob({ ...newJob, name: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 focus:bg-slate-800 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1">Cron Schedule</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 0 12 * * *"
                    required
                    value={newJob.schedule}
                    onChange={(e) => setNewJob({ ...newJob, schedule: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 focus:bg-slate-800 transition-all font-mono text-sm"
                  />
                </div>
                
                <div className="pt-4">
                  <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98]">
                    Initialize Schedule
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
