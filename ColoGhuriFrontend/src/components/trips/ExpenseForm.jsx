import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import toast from 'react-hot-toast';

const ExpenseForm = ({ tripId, onClose, onSuccess }) => {
    const { post, loading } = useApi();
    const [formData, setFormData] = useState({
        category: 'transport',
        amount: '',
        description: '',
        expense_date: new Date().toISOString().split('T')[0]
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }
        
        if (!formData.description.trim()) {
            toast.error('Please enter a description');
            return;
        }
        
        const result = await post('/trips/add-expense/', { 
            trip: tripId,
            category: formData.category,
            amount: parseFloat(formData.amount),
            description: formData.description,
            expense_date: formData.expense_date
        });
        
        if (result) {
            toast.success('Expense added successfully');
            onSuccess();
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Add Expense" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">Category *</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="input-field"
                        required
                    >
                        {EXPENSE_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2 font-medium">Amount (BDT) *</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2 font-medium">Description *</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g., Bus ticket, Hotel booking, Food"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2 font-medium">Date *</label>
                    <input
                        type="date"
                        name="expense_date"
                        value={formData.expense_date}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose} fullWidth>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" loading={loading} fullWidth>
                        Add Expense
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ExpenseForm;