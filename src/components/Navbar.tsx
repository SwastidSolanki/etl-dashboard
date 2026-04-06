"use client";
import { Search, Bell, Menu, User, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <header 
      className="h-20 border-b border-white/5 bg-slate-950/40 backdrop-blur-3xl flex items-center justify-between px-8 sticky top-0 z-40"
      role="banner"
    >
      <div className="flex items-center gap-6">
        <button 
          className="lg:hidden p-2.5 bg-slate-900 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all shadow-xl"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="relative hidden md:block group">
          <Search className="w-4 h-4 text-slate-500 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search kernel indices..." 
            className="w-72 bg-slate-950/60 border border-white/5 rounded-2xl pl-12 pr-6 py-3 text-xs font-bold text-slate-200 focus:outline-none focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-600"
            aria-label="Search dashboard"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-900/50 border border-white/5 rounded-2xl shadow-inner">
           <Zap className="w-4 h-4 text-amber-500" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Speed: 4.2ms</span>
        </div>

        <button 
          className="relative group p-3 bg-slate-900/50 border border-white/5 rounded-2xl hover:bg-slate-900 transition-all shadow-xl"
          aria-label="View Notifications"
        >
          <Bell className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-950 shadow-[0_0_10px_rgba(59,130,246,0.6)]"></span>
        </button>

        <div className="h-8 w-px bg-white/5 mx-2"></div>

        <div className="flex items-center gap-4 group cursor-pointer" aria-label="User Profile">
           <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-white tracking-tight leading-none mb-1">Dev Admin</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Superuser</p>
           </div>
           <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-[1.5px] shadow-lg group-hover:scale-105 transition-transform duration-500">
              <div className="w-full h-full rounded-[1.1rem] bg-slate-950 flex items-center justify-center">
                 <User className="w-5 h-5 text-white/50" />
              </div>
           </div>
        </div>
      </div>
    </header>
  );
}
