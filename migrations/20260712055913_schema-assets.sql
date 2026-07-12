-- Create asset_tag sequence
CREATE SEQUENCE IF NOT EXISTS public.asset_tag_seq START WITH 1000;

-- Create assets table
CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_tag VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
  serial_number VARCHAR(100),
  acquisition_date DATE NOT NULL DEFAULT CURRENT_DATE,
  acquisition_cost DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  condition VARCHAR(20) NOT NULL CHECK (condition IN ('new', 'good', 'fair', 'poor')) DEFAULT 'good',
  location VARCHAR(255),
  current_holder_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('available', 'allocated', 'reserved', 'under_maintenance', 'lost', 'retired', 'disposed')) DEFAULT 'available',
  is_shared BOOLEAN NOT NULL DEFAULT FALSE,
  documents JSONB DEFAULT '[]'::jsonb,
  photos JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_assets_category_id ON public.assets(category_id);
CREATE INDEX idx_assets_current_holder_id ON public.assets(current_holder_id);
CREATE INDEX idx_assets_status ON public.assets(status);
CREATE INDEX idx_assets_asset_tag ON public.assets(asset_tag);

-- Trigger function to auto-generate asset_tag if null or empty
CREATE OR REPLACE FUNCTION public.generate_asset_tag()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.asset_tag IS NULL OR NEW.asset_tag = '' THEN
    NEW.asset_tag := 'AST-' || lpad(nextval('public.asset_tag_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate asset_tag before insert
CREATE TRIGGER tr_assets_generate_tag
  BEFORE INSERT ON public.assets
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_asset_tag();

-- Enable Row Level Security (RLS)
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Read policy (accessible to all authenticated users)
CREATE POLICY "anyone can select assets" ON public.assets FOR SELECT TO authenticated USING (true);

-- Admin & Asset Manager DML policies
CREATE POLICY "managers can insert assets" ON public.assets FOR INSERT TO authenticated WITH CHECK (public.get_current_user_role() IN ('admin', 'asset_manager'));
CREATE POLICY "managers can update assets" ON public.assets FOR UPDATE TO authenticated USING (public.get_current_user_role() IN ('admin', 'asset_manager')) WITH CHECK (public.get_current_user_role() IN ('admin', 'asset_manager'));
CREATE POLICY "managers can delete assets" ON public.assets FOR DELETE TO authenticated USING (public.get_current_user_role() IN ('admin', 'asset_manager'));

-- Grant DML privileges on public tables to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assets TO authenticated;

-- Trigger for auto-updating updated_at timestamp
CREATE TRIGGER tr_assets_updated_at BEFORE UPDATE ON public.assets FOR EACH ROW EXECUTE FUNCTION system.update_updated_at();
