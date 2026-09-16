import { useState } from 'react';
import { Product } from '../constants/storeData';

// SHARED CART HOOK — all tabs share the same cart state.
// NOTE: For Week 11 we will upgrade this to use Context or Zustand
//       so the cart persists across the whole app properly.
export function useCart() {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const addToCart = (item: Product) => {
    setCartItems((prev) => [...prev, item]);
    alert(`${item.title} added to cart!`);
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => {
      const index = prev.findIndex((i) => i.id === id);
      if (index === -1) return prev;
      return [...prev.slice(0, index), ...prev.slice(index + 1)];
    });
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.length;

  const cartTotal = '$' + cartItems
    .reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')), 0)
    .toFixed(2);

  return { cartItems, cartCount, cartTotal, addToCart, removeFromCart, clearCart };
}