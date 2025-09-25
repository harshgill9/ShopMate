// frontend/src/components/Navbar.js
import ThemeToggle from './ThemeToggle';
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import {
    FaShoppingCart,
    FaHome,
    FaUserShield,
    FaBars,
    FaTimes,
    FaSearch,
    FaUser,
    FaBox
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useLoader } from '../context/LoaderContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn, user } = useAuth();
    const { setLoading } = useLoader();
    const { cartItems } = useCart();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            try {
                setLoading(true);
                navigate(`/search?q=${searchTerm.trim()}`);
                setSearchTerm('');
            } catch (error) {
                console.error('Navigation error:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAdminClick = () => {
        navigate('/admin/login');
        setIsMenuOpen(false); // Close menu
    };

    const handleNavigate = (path) => {
        navigate(path);
        setIsMenuOpen(false); // Close menu after navigation
    };

    const categories = [
        { name: 'Men', link: '/category/men' },
        { name: 'Women Ethnic', link: '/category/women-ethnic' },
        { name: 'Girls', link: '/category/girls' },
        { name: 'Electronics', link: '/category/electronics' },
        { name: 'Home & Kitchen', link: '/category/home-and-kitchen' },
        { name: 'Beauty & Health', link: '/category/beauty-and-health' },
        { name: 'Jewellery & Accessories', link: '/category/jewellery-and-accessories' },
        { name: 'Bags', link: '/category/bags' },
        { name: 'Clock', link: '/category/clock' },
        { name: 'Wall Clock', link: '/category/wall-clock' },
    ];

    return (
        <nav className="bg-gradient-to-r from-purple-700 to-pink-500 p-4 shadow-lg fixed w-full top-0 z-50 dark:bg-gray-900">
            <div className="container mx-auto flex flex-col md:flex-row md:justify-between md:items-center text-white relative">

                {/* Logo and Mobile Menu Button */}
                <div className="flex justify-between items-center w-full md:w-auto">
                    <Link to="/" className="text-2xl font-bold md:flex-shrink-0">
                        ShopMate 🛍️
                    </Link>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white focus:outline-none p-2"
                        >
                            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <form
                    onSubmit={handleSearch}
                    className="relative w-full mt-4 md:mt-0 md:flex-1 md:mx-4"
                >
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full py-2 pr-12 pl-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 dark:bg-gray-900"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="absolute right-1 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md"
                    >
                        <FaSearch />
                    </button>
                </form>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex md:items-center md:space-x-6 mt-4 md:mt-0">
                    <Link to="/" className="flex flex-col items-center space-y-1 hover:text-gray-200 transition">
                        <FaHome className="text-lg" />
                        <span className="text-xs">Home</span>
                    </Link>

                    <Link to="/cart" className="relative flex flex-col items-center space-y-1 hover:text-gray-200 transition">
                        <FaShoppingCart className="text-lg" />
                        <span className="text-xs">Cart</span>
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                            </span>
                        )}
                    </Link>

                    <div className="flex flex-col items-center space-y-1 hover:text-gray-200 transition">
                        <ProfileDropdown />
                        <span className="text-xs">Profile</span>
                    </div>

                    <div
                        onClick={handleAdminClick}
                        className={`flex flex-col items-center space-y-1 text-yellow-300 cursor-pointer hover:text-yellow-100 transition duration-200 ${
                            location.pathname.startsWith('/admin') ? 'font-bold' : ''
                        }`}
                    >
                        <FaUserShield className="text-lg text-yellow-300" />
                        <span className="text-xs">Admin</span>
                    </div>
                    <ThemeToggle />
                </div>

                {/* Mobile Slide-in Menu */}
                <div
                    className={`fixed top-0 right-0 h-full w-60 bg-white dark:bg-gray-900 text-black dark:text-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    {/* Close Button */}
                    <div className="flex justify-between items-center px-4 pt-4">
                        <ThemeToggle />
                        <button onClick={() => setIsMenuOpen(false)}>
                            <FaTimes className=" text-xl text-gray-800 hover:text-red-500 dark:text-red-500 dark:hover:bg-red-200" />
                        </button>
                    </div>

                    {/* Menu Items */}
                    <div className="flex flex-col mt-2 space-y-4 px-4">
                        <button onClick={() => handleNavigate('/')} className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-2 rounded">
                            <FaHome />
                            <span>Home</span>
                        </button>

                        <button onClick={() => handleNavigate('/cart')} className="relative flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-2 rounded">
                            <FaShoppingCart />
                            <span>Cart</span>
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                                </span>
                            )}
                        </button>

                        <button onClick={() => handleNavigate('/orders')} className="flex items-center space-x-2 hover:bg-gray-100 px-2 py-2 rounded dark:hover:bg-gray-700">
                            <FaBox />
                            <span>Orders</span>
                        </button>

                        <button onClick={() => handleNavigate('/profile')} className="flex items-center space-x-2 hover:bg-gray-100 px-2 py-2 rounded dark:hover:bg-gray-700">
                            <FaUser />
                            <span>Profile</span>
                        </button>

                        <button onClick={handleAdminClick} className="flex items-center space-x-2 hover:bg-gray-100 px-2 py-2 rounded dark:hover:bg-gray-700">
                            <FaUserShield />
                            <span>Admin</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="container mx-auto mt-2 p-2 text-white rounded-lg shadow-md sticky top-16 bg-gradient-to-r from-purple-700 to-pink-500 md:relative md:mt-0 md:bg-transparent md:shadow-none">
                <div className="flex justify-start md:justify-center space-x-4 text-sm font-medium overflow-x-auto scrollbar-hide whitespace-nowrap pt-32 md:pt-0 px-2">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            to={category.link}
                            className="hover:text-red-300 hover:underline transition duration-200 whitespace-nowrap px-2 py-1 rounded-md"
                        >
                            {category.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
