// frontend/src/services/OrderService.js

// API ka base URL set karein
const API_URL = 'http://localhost:5001/api/orders';

/**
 * User ke sabhi orders ko fetch karta hai.
 * @returns {Promise<Object>} - Orders ka data.
 */
export const getOrders = async () => {
    // Local Storage se JWT token lein
    const token = localStorage.getItem('token');

    // Agar token nahi hai, toh user logged in nahi hai
    if (!token) {
        throw new Error('User is not authenticated. Please log in.');
    }

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                // Token ko Authorization header mein 'Bearer' ke saath bhejein
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch orders');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

/**
 * Naya order create karta hai.
 * @param {Object} orderData - Order details jaise productId aur quantity.
 * @returns {Promise<Object>} - Naye order ka data.
 */
export const createOrder = async (orderData) => {
    // Local Storage se JWT token lein
    const token = localStorage.getItem('token');

    // Agar token nahi hai, toh user logged in nahi hai
    if (!token) {
        throw new Error('User is not authenticated. Please log in.');
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create order');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};
