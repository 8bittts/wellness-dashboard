export interface ParticipantData {
  id: number;
  date: string;
  age: number;
  sex: 'f' | 'm';
  phoneTime: number;
  depression: number;
  anxiety: number;
  sleep: number;
  recovery: number;
}

export interface CorrelationResult {
  variable: string;
  correlation: number;
  significance: number;
}

export interface StatsSummary {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
} 