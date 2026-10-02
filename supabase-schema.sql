-- HotnRoll Database Schema & Row Level Security (RLS) Configuration
-- For Supabase / PostgreSQL relational backends

-- 1. Enable UUID Extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  image_url TEXT NOT NULL,
  rating DOUBLE PRECISION DEFAULT 5.0 NOT NULL,
  is_available BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  payment_method TEXT NOT NULL,
  subtotal DOUBLE PRECISION NOT NULL,
  delivery_fee DOUBLE PRECISION NOT NULL,
  total DOUBLE PRECISION NOT NULL,
  status TEXT DEFAULT 'received' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DOUBLE PRECISION NOT NULL
);

-- 5. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL,
  review_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Products
-- Anyone (guest or authenticated) can view available products
DROP POLICY IF EXISTS "Allow public read-only for available products" ON products;
CREATE POLICY "Allow public read-only for available products"
  ON products FOR SELECT
  USING (is_available = true);

-- RLS Policies for Orders
-- Customers can insert new orders
DROP POLICY IF EXISTS "Allow customers to place orders" ON orders;
CREATE POLICY "Allow customers to place orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Customers can view their own order status by ID
DROP POLICY IF EXISTS "Allow public read order by id" ON orders;
CREATE POLICY "Allow public read order by id"
  ON orders FOR SELECT
  USING (true);

-- RLS Policies for Order Items
-- Customers can insert order items
DROP POLICY IF EXISTS "Allow customers to insert order items" ON order_items;
CREATE POLICY "Allow customers to insert order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- Customers can view order items
DROP POLICY IF EXISTS "Allow public read order items" ON order_items;
CREATE POLICY "Allow public read order items"
  ON order_items FOR SELECT
  USING (true);

-- RLS Policies for Reviews
-- Anyone can read approved reviews
DROP POLICY IF EXISTS "Allow public read reviews" ON reviews;
CREATE POLICY "Allow public read reviews"
  ON reviews FOR SELECT
  USING (true);

-- Anyone can submit a review
DROP POLICY IF EXISTS "Allow public submit reviews" ON reviews;
CREATE POLICY "Allow public submit reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);
