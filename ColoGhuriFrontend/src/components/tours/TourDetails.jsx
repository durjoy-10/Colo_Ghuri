import React from 'react';
import { FaCalendarAlt, FaUsers, FaMoneyBillWave, FaStar } from 'react-icons/fa';
import { formatCurrency, getStatusColor } from '../../utils/formatters';

const TourDetails = ({ tour }) => {
    if (!tour) return null;

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4"><h1 className="text-3xl font-bold">{tour.tour_name}</h1><span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tour.status)}`}>{tour.status.toUpperCase()}</span></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2"><p className="text-gray-600 mb-6">{tour.description}</p>
                        {tour.destinations?.length > 0 && (<div className="mb-6"><h2 className="text-2xl font-semibold mb-4">Itinerary</h2><div className="space-y-4">{tour.destinations.map((dest, idx) => (<div key={idx} className="border-l-4 border-primary-600 pl-4"><h3 className="font-semibold">Day {dest.order}: {dest.destination_details?.name}</h3><div className="flex items-center gap-2 text-gray-600 text-sm"><FaCalendarAlt />{dest.arrival_date} to {dest.departure_date}</div></div>))}</div></div>)}
                    </div>
                    <div className="lg:col-span-1"><div className="bg-gray-50 rounded-lg p-6 sticky top-24"><div className="space-y-4 mb-6"><div><p className="text-gray-500 text-sm">Price</p><div className="flex items-baseline gap-2"><span className="text-3xl font-bold text-primary-600">{formatCurrency(tour.final_price)}</span>{tour.discount_percentage > 0 && <><span className="text-sm text-gray-500 line-through">{formatCurrency(tour.price_per_person)}</span><span className="text-sm text-green-600">{tour.discount_percentage}% off</span></>}</div></div><div className="flex items-center gap-3"><FaUsers /><div><p className="text-sm text-gray-500">Available Seats</p><p className="font-semibold">{tour.available_seats} / {tour.total_seats}</p></div></div></div></div></div>
                </div>
            </div>
        </div>
    );
};

export default TourDetails;