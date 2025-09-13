// backend/controllers/cartController.js

// Get cart items
export const getCart = async (req, res) => {
  try {
    res.json({ products: req.user.cart || [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cart" });
  }
};

// Update cart
export const updateCart = async (req, res) => {
  try {
    req.user.cart = req.body.products || [];
    await req.user.save();
    res.json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating cart" });
  }
};
