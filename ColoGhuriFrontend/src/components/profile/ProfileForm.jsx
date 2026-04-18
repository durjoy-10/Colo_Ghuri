import React from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { FaUser, FaEnvelope, FaPhone, FaAddressCard, FaIdCard } from 'react-icons/fa';

const ProfileForm = ({ formData, onChange, errors, onSubmit, loading }) => {
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="Username" name="username" value={formData.username} onChange={onChange} error={errors.username} required icon={FaUser} />
                <Input label="Email" name="email" type="email" value={formData.email} onChange={onChange} error={errors.email} required icon={FaEnvelope} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="First Name" name="first_name" value={formData.first_name} onChange={onChange} icon={FaUser} />
                <Input label="Last Name" name="last_name" value={formData.last_name} onChange={onChange} icon={FaUser} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="Phone" name="phone_number" value={formData.phone_number} onChange={onChange} icon={FaPhone} />
                <Input label="National ID" name="national_id" value={formData.national_id} onChange={onChange} icon={FaIdCard} />
            </div>
            <Input label="Address" name="address" value={formData.address} onChange={onChange} icon={FaAddressCard} />
            <Button type="submit" variant="primary" size="lg" loading={loading} fullWidth>Update Profile</Button>
        </form>
    );
};

export default ProfileForm;