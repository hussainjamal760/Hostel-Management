'use client';

import { useGetNotificationsQuery } from '../../../lib/services/notificationApi';
import { HiOutlineBell, HiOutlineOfficeBuilding, HiOutlineUserAdd, HiOutlineCurrencyDollar, HiOutlineExclamation } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';

export default function ActivityFeedWidget() {
    const { data: notifications, isLoading } = useGetNotificationsQuery({
        page: 1, 
        limit: 5
    });

    const getIcon = (type?: string) => {
        switch (type) {
            case 'PAYMENT': return <HiOutlineCurrencyDollar size={18} className="text-green-600" />;
            case 'COMPLAINT': return <HiOutlineExclamation size={18} className="text-red-600" />;
            case 'FEE_DUE': return <HiOutlineCurrencyDollar size={18} className="text-orange-600" />;
            case 'SYSTEM': return <HiOutlineOfficeBuilding size={18} className="text-blue-600" />;
            default: return <HiOutlineBell size={18} className="text-gray-600" />;
        }
    };

    const getBgColor = (type?: string) => {
         switch (type) {
            case 'PAYMENT': return 'bg-green-100';
            case 'COMPLAINT': return 'bg-red-100';
            case 'FEE_DUE': return 'bg-orange-100';
            case 'SYSTEM': return 'bg-blue-100';
            default: return 'bg-gray-100';
        }
    }

    if (isLoading) {
        return <div className="h-64 bg-white dark:bg-dark-card rounded-2xl animate-pulse"></div>;
    }

    return (
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-brand-primary/5 p-6">
            <h3 className="text-lg font-bold text-brand-text dark:text-dark-text mb-4">Recent Activity</h3>
            
            {notifications?.data?.notifications && notifications.data.notifications.length > 0 ? (
                <div className="space-y-4">
                    {notifications.data.notifications.map((notif: any) => (
                        <div key={notif._id} className="flex gap-3 items-start">
                            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getBgColor(notif.type)}`}>
                                {getIcon(notif.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-brand-text dark:text-dark-text truncate">
                                    {notif.title}
                                </p>
                                <p className="text-xs text-brand-text/60 dark:text-dark-text/60 line-clamp-2">
                                    {notif.body}
                                </p>
                                <span className="text-[10px] text-gray-400 mt-1 block">
                                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                    No recent activity
                </div>
            )}
        </div>
    );
}
