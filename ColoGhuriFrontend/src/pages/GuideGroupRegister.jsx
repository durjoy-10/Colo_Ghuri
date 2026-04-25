import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { FaPlus, FaTrash, FaUser, FaEnvelope, FaPhone, FaIdCard, FaUsers, FaGlobe, FaTransgender, FaBirthdayCake, FaAddressCard, FaInfoCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const GuideGroupRegister = () => {
    const navigate = useNavigate();
    const { post, loading } = useApi();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        guide_groupname: '',
        group_email: '',
        group_phone: '',
        group_address: '',
        group_description: '',
        guide_group_number: 1,
        guides: [{
            username: '',
            email: '',
            first_name: '',
            last_name: '',
            phone_number: '',
            national_id: '',
            gender: 'male',
            date_of_birth: '',
            experience_years: 0,
            languages_spoken: 'Bengali, English',
            bio: ''
        }]
    });

    const handleGroupChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        if (name === 'guide_group_number') {
            const newSize = parseInt(value);
            const currentSize = formData.guides.length;
            
            if (newSize > currentSize) {
                const newGuides = [...formData.guides];
                for (let i = currentSize; i < newSize; i++) {
                    newGuides.push({
                        username: '', email: '', first_name: '', last_name: '', 
                        phone_number: '', national_id: '', gender: 'male', date_of_birth: '', 
                        experience_years: 0, languages_spoken: 'Bengali, English', bio: ''
                    });
                }
                setFormData({ ...formData, guides: newGuides, [name]: value });
            } else if (newSize < currentSize) {
                setFormData({ ...formData, guides: formData.guides.slice(0, newSize), [name]: value });
            }
        }
    };

    const handleGuideChange = (index, field, value) => {
        const updatedGuides = [...formData.guides];
        updatedGuides[index][field] = value;
        setFormData({ ...formData, guides: updatedGuides });
    };

    const addGuideMember = () => {
        if (formData.guides.length >= 8) {
            toast.error('Maximum 8 guides allowed per group');
            return;
        }
        setFormData({
            ...formData,
            guides: [...formData.guides, {
                username: '', email: '', first_name: '', last_name: '', phone_number: '', 
                national_id: '', gender: 'male', date_of_birth: '', experience_years: 0,
                languages_spoken: 'Bengali, English', bio: ''
            }],
            guide_group_number: formData.guides.length + 1
        });
    };

    const removeGuideMember = (index) => {
        if (formData.guides.length <= 1) {
            toast.error('At least one guide is required');
            return;
        }
        const updatedGuides = formData.guides.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            guides: updatedGuides,
            guide_group_number: updatedGuides.length
        });
    };

    const validateForm = () => {
        if (!formData.guide_groupname) {
            toast.error('Please enter guide group name');
            return false;
        }
        if (!formData.group_email) {
            toast.error('Please enter group email');
            return false;
        }
        if (!formData.group_phone) {
            toast.error('Please enter group phone number');
            return false;
        }
        
        // Check for duplicate usernames and emails within the group
        const usernames = formData.guides.map(g => g.username);
        const emails = formData.guides.map(g => g.email);
        
        if (new Set(usernames).size !== usernames.length) {
            toast.error('Duplicate usernames found in guide list');
            return false;
        }
        if (new Set(emails).size !== emails.length) {
            toast.error('Duplicate emails found in guide list');
            return false;
        }
        
        for (let i = 0; i < formData.guides.length; i++) {
            const guide = formData.guides[i];
            if (!guide.username) {
                toast.error(`Guide ${i + 1}: Username is required`);
                return false;
            }
            if (!guide.email) {
                toast.error(`Guide ${i + 1}: Email is required`);
                return false;
            }
            if (!guide.national_id) {
                toast.error(`Guide ${i + 1}: National ID is required`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        const submitData = {
            guide_groupname: formData.guide_groupname,
            group_email: formData.group_email,
            group_phone: formData.group_phone,
            group_address: formData.group_address,
            group_description: formData.group_description,
            guide_group_number: parseInt(formData.guide_group_number),
            guides: formData.guides.map(guide => ({
                username: guide.username,
                email: guide.email,
                first_name: guide.first_name,
                last_name: guide.last_name,
                phone_number: guide.phone_number,
                national_id: guide.national_id,
                gender: guide.gender,
                date_of_birth: guide.date_of_birth,
                experience_years: parseInt(guide.experience_years),
                languages_spoken: guide.languages_spoken,
                bio: guide.bio
            }))
        };
        
        const result = await post('/guides/register-group/', submitData);
        if (result) {
            navigate('/login', { 
                state: { message: `Guide group registered! Invitation emails have been sent to all guides. Admin will verify the group within 24-48 hours.` }
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-6 text-white">
                        <h1 className="text-2xl font-bold">Guide Group Registration</h1>
                        <p className="text-primary-100">Register your entire guide team at once (Max 8 guides)</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex border-b">
                        <button
                            onClick={() => setStep(1)}
                            className={`flex-1 py-3 text-center font-medium transition ${step === 1 ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
                        >
                            Step 1: Group Info
                        </button>
                        <button
                            onClick={() => setStep(2)}
                            className={`flex-1 py-3 text-center font-medium transition ${step === 2 ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
                        >
                            Step 2: Guide Details ({formData.guides.length})
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        {step === 1 && (
                            <div className="space-y-5">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                                        <FaUsers /> Group Information
                                    </h3>
                                    <p className="text-sm text-blue-600 mt-1">Enter your tour guide group details</p>
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1 font-medium">Group Name *</label>
                                    <input
                                        type="text"
                                        name="guide_groupname"
                                        value={formData.guide_groupname}
                                        onChange={handleGroupChange}
                                        className="input-field"
                                        placeholder="e.g., Cox's Bazar Sea Explorers"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-1 font-medium">Group Email *</label>
                                        <input
                                            type="email"
                                            name="group_email"
                                            value={formData.group_email}
                                            onChange={handleGroupChange}
                                            className="input-field"
                                            placeholder="group@example.com"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-1 font-medium">Group Phone *</label>
                                        <input
                                            type="tel"
                                            name="group_phone"
                                            value={formData.group_phone}
                                            onChange={handleGroupChange}
                                            className="input-field"
                                            placeholder="+880XXXXXXXXX"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1 font-medium">Group Address</label>
                                    <textarea
                                        name="group_address"
                                        value={formData.group_address}
                                        onChange={handleGroupChange}
                                        className="input-field"
                                        rows="2"
                                        placeholder="Office address"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1 font-medium">Group Description</label>
                                    <textarea
                                        name="group_description"
                                        value={formData.group_description}
                                        onChange={handleGroupChange}
                                        className="input-field"
                                        rows="3"
                                        placeholder="Tell us about your guide group"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1 font-medium">Number of Guides (Max 8) *</label>
                                    <input
                                        type="number"
                                        name="guide_group_number"
                                        value={formData.guide_group_number}
                                        onChange={handleGroupChange}
                                        className="input-field"
                                        min="1"
                                        max="8"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">You will need to provide details for {formData.guide_group_number} guide(s)</p>
                                </div>

                                <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800">
                                    <FaInfoCircle className="inline mr-2" />
                                    Each guide will receive an invitation email to set their password after admin verification.
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="w-full btn-primary py-3"
                                >
                                    Next: Guide Details →
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                {/* Add Guide Member Button */}
                                {formData.guides.length < 8 && (
                                    <button
                                        type="button"
                                        onClick={addGuideMember}
                                        className="w-full border-2 border-dashed border-primary-300 rounded-lg py-3 text-primary-600 hover:bg-primary-50 transition flex items-center justify-center gap-2"
                                    >
                                        <FaPlus /> Add Another Guide Member
                                    </button>
                                )}

                                {formData.guides.map((guide, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-semibold text-lg">Guide #{index + 1}</h4>
                                            {formData.guides.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeGuideMember(index)}
                                                    className="text-red-500 hover:text-red-700 transition"
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="relative">
                                                <FaUser className="absolute left-3 top-3 text-gray-400 text-sm" />
                                                <input
                                                    type="text"
                                                    placeholder="Username *"
                                                    value={guide.username}
                                                    onChange={(e) => handleGuideChange(index, 'username', e.target.value)}
                                                    className="input-field pl-9 text-sm"
                                                    required
                                                />
                                            </div>
                                            <div className="relative">
                                                <FaEnvelope className="absolute left-3 top-3 text-gray-400 text-sm" />
                                                <input
                                                    type="email"
                                                    placeholder="Email *"
                                                    value={guide.email}
                                                    onChange={(e) => handleGuideChange(index, 'email', e.target.value)}
                                                    className="input-field pl-9 text-sm"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                placeholder="First Name"
                                                value={guide.first_name}
                                                onChange={(e) => handleGuideChange(index, 'first_name', e.target.value)}
                                                className="input-field text-sm"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Last Name"
                                                value={guide.last_name}
                                                onChange={(e) => handleGuideChange(index, 'last_name', e.target.value)}
                                                className="input-field text-sm"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="relative">
                                                <FaPhone className="absolute left-3 top-3 text-gray-400 text-sm" />
                                                <input
                                                    type="tel"
                                                    placeholder="Phone Number"
                                                    value={guide.phone_number}
                                                    onChange={(e) => handleGuideChange(index, 'phone_number', e.target.value)}
                                                    className="input-field pl-9 text-sm"
                                                />
                                            </div>
                                            <div className="relative">
                                                <FaIdCard className="absolute left-3 top-3 text-gray-400 text-sm" />
                                                <input
                                                    type="text"
                                                    placeholder="National ID *"
                                                    value={guide.national_id}
                                                    onChange={(e) => handleGuideChange(index, 'national_id', e.target.value)}
                                                    className="input-field pl-9 text-sm"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="relative">
                                                <FaTransgender className="absolute left-3 top-3 text-gray-400 text-sm" />
                                                <select
                                                    value={guide.gender}
                                                    onChange={(e) => handleGuideChange(index, 'gender', e.target.value)}
                                                    className="input-field pl-9 text-sm"
                                                >
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div className="relative">
                                                <FaBirthdayCake className="absolute left-3 top-3 text-gray-400 text-sm" />
                                                <input
                                                    type="date"
                                                    placeholder="Date of Birth"
                                                    value={guide.date_of_birth}
                                                    onChange={(e) => handleGuideChange(index, 'date_of_birth', e.target.value)}
                                                    className="input-field pl-9 text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="number"
                                                placeholder="Experience Years"
                                                value={guide.experience_years}
                                                onChange={(e) => handleGuideChange(index, 'experience_years', e.target.value)}
                                                className="input-field text-sm"
                                                min="0"
                                            />
                                            <div className="relative">
                                                <FaGlobe className="absolute left-3 top-3 text-gray-400 text-sm" />
                                                <input
                                                    type="text"
                                                    placeholder="Languages (comma separated)"
                                                    value={guide.languages_spoken}
                                                    onChange={(e) => handleGuideChange(index, 'languages_spoken', e.target.value)}
                                                    className="input-field pl-9 text-sm"
                                                />
                                            </div>
                                        </div>

                                        <textarea
                                            placeholder="Bio"
                                            value={guide.bio}
                                            onChange={(e) => handleGuideChange(index, 'bio', e.target.value)}
                                            className="input-field text-sm"
                                            rows="2"
                                        />
                                    </div>
                                ))}

                                <div className="bg-green-50 p-3 rounded-lg text-sm text-green-800">
                                    <FaInfoCircle className="inline mr-2" />
                                    After registration, all guides will receive invitation emails to set their passwords once admin approves the group.
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 btn-secondary"
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 btn-primary"
                                    >
                                        {loading ? 'Registering...' : `Register Guide Group (${formData.guides.length} Guides)`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>

                    <div className="px-6 pb-6 text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account? <Link to="/login" className="text-primary-600 hover:underline">Login here</Link>
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            Individual traveller? <Link to="/register" className="text-primary-600 hover:underline">Register as Traveller</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuideGroupRegister;