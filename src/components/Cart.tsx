import React from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ isOpen, onClose, items, onRemove, onUpdateQuantity }) => {
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-black uppercase tracking-tight">
              Shopping Cart ({items.length})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <button
                  onClick={onClose}
                  className="bg-black text-white px-6 py-3 font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">
                        {item.size} • {item.color}
                      </p>
                      <p className="font-bold">${item.price}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.size, item.quantity - 1)}
                          className="p-1 border border-gray-300 hover:border-black transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.size, item.quantity + 1)}
                          className="p-1 border border-gray-300 hover:border-black transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onRemove(item.id, item.size)}
                          className="ml-auto text-xs text-red-600 hover:text-red-800 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-black text-white py-4 font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
