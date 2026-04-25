import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { FaUsers, FaMapMarkedAlt, FaCalendarAlt, FaCheckCircle, FaClock, FaUserCheck } from 'react-icons/fa';

const AdminDashboard = () => {
    const { get, loading } = useApi();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDestinations: 0,
        totalTours: 0,
        totalBookings: 0,
        pendingGuides: 0,
        verifiedGuides: 0,
        totalTravellers: 0,
        totalGuides: 0
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch destinations
            let destinationsCount = 0;
            try {
                const destinationsRes = await get('/destinations/', {}, false);
                destinationsCount = destinationsRes?.results?.length || destinationsRes?.length || 0;
            } catch (e) {
                console.log('Destinations API error:', e);
            }
            
            // Fetch tours
            let toursCount = 0;
            try {
                const toursRes = await get('/tours/', {}, false);
                toursCount = toursRes?.results?.length || toursRes?.length || 0;
            } catch (e) {
                console.log('Tours API error:', e);
            }
            
            // Fetch users
            let users = [];
            try {
                const usersRes = await get('/users/users/', {}, false);
                users = Array.isArray(usersRes) ? usersRes : (usersRes?.results || []);
            } catch (e) {
                console.log('Users API error:', e);
            }
            
            // Ensure users is an array
            if (!Array.isArray(users)) {
                users = [];
            }
            
            const guides = users.filter(u => u?.role === 'guide');
            const travellers = users.filter(u => u?.role === 'traveller');
            const verifiedGuides = guides.filter(g => g?.is_verified);
            
            // Fetch pending guide groups
            let pendingGroupsCount = 0;
            try {
                const pendingRes = await get('/guides/pending-groups/', {}, false);
                pendingGroupsCount = Array.isArray(pendingRes) ? pendingRes.length : (pendingRes?.results?.length || 0);
            } catch (e) {
                console.log('Pending groups API error:', e);
            }
            
            // Fetch verified guide groups
            let verifiedGroupsCount = 0;
            try {
                const verifiedRes = await get('/guides/groups/', {}, false);
                verifiedGroupsCount = Array.isArray(verifiedRes) ? verifiedRes.length : (verifiedRes?.results?.length || 0);
            } catch (e) {
                console.log('Verified groups API error:', e);
            }
            
            setStats({
                totalUsers: users.length,
                totalDestinations: destinationsCount,
                totalTours: toursCount,
                totalBookings: 0,
                pendingGuides: pendingGroupsCount,
                verifiedGuides: verifiedGroupsCount,
                totalTravellers: travellers.length,
                totalGuides: guides.length
            });
            setError(null);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-600">Manage your Colo Ghuri platform</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                    <p className="text-red-700">{error}</p>
                    <button onClick={fetchDashboardData} className="mt-2 text-red-600 underline">Try Again</button>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Users</p>
                            <p className="text-3xl font-bold">{stats.totalUsers}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {stats.totalTravellers} travellers | {stats.totalGuides} guides
                            </p>
                        </div>
                        <FaUsers className="text-4xl text-blue-500 opacity-50" />
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Destinations</p>
                            <p className="text-3xl font-bold">{stats.totalDestinations}</p>
                        </div>
                        <FaMapMarkedAlt className="text-4xl text-green-500 opacity-50" />
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Active Tours</p>
                            <p className="text-3xl font-bold">{stats.totalTours}</p>
                        </div>
                        <FaCalendarAlt className="text-4xl text-purple-500 opacity-50" />
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Bookings</p>
                            <p className="text-3xl font-bold">{stats.totalBookings}</p>
                        </div>
                        <FaCheckCircle className="text-4xl text-orange-500 opacity-50" />
                    </div>
                </div>
            </div>

            {/* Guide Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Pending Guide Group Verifications</p>
                            <p className="text-3xl font-bold text-orange-600">{stats.pendingGuides}</p>
                        </div>
                        <FaClock className="text-4xl text-orange-500 opacity-50" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Verified Guide Groups</p>
                            <p className="text-3xl font-bold text-green-600">{stats.verifiedGuides}</p>
                        </div>
                        <FaUserCheck className="text-4xl text-green-500 opacity-50" />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/admin/destinations" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:from-blue-600 hover:to-blue-700 transition shadow-lg">
                    <h3 className="text-xl font-semibold mb-2">Manage Destinations</h3>
                    <p className="text-blue-100">Add, edit, or remove tourist destinations with images</p>
                </Link>
                {/* <Link to="/admin/tours" className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 hover:from-green-600 hover:to-green-700 transition shadow-lg">
                    <h3 className="text-xl font-semibold mb-2">Manage Tours</h3>
                    <p className="text-green-100">Review and manage all tour packages</p>
                </Link> */}
                <Link to="/admin/guide-groups" className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 hover:from-purple-600 hover:to-purple-700 transition shadow-lg">
                    <h3 className="text-xl font-semibold mb-2">Guide Group Verifications</h3>
                    <p className="text-purple-100">Verify or reject guide group registrations</p>
                </Link>
                <Link to="/admin/users" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6 hover:from-orange-600 hover:to-orange-700 transition shadow-lg">
                    <h3 className="text-xl font-semibold mb-2">Manage Users</h3>
                    <p className="text-orange-100">View and manage all platform users</p>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;