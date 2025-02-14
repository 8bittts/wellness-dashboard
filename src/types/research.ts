export interface ParticipantData {
  id: number;
  date: string;
  round_of_phone_calls: number;
  days_in_treatment: number;
  age: number;
  sex: 'f' | 'm';
  have_you_been_abstinent_the_past_28_days: 'yes' | 'no';
  if_yes_how_long_have_you_been_abstinent: string;
  phoneTime: number;
  depression: number;
  anxiety: number;
  sleep: number;
  recovery: number;
  Mobile_Phone_Problematic_Use_Score: number;
  Advanced_Warning_of_Relapse_Score: number;
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