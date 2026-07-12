"use client";

import React, { useState } from "react";
import SidebarLayout from "../components/SidebarLayout";

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

  const departments: DepartmentRow[] = [
    {
      dept: "Logistics & Supply",
      usage: "8,240 hrs",
      incidents: 12,
      efficiency: "78%",
      isPositive: false,
    },
    {
      dept: "Production Wing B",
      usage: "14,102 hrs",
      incidents: 2,
      efficiency: "94%",
      isPositive: true,
    },
    {
      dept: "IT Infrastructure",
      usage: "3,120 hrs",
      incidents: 0,
      efficiency: "99%",
      isPositive: true,
    },
    {
      dept: "R&D Labs",
      usage: "6,441 hrs",
      incidents: 5,
      efficiency: "82%",
      isPositive: true,
    },
  ];

  const drawerContent = (
    <div className="flex flex-col h-full justify-between text-left space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-[#1F2937] block mb-2">File Format</label>
          <div className="flex gap-3">
            <button className="flex-1 border-2 border-[#3B82F6] text-[#3B82F6] bg-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
              <span>Adobe PDF</span>
            </button>
            <button className="flex-1 border border-[#D1D5DB] text-[#6B7280] bg-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
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

      <button className="w-full bg-[#3B82F6] hover:bg-[#1D4ED8] text-white text-xs font-bold py-2.5 rounded-lg text-center cursor-pointer mt-6">
        Generate & Download
      </button>
    </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Total Asset Value */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Total Asset Value</span>
                <span className="text-3xl font-bold text-[#1F2937] block mt-1">$12.4M</span>
              </div>
              <span className="p-2 bg-[#EFF6FF] rounded-lg text-xl text-[#3B82F6]">💳</span>
            </div>
            <span className="text-[10px] font-bold text-[#10B981] mt-4 flex items-center gap-1">
              <span>📈</span>
              <span>+4.2% from last quarter</span>
            </span>
          </div>

          {/* Card 2: Maintenance ROI */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Maintenance ROI</span>
                <span className="text-3xl font-bold text-[#1F2937] block mt-1">84.2%</span>
              </div>
              <span className="p-2 bg-[#EFF6FF] rounded-lg text-xl text-[#3B82F6]">✓</span>
            </div>
            <span className="text-[10px] font-bold text-[#10B981] mt-4 flex items-center gap-1">
              <span>📈</span>
              <span>+1.5% optimized</span>
            </span>
          </div>

          {/* Card 3: Pending Audits */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Pending Audits</span>
                <span className="text-3xl font-bold text-[#1F2937] block mt-1">12</span>
              </div>
              <span className="p-2 bg-[#FEF2F2] rounded-lg text-xl text-[#EF4444]">⚠️</span>
            </div>
            <span className="text-[10px] font-bold text-[#EF4444] mt-4 flex items-center gap-1">
              <span>⚠️</span>
              <span>3 critical items overdue</span>
            </span>
          </div>

          {/* Card 4: Active Bookings */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Active Bookings</span>
                <span className="text-3xl font-bold text-[#1F2937] block mt-1">1,452</span>
              </div>
              <span className="p-2 bg-[#F3F4F6] rounded-lg text-xl text-[#6B7280]">📅</span>
            </div>
            <span className="text-[10px] font-bold text-[#3B82F6] mt-4 flex items-center gap-1">
              <span>📈</span>
              <span>+18% higher demand</span>
            </span>
          </div>
        </div>

        {/* Row 2: Grid of Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Card 1: Asset Utilization Rate */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-base text-[#1F2937]">Asset Utilization Rate</h3>
                <p className="text-[10px] text-[#6B7280] mt-0.5">Efficiency tracking across primary resource categories</p>
              </div>
              <button className="text-[#6B7280] hover:text-[#3B82F6] text-lg font-bold px-2 cursor-pointer">
                &bull;&bull;&bull;
              </button>
            </div>

            {/* Placeholder Visual with Category labels */}
            <div className="h-44 flex items-end justify-between border-t border-[#F3F4F6] pt-4">
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-10 bg-[#EFF6FF] border border-[#3B82F6]/20 rounded-t h-28 flex items-end justify-center pb-2 font-bold text-xs text-[#3B82F6]">72%</div>
                <span className="text-[9px] font-bold text-[#6B7280] uppercase truncate max-w-full">Heavy Mach.</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-10 bg-[#EFF6FF] border border-[#3B82F6]/20 rounded-t h-36 flex items-end justify-center pb-2 font-bold text-xs text-[#3B82F6]">89%</div>
                <span className="text-[9px] font-bold text-[#6B7280] uppercase truncate max-w-full">Fleet</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-10 bg-[#EFF6FF] border border-[#3B82F6]/20 rounded-t h-24 flex items-end justify-center pb-2 font-bold text-xs text-[#3B82F6]">61%</div>
                <span className="text-[9px] font-bold text-[#6B7280] uppercase truncate max-w-full">IT Assets</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-10 bg-[#EFF6FF] border border-[#3B82F6]/20 rounded-t h-32 flex items-end justify-center pb-2 font-bold text-xs text-[#3B82F6]">80%</div>
                <span className="text-[9px] font-bold text-[#6B7280] uppercase truncate max-w-full">Facilities</span>
              </div>
            </div>
          </div>

          {/* Card 2: Maintenance Cost */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-[#1F2937]">Maintenance Cost</h3>
              <span className="bg-[#E5E7EB] text-[#374151] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                VS BUDGET
              </span>
            </div>

            {/* List with progress bars */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[#374151]">Preventive</span>
                  <span className="text-[#1F2937]">$42.3k</span>
                </div>
                <div className="w-full bg-[#F3F4F6] rounded-full h-2">
                  <div className="bg-[#3B82F6] h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[#374151]">Corrective (Urgent)</span>
                  <span className="text-[#1F2937]">$18.9k</span>
                </div>
                <div className="w-full bg-[#F3F4F6] rounded-full h-2">
                  <div className="bg-[#EF4444] h-2 rounded-full" style={{ width: "35%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[#374151]">Upgrades</span>
                  <span className="text-[#1F2937]">$12.1k</span>
                </div>
                <div className="w-full bg-[#F3F4F6] rounded-full h-2">
                  <div className="bg-[#E5E7EB] h-2 rounded-full" style={{ width: "20%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[#374151]">Replacement</span>
                  <span className="text-[#1F2937]">$204.5k</span>
                </div>
                <div className="w-full bg-[#F3F4F6] rounded-full h-2">
                  <div className="bg-[#374151] h-2 rounded-full" style={{ width: "90%" }}></div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-[#F3F4F6] text-xs font-bold">
                <span className="text-[#374151]">Cumulative Savings</span>
                <span className="text-[#10B981]">+$14,200</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Booking Trends and Department Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Booking Trends bar chart (cols-5) */}
          <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm text-left">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-base text-[#1F2937]">Booking Trends</h3>
                <p className="text-[10px] text-[#6B7280] mt-0.5">Daily reservation volume over last 30 days</p>
              </div>
              <div className="relative">
                <select className="appearance-none bg-white border border-[#D1D5DB] rounded-lg py-1 px-3 pr-7 text-xs font-semibold text-[#1F2937] focus:outline-none">
                  <option>All Sites</option>
                </select>
                <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-[#6B7280]">▼</span>
              </div>
            </div>

            {/* SVG bar chart */}
            <div className="h-44 flex items-end justify-between gap-1 pt-4">
              <div className="w-2.5 h-16 bg-[#D1E0FF] rounded-t-xs"></div>
              <div className="w-2.5 h-20 bg-[#D1E0FF] rounded-t-xs"></div>
              <div className="w-2.5 h-12 bg-[#D1E0FF] rounded-t-xs"></div>
              <div className="w-2.5 h-24 bg-[#D1E0FF] rounded-t-xs"></div>
              <div className="w-2.5 h-32 bg-[#A0C4FF] rounded-t-xs"></div>
              <div className="w-2.5 h-28 bg-[#D1E0FF] rounded-t-xs"></div>
              <div className="w-2.5 h-36 bg-[#A0C4FF] rounded-t-xs"></div>
              <div className="w-2.5 h-20 bg-[#D1E0FF] rounded-t-xs"></div>
              <div className="w-2.5 h-16 bg-[#D1E0FF] rounded-t-xs"></div>
              <div className="w-2.5 h-24 bg-[#D1E0FF] rounded-t-xs"></div>
            </div>
          </div>

          {/* Department Comparison Table (cols-7) */}
          <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-[#1F2937]">Department Comparison</h3>
              <span className="bg-[#E5E7EB] text-[#374151] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Q3 PERFORMANCE
              </span>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                  <th className="py-2.5">Department</th>
                  <th className="py-2.5">Usage</th>
                  <th className="py-2.5 text-center">Incidents</th>
                  <th className="py-2.5 text-right">Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((row, idx) => (
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
                ))}
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
