"use client";
import { useState, useMemo } from "react";
import { Search, Filter, Download, ChevronLeft, ChevronRight, Database, Table, Layers, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { useDataContext } from "@/context/DataContext";

const ROWS_PER_PAGE = 12;

export default function DataExplorer() {
  const { cleanedData, exportData } = useDataContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const columns = useMemo(() => {
    if (cleanedData.length === 0) return [];
    return Object.keys(cleanedData[0]);
  }, [cleanedData]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return cleanedData;
    const lower = searchTerm.toLowerCase();
    return cleanedData.filter(row => {
      return Object.values(row).some(val => String(val).toLowerCase().includes(lower));
    });
  }, [cleanedData, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE) || 1;
  const currentData = filteredData.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  if (cleanedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="relative"
        >
           <div className="w-32 h-32 rounded-[2.5rem] bg-slate-900 border border-white/5 flex items-center justify-center shadow-2xl relative z-10">
              <Database className="w-12 h-12 text-blue-500 opacity-20" />
           </div>
           <div className="absolute -inset-8 bg-blue-500/10 blur-3xl rounded-full animate-pulse"></div>
        </motion.div>
        <div className="space-y-2">
           <h2 className="text-2xl font-black text-white tracking-tight">Kernel Inspector: Offline</h2>
           <p className="text-slate-500 font-medium max-w-sm mx-auto">No data clusters detected in the local buffer. Initialize a pipeline to begin exploration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-32 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                 <Table className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Module: Data Explorer</span>
           </div>
           <h1 className="text-4xl font-black text-white tracking-tighter leading-none">Kernel Inspector</h1>
           <p className="text-slate-400 mt-3 font-medium max-w-xl text-sm leading-relaxed">High-resolution granular view of the sanitized dataset. Verified for referential integrity across {columns.length} dimensions.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center gap-2.5 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-2xl transition-all border border-white/5 shadow-xl group">
            <Filter className="w-4 h-4 text-blue-500" />
            VIRTUAL FILTERS
          </button>
          <button 
            onClick={exportData}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-2xl transition-all shadow-xl shadow-blue-500/20 group"
          >
            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            SYNCHRONIZE EXPORT
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-[3rem] border border-white/5 overflow-hidden shadow-3xl">
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center gap-8 bg-slate-950/40 backdrop-blur-3xl">
          <div className="relative flex-1 max-w-xl group">
            <Search className="w-4 h-4 text-slate-500 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Query kernel buffer..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950/60 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-xs font-black text-slate-200 focus:outline-none focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-600"
            />
          </div>
          <div className="flex items-center gap-6 ml-auto">
             <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-900/50 border border-white/5 rounded-xl shadow-inner">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Index: {filteredData.length.toLocaleString()} PTRS</span>
             </div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
               Viewing <span className="text-white">
                 {filteredData.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1}–{Math.min(currentPage * ROWS_PER_PAGE, filteredData.length)}
               </span>
             </p>
          </div>
        </div>

        <div className="max-h-[700px] overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-3xl border-b border-white/10 shadow-2xl">
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap bg-slate-950/50">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              <AnimatePresence mode="popLayout">
                {currentData.map((row, rowIndex) => (
                  <motion.tr 
                    key={rowIndex} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-blue-500/[0.02] transition-colors group"
                  >
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className="px-8 py-5 text-xs font-bold text-slate-400 group-hover:text-slate-200 transition-colors max-w-[250px] truncate" title={String(row[col])}>
                        {String(row[col])}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
              {currentData.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                       <Layers className="w-12 h-12 text-slate-600" />
                       <p className="text-sm font-black uppercase tracking-widest text-slate-600">No matching clusters found in kernel</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-8 border-t border-white/5 flex items-center justify-between bg-slate-950/40 backdrop-blur-3xl">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="px-6 py-3 rounded-2xl border border-white/5 text-slate-400 hover:text-white hover:bg-slate-900 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2.5 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-slate-900/50 border border-white/5 rounded-xl text-xs font-black text-blue-500 shadow-inner">
                {currentPage}
             </div>
             <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">of {totalPages} Nodes</span>
          </div>

          <button 
            disabled={currentPage === totalPages || filteredData.length === 0}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="px-6 py-3 rounded-2xl border border-white/5 text-slate-400 hover:text-white hover:bg-slate-900 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2.5 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
