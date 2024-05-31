import React from 'react';

interface FormModalProps {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const FormModal: React.FC<FormModalProps> = ({ show, onClose, children }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
                <div className="text-center">
                    <div className="flex items-center justify-end px-5">
                        <button
                            className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700"
                            onClick={onClose}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div className="px-5 py-5">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormModal;