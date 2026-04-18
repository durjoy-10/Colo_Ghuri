import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { DESTINATION_TYPES } from '../../utils/constants';
import toast from 'react-hot-toast';

const DestinationManager = () => {
    const { get, post, put, del, loading } = useApi();
    const [destinations, setDestinations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', location: '', destination_type: 'beach', entry_fee: '', best_time_to_visit: '', opening_hours: '', is_popular: false });

    useEffect(() => { fetchDestinations(); }, []);

    const fetchDestinations = async () => {
        const data = await get('/destinations/');
        setDestinations(data.results || data);
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let result;
        if (editing) result = await put(`/destinations/${editing.destination_id}/update/`, formData);
        else result = await post('/destinations/create/', formData);
        if (result) { toast.success(editing ? 'Updated' : 'Created'); setShowModal(false); setEditing(null); fetchDestinations(); }
    };

    const handleEdit = (dest) => { setEditing(dest); setFormData(dest); setShowModal(true); };
    const handleDelete = async (id) => { if (confirm('Delete?')) { await del(`/destinations/${id}/delete/`); toast.success('Deleted'); fetchDestinations(); } };

    return (
        <div><div className="flex justify-between mb-4"><h2 className="text-xl font-bold">Destinations</h2><Button onClick={() => { setEditing(null); setFormData({ name: '', description: '', location: '', destination_type: 'beach', entry_fee: '', best_time_to_visit: '', opening_hours: '', is_popular: false }); setShowModal(true); }} icon={FaPlus}>Add</Button></div>
        <div className="bg-white rounded-lg shadow overflow-hidden"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Location</th><th className="px-4 py-3 text-left">Type</th><th className="px-4 py-3 text-left">Fee</th><th className="px-4 py-3">Actions</th></tr></thead><tbody className="divide-y">{destinations.map(d => (<tr key={d.destination_id}><td className="px-4 py-3">{d.name}</td><td className="px-4 py-3">{d.location}</td><td className="px-4 py-3 capitalize">{d.destination_type}</td><td className="px-4 py-3">৳{d.entry_fee}</td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => handleEdit(d)} className="text-blue-600"><FaEdit /></button><button onClick={() => handleDelete(d.destination_id)} className="text-red-600"><FaTrash /></button></div></td></tr>))}</tbody></table></div>
        <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditing(null); }} title={editing ? 'Edit' : 'Add'}><form onSubmit={handleSubmit} className="space-y-3"><Input label="Name" name="name" value={formData.name} onChange={handleChange} required /><Input label="Location" name="location" value={formData.location} onChange={handleChange} required /><textarea name="description" value={formData.description} onChange={handleChange} className="input-field" rows="2" placeholder="Description" required /><div className="grid grid-cols-2 gap-3"><select name="destination_type" value={formData.destination_type} onChange={handleChange} className="input-field">{DESTINATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select><Input label="Entry Fee" name="entry_fee" type="number" value={formData.entry_fee} onChange={handleChange} /></div><div className="grid grid-cols-2 gap-3"><Input label="Best Time" name="best_time_to_visit" value={formData.best_time_to_visit} onChange={handleChange} /><Input label="Hours" name="opening_hours" value={formData.opening_hours} onChange={handleChange} /></div><label className="flex items-center gap-2"><input type="checkbox" name="is_popular" checked={formData.is_popular} onChange={handleChange} /> Popular</label><div className="flex gap-3"><Button type="button" variant="secondary" onClick={() => { setShowModal(false); setEditing(null); }} fullWidth>Cancel</Button><Button type="submit" variant="primary" loading={loading} fullWidth>{editing ? 'Update' : 'Create'}</Button></div></form></Modal></div>
    );
};

export default DestinationManager;