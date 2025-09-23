import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from "../components/Loader";

// Central API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Image URL builder
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

// ---------------------------------------------------------------------
// EditProductForm Modal
// ---------------------------------------------------------------------
const EditProductForm = ({ product, onSave, onCancel }) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Edit Product</h2>
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
              <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
              <input
                type={type}
                step={step}
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required={['name', 'price'].includes(name)}
                className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onCancel} className="bg-gray-400 dark:bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-600 dark:hover:bg-gray-500">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// ProductListAdmin Component
// ---------------------------------------------------------------------
const ProductListAdmin = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <Loader />;
  if (error) return <div className="text-center mt-20 text-red-600 dark:text-red-400">{error}</div>;

  return (
    <div className="container mx-auto px-4 mt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage Products</h1>
        <Link to="/admin/add-product" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 dark:hover:bg-green-500">
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">No products available.</p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                {['Image', 'Name', 'Category', 'Price', 'Stock', 'Rating', 'Reviews', 'Actions'].map((head) => (
                  <th key={head} className="px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3">
                    {p.image ? (
                      <img
                        src={getImageUrl(p.image)}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300 text-xs rounded">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{p.name}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{p.category}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">₹{p.price}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{p.stock}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{p.rating || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{p.reviews || 'N/A'}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleEditClick(p)}
                      className="text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900"
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
        />
      )}
    </div>
  );
};

export default ProductListAdmin;
