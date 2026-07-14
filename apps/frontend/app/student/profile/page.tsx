'use client';

import { useGetStudentMeQuery } from '@/lib/services/studentApi';
import { useGetMeQuery } from '@/lib/services/userApi';

export default function StudentProfilePage() {
  const { data: studentResponse, isLoading: isLoadingStudent } = useGetStudentMeQuery();
  const { data: userResponse, isLoading: isLoadingUser } = useGetMeQuery();
  
  const student = studentResponse?.data;
  const user = userResponse?.data;

  const isLoading = isLoadingStudent || isLoadingUser;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] bg-surface rounded-3xl border border-outline-variant shadow-sm">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-primary mb-4"></div>
        <p className="text-body-lg text-on-surface-variant font-medium">Loading your profile...</p>
      </div>
    );
  }

  const DetailItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div className="border-b border-outline-variant/50 pb-4 last:border-0 last:pb-0">
      <p className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">{label}</p>
      <p className="text-body-lg font-bold text-on-surface break-words">
        {value || <span className="text-on-surface-variant/50 text-body-md font-medium italic">Not provided</span>}
      </p>
    </div>
  );

  const Section = ({ title, icon, children }: { title: string, icon: string, children: React.ReactNode }) => (
    <div className="bg-surface rounded-3xl shadow-sm border border-outline-variant overflow-hidden hover:shadow-md transition-shadow">
      <div className="px-6 md:px-8 py-5 border-b border-outline-variant bg-surface-container-lowest flex items-center gap-4">
        {/* Changed background and text color here for better contrast */}
        <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
          <span className="material-symbols-outlined text-[24px]">{icon}</span>
        </div>
        <h3 className="text-display-sm font-bold text-primary">{title}</h3>
      </div>
      <div className="p-6 md:p-8 space-y-5">
        {children}
      </div>
    </div>
  );

  if (!student && user) {
      return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-display-lg-mobile md:text-display-lg text-primary flex items-center gap-3">
                        <span className="material-symbols-outlined text-[36px] text-secondary">account_circle</span>
                        My Profile
                    </h1>
                </div>
                <span className="px-4 py-2 rounded-xl text-label-md font-bold uppercase tracking-wider bg-secondary-container text-secondary border border-secondary/20 inline-flex items-center gap-2 w-fit">
                    <span className="material-symbols-outlined text-[18px]">hourglass_empty</span>
                    Applicant / Guest
                </span>
            </div>

            <div className="bg-surface-container-low border border-outline-variant rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-full transition-transform duration-700 group-hover:scale-125"></div>
                
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm relative z-10">
                    <span className="material-symbols-outlined text-[32px]">info</span>
                </div>
                <div className="relative z-10">
                    <h3 className="text-display-sm font-bold text-primary mb-2">Admission Pending</h3>
                    <p className="text-body-lg text-on-surface-variant font-medium max-w-2xl">
                        You have not been assigned a room yet. Once your admission is finalized by the manager, your full resident profile will appear here.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Section title="Personal Information" icon="person">
                    <DetailItem label="Full Name" value={user.name} />
                    <DetailItem label="Email" value={user.email} />
                    <DetailItem label="Phone" value={user.phone} />
                    <DetailItem label="Account Type" value={user.role} />
                </Section>
            </div>
        </div>
      );
  }

  if (!student) return null;

  return (
    <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-display-lg-mobile md:text-display-lg text-primary flex items-center gap-3">
                    <span className="material-symbols-outlined text-[36px] text-secondary">account_circle</span>
                    My Profile
                </h1>
                <p className="text-body-lg text-on-surface-variant mt-1">View your personal and accommodation details</p>
            </div>
            <span className={`px-4 py-2 rounded-xl text-label-md font-bold uppercase tracking-wider border inline-flex items-center gap-2 w-fit ${
                student.isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-error-container text-error border-error/20'
            }`}>
                <span className="material-symbols-outlined text-[18px]">
                    {student.isActive ? 'verified' : 'block'}
                </span>
                {student.isActive ? 'Active Resident' : 'Inactive'}
            </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Section title="Personal Information" icon="person">
                <DetailItem label="Full Name" value={student.fullName} />
                <DetailItem label="Date of Birth" value={new Date(student.dateOfBirth).toLocaleDateString()} />
                <DetailItem label="Gender" value={student.gender} />
                {/* Blood group removed as requested */}
                <DetailItem label="CNIC" value={student.cnic} />
            </Section>

            <Section title="Contact Details" icon="contact_phone">
                <DetailItem label="Email" value={(student.userId as any)?.email || user?.email} />
                <DetailItem label="Phone" value={(student.userId as any)?.phone || user?.phone} />
                <DetailItem label="Permanent Address" value={student.permanentAddress} />
            </Section>

            <Section title="Accommodation" icon="meeting_room">
                <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="Room Number" value={(student.roomId as any)?.roomNumber || 'N/A'} />
                    <DetailItem label="Bed Number" value={student.bedNumber} />
                </div>
                <DetailItem label="Room Type" value={(student.roomId as any)?.roomType || 'N/A'} />
                <DetailItem label="Join Date" value={new Date(student.joinDate).toLocaleDateString()} />
                <DetailItem label="Agreement Date" value={new Date(student.agreementDate).toLocaleDateString()} />
            </Section>

            <Section title="Guardian Info" icon="family_restroom">
                <DetailItem label="Father's Name" value={student.fatherName} />
                <DetailItem label="Father's Phone" value={student.fatherPhone} />
                <DetailItem label="Father's CNIC" value={student.fatherCnic} />
            </Section>

            <Section title="Emergency Contact" icon="emergency">
                <DetailItem label="Name" value={student.emergencyContact?.name} />
                <DetailItem label="Relation" value={student.emergencyContact?.relation} />
                <DetailItem label="Phone" value={student.emergencyContact?.phone} />
            </Section>

            <Section title="Financial Details" icon="payments">
                <DetailItem label="Monthly Fee" value={`Rs ${student.monthlyFee.toLocaleString()}`} />
                <DetailItem label="Security Deposit" value={`Rs ${student.securityDeposit.toLocaleString()}`} />
            </Section>
        </div>
    </div>
  );
}
