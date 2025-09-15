import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
// AuthService se functions import karein
import { register as authRegister, login as authLogin } from '../services/AuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Initial load par authentication state check karein
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['x-auth-token'] = token;
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                setUser(storedUser);
                setIsLoggedIn(true);
            }
        }
    }, []);

    // Function to handle user registration
    const register = async (formData) => {
        try {
            // AuthService ke register function ko call karein
            const resData = await authRegister(formData);

            // Response data ko local storage aur state mein save karein
            localStorage.setItem('token', resData.token);
            localStorage.setItem('user', JSON.stringify(resData.user));
            setUser(resData.user);
            setIsLoggedIn(true);
            axios.defaults.headers.common['x-auth-token'] = resData.token;
            alert('Registration Successful!');
            return true;
        } catch (err) {
            console.error("Full Error Object:", err);
            const errorMessage = err.message || 'Registration failed';
            alert(errorMessage);
            throw err;
        }
    };

    // Function to handle user login
    const login = async (formData) => {
        try {
            // AuthService ke login function ko call karein
            const resData = await authLogin(formData);

            // Response data ko local storage aur state mein save karein
            localStorage.setItem('token', resData.token);
            localStorage.setItem('user', JSON.stringify(resData.user));
            setUser(resData.user);
            setIsLoggedIn(true);
            axios.defaults.headers.common['x-auth-token'] = resData.token;
            alert('Login Successful!');
            return true;
        } catch (err) {
            alert(err.message);
            throw err;
        }
    };

    // Function to handle user logout
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsLoggedIn(false);
        delete axios.defaults.headers.common['x-auth-token'];
        alert('Logged out successfully.');
    };

    const value = {
        user,
        isLoggedIn,
        register,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
