// // frontend/src/components/AddProduct.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const AddProduct = () => {
//     const navigate = useNavigate();
//     const [name, setName] = useState('');
//     const [description, setDescription] = useState('');
//     const [price, setPrice] = useState('');
//     const [category, setCategory] = useState('');
//     const [stock, setStock] = useState('');
//     const [image, setImage] = useState(null); // File object store karne ke liye
//     const [successMessage, setSuccessMessage] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setSuccessMessage('');
//         setErrorMessage('');

//         if (!name || !description || !price || !category || !stock || !image) {
//             setErrorMessage('Please fill all fields and select an image.');
//             setLoading(false);
//             return;
//         }

//         try {
//             // FormData ka use karke file aur baaki data ko backend par bhejenge
//             const formData = new FormData();
//             formData.append('name', name);
//             formData.append('description', description);
//             formData.append('price', price);
//             formData.append('category', category);
//             formData.append('stock', stock);
//             formData.append('image', image); // Image file ko append kar rahe hain

//             const response = await axios.post('http://localhost:5000/api/products', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data', // Is header ko lagana zaroori hai
//                 },
//             });

//             setSuccessMessage('Product added successfully!');
//             // Form ko reset karo
//             setName('');
//             setDescription('');
//             setPrice('');
//             setCategory('');
//             setStock('');
//             setImage(null);
//             // navigate('/admin/products'); // Agar tum products list par jana chaho
//         } catch (err) {
//             console.error('Error adding product:', err);
//             setErrorMessage('Failed to add product.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl mt-10">
//             <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-800">Add New Product</h2>
//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                     <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">Product Name</label>
//                     <input
//                         type="text"
//                         id="name"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">Description</label>
//                     <textarea
//                         id="description"
//                         value={description}
//                         onChange={(e) => setDescription(e.target.value)}
//                         rows="4"
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
//                         required
//                     />
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                         <label className="block text-gray-700 font-semibold mb-2" htmlFor="price">Price</label>
//                         <input
//                             type="number"
//                             id="price"
//                             value={price}
//                             onChange={(e) => setPrice(e.target.value)}
//                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-gray-700 font-semibold mb-2" htmlFor="category">Category</label>
//                         <input
//                             type="text"
//                             id="category"
//                             value={category}
//                             onChange={(e) => setCategory(e.target.value)}
//                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
//                             required
//                         />
//                     </div>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                         <label className="block text-gray-700 font-semibold mb-2" htmlFor="image">Image File</label>
//                         <input
//                             type="file"
//                             id="image"
//                             onChange={(e) => setImage(e.target.files[0])} // File ko state mein store karo
//                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-gray-700 font-semibold mb-2" htmlFor="stock">Stock</label>
//                         <input
//                             type="number"
//                             id="stock"
//                             value={stock}
//                             onChange={(e) => setStock(e.target.value)}
//                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
//                             required
//                         />
//                     </div>
//                 </div>
//                 <button
//                     type="submit"
//                     className="w-full bg-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-pink-700 transition duration-300 focus:outline-none focus:ring-4 focus:ring-pink-500 focus:ring-opacity-50"
//                     disabled={loading}
//                 >
//                     {loading ? 'Adding Product...' : 'Add Product'}
//                 </button>
//                 {successMessage && <p className="text-center text-green-600 mt-4">{successMessage}</p>}
//                 {errorMessage && <p className="text-center text-red-600 mt-4">{errorMessage}</p>}
//             </form>
//         </div>
//     );
// };

// export default AddProduct;

