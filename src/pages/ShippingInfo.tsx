import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Truck, Clock, Globe, Package, MapPin, HelpCircle } from 'lucide-react';

interface ShippingInfoProps {
  cartItems?: any[];
  onRemoveFromCart?: (id: string, size: string) => void;
  onUpdateCartQuantity?: (id: string, size: string, quantity: number) => void;
}

const ShippingInfo = ({ cartItems = [], onRemoveFromCart, onUpdateCartQuantity }: ShippingInfoProps) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

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
      
      <div className="pt-20 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black uppercase mb-4 tracking-tight">
              Shipping Information
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We strive to deliver your orders as quickly as possible. Below you'll find details about our shipping options, processing times, and delivery estimates.
            </p>
          </div>

          <div className="space-y-12">
            {/* Processing Times */}
            <section className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <Clock className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold uppercase tracking-tight">Processing Times</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Standard products:</p>
                    <p className="text-gray-600">2–7 business days</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Custom products (e.g., all-over print):</p>
                    <p className="text-gray-600">4–8 business days</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Holiday seasons & promotions:</p>
                    <p className="text-gray-600">Processing times may be longer due to high demand</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Methods & Delivery Times */}
            <section>
              <div className="flex items-center mb-8">
                <Truck className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold uppercase tracking-tight">Shipping Methods & Delivery Times</h2>
              </div>
              <p className="text-gray-600 mb-8">
                Once your order is fulfilled, delivery times depend on the shipping method and destination:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Domestic Shipping */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-6 h-6 text-blue-600 mr-2" />
                    <h3 className="text-xl font-bold uppercase tracking-tight">Domestic Shipping</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">(Within the US)</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Standard Shipping:</span>
                      <span className="text-gray-600">2–5 business days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Express Shipping:</span>
                      <span className="text-gray-600">1–3 business days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Priority Mail:</span>
                      <span className="text-gray-600">1–2 business days</span>
                    </div>
                  </div>
                </div>

                {/* International Shipping */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Globe className="w-6 h-6 text-blue-600 mr-2" />
                    <h3 className="text-xl font-bold uppercase tracking-tight">International Shipping</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Standard Shipping:</span>
                      <span className="text-gray-600">6–20 business days</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">(varies by country)</div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Express Shipping:</span>
                      <span className="text-gray-600">3–8 business days</span>
                    </div>
                    <div className="text-sm text-gray-600">(DHL, FedEx)</div>
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> Customs fees may apply depending on the destination country.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Tracking Your Order */}
            <section className="bg-blue-50 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <Package className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold uppercase tracking-tight">Tracking Your Order</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Once your order ships, you'll receive a tracking number via email. You can check your order status by:
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Clicking the tracking link in your shipping confirmation email</p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Logging into your account (if you placed the order through our website)</p>
                </div>
              </div>
            </section>

            {/* Shipping Costs */}
            <section>
              <div className="flex items-center mb-6">
                <Package className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold uppercase tracking-tight">Shipping Costs</h2>
              </div>
              <p className="text-gray-600 mb-6">Shipping rates depend on:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">Destination</p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">Package weight & dimensions</p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">Shipping speed selected</p>
                </div>
              </div>
              <p className="text-gray-600">
                You can view exact shipping costs during checkout before placing your order.
              </p>
            </section>

            {/* Returns & Lost Packages */}
            <section className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <HelpCircle className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold uppercase tracking-tight">Returns & Lost Packages</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Lost in transit?</p>
                    <p className="text-gray-600">Contact us within 30 days for assistance.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Wrong address?</p>
                    <p className="text-gray-600">Update your shipping details before the order is processed. Changes may not be possible once shipped.</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 p-4 bg-blue-100 border border-blue-200 rounded-lg">
                <p className="text-blue-800">
                  For more details, visit our Help Center or <a href="/contact" className="font-semibold underline hover:text-blue-900">contact customer support</a>.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ShippingInfo; 