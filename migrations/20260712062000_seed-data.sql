-- ============================================================================
-- Seed Departments
-- ============================================================================
INSERT INTO public.departments (id, name, status) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'IT Department', 'active'),
  ('d0000000-0000-0000-0000-000000000002', 'HR Department', 'active'),
  ('d0000000-0000-0000-0000-000000000003', 'Finance Department', 'active')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- Seed Categories
-- ============================================================================
INSERT INTO public.categories (id, name, description) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Laptop', 'Portable personal computers'),
  ('c0000000-0000-0000-0000-000000000002', 'Vehicle', 'Company transit cars and utility vehicles'),
  ('c0000000-0000-0000-0000-000000000003', 'Projector', 'Conference room display and projection equipment'),
  ('c0000000-0000-0000-0000-000000000004', 'Furniture', 'Ergonomic chairs, desks, and workstations')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- Seed Employees (excluding user_id initially for test robustness)
-- ============================================================================
INSERT INTO public.employees (id, name, email, department_id, role, status) VALUES
  ('e0000000-0000-0000-0000-000000000002', 'John Doe', 'john.doe@example.com', 'd0000000-0000-0000-0000-000000000001', 'asset_manager', 'active'),
  ('e0000000-0000-0000-0000-000000000003', 'Jane Smith', 'jane.smith@example.com', 'd0000000-0000-0000-0000-000000000002', 'employee', 'active')
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- Seed Assets
-- ============================================================================
INSERT INTO public.assets (id, name, category_id, serial_number, acquisition_date, acquisition_cost, condition, location, current_holder_id, status, is_shared) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'MacBook Pro 16" M3', 'c0000000-0000-0000-0000-000000000001', 'SN-MBP-12345', '2026-01-10', 2499.00, 'new', 'HQ Floor 3', 'e0000000-0000-0000-0000-000000000003', 'allocated', FALSE),
  ('a0000000-0000-0000-0000-000000000002', 'Tesla Model 3', 'c0000000-0000-0000-0000-000000000002', 'SN-TSLA-98765', '2025-06-15', 39990.00, 'good', 'HQ Garage A', NULL, 'available', TRUE),
  ('a0000000-0000-0000-0000-000000000003', 'Epson 4K Projector', 'c0000000-0000-0000-0000-000000000003', 'SN-EPSON-5555', '2026-03-01', 1299.00, 'good', 'Conf Room 4B', NULL, 'available', TRUE),
  ('a0000000-0000-0000-0000-000000000004', 'Ergonomic Desk Chair', 'c0000000-0000-0000-0000-000000000004', 'SN-CHAIR-8888', '2025-09-01', 450.00, 'fair', 'IT Office Cubicle 12', NULL, 'under_maintenance', FALSE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Seed Asset Allocations
-- ============================================================================
INSERT INTO public.asset_allocations (id, asset_id, user_id, allocated_by, allocated_date, expected_return, allocation_status, remarks) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000002', '2026-01-10', '2027-01-10', 'active', 'Assigned for standard work usage')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Seed Resource Bookings
-- ============================================================================
INSERT INTO public.resource_bookings (id, asset_id, booked_by, department_id, booking_date, start_time, end_time, purpose, booking_status) VALUES
  ('50000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000002', CURRENT_DATE, NOW() + INTERVAL '1 hour', NOW() + INTERVAL '3 hours', 'Off-site HR recruitment drive', 'approved'),
  ('50000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000002', CURRENT_DATE + 1, NOW() + INTERVAL '26 hours', NOW() + INTERVAL '28 hours', 'Team Presentation', 'pending')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Seed Maintenance Requests
-- ============================================================================
INSERT INTO public.maintenance_requests (id, asset_id, reported_by, assigned_to, priority, issue_description, scheduled_date, maintenance_status, maintenance_cost, remarks) VALUES
  ('60000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000002', 'medium', 'Loose armrest support and squeaking piston mechanism', NOW() + INTERVAL '2 hours', 'in_progress', 80.00, 'Assigned to local technician')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Seed Audits
-- ============================================================================
INSERT INTO public.audits (id, audit_name, department_id, auditor, audit_date, status, compliance_score, remarks) VALUES
  ('70000000-0000-0000-0000-000000000001', 'Q3 Asset Compliance Review', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', '2026-07-12', 'in_progress', NULL, 'Routine audit of hardware infrastructure')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Seed Audit Items
-- ============================================================================
INSERT INTO public.audit_items (id, audit_id, asset_id, verification_status, comments) VALUES
  ('80000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'verified', 'Asset verified physically in working condition'),
  ('80000000-0000-0000-0000-000000000002', '70000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004', 'unverified', 'Pending inspection due to maintenance status')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Seed Notifications
-- ============================================================================
INSERT INTO public.notifications (id, user_id, title, message, notification_type, is_read) VALUES
  ('90000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'Asset Assigned', 'A new MacBook Pro 16" has been allocated to you.', 'info', FALSE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Seed Activity Logs
-- ============================================================================
INSERT INTO public.activity_logs (id, user_id, activity_type, entity_name, entity_id, description) VALUES
  ('a0000000-0000-0000-0000-000000000999', 'e0000000-0000-0000-0000-000000000002', 'allocation_create', 'asset_allocations', 'b0000000-0000-0000-0000-000000000001', 'Allocated MacBook Pro to Jane Smith')
ON CONFLICT (id) DO NOTHING;
