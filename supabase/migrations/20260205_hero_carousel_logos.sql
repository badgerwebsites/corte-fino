-- Add additional hero logo columns for the hero carousel
-- These allow 3 logos to rotate on the home page hero section

ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS hero_logo_2_url TEXT,
ADD COLUMN IF NOT EXISTS hero_logo_3_url TEXT;
