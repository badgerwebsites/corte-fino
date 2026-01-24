-- Add redemption_code and fulfilled_at columns to reward_redemptions table
-- This enables the in-store redemption verification flow

ALTER TABLE reward_redemptions
ADD COLUMN IF NOT EXISTS redemption_code VARCHAR(6),
ADD COLUMN IF NOT EXISTS fulfilled_at TIMESTAMP WITH TIME ZONE;

-- Create an index on redemption_code for faster lookups
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_code ON reward_redemptions(redemption_code);

-- Add policy for admins to view and manage all redemptions
CREATE POLICY "Admins can view all redemptions" ON reward_redemptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = auth.uid() AND customers.is_admin = true
    )
  );

CREATE POLICY "Admins can update redemptions" ON reward_redemptions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = auth.uid() AND customers.is_admin = true
    )
  );

CREATE POLICY "Admins can delete redemptions" ON reward_redemptions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = auth.uid() AND customers.is_admin = true
    )
  );

-- Allow customers to create and delete their own pending redemptions
CREATE POLICY "Customers can create redemptions" ON reward_redemptions
  FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text);

CREATE POLICY "Customers can delete their pending redemptions" ON reward_redemptions
  FOR DELETE USING (
    auth.uid()::text = customer_id::text AND fulfilled = false
  );
