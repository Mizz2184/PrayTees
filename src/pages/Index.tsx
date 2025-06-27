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
  quantity?: number;
}

interface IndexProps {
  addToCart: (product: Product) => void;
  cartItems: Product[];
  setCartItems: (items: Product[]) => void;
}

const Index = ({ addToCart, cartItems, setCartItems }: IndexProps) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const removeFromCart = (id: string, size?: string) => {
    setCartItems(cartItems.filter(item => !(item.id === id && item.size === size)));
  };

  const updateCartQuantity = (id: string, size: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id && item.size === size
          ? { ...item, quantity }
          : item
      ));
    }
  };

  return (
    <div className="min-h-screen">
      <Header 
        cartItems={cartItems} 
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        onRemove={removeFromCart}
        onUpdateQuantity={updateCartQuantity}
      />
      <HeroSection />
      <FeaturedCollections />
      <ProductGrid addToCart={addToCart} />
      <Footer />
    </div>
  );
};

export default Index; 