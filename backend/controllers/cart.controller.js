import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
  const { productId } = req.body;
  const user = req.user;
  try {
    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }
    await user.save();
    res
      .status(200)
      .json({ message: "Product added to cart", cartItems: user.cartItems });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

export const removeAllFromCart = async (req, res) => {
  const { productId } = req.body;
  const user = req.user;
  try {
    user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    await user.save();
    res.status(200).json({
      message: "Product removed from cart",
      cartItems: user.cartItems,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Error removing from cart", error });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const products = await Product.find({
      _id: { $in: req.user.cartItems },
    }).lean();
    // add quantity for each product
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (i) => i.id === product._id.toString()
      );
      return { ...product, quantity: item.quantity };
    });
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart products:", error);
    res.status(500).json({ message: "Error fetching cart products", error });
  }
};

export const updateQuantity = async (req, res) => {
  const { id: productId } = req.params;
  const { quantity } = req.body;
  const user = req.user;
  try {
    const item = user.cartItems.find((item) => item.id === productId);
    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    if (quantity === 0) {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
      await user.save();
      return res.status(200).json({
        message: "Product removed from cart",
        cartItems: user.cartItems,
      });
    }
    item.quantity = quantity;
    await user.save();
    res.status(200).json({
      message: "Cart item quantity updated",
      cartItems: user.cartItems,
    });
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    res
      .status(500)
      .json({ message: "Error updating cart item quantity", error });
  }
};
