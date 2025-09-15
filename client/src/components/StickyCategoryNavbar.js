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
                       ${isSticky ? 'fixed top-16 w-full z-40 transition-all duration-300' : 'relative'}`}>
            {/* <div className="max-w-7xl mx-auto px-4 py-5 flex flex-wrap gap-16 justify-center">
                {[
                    "Women Ethnic", "Men", "Kids", "Home & Kitchen",
                    "Beauty & Health", "Jewellery & Accessories", "Bags & Footwear",
                    "Electronics"
                ].map((item) => (
                    <button
                        key={item}
                        onClick={() => handleCategoryClick(item)}
                        className="cursor-pointer hover:text-pink-600 focus:outline-none"
                    >
                        {item}
                    </button>
                ))}
            </div> */}
        </div>
    );
};

export default StickyCategoryNavbar;
