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
import { Line, Bar, Doughnut } from 'react-chartjs-2';

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

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-dark-card/50 rounded-2xl p-6 shadow-sm border border-brand-card/30 dark:border-dark-card/30 ${className}`}>
      <h3 className="text-lg font-bold text-brand-text dark:text-dark-text mb-4">{title}</h3>
      {children}
    </div>
  );
};

// Revenue Chart - Dynamic only, no fallback
interface RevenueChartProps {
  monthlyData?: Array<{ month: string; revenue: number }>;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ monthlyData }) => {
  // Show empty state if no data
  if (!monthlyData || monthlyData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-brand-text/50 dark:text-dark-text/50">
        <div className="text-center">
          <p className="text-lg">No revenue data yet</p>
          <p className="text-sm mt-1">Revenue will appear as payments are recorded</p>
        </div>
      </div>
    );
  }

  const data = {
    labels: monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Revenue',
        data: monthlyData.map(d => d.revenue),
        fill: true,
        backgroundColor: 'rgba(44, 27, 19, 0.1)',
        borderColor: '#2c1b13',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: '#2c1b13',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#2c1b13',
        titleColor: '#fcf2e9',
        bodyColor: '#fcf2e9',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => `PKR ${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#2c1b13',
          font: { weight: 500 as const },
        },
      },
      y: {
        grid: {
          color: 'rgba(44, 27, 19, 0.1)',
        },
        ticks: {
          color: '#2c1b13',
          font: { weight: 500 as const },
          callback: (value: any) => `${value / 1000}k`,
        },
      },
    },
  };

  return (
    <div className="h-[300px]">
      <Line data={data} options={options as any} />
    </div>
  );
};

// Hostels by City Chart - Dynamic only, no fallback
interface OccupancyChartProps {
  cityData?: Array<{ city: string; count: number }>;
}

export const OccupancyChart: React.FC<OccupancyChartProps> = ({ cityData }) => {
  // Show empty state if no data
  if (!cityData || cityData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-brand-text/50 dark:text-dark-text/50">
        <div className="text-center">
          <p className="text-lg">No hostels by city data</p>
          <p className="text-sm mt-1">Data will appear as hostels are onboarded</p>
        </div>
      </div>
    );
  }

  const data = {
    labels: cityData.map(d => d.city),
    datasets: [
      {
        label: 'Hostels',
        data: cityData.map(d => d.count),
        backgroundColor: '#2c1b13',
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#2c1b13',
        titleColor: '#fcf2e9',
        bodyColor: '#fcf2e9',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => `${context.parsed.x} hostels`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(44, 27, 19, 0.1)',
        },
        ticks: {
          color: '#2c1b13',
          font: { weight: 500 as const },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#2c1b13',
          font: { weight: 500 as const },
        },
      },
    },
  };

  return (
    <div className="h-[300px]">
      <Bar data={data} options={options as any} />
    </div>
  );
};

// Hostel Status Distribution Chart (Active vs Churned)
interface RoomDistributionChartProps {
  active?: number;
  churned?: number;
}

export const RoomDistributionChart: React.FC<RoomDistributionChartProps> = ({ active = 0, churned = 0 }) => {
  // Show empty state if no data
  if (active === 0 && churned === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-brand-text/50 dark:text-dark-text/50">
        <div className="text-center">
          <p className="text-lg">No hostel data</p>
          <p className="text-sm mt-1">Onboard hostels to see status</p>
        </div>
      </div>
    );
  }

  const data = {
    labels: ['Active Hostels', 'Churned Hostels'],
    datasets: [
      {
        data: [active, churned],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#2c1b13',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: '#2c1b13',
        titleColor: '#fcf2e9',
        bodyColor: '#fcf2e9',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            const total = active + churned;
            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '65%',
  };

  return (
    <div className="h-[250px]">
      <Doughnut data={data} options={options as any} />
    </div>
  );
};

// Payment Status Chart
interface PaymentStatusChartProps {
  pendingPayments?: number;
  totalStudents?: number;
}

export const PaymentStatusChart: React.FC<PaymentStatusChartProps> = ({ 
  pendingPayments = 0, 
  totalStudents = 0 
}) => {
  const paidStudents = Math.max(0, totalStudents - pendingPayments);
  
  // Show empty state if no data
  if (totalStudents === 0 && pendingPayments === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-brand-text/50 dark:text-dark-text/50">
        <div className="text-center">
          <p className="text-lg">No payment data</p>
          <p className="text-sm mt-1">Students and payments will appear here</p>
        </div>
      </div>
    );
  }

  const data = {
    labels: ['Paid', 'Pending'],
    datasets: [
      {
        data: [paidStudents, pendingPayments],
        backgroundColor: ['#22c55e', '#f59e0b'],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#2c1b13',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: '#2c1b13',
        titleColor: '#fcf2e9',
        bodyColor: '#fcf2e9',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            const total = paidStudents + pendingPayments;
            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${context.parsed} students (${percentage}%)`;
          },
        },
      },
    },
    cutout: '65%',
  };

  return (
    <div className="h-[250px]">
      <Doughnut data={data} options={options as any} />
    </div>
  );
};
