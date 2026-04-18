import React from 'react';
import { DESTINATION_TYPES } from '../../utils/constants';

const DestinationFilter = ({ selectedType, onTypeChange, searchTerm, onSearchChange }) => {
    return (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
                <button onClick={() => onTypeChange('')} className={`px-3 py-1 rounded-full text-sm transition ${!selectedType ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>All</button>
                {DESTINATION_TYPES.map(type => (
                    <button key={type} onClick={() => onTypeChange(type)} className={`px-3 py-1 rounded-full text-sm transition ${selectedType === type ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{type.charAt(0).toUpperCase() + type.slice(1)}</button>
                ))}
            </div>
            <input type="text" placeholder="Search destinations..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className="input-field" />
        </div>
    );
};

export default DestinationFilter;