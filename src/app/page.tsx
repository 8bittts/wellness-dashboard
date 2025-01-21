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
  const [activeView, setActiveView] = useState('overview');

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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Dashboard Views</h2>
          <nav className="space-y-2">
            {['Overview', 'Mental Health', 'Recovery Analysis', 'Gender Comparison', 'Raw Data'].map((item) => (
              <button
                key={item}
                onClick={() => setActiveView(item.toLowerCase().replace(' ', '-'))}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeView === item.toLowerCase().replace(' ', '-')
                    ? 'bg-slate-100 text-slate-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Wellness Metrics Dashboard
            </h1>
            <h2 className="text-xl text-gray-600 mb-2">
              Investigating the Relationship Between Smartphone Usage and Recovery Outcomes
            </h2>
            <p className="text-gray-500 mb-6">
              By Cynthia Lefferts
            </p>
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 mb-8">
              <p className="text-gray-700 leading-relaxed">
                This research investigates the hypothesis that smartphone use is negatively correlated 
                with recovery rates after Treatment as Usual (TAU) for Mexican individuals with 
                Substance Use Disorder (SUD) under 45 years old. The study examines the relationships 
                between daily phone usage, mental health indicators, and recovery outcomes.
              </p>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

          <div className="space-y-6">
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
                          size: 14,
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
                          size: 14,
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
    </div>
  );
}
