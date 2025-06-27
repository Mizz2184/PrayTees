import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

const ProductModal = ({ product, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col lg:flex-row">
          {/* Product Image */}
          <div className="lg:w-1/2">
            <div className="relative aspect-square bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-black uppercase mb-2 tracking-tight">
                {product.name}
              </h2>
              <p className="text-2xl font-bold mb-4">${product.price}</p>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="font-bold uppercase tracking-wide mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border-2 font-bold uppercase tracking-wide transition-colors ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="font-bold uppercase tracking-wide mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border-2 font-bold uppercase tracking-wide transition-colors ${
                      selectedColor === color
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="font-bold uppercase tracking-wide mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 hover:border-black transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-xl min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-300 hover:border-black transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-4 font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
            >
              Add to Cart - ${(product.price * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
