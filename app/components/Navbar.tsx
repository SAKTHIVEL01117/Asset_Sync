"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { insforge } from "../lib/insforge/client";
import { handleSignOut } from "../actions";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: "admin" | "asset_manager" | "dept_head" | "employee";
  status: "active" | "inactive";
}

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkUser() {
      try {
        const { data, error } = await insforge.auth.getCurrentUser();
        if (error || !data?.user) {
          if (active) {
            setUser(null);
            setEmployee(null);
            setLoading(false);
          }
          return;
        }

        if (active) {
          setUser(data.user);
        }

        // Fetch employee details to check role
        const { data: empData, error: empError } = await insforge.database
          .from("employees")
          .select("*")
          .eq("user_id", data.user.id);

        if (active) {
          if (!empError && empData && empData.length > 0) {
            setEmployee(empData[0] as Employee);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching auth status", err);
        if (active) setLoading(false);
      }
    }

    void checkUser();

    return () => {
      active = false;
    };
  }, [pathname]);

  if (loading) {
    return (
      <header className="sticky top-0 z-50 bg-white border-b border-border-default h-16 w-full flex items-center px-6">
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary-light animate-pulse" />
            <div className="w-24 h-5 rounded bg-secondary-surface animate-pulse" />
          </div>
          <div className="flex gap-4">
            <div className="w-16 h-5 rounded bg-secondary-surface animate-pulse" />
            <div className="w-16 h-5 rounded bg-secondary-surface animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  // If user is not authenticated, do not render navigation
  if (!user) return null;

  // Role permissions checklist
  const isAdmin = employee?.role === "admin";
  const isAssetManager = employee?.role === "asset_manager" || isAdmin;
  const isDeptHead = employee?.role === "dept_head" || isAssetManager;

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", show: true },
    { name: "Organization", href: "/organization", show: isAdmin },
    { name: "Assets", href: "/assets", show: true },
    { name: "Resource Booking", href: "/bookings", show: true },
    { name: "Maintenance", href: "/maintenance", show: true },
    { name: "Audits", href: "/audits", show: isAssetManager },
    { name: "Reports", href: "/reports", show: isDeptHead },
    { name: "Settings", href: "/settings", show: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border-default h-16 w-full flex items-center px-6">
      <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center p-1.5 shadow-sm">
              <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="text-text-primary">Asset<span className="text-primary">Flow</span></span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks
              .filter((link) => link.show)
              .map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "bg-primary-light text-primary"
                        : "text-text-secondary hover:text-text-primary hover:bg-secondary-surface"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
          </nav>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {/* User Badge */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center text-sm shadow-sm">
              {(employee?.name || user.email || "U").substring(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-semibold text-text-primary leading-none">{employee?.name || user.email}</span>
              <span className="text-xs text-text-muted capitalize pt-0.5">{employee?.role || "Employee"}</span>
            </div>
          </div>

          {/* Sign Out */}
          <button
            onClick={async () => {
              await handleSignOut();
              window.location.href = "/login";
            }}
            className="p-2 rounded-lg text-text-secondary hover:text-danger hover:bg-danger-light/50 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
