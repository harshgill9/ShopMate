// // frontend/src/pages/userSignup.js

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// // Component ka naam Signup se UserSignup kar diya gaya hai
// const UserSignup = () => {
//   // State to manage form data
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });

//   // State for form errors and submission status
//   const [errors, setErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState('');

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setErrors({});
//     setSuccessMessage('');

//     let formErrors = {};
//     const { name, email, password, confirmPassword } = formData;

//     // Basic validation
//     if (!name.trim()) {
//       formErrors.name = 'Name is required.';
//     }
//     if (!email.trim()) {
//       formErrors.email = 'Email is required.';
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       formErrors.email = 'Email address is invalid.';
//     }
//     if (!password) {
//       formErrors.password = 'Password is required.';
//     } else if (password.length < 6) {
//       formErrors.password = 'Password must be at least 6 characters.';
//     }
//     if (password !== confirmPassword) {
//       formErrors.confirmPassword = 'Passwords do not match.';
//     }

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     // Agar saari validation pass ho jaye
//     // Yahan par hum backend API call karenge
//     // Abhi ke liye hum sirf console.log kar rahe hain
//     console.log('Form data submitted:', formData);

//     // Backend call successfully hone par
//     setSuccessMessage('Registration successful! Please login.');

//     // Form ko reset karo
//     setFormData({
//       name: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
//         <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
//           Sign Up
//         </h2>

//         {successMessage && (
//           <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
//             <span className="block sm:inline">{successMessage}</span>
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           {/* Name Field */}
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
//               Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
//                 errors.name ? 'border-red-500' : ''
//               }`}
//               placeholder="Your Name"
//             />
//             {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>}
//           </div>

//           {/* Email Field */}
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
//                 errors.email ? 'border-red-500' : ''
//               }`}
//               placeholder="you@example.com"
//             />
//             {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>}
//           </div>

//           {/* Password Field */}
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
//                 errors.password ? 'border-red-500' : ''
//               }`}
//               placeholder="********"
//             />
//             {errors.password && <p className="text-red-500 text-xs italic mt-1">{errors.password}</p>}
//           </div>

//           {/* Confirm Password Field */}
//           <div className="mb-6">
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               id="confirmPassword"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
//                 errors.confirmPassword ? 'border-red-500' : ''
//               }`}
//               placeholder="********"
//             />
//             {errors.confirmPassword && (
//               <p className="text-red-500 text-xs italic mt-1">{errors.confirmPassword}</p>
//             )}
//           </div>

//           <div className="flex items-center justify-between">
//             <button
//               type="submit"
//               className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               Register
//             </button>
//             <Link to="/login" className="inline-block align-baseline font-bold text-sm text-purple-500 hover:text-purple-800">
//               Already have an account?
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserSignup;
