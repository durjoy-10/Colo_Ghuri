import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaStar, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaInfoCircle, FaArrowLeft } from 'react-icons/fa';
import { formatCurrency } from '../utils/formatters';

const DestinationDetail = () => {
    const { id } = useParams();
    const { get, loading } = useApi();
    const [destination, setDestination] = useState(null);

    useEffect(() => { fetchDestination(); }, [id]);

    const fetchDestination = async () => { const data = await get(`/destinations/${id}/`); setDestination(data); };

    if (loading) return <LoadingSpinner />;
    if (!destination) return <div className="text-center py-12">Destination not found</div>;

    return (
        <div className="container-custom py-8">
            <Link to="/destinations" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"><FaArrowLeft /> Back to Destinations</Link>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-96"><img src={destination.images?.[0]?.image || 'https://via.placeholder.com/1200x400'} alt={destination.name} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div><div className="absolute bottom-0 left-0 right-0 p-6 text-white"><h1 className="text-3xl md:text-4xl font-bold mb-2">{destination.name}</h1><div className="flex items-center gap-4"><div className="flex items-center gap-1"><FaMapMarkerAlt /><span>{destination.location}</span></div><div className="flex items-center gap-1"><FaStar className="text-yellow-400" /><span>{destination.average_rating || 'New'} ({destination.total_reviews || 0} reviews)</span></div></div></div></div>
                <div className="p-6"><div className="mb-8"><h2 className="text-2xl font-semibold mb-3">About</h2><p className="text-gray-600 leading-relaxed">{destination.description}</p></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"><div className="bg-gray-50 p-4 rounded-lg"><div className="flex items-center gap-2 mb-2"><FaMoneyBillWave className="text-primary-600" /><h3 className="font-semibold">Entry Fee</h3></div><p className="text-2xl font-bold text-primary-600">{formatCurrency(destination.entry_fee)}</p></div><div className="bg-gray-50 p-4 rounded-lg"><div className="flex items-center gap-2 mb-2"><FaClock className="text-primary-600" /><h3 className="font-semibold">Best Time</h3></div><p className="text-gray-700">{destination.best_time_to_visit}</p></div><div className="bg-gray-50 p-4 rounded-lg"><div className="flex items-center gap-2 mb-2"><FaInfoCircle className="text-primary-600" /><h3 className="font-semibold">Type</h3></div><p className="text-gray-700 capitalize">{destination.destination_type}</p></div><div className="bg-gray-50 p-4 rounded-lg"><div className="flex items-center gap-2 mb-2"><FaClock className="text-primary-600" /><h3 className="font-semibold">Hours</h3></div><p className="text-gray-700">{destination.opening_hours}</p></div></div>
                {destination.images?.length > 0 && (<div><h2 className="text-2xl font-semibold mb-4">Gallery</h2><div className="grid grid-cols-2 md:grid-cols-3 gap-4">{destination.images.map((img, idx) => (<img key={idx} src={img.image} alt={`${destination.name} ${idx + 1}`} className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90" />))}</div></div>)}</div>
            </div>
        </div>
    );
};

export default DestinationDetail;