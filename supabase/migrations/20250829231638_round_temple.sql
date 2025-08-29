/*
  # Create solar panels table

  1. New Tables
    - `solar_panels`
      - `id` (uuid, primary key)
      - `owner_id` (uuid, foreign key to users)
      - `brand` (text, not null)
      - `model` (text, not null)
      - `power_rating` (integer, not null) - in watts
      - `quantity` (integer, not null)
      - `condition` (enum: excellent, good, fair, poor)
      - `manufacturing_year` (integer, not null)
      - `price` (decimal, optional) - suggested price by admin
      - `description` (text, optional)
      - `status` (enum: pending, for_sale, sold, recycled, rejected)
      - `images` (text array) - URLs to images
      - `location` (text, not null)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `solar_panels` table
    - Add policies for owners to manage their panels
    - Add policies for recyclers to view for_sale panels
    - Add policies for admins to manage all panels
*/

-- Create custom types
CREATE TYPE solar_panel_condition AS ENUM ('excellent', 'good', 'fair', 'poor');
CREATE TYPE solar_panel_status AS ENUM ('pending', 'for_sale', 'sold', 'recycled', 'rejected');

-- Create solar_panels table
CREATE TABLE IF NOT EXISTS solar_panels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand text NOT NULL,
  model text NOT NULL,
  power_rating integer NOT NULL CHECK (power_rating > 0),
  quantity integer NOT NULL CHECK (quantity > 0),
  condition solar_panel_condition NOT NULL,
  manufacturing_year integer NOT NULL CHECK (manufacturing_year >= 1990 AND manufacturing_year <= EXTRACT(YEAR FROM CURRENT_DATE)),
  price decimal(10,2),
  description text,
  status solar_panel_status NOT NULL DEFAULT 'pending',
  images text[] DEFAULT '{}',
  location text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE solar_panels ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Owners can manage their panels"
  ON solar_panels
  FOR ALL
  TO authenticated
  USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Recyclers can view for_sale panels"
  ON solar_panels
  FOR SELECT
  TO authenticated
  USING (
    status = 'for_sale' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('recycler', 'admin')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_solar_panels_owner_id ON solar_panels(owner_id);
CREATE INDEX IF NOT EXISTS idx_solar_panels_status ON solar_panels(status);
CREATE INDEX IF NOT EXISTS idx_solar_panels_brand ON solar_panels(brand);
CREATE INDEX IF NOT EXISTS idx_solar_panels_power_rating ON solar_panels(power_rating);

-- Create trigger for updated_at
CREATE TRIGGER update_solar_panels_updated_at
  BEFORE UPDATE ON solar_panels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();