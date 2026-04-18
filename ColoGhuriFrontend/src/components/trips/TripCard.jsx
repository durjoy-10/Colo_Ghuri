import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMoneyBillWave, FaTrash, FaEye, FaMapMarkerAlt } from 'react-icons/fa';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const TripCard = ({ trip, onUpdate }) => {
    const { del, loading } = useApi();
    const [showDelete, setShowDelete] = useState(false);

    const getStatusColor = (status) => {
        switch(status) {
            case 'planning': return 'bg-yellow-100 text-yellow-800';
            case 'upcoming': return 'bg-blue-100 text-blue-800';
            case 'ongoing': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleDelete = async () => {
        try {
            await del(`/trips/${trip.trip_id}/`);
            toast.success('Trip deleted successfully');
            onUpdate();
            setShowDelete(false);
        } catch (error) {
            toast.error('Failed to delete trip');
        }
    };

    // Calculate total expenses if available
    const totalExpenses = trip.expenses?.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) || 0;

    return (
        <>
            <div className="card group">
                <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary-600 transition-colors">
                            {trip.trip_name || 'Untitled Trip'}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                            {trip.status || 'planning'}
                        </span>
                    </div>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                            <FaCalendarAlt className="text-primary-500" />
                            <span className="text-sm">
                                {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <FaMoneyBillWave className="text-primary-500" />
                            <span className="text-sm">
                                Budget: {formatCurrency(trip.total_budget || 0)}
                                <span className="text-green-600 ml-2">
                                    | Spent: {formatCurrency(totalExpenses)}
                                </span>
                            </span>
                        </div>
                        {trip.destinations && trip.destinations.length > 0 && (
                            <div className="flex items-center gap-2 text-gray-600">
                                <FaMapMarkerAlt className="text-primary-500" />
                                <span className="text-sm">
                                    {trip.destinations.length} destination(s)
                                </span>
                            </div>
                        )}
                    </div>

                    {trip.notes && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{trip.notes}</p>
                    )}

                    <div className="flex justify-end gap-2 pt-3 border-t">
                        <Link 
                            to={`/my-trips/${trip.trip_id}`} 
                            className="text-primary-600 hover:text-primary-700 p-2 transition-colors"
                            title="View Details"
                        >
                            <FaEye size={18} />
                        </Link>
                        <button 
                            onClick={() => setShowDelete(true)} 
                            className="text-red-600 hover:text-red-700 p-2 transition-colors"
                            title="Delete Trip"
                        >
                            <FaTrash size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl p-6 max-w-sm mx-4">
                        <h3 className="text-xl font-bold mb-3">Delete Trip</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{trip.trip_name}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDelete(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TripCard;