'use client';

import { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ScatterController } from 'chart.js';
import { Line, Bar, Scatter } from 'react-chartjs-2';
import { participantData } from '../data/researchData';
import { ParticipantData } from '../types/research';
import { MetricsCard } from '../components/MetricsCard';
import { ChartContainer } from '../components/ChartContainer';
import { DataEntryForm } from '../components/DataEntryForm';
import { DataTable } from '../components/DataTable';
import { getMentalHealthChartData, getPhoneTimeVsRecoveryData, getGenderComparisonData, defaultChartOptions } from '../utils/chartConfigs';

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

export default function Home() {
  const [data, setData] = useState<ParticipantData[]>(participantData);

  const handleDelete = (id: number) => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  const handleAddEntry = (newEntry: ParticipantData) => {
    setData(prev => [...prev, newEntry]);
  };

  // Calculate metrics
  const averagePhoneTime = Math.round(
    data.filter(d => d.phoneTime > 0)
      .reduce((acc, curr) => acc + curr.phoneTime, 0) / 
    data.filter(d => d.phoneTime > 0).length
  );

  const averageRecovery = Math.round(
    data.filter(d => d.recovery > 0)
      .reduce((acc, curr) => acc + curr.recovery, 0) / 
    data.filter(d => d.recovery > 0).length
  );

  const femaleCount = data.filter(d => d.sex === 'f').length;
  const maleCount = data.filter(d => d.sex === 'm').length;

  // Prepare chart data
  const mentalHealthData = getMentalHealthChartData(data);
  const phoneTimeVsRecovery = getPhoneTimeVsRecoveryData(data);
  const genderComparisonData = getGenderComparisonData(data);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Wellness Metrics Dashboard
          </h1>
          <h2 className="text-base sm:text-lg text-gray-600 mb-2">
            Investigating the Relationship Between Smartphone Usage and Recovery Outcomes
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            By Cynthia Lefferts
          </p>
          <div className="max-w-3xl mx-auto bg-white rounded-md shadow-sm p-3 sm:p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              This research investigates the hypothesis that smartphone use is negatively correlated 
              with recovery rates after Treatment as Usual (TAU) for Mexican individuals with 
              Substance Use Disorder (SUD) under 45 years old. The study examines the relationships 
              between daily phone usage, mental health indicators, and recovery outcomes.
            </p>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <MetricsCard
            title="Phone Usage"
            value={averagePhoneTime}
            subtitle="minutes average daily"
          />
          <MetricsCard
            title="Recovery Score"
            value={averageRecovery}
            subtitle="average"
          />
          <MetricsCard
            title="Participants"
            value={femaleCount + maleCount}
            subtitle={`${femaleCount} female, ${maleCount} male`}
          />
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Mental Health Trends */}
          <ChartContainer title="Mental Health Trends">
            <Line data={mentalHealthData} options={defaultChartOptions} />
          </ChartContainer>

          {/* Phone Time vs Recovery */}
          <ChartContainer title="Phone Time vs Recovery">
            <Scatter 
              data={phoneTimeVsRecovery} 
              options={{
                ...defaultChartOptions,
                scales: {
                  ...defaultChartOptions.scales,
                  x: {
                    ...defaultChartOptions.scales.x,
                    title: {
                      display: true,
                      text: 'Daily Phone Usage (minutes)',
                      font: {
                        size: 12,
                        weight: 'bold'
                      }
                    }
                  },
                  y: {
                    ...defaultChartOptions.scales.y,
                    title: {
                      display: true,
                      text: 'Recovery Score',
                      font: {
                        size: 12,
                        weight: 'bold'
                      }
                    },
                    min: 50,
                    max: 120,
                  }
                }
              }} 
            />
          </ChartContainer>

          {/* Gender Comparison */}
          <ChartContainer title="Gender Comparison">
            <Bar data={genderComparisonData} options={defaultChartOptions} />
          </ChartContainer>

          {/* Data Entry Form */}
          <DataEntryForm
            onSubmit={handleAddEntry}
            nextId={data.length + 1}
          />

          {/* Data Table */}
          <DataTable
            data={data}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
