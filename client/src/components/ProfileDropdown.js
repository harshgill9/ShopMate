import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; 
import { toast } from 'react-toastify';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    toast.success("Logout successfully");
    navigate('/');
  };

  const getGreeting = () => {
    return user ? `Hello, ${user.username}` : 'Hello, Guest';
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Icon */}
      <div className="flex items-center space-x-2 cursor-pointer">
        <FaUserCircle className="text-2xl text-gray-200" />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
          <div className="py-1">
            <p className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
              {getGreeting()}
            </p>
            {user ? (
              <>
                <Link
                  to="/orders"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white"
                >
                  Logout
                </button>
                <button
                  onClick={() => {
                    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
                    if (confirmDelete) {
                      setIsOpen(false);
                      deleteAccount();
                    }
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 bg-red-100 hover:bg-red-200 hover:text-red-900 dark:bg-red-400 dark:hover:text-red-700 dark:hover:bg-red-200 dark:text-gray-100"
                >
                  Delete Account
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
