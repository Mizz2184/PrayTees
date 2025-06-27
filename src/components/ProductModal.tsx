import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';

interface ProductModalProps {
  product: any;
  onClose: () => void;
  onAddToCart: (product: any) => void;
}

const ProductModal = ({ product, onClose, onAddToCart }: ProductModalProps) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(product.image);
  const [currentPrice, setCurrentPrice] = useState(product.price);

  // Update image and price when color/size changes
  useEffect(() => {
    // Update image based on selected color
    if (product.color_image_mapping && product.color_image_mapping[selectedColor]) {
      setCurrentImage(product.color_image_mapping[selectedColor]);
    } else {
      // Fallback to default product image
      setCurrentImage(product.image);
    }

    // Update price based on selected variant
    if (product.variant_price_mapping) {
      const variantKey = `${selectedSize}-${selectedColor}`;
      const variantPrice = product.variant_price_mapping[variantKey];
      if (variantPrice) {
        setCurrentPrice(variantPrice);
      } else {
        // Fallback to default product price
        setCurrentPrice(product.price);
      }
    }
  }, [selectedColor, selectedSize, product]);

  const handleAddToCart = () => {
    // Find the specific variant ID for this size/color combination
    const variantKey = `${selectedSize}-${selectedColor}`;
    const variantId = product.variant_mapping?.[variantKey] || product.default_variant_id;

    onAddToCart({
      ...product,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      price: currentPrice, // Use the current price for this variant
      variant_id: variantId, // Include variant ID for shipping calculations
      image: currentImage // Use the current image for this variant
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
                src={currentImage}
                alt={`${product.name} - ${selectedColor}`}
                className="w-full h-full object-cover transition-all duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = product.image; // Fallback to original image
                }}
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
              <p className="text-2xl font-bold mb-4">
                ${currentPrice.toFixed(2)}
                {currentPrice !== product.price && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="font-bold uppercase tracking-wide mb-3">
                Color: {selectedColor}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border-2 font-bold uppercase tracking-wide transition-all duration-200 ${
                      selectedColor === color
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black hover:bg-gray-50'
                    }`}
                    title={`Switch to ${color}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
              {product.color_image_mapping && product.color_image_mapping[selectedColor] && (
                <p className="text-xs text-gray-500 mt-1">
                  Image updates based on selected color
                </p>
              )}
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="font-bold uppercase tracking-wide mb-3">
                Size: {selectedSize}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size: string) => (
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
              Add to Cart - ${(currentPrice * quantity).toFixed(2)}
            </button>

            {/* Product Info */}
            {product.all_variants && product.all_variants.length > 0 && (
              <div className="mt-4 text-xs text-gray-500">
                <p>✅ Premium quality product with {product.all_variants.length} variants</p>
                <p>💰 Prices update based on selected size/color combination</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
