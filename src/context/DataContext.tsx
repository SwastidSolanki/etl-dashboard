"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Papa from "papaparse";
import { cleanData, ETLMetrics, DashboardLog } from "@/lib/etl";

type ETLStatus = "idle" | "extracting" | "transforming" | "loading" | "success" | "error";

interface DataContextType {
  rawData: any[];
  cleanedData: any[];
  metrics: ETLMetrics | null;
  logs: DashboardLog[];
  status: ETLStatus;
  uploadFile: (file: File) => void;
  reset: () => void;
  runPipeline: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [rawData, setRawData] = useState<any[]>([]);
  const [cleanedData, setCleanedData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<ETLMetrics | null>(null);
  const [logs, setLogs] = useState<DashboardLog[]>([]);
  const [status, setStatus] = useState<ETLStatus>("idle");
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const addLog = (level: DashboardLog["level"], message: string) => {
    setLogs((prev) => [
      ...prev,
      { id: Math.random().toString(36).substr(2, 9), time: new Date().toLocaleTimeString(), level, message }
    ]);
  };

  const reset = () => {
    setRawData([]);
    setCleanedData([]);
    setMetrics(null);
    setLogs([]);
    setStatus("idle");
    setPendingFile(null);
  };

  const uploadFile = (file: File) => {
    reset();
    setPendingFile(file);
    setStatus("extracting");
    setLogs([]); // fresh logs
    addLog("INFO", `Starting extraction for ${file.name}...`);

    let extractedData: any[] = [];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      chunk: (results) => {
        extractedData = [...extractedData, ...results.data];
      },
      complete: () => {
        addLog("SUCCESS", `Extraction complete. Extracted ${extractedData.length} records.`);
        setRawData(extractedData);
        
        // Move to transform phase
        setStatus("transforming");
        addLog("INFO", "Starting transformation phase...");
        
        setTimeout(() => { // Simulate processing time for UX
          try {
            const { cleaned, metrics: newMetrics } = cleanData(extractedData);
            setCleanedData(cleaned);
            setMetrics(newMetrics);
            addLog("INFO", `Transformation applied. Found ${newMetrics.missingValuesRemoved} missing values and ${newMetrics.duplicatesRemoved} duplicates.`);
            
            setStatus("loading");
            addLog("INFO", "Preparing data for loading phase...");
            
            setTimeout(() => { // Simulate load time
              addLog("SUCCESS", "Pipeline completed successfully.");
              setStatus("success");
            }, 1000);

          } catch (error) {
            addLog("ERROR", "Failed to transform data.");
            setStatus("error");
          }
        }, 800);
      },
      error: (error) => {
        addLog("ERROR", `Extraction failed: ${error.message}`);
        setStatus("error");
      }
    });
  };

  const runPipeline = () => {
    if (pendingFile) uploadFile(pendingFile);
  };

  return (
    <DataContext.Provider value={{ rawData, cleanedData, metrics, logs, status, uploadFile, reset, runPipeline }}>
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
}
