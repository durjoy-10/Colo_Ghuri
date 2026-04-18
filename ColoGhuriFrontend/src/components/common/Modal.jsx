import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children, size = 'md', showCloseButton = true }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className={`bg-white rounded-xl shadow-xl w-full ${sizes[size]} animate-fade-in`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    {showCloseButton && (
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <FaTimes className="h-5 w-5" />
                        </button>
                    )}
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};

export default Modal;