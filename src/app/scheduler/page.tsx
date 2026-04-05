"use client";
import { Plus, Play, Calendar as CalendarIcon, Clock, MoreVertical, CheckCircle2, XCircle } from "lucide-react";
import { clsx } from "clsx";

const scheduledJobs = [
  { id: "JOB-1", name: "Daily User Sync", schedule: "0 0 * * *", nextRun: "Today, 12:00 AM", lastStatus: "success", duration: "4m 12s" },
  { id: "JOB-2", name: "Hourly Transaction Aggregation", schedule: "0 * * * *", nextRun: "Today, 2:00 PM", lastStatus: "success", duration: "1m 45s" },
  { id: "JOB-3", name: "Weekly Analytics Export", schedule: "0 0 * * 0", nextRun: "Sunday, 12:00 AM", lastStatus: "failed", duration: "12m 04s" },
  { id: "JOB-4", name: "CRM Data Enrichment", schedule: "0 2 * * *", nextRun: "Tomorrow, 2:00 AM", lastStatus: "success", duration: "8m 30s" },
];

export default function Scheduler() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Job Scheduler</h1>
          <p className="text-sm text-slate-400 mt-1">Manage automated ETL pipeline triggers.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {scheduledJobs.map((job) => (
          <div key={job.id} className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-slate-700 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                <CalendarIcon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{job.name}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-slate-500 font-mono bg-slate-900 px-2 py-0.5 rounded">{job.schedule}</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Next: {job.nextRun}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 ml-14 md:ml-0">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-500 mb-1">Last Run</p>
                <div className="flex items-center justify-end gap-1.5">
                  {job.lastStatus === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={clsx("text-sm font-medium", job.lastStatus === "success" ? "text-emerald-400" : "text-red-400")}>
                    {job.duration}
                  </span>
                </div>
              </div>

              <div className="h-10 w-px bg-slate-800 hidden sm:block"></div>

              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors group/btn">
                  <Play className="w-4 h-4 group-hover/btn:text-emerald-400 transition-colors" />
                </button>
                <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
