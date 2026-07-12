"use client";

import React, { useState } from "react";
import SidebarLayout from "../components/SidebarLayout";

interface SettingsCard {
  id: string;
  title: string;
  desc: string;
  metric?: string;
  statusText?: string;
  statusColor?: string;
  iconBg: string;
  iconText: string;
  icon: string;
  badge?: string;
  toggle?: boolean;
}

export default function SettingsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const cards: SettingsCard[] = [
    {
      id: "org-profile",
      title: "Organization Profile",
      desc: "Update legal entity details, fiscal years, headquarters location, and brand identity assets for the entire enterprise workspace.",
      statusText: "Modified 2h ago by System",
      iconBg: "bg-[#E0ECFB]",
      iconText: "text-[#2D60E0]",
      icon: "🏢",
      badge: "Global",
      toggle: true,
    },
    {
      id: "departments",
      title: "Departments",
      desc: "Structure your organizational hierarchy, cost centers, and reporting lines.",
      metric: "14 Active Units",
      iconBg: "bg-[#E0ECFB]",
      iconText: "text-[#2D60E0]",
      icon: "📦",
    },
    {
      id: "users-roles",
      title: "Users & Roles",
      desc: "Manage identity, RBAC permissions, and team memberships across the platform.",
      metric: "824 Users",
      iconBg: "bg-[#E0ECFB]",
      iconText: "text-[#2D60E0]",
      icon: "👥",
    },
    {
      id: "categories",
      title: "Asset Categories",
      desc: "Define custom taxonomies, deprecation schedules, and attribute schemas.",
      metric: "32 Schemas",
      iconBg: "bg-[#E0ECFB]",
      iconText: "text-[#2D60E0]",
      icon: "🗂️",
    },
    {
      id: "maintenance",
      title: "Maintenance Rules",
      desc: "Set SLAs, preventative triggers, and automated ticketing workflows.",
      metric: "4 Active Automations",
      iconBg: "bg-[#F8D7DA]",
      iconText: "text-[#DC3545]",
      icon: "📋",
    },
    {
      id: "security",
      title: "Security & Privacy",
      desc: "Manage SSO/SAML integration, API keys, session timeouts, and GDPR compliance logging.",
      statusText: "All protocols active",
      statusColor: "bg-[#28A745]",
      iconBg: "bg-[#007BFF]/10",
      iconText: "text-[#007BFF]",
      icon: "🔒",
    },
    {
      id: "appearance",
      title: "Appearance",
      desc: "Configure custom themes, dark mode behavior, and white-label branding options.",
      statusText: "Light Theme Active",
      iconBg: "bg-[#E0ECFB]",
      iconText: "text-[#2D60E0]",
      icon: "🎨",
    },
  ];

  const handleCardClick = (id: string) => {
    setActiveCard(id);
    setDrawerOpen(true);
  };

  const drawerContent = (
    <div className="flex flex-col h-full justify-between text-left space-y-6">
      <div className="space-y-4">
        {/* Quick Action */}
        <div>
          <h4 className="font-bold text-sm text-[#333333]">Quick Action</h4>
          <p className="text-xs text-[#6B7280] mt-0.5">Configure active setting</p>
        </div>

        {/* Data residency */}
        <div>
          <label className="text-xs font-bold text-[#333333] block mb-1">Data Residency</label>
          <div className="relative">
            <select className="w-full bg-white border border-[#E0E0E0] rounded-lg py-2 pl-3 pr-8 text-xs text-[#333333] focus:outline-none">
              <option>North America (East)</option>
              <option>Europe (West)</option>
              <option>Asia Pacific (South)</option>
            </select>
            <span className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-[#6B7280]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>

        {/* Branding Assets */}
        <div>
          <h4 className="font-bold text-xs text-[#333333] mb-2">Branding Assets</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-dashed border-[#E0E0E0] rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 flex flex-col items-center justify-center">
              <svg className="w-5 h-5 text-[#6B7280] mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-[10px] font-semibold text-[#333333]">Primary Logo</span>
            </div>
            <div className="border border-dashed border-[#E0E0E0] rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 flex flex-col items-center justify-center">
              <svg className="w-5 h-5 text-[#6B7280] mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-[10px] font-semibold text-[#333333]">Favicon</span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-[#E0ECFB] border border-[#2D60E0]/20 rounded-xl p-4 flex gap-3 items-start">
          <span className="text-xl text-[#2D60E0] shrink-0">ℹ️</span>
          <p className="text-[10px] text-[#333333] leading-normal font-medium">
            Changing these settings will notify all system administrators via the unified audit trail.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center gap-3 border-t border-[#E0E0E0] pt-4 mt-6">
        <button
          onClick={() => setDrawerOpen(false)}
          className="flex-1 bg-white hover:bg-slate-50 text-[#333333] text-xs font-bold py-2.5 rounded-lg border border-[#E0E0E0] cursor-pointer"
        >
          Cancel
        </button>
        <button className="flex-1 bg-[#2D60E0] hover:bg-[#1D4ED8] text-white text-xs font-bold py-2.5 rounded-lg cursor-pointer">
          Save Changes
        </button>
      </div>
    </div>
  );

  return (
    <SidebarLayout
      activePage="Settings"
      drawerOpen={drawerOpen}
      onDrawerClose={() => setDrawerOpen(false)}
      drawerContent={drawerContent}
      userName="Marcus Sterling"
      userRole="Admin Access"
      searchPlaceholder="Search system settings..."
    >
      <div className="max-w-[1440px] mx-auto text-left relative pb-16">
        {/* Header and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#333333]">Enterprise Settings</h1>
            <p className="text-[#6B7280] text-sm pt-1">
              Manage global configurations, compliance rules, and workspace security.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 bg-white border border-[#E0E0E0] hover:bg-slate-50 text-xs font-semibold py-2 px-3 rounded-lg text-[#2D60E0] cursor-pointer">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export Config</span>
            </button>
            <button className="flex items-center gap-1.5 bg-[#2D60E0] hover:bg-[#1D4ED8] text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-sm cursor-pointer">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span>Save All Changes</span>
            </button>
          </div>
        </div>

        {/* Settings Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className="bg-white border border-[#E0E0E0] rounded-xl p-5 shadow-xs hover:shadow-sm transition-shadow cursor-pointer flex flex-col justify-between relative group"
            >
              {/* Card top details */}
              <div>
                <div className="flex justify-between items-start mb-4">
                  {/* Category icon */}
                  <span className={`w-10 h-10 rounded-full ${card.iconBg} ${card.iconText} flex items-center justify-center text-lg`}>
                    {card.icon}
                  </span>
                  
                  {/* Global badge */}
                  {card.badge && (
                    <span className="bg-[#E0ECFB] text-[#2D60E0] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      {card.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-[#333333] group-hover:text-[#2D60E0] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-[#6B7280] leading-relaxed mt-1">
                  {card.desc}
                </p>
              </div>

              {/* Card bottom details */}
              <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-3 mt-4 text-xs font-semibold text-[#6B7280]">
                {card.metric && (
                  <span className="text-[#333333]">{card.metric}</span>
                )}
                {card.statusText && (
                  <div className="flex items-center gap-1.5">
                    {card.statusColor && (
                      <span className={`w-2 h-2 rounded-full ${card.statusColor} block`}></span>
                    )}
                    <span>{card.statusText}</span>
                  </div>
                )}
                
                {/* Arrow indicator */}
                <span className="text-base text-[#6B7280]/60 group-hover:translate-x-1 transition-transform">
                  &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#E0E0E0] pt-6 text-xs text-[#6B7280] gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#28A745] block"></span>
              <span className="font-bold">System Status: Optimal</span>
            </div>
            <span>&bull;</span>
            <span>Last backup: 14 mins ago</span>
          </div>
          <span className="font-semibold text-right">Version 4.12.0-Enterprise</span>
        </div>
      </div>
    </SidebarLayout>
  );
}
