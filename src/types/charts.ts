export type ChartViewMode = 'scatter' | 'line' | 'bar' | 'bubble';

export interface ChartView {
  id: ChartViewMode;
  label: string;
}

export const CHART_VIEWS: ChartView[] = [
  { id: 'scatter', label: 'Scatter Plot' },
  { id: 'line', label: 'Line Chart' },
  { id: 'bar', label: 'Bar Chart' },
  { id: 'bubble', label: 'Bubble Chart' }
]; 