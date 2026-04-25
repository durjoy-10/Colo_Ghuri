import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaSpinner, FaUser, FaEnvelope, FaUsers } from 'react-icons/fa';

const SetupPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingToken, setLoadingToken] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [guideInfo, setGuideInfo] = useState(null);

    useEffect(() => {
        validateToken();
    }, [token]);

    const validateToken = async () => {
        try {
            const response = await axios.get(`/guides/setup-password/${token}/`);
            if (response.data.success) {
                setGuideInfo(response.data.guide);
                setError('');
            } else {
                setError(response.data.error || 'Invalid invitation link');
            }
        } catch (error) {
            console.error('Token validation error:', error);
            setError(error.response?.data?.error || 'Invalid or expired invitation link');
        } finally {
            setLoadingToken(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const response = await axios.post(`/guides/setup-password/${token}/`, { password });
            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login', { 
                        state: { message: response.data.message || 'Password set successfully! Please wait for admin verification.' }
                    });
                }, 3000);
            } else {
                setError(response.data.error || 'Failed to set password');
            }
        } catch (error) {
            console.error('Setup password error:', error);
            setError(error.response?.data?.error || 'Failed to set password. The link may be expired.');
        } finally {
            setLoading(false);
        }
    };

    if (loadingToken) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-5xl text-primary-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700">Validating invitation...</h2>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Set Successfully!</h2>
                    <p className="text-gray-600 mb-4">
                        Your account has been created. Please wait for admin verification.
                    </p>
                    <div className="animate-pulse text-sm text-gray-500 mb-4">
                        Redirecting to login page...
                    </div>
                    <button onClick={() => navigate('/login')} className="btn-primary inline-block">
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (error && !guideInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 py-12 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Invalid Invitation Link</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <p className="text-sm text-gray-500 mb-4">
                        Please contact your guide group administrator for a new invitation.
                    </p>
                    <button onClick={() => navigate('/')} className="btn-primary inline-block">
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-6 text-center">
                    <h2 className="text-2xl font-bold text-white">Welcome to Colo Ghuri!</h2>
                    <p className="text-primary-100">Set up your guide account password</p>
                </div>
                
                {guideInfo && (
                    <div className="bg-blue-50 p-4 m-6 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <FaUsers className="text-primary-600" />
                            <span className="font-semibold">Guide Group: {guideInfo.group_name}</span>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <FaUser className="text-primary-600" />
                            <span>Name: {guideInfo.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaEnvelope className="text-primary-600" />
                            <span>Email: {guideInfo.email}</span>
                        </div>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-gray-700 mb-1">Password *</label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pl-10 pr-10"
                                placeholder="Enter your password"
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
                        <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-1">Confirm Password *</label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-field pl-10 pr-10"
                                placeholder="Confirm your password"
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
                    </div>
                    
                    <div className="bg-yellow-50 rounded-lg p-3 text-sm text-yellow-800">
                        <p>⚠️ After setting your password, your account will be pending admin verification.</p>
                        <p className="text-xs mt-1">You will receive an email once your account is verified.</p>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3 text-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" /> Setting Password...
                            </>
                        ) : (
                            'Set Password & Activate Account'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetupPassword;