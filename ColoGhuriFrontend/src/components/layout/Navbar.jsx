import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaHome, FaMapMarkedAlt, FaCalendarAlt, FaUser, FaSignOutAlt, 
  FaBars, FaTimes, FaBriefcase, FaShieldAlt, FaPlane, FaInfoCircle, 
  FaEnvelope, FaChevronDown, FaUserCircle, FaCog, FaTicketAlt,
  FaCompass, FaPhone, FaChartLine, FaTachometerAlt
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAdmin, isGuide, isGuideVerified, isTraveller } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // Main navigation links (visible to everyone)
  const mainNavLinks = [
    { to: '/', label: 'Home', icon: FaHome },
    { to: '/destinations', label: 'Destinations', icon: FaCompass },
    { to: '/tours', label: 'Tours', icon: FaCalendarAlt },
    { to: '/about', label: 'About', icon: FaInfoCircle },
    { to: '/contact', label: 'Contact', icon: FaPhone },
  ];

  // Traveller specific links
  const travellerLinks = [
    { to: '/my-bookings', label: 'My Bookings', icon: FaTicketAlt },
    { to: '/my-trips', label: 'My Trips', icon: FaPlane },
  ];

  // Guide specific links (only for verified guides)
  const guideLinks = [
    { to: '/guide/dashboard', label: 'Dashboard', icon: FaChartLine },
    { to: '/guide/tours', label: 'Manage Tours', icon: FaShieldAlt },
  ];

  // Admin specific links
  const adminLinks = [
    { to: '/admin', label: 'Admin Panel', icon: FaCog },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-gradient-to-r from-primary-600 to-secondary-600'}`}>
        <div className="container-custom">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🏖️</span>
              </div>
              <div className="hidden sm:block">
                <span className={`text-xl font-bold ${scrolled ? 'text-primary-600' : 'text-white'} tracking-tight`}>Colo Ghuri</span>
                <span className={`text-xs ${scrolled ? 'text-gray-500' : 'text-white/70'} block -mt-1`}>Travel Support</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Main Links */}
              {mainNavLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                    isActive(link.to) 
                      ? scrolled ? 'bg-primary-100 text-primary-600' : 'bg-white/20 text-white'
                      : scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}

              {/* Traveller Links - Only show when logged in as traveller */}
              {isTraveller && travellerLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                    isActive(link.to) 
                      ? scrolled ? 'bg-primary-100 text-primary-600' : 'bg-white/20 text-white'
                      : scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}

              {/* Guide Links - Only show for verified guides */}
              {isGuide && isGuideVerified && guideLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                    isActive(link.to) 
                      ? scrolled ? 'bg-primary-100 text-primary-600' : 'bg-white/20 text-white'
                      : scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}

              {/* Admin Links - Only show for admin */}
              {isAdmin && adminLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                    isActive(link.to) 
                      ? scrolled ? 'bg-primary-100 text-primary-600' : 'bg-white/20 text-white'
                      : scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="relative">
                      {user.profile_picture ? (
                        <img src={user.profile_picture} alt={user.username} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md" />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                          <FaUser className="text-white text-sm" />
                        </div>
                      )}
                      {isGuide && !isGuideVerified && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></span>
                      )}
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-semibold ${scrolled ? 'text-gray-800' : 'text-white'}`}>{user.username}</p>
                      <p className={`text-xs ${scrolled ? 'text-gray-500' : 'text-white/70'} capitalize`}>{user.role}</p>
                    </div>
                    <FaChevronDown className={`text-xs transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''} ${scrolled ? 'text-gray-500' : 'text-white/70'}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in">
                      <div className="p-4 border-b bg-gradient-to-r from-primary-50 to-secondary-50">
                        <div className="flex items-center gap-3">
                          {user.profile_picture ? (
                            <img src={user.profile_picture} alt={user.username} className="w-12 h-12 rounded-full object-cover border-2 border-primary-500" />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                              <FaUser className="text-white text-xl" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-gray-800">{user.username}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 transition-all duration-300" onClick={() => setIsProfileOpen(false)}>
                          <FaUserCircle className="h-5 w-5 text-primary-600" />
                          <div>
                            <p className="font-medium text-gray-800">My Profile</p>
                            <p className="text-xs text-gray-500">View and edit profile</p>
                          </div>
                        </Link>
                        
                        {isTraveller && (
                          <>
                            <Link to="/my-bookings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 transition-all duration-300" onClick={() => setIsProfileOpen(false)}>
                              <FaTicketAlt className="h-5 w-5 text-primary-600" />
                              <div>
                                <p className="font-medium text-gray-800">My Bookings</p>
                                <p className="text-xs text-gray-500">View your bookings</p>
                              </div>
                            </Link>
                            <Link to="/my-trips" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 transition-all duration-300" onClick={() => setIsProfileOpen(false)}>
                              <FaPlane className="h-5 w-5 text-primary-600" />
                              <div>
                                <p className="font-medium text-gray-800">My Trips</p>
                                <p className="text-xs text-gray-500">Plan your trips</p>
                              </div>
                            </Link>
                          </>
                        )}
                        
                        {isGuide && isGuideVerified && (
                          <>
                            <Link to="/guide/dashboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 transition-all duration-300" onClick={() => setIsProfileOpen(false)}>
                              <FaChartLine className="h-5 w-5 text-primary-600" />
                              <div>
                                <p className="font-medium text-gray-800">Dashboard</p>
                                <p className="text-xs text-gray-500">View group performance</p>
                              </div>
                            </Link>
                            <Link to="/guide/tours" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 transition-all duration-300" onClick={() => setIsProfileOpen(false)}>
                              <FaShieldAlt className="h-5 w-5 text-primary-600" />
                              <div>
                                <p className="font-medium text-gray-800">Manage Tours</p>
                                <p className="text-xs text-gray-500">Create and manage tours</p>
                              </div>
                            </Link>
                          </>
                        )}
                        
                        {isAdmin && (
                          <Link to="/admin" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 transition-all duration-300" onClick={() => setIsProfileOpen(false)}>
                            <FaCog className="h-5 w-5 text-primary-600" />
                            <div>
                              <p className="font-medium text-gray-800">Admin Panel</p>
                              <p className="text-xs text-gray-500">Manage platform</p>
                            </div>
                          </Link>
                        )}
                        
                        <div className="border-t my-2"></div>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-all duration-300 text-red-600">
                          <FaSignOutAlt className="h-5 w-5" />
                          <div>
                            <p className="font-medium">Logout</p>
                            <p className="text-xs text-red-400">Sign out of your account</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" className="px-4 py-2 bg-white text-primary-600 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                    Login
                  </Link>
                  <Link to="/register" className="px-4 py-2 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 hover:scale-105">
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all duration-300"
            >
              {isOpen ? <FaTimes className="text-white text-xl" /> : <FaBars className="text-white text-xl" />}
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[600px] pb-4' : 'max-h-0'}`}>
            <div className="space-y-1">
              {/* Main Links */}
              {mainNavLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/90 hover:bg-white/10 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon className="h-5 w-5" /> <span>{link.label}</span>
                </Link>
              ))}
              
              {/* Traveller Links */}
              {isTraveller && travellerLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/90 hover:bg-white/10 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon className="h-5 w-5" /> <span>{link.label}</span>
                </Link>
              ))}
              
              {/* Guide Links */}
              {isGuide && isGuideVerified && guideLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/90 hover:bg-white/10 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon className="h-5 w-5" /> <span>{link.label}</span>
                </Link>
              ))}
              
              {/* Admin Links */}
              {isAdmin && adminLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/90 hover:bg-white/10 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon className="h-5 w-5" /> <span>{link.label}</span>
                </Link>
              ))}

              {user ? (
                <>
                  <div className="border-t border-white/20 my-2 pt-2">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/90 hover:bg-white/10 transition" onClick={() => setIsOpen(false)}>
                      <FaUserCircle className="h-5 w-5" /> <span>Profile</span>
                    </Link>
                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-200 hover:bg-red-500/20 transition">
                      <FaSignOutAlt className="h-5 w-5" /> <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-white/20 pt-4 mt-2 space-y-2">
                  <Link to="/login" className="block px-4 py-3 bg-white text-primary-600 rounded-lg font-semibold text-center" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="block px-4 py-3 border-2 border-white text-white rounded-lg font-semibold text-center" onClick={() => setIsOpen(false)}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;