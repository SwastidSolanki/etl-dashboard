"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Activity, CheckCircle, Database, Calendar, Settings } from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

const navItems = [
  { name: "Dash", href: "/", icon: LayoutDashboard },
  { name: "Live", href: "/monitor", icon: Activity },
  { name: "Quality", href: "/quality", icon: CheckCircle },
  { name: "Flow", href: "/scheduler", icon: Calendar },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-3xl border-t border-white/5 px-6 py-4 pb-8 flex items-center justify-between"
      aria-label="Mobile Navigation"
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex flex-col items-center gap-1 group"
          >
            <div className={clsx(
              "p-3 rounded-2xl transition-all duration-300",
              isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 -translate-y-4" : "text-slate-500 hover:text-slate-300"
            )}>
              <Icon className="w-6 h-6" />
            </div>
            {!isActive && (
              <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">{item.name}</span>
            )}
            {isActive && (
              <motion.div 
                layoutId="mobile-active-glow"
                className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
