"use client";

import React, { useState } from "react";
import SidebarLayout from "../components/SidebarLayout";

interface ActiveAudit {
  id: string;
  department: string;
  auditor: string;
  checked: string;
  progressPercent: number;
  status: "Active" | "In Progress" | "Review Pending" | "Urgent" | "Completed";
  progressColor: string;
  badgeStyle: string;
}

export default function AuditsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "schedule">("overview");

  const activeAudits: ActiveAudit[] = [
    {
      id: "AUD-2024-089",
      department: "IT & Infrastructure",
      auditor: "Mark Thompson",
      checked: "142/150",
      progressPercent: 94.6,
      status: "Active",
      progressColor: "bg-[#3B82F6]",
      badgeStyle: "bg-[#EFF6FF] text-[#3B82F6]",
    },
    {
      id: "AUD-2024-092",
      department: "Logistics Center",
      auditor: "Sarah Jenkins",
      checked: "45/320",
      progressPercent: 14.0,
      status: "In Progress",
      progressColor: "bg-[#10B981]",
      badgeStyle: "bg-[#ECFDF5] text-[#10B981]",
    },
    {
      id: "AUD-2024-085",
      department: "Executive Office",
      auditor: "David Chen",
      checked: "88/88",
      progressPercent: 100.0,
      status: "Review Pending",
      progressColor: "bg-[#3B82F6]",
      badgeStyle: "bg-[#F3F4F6] text-[#6B7280]",
    },
    {
      id: "AUD-2024-094",
      department: "R&D Laboratory",
      auditor: "Elena Rodriguez",
      checked: "12/540",
      progressPercent: 2.2,
      status: "Urgent",
      progressColor: "bg-[#EF4444]",
      badgeStyle: "bg-[#FEF2F2] text-[#EF4444]",
    },
    {
      id: "AUD-2024-080",
      department: "Finance Hub",
      auditor: "James Wilson",
      checked: "210/210",
      progressPercent: 100.0,
      status: "Completed",
      progressColor: "bg-[#3B82F6]",
      badgeStyle: "bg-[#EFF6FF] text-[#3B82F6]",
    },
  ];

  const drawerContent = (
    <div className="flex flex-col h-full justify-between text-left space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-[#1F2937] block mb-1">Audit Name</label>
          <input
            type="text"
            placeholder="e.g. Q4 Infrastructure Review"
            className="w-full bg-white border border-[#D1D5DB] rounded-lg py-2 px-3 text-xs text-[#1F2937] focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#1F2937] block mb-1">Department</label>
          <div className="relative">
            <select className="w-full bg-white border border-[#D1D5DB] rounded-lg py-2 pl-3 pr-8 text-xs text-[#1F2937] focus:outline-none">
              <option>Operations</option>
              <option>IT & Infrastructure</option>
              <option>Logistics Center</option>
              <option>Finance Hub</option>
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
            <select className="w-full bg-white border border-[#D1D5DB] rounded-lg py-2 pl-3 pr-8 text-xs text-[#1F2937] focus:outline-none">
              <option>Alex Rivera</option>
              <option>Mark Thompson</option>
              <option>Sarah Jenkins</option>
              <option>David Chen</option>
            </select>
            <span className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-[#6B7280]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-[#1F2937] block mb-1">Scope & Objectives</label>
          <textarea
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
          onClick={() => setDrawerOpen(false)}
          className="flex-1 bg-white hover:bg-slate-50 text-[#1F2937] text-xs font-bold py-2.5 rounded-lg border border-[#D1D5DB] cursor-pointer"
        >
          Cancel
        </button>
        <button className="flex-1 bg-[#3B82F6] hover:bg-[#1D4ED8] text-white text-xs font-bold py-2.5 rounded-lg cursor-pointer">
          Create Audit
        </button>
      </div>
    </div>
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
            onClick={() => setDrawerOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3B82F6] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap"
          >
            <span>+</span>
            <span>Start Audit</span>
          </button>
        </div>

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
                <span className="text-3xl font-bold text-[#3B82F6] block mt-1">94.2%</span>
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
                <span className="text-3xl font-bold text-[#1F2937] block mt-1">428</span>
              </div>
              <span className="text-xl text-[#3B82F6]">📁</span>
            </div>
            <span className="text-[10px] text-[#6B7280] mt-4 block">Last 30 days (+12)</span>
          </div>

          {/* Pending */}
          <div className="bg-white border border-[#D1D5DB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Pending</span>
                <span className="text-3xl font-bold text-[#1F2937] block mt-1">14</span>
              </div>
              <span className="text-xl text-[#6B7280]">⏳</span>
            </div>
            <span className="text-[10px] text-[#6B7280] mt-4 block">5 requiring attention</span>
          </div>

          {/* Missing Assets */}
          <div className="bg-white border border-[#D1D5DB] rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Missing Assets</span>
                <span className="text-3xl font-bold text-[#EF4444] block mt-1">03</span>
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
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1.5 bg-white border border-[#D1D5DB] hover:bg-slate-50 text-xs font-semibold py-1.5 px-3 rounded-lg text-[#1F2937] cursor-pointer">
                  <span>Filter</span>
                </button>
                <button className="flex items-center gap-1.5 bg-white border border-[#D1D5DB] hover:bg-slate-50 text-xs font-semibold py-1.5 px-3 rounded-lg text-[#1F2937] cursor-pointer">
                  <span>Export CSV</span>
                </button>
              </div>
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
                {activeAudits.map((row) => (
                  <tr key={row.id} className="border-b border-[#D1D5DB] text-sm text-[#1F2937] hover:bg-[#F9FAFB]">
                    <td className="py-4 px-6 font-semibold text-[#3B82F6] hover:underline cursor-pointer">{row.id}</td>
                    <td className="py-4 px-6">{row.department}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#E5E7EB] flex items-center justify-center font-bold text-xs">
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
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="p-4 border-t border-[#D1D5DB] flex items-center justify-between text-xs text-[#6B7280]">
              <span>Showing 5 of 24 active audits</span>
              <div className="flex gap-2">
                <button className="border border-[#D1D5DB] px-2.5 py-1 rounded bg-white hover:bg-slate-50 cursor-pointer">&lt;</button>
                <button className="border border-[#D1D5DB] px-2.5 py-1 rounded bg-white hover:bg-slate-50 cursor-pointer">&gt;</button>
              </div>
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
