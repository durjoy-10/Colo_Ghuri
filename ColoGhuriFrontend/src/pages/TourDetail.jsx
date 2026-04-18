import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BookingForm from '../components/tours/BookingForm';
import { FaCalendarAlt, FaUsers, FaMoneyBillWave, FaStar, FaMapMarkerAlt, FaArrowLeft, FaChevronLeft, FaChevronRight, FaImages, FaUtensils, FaClock } from 'react-icons/fa';
import { formatCurrency, formatDate, getStatusColor } from '../utils/formatters';

const TourDetail = () => {
    const { id } = useParams();
    const { get, loading } = useApi();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [tour, setTour] = useState(null);
    const [showBooking, setShowBooking] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showLightbox, setShowLightbox] = useState(false);

    useEffect(() => {
        fetchTourDetails();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchTourDetails = async () => {
        const data = await get(`/tours/${id}/`);
        setTour(data);
    };

    const handleBookNow = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/tours/${id}` } });
        } else if (user?.role !== 'traveller') {
            alert('Only travellers can book tours');
        } else {
            setShowBooking(true);
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        return `http://127.0.0.1:8000${imagePath}`;
    };

    const getAllImages = () => {
        const images = [];
        
        if (tour?.cover_image) {
            images.push({
                url: getImageUrl(tour.cover_image),
                caption: 'Cover Image',
                isPrimary: true
            });
        }
        
        if (tour?.images && tour.images.length > 0) {
            tour.images.forEach(img => {
                images.push({
                    url: getImageUrl(img.image),
                    caption: img.caption || 'Tour Image',
                    isPrimary: img.is_primary,
                    image_id: img.image_id
                });
            });
        }
        
        return images;
    };

    const images = getAllImages();
    const hasImages = images.length > 0;
    const currentImage = hasImages ? images[currentImageIndex] : null;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (loading) return <LoadingSpinner />;
    if (!tour) return <div className="text-center py-12">Tour not found</div>;

    return (
        <div className="container-custom py-8">
            <Link to="/tours" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4 transition-colors">
                <FaArrowLeft /> Back to Tours
            </Link>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Image Gallery Section */}
                <div className="relative">
                    {hasImages ? (
                        <>
                            <div className="relative h-96 md:h-[500px] bg-gray-900">
                                <img
                                    src={currentImage?.url}
                                    alt={currentImage?.caption || tour.tour_name}
                                    className="w-full h-full object-contain cursor-pointer bg-gray-900"
                                    onClick={() => setShowLightbox(true)}
                                />
                                
                                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                                    {currentImageIndex + 1} / {images.length}
                                </div>
                                
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
                                        >
                                            <FaChevronLeft size={24} />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
                                        >
                                            <FaChevronRight size={24} />
                                        </button>
                                    </>
                                )}
                            </div>
                            
                            {images.length > 1 && (
                                <div className="flex gap-2 p-4 overflow-x-auto bg-gray-100">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                                currentImageIndex === idx ? 'border-primary-600 ring-2 ring-primary-300' : 'border-transparent hover:border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={img.url}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="h-96 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <div className="text-center">
                                <FaImages className="text-6xl text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500">No images available</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tour Content */}
                <div className="p-6">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <h1 className="text-3xl font-bold text-dark-800">{tour.tour_name}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tour.status)}`}>
                            {tour.status.toUpperCase()}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content - Left Side */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Description */}
                            <div>
                                <h2 className="text-2xl font-semibold mb-3 text-primary-600">About This Tour</h2>
                                <p className="text-gray-600 leading-relaxed">{tour.description}</p>
                            </div>
                            
                            {/* Itinerary with Food Plans */}
                            {tour.destinations && tour.destinations.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-semibold mb-4 text-primary-600 flex items-center gap-2">
                                        <FaMapMarkerAlt /> Tour Itinerary
                                    </h2>
                                    <div className="space-y-6">
                                        {tour.destinations.map((dest, index) => (
                                            <div key={dest.id} className="border-l-4 border-primary-600 pl-4 hover:bg-gray-50 p-4 rounded-r-lg transition">
                                                <div className="flex justify-between items-start flex-wrap gap-2">
                                                    <h3 className="font-semibold text-lg">
                                                        Day {dest.order}: {dest.destination_details?.name}
                                                    </h3>
                                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                                        <FaClock className="text-primary-500" /> {dest.stay_duration_hours} hours
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                                                    <FaCalendarAlt className="text-primary-600" />
                                                    <span>
                                                        {formatDate(dest.arrival_date)} - {formatDate(dest.departure_date)}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mt-2 text-sm">
                                                    {dest.destination_details?.description?.substring(0, 200)}...
                                                </p>
                                                
                                                {/* Food Plans for this destination */}
                                                {dest.food_plans && dest.food_plans.length > 0 && (
                                                    <div className="mt-4">
                                                        <h4 className="font-medium text-sm text-primary-600 flex items-center gap-1 mb-2">
                                                            <FaUtensils /> Meal Plan for Day {dest.order}
                                                        </h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                            {dest.food_plans.map((food, idx) => (
                                                                <div key={idx} className="bg-gray-50 p-2 rounded-lg text-sm">
                                                                    <span className="font-medium capitalize text-primary-600">{food.meal_type}</span>
                                                                    <p className="text-xs text-gray-600 mt-1">{food.meal_items}</p>
                                                                    {food.dietary_options && (
                                                                        <p className="text-xs text-gray-400 mt-1">Dietary: {food.dietary_options}</p>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar - Right Side */}
                        <div className="lg:col-span-1">
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 sticky top-24 shadow-lg">
                                <h3 className="text-lg font-semibold mb-4">Tour Details</h3>
                                
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <p className="text-gray-500 text-sm">Price</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-primary-600">{formatCurrency(tour.final_price)}</span>
                                            {tour.discount_percentage > 0 && (
                                                <>
                                                    <span className="text-sm text-gray-500 line-through">{formatCurrency(tour.price_per_person)}</span>
                                                    <span className="text-sm text-green-600 font-semibold">{tour.discount_percentage}% off</span>
                                                </>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500">per person</p>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                                        <FaUsers className="text-primary-500 text-xl" />
                                        <div>
                                            <p className="text-xs text-gray-500">Available Seats</p>
                                            <p className="font-semibold text-lg">{tour.available_seats} / {tour.total_seats}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                                        <FaStar className="text-yellow-500 text-xl" />
                                        <div>
                                            <p className="text-xs text-gray-500">Rating</p>
                                            <p className="font-semibold">4.9 / 5.0 (120+ reviews)</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                                        <FaMapMarkerAlt className="text-primary-500 text-xl" />
                                        <div>
                                            <p className="text-xs text-gray-500">Guide Group</p>
                                            <p className="font-semibold">{tour.guide_group_details?.guide_groupname}</p>
                                        </div>
                                    </div>

                                    {tour.destinations && tour.destinations.length > 0 && (
                                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                                            <FaCalendarAlt className="text-primary-500 text-xl" />
                                            <div>
                                                <p className="text-xs text-gray-500">Duration</p>
                                                <p className="font-semibold">{tour.destinations.length} days</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleBookNow}
                                    className="w-full btn-primary py-3 text-lg"
                                    disabled={tour.available_seats === 0}
                                >
                                    {tour.available_seats === 0 ? 'Sold Out' : 'Book Now'}
                                </button>
                                
                                <p className="text-xs text-gray-500 text-center mt-3">
                                    Free cancellation up to 7 days before the tour
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Modal for Fullscreen Images */}
            {showLightbox && currentImage && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={() => setShowLightbox(false)}>
                    <button
                        onClick={() => setShowLightbox(false)}
                        className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
                    >
                        ✕
                    </button>
                    
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition"
                            >
                                <FaChevronLeft size={24} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition"
                            >
                                <FaChevronRight size={24} />
                            </button>
                        </>
                    )}
                    
                    <div className="max-w-5xl max-h-[90vh] mx-4" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={currentImage.url}
                            alt={currentImage.caption}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg"
                        />
                        {currentImage.caption && (
                            <p className="text-center text-white mt-3">{currentImage.caption}</p>
                        )}
                        <p className="text-center text-gray-400 text-sm mt-2">
                            {currentImageIndex + 1} of {images.length}
                        </p>
                    </div>
                </div>
            )}

            {/* Booking Modal */}
            {showBooking && (
                <BookingForm
                    tour={tour}
                    onClose={() => setShowBooking(false)}
                    onSuccess={() => {
                        setShowBooking(false);
                        fetchTourDetails();
                    }}
                />
            )}
        </div>
    );
};

export default TourDetail;