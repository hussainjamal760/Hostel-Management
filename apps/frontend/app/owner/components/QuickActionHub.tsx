'use client';

import { useRouter } from 'next/navigation';
import { 
    HiOutlineUserAdd, 
    HiOutlineDocumentReport, 
    HiOutlineSpeakerphone, 
    HiOutlineOfficeBuilding 
} from 'react-icons/hi';

export default function QuickActionHub() {
    const router = useRouter();

    const actions = [
        { 
            label: 'Add Manager', 
            icon: HiOutlineUserAdd, 
            color: 'text-purple-600', 
            bg: 'bg-purple-50 hover:bg-purple-100',
            onClick: () => router.push('/owner/managers?action=create') 
        },
        { 
            label: 'Reports', 
            icon: HiOutlineDocumentReport, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50 hover:bg-blue-100',
            onClick: () => router.push('/owner/reports') 
        },
        { 
            label: 'Announcements', 
            icon: HiOutlineSpeakerphone, 
            color: 'text-orange-600', 
            bg: 'bg-orange-50 hover:bg-orange-100',
            onClick: () => router.push('/owner/settings') // Assuming announcements in settings for now
        },
         { 
            label: 'Add Hostel', 
            icon: HiOutlineOfficeBuilding, 
            color: 'text-green-600', 
            bg: 'bg-green-50 hover:bg-green-100',
            onClick: () => router.push('/owner/hostel') // Redirect to hostel management
        },
    ];

    return (
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-brand-primary/5 p-6">
            <h3 className="text-lg font-bold text-brand-text dark:text-dark-text mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
                {actions.map((action) => (
                    <button
                        key={action.label}
                        onClick={action.onClick}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${action.bg}`}
                    >
                        <action.icon size={24} className={`mb-2 ${action.color}`} />
                        <span className="text-xs font-semibold text-brand-text dark:text-dark-text/80">
                            {action.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
