-- Create external_wishlist table for storing external Printful product IDs
-- This is separate from the main wishlist table which is for local product variants

CREATE TABLE IF NOT EXISTS external_wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  external_product_id TEXT NOT NULL, -- Printful product ID
  product_data JSONB DEFAULT '{}'::jsonb, -- Store additional product data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, external_product_id)
);

-- Create RLS policies for external_wishlist
ALTER TABLE external_wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own external wishlist"
  ON external_wishlist FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own external wishlist items"
  ON external_wishlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own external wishlist items"
  ON external_wishlist FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own external wishlist items"
  ON external_wishlist FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_external_wishlist_user_id ON external_wishlist(user_id);
CREATE INDEX idx_external_wishlist_product_id ON external_wishlist(external_product_id);

-- Create trigger for updated_at
CREATE TRIGGER update_external_wishlist_updated_at
  BEFORE UPDATE ON external_wishlist
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 