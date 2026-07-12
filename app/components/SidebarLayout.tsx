"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { insforge } from "../lib/insforge/client";
import { handleSignOut } from "../actions";

interface SidebarLayoutProps {
  children: React.ReactNode;
  activePage: string;
  userRole?: string;
  userName?: string;
  drawerOpen?: boolean;
  onDrawerClose?: () => void;
  drawerContent?: React.ReactNode;
  searchPlaceholder?: string;
  onSearchChange?: (val: string) => void;
}

export default function SidebarLayout({
  children,
  activePage,
  userRole = "Fleet Manager",
  userName = "Alex Rivera",
  drawerOpen = false,
  onDrawerClose,
  drawerContent,
  searchPlaceholder = "Search assets, maintenance records...",
  onSearchChange,
}: SidebarLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data, error } = await insforge.auth.getCurrentUser();
        if (error || !data?.user) {
          router.push("/login");
          return;
        }
        setCurrentUser(data.user);

        // Fetch employee details to check role
        const { data: empData, error: empError } = await insforge.database
          .from("employees")
          .select("*")
          .eq("user_id", data.user.id);

        if (!empError && empData && empData.length > 0) {
          setEmployee(empData[0]);
        }
      } catch (err) {
        console.error("Auth check failed in SidebarLayout", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    void checkAuth();
  }, [router]);

  const navLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    ...(employee?.role === "admin" ? [{
      name: "Organization",
      href: "/organization",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    }] : []),
    {
      name: "Assets",
      href: "/assets",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
    },
    {
      name: "Resource Booking",
      href: "/bookings",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: "Maintenance",
      href: "/maintenance",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      name: "Audits",
      href: "/audits",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      name: "Reports & Analytics",
      href: "/reports",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2zm12 0v-3a2 2 0 00-2-2h-2a2 2 0 00-2 2v3a2 2 0 002 2h2a2 2 0 002-2zm0 0v-7a2 2 0 00-2-2h-2a2 2 0 00-2 2v7a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      ),
    },
    {
      name: "AI Assistant",
      href: "/ai-assistant",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-[#3661ED]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-row font-sans overflow-x-hidden">
      {/* Sidebar - fixed width left panel */}
      <aside className="w-64 bg-[#1A1D21] text-white flex flex-col shrink-0 min-h-screen border-r border-[#E2E8F0]/10">
        {/* Branding header */}
        <div className="p-6 border-b border-[#E2E8F0]/10 flex flex-col text-left">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#3661ED] rounded-lg flex items-center justify-center p-1.5 shadow">
              <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">AssetSync</span>
          </div>
          <span className="text-[10px] text-[#A0A0A0] tracking-wider uppercase font-semibold mt-1">
            Enterprise Resource Planning
          </span>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navLinks.map((link) => {
            const isActive = activePage.toLowerCase() === link.name.toLowerCase();
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#3661ED] text-white border-l-4 border-white pl-3"
                    : "text-[#A0AEC0] hover:text-white hover:bg-white/5"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom items: Settings & User Profile */}
        <div className="p-4 border-t border-[#E2E8F0]/10 space-y-4">
          <Link
            href="/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activePage.toLowerCase() === "settings"
                ? "bg-[#3661ED] text-white border-l-4 border-white pl-3"
                : "text-[#A0AEC0] hover:text-white hover:bg-white/5"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
            <span>Settings</span>
          </Link>

          {/* User profile widget */}
          <div className="bg-[#2A2E33] p-3 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-[#3661ED] rounded-full flex items-center justify-center font-bold text-white text-sm shadow shrink-0">
                {(employee?.name || userName).substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-sm font-semibold text-white truncate leading-none mb-0.5">
                  {employee?.name || userName}
                </span>
                <span className="text-[10px] text-[#A0AEC0] tracking-wider uppercase font-semibold">
                  {employee?.role?.replace("_", " ") || userRole}
                </span>
              </div>
            </div>
            
            {/* Sign Out Button in Sidebar */}
            <button
              onClick={async () => {
                await handleSignOut();
                window.location.href = "/login";
              }}
              className="p-1.5 rounded-lg text-[#A0AEC0] hover:text-[#EF4444] hover:bg-white/5 transition-colors cursor-pointer shrink-0"
              title="Sign Out"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main container area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Header / Navigation */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-8 flex items-center justify-between shrink-0">
          {/* Global Search Bar */}
          <div className="w-96 relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-[#A0AEC0]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full bg-[#EDF2F7] border border-[#E2E8F0] rounded-lg py-2 pl-10 pr-4 text-sm text-[#2D3748] placeholder-[#A0AEC0] focus:outline-none focus:border-[#3661ED] transition-colors"
            />
          </div>

          {/* User actions and notifications */}
          <div className="flex items-center gap-4">
            {/* Quick Actions (Bolt/Zap) */}
            <button className="p-2 rounded-lg text-[#6B7280] hover:text-[#3661ED] hover:bg-[#F1F5F9] transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>

            {/* Notification Bell */}
            <button className="p-2 rounded-lg text-[#6B7280] hover:text-[#3661ED] hover:bg-[#F1F5F9] transition-colors relative">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Notification red dot indicator */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E53E3E] rounded-full"></span>
            </button>

            {/* User Dropdown */}
            <div className="flex items-center gap-2 border-l border-[#E2E8F0] pl-4">
              <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#3661ED] font-bold flex items-center justify-center text-xs shadow-sm">
                {(employee?.name || currentUser?.email || "U").substring(0, 2).toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-[#475569] mr-2">{employee?.name || currentUser?.email || "Alex Rivera"}</span>
              
              {/* Sign Out Button in Header */}
              <button
                onClick={async () => {
                  await handleSignOut();
                  window.location.href = "/login";
                }}
                className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#DC2626] hover:bg-[#FEE2E2]/50 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </main>
      </div>

      {/* Slide-out drawer right panel */}
      {drawerOpen && (
        <>
          {/* Overlay backdrop */}
          <div
            onClick={onDrawerClose}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Drawer body */}
          <aside className="fixed inset-y-0 right-0 z-50 w-[450px] bg-white border-l border-[#E2E8F0] shadow-2xl flex flex-col animate-slide-in duration-300">
            {/* Drawer header */}
            <div className="h-16 border-b border-[#E2E8F0] px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1A202C] text-lg">Configuration Details</span>
              </div>
              <button
                onClick={onDrawerClose}
                className="p-1 rounded-md text-[#A0AEC0] hover:text-[#2D3748] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer content */}
            <div className="flex-1 overflow-y-auto p-6">
              {drawerContent}
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
