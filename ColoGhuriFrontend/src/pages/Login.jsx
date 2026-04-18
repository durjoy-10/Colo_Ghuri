import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const message = location.state?.message;
        if (message) toast.success(message);
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) { toast.error('Please enter username and password'); return; }
        setLoading(true);
        const result = await login(username, password);
        setLoading(false);
        if (result.success) navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-8 text-center"><h2 className="text-3xl font-bold text-white">Welcome Back</h2><p className="text-primary-100 mt-2">Sign in to your account</p></div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div><label className="block text-gray-700 font-medium mb-2">Username</label><div className="relative"><FaUser className="absolute left-3 top-3 text-gray-400" /><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input-field pl-10" placeholder="Enter your username" required /></div></div>
                    <div><label className="block text-gray-700 font-medium mb-2">Password</label><div className="relative"><FaLock className="absolute left-3 top-3 text-gray-400" /><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-10 pr-10" placeholder="Enter your password" required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">{showPassword ? <FaEyeSlash /> : <FaEye />}</button></div></div>
                    <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-lg disabled:opacity-50">{loading ? 'Logging in...' : 'Login'}</button>
                </form>
                <div className="px-6 pb-6 text-center"><p className="text-gray-600">Don't have an account? <Link to="/register" className="text-primary-600 hover:underline font-semibold">Register here</Link></p><p className="text-gray-500 text-sm mt-4"><Link to="/guide-group-register" className="text-primary-600 hover:underline">Register as Guide Group</Link></p></div>
                <div className="bg-gray-50 px-6 py-4 border-t"><p className="text-sm text-gray-600 text-center font-medium">Demo Credentials:</p><div className="text-xs text-gray-500 text-center mt-1"><p>Admin: admin / Admin@123</p><p>Traveller: sakib_traveller / traveller123</p><p>Guide: hridi / guide123</p></div></div>
            </div>
        </div>
    );
};

export default Login;