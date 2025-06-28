import { useQuery } from '@tanstack/react-query';
import { printfulService, PrintfulProduct } from '../services/printfulApi';

export const usePrintfulProducts = () => {
  const query = useQuery({
    queryKey: ['printful-products'],
    queryFn: async () => {
      console.log('🚀 usePrintfulProducts: Starting optimized query...');
      try {
        const result = await printfulService.getAllProductsFast();
        console.log('🚀 usePrintfulProducts: Fast result from API:', result);
        console.log('🚀 usePrintfulProducts: Result length:', result?.length || 0);
        
        if (!result || result.length === 0) {
          console.warn('🚀 usePrintfulProducts: No data returned from service, returning empty array');
          return [];
        }
        
        return result;
      } catch (error) {
        console.error('🚀 usePrintfulProducts: Error in queryFn:', error);
        // Instead of throwing, return empty array to trigger fallback in components
        console.log('🚀 usePrintfulProducts: Returning empty array due to error');
        return [];
      }
    },
    // 🚀 AGGRESSIVE CACHING FOR FASTER LOADING
    staleTime: 15 * 60 * 1000, // 15 minutes - products don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes - keep in memory longer
    retry: 1, // Reduced retries for faster fallback
    retryDelay: 500, // Faster retry
    // Always consider the query successful, even with empty data
    throwOnError: false,
    // 🚀 DISABLE UNNECESSARY REFETCHES
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  console.log('🚀 React Query state:');
  console.log('🚀 isLoading:', query.isLoading);
  console.log('🚀 isFetching:', query.isFetching);
  console.log('🚀 isSuccess:', query.isSuccess);
  console.log('🚀 isError:', query.isError);
  console.log('🚀 error:', query.error);
  console.log('🚀 data:', query.data);
  console.log('🚀 status:', query.status);

  return query;
};

// 🚀 OPTIMIZED transformation - removed excessive logging
export const transformPrintfulToProduct = (printfulProduct: any) => {
  // Get the first variant for pricing and other details
  const firstVariant = printfulProduct.firstVariant;
  const variants = printfulProduct.variants || [];
  
  // Extract real price from first variant - now with enhanced data
  let price = 24.99; // Default fallback
  
  // Use real Printful pricing when available
  if (firstVariant && firstVariant.retail_price) {
    price = parseFloat(firstVariant.retail_price);
  } else if (variants.length > 0) {
    // Try to get price from any available variant
    const variantWithPrice = variants.find((v: any) => v.retail_price);
    if (variantWithPrice) {
      price = parseFloat(variantWithPrice.retail_price);
    }
  }
  
  // If we still don't have a price, use product-name-based fallback
  if (price === 24.99) {
    if (printfulProduct.name.toLowerCase().includes('hoodie')) {
      price = 49.99;
    } else if (printfulProduct.name.toLowerCase().includes('tank')) {
      price = 22.99;
    } else if (printfulProduct.name.toLowerCase().includes('prayer')) {
      price = 49.99;
    } else if (printfulProduct.name.toLowerCase().includes('chosen')) {
      price = 26.99;
    } else if (printfulProduct.name.toLowerCase().includes('pray without')) {
      price = 28.99;
    } else if (printfulProduct.name.toLowerCase().includes('saved')) {
      price = 52.99;
    } else {
      price = 24.99;
    }
  }
  
  // Use preview image from first variant if available, otherwise thumbnail
  const mainImage = firstVariant?.files?.find((file: any) => file.type === 'preview')?.preview_url || 
                   printfulProduct.thumbnail_url || 
                   "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // Extract unique sizes from variants or use defaults
  const sizes = variants.length > 0 
    ? [...new Set(variants
        .map((variant: any) => variant.size)
        .filter((size: string) => size))]
        .sort()
    : ["XS", "S", "M", "L", "XL", "XXL"];

  // Extract unique colors from variants or use defaults
  const colors = variants.length > 0
    ? [...new Set(variants
        .map((variant: any) => variant.color)
        .filter((color: string) => color))]
    : ["Black", "White", "Navy"];

  // Create variant mapping for shipping calculations and color switching
  const variantMapping = variants.length > 0 
    ? variants.reduce((map: any, variant: any) => {
        const key = `${variant.size || 'default'}-${variant.color || 'default'}`;
        map[key] = variant.id;
        return map;
      }, {})
    : { 'default-default': firstVariant?.id || 2 }; // Use first variant ID or fallback

  // Create color to image mapping for variant switching
  const colorImageMapping = variants.length > 0
    ? variants.reduce((map: any, variant: any) => {
        if (variant.color && variant.files) {
          const previewFile = variant.files.find((file: any) => file.type === 'preview');
          if (previewFile && previewFile.preview_url) {
            map[variant.color] = previewFile.preview_url;
          }
        }
        return map;
      }, {})
    : {};

  // Create variant price mapping for real-time price updates
  const variantPriceMapping = variants.length > 0
    ? variants.reduce((map: any, variant: any) => {
        if (variant.color && variant.size && variant.retail_price) {
          const key = `${variant.size}-${variant.color}`;
          map[key] = parseFloat(variant.retail_price);
        }
        return map;
      }, {})
    : {};

  const transformedProduct = {
    id: printfulProduct.id.toString(),
    name: printfulProduct.name,
    price: price,
    image: mainImage,
    description: `Premium quality ${printfulProduct.name.toLowerCase()} with faith-based design.`,
    sizes: sizes,
    colors: colors,
    category: printfulProduct.name.includes('t-shirt') || printfulProduct.name.includes('tee') || printfulProduct.name.includes('Tee') ? 'Tees' : 
              printfulProduct.name.includes('Hoodie') || printfulProduct.name.includes('hoodie') ? 'Hoodies' :
              printfulProduct.name.includes('Tank') || printfulProduct.name.includes('tank') ? 'Tanks' : 'Apparel',
    // Add Printful-specific data for shipping calculations and variant switching
    printful_id: printfulProduct.id,
    default_variant_id: firstVariant?.id || 2,
    variant_mapping: variantMapping,
    color_image_mapping: colorImageMapping,
    variant_price_mapping: variantPriceMapping,
    all_variants: variants // Store all variants for detailed modal functionality
  };
  
  return transformedProduct;
};
