import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaMoneyBillWave, FaTag, FaStar, FaClock, FaImage, FaLock, FaChartLine } from 'react-icons/fa';
import { formatCurrency, getStatusColor } from '../../utils/formatters';

const TourCard = ({ tour }) => {
    const getImageUrl = () => {
        if (tour.cover_image_url) {
            if (tour.cover_image_url.startsWith('http')) {
                return tour.cover_image_url;
            }
            return `http://127.0.0.1:8000${tour.cover_image_url}`;
        }
        if (tour.images && tour.images.length > 0) {
            const imgUrl = tour.images[0].image_url;
            if (imgUrl && imgUrl.startsWith('http')) {
                return imgUrl;
            }
            return `http://127.0.0.1:8000${imgUrl}`;
        }
        return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    };

    // Calculate profit margin for completed tours
    const profitMargin = tour.is_locked && tour.total_revenue > 0 
        ? ((tour.total_revenue - tour.total_expenses) / tour.total_revenue * 100).toFixed(1)
        : null;

    return (
        <div className="card group">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={getImageUrl()}
                    alt={tour.tour_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tour.status)} shadow-lg`}>
                        {tour.status}
                    </span>
                </div>
                
                {/* Discount Badge */}
                {tour.discount_percentage > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <FaTag className="text-xs" /> {tour.discount_percentage}% OFF
                    </div>
                )}
                
                {/* Lock Badge for Completed Tours */}
                {tour.is_locked && (
                    <div className="absolute bottom-2 left-2 bg-gray-800/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <FaLock size={10} /> Completed
                    </div>
                )}
                
                {/* Image Count Badge */}
                {tour.images && tour.images.length > 0 && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <FaImage size={10} /> {tour.images.length}
                    </div>
                )}
            </div>
            
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold line-clamp-1 group-hover:text-primary-600 transition-colors">
                        {tour.tour_name}
                    </h3>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>
                
                <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                            <FaUsers className="text-primary-500" />
                            <span>Available Seats</span>
                        </div>
                        <span className="font-semibold">{tour.available_seats} / {tour.total_seats}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm pt-2 border-t">
                        <div className="flex items-center gap-2 text-gray-500">
                            <FaMoneyBillWave className="text-primary-500" />
                            <span>Price</span>
                        </div>
                        <div className="text-right">
                            {tour.discount_percentage > 0 && (
                                <span className="text-xs text-gray-400 line-through block">{formatCurrency(tour.price_per_person)}</span>
                            )}
                            <span className="text-xl font-bold text-primary-600">{formatCurrency(tour.final_price)}</span>
                            <span className="text-xs text-gray-500">/person</span>
                        </div>
                    </div>
                    
                    {/* Profit Display for Completed Tours */}
                    {tour.is_locked && profitMargin && (
                        <div className="flex items-center justify-between text-sm pt-1">
                            <div className="flex items-center gap-2 text-gray-500">
                                <FaChartLine className="text-green-500" />
                                <span>Profit Margin</span>
                            </div>
                            <span className={`font-semibold ${profitMargin >= 30 ? 'text-green-600' : profitMargin >= 15 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {profitMargin}%
                            </span>
                        </div>
                    )}
                </div>

                <Link
                    to={`/tours/${tour.tour_id}`}
                    className="block w-full text-center btn-primary text-sm py-2.5 rounded-xl"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default TourCard;