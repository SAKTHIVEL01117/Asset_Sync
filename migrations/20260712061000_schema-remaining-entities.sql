-- Create helper function to get current employee's ID from auth.uid()
CREATE OR REPLACE FUNCTION public.get_current_employee_id()
RETURNS UUID
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  emp_id UUID;
BEGIN
  SELECT id INTO emp_id FROM public.employees WHERE user_id = auth.uid();
  RETURN emp_id;
END;
$$;

-- ============================================================================
-- 1. Asset Allocations Table
-- ============================================================================
CREATE TABLE public.asset_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  allocated_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  allocated_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expected_return TIMESTAMPTZ,
  returned_date TIMESTAMPTZ,
  allocation_status VARCHAR(20) NOT NULL CHECK (allocation_status IN ('active', 'returned', 'overdue')) DEFAULT 'active',
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_asset_allocations_asset_id ON public.asset_allocations(asset_id);
CREATE INDEX idx_asset_allocations_user_id ON public.asset_allocations(user_id);
CREATE INDEX idx_asset_allocations_allocated_by ON public.asset_allocations(allocated_by);
CREATE INDEX idx_asset_allocations_status ON public.asset_allocations(allocation_status);

-- Enable RLS
ALTER TABLE public.asset_allocations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "anyone can select asset allocations" ON public.asset_allocations FOR SELECT TO authenticated USING (true);
CREATE POLICY "managers can insert asset allocations" ON public.asset_allocations FOR INSERT TO authenticated WITH CHECK (public.get_current_user_role() IN ('admin', 'asset_manager'));
CREATE POLICY "managers can update asset allocations" ON public.asset_allocations FOR UPDATE TO authenticated USING (public.get_current_user_role() IN ('admin', 'asset_manager')) WITH CHECK (public.get_current_user_role() IN ('admin', 'asset_manager'));
CREATE POLICY "managers can delete asset allocations" ON public.asset_allocations FOR DELETE TO authenticated USING (public.get_current_user_role() IN ('admin', 'asset_manager'));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.asset_allocations TO authenticated;

-- Triggers for auto-updating updated_at timestamp
CREATE TRIGGER tr_asset_allocations_updated_at BEFORE UPDATE ON public.asset_allocations FOR EACH ROW EXECUTE FUNCTION system.update_updated_at();

-- ============================================================================
-- 2. Resource Bookings Table
-- ============================================================================
CREATE TABLE public.resource_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  booked_by UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  purpose TEXT,
  booking_status VARCHAR(20) NOT NULL CHECK (booking_status IN ('pending', 'approved', 'rejected', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance and lookup
CREATE INDEX idx_resource_bookings_asset_id ON public.resource_bookings(asset_id);
CREATE INDEX idx_resource_bookings_booked_by ON public.resource_bookings(booked_by);
CREATE INDEX idx_resource_bookings_department_id ON public.resource_bookings(department_id);
CREATE INDEX idx_resource_bookings_date ON public.resource_bookings(booking_date);
CREATE INDEX idx_resource_bookings_status ON public.resource_bookings(booking_status);

-- Enable RLS
ALTER TABLE public.resource_bookings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "anyone can select resource bookings" ON public.resource_bookings FOR SELECT TO authenticated USING (true);
CREATE POLICY "anyone can insert resource bookings" ON public.resource_bookings FOR INSERT TO authenticated WITH CHECK (booked_by = public.get_current_employee_id());
CREATE POLICY "users can update their own resource bookings" ON public.resource_bookings FOR UPDATE TO authenticated 
  USING (booked_by = public.get_current_employee_id() OR public.get_current_user_role() IN ('admin', 'asset_manager'))
  WITH CHECK (booked_by = public.get_current_employee_id() OR public.get_current_user_role() IN ('admin', 'asset_manager'));
CREATE POLICY "users can delete their own resource bookings" ON public.resource_bookings FOR DELETE TO authenticated 
  USING (booked_by = public.get_current_employee_id() OR public.get_current_user_role() IN ('admin', 'asset_manager'));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.resource_bookings TO authenticated;

-- Triggers
CREATE TRIGGER tr_resource_bookings_updated_at BEFORE UPDATE ON public.resource_bookings FOR EACH ROW EXECUTE FUNCTION system.update_updated_at();

-- ============================================================================
-- 3. Maintenance Requests Table
-- ============================================================================
CREATE TABLE public.maintenance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  reported_by UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  issue_description TEXT NOT NULL,
  scheduled_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  maintenance_status VARCHAR(20) NOT NULL CHECK (maintenance_status IN ('pending', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  maintenance_cost DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_maintenance_requests_asset_id ON public.maintenance_requests(asset_id);
CREATE INDEX idx_maintenance_requests_reported_by ON public.maintenance_requests(reported_by);
CREATE INDEX idx_maintenance_requests_assigned_to ON public.maintenance_requests(assigned_to);
CREATE INDEX idx_maintenance_requests_status ON public.maintenance_requests(maintenance_status);

-- Enable RLS
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "anyone can select maintenance requests" ON public.maintenance_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "anyone can insert maintenance requests" ON public.maintenance_requests FOR INSERT TO authenticated WITH CHECK (reported_by = public.get_current_employee_id());
CREATE POLICY "authorized staff can update maintenance requests" ON public.maintenance_requests FOR UPDATE TO authenticated 
  USING (reported_by = public.get_current_employee_id() OR assigned_to = public.get_current_employee_id() OR public.get_current_user_role() IN ('admin', 'asset_manager'))
  WITH CHECK (reported_by = public.get_current_employee_id() OR assigned_to = public.get_current_employee_id() OR public.get_current_user_role() IN ('admin', 'asset_manager'));
CREATE POLICY "managers can delete maintenance requests" ON public.maintenance_requests FOR DELETE TO authenticated USING (public.get_current_user_role() IN ('admin', 'asset_manager'));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.maintenance_requests TO authenticated;

-- Triggers
CREATE TRIGGER tr_maintenance_requests_updated_at BEFORE UPDATE ON public.maintenance_requests FOR EACH ROW EXECUTE FUNCTION system.update_updated_at();

-- ============================================================================
-- 4. Audits Table
-- ============================================================================
CREATE TABLE public.audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_name VARCHAR(255) NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  auditor UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  audit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  compliance_score DECIMAL(5, 2) CHECK (compliance_score >= 0.00 AND compliance_score <= 100.00),
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_audits_department_id ON public.audits(department_id);
CREATE INDEX idx_audits_auditor ON public.audits(auditor);
CREATE INDEX idx_audits_status ON public.audits(status);

-- Enable RLS
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "anyone can select audits" ON public.audits FOR SELECT TO authenticated USING (true);
CREATE POLICY "managers can insert audits" ON public.audits FOR INSERT TO authenticated WITH CHECK (public.get_current_user_role() IN ('admin', 'asset_manager'));
CREATE POLICY "auditors and managers can update audits" ON public.audits FOR UPDATE TO authenticated 
  USING (auditor = public.get_current_employee_id() OR public.get_current_user_role() IN ('admin', 'asset_manager'))
  WITH CHECK (auditor = public.get_current_employee_id() OR public.get_current_user_role() IN ('admin', 'asset_manager'));
CREATE POLICY "managers can delete audits" ON public.audits FOR DELETE TO authenticated USING (public.get_current_user_role() IN ('admin', 'asset_manager'));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.audits TO authenticated;

-- Triggers
CREATE TRIGGER tr_audits_updated_at BEFORE UPDATE ON public.audits FOR EACH ROW EXECUTE FUNCTION system.update_updated_at();

-- ============================================================================
-- 5. Audit Items Table
-- ============================================================================
CREATE TABLE public.audit_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  verification_status VARCHAR(20) NOT NULL CHECK (verification_status IN ('verified', 'missing', 'damaged', 'unverified')) DEFAULT 'unverified',
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_audit_items_audit_id ON public.audit_items(audit_id);
CREATE INDEX idx_audit_items_asset_id ON public.audit_items(asset_id);
CREATE INDEX idx_audit_items_status ON public.audit_items(verification_status);

-- Enable RLS
ALTER TABLE public.audit_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "anyone can select audit items" ON public.audit_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "managers can insert audit items" ON public.audit_items FOR INSERT TO authenticated WITH CHECK (public.get_current_user_role() IN ('admin', 'asset_manager'));
CREATE POLICY "auditors and managers can update audit items" ON public.audit_items FOR UPDATE TO authenticated 
  USING ((SELECT auditor FROM public.audits WHERE id = audit_id) = public.get_current_employee_id() OR public.get_current_user_role() IN ('admin', 'asset_manager'))
  WITH CHECK ((SELECT auditor FROM public.audits WHERE id = audit_id) = public.get_current_employee_id() OR public.get_current_user_role() IN ('admin', 'asset_manager'));
CREATE POLICY "managers can delete audit items" ON public.audit_items FOR DELETE TO authenticated USING (public.get_current_user_role() IN ('admin', 'asset_manager'));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.audit_items TO authenticated;

-- Triggers
CREATE TRIGGER tr_audit_items_updated_at BEFORE UPDATE ON public.audit_items FOR EACH ROW EXECUTE FUNCTION system.update_updated_at();

-- ============================================================================
-- 6. Notifications Table
-- ============================================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(50) NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "users can select their own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = public.get_current_employee_id());
CREATE POLICY "anyone can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "users can update their own notifications" ON public.notifications FOR UPDATE TO authenticated 
  USING (user_id = public.get_current_employee_id())
  WITH CHECK (user_id = public.get_current_employee_id());
CREATE POLICY "users can delete their own notifications" ON public.notifications FOR DELETE TO authenticated USING (user_id = public.get_current_employee_id());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;

-- ============================================================================
-- 7. Activity Logs Table
-- ============================================================================
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  activity_type VARCHAR(50) NOT NULL,
  entity_name VARCHAR(100) NOT NULL,
  entity_id UUID NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "managers can select all activity logs" ON public.activity_logs FOR SELECT TO authenticated 
  USING (public.get_current_user_role() IN ('admin', 'asset_manager'));
CREATE POLICY "users can select their own activity logs" ON public.activity_logs FOR SELECT TO authenticated 
  USING (user_id = public.get_current_employee_id());
CREATE POLICY "anyone can insert activity logs" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.activity_logs TO authenticated;
