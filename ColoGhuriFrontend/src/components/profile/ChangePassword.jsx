import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ChangePassword = ({ isOpen, onClose }) => {
    const { post, loading } = useApi();
    const [formData, setFormData] = useState({ old_password: '', new_password: '', confirm_password: '' });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.new_password !== formData.confirm_password) { setErrors({ confirm_password: 'Passwords do not match' }); return; }
        const result = await post('/users/change-password/', { old_password: formData.old_password, new_password: formData.new_password });
        if (result) { toast.success('Password changed'); onClose(); }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Change Password" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input type="password" name="old_password" label="Current Password" value={formData.old_password} onChange={handleChange} required icon={FaLock} />
                <Input type="password" name="new_password" label="New Password" value={formData.new_password} onChange={handleChange} required icon={FaLock} error={errors.new_password} />
                <Input type="password" name="confirm_password" label="Confirm Password" value={formData.confirm_password} onChange={handleChange} required icon={FaLock} error={errors.confirm_password} />
                <div className="flex gap-3"><Button type="button" variant="secondary" onClick={onClose} fullWidth>Cancel</Button><Button type="submit" variant="primary" loading={loading} fullWidth>Change</Button></div>
            </form>
        </Modal>
    );
};

export default ChangePassword;