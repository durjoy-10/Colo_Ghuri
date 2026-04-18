import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const AdminSettings = () => {
    const { user } = useAuth();
    const { put, loading } = useApi();
    const [formData, setFormData] = useState({ site_name: 'Colo Ghuri', site_email: 'info@cologhuri.com', site_phone: '+8801234567890', site_address: 'Dhaka, Bangladesh' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.success('Settings saved (demo)');
    };

    return (
        <div className="p-6"><h1 className="text-2xl font-bold mb-2">Settings</h1><p className="text-gray-600 mb-6">Configure platform settings</p>
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl"><form onSubmit={handleSubmit} className="space-y-4"><Input label="Site Name" name="site_name" value={formData.site_name} onChange={handleChange} /><Input label="Site Email" name="site_email" type="email" value={formData.site_email} onChange={handleChange} /><Input label="Site Phone" name="site_phone" value={formData.site_phone} onChange={handleChange} /><Input label="Site Address" name="site_address" value={formData.site_address} onChange={handleChange} /><Button type="submit" variant="primary" loading={loading}>Save Settings</Button></form></div></div>
    );
};

export default AdminSettings;