-- Migration: Add RLS policies for admin access
-- This allows admins to view all customers and bookings for the calendar feature

-- Add is_admin column to customers if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customers' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE customers ADD COLUMN is_admin BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Admin policies for customers table
-- Admins can view all customers
CREATE POLICY "Admins can view all customers" ON customers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = auth.uid() AND c.is_admin = true
    )
  );

-- Admin policies for bookings table
-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = auth.uid() AND customers.is_admin = true
    )
  );

-- Admins can update all bookings (for status changes)
CREATE POLICY "Admins can update all bookings" ON bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = auth.uid() AND customers.is_admin = true
    )
  );

-- Admin policies for reward_redemptions table
-- Admins can view all redemptions
CREATE POLICY "Admins can view all redemptions" ON reward_redemptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = auth.uid() AND customers.is_admin = true
    )
  );

-- Admins can update all redemptions (to mark as fulfilled)
CREATE POLICY "Admins can update all redemptions" ON reward_redemptions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = auth.uid() AND customers.is_admin = true
    )
  );
