"use client";
import { useState, useMemo } from "react";
import { Search, Filter, Download, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { clsx } from "clsx";
import { useDataContext } from "@/context/DataContext";

const ROWS_PER_PAGE = 15;

export default function DataExplorer() {
  const { cleanedData } = useDataContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const columns = useMemo(() => {
    if (cleanedData.length === 0) return [];
    // Only show first 8 columns max to avoid breaking layout
    return Object.keys(cleanedData[0]).slice(0, 8);
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
      <div className="flex h-64 items-center justify-center text-slate-500">
        No data available. Upload a CSV to explore records.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Data Explorer</h1>
          <p className="text-sm text-slate-400 mt-1">Browse, filter, and export the cleaned dataset.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="p-4 border-b border-slate-800 flex items-center gap-4 bg-slate-900/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search across all columns..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500"
            />
          </div>
          <div className="text-sm text-slate-400 ml-auto">
            Showing <span className="text-white font-medium">
              {filteredData.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1}-
              {Math.min(currentPage * ROWS_PER_PAGE, filteredData.length)}
            </span> of {filteredData.length.toLocaleString()} rows
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/80 border-b border-slate-800">
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className="px-6 py-4 font-medium whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 bg-[#0a0f1c]/50">
              {currentData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-slate-800/30 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 text-slate-300 max-w-[200px] truncate" title={String(row[col])}>
                      {String(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500">
                    No results found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/50">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          
          <div className="text-sm text-slate-400 font-medium">
            Page {currentPage} of {totalPages}
          </div>

          <button 
            disabled={currentPage === totalPages || filteredData.length === 0}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
