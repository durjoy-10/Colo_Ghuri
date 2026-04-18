import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaMapMarkedAlt, FaCalendarAlt, FaUser, FaCog, FaUsers, FaCheckCircle } from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    const adminLinks = [
        { to: '/admin', label: 'Dashboard', icon: FaHome },
        { to: '/admin/destinations', label: 'Destinations', icon: FaMapMarkedAlt },
        { to: '/admin/tours', label: 'Tours', icon: FaCalendarAlt },
        { to: '/admin/users', label: 'Users', icon: FaUsers },
        { to: '/admin/guide-groups', label: 'Guide Groups', icon: FaCheckCircle },
        { to: '/admin/settings', label: 'Settings', icon: FaCog },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose} />}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:block`}>
                <div className="p-4 border-b border-gray-800"><h2 className="text-xl font-bold">Admin Panel</h2></div>
                <nav className="p-4 space-y-2">
                    {adminLinks.map(link => (
                        <Link key={link.to} to={link.to} onClick={onClose} className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive(link.to) ? 'bg-primary-600' : 'hover:bg-gray-800'}`}>
                            <link.icon className="h-5 w-5" /><span>{link.label}</span>
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;