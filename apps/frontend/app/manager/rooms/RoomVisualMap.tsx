'use client';

import { useRouter } from 'next/navigation';
import { HiPlus } from 'react-icons/hi';
import { IRoom } from '@hostelite/shared-types';

interface RoomVisualMapProps {
    rooms: IRoom[];
}

export default function RoomVisualMap({ rooms }: RoomVisualMapProps) {
    const router = useRouter();

    const floors = rooms.reduce((acc, room) => {
        const floorKey = room.floor; 
        if (!acc[floorKey]) acc[floorKey] = [];
        acc[floorKey].push(room);
        return acc;
    }, {} as Record<number, IRoom[]>);

    const sortedFloors = Object.keys(floors).map(Number).sort((a, b) => a - b);

    return (
        <div className="space-y-8">
            {sortedFloors.map((floor) => (
                <div key={floor} className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-brand-primary/5 p-6">
                    <h3 className="text-lg font-bold text-brand-text dark:text-dark-text mb-4 flex items-center gap-2">
                        <span className="w-2 h-6 bg-brand-primary rounded-full"></span>
                        Floor {floor}
                    </h3>
                    
                    <div className="flex flex-wrap gap-4">
                        {floors[floor].sort((a, b) => a.roomNumber.localeCompare(b.roomNumber)).map((room) => {
                             const isFull = room.occupiedBeds >= room.totalBeds;
                             const occupancyRate = (room.occupiedBeds / room.totalBeds) * 100;
                             
                             return (
                                <div 
                                    key={room._id}
                                    className={`relative group w-40 p-3 rounded-lg border-2 transition-all cursor-pointer
                                        ${isFull 
                                            ? 'border-red-100 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30' 
                                            : room.occupiedBeds === 0 
                                                ? 'border-green-100 bg-green-50 dark:bg-green-900/10 dark:border-green-900/30'
                                                : 'border-blue-100 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-900/30'
                                        }
                                        hover:shadow-md hover:scale-105
                                    `}
                                    onClick={() => router.push(`/manager/rooms/${room._id}`)}
                                >
                                    <div className="text-center mb-2">
                                        <span className="font-bold text-brand-text dark:text-dark-text">{room.roomNumber}</span>
                                        <p className="text-xs text-brand-text/60">{room.roomType}</p>
                                    </div>

                                    <div className="flex justify-center gap-1 flex-wrap mb-2">
                                        {Array.from({ length: room.totalBeds }).map((_, i) => (
                                            <div 
                                                key={i}
                                                className={`w-3 h-3 rounded-full ${i < room.occupiedBeds 
                                                    ? (isFull ? 'bg-red-400' : 'bg-blue-400') 
                                                    : 'bg-gray-300 dark:bg-gray-600'}`
                                                }
                                                title={i < room.occupiedBeds ? "Occupied" : "Empty"}
                                            />
                                        ))}
                                    </div>

                                    {!isFull && (
                                        <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                             <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/manager/students/create?roomId=${room._id}`);
                                                }}
                                                className="bg-brand-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                                                title="Quick Add Student"
                                            >
                                                <HiPlus />
                                            </button>
                                        </div>
                                    )}
                                </div>
                             );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
