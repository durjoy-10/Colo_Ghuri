import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
            <div className="text-center"><div className="text-9xl font-bold text-primary-600 mb-4">404</div><h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1><p className="text-gray-600 mb-8">Oops! The page you're looking for doesn't exist.</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><Link to="/" className="btn-primary inline-flex items-center gap-2"><FaHome /> Go Home</Link><Link to="/destinations" className="btn-outline inline-flex items-center gap-2"><FaSearch /> Browse Destinations</Link></div></div>
        </div>
    );
};

export default NotFound;