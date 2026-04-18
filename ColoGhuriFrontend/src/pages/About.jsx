import React from 'react';
import { FaUsers, FaGlobe, FaAward, FaHeart } from 'react-icons/fa';

const About = () => {
    return (
        <div className="container-custom py-12">
            <div className="text-center mb-12"><h1 className="text-4xl font-bold text-gray-800 mb-4">About Colo Ghuri</h1><p className="text-xl text-gray-600 max-w-3xl mx-auto">Your trusted travel companion for exploring the beauty of Bangladesh</p></div>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-12"><h2 className="text-2xl font-semibold mb-4">Our Story</h2><p className="text-gray-600 leading-relaxed mb-4">Colo Ghuri was founded with a simple mission: to make travel planning easy, affordable, and accessible for everyone. We believe that exploring new places should be a joy, not a hassle.</p><p className="text-gray-600 leading-relaxed">Today, we're proud to be one of Bangladesh's leading travel platforms, connecting thousands of travellers with authentic experiences and professional guides.</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"><div className="text-center p-6"><div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"><FaUsers className="text-2xl text-primary-600" /></div><h3 className="text-xl font-semibold mb-2">10,000+</h3><p className="text-gray-500">Happy Travellers</p></div><div className="text-center p-6"><div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"><FaGlobe className="text-2xl text-primary-600" /></div><h3 className="text-xl font-semibold mb-2">50+</h3><p className="text-gray-500">Destinations</p></div><div className="text-center p-6"><div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"><FaAward className="text-2xl text-primary-600" /></div><h3 className="text-xl font-semibold mb-2">100+</h3><p className="text-gray-500">Expert Guides</p></div><div className="text-center p-6"><div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"><FaHeart className="text-2xl text-primary-600" /></div><h3 className="text-xl font-semibold mb-2">5 Star</h3><p className="text-gray-500">Customer Rating</p></div></div>
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-8 text-white text-center"><h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2><p className="mb-6">Join thousands of happy travellers who explored Bangladesh with us</p><a href="/register" className="inline-block bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">Sign Up Now</a></div>
        </div>
    );
};

export default About;