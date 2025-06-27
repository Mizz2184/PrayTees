const SUPABASE_URL = 'https://gfocosanduehxlnnbzom.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmb2Nvc2FuZHVlaHhsbm5iem9tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDc0MTg5MywiZXhwIjoyMDY2MzE3ODkzfQ.uf1i_39qugNUqNPAEspu2rO9t_U75Rl2a3zGqSAgp6Y';

async function makeSupabaseRequest(endpoint, method = 'GET', body = null) {
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  };

  const response = await fetch(`${SUPABASE_URL}/rest/v1${endpoint}`, options);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Supabase API error: ${response.status} - ${JSON.stringify(error)}`);
  }

  return await response.json();
}

async function testDatabase() {
  try {
    // Get all products
    const products = await makeSupabaseRequest('/products');
    console.log('\nProducts:', products.length);
    products.forEach(product => {
      console.log(`- ${product.name} (ID: ${product.printful_id})`);
    });

    // Get all variants
    const variants = await makeSupabaseRequest('/product_variants');
    console.log('\nVariants:', variants.length);
    console.log('Sample variants:');
    variants.slice(0, 5).forEach(variant => {
      console.log(`- ${variant.name} (ID: ${variant.printful_variant_id})`);
      console.log(`  Size: ${variant.size}, Color: ${variant.color}`);
      console.log(`  Price: ${variant.retail_price} ${variant.currency}`);
    });
  } catch (error) {
    console.error('Error testing database:', error);
  }
}

testDatabase(); 