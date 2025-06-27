import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { wishlistService } from '../services/wishlistService';
import { usePrintfulProducts, transformPrintfulToProduct } from '../hooks/usePrintfulProducts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

interface DashboardProps {
  cartItems?: any[];
  onRemoveFromCart?: (id: string, size: string) => void;
  onUpdateCartQuantity?: (id: string, size: string, quantity: number) => void;
  addToCart?: (product: any) => void;
}

export default function Dashboard({ cartItems = [], onRemoveFromCart, onUpdateCartQuantity, addToCart }: DashboardProps) {
  const navigate = useNavigate();
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();
  const { data: printfulProducts } = usePrintfulProducts();

  useEffect(() => {
    checkUser();
    fetchUserData();
  }, [printfulProducts]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/');
    }
  };

  const handleRemoveFromCart = (id: string, size: string) => {
    if (onRemoveFromCart) {
      onRemoveFromCart(id, size);
    }
  };

  const handleUpdateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(id, size);
    } else if (onUpdateCartQuantity) {
      onUpdateCartQuantity(id, size, quantity);
    }
  };

  const fetchUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch purchased products using the new relational schema
      const { data: orderItems, error: purchasedError } = await supabase
        .from('order_items')
        .select(`
          id,
          quantity,
          unit_price,
          product_variants:variant_id (
            id,
            name,
            retail_price,
            image_url,
            products:product_id (
              id,
              name,
              thumbnail_url
            )
          ),
          orders:order_id (
            user_id
          )
        `)
        .eq('orders.user_id', session.user.id);

      if (purchasedError) throw purchasedError;
      
      // Transform order items to product format
      const purchasedProductsData = orderItems?.map((item: any) => ({
        id: item.product_variants?.id || '',
        name: item.product_variants?.products?.name || item.product_variants?.name || '',
        price: parseFloat(item.unit_price),
        image_url: item.product_variants?.image_url || item.product_variants?.products?.thumbnail_url || ''
      })) || [];
      
      setPurchasedProducts(purchasedProductsData);

      // Fetch wishlist - try database first, then localStorage
      await fetchWishlistData(session.user.id);

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlistData = async (userId: string) => {
    try {
      // Fetch wishlist from database using the correct structure
      const wishlistIds = await wishlistService.getUserWishlist();
      let wishlistProducts: Product[] = [];

      if (wishlistIds.length > 0 && printfulProducts) {
        // Transform Printful products to find matching wishlist items
        const allPrintfulProducts = printfulProducts.map(transformPrintfulToProduct);
        
        wishlistProducts = wishlistIds
          .map(productId => {
            const printfulProduct = allPrintfulProducts.find(p => p.id === productId);
            if (printfulProduct) {
              return {
                id: printfulProduct.id,
                name: printfulProduct.name,
                price: printfulProduct.price,
                image_url: printfulProduct.image
              };
            }
            return null;
          })
          .filter(Boolean) as Product[];
      }

      setWishlistProducts(wishlistProducts);

    } catch (error) {
      console.error('Error fetching wishlist data:', error);
      setWishlistProducts([]);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleAddToCart = (product: Product) => {
    if (addToCart) {
      // Transform product to cart format
      const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url,
        size: 'M', // Default size
        color: 'Black', // Default color
        quantity: 1
      };
      addToCart(cartProduct);
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const success = await wishlistService.removeFromWishlist(productId);
      if (success) {
        // Refresh wishlist data
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await fetchWishlistData(session.user.id);
        }
        
        toast({
          title: "Removed from wishlist",
          description: "Product has been removed from your wishlist",
        });
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Could not remove product from wishlist",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          cartItems={cartItems}
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
          onRemove={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
        />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        cartItems={cartItems}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
      />
      
      <div className="pt-20">
        <div className="container mx-auto py-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Account</h1>
            <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
          </div>

          <Tabs defaultValue="purchased" className="space-y-6">
            <TabsList>
              <TabsTrigger value="purchased">Purchased Products</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            </TabsList>

            <TabsContent value="purchased">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchasedProducts.length === 0 ? (
                  <p className="col-span-full text-center text-gray-500">No purchased products yet</p>
                ) : (
                  purchasedProducts.map((product) => (
                    <Card key={product.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        <p className="font-medium">${product.price.toFixed(2)}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="wishlist">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistProducts.length === 0 ? (
                  <p className="col-span-full text-center text-gray-500">Your wishlist is empty</p>
                ) : (
                  wishlistProducts.map((product) => (
                    <Card key={product.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        <p className="font-medium mb-4">${product.price.toFixed(2)}</p>
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            className="flex-1"
                            onClick={() => handleAddToCart(product)}
                          >
                            Add to Cart
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveFromWishlist(product.id)}
                            className="px-3"
                          >
                            ❤️
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 