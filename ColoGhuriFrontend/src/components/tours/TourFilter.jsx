import React from 'react';
import { TOUR_STATUS } from '../../utils/constants';

const TourFilter = ({ selectedStatus, onStatusChange, searchTerm, onSearchChange }) => {
    return (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
                {TOUR_STATUS.map(status => (
                    <button key={status} onClick={() => onStatusChange(status)} className={`px-3 py-1 rounded-full text-sm transition ${selectedStatus === status ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</button>
                ))}
            </div>
            <input type="text" placeholder="Search tours..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className="input-field" />
        </div>
    );
};

export default TourFilter;