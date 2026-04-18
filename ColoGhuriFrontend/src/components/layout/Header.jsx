import React from 'react';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onMenuClick }) => {
    const { user } = useAuth();

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="px-4 py-3 flex justify-between items-center">
                <button onClick={onMenuClick} className="p-2 rounded-lg hover:bg-gray-100 md:hidden"><FaBars className="h-5 w-5" /></button>
                <div className="flex items-center gap-4 ml-auto">
                    <button className="p-2 rounded-lg hover:bg-gray-100 relative"><FaBell className="h-5 w-5" /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span></button>
                    <Link to="/profile" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                        {user?.profile_picture ? <img src={user.profile_picture} className="w-8 h-8 rounded-full object-cover" /> : <FaUserCircle className="h-8 w-8 text-gray-400" />}
                        <span className="hidden md:inline">{user?.username}</span>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;