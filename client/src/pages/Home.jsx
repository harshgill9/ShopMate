// frontend/src/pages/Home.js
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import ProductList from "../pages/ProductList"; 
import HeroBanner from "../components/HeroBanner";
import { useAuth } from "../context/AuthContext"; 

const Home = () => {
    const navigate = useNavigate();
    const [isSticky, setIsSticky] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        return () => {};
    }, []);

    const dynamicImageUrl = `https://placehold.co/1200x400/805ad5/ffffff?text=Online+Shopping+Made+Easy`;

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
            
            {/* Hero Banner */}
            <HeroBanner />

            {/* Features Row */}
            <div className="bg-white dark:bg-gray-800 py-3 shadow-sm border-t border-gray-200 dark:border-gray-700 mt-8">
                <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2"><span>🚚</span> 7 Days Easy Return</div>
                    <div className="flex items-center gap-2"><span>💳</span> Cash on Delivery</div>
                    <div className="flex items-center gap-2"><span>🔥</span> Lowest Prices</div>
                </div>
            </div>

            {/* Product Section */}
            <ProductList />

            {/* Footer */}
            <footer className="text-center py-6 mt-8 border-t border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    © 2025 ShopMate 🛍️. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default Home;
