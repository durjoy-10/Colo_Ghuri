import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt, FaYoutube, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 text-white mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏖️</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Colo Ghuri</h3>
                <p className="text-gray-400 text-sm">Travel Support Platform</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted travel companion for exploring the beauty of Bangladesh. 
              Book tours, plan trips, and create unforgettable memories.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-dark-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-all duration-300 hover:scale-110">
                <FaFacebookF className="text-sm" />
              </a>
              <a href="#" className="w-10 h-10 bg-dark-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-all duration-300 hover:scale-110">
                <FaTwitter className="text-sm" />
              </a>
              <a href="#" className="w-10 h-10 bg-dark-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-all duration-300 hover:scale-110">
                <FaInstagram className="text-sm" />
              </a>
              <a href="#" className="w-10 h-10 bg-dark-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-all duration-300 hover:scale-110">
                <FaYoutube className="text-sm" />
              </a>
              <a href="#" className="w-10 h-10 bg-dark-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-all duration-300 hover:scale-110">
                <FaLinkedinIn className="text-sm" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-primary-500 rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/destinations" className="text-gray-400 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-gray-400 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Tours
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 relative inline-block">
              Support
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-primary-500 rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-gray-400 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 relative inline-block">
              Contact Info
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-primary-500 rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400">
                <FaMapMarkerAlt className="text-primary-500 mt-1" />
                <span className="text-sm">Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FaPhone className="text-primary-500" />
                <span className="text-sm">+880 1234 567890</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FaEnvelope className="text-primary-500" />
                <span className="text-sm">info@cologhuri.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-800 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Colo Ghuri. All rights reserved. | Made with <span className="text-red-500">❤️</span> for travelers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;