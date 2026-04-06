"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Activity, CheckCircle, Database, Calendar, Settings, DatabaseBackup, ShieldCheck } from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Monitor", href: "/monitor", icon: Activity },
  { name: "Data Quality", href: "/quality", icon: CheckCircle },
  { name: "Explorer", href: "/explorer", icon: Database },
  { name: "Scheduler", href: "/scheduler", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside 
      className="w-72 bg-slate-950 border-r border-white/5 flex flex-col h-full hidden lg:flex relative z-30"
      aria-label="Main Navigation"
    >
      <div className="p-8 flex items-center gap-4">
        <div className="w-10 h-10 rounded-[1.2rem] bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
          <DatabaseBackup className="w-6 h-6 text-white" />
        </div>
        <div>
           <span className="font-black text-xl tracking-tighter text-white block">ETL FLOW</span>
           <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Kernel v2.4</span>
        </div>
      </div>
      
      <nav className="flex-1 px-6 space-y-2 mt-8">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={clsx(
                "flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-black transition-all duration-300 relative group",
                isActive 
                  ? "text-blue-400 bg-blue-500/5 shadow-inner border border-white/5" 
                  : "text-slate-500 hover:text-slate-200 hover:bg-slate-900/50"
              )}
            >
              <Icon className={clsx("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-blue-500" : "text-slate-600 group-hover:text-slate-400")} />
              <span className="tracking-tight">{item.name}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                />
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6">
        <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-colors"></div>
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Security Node</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-white font-black">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            SYNCED & SECURE
          </div>
        </div>
      </div>
    </aside>
  );
}
