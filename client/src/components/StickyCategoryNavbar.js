// frontend/src/components/StickyCategoryNavbar.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StickyCategoryNavbar = () => {
    const navigate = useNavigate();
    const [isSticky, setIsSticky] = useState(false);

    // Yeh function scroll event ko handle karta hai
    useEffect(() => {
        const handleScroll = () => {
            // Navbar ko sticky banane ke liye, top se 120px scroll karna hoga
            if (window.scrollY > 120) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleCategoryClick = (categoryName) => {
        const formattedCategoryName = categoryName.replace(/ & /g, '-and-').replace(/ /g, '-').toLowerCase();
        navigate(`/search?q=${formattedCategoryName}`);
    };

    return (
        <div className={`
            ${isSticky ? 'fixed pt-32 md:pt-0 top-16 w-full z-40 transition-all duration-300' : 'relative'}`}>
        </div>
    );
};

export default StickyCategoryNavbar;
