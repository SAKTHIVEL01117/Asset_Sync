"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { insforge } from "../lib/insforge/client";
import Navbar from "../components/Navbar";

interface KPI {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  color: "primary" | "success" | "warning" | "danger" | "info";
  icon: React.ReactNode;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data, error } = await insforge.auth.getCurrentUser();
        if (error || !data?.user) {
          router.push("/login");
          return;
        }
        setUser(data.user);
        setLoading(false);
      } catch (err) {
        console.error("Auth check failed", err);
        router.push("/login");
      }
    }
    void checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-page-background flex flex-col items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  const kpis: KPI[] = [
    {
      title: "Assets Available",
      value: 142,
      change: "+12% vs last month",
      isPositive: true,
      color: "success",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Assets Allocated",
      value: 389,
      change: "+5% vs last month",
      isPositive: true,
      color: "primary",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: "Maintenance Today",
      value: 4,
      change: "2 pending approval",
      isPositive: false,
      color: "danger",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: "Active Bookings",
      value: 18,
      change: "Next booking in 2h",
      isPositive: true,
      color: "info",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-page-background text-text-primary flex flex-col font-sans">
      <Navbar />

      <main className="max-w-[1440px] mx-auto w-full px-6 py-8 flex-1">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-text-secondary text-sm pt-1">
            Welcome back! Here is a summary of your organization's resources, bookings, and active maintenance workflows.
          </p>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi) => (
            <div key={kpi.title} className="bg-white border border-border-default rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-text-secondary">{kpi.title}</span>
                <div className={`p-2 rounded-lg ${
                  kpi.color === "primary" ? "bg-primary-light text-primary" :
                  kpi.color === "success" ? "bg-success-light text-success" :
                  kpi.color === "warning" ? "bg-warning-light text-warning" :
                  kpi.color === "danger" ? "bg-danger-light text-danger" :
                  "bg-info-light text-info"
                }`}>
                  {kpi.icon}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-text-primary">{kpi.value}</span>
                <span className={`text-xs font-semibold pt-1.5 ${kpi.isPositive ? "text-success" : "text-text-secondary"}`}>
                  {kpi.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions Panel */}
          <div className="bg-white border border-border-default rounded-xl p-6 shadow-sm flex flex-col">
            <h3 className="font-bold text-lg mb-4 text-text-primary">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center gap-3 p-3 rounded-lg border border-border-default hover:bg-page-background transition-colors cursor-pointer text-left">
                <div className="p-2 bg-primary-light text-primary rounded-lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Book Resource</h4>
                  <p className="text-xs text-text-secondary">Reserve a room, vehicle, or device.</p>
                </div>
              </button>

              <button className="flex items-center gap-3 p-3 rounded-lg border border-border-default hover:bg-page-background transition-colors cursor-pointer text-left">
                <div className="p-2 bg-danger-light text-danger rounded-lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Report Issue</h4>
                  <p className="text-xs text-text-secondary">Request repairs for a damaged asset.</p>
                </div>
              </button>

              <button className="flex items-center gap-3 p-3 rounded-lg border border-border-default hover:bg-page-background transition-colors cursor-pointer text-left">
                <div className="p-2 bg-success-light text-success rounded-lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Manage Inventory</h4>
                  <p className="text-xs text-text-secondary">View assets assigned to you.</p>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-border-default rounded-xl p-6 shadow-sm lg:col-span-2">
            <h3 className="font-bold text-lg mb-4 text-text-primary">Recent Activity Log</h3>
            <div className="space-y-4">
              <div className="flex gap-4 items-start p-3 rounded-lg hover:bg-page-background/30 transition-colors">
                <div className="w-2 h-2 rounded-full bg-success mt-2 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-text-primary">
                    <span className="font-semibold">New Asset Registered</span>: Macbook Pro 16" (Tag: <span className="font-mono text-xs">AST-4820</span>) was cataloged.
                  </p>
                  <span className="text-xs text-text-muted">10 minutes ago &bull; by Admin</span>
                </div>
              </div>

              <div className="flex gap-4 items-start p-3 rounded-lg hover:bg-page-background/30 transition-colors">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-text-primary">
                    <span className="font-semibold">Asset Allocated</span>: Dell Monitor 27" was assigned to <span className="font-semibold">Sarah Jenkins</span> (Marketing).
                  </p>
                  <span className="text-xs text-text-muted">1 hour ago &bull; by Asset Manager</span>
                </div>
              </div>

              <div className="flex gap-4 items-start p-3 rounded-lg hover:bg-page-background/30 transition-colors">
                <div className="w-2 h-2 rounded-full bg-info mt-2 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-text-primary">
                    <span className="font-semibold">Resource Booking Confirmed</span>: Conference Room B reserved by <span className="font-semibold">David K.</span> for 2:00 PM today.
                  </p>
                  <span className="text-xs text-text-muted">3 hours ago &bull; by System</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
