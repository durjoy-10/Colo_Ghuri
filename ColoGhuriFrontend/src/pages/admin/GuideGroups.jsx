import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { FaCheckCircle, FaBan, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminGuideGroups = () => {
    const { get, post, del, loading } = useApi();
    const [pendingGroups, setPendingGroups] = useState([]);
    const [verifiedGroups, setVerifiedGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);

    useEffect(() => { fetchGroups(); }, []);

    const fetchGroups = async () => {
        const [pending, verified] = await Promise.all([get('/guides/pending-groups/', false), get('/guides/groups/', false)]);
        setPendingGroups(pending || []);
        setVerifiedGroups(verified || []);
    };

    const verifyGroup = async (id) => { await post(`/guides/verify-group/${id}/`); toast.success('Verified'); fetchGroups(); };
    const rejectGroup = async (id) => { if (confirm('Reject? This will delete all member accounts.')) { await del(`/guides/reject-group/${id}/`); toast.success('Rejected'); fetchGroups(); } };

    return (
        <div className="p-6"><h1 className="text-2xl font-bold mb-2">Guide Group Management</h1><p className="text-gray-600 mb-6">Verify or reject guide group registrations</p>
        <div className="mb-8"><h2 className="text-xl font-semibold mb-4">Pending Verifications ({pendingGroups.length})</h2>{pendingGroups.length === 0 ? (<div className="bg-green-50 p-6 rounded-lg text-center"><p className="text-green-700">No pending guide groups</p></div>) : (<div className="space-y-4">{pendingGroups.map(g => (<div key={g.guide_group_id} className="bg-white rounded-lg shadow p-4"><div className="flex flex-wrap justify-between items-start gap-4"><div><h3 className="font-bold text-lg">{g.guide_groupname}</h3><p className="text-gray-600">Email: {g.email}</p><p className="text-gray-600">Phone: {g.phone_number}</p><p className="text-gray-600">Members: {g.guide_group_number}</p>{g.description && <p className="text-gray-500 text-sm mt-2">{g.description}</p>}</div><div className="flex gap-2"><button onClick={() => setSelectedGroup(g)} className="btn-outline text-sm"><FaEye /> View</button><button onClick={() => verifyGroup(g.guide_group_id)} className="bg-green-600 text-white px-3 py-2 rounded-lg"><FaCheckCircle /> Verify</button><button onClick={() => rejectGroup(g.guide_group_id)} className="bg-red-600 text-white px-3 py-2 rounded-lg"><FaBan /> Reject</button></div></div></div>))}</div>)}</div>
        <div><h2 className="text-xl font-semibold mb-4">Verified Groups ({verifiedGroups.length})</h2>{verifiedGroups.length === 0 ? (<div className="bg-gray-50 p-6 rounded-lg text-center"><p className="text-gray-500">No verified guide groups</p></div>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">{verifiedGroups.map(g => (<div key={g.guide_group_id} className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500"><h3 className="font-bold">{g.guide_groupname}</h3><p className="text-sm text-gray-500">{g.email}</p><p className="text-sm text-gray-500">{g.guide_group_number} guides</p></div>))}</div>)}</div>
        {selectedGroup && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedGroup(null)}><div className="bg-white rounded-lg p-6 max-w-md" onClick={e => e.stopPropagation()}><h2 className="text-xl font-bold mb-4">{selectedGroup.guide_groupname}</h2><div className="space-y-2"><p><strong>Email:</strong> {selectedGroup.email}</p><p><strong>Phone:</strong> {selectedGroup.phone_number}</p><p><strong>Address:</strong> {selectedGroup.address || 'N/A'}</p><p><strong>Members:</strong> {selectedGroup.guide_group_number}</p>{selectedGroup.description && <p><strong>Description:</strong> {selectedGroup.description}</p>}</div><button onClick={() => setSelectedGroup(null)} className="mt-4 btn-primary w-full">Close</button></div></div>)}
        </div>
    );
};

export default AdminGuideGroups;