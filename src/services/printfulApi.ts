const PRINTFUL_API_KEY = 'OuQXFPCYys3ONYsDlPDFy7mNdfIKPFqGxYC1GACl';

// Enhanced environment detection for deployed website
const isLocalDevelopment = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Try multiple function URL patterns for better compatibility
const FUNCTION_ENDPOINTS = isLocalDevelopment 
  ? ['http://localhost:8888/.netlify/functions']
  : ['/.netlify/functions', '/api'];

const PRAY_TEES_STORE_ID = 16243594;

// Debug info
console.log('🌐 Enhanced Netlify functions configuration:');
console.log('🌐 window.location.hostname:', typeof window !== 'undefined' ? window.location.hostname : 'SSR');
console.log('🌐 isLocalDevelopment:', isLocalDevelopment);
console.log('🌐 FUNCTION_ENDPOINTS:', FUNCTION_ENDPOINTS);
console.log('🌐 Current URL:', typeof window !== 'undefined' ? window.location.href : 'SSR');

export interface PrintfulProduct {
  id: number;  // Will be converted to string when storing in database
  external_id: string;
  name: string;
  variants: number | PrintfulVariant[]; // Can be number from /store/products or array from detailed call
  synced: number;
  thumbnail_url?: string;
  is_ignored: boolean;
  firstVariant?: PrintfulVariant | null; // First variant for easy access to pricing
}

export interface PrintfulVariant {
  id: number;  // Will be converted to string when storing in database
  external_id: string;
  sync_variant_id: number;
  name: string;
  synced: boolean;
  variant_id: number;
  main_category_id: number;
  warehouse_product_variant_id: number | null;
  retail_price: string;
  sku: string;
  currency: string;
  size: string;
  color: string;
  product: {
    variant_id: number;
    product_id: number;
    image: string;
    name: string;
  };
  files: Array<{
    id: number;
    type: string;
    hash: string;
    url: string | null;
    filename: string;
    mime_type: string;
    size: number;
    width: number;
    height: number;
    dpi: number | null;
    status: string;
    created: number;
    thumbnail_url: string;
    preview_url: string;
    visible: boolean;
    is_temporary: boolean;
  }>;
  options: Array<{
    id: string;
    value: any;
  }>;
  is_ignored: boolean;
}

export interface PrintfulStore {
  id: number;
  name: string;
  type: string;
  website: string;
  currency: string;
  created: number;
  updated: number | null;
}

export interface ShippingRate {
  name: string;
  rate: number;
  estimated_days: string;
}

export interface ShippingAddress {
  country_code: string;
  state_code?: string;
  city?: string;
  zip?: string;
  address1?: string;
}

export interface PrintfulShippingItem {
  quantity: number;
  variant_id: number;
}

export interface PrintfulShippingRequest {
  recipient: {
    address1?: string;
    city?: string;
    country_code: string;
    state_code?: string;
    zip?: string | number;
  };
  items: PrintfulShippingItem[];
}

export interface PrintfulShippingResponse {
  code: number;
  result: Array<{
    id: string;
    name: string;
    rate: string;
    currency: string;
    minDeliveryDays: number;
    maxDeliveryDays: number;
  }>;
}

// New interface for detailed product data
export interface DetailedPrintfulProduct extends PrintfulProduct {
  sync_variants: PrintfulVariant[];
}

class PrintfulService {
  // Test function to debug API calls
  async testConnection(): Promise<void> {
    console.log('🧪 Testing Netlify function connection...');
    console.log('🧪 FUNCTION_ENDPOINTS:', FUNCTION_ENDPOINTS);
    
    for (const endpoint of FUNCTION_ENDPOINTS) {
      try {
        const testUrl = `${endpoint}/printful-products`;
        console.log('🧪 Test URL:', testUrl);
        
        const response = await fetch(testUrl, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('🧪 Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('🧪 ✅ Connection successful!', data);
          return;
        } else {
          console.error('🧪 ❌ Connection failed:', response.statusText);
        }
      } catch (error) {
        console.error('🧪 ❌ Connection error:', error);
      }
    }
  }

  async getStoreProducts(): Promise<PrintfulProduct[]> {
    console.log('🌐 Fetching products via Netlify function...');
    
    for (const endpoint of FUNCTION_ENDPOINTS) {
      try {
        const functionUrl = `${endpoint}/printful-products`;
        console.log('🌐 Trying endpoint:', functionUrl);
        
        const response = await fetch(functionUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('🌐 Response status:', response.status);
        console.log('🌐 Response ok:', response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('🌐 Error response body:', errorText);
          console.log('🌐 Trying next endpoint...');
          continue;
        }

        const products = await response.json();
        console.log('✅ Products fetched successfully:', products.length);
        console.log('✅ First product:', products[0]);
        return products;
      } catch (error) {
        console.error('❌ Failed to fetch from endpoint:', endpoint, error);
        console.log('🌐 Trying next endpoint...');
        continue;
      }
    }
    
    // If all endpoints fail
    throw new Error('All Netlify function endpoints failed');
  }

  // New method to get detailed product variants
  async getProductVariants(productId: number): Promise<DetailedPrintfulProduct | null> {
    console.log('🔍 Fetching detailed product variants for:', productId);
    
    for (const endpoint of FUNCTION_ENDPOINTS) {
      try {
        const functionUrl = `${endpoint}/printful-product-variants?id=${productId}`;
        console.log('🔍 Trying variants endpoint:', functionUrl);
        
        const response = await fetch(functionUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.log('🔍 Variants endpoint failed, trying next...');
          continue;
        }

        const productDetails = await response.json();
        console.log('✅ Product variants fetched successfully:', productDetails);
        return productDetails;
      } catch (error) {
        console.error('❌ Failed to fetch variants from endpoint:', endpoint, error);
        continue;
      }
    }
    
    console.warn('⚠️ Could not fetch product variants');
    return null;
  }

  // Get all products with enhanced variant data - only real Printful products, no fallbacks
  async getAllProducts(): Promise<any[]> {
    try {
      console.log('🚀 Starting getAllProducts - fetching only real Printful products...');
      const products = await this.getStoreProducts();
      console.log('✅ Real Printful products fetched:', products.length);
      
      if (!products || products.length === 0) {
        console.warn('⚠️ No products returned from Printful API');
        return [];
      }
      
      // Transform products to include enhanced pricing and variant data
      const transformedProducts = await Promise.all(
        products.map(async (product) => {
          try {
            // Get detailed product variants for accurate pricing and variant info
            const detailedProduct = await this.getProductVariants(product.id);
            
            if (detailedProduct && detailedProduct.sync_variants) {
              console.log(`🎯 Enhanced product ${product.name} with ${detailedProduct.sync_variants.length} variants`);
              
              // Find the first available variant for pricing
              const firstVariant = detailedProduct.sync_variants.find(v => v.synced && !v.is_ignored) || 
                                 detailedProduct.sync_variants[0];
              
              return {
                ...product,
                variants: detailedProduct.sync_variants,
                firstVariant: firstVariant,
                // Use thumbnail_url if available, otherwise use first variant preview
                image: product.thumbnail_url || 
                       firstVariant?.files?.find(f => f.type === 'preview')?.preview_url ||
                       'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
              };
            } else {
              // Fallback for products without detailed variants
              return {
                ...product,
                variants: [],
                firstVariant: null,
                image: product.thumbnail_url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
              };
            }
          } catch (error) {
            console.warn(`⚠️ Could not enhance product ${product.name}:`, error);
            return {
              ...product,
              variants: [],
              firstVariant: null,
              image: product.thumbnail_url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            };
          }
        })
      );
      
      console.log('🎯 Returning enhanced Printful products:', transformedProducts.length);
      return transformedProducts;
    } catch (error) {
      console.error('💥 Error in getAllProducts:', error);
      // Return empty array instead of fallback products
      console.log('🔄 Returning empty array - only real products allowed');
      return [];
    }
  }

  // Get real shipping rates from Printful API via Netlify function
  async getShippingRates(address: ShippingAddress, cartItems: any[]): Promise<ShippingRate[]> {
    try {
      console.log('🚚 Getting real Printful shipping rates via Netlify function for:', address.country_code);
      
      // Convert cart items to Printful format
      const printfulItems: PrintfulShippingItem[] = cartItems.map(item => ({
        quantity: item.quantity || 1,
        variant_id: this.getVariantIdFromProduct(item)
      }));

      const shippingRequest: PrintfulShippingRequest = {
        recipient: {
          address1: address.address1 || "123 Main St",
          city: address.city || "New York",
          country_code: address.country_code,
          state_code: address.state_code,
          zip: address.zip || "10001"
        },
        items: printfulItems
      };

      // Try endpoints for shipping
      let response: Response | null = null;
      for (const endpoint of FUNCTION_ENDPOINTS) {
        try {
          response = await fetch(`${endpoint}/printful-shipping`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(shippingRequest)
          });
          if (response.ok) break;
        } catch (error) {
          console.error('❌ Shipping endpoint failed:', endpoint, error);
          continue;
        }
      }

      if (!response || !response.ok) {
        throw new Error(`Netlify shipping function error: ${response?.status || 'No response'}`);
      }

      const data = await response.json();
      
      if (data.code === 200 && data.result) {
        return data.result.map((rate: any) => ({
          name: rate.name,
          rate: parseFloat(rate.rate),
          estimated_days: rate.minDeliveryDays === rate.maxDeliveryDays 
            ? `${rate.minDeliveryDays} business days`
            : `${rate.minDeliveryDays}-${rate.maxDeliveryDays} business days`
        }));
      }
      
      throw new Error('Invalid response from Printful shipping API');
      
    } catch (error) {
      console.error('🚚 Error getting Printful shipping rates:', error);
      // Fallback to estimated rates only if API fails
      return this.calculateShippingRates(cartItems, address);
    }
  }

  private getVariantIdFromProduct(item: any): number {
    // Try to extract variant ID from the product
    console.log('🔍 Getting variant ID for item:', item);
    
    // First, check if variant_id is directly available
    if (item.variant_id) {
      console.log('✅ Found direct variant_id:', item.variant_id);
      return item.variant_id;
    }
    
    // Try to get variant ID from variant mapping using size and color
    if (item.variant_mapping) {
      const variantKey = `${item.size || 'default'}-${item.color || 'default'}`;
      const variantId = item.variant_mapping[variantKey];
      
      if (variantId) {
        console.log('✅ Found variant ID from mapping:', variantId, 'for key:', variantKey);
        return variantId;
      }
      
      // Try with just default key
      const defaultVariantId = item.variant_mapping['default-default'];
      if (defaultVariantId) {
        console.log('✅ Found default variant ID from mapping:', defaultVariantId);
        return defaultVariantId;
      }
    }
    
    // Try to use default_variant_id
    if (item.default_variant_id) {
      console.log('✅ Found default_variant_id:', item.default_variant_id);
      return item.default_variant_id;
    }
    
    // Last resort: use a known working variant ID based on product type
    console.warn('⚠️ No variant_id found for item, using fallback variant ID:', item.name);
    
    // Use different fallback variant IDs for different product types
    if (item.name?.toLowerCase().includes('hoodie')) {
      return 202;
    } else if (item.name?.toLowerCase().includes('t-shirt') || item.name?.toLowerCase().includes('tee')) {
      return 2;
    } else {
      return 2; // Default fallback
    }
  }

  // Calculate shipping rates based on cart items and destination (fallback only)
  async calculateShippingRates(items: any[], address: ShippingAddress): Promise<ShippingRate[]> {
    try {
      console.log('🚚 Using fallback shipping calculation for:', items.length, 'items to', address.country_code);
      
      const totalWeight = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      const totalValue = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
      
      const rates: ShippingRate[] = [];
      
      if (address.country_code === 'US') {
        rates.push({
          name: 'Standard Shipping',
          rate: this.calculateDomesticShipping(totalWeight, totalValue),
          estimated_days: '5-7 business days'
        });
        
        rates.push({
          name: 'Express Shipping',
          rate: this.calculateDomesticShipping(totalWeight, totalValue) * 2.5,
          estimated_days: '2-3 business days'
        });
      } else {
        rates.push({
          name: 'International Standard',
          rate: this.calculateInternationalShipping(totalWeight, totalValue, address.country_code),
          estimated_days: '10-20 business days'
        });
        
        rates.push({
          name: 'International Express',
          rate: this.calculateInternationalShipping(totalWeight, totalValue, address.country_code) * 1.8,
          estimated_days: '5-10 business days'
        });
      }
      
      return rates;
    } catch (error) {
      console.error('🚚 Error calculating shipping rates:', error);
      return [{
        name: 'Standard Shipping',
        rate: 9.99,
        estimated_days: '5-7 business days'
      }];
    }
  }
  
  private calculateDomesticShipping(weight: number, value: number): number {
    const baseRate = 4.99;
    const additionalItemRate = 2.50;
    const weightSurcharge = Math.max(0, (weight - 1) * 1.50);
    const valueBasedShipping = value > 75 ? 0 : Math.max(3.99, value * 0.08);
    
    return Math.round((baseRate + (weight - 1) * additionalItemRate + weightSurcharge + valueBasedShipping) * 100) / 100;
  }
  
  private calculateInternationalShipping(weight: number, value: number, countryCode: string): number {
    const baseRate = 14.99;
    const additionalItemRate = 4.00;
    
    const countryModifiers: { [key: string]: number } = {
      'CA': 1.0,
      'GB': 1.2,
      'AU': 1.5,
      'DE': 1.1,
      'FR': 1.1,
      'JP': 1.3,
      'default': 1.4
    };
    
    const modifier = countryModifiers[countryCode] || countryModifiers['default'];
    const weightSurcharge = Math.max(0, (weight - 1) * 2.50);
    
    return Math.round((baseRate + (weight - 1) * additionalItemRate + weightSurcharge) * modifier * 100) / 100;
  }
  
  // Get estimated shipping for a simple case (used in checkout)
  async getEstimatedShipping(cartItems: any[], countryCode: string = 'US', address?: Partial<ShippingAddress>): Promise<number> {
    const shippingAddress: ShippingAddress = { 
      country_code: countryCode,
      ...address
    };
    
    try {
      const rates = await this.getShippingRates(shippingAddress, cartItems);
      
      const standardRate = rates.find(rate => 
        rate.name.toLowerCase().includes('standard') || 
        rate.name.toLowerCase().includes('ground')
      );
      
      if (standardRate) {
        console.log('✅ Using real Printful shipping rate:', standardRate.rate);
        return standardRate.rate;
      }
      
      const cheapestRate = rates.reduce((min, rate) => rate.rate < min.rate ? rate : min, rates[0]);
      return cheapestRate.rate;
      
    } catch (error) {
      console.warn('⚠️ Shipping API failed, using fallback calculation');
      
      const fallbackRates = await this.calculateShippingRates(cartItems, shippingAddress);
      const standardRate = fallbackRates.find(rate => rate.name.includes('Standard'));
      return standardRate ? standardRate.rate : 9.99;
    }
  }
}

export const printfulService = new PrintfulService();
