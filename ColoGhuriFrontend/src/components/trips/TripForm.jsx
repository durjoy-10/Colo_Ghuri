import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import Modal from '../common/Modal';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const TripForm = ({ onClose, onSuccess, tripToEdit }) => {
    const { post, put, loading } = useApi();
    const [formData, setFormData] = useState({
        trip_name: tripToEdit?.trip_name || '',
        start_date: tripToEdit?.start_date || '',
        end_date: tripToEdit?.end_date || '',
        total_budget: tripToEdit?.total_budget || '',
        notes: tripToEdit?.notes || ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.trip_name || formData.trip_name.trim() === '') {
            newErrors.trip_name = 'Trip name is required';
        }
        
        if (!formData.start_date) {
            newErrors.start_date = 'Start date is required';
        }
        
        if (!formData.end_date) {
            newErrors.end_date = 'End date is required';
        }
        
        if (formData.start_date && formData.end_date && new Date(formData.start_date) > new Date(formData.end_date)) {
            newErrors.end_date = 'End date must be after start date';
        }
        
        if (formData.total_budget && parseFloat(formData.total_budget) < 0) {
            newErrors.total_budget = 'Budget cannot be negative';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }
        
        // Prepare data for API - NO traveller field
        const submitData = {
            trip_name: formData.trip_name.trim(),
            start_date: formData.start_date,
            end_date: formData.end_date,
            total_budget: parseFloat(formData.total_budget) || 0,
            notes: formData.notes || ''
        };
        
        console.log('Submitting trip data:', submitData);
        
        try {
            let result;
            if (tripToEdit) {
                result = await put(`/trips/${tripToEdit.trip_id}/`, submitData);
            } else {
                result = await post('/trips/', submitData);
            }
            
            if (result) {
                toast.success(tripToEdit ? 'Trip updated successfully' : 'Trip created successfully');
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Trip save error:', error);
            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to save trip';
            toast.error(errorMessage);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={tripToEdit ? 'Edit Trip' : 'Create New Trip'} size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        Trip Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="trip_name"
                        value={formData.trip_name}
                        onChange={handleChange}
                        className={`input-field ${errors.trip_name ? 'border-red-500' : ''}`}
                        placeholder="e.g., Summer Vacation 2026"
                    />
                    {errors.trip_name && (
                        <p className="text-red-500 text-xs mt-1">{errors.trip_name}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">
                            Start Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            className={`input-field ${errors.start_date ? 'border-red-500' : ''}`}
                        />
                        {errors.start_date && (
                            <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">
                            End Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            className={`input-field ${errors.end_date ? 'border-red-500' : ''}`}
                        />
                        {errors.end_date && (
                            <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        Total Budget (BDT)
                    </label>
                    <input
                        type="number"
                        name="total_budget"
                        value={formData.total_budget}
                        onChange={handleChange}
                        className={`input-field ${errors.total_budget ? 'border-red-500' : ''}`}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                    />
                    {errors.total_budget && (
                        <p className="text-red-500 text-xs mt-1">{errors.total_budget}</p>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        Notes
                    </label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="input-field"
                        rows="3"
                        placeholder="Any special notes or requirements?"
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose} fullWidth>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" loading={loading} fullWidth>
                        {tripToEdit ? 'Update Trip' : 'Create Trip'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default TripForm;