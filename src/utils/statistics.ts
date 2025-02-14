import { ParticipantData, StatsSummary, CorrelationResult } from '../types/research';

export const calculateCorrelation = (x: number[], y: number[]): number => {
  // Ensure arrays are of equal length and not empty
  if (x.length !== y.length || x.length === 0) {
    return 0;
  }

  // Filter out any pairs where either value is 0 or invalid
  const validPairs = x.map((val, i) => [val, y[i]])
    .filter(([xVal, yVal]) => 
      xVal !== null && 
      yVal !== null && 
      !isNaN(xVal) && 
      !isNaN(yVal) && 
      xVal !== 0 && 
      yVal !== 0
    );

  if (validPairs.length < 2) {
    return 0;
  }

  const xValues = validPairs.map(pair => pair[0]);
  const yValues = validPairs.map(pair => pair[1]);

  const n = validPairs.length;
  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = validPairs.reduce((sum, [x, y]) => sum + x * y, 0);
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);
  const sumYY = yValues.reduce((sum, y) => sum + y * y, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

  if (denominator === 0) {
    return 0;
  }

  const correlation = numerator / denominator;
  
  // Ensure the result is within valid correlation bounds
  if (isNaN(correlation) || !isFinite(correlation)) {
    return 0;
  }
  
  return Math.max(-1, Math.min(1, correlation));
};

export const calculateStats = (data: number[]): StatsSummary => {
  const filteredData = data.filter(n => n !== 0);
  const mean = filteredData.reduce((a, b) => a + b) / filteredData.length;
  const sortedData = [...filteredData].sort((a, b) => a - b);
  const median = sortedData[Math.floor(sortedData.length / 2)];
  const variance = filteredData.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / filteredData.length;
  const stdDev = Math.sqrt(variance);

  return {
    mean,
    median,
    stdDev,
    min: Math.min(...filteredData),
    max: Math.max(...filteredData)
  };
};

export const analyzePhoneTimeCorrelations = (data: ParticipantData[]): CorrelationResult[] => {
  const validData = data.filter(d => d.phoneTime > 0 && d.recovery > 0);
  const phoneTime = validData.map(d => d.phoneTime);

  return [
    {
      variable: 'Recovery',
      correlation: calculateCorrelation(phoneTime, validData.map(d => d.recovery)),
      significance: 0.05
    },
    {
      variable: 'Depression',
      correlation: calculateCorrelation(phoneTime, validData.map(d => d.depression)),
      significance: 0.05
    },
    {
      variable: 'Anxiety',
      correlation: calculateCorrelation(phoneTime, validData.map(d => d.anxiety)),
      significance: 0.05
    },
    {
      variable: 'Sleep',
      correlation: calculateCorrelation(phoneTime, validData.map(d => d.sleep)),
      significance: 0.05
    }
  ];
}; 