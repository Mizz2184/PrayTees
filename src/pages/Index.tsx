import { useState } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import FeaturedCollections from '../components/FeaturedCollections';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
}

interface IndexProps {
  addToCart: (product: Product) => void;
  cartItems: Product[];
  setCartItems: (items: Product[]) => void;
}

const Index = ({ addToCart, cartItems, setCartItems }: IndexProps) => {
  return (
    <div className="min-h-screen">
      <Header cartItems={cartItems} setCartItems={setCartItems} />
      <HeroSection />
      <FeaturedCollections />
      <ProductGrid addToCart={addToCart} />
      <Footer />
    </div>
  );
};

export default Index; 