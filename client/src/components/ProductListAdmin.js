import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from "../components/Loader";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const getImageUrl = (image) => {
  if (!image) return '';
  if (image.startsWith('http://')) {
    return image.replace('http://', 'https://');
  }
  if (image.startsWith('https://')){
    return image;
  }
  return `${API_URL}/uploads/${image}`;
};

const EditProductForm = ({ product, onSave, onCancel, theme }) => {
  const [formData, setFormData] = useState({
    name: product.name || '',
    description: product.description || '',
    price: product.price || '',
    image: product.image || '',
    category: product.category || '',
    stock: product.stock || 0,
    rating: product.rating || 0,
    reviews: product.reviews || 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        price: parseFloat(formData.price),
        rating: parseFloat(formData.rating),
        reviews: parseInt(formData.reviews),
        stock: parseInt(formData.stock),
      };
      const res = await axios.put(`${API_URL}/api/products/${product._id}`, updatedData);
      onSave(res.data);
      alert('Product updated successfully!');
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Failed to update product.');
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center p-4 z-50
      ${theme === 'dark' ? 'bg-black bg-opacity-80' : 'bg-gray-200 bg-opacity-70'}`}>
      <div className={`${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-900'}
        p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto`}>
        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit}>
          {[
            { label: 'Name', name: 'name', type: 'text' },
            { label: 'Description', name: 'description', type: 'text' },
            { label: 'Price', name: 'price', type: 'number' },
            { label: 'Image URL', name: 'image', type: 'text' },
            { label: 'Category', name: 'category', type: 'text' },
            { label: 'Stock', name: 'stock', type: 'number' },
            { label: 'Rating', name: 'rating', type: 'number', step: '0.1' },
            { label: 'Reviews', name: 'reviews', type: 'number' },
          ].map(({ label, name, type, step }) => (
            <div key={name} className="mb-4">
              <label htmlFor={name} className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} block text-sm font-medium`}>
                {label}
              </label>
              <input
                type={type}
                step={step}
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required={['name', 'price'].includes(name)}
                className={`${theme === 'dark'
                  ? 'mt-1 p-2 w-full border border-gray-700 rounded-md bg-gray-800 text-gray-100 placeholder-gray-500 focus:ring-blue-600 focus:outline-none'
                  : 'mt-1 p-2 w-full border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:outline-none'}`}
              />
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className={`${theme === 'dark'
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-300 text-gray-800 hover:bg-gray-400'} px-4 py-2 rounded transition`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${theme === 'dark'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-600'} px-4 py-2 rounded transition`}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProductListAdmin = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('light'); // light by default

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError('Error fetching products.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_URL}/api/products/${id}`);
        setProducts(products.filter((p) => p._id !== id));
        alert('Product deleted.');
      } catch (err) {
        console.error(err);
        alert('Failed to delete product.');
      }
    }
  };

  const handleEditClick = (product) => setEditingProduct(product);
  const handleEditCancel = () => setEditingProduct(null);
  const handleEditSave = (updated) => {
    setProducts(products.map((p) => (p._id === updated._id ? updated : p)));
    setEditingProduct(null);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-900'} min-h-screen container mx-auto px-4 pt-20`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`${theme === 'dark'
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              : 'bg-gray-300 text-gray-900 hover:bg-gray-400'} px-4 py-2 rounded transition`}
          >
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
          <Link
            to="/admin/add-product"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Add Product
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-center`}>
          No products available.
        </p>
      ) : (
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} overflow-x-auto shadow rounded-lg`}>
          <table className="min-w-full table-auto">
            <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <tr>
                {['Image', 'Name', 'Category', 'Price', 'Stock', 'Rating', 'Reviews', 'Actions'].map((head) => (
                  <th
                    key={head}
                    className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} px-4 py-2 text-left text-xs font-medium uppercase`}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p._id}
                  className={`${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700 border-t' : 'border-gray-300 hover:bg-gray-100 border-t'}`}
                >
                  <td className="px-4 py-3">
                    {p.image ? (
                      <img
                        src={getImageUrl(p.image)}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className={`${theme === 'dark' ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-500'} w-16 h-16 flex items-center justify-center text-xs rounded`}>
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3">₹{p.price}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">{p.rating || 'N/A'}</td>
                  <td className="px-4 py-3">{p.reviews || 'N/A'}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleEditClick(p)}
                      className={`${theme === 'dark'
                        ? 'text-indigo-400 border border-indigo-400 hover:bg-indigo-600 hover:text-white'
                        : 'text-indigo-600 border border-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'} px-2 py-1 rounded transition`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className={`${theme === 'dark'
                        ? 'text-red-400 border border-red-400 hover:bg-red-600 hover:text-white'
                        : 'text-red-600 border border-red-600 hover:bg-red-50 hover:text-red-700'} px-2 py-1 rounded transition`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
          theme={theme}
        />
      )}
    </div>
  );
};

export default ProductListAdmin;
