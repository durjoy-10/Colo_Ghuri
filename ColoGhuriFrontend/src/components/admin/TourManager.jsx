import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { TOUR_STATUS } from '../../utils/constants';
import toast from 'react-hot-toast';

const TourManager = () => {
    const { get, post, put, del, loading } = useApi();
    const { user } = useAuth();
    const [tours, setTours] = useState([]);
    const [guideGroups, setGuideGroups] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({ guide_group: '', tour_name: '', description: '', total_seats: '', price_per_person: '', discount_percentage: '0', status: 'upcoming' });

    useEffect(() => { fetchTours(); if (user?.role === 'admin') fetchGuideGroups(); }, []);

    const fetchTours = async () => { const data = await get('/tours/'); setTours(data.results || data); };
    const fetchGuideGroups = async () => { const data = await get('/guides/groups/'); setGuideGroups(data); };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tourData = { tour_name: formData.tour_name, description: formData.description, total_seats: parseInt(formData.total_seats), price_per_person: formData.price_per_person, discount_percentage: formData.discount_percentage, status: formData.status };
        if (user?.role === 'admin') { if (!formData.guide_group) { toast.error('Select guide group'); return; } tourData.guide_group = parseInt(formData.guide_group); }
        let result; if (editing) result = await put(`/tours/${editing.tour_id}/update/`, tourData); else result = await post('/tours/create/', tourData);
        if (result) { toast.success(editing ? 'Updated' : 'Created'); setShowModal(false); setEditing(null); fetchTours(); }
    };

    const handleEdit = (tour) => { setEditing(tour); setFormData({ guide_group: tour.guide_group || '', tour_name: tour.tour_name, description: tour.description, total_seats: tour.total_seats, price_per_person: tour.price_per_person, discount_percentage: tour.discount_percentage, status: tour.status }); setShowModal(true); };
    const handleDelete = async (id) => { if (confirm('Delete?')) { await del(`/tours/${id}/delete/`); toast.success('Deleted'); fetchTours(); } };

    return (
        <div><div className="flex justify-between mb-4"><h2 className="text-xl font-bold">Tours</h2><Button onClick={() => { setEditing(null); setFormData({ guide_group: '', tour_name: '', description: '', total_seats: '', price_per_person: '', discount_percentage: '0', status: 'upcoming' }); setShowModal(true); }} icon={FaPlus}>Add</Button></div>
        <div className="bg-white rounded-lg shadow overflow-hidden"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Seats</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead><tbody className="divide-y">{tours.map(t => (<tr key={t.tour_id}><td className="px-4 py-3">{t.tour_name}</td><td className="px-4 py-3">{t.available_seats}/{t.total_seats}</td><td className="px-4 py-3">৳{t.price_per_person}</td><td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs bg-blue-100">{t.status}</span></td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => handleEdit(t)} className="text-blue-600"><FaEdit /></button><button onClick={() => handleDelete(t.tour_id)} className="text-red-600"><FaTrash /></button></div></td></tr>))}</tbody></table></div>
        <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditing(null); }} title={editing ? 'Edit' : 'Add'}><form onSubmit={handleSubmit} className="space-y-3">{user?.role === 'admin' && (<div><label>Guide Group *</label><select name="guide_group" value={formData.guide_group} onChange={handleChange} className="input-field" required><option value="">Select</option>{guideGroups.map(g => <option key={g.guide_group_id} value={g.guide_group_id}>{g.guide_groupname}</option>)}</select></div>)}<Input label="Tour Name" name="tour_name" value={formData.tour_name} onChange={handleChange} required /><textarea name="description" value={formData.description} onChange={handleChange} className="input-field" rows="2" required /><div className="grid grid-cols-2 gap-3"><Input label="Total Seats" name="total_seats" type="number" value={formData.total_seats} onChange={handleChange} required /><Input label="Price" name="price_per_person" type="number" value={formData.price_per_person} onChange={handleChange} required /></div><div className="grid grid-cols-2 gap-3"><Input label="Discount %" name="discount_percentage" type="number" value={formData.discount_percentage} onChange={handleChange} /><select name="status" value={formData.status} onChange={handleChange} className="input-field">{TOUR_STATUS.map(s => <option key={s} value={s}>{s}</option>)}</select></div><div className="flex gap-3"><Button type="button" variant="secondary" onClick={() => { setShowModal(false); setEditing(null); }} fullWidth>Cancel</Button><Button type="submit" variant="primary" loading={loading} fullWidth>{editing ? 'Update' : 'Create'}</Button></div></form></Modal></div>
    );
};

export default TourManager;