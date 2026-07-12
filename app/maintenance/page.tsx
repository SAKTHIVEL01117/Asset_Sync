"use client";

import React, { useState } from "react";
import SidebarLayout from "../components/SidebarLayout";

interface MaintenanceSchedule {
  id: string;
  assetName: string;
  assetId: string;
  technician: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  date: string;
  status: "In Progress" | "Pending" | "Overdue" | "Completed";
  icon: string;
}

export default function MaintenancePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [technicians, setTechnicians] = useState([
    { name: "Marcus Thorne", active: true },
    { name: "Elena Vance", active: false }
  ]);

  // Open schedule drawer if ?schedule=true query param is present
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("schedule") === "true") {
        setDrawerOpen(true);
      }
    }
  }, []);

  const schedules: MaintenanceSchedule[] = [
    {
      id: "AS-2044-X",
      assetName: "CNC Mill - Unit 04",
      assetId: "AS-2044-X",
      technician: "Marcus Thorne",
      priority: "HIGH",
      date: "Oct 24, 2023",
      status: "In Progress",
      icon: "⚙️",
    },
    {
      id: "AS-1122-Z",
      assetName: "Packaging Line B",
      assetId: "AS-1122-Z",
      technician: "Elena Vance",
      priority: "MEDIUM",
      date: "Oct 26, 2023",
      status: "Pending",
      icon: "📦",
    },
    {
      id: "AS-9833-Q",
      assetName: "HVAC Chiller Unit",
      assetId: "AS-9833-Q",
      technician: "Julian Grey",
      priority: "LOW",
      date: "Oct 22, 2023",
      status: "Overdue",
      icon: "❄️",
    },
    {
      id: "AS-5541-P",
      assetName: "Backup Generator 01",
      assetId: "AS-5541-P",
      technician: "Marcus Thorne",
      priority: "HIGH",
      date: "Oct 20, 2023",
      status: "Completed",
      icon: "💡",
    },
  ];

  const drawerContent = (
    <div className="flex flex-col h-full justify-between text-left space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider block mb-1">Target Asset</label>
          <div className="relative">
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="w-full bg-white border border-[#D1D5DB] rounded-lg py-2 pl-3 pr-8 text-xs text-[#374151] focus:outline-none"
            >
              <option value="">Select an asset...</option>
              <option>CNC Mill - Unit 04</option>
              <option>Packaging Line B</option>
              <option>HVAC Chiller Unit</option>
              <option>Backup Generator 01</option>
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
              type="text"
              placeholder="mm/dd/yyyy"
              className="w-full bg-white border border-[#D1D5DB] rounded-lg py-2 pl-3 pr-8 text-xs text-[#374151] focus:outline-none"
            />
            <span className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-[#6B7280]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider block mb-1">Priority</label>
          <div className="relative">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-white border border-[#D1D5DB] rounded-lg py-2 pl-3 pr-8 text-xs text-[#374151] focus:outline-none"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
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
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {technicians.map((t, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                  t.active ? "bg-[#3B82F6] text-white" : "bg-[#F3F4F6] text-[#374151]"
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white/30 text-[9px] flex items-center justify-center font-bold">
                  {t.name.substring(0, 2).toUpperCase()}
                </span>
                <span>{t.name}</span>
                <button className="text-[9px] hover:text-red-300 font-bold ml-1">&times;</button>
              </span>
            ))}
            <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F3F4F6] text-xs font-bold text-[#374151] hover:bg-[#E5E7EB]">
              + Browse all
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider block mb-1">Task Description</label>
          <textarea
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
              Based on historical data for this asset, we recommend checking the hydraulic pressure valves which typically fail every 400 operation hours.
            </p>
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex justify-between items-center gap-3 border-t border-[#E5E7EB] pt-4 mt-6">
        <button
          onClick={() => setDrawerOpen(false)}
          className="flex-1 bg-white hover:bg-slate-50 text-[#374151] text-xs font-bold py-2.5 rounded-lg border border-[#D1D5DB] cursor-pointer"
        >
          Cancel
        </button>
        <button className="flex-1 bg-[#3B82F6] hover:bg-[#1D4ED8] text-white text-xs font-bold py-2.5 rounded-lg cursor-pointer">
          Schedule Task
        </button>
      </div>
    </div>
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
            onClick={() => setDrawerOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3B82F6] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap"
          >
            <span className="font-bold">+</span>
            <span>Schedule Maintenance</span>
          </button>
        </div>

        {/* Row 1: KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Pending */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Pending</span>
                <span className="text-3xl font-bold text-[#374151] block mt-1">24</span>
              </div>
              <span className="text-xl text-[#3B82F6]">📋</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-[#F3F4F6] rounded-full h-1.5">
                <div className="bg-[#3B82F6] h-1.5 rounded-full" style={{ width: "35%" }}></div>
              </div>
              <span className="text-[10px] font-semibold text-[#22C55E] block mt-1.5">+12% vs LW</span>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">In Progress</span>
                <span className="text-3xl font-bold text-[#374151] block mt-1">08</span>
              </div>
              <span className="text-xl text-[#3B82F6]">🔄</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-[#F3F4F6] rounded-full h-1.5">
                <div className="bg-[#3B82F6] h-1.5 rounded-full" style={{ width: "15%" }}></div>
              </div>
              <span className="text-[10px] font-semibold text-[#3B82F6] block mt-1.5">Active Now</span>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Completed</span>
                <span className="text-3xl font-bold text-[#374151] block mt-1">142</span>
              </div>
              <span className="text-xl text-[#22C55E]">✓</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-[#F3F4F6] rounded-full h-1.5">
                <div className="bg-[#4B5563] h-1.5 rounded-full" style={{ width: "80%" }}></div>
              </div>
              <span className="text-[10px] font-semibold text-[#4B5563] block mt-1.5">94% Efficiency</span>
            </div>
          </div>

          {/* Overdue */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Overdue</span>
                <span className="text-3xl font-bold text-[#EF4444] block mt-1">03</span>
              </div>
              <span className="text-xl text-[#EF4444]">⚠️</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-[#F3F4F6] rounded-full h-1.5">
                <div className="bg-[#EF4444] h-1.5 rounded-full" style={{ width: "10%" }}></div>
              </div>
              <span className="text-[10px] font-semibold text-[#EF4444] block mt-1.5">Urgent</span>
            </div>
          </div>
        </div>

        {/* Schedule Registry Table */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
            <h3 className="font-bold text-[#2a303c] text-base">Maintenance Schedule</h3>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] hover:bg-slate-50 text-xs font-semibold py-1.5 px-3 rounded-lg text-[#374151] cursor-pointer">
                <span>Filter</span>
              </button>
              <button className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] hover:bg-slate-50 text-xs font-semibold py-1.5 px-3 rounded-lg text-[#374151] cursor-pointer">
                <span>Export</span>
              </button>
            </div>
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
              {schedules.map((row, idx) => (
                <tr key={idx} className="border-b border-[#E5E7EB] text-sm text-[#374151] hover:bg-[#F9FAFB]">
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
                    <button className="text-[#6B7280] hover:text-[#3B82F6] text-lg font-bold px-2 cursor-pointer">
                      &bull;&bull;&bull;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="p-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#6B7280]">
            <span>Showing 4 of 32 schedules</span>
            <div className="flex gap-2">
              <button className="border border-[#E5E7EB] px-2.5 py-1 rounded bg-white hover:bg-slate-50 cursor-pointer">&lt;</button>
              <button className="border border-[#E5E7EB] px-2.5 py-1 rounded bg-white hover:bg-slate-50 cursor-pointer">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
