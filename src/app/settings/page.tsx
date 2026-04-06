"use client";
import React from "react";
import { Save, Database, Cloud, Key, Shield, Zap, Globe, Cpu, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

export default function Settings() {
  return (
    <div className="space-y-12 pb-32 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                 <Cpu className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">System Preferences</span>
           </div>
           <h1 className="text-4xl font-black text-white tracking-tighter">Kernel Configuration</h1>
           <p className="text-slate-400 mt-2 font-medium max-w-xl text-sm leading-relaxed">Adjust pipeline parameters, secure data gateways, and automated heuristic agents.</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-2.5 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-2xl transition-all border border-white/5 shadow-xl">
             <RotateCcw className="w-4 h-4 text-slate-500" />
             REVERT DEFAULTS
           </button>
           <button className="flex items-center gap-2.5 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-2xl transition-all shadow-xl shadow-blue-500/30">
             <Save className="w-4 h-4" />
             SYNC CONFIGURATION
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {/* Data Clusters */}
        <section className="glass-panel rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-colors"></div>
          <div className="flex items-center gap-4 mb-10">
             <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                <Database className="w-6 h-6 text-blue-500" />
             </div>
             <div>
                <h2 className="text-xl font-black text-white tracking-tight">Kernel Clusters</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mt-1">Data Source Management</p>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <ConfigField label="Master Index Path" type="password" value="postgres://admin:cluster-key-x88@prod.etl.internal:5432/kernel" />
             <ConfigField label="Relational Warehouse" type="password" value="snowflake://warehouse.io/telemetry-vault" />
          </div>
          <button className="mt-8 text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest flex items-center gap-2 transition-colors">
            + Provision New Node
          </button>
        </section>

        {/* Cloud Gateway */}
        <section className="glass-panel rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full group-hover:bg-indigo-500/10 transition-colors"></div>
          <div className="flex items-center gap-4 mb-10">
             <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                <Cloud className="w-6 h-6 text-indigo-500" />
             </div>
             <div>
                <h2 className="text-xl font-black text-white tracking-tight">Cloud Gateway</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mt-1">AWS Infrastructure Binding</p>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Cluster Region</label>
                <select className="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-6 py-4 text-xs font-black text-slate-200 focus:outline-none focus:border-indigo-500/40 transition-all appearance-none cursor-pointer">
                  <option>us-east-1 (Primary)</option>
                  <option>eu-central-1 (Slave)</option>
                  <option>ap-southeast-1 (Edge)</option>
                </select>
             </div>
             <ConfigField label="S3 Telemetry Bucket" type="text" value="etl-flow-production-buffer" />
             <ConfigField label="Access PTR (ID)" type="password" value="AKIA88200XPL09911" />
             <ConfigField label="Encryption Secret (Key)" type="password" value="vNsk99201Lss/00X-key-prod-internal" />
          </div>

          <div className="mt-10 p-6 bg-slate-950 border border-white/5 rounded-[2rem] flex items-center gap-6 shadow-3xl">
             <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                <Shield className="w-6 h-6 text-indigo-500" />
             </div>
             <div className="flex-1">
                <p className="text-sm font-black text-white leading-none mb-1">Dynamic Heuristic Optimization</p>
                <p className="text-[10px] font-medium text-slate-500">Allow AI agents to suggest partition indices and schema optimizations based on drift metadata.</p>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-900 group-hover:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-blue-600 after:border-blue-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500/20"></div>
             </label>
          </div>
        </section>

        {/* Global Access */}
        <section className="glass-panel rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="flex items-center gap-4 mb-10">
             <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <Globe className="w-6 h-6 text-emerald-500" />
             </div>
             <div>
                <h2 className="text-xl font-black text-white tracking-tight">Protocol Security</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mt-1">Cross-Border Compliance</p>
             </div>
          </div>
          
          <div className="flex items-center justify-between p-6 bg-slate-950 border border-white/5 rounded-3xl">
             <div className="flex items-center gap-4">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-black text-white">TLS 1.3 Strict Mode</span>
             </div>
             <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] font-black text-emerald-500 uppercase tracking-widest">ENFORCED</div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ConfigField({ label, type, value }: { label: string, type: string, value: string }) {
  return (
    <div className="space-y-3">
       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
       <input 
          type={type} 
          defaultValue={value}
          className="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-6 py-4 text-xs font-black text-slate-200 focus:outline-none focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-700 shadow-inner"
       />
    </div>
  );
}
