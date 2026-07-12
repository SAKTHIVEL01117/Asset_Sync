"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { insforge } from "../lib/insforge/client";
import SidebarLayout from "../components/SidebarLayout";

interface Department {
  id: string;
  name: string;
  parent_id: string | null;
  status: "active" | "inactive";
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface Employee {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  department_id: string | null;
  role: "admin" | "asset_manager" | "dept_head" | "employee";
  status: "active" | "inactive";
}

export default function OrganizationPage() {
  const router = useRouter();
  
  // Navigation Tabs: "departments" | "categories" | "employees"
  const [activeTab, setActiveTab] = useState<"departments" | "categories" | "employees">("departments");

  // Auth/Role State
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Data State
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Error/Success alerts
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Forms Modal State
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showEmpModal, setShowEmpModal] = useState(false);

  // Edit / Form Values
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Department Form
  const [deptName, setDeptName] = useState("");
  const [deptParentId, setDeptParentId] = useState<string>("");
  const [deptStatus, setDeptStatus] = useState<"active" | "inactive">("active");

  // Category Form
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");

  // Employee Form
  const [empRole, setEmpRole] = useState<Employee["role"]>("employee");
  const [empStatus, setEmpStatus] = useState<Employee["status"]>("active");
  const [empDeptId, setEmpDeptId] = useState<string>("");

  // Fetch current user and check admin status
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data, error } = await insforge.auth.getCurrentUser();
        if (error || !data?.user) {
          router.push("/login");
          return;
        }

        // Fetch current employee role
        const { data: empData, error: empError } = await insforge.database
          .from("employees")
          .select("*")
          .eq("user_id", data.user.id);

        if (empError || !empData || empData.length === 0) {
          setError("No employee record found for this user.");
          setLoadingAuth(false);
          return;
        }

        const currentEmp = empData[0] as Employee;
        setCurrentEmployee(currentEmp);
        setIsAdmin(currentEmp.role === "admin");
        setLoadingAuth(false);
      } catch (err) {
        console.error("Auth verification failed", err);
        router.push("/login");
      }
    }
    void checkAuth();
  }, [router]);

  // Fetch all data
  const fetchData = async () => {
    setLoadingData(true);
    try {
      // Fetch departments
      const { data: deptData, error: deptError } = await insforge.database
        .from("departments")
        .select("*")
        .order("name", { ascending: true });
      if (deptError) throw deptError;
      setDepartments(deptData || []);

      // Fetch categories
      const { data: catData, error: catError } = await insforge.database
        .from("categories")
        .select("*")
        .order("name", { ascending: true });
      if (catError) throw catError;
      setCategories(catData || []);

      // Fetch employees
      const { data: empData, error: empError } = await insforge.database
        .from("employees")
        .select("*")
        .order("name", { ascending: true });
      if (empError) throw empError;
      setEmployees(empData || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load organization data.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!loadingAuth) {
      void fetchData();
    }
  }, [loadingAuth]);

  // Reset states
  const clearFormAlerts = () => {
    setError(null);
    setSuccess(null);
  };

  // ------------------ CRUD ACTIONS ------------------

  // Departments
  const handleSaveDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFormAlerts();
    if (!isAdmin) return;

    try {
      const payload = {
        name: deptName.trim(),
        parent_id: deptParentId ? deptParentId : null,
        status: deptStatus,
      };

      if (editingId) {
        // Update
        const { error } = await insforge.database
          .from("departments")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        setSuccess("Department updated successfully!");
      } else {
        // Insert (InsForge insert requires array format)
        const { error } = await insforge.database
          .from("departments")
          .insert([payload]);
        if (error) throw error;
        setSuccess("Department created successfully!");
      }

      setShowDeptModal(false);
      void fetchData();
    } catch (err: any) {
      setError(err?.message || "Operation failed.");
    }
  };

  // Categories
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFormAlerts();
    if (!isAdmin) return;

    try {
      const payload = {
        name: catName.trim(),
        description: catDesc.trim(),
      };

      if (editingId) {
        const { error } = await insforge.database
          .from("categories")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        setSuccess("Category updated successfully!");
      } else {
        const { error } = await insforge.database
          .from("categories")
          .insert([payload]);
        if (error) throw error;
        setSuccess("Category created successfully!");
      }

      setShowCatModal(false);
      void fetchData();
    } catch (err: any) {
      setError(err?.message || "Operation failed.");
    }
  };

  // Employees
  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFormAlerts();
    if (!isAdmin) return;

    try {
      const payload = {
        role: empRole,
        status: empStatus,
        department_id: empDeptId ? empDeptId : null,
      };

      if (editingId) {
        const { error } = await insforge.database
          .from("employees")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        setSuccess("Employee record updated successfully!");
      }

      setShowEmpModal(false);
      void fetchData();
    } catch (err: any) {
      setError(err?.message || "Operation failed.");
    }
  };

  // Deletions (only for Categories and Departments if needed)
  const handleDeleteItem = async (table: string, id: string) => {
    if (!confirm(`Are you sure you want to delete this ${table.slice(0, -1)}?`)) return;
    clearFormAlerts();
    if (!isAdmin) return;

    try {
      const { error } = await insforge.database
        .from(table)
        .delete()
        .eq("id", id);
      if (error) throw error;
      setSuccess(`${table.charAt(0).toUpperCase() + table.slice(1, -1)} deleted successfully!`);
      void fetchData();
    } catch (err: any) {
      setError(err?.message || "Failed to delete item.");
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-page-background flex flex-col items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <SidebarLayout activePage="Organization" searchPlaceholder="Search departments, employees, or categories...">
      <div className="max-w-[1440px] mx-auto w-full flex-1 flex flex-col">
        {/* Page Title & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Organization Setup</h1>
            <p className="text-text-secondary text-sm pt-1">Configure departments, asset categories, and promote employee roles.</p>
          </div>

          {/* Quick Action Button */}
          {isAdmin && (
            <div>
              {activeTab === "departments" && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    setDeptName("");
                    setDeptParentId("");
                    setDeptStatus("active");
                    setShowDeptModal(true);
                  }}
                  className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm hover:shadow flex items-center gap-2 cursor-pointer transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Department
                </button>
              )}
              {activeTab === "categories" && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    setCatName("");
                    setCatDesc("");
                    setShowCatModal(true);
                  }}
                  className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm hover:shadow flex items-center gap-2 cursor-pointer transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Category
                </button>
              )}
            </div>
          )}
        </div>

        {/* Global Notifications */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-danger-light border border-danger/20 text-danger-foreground text-sm flex gap-2.5 items-start">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-lg bg-success-light border border-success/20 text-success-foreground text-sm flex gap-2.5 items-start">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-border-default mb-6 flex gap-4">
          <button
            onClick={() => setActiveTab("departments")}
            className={`py-3 text-sm font-semibold tracking-wide border-b-2 px-1 cursor-pointer transition-colors ${
              activeTab === "departments"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            Departments ({departments.length})
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`py-3 text-sm font-semibold tracking-wide border-b-2 px-1 cursor-pointer transition-colors ${
              activeTab === "categories"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            Asset Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab("employees")}
            className={`py-3 text-sm font-semibold tracking-wide border-b-2 px-1 cursor-pointer transition-colors ${
              activeTab === "employees"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            Employee Directory ({employees.length})
          </button>
        </div>

        {/* LOADING DATA SKELETON */}
        {loadingData ? (
          <div className="space-y-4 py-8">
            <div className="w-full h-12 bg-white rounded-xl border border-border-default animate-pulse" />
            <div className="w-full h-32 bg-white rounded-xl border border-border-default animate-pulse" />
            <div className="w-full h-32 bg-white rounded-xl border border-border-default animate-pulse" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* DEPARTMENTS TAB VIEW */}
            {activeTab === "departments" && (
              <div className="bg-white border border-border-default rounded-xl overflow-hidden shadow-sm flex-1">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-page-background border-b border-border-default text-text-secondary font-medium">
                      <th className="p-4">Department Name</th>
                      <th className="p-4">Parent Department</th>
                      <th className="p-4">Status</th>
                      {isAdmin && <th className="p-4 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light">
                    {departments.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-text-secondary font-medium">
                          No departments defined yet.
                        </td>
                      </tr>
                    ) : (
                      departments.map((dept) => {
                        const parent = departments.find((d) => d.id === dept.parent_id);
                        return (
                          <tr key={dept.id} className="hover:bg-page-background/30 transition-colors">
                            <td className="p-4 font-semibold text-text-primary">{dept.name}</td>
                            <td className="p-4 text-text-secondary">
                              {parent ? (
                                <span className="px-2.5 py-1 rounded bg-secondary-surface text-xs font-semibold">
                                  {parent.name}
                                </span>
                              ) : (
                                <span className="text-text-muted text-xs">— None</span>
                              )}
                            </td>
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold leading-none ${
                                  dept.status === "active"
                                    ? "bg-success-light text-success-foreground"
                                    : "bg-danger-light text-danger-foreground"
                                }`}
                              >
                                {dept.status}
                              </span>
                            </td>
                            {isAdmin && (
                              <td className="p-4 text-right flex justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingId(dept.id);
                                    setDeptName(dept.name);
                                    setDeptParentId(dept.parent_id || "");
                                    setDeptStatus(dept.status);
                                    setShowDeptModal(true);
                                  }}
                                  className="text-primary hover:text-primary-hover p-1.5 rounded hover:bg-primary-light transition-colors cursor-pointer"
                                  title="Edit"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteItem("departments", dept.id)}
                                  className="text-danger hover:text-danger-hover p-1.5 rounded hover:bg-danger-light transition-colors cursor-pointer"
                                  title="Delete"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* CATEGORIES TAB VIEW */}
            {activeTab === "categories" && (
              <div className="bg-white border border-border-default rounded-xl overflow-hidden shadow-sm flex-1">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-page-background border-b border-border-default text-text-secondary font-medium">
                      <th className="p-4">Category Name</th>
                      <th className="p-4">Description</th>
                      {isAdmin && <th className="p-4 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light">
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-text-secondary font-medium">
                          No categories defined yet.
                        </td>
                      </tr>
                    ) : (
                      categories.map((cat) => (
                        <tr key={cat.id} className="hover:bg-page-background/30 transition-colors">
                          <td className="p-4 font-semibold text-text-primary">{cat.name}</td>
                          <td className="p-4 text-text-secondary leading-relaxed max-w-md truncate">{cat.description || <span className="text-text-muted text-xs">— None</span>}</td>
                          {isAdmin && (
                            <td className="p-4 text-right flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingId(cat.id);
                                  setCatName(cat.name);
                                  setCatDesc(cat.description || "");
                                  setShowCatModal(true);
                                }}
                                className="text-primary hover:text-primary-hover p-1.5 rounded hover:bg-primary-light transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteItem("categories", cat.id)}
                                className="text-danger hover:text-danger-hover p-1.5 rounded hover:bg-danger-light transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* EMPLOYEES TAB VIEW */}
            {activeTab === "employees" && (
              <div className="bg-white border border-border-default rounded-xl overflow-hidden shadow-sm flex-1">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-page-background border-b border-border-default text-text-secondary font-medium">
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Status</th>
                      {isAdmin && <th className="p-4 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light">
                    {employees.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-text-secondary font-medium">
                          No employees registered.
                        </td>
                      </tr>
                    ) : (
                      employees.map((emp) => {
                        const dept = departments.find((d) => d.id === emp.department_id);
                        return (
                          <tr key={emp.id} className="hover:bg-page-background/30 transition-colors">
                            <td className="p-4 font-semibold text-text-primary flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-secondary-surface text-text-secondary text-xs font-bold flex items-center justify-center shadow-xs">
                                {emp.name.substring(0, 2).toUpperCase()}
                              </div>
                              <span>{emp.name}</span>
                            </td>
                            <td className="p-4 text-text-secondary font-mono text-xs">{emp.email}</td>
                            <td className="p-4 text-text-secondary">
                              {dept ? (
                                <span className="px-2.5 py-1 rounded bg-secondary-surface text-xs font-semibold">
                                  {dept.name}
                                </span>
                              ) : (
                                <span className="text-text-muted text-xs">— Unassigned</span>
                              )}
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold capitalize ${
                                emp.role === "admin" ? "bg-primary-light text-primary" :
                                emp.role === "asset_manager" ? "bg-info-light text-info-foreground" :
                                emp.role === "dept_head" ? "bg-warning-light text-warning-foreground" :
                                "bg-secondary-surface text-text-secondary"
                              }`}>
                                {emp.role.replace("_", " ")}
                              </span>
                            </td>
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold leading-none ${
                                  emp.status === "active"
                                    ? "bg-success-light text-success-foreground"
                                    : "bg-danger-light text-danger-foreground"
                                }`}
                              >
                                {emp.status}
                              </span>
                            </td>
                            {isAdmin && (
                              <td className="p-4 text-right flex justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingId(emp.id);
                                    setEmpRole(emp.role);
                                    setEmpStatus(emp.status);
                                    setEmpDeptId(emp.department_id || "");
                                    setShowEmpModal(true);
                                  }}
                                  className="text-primary hover:text-primary-hover p-1.5 rounded hover:bg-primary-light transition-colors cursor-pointer"
                                  title="Edit role/department"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* DEPARTMENT MODAL */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[400px] border border-border-default overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-border-default flex justify-between items-center bg-page-background">
              <h3 className="font-bold text-lg">{editingId ? "Edit Department" : "Add Department"}</h3>
              <button onClick={() => setShowDeptModal(false)} className="text-text-muted hover:text-text-primary cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSaveDepartment} className="p-5 space-y-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engineering"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="w-full px-4 py-2 border border-border-default rounded-lg focus:outline-none focus:border-primary text-sm"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Parent Department</label>
                <select
                  value={deptParentId}
                  onChange={(e) => setDeptParentId(e.target.value)}
                  className="w-full px-4 py-2 border border-border-default rounded-lg focus:outline-none focus:border-primary text-sm"
                >
                  <option value="">— None (Top Level) —</option>
                  {departments
                    .filter((d) => d.id !== editingId)
                    .map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Status</label>
                <select
                  value={deptStatus}
                  onChange={(e) => setDeptStatus(e.target.value as any)}
                  className="w-full px-4 py-2 border border-border-default rounded-lg focus:outline-none focus:border-primary text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeptModal(false)}
                  className="px-4 py-2 border border-border-default rounded-lg text-text-secondary text-sm font-semibold hover:bg-page-background cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[400px] border border-border-default overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-border-default flex justify-between items-center bg-page-background">
              <h3 className="font-bold text-lg">{editingId ? "Edit Category" : "Add Category"}</h3>
              <button onClick={() => setShowCatModal(false)} className="text-text-muted hover:text-text-primary cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSaveCategory} className="p-5 space-y-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IT Equipment"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-4 py-2 border border-border-default rounded-lg focus:outline-none focus:border-primary text-sm"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Description</label>
                <textarea
                  placeholder="Optional details..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full px-4 py-2 border border-border-default rounded-lg focus:outline-none focus:border-primary text-sm min-h-[80px]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="px-4 py-2 border border-border-default rounded-lg text-text-secondary text-sm font-semibold hover:bg-page-background cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EMPLOYEE EDIT MODAL */}
      {showEmpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[400px] border border-border-default overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-border-default flex justify-between items-center bg-page-background">
              <h3 className="font-bold text-lg">Edit Employee Record</h3>
              <button onClick={() => setShowEmpModal(false)} className="text-text-muted hover:text-text-primary cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSaveEmployee} className="p-5 space-y-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Department Assignment</label>
                <select
                  value={empDeptId}
                  onChange={(e) => setEmpDeptId(e.target.value)}
                  className="w-full px-4 py-2 border border-border-default rounded-lg focus:outline-none focus:border-primary text-sm"
                >
                  <option value="">— Unassigned —</option>
                  {departments
                    .filter((d) => d.status === "active")
                    .map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Role Assignment</label>
                <select
                  value={empRole}
                  onChange={(e) => setEmpRole(e.target.value as any)}
                  className="w-full px-4 py-2 border border-border-default rounded-lg focus:outline-none focus:border-primary text-sm"
                >
                  <option value="employee">Employee</option>
                  <option value="dept_head">Department Head</option>
                  <option value="asset_manager">Asset Manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Employment Status</label>
                <select
                  value={empStatus}
                  onChange={(e) => setEmpStatus(e.target.value as any)}
                  className="w-full px-4 py-2 border border-border-default rounded-lg focus:outline-none focus:border-primary text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEmpModal(false)}
                  className="px-4 py-2 border border-border-default rounded-lg text-text-secondary text-sm font-semibold hover:bg-page-background cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
