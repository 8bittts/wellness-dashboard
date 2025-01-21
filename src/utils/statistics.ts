import { ParticipantData, StatsSummary, CorrelationResult } from '../types/research';

export const calculateCorrelation = (x: number[], y: number[]): number => {
  const n = x.length;
  const sum1 = x.reduce((a, b) => a + b) * y.reduce((a, b) => a + b);
  const sum2 = x.reduce((a, b) => a + b * b) * y.reduce((a, b) => a + b * b);
  const sum3 = x.map((x, i) => x * y[i]).reduce((a, b) => a + b);
  return (n * sum3 - sum1) / Math.sqrt((n * sum2 - sum1 * sum1));
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