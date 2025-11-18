import { useState, useEffect } from 'react';

/**
 * Custom hook for managing favorites state across the application
 * Automatically syncs with localStorage and handles cross-tab communication
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize favorites from localStorage
  useEffect(() => {
    try {
      const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      setFavorites(savedFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for favorites updates from other components/tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'favorites' || e.type === 'favoritesUpdated') {
        try {
          const updatedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
          setFavorites(updatedFavorites);
        } catch (error) {
          console.error('Error syncing favorites:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favoritesUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleStorageChange);
    };
  }, []);

  // Persist favorites to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('favorites', JSON.stringify(favorites));
        window.dispatchEvent(new Event('favoritesUpdated'));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    }
  }, [favorites, loading]);

  // Add item to favorites
  const addToFavorites = (product) => {
    setFavorites(prevFavorites => {
      const exists = prevFavorites.some(item => item._id === product._id);
      if (exists) {
        return prevFavorites; // Don't add duplicates
      }
      return [...prevFavorites, product];
    });
  };

  // Remove item from favorites
  const removeFromFavorites = (productId) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(item => item._id !== productId)
    );
  };

  // Toggle favorite status
  const toggleFavorite = (product) => {
    setFavorites(prevFavorites => {
      const exists = prevFavorites.some(item => item._id === product._id);
      if (exists) {
        return prevFavorites.filter(item => item._id !== product._id);
      }
      return [...prevFavorites, product];
    });
  };

  // Check if item is in favorites
  const isFavorite = (productId) => {
    return favorites.some(item => item._id === productId);
  };

  // Get favorites count
  const getFavoritesCount = () => {
    return favorites.length;
  };

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavoritesCount
  };
};