import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import TripCard from './TripCard';
import TripForm from './TripForm';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaPlus } from 'react-icons/fa';

const TripPlanner = () => {
    const { get, loading } = useApi();
    const [trips, setTrips] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => { fetchTrips(); }, []);

    const fetchTrips = async () => {
        const data = await get('/trips/');
        setTrips(data);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container-custom py-8">
            <div className="flex justify-between items-center mb-6"><div><h1 className="text-2xl font-bold">My Trips</h1><p className="text-gray-600">Plan your custom trips</p></div><Button onClick={() => setShowForm(true)} icon={FaPlus}>Create Trip</Button></div>
            {trips.length === 0 ? (<div className="text-center py-12 bg-white rounded-lg shadow"><p className="text-gray-500">No trips yet</p><Button onClick={() => setShowForm(true)} className="mt-4">Plan Your First Trip</Button></div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{trips.map(trip => (<TripCard key={trip.trip_id} trip={trip} onUpdate={fetchTrips} />))}</div>)}
            {showForm && <TripForm onClose={() => setShowForm(false)} onSuccess={() => { setShowForm(false); fetchTrips(); }} />}
        </div>
    );
};

export default TripPlanner;