import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { 
    FaUsers, FaCalendarAlt, FaMoneyBillWave, FaTicketAlt, 
    FaStar, FaChartLine, FaUserFriends, FaCheckCircle, 
    FaClock, FaEye, FaPhone, FaEnvelope, FaMapMarkerAlt,
    FaGlobe, FaChartPie, FaWallet, FaPercent, FaArrowUp,
    FaArrowDown, FaTrophy, FaAward, FaEdit, FaTrash,
    FaCreditCard, FaMobileAlt, FaCashRegister, FaIdCard,
    FaSync
} from 'react-icons/fa';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import axios from '../../api/axios';

const GuideDashboard = () => {
    const { get, put, del, loading } = useApi();
    const { user, isGuideVerified } = useAuth();
    const [dashboard, setDashboard] = useState(null);
    const [showAllBookings, setShowAllBookings] = useState(false);
    const [bookingPage, setBookingPage] = useState(1);
    const [bookingTotal, setBookingTotal] = useState(0);
    const [bookings, setBookings] = useState([]);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (isGuideVerified) {
            fetchDashboard();
            fetchBookings();
        }
    }, [isGuideVerified, bookingPage]);

    const fetchDashboard = async () => {
        try {
            const data = await get('/guides/dashboard/', {}, false);
            setDashboard(data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
            toast.error('Failed to load dashboard');
        }
    };

    const fetchBookings = async () => {
        try {
            const data = await get(`/guides/bookings/?page=${bookingPage}&page_size=10`, {}, false);
            setBookings(data.bookings || []);
            setBookingTotal(data.total || 0);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchDashboard();
        await fetchBookings();
        setRefreshing(false);
        toast.success('Dashboard refreshed');
    };

    const handleUpdateBookingStatus = async (bookingId, newStatus) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.patch(`/tours/update-booking/${bookingId}/`, {
                status: newStatus
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.data) {
                toast.success(`Booking ${newStatus} successfully`);
                await fetchDashboard();
                await fetchBookings();
                if (selectedBooking && selectedBooking.id === bookingId) {
                    setSelectedBooking({ ...selectedBooking, status: newStatus });
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update booking status');
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentIcon = (method) => {
        switch(method) {
            case 'bkash': return <FaMobileAlt className="text-pink-500" />;
            case 'nagad': return <FaMobileAlt className="text-orange-500" />;
            case 'rocket': return <FaCreditCard className="text-blue-500" />;
            case 'cash': return <FaCashRegister className="text-green-500" />;
            default: return <FaCreditCard className="text-gray-500" />;
        }
    };

    if (loading && !dashboard) return <LoadingSpinner />;

    if (!isGuideVerified) {
        return (
            <div className="container-custom py-16 text-center">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 max-w-md mx-auto rounded">
                    <h2 className="text-xl font-semibold text-yellow-800 mb-2">Account Not Verified</h2>
                    <p className="text-yellow-700">Your guide account is pending verification. Dashboard will be available after verification.</p>
                    <Link to="/profile" className="inline-block mt-4 text-primary-600 hover:underline">Go to Profile</Link>
                </div>
            </div>
        );
    }

    if (!dashboard) return <LoadingSpinner />;

    const stats = dashboard.statistics;
    const guideGroup = dashboard.guide_group;
    const guideProfile = dashboard.guide_profile;
    const members = dashboard.group_members || [];
    const recentBookings = dashboard.recent_bookings || [];
    const tourProfits = dashboard.tour_profits || [];

    const profitMargin = stats.total_revenue > 0 
        ? (stats.total_profit / stats.total_revenue * 100).toFixed(1) 
        : 0;

    return (
        <div className="container-custom py-8">
            {/* Header with Refresh Button */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Guide Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {guideProfile.name}! Here's your group's performance</p>
                </div>
                <button 
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                    <FaSync className={refreshing ? 'animate-spin' : ''} /> Refresh
                </button>
            </div>

            {/* Main Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm">Total Tours</p>
                            <p className="text-3xl font-bold">{stats.total_tours}</p>
                        </div>
                        <FaCalendarAlt className="text-4xl text-blue-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm">Total Bookings</p>
                            <p className="text-3xl font-bold">{stats.total_bookings}</p>
                        </div>
                        <FaTicketAlt className="text-4xl text-green-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm">Total Revenue</p>
                            <p className="text-3xl font-bold">{formatCurrency(stats.total_revenue)}</p>
                        </div>
                        <FaMoneyBillWave className="text-4xl text-purple-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm">Total Travellers</p>
                            <p className="text-3xl font-bold">{stats.total_travellers}</p>
                        </div>
                        <FaUsers className="text-4xl text-orange-200" />
                    </div>
                </div>
            </div>

            {/* Profit & Revenue Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-emerald-100 text-sm">Total Expenses</p>
                            <p className="text-2xl font-bold">{formatCurrency(stats.total_expenses)}</p>
                        </div>
                        <FaWallet className="text-4xl text-emerald-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-indigo-100 text-sm">Net Profit</p>
                            <p className="text-3xl font-bold">{formatCurrency(stats.total_profit)}</p>
                        </div>
                        <FaChartPie className="text-4xl text-indigo-200" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-cyan-100 text-sm">Profit Margin</p>
                            <p className="text-3xl font-bold">{profitMargin}%</p>
                        </div>
                        <FaPercent className="text-4xl text-cyan-200" />
                    </div>
                </div>
            </div>

            {/* Tour Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Upcoming Tours</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.upcoming_tours}</p>
                        </div>
                        <FaClock className="text-3xl text-blue-400" />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Ongoing Tours</p>
                            <p className="text-3xl font-bold text-green-600">{stats.ongoing_tours}</p>
                        </div>
                        <FaChartLine className="text-3xl text-green-400" />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Completed Tours</p>
                            <p className="text-3xl font-bold text-purple-600">{stats.completed_tours}</p>
                        </div>
                        <FaCheckCircle className="text-3xl text-purple-400" />
                    </div>
                </div>
            </div>

            {/* Tour-wise Profit Breakdown */}
            {tourProfits.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <FaChartPie /> Tour-wise Profit Breakdown
                        </h2>
                        <p className="text-primary-100 text-sm mt-1">Detailed financial breakdown by tour</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Tour Name</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Bookings</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Revenue</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Expenses</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Profit</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Margin</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {tourProfits.map(tour => {
                                    const margin = tour.revenue > 0 ? (tour.profit / tour.revenue * 100).toFixed(1) : 0;
                                    return (
                                        <tr key={tour.tour_id} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-3 font-medium text-gray-800">{tour.tour_name}</td>
                                            <td className="px-4 py-3">{tour.booking_count}</td>
                                            <td className="px-4 py-3 text-green-600 font-semibold">{formatCurrency(tour.revenue)}</td>
                                            <td className="px-4 py-3 text-red-600">{formatCurrency(tour.expenses)}</td>
                                            <td className="px-4 py-3 text-blue-600 font-bold">{formatCurrency(tour.profit)}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${margin >= 30 ? 'bg-green-100 text-green-800' : margin >= 15 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                    {margin}%
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    tour.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                                                    tour.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {tour.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="bg-gray-100 font-bold">
                                <tr>
                                    <td className="px-4 py-3">Total</td>
                                    <td className="px-4 py-3">{stats.total_bookings}</td>
                                    <td className="px-4 py-3 text-green-700">{formatCurrency(stats.total_revenue)}</td>
                                    <td className="px-4 py-3 text-red-700">{formatCurrency(stats.total_expenses)}</td>
                                    <td className="px-4 py-3 text-blue-700">{formatCurrency(stats.total_profit)}</td>
                                    <td className="px-4 py-3">{profitMargin}%</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}

            {/* Recent Bookings with Status Management */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <FaTicketAlt /> Recent Bookings
                        </h2>
                        <p className="text-primary-100 text-sm mt-1">Manage customer bookings and update status</p>
                    </div>
                    <button 
                        onClick={() => setShowAllBookings(!showAllBookings)}
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition"
                    >
                        <FaEye /> {showAllBookings ? 'Show Less' : 'View All Bookings'}
                    </button>
                </div>
                
                {showAllBookings ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Tour</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Traveller Details</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Payment Info</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {bookings.map(booking => (
                                        <tr key={booking.id} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-800">{booking.tour_name}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm font-medium">{booking.traveller_name}</div>
                                                <div className="text-xs text-gray-500">{booking.traveller_email}</div>
                                                <div className="text-xs text-gray-500">{booking.traveller_phone}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {getPaymentIcon(booking.payment_method)}
                                                    <span className="text-sm capitalize">{booking.payment_method}</span>
                                                </div>
                                                {booking.payment_id && (
                                                    <div className="text-xs text-gray-500 mt-1">TXID: {booking.payment_id}</div>
                                                )}
                                                {booking.guide_reference && (
                                                    <div className="text-xs text-gray-500">Guide: {booking.guide_reference}</div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-primary-600">{formatCurrency(booking.total_amount)}</td>
                                            <td className="px-4 py-3">
                                                <select
                                                    value={booking.status}
                                                    onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                                                    className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(booking.status)}`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{formatDate(booking.booking_date)}</td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => {
                                                        setSelectedBooking(booking);
                                                        setShowBookingModal(true);
                                                    }}
                                                    className="text-primary-600 hover:text-primary-800 text-sm"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {bookingTotal > 10 && (
                            <div className="px-4 py-3 border-t flex justify-between items-center bg-gray-50">
                                <button 
                                    onClick={() => setBookingPage(p => Math.max(1, p - 1))}
                                    disabled={bookingPage === 1}
                                    className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-600">Page {bookingPage} of {Math.ceil(bookingTotal / 10)}</span>
                                <button 
                                    onClick={() => setBookingPage(p => p + 1)}
                                    disabled={bookingPage >= Math.ceil(bookingTotal / 10)}
                                    className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="divide-y">
                        {recentBookings.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <FaTicketAlt className="text-4xl mx-auto mb-3 text-gray-300" />
                                <p>No bookings yet</p>
                                <p className="text-sm">When customers book your tours, they'll appear here</p>
                            </div>
                        ) : (
                            recentBookings.map(booking => (
                                <div key={booking.id} className="p-4 hover:bg-gray-50 transition cursor-pointer">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h3 className="font-semibold text-gray-800">{booking.tour_name}</h3>
                                                <select
                                                    value={booking.status}
                                                    onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                                                    className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(booking.status)}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">{booking.traveller_name}</span> • {booking.number_of_travellers} travellers
                                            </p>
                                            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-400">
                                                <span>📅 {formatDate(booking.booking_date)}</span>
                                                <span className="flex items-center gap-1">
                                                    {getPaymentIcon(booking.payment_method)} {booking.payment_method?.toUpperCase()}
                                                </span>
                                                {booking.payment_id && <span>📱 TXID: {booking.payment_id}</span>}
                                                {booking.guide_reference && <span>👤 Guide: {booking.guide_reference}</span>}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-primary-600 text-lg">{formatCurrency(booking.total_amount)}</p>
                                            <button
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setShowBookingModal(true);
                                                }}
                                                className="text-primary-500 text-sm hover:underline mt-1"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Guide Group Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <FaUsers /> Guide Group Information
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="mb-4">
                            <h3 className="text-2xl font-bold text-gray-800">{guideGroup.name}</h3>
                            {guideGroup.is_verified ? (
                                <span className="inline-flex items-center gap-1 mt-1 text-green-600 text-sm">
                                    <FaCheckCircle /> Verified Group
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 mt-1 text-yellow-600 text-sm">
                                    <FaClock /> Pending Verification
                                </span>
                            )}
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition">
                                <FaEnvelope className="text-primary-500" />
                                <span>{guideGroup.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition">
                                <FaPhone className="text-primary-500" />
                                <span>{guideGroup.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition">
                                <FaMapMarkerAlt className="text-primary-500" />
                                <span>{guideGroup.address || 'Not provided'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition">
                                <FaUsers className="text-primary-500" />
                                <span>{guideGroup.member_count} Members</span>
                            </div>
                            <div className="mt-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                                <p className="text-gray-600 text-sm italic">{guideGroup.description || 'No description provided'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Guide Profile */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            <FaStar /> Your Profile
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                {guideProfile.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{guideProfile.name}</h3>
                                <p className="text-gray-500">@{guideProfile.username}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <FaStar className="text-yellow-500" />
                                    <span className="font-semibold text-gray-700">{guideProfile.rating}</span>
                                    <span className="text-gray-500 text-sm">({guideProfile.total_tours} tours conducted)</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition">
                                <FaEnvelope className="text-primary-500" />
                                <span>{guideProfile.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition">
                                <FaPhone className="text-primary-500" />
                                <span>{guideProfile.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition">
                                <FaGlobe className="text-primary-500" />
                                <span>Experience: {guideProfile.experience} years</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition">
                                <FaGlobe className="text-primary-500" />
                                <span>Languages: {guideProfile.languages}</span>
                            </div>
                        </div>
                        
                        {guideProfile.bio && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
                                <p className="text-gray-700 text-sm italic">"{guideProfile.bio}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Group Members */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <FaUserFriends /> Team Members ({members.length})
                    </h2>
                    <p className="text-primary-100 text-sm mt-1">Your guide team members and their performance</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Contact</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Experience</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Rating</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Tours Conducted</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {members.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-800">{member.name}</div>
                                        <div className="text-sm text-gray-500">@{member.username}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm">{member.email}</div>
                                        <div className="text-xs text-gray-500">{member.phone}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                            {member.experience} years
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <FaStar className="text-yellow-500 text-sm" />
                                            <span className="font-medium text-gray-700">{member.rating}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="font-semibold text-primary-600">{member.total_tours}</span>
                                        <span className="text-gray-500 text-xs ml-1">tours</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Booking Details Modal */}
            <Modal isOpen={showBookingModal} onClose={() => { setShowBookingModal(false); setSelectedBooking(null); }} title="Booking Details" size="lg">
                {selectedBooking && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Tour Name</p>
                                <p className="font-semibold">{selectedBooking.tour_name}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Booking ID</p>
                                <p className="font-semibold">#{selectedBooking.id}</p>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Traveller Information</p>
                            <p className="font-medium">{selectedBooking.traveller_name}</p>
                            <p className="text-sm">{selectedBooking.traveller_email}</p>
                            <p className="text-sm">{selectedBooking.traveller_phone}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Number of Travellers</p>
                                <p className="font-semibold">{selectedBooking.number_of_travellers} persons</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Total Amount</p>
                                <p className="font-semibold text-primary-600">{formatCurrency(selectedBooking.total_amount)}</p>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Payment Information</p>
                            <div className="flex items-center gap-2 mt-1">
                                {getPaymentIcon(selectedBooking.payment_method)}
                                <span className="capitalize">{selectedBooking.payment_method}</span>
                            </div>
                            {selectedBooking.payment_id && (
                                <p className="text-sm mt-1">Transaction ID: {selectedBooking.payment_id}</p>
                            )}
                            {selectedBooking.guide_reference && (
                                <p className="text-sm mt-1">Guide Reference: {selectedBooking.guide_reference}</p>
                            )}
                        </div>
                        
                        {selectedBooking.special_requests && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Special Requests</p>
                                <p className="text-sm">{selectedBooking.special_requests}</p>
                            </div>
                        )}
                        
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Booking Status</p>
                            <select
                                value={selectedBooking.status}
                                onChange={(e) => handleUpdateBookingStatus(selectedBooking.id, e.target.value)}
                                className={`mt-1 px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${getStatusColor(selectedBooking.status)}`}
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        
                        <Button type="button" variant="secondary" onClick={() => { setShowBookingModal(false); setSelectedBooking(null); }} fullWidth>
                            Close
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default GuideDashboard;