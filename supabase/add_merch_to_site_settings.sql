-- Add merch section fields to site_settings table
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS merch_image_url TEXT,
  ADD COLUMN IF NOT EXISTS merch_visible BOOLEAN NOT NULL DEFAULT FALSE;
