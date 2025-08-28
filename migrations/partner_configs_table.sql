-- Create partner_configs table for dynamic partner pages
CREATE TABLE IF NOT EXISTS partner_configs (
  id VARCHAR(100) PRIMARY KEY,  -- e.g., 'broward-esol'
  name VARCHAR(100) NOT NULL,   -- e.g., 'Broward ESOL'
  full_name VARCHAR(255) NOT NULL, -- e.g., 'Broward County School District ESOL'
  location VARCHAR(255),
  primary_color VARCHAR(50) DEFAULT 'blue',
  secondary_color VARCHAR(50) DEFAULT 'purple',
  student_count VARCHAR(50),
  time_saved VARCHAR(50),
  availability VARCHAR(50) DEFAULT '24/7',
  improvement VARCHAR(50) DEFAULT '2x Faster',
  focus_areas JSONB DEFAULT '[]',
  calendar_link TEXT,
  contact_email VARCHAR(255) DEFAULT 'anthony@encanto.ai',
  custom_message TEXT,
  features JSONB DEFAULT '[]',
  testimonial JSONB, -- {quote, author, role}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on id for faster lookups
CREATE INDEX idx_partner_configs_id ON partner_configs(id);

-- Insert a sample partner to test
INSERT INTO partner_configs (
  id, 
  name, 
  full_name, 
  location,
  primary_color,
  student_count,
  time_saved,
  focus_areas,
  custom_message
) VALUES (
  'palm-beach-esol',
  'Palm Beach ESOL',
  'Palm Beach County School District ESOL',
  'West Palm Beach, FL',
  'green',
  '30,000+',
  '40 hrs/week',
  '["WIDA ACCESS Prep", "K-12 ELL Support", "Speaking Assessment"]',
  'Supporting Palm Beach County''s diverse student population!'
);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_partner_configs_updated_at BEFORE UPDATE
ON partner_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();