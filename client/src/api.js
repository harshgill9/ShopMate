import axios from 'axios';

const API = "http://localhost:5000/api/products"; 

export const fetchProducts = async () => {
  try {
    const res = await axios.get(API);
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return [];
  }
};
