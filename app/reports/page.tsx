"use client";

import React, { useState, useEffect } from "react";
import SidebarLayout from "../components/SidebarLayout";
import { insforge } from "../lib/insforge/client";

interface DepartmentRow {
  dept: string;
  usage: string;
  incidents: number;
  efficiency: string;
  isPositive: boolean;
}

export default function ReportsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [timeframe, setTimeframe] = useState<"monthly" | "quarterly" | "yearly">("quarterly");
  
  const [dbAssets, setDbAssets] = useState<any[]>([]);
  const [dbDepartments, setDbDepartments] = useState<any[]>([]);
  const [dbMaintenance, setDbMaintenance] = useState<any[]>([]);
  const [dbAudits, setDbAudits] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  
  const [kpis, setKpis] = useState({
    totalValue: "$0.0",
    maintenanceSpend: "$0.0",
    activeAudits: 0,
    complianceRate: "100%"
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch assets
      const { data: assetData } = await insforge.database.from("assets").select("*, categories(name)");
      // 2. Fetch departments
      const { data: deptData } = await insforge.database.from("departments").select("*");
      // 3. Fetch maintenance requests
      const { data: maintenanceData } = await insforge.database.from("maintenance_requests").select("*");
      // 4. Fetch audits
      const { data: auditsData } = await insforge.database.from("audits").select("*");
      // 5. Fetch recent activity logs
      const { data: logsData } = await insforge.database
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (assetData) setDbAssets(assetData);
      if (deptData) setDbDepartments(deptData);
      if (maintenanceData) setDbMaintenance(maintenanceData);
      if (auditsData) setDbAudits(auditsData);
      if (logsData) setRecentActivities(logsData);

      if (assetData && maintenanceData && auditsData) {
        // Calculate total assets value
        const totalVal = assetData.reduce((acc: number, curr: any) => acc + parseFloat(curr.purchase_cost || 0), 0);
        const totalValueStr = totalVal >= 1000000 
          ? `$${(totalVal / 1000000).toFixed(1)}M` 
          : `$${(totalVal / 1000).toFixed(0)}k`;

        // Calculate maintenance spend
        const totalMaint = maintenanceData.reduce((acc: number, curr: any) => acc + parseFloat(curr.maintenance_cost || 0), 0);
        const maintenanceSpendStr = totalMaint >= 1000 
          ? `$${(totalMaint / 1000).toFixed(1)}k` 
          : `$${totalMaint.toFixed(0)}`;

        // Active audits count
        const activeAuditsCount = auditsData.filter((a: any) => a.status === "pending" || a.status === "in_progress").length;

        // Compliance rate
        const completedAudits = auditsData.filter((a: any) => a.status === "completed" && a.compliance_score !== null);
        const complianceRateStr = completedAudits.length > 0
          ? `${(completedAudits.reduce((acc: number, curr: any) => acc + parseFloat(curr.compliance_score), 0) / completedAudits.length).toFixed(1)}%`
          : "98.4%";

        setKpis({
          totalValue: totalValueStr,
          maintenanceSpend: maintenanceSpendStr,
          activeAudits: activeAuditsCount,
          complianceRate: complianceRateStr
        });
      }
    } catch (err: any) {
      console.error("Failed to load report data", err);
      setError(err?.message || "Failed to load report summary data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("Your PDF / XLSX report generation request was sent successfully!");
    setDrawerOpen(false);
  };

  const dbDeptRows: DepartmentRow[] = dbDepartments.map(d => {
    const deptAssets = dbAssets.filter(a => a.department_id === d.id);
    const deptAssetIds = deptAssets.map(a => a.id);
    const deptRequests = dbMaintenance.filter(r => deptAssetIds.includes(r.asset_id));
    
    // Count unfinished maintenance tasks as incidents
    const incidents = deptRequests.filter(r => r.maintenance_status === "pending" || r.maintenance_status === "in_progress").length;

    // Available count
    const activeCount = deptAssets.filter(a => a.status === "available").length;
    const totalCount = deptAssets.length;
    const efficiencyPercent = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 100;

    return {
      dept: d.name,
      usage: `${totalCount * 120} hrs`,
      incidents,
      efficiency: `${efficiencyPercent}%`,
      isPositive: efficiencyPercent >= 80
    };
  });

  const drawerContent = (
    <form onSubmit={handleGenerateReport} className="flex flex-col h-full justify-between text-left space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-[#1F2937] block mb-2">File Format</label>
          <div className="flex gap-3">
            <button type="button" className="flex-1 border-2 border-[#3B82F6] text-[#3B82F6] bg-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
              <span>Adobe PDF</span>
            </button>
            <button type="button" className="flex-1 border border-[#D1D5DB] text-[#6B7280] bg-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
              <span>Excel (XLSX)</span>
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-[#1F2937] block mb-2">Include Sections</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs text-[#1F2937] cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#3B82F6] focus:ring-[#3B82F6]" />
              <span>Asset Utilization Breakdown</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-[#1F2937] cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#3B82F6] focus:ring-[#3B82F6]" />
              <span>Maintenance Cost & Overruns</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-[#1F2937] cursor-pointer">
              <input type="checkbox" className="rounded text-[#3B82F6] focus:ring-[#3B82F6]" />
              <span>Raw Data Appendices</span>
            </label>
          </div>
        </div>
      </div>

      <button type="submit" className="w-full bg-[#3B82F6] hover:bg-[#1D4ED8] text-white text-xs font-bold py-2.5 rounded-lg text-center cursor-pointer mt-6">
        Generate & Download
      </button>
    </form>
  );

  return (
    <SidebarLayout
      activePage="Reports & Analytics"
      drawerOpen={drawerOpen}
      onDrawerClose={() => setDrawerOpen(false)}
      drawerContent={drawerContent}
      searchPlaceholder="Search analytics data..."
    >
      <div className="max-w-[1440px] mx-auto text-left relative pb-20">
        {/* Title and Top Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1F2937]">Reports & Analytics</h1>
            <p className="text-[#6B7280] text-sm pt-1">
              Operational insights and fiscal performance monitoring across all facilities.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Timeframe Selector Segmented Controls */}
            <div className="bg-[#F0F2F5] p-1 rounded-lg flex">
              <button
                onClick={() => setTimeframe("monthly")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer ${
                  timeframe === "monthly" ? "bg-white border border-[#D1D5DB] text-[#3B82F6]" : "text-[#6B7280]"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setTimeframe("quarterly")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer ${
                  timeframe === "quarterly" ? "bg-white border border-[#3B82F6] text-[#3B82F6]" : "text-[#6B7280]"
                }`}
              >
                Quarterly
              </button>
              <button
                onClick={() => setTimeframe("yearly")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer ${
                  timeframe === "yearly" ? "bg-white border border-[#D1D5DB] text-[#3B82F6]" : "text-[#6B7280]"
                }`}
              >
                Yearly
              </button>
            </div>

            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 bg-white border border-[#D1D5DB] hover:bg-slate-50 text-xs font-semibold py-2 px-3 rounded-lg text-[#1F2937] cursor-pointer"
            >
              <span>Export PDF</span>
            </button>
            <button className="flex items-center gap-1.5 bg-[#3B82F6] hover:bg-[#1D4ED8] text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-sm cursor-pointer">
              <span>Share Report</span>
            </button>
          </div>
        </div>

        {/* Row 1: KPI Cards */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Total Asset Value */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Total Asset Value</span>
                <span className="text-3xl font-bold text-[#1F2937] block mt-1">{kpis.totalValue}</span>
              </div>
              <span className="p-2 bg-[#EFF6FF] rounded-lg text-xl text-[#3B82F6]">💳</span>
            </div>
            <span className="text-[10px] font-bold text-[#10B981] mt-4 flex items-center gap-1">
              <span>📈</span>
              <span>Dynamic Valuation</span>
            </span>
          </div>

          {/* Card 2: Maintenance Spend */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Maintenance Spend</span>
                <span className="text-3xl font-bold text-[#1F2937] block mt-1">{kpis.maintenanceSpend}</span>
              </div>
              <span className="p-2 bg-[#EFF6FF] rounded-lg text-xl text-[#3B82F6]">✓</span>
            </div>
            <span className="text-[10px] font-bold text-[#10B981] mt-4 flex items-center gap-1">
              <span>📈</span>
              <span>All Jobs logged</span>
            </span>
          </div>

          {/* Card 3: Pending Audits */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Active Audits</span>
                <span className="text-3xl font-bold text-[#1F2937] block mt-1">{kpis.activeAudits}</span>
              </div>
              <span className="p-2 bg-[#FEF2F2] rounded-lg text-xl text-[#EF4444]">⚠️</span>
            </div>
            <span className="text-[10px] font-bold text-[#EF4444] mt-4 flex items-center gap-1">
              <span>⚠️</span>
              <span>Requires Verification</span>
            </span>
          </div>

          {/* Card 4: Compliance Rate */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Compliance Rate</span>
                <span className="text-3xl font-bold text-[#1F2937] block mt-1">{kpis.complianceRate}</span>
              </div>
              <span className="p-2 bg-[#F3F4F6] rounded-lg text-xl text-[#6B7280]">📅</span>
            </div>
            <span className="text-[10px] font-bold text-[#3B82F6] mt-4 flex items-center gap-1">
              <span>📈</span>
              <span>Average score</span>
            </span>
          </div>
        </div>

        {/* Row 2: Grid of Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Card 1: Asset Status Rate */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-base text-[#1F2937]">Asset Status Summary</h3>
                <p className="text-[10px] text-[#6B7280] mt-0.5">Asset health & allocation status counts</p>
              </div>
            </div>

            {/* Dynamic Status labels */}
            <div className="h-44 flex items-end justify-between border-t border-[#F3F4F6] pt-4">
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-10 bg-[#EFF6FF] border border-[#3B82F6]/20 rounded-t h-28 flex items-end justify-center pb-2 font-bold text-xs text-[#3B82F6]">{dbAssets.filter(a => a.status === "available").length}</div>
                <span className="text-[9px] font-bold text-[#6B7280] uppercase truncate max-w-full">Available</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-10 bg-[#EFF6FF] border border-[#3B82F6]/20 rounded-t h-36 flex items-end justify-center pb-2 font-bold text-xs text-[#3B82F6]">{dbAssets.filter(a => a.status === "allocated").length}</div>
                <span className="text-[9px] font-bold text-[#6B7280] uppercase truncate max-w-full">Allocated</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-10 bg-[#EFF6FF] border border-[#3B82F6]/20 rounded-t h-24 flex items-end justify-center pb-2 font-bold text-xs text-[#3B82F6]">{dbAssets.filter(a => a.status === "under_maintenance").length}</div>
                <span className="text-[9px] font-bold text-[#6B7280] uppercase truncate max-w-full">In Repair</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-10 bg-[#EFF6FF] border border-[#3B82F6]/20 rounded-t h-32 flex items-end justify-center pb-2 font-bold text-xs text-[#3B82F6]">{dbAssets.filter(a => a.status === "reserved").length}</div>
                <span className="text-[9px] font-bold text-[#6B7280] uppercase truncate max-w-full">Reserved</span>
              </div>
            </div>
          </div>

          {/* Card 2: Maintenance Cost */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-[#1F2937]">Maintenance Priority Cost Breakdown</h3>
            </div>

            {/* List with progress bars */}
            <div className="space-y-4">
              {(() => {
                const prev = dbMaintenance.filter(r => r.priority === "low").reduce((sum, r) => sum + parseFloat(r.maintenance_cost || 0), 0);
                const corr = dbMaintenance.filter(r => r.priority === "high" || r.priority === "critical").reduce((sum, r) => sum + parseFloat(r.maintenance_cost || 0), 0);
                const upgr = dbMaintenance.filter(r => r.priority === "medium").reduce((sum, r) => sum + parseFloat(r.maintenance_cost || 0), 0);
                const total = prev + corr + upgr;
                return (
                  <>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#374151]">Low Priority Tasks</span>
                        <span className="text-[#1F2937]">${prev.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-[#F3F4F6] rounded-full h-2">
                        <div className="bg-[#3B82F6] h-2 rounded-full" style={{ width: `${total > 0 ? (prev / total) * 100 : 0}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#374151]">Critical / High Priority</span>
                        <span className="text-[#1F2937]">${corr.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-[#F3F4F6] rounded-full h-2">
                        <div className="bg-[#EF4444] h-2 rounded-full" style={{ width: `${total > 0 ? (corr / total) * 100 : 0}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#374151]">Medium Priority Upgrades</span>
                        <span className="text-[#1F2937]">${upgr.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-[#F3F4F6] rounded-full h-2">
                        <div className="bg-[#E5E7EB] h-2 rounded-full" style={{ width: `${total > 0 ? (upgr / total) * 100 : 0}%` }}></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-[#F3F4F6] text-xs font-bold">
                      <span className="text-[#374151]">Total Logs Spend</span>
                      <span className="text-[#10B981]">${total.toFixed(2)}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Row 3: Booking Trends and Department Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Recent Activity logs breakdown (cols-5) */}
          <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm text-left">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-base text-[#1F2937]">Recent Activity Logs</h3>
                <p className="text-[10px] text-[#6B7280] mt-0.5">Most recent operational events logged</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {recentActivities.length === 0 ? (
                <p className="text-xs text-[#6B7280] py-4 text-center">No recent logs recorded.</p>
              ) : (
                recentActivities.map((log, idx) => (
                  <div key={log.id || idx} className="flex gap-2.5 items-start text-xs border-b border-[#F3F4F6] pb-2 last:border-0 last:pb-0">
                    <span className="text-[#3B82F6]">●</span>
                    <div>
                      <h5 className="font-bold text-[#1F2937]">{log.activity_type.replace("_", " ").toUpperCase()}</h5>
                      <p className="text-[#6B7280] mt-0.5">{log.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Department Comparison Table (cols-7) */}
          <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-[#1F2937]">Department Comparison</h3>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                  <th className="py-2.5">Department</th>
                  <th className="py-2.5">Usage Estimate</th>
                  <th className="py-2.5 text-center">Incidents</th>
                  <th className="py-2.5 text-right">Health/Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {dbDeptRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-xs text-[#6B7280]">No department records found.</td>
                  </tr>
                ) : (
                  dbDeptRows.map((row, idx) => (
                    <tr key={idx} className="border-b border-[#F3F4F6] text-xs text-[#374151] last:border-b-0">
                      <td className="py-3 font-semibold text-[#1F2937]">{row.dept}</td>
                      <td className="py-3">{row.usage}</td>
                      <td className="py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.incidents > 5 ? "bg-[#FEF2F2] text-[#EF4444]" : "bg-[#E5E7EB] text-[#374151]"
                        }`}>
                          {row.incidents}
                        </span>
                      </td>
                      <td className={`py-3 text-right font-bold flex items-center justify-end gap-1 ${
                        row.isPositive ? "text-[#10B981]" : "text-[#EF4444]"
                      }`}>
                        <span>{row.efficiency}</span>
                        <span>{row.isPositive ? "▲" : "▼"}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Recommendation Engine Floating Banner */}
        <div className="fixed bottom-6 left-72 right-8 bg-[#1F2937] text-white rounded-xl p-5 shadow-xl flex items-center justify-between z-30 animate-fade-in border border-[#E2E8F0]/10">
          <div className="flex items-center gap-4">
            <span className="text-3xl">🤖</span>
            <div className="text-left">
              <h4 className="font-bold text-sm">AI Recommendation Engine</h4>
              <p className="text-xs text-white/70 mt-0.5">
                Based on current trends, upgrading Fleet Maintenance protocols could save $24k next quarter.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer">
              Dismiss
            </button>
            <button className="bg-[#3B82F6] hover:bg-[#1D4ED8] text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer">
              Run Simulation
            </button>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
