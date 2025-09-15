// frontend/src/pages/ProductList.js
import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:5000/api/products');
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

      {/* Search Field (optional) */}
      {/* <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div> */}

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          Koi product nahi mila <strong className="text-black dark:text-white">"{searchTerm}"</strong>.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
