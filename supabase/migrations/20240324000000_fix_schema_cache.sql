-- Drop existing tables
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Recreate products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  printful_id TEXT UNIQUE NOT NULL,
  external_id VARCHAR(255),
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Recreate product variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  printful_variant_id TEXT UNIQUE NOT NULL,
  external_id VARCHAR(255),
  name TEXT NOT NULL,
  sku TEXT,
  retail_price DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL,
  size TEXT,
  color TEXT,
  image_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Recreate RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);
CREATE POLICY "Products are modifiable by authenticated users" ON products
  FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product variants are viewable by everyone" ON product_variants
  FOR SELECT USING (true);
CREATE POLICY "Product variants are modifiable by authenticated users" ON product_variants
  FOR ALL USING (auth.role() = 'authenticated');

-- Recreate indexes
CREATE INDEX idx_products_printful_id ON products(printful_id);
CREATE INDEX idx_product_variants_printful_id ON product_variants(printful_variant_id);

-- Recreate triggers
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 