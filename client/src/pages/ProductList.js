// frontend/src/pages/ProductList.js
import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

// Environment variable se API base URL, agar nahi mila to localhost use karega
const API_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const ProductList = () => {
  // state aur baki cheezein waise hi rahengi
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // API call yaha update kiya gaya hai
        const response = await axios.get(`${API_URL}/api/products`);
        let fetchedProducts = response.data;

        const productsCount = fetchedProducts.length;
        const remainder = productsCount % 4;
        const placeholdersNeeded = remainder === 0 ? 0 : 4 - remainder;

        if (placeholdersNeeded > 0) {
          for (let i = 0; i < placeholdersNeeded; i++) {
            fetchedProducts.push({
              _id: `placeholder-${productsCount + i}`,
              isPlaceholder: true
            });
          }
        }

        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Products fetch mein error:', err.response ? err.response.data : err.message);
        setError('Products load nahi ho paaye. Kripya baad mein try karein.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const filteredProducts = products.filter((product) => {
    if (product.isPlaceholder) return false;
    const nameMatch = product.name?.toLowerCase().includes(searchTerm.trim().toLowerCase());
    const categoryMatch = product.category?.toLowerCase().includes(searchTerm.trim().toLowerCase());
    return nameMatch || categoryMatch;
  });

  return (
    <div className="container mx-auto p-8 mt-16 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-8 text-left text-gray-800 dark:text-white">Original Brands ✅</h1>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          Koi product nahi mila <strong className="text-black dark:text-white">"{searchTerm}"</strong>.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-8">
          {products.map((product) => (
            <div key={product._id}>
              {product.isPlaceholder ? (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md w-full h-full p-4 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <span>Coming Soon</span>
                </div>
              ) : (
                <Link to={`/product/${product._id}`}>
                  <ProductCard product={product} />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
