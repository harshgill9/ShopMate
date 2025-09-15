// // frontend/src/pages/userLogin.js

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';


// // Component ka naam Login se UserLogin kar diya gaya hai
// const UserLogin = () => {
//   // State to manage form data
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });

//   // State for form errors and submission status
//   const [errors, setErrors] = useState({});

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

//     let formErrors = {};
//     const { email, password } = formData;

//     // Basic validation
//     if (!email.trim()) {
//       formErrors.email = 'Email is required.';
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       formErrors.email = 'Email address is invalid.';
//     }
//     if (!password) {
//       formErrors.password = 'Password is required.';
//     }

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     // Agar saari validation pass ho jaye
//     // Yahan par hum backend API call karenge
//     // Abhi ke liye hum sirf console.log kar rahe hain
//     console.log('Login data submitted:', formData);

//     // Form ko reset karo
//     setFormData({
//       email: '',
//       password: '',
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
//         <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
//           Login
//         </h2>
//         <form onSubmit={handleSubmit}>
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
//           <div className="mb-6">
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

//           <div className="flex items-center justify-between">
//             <button
//               type="submit"
//               className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               Login
//             </button>
//             <Link to="/signup" className="inline-block align-baseline font-bold text-sm text-purple-500 hover:text-purple-800">
//               Don't have an account? Sign Up
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserLogin;
