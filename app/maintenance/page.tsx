"use client";

import React, { useState, useEffect } from "react";
import SidebarLayout from "../components/SidebarLayout";
import { insforge } from "../lib/insforge/client";

interface MaintenanceSchedule {
  id: string;
  assetName: string;
  assetId: string;
  technician: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  date: string;
  status: "In Progress" | "Pending" | "Overdue" | "Completed" | "Cancelled";
  icon: string;
}

export default function MaintenancePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().substring(0, 10));
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const [drawerMode, setDrawerMode] = useState<"create" | "view">("create");
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [loadingRequest, setLoadingRequest] = useState(false);
  
  const [dbSchedules, setDbSchedules] = useState<MaintenanceSchedule[]>([]);
  const [dbAssets, setDbAssets] = useState<any[]>([]);
  const [dbEmployees, setDbEmployees] = useState<any[]>([]);
  const [employee, setEmployee] = useState<any>(null);
  
  const [kpis, setKpis] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [aiSuggestion, setAiSuggestion] = useState("Select an asset to generate maintenance recommendation.");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    async function loadSuggestion() {
      if (!selectedAssetId) return;
      const asset = dbAssets.find(a => a.id === selectedAssetId);
      if (!asset) return;
      setLoadingAi(true);
      setAiSuggestion("Analyzing historical telemetry data...");
      try {
        const { getAiCompletion } = await import("../actions");
        const prompt = `Give a concise, 1-2 sentence technical maintenance recommendation for this asset: Name: ${asset.name}, Tag: ${asset.asset_tag}, Condition: ${asset.condition}, Location: ${asset.location || 'Unknown'}. What should we focus on?`;
        const res = await getAiCompletion(prompt);
        if (res.error) {
          setAiSuggestion(`Unable to retrieve recommendation: ${res.error}`);
        } else {
          setAiSuggestion(res.text || "No recommendation found.");
        }
      } catch (err: any) {
        setAiSuggestion("Failed to contact AI engine.");
      } finally {
        setLoadingAi(false);
      }
    }
    void loadSuggestion();
  }, [selectedAssetId, dbAssets]);

  // Open schedule drawer if ?schedule=true query param is present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("schedule") === "true") {
        setDrawerOpen(true);
      }
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch current user & employee
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

      // 2. Fetch all assets
      const { data: assetData } = await insforge.database.from("assets").select("*").order("name", { ascending: true });
      if (assetData) {
        setDbAssets(assetData);
        if (assetData.length > 0) {
          setSelectedAssetId(assetData[0].id);
        }
      }

      // 3. Fetch employees
      const { data: empData } = await insforge.database.from("employees").select("*").order("name", { ascending: true });
      if (empData) {
        setDbEmployees(empData);
        const techs = empData.filter((e: any) => e.role === "admin" || e.role === "asset_manager");
        if (techs.length > 0) {
          setSelectedTechnicianId(techs[0].id);
        }
      }

      // 4. Fetch maintenance requests
      const { data: requests } = await insforge.database
        .from("maintenance_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (requests && assetData && empData) {
        let pendingCount = 0;
        let inProgressCount = 0;
        let completedCount = 0;
        let overdueCount = 0;

        const mapped = requests.map((r: any) => {
          const asset = assetData.find((a: any) => a.id === r.asset_id);
          const tech = empData.find((e: any) => e.id === r.assigned_to);

          let priorityStr: "HIGH" | "MEDIUM" | "LOW" = "MEDIUM";
          if (r.priority === "high" || r.priority === "critical") priorityStr = "HIGH";
          else if (r.priority === "low") priorityStr = "LOW";

          let statusStr: MaintenanceSchedule["status"] = "Pending";
          if (r.maintenance_status === "in_progress") {
            statusStr = "In Progress";
            inProgressCount++;
          } else if (r.maintenance_status === "completed") {
            statusStr = "Completed";
            completedCount++;
          } else if (r.maintenance_status === "cancelled") {
            statusStr = "Cancelled";
          } else {
            pendingCount++;
          }

          if (statusStr !== "Completed" && statusStr !== "Cancelled" && r.scheduled_date && new Date(r.scheduled_date) < new Date()) {
            statusStr = "Overdue";
            overdueCount++;
          }

          return {
            id: r.id,
            assetName: asset?.name || "Unknown Asset",
            assetId: asset?.asset_tag || "N/A",
            technician: tech?.name || "Unassigned",
            priority: priorityStr,
            date: r.scheduled_date ? new Date(r.scheduled_date).toLocaleDateString() : "TBD",
            status: statusStr,
            icon: "⚙️"
          };
        });

        setDbSchedules(mapped);
        setKpis({
          pending: pendingCount,
          inProgress: inProgressCount,
          completed: completedCount,
          overdue: overdueCount
        });
      }
    } catch (err: any) {
      console.error("Failed to load maintenance requests", err);
      setError(err?.message || "Failed to load maintenance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId || !employee) {
      setError("Please select an asset and ensure you are logged in.");
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      const payload = {
        asset_id: selectedAssetId,
        reported_by: employee.id,
        assigned_to: selectedTechnicianId || null,
        priority: priority.toLowerCase() as any,
        issue_description: taskDescription || "Scheduled routine check",
        scheduled_date: new Date(scheduledDate).toISOString(),
        maintenance_status: "pending" as const,
        maintenance_cost: 0.00
      };

      const { error: insertError } = await insforge.database
        .from("maintenance_requests")
        .insert([payload]);

      if (insertError) throw insertError;

      // Add activity log
      await insforge.database.from("activity_logs").insert([{
        user_id: employee.id,
        activity_type: "maintenance_create",
        entity_name: "maintenance_requests",
        entity_id: selectedAssetId,
        description: `Scheduled maintenance request for asset: ${taskDescription}`
      }]);

      setSuccess("Maintenance task scheduled successfully!");
      setDrawerOpen(false);
      void fetchData();
    } catch (err: any) {
      console.error("Failed to schedule maintenance", err);
      setError(err?.message || "Failed to schedule maintenance task");
    }
  };

  const handleRowClick = async (requestId: string) => {
    setDrawerMode("view");
    setDrawerOpen(true);
    setLoadingRequest(true);
    setError(null);
    setSuccess(null);
    try {
      const { data: requestData } = await insforge.database
        .from("maintenance_requests")
        .select("*")
        .eq("id", requestId)
        .single();
      
      setActiveRequest(requestData);
      if (requestData) {
        setSelectedTechnicianId(requestData.assigned_to || "");
        setTaskDescription(requestData.issue_description || "");
        setPriority(requestData.priority ? requestData.priority.charAt(0).toUpperCase() + requestData.priority.slice(1) : "Medium");
        setScheduledDate(requestData.scheduled_date ? requestData.scheduled_date.substring(0, 10) : new Date().toISOString().substring(0, 10));
      }
    } catch (err: any) {
      console.error("Failed to load request details", err);
      setError(err?.message || "Failed to load request details.");
    } finally {
      setLoadingRequest(false);
    }
  };

  const handleUpdateRequestStatus = async (status: "pending" | "in_progress" | "completed" | "cancelled") => {
    if (!activeRequest) return;
    try {
      const { error: updateErr } = await insforge.database
        .from("maintenance_requests")
        .update({
          maintenance_status: status,
          assigned_to: selectedTechnicianId || null,
          priority: priority.toLowerCase() as any,
          issue_description: taskDescription,
          scheduled_date: new Date(scheduledDate).toISOString()
        })
        .eq("id", activeRequest.id);

      if (updateErr) throw updateErr;

      setSuccess(`Maintenance task updated to ${status.replace("_", " ")} successfully!`);
      setDrawerOpen(false);
      void fetchData();
    } catch (err: any) {
      console.error("Failed to update maintenance task", err);
      setError(err?.message || "Failed to update maintenance task.");
    }
  };

  const drawerContent = drawerMode === "view" ? (
    <div className="flex flex-col h-full justify-between text-left space-y-6">
      <div className="space-y-4">
        <div>
          <span className="inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#EFF6FF] text-[#3B82F6] uppercase tracking-wider mb-1">
            {activeRequest?.maintenance_status?.replace("_", " ")}
          </span>
          <h4 className="font-bold text-[#2a303c] text-base leading-tight mt-0.5">
            {dbAssets.find(a => a.id === activeRequest?.asset_id)?.name || "Maintenance Details"}
          </h4>
          <span className="text-[10px] text-[#6b7280] block mt-1">
            Asset ID: {dbAssets.find(a => a.id === activeRequest?.asset_id)?.asset_tag || "—"}
          </span>
        </div>

        {loadingRequest ? (
          <div className="space-y-4 py-8">
            <div className="h-8 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#374151] block mb-1">Issue Description</label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                rows={3}
                className="w-full bg-white border border-[#D1D5DB] rounded-lg py-2 px-3 text-xs text-[#374151] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#374151] block mb-1">Assigned Technician</label>
              <div className="relative">
                <select
                  value={selectedTechnicianId}
                  onChange={(e) => setSelectedTechnicianId(e.target.value)}
                  className="w-full bg-white border border-[#D1D5DB] rounded-lg py-2 pl-3 pr-8 text-xs text-[#374151] focus:outline-none appearance-none"
                >
                  <option value="">Select technician...</option>
                  {dbEmployees.filter(e => e.role === "admin" || e.role === "asset_manager").map(tech => (
                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#374151] block mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-white border border-[#D1D5DB] rounded-lg py-2 px-3 text-xs text-[#374151] focus:outline-none appearance-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#374151] block mb-1">Scheduled Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().substring(0, 10)}
                  className="w-full bg-white border border-[#D1D5DB] rounded-lg py-2 px-3 text-xs text-[#374151] focus:outline-none"
                />
              </div>
            </div>

            <div className="border-t border-[#E5E7EB] pt-4">
              <label className="text-xs font-bold text-[#374151] block mb-2">Update Status</label>
              <div className="flex flex-wrap gap-2">
                {(["pending", "in_progress", "completed", "cancelled"] as const).map(status => {
                  const isCurrent = activeRequest?.maintenance_status === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleUpdateRequestStatus(status)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold capitalize cursor-pointer border ${
                        isCurrent
                          ? "bg-[#3B82F6] text-white border-[#3B82F6]"
                          : "bg-white text-[#4B5563] border-[#D1D5DB] hover:bg-[#F3F4F6]"
                      }`}
                    >
                      {status.replace("_", " ")}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center gap-3 border-t border-[#E5E7EB] pt-4 mt-6">
        <button
          type="button"
          onClick={() => setDrawerOpen(false)}
          className="flex-1 bg-white hover:bg-slate-50 text-[#374151] text-xs font-bold py-2.5 rounded-lg border border-[#D1D5DB] cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => handleUpdateRequestStatus(activeRequest?.maintenance_status)}
          className="flex-1 bg-[#3B82F6] hover:bg-[#1D4ED8] text-white text-xs font-bold py-2.5 rounded-lg cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </div>
  ) : (
    <form onSubmit={handleScheduleSubmit} className="flex flex-col h-full justify-between text-left space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider block mb-1">Target Asset</label>
          <div className="relative">
            <select
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="w-full bg-white border border-[#D1D5DB] rounded-lg py-2 pl-3 pr-8 text-xs text-[#374151] focus:outline-none appearance-none"
            >
              <option value="">Select an asset...</option>
              {dbAssets.map(asset => (
                <option key={asset.id} value={asset.id}>{asset.name} ({asset.asset_tag})</option>
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
          <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider block mb-1">Scheduled Date</label>
          <div className="relative">
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={new Date().toISOString().substring(0, 10)}
              className="w-full bg-white border border-[#D1D5DB] rounded-lg py-2 px-3 text-xs text-[#374151] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider block mb-1">Priority</label>
          <div className="relative">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-white border border-[#D1D5DB] rounded-lg py-2 pl-3 pr-8 text-xs text-[#374151] focus:outline-none appearance-none"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            <span className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-[#6B7280]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider block mb-1">Assign Technician</label>
          <div className="relative">
            <select
              value={selectedTechnicianId}
              onChange={(e) => setSelectedTechnicianId(e.target.value)}
              className="w-full bg-white border border-[#D1D5DB] rounded-lg py-2 pl-3 pr-8 text-xs text-[#374151] focus:outline-none appearance-none"
            >
              <option value="">Select a technician...</option>
              {dbEmployees.filter(e => e.role === "admin" || e.role === "asset_manager").map(tech => (
                <option key={tech.id} value={tech.id}>{tech.name} ({tech.role.replace("_", " ")})</option>
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
          <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider block mb-1">Task Description</label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Describe the maintenance steps or issues to check..."
            rows={3}
            className="w-full bg-white border border-[#D1D5DB] rounded-lg py-2 px-3 text-xs text-[#374151] focus:outline-none placeholder-[#D1D5DB]"
          />
        </div>

        {/* AI Suggestion Card */}
        <div className="bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl p-4 flex gap-3 items-start">
          <span className="text-xl text-[#3B82F6] shrink-0">🤖</span>
          <div className="min-w-0">
            <h5 className="font-bold text-xs text-[#374151]">AI Suggestion</h5>
            <p className="text-[10px] text-[#4B5563] mt-0.5 leading-normal">
              {loadingAi ? "Analyzing telemetry..." : aiSuggestion}
            </p>
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex justify-between items-center gap-3 border-t border-[#E5E7EB] pt-4 mt-6">
        <button
          type="button"
          onClick={() => setDrawerOpen(false)}
          className="flex-1 bg-white hover:bg-slate-50 text-[#374151] text-xs font-bold py-2.5 rounded-lg border border-[#D1D5DB] cursor-pointer"
        >
          Cancel
        </button>
        <button type="submit" className="flex-1 bg-[#3B82F6] hover:bg-[#1D4ED8] text-white text-xs font-bold py-2.5 rounded-lg cursor-pointer">
          Schedule Task
        </button>
      </div>
    </form>
  );

  return (
    <SidebarLayout
      activePage="Maintenance"
      drawerOpen={drawerOpen}
      onDrawerClose={() => setDrawerOpen(false)}
      drawerContent={drawerContent}
      searchPlaceholder="Search maintenance logs, assets, or technicians..."
    >
      <div className="max-w-[1440px] mx-auto text-left">
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#2a303c]">Maintenance Overview</h1>
            <p className="text-[#6b7280] text-sm pt-1">
              Systematic health tracking for industrial assets.
            </p>
          </div>
          <button
            onClick={() => {
              setDrawerMode("create");
              setDrawerOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3B82F6] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap"
          >
            <span className="font-bold">+</span>
            <span>Schedule Maintenance</span>
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

        {/* Row 1: KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Pending */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Pending</span>
                <span className="text-3xl font-bold text-[#374151] block mt-1">{kpis.pending}</span>
              </div>
              <span className="text-xl text-[#3B82F6]">📋</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-[#F3F4F6] rounded-full h-1.5">
                <div className="bg-[#3B82F6] h-1.5 rounded-full" style={{ width: `${Math.round((kpis.pending / (dbSchedules.length || 1)) * 100)}%` }}></div>
              </div>
              <span className="text-[10px] font-semibold text-[#3B82F6] block mt-1.5">{Math.round((kpis.pending / (dbSchedules.length || 1)) * 100)}% of total</span>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">In Progress</span>
                <span className="text-3xl font-bold text-[#374151] block mt-1">{kpis.inProgress}</span>
              </div>
              <span className="text-xl text-[#3B82F6]">🔄</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-[#F3F4F6] rounded-full h-1.5">
                <div className="bg-[#3B82F6] h-1.5 rounded-full" style={{ width: `${Math.round((kpis.inProgress / (dbSchedules.length || 1)) * 100)}%` }}></div>
              </div>
              <span className="text-[10px] font-semibold text-[#3B82F6] block mt-1.5">{Math.round((kpis.inProgress / (dbSchedules.length || 1)) * 100)}% of total</span>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Completed</span>
                <span className="text-3xl font-bold text-[#374151] block mt-1">{kpis.completed}</span>
              </div>
              <span className="text-xl text-[#22C55E]">✓</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-[#F3F4F6] rounded-full h-1.5">
                <div className="bg-[#4B5563] h-1.5 rounded-full" style={{ width: `${Math.round((kpis.completed / (dbSchedules.length || 1)) * 100)}%` }}></div>
              </div>
              <span className="text-[10px] font-semibold text-[#4B5563] block mt-1.5">{Math.round((kpis.completed / (dbSchedules.length || 1)) * 100)}% of total</span>
            </div>
          </div>

          {/* Overdue */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Overdue</span>
                <span className="text-3xl font-bold text-[#EF4444] block mt-1">{kpis.overdue}</span>
              </div>
              <span className="text-xl text-[#EF4444]">⚠️</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-[#F3F4F6] rounded-full h-1.5">
                <div className="bg-[#EF4444] h-1.5 rounded-full" style={{ width: `${Math.round((kpis.overdue / (dbSchedules.length || 1)) * 100)}%` }}></div>
              </div>
              <span className="text-[10px] font-semibold text-[#EF4444] block mt-1.5">Urgent</span>
            </div>
          </div>
        </div>

        {/* Schedule Registry Table */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
            <h3 className="font-bold text-[#2a303c] text-base">Maintenance Schedule</h3>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                <th className="py-4 px-6">Asset</th>
                <th className="py-4 px-6">Technician</th>
                <th className="py-4 px-6">Priority</th>
                <th className="py-4 px-6">Scheduled Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dbSchedules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#6B7280]">No maintenance tasks scheduled.</td>
                </tr>
              ) : (
                dbSchedules.map((row, idx) => (
                  <tr
                    key={row.id || idx}
                    onClick={() => handleRowClick(row.id)}
                    className="border-b border-[#E5E7EB] text-sm text-[#374151] hover:bg-[#F9FAFB] cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span className="text-xl text-[#6B7280]">{row.icon}</span>
                        <div>
                          <span className="font-bold text-[#2A303C] block">{row.assetName}</span>
                          <span className="text-xs text-[#6B7280]">ID: {row.assetId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#E5E7EB] flex items-center justify-center font-bold text-xs text-[#374151]">
                          {row.technician.substring(0, 2).toUpperCase()}
                        </div>
                        <span>{row.technician}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white tracking-wider ${
                        row.priority === "HIGH" ? "bg-[#EF4444]" :
                        row.priority === "MEDIUM" ? "bg-[#F59E0B]" : "bg-[#3B82F6]"
                      }`}>
                        {row.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[#374151] font-semibold">{row.date}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 font-bold ${
                        row.status === "In Progress" ? "text-[#3B82F6]" :
                        row.status === "Pending" ? "text-[#6B7280]" :
                        row.status === "Overdue" ? "text-[#EF4444]" : "text-[#22C55E]"
                      }`}>
                        <span>•</span>
                        <span>{row.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleRowClick(row.id)}
                        className="text-[#6B7280] hover:text-[#3B82F6] text-lg font-bold px-2 cursor-pointer"
                      >
                        &bull;&bull;&bull;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="p-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#6B7280]">
            <span>Showing {dbSchedules.length} of {dbSchedules.length} schedules</span>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
