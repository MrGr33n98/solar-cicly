/*
  # Create transactions table

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `solar_panel_id` (uuid, foreign key to solar_panels)
      - `recycler_id` (uuid, foreign key to users)
      - `owner_id` (uuid, foreign key to users)
      - `quantity` (integer, not null)
      - `offered_price` (decimal, not null)
      - `agreed_price` (decimal, optional)
      - `status` (enum: pending, approved, cancelled, in_transit, completed)
      - `notes` (text, optional)
      - `pickup_date` (date, optional)
      - `pickup_address` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `transactions` table
    - Add policies for transaction participants to view/manage
    - Add policies for admins to manage all transactions

  3. Constraints
    - Ensure quantity doesn't exceed available panel quantity
    - Ensure recycler and owner are different users
*/

-- Create custom types
CREATE TYPE transaction_status AS ENUM ('pending', 'approved', 'cancelled', 'in_transit', 'completed');

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  solar_panel_id uuid NOT NULL REFERENCES solar_panels(id) ON DELETE CASCADE,
  recycler_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity > 0),
  offered_price decimal(10,2) NOT NULL CHECK (offered_price > 0),
  agreed_price decimal(10,2) CHECK (agreed_price > 0),
  status transaction_status NOT NULL DEFAULT 'pending',
  notes text,
  pickup_date date,
  pickup_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT different_users CHECK (recycler_id != owner_id)
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Transaction participants can view"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (
    recycler_id = auth.uid() OR 
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Recyclers can create transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    recycler_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'recycler' AND status = 'active'
    )
  );

CREATE POLICY "Owners can update their transactions"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (
    owner_id = auth.uid() OR
    recycler_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_solar_panel_id ON transactions(solar_panel_id);
CREATE INDEX IF NOT EXISTS idx_transactions_recycler_id ON transactions(recycler_id);
CREATE INDEX IF NOT EXISTS idx_transactions_owner_id ON transactions(owner_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Create trigger for updated_at
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to validate transaction quantity
CREATE OR REPLACE FUNCTION validate_transaction_quantity()
RETURNS trigger AS $$
BEGIN
  -- Check if quantity doesn't exceed available panel quantity
  IF NOT EXISTS (
    SELECT 1 FROM solar_panels 
    WHERE id = NEW.solar_panel_id 
    AND quantity >= NEW.quantity
    AND status = 'for_sale'
  ) THEN
    RAISE EXCEPTION 'Quantidade solicitada excede a disponível ou painel não está à venda';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for quantity validation
CREATE TRIGGER validate_transaction_quantity_trigger
  BEFORE INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION validate_transaction_quantity();