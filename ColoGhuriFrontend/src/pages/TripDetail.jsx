import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ExpenseForm from '../components/trips/ExpenseForm';
import { FaCalendarAlt, FaMoneyBillWave, FaMapMarkerAlt, FaPlus, FaTrash, FaArrowLeft, FaWallet } from 'react-icons/fa';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const TripDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { get, del, loading } = useApi();
    const [trip, setTrip] = useState(null);
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTripDetails();
    }, [id]);

    const fetchTripDetails = async () => {
        try {
            const data = await get(`/trips/${id}/`, {}, false);
            setTrip(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching trip:', err);
            setError('Trip not found');
        }
    };

    const handleDeleteExpense = async (expenseId) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await del(`/trips/expenses/${expenseId}/`);
                toast.success('Expense deleted');
                fetchTripDetails();
            } catch (err) {
                toast.error('Failed to delete expense');
            }
        }
    };

    const handleDeleteTrip = async () => {
        if (window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
            try {
                await del(`/trips/${id}/`);
                toast.success('Trip deleted successfully');
                navigate('/my-trips');
            } catch (err) {
                toast.error('Failed to delete trip');
            }
        }
    };

    if (loading) return <LoadingSpinner />;
    
    if (error) {
        return (
            <div className="container-custom py-8">
                <div className="text-center py-12 bg-white rounded-2xl shadow">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Link to="/my-trips" className="btn-primary">Back to My Trips</Link>
                </div>
            </div>
        );
    }
    
    if (!trip) return <div className="text-center py-12">Trip not found</div>;

    const totalSpent = trip.expenses?.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) || 0;
    const remainingBudget = (trip.total_budget || 0) - totalSpent;

    return (
        <div className="container-custom py-8">
            <div className="mb-4">
                <Link to="/my-trips" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors">
                    <FaArrowLeft /> Back to My Trips
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-8 text-white">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">{trip.trip_name}</h1>
                            <p className="text-primary-100 mt-2">Trip ID: #{trip.trip_id}</p>
                        </div>
                        <button 
                            onClick={handleDeleteTrip} 
                            className="bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
                        >
                            <FaTrash /> Delete Trip
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <FaWallet className="text-blue-600 text-xl" />
                                <p className="text-sm text-gray-600">Total Budget</p>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">{formatCurrency(trip.total_budget || 0)}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <FaMoneyBillWave className="text-green-600 text-xl" />
                                <p className="text-sm text-gray-600">Total Spent</p>
                            </div>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSpent)}</p>
                        </div>
                        <div className={`bg-gradient-to-br rounded-xl p-4 ${remainingBudget >= 0 ? 'from-emerald-50 to-emerald-100' : 'from-red-50 to-red-100'}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <FaWallet className={`text-xl ${remainingBudget >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
                                <p className="text-sm text-gray-600">Remaining Budget</p>
                            </div>
                            <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {formatCurrency(Math.abs(remainingBudget))} {remainingBudget < 0 && '(Over Budget)'}
                            </p>
                        </div>
                    </div>

                    {/* Trip Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <FaCalendarAlt className="text-primary-600" /> Trip Dates
                            </h3>
                            <p>{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Duration: {Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24))} days
                            </p>
                        </div>
                        {trip.notes && (
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h3 className="font-semibold mb-2">Notes</h3>
                                <p className="text-gray-600">{trip.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Destinations Section */}
                    {trip.destinations && trip.destinations.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-4">Destinations</h2>
                            <div className="space-y-3">
                                {trip.destinations.map((dest, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                            <span className="text-primary-600 font-bold">{idx + 1}</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">{dest.destination_details?.name || 'Destination'}</p>
                                            <p className="text-sm text-gray-500">{formatDate(dest.visit_date)}</p>
                                        </div>
                                        <p className="font-semibold text-primary-600">{formatCurrency(dest.estimated_cost)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Expenses Section */}
                    <div>
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                            <h2 className="text-xl font-bold">Expenses</h2>
                            <button 
                                onClick={() => setShowExpenseForm(true)} 
                                className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                            >
                                <FaPlus /> Add Expense
                            </button>
                        </div>

                        {trip.expenses && trip.expenses.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 rounded-xl">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold">Amount</th>
                                            <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {trip.expenses.map((expense) => (
                                            <tr key={expense.expense_id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 text-sm">{formatDate(expense.expense_date)}</td>
                                                <td className="px-4 py-3">
                                                    <span className="badge badge-primary capitalize">{expense.category}</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm">{expense.description}</td>
                                                <td className="px-4 py-3 text-right font-semibold text-primary-600">
                                                    {formatCurrency(expense.amount)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button 
                                                        onClick={() => handleDeleteExpense(expense.expense_id)} 
                                                        className="text-red-500 hover:text-red-700 transition-colors"
                                                        title="Delete expense"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50 font-bold">
                                        <tr>
                                            <td colSpan="3" className="px-4 py-3 text-right">Total:</td>
                                            <td className="px-4 py-3 text-right text-primary-600">{formatCurrency(totalSpent)}</td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-xl">
                                <p className="text-gray-500 mb-4">No expenses added yet</p>
                                <button onClick={() => setShowExpenseForm(true)} className="btn-primary text-sm">
                                    Add Your First Expense
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showExpenseForm && (
                <ExpenseForm
                    tripId={trip.trip_id}
                    onClose={() => setShowExpenseForm(false)}
                    onSuccess={() => {
                        setShowExpenseForm(false);
                        fetchTripDetails();
                    }}
                />
            )}
        </div>
    );
};

export default TripDetail;