'use client';

import { useGetStudentMeQuery } from '@/lib/services/studentApi';

export default function StudentRoomPage() {
  const { data: studentResponse } = useGetStudentMeQuery();
  const student = studentResponse?.data;

  if (!student) return null;

  const room = student.roomId as any;

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Room</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4">Room Information</h3>
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Room Number</span>
                        <span className="font-bold">{room?.roomNumber}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Floor</span>
                        <span className="font-bold">{room?.floor}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Type</span>
                        <span className="font-bold">{room?.roomType}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Your Bed</span>
                        <span className="font-bold text-brand-primary">Bed {student.bedNumber}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                    {room?.amenities?.length > 0 ? (
                        room.amenities.map((amenity: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                                {amenity}
                            </span>
                        ))
                    ) : (
                        <p className="text-gray-500">No specific amenities listed.</p>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}
