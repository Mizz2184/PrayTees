import { supabase } from '@/integrations/supabase/client';

export interface WishlistItem {
  id: string;
  user_id: string;
  external_product_id: string;
  product_data: any; // Store the full product data from Printful
  created_at: string;
}

class WishlistService {
  // Add item to wishlist
  async addToWishlist(productId: string, productData?: any): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      console.log('Adding product to database wishlist:', productId);

      // Check if product is already in wishlist
      const { data: existing, error: checkError } = await supabase
        .from('external_wishlist')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('external_product_id', productId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing wishlist item:', checkError);
        throw checkError;
      }

      if (existing) {
        console.log('Product already in wishlist');
        return true; // Already in wishlist
      }

      // Insert new wishlist item
      const { error } = await supabase
        .from('external_wishlist')
        .insert({
          user_id: session.user.id,
          external_product_id: productId,
          product_data: productData || {}
        });

      if (error) {
        console.error('Error inserting wishlist item:', error);
        throw error;
      }

      console.log('Successfully added to database wishlist');
      return true;
    } catch (error: any) {
      console.error('Error adding to wishlist:', error);
      throw error; // Don't fallback to localStorage
    }
  }

  // Remove item from wishlist
  async removeFromWishlist(productId: string): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      console.log('Removing product from database wishlist:', productId);

      const { error } = await supabase
        .from('external_wishlist')
        .delete()
        .eq('user_id', session.user.id)
        .eq('external_product_id', productId);

      if (error) {
        console.error('Error removing from wishlist:', error);
        throw error;
      }

      console.log('Successfully removed from database wishlist');
      return true;
    } catch (error: any) {
      console.error('Error removing from wishlist:', error);
      throw error; // Don't fallback to localStorage
    }
  }

  // Check if item is in wishlist
  async isInWishlist(productId: string): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return false; // Not authenticated, not in wishlist
      }

      const { data, error } = await supabase
        .from('external_wishlist')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('external_product_id', productId)
        .maybeSingle();

      if (error) {
        console.error('Error checking wishlist status:', error);
        return false;
      }

      return !!data;
    } catch (error: any) {
      console.error('Error checking wishlist status:', error);
      return false;
    }
  }

  // Get user's wishlist
  async getUserWishlist(): Promise<string[]> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No session found, returning empty wishlist');
        return [];
      }

      console.log('Fetching wishlist from database for user:', session.user.id);

      const { data, error } = await supabase
        .from('external_wishlist')
        .select('external_product_id')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching wishlist:', error);
        throw error;
      }

      const productIds = data?.map(item => item.external_product_id) || [];
      console.log('Successfully fetched wishlist from database:', productIds);
      return productIds;
    } catch (error: any) {
      console.error('Error fetching wishlist:', error);
      throw error; // Don't fallback to localStorage
    }
  }

  // Get full wishlist items with product data
  async getWishlistItems(): Promise<WishlistItem[]> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return [];
      }

      const { data, error } = await supabase
        .from('external_wishlist')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching wishlist items:', error);
        throw error;
      }

      return data || [];
    } catch (error: any) {
      console.error('Error fetching wishlist items:', error);
      throw error;
    }
  }
}

export const wishlistService = new WishlistService(); 