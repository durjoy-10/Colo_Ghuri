import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaSpinner } from 'react-icons/fa';

const CheckEmail = () => {
    const location = useLocation();
    const email = location.state?.email || 'your email address';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-6 text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FaEnvelope className="text-4xl text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Check Your Email</h2>
                </div>
                
                <div className="p-6 text-center">
                    <p className="text-gray-700 mb-2">
                        We've sent a verification link to
                    </p>
                    <p className="font-semibold text-primary-600 mb-4 break-all">
                        {email}
                    </p>
                    
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-800">
                            📧 Please check your inbox and click the verification link to activate your account.
                        </p>
                        <p className="text-xs text-blue-600 mt-2">
                            Didn't receive the email? Check your spam folder.
                        </p>
                    </div>
                    
                    <div className="space-y-3">
                        <Link to="/login" className="block w-full btn-primary">
                            Go to Login
                        </Link>
                        <Link to="/register" className="block w-full btn-secondary">
                            Back to Registration
                        </Link>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t">
                        <p className="text-xs text-gray-400">
                            The verification link expires in 24 hours.
                            If you still don't see the email, please contact support.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckEmail;