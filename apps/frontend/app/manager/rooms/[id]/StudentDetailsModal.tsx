'use client';

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useGetStudentQuery, useUpdateStudentMutation, useDeleteStudentMutation, useResendActivationMutation } from '@/lib/services/studentApi';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal';
import { useAppSelector } from '@/lib/hooks';

const formSchema = z.object({
    fullName: z.string().min(2, 'Name is required'),
    fatherName: z.string().min(2, "Father's name is required"),
    cnic: z.string().min(1, 'CNIC is required'),
    fatherCnic: z.string().min(1, "Father's CNIC is required"),
    phone: z.string().min(10, 'Phone is required'),
    fatherPhone: z.string().min(10, "Father's phone is required"),
    email: z.string().email().optional(),
    dateOfBirth: z.string().min(1),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    bloodGroup: z.string().optional(),
    permanentAddress: z.string().min(10),
    emergencyContact: z.object({
        name: z.string().min(1),
        relation: z.string().min(1),
        phone: z.string().min(10),
    }),
    monthlyFee: z.number().min(0),
    securityDeposit: z.number().min(0),
    agreementDate: z.string().min(1),
    feeStatus: z.enum(['PAID', 'PARTIAL', 'DUE', 'OVERDUE']).optional(),
    username: z.string().optional(),
});

type FormInputs = z.infer<typeof formSchema>;

interface StudentDetailsModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    studentId: string;
    onSuccess: () => void;
}

export default function StudentDetailsModal({ open, setOpen, studentId, onSuccess }: StudentDetailsModalProps) {
    const { data: studentResponse, isLoading: isLoadingData, refetch } = useGetStudentQuery(studentId, {
        skip: !open || !studentId
    });
    const student = studentResponse?.data;

    const { user } = useAppSelector((state) => state.auth);
    const isManager = user?.role === 'MANAGER';

    const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();
    const [resendActivation, { isLoading: isResending }] = useResendActivationMutation();

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormInputs>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (student && open) {
            setValue('fullName', student.fullName);
            setValue('fatherName', student.fatherName);
            setValue('cnic', student.cnic);
            setValue('fatherCnic', student.fatherCnic);
            setValue('phone', (student.userId as any)?.phone || '');
            setValue('fatherPhone', student.fatherPhone);
            setValue('email', (student.userId as any)?.email || '');
            setValue('dateOfBirth', student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : ''); // Assuming ISO format from backend
            setValue('gender', student.gender as any);
            setValue('bloodGroup', student.bloodGroup);
            setValue('permanentAddress', student.permanentAddress);
            setValue('emergencyContact', student.emergencyContact);
            setValue('monthlyFee', student.monthlyFee);
            setValue('securityDeposit', student.securityDeposit);
            setValue('agreementDate', student.agreementDate ? new Date(student.agreementDate).toISOString().split('T')[0] : '');
            setValue('feeStatus', student.feeStatus);

            setValue('username', (student.userId as any)?.username || '');
        }
    }, [student, open, setValue]);

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        try {
            const payload: any = {
                ...data,
                dateOfBirth: new Date(data.dateOfBirth),
                agreementDate: new Date(data.agreementDate),
            };

            delete payload.username;

            await updateStudent({ id: studentId, data: payload }).unwrap();

            toast.success('Student details updated successfully');
            onSuccess();
            setOpen(false);
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update student');
        }
    };

    const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const onConfirmDelete = async () => {
        try {
            await deleteStudent(studentId).unwrap();
            toast.success('Student deleted successfully');
            onSuccess();
            setOpen(false);
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to delete student');
            setDeleteModalOpen(false);
        }
    };

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 z-[100] bg-surface-container-highest/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
                <div className="w-full max-w-4xl bg-surface rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto border border-outline-variant custom-scrollbar">
                    {isLoadingData ? (
                        <div className="p-12 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary border-t-transparent"></div>
                            <p className="mt-4 text-on-surface-variant font-medium">Loading details...</p>
                        </div>
                    ) : (
                        <>
                            <div className="p-6 border-b border-outline-variant flex items-center justify-between sticky top-0 bg-surface/95 backdrop-blur-md z-10">
                                <div>
                                    <h2 className="text-display-lg-mobile md:text-display-lg text-primary">Student Details</h2>
                                    <p className="text-body-sm text-on-surface-variant mt-1">View and edit information</p>
                                </div>
                                <button onClick={() => setOpen(false)} className="p-2 hover:bg-surface-container text-on-surface-variant rounded-full transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-10">
                                <section>
                                    <h3 className="text-body-lg font-bold text-primary mb-6 flex items-center gap-2 pb-2 border-b border-outline-variant/50">
                                        <span className="material-symbols-outlined text-secondary">security</span> Account Security
                                    </h3>

                                    {(student?.userId as any)?.activationToken ? (
                                        <div className="bg-error-container/20 border border-error-container rounded-2xl p-6 relative overflow-hidden mb-6">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="material-symbols-outlined text-error">pending_actions</span>
                                                        <h4 className="font-bold text-error">Pending Activation</h4>
                                                    </div>
                                                    <p className="text-sm text-on-surface-variant">
                                                        This student hasn't activated their account yet.
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        try {
                                                            await resendActivation(studentId).unwrap();
                                                            toast.success('Activation link sent to student email');
                                                            refetch();
                                                        } catch (error: any) {
                                                            toast.error(error?.data?.message || 'Failed to resend activation link');
                                                        }
                                                    }}
                                                    disabled={isResending}
                                                    className="flex items-center justify-center gap-2 w-full md:w-auto text-sm font-bold bg-error text-on-error px-6 py-3 rounded-xl hover:bg-error/90 transition-all shadow-sm disabled:opacity-50"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">{isResending ? 'hourglass_top' : 'send'}</span>
                                                    {isResending ? 'Sending...' : 'Resend Link'}
                                                </button>
                                            </div>

                                            <div className="w-full bg-surface p-4 rounded-xl border border-outline-variant/50">
                                                <label className="text-xs font-bold uppercase text-on-surface-variant flex items-center gap-1 mb-2">
                                                    <span className="material-symbols-outlined text-[14px]">link</span>
                                                    Direct Activation Link
                                                </label>
                                                <div className="font-mono text-sm text-primary select-all break-all bg-surface-container p-3 rounded-lg border border-outline-variant/50">
                                                    {`${typeof window !== 'undefined' ? window.location.origin : ''}/student/activate?token=${(student?.userId as any)?.activationToken}`}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-primary-container/20 border border-primary-container rounded-2xl p-6 flex items-center justify-between mb-6">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="material-symbols-outlined text-primary">check_circle</span>
                                                    <h4 className="font-bold text-primary">Account Activated</h4>
                                                </div>
                                                <p className="text-sm text-on-surface-variant">
                                                    The student has successfully activated their account and set their password.
                                                </p>
                                            </div>
                                            <div className="hidden md:flex h-12 w-12 bg-primary-container text-on-primary-container rounded-full items-center justify-center">
                                                <span className="material-symbols-outlined text-2xl">verified_user</span>
                                            </div>
                                        </div>
                                    )}
                                </section>

                                <section>
                                    <h3 className="text-body-lg font-bold text-primary mb-6 flex items-center gap-2 pb-2 border-b border-outline-variant/50">
                                        <span className="material-symbols-outlined text-secondary">person</span> Personal Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <Input label="Full Name" icon="badge" {...register('fullName')} error={errors.fullName?.message} />
                                        <Input label="Date of Birth" icon="calendar_month" type="date" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} />
                                        <div className="space-y-2">
                                            <label className="text-label-md font-bold uppercase text-on-surface-variant flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[18px]">wc</span>
                                                Gender
                                            </label>
                                            <select {...register('gender')} className="w-full px-4 py-3 rounded-xl bg-background border border-outline-variant text-primary font-bold outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                                                <option value="MALE">Male</option>
                                                <option value="FEMALE">Female</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                        </div>
                                        <Input label="Email" icon="mail" type="email" {...register('email')} error={errors.email?.message} />
                                        <Input label="Phone" icon="phone_iphone" {...register('phone')} error={errors.phone?.message} />
                                        <Input label="CNIC" icon="id_card" placeholder="xxxxx-xxxxxxx-x" {...register('cnic')} error={errors.cnic?.message} />
                                        <div className="md:col-span-2 lg:col-span-3">
                                            <Input label="Permanent Address" icon="home_pin" {...register('permanentAddress')} error={errors.permanentAddress?.message} />
                                        </div>
                                    </div>
                                </section>

                                <hr className="border-gray-200 dark:border-gray-800" />

                                <section>
                                    <h3 className="text-body-lg font-bold text-primary mb-6 flex items-center gap-2 pb-2 border-b border-outline-variant/50">
                                        <span className="material-symbols-outlined text-secondary">family_restroom</span> Guardian Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Input label="Father's Name" icon="person" {...register('fatherName')} error={errors.fatherName?.message} />
                                        <Input label="Father's Phone" icon="phone" {...register('fatherPhone')} error={errors.fatherPhone?.message} />
                                        <Input label="Father's CNIC" icon="id_card" {...register('fatherCnic')} error={errors.fatherCnic?.message} />
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-body-lg font-bold text-primary mb-6 flex items-center gap-2 pb-2 border-b border-outline-variant/50">
                                        <span className="material-symbols-outlined text-secondary">emergency</span> Emergency Contact
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Input label="Name" icon="person_alert" {...register('emergencyContact.name')} error={errors.emergencyContact?.name?.message} />
                                        <Input label="Relation" icon="hub" {...register('emergencyContact.relation')} error={errors.emergencyContact?.relation?.message} />
                                        <Input label="Phone" icon="contact_phone" {...register('emergencyContact.phone')} error={errors.emergencyContact?.phone?.message} />
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-body-lg font-bold text-primary mb-6 flex items-center gap-2 pb-2 border-b border-outline-variant/50">
                                        <span className="material-symbols-outlined text-secondary">payments</span> Admission & Fees
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <Input
                                            label="Agreement Date"
                                            icon="calendar_today"
                                            type="date"
                                            {...register('agreementDate')}
                                            error={errors.agreementDate?.message}
                                            disabled={isManager}
                                            className={isManager ? "bg-surface-container opacity-60 cursor-not-allowed" : ""}
                                        />
                                        <Input
                                            label="Monthly Fee"
                                            icon="attach_money"
                                            type="number"
                                            {...register('monthlyFee', { valueAsNumber: true })}
                                            error={errors.monthlyFee?.message}
                                            disabled={isManager}
                                            className={isManager ? "bg-surface-container opacity-60 cursor-not-allowed" : ""}
                                        />
                                        <Input
                                            label="Security Deposit"
                                            icon="account_balance"
                                            type="number"
                                            {...register('securityDeposit', { valueAsNumber: true })}
                                            error={errors.securityDeposit?.message}
                                            disabled={isManager}
                                            className={isManager ? "bg-surface-container opacity-60 cursor-not-allowed" : ""}
                                        />
                                        <div className="space-y-2">
                                            <label className="text-label-md font-bold uppercase text-on-surface-variant flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[18px]">receipt_long</span> Fee Status
                                            </label>
                                            <select
                                                {...register('feeStatus')}
                                                disabled={isManager}
                                                className={`w-full px-4 py-3 rounded-xl bg-background border text-primary font-bold transition-all outline-none focus:ring-2 focus:ring-primary focus:border-primary ${isManager ? "bg-surface-container opacity-60 cursor-not-allowed border-outline-variant" : "border-outline-variant"}`}
                                            >
                                                <option value="PAID">Paid</option>
                                                <option value="DUE">Due</option>
                                                <option value="PARTIAL">Partial</option>
                                                <option value="OVERDUE">Overdue</option>
                                            </select>
                                        </div>
                                    </div>
                                </section>

                                <div className="flex justify-between items-center pt-8 mt-8 border-t border-outline-variant">
                                    <button
                                        type="button"
                                        onClick={handleDeleteClick}
                                        disabled={isDeleting}
                                        className={`px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 ${isManager
                                                ? 'bg-error-container text-error hover:bg-error-container/80'
                                                : 'bg-error text-on-error hover:bg-error/90'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined">{isManager ? 'person_remove' : 'delete'}</span>
                                        {isDeleting ? 'Processing...' : (isManager ? 'Mark as Left' : 'Delete Student')}
                                    </button>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setOpen(false)}
                                            className="px-8 py-3 rounded-xl font-bold bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="px-8 py-3 rounded-xl font-bold bg-primary text-on-primary hover:bg-on-primary-fixed-variant transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined">{isUpdating ? 'hourglass_top' : 'save'}</span>
                                            {isUpdating ? 'Updating...' : 'Update Details'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={onConfirmDelete}
                title={isManager ? "Mark Student as Left" : "Delete Student"}
                message={isManager
                    ? "Are you sure you want to mark this student as left? This will free up their bed but keep their record for reports."
                    : "Are you sure you want to delete this student? This will remove them from the room and deactivate their account. This action cannot be undone."
                }
                isDeleting={isDeleting}
            />
        </>
    );
}

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label: string, icon?: string, error?: string }>(
    ({ label, icon, error, className, ...props }, ref) => (
        <div className="space-y-2 w-full">
            <label className="text-label-md font-bold uppercase text-on-surface-variant flex items-center gap-2">
                {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
                {label}
            </label>
            <input
                ref={ref}
                className={`w-full px-4 py-3 rounded-xl bg-background border transition-all outline-none focus:ring-2 focus:ring-primary focus:border-primary text-primary font-bold ${error ? 'border-error ring-error/20' : 'border-outline-variant hover:border-outline'} ${className}`}
                {...props}
            />
            {error && <p className="text-xs text-error flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>{error}</p>}
        </div>
    )
);
Input.displayName = 'Input';
