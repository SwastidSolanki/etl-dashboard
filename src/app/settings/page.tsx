"use client";
import { Save, Database, Cloud, Key, Shield } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Configure integrations, connections, and system preferences.</p>
      </div>

      <div className="space-y-8">
        {/* Database Connections */}
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" /> Data Sources
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Production DB (PostgreSQL)</label>
                <input 
                  type="password" 
                  defaultValue="postgres://user:password@prod-db.example.com:5432/main"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Data Warehouse (Snowflake)</label>
                <input 
                  type="password" 
                  placeholder="Enter connection string"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-400 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
                />
              </div>
            </div>
            <button className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
              + Add new data source
            </button>
          </div>
        </div>

        {/* AWS Integrations */}
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Cloud className="w-5 h-5 text-indigo-400" /> AWS Integrations
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">AWS Region</label>
                <select className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors">
                  <option>us-east-1</option>
                  <option>us-west-2</option>
                  <option>eu-central-1</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">S3 Bucket (Raw Data)</label>
                <input 
                  type="text" 
                  defaultValue="etl-raw-telemetry-prod"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Access Key ID</label>
                <input 
                  type="password" 
                  defaultValue="AKIAIOSFODNN7EXAMPLE"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Secret Access Key</label>
                <input 
                  type="password" 
                  defaultValue="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-indigo-200">AWS Glue Optimization (UseSkills Agent)</p>
                  <p className="text-xs text-indigo-300/80 mt-1">Enable AI agent to automatically suggest partition keys and optimize PySpark transformations based on query patterns.</p>
                  <label className="flex items-center gap-2 mt-3 cursor-pointer">
                    <input type="checkbox" className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900" defaultChecked />
                    <span className="text-sm text-slate-300">Enable automated suggestions</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700">
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
