'use client';

import { useAppSelector } from '@/lib/hooks';
import { useGetRoomsQuery } from '@/lib/services/roomApi';
import { HiOutlineOfficeBuilding, HiOutlineUserGroup, HiOutlineCheckCircle, HiPlus, HiViewGrid, HiViewList } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { HiOutlineSearch } from 'react-icons/hi';
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text dark:text-dark-text">Manage Rooms</h1>
          <p className="text-sm text-brand-text/60 dark:text-dark-text/60">View and manage existing rooms</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
             <div className="relative w-full md:w-64">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text"
                    placeholder="Search Room Number..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-dark-card border border-brand-primary/10 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                />
            </div>
            <button 
                onClick={() => router.push('/manager/create-room')}
                className="px-4 py-2.5 bg-brand-primary text-white rounded-xl font-medium shadow-lg shadow-brand-primary/20 whitespace-nowrap"
            >
                + Create Room
            </button>
        </div>
      </div>
      
       {/* Stats Overview */}
       {roomsData?.data && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
               <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-brand-primary/10 flex items-center justify-between">
                   <div>
                       <p className="text-sm text-gray-500">Total Capacity</p>
                       <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                           {roomsData.data.reduce((acc, r) => acc + r.totalBeds, 0)}
                       </h3>
                   </div>
                   <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                       <HiOutlineOfficeBuilding size={24} />
                   </div>
               </div>
               <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-brand-primary/10 flex items-center justify-between">
                   <div>
                       <p className="text-sm text-gray-500">Occupied Beds</p>
                       <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                           {roomsData.data.reduce((acc, r) => acc + r.occupiedBeds, 0)}
                       </h3>
                   </div>
                   <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                       <HiOutlineUserGroup size={24} />
                   </div>
               </div>
               <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-brand-primary/10 flex items-center justify-between">
                   <div>
                       <p className="text-sm text-gray-500">Free Beds</p>
                       <h3 className="text-2xl font-bold text-green-600">
                           {roomsData.data.reduce((acc, r) => acc + (r.totalBeds - r.occupiedBeds), 0)}
                       </h3>
                   </div>
                   <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                       <HiOutlineCheckCircle size={24} />
                   </div>
               </div>
           </div>
       )}

      {/* Filters & View Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {['ALL', 'FULL', 'PARTIAL', 'EMPTY'].map((status) => (
                <button
                    key={status}
                    onClick={() => setStatusFilter(status === 'ALL' ? undefined : status as any)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                        ( status === 'ALL' && !statusFilter ) || statusFilter === status
                        ? 'bg-brand-primary text-white shadow-brand-primary/20 shadow-lg'
                        : 'bg-white dark:bg-dark-card text-brand-text/70 hover:bg-brand-primary/5'
                    }`}
                >
                    {status === 'ALL' ? 'All Rooms' : 
                    status === 'FULL' ? 'Fully Occupied' :
                    status === 'PARTIAL' ? 'Remaining Seats' : 'Empty'}
                </button>
            ))}
        </div>

        {/* View Toggle */}
        <div className="flex bg-white dark:bg-dark-card p-1 rounded-lg border border-brand-primary/10">
            <button
                onClick={() => setViewMode('GRID')}
                className={`p-2 rounded-md transition-all ${viewMode === 'GRID' ? 'bg-brand-primary text-white shadow-sm' : 'text-gray-400 hover:text-brand-primary'}`}
                title="Grid View"
            >
                <HiViewList size={20} />
            </button>
            <button
                onClick={() => setViewMode('MAP')}
                className={`p-2 rounded-md transition-all ${viewMode === 'MAP' ? 'bg-brand-primary text-white shadow-sm' : 'text-gray-400 hover:text-brand-primary'}`}
                title="Visual Map View"
            >
                <HiViewGrid size={20} />
            </button>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-brand-primary/5 p-6">
        {isLoading ? (
            <div className="text-center py-8">Loading rooms...</div>
        ) : roomsData?.data && roomsData.data.length > 0 ? (
            <>
                {viewMode === 'MAP' ? (
                    <RoomVisualMap rooms={roomsData.data} />
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {roomsData.data.map((room) => {
                            const occupancyRate = (room.occupiedBeds / room.totalBeds) * 100;
                            const isFull = room.occupiedBeds >= room.totalBeds;
                            
                            return (
                            <div 
                                key={room._id} 
                                className="p-4 rounded-xl bg-brand-bg dark:bg-dark-bg border border-brand-primary/10 relative group hover:border-brand-primary transition-all hover:shadow-md flex flex-col justify-between h-full"
                            >
                                <div 
                                    onClick={() => router.push(`/manager/rooms/${room._id}`)}
                                    className="cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-mono font-bold text-xl text-brand-primary">{room.roomNumber}</span>
                                        <span className="text-xs px-2 py-1 rounded bg-brand-primary/10 text-brand-primary font-bold">
                                            {room.roomType}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-sm text-brand-text/70 dark:text-dark-text/70 mb-4">
                                        <p>Floor: {room.floor}</p>
                                        {/* Occupancy Bar */}
                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span>Capacity</span>
                                                <span className={isFull ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}>
                                                    {room.occupiedBeds} / {room.totalBeds}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-green-500'}`}
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
