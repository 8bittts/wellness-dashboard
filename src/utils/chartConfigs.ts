import { ParticipantData } from '../types/research';

export const CHART_COLORS = {
  // Bright, distinct colors
  depression: 'rgb(255, 99, 132)',    // Bright pink/red
  anxiety: 'rgb(54, 162, 235)',       // Bright blue
  sleep: 'rgb(255, 206, 86)',         // Bright yellow
  // Scatter plot colors
  dataPoints: 'rgb(147, 51, 234)',    // Bright purple for data points
  trendLine: 'rgb(107, 114, 128)',    // Gray for trend line
  // Bar chart colors
  phoneTime: 'rgb(72, 149, 239)',     // Bright blue
  recovery: 'rgb(34, 197, 94)',       // Bright green
  gridLines: 'rgb(243, 244, 246)',    // Very light gray
} as const;

export function calculateTrendLine(data: { x: number; y: number }[]) {
  const xValues = data.map(d => d.x);
  const yValues = data.map(d => d.y);
  
  const n = xValues.length;
  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return {
    slope,
    intercept,
    minX: Math.min(...xValues),
    maxX: Math.max(...xValues),
  };
}

export function getMentalHealthChartData(data: ParticipantData[]) {
  return {
    labels: data.map(d => d.id.toString()),
    datasets: [
      {
        label: 'Depression',
        data: data.map(d => d.depression),
        borderColor: CHART_COLORS.depression,
        backgroundColor: CHART_COLORS.depression + '20',
        tension: 0.3,
        borderWidth: 2,
        fill: true,
      },
      {
        label: 'Anxiety',
        data: data.map(d => d.anxiety),
        borderColor: CHART_COLORS.anxiety,
        backgroundColor: CHART_COLORS.anxiety + '20',
        tension: 0.3,
        borderWidth: 2,
        fill: true,
      },
      {
        label: 'Sleep',
        data: data.map(d => d.sleep),
        borderColor: CHART_COLORS.sleep,
        backgroundColor: CHART_COLORS.sleep + '20',
        tension: 0.3,
        borderWidth: 2,
        fill: true,
      },
    ],
  };
}

export function getPhoneTimeVsRecoveryData(data: ParticipantData[]) {
  const validData = data.filter(d => d.phoneTime > 0 && d.recovery > 0);
  const points = validData.map(d => ({ x: d.phoneTime, y: d.recovery }));
  const trendLine = calculateTrendLine(points);

  return {
    datasets: [
      {
        type: 'scatter' as const,
        label: 'Individual Data Points',
        data: points,
        backgroundColor: CHART_COLORS.dataPoints,
        pointRadius: 6,
        pointStyle: 'circle',
        pointHoverRadius: 8,
      },
      {
        type: 'scatter' as const,
        label: 'Trend Line',
        data: [
          { x: trendLine.minX, y: trendLine.slope * trendLine.minX + trendLine.intercept },
          { x: trendLine.maxX, y: trendLine.slope * trendLine.maxX + trendLine.intercept }
        ],
        backgroundColor: 'transparent',
        pointRadius: 0,
        showLine: true,
        borderColor: CHART_COLORS.trendLine,
        borderWidth: 2,
        borderDash: [5, 5],
      }
    ],
  };
}

export function getGenderComparisonData(data: ParticipantData[]) {
  const calculateAverage = (data: ParticipantData[], field: keyof ParticipantData, sex: 'f' | 'm') => {
    const filtered = data.filter(d => d.sex === sex);
    return filtered.reduce((acc, curr) => acc + Number(curr[field]), 0) / filtered.length;
  };

  return {
    labels: ['Female', 'Male'],
    datasets: [
      {
        label: 'Phone Time',
        data: ['f', 'm'].map(sex => calculateAverage(data, 'phoneTime', sex as 'f' | 'm')),
        backgroundColor: CHART_COLORS.phoneTime,
        borderRadius: 4,
      },
      {
        label: 'Depression',
        data: ['f', 'm'].map(sex => calculateAverage(data, 'depression', sex as 'f' | 'm')),
        backgroundColor: CHART_COLORS.depression,
        borderRadius: 4,
      },
      {
        label: 'Recovery',
        data: ['f', 'm'].map(sex => calculateAverage(data, 'recovery', sex as 'f' | 'm')),
        backgroundColor: CHART_COLORS.recovery,
        borderRadius: 4,
      },
    ],
  };
}

export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: CHART_COLORS.gridLines,
        drawBorder: false,
        lineWidth: 1,
      },
      ticks: {
        padding: 10,
        font: {
          size: 11,
        },
        color: 'rgb(55, 65, 81)', // Gray-700
      },
    },
    x: {
      grid: {
        color: CHART_COLORS.gridLines,
        drawBorder: false,
        lineWidth: 1,
      },
      ticks: {
        padding: 10,
        font: {
          size: 11,
        },
        color: 'rgb(55, 65, 81)', // Gray-700
      },
    },
  },
  plugins: {
    legend: {
      position: 'top' as const,
      align: 'start' as const,
      labels: {
        padding: 20,
        font: {
          size: 12,
          weight: '500',
        },
        usePointStyle: true,
        boxWidth: 8,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: 'rgb(17, 24, 39)', // Gray-900
      bodyColor: 'rgb(55, 65, 81)',  // Gray-700
      borderColor: 'rgba(229, 231, 235, 0.5)', // Gray-200
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      font: {
        size: 12,
      },
      callbacks: {
        label: function(context: any) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y;
          }
          return label;
        }
      }
    },
  },
}; 