import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => { toast.success('Message sent! We\'ll get back to you soon.'); setLoading(false); setFormData({ name: '', email: '', subject: '', message: '' }); }, 1000);
    };

    return (
        <div className="container-custom py-12"><div className="text-center mb-12"><h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1><p className="text-xl text-gray-600">We'd love to hear from you</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-1 space-y-6"><div className="bg-white rounded-xl shadow p-6 flex items-center gap-4"><div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center"><FaMapMarkerAlt className="text-primary-600 text-xl" /></div><div><h3 className="font-semibold">Address</h3><p className="text-gray-500 text-sm">Dhaka, Bangladesh</p></div></div><div className="bg-white rounded-xl shadow p-6 flex items-center gap-4"><div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center"><FaPhone className="text-primary-600 text-xl" /></div><div><h3 className="font-semibold">Phone</h3><p className="text-gray-500 text-sm">+880 1234 567890</p></div></div><div className="bg-white rounded-xl shadow p-6 flex items-center gap-4"><div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center"><FaEnvelope className="text-primary-600 text-xl" /></div><div><h3 className="font-semibold">Email</h3><p className="text-gray-500 text-sm">info@cologhuri.com</p></div></div><div className="bg-white rounded-xl shadow p-6 flex items-center gap-4"><div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center"><FaClock className="text-primary-600 text-xl" /></div><div><h3 className="font-semibold">Business Hours</h3><p className="text-gray-500 text-sm">Mon-Fri: 9AM - 6PM<br />Sat: 10AM - 4PM</p></div></div></div>
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6"><h2 className="text-2xl font-bold mb-6">Send us a Message</h2><form onSubmit={handleSubmit} className="space-y-4"><input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="Your Name" required /><input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="Your Email" required /><input type="text" name="subject" value={formData.subject} onChange={handleChange} className="input-field" placeholder="Subject" required /><textarea name="message" value={formData.message} onChange={handleChange} className="input-field" rows="5" placeholder="Your Message" required /><button type="submit" disabled={loading} className="btn-primary w-full py-3">{loading ? 'Sending...' : 'Send Message'}</button></form></div></div></div>
    );
};

export default Contact;