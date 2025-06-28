import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';

interface CheckoutSuccessProps {
  cartItems: any[];
  onClearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  onRemoveFromCart?: (id: string, size: string) => void;
  onUpdateCartQuantity?: (id: string, size: string, quantity: number) => void;
}

const CheckoutSuccess = ({ 
  cartItems, 
  onClearCart, 
  isCartOpen, 
  setIsCartOpen, 
  onRemoveFromCart, 
  onUpdateCartQuantity 
}: CheckoutSuccessProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderNumber] = useState(() => `PT${Date.now().toString().slice(-6)}`);

  useEffect(() => {
    // Clear the cart after successful payment
    if (sessionId) {
      onClearCart();
    }
  }, [sessionId, onClearCart]);

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
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Thank You for Your Order!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Your payment has been processed successfully.
            </p>
            
            {sessionId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">
                  <strong>Order Number:</strong> {orderNumber}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Payment ID:</strong> {sessionId.slice(0, 20)}...
                </p>
              </div>
            )}
          </div>

          <div className="grid gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Confirmation Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  A confirmation email with your order details and tracking information 
                  will be sent to you shortly. Please check your inbox and spam folder.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  What's Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Order Processing</h4>
                    <p className="text-sm text-gray-600">
                      We'll start preparing your custom products right away.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Production & Quality Check</h4>
                    <p className="text-sm text-gray-600">
                      Your items will be printed and quality checked (3-5 business days).
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Shipping & Delivery</h4>
                    <p className="text-sm text-gray-600">
                      Your order will be shipped and delivered to your address (5-7 business days).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-4">
            <Button 
              onClick={() => navigate('/shop')} 
              className="bg-black text-white hover:bg-gray-800"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <div className="text-sm text-gray-600">
              <p>
                Need help? Contact us at{' '}
                <a href="mailto:support@praytees.com" className="text-blue-600 hover:underline">
                  support@praytees.com
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

export default CheckoutSuccess; 