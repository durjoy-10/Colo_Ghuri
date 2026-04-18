export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/users/login/',
    REGISTER: '/users/register/',
    REFRESH_TOKEN: '/users/token/refresh/',
    LOGOUT: '/users/logout/',
    PROFILE: '/users/profile/',
    USERS: '/users/users/',
    PENDING_GUIDES: '/users/pending-guides/',
    VERIFY_GUIDE: (id) => `/users/verify-guide/${id}/`,
    
    // Destinations
    DESTINATIONS: '/destinations/',
    DESTINATION_DETAIL: (id) => `/destinations/${id}/`,
    CREATE_DESTINATION: '/destinations/create/',
    UPDATE_DESTINATION: (id) => `/destinations/${id}/update/`,
    DELETE_DESTINATION: (id) => `/destinations/${id}/delete/`,
    
    // Tours
    TOURS: '/tours/',
    TOUR_DETAIL: (id) => `/tours/${id}/`,
    CREATE_TOUR: '/tours/create/',
    UPDATE_TOUR: (id) => `/tours/${id}/update/`,
    DELETE_TOUR: (id) => `/tours/${id}/delete/`,
    BOOK_TOUR: '/tours/book/',
    MY_BOOKINGS: '/tours/my-bookings/',
    
    // Trips
    TRIPS: '/trips/',
    TRIP_DETAIL: (id) => `/trips/${id}/`,
    ADD_EXPENSE: '/trips/add-expense/',
    
    // Guides
    GUIDE_GROUPS: '/guides/groups/',
    REGISTER_GUIDE_GROUP: '/guides/register-group/',
    PENDING_GROUPS: '/guides/pending-groups/',
    VERIFY_GROUP: (id) => `/guides/verify-group/${id}/`,
    REJECT_GROUP: (id) => `/guides/reject-group/${id}/`,
};

export const DESTINATION_TYPES = [
    'beach', 'mountain', 'historical', 'natural', 'religious', 'adventure', 'cultural'
];

export const EXPENSE_CATEGORIES = [
    'transport', 'accommodation', 'food', 'entry_fee', 'shopping', 'miscellaneous'
];

export const TOUR_STATUS = ['upcoming', 'ongoing', 'completed', 'cancelled'];

export const PAYMENT_METHODS = ['bkash', 'nagad', 'rocket', 'cash'];

export const USER_ROLES = {
    ADMIN: 'admin',
    GUIDE: 'guide',
    TRAVELLER: 'traveller'
};