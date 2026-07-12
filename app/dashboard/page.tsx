"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SidebarLayout from "../components/SidebarLayout";
import { insforge } from "../lib/insforge/client";

interface RecentActivityItem {
  id: string;
  logId: string;
  type: string;
  title: string;
  description: string;
  time: string;
  color: string;
  entity_name: string;
}

export default function DashboardPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    allocated: 0,
    maintenance: 0
  });
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // 1. Fetch Assets
        const { data: assetData } = await insforge.database.from("assets").select("status");
        if (assetData) {
          const total = assetData.length;
          const available = assetData.filter((a: any) => a.status === "available").length;
          const allocated = assetData.filter((a: any) => a.status === "allocated").length;
          const maintenance = assetData.filter((a: any) => a.status === "under_maintenance").length;
          setStats({ total, available, allocated, maintenance });
        }

        // 2. Fetch Activity Logs
        const { data: logsData } = await insforge.database
          .from("activity_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        if (logsData) {
          const mappedLogs = logsData.map((log: any) => {
            let color = "bg-[#3661ED]";
            if (log.activity_type.includes("maint")) color = "bg-[#E53E3E]";
            else if (log.activity_type.includes("audit")) color = "bg-[#4A5568]";

            const timeDiff = Date.now() - new Date(log.created_at).getTime();
            const minutes = Math.floor(timeDiff / 60000);
            let timeStr = "JUST NOW";
            if (minutes >= 1 && minutes < 60) timeStr = `${minutes} MINUTES AGO`;
            else if (minutes >= 60) {
              const hours = Math.floor(minutes / 60);
              if (hours < 24) timeStr = `${hours} HOURS AGO`;
              else timeStr = `${Math.floor(hours / 24)} DAYS AGO`;
            }

            return {
              id: log.entity_id,
              logId: log.id,
              type: log.activity_type,
              title: log.activity_type.replace(/_/g, " ").toUpperCase(),
              description: log.description,
              time: timeStr,
              color,
              entity_name: log.entity_name
            };
          });
          setActivities(mappedLogs);
        }

        // 3. Fetch Departments
        const { data: depts } = await insforge.database.from("departments").select("*");
        if (depts) {
          setDepartments(depts);
        }

        // 4. Fetch Upcoming Tasks (bookings and maintenance)
        const upcomingTasks: any[] = [];
        try {
          const { data: bookings } = await insforge.database
            .from("resource_bookings")
            .select("*, assets(name)")
            .eq("booking_status", "approved")
            .limit(3);

          if (bookings) {
            bookings.forEach((b: any) => {
              upcomingTasks.push({
                id: b.id,
                title: `${b.assets?.name || "Shared Asset"} Booking`,
                subtitle: `Purpose: ${b.purpose || "Resource Sync"}`,
                icon: "📅"
              });
            });
          }
        } catch (e) {}

        try {
          const { data: maintenance } = await insforge.database
            .from("maintenance_requests")
            .select("*, assets(name)")
            .neq("maintenance_status", "completed")
            .neq("maintenance_status", "cancelled")
            .limit(3);

          if (maintenance) {
            maintenance.forEach((m: any) => {
              upcomingTasks.push({
                id: m.id,
                title: `${m.assets?.name || "Asset"} Maintenance`,
                subtitle: `Issue: ${m.issue_description}`,
                icon: "⚙️"
              });
            });
          }
        } catch (e) {}

        setUpcoming(upcomingTasks.slice(0, 3));

      } catch (err) {
        console.error("Dashboard page loading failed", err);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, []);

  const handleOpenDrawer = async (act: RecentActivityItem) => {
    try {
      let assetId = act.id;
      if (act.entity_name === "asset_allocations") {
        const { data } = await insforge.database.from("asset_allocations").select("asset_id").eq("id", act.id).single();
        if (data) assetId = data.asset_id;
      } else if (act.entity_name === "maintenance_requests") {
        const { data } = await insforge.database.from("maintenance_requests").select("asset_id").eq("id", act.id).single();
        if (data) assetId = data.asset_id;
      } else if (act.entity_name === "resource_bookings") {
        const { data } = await insforge.database.from("resource_bookings").select("asset_id").eq("id", act.id).single();
        if (data) assetId = data.asset_id;
      }

      const { data: assetData } = await insforge.database.from("assets").select("*").eq("id", assetId).single();
      if (assetData) {
        const logs: any[] = [];
        try {
          const { data: maint } = await insforge.database.from("maintenance_requests").select("issue_description, created_at").eq("asset_id", assetId);
          if (maint) {
            maint.forEach((m: any) => {
              logs.push({ title: m.issue_description, date: new Date(m.created_at).toLocaleDateString() });
            });
          }
        } catch (e) {}

        setSelectedAsset({
          name: assetData.name,
          sku: `Tag: ${assetData.asset_tag}`,
          status: assetData.status.toUpperCase(),
          location: assetData.location || "Unknown Location",
          purchaseDate: new Date(assetData.acquisition_date).toLocaleDateString(),
          initialValue: `$${assetData.acquisition_cost.toLocaleString()}`,
          warrantyExp: "N/A",
          logs: logs.length > 0 ? logs : [{ title: "Asset Registered", date: new Date(assetData.created_at).toLocaleDateString() }]
        });
        setDrawerOpen(true);
      }
    } catch (err) {
      console.error("Failed to fetch asset details for drawer", err);
    }
  };

  const drawerContent = selectedAsset && (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6">
        {/* Asset Header Info */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[#4A5568] shrink-0 border border-[#E2E8F0]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="text-left">
            <h4 className="font-bold text-[#1A202C] text-lg leading-tight">{selectedAsset.name}</h4>
            <span className="text-xs text-[#A0AEC0] block mt-0.5">{selectedAsset.sku}</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#166534] mt-2 tracking-wider">
              {selectedAsset.status}
            </span>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="border-t border-[#E2E8F0] pt-5">
          <h5 className="text-[11px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-3 text-left">Properties</h5>
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-left">
            <div>
              <span className="text-[9px] text-[#A0AEC0] uppercase block font-semibold">Location</span>
              <span className="text-sm font-semibold text-[#2D3748] mt-0.5 block">{selectedAsset.location}</span>
            </div>
            <div>
              <span className="text-[9px] text-[#A0AEC0] uppercase block font-semibold">Purchase Date</span>
              <span className="text-sm font-semibold text-[#2D3748] mt-0.5 block">{selectedAsset.purchaseDate}</span>
            </div>
            <div>
              <span className="text-[9px] text-[#A0AEC0] uppercase block font-semibold">Initial Value</span>
              <span className="text-sm font-semibold text-[#2D3748] mt-0.5 block">{selectedAsset.initialValue}</span>
            </div>
            <div>
              <span className="text-[9px] text-[#A0AEC0] uppercase block font-semibold">Warranty Exp.</span>
              <span className="text-sm font-semibold text-[#2D3748] mt-0.5 block">{selectedAsset.warrantyExp}</span>
            </div>
          </div>
        </div>

        {/* Maintenance Logs */}
        <div className="border-t border-[#E2E8F0] pt-5">
          <h5 className="text-[11px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-3 text-left">Maintenance Logs</h5>
          <div className="space-y-4 text-left">
            {selectedAsset.logs.map((log: any, idx: number) => (
              <div key={idx} className="border-b border-[#F1F5F9] pb-3 last:border-b-0 last:pb-0">
                <span className="text-sm font-semibold text-[#2D3748] block">{log.title}</span>
                <span className="text-xs text-[#A0AEC0] block mt-0.5">{log.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky footer action buttons */}
      <div className="border-t border-[#E2E8F0] pt-4 mt-6 flex gap-3">
        <button className="flex-1 bg-[#3661ED] hover:bg-[#1D4ED8] text-white py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer">
          Save Changes
        </button>
        <button className="flex-1 border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer">
          Archive
        </button>
      </div>
    </div>
  );

  return (
    <SidebarLayout
      activePage="Dashboard"
      drawerOpen={drawerOpen}
      onDrawerClose={() => setDrawerOpen(false)}
      drawerContent={drawerContent}
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Welcome Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 text-left">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Executive Overview</h1>
            <p className="text-[#475569] text-sm pt-1">
              Real-time operational status for Q3 FY24
            </p>
          </div>

          {/* Quick actions row */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/assets?register=true"
              className="flex items-center gap-1.5 bg-[#3661ED] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Register Asset</span>
            </Link>
            <Link
              href="/bookings"
              className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] text-xs font-semibold px-4 py-2.5 rounded-lg transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Book Resource</span>
            </Link>
            <Link
              href="/maintenance?schedule=true"
              className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] text-xs font-semibold px-4 py-2.5 rounded-lg transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Schedule Maintenance</span>
            </Link>
            <Link
              href="/audits?start=true"
              className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] text-xs font-semibold px-4 py-2.5 rounded-lg transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Start Audit</span>
            </Link>
          </div>
        </div>

        {/* Row 1: KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-left">
          {/* Card 1: Total Assets */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider">Total Assets</span>
              <span className="text-3xl font-bold text-[#1A202C] block mt-2">{stats.total}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-[#16A34A] text-xs font-semibold">
              <span>Dynamic database count</span>
            </div>
          </div>

          {/* Card 2: Available Assets */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider">Available Assets</span>
              <span className="text-3xl font-bold text-[#1A202C] block mt-2">{stats.available}</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                <div className="bg-[#3661ED] h-2 rounded-full" style={{ width: `${Math.round((stats.allocated / (stats.total || 1)) * 100)}%` }}></div>
              </div>
              <span className="text-[10px] font-semibold text-[#475569] block mt-1.5">{Math.round((stats.allocated / (stats.total || 1)) * 100)}% Utilization capacity</span>
            </div>
          </div>

          {/* Card 3: Allocated Assets */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider">Allocated Assets</span>
              <span className="text-3xl font-bold text-[#1A202C] block mt-2">{stats.allocated}</span>
            </div>
            <Link href="/assets" className="flex items-center gap-1 mt-4 text-[#3661ED] text-xs font-semibold hover:underline cursor-pointer">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Assigned in {departments.length} departments</span>
            </Link>
          </div>

          {/* Card 4: Under Maintenance */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider">Under Maintenance</span>
              <span className="text-3xl font-bold text-[#E53E3E] block mt-2">{stats.maintenance}</span>
            </div>
            <Link href="/maintenance" className="flex items-center gap-1.5 mt-4 text-[#E53E3E] text-xs font-semibold hover:underline cursor-pointer">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>View maintenance requests</span>
            </Link>
          </div>
        </div>

        {/* Row 2: Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 text-left">
          {/* Asset Utilization Trend line chart card */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs lg:col-span-2 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-[#1A202C] text-base">Asset Utilization Trend</h3>
              </div>
              <div className="relative">
                <select className="appearance-none bg-white border border-[#E2E8F0] rounded-lg py-1.5 pl-3 pr-8 text-xs font-semibold text-[#475569] focus:outline-none">
                  <option>Last 30 Days</option>
                </select>
                <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-[#A0AEC0]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* SVG Visual Area Chart */}
            <div className="h-64 flex items-end w-full relative">
              <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3661ED" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#3661ED" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Shaded Area */}
                <path
                  d="M0,160 Q80,120 150,140 T300,80 T450,110 T600,60 L600,200 L0,200 Z"
                  fill="url(#chartGradient)"
                />
                {/* Line Path */}
                <path
                  d="M0,160 Q80,120 150,140 T300,80 T450,110 T600,60"
                  fill="none"
                  stroke="#3661ED"
                  strokeWidth="3"
                />
              </svg>
            </div>

            {/* Chart X-axis Labels */}
            <div className="flex justify-between text-[10px] font-semibold text-[#A0AEC0] uppercase tracking-wider pt-4 border-t border-[#F1F5F9]">
              <span>01 JUL</span>
              <span>07 JUL</span>
              <span>14 JUL</span>
              <span>21 JUL</span>
              <span>28 JUL</span>
              <span>31 JUL</span>
            </div>
          </div>

          {/* Department Distribution Donut Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <h3 className="font-bold text-[#1A202C] text-base mb-4">Department Distribution</h3>

            {/* Donut Chart Visual SVG */}
            <div className="flex items-center justify-center h-48 relative">
              <svg className="w-40 h-40" viewBox="0 0 36 36">
                {/* Gray Background circle */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F1F5F9" strokeWidth="3" />
                {/* Segment 1: Logistics (45%) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1E3A8A" strokeWidth="3" strokeDasharray="45 55" strokeDashoffset="25" />
                {/* Segment 2: Operations (30%) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3B82F6" strokeWidth="3" strokeDasharray="30 70" strokeDashoffset="80" />
                {/* Segment 3: Field (15%) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#475569" strokeWidth="3" strokeDasharray="15 85" strokeDashoffset="110" />
                {/* Segment 4: Other (10%) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#94A3B8" strokeWidth="3" strokeDasharray="10 90" strokeDashoffset="125" />
              </svg>
              {/* Inner Center text */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[#1A202C]">14</span>
                <span className="text-[9px] font-bold text-[#A0AEC0] uppercase tracking-wider">Units</span>
              </div>
            </div>

            {/* Legend list */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-4 border-t border-[#F1F5F9] font-medium text-[#475569]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A8A] block"></span>
                <span>Logistics (45%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] block"></span>
                <span>Operations (30%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#475569] block"></span>
                <span>Field (15%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8] block"></span>
                <span>Other (10%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Bottom Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {/* Monthly Maintenance bar chart card */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <h3 className="font-bold text-[#1A202C] text-base mb-4">Monthly Maintenance</h3>

            {/* Bar Chart Visual */}
            <div className="h-44 flex items-end justify-between px-2 mb-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 bg-[#EDF2F7] rounded-t-sm h-20"></div>
                <span className="text-[10px] font-bold text-[#A0AEC0]">MAR</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 bg-[#EDF2F7] rounded-t-sm h-32"></div>
                <span className="text-[10px] font-bold text-[#A0AEC0]">APR</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 bg-[#EDF2F7] rounded-t-sm h-24"></div>
                <span className="text-[10px] font-bold text-[#A0AEC0]">MAY</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 bg-[#EDF2F7] rounded-t-sm h-28"></div>
                <span className="text-[10px] font-bold text-[#A0AEC0]">JUN</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 bg-[#3661ED] rounded-t-sm h-36"></div>
                <span className="text-[10px] font-bold text-[#3661ED] font-semibold">JUL</span>
              </div>
            </div>
          </div>

          {/* Upcoming schedule card */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1A202C] text-base">Upcoming</h3>
              <span className="bg-[#3661ED] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {upcoming.length} Tasks
              </span>
            </div>

            {/* List items */}
            <div className="space-y-4 flex-1">
              {upcoming.length === 0 ? (
                <p className="text-xs text-[#A0AEC0] text-center py-4">No upcoming bookings or maintenance.</p>
              ) : (
                upcoming.map((task, idx) => (
                  <div key={task.id || idx} className="flex gap-3 items-start border-b border-[#F1F5F9] pb-3.5 last:border-0 last:pb-0">
                    <div className="p-2 bg-[#F1F5F9] rounded-lg text-[#475569]">
                      <span className="text-lg">{task.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#1A202C]">{task.title}</h4>
                      <p className="text-xs text-[#A0AEC0] mt-0.5">{task.subtitle}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent activity timeline card */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <h3 className="font-bold text-[#1A202C] text-base mb-4">Recent Activity</h3>

            {/* Timeline component */}
            <div className="space-y-4 flex-1">
              {activities.length === 0 ? (
                <p className="text-xs text-[#A0AEC0] text-center py-4">No recent activity logs.</p>
              ) : (
                activities.map((act) => (
                  <div
                    key={act.logId}
                    onClick={() => handleOpenDrawer(act)}
                    className="flex gap-3 items-start group cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg -mx-1.5 transition-colors"
                  >
                    {/* Indicator bullet */}
                    <span className={`w-2.5 h-2.5 rounded-full ${act.color} mt-1.5 shrink-0 block`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold text-[#1A202C] group-hover:text-[#3661ED] truncate">
                          {act.title}
                        </h4>
                        <span className="text-[8px] font-bold text-[#A0AEC0] uppercase tracking-wider shrink-0">
                          {act.time}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] truncate mt-0.5">{act.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
