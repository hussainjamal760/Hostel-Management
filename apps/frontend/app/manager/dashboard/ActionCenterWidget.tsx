'use client';

import Link from 'next/link';
import { HiOutlineExclamationCircle, HiOutlineCurrencyDollar, HiOutlineOfficeBuilding, HiChevronRight } from 'react-icons/hi';

interface ActionCenterWidgetProps {
  pendingPayments: number;
  openComplaints: number;
  availableBeds: number;
}

export default function ActionCenterWidget({ pendingPayments, openComplaints, availableBeds }: ActionCenterWidgetProps) {
  const hasActions = pendingPayments > 0 || openComplaints > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Action Center
            {!hasActions && <span className="text-xs font-normal text-green-600 bg-green-100 px-2 py-0.5 rounded-full">All Caught Up!</span>}
            {hasActions && <span className="text-xs font-normal text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Actions Required</span>}
        </h3>
        <p className="text-sm text-gray-500">Tasks requiring your attention</p>
      </div>

      <div className="p-4 space-y-3 flex-1">
        {/* Pending Payments */}
        <Link 
            href="/manager/payments?tab=REQUESTS"
            className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 group hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
        >
            <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg text-blue-600 dark:text-blue-200">
                    <HiOutlineCurrencyDollar className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">Payment Verifications</p>
                    <p className="text-xs text-blue-600 dark:text-blue-300 group-hover:underline">Review pending proofs</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${pendingPayments > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                    {pendingPayments}
                </span>
                <HiChevronRight className="text-gray-400" />
            </div>
        </Link>

        {/* Open Complaints */}
        <Link 
            href="/manager/complaints?status=OPEN"
            className="flex items-center justify-between p-4 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 group hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors"
        >
            <div className="flex items-center gap-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg text-orange-600 dark:text-orange-200">
                    <HiOutlineExclamationCircle className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm text-orange-900 dark:text-orange-100 font-medium">Open Complaints</p>
                    <p className="text-xs text-orange-600 dark:text-orange-300 group-hover:underline">Awaiting resolution</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                 <span className={`text-lg font-bold ${openComplaints > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                    {openComplaints}
                </span>
                <HiChevronRight className="text-gray-400" />
            </div>
        </Link>

        {/* Available Beds (Info Only) */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
                    <HiOutlineOfficeBuilding className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">Available Beds</p>
                    <p className="text-xs text-gray-500">Current availability</p>
                </div>
            </div>
            <span className="text-lg font-bold text-gray-700 dark:text-white">
                {availableBeds}
            </span>
        </div>
      </div>
    </div>
  );
}
