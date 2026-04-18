import React, { useRef } from 'react';
import { FaUser, FaCamera } from 'react-icons/fa';

const ProfilePicture = ({ imageUrl, onUpload, uploading }) => {
    const fileInputRef = useRef(null);

    return (
        <div className="flex flex-col items-center mb-8">
            <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                    {imageUrl ? <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><FaUser className="text-4xl text-gray-400" /></div>}
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><FaCamera className="text-white text-2xl" /></div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
                {uploading && <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div></div>}
            </div>
            <p className="text-sm text-gray-500 mt-3">Click to change photo</p>
        </div>
    );
};

export default ProfilePicture;