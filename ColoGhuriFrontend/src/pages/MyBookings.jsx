import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaCalendarAlt, FaUsers, FaMoneyBillWave, FaClock, FaTicketAlt } from 'react-icons/fa';
import { formatCurrency, formatDate, getStatusColor } from '../utils/formatters';

const MyBookings = () => {
    const { get, loading } = useApi();
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await get('/tours/my-bookings/', {}, false);
            
            // Handle both paginated and non-paginated responses
            let bookingsData = [];
            if (response && response.results) {
                bookingsData = response.results;
            } else if (Array.isArray(response)) {
                bookingsData = response;
            } else if (response && typeof response === 'object') {
                bookingsData = [response];
            }
            
            setBookings(bookingsData);
            setError(null);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError('Failed to load bookings');
            setBookings([]);
        }
    };

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="container-custom py-8">
                <div className="text-center py-12 bg-white rounded-2xl shadow">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button onClick={fetchBookings} className="btn-primary">Try Again</button>
                </div>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="container-custom py-8">
                <div className="text-center mb-8">
                    <h1 className="section-title">My Bookings</h1>
                    <p className="section-subtitle">View and manage your tour bookings</p>
                </div>
                <div className="text-center py-16 bg-white rounded-2xl shadow">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaTicketAlt className="text-3xl text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-4">No bookings yet</p>
                    <Link to="/tours" className="btn-primary inline-block">Browse Tours</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom py-8">
            <div className="text-center mb-8">
                <h1 className="section-title">My Bookings</h1>
                <p className="section-subtitle">View and manage your tour bookings</p>
            </div>

            <div className="space-y-4">
                {bookings.map((booking) => (
                    <div key={booking.booking_id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-dark-800">
                                        {booking.tour_details?.tour_name || 'Tour Name'}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">Booking ID: #{booking.booking_id}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                    {booking.status?.toUpperCase() || 'PENDING'}
                                </span>
                            </div>
                            
                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <FaUsers className="text-primary-500 text-xl" />
                                    <div>
                                        <p className="text-xs text-gray-500">Travellers</p>
                                        <p className="font-semibold">{booking.number_of_travellers || 1} persons</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <FaMoneyBillWave className="text-primary-500 text-xl" />
                                    <div>
                                        <p className="text-xs text-gray-500">Total Amount</p>
                                        <p className="font-semibold text-primary-600">{formatCurrency(booking.total_amount || 0)}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <FaCalendarAlt className="text-primary-500 text-xl" />
                                    <div>
                                        <p className="text-xs text-gray-500">Booking Date</p>
                                        <p className="font-semibold">{formatDate(booking.booking_date)}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <FaClock className="text-primary-500 text-xl" />
                                    <div>
                                        <p className="text-xs text-gray-500">Payment Method</p>
                                        <p className="font-semibold capitalize">{booking.payment_method || 'Pending'}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Special Requests */}
                            {booking.special_requests && (
                                <div className="mt-4 p-4 bg-primary-50 rounded-xl">
                                    <p className="text-sm text-primary-700">
                                        <span className="font-semibold">Special Requests:</span> {booking.special_requests}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBookings;