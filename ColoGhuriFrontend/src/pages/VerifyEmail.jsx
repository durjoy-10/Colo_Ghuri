import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaEnvelope, FaSpinner } from 'react-icons/fa';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const [resendEmail, setResendEmail] = useState('');
    const [resending, setResending] = useState(false);

    useEffect(() => {
        // Check if we're on the success/error page
        const path = window.location.pathname;
        if (path.includes('/success')) {
            const params = new URLSearchParams(window.location.search);
            setStatus('success');
            setMessage(params.get('message') || 'Email verified successfully!');
            setTimeout(() => {
                navigate('/login', { state: { message: 'Email verified! You can now login.' } });
            }, 3000);
        } else if (path.includes('/error')) {
            const params = new URLSearchParams(window.location.search);
            setStatus('error');
            setMessage(params.get('message') || 'Verification failed');
        } else if (token) {
            verifyEmail();
        } else {
            setStatus('no_token');
        }
    }, [token]);

    const verifyEmail = async () => {
        try {
            // This will redirect to the success/error page
            window.location.href = `http://127.0.0.1:8000/api/users/verify-email/${token}/`;
        } catch (error) {
            setStatus('error');
            setMessage('Verification failed. Please try again.');
        }
    };

    const handleResendVerification = async (e) => {
        e.preventDefault();
        if (!resendEmail) {
            alert('Please enter your email address');
            return;
        }
        
        setResending(true);
        try {
            const response = await axios.post('/users/resend-verification/', { email: resendEmail });
            alert(response.data.message || 'Verification email sent!');
            setResendEmail('');
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to resend verification email');
        } finally {
            setResending(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-5xl text-blue-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700">Verifying Your Email...</h2>
                    <p className="text-gray-500 mt-2">Please wait while we verify your email address.</p>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Verified!</h2>
                    <p className="text-gray-600 mb-6">{message}</p>
                    <div className="animate-pulse text-sm text-gray-500 mb-4">
                        Redirecting to login page...
                    </div>
                    <Link to="/login" className="btn-primary inline-block">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    if (status === 'no_token') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 py-12 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <FaEnvelope className="text-yellow-500 text-6xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
                    <p className="text-gray-600 mb-4">
                        A verification link has been sent to your email address.
                    </p>
                    <div className="border-t pt-4 mt-4">
                        <p className="text-sm text-gray-500 mb-3">Didn't receive the email?</p>
                        <form onSubmit={handleResendVerification} className="space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={resendEmail}
                                onChange={(e) => setResendEmail(e.target.value)}
                                className="input-field"
                                required
                            />
                            <button
                                type="submit"
                                disabled={resending}
                                className="w-full btn-primary flex items-center justify-center gap-2"
                            >
                                {resending ? (
                                    <>
                                        <FaSpinner className="animate-spin" /> Sending...
                                    </>
                                ) : (
                                    <>
                                        <FaEnvelope /> Resend Verification Email
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                    <div className="mt-4">
                        <Link to="/login" className="text-blue-600 hover:underline text-sm">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="border-t pt-4 mt-4">
                    <p className="text-sm text-gray-500 mb-3">Request a new verification link</p>
                    <form onSubmit={handleResendVerification} className="space-y-3">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={resendEmail}
                            onChange={(e) => setResendEmail(e.target.value)}
                            className="input-field"
                            required
                        />
                        <button
                            type="submit"
                            disabled={resending}
                            className="w-full btn-primary flex items-center justify-center gap-2"
                        >
                            {resending ? (
                                <>
                                    <FaSpinner className="animate-spin" /> Sending...
                                </>
                            ) : (
                                <>
                                    <FaEnvelope /> Resend Verification Email
                                </>
                            )}
                        </button>
                    </form>
                </div>
                <div className="mt-4">
                    <Link to="/login" className="text-blue-600 hover:underline text-sm">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;