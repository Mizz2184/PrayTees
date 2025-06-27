import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { printfulService } from '@/services/printfulApi';

interface CheckoutProps {
  cartItems: any[];
  onClearCart: () => void;
  onRemoveFromCart?: (id: string, size: string) => void;
  onUpdateCartQuantity?: (id: string, size: string, quantity: number) => void;
}

const Checkout = ({ cartItems, onClearCart, onRemoveFromCart, onUpdateCartQuantity }: CheckoutProps) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shipping, setShipping] = useState(9.99); // Default fallback
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  // Calculate shipping when cart items or address changes
  useEffect(() => {
    if (cartItems.length > 0) {
      calculateShipping();
    }
  }, [cartItems, formData.country, formData.state, formData.zipCode]);

  const calculateShipping = async () => {
    try {
      setIsCalculatingShipping(true);
      
      // Map country name to country code
      const countryCodeMap: { [key: string]: string } = {
        'United States': 'US',
        'Canada': 'CA',
        'United Kingdom': 'GB',
        'Australia': 'AU',
        'Germany': 'DE',
        'France': 'FR',
        'Japan': 'JP'
      };
      
      const countryCode = countryCodeMap[formData.country] || 'US';
      
      // Create detailed address object for real Printful API
      const addressDetails = {
        country_code: countryCode,
        state_code: formData.state,
        city: formData.city,
        zip: formData.zipCode,
        address1: formData.address
      };
      
      const estimatedShipping = await printfulService.getEstimatedShipping(
        cartItems, 
        countryCode, 
        addressDetails
      );
      
      console.log('🚚 Calculated shipping:', estimatedShipping, 'for country:', countryCode);
      setShipping(estimatedShipping);
    } catch (error) {
      console.error('🚚 Error calculating shipping:', error);
      // Keep default shipping rate on error
      setShipping(9.99);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      onClearCart();
      alert('Order placed successfully! You will receive a confirmation email shortly.');
      navigate('/');
    }, 2000);
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

  if (cartItems.length === 0) {
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
              <p className="text-gray-600 mb-8">Add some products to your cart before checking out.</p>
              <Button onClick={() => navigate('/shop')} className="bg-black text-white hover:bg-gray-800">
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
        <Footer />
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
      
      <div className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        required
                        value={formData.zipCode}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <select
                        id="country"
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Japan">Japan</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <Input
                        id="nameOnCard"
                        name="nameOnCard"
                        required
                        value={formData.nameOnCard}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        required
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          required
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          required
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  className="w-full bg-black text-white hover:bg-gray-800" 
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : `Complete Order - $${total.toFixed(2)}`}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          <p className="text-xs text-gray-600">
                            {item.size} • {item.color}
                          </p>
                          <p className="text-sm">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>
                          {isCalculatingShipping ? (
                            <span className="text-gray-500">Calculating...</span>
                          ) : (
                            `$${shipping.toFixed(2)}`
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout; 