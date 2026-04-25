import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { TOUR_STATUS } from '../../utils/constants';
import toast from 'react-hot-toast';
import axios from '../../api/axios';

const AdminTours = () => {
    const { get, put, del, loading } = useApi();
    const [tours, setTours] = useState([]);
    const [guideGroups, setGuideGroups] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTour, setEditingTour] = useState(null);
    const [formData, setFormData] = useState({
        guide_group: '',
        tour_name: '',
        description: '',
        total_seats: '',
        price_per_person: '',
        discount_percentage: '0',
        status: 'upcoming'
    });

    useEffect(() => {
        fetchTours();
        fetchGuideGroups();
    }, []);

    const fetchTours = async () => {
        try {
            const data = await get('/tours/', {}, false);
            setTours(data.results || data || []);
        } catch (error) {
            console.error('Error fetching tours:', error);
            toast.error('Failed to load tours');
        }
    };

    const fetchGuideGroups = async () => {
        try {
            const data = await get('/guides/groups/', {}, false);
            setGuideGroups(data.results || data || []);
        } catch (error) {
            console.error('Error fetching guide groups:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const tourData = {
            tour_name: formData.tour_name,
            description: formData.description,
            total_seats: parseInt(formData.total_seats),
            price_per_person: formData.price_per_person,
            discount_percentage: formData.discount_percentage,
            status: formData.status,
            guide_group: parseInt(formData.guide_group)
        };
        
        try {
            let result;
            if (editingTour) {
                result = await put(`/tours/${editingTour.tour_id}/update/`, tourData);
            } else {
                result = await axios.post('/tours/create/', tourData);
            }
            if (result) {
                toast.success(editingTour ? 'Tour updated' : 'Tour created');
                setShowModal(false);
                setEditingTour(null);
                fetchTours();
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save tour');
        }
    };

    const handleEdit = (tour) => {
        setEditingTour(tour);
        setFormData({
            guide_group: tour.guide_group,
            tour_name: tour.tour_name,
            description: tour.description,
            total_seats: tour.total_seats,
            price_per_person: tour.price_per_person,
            discount_percentage: tour.discount_percentage,
            status: tour.status
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this tour?')) {
            try {
                await del(`/tours/${id}/delete/`);
                toast.success('Tour deleted');
                fetchTours();
            } catch (error) {
                toast.error('Failed to delete tour');
            }
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            upcoming: 'bg-blue-100 text-blue-800',
            ongoing: 'bg-green-100 text-green-800',
            completed: 'bg-gray-100 text-gray-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Manage Tours</h1>
                    <p className="text-gray-600">View and manage all tour packages</p>
                </div>
                <Button onClick={() => { setEditingTour(null); setFormData({ guide_group: '', tour_name: '', description: '', total_seats: '', price_per_person: '', discount_percentage: '0', status: 'upcoming' }); setShowModal(true); }} icon={FaPlus}>Create Tour</Button>
            </div>

            {tours.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No tours found</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Tour Name</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Guide Group</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Seats</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {tours.map(tour => (
                                    <tr key={tour.tour_id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{tour.tour_name}</div>
                                            <div className="text-xs text-gray-500 line-clamp-1">{tour.description}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{tour.guide_group_details?.guide_groupname || 'N/A'}</td>
                                        <td className="px-4 py-3">{tour.available_seats}/{tour.total_seats}</td>
                                        <td className="px-4 py-3 font-semibold text-primary-600">৳{tour.price_per_person}</td>
                                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tour.status)}`}>{tour.status}</span></td>
                                        <td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => handleEdit(tour)} className="text-blue-600"><FaEdit /></button><button onClick={() => handleDelete(tour.tour_id)} className="text-red-600"><FaTrash /></button></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingTour(null); }} title={editingTour ? 'Edit Tour' : 'Create Tour'} size="lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Guide Group *</label>
                        <select name="guide_group" value={formData.guide_group} onChange={handleChange} className="input-field" required>
                            <option value="">Select a guide group</option>
                            {guideGroups.map(g => <option key={g.guide_group_id} value={g.guide_group_id}>{g.guide_groupname}</option>)}
                        </select>
                    </div>
                    <Input label="Tour Name" name="tour_name" value={formData.tour_name} onChange={handleChange} required />
                    <div><label className="block text-gray-700 mb-2">Description</label><textarea name="description" value={formData.description} onChange={handleChange} className="input-field" rows="3" required /></div>
                    <div className="grid grid-cols-2 gap-4"><Input label="Total Seats" name="total_seats" type="number" value={formData.total_seats} onChange={handleChange} required /><Input label="Price per Person" name="price_per_person" type="number" value={formData.price_per_person} onChange={handleChange} required /></div>
                    <div className="grid grid-cols-2 gap-4"><Input label="Discount %" name="discount_percentage" type="number" value={formData.discount_percentage} onChange={handleChange} /><div><label className="block text-gray-700 mb-2">Status</label><select name="status" value={formData.status} onChange={handleChange} className="input-field">{TOUR_STATUS.map(s => <option key={s} value={s}>{s}</option>)}</select></div></div>
                    <div className="flex gap-3 pt-4"><Button type="button" variant="secondary" onClick={() => { setShowModal(false); setEditingTour(null); }} fullWidth>Cancel</Button><Button type="submit" variant="primary" loading={loading} fullWidth>{editingTour ? 'Update' : 'Create'}</Button></div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminTours;