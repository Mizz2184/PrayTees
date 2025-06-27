import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { wishlistService } from '../services/wishlistService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const WishlistButton = ({ 
  productId, 
  className = "",
  size = 'md'
}: WishlistButtonProps) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  useEffect(() => {
    // Check auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkWishlistStatus();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkWishlistStatus();
      } else {
        setIsInWishlist(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [productId]);

  const checkWishlistStatus = async () => {
    if (!user) {
      setIsInWishlist(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const inWishlist = await wishlistService.isInWishlist(productId);
      setIsInWishlist(inWishlist);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      setIsInWishlist(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Please login",
        description: "Please login to add products to your wishlist",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(productId);
        setIsInWishlist(false);
        toast({
          title: "Removed from wishlist",
          description: "Product has been removed from your wishlist",
        });
      } else {
        await wishlistService.addToWishlist(productId);
        setIsInWishlist(true);
        toast({
          title: "Added to wishlist",
          description: "Product has been added to your wishlist",
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleWishlistToggle}
      disabled={isLoading}
      className={`
        p-2 rounded-full transition-all duration-200 
        ${isInWishlist 
          ? 'bg-red-50 text-red-500 hover:bg-red-100' 
          : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
        ${className}
      `}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart 
        className={`${sizeClasses[size]} ${isInWishlist ? 'fill-current' : ''}`}
      />
    </button>
  );
};

export default WishlistButton; 