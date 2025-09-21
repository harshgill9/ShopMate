import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from './Loader';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setErrors({});
    setSuccess('');
    setLoading(true);

    let formErrors = {};
    if (!formData.name.trim()) formErrors.name = 'Name is required.';
    if (!formData.username.trim()) formErrors.username = 'Username is required.';
    if (!formData.email.trim()) formErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) formErrors.email = 'Email is invalid.';
    if (!formData.phoneNumber.trim()) formErrors.phoneNumber = 'Phone number is required.';
    else if (!/^\d{10}$/.test(formData.phoneNumber)) formErrors.phoneNumber = 'Phone number must be 10 digits.';
    if (!formData.password.trim()) formErrors.password = 'Password is required.';
    else if (formData.password.length < 6) formErrors.password = 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword) formErrors.confirmPassword = 'Passwords do not match.';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData; // Keep phoneNumber in userData
      const registrationSuccess = await register(userData);
      console.log("Registration Success:", registrationSuccess);

      if (registrationSuccess) {
        toast.success('Registration successful 🎉');
        setSuccess('Registration successful 🎉');
        setFormData({
          name: '',
          username: '',
          email: '',
          phoneNumber: '',
          password: '',
          confirmPassword: ''
        });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error('Registration failed. Please try again.');
        setErrors({ api: 'Registration failed. Please try again.' });
      }
    } catch (err) {
      console.error('Full error object:', err);
      if (err.response) {
        console.error('Backend response data:', err.response.data);
        setErrors({ api: err.response.data.message || 'Server Error' });
      } else {
        setErrors({ api: err.message || 'Server Error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 flex-grow flex flex-col items-center justify-center p-4 mb-[-30rem] dark:bg-gray-900 transition-colors duration-300 min-h-screen ">
      <div className="max-w-md w-full mt-10 bg-white p-8 rounded-2xl shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">

        {success && (
          <div className="rounded-md bg-green-50 p-4 dark:bg-green-900 mb-4 dark:text-green-100 dark:border-green-700 border border-green-200 dark:border">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 dark:text-green-100 dark:border-green-700">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-100">{success}</h3>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">Create an Account</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          {/* form inputs as you had them */}
          {/* ... */}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
          {errors.api && <p className="text-red-600 text-center mt-2">{errors.api}</p>}
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
