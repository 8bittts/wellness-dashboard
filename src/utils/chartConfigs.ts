import { ParticipantData } from '../types/research';

/**
 * Color constants for chart elements
 */
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

/**
 * Calculates the trend line for a set of data points
 * @param data Array of {x, y} points to calculate trend line for
 * @returns Trend line parameters including slope, intercept, and bounds
 */
export function calculateTrendLine(data: { x: number; y: number }[]) {
  // Handle edge cases
  if (!data || data.length < 2) {
    return {
      slope: 0,
      intercept: 0,
      minX: 0,
      maxX: 0
    };
  }
  
  const xValues = data.map(d => d.x);
  const yValues = data.map(d => d.y);
  
  const n = xValues.length;
  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);
  
  // Check for division by zero
  const denominator = (n * sumXX - sumX * sumX);
  if (denominator === 0) {
    return {
      slope: 0,
      intercept: yValues.reduce((a, b) => a + b, 0) / yValues.length,
      minX: Math.min(...xValues),
      maxX: Math.max(...xValues),
    };
  }
  
  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;
  
  return {
    slope,
    intercept,
    minX: Math.min(...xValues),
    maxX: Math.max(...xValues),
  };
}

/**
 * Generates mental health chart data from participant data
 * @param data Array of participant data
 * @returns Formatted chart data with depression, anxiety and sleep metrics
 */
export function getMentalHealthChartData(data: ParticipantData[]) {
  // Filter out invalid entries
  const validData = data.filter(d => 
    d.depression > 0 && d.anxiety > 0 && d.sleep > 0
  );
  
  if (validData.length === 0) {
    return {
      labels: [],
      datasets: []
    };
  }
  
  return {
    labels: validData.map(d => d.id.toString()),
    datasets: [
      {
        label: 'Depression',
        data: validData.map(d => d.depression),
        backgroundColor: CHART_COLORS.depression,
        borderColor: CHART_COLORS.depression,
        borderWidth: 1,
      },
      {
        label: 'Anxiety',
        data: validData.map(d => d.anxiety),
        backgroundColor: CHART_COLORS.anxiety,
        borderColor: CHART_COLORS.anxiety,
        borderWidth: 1,
      },
      {
        label: 'Sleep Quality',
        data: validData.map(d => d.sleep),
        backgroundColor: CHART_COLORS.sleep,
        borderColor: CHART_COLORS.sleep,
        borderWidth: 1,
      },
    ],
  };
}

/**
 * Generates phone time vs recovery chart data
 * @param data Array of participant data
 * @returns Formatted chart data for scatter plot of phone time vs recovery
 */
export function getPhoneTimeVsRecoveryData(data: ParticipantData[]) {
  // Filter out invalid entries
  const validData = data.filter(d => 
    d.phoneTime > 0 && d.recovery > 0
  );
  
  if (validData.length === 0) {
    return {
      datasets: []
    };
  }
  
  const points = validData.map(d => ({
    x: d.phoneTime,
    y: d.recovery
  }));
  
  const trendLine = calculateTrendLine(points);
  
  return {
    datasets: [
      {
        label: 'Phone Time vs Recovery',
        data: points,
        backgroundColor: CHART_COLORS.dataPoints,
        borderColor: 'white',
        borderWidth: 1,
        radius: 5,
      },
      {
        label: 'Trend Line',
        data: [
          { x: trendLine.minX, y: trendLine.slope * trendLine.minX + trendLine.intercept },
          { x: trendLine.maxX, y: trendLine.slope * trendLine.maxX + trendLine.intercept }
        ],
        borderColor: CHART_COLORS.trendLine,
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        showLine: true,
      }
    ],
  };
}

/**
 * Generates gender comparison chart data
 * @param data Array of participant data
 * @returns Formatted chart data comparing metrics between genders
 */
export function getGenderComparisonData(data: ParticipantData[]) {
  const calculateAverage = (data: ParticipantData[], field: keyof ParticipantData, sex: 'f' | 'm') => {
    const filtered = data.filter(d => 
      d.sex === sex && 
      typeof d[field] === 'number' && 
      (d[field] as number) > 0
    );
    
    if (filtered.length === 0) return 0;
    
    const values = filtered.map(d => d[field] as number);
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };
  
  const fields = [
    "Mobile_Phone_Problematic_Use_Score", 
    "Advanced_Warning_of_Relapse_Score", 
    "phoneTime", 
    "depression", 
    "anxiety", 
    "sleep"
  ] as const;
  
  const labels = [
    "Mobile Phone Use", 
    "Relapse Warning", 
    "Screen Time", 
    "Depression", 
    "Anxiety", 
    "Sleep Quality"
  ];
  
  const femaleData = fields.map(field => calculateAverage(data, field, 'f'));
  const maleData = fields.map(field => calculateAverage(data, field, 'm'));
  
  return {
    labels,
    datasets: [
      {
        label: 'Female',
        data: femaleData,
        backgroundColor: 'rgba(236, 72, 153, 0.6)',
        borderColor: 'rgba(236, 72, 153, 1)',
        borderWidth: 1,
      },
      {
        label: 'Male',
        data: maleData,
        backgroundColor: 'rgba(37, 99, 235, 0.6)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 1,
      }
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
      position: 'bottom' as const,
      align: 'center' as const,
      labels: {
        padding: 25,
        font: {
          size: 12,
          weight: 500,
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
        label: function(context: { dataset: { label?: string }; parsed: { y: number | null } }) {
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
  layout: {
    padding: {
      top: 20,
      right: 20,
      bottom: 80,
      left: 20
    }
  }
}; 