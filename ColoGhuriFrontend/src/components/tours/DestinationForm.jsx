import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { FaPlus, FaTrash, FaUtensils, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from '../../api/axios';

const DestinationForm = ({ tourId, onClose, onSuccess }) => {
    const { get, del, loading } = useApi();
    const [destinations, setDestinations] = useState([]);
    const [allDestinations, setAllDestinations] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showFoodModal, setShowFoodModal] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [loadingFood, setLoadingFood] = useState(false);
    const [formData, setFormData] = useState({
        destination: '',
        order: '',
        arrival_date: '',
        departure_date: '',
        arrival_time: '09:00',
        departure_time: '17:00',
        stay_duration_hours: 8
    });
    const [foodFormData, setFoodFormData] = useState({
        day_number: '',
        meal_type: 'breakfast',
        meal_description: '',
        meal_items: '',
        dietary_options: ''
    });

    useEffect(() => {
        if (tourId) {
            fetchDestinations();
            fetchAllDestinations();
        }
    }, [tourId]);

    const fetchDestinations = async () => {
        try {
            const data = await get(`/tours/${tourId}/destinations/`, {}, false);
            // Ensure data is an array
            if (data && Array.isArray(data)) {
                setDestinations(data);
            } else if (data && data.results && Array.isArray(data.results)) {
                setDestinations(data.results);
            } else {
                setDestinations([]);
            }
        } catch (error) {
            console.error('Error fetching destinations:', error);
            setDestinations([]);
        }
    };

    const fetchAllDestinations = async () => {
        try {
            const data = await get('/destinations/', {}, false);
            if (data && data.results && Array.isArray(data.results)) {
                setAllDestinations(data.results);
            } else if (data && Array.isArray(data)) {
                setAllDestinations(data);
            } else {
                setAllDestinations([]);
            }
        } catch (error) {
            console.error('Error fetching all destinations:', error);
            setAllDestinations([]);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFoodChange = (e) => {
        setFoodFormData({ ...foodFormData, [e.target.name]: e.target.value });
    };

    const addDestination = async () => {
        if (!formData.destination || !formData.order || !formData.arrival_date || !formData.departure_date) {
            toast.error('Please fill all required fields');
            return;
        }

        setLoadingAdd(true);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post(`/tours/${tourId}/destinations/create/`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data) {
                toast.success('Destination added to tour');
                setShowAddModal(false);
                setFormData({
                    destination: '',
                    order: '',
                    arrival_date: '',
                    departure_date: '',
                    arrival_time: '09:00',
                    departure_time: '17:00',
                    stay_duration_hours: 8
                });
                fetchDestinations();
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            console.error('Add destination error:', error);
            toast.error(error.response?.data?.error || 'Failed to add destination');
        } finally {
            setLoadingAdd(false);
        }
    };

    const addFoodPlan = async () => {
        if (!foodFormData.day_number || !foodFormData.meal_items) {
            toast.error('Please fill all required fields');
            return;
        }

        setLoadingFood(true);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post(`/tours/destinations/${selectedDestination.id}/food-plans/create/`, foodFormData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data) {
                toast.success('Food plan added');
                setShowFoodModal(false);
                setFoodFormData({
                    day_number: '',
                    meal_type: 'breakfast',
                    meal_description: '',
                    meal_items: '',
                    dietary_options: ''
                });
                fetchDestinations();
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            console.error('Add food plan error:', error);
            toast.error(error.response?.data?.error || 'Failed to add food plan');
        } finally {
            setLoadingFood(false);
        }
    };

    const removeDestination = async (id) => {
        if (window.confirm('Remove this destination from the tour?')) {
            try {
                await del(`/tours/destinations/${id}/delete/`);
                toast.success('Destination removed');
                fetchDestinations();
                if (onSuccess) onSuccess();
            } catch (error) {
                toast.error('Failed to remove destination');
            }
        }
    };

    const removeFoodPlan = async (id) => {
        if (window.confirm('Remove this food plan?')) {
            try {
                await del(`/tours/food-plans/${id}/delete/`);
                toast.success('Food plan removed');
                fetchDestinations();
                if (onSuccess) onSuccess();
            } catch (error) {
                toast.error('Failed to remove food plan');
            }
        }
    };

    const mealTypes = [
        { value: 'breakfast', label: 'Breakfast' },
        { value: 'lunch', label: 'Lunch' },
        { value: 'dinner', label: 'Dinner' }
    ];

    if (!tourId) {
        return (
            <Modal isOpen={true} onClose={onClose} title="Error" size="md">
                <div className="text-center py-8">
                    <p className="text-red-500">Invalid tour ID</p>
                    <Button onClick={onClose} className="mt-4">Close</Button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={true} onClose={onClose} title="Manage Tour Itinerary" size="xl">
            <div className="space-y-6">
                {/* Add Destination Button */}
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FaMapMarkerAlt className="text-primary-600" /> Tour Destinations
                    </h3>
                    <Button onClick={() => setShowAddModal(true)} icon={FaPlus} size="sm">
                        Add Destination
                    </Button>
                </div>

                {/* Destinations List */}
                {!destinations || destinations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        <FaMapMarkerAlt className="text-4xl mx-auto mb-2 text-gray-300" />
                        <p>No destinations added yet.</p>
                        <p className="text-sm">Click "Add Destination" to create itinerary.</p>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {destinations.map((dest, idx) => (
                            <div key={dest.id || idx} className="border rounded-lg overflow-hidden">
                                <div className="bg-gray-50 p-4 flex flex-wrap justify-between items-center gap-3">
                                    <div>
                                        <h4 className="font-semibold">Day {dest.order}: {dest.destination_details?.name || 'Unknown Destination'}</h4>
                                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                            <FaClock className="text-xs" />
                                            {dest.arrival_date} to {dest.departure_date}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedDestination(dest);
                                                setShowFoodModal(true);
                                            }}
                                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                                            title="Add Food Plan"
                                        >
                                            <FaUtensils size={12} /> Add Meal
                                        </button>
                                        <button
                                            onClick={() => removeDestination(dest.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                                        >
                                            <FaTrash size={12} /> Remove
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Food Plans */}
                                {dest.food_plans && dest.food_plans.length > 0 && (
                                    <div className="p-4 bg-white">
                                        <h5 className="text-sm font-semibold mb-2 flex items-center gap-1">
                                            <FaUtensils className="text-primary-500" /> Meal Plans
                                        </h5>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            {dest.food_plans.map((food, fidx) => (
                                                <div key={food.id || fidx} className="bg-gray-50 p-2 rounded relative group">
                                                    <button
                                                        onClick={() => removeFoodPlan(food.id)}
                                                        className="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100 transition text-xs"
                                                    >
                                                        <FaTrash size={10} />
                                                    </button>
                                                    <p className="font-medium capitalize text-sm">{food.meal_type}</p>
                                                    <p className="text-xs text-gray-500">Day {food.day_number}</p>
                                                    <p className="text-xs mt-1">{food.meal_items}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Destination Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Destination to Tour" size="md">
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Destination *</label>
                        <select
                            name="destination"
                            value={formData.destination}
                            onChange={handleChange}
                            className="input-field"
                            required
                        >
                            <option value="">Select a destination</option>
                            {allDestinations.map(dest => (
                                <option key={dest.destination_id} value={dest.destination_id}>
                                    {dest.name} - {dest.location}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Day Order *"
                        name="order"
                        type="number"
                        value={formData.order}
                        onChange={handleChange}
                        placeholder="1, 2, 3..."
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Arrival Date *"
                            name="arrival_date"
                            type="date"
                            value={formData.arrival_date}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Departure Date *"
                            name="departure_date"
                            type="date"
                            value={formData.departure_date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Arrival Time"
                            name="arrival_time"
                            type="time"
                            value={formData.arrival_time}
                            onChange={handleChange}
                        />
                        <Input
                            label="Departure Time"
                            name="departure_time"
                            type="time"
                            value={formData.departure_time}
                            onChange={handleChange}
                        />
                    </div>

                    <Input
                        label="Stay Duration (Hours)"
                        name="stay_duration_hours"
                        type="number"
                        value={formData.stay_duration_hours}
                        onChange={handleChange}
                        min="1"
                    />

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)} fullWidth>
                            Cancel
                        </Button>
                        <Button type="button" variant="primary" onClick={addDestination} loading={loadingAdd} fullWidth>
                            Add Destination
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Add Food Plan Modal */}
            <Modal isOpen={showFoodModal} onClose={() => setShowFoodModal(false)} title={`Add Meal Plan for ${selectedDestination?.destination_details?.name || 'Destination'}`} size="md">
                <div className="space-y-4">
                    <Input
                        label="Day Number *"
                        name="day_number"
                        type="number"
                        value={foodFormData.day_number}
                        onChange={handleFoodChange}
                        placeholder="1, 2, 3..."
                        required
                    />

                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Meal Type *</label>
                        <select
                            name="meal_type"
                            value={foodFormData.meal_type}
                            onChange={handleFoodChange}
                            className="input-field"
                        >
                            {mealTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Meal Description"
                        name="meal_description"
                        value={foodFormData.meal_description}
                        onChange={handleFoodChange}
                        placeholder="e.g., Traditional Bangladeshi Breakfast"
                    />

                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Meal Items *</label>
                        <textarea
                            name="meal_items"
                            value={foodFormData.meal_items}
                            onChange={handleFoodChange}
                            className="input-field"
                            rows="3"
                            placeholder="e.g., Rice, Fish Curry, Vegetables, Salad"
                            required
                        />
                    </div>

                    <Input
                        label="Dietary Options"
                        name="dietary_options"
                        value={foodFormData.dietary_options}
                        onChange={handleFoodChange}
                        placeholder="e.g., Vegetarian, Halal, Gluten-free"
                    />

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setShowFoodModal(false)} fullWidth>
                            Cancel
                        </Button>
                        <Button type="button" variant="primary" onClick={addFoodPlan} loading={loadingFood} fullWidth>
                            Add Meal Plan
                        </Button>
                    </div>
                </div>
            </Modal>
        </Modal>
    );
};

export default DestinationForm;