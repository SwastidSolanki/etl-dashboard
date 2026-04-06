export type LogLevel = "INFO" | "WARN" | "SUCCESS" | "ERROR";

export interface DashboardLog {
  id: string;
  time: string;
  level: LogLevel;
  message: string;
}

export interface ColumnAnalysis {
  name: string;
  type: "numeric" | "categorical" | "date" | "boolean";
  completeness: number; // percentage
  uniqueValues: number;
  profiling?: {
    min: number;
    max: number;
    mean: number;
    median: number;
  };
}

export interface ETLMetrics {
  originalCount: number;
  cleanedCount: number;
  duplicatesRemoved: number;
  missingValuesRemoved: number;
  columnsAnalysis: ColumnAnalysis[];
  qualityScore: number; // 0-100
  correlationMatrix: Record<string, Record<string, number>>;
}

export function cleanData(data: Record<string, unknown>[]): { cleaned: Record<string, unknown>[], metrics: ETLMetrics } {
  const originalCount = data.length;
  if (originalCount === 0) {
    return {
      cleaned: [],
      metrics: {
        originalCount: 0,
        cleanedCount: 0,
        duplicatesRemoved: 0,
        missingValuesRemoved: 0,
        columnsAnalysis: [],
        qualityScore: 100,
        correlationMatrix: {},
      },
    };
  }

  // 1. Remove Exact Duplicates
  const seen = new Set();
  const uniqueData = data.filter((row) => {
    const s = JSON.stringify(row);
    if (seen.has(s)) return false;
    seen.add(s);
    return true;
  });
  const duplicatesRemoved = originalCount - uniqueData.length;

  // 2. Remove Rows with > 50% Missing Values
  const keys = Object.keys(data[0]);
  const cleaned = uniqueData.filter((row) => {
    const missingCount = keys.filter((k) => row[k] === null || row[k] === undefined || row[k] === "").length;
    return missingCount / keys.length < 0.5;
  });
  const missingValuesRemoved = uniqueData.length - cleaned.length;

  // 3. Column Analysis & Profiling
  const columnsAnalysis: ColumnAnalysis[] = keys.map((key) => {
    const values = cleaned.map((r) => r[key]);
    const nonMissing = values.filter((v) => v !== null && v !== undefined && v !== "");
    const unique = new Set(nonMissing);
    
    // Simple type inference
    let type: ColumnAnalysis["type"] = "categorical";
    const sample = nonMissing.slice(0, 10);
    const isNum = sample.length > 0 && sample.every((v) => typeof v === "number");
    const isBool = sample.length > 0 && sample.every((v) => typeof v === "boolean");
    const isDate = sample.length > 0 && sample.every((v) => !isNaN(Date.parse(String(v))));

    if (isNum) type = "numeric";
    else if (isDate) type = "date";
    else if (isBool) type = "boolean";

    let profiling;
    if (type === "numeric" && nonMissing.length > 0) {
      const numValues = nonMissing.map(v => Number(v)).sort((a, b) => a - b);
      const sum = numValues.reduce((a, b) => a + b, 0);
      profiling = {
        min: numValues[0],
        max: numValues[numValues.length - 1],
        mean: Number((sum / numValues.length).toFixed(2)),
        median: numValues[Math.floor(numValues.length / 2)],
      };
    }

    return {
      name: key,
      type,
      completeness: Math.round((nonMissing.length / cleaned.length) * 100),
      uniqueValues: unique.size,
      profiling,
    };
  });

  // 4. Pearson Correlation Matrix
  const numericCols = columnsAnalysis.filter(c => c.type === "numeric").map(c => c.name);
  const correlationMatrix: Record<string, Record<string, number>> = {};

  numericCols.forEach(colA => {
    correlationMatrix[colA] = {};
    numericCols.forEach(colB => {
      if (colA === colB) {
        correlationMatrix[colA][colB] = 1;
        return;
      }
      
      const valsA = cleaned.map(r => Number(r[colA]));
      const valsB = cleaned.map(r => Number(r[colB]));
      
      const meanA = valsA.reduce((a, b) => a + b, 0) / valsA.length;
      const meanB = valsB.reduce((a, b) => a + b, 0) / valsB.length;
      
      let num = 0;
      let denA = 0;
      let denB = 0;
      
      for (let i = 0; i < valsA.length; i++) {
        const diffA = valsA[i] - meanA;
        const diffB = valsB[i] - meanB;
        num += diffA * diffB;
        denA += diffA * diffA;
        denB += diffB * diffB;
      }
      
      const r = denA * denB === 0 ? 0 : num / Math.sqrt(denA * denB);
      correlationMatrix[colA][colB] = Number(r.toFixed(2));
    });
  });

  // 5. Build Final Metrics
  const qualityScore = Math.max(0, 100 - ((duplicatesRemoved + missingValuesRemoved) / originalCount) * 100);

  return {
    cleaned,
    metrics: {
      originalCount,
      cleanedCount: cleaned.length,
      duplicatesRemoved,
      missingValuesRemoved,
      columnsAnalysis,
      qualityScore: Math.round(qualityScore),
      correlationMatrix,
    }
  };
}
