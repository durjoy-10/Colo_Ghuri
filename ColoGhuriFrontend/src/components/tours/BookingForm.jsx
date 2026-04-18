import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatters';
import { PAYMENT_METHODS } from '../../utils/constants';
import toast from 'react-hot-toast';
import axios from '../../api/axios';

const BookingForm = ({ tour, onClose, onSuccess }) => {
    const { post, loading } = useApi();
    const [numberOfTravellers, setNumberOfTravellers] = useState(1);
    const [specialRequests, setSpecialRequests] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('bkash');
    const [transactionId, setTransactionId] = useState('');
    const [guideReference, setGuideReference] = useState('');
    const [guideList, setGuideList] = useState([]);
    const [loadingGuides, setLoadingGuides] = useState(false);

    const totalAmount = numberOfTravellers * parseFloat(tour.final_price);

    useEffect(() => {
        if (paymentMethod === 'cash') {
            fetchGuideGroupMembers();
        }
    }, [paymentMethod, tour]);

    const fetchGuideGroupMembers = async () => {
        setLoadingGuides(true);
        try {
            const guideGroupId = tour.guide_group;
            const response = await axios.get(`/guides/groups/${guideGroupId}/`);
            if (response.data) {
                setGuideList([
                    { id: 1, name: 'Guide Rahim Khan', username: 'rahim_guide' },
                    { id: 2, name: 'Guide Karim Ahmed', username: 'karim_guide' },
                    { id: 3, name: 'Guide Sultana Begum', username: 'sultana_guide' },
                    { id: 4, name: 'Guide Shahin Alam', username: 'shahin_guide' },
                ]);
            }
        } catch (error) {
            console.error('Error fetching guides:', error);
        } finally {
            setLoadingGuides(false);
        }
    };

    const validateForm = () => {
        if (numberOfTravellers > tour.available_seats) {
            toast.error(`Only ${tour.available_seats} seats available`);
            return false;
        }
        
        if (paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') {
            if (!transactionId || transactionId.trim() === '') {
                toast.error(`Please enter ${paymentMethod.toUpperCase()} Transaction ID`);
                return false;
            }
            if (transactionId.length < 6) {
                toast.error('Invalid Transaction ID');
                return false;
            }
        }
        
        if (paymentMethod === 'cash') {
            if (!guideReference || guideReference.trim() === '') {
                toast.error('Please select a guide reference');
                return false;
            }
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const bookingData = {
            tour: tour.tour_id,
            number_of_travellers: numberOfTravellers,
            total_amount: totalAmount,
            special_requests: specialRequests,
            payment_method: paymentMethod,
        };
        
        if (paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') {
            bookingData.payment_id = transactionId;
        }
        
        if (paymentMethod === 'cash') {
            bookingData.guide_reference = guideReference;
        }
        
        const result = await post('/tours/book/', bookingData);
        if (result) {
            toast.success('Booking successful!');
            onSuccess();
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Book Tour" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tour Info */}
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800">{tour.tour_name}</h3>
                    <p className="text-sm text-gray-600 mt-1">Price per person: {formatCurrency(tour.final_price)}</p>
                    <p className="text-xs text-gray-500 mt-1">Available seats: {tour.available_seats}</p>
                </div>

                {/* Number of Travellers */}
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        Number of Travellers <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        min="1"
                        max={tour.available_seats}
                        value={numberOfTravellers}
                        onChange={(e) => setNumberOfTravellers(parseInt(e.target.value))}
                        className="input-field"
                        required
                    />
                    <p className="text-sm text-gray-500 mt-1">Max: {tour.available_seats} seats available</p>
                </div>

                {/* Payment Method */}
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        Payment Method <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {PAYMENT_METHODS.map(method => (
                            <label
                                key={method}
                                className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all duration-300 ${
                                    paymentMethod === method 
                                        ? 'border-primary-500 bg-primary-50 shadow-md' 
                                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={method}
                                    checked={paymentMethod === method}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="text-primary-600"
                                />
                                <span className="capitalize font-medium">{method}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Transaction ID for Mobile Banking */}
                {(paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') && (
                    <div className="animate-fade-in">
                        <label className="block text-gray-700 mb-2 font-medium">
                            {paymentMethod.toUpperCase()} Transaction ID <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            className="input-field"
                            placeholder={`Enter your ${paymentMethod.toUpperCase()} transaction ID`}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Example: {paymentMethod.toUpperCase()}7F8G9H0J1K
                        </p>
                    </div>
                )}

                {/* Guide Reference for Cash Payment */}
                {paymentMethod === 'cash' && (
                    <div className="animate-fade-in">
                        <label className="block text-gray-700 mb-2 font-medium">
                            Guide Reference <span className="text-red-500">*</span>
                        </label>
                        {loadingGuides ? (
                            <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-600 border-t-transparent"></div>
                                <span className="text-sm text-gray-500">Loading guides...</span>
                            </div>
                        ) : (
                            <select
                                value={guideReference}
                                onChange={(e) => setGuideReference(e.target.value)}
                                className="input-field"
                                required
                            >
                                <option value="">Select a guide</option>
                                {guideList.map(guide => (
                                    <option key={guide.id} value={guide.username}>
                                        {guide.name} (@{guide.username})
                                    </option>
                                ))}
                            </select>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Select the guide who referred you or who will accompany you
                        </p>
                    </div>
                )}

                {/* Special Requests */}
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">Special Requests</label>
                    <textarea
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className="input-field"
                        rows="3"
                        placeholder="Any special requirements? (e.g., vegetarian food, wheelchair access, etc.)"
                    />
                </div>

                {/* Price Summary */}
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Price per person:</span>
                        <span className="font-semibold">{formatCurrency(tour.final_price)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Number of travellers:</span>
                        <span className="font-semibold">{numberOfTravellers}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-bold">
                        <span className="text-gray-800">Total Amount:</span>
                        <span className="text-primary-600 text-lg">{formatCurrency(totalAmount)}</span>
                    </div>
                </div>

                {/* Payment Instructions */}
                {(paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800 font-medium mb-1">📱 Payment Instructions:</p>
                        <p className="text-xs text-blue-700">
                            Send money to this number: <strong className="font-mono">017XXXXXXXX</strong> ({paymentMethod.toUpperCase()})
                            <br />
                            After payment, enter the transaction ID above.
                        </p>
                    </div>
                )}

                {paymentMethod === 'cash' && (
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-800 font-medium mb-1">💰 Cash Payment Instructions:</p>
                        <p className="text-xs text-yellow-700">
                            Pay directly to the guide at the start of the tour.
                            Please select a guide reference for tracking purposes.
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose} fullWidth>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" loading={loading} fullWidth>
                        Confirm Booking
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default BookingForm;