export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const validatePhone = (phone) => {
    const regex = /^\+?[0-9]{10,15}$/;
    return regex.test(phone);
};

export const validatePassword = (password) => {
    return password && password.length >= 6;
};

export const validateUsername = (username) => {
    return username && username.length >= 3 && username.length <= 50;
};

export const validateRequired = (value) => {
    return value && value.trim().length > 0;
};

export const validateNumber = (value) => {
    return !isNaN(value) && value > 0;
};