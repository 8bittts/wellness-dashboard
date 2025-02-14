'use client';

import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ScatterController, TooltipItem } from 'chart.js';
import { Line, Bar, Scatter } from 'react-chartjs-2';
import { ParticipantData } from '../types/research';
import { MetricsCard } from '../components/MetricsCard';
import { ChartContainer } from '../components/ChartContainer';
import { DataEntryForm } from '../components/DataEntryForm';
import { DataTable } from '../components/DataTable';
import { calculateCorrelation } from '../utils/statistics';
import { ChartControls } from '../components/ChartControls';
import { ChartViewMode, CHART_VIEWS } from '../types/charts';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ScatterController
);

const CHART_COLORS = {
  mppus: 'rgba(79, 70, 229, 0.8)',      // Indigo
  aware: 'rgba(236, 72, 153, 0.8)',      // Pink
  phoneTime: 'rgba(16, 185, 129, 0.8)',  // Emerald
  borderColor: 'rgba(209, 213, 219, 0.8)'
};

const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      align: 'center' as const,
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle',
        font: {
          size: 12,
          weight: 500
        },
        boxWidth: 10,
        boxHeight: 10
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: 'rgb(17, 24, 39)',
      bodyColor: 'rgb(55, 65, 81)',
      borderColor: 'rgba(229, 231, 235, 0.5)',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      callbacks: {
        label: function(context: TooltipItem<'line' | 'bar' | 'scatter'>) {
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
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(243, 244, 246, 0.8)',
      },
      ticks: {
        padding: 10,
        font: {
          size: 11,
          weight: 500
        },
        color: 'rgb(55, 65, 81)',
      }
    },
    x: {
      grid: {
        color: 'rgba(243, 244, 246, 0.8)',
      },
      ticks: {
        padding: 10,
        font: {
          size: 11,
          weight: 500
        },
        color: 'rgb(55, 65, 81)',
      }
    }
  },
  layout: {
    padding: {
      top: 10,
      right: 20,
      bottom: 40,
      left: 20
    }
  }
};

export default function Home() {
  const [data, setData] = useState<ParticipantData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ageCorrelationsView, setAgeCorrelationsView] = useState<ChartViewMode>('scatter');
  const [phoneTimeView, setPhoneTimeView] = useState<ChartViewMode>('scatter');
  const [mentalHealthView, setMentalHealthView] = useState<ChartViewMode>('bar');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/participants');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const participantsData = await response.json();
      setData(participantsData);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/participants/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to delete participant (${response.status})`);
      }
      await fetchData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting participant';
      console.error(errorMessage);
      // Optionally show error to user via toast or alert
    }
  };

  const handleAddEntry = async (newEntry: ParticipantData) => {
    try {
      const response = await fetch('/api/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to add participant (${response.status})`);
      }
      await fetchData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error adding participant';
      console.error(errorMessage);
      console.error('Error adding participant:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate correlations with proper filtering and error handling
  const calculateMetrics = () => {
    const validData = data.filter(d => 
      d.Mobile_Phone_Problematic_Use_Score > 0 && 
      d.Advanced_Warning_of_Relapse_Score > 0 &&
      d.age > 0 &&
      d.phoneTime > 0
    );
    
    const mppusVsAge = calculateCorrelation(
      validData.map(d => d.age),
      validData.map(d => d.Mobile_Phone_Problematic_Use_Score)
    );

    const awareVsAge = calculateCorrelation(
      validData.map(d => d.age),
      validData.map(d => d.Advanced_Warning_of_Relapse_Score)
    );

    const mppusVsPhoneTime = calculateCorrelation(
      validData.map(d => d.phoneTime),
      validData.map(d => d.Mobile_Phone_Problematic_Use_Score)
    );

    return {
      mppusVsAge: (Math.round(mppusVsAge * 100) / 100).toFixed(2),
      awareVsAge: (Math.round(awareVsAge * 100) / 100).toFixed(2),
      mppusVsPhoneTime: (Math.round(mppusVsPhoneTime * 100) / 100).toFixed(2)
    };
  };

  const metrics = calculateMetrics();

  // Calculate statistics for each measure
  const calculateStats = (values: number[]) => {
    const sortedValues = [...values].sort((a, b) => a - b);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const median = sortedValues[Math.floor(sortedValues.length / 2)];
    const mode = sortedValues.reduce(
      (a, b, i, arr) =>
        arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b,
      sortedValues[0]
    );
    
    return {
      mean: Math.round(mean * 100) / 100,
      median: Math.round(median * 100) / 100,
      mode: Math.round(mode * 100) / 100
    };
  };

  // Calculate trend line data
  const calculateTrendLine = (data: { x: number; y: number }[]) => {
    const n = data.length;
    const sumX = data.reduce((acc, point) => acc + point.x, 0);
    const sumY = data.reduce((acc, point) => acc + point.y, 0);
    const sumXY = data.reduce((acc, point) => acc + point.x * point.y, 0);
    const sumXX = data.reduce((acc, point) => acc + point.x * point.x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    const minX = Math.min(...data.map(point => point.x));
    const maxX = Math.max(...data.map(point => point.x));
    
    return {
      start: { x: minX, y: slope * minX + intercept },
      end: { x: maxX, y: slope * maxX + intercept }
    };
  };

  // Prepare scatter plot data with proper filtering and trend lines
  const mppusData = data
    .filter(d => d.Mobile_Phone_Problematic_Use_Score > 0 && d.age > 0)
    .map(d => ({ x: d.age, y: d.Mobile_Phone_Problematic_Use_Score }));
  
  const awareData = data
    .filter(d => d.Advanced_Warning_of_Relapse_Score > 0 && d.age > 0)
    .map(d => ({ x: d.age, y: d.Advanced_Warning_of_Relapse_Score }));

  const mppusTrendLine = calculateTrendLine(mppusData);
  const awareTrendLine = calculateTrendLine(awareData);

  const ageCorrelationsData = {
    datasets: [
      {
        label: 'MPPUS Score',
        data: mppusData,
        backgroundColor: CHART_COLORS.mppus,
        borderColor: CHART_COLORS.borderColor,
        borderWidth: 1,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'MPPUS Trend',
        data: [mppusTrendLine.start, mppusTrendLine.end],
        backgroundColor: 'transparent',
        borderColor: CHART_COLORS.mppus,
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        showLine: true,
      },
      {
        label: 'AWARE Score',
        data: awareData,
        backgroundColor: CHART_COLORS.aware,
        borderColor: CHART_COLORS.borderColor,
        borderWidth: 1,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'AWARE Trend',
        data: [awareTrendLine.start, awareTrendLine.end],
        backgroundColor: 'transparent',
        borderColor: CHART_COLORS.aware,
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        showLine: true,
      }
    ]
  };

  const mppusStats = calculateStats(data.filter(d => d.Mobile_Phone_Problematic_Use_Score > 0).map(d => d.Mobile_Phone_Problematic_Use_Score));
  const awareStats = calculateStats(data.filter(d => d.Advanced_Warning_of_Relapse_Score > 0).map(d => d.Advanced_Warning_of_Relapse_Score));

  // Phone Time vs MPPUS correlation with filtering and trend line
  const phoneTimeData = data
    .filter(d => d.Mobile_Phone_Problematic_Use_Score > 0 && d.phoneTime > 0)
    .map(d => ({ x: d.phoneTime, y: d.Mobile_Phone_Problematic_Use_Score }));

  const phoneTimeTrendLine = calculateTrendLine(phoneTimeData);

  const phoneTimeCorrelationData = {
    datasets: [
      {
        label: 'MPPUS vs Phone Time',
        data: phoneTimeData,
        backgroundColor: CHART_COLORS.phoneTime,
        borderColor: CHART_COLORS.borderColor,
        borderWidth: 1,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Trend Line',
        data: [phoneTimeTrendLine.start, phoneTimeTrendLine.end],
        backgroundColor: 'transparent',
        borderColor: CHART_COLORS.phoneTime,
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        showLine: true,
      }
    ]
  };

  // Mental Health Correlations with filtering
  const validDataForCorrelations = data.filter(d => 
    d.Mobile_Phone_Problematic_Use_Score > 0 && 
    d.Advanced_Warning_of_Relapse_Score > 0 &&
    d.depression > 0 &&
    d.anxiety > 0 &&
    d.sleep > 0
  );

  const mentalHealthData = {
    labels: ['Depression', 'Anxiety', 'Sleep Quality'],
    datasets: [
      {
        label: 'Correlation with MPPUS',
        data: [
          calculateCorrelation(validDataForCorrelations.map(d => d.depression), validDataForCorrelations.map(d => d.Mobile_Phone_Problematic_Use_Score)),
          calculateCorrelation(validDataForCorrelations.map(d => d.anxiety), validDataForCorrelations.map(d => d.Mobile_Phone_Problematic_Use_Score)),
          calculateCorrelation(validDataForCorrelations.map(d => d.sleep), validDataForCorrelations.map(d => d.Mobile_Phone_Problematic_Use_Score))
        ].map(val => Math.round(val * 100) / 100),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Correlation with AWARE',
        data: [
          calculateCorrelation(validDataForCorrelations.map(d => d.depression), validDataForCorrelations.map(d => d.Advanced_Warning_of_Relapse_Score)),
          calculateCorrelation(validDataForCorrelations.map(d => d.anxiety), validDataForCorrelations.map(d => d.Advanced_Warning_of_Relapse_Score)),
          calculateCorrelation(validDataForCorrelations.map(d => d.sleep), validDataForCorrelations.map(d => d.Advanced_Warning_of_Relapse_Score))
        ].map(val => Math.round(val * 100) / 100),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Mobile Phone Use and Recovery Research Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Investigating the relationships between age, mobile phone usage patterns, and recovery outcomes
            in individuals with Substance Use Disorder (SUD).
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <MetricsCard
            title="Age vs MPPUS"
            value={metrics.mppusVsAge}
            subtitle="correlation coefficient"
          />
          <MetricsCard
            title="Age vs AWARE"
            value={metrics.awareVsAge}
            subtitle="correlation coefficient"
          />
          <MetricsCard
            title="Phone Time vs MPPUS"
            value={metrics.mppusVsPhoneTime}
            subtitle="correlation coefficient"
          />
        </div>

        {/* Main Hypothesis Visualization */}
        <div className="space-y-8">
          <div>
            <ChartContainer 
              title="Age Correlations with MPPUS and AWARE Scores"
              controls={
                <ChartControls
                  activeView={ageCorrelationsView}
                  onViewChange={(view) => setAgeCorrelationsView(view as ChartViewMode)}
                  views={CHART_VIEWS.filter(v => v.id !== 'bubble')}
                />
              }
            >
              <div className="mb-4">
                <p className="text-gray-600">
                  <strong>Hypothesis:</strong> Both MPPUS (Mobile Phone Problematic Use Scale) and AWARE scores are expected to decrease with age, 
                  suggesting that younger individuals may be more susceptible to problematic phone use and relapse risk.
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Findings:</strong> The data shows a {Number(metrics.mppusVsAge) < 0 ? "negative" : "positive"} correlation 
                  (r = {metrics.mppusVsAge}) between age and MPPUS, and a {Number(metrics.awareVsAge) < 0 ? "negative" : "positive"} correlation 
                  (r = {metrics.awareVsAge}) between age and AWARE scores, {Number(metrics.mppusVsAge) < 0 ? "supporting" : "challenging"} the initial hypothesis.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                      <h4 className="font-semibold text-gray-800">MPPUS Statistics</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Mean</span>
                        <span className="font-medium text-gray-800">{mppusStats.mean}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Median</span>
                        <span className="font-medium text-gray-800">{mppusStats.median}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Mode</span>
                        <span className="font-medium text-gray-800">{mppusStats.mode}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                      <h4 className="font-semibold text-gray-800">AWARE Statistics</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Mean</span>
                        <span className="font-medium text-gray-800">{awareStats.mean}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Median</span>
                        <span className="font-medium text-gray-800">{awareStats.median}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Mode</span>
                        <span className="font-medium text-gray-800">{awareStats.mode}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[600px] pb-12">
                {ageCorrelationsView === 'scatter' && (
                  <Scatter 
                    data={ageCorrelationsData} 
                    options={defaultChartOptions}
                  />
                )}
                {ageCorrelationsView === 'line' && (
                  <Line
                    data={{
                      labels: [...new Set(data.map(d => d.age))].sort((a, b) => a - b),
                      datasets: [
                        {
                          label: 'MPPUS Score',
                          data: mppusData.map(d => d.y),
                          borderColor: CHART_COLORS.mppus,
                          backgroundColor: CHART_COLORS.mppus,
                          tension: 0.4,
                        },
                        {
                          label: 'AWARE Score',
                          data: awareData.map(d => d.y),
                          borderColor: CHART_COLORS.aware,
                          backgroundColor: CHART_COLORS.aware,
                          tension: 0.4,
                        }
                      ]
                    }}
                    options={defaultChartOptions}
                  />
                )}
                {ageCorrelationsView === 'bar' && (
                  <Bar
                    data={{
                      labels: [...new Set(data.map(d => d.age))].sort((a, b) => a - b),
                      datasets: [
                        {
                          label: 'MPPUS Score',
                          data: mppusData.map(d => d.y),
                          backgroundColor: CHART_COLORS.mppus,
                        },
                        {
                          label: 'AWARE Score',
                          data: awareData.map(d => d.y),
                          backgroundColor: CHART_COLORS.aware,
                        }
                      ]
                    }}
                    options={defaultChartOptions}
                  />
                )}
              </div>
            </ChartContainer>
          </div>

          <div>
            <ChartContainer 
              title="Phone Time vs MPPUS Score"
              controls={
                <ChartControls
                  activeView={phoneTimeView}
                  onViewChange={(view) => setPhoneTimeView(view as ChartViewMode)}
                  views={CHART_VIEWS}
                />
              }
            >
              <div className="mb-4">
                <p className="text-gray-600">
                  <strong>Hypothesis:</strong> Daily phone usage time is expected to positively correlate with MPPUS scores,
                  indicating that higher phone usage is associated with more problematic use patterns.
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Findings:</strong> The correlation coefficient of {metrics.mppusVsPhoneTime} indicates a 
                  {Number(metrics.mppusVsPhoneTime) > 0.3 ? " moderate to strong" : Number(metrics.mppusVsPhoneTime) > 0 ? " weak to moderate" : " negative"} 
                  relationship between daily phone time and MPPUS scores.
                </p>
              </div>
              <div className="h-[600px] pb-12">
                {phoneTimeView === 'scatter' && (
                  <Scatter 
                    data={phoneTimeCorrelationData}
                    options={defaultChartOptions}
                  />
                )}
                {phoneTimeView === 'line' && (
                  <Line
                    data={{
                      labels: [...new Set(data.map(d => d.phoneTime))].sort((a, b) => a - b),
                      datasets: [
                        {
                          label: 'MPPUS Score',
                          data: phoneTimeData.map(d => d.y),
                          borderColor: CHART_COLORS.phoneTime,
                          backgroundColor: CHART_COLORS.phoneTime,
                          tension: 0.4,
                        }
                      ]
                    }}
                    options={defaultChartOptions}
                  />
                )}
                {phoneTimeView === 'bar' && (
                  <Bar
                    data={{
                      labels: [...new Set(data.map(d => d.phoneTime))].sort((a, b) => a - b),
                      datasets: [
                        {
                          label: 'MPPUS Score',
                          data: phoneTimeData.map(d => d.y),
                          backgroundColor: CHART_COLORS.phoneTime,
                        }
                      ]
                    }}
                    options={defaultChartOptions}
                  />
                )}
                {phoneTimeView === 'bubble' && (
                  <Scatter
                    data={{
                      datasets: [{
                        label: 'MPPUS vs Phone Time',
                        data: phoneTimeData.map(d => ({
                          x: d.x,
                          y: d.y,
                          r: Math.sqrt(d.y) / 2
                        })),
                        backgroundColor: CHART_COLORS.phoneTime,
                      }]
                    }}
                    options={{
                      ...defaultChartOptions,
                      elements: {
                        point: {
                          radius: 10,
                          hoverRadius: 12
                        }
                      }
                    }}
                  />
                )}
              </div>
            </ChartContainer>
          </div>

          <div>
            <ChartContainer 
              title="Mental Health Correlations"
              controls={
                <ChartControls
                  activeView={mentalHealthView}
                  onViewChange={(view) => setMentalHealthView(view as ChartViewMode)}
                  views={CHART_VIEWS.filter(v => v.id !== 'bubble')}
                />
              }
            >
              <div className="mb-4">
                <p className="text-gray-600">
                  <strong>Hypothesis:</strong> Mental health indicators (depression, anxiety, and sleep quality) are expected to 
                  correlate with both MPPUS and AWARE scores, suggesting interconnected relationships between phone use, recovery, and mental health.
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Findings:</strong> The strongest correlations are observed between 
                  {mentalHealthData.datasets[0].data.indexOf(Math.max(...mentalHealthData.datasets[0].data)) === 0 ? " depression" : 
                    mentalHealthData.datasets[0].data.indexOf(Math.max(...mentalHealthData.datasets[0].data)) === 1 ? " anxiety" : " sleep quality"} 
                  and MPPUS scores, while AWARE scores show different patterns of association.
                </p>
              </div>
              <div className="h-[600px] pb-12">
                {mentalHealthView === 'bar' && (
                  <Bar 
                    data={mentalHealthData}
                    options={defaultChartOptions}
                  />
                )}
                {mentalHealthView === 'line' && (
                  <Line
                    data={mentalHealthData}
                    options={defaultChartOptions}
                  />
                )}
                {mentalHealthView === 'scatter' && (
                  <Scatter
                    data={{
                      datasets: [
                        {
                          label: 'MPPUS Correlations',
                          data: mentalHealthData.labels.map((label, i) => ({
                            x: i,
                            y: mentalHealthData.datasets[0].data[i]
                          })),
                          backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        },
                        {
                          label: 'AWARE Correlations',
                          data: mentalHealthData.labels.map((label, i) => ({
                            x: i,
                            y: mentalHealthData.datasets[1].data[i]
                          })),
                          backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        }
                      ]
                    }}
                    options={{
                      ...defaultChartOptions,
                      scales: {
                        ...defaultChartOptions.scales,
                        x: {
                          ...defaultChartOptions.scales.x,
                          type: 'category' as const,
                          labels: mentalHealthData.labels
                        },
                        y: {
                          ...defaultChartOptions.scales.y,
                          title: { display: true, text: 'Correlation Coefficient' }
                        }
                      }
                    }}
                  />
                )}
              </div>
            </ChartContainer>
          </div>
        </div>

        {/* Data Entry Form */}
        <div className="mt-8">
          <DataEntryForm
            onSubmit={handleAddEntry}
            nextId={Math.max(...data.map(d => d.id)) + 1}
          />
        </div>

        {/* Raw Data Table */}
        <div className="mt-8">
          <DataTable
            data={data}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
