import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_live_51ReVDI00c5ZfLNE8y35cPDpciyBEvQDspYDj4dxenXwA8qL19BEInR6JfusQ5fGZhOqGdj4iN9aUTItor7Dp03060026uZdU5Z');

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  variant_id?: string;
}

export interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  shipping?: number;
  notes?: string;
}

export interface CheckoutSessionRequest {
  cartItems: CartItem[];
  customerInfo: CustomerInfo;
  successUrl?: string;
  cancelUrl?: string;
}

class StripeService {
  private getApiUrl(): string {
    // Determine the correct API endpoint based on environment
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8888/.netlify/functions';
      } else if (hostname.includes('netlify.app') || hostname === 'praytees.com' || hostname.includes('praytees')) {
        return '/.netlify/functions';
      }
    }
    
    return '/.netlify/functions';
  }

  async createCheckoutSession(request: CheckoutSessionRequest): Promise<{ sessionId: string; url: string }> {
    try {
      const apiUrl = this.getApiUrl();
      console.log('🔄 Creating Stripe checkout session via:', `${apiUrl}/create-checkout-session`);

      const response = await fetch(`${apiUrl}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`HTTP ${response.status}: ${errorData.error || 'Failed to create checkout session'}`);
      }

      const data = await response.json();
      console.log('✅ Stripe checkout session created:', data.sessionId);
      
      return data;
    } catch (error) {
      console.error('❌ Error creating Stripe checkout session:', error);
      throw error;
    }
  }

  async redirectToCheckout(sessionId: string): Promise<void> {
    try {
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      console.log('🔄 Redirecting to Stripe checkout:', sessionId);

      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        console.error('❌ Stripe redirect error:', error);
        throw error;
      }
    } catch (error) {
      console.error('❌ Error redirecting to checkout:', error);
      throw error;
    }
  }

  async createAndRedirectToCheckout(request: CheckoutSessionRequest): Promise<void> {
    try {
      const { sessionId } = await this.createCheckoutSession(request);
      await this.redirectToCheckout(sessionId);
    } catch (error) {
      console.error('❌ Error in complete checkout flow:', error);
      throw error;
    }
  }

  // Utility method to validate cart items before checkout
  validateCartItems(cartItems: CartItem[]): boolean {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return false;
    }

    return cartItems.every(item => 
      item.id && 
      item.name && 
      typeof item.price === 'number' && 
      item.price > 0 &&
      typeof item.quantity === 'number' && 
      item.quantity > 0 &&
      item.size && 
      item.color
    );
  }

  // Utility method to calculate total
  calculateTotal(cartItems: CartItem[], shipping: number = 0, taxRate: number = 0.08): {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  } {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }
}

export const stripeService = new StripeService(); 