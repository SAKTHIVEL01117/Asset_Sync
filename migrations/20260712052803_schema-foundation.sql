-- Create departments table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  parent_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index referencing columns
CREATE INDEX idx_departments_parent_id ON public.departments(parent_id);

-- Create employees table
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'asset_manager', 'dept_head', 'employee')) DEFAULT 'employee',
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lookup and performance
CREATE INDEX idx_employees_user_id ON public.employees(user_id);
CREATE INDEX idx_employees_department_id ON public.employees(department_id);
CREATE INDEX idx_employees_role ON public.employees(role);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create role helper function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS VARCHAR
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  user_role VARCHAR;
BEGIN
  SELECT role INTO user_role FROM public.employees WHERE user_id = auth.uid();
  RETURN COALESCE(user_role, 'employee');
END;
$$;

-- Enable Row Level Security (RLS)
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Select policies (accessible to all authenticated users)
CREATE POLICY "anyone can select departments" ON public.departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "anyone can select categories" ON public.categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "anyone can select employees" ON public.employees FOR SELECT TO authenticated USING (true);

-- Admin DML policies on Departments
CREATE POLICY "admins can insert departments" ON public.departments FOR INSERT TO authenticated WITH CHECK (public.get_current_user_role() = 'admin');
CREATE POLICY "admins can update departments" ON public.departments FOR UPDATE TO authenticated USING (public.get_current_user_role() = 'admin') WITH CHECK (public.get_current_user_role() = 'admin');
CREATE POLICY "admins can delete departments" ON public.departments FOR DELETE TO authenticated USING (public.get_current_user_role() = 'admin');

-- Admin DML policies on Categories
CREATE POLICY "admins can insert categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (public.get_current_user_role() = 'admin');
CREATE POLICY "admins can update categories" ON public.categories FOR UPDATE TO authenticated USING (public.get_current_user_role() = 'admin') WITH CHECK (public.get_current_user_role() = 'admin');
CREATE POLICY "admins can delete categories" ON public.categories FOR DELETE TO authenticated USING (public.get_current_user_role() = 'admin');

-- Admin DML policies on Employees
CREATE POLICY "admins can insert employees" ON public.employees FOR INSERT TO authenticated WITH CHECK (public.get_current_user_role() = 'admin');
CREATE POLICY "admins can update any employee" ON public.employees FOR UPDATE TO authenticated USING (public.get_current_user_role() = 'admin') WITH CHECK (public.get_current_user_role() = 'admin');
CREATE POLICY "admins can delete employees" ON public.employees FOR DELETE TO authenticated USING (public.get_current_user_role() = 'admin');

-- Self update policy for Employees (users can update their own profile fields like name)
CREATE POLICY "users can update their own profile" ON public.employees FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

-- Grant DML privileges on public tables to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.departments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;

-- BEFORE UPDATE Trigger Guard to prevent non-admins from altering role/status on employees
CREATE OR REPLACE FUNCTION public.check_employee_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF (NEW.role IS DISTINCT FROM OLD.role OR NEW.status IS DISTINCT FROM OLD.status) THEN
    IF (public.get_current_user_role() != 'admin') THEN
      RAISE EXCEPTION 'Only administrators can update employee role or status.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER tr_check_employee_role_change
  BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.check_employee_role_change();

-- AFTER INSERT Trigger to sync auth.users with public.employees on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  is_first_user BOOLEAN;
BEGIN
  SELECT NOT EXISTS (SELECT 1 FROM public.employees) INTO is_first_user;
  
  INSERT INTO public.employees (user_id, name, email, role, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.profile->>'name', NEW.email),
    NEW.email,
    CASE WHEN is_first_user THEN 'admin'::varchar ELSE 'employee'::varchar END,
    'active'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for auto-updating updated_at timestamp
CREATE TRIGGER tr_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION system.update_updated_at();
CREATE TRIGGER tr_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION system.update_updated_at();
CREATE TRIGGER tr_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION system.update_updated_at();
