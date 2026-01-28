'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardStatsProps {
  stats: {
    totalRooms: number;
    totalBeds: number;
    totalStudents: number;
    occupancyRate: number;
    pendingComplaints: number;
    revenue: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (PKR)',
        data: [stats.revenue * 0.8, stats.revenue * 0.9, stats.revenue, stats.revenue * 1.05, stats.revenue * 1.1, stats.revenue], // Mock trends based on current
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const occupancyData = {
    labels: ['Occupied', 'Vacant'],
    datasets: [
      {
        data: [stats.totalStudents, stats.totalBeds - stats.totalStudents],
        backgroundColor: ['rgba(34, 197, 94, 0.6)', 'rgba(239, 68, 68, 0.6)'],
        borderColor: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)'],
        borderWidth: 1,
      },
    ],
  };

  const complaintsData = {
    labels: ['Pending', 'Resolved', 'In Progress'],
    datasets: [
      {
        label: 'Complaints',
        data: [stats.pendingComplaints, 15, 5], 
        backgroundColor: ['rgba(234, 179, 8, 0.6)', 'rgba(34, 197, 94, 0.6)', 'rgba(59, 130, 246, 0.6)'],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">PKR {stats.revenue.toLocaleString()}</p>
          <span className="text-green-500 text-sm">↑ 12% from last month</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
           <h3 className="text-gray-500 text-sm font-medium">Occupancy Rate</h3>
          <p className="text-3xl font-bold mt-2">{stats.occupancyRate}%</p>
          <span className="text-gray-500 text-sm">{stats.totalStudents} / {stats.totalBeds} Beds</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
           <h3 className="text-gray-500 text-sm font-medium">Pending Complaints</h3>
          <p className="text-3xl font-bold mt-2">{stats.pendingComplaints}</p>
          <span className="text-yellow-500 text-sm">Requires attention</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold mb-4">Revenue Trends</h3>
          <Line data={revenueData} />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold mb-4">Occupancy Status</h3>
          <div className="h-64 flex justify-center">
             <Doughnut data={occupancyData} />
          </div>
        </div>
      </div>
    </div>
  );
}
