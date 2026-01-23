'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardChartsProps {
  stats: {
    totalStudents: number;
    paidStudents: number;
    dueStudents: number;
    totalCollected: number;
    totalRemaining: number;
  };
  totalBeds: number;
}

export default function DashboardCharts({ stats, totalBeds }: DashboardChartsProps) {
  const availableBeds = Math.max(0, totalBeds - stats.totalStudents);

  const occupancyData = {
    labels: ['Occupied', 'Available'],
    datasets: [
      {
        data: [stats.totalStudents, availableBeds],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // Brand Primary (Blue-ish)
          'rgba(229, 231, 235, 0.5)', // Gray (Empty)
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(229, 231, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const feeData = {
    labels: ['Paid', 'Due'],
    datasets: [
      {
        data: [stats.paidStudents, stats.dueStudents],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)', // Green
          'rgba(249, 115, 22, 0.8)', // Orange
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(249, 115, 22, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const revenueData = {
    labels: ['Collected', 'Remaining'],
    datasets: [
        {
            label: 'Revenue (Rs)',
            data: [stats.totalCollected, stats.totalRemaining],
            backgroundColor: [
                'rgba(34, 197, 94, 0.8)',
                'rgba(239, 68, 68, 0.8)',
            ],
            borderRadius: 8,
        }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    cutout: '70%', // For Doughnut feel
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Occupancy Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 w-full text-left">Occupancy Rate</h3>
        <div className="w-48 h-48 relative">
            <Doughnut data={occupancyData} options={options} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{Math.round((stats.totalStudents / (totalBeds || 1)) * 100)}%</p>
                    <p className="text-xs text-gray-500">Occupied</p>
                </div>
            </div>
        </div>
      </div>

      {/* Fee Status Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 w-full text-left">Fee Status</h3>
        <div className="w-48 h-48">
            <Pie data={feeData} options={{ ...options, cutout: '0%' }} />
        </div>
      </div>

      {/* Revenue Chart (Bar) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Revenue Overview</h3>
        <div className="flex-1 flex items-end justify-center w-full">
             <Bar 
                data={revenueData} 
                options={{
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { display: false }
                        },
                        x: {
                            grid: { display: false }
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }} 
            />
        </div>
      </div>
    </div>
  );
}
