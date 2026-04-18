import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import TourCard from '../components/tours/TourCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { TOUR_STATUS } from '../utils/constants';

const Tours = () => {
    const { get, loading } = useApi();
    const [tours, setTours] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('upcoming');
    const [showFilters, setShowFilters] = useState(false);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, page: 1, pageSize: 12 });

    useEffect(() => { fetchTours(); }, [search, statusFilter, pagination.page]);

    const fetchTours = async () => {
        let url = `/tours/?page=${pagination.page}&page_size=${pagination.pageSize}`;
        if (search) url += `&search=${search}`;
        if (statusFilter) url += `&status=${statusFilter}`;
        const response = await get(url, false);
        setTours(response.results || response);
        setPagination(prev => ({ ...prev, count: response.count || response.length || 0, next: response.next, previous: response.previous }));
    };

    const clearFilters = () => { setSearch(''); setStatusFilter('upcoming'); setPagination(prev => ({ ...prev, page: 1 })); };
    const totalPages = Math.ceil(pagination.count / pagination.pageSize);

    return (
        <div className="container-custom py-8">
            <div className="text-center mb-8"><h1 className="section-title">Upcoming Tours</h1><p className="section-subtitle">Book your next adventure with our expert guides</p></div>
            <div className="mb-8"><div className="flex flex-col md:flex-row gap-4"><div className="flex-1 relative"><FaSearch className="absolute left-3 top-3 text-gray-400" /><input type="text" placeholder="Search tours..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" /></div><button onClick={() => setShowFilters(!showFilters)} className="btn-outline flex items-center gap-2"><FaFilter /> Filters</button>{(search || statusFilter !== 'upcoming') && <button onClick={clearFilters} className="btn-secondary flex items-center gap-2"><FaTimes /> Clear</button>}</div>
            {showFilters && (<div className="mt-4 p-4 bg-gray-50 rounded-lg"><h3 className="font-semibold mb-3">Tour Status</h3><div className="flex flex-wrap gap-2">{TOUR_STATUS.map(status => (<button key={status} onClick={() => setStatusFilter(status)} className={`px-3 py-1 rounded-full text-sm ${statusFilter === status ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</button>))}</div></div>)}</div>
            <div className="mb-4 text-gray-600">Found {pagination.count} tour{pagination.count !== 1 ? 's' : ''}</div>
            {loading ? <LoadingSpinner /> : tours.length === 0 ? (<div className="text-center py-12"><p className="text-gray-500">No tours found</p><button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button></div>) : (<><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{tours.map(tour => (<TourCard key={tour.tour_id} tour={tour} />))}</div>{totalPages > 1 && (<div className="flex justify-center gap-2 mt-8"><button onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))} disabled={!pagination.previous} className="px-4 py-2 border rounded-lg disabled:opacity-50">Previous</button><span className="px-4 py-2">Page {pagination.page} of {totalPages}</span><button onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))} disabled={!pagination.next} className="px-4 py-2 border rounded-lg disabled:opacity-50">Next</button></div>)}</>)}
        </div>
    );
};

export default Tours;