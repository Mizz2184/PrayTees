-- Add products column to wishlist table for storing Printful product IDs
-- This allows us to store external product IDs before they're synced to our local products table

ALTER TABLE wishlist ADD COLUMN IF NOT EXISTS products JSONB DEFAULT '[]'::jsonb;

-- Create index for better query performance on products column
CREATE INDEX IF NOT EXISTS idx_wishlist_products ON wishlist USING gin(products);

-- Update existing records to have empty products array if they don't have it
UPDATE wishlist SET products = '[]'::jsonb WHERE products IS NULL; 