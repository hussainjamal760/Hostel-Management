'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface OwnerChartsProps {
  revenueData: Array<{ month: string; revenue: number }>;
  complaintsData: {
    open: number;
    inProgress: number;
    resolved: number;
  };
}

export default function OwnerCharts({ revenueData, complaintsData }: OwnerChartsProps) {
  
  // Revenue Chart Configuration
  const revenueChartData = {
    labels: revenueData.map(d => d.month),
    datasets: [
      {
        label: 'Revenue',
        data: revenueData.map(d => d.revenue),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)', // Blue-500 optimized opacity
        borderColor: '#3b82f6', 
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => `PKR ${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280' },
      },
      y: {
        grid: { color: 'rgba(107, 114, 128, 0.1)' },
        ticks: { 
            color: '#6b7280',
            callback: (value: any) => `${value / 1000}k`
        },
      },
    },
  };

  // Complaints Chart Configuration
  const complaintsChartData = {
    labels: ['Open', 'In Progress', 'Resolved'],
    datasets: [
      {
        data: [complaintsData.open, complaintsData.inProgress, complaintsData.resolved],
        backgroundColor: ['#ef4444', '#f59e0b', '#22c55e'], // Red, Amber, Green
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const complaintsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
            usePointStyle: true,
            padding: 20
        }
      },
    },
    cutout: '70%',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue Trend Chart */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Revenue Trends</h3>
        <div className="h-[300px]">
          {revenueData.length > 0 ? (
             <Line data={revenueChartData} options={revenueOptions as any} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
                No revenue data recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* Complaints Breakdown Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Complaints Status</h3>
        <div className="h-[300px] flex items-center justify-center">
            {(complaintsData.open + complaintsData.inProgress + complaintsData.resolved) > 0 ? (
                <Doughnut data={complaintsChartData} options={complaintsOptions as any} />
            ) : (
                <div className="text-gray-400">No complaints found.</div>
            )}
        </div>
      </div>
    </div>
  );
}
