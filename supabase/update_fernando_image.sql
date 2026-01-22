-- Update Fernando Lopez's barber record with image URL
UPDATE barbers
SET image_url = '/images/barbers/fernando-lopez.jpg',
    updated_at = NOW()
WHERE name = 'Fernando Lopez';
