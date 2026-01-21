-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  stripe_customer_id TEXT,
  reward_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create barbers table
CREATE TABLE barbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  bio TEXT,
  instagram_handle TEXT,
  facebook_url TEXT,
  tiktok_handle TEXT,
  image_url TEXT,
  base_price_multiplier DECIMAL(3,2) DEFAULT 1.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table (haircut, beard trim, etc.)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  reward_points INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pricing_rules table (time-based pricing)
CREATE TABLE pricing_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  price_multiplier DECIMAL(3,2) NOT NULL,
  days_of_week INTEGER[] DEFAULT ARRAY[0,1,2,3,4,5,6],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  barber_id UUID REFERENCES barbers(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  cancellation_fee_charged BOOLEAN DEFAULT false,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  reminder_sent BOOLEAN DEFAULT false,
  review_request_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(barber_id, booking_date, start_time)
);

-- Create rewards table
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  reward_type TEXT CHECK (reward_type IN ('product', 'service', 'merchandise')),
  item_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reward_redemptions table
CREATE TABLE reward_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE,
  points_spent INTEGER NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fulfilled BOOLEAN DEFAULT false
);

-- Create shop_settings table (address, business info)
CREATE TABLE shop_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT DEFAULT 'Corte Fino Barbershop',
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  google_maps_url TEXT,
  cancellation_hours INTEGER DEFAULT 12,
  cancellation_fee_percentage DECIMAL(3,2) DEFAULT 0.50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_barber ON bookings(barber_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);

-- Insert default shop settings
INSERT INTO shop_settings (
  business_name,
  address_line1,
  city,
  state,
  zip_code,
  phone,
  email
) VALUES (
  'Corte Fino Barbershop',
  '123 Main Street',
  'Your City',
  'CA',
  '90000',
  '(555) 123-4567',
  'info@cortefino.com'
);

-- Insert default rewards
INSERT INTO rewards (name, description, points_required, reward_type, item_name, sort_order) VALUES
  ('Free Hair Powder', 'Get a free premium hair powder', 100, 'product', 'Hair Powder', 1),
  ('Free Hair Clay', 'Get a free premium hair clay', 200, 'product', 'Hair Clay', 2),
  ('Free T-Shirt', 'Get a free Corte Fino branded t-shirt', 300, 'merchandise', 'T-Shirt', 3),
  ('Free Haircut', 'Get a complimentary haircut', 500, 'service', 'Haircut', 4),
  ('Free Hoodie', 'Get a free Corte Fino branded hoodie', 700, 'merchandise', 'Hoodie', 5);

-- Insert a default service (haircut)
INSERT INTO services (name, description, base_price, duration_minutes, reward_points) VALUES
  ('Classic Haircut', 'Traditional barbershop haircut with precision and style', 45.00, 45, 10),
  ('Haircut + Beard Trim', 'Full haircut service with beard grooming', 60.00, 60, 15),
  ('Kids Haircut', 'Haircut for children under 12', 35.00, 30, 8);

-- Insert pricing rules for time-based pricing
INSERT INTO pricing_rules (name, start_time, end_time, price_multiplier, days_of_week) VALUES
  ('Evening Premium', '17:00', '21:00', 1.55, ARRAY[0,1,2,3,4,5,6]),
  ('Regular Hours', '09:00', '17:00', 1.00, ARRAY[0,1,2,3,4,5,6]);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_barbers_updated_at BEFORE UPDATE ON barbers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access to barbers, services, rewards, pricing_rules
CREATE POLICY "Public can view barbers" ON barbers FOR SELECT USING (true);
CREATE POLICY "Public can view services" ON services FOR SELECT USING (true);
CREATE POLICY "Public can view rewards" ON rewards FOR SELECT USING (true);
CREATE POLICY "Public can view pricing rules" ON pricing_rules FOR SELECT USING (true);
CREATE POLICY "Public can view shop settings" ON shop_settings FOR SELECT USING (true);

-- Customers can view and update their own data
CREATE POLICY "Customers can view their own data" ON customers
  FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Customers can update their own data" ON customers
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Customers can view their own bookings
CREATE POLICY "Customers can view their own bookings" ON bookings
  FOR SELECT USING (auth.uid()::text = customer_id::text);
CREATE POLICY "Customers can insert their own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text);
CREATE POLICY "Customers can update their own bookings" ON bookings
  FOR UPDATE USING (auth.uid()::text = customer_id::text);

-- Customers can view their own reward redemptions
CREATE POLICY "Customers can view their own redemptions" ON reward_redemptions
  FOR SELECT USING (auth.uid()::text = customer_id::text);
