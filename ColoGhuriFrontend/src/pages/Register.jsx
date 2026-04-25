import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaAddressCard, FaTransgender, FaBirthdayCake, FaGlobe, FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';
import { HiOutlineInformationCircle } from 'react-icons/hi';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        address: '',
        gender: '',
        date_of_birth: '',
        preferred_language: 'Bengali, English'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
        if (serverError) setServerError('');
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.username) newErrors.username = 'Username required';
        else if (formData.username.length < 3) newErrors.username = 'Min 3 characters';
        
        if (!formData.email) newErrors.email = 'Email required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
        
        if (!formData.password) newErrors.password = 'Password required';
        else if (formData.password.length < 6) newErrors.password = 'Min 6 characters';
        
        if (formData.password !== formData.password2) newErrors.password2 = 'Passwords do not match';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        setServerError('');
        
        try {
            const response = await axios.post('/users/register/', formData);
            console.log('Registration response:', response.data);
            
            if (response.data.success !== false) {
                // Success - redirect to check email page
                navigate('/check-email', { 
                    state: { 
                        email: formData.email,
                        message: 'Registration successful! Please check your email to verify your account.'
                    }
                });
            } else {
                const errorMsg = response.data.message || response.data.error || 'Registration failed';
                setServerError(errorMsg);
            }
        } catch (error) {
            console.error('Registration error:', error);
            let errorMsg = 'Registration failed';
            if (error.response?.data) {
                if (typeof error.response.data === 'object') {
                    if (error.response.data.username) errorMsg = error.response.data.username[0];
                    else if (error.response.data.email) errorMsg = error.response.data.email[0];
                    else if (error.response.data.password) errorMsg = error.response.data.password[0];
                    else if (error.response.data.error) errorMsg = error.response.data.error;
                    else if (error.response.data.message) errorMsg = error.response.data.message;
                    else errorMsg = JSON.stringify(error.response.data);
                } else if (typeof error.response.data === 'string') {
                    errorMsg = error.response.data;
                }
            } else if (error.message) {
                errorMsg = error.message;
            }
            setServerError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-6">
                    <h2 className="text-2xl font-bold text-white">Create Traveller Account</h2>
                    <p className="text-primary-100">Join Colo Ghuri and start your journey</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Server Error Display */}
                    {serverError && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                            <p className="text-red-700 text-sm">{serverError}</p>
                        </div>
                    )}

                    {/* Notice for Guide Registration */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                        <div className="flex items-start gap-2">
                            <HiOutlineInformationCircle className="text-blue-600 text-lg flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-blue-800 font-medium">For Tour Guide Registration:</p>
                                <p className="text-xs text-blue-700 mt-1">
                                    Tour guides must register as a group. Please visit the 
                                    <Link to="/guide-group-register" className="font-semibold underline ml-1">Guide Group Registration</Link> page.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-1">First Name</label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="First name"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Last name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Username *</label>
                        <div className="relative">
                            <FaUser className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`input-field pl-10 ${errors.username ? 'border-red-500' : ''}`}
                                placeholder="Choose a username"
                                required
                            />
                        </div>
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Email Address *</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <FaPhone className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="+880XXXXXXXXX"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Gender</label>
                            <div className="relative">
                                <FaTransgender className="absolute left-3 top-3 text-gray-400" />
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-1">Date of Birth</label>
                            <div className="relative">
                                <FaBirthdayCake className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={formData.date_of_birth}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Preferred Language</label>
                            <div className="relative">
                                <FaGlobe className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    name="preferred_language"
                                    value={formData.preferred_language}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="e.g., Bengali, English"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Address</label>
                        <div className="relative">
                            <FaAddressCard className="absolute left-3 top-4 text-gray-400" />
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="input-field pl-10"
                                rows="2"
                                placeholder="Your full address"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-1">Password *</label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Confirm Password *</label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="password2"
                                    value={formData.password2}
                                    onChange={handleChange}
                                    className={`input-field pl-10 pr-10 ${errors.password2 ? 'border-red-500' : ''}`}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3 text-gray-400"
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password2 && <p className="text-red-500 text-xs mt-1">{errors.password2}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3 text-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                Creating Account...
                            </>
                        ) : (
                            <>
                                <FaUserPlus /> Create Traveller Account
                            </>
                        )}
                    </button>

                    <div className="text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 hover:underline font-semibold">
                                Sign In
                            </Link>
                        </p>
                        <p className="text-gray-500 text-sm mt-3">
                            <Link to="/guide-group-register" className="text-primary-600 hover:underline">
                                Register as Guide Group
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;