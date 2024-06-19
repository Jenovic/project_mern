import React from 'react';

interface NotificationModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title: string;
    content: string;
    submitText: string;
    cancelText: string;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ show, onClose, onSubmit, title, content, submitText, cancelText }) => {
    if (!show) return null;

    return (
        <>
            {show && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-1/2 shadow-lg rounded-md bg-white">
                        <div className="text-center">
                            <div className="flex items-center justify-between">
                                <span className='font-bold uppercase'>{title}</span>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700"
                                    onClick={onClose}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            <div className="py-5">
                                {content}
                            </div>
                            <div>
                                <div className="flex items-center justify-end gap-5">
                                    <button
                                        className='bg-sky-700 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                                        onClick={onSubmit}
                                    >
                                        {submitText}
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        onClick={onClose}
                                    >
                                        {cancelText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default NotificationModal;