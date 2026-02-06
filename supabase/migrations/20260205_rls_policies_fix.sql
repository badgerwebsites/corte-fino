-- Migration: Fix RLS policies for customers and bookings tables
-- Run this in Supabase SQL Editor

-- ============================================
-- HELPER FUNCTION TO CHECK ADMIN STATUS
-- Uses SECURITY DEFINER to bypass RLS and avoid infinite recursion
-- ============================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM customers
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- CUSTOMERS TABLE POLICIES
-- ============================================

-- First, drop existing policies to recreate them cleanly
DROP POLICY IF EXISTS "Customers can view their own data" ON customers;
DROP POLICY IF EXISTS "Customers can update their own data" ON customers;
DROP POLICY IF EXISTS "Customers can insert their own data" ON customers;
DROP POLICY IF EXISTS "Admins can view all customers" ON customers;
DROP POLICY IF EXISTS "Admins can update all customers" ON customers;

-- Enable RLS (in case it's not enabled)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Customers can view their own data
CREATE POLICY "Customers can view their own data" ON customers
  FOR SELECT USING (auth.uid() = id);

-- Customers can update their own data
CREATE POLICY "Customers can update their own data" ON customers
  FOR UPDATE USING (auth.uid() = id);

-- Customers can insert their own record (for signup)
CREATE POLICY "Customers can insert their own data" ON customers
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can view all customers (uses helper function to avoid recursion)
CREATE POLICY "Admins can view all customers" ON customers
  FOR SELECT USING (is_admin());

-- Admins can update all customers
CREATE POLICY "Admins can update all customers" ON customers
  FOR UPDATE USING (is_admin());

-- ============================================
-- BOOKINGS TABLE POLICIES
-- ============================================

-- Drop existing policies to recreate them cleanly
DROP POLICY IF EXISTS "Customers can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Customers can insert their own bookings" ON bookings;
DROP POLICY IF EXISTS "Customers can update their own bookings" ON bookings;
DROP POLICY IF EXISTS "Customers can delete their own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can update all bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can delete all bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can insert bookings" ON bookings;

-- Enable RLS (in case it's not enabled)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Customers can view their own bookings
CREATE POLICY "Customers can view their own bookings" ON bookings
  FOR SELECT USING (auth.uid() = customer_id);

-- Customers can insert their own bookings
CREATE POLICY "Customers can insert their own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Customers can update their own bookings
CREATE POLICY "Customers can update their own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = customer_id);

-- Customers can delete their own bookings (for cancellation)
CREATE POLICY "Customers can delete their own bookings" ON bookings
  FOR DELETE USING (auth.uid() = customer_id);

-- Admins can view all bookings (uses helper function)
CREATE POLICY "Admins can view all bookings" ON bookings
  FOR SELECT USING (is_admin());

-- Admins can insert bookings
CREATE POLICY "Admins can insert bookings" ON bookings
  FOR INSERT WITH CHECK (is_admin());

-- Admins can update all bookings
CREATE POLICY "Admins can update all bookings" ON bookings
  FOR UPDATE USING (is_admin());

-- Admins can delete all bookings
CREATE POLICY "Admins can delete all bookings" ON bookings
  FOR DELETE USING (is_admin());
