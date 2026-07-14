'use client';

import { useAppSelector } from '@/lib/hooks';
import { useGetRoomsQuery } from '@/lib/services/roomApi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import RoomVisualMap from './RoomVisualMap';

export default function ManageRoomsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'FULL' | 'PARTIAL' | 'EMPTY' | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'GRID' | 'MAP'>('GRID');
 
  
  const { data: roomsData, isLoading } = useGetRoomsQuery({
     hostelId: user?.hostelId,
     search: search || undefined,
     status: statusFilter,
     limit: 100
  }, { skip: !user?.hostelId });

  return (
    <>
      {/* Header */}
      <section className="mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-2 gap-4">
          <div>
            <h2 className="text-display-lg-mobile md:text-display-lg text-primary">Manage Rooms</h2>
            <p className="text-body-md text-on-surface-variant mt-2">View, search, and manage your hostel's rooms.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input 
                    type="text"
                    placeholder="Search Room Number..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-outline"
                />
            </div>
            <button 
                onClick={() => router.push('/manager/create-room')}
                className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold hover:bg-on-primary-fixed-variant transition-colors shadow-sm whitespace-nowrap"
            >
                <span className="material-symbols-outlined">add</span> Create Room
            </button>
          </div>
        </div>
      </section>
      
      {/* Stat Cards */}
      {roomsData?.data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-8">
            <div className="bg-surface p-6 rounded-2xl border border-outline-variant hover:border-secondary transition-colors group shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-label-md text-on-surface-variant uppercase tracking-wider">Total Capacity</span>
                    <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">domain</span>
                </div>
                <h3 className="text-stats-lg text-primary">
                    {roomsData.data.reduce((acc, r) => acc + r.totalBeds, 0)}
                </h3>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-outline-variant hover:border-secondary transition-colors group shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-label-md text-on-surface-variant uppercase tracking-wider">Occupied Beds</span>
                    <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">group</span>
                </div>
                <h3 className="text-stats-lg text-primary">
                    {roomsData.data.reduce((acc, r) => acc + r.occupiedBeds, 0)}
                </h3>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-outline-variant hover:border-secondary transition-colors group shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-label-md text-on-surface-variant uppercase tracking-wider">Free Beds</span>
                    <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">check_circle</span>
                </div>
                <h3 className="text-stats-lg text-primary">
                    {roomsData.data.reduce((acc, r) => acc + (r.totalBeds - r.occupiedBeds), 0)}
                </h3>
            </div>
        </div>
      )}

      {/* Filters & Toggles */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto custom-scrollbar">
            {['ALL', 'FULL', 'PARTIAL', 'EMPTY'].map((status) => (
                <button
                    key={status}
                    onClick={() => setStatusFilter(status === 'ALL' ? undefined : status as any)}
                    className={`px-5 py-2 rounded-xl text-label-md font-bold transition-all whitespace-nowrap ${
                        ( status === 'ALL' && !statusFilter ) || statusFilter === status
                        ? 'bg-secondary text-on-secondary shadow-sm'
                        : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:border-secondary hover:text-primary'
                    }`}
                >
                    {status === 'ALL' ? 'All Rooms' : 
                    status === 'FULL' ? 'Fully Occupied' :
                    status === 'PARTIAL' ? 'Partially Filled' : 'Empty'}
                </button>
            ))}
        </div>

        <div className="flex bg-surface-container p-1 rounded-xl border border-outline-variant shadow-sm">
            <button
                onClick={() => setViewMode('GRID')}
                className={`p-2 rounded-lg transition-all flex items-center justify-center ${viewMode === 'GRID' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'}`}
                title="Grid View"
            >
                <span className="material-symbols-outlined">grid_view</span>
            </button>
            <button
                onClick={() => setViewMode('MAP')}
                className={`p-2 rounded-lg transition-all flex items-center justify-center ${viewMode === 'MAP' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'}`}
                title="Visual Map View"
            >
                <span className="material-symbols-outlined">map</span>
            </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant p-6 min-h-[400px]">
        {isLoading ? (
             <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        ) : roomsData?.data && roomsData.data.length > 0 ? (
            <>
                {viewMode === 'MAP' ? (
                    <RoomVisualMap rooms={roomsData.data} />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {roomsData.data.map((room) => {
                            const occupancyRate = (room.occupiedBeds / room.totalBeds) * 100;
                            const isFull = room.occupiedBeds >= room.totalBeds;
                            
                            return (
                            <div 
                                key={room._id} 
                                className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant relative group hover:border-secondary transition-all hover:shadow-md flex flex-col justify-between h-full cursor-pointer"
                                onClick={() => router.push(`/manager/rooms/${room._id}`)}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-sm">
                                                {room.roomNumber}
                                            </div>
                                            <div>
                                                <p className="font-bold text-primary">Room {room.roomNumber}</p>
                                                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{room.roomType}</p>
                                            </div>
                                        </div>
                                        <button className="text-outline hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-body-sm text-on-surface-variant bg-background p-2 rounded-lg border border-outline-variant">
                                            <span className="material-symbols-outlined text-[18px]">layers</span>
                                            <span>Floor {room.floor}</span>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-label-md mb-2">
                                                <span className="text-on-surface-variant">Capacity</span>
                                                <span className={isFull ? 'text-error font-bold' : 'text-primary font-bold'}>
                                                    {room.occupiedBeds} / {room.totalBeds} Occupied
                                                </span>
                                            </div>
                                            <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-error' : 'bg-primary'}`}
                                                    style={{ width: `${occupancyRate}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )})}
                    </div>
                )}
            </>
        ) : (
            <div className="text-center py-16 flex flex-col items-center">
                <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6 border border-outline-variant">
                    <span className="material-symbols-outlined text-[40px] text-primary">domain_disabled</span>
                </div>
                <h3 className="text-body-lg font-bold text-primary mb-2">No Rooms Found</h3>
                <p className="text-body-sm text-on-surface-variant mb-8 max-w-md">You haven't configured any rooms yet, or no rooms match your current filters.</p>
                <button
                    onClick={() => router.push('/manager/create-room')}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-on-primary-fixed-variant transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined">add</span>
                    Create Rooms
                </button>
            </div>
        )}
      </div>
    </>
  );
}
