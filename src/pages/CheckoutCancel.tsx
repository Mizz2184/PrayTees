import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, ArrowLeft, ShoppingCart, HelpCircle } from 'lucide-react';

interface CheckoutCancelProps {
  cartItems: any[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  onRemoveFromCart?: (id: string, size: string) => void;
  onUpdateCartQuantity?: (id: string, size: string, quantity: number) => void;
}

const CheckoutCancel = ({ 
  cartItems, 
  isCartOpen, 
  setIsCartOpen, 
  onRemoveFromCart, 
  onUpdateCartQuantity 
}: CheckoutCancelProps) => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-white">
      <Header 
        cartItems={cartItems}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
      />
      
      <div className="pt-20 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Cancelled
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              No worries! Your order has been cancelled and no payment was processed.
            </p>
          </div>

          <div className="grid gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Your Cart is Still Safe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  All your selected items are still in your cart. You can continue shopping 
                  or try the checkout process again when you're ready.
                </p>
                {cartItems.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Items in your cart: {cartItems.length}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total: ${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium mb-1">Common Issues</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Payment method declined or expired</li>
                    <li>• Browser or internet connection issues</li>
                    <li>• Accidental cancellation</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">What You Can Do</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Try a different payment method</li>
                    <li>• Check your card details</li>
                    <li>• Contact your bank if needed</li>
                    <li>• Reach out to our support team</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => navigate('/checkout')} 
                className="bg-black text-white hover:bg-gray-800"
              >
                Try Checkout Again
                <ShoppingCart className="w-4 h-4 ml-2" />
              </Button>
              
              <Button 
                onClick={() => navigate('/shop')} 
                variant="outline"
                className="border-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>
                Still having trouble? Contact us at{' '}
                <a href="mailto:praytees84@gmail.com" className="text-blue-600 hover:underline">
                  praytees84@gmail.com
                </a>
                {' '}or call{' '}
                <a href="tel:+1-555-PRAYTEES" className="text-blue-600 hover:underline">
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutCancel; 