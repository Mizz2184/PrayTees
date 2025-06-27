import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === product.size);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id, size) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.size === size)));
  };

  const updateCartQuantity = (id, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
    } else {
      setCartItems(prev => 
        prev.map(item => 
          item.id === id && item.size === size
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index addToCart={addToCart} cartItems={cartItems} setCartItems={setCartItems} />} />
            <Route 
              path="/shop" 
              element={
                <Shop 
                  addToCart={addToCart} 
                  cartItems={cartItems}
                  onRemoveFromCart={removeFromCart}
                  onUpdateCartQuantity={updateCartQuantity}
                />
              } 
            />
            <Route 
              path="/checkout" 
              element={
                <Checkout 
                  cartItems={cartItems}
                  onClearCart={clearCart}
                  onRemoveFromCart={removeFromCart}
                  onUpdateCartQuantity={updateCartQuantity}
                />
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
