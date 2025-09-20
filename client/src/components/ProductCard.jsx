import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify'; 

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (!product) {
    return null;
  }
  
  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.error('Please log in to add products to your cart!');
      navigate('/login');
      return; 
    }

    addToCart(product);
    toast.success(`${product.name} has been added to your cart!`);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.error('Please log in to proceed with your purchase!');
      navigate('/login');
      return;
    }

    addToCart(product);
    toast.success(`You are now buying ${product.name}!`);
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (  
    <div 
      className="border rounded-2xl shadow hover:shadow-2xl hover:scale-105 transition hover:cursor-pointer p-4"
      onClick={handleCardClick}
    >
      {/* Updated image src here */}
      <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-xl mb-4" />

      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{product.name}</h2>
      
      <p className="font-bold text-blue-600 dark:text-blue-400 text-xl">₹{product.price}</p>
      
      <div className="flex items-center mt-2">
        {product.rating > 0 ? (
          Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < product.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-200'}>
              &#9733; 
            </span>
          ))
        ) : (
          <span className="text-gray-500 text-sm">No ratings yet</span>
        )}
        <span className="text-gray-500 dark:text-gray-300 text-sm">({product.reviews || 0} reviews)</span>
      </div>

      {product.price >= 500 && ( 
        <p className="text-green-600 text-sm mt-1 font-semibold">Free Delivery</p>
      )}
      
    </div>
  );
};

export default ProductCard;
