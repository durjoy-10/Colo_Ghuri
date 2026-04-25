import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { FaTrash, FaUserCheck, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const { get, del, post, loading } = useApi();
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await get('/users/users/', {}, false);
            setUsers(Array.isArray(data) ? data : (data?.results || []));
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this user?')) {
            try {
                await del(`/users/users/${id}/`);
                toast.success('User deleted');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    const handleVerify = async (id) => {
        try {
            await post(`/users/verify-guide/${id}/`);
            toast.success('Guide verified');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to verify guide');
        }
    };

    const filteredUsers = users.filter(u => {
        if (filter !== 'all' && u.role !== filter) return false;
        if (search && !u.username.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const stats = {
        total: users.length,
        admins: users.filter(u => u.role === 'admin').length,
        guides: users.filter(u => u.role === 'guide').length,
        travellers: users.filter(u => u.role === 'traveller').length,
        pendingGuides: users.filter(u => u.role === 'guide' && !u.is_verified).length,
        emailUnverified: users.filter(u => !u.email_verified).length,
        emailVerified: users.filter(u => u.email_verified).length
    };

    const getRoleBadge = (role) => {
        const styles = {
            admin: 'bg-red-100 text-red-700',
            guide: 'bg-blue-100 text-blue-700',
            traveller: 'bg-green-100 text-green-700'
        };
        return styles[role] || 'bg-gray-100 text-gray-700';
    };

    const getEmailVerificationStatus = (user) => {
        if (user.email_verified) {
            return {
                text: 'Verified',
                color: 'bg-green-100 text-green-700',
                icon: <FaCheckCircle className="text-green-500 mr-1" size={12} />
            };
        } else {
            return {
                text: 'Email Unverified',
                color: 'bg-red-100 text-red-700',
                icon: <FaTimesCircle className="text-red-500 mr-1" size={12} />
            };
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Manage Users</h1>
                <p className="text-gray-600">View and manage all platform users</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                <div className="bg-white rounded-lg shadow p-3 text-center">
                    <p className="text-xl font-bold text-blue-600">{stats.total}</p>
                    <p className="text-xs text-gray-500">Total Users</p>
                </div>
                <div className="bg-white rounded-lg shadow p-3 text-center">
                    <p className="text-xl font-bold text-red-600">{stats.admins}</p>
                    <p className="text-xs text-gray-500">Admins</p>
                </div>
                <div className="bg-white rounded-lg shadow p-3 text-center">
                    <p className="text-xl font-bold text-blue-600">{stats.guides}</p>
                    <p className="text-xs text-gray-500">Guides</p>
                </div>
                <div className="bg-white rounded-lg shadow p-3 text-center">
                    <p className="text-xl font-bold text-green-600">{stats.travellers}</p>
                    <p className="text-xs text-gray-500">Travellers</p>
                </div>
                <div className="bg-white rounded-lg shadow p-3 text-center">
                    <p className="text-xl font-bold text-yellow-600">{stats.pendingGuides}</p>
                    <p className="text-xs text-gray-500">Pending Guides</p>
                </div>
                <div className="bg-white rounded-lg shadow p-3 text-center">
                    <p className="text-xl font-bold text-red-600">{stats.emailUnverified}</p>
                    <p className="text-xs text-gray-500">Email Unverified</p>
                </div>
                <div className="bg-white rounded-lg shadow p-3 text-center">
                    <p className="text-xl font-bold text-green-600">{stats.emailVerified}</p>
                    <p className="text-xs text-gray-500">Email Verified</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
                <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>All</button>
                <button onClick={() => setFilter('admin')} className={`px-3 py-1 rounded-full text-sm ${filter === 'admin' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>Admin</button>
                <button onClick={() => setFilter('guide')} className={`px-3 py-1 rounded-full text-sm ${filter === 'guide' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Guide</button>
                <button onClick={() => setFilter('traveller')} className={`px-3 py-1 rounded-full text-sm ${filter === 'traveller' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>Traveller</button>
                <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field max-w-xs text-sm ml-auto" />
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">User</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Contact</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Guide Status</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Email Verification</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Joined</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredUsers.map(u => {
                            const emailStatus = getEmailVerificationStatus(u);
                            return (
                                <tr key={u.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                {u.profile_picture ? <img src={u.profile_picture} className="w-8 h-8 rounded-full" /> : <FaUser className="text-gray-500" />}
                                            </div>
                                            <div>
                                                <div className="font-medium">{u.username}</div>
                                                <div className="text-xs text-gray-500">{u.first_name} {u.last_name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm">{u.email}</div>
                                        <div className="text-xs text-gray-500">{u.phone_number}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(u.role)}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {u.role === 'guide' && (
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.is_verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {u.is_verified ? 'Verified' : 'Pending'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${emailStatus.color}`}>
                                            {emailStatus.icon}
                                            {emailStatus.text}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">{new Date(u.date_joined).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            {u.role === 'guide' && !u.is_verified && (
                                                <button onClick={() => handleVerify(u.id)} className="text-green-600 hover:text-green-800" title="Verify Guide">
                                                    <FaUserCheck />
                                                </button>
                                            )}
                                            {u.role !== 'admin' && (
                                                <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-800" title="Delete User">
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No users found
                </div>
            )}
        </div>
    );
};

export default AdminUsers;