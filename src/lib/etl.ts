export type LogLevel = "INFO" | "WARN" | "SUCCESS" | "ERROR";

export interface DashboardLog {
  id: string;
  time: string;
  level: LogLevel;
  message: string;
}

export interface ColumnMetric {
  name: string;
  type: "numeric" | "string" | "date" | "boolean";
  completeness: number; // percentage
  uniqueValues: number;
  outliers?: number;
  min?: number;
  max?: number;
  mean?: number;
}

export interface ETLMetrics {
  totalOriginalRows: number;
  totalCleanedRows: number;
  missingValuesRemoved: number;
  duplicatesRemoved: number;
  qualityScore: number;
  columnsAnalysis: ColumnMetric[];
  correlationMatrix?: Record<string, Record<string, number>>;
}

export function cleanData(rawData: Record<string, unknown>[]): { cleaned: Record<string, unknown>[], metrics: ETLMetrics } {
  if (!rawData || rawData.length === 0) {
    return {
      cleaned: [],
      metrics: {
        totalOriginalRows: 0,
        totalCleanedRows: 0,
        missingValuesRemoved: 0,
        duplicatesRemoved: 0,
        qualityScore: 0,
        columnsAnalysis: [],
        correlationMatrix: {}
      }
    };
  }

  const columns = Object.keys(rawData[0]);
  const columnData: Record<string, any[]> = {};
  columns.forEach(col => columnData[col] = []);

  let missingValuesRemoved = 0;
  const validRows: Record<string, unknown>[] = [];
  const stringifiedRows = new Set<string>();
  let duplicatesRemoved = 0;

  for (const row of rawData) {
    let isRowValid = true;
    for (const col of columns) {
      const val = row[col];
      if (val === null || val === undefined || String(val).trim() === '') {
        isRowValid = false;
        break;
      }
    }

    if (!isRowValid) {
      missingValuesRemoved++;
      continue;
    }

    const stringified = JSON.stringify(row);
    if (stringifiedRows.has(stringified)) {
      duplicatesRemoved++;
    } else {
      stringifiedRows.add(stringified);
      validRows.push(row);
      // Collect data for analysis
      columns.forEach(col => columnData[col].push(row[col]));
    }
  }

  // Advanced Analysis
  const columnsAnalysis: ColumnMetric[] = columns.map(col => {
    const values = columnData[col];
    const total = rawData.length;
    const completeness = Math.round((values.length / total) * 100);
    
    // Detect Type
    const sample = values[0];
    let type: ColumnMetric["type"] = "string";
    if (typeof sample === "number") type = "numeric";
    else if (typeof sample === "boolean") type = "boolean";
    else if (!isNaN(Date.parse(String(sample)))) type = "date";

    const uniqueValues = new Set(values).size;

    const metric: ColumnMetric = { name: col, type, completeness, uniqueValues };

    if (type === "numeric") {
      const nums = values.map(v => Number(v)).filter(v => !isNaN(v)).sort((a, b) => a - b);
      if (nums.length > 0) {
        metric.min = nums[0];
        metric.max = nums[nums.length - 1];
        metric.mean = Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100;
        
        // Z-score Outliers
        const stdDev = Math.sqrt(nums.map(x => Math.pow(x - (metric.mean || 0), 2)).reduce((a, b) => a + b, 0) / nums.length);
        const zOutliers = nums.filter(x => Math.abs(x - (metric.mean || 0)) > 3 * stdDev).length;

        // IQR Outliers
        const q1 = nums[Math.floor(nums.length / 4)];
        const q3 = nums[Math.floor(nums.length * 0.75)];
        const iqr = q3 - q1;
        const iqrOutliers = nums.filter(x => x < q1 - 1.5 * iqr || x > q3 + 1.5 * iqr).length;

        metric.outliers = Math.max(zOutliers, iqrOutliers);
      }
    }

    return metric;
  });

  // Physical Pearson Correlation Matrix (Numeric Only)
  const numericCols = columnsAnalysis.filter(c => c.type === "numeric").map(c => c.name);
  const correlationMatrix: Record<string, Record<string, number>> = {};

  if (numericCols.length >= 2) {
    numericCols.forEach(colA => {
      correlationMatrix[colA] = {};
      numericCols.forEach(colB => {
        if (colA === colB) {
          correlationMatrix[colA][colB] = 1;
        } else {
          const valuesA = columnData[colA].map(v => Number(v));
          const valuesB = columnData[colB].map(v => Number(v));
          
          const meanA = valuesA.reduce((a, b) => a + b, 0) / valuesA.length;
          const meanB = valuesB.reduce((a, b) => a + b, 0) / valuesB.length;
          
          let num = 0;
          let denA = 0;
          let denB = 0;
          
          for (let k = 0; k < valuesA.length; k++) {
            const diffA = valuesA[k] - meanA;
            const diffB = valuesB[k] - meanB;
            num += diffA * diffB;
            denA += diffA * diffA;
            denB += diffB * diffB;
          }
          
          const r = denA * denB === 0 ? 0 : num / Math.sqrt(denA * denB);
          correlationMatrix[colA][colB] = Math.round(r * 100) / 100;
        }
      });
    });
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
      columnsAnalysis,
      correlationMatrix
    }
  };
}
