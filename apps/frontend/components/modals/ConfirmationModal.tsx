'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  iconName?: string;
  confirmVariant?: 'primary' | 'error' | 'warning' | 'success';
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  iconName = 'warning',
  confirmVariant = 'warning',
  isLoading = false,
}: ConfirmationModalProps) {
  
  const getColors = () => {
      switch (confirmVariant) {
          case 'error': return { bg: 'bg-error-container', text: 'text-on-error-container', btn: 'bg-error text-white hover:bg-error/90', icon: 'text-error' };
          case 'success': return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-200', btn: 'bg-green-600 text-white hover:bg-green-700', icon: 'text-green-600' };
          case 'primary': return { bg: 'bg-primary-container', text: 'text-on-primary-container', btn: 'bg-primary text-on-primary hover:opacity-90', icon: 'text-primary' };
          case 'warning':
          default:
              return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-200', btn: 'bg-yellow-600 text-white hover:bg-yellow-700', icon: 'text-yellow-600' };
      }
  };

  const colors = getColors();

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[200]" onClose={!isLoading ? onClose : () => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto z-[200]">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-surface p-6 text-left align-middle shadow-xl transition-all border border-outline-variant">
                <div className="flex items-start gap-4">
                    <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${colors.bg} ${colors.icon}`}>
                        <span className="material-symbols-outlined text-[24px]">{iconName}</span>
                    </div>
                    <div>
                        <Dialog.Title
                        as="h3"
                        className="text-lg font-bold leading-6 text-on-surface"
                        >
                        {title}
                        </Dialog.Title>
                        <div className="mt-2">
                        <p className="text-sm text-on-surface-variant">
                            {message}
                        </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-xl border border-outline-variant bg-surface-container px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low focus:outline-none transition-colors"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`inline-flex justify-center items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none transition-colors ${colors.btn}`}
                    onClick={onConfirm}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                       <>
                         <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                         Processing...
                       </>
                    ) : (
                       <>{confirmText}</>
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
