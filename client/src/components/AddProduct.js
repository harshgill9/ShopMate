import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: '',
    rating: '',
    reviews: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, description, price, category, stock, rating, reviews } = formData;

    if (!name.trim() || !description.trim() || !price || !category.trim() || !stock || !selectedFile) {
      alert("Please fill all required fields before submitting the form.");
      return;
    }

    const productFormData = new FormData();
    productFormData.append('name', formData.name);
    productFormData.append('description', formData.description);
    productFormData.append('price', parseFloat(formData.price));
    productFormData.append('category', formData.category);
    productFormData.append('stock', parseInt(formData.stock));
    productFormData.append('rating', formData.rating ? parseFloat(formData.rating) : 0);
    productFormData.append('reviews', formData.reviews ? parseInt(formData.reviews) : 0);
    productFormData.append('image', selectedFile);

    try {
      const response = await axios.post(`${API_URL}/api/products`, productFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Product added:', response.data);
      alert('Product added successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Error adding product:', error.response ? error.response.data : error.message);
      alert(`Failed to add product: ${
        error.response ? (error.response.data.error || JSON.stringify(error.response.data.errors) || error.response.data.message) : error.message
      }`);
    }
  };

  return (
    <div className="container mx-auto p-4 mt-16 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-600 dark:text-purple-400">➕ Add New Product</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg mx-auto border border-gray-200 dark:border-gray-700"
      >
        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300" htmlFor="name">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300" htmlFor="description">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300" htmlFor="price">
            Price
          </label>
          <input
            type="number"
            name="price"
            id="price"
            value={formData.price}
            onChange={handleChange}
            className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300" htmlFor="image">
            Product Image
          </label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleFileChange}
            className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 rounded w-full py-2 px-3 focus:outline-none"
          />
          {selectedFile && <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">Selected: {selectedFile.name}</p>}
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300" htmlFor="category">
            Category
          </label>
          <input
            type="text"
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
            className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Stock */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300" htmlFor="stock">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            id="stock"
            value={formData.stock}
            onChange={handleChange}
            className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Rating */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300" htmlFor="rating">
            Rating (0-5)
          </label>
          <input
            type="number"
            step="0.1"
            name="rating"
            id="rating"
            value={formData.rating}
            onChange={handleChange}
            className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            min="0"
            max="5"
          />
        </div>

        {/* Reviews */}
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300" htmlFor="reviews">
            Number of Reviews
          </label>
          <input
            type="number"
            name="reviews"
            id="reviews"
            value={formData.reviews}
            onChange={handleChange}
            className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            min="0"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 dark:hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Add Product
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="bg-gray-600 hover:bg-gray-700 dark:hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
