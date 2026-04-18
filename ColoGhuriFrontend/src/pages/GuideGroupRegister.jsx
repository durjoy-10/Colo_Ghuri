import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { FaPlus, FaTrash, FaUser, FaEnvelope, FaLock, FaPhone, FaIdCard, FaUsers } from 'react-icons/fa';
import toast from 'react-hot-toast';

const GuideGroupRegister = () => {
    const navigate = useNavigate();
    const { post, loading } = useApi();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        guide_groupname: '', group_email: '', group_phone: '', group_address: '', group_description: '', guide_group_number: 1,
        guides: [{ username: '', email: '', password: '', confirm_password: '', first_name: '', last_name: '', phone_number: '', national_id: '', gender: 'M', experience_years: 0, languages_spoken: 'Bengali, English', bio: '' }]
    });

    const handleGroupChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'guide_group_number') {
            const newSize = parseInt(value);
            const currentSize = formData.guides.length;
            if (newSize > currentSize) {
                const newGuides = [...formData.guides];
                for (let i = currentSize; i < newSize; i++) newGuides.push({ username: '', email: '', password: '', confirm_password: '', first_name: '', last_name: '', phone_number: '', national_id: '', gender: 'M', experience_years: 0, languages_spoken: 'Bengali, English', bio: '' });
                setFormData({ ...formData, guides: newGuides });
            } else if (newSize < currentSize) setFormData({ ...formData, guides: formData.guides.slice(0, newSize) });
        }
    };

    const handleGuideChange = (index, field, value) => {
        const updatedGuides = [...formData.guides];
        updatedGuides[index][field] = value;
        setFormData({ ...formData, guides: updatedGuides });
    };

    const validateForm = () => {
        if (!formData.guide_groupname) { toast.error('Group name required'); return false; }
        if (!formData.group_email) { toast.error('Group email required'); return false; }
        if (!formData.group_phone) { toast.error('Group phone required'); return false; }
        for (let i = 0; i < formData.guides.length; i++) {
            const g = formData.guides[i];
            if (!g.username) { toast.error(`Guide ${i + 1}: Username required`); return false; }
            if (!g.email) { toast.error(`Guide ${i + 1}: Email required`); return false; }
            if (!g.password) { toast.error(`Guide ${i + 1}: Password required`); return false; }
            if (g.password !== g.confirm_password) { toast.error(`Guide ${i + 1}: Passwords do not match`); return false; }
            if (g.password.length < 6) { toast.error(`Guide ${i + 1}: Password min 6 characters`); return false; }
            if (!g.national_id) { toast.error(`Guide ${i + 1}: National ID required`); return false; }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const submitData = {
            guide_groupname: formData.guide_groupname, group_email: formData.group_email, group_phone: formData.group_phone,
            group_address: formData.group_address, group_description: formData.group_description, guide_group_number: parseInt(formData.guide_group_number),
            guides: formData.guides.map(g => ({ username: g.username, email: g.email, password: g.password, first_name: g.first_name, last_name: g.last_name, phone_number: g.phone_number, national_id: g.national_id, gender: g.gender, experience_years: parseInt(g.experience_years), languages_spoken: g.languages_spoken, bio: g.bio, address: formData.group_address }))
        };
        const result = await post('/guides/register-group/', submitData);
        if (result) navigate('/login', { state: { message: 'Guide group registered! Admin will verify within 24-48 hours.' } });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8 px-4">
            <div className="max-w-4xl mx-auto"><div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-6"><h1 className="text-2xl font-bold text-white">Guide Group Registration</h1><p className="text-primary-100">Register your entire guide team at once</p></div>
                <div className="flex border-b"><button onClick={() => setStep(1)} className={`flex-1 py-3 text-center font-medium ${step === 1 ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}>Step 1: Group Info</button><button onClick={() => setStep(2)} className={`flex-1 py-3 text-center font-medium ${step === 2 ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}>Step 2: Guide Details ({formData.guides.length})</button></div>
                <form onSubmit={handleSubmit} className="p-6">
                    {step === 1 && (<div className="space-y-5"><div className="bg-blue-50 p-4 rounded-lg"><h3 className="font-semibold text-blue-800 flex items-center gap-2"><FaUsers /> Group Information</h3></div><div><input type="text" name="guide_groupname" value={formData.guide_groupname} onChange={handleGroupChange} className="input-field" placeholder="Group Name *" required /></div><div className="grid grid-cols-2 gap-4"><input type="email" name="group_email" value={formData.group_email} onChange={handleGroupChange} className="input-field" placeholder="Group Email *" required /><input type="tel" name="group_phone" value={formData.group_phone} onChange={handleGroupChange} className="input-field" placeholder="Group Phone *" required /></div><textarea name="group_address" value={formData.group_address} onChange={handleGroupChange} className="input-field" rows="2" placeholder="Group Address" /><textarea name="group_description" value={formData.group_description} onChange={handleGroupChange} className="input-field" rows="3" placeholder="Group Description" /><div><input type="number" name="guide_group_number" value={formData.guide_group_number} onChange={handleGroupChange} className="input-field" min="1" max="8" placeholder="Number of Guides (Max 8) *" required /></div><button type="button" onClick={() => setStep(2)} className="w-full btn-primary py-3">Next →</button></div>)}
                    {step === 2 && (<div className="space-y-6">{formData.guides.map((guide, idx) => (<div key={idx} className="border rounded-lg p-4 space-y-3"><div className="flex justify-between"><h4 className="font-semibold">Guide #{idx + 1}</h4>{formData.guides.length > 1 && <button type="button" onClick={() => setFormData({ ...formData, guides: formData.guides.filter((_, i) => i !== idx) })} className="text-red-500"><FaTrash /></button>}</div><div className="grid grid-cols-2 gap-3"><input type="text" placeholder="Username *" value={guide.username} onChange={(e) => handleGuideChange(idx, 'username', e.target.value)} className="input-field text-sm" required /><input type="email" placeholder="Email *" value={guide.email} onChange={(e) => handleGuideChange(idx, 'email', e.target.value)} className="input-field text-sm" required /></div><div className="grid grid-cols-2 gap-3"><input type="password" placeholder="Password *" value={guide.password} onChange={(e) => handleGuideChange(idx, 'password', e.target.value)} className="input-field text-sm" required /><input type="password" placeholder="Confirm *" value={guide.confirm_password} onChange={(e) => handleGuideChange(idx, 'confirm_password', e.target.value)} className="input-field text-sm" required /></div><div className="grid grid-cols-2 gap-3"><input type="text" placeholder="First Name" value={guide.first_name} onChange={(e) => handleGuideChange(idx, 'first_name', e.target.value)} className="input-field text-sm" /><input type="text" placeholder="Last Name" value={guide.last_name} onChange={(e) => handleGuideChange(idx, 'last_name', e.target.value)} className="input-field text-sm" /></div><div className="grid grid-cols-2 gap-3"><input type="tel" placeholder="Phone" value={guide.phone_number} onChange={(e) => handleGuideChange(idx, 'phone_number', e.target.value)} className="input-field text-sm" /><input type="text" placeholder="National ID *" value={guide.national_id} onChange={(e) => handleGuideChange(idx, 'national_id', e.target.value)} className="input-field text-sm" required /></div><div className="grid grid-cols-2 gap-3"><select value={guide.gender} onChange={(e) => handleGuideChange(idx, 'gender', e.target.value)} className="input-field text-sm"><option value="M">Male</option><option value="F">Female</option></select><input type="number" placeholder="Experience Years" value={guide.experience_years} onChange={(e) => handleGuideChange(idx, 'experience_years', e.target.value)} className="input-field text-sm" min="0" /></div><input type="text" placeholder="Languages (comma separated)" value={guide.languages_spoken} onChange={(e) => handleGuideChange(idx, 'languages_spoken', e.target.value)} className="input-field text-sm" /><textarea placeholder="Bio" value={guide.bio} onChange={(e) => handleGuideChange(idx, 'bio', e.target.value)} className="input-field text-sm" rows="2" /></div>))}<div className="flex gap-3"><button type="button" onClick={() => setStep(1)} className="flex-1 btn-secondary">← Back</button><button type="submit" disabled={loading} className="flex-1 btn-primary">{loading ? 'Registering...' : 'Register Guide Group'}</button></div></div>)}
                </form>
            </div></div>
        </div>
    );
};

export default GuideGroupRegister;