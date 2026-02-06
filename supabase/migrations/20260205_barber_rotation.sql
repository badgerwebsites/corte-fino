-- Add barber rotation tracking for "Any Barber" bookings
-- This enables round-robin assignment: Fernando -> Jonny -> Joel -> repeat

-- Add column to track the last barber assigned via "Any Barber" selection
ALTER TABLE shop_settings
ADD COLUMN IF NOT EXISTS last_rotation_barber_id UUID REFERENCES barbers(id);

-- Create a function to update the rotation (bypasses RLS for booking flow)
CREATE OR REPLACE FUNCTION update_barber_rotation(new_barber_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE shop_settings
  SET last_rotation_barber_id = new_barber_id,
      updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Allow authenticated users to execute the rotation update function
GRANT EXECUTE ON FUNCTION update_barber_rotation(UUID) TO authenticated;

-- Add update policy for shop_settings if not exists
-- This allows the app to update the rotation field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'shop_settings'
    AND policyname = 'Authenticated users can update shop_settings rotation'
  ) THEN
    CREATE POLICY "Authenticated users can update shop_settings rotation"
    ON shop_settings
    FOR UPDATE
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;
