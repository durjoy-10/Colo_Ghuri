import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { FaTrash, FaUserCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

const UserManager = () => {
    const { get, del, post, loading } = useApi();
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => { const data = await get('/users/users/'); setUsers(data || []); };

    const handleDelete = async (id) => { if (confirm('Delete?')) { await del(`/users/users/${id}/`); toast.success('Deleted'); fetchUsers(); } };
    const handleVerify = async (id) => { await post(`/users/verify-guide/${id}/`); toast.success('Verified'); fetchUsers(); };

    const filteredUsers = users.filter(u => filter === 'all' || u.role === filter);

    return (
        <div><div className="flex gap-2 mb-4"><button onClick={() => setFilter('all')} className="px-3 py-1 rounded-full text-sm bg-primary-600 text-white">All</button><button onClick={() => setFilter('admin')} className="px-3 py-1 rounded-full text-sm bg-gray-200">Admin</button><button onClick={() => setFilter('guide')} className="px-3 py-1 rounded-full text-sm bg-gray-200">Guide</button><button onClick={() => setFilter('traveller')} className="px-3 py-1 rounded-full text-sm bg-gray-200">Traveller</button></div>
        <div className="bg-white rounded-lg shadow overflow-hidden"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3">Username</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead><tbody className="divide-y">{filteredUsers.map(u => (<tr key={u.id}><td className="px-4 py-3">{u.username}</td><td className="px-4 py-3">{u.email}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${u.role === 'admin' ? 'bg-red-100 text-red-700' : u.role === 'guide' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{u.role}</span></td><td className="px-4 py-3">{u.role === 'guide' && (u.is_verified ? <span className="text-green-600">Verified</span> : <span className="text-yellow-600">Pending</span>)}</td><td className="px-4 py-3"><div className="flex gap-2">{u.role === 'guide' && !u.is_verified && <button onClick={() => handleVerify(u.id)} className="text-green-600"><FaUserCheck /></button>}{u.role !== 'admin' && <button onClick={() => handleDelete(u.id)} className="text-red-600"><FaTrash /></button>}</div></td></tr>))}</tbody></table></div></div>
    );
};

export default UserManager;