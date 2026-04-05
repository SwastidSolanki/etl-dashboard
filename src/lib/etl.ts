export type LogLevel = "INFO" | "WARN" | "SUCCESS" | "ERROR";

export interface DashboardLog {
  id: string;
  time: string;
  level: LogLevel;
  message: string;
}

export interface ETLMetrics {
  totalOriginalRows: number;
  totalCleanedRows: number;
  missingValuesRemoved: number;
  duplicatesRemoved: number;
  qualityScore: number;
  columnsAnalysis: { name: string; valid: number; invalid: number }[];
}

export function cleanData(rawData: Record<string, any>[]): { cleaned: Record<string, any>[], metrics: ETLMetrics } {
  if (!rawData || rawData.length === 0) {
    return {
      cleaned: [],
      metrics: {
        totalOriginalRows: 0,
        totalCleanedRows: 0,
        missingValuesRemoved: 0,
        duplicatesRemoved: 0,
        qualityScore: 0,
        columnsAnalysis: []
      }
    };
  }

  const columns = Object.keys(rawData[0]);
  const columnsAnalysis = columns.map(col => ({ name: col, valid: 0, invalid: 0 }));

  let missingValuesRemoved = 0;
  const validRows: Record<string, any>[] = [];
  const stringifiedRows = new Set<string>();
  let duplicatesRemoved = 0;

  for (const row of rawData) {
    // Check missing values
    let isRowValid = true;
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const val = row[col];
      
      // Strict empty check
      if (val === null || val === undefined || String(val).trim() === '') {
        isRowValid = false;
        columnsAnalysis[i].invalid++;
      } else {
        columnsAnalysis[i].valid++;
      }
    }

    if (!isRowValid) {
      missingValuesRemoved++;
      continue;
    }

    // Check duplicates
    const stringified = JSON.stringify(row);
    if (stringifiedRows.has(stringified)) {
      duplicatesRemoved++;
    } else {
      stringifiedRows.add(stringified);
      validRows.push(row);
    }
  }

  // Calculate percentages for column analysis
  for (const col of columnsAnalysis) {
    const total = col.valid + col.invalid;
    if (total > 0) {
      col.valid = Math.round((col.valid / total) * 100);
      col.invalid = 100 - col.valid;
    }
  }

  const baseScore = validRows.length / rawData.length;
  const qualityScore = Math.round(baseScore * 1000) / 10;

  return {
    cleaned: validRows,
    metrics: {
      totalOriginalRows: rawData.length,
      totalCleanedRows: validRows.length,
      missingValuesRemoved,
      duplicatesRemoved,
      qualityScore,
      columnsAnalysis
    }
  };
}
