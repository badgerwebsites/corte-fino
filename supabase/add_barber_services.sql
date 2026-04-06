-- Create barber_services junction table
CREATE TABLE barber_services (
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (barber_id, service_id)
);

-- Enable RLS
ALTER TABLE barber_services ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can view barber services" ON barber_services FOR SELECT USING (true);

-- Admin write access
CREATE POLICY "Admins can manage barber services" ON barber_services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM customers WHERE id = auth.uid()::uuid AND is_admin = true
    )
  );

CREATE INDEX idx_barber_services_barber ON barber_services(barber_id);
CREATE INDEX idx_barber_services_service ON barber_services(service_id);
