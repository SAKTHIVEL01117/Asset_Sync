"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { insforge } from "../../lib/insforge/client";
import SidebarLayout from "../../components/SidebarLayout";

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AssetFile {
  name: string;
  url: string;
  key: string;
}

interface Asset {
  id: string;
  asset_tag: string;
  name: string;
  category_id: string;
  serial_number: string;
  acquisition_date: string;
  acquisition_cost: number;
  condition: "new" | "good" | "fair" | "poor";
  location: string;
  current_holder_id: string | null;
  status: "available" | "allocated" | "reserved" | "under_maintenance" | "lost" | "retired" | "disposed";
  is_shared: boolean;
  documents: AssetFile[];
  photos: AssetFile[];
  created_at: string;
}

// Temporary history structures to support empty/try-catch logic
interface AllocationHistory {
  id: string;
  employee_name: string;
  allocated_date: string;
  returned_date: string | null;
  status: string;
}

interface MaintenanceHistory {
  id: string;
  reported_by_name: string;
  description: string;
  priority: string;
  status: string;
  date: string;
}

interface AuditHistory {
  id: string;
  audit_name: string;
  auditor_name: string;
  result: string;
  date: string;
}

export default function AssetDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  // Auth/Role State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [isManager, setIsManager] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Data State
  const [asset, setAsset] = useState<Asset | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // History states (safe mock defaults if table doesn't exist)
  const [allocations, setAllocations] = useState<AllocationHistory[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceHistory[]>([]);
  const [audits, setAudits] = useState<AuditHistory[]>([]);

  // Alert State
  const [error, setError] = useState<string | null>(null);

  // Fetch current user and verify auth
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data, error } = await insforge.auth.getCurrentUser();
        if (error || !data?.user) {
          router.push("/login");
          return;
        }
        setCurrentUser(data.user);

        // Fetch current employee role
        const { data: empData, error: empError } = await insforge.database
          .from("employees")
          .select("*")
          .eq("user_id", data.user.id);

        if (!empError && empData && empData.length > 0) {
          const currentEmp = empData[0] as Employee;
          setCurrentEmployee(currentEmp);
          setIsManager(currentEmp.role === "admin" || currentEmp.role === "asset_manager");
        }
        setLoadingAuth(false);
      } catch (err) {
        console.error("Auth verification failed", err);
        router.push("/login");
      }
    }
    void checkAuth();
  }, [router]);

  // Fetch asset details and logs
  const fetchAssetDetails = async () => {
    setLoadingData(true);
    try {
      // 1. Fetch Categories
      const { data: catData } = await insforge.database
        .from("categories")
        .select("*");
      setCategories(catData || []);

      // 2. Fetch Employees
      const { data: empData } = await insforge.database
        .from("employees")
        .select("*");
      setEmployees(empData || []);

      // 3. Fetch Asset by ID
      const { data: assetData, error: assetError } = await insforge.database
        .from("assets")
        .select("*")
        .eq("id", id)
        .single();

      if (assetError) throw assetError;
      setAsset(assetData as Asset);

      // 4. Safely query Allocation History (try-catch in case table not yet created)
      try {
        const { data: allocData } = await insforge.database
          .from("allocations")
          .select("id, employees(name), allocation_date, return_date, status")
          .eq("asset_id", id)
          .order("allocation_date", { ascending: false });
        
        if (allocData) {
          setAllocations(allocData.map((a: any) => ({
            id: a.id,
            employee_name: a.employees?.name || "Unknown",
            allocated_date: a.allocation_date,
            returned_date: a.return_date,
            status: a.status
          })));
        }
      } catch (e) {
        console.log("Allocations table not yet available, displaying empty list");
      }

      // 5. Safely query Maintenance History
      try {
        const { data: maintData } = await insforge.database
          .from("maintenance_requests")
          .select("id, employees(name), description, priority, status, created_at")
          .eq("asset_id", id)
          .order("created_at", { ascending: false });

        if (maintData) {
          setMaintenance(maintData.map((m: any) => ({
            id: m.id,
            reported_by_name: m.employees?.name || "Unknown",
            description: m.description,
            priority: m.priority,
            status: m.status,
            date: m.created_at
          })));
        }
      } catch (e) {
        console.log("Maintenance table not yet available, displaying empty list");
      }

      // 6. Safely query Audit History
      try {
        const { data: auditData } = await insforge.database
          .from("audit_verifications")
          .select("id, audits(name), employees(name), result, created_at")
          .eq("asset_id", id)
          .order("created_at", { ascending: false });

        if (auditData) {
          setAudits(auditData.map((au: any) => ({
            id: au.id,
            audit_name: au.audits?.name || "Verification",
            auditor_name: au.employees?.name || "Auditor",
            result: au.result,
            date: au.created_at
          })));
        }
      } catch (e) {
        console.log("Audits table not yet available, displaying empty list");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load asset details.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!loadingAuth) {
      void fetchAssetDetails();
    }
  }, [loadingAuth]);

  if (loadingAuth || loadingData) {
    return (
      <div className="min-h-screen bg-page-background flex flex-col items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <SidebarLayout activePage="Assets" searchPlaceholder="Search asset details...">
        <div className="max-w-[1440px] mx-auto text-left flex flex-col items-center justify-center py-12">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 max-w-md text-center shadow-sm">
            <h2 className="text-xl font-bold text-[#EF4444]">Error Loading Asset</h2>
            <p className="text-[#475569] text-sm pt-2">{error || "Asset not found."}</p>
            <Link href="/assets" className="mt-5 inline-block px-4 py-2 bg-[#3661ED] text-white text-sm font-semibold rounded-lg shadow-sm">
              Back to Directory
            </Link>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  const category = categories.find((c) => c.id === asset.category_id);
  const currentHolder = employees.find((e) => e.id === asset.current_holder_id);

  return (
    <SidebarLayout activePage="Assets" searchPlaceholder="Search asset details...">
      <div className="max-w-[1440px] mx-auto text-left">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-text-secondary mb-6">
          <Link href="/assets" className="hover:text-primary transition-colors">Assets</Link>
          <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-text-muted font-mono">{asset.asset_tag}</span>
        </nav>

        {/* Asset Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono font-bold px-2 py-0.5 bg-secondary-surface text-text-secondary rounded border border-border-default">
                {asset.asset_tag}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                  asset.status === "available" ? "bg-success-light text-success" :
                  asset.status === "allocated" ? "bg-primary-light text-primary" :
                  asset.status === "under_maintenance" ? "bg-warning-light text-warning" :
                  asset.status === "lost" ? "bg-danger-light text-danger" :
                  "bg-secondary-surface text-text-secondary"
                }`}
              >
                {asset.status.replace("_", " ")}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight pt-2">{asset.name}</h1>
            <p className="text-text-secondary text-sm pt-0.5">
              Category: <span className="font-semibold text-text-primary">{category?.name || "Uncategorized"}</span>
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* General Info Card */}
            <div className="bg-white border border-border-default rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-text-primary border-b border-border-light pb-3 mb-4">General Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <span className="text-text-muted block text-xs font-semibold uppercase tracking-wider">Serial Number</span>
                  <span className="font-medium text-text-primary mt-1 block">{asset.serial_number || "—"}</span>
                </div>
                <div>
                  <span className="text-text-muted block text-xs font-semibold uppercase tracking-wider">Location / Storage</span>
                  <span className="font-medium text-text-primary mt-1 block">{asset.location || "—"}</span>
                </div>
                <div>
                  <span className="text-text-muted block text-xs font-semibold uppercase tracking-wider">Condition</span>
                  <span className="capitalize font-medium text-text-primary mt-1 block">{asset.condition}</span>
                </div>
                <div>
                  <span className="text-text-muted block text-xs font-semibold uppercase tracking-wider">Current Holder</span>
                  <span className="font-semibold text-text-primary mt-1 block">
                    {currentHolder ? (
                      <span className="text-primary hover:underline">{currentHolder.name}</span>
                    ) : (
                      "Available (Unassigned)"
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted block text-xs font-semibold uppercase tracking-wider">Acquisition Date</span>
                  <span className="font-medium text-text-primary mt-1 block">
                    {asset.acquisition_date ? new Date(asset.acquisition_date).toLocaleDateString() : "—"}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted block text-xs font-semibold uppercase tracking-wider">Acquisition Cost</span>
                  <span className="font-semibold text-text-primary mt-1 block">
                    {asset.acquisition_cost ? `$${asset.acquisition_cost.toFixed(2)}` : "$0.00"}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted block text-xs font-semibold uppercase tracking-wider">Booking Availability</span>
                  <span className="font-medium text-text-primary mt-1 block">
                    {asset.is_shared ? "Shared Resource (Bookable)" : "Direct Assignment Only"}
                  </span>
                </div>
              </div>
            </div>

            {/* Logs & History Tabs/Tables */}
            <div className="bg-white border border-border-default rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-text-primary border-b border-border-light pb-3 mb-4">Historical Activity logs</h2>
              
              {/* Allocations History */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Allocation History</h3>
                {allocations.length === 0 ? (
                  <div className="text-sm text-text-muted py-3 bg-secondary-surface/30 px-4 rounded-lg">
                    No assignment records found for this asset.
                  </div>
                ) : (
                  <div className="border border-border-default rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-secondary-surface/40 border-b border-border-default font-semibold text-text-secondary uppercase">
                          <th className="px-4 py-2">Holder</th>
                          <th className="px-4 py-2">Assigned Date</th>
                          <th className="px-4 py-2">Returned Date</th>
                          <th className="px-4 py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allocations.map((h) => (
                          <tr key={h.id} className="border-b border-border-light/60">
                            <td className="px-4 py-2.5 font-medium">{h.employee_name}</td>
                            <td className="px-4 py-2.5 text-text-secondary">{new Date(h.allocated_date).toLocaleDateString()}</td>
                            <td className="px-4 py-2.5 text-text-secondary">
                              {h.returned_date ? new Date(h.returned_date).toLocaleDateString() : "Active"}
                            </td>
                            <td className="px-4 py-2.5">
                              <span className={`px-2 py-0.5 rounded-full capitalize font-semibold ${h.status === "returned" ? "bg-success-light text-success" : "bg-primary-light text-primary"}`}>
                                {h.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Maintenance History */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Maintenance Log</h3>
                {maintenance.length === 0 ? (
                  <div className="text-sm text-text-muted py-3 bg-secondary-surface/30 px-4 rounded-lg">
                    No maintenance records found.
                  </div>
                ) : (
                  <div className="border border-border-default rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-secondary-surface/40 border-b border-border-default font-semibold text-text-secondary uppercase">
                          <th className="px-4 py-2">Issue / Description</th>
                          <th className="px-4 py-2">Priority</th>
                          <th className="px-4 py-2">Status</th>
                          <th className="px-4 py-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {maintenance.map((m) => (
                          <tr key={m.id} className="border-b border-border-light/60">
                            <td className="px-4 py-2.5 font-medium max-w-[200px] truncate" title={m.description}>{m.description}</td>
                            <td className="px-4 py-2.5 capitalize">{m.priority}</td>
                            <td className="px-4 py-2.5">
                              <span className={`px-2 py-0.5 rounded-full capitalize font-semibold ${m.status === "resolved" ? "bg-success-light text-success" : "bg-warning-light text-warning"}`}>
                                {m.status}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-text-secondary">{new Date(m.date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Audit History */}
              <div>
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Audit Logs</h3>
                {audits.length === 0 ? (
                  <div className="text-sm text-text-muted py-3 bg-secondary-surface/30 px-4 rounded-lg">
                    No audits performed on this asset.
                  </div>
                ) : (
                  <div className="border border-border-default rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-secondary-surface/40 border-b border-border-default font-semibold text-text-secondary uppercase">
                          <th className="px-4 py-2">Audit Cycle</th>
                          <th className="px-4 py-2">Auditor</th>
                          <th className="px-4 py-2">Result</th>
                          <th className="px-4 py-2">Verified Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {audits.map((a) => (
                          <tr key={a.id} className="border-b border-border-light/60">
                            <td className="px-4 py-2.5 font-medium">{a.audit_name}</td>
                            <td className="px-4 py-2.5 text-text-secondary">{a.auditor_name}</td>
                            <td className="px-4 py-2.5 font-semibold text-text-primary capitalize">{a.result}</td>
                            <td className="px-4 py-2.5 text-text-secondary">{new Date(a.date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Photos and Documents Sidebar */}
          <div className="space-y-8">
            {/* Photos Panel */}
            <div className="bg-white border border-border-default rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-text-primary border-b border-border-light pb-3 mb-4">Photos</h2>
              {(!asset.photos || asset.photos.length === 0) ? (
                <div className="text-sm text-text-muted text-center py-6 bg-secondary-surface/30 rounded-lg">
                  No images uploaded.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {asset.photos.map((photo) => (
                    <a
                      key={photo.key}
                      href={photo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block aspect-square rounded-lg border border-border-default overflow-hidden bg-page-background hover:opacity-90 transition-opacity"
                    >
                      <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Documents Panel */}
            <div className="bg-white border border-border-default rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-text-primary border-b border-border-light pb-3 mb-4">Attachments & Manuals</h2>
              {(!asset.documents || asset.documents.length === 0) ? (
                <div className="text-sm text-text-muted text-center py-6 bg-secondary-surface/30 rounded-lg">
                  No documents attached.
                </div>
              ) : (
                <div className="space-y-2">
                  {asset.documents.map((doc) => (
                    <a
                      key={doc.key}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border border-border-default hover:bg-page-background transition-colors text-left"
                    >
                      <div className="p-2 bg-primary-light text-primary rounded-lg">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-semibold truncate text-text-primary">{doc.name}</h4>
                        <span className="text-[10px] text-text-muted">Click to view/download</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
