import React, { useState } from 'react';
import ProductModal from '../components/ProductModal';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { usePrintfulProducts, transformPrintfulToProduct } from '../hooks/usePrintfulProducts';

interface ShopProps {
  addToCart: (product: any) => void;
  cartItems?: any[];
  onRemoveFromCart?: (id: string, size: string) => void;
  onUpdateCartQuantity?: (id: string, size: string, quantity: number) => void;
}

const Shop = ({ addToCart, cartItems = [], onRemoveFromCart, onUpdateCartQuantity }: ShopProps) => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { data: printfulProducts, isLoading, error } = usePrintfulProducts();

  console.log('🛍️ Shop component render:');
  console.log('🛍️ printfulProducts:', printfulProducts);
  console.log('🛍️ isLoading:', isLoading);
  console.log('🛍️ error:', error);

  // Transform Printful products to the expected format
  const products = printfulProducts && printfulProducts.length > 0 
    ? printfulProducts.map(transformPrintfulToProduct)
    : [];

  console.log('🛍️ Transformed products:', products);
  console.log('🛍️ Products length:', products.length);

  // Show error state if there's an error
  if (error) {
    console.error('Error loading Printful products:', error);
  }

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

  // Show message if no products available
  if (!isLoading && products.length === 0) {
    return (
      <div className="min-h-screen">
        <Header 
          cartItems={cartItems}
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
          onRemove={onRemoveFromCart}
          onUpdateQuantity={onUpdateCartQuantity}
        />
        
        <div className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-black uppercase mb-8 tracking-tight">
                Shop Collection
              </h1>
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Products Loading</h3>
                <p className="text-gray-600 mb-6">
                  We're connecting to our product catalog. Please check back in a few moments.
                </p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-black text-white px-6 py-3 font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black uppercase mb-4 tracking-tight">
              Shop Collection
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our complete range of faith-inspired apparel designed to help you express your beliefs with style and confidence.
              {isLoading && <span className="block text-sm mt-2">Loading our latest collection...</span>}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[4/5] mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Unable to Load Products
                </h3>
                <p className="text-gray-600 mb-6">
                  We're having trouble connecting to our product catalog. Please try refreshing the page or check back later.
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-black text-white px-6 py-3 font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  No Products Available
                </h3>
                <p className="text-gray-600">
                  We're currently updating our product catalog. Please check back soon for new arrivals!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden bg-gray-100 aspect-[4/5] mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
                      }}
                    />
                    
                    {/* Quick View Button */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="bg-white text-black px-6 py-3 font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-bold text-lg mb-2 text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                    <p className="font-bold text-xl">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
};

export default Shop;
