import React, { useState } from 'react';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Cart from './Cart';

interface HeaderProps {
  cartItems?: any[];
  isCartOpen?: boolean;
  setIsCartOpen?: (open: boolean) => void;
  onRemove?: (productId: any, size: any) => void;
  onUpdateQuantity?: (productId: any, size: any, quantity: number) => void;
}

const Header = ({ cartItems = [], isCartOpen = false, setIsCartOpen, onRemove, onUpdateQuantity }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-black uppercase tracking-tight">
                Pray<span className="text-blue-600">Tees</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/shop" className="text-sm font-semibold uppercase tracking-wide hover:text-blue-600 transition-colors">Shop</Link>
              <a href="/#collections" className="text-sm font-semibold uppercase tracking-wide hover:text-blue-600 transition-colors">Collections</a>
              <a href="/#contact" className="text-sm font-semibold uppercase tracking-wide hover:text-blue-600 transition-colors">Contact</a>
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <Search className="w-5 h-5 cursor-pointer hover:text-blue-600 transition-colors" />
              {setIsCartOpen && (
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative hover:text-blue-600 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
              )}
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4">
              <nav className="flex flex-col space-y-4">
                <Link to="/shop" className="text-sm font-semibold uppercase tracking-wide hover:text-blue-600 transition-colors">Shop</Link>
                <a href="/#collections" className="text-sm font-semibold uppercase tracking-wide hover:text-blue-600 transition-colors">Collections</a>
                <a href="/#contact" className="text-sm font-semibold uppercase tracking-wide hover:text-blue-600 transition-colors">Contact</a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Cart Sidebar */}
      {setIsCartOpen && onRemove && onUpdateQuantity && (
        <Cart 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onRemove={onRemove}
          onUpdateQuantity={onUpdateQuantity}
        />
      )}
    </>
  );
};

export default Header;
