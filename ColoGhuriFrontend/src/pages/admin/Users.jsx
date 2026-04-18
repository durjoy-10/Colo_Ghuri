import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { FaTrash, FaUserCheck, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const { get, del, post, loading } = useApi();
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => { const data = await get('/users/users/'); setUsers(data || []); };

    const handleDelete = async (id) => { if (confirm('Delete?')) { await del(`/users/users/${id}/`); toast.success('Deleted'); fetchUsers(); } };
    const handleVerify = async (id) => { await post(`/users/verify-guide/${id}/`); toast.success('Verified'); fetchUsers(); };

    const filteredUsers = users.filter(u => {
        if (filter !== 'all' && u.role !== filter) return false;
        if (search && !u.username.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const stats = { total: users.length, admins: users.filter(u => u.role === 'admin').length, guides: users.filter(u => u.role === 'guide').length, travellers: users.filter(u => u.role === 'traveller').length, pending: users.filter(u => u.role === 'guide' && !u.is_verified).length };

    return (
        <div className="p-6"><h1 className="text-2xl font-bold mb-2">Manage Users</h1><p className="text-gray-600 mb-4">View and manage all platform users</p>
        <div className="grid grid-cols-5 gap-3 mb-4"><div className="bg-white rounded shadow p-2 text-center"><p className="text-xl font-bold text-blue-600">{stats.total}</p><p className="text-xs text-gray-500">Total</p></div><div className="bg-white rounded shadow p-2 text-center"><p className="text-xl font-bold text-red-600">{stats.admins}</p><p className="text-xs text-gray-500">Admins</p></div><div className="bg-white rounded shadow p-2 text-center"><p className="text-xl font-bold text-blue-600">{stats.guides}</p><p className="text-xs text-gray-500">Guides</p></div><div className="bg-white rounded shadow p-2 text-center"><p className="text-xl font-bold text-green-600">{stats.travellers}</p><p className="text-xs text-gray-500">Travellers</p></div><div className="bg-white rounded shadow p-2 text-center"><p className="text-xl font-bold text-yellow-600">{stats.pending}</p><p className="text-xs text-gray-500">Pending</p></div></div>
        <div className="flex flex-wrap gap-2 mb-4"><button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>All</button><button onClick={() => setFilter('admin')} className={`px-3 py-1 rounded-full text-sm ${filter === 'admin' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>Admin</button><button onClick={() => setFilter('guide')} className={`px-3 py-1 rounded-full text-sm ${filter === 'guide' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Guide</button><button onClick={() => setFilter('traveller')} className={`px-3 py-1 rounded-full text-sm ${filter === 'traveller' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>Traveller</button><input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field max-w-xs text-sm ml-auto" /></div>
        <div className="bg-white rounded-lg shadow overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead><tbody className="divide-y">{filteredUsers.map(u => (<tr key={u.id}><td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">{u.profile_picture ? <img src={u.profile_picture} className="w-8 h-8 rounded-full object-cover" /> : <FaUser className="text-gray-500 text-sm" />}</div><span className="font-medium">{u.username}</span></div></td><td className="px-4 py-3 text-sm">{u.email}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${u.role === 'admin' ? 'bg-red-100 text-red-700' : u.role === 'guide' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{u.role}</span></td><td className="px-4 py-3">{u.role === 'guide' && (u.is_verified ? <span className="text-green-600 text-sm">Verified</span> : <span className="text-yellow-600 text-sm">Pending</span>)}</td><td className="px-4 py-3"><div className="flex gap-2">{u.role === 'guide' && !u.is_verified && <button onClick={() => handleVerify(u.id)} className="text-green-600"><FaUserCheck /></button>}{u.role !== 'admin' && <button onClick={() => handleDelete(u.id)} className="text-red-600"><FaTrash /></button>}</div></td></tr>))}</tbody></table></div></div>
    );
};

export default AdminUsers;