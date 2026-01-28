'use client';

import { useGetStudentMeQuery, useGetStudentsQuery } from '@/lib/services/studentApi';
import { useGetRoomQuery } from '@/lib/services/roomApi';
import { HiOutlineUserGroup, HiOutlineOfficeBuilding, HiOutlineUsers }  from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';

export default function StudentRoomPage() {
  const { data: studentResponse, isLoading: isLoadingMe } = useGetStudentMeQuery();
  const student = studentResponse?.data;
  
  const roomId = (student?.roomId as any)?._id || (typeof student?.roomId === 'string' ? student.roomId : null);
  
  const { data: roomResponse, isLoading: isLoadingRoom } = useGetRoomQuery(roomId, {
    skip: !roomId
  });
  
  const { data: roommatesResponse, isLoading: isLoadingRoommates } = useGetStudentsQuery({ 
    roomId: String(roomId),
    hostelId: String(student?.hostelId)
  }, {
    skip: !roomId || !student?.hostelId
  });

  const room = roomResponse?.data;
  const roommates = roommatesResponse?.data;

  const isLoading = isLoadingMe || isLoadingRoom || isLoadingRoommates;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!student) {
      return <div>Profile not found.</div>;
  }

  if (!roomId || !room) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <HiOutlineOfficeBuilding className="text-gray-300 dark:text-gray-600 mb-4" size={64} />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Room Assigned</h3>
        <p className="text-gray-500 text-center max-w-md">
          You have not been assigned to a room yet. Please contact your hostel manager to complete your room allocation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-brand-text dark:text-dark-text">My Room</h1>
            <span className="px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary font-bold">
                Room {room.roomNumber}
            </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Floor</span>
                <div className="flex items-center gap-3 mt-auto">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                        <HiOutlineOfficeBuilding size={24} />
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{room.floor === 0 ? 'Ground' : `${room.floor}th`}</span>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Room Type</span>
                <div className="flex items-center gap-3 mt-auto">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                        <HiOutlineUserGroup size={24} />
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{room.roomType.toLowerCase()}</span>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Capacity</span>
                <div className="flex items-center gap-3 mt-auto">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg">
                        <HiOutlineUsers size={24} />
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{room.occupiedBeds} / {room.totalBeds}</span>
                </div>
            </div>

          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <HiOutlineUsers className="text-brand-primary" /> Roommates
                </h3>
                
                <div className="space-y-4">
                    {roommates && roommates.length > 0 ? (
                        roommates.map((mate) => {
                            const isMe = mate._id === student._id;
                            const mateUser = mate.userId as any;
                            
                            return (
                                <div key={mate._id} className={`flex items-center p-4 rounded-xl border ${isMe ? 'bg-brand-primary/5 border-brand-primary/30' : 'bg-gray-50 dark:bg-gray-700/30 border-gray-100 dark:border-gray-700'}`}>
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-primary/70 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                        {mate.fullName.charAt(0)}
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white">
                                                    {mate.fullName} {isMe && <span className="ml-2 text-xs bg-brand-primary text-white px-2 py-0.5 rounded-full">YOU</span>}
                                                </h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Bed {mate.bedNumber}</p>
                                            </div>
                                            {!isMe && (
                                                <a 
                                                    href={getWhatsAppLink(mateUser?.phone)} 
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors flex items-center gap-2"
                                                    title="Chat on WhatsApp"
                                                >
                                                    <FaWhatsapp className="h-6 w-6" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-gray-500 text-center py-8">You are currently the only one in this room.</p>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}

const getWhatsAppLink = (phone: string) => {
  if (!phone) return '#';
  let clean = phone.replace(/\D/g, '');
  
  if (clean.startsWith('03')) {
    clean = '92' + clean.substring(1);
  }
  
  return `https://wa.me/${clean}`;
};

