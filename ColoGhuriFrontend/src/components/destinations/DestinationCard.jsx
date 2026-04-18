import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaHeart, FaShare } from 'react-icons/fa';
import { formatCurrency } from '../../utils/formatters';

const DestinationCard = ({ destination }) => {
  const [isLiked, setIsLiked] = React.useState(false);
  
  // Get the image URL - handle both primary_image and images array
  const getImageUrl = () => {
    if (destination.primary_image) {
      // If primary_image is a full URL, use it directly
      if (destination.primary_image.startsWith('http')) {
        return destination.primary_image;
      }
      // Otherwise, prepend the backend URL
      return `http://127.0.0.1:8000${destination.primary_image}`;
    }
    if (destination.images && destination.images.length > 0) {
      const imgUrl = destination.images[0].image;
      if (imgUrl.startsWith('http')) {
        return imgUrl;
      }
      return `http://127.0.0.1:8000${imgUrl}`;
    }
    // Fallback image
    return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  };

  return (
    <div className="card group">
      <div className="relative h-56 overflow-hidden">
        <img
          src={getImageUrl()}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        >
          <FaHeart className={`text-sm ${isLiked ? 'text-red-500' : 'text-gray-600'}`} />
        </button>
        
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium capitalize shadow-lg">
          {destination.destination_type}
        </span>
        
        <div className="absolute bottom-3 right-3 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          {formatCurrency(destination.entry_fee)}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {destination.name}
        </h3>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <FaMapMarkerAlt className="mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{destination.location}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-500" />
            <span className="text-sm font-semibold">{destination.average_rating || '4.8'}</span>
            <span className="text-xs text-gray-400">({destination.total_reviews || 128})</span>
          </div>
          <button className="text-gray-400 hover:text-primary-600 transition">
            <FaShare />
          </button>
        </div>
        
        <Link
          to={`/destinations/${destination.destination_id}`}
          className="block w-full text-center btn-primary text-sm py-2.5 rounded-xl"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default DestinationCard;