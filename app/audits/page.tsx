"use client";

import React, { useState, useEffect } from "react";
import SidebarLayout from "../components/SidebarLayout";
import { insforge } from "../lib/insforge/client";

interface ActiveAudit {
  id: string;
  department: string;
  auditor: string;
  checked: string;
  progressPercent: number;
  status: string;
  progressColor: string;
  badgeStyle: string;
}

export default function AuditsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "schedule">("overview");
  
  const [auditName, setAuditName] = useState("");
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [selectedAuditorId, setSelectedAuditorId] = useState("");
  const [remarks, setRemarks] = useState("");
  
  const [dbAudits, setDbAudits] = useState<ActiveAudit[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [employee, setEmployee] = useState<any>(null);

  const [drawerMode, setDrawerMode] = useState<"create" | "view">("create");
  const [activeAudit, setActiveAudit] = useState<any>(null);
  const [activeAuditItems, setActiveAuditItems] = useState<any[]>([]);
  const [allAssets, setAllAssets] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  
  const [kpis, setKpis] = useState({
    complianceScore: "94.2%",
    completed: 0,
    pending: 0,
    missing: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Open audit drawer if ?start=true query param is present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("start") === "true") {
        setDrawerOpen(true);
      }
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch current employee
      const { data: userData } = await insforge.auth.getCurrentUser();
      if (userData?.user) {
        const { data: empData } = await insforge.database
          .from("employees")
          .select("*")
          .eq("user_id", userData.user.id);
        if (empData && empData.length > 0) {
          setEmployee(empData[0]);
        }
      }

      // 2. Fetch departments
      const { data: deptData } = await insforge.database.from("departments").select("*").order("name", { ascending: true });
      if (deptData) {
        setDepartments(deptData);
        if (deptData.length > 0) {
          setSelectedDeptId(deptData[0].id);
        }
      }

      // 3. Fetch employees
      const { data: empData } = await insforge.database.from("employees").select("*").order("name", { ascending: true });
      if (empData) {
        setEmployees(empData);
        const auditors = empData.filter(e => e.role === "admin" || e.role === "asset_manager");
        if (auditors.length > 0) {
          setSelectedAuditorId(auditors[0].id);
        }
      }

      // 4. Fetch audits
      const { data: audits } = await insforge.database.from("audits").select("*").order("audit_date", { ascending: false });
      
      // 5. Fetch audit items
      const { data: auditItems } = await insforge.database.from("audit_items").select("*");

      // 6. Fetch assets
      const { data: assetsData } = await insforge.database.from("assets").select("id, name, asset_tag");
      if (assetsData) {
        setAllAssets(assetsData);
      }

      if (audits && deptData && empData && auditItems) {
        const completedAudits = audits.filter(a => a.status === "completed" && a.compliance_score !== null);
        const avgScore = completedAudits.length > 0
          ? (completedAudits.reduce((acc, curr) => acc + parseFloat(curr.compliance_score), 0) / completedAudits.length).toFixed(1)
          : "100";

        const pendingCount = audits.filter(a => a.status === "pending" || a.status === "in_progress").length;
        const completedCount = audits.filter(a => a.status === "completed").length;
        const missingCount = auditItems.filter(item => item.verification_status === "missing").length;

        setKpis({
          complianceScore: `${avgScore}%`,
          completed: completedCount,
          pending: pendingCount,
          missing: missingCount
        });

        const mapped = audits.map((a: any) => {
          const dept = deptData.find(d => d.id === a.department_id);
          const auditor = empData.find(e => e.id === a.auditor);
          const items = auditItems.filter(item => item.audit_id === a.id);
          const checked = items.filter(item => item.verification_status !== "unverified").length;
          
          let progressPercent = 0;
          if (items.length > 0) {
            progressPercent = (checked / items.length) * 100;
          }

          let statusStr = "In Progress";
          if (a.status === "completed") statusStr = "Completed";
          else if (a.status === "pending") statusStr = "Active";

          let badgeStyle = "bg-[#ECFDF5] text-[#10B981]";
          if (statusStr === "Active") badgeStyle = "bg-[#EFF6FF] text-[#3B82F6]";
          else if (statusStr === "Completed") badgeStyle = "bg-[#F3F4F6] text-[#6B7280]";

          return {
            id: a.id,
            department: dept?.name || "Operations",
            auditor: auditor?.name || "Auditor",
            checked: `${checked}/${items.length}`,
            progressPercent,
            status: statusStr,
            progressColor: "bg-[#3B82F6]",
            badgeStyle
          };
        });

        setDbAudits(mapped);
      }

    } catch (err: any) {
      console.error("Audits page fetch failed", err);
      setError(err?.message || "Failed to fetch audits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditName || !selectedDeptId || !employee) {
      setError("Please fill out the audit name and department.");
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      const payload = {
        audit_name: auditName,
        department_id: selectedDeptId,
        auditor: selectedAuditorId || null,
        audit_date: new Date().toISOString().substring(0, 10),
        status: "in_progress" as const,
        remarks: remarks || "Started via system portal"
      };

      const { error: insertError } = await insforge.database.from("audits").insert([payload]);
      if (insertError) throw insertError;

      // Add activity log
      await insforge.database.from("activity_logs").insert([{
        user_id: employee.id,
        activity_type: "audit_create",
        entity_name: "audits",
        entity_id: employee.id,
        description: `Started new audit: ${auditName}`
      }]);

      setSuccess("Audit started successfully!");
      setDrawerOpen(false);
      setAuditName("");
      setRemarks("");
      void fetchData();
    } catch (err: any) {
      console.error("Failed to start audit", err);
      setError(err?.message || "Failed to start audit");
    }
  };

  const handleRowClick = async (auditId: string) => {
    setDrawerMode("view");
    setDrawerOpen(true);
    setLoadingItems(true);
    setError(null);
    setSuccess(null);
    try {
      const { data: auditData } = await insforge.database
        .from("audits")
        .select("*")
        .eq("id", auditId)
        .single();
      
      const { data: itemsData } = await insforge.database
        .from("audit_items")
        .select("*")
        .eq("audit_id", auditId);

      setActiveAudit(auditData);
      setActiveAuditItems(itemsData || []);
    } catch (err: any) {
      console.error("Failed to load audit details", err);
      setError(err?.message || "Failed to load audit items.");
    } finally {
      setLoadingItems(false);
    }
  };

  const handleVerifyItem = async (itemId: string, status: "verified" | "missing" | "damaged" | "unverified") => {
    if (!activeAudit) return;
    try {
      const { error: updateErr } = await insforge.database
        .from("audit_items")
        .update({ verification_status: status })
        .eq("id", itemId);

      if (updateErr) throw updateErr;

      // Update local state
      const updatedItems = activeAuditItems.map(item =>
        item.id === itemId ? { ...item, verification_status: status } : item
      );
      setActiveAuditItems(updatedItems);

      // Recalculate compliance score
      const totalItems = updatedItems.length;
      if (totalItems > 0) {
        const verifiedItems = updatedItems.filter(i => i.verification_status === "verified").length;
        const complianceScore = Math.round((verifiedItems / totalItems) * 100);
        
        const hasUnverified = updatedItems.some(i => i.verification_status === "unverified");
        const nextStatus = hasUnverified ? "in_progress" : "completed";

        await insforge.database
          .from("audits")
          .update({
            compliance_score: complianceScore,
            status: nextStatus
          })
          .eq("id", activeAudit.id);

        setActiveAudit((prev: any) => prev ? { ...prev, compliance_score: complianceScore, status: nextStatus } : null);
      }

      void fetchData();
    } catch (err: any) {
      console.error("Failed to update item verification status", err);
      setError(err?.message || "Failed to update item status.");
    }
  };

  const drawerContent = drawerMode === "view" ? (
    <div className="flex flex-col h-full justify-between text-left space-y-6">
      <div className="space-y-4">
        <div>
          <span className="inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#EFF6FF] text-[#3B82F6] uppercase tracking-wider mb-1">
            {activeAudit?.status}
          </span>
          <h4 className="font-bold text-[#1F2937] text-base leading-tight mt-0.5">
            {activeAudit?.audit_name || "Audit Verification"}
          </h4>
          <span className="text-[10px] text-[#6B7280] block mt-1">
            Date: {activeAudit?.audit_date ? new Date(activeAudit.audit_date).toLocaleDateString() : "—"}
          </span>
          <span className="text-[10px] text-[#6B7280] block">
            Compliance Score: <span className="font-bold text-[#3B82F6]">{activeAudit?.compliance_score !== null && activeAudit?.compliance_score !== undefined ? `${activeAudit.compliance_score}%` : "Pending"}</span>
          </span>
        </div>

        <div className="border-t border-[#E5E7EB] pt-4">
          <h5 className="text-xs font-bold text-[#1F2937] mb-3">Verification Items</h5>
          
          {loadingItems ? (
            <div className="space-y-2 py-4">
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          ) : activeAuditItems.length === 0 ? (
            <p className="text-xs text-[#6B7280]">No assets scope defined for this audit cycle.</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {activeAuditItems.map(item => {
                const asset = allAssets.find(a => a.id === item.asset_id);
                return (
                  <div key={item.id} className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-xs flex flex-col justify-between gap-2.5">
                    <div>
                      <span className="font-mono font-bold text-[#6B7280] text-[9px]">{asset?.asset_tag || "AST-0000"}</span>
                      <h6 className="font-semibold text-[#1F2937] truncate mt-0.5">{asset?.name || "Asset Item"}</h6>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      {(["verified", "missing", "damaged"] as const).map(status => {
                        const isSelected = item.verification_status === status;
                        return (
                          <button
                            key={status}
                            onClick={() => handleVerifyItem(item.id, status)}
                            className={`px-2 py-1 rounded text-[9px] font-bold capitalize cursor-pointer border ${
                              isSelected
                                ? status === "verified" ? "bg-[#10B981] text-white border-[#10B981]" :
                                  status === "missing" ? "bg-[#EF4444] text-white border-[#EF4444]" :
                                  "bg-[#F59E0B] text-white border-[#F59E0B]"
                                : "bg-white text-[#4B5563] border-[#D1D5DB] hover:bg-[#F3F4F6]"
                            }`}
                          >
                            {status}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-[#D1D5DB] pt-4 mt-6">
        <button
          onClick={() => setDrawerOpen(false)}
          className="w-full bg-[#3B82F6] hover:bg-[#1D4ED8] text-white text-xs font-bold py-2.5 rounded-lg text-center cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  ) : (
    <form onSubmit={handleAuditSubmit} className="flex flex-col h-full justify-between text-left space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-[#1F2937] block mb-1">Audit Name</label>
          <input
            type="text"
            value={auditName}
            onChange={(e) => setAuditName(e.target.value)}
            placeholder="e.g. Q4 Infrastructure Review"
            className="w-full bg-white border border-[#D1D5DB] rounded-lg py-2 px-3 text-xs text-[#1F2937] focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#1F2937] block mb-1">Department</label>
          <div className="relative">
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="w-full bg-white border border-[#D1D5DB] rounded-lg py-2 pl-3 pr-8 text-xs text-[#1F2937] focus:outline-none appearance-none"
              required
            >
              <option value="">Select department...</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-[#6B7280]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-[#1F2937] block mb-1">Lead Auditor</label>
          <div className="relative">
            <select
              value={selectedAuditorId}
              onChange={(e) => setSelectedAuditorId(e.target.value)}
              className="w-full bg-white border border-[#D1D5DB] rounded-lg py-2 pl-3 pr-8 text-xs text-[#1F2937] focus:outline-none appearance-none"
              required
            >
              <option value="">Select auditor...</option>
              {employees.filter(e => e.role === "admin" || e.role === "asset_manager").map(auditor => (
                <option key={auditor.id} value={auditor.id}>{auditor.name}</option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-[#6B7280]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-[#1F2937] block mb-1">Scope & Objectives / Remarks</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Detail the specific focus areas..."
            rows={3}
            className="w-full bg-white border border-[#D1D5DB] rounded-lg py-2 px-3 text-xs text-[#1F2937] focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#1F2937] block mb-1">Upload Documents</label>
          <div className="border-2 border-dashed border-[#D1D5DB] bg-[#F9FAFB] rounded-lg p-5 text-center flex flex-col items-center justify-center cursor-pointer">
            <svg className="w-8 h-8 text-[#A0AEC0] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="text-[10px] font-semibold text-[#6B7280]">Supported: .csv, .xlsx, .pdf</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center gap-3 border-t border-[#D1D5DB] pt-4 mt-6">
        <button
          type="button"
          onClick={() => setDrawerOpen(false)}
          className="flex-1 bg-white hover:bg-slate-50 text-[#1F2937] text-xs font-bold py-2.5 rounded-lg border border-[#D1D5DB] cursor-pointer"
        >
          Cancel
        </button>
        <button type="submit" className="flex-1 bg-[#3B82F6] hover:bg-[#1D4ED8] text-white text-xs font-bold py-2.5 rounded-lg cursor-pointer">
          Create Audit
        </button>
      </div>
    </form>
  );

  return (
    <SidebarLayout
      activePage="Audits"
      drawerOpen={drawerOpen}
      onDrawerClose={() => setDrawerOpen(false)}
      drawerContent={drawerContent}
      searchPlaceholder="Search audits, departments, or assets..."
    >
      <div className="max-w-[1440px] mx-auto text-left">
        {/* Title bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">Audit Management</h1>
            <p className="text-[#6B7280] text-sm pt-1">
              Systematic overview of organizational asset compliance and integrity.
            </p>
          </div>
          <button
            onClick={() => {
              setDrawerMode("create");
              setDrawerOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3B82F6] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap"
          >
            <span>+</span>
            <span>Start Audit</span>
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-[#FEE2E2] border border-[#DC2626]/20 text-[#DC2626] rounded-xl flex items-center justify-between">
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => setError(null)} className="font-bold text-lg">&times;</button>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-[#DCFCE7] border border-[#16A34A]/20 text-[#166534] rounded-xl flex items-center justify-between">
            <span className="text-sm font-medium">{success}</span>
            <button onClick={() => setSuccess(null)} className="font-bold text-lg">&times;</button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#D1D5DB] gap-6 mb-8 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "border-b-2 border-[#3B82F6] text-[#3B82F6]"
                : "text-[#6B7280] hover:text-[#1F2937]"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 transition-colors cursor-pointer ${
              activeTab === "history"
                ? "border-b-2 border-[#3B82F6] text-[#3B82F6]"
                : "text-[#6B7280] hover:text-[#1F2937]"
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`pb-3 transition-colors cursor-pointer ${
              activeTab === "schedule"
                ? "border-b-2 border-[#3B82F6] text-[#3B82F6]"
                : "text-[#6B7280] hover:text-[#1F2937]"
            }`}
          >
            Schedule
          </button>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Compliance Score */}
          <div className="bg-white border border-[#D1D5DB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Compliance Score</span>
                <span className="text-3xl font-bold text-[#3B82F6] block mt-1">{kpis.complianceScore}</span>
              </div>
              <span className="text-xl text-[#3B82F6]">✓</span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[10px] text-[#6B7280]">Target: 98% for Q4 2024</span>
              <span className="text-[10px] font-bold text-[#10B981]">⬆ 2.4%</span>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white border border-[#D1D5DB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Completed</span>
                <span className="text-3xl font-bold text-[#1F2937] block mt-1">{kpis.completed}</span>
              </div>
              <span className="text-xl text-[#3B82F6]">📁</span>
            </div>
            <span className="text-[10px] text-[#6B7280] mt-4 block">Last 30 days</span>
          </div>

          {/* Pending */}
          <div className="bg-white border border-[#D1D5DB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Pending</span>
                <span className="text-3xl font-bold text-[#1F2937] block mt-1">{kpis.pending}</span>
              </div>
              <span className="text-xl text-[#6B7280]">⏳</span>
            </div>
            <span className="text-[10px] text-[#6B7280] mt-4 block">Active Audits</span>
          </div>

          {/* Missing Assets */}
          <div className="bg-white border border-[#D1D5DB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Missing Assets</span>
                <span className="text-3xl font-bold text-[#EF4444] block mt-1">{kpis.missing}</span>
              </div>
              <span className="text-xl text-[#EF4444]">⚠️</span>
            </div>
            <span className="text-[10px] text-[#EF4444] font-semibold mt-4 block">Immediate action required</span>
          </div>
        </div>

        {/* Table + Side Panels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-start">
          {/* Active Registry table (Left Section, cols-8) */}
          <div className="lg:col-span-8 bg-white border border-[#D1D5DB] rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#D1D5DB] flex items-center justify-between">
              <h3 className="font-bold text-[#1F2937] text-base">Active Audit Registry</h3>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#D1D5DB] text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                  <th className="py-4 px-6">Audit ID</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Auditor</th>
                  <th className="py-4 px-6">Assets Checked</th>
                  <th className="py-4 px-6">Progress</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {dbAudits.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-[#6B7280]">No active audits registry found.</td>
                  </tr>
                ) : (
                  dbAudits.map((row, idx) => (
                    <tr key={row.id || idx} className="border-b border-[#D1D5DB] text-sm text-[#1F2937] hover:bg-[#F9FAFB]">
                      <td
                        onClick={() => handleRowClick(row.id)}
                        className="py-4 px-6 font-semibold text-[#3B82F6] hover:underline cursor-pointer"
                      >
                        {row.id}
                      </td>
                      <td className="py-4 px-6">{row.department}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#E5E7EB] flex items-center justify-center font-bold text-xs text-[#1F2937]">
                            {row.auditor.substring(0, 2).toUpperCase()}
                          </div>
                          <span>{row.auditor}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold">{row.checked}</td>
                      <td className="py-4 px-6">
                        <div className="w-24 bg-[#F3F4F6] rounded-full h-2.5">
                          <div className={`h-2.5 rounded-full ${row.progressColor}`} style={{ width: `${row.progressPercent}%` }}></div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider leading-none uppercase ${row.badgeStyle}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="p-4 border-t border-[#D1D5DB] flex items-center justify-between text-xs text-[#6B7280]">
              <span>Showing {dbAudits.length} of {dbAudits.length} active audits</span>
            </div>
          </div>

          {/* AI Insights and Category Breakdown (Right Section, cols-4) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Asset Integrity Progress chart visual */}
            <div className="bg-white border border-[#D1D5DB] rounded-xl p-5 shadow-sm text-left">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-base text-[#1F2937]">Asset Integrity Progress</h3>
                  <p className="text-[10px] text-[#6B7280] mt-0.5">Real-time tracking of asset verification status by category.</p>
                </div>
                <button className="border border-[#D1D5DB] text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 bg-white hover:bg-slate-50 cursor-pointer">
                  <span>This Month</span>
                  <span>▼</span>
                </button>
              </div>

              {/* Category labels horizontal list representing chart */}
              <div className="flex justify-between text-[9px] font-bold text-[#6B7280] uppercase tracking-wider mt-12 pt-4 border-t border-[#F3F4F6]">
                <span>HARDWARE</span>
                <span>VEHICLES</span>
                <span>MACHINES</span>
                <span>FURNITURE</span>
                <span>LICENSES</span>
              </div>
            </div>

            {/* AI Insights Card */}
            <div className="bg-white border border-[#D1D5DB] rounded-xl p-5 shadow-sm text-left">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🤖</span>
                <h3 className="font-bold text-base text-[#1F2937]">Audit AI Insights</h3>
              </div>

              {/* Insights list */}
              <div className="space-y-4 mb-4">
                <div className="p-3 bg-[#EFF6FF] rounded-lg">
                  <h4 className="text-[9px] font-bold text-[#3B82F6] uppercase tracking-wider mb-1">Anomaly Detected</h4>
                  <p className="text-xs text-[#1F2937] leading-relaxed">
                    The Logistics Center audit is tracking 12% slower than typical cycles. Recommend assign additional auditor.
                  </p>
                </div>
                <div className="p-3 bg-[#ECFDF5] rounded-lg">
                  <h4 className="text-[9px] font-bold text-[#10B981] uppercase tracking-wider mb-1">Predictive Alert</h4>
                  <p className="text-xs text-[#1F2937] leading-relaxed">
                    IT assets are showing a 98% verification rate, the highest in 6 months.
                  </p>
                </div>
                <div className="p-3 bg-[#F3F4F6] rounded-lg">
                  <h4 className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Upcoming Task</h4>
                  <p className="text-xs text-[#1F2937] leading-relaxed">
                    Compliance recertification for Warehouse B is due in 12 days.
                  </p>
                </div>
              </div>

              <button className="w-full border border-[#3B82F6] hover:bg-[#EFF6FF] text-[#3B82F6] text-xs font-bold py-2.5 rounded-lg text-center cursor-pointer transition-colors">
                Generate Full Audit Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
