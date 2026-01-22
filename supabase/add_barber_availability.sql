-- Add barber availability schedule table
-- This allows barbers to set which days/times they work

CREATE TABLE barber_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(barber_id, day_of_week, start_time)
);

-- Add barber time off/blocked dates table
-- For specific dates when a barber is not available
CREATE TABLE barber_time_off (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_barber_availability_barber ON barber_availability(barber_id);
CREATE INDEX idx_barber_availability_day ON barber_availability(day_of_week);
CREATE INDEX idx_barber_time_off_barber ON barber_time_off(barber_id);
CREATE INDEX idx_barber_time_off_dates ON barber_time_off(start_date, end_date);

-- Add updated_at trigger
CREATE TRIGGER update_barber_availability_updated_at BEFORE UPDATE ON barber_availability
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_barber_time_off_updated_at BEFORE UPDATE ON barber_time_off
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE barber_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE barber_time_off ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Public can view barber availability" ON barber_availability FOR SELECT USING (true);
CREATE POLICY "Public can view barber time off" ON barber_time_off FOR SELECT USING (true);

-- Insert default availability for existing barbers (Mon-Sat, 9am-9pm)
-- Run this after creating the table
-- Note: 0 = Sunday, 1 = Monday, etc.
INSERT INTO barber_availability (barber_id, day_of_week, start_time, end_time, is_available)
SELECT
  b.id as barber_id,
  day_num as day_of_week,
  '09:00'::time as start_time,
  '21:00'::time as end_time,
  true as is_available
FROM
  barbers b,
  generate_series(1, 6) as day_num  -- Monday (1) through Saturday (6)
WHERE b.is_active = true;
