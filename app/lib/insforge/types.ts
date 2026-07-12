// ============================================================================
// TypeScript Types & Interfaces for AssetSync Database Schema
// ============================================================================

export interface Department {
  id: string; // UUID
  name: string;
  parent_id?: string | null; // UUID
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string; // UUID
  user_id?: string | null; // UUID referencing auth.users
  name: string;
  email: string;
  department_id?: string | null; // UUID
  role: 'admin' | 'asset_manager' | 'dept_head' | 'employee';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface AssetCategory {
  id: string; // UUID
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string; // UUID
  asset_tag: string; // Unique generated string, e.g. AST-1001
  name: string;
  category_id: string; // UUID
  serial_number?: string | null;
  acquisition_date: string;
  acquisition_cost: number;
  condition: 'new' | 'good' | 'fair' | 'poor';
  location?: string | null;
  current_holder_id?: string | null; // UUID referencing employees
  status: 'available' | 'allocated' | 'reserved' | 'under_maintenance' | 'lost' | 'retired' | 'disposed';
  is_shared: boolean;
  documents?: any; // JSONB Array
  photos?: any; // JSONB Array
  created_at: string;
  updated_at: string;
}

export interface AssetAllocation {
  id: string; // UUID
  asset_id: string; // UUID
  user_id: string; // UUID (employee receiving the asset)
  allocated_by?: string | null; // UUID (employee allocating the asset)
  allocated_date: string;
  expected_return?: string | null;
  returned_date?: string | null;
  allocation_status: 'active' | 'returned' | 'overdue';
  remarks?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResourceBooking {
  id: string; // UUID
  asset_id: string; // UUID
  booked_by: string; // UUID referencing employees
  department_id: string; // UUID
  booking_date: string;
  start_time: string;
  end_time: string;
  purpose?: string | null;
  booking_status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface MaintenanceRequest {
  id: string; // UUID
  asset_id: string; // UUID
  reported_by: string; // UUID referencing employees
  assigned_to?: string | null; // UUID referencing employees
  priority: 'low' | 'medium' | 'high' | 'critical';
  issue_description: string;
  scheduled_date?: string | null;
  completed_date?: string | null;
  maintenance_status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  maintenance_cost: number;
  remarks?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Audit {
  id: string; // UUID
  audit_name: string;
  department_id?: string | null; // UUID
  auditor?: string | null; // UUID referencing employees
  audit_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  compliance_score?: number | null; // Decimal
  remarks?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditItem {
  id: string; // UUID
  audit_id: string; // UUID
  asset_id: string; // UUID
  verification_status: 'verified' | 'missing' | 'damaged' | 'unverified';
  comments?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string; // UUID
  user_id: string; // UUID referencing employees
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string; // UUID
  user_id?: string | null; // UUID referencing employees
  activity_type: string;
  entity_name: string;
  entity_id: string; // UUID
  description: string;
  created_at: string;
}
