
import React, { useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import HeroSection from '../components/HeroSection';
import FeaturedCollections from '../components/FeaturedCollections';
import TestimonialsSection from '../components/TestimonialsSection';
import NewsletterSection from '../components/NewsletterSection';
import Footer from '../components/Footer';
import Header from '../components/Header';

interface IndexProps {
  addToCart: (product: any) => void;
  cartItems: any[];
  setCartItems: (items: any[]) => void;
}

const Index = ({ addToCart, cartItems, setCartItems }: IndexProps) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const removeFromCart = (productId, size) => {
    setCartItems(cartItems.filter(item => !(item.id === productId && item.size === size)));
  };

  const updateQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCartItems(
      cartItems.map(item => 
        item.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        cartItems={cartItems}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />

      {/* Main Content */}
      <main className="pt-16">
        <HeroSection />
        <FeaturedCollections />
        <ProductGrid addToCart={addToCart} />
        <TestimonialsSection />
        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
