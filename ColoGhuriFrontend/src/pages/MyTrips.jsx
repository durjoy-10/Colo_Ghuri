import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import TripCard from '../components/trips/TripCard';
import TripForm from '../components/trips/TripForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { FaPlus, FaPlane } from 'react-icons/fa';

const MyTrips = () => {
    const { get, loading } = useApi();
    const [trips, setTrips] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const response = await get('/trips/', {}, false);
            
            // Handle both array and paginated responses
            let tripsData = [];
            if (response && response.results) {
                tripsData = response.results;
            } else if (Array.isArray(response)) {
                tripsData = response;
            }
            
            setTrips(tripsData);
            setError(null);
        } catch (err) {
            console.error('Error fetching trips:', err);
            setError('Failed to load trips');
            setTrips([]);
        }
    };

    const handleTripCreated = () => {
        setShowForm(false);
        fetchTrips();
    };

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="container-custom py-8">
                <div className="text-center py-12 bg-white rounded-2xl shadow">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button onClick={fetchTrips} className="btn-primary">Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom py-8">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <div>
                    <h1 className="section-title">My Travel Plans</h1>
                    <p className="section-subtitle">Plan and manage your custom trips</p>
                </div>
                <Button onClick={() => setShowForm(true)} icon={FaPlus}>
                    Create New Trip
                </Button>
            </div>

            {trips.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaPlane className="text-3xl text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-4">No trips planned yet</p>
                    <Button onClick={() => setShowForm(true)}>Plan Your First Trip</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map(trip => (
                        <TripCard key={trip.trip_id} trip={trip} onUpdate={fetchTrips} />
                    ))}
                </div>
            )}

            {showForm && (
                <TripForm
                    onClose={() => setShowForm(false)}
                    onSuccess={handleTripCreated}
                />
            )}
        </div>
    );
};

export default MyTrips;