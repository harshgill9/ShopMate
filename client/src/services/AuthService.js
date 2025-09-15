// frontend/src/services/AuthService.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

/**
 * Naye user ko register karne ke liye function.
 * @param {object} formData - Registration form ka data (username, email, password)
 */
export const register = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, formData);
        
        // Agar registration successful hai, to data return karein
        return response.data;
    } catch (err) {
        console.error('Registration failed:', err.response || err);
        const errorMessage = err.response?.data?.msg || err.message || 'Registration failed due to server error.';
        throw new Error(errorMessage);
    }
};

/**
 * User ko login karne ke liye function.
 * @param {object} formData - Login form ka data (email, password)
 */
export const login = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, formData);

        // Agar login successful hai, to data return karein
        return response.data;
    } catch (err) {
        console.error('Login failed:', err.response || err);
        const errorMessage = err.response?.data?.msg || err.message || 'Login failed due to server error.';
        throw new Error(errorMessage);
    }
};
