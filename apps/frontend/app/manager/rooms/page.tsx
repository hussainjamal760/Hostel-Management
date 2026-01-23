'use client';

import { useAppSelector } from '@/lib/hooks';
import { useGetRoomsQuery } from '@/lib/services/roomApi';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import { useRouter } from 'next/navigation';

export default function ManageRoomsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  
  const { data: roomsData, isLoading } = useGetRoomsQuery({
     hostelId: user?.hostelId,
     limit: 100
  }, { skip: !user?.hostelId });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-text dark:text-dark-text">Manage Rooms</h1>
          <p className="text-sm text-brand-text/60 dark:text-dark-text/60">View and manage existing rooms</p>
        </div>
        <button 
            onClick={() => router.push('/manager/create-room')}
            className="px-4 py-2 bg-brand-primary text-white rounded-xl font-medium shadow-lg shadow-brand-primary/20"
        >
            Create New Room
        </button>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-brand-primary/5 p-6">
        {isLoading ? (
            <div className="text-center py-8">Loading rooms...</div>
        ) : roomsData?.data && roomsData.data.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {roomsData.data.map((room) => (
                    <div 
                        key={room._id} 
                        onClick={() => router.push(`/manager/rooms/${room._id}`)}
                        className="p-4 rounded-xl bg-brand-bg dark:bg-dark-bg border border-brand-primary/10 relative group cursor-pointer hover:border-brand-primary transition-all hover:shadow-md"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-mono font-bold text-xl text-brand-primary">{room.roomNumber}</span>
                            <span className="text-xs px-2 py-1 rounded bg-brand-primary/10 text-brand-primary font-bold">
                                {room.roomType}
                            </span>
                        </div>
                        <div className="space-y-1 text-sm text-brand-text/70 dark:text-dark-text/70">
                            <p>Floor: {room.floor}</p>
                            <p>Beds: {room.totalBeds}</p>
                            <p className={room.occupiedBeds > 0 ? 'text-orange-500' : 'text-green-500'}>
                                {room.occupiedBeds} Occupied
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary">
                    <HiOutlineOfficeBuilding size={32} />
                </div>
                <h3 className="text-lg font-bold text-brand-text dark:text-dark-text">No Rooms Found</h3>
                <p className="text-brand-text/60 dark:text-dark-text/60 mb-6">Start by creating some rooms for your hostel.</p>
                <button
                    onClick={() => router.push('/manager/create-room')}
                    className="px-6 py-2 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-colors"
                >
                    Create Rooms
                </button>
            </div>
        )}
      </div>
    </div>
  );
}
