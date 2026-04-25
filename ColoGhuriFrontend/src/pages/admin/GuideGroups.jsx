import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { FaCheckCircle, FaBan, FaEye, FaUsers, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaUserCheck, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from '../../api/axios';

const AdminGuideGroups = () => {
    const { get, del, loading } = useApi();
    const [pendingGroups, setPendingGroups] = useState([]);
    const [verifiedGroups, setVerifiedGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        setFetching(true);
        try {
            // Fetch pending groups
            let pendingData = [];
            try {
                const pendingRes = await get('/guides/pending-groups/', {}, false);
                pendingData = Array.isArray(pendingRes) ? pendingRes : (pendingRes?.results || []);
            } catch (e) {
                console.log('Pending groups error:', e);
            }
            
            // Fetch verified groups
            let verifiedData = [];
            try {
                const verifiedRes = await get('/guides/groups/', {}, false);
                verifiedData = Array.isArray(verifiedRes) ? verifiedRes : (verifiedRes?.results || []);
            } catch (e) {
                console.log('Verified groups error:', e);
            }
            
            setPendingGroups(pendingData);
            setVerifiedGroups(verifiedData);
        } catch (error) {
            console.error('Error fetching groups:', error);
            toast.error('Failed to load guide groups');
        } finally {
            setFetching(false);
        }
    };

    const verifyGroup = async (groupId) => {
        if (window.confirm('Are you sure you want to verify this guide group? This will send password setup emails to all guides.')) {
            setVerifying(true);
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.post(`/guides/verify-group/${groupId}/`, {}, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log('Verify response:', response.data);
                toast.success(response.data.message || 'Guide group verified successfully! Password setup emails sent to all guides.');
                fetchGroups();
                setShowModal(false);
            } catch (error) {
                console.error('Verify error:', error);
                toast.error(error.response?.data?.error || 'Failed to verify group');
            } finally {
                setVerifying(false);
            }
        }
    };

    const rejectGroup = async (groupId) => {
        if (window.confirm('Reject this guide group? This will delete all member accounts. This action cannot be undone.')) {
            try {
                await del(`/guides/reject-group/${groupId}/`);
                toast.success('Guide group rejected and removed');
                fetchGroups();
            } catch (error) {
                toast.error('Failed to reject group');
            }
        }
    };

    const viewGroupDetails = (group) => {
        setSelectedGroup(group);
        setShowModal(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (fetching) {
        return (
            <div className="p-6 flex justify-center items-center h-96">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto mb-3" />
                    <p className="text-gray-500">Loading guide groups...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Guide Group Management</h1>
                <p className="text-gray-600">Review, verify, or reject guide group registrations</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Pending Guide Groups</p>
                            <p className="text-3xl font-bold text-orange-600">{pendingGroups.length}</p>
                            <p className="text-xs text-gray-500 mt-1">Awaiting verification</p>
                        </div>
                        <FaClock className="text-4xl text-orange-500 opacity-50" />
                    </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Verified Guide Groups</p>
                            <p className="text-3xl font-bold text-green-600">{verifiedGroups.length}</p>
                            <p className="text-xs text-gray-500 mt-1">Active on platform</p>
                        </div>
                        <FaUserCheck className="text-4xl text-green-500 opacity-50" />
                    </div>
                </div>
            </div>

            {/* Pending Groups Section */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaClock className="text-orange-500" /> Pending Verifications ({pendingGroups.length})
                </h2>
                {pendingGroups.length === 0 ? (
                    <div className="bg-green-50 p-8 rounded-lg text-center">
                        <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-3" />
                        <p className="text-green-700">No pending guide groups</p>
                        <p className="text-sm text-green-600">All guide groups have been verified</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {pendingGroups.map(group => (
                            <div key={group.guide_group_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="p-5">
                                    <div className="flex flex-wrap justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                    {group.guide_groupname?.charAt(0).toUpperCase() || 'G'}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-xl text-gray-800">{group.guide_groupname}</h3>
                                                    <p className="text-sm text-gray-500">
                                                        Registered on {formatDate(group.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <FaEnvelope className="text-gray-400" />
                                                    <span>{group.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <FaPhone className="text-gray-400" />
                                                    <span>{group.phone_number}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <FaUsers className="text-gray-400" />
                                                    <span>{group.guide_group_number} guides in group</span>
                                                </div>
                                                {group.address && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <FaMapMarkerAlt className="text-gray-400" />
                                                        <span className="truncate">{group.address}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {group.description && (
                                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-sm text-gray-600">{group.description}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => viewGroupDetails(group)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                            >
                                                <FaEye /> View Details
                                            </button>
                                            <button
                                                onClick={() => verifyGroup(group.guide_group_id)}
                                                disabled={verifying}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 disabled:opacity-50"
                                            >
                                                <FaCheckCircle /> {verifying ? 'Verifying...' : 'Verify Group'}
                                            </button>
                                            <button
                                                onClick={() => rejectGroup(group.guide_group_id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                            >
                                                <FaBan /> Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Verified Groups Section */}
            <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaUserCheck className="text-green-500" /> Verified Groups ({verifiedGroups.length})
                </h2>
                {verifiedGroups.length === 0 ? (
                    <div className="bg-gray-50 p-8 rounded-lg text-center">
                        <FaUsers className="text-4xl text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No verified guide groups yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {verifiedGroups.map(group => (
                            <div key={group.guide_group_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-green-500">
                                <div className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-800">{group.guide_groupname}</h3>
                                            <p className="text-sm text-gray-500">{group.email}</p>
                                            <p className="text-sm text-gray-500">{group.phone_number}</p>
                                            <p className="text-sm text-gray-600 mt-2">
                                                <FaUsers className="inline mr-1 text-gray-400" size={12} />
                                                {group.guide_group_number} guides
                                            </p>
                                        </div>
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                                            Verified
                                        </span>
                                    </div>
                                    {group.address && (
                                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                            <FaMapMarkerAlt size={10} /> {group.address}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Group Details Modal */}
            {showModal && selectedGroup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4 flex justify-between items-center sticky top-0">
                            <h2 className="text-xl font-bold text-white">Guide Group Details</h2>
                            <button onClick={() => setShowModal(false)} className="text-white hover:text-gray-200 text-2xl">
                                ×
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b">
                                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    {selectedGroup.guide_groupname?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800">{selectedGroup.guide_groupname}</h3>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1 ${selectedGroup.is_verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {selectedGroup.is_verified ? 'Verified' : 'Pending Verification'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="font-medium break-all">{selectedGroup.email}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Phone</p>
                                    <p className="font-medium">{selectedGroup.phone_number}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Number of Guides</p>
                                    <p className="font-medium">{selectedGroup.guide_group_number}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Registered On</p>
                                    <p className="font-medium">{formatDate(selectedGroup.created_at)}</p>
                                </div>
                                {selectedGroup.address && (
                                    <div className="bg-gray-50 p-3 rounded-lg md:col-span-2">
                                        <p className="text-xs text-gray-500">Address</p>
                                        <p className="font-medium break-all">{selectedGroup.address}</p>
                                    </div>
                                )}
                                {selectedGroup.description && (
                                    <div className="bg-gray-50 p-3 rounded-lg md:col-span-2">
                                        <p className="text-xs text-gray-500">Description</p>
                                        <p className="text-sm">{selectedGroup.description}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex gap-3 pt-4 border-t">
                                {!selectedGroup.is_verified && (
                                    <button
                                        onClick={() => verifyGroup(selectedGroup.guide_group_id)}
                                        disabled={verifying}
                                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                                    >
                                        {verifying ? 'Verifying...' : 'Verify Group'}
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGuideGroups;