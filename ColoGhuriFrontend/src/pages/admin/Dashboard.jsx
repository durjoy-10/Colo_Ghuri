import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { FaUsers, FaMapMarkedAlt, FaCalendarAlt, FaCheckCircle, FaClock, FaUserCheck, FaShieldAlt } from 'react-icons/fa';

const AdminDashboard = () => {
    const { get, loading } = useApi();
    const [stats, setStats] = useState({ totalUsers: 0, totalDestinations: 0, totalTours: 0, totalBookings: 0, pendingGuides: 0, verifiedGuides: 0, totalTravellers: 0, totalGuides: 0 });

    useEffect(() => { fetchDashboardData(); }, []);

    const fetchDashboardData = async () => {
        try {
            const [destinationsRes, toursRes, usersRes, pendingRes] = await Promise.all([
                get('/destinations/', false), get('/tours/', false), get('/users/users/', false), get('/users/pending-guides/', false)
            ]);
            const users = usersRes || [];
            const guides = users.filter(u => u.role === 'guide');
            setStats({
                totalUsers: users.length, totalDestinations: destinationsRes?.count || destinationsRes?.length || 0,
                totalTours: toursRes?.count || toursRes?.length || 0, totalBookings: 0, pendingGuides: pendingRes?.length || 0,
                verifiedGuides: guides.filter(g => g.is_verified).length, totalTravellers: users.filter(u => u.role === 'traveller').length,
                totalGuides: guides.length
            });
        } catch (error) { console.error('Error fetching dashboard:', error); }
    };

    return (
        <div className="p-6"><h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1><p className="text-gray-600 mb-6">Manage your Colo Ghuri platform</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"><div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500"><div className="flex justify-between"><div><p className="text-gray-500 text-sm">Total Users</p><p className="text-2xl font-bold">{stats.totalUsers}</p><p className="text-xs text-gray-400">{stats.totalTravellers} travellers | {stats.totalGuides} guides</p></div><FaUsers className="text-3xl text-blue-500 opacity-50" /></div></div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500"><div className="flex justify-between"><div><p className="text-gray-500 text-sm">Destinations</p><p className="text-2xl font-bold">{stats.totalDestinations}</p></div><FaMapMarkedAlt className="text-3xl text-green-500 opacity-50" /></div></div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500"><div className="flex justify-between"><div><p className="text-gray-500 text-sm">Active Tours</p><p className="text-2xl font-bold">{stats.totalTours}</p></div><FaCalendarAlt className="text-3xl text-purple-500 opacity-50" /></div></div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500"><div className="flex justify-between"><div><p className="text-gray-500 text-sm">Total Bookings</p><p className="text-2xl font-bold">{stats.totalBookings}</p></div><FaCheckCircle className="text-3xl text-orange-500 opacity-50" /></div></div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"><div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow p-4"><div className="flex justify-between"><div><p className="text-gray-600 text-sm">Pending Verifications</p><p className="text-2xl font-bold text-orange-600">{stats.pendingGuides}</p></div><FaClock className="text-3xl text-orange-500 opacity-50" /></div></div>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow p-4"><div className="flex justify-between"><div><p className="text-gray-600 text-sm">Verified Guides</p><p className="text-2xl font-bold text-green-600">{stats.verifiedGuides}</p></div><FaUserCheck className="text-3xl text-green-500 opacity-50" /></div></div></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Link to="/admin/destinations" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4"><h3 className="font-semibold">Manage Destinations</h3><p className="text-sm text-blue-100">Add, edit, remove destinations</p></Link>
        <Link to="/admin/tours" className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4"><h3 className="font-semibold">Manage Tours</h3><p className="text-sm text-green-100">Review and manage tours</p></Link>
        <Link to="/admin/guide-groups" className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4"><h3 className="font-semibold">Guide Verifications</h3><p className="text-sm text-purple-100">Verify guide groups</p></Link></div></div>
    );
};

export default AdminDashboard;