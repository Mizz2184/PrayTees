import { useState, useEffect } from 'react';
import { wishlistService, WishlistItem } from '../services/wishlistService';
import { supabase } from '@/integrations/supabase/client';

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchWishlist();
      } else {
        setWishlistItems([]);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchWishlist();
      } else {
        setWishlistItems([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const items = await wishlistService.getUserWishlist();
      setWishlistItems(items);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string, variantId: string) => {
    if (!user) return false;
    
    const success = await wishlistService.addToWishlist(productId, variantId);
    if (success) {
      fetchWishlist(); // Refresh wishlist
    }
    return success;
  };

  const removeFromWishlist = async (variantId: string) => {
    if (!user) return false;
    
    const success = await wishlistService.removeFromWishlist(variantId);
    if (success) {
      fetchWishlist(); // Refresh wishlist
    }
    return success;
  };

  const isInWishlist = (variantId: string) => {
    return wishlistItems.some(item => item.variant_id === variantId);
  };

  return {
    wishlistItems,
    loading,
    user,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    fetchWishlist
  };
}; 