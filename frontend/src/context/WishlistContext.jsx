import { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('wishlistItems');
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  }, []);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      let newWishlist;
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        newWishlist = prev.filter(item => item.id !== product.id);
      } else {
        newWishlist = [...prev, product];
      }
      localStorage.setItem('wishlistItems', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
