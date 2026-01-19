import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("dhruv_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("dhruv_cart", JSON.stringify(cartItems));
      console.log("Cart saved to localStorage:", cartItems);
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartItems]);

  const addToCart = (medicine) => {
    console.log("Adding to cart:", medicine);
    setCartItems(prev => {
      const existing = prev.find(i => i._id === medicine._id);
      if (existing) {
        const updated = prev.map(i =>
          i._id === medicine._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
        console.log("Updated cart (existing item):", updated);
        return updated;
      }
      const newCart = [...prev, { ...medicine, quantity: 1 }];
      console.log("Updated cart (new item):", newCart);
      return newCart;
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(i => i._id !== id));
    } else {
      setCartItems(prev =>
        prev.map(i =>
          i._id === id ? { ...i, quantity } : i
        )
      );
    }
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i._id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("dhruv_cart");
    console.log("Cart cleared");
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalAmount,
        totalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
