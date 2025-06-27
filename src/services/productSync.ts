import { createClient } from '@supabase/supabase-js';
import { printfulService, PrintfulProduct, PrintfulVariant } from './printfulApi.js';
import fetch from 'cross-fetch';
import https from 'https';

// Create a Supabase client with the service role key
const supabaseAdmin = createClient(
  'https://aqfqvgbqgnlyqbzgzjxr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZnF2Z2JxZ25seXFiemd6anhyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMTIyNDQ0MCwiZXhwIjoyMDI2ODAwNDQwfQ.Pu_IiNT7OYyODXg_9DGZcRSJmZlcjGOUxhN-Hs4UxDY',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZnF2Z2JxZ25seXFiemd6anhyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMTIyNDQ0MCwiZXhwIjoyMDI2ODAwNDQwfQ.Pu_IiNT7OYyODXg_9DGZcRSJmZlcjGOUxhN-Hs4UxDY',
      },
      fetch: (url, options) => {
        const agent = new https.Agent({
          rejectUnauthorized: false,
        });
        return fetch(url, { ...options, agent });
      },
    },
  }
);

export class ProductSyncService {
  async syncProducts() {
    try {
      const printfulProducts = await printfulService.getAllProducts();
      
      for (const printfulProduct of printfulProducts) {
        // Insert or update product
        const { data: product, error: productError } = await supabaseAdmin
          .from('products')
          .upsert({
            printful_id: printfulProduct.id.toString(),
            name: printfulProduct.name,
            thumbnail_url: printfulProduct.thumbnail_url,
          }, {
            onConflict: 'printful_id'
          })
          .select()
          .single();

        if (productError) {
          console.error('Error upserting product:', productError);
          continue;
        }

        // Process variants
        for (const printfulVariant of printfulProduct.variants) {
          const variantData = this.extractVariantData(printfulVariant);
          
          const { error: variantError } = await supabaseAdmin
            .from('product_variants')
            .upsert({
              ...variantData,
              product_id: product.id,
              printful_variant_id: printfulVariant.id.toString(),
            }, {
              onConflict: 'printful_variant_id'
            });

          if (variantError) {
            console.error('Error upserting variant:', variantError);
          }
        }
      }

      console.log('Product sync completed successfully');
    } catch (error) {
      console.error('Product sync failed:', error);
      throw error;
    }
  }

  private extractVariantData(variant: PrintfulVariant) {
    return {
      name: variant.name,
      sku: variant.sku,
      retail_price: parseFloat(variant.retail_price),
      currency: variant.currency,
      size: variant.size,
      color: variant.color,
      image_url: variant.product.image,
    };
  }
}

export const productSyncService = new ProductSyncService(); 