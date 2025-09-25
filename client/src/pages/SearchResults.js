// frontend/src/pages/SearchResults.js
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useLoader } from '../context/LoaderContext';
import ProductCard from '../components/ProductCard';
import StickyCategoryNavbar from '../components/StickyCategoryNavbar';
import Loader from '../components/Loader';

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { categoryName: pathCategoryName } = useParams();

  const searchQuery = queryParams.get('q') || '';
  const queryCategory = queryParams.get('category') || '';
  const categoryFilter = pathCategoryName || queryCategory;

  const [results, setResults] = useState([]);
  const { loading, setLoading } = useLoader();
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${baseURL}/api/products/search?`;
        const params = [];

        if (searchQuery) {
          params.push(`q=${encodeURIComponent(searchQuery)}`);
        }

        if (categoryFilter) {
          params.push(`category=${encodeURIComponent(categoryFilter)}`);
        }

        if (params.length === 0 && !categoryFilter) {
          setResults([]);
          setLoading(false);
          return;
        }

        url += params.join('&');
        const response = await axios.get(url);
        setResults(response.data);
      } catch (err) {
        console.error('Error fetching search results:', err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'Failed to fetch search results.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery, categoryFilter, pathCategoryName]);

  if (loading) return <Loader />;

  const pageTitle = searchQuery
    ? `Search Results for "${searchQuery}"`
    : categoryFilter
    ? `"${categoryFilter.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}"`
    : 'All Products';

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <StickyCategoryNavbar />

      <h2 className="text-3xl md:pt-0 pt-32 font-bold mt-20 pb-10 text-gray-900 dark:text-white text-center">
        {pageTitle}
      </h2>

      {loading && <p className="text-center text-xl text-gray-700 dark:text-gray-300">Loading results...</p>}
      {error && <p className="text-center text-red-500 text-lg">{error}</p>}

      {!loading && !error && results.length === 0 && (
        <p className="text-center text-lg text-gray-600 dark:text-gray-400">
          {searchQuery && `No products found matching "${searchQuery}".`}
          {categoryFilter &&
            `No products found in category "${categoryFilter.replace(/-/g, ' ').replace(/\b\w/g, char =>
              char.toUpperCase()
            )}".`}
          {!searchQuery && !categoryFilter && `No products available.`}
        </p>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((product) => (
              <ProductCard key={product._id} product={product} compact={true} />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-6 mt-10 border-t bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © 2025 ShopMate 🛍️. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default SearchResults;
