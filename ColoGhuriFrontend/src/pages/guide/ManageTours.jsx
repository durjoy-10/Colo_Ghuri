import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import DestinationForm from '../../components/tours/DestinationForm';
import { 
    FaPlus, FaEdit, FaTrash, FaImage, FaUpload, FaTimes, FaStar, FaLock, 
    FaMapMarkerAlt, FaInfoCircle, FaMoneyBillWave, FaUsers, FaCalendarAlt, 
    FaUtensils, FaChartLine
} from 'react-icons/fa';
import { TOUR_STATUS } from '../../utils/constants';
import toast from 'react-hot-toast';
import axios from '../../api/axios';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ManageTours = () => {
    const { get, put, del, loading } = useApi();
    const { user, isGuideVerified } = useAuth();
    const [tours, setTours] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showItineraryModal, setShowItineraryModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [selectedTour, setSelectedTour] = useState(null);
    const [selectedTourForItinerary, setSelectedTourForItinerary] = useState(null);
    const [selectedTourForInfo, setSelectedTourForInfo] = useState(null);
    const [editingTour, setEditingTour] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [tourImages, setTourImages] = useState([]);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [tempStatus, setTempStatus] = useState('');
    const [expenses, setExpenses] = useState('');
    const [formData, setFormData] = useState({
        tour_name: '',
        description: '',
        total_seats: '',
        price_per_person: '',
        discount_percentage: '0',
        status: 'upcoming',
        cover_image: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isGuideVerified) {
            fetchTours();
        }
    }, [isGuideVerified]);

    const fetchTours = async () => {
        try {
            const data = await get('/tours/', {}, false);
            const toursData = data.results || data;
            setTours(toursData);
        } catch (error) {
            console.error('Error fetching tours:', error);
            toast.error('Failed to load tours');
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        return `http://127.0.0.1:8000${imagePath}`;
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            setFormData({ ...formData, [name]: file });
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setPreviewUrl(reader.result);
                reader.readAsDataURL(file);
            }
        } else if (name === 'status' && value === 'completed') {
            setTempStatus(value);
            setShowExpenseModal(true);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleStatusChangeWithExpenses = async () => {
        if (!expenses || parseFloat(expenses) < 0) {
            toast.error('Please enter valid expenses amount');
            return;
        }

        try {
            const updateData = {
                tour_name: formData.tour_name,
                description: formData.description,
                total_seats: parseInt(formData.total_seats),
                price_per_person: parseFloat(formData.price_per_person),
                discount_percentage: parseFloat(formData.discount_percentage),
                status: 'completed'
            };
            
            const token = localStorage.getItem('accessToken');
            
            const response = await axios.put(`/tours/${editingTour.tour_id}/update/`, updateData, {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.data) {
                await axios.post(`/tours/${editingTour.tour_id}/complete/`, {
                    total_expenses: parseFloat(expenses)
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                toast.success('Tour completed successfully!');
                setShowExpenseModal(false);
                setExpenses('');
                setTempStatus('');
                setShowModal(false);
                setEditingTour(null);
                fetchTours();
            }
        } catch (error) {
            console.error('Complete tour error:', error);
            toast.error(error.response?.data?.error || 'Failed to complete tour');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const tourData = {
                tour_name: formData.tour_name.trim(),
                description: formData.description.trim(),
                total_seats: parseInt(formData.total_seats),
                price_per_person: parseFloat(formData.price_per_person).toFixed(2),
                discount_percentage: parseFloat(formData.discount_percentage || 0).toFixed(2),
                status: formData.status
            };
            
            let result;
            if (editingTour) {
                result = await put(`/tours/${editingTour.tour_id}/update/`, tourData);
                if (result) {
                    toast.success('Tour updated successfully');
                    fetchTours();
                }
            } else {
                const token = localStorage.getItem('accessToken');
                const response = await axios.post('/tours/create/', tourData, {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                result = response.data;
                
                if (result && result.tour_id) {
                    toast.success('Tour created successfully');
                    
                    if (formData.cover_image) {
                        const imageFormData = new FormData();
                        imageFormData.append('tour', result.tour_id);
                        imageFormData.append('image', formData.cover_image);
                        imageFormData.append('is_primary', 'true');
                        
                        await axios.post('/tours/upload-image/', imageFormData, {
                            headers: { 
                                'Content-Type': 'multipart/form-data',
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        toast.success('Cover image uploaded');
                    }
                    fetchTours();
                }
            }
            
            setShowModal(false);
            setEditingTour(null);
            setPreviewUrl(null);
            setFormData({
                tour_name: '',
                description: '',
                total_seats: '',
                price_per_person: '',
                discount_percentage: '0',
                status: 'upcoming',
                cover_image: null
            });
            
        } catch (error) {
            console.error('Save error:', error);
            let errorMsg = 'Failed to save tour';
            if (error.response?.data) {
                if (typeof error.response.data === 'object') {
                    errorMsg = Object.values(error.response.data).flat().join(', ');
                } else {
                    errorMsg = error.response.data.error || error.response.data.message || errorMsg;
                }
            }
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }
        
        const formDataImage = new FormData();
        formDataImage.append('tour', selectedTour.tour_id);
        formDataImage.append('image', file);
        formDataImage.append('is_primary', tourImages.length === 0 ? 'true' : 'false');
        formDataImage.append('caption', '');
        
        setUploadingImage(true);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post('/tours/upload-image/', formDataImage, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.data) {
                toast.success('Image uploaded successfully');
                await fetchTours();
                const updatedTour = await get(`/tours/${selectedTour.tour_id}/`);
                setTourImages(updatedTour.images || []);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.error || 'Failed to upload image');
        } finally {
            setUploadingImage(false);
            e.target.value = '';
        }
    };

    const handleDeleteImage = async (imageId) => {
        if (window.confirm('Delete this image? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('accessToken');
                await axios.delete(`/tours/delete-image/${imageId}/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                toast.success('Image deleted successfully');
                await fetchTours();
                if (selectedTour) {
                    const updatedTour = await get(`/tours/${selectedTour.tour_id}/`);
                    setTourImages(updatedTour.images || []);
                }
            } catch (error) {
                console.error('Delete image error:', error);
                toast.error(error.response?.data?.error || 'Failed to delete image');
            }
        }
    };

    const handleSetPrimaryImage = async (imageId) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.patch(`/tours/images/${imageId}/set-primary/`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success('Primary image updated');
            await fetchTours();
            if (selectedTour) {
                const updatedTour = await get(`/tours/${selectedTour.tour_id}/`);
                setTourImages(updatedTour.images || []);
            }
        } catch (error) {
            console.error('Set primary error:', error);
            toast.error('Failed to set primary image');
        }
    };

    const handleEdit = (tour) => {
        if (tour.is_locked) {
            toast.error('This tour is completed and locked. Cannot edit.');
            return;
        }
        
        setEditingTour(tour);
        setFormData({
            tour_name: tour.tour_name || '',
            description: tour.description || '',
            total_seats: tour.total_seats || '',
            price_per_person: tour.price_per_person || '',
            discount_percentage: tour.discount_percentage || '0',
            status: tour.status || 'upcoming',
            cover_image: null
        });
        setPreviewUrl(getImageUrl(tour.cover_image_url));
        setShowModal(true);
    };

    const handleDelete = async (id, tourName) => {
        const tour = tours.find(t => t.tour_id === id);
        if (tour?.is_locked) {
            toast.error('Completed tours cannot be deleted.');
            return;
        }
        
        if (window.confirm(`Are you sure you want to delete "${tourName}"? This action cannot be undone.`)) {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.delete(`/tours/${id}/delete/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.data) {
                    toast.success('Tour deleted successfully');
                    await fetchTours();
                }
            } catch (error) {
                console.error('Delete error:', error);
                const errorMsg = error.response?.data?.error || 'Failed to delete tour';
                toast.error(errorMsg);
            }
        }
    };

    const openImageUpload = async (tour) => {
        if (tour.is_locked) {
            toast.error('Completed tours cannot be modified.');
            return;
        }
        
        setSelectedTour(tour);
        try {
            const freshTour = await get(`/tours/${tour.tour_id}/`);
            setTourImages(freshTour.images || []);
            setShowImageModal(true);
        } catch (error) {
            toast.error('Failed to load tour images');
        }
    };

    const openItineraryModal = (tour) => {
        if (tour.is_locked) {
            toast.error('Completed tours cannot be modified.');
            return;
        }
        setSelectedTourForItinerary(tour);
        setShowItineraryModal(true);
    };

    const openInfoModal = (tour) => {
        setSelectedTourForInfo(tour);
        setShowInfoModal(true);
    };

    if (!isGuideVerified) {
        return (
            <div className="container-custom py-16 text-center">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 max-w-md mx-auto rounded">
                    <h2 className="text-xl font-semibold text-yellow-800 mb-2">Account Not Verified</h2>
                    <p className="text-yellow-700">Your guide account is pending verification.</p>
                    <Link to="/profile" className="inline-block mt-4 text-primary-600 hover:underline">Go to Profile</Link>
                </div>
            </div>
        );
    }

    if (loading && tours.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container-custom py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Manage My Tours</h1>
                    <p className="text-gray-600">Create and manage your tour packages</p>
                </div>
                <Button onClick={() => { setEditingTour(null); setFormData({ tour_name: '', description: '', total_seats: '', price_per_person: '', discount_percentage: '0', status: 'upcoming', cover_image: null }); setPreviewUrl(null); setShowModal(true); }} icon={FaPlus}>Create Tour</Button>
            </div>

            {tours.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No tours created yet</p>
                    <Button onClick={() => setShowModal(true)} className="mt-4">Create Your First Tour</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tours.map(tour => {
                        let coverUrl = 'https://via.placeholder.com/400x300?text=No+Image';
                        if (tour.cover_image_url) {
                            coverUrl = getImageUrl(tour.cover_image_url);
                        } else if (tour.images && tour.images.length > 0) {
                            const primaryImg = tour.images.find(img => img.is_primary);
                            if (primaryImg) {
                                coverUrl = getImageUrl(primaryImg.image);
                            } else {
                                coverUrl = getImageUrl(tour.images[0].image);
                            }
                        }
                        
                        // Calculate booked seats and revenue for display
                        const bookedSeats = tour.booked_seats || 0;
                        const revenue = tour.total_revenue || 0;
                        
                        return (
                            <div key={tour.tour_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
                                <div className="relative h-48 bg-gray-200">
                                    <img 
                                        src={coverUrl} 
                                        alt={tour.tour_name} 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                        }}
                                    />
                                    <button 
                                        onClick={() => openImageUpload(tour)}
                                        className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-300"
                                        title="Manage Images"
                                        disabled={tour.is_locked}
                                    >
                                        <FaImage />
                                    </button>
                                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                                        {tour.images?.length || 0} images
                                    </div>
                                    {tour.is_locked && (
                                        <div className="absolute top-2 left-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                            <FaLock size={10} /> Completed
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold line-clamp-1">{tour.tour_name}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            tour.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                            tour.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                                            'bg-purple-100 text-purple-800'
                                        }`}>
                                            {tour.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{tour.description}</p>
                                    
                                    {/* Quick Stats for completed tours */}
                                    {tour.is_locked && (
                                        <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-500">Booked Seats:</span>
                                                <span className="font-semibold text-green-600">{bookedSeats} / {tour.total_seats}</span>
                                            </div>
                                            <div className="flex justify-between text-xs mt-1">
                                                <span className="text-gray-500">Revenue:</span>
                                                <span className="font-semibold text-blue-600">{formatCurrency(revenue)}</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="mt-3 flex justify-between items-center">
                                        <div className="text-sm">
                                            <span className="text-gray-500">Seats: </span>
                                            <span className="font-semibold">{tour.available_seats}/{tour.total_seats}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-primary-600">৳{tour.price_per_person}</span>
                                            {tour.discount_percentage > 0 && (
                                                <span className="text-xs text-green-600 ml-1">(-{tour.discount_percentage}%)</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap justify-end gap-2 mt-3 pt-3 border-t">
                                        {!tour.is_locked ? (
                                            // Buttons for non-completed tours
                                            <>
                                                <button 
                                                    onClick={() => handleEdit(tour)} 
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-sm"
                                                >
                                                    <FaEdit size={14} /> Edit
                                                </button>
                                                <button 
                                                    onClick={() => openItineraryModal(tour)} 
                                                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-sm"
                                                >
                                                    <FaMapMarkerAlt size={14} /> Itinerary
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(tour.tour_id, tour.tour_name)} 
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-sm"
                                                >
                                                    <FaTrash size={14} /> Delete
                                                </button>
                                            </>
                                        ) : (
                                            // Buttons for completed tours - Only Info button
                                            <button 
                                                onClick={() => openInfoModal(tour)} 
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-sm"
                                            >
                                                <FaInfoCircle size={14} /> Info
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create/Edit Tour Modal */}
            <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingTour(null); setPreviewUrl(null); }} title={editingTour ? 'Edit Tour' : 'Create Tour'} size="lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input 
                        label="Tour Name" 
                        name="tour_name" 
                        value={formData.tour_name} 
                        onChange={handleChange} 
                        required 
                        placeholder="Enter tour name"
                    />
                    
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Description</label>
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            className="input-field" 
                            rows="4" 
                            required 
                            placeholder="Describe the tour details..."
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Input 
                            label="Total Seats" 
                            name="total_seats" 
                            type="number" 
                            value={formData.total_seats} 
                            onChange={handleChange} 
                            required 
                            min="1"
                        />
                        <Input 
                            label="Price per Person (BDT)" 
                            name="price_per_person" 
                            type="number" 
                            value={formData.price_per_person} 
                            onChange={handleChange} 
                            required 
                            min="0"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Input 
                            label="Discount (%)" 
                            name="discount_percentage" 
                            type="number" 
                            value={formData.discount_percentage} 
                            onChange={handleChange} 
                            min="0"
                            max="100"
                        />
                        <div>
                            <label className="block text-gray-700 mb-2 font-medium">Status</label>
                            <select 
                                name="status" 
                                value={formData.status} 
                                onChange={handleChange} 
                                className="input-field"
                                disabled={editingTour?.is_locked}
                            >
                                {TOUR_STATUS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                            </select>
                            {editingTour?.is_locked && (
                                <p className="text-xs text-red-500 mt-1">Completed tours cannot be edited</p>
                            )}
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Cover Image</label>
                        <input type="file" name="cover_image" accept="image/*" onChange={handleChange} className="input-field" disabled={editingTour?.is_locked} />
                        {previewUrl && (
                            <div className="mt-3 relative w-32 h-32">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg shadow" />
                                <button 
                                    type="button" 
                                    onClick={() => { setPreviewUrl(null); setFormData({ ...formData, cover_image: null }); }} 
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                                >
                                    <FaTimes size={12} />
                                </button>
                            </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Recommended: 800x600px, Max 5MB</p>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => { setShowModal(false); setEditingTour(null); }} fullWidth>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" loading={isSubmitting} fullWidth disabled={editingTour?.is_locked}>
                            {editingTour ? 'Update Tour' : 'Create Tour'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Expense Modal for Tour Completion */}
            <Modal isOpen={showExpenseModal} onClose={() => { setShowExpenseModal(false); setExpenses(''); setTempStatus(''); setFormData({ ...formData, status: tempStatus === 'completed' ? 'upcoming' : formData.status }); }} title="Complete Tour - Enter Expenses" size="md">
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">
                            Total Expenses for this Tour <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={expenses}
                            onChange={(e) => setExpenses(e.target.value)}
                            className="input-field"
                            placeholder="Enter total expenses (e.g., transport, food, accommodation)"
                            min="0"
                            step="0.01"
                            required
                            autoFocus
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Include all costs: transport, accommodation, food, guide fees, etc.
                        </p>
                    </div>
                    
                    {editingTour && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Current Revenue:</strong> {formatCurrency(editingTour.total_revenue || 0)}
                            </p>
                            <p className="text-sm text-blue-800 mt-1">
                                <strong>Estimated Profit:</strong> {formatCurrency((editingTour.total_revenue || 0) - (parseFloat(expenses) || 0))}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                                (Based on {editingTour.booked_seats || 0} booked seats × {formatCurrency(editingTour.final_price)})
                            </p>
                        </div>
                    )}
                    
                    <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-800">
                            <strong>Note:</strong> Once you complete this tour:
                        </p>
                        <ul className="text-xs text-yellow-700 mt-1 list-disc list-inside">
                            <li>The tour will be marked as completed</li>
                            <li>You won't be able to edit this tour anymore</li>
                            <li>Profit will be calculated as Revenue - Expenses</li>
                        </ul>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => { setShowExpenseModal(false); setExpenses(''); setFormData({ ...formData, status: tempStatus === 'completed' ? 'upcoming' : formData.status }); }} fullWidth>
                            Cancel
                        </Button>
                        <Button type="button" variant="primary" onClick={handleStatusChangeWithExpenses} fullWidth>
                            Complete Tour
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Image Management Modal */}
            <Modal isOpen={showImageModal} onClose={() => { setShowImageModal(false); setSelectedTour(null); setTourImages([]); }} title={`Manage Images for ${selectedTour?.tour_name}`} size="lg">
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-all duration-300">
                        <FaUpload className="text-4xl text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 mb-3">Upload new images for this tour</p>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            className="hidden" 
                            id="imageUpload" 
                            disabled={uploadingImage}
                        />
                        <label 
                            htmlFor="imageUpload" 
                            className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-primary-700 transition-all duration-300"
                        >
                            {uploadingImage ? 'Uploading...' : 'Choose Image'}
                        </label>
                        <p className="text-xs text-gray-500 mt-2">JPEG, PNG, GIF up to 5MB</p>
                    </div>
                    
                    {tourImages.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-3">Tour Gallery ({tourImages.length} images)</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {tourImages.map(img => (
                                    <div key={img.image_id} className="relative group border rounded-lg overflow-hidden bg-gray-100">
                                        <img 
                                            src={getImageUrl(img.image)} 
                                            alt={img.caption || 'Tour image'} 
                                            className="w-full h-24 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => handleSetPrimaryImage(img.image_id)}
                                                className={`p-1.5 rounded-full transition-all duration-300 ${img.is_primary ? 'bg-yellow-500' : 'bg-gray-700 hover:bg-yellow-600'}`}
                                                title={img.is_primary ? 'Primary Image' : 'Set as Primary'}
                                            >
                                                <FaStar className="text-white text-sm" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteImage(img.image_id)}
                                                className="bg-red-600 p-1.5 rounded-full hover:bg-red-700 transition-all duration-300"
                                                title="Delete Image"
                                            >
                                                <FaTrash className="text-white text-sm" />
                                            </button>
                                        </div>
                                        {img.is_primary && (
                                            <span className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                                                Primary
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {tourImages.length === 0 && !uploadingImage && (
                        <div className="text-center py-8 text-gray-500">
                            <FaImage className="text-5xl mx-auto mb-3 text-gray-300" />
                            <p>No images uploaded yet</p>
                            <p className="text-sm">Upload your first image above</p>
                        </div>
                    )}
                    
                    <Button type="button" variant="secondary" onClick={() => { setShowImageModal(false); setSelectedTour(null); setTourImages([]); }} fullWidth>
                        Close
                    </Button>
                </div>
            </Modal>

            {/* Itinerary Management Modal */}
            {showItineraryModal && selectedTourForItinerary && (
                <DestinationForm
                    tourId={selectedTourForItinerary.tour_id}
                    onClose={() => {
                        setShowItineraryModal(false);
                        setSelectedTourForItinerary(null);
                    }}
                    onSuccess={() => {
                        setShowItineraryModal(false);
                        setSelectedTourForItinerary(null);
                        fetchTours();
                    }}
                />
            )}

            {/* Tour Info Modal for Completed Tours */}
            <Modal isOpen={showInfoModal} onClose={() => { setShowInfoModal(false); setSelectedTourForInfo(null); }} title={`Tour Information: ${selectedTourForInfo?.tour_name}`} size="lg">
                {selectedTourForInfo && (
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Tour Name</p>
                                <p className="font-semibold">{selectedTourForInfo.tour_name}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Status</p>
                                <p className="font-semibold capitalize text-green-600">Completed</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Description</p>
                            <p className="text-sm mt-1">{selectedTourForInfo.description}</p>
                        </div>

                        {/* Financial Information */}
                        <div>
                            <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                                <FaMoneyBillWave className="text-primary-600" /> Financial Summary
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-green-50 p-3 rounded-lg text-center">
                                    <p className="text-xs text-gray-500">Revenue</p>
                                    <p className="text-lg font-bold text-green-600">
                                        {formatCurrency(selectedTourForInfo.total_revenue || 0)}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        ({selectedTourForInfo.booked_seats || 0} booked × {formatCurrency(selectedTourForInfo.final_price)})
                                    </p>
                                </div>
                                <div className="bg-red-50 p-3 rounded-lg text-center">
                                    <p className="text-xs text-gray-500">Expenses</p>
                                    <p className="text-lg font-bold text-red-600">{formatCurrency(selectedTourForInfo.total_expenses || 0)}</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg text-center">
                                    <p className="text-xs text-gray-500">Profit</p>
                                    <p className="text-lg font-bold text-blue-600">
                                        {formatCurrency((selectedTourForInfo.total_revenue || 0) - (selectedTourForInfo.total_expenses || 0))}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tour Statistics */}
                        <div>
                            <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                                <FaUsers className="text-primary-600" /> Tour Statistics
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Total Seats</p>
                                    <p className="font-semibold">{selectedTourForInfo.total_seats}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Booked Seats</p>
                                    <p className="font-semibold text-green-600">{selectedTourForInfo.booked_seats || 0}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Available Seats (at start)</p>
                                    <p className="font-semibold">{selectedTourForInfo.available_seats}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Price per Person</p>
                                    <p className="font-semibold">{formatCurrency(selectedTourForInfo.price_per_person)}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Discount</p>
                                    <p className="font-semibold">{selectedTourForInfo.discount_percentage}%</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Final Price per Person</p>
                                    <p className="font-semibold text-primary-600">{formatCurrency(selectedTourForInfo.final_price)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Itinerary Summary */}
                        {selectedTourForInfo.destinations && selectedTourForInfo.destinations.length > 0 && (
                            <div>
                                <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-primary-600" /> Itinerary Summary
                                </h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {selectedTourForInfo.destinations.map((dest, idx) => (
                                        <div key={idx} className="bg-gray-50 p-2 rounded-lg">
                                            <p className="font-medium text-sm">Day {dest.order}: {dest.destination_details?.name}</p>
                                            <p className="text-xs text-gray-500">{dest.arrival_date} - {dest.departure_date}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Created At</p>
                                <p className="text-sm">{formatDate(selectedTourForInfo.created_at)}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Last Updated</p>
                                <p className="text-sm">{formatDate(selectedTourForInfo.updated_at)}</p>
                            </div>
                        </div>

                        <Button type="button" variant="secondary" onClick={() => { setShowInfoModal(false); setSelectedTourForInfo(null); }} fullWidth>
                            Close
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ManageTours;