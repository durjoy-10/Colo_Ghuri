import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaAddressCard, FaUserTag, FaIdCard, FaEye, FaEyeSlash } from 'react-icons/fa';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { validateEmail, validatePhone, validatePassword } from '../utils/validators';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', password2: '', first_name: '', last_name: '', phone_number: '', address: '', national_id: '', role: 'traveller' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' }); };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = 'Username required';
        else if (formData.username.length < 3) newErrors.username = 'Min 3 characters';
        if (!formData.email) newErrors.email = 'Email required';
        else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.password) newErrors.password = 'Password required';
        else if (!validatePassword(formData.password)) newErrors.password = 'Min 6 characters';
        if (formData.password !== formData.password2) newErrors.password2 = 'Passwords do not match';
        if (formData.role === 'guide' && !formData.national_id) newErrors.national_id = 'National ID required';
        if (formData.phone_number && !validatePhone(formData.phone_number)) newErrors.phone_number = 'Invalid phone';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        const result = await register(formData);
        setLoading(false);
        if (result.success) navigate('/login', { state: { message: formData.role === 'guide' ? 'Registration successful! Please wait for admin verification.' : 'Registration successful! Please login.' } });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-6"><h2 className="text-2xl font-bold text-white">Create Account</h2><p className="text-primary-100">Join Colo Ghuri and start your journey</p></div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="bg-gray-50 p-4 rounded-lg"><label className="block text-gray-700 font-semibold mb-3">Account Type *</label><div className="grid grid-cols-2 gap-4"><label className={`flex items-center p-3 rounded-lg border-2 cursor-pointer ${formData.role === 'traveller' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}><input type="radio" name="role" value="traveller" checked={formData.role === 'traveller'} onChange={handleChange} className="mr-2" /><div><div className="font-semibold">Traveller</div><div className="text-xs text-gray-500">Explore and book tours</div></div></label><label className={`flex items-center p-3 rounded-lg border-2 cursor-pointer ${formData.role === 'guide' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}><input type="radio" name="role" value="guide" checked={formData.role === 'guide'} onChange={handleChange} className="mr-2" /><div><div className="font-semibold">Tour Guide</div><div className="text-xs text-gray-500">Create and manage tours</div></div></label></div>{formData.role === 'guide' && <div className="mt-3 flex items-start gap-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded"><HiOutlineInformationCircle className="text-lg" /><span>Guide accounts require admin verification before you can create tours.</span></div>}</div>
                    <div className="grid grid-cols-2 gap-4"><input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="input-field" placeholder="First Name" /><input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="input-field" placeholder="Last Name" /></div>
                    <div><div className="relative"><FaUser className="absolute left-3 top-3 text-gray-400" /><input type="text" name="username" value={formData.username} onChange={handleChange} className={`input-field pl-10 ${errors.username ? 'border-red-500' : ''}`} placeholder="Username" required /></div>{errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}</div>
                    <div><div className="relative"><FaEnvelope className="absolute left-3 top-3 text-gray-400" /><input type="email" name="email" value={formData.email} onChange={handleChange} className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`} placeholder="Email" required /></div>{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}</div>
                    <div className="grid grid-cols-2 gap-4"><div className="relative"><FaPhone className="absolute left-3 top-3 text-gray-400" /><input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} className="input-field pl-10" placeholder="Phone" /></div><div className="relative"><FaIdCard className="absolute left-3 top-3 text-gray-400" /><input type="text" name="national_id" value={formData.national_id} onChange={handleChange} className={`input-field pl-10 ${errors.national_id ? 'border-red-500' : ''}`} placeholder={formData.role === 'guide' ? 'National ID *' : 'National ID'} /></div>{errors.national_id && <p className="text-red-500 text-xs mt-1 col-span-2">{errors.national_id}</p>}</div>
                    <div><div className="relative"><FaAddressCard className="absolute left-3 top-3 text-gray-400" /><textarea name="address" value={formData.address} onChange={handleChange} className="input-field pl-10" rows="2" placeholder="Address" /></div></div>
                    <div className="grid grid-cols-2 gap-4"><div className="relative"><FaLock className="absolute left-3 top-3 text-gray-400" /><input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`} placeholder="Password" required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">{showPassword ? <FaEyeSlash /> : <FaEye />}</button></div>{errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}</div><div className="relative"><FaLock className="absolute left-3 top-3 text-gray-400" /><input type={showConfirmPassword ? 'text' : 'password'} name="password2" value={formData.password2} onChange={handleChange} className={`input-field pl-10 pr-10 ${errors.password2 ? 'border-red-500' : ''}`} placeholder="Confirm Password" required /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-400">{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</button>{errors.password2 && <p className="text-red-500 text-xs mt-1">{errors.password2}</p>}</div>
                    <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-lg disabled:opacity-50">{loading ? 'Creating Account...' : 'Create Account'}</button>
                    <p className="text-center text-gray-600">Already have an account? <Link to="/login" className="text-primary-600 hover:underline font-semibold">Sign In</Link></p>
                </form>
            </div>
        </div>
    );
};

export default Register;