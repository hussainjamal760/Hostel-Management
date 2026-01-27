'use client';

import { useState } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { useGetStudentsQuery } from '@/lib/services/studentApi';
import { HiOutlineSearch, HiOutlineFilter, HiOutlineUser, HiOutlineDotsVertical } from 'react-icons/hi';
import { useRouter } from 'next/navigation';

import ChangeRoomModal from './ChangeRoomModal';
import StudentDetailsModal from '../rooms/[id]/StudentDetailsModal';
import { HiOutlineRefresh } from 'react-icons/hi';

export default function StudentsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [feeStatus, setFeeStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const [changeRoomModalOpen, setChangeRoomModalOpen] = useState(false);
  const [selectedStudentForMove, setSelectedStudentForMove] = useState<{
      id: string;
      name: string;
      currentRoom: any;
      currentBed: string;
  } | null>(null);
  
  const { data: studentsData, isLoading, refetch } = useGetStudentsQuery({
     hostelId: user?.hostelId,
     search: search || undefined,
     feeStatus,
     page,
     limit: 20
  }, { skip: !user?.hostelId });

  const students = studentsData?.data || [];
  
  // Calculate stats (optional, could be separate API or derived)
  const totalStudents = studentsData?.pagination?.total || 0;
  
  const handleViewDetails = (studentId: string) => {
      setSelectedStudentId(studentId);
      setDetailsModalOpen(true);
  };

  const handleChangeRoomClick = (student: any) => {
      setSelectedStudentForMove({
          id: student._id,
          name: student.fullName,
          currentRoom: student.roomId,
          currentBed: student.bedNumber
      });
      setChangeRoomModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text dark:text-dark-text">Students</h1>
          <p className="text-sm text-brand-text/60 dark:text-dark-text/60">Manage all registered students</p>
        </div>
        
        {/* Actions / Search */}
        <div className="flex gap-2">
            <div className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search students..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-brand-primary w-full sm:w-64 transition-all"
                />
            </div>
            <button 
                onClick={() => refetch()}
                className="p-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 hover:text-brand-primary transition-colors"
                title="Refresh List"
            >
                <HiOutlineRefresh size={20} />
            </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
         {['ALL', 'PAID', 'DUE'].map((status) => (
             <button
                key={status}
                onClick={() => setFeeStatus(status === 'ALL' ? undefined : status)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    ( status === 'ALL' && !feeStatus ) || feeStatus === status
                    ? 'bg-brand-primary text-white shadow-brand-primary/20 shadow-lg'
                    : 'bg-white dark:bg-dark-card text-brand-text/70 hover:bg-brand-primary/5'
                }`}
             >
                {status === 'ALL' ? 'All Students' : 
                 status === 'PAID' ? 'Paid' : 'Fee Due'}
             </button>
         ))}
      </div>

      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-brand-primary/5 overflow-hidden">
        {isLoading ? (
            <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                <p className="mt-2 text-sm text-gray-500">Loading students...</p>
            </div>
        ) : students.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-gray-500 font-bold tracking-wider">
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Room/Bed</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {students.map((student) => (
                            <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                                            {student.fullName[0]}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-brand-text dark:text-dark-text">{student.fullName}</p>
                                            <p className="text-xs text-gray-500">{student.cnic}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-brand-text dark:text-dark-text">
                                            Room {(student.roomId as any)?.roomNumber || 'N/A'}
                                        </span>
                                        <span className="text-xs text-brand-primary bg-brand-primary/5 px-1.5 py-0.5 rounded w-fit mt-1">
                                            Bed {student.bedNumber}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        <p>{(student.userId as any)?.phone || 'N/A'}</p>
                                        <p className="text-xs opacity-75">{(student.userId as any)?.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-lg ${
                                        student.feeStatus === 'PAID' ? 'bg-green-100 text-green-700' :
                                        student.feeStatus === 'DUE' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {student.feeStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-500">
                                        {new Date(student.joinDate).toLocaleDateString()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => handleChangeRoomClick(student)}
                                            className="px-3 py-1.5 text-xs font-bold bg-brand-primary/5 text-brand-primary hover:bg-brand-primary hover:text-white rounded-lg transition-all"
                                        >
                                            Change Room
                                        </button>
                                        <button 
                                            onClick={() => handleViewDetails(student._id)}
                                            className="p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all"
                                            title="View Details"
                                        >
                                            <HiOutlineDotsVertical size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="p-12 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <HiOutlineUser size={32} />
                </div>
                <h3 className="text-lg font-bold text-brand-text dark:text-dark-text mb-1">No Students Found</h3>
                <p>Start by adding students from the Room Management page.</p>
                <button 
                    onClick={() => router.push('/manager/rooms')}
                    className="mt-6 px-6 py-2 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-colors"
                >
                    Go to Rooms
                </button>
            </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!isLoading && (studentsData?.pagination?.total || 0) > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 bg-white dark:bg-dark-card p-4 rounded-2xl shadow-sm border border-brand-primary/5">
              <div className="text-sm text-gray-500 text-center sm:text-left">
                  Showing <span className="font-bold text-brand-text dark:text-dark-text">{(page - 1) * 20 + 1}</span> to <span className="font-bold text-brand-text dark:text-dark-text">{Math.min(page * 20, studentsData?.pagination?.total || 0)}</span> of <span className="font-bold text-brand-text dark:text-dark-text">{studentsData?.pagination?.total}</span> students
              </div>
              
              <div className="flex items-center gap-2">
                  <button
                      onClick={() => setPage(page - 1)}
                      disabled={!studentsData?.pagination?.hasPrev}
                      className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                      Previous
                  </button>
                  <span className="hidden sm:inline-block px-4 py-2 text-sm font-medium bg-brand-primary/5 text-brand-primary rounded-lg whitespace-nowrap">
                      Page {page} of {studentsData?.pagination?.totalPages}
                  </span>
                  <button
                      onClick={() => setPage(page + 1)}
                      disabled={!studentsData?.pagination?.hasNext}
                      className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                      Next
                  </button>
              </div>
          </div>
      )}
      
      {detailsModalOpen && (
          <StudentDetailsModal 
            open={detailsModalOpen} 
            setOpen={setDetailsModalOpen} 
            studentId={selectedStudentId}
            onSuccess={() => refetch()}
          />
      )}

      {changeRoomModalOpen && selectedStudentForMove && (
          <ChangeRoomModal 
              open={changeRoomModalOpen}
              setOpen={setChangeRoomModalOpen}
              studentId={selectedStudentForMove.id}
              studentName={selectedStudentForMove.name}
              currentRoom={selectedStudentForMove.currentRoom}
              currentBed={selectedStudentForMove.currentBed}
              onSuccess={() => refetch()}
          />
      )}
    </div>
  );
}
