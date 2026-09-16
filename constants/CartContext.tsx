import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from './storeData';

const CART_KEY = 'fashiondirect_cart';

// ── Cart item includes quantity ───────────────────────────────────────────────
export type CartItem = Product & { quantity: number };

type CartContextType = {
  cartItems:      CartItem[];
  cartCount:      number;
  cartTotal:      string;
  addToCart:      (item: Product) => void;
  removeFromCart: (id: string) => void;
  increaseQty:    (id: string) => void;
  decreaseQty:    (id: string) => void;
  clearCart:      () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load saved cart on app start
  useEffect(() => {
    const loadCart = async () => {
      try {
        const saved = await AsyncStorage.getItem(CART_KEY);
        if (saved) setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load cart:', e);
      }
    };
    loadCart();
  }, []);

  // Save cart whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(cartItems));
      } catch (e) {
        console.error('Failed to save cart:', e);
      }
    };
    saveCart();
  }, [cartItems]);

  // Add to cart — if product already exists, increase quantity
  const addToCart = useCallback((item: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        // Product already in cart — just bump quantity
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // New product — add with quantity 1
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  // Remove product entirely from cart
  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  // Increase quantity of a specific product
  const increaseQty = useCallback((id: string) => {
    setCartItems((prev) =>
      prev.map((i) => i.id === id ? { ...i, quantity: i.quantity + 1 } : i)
    );
  }, []);

  // Decrease quantity — remove if it reaches 0
  const decreaseQty = useCallback((id: string) => {
    setCartItems((prev) =>
      prev
        .map((i) => i.id === id ? { ...i, quantity: i.quantity - 1 } : i)
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  // Total number of items (sum of all quantities)
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  // Total price (price × quantity for each item)
  const cartTotal =
    '$' +
    cartItems
      .reduce((sum, i) => sum + parseFloat(i.price.replace('$', '')) * i.quantity, 0)
      .toFixed(2);

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, cartTotal,
      addToCart, removeFromCart, increaseQty, decreaseQty, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}