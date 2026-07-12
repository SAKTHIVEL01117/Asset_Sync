"use client";

import React, { useState } from "react";
import SidebarLayout from "../components/SidebarLayout";

interface Resource {
  name: string;
  desc: string;
  capacity: string;
  icons: string[];
  status: "available" | "busy" | "unavailable";
}

interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  location: string;
  date: string;
  selected?: boolean;
}

export default function ResourceBookingPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "rooms" | "it">("all");
  const [selectedResource, setSelectedResource] = useState("Boardroom A");
  const [reservationDate, setReservationDate] = useState("10/05/2023");
  const [reservationTime, setReservationTime] = useState("02:00 PM");
  const [duration, setDuration] = useState("2h 30m");

  const resources: Resource[] = [
    {
      name: "Boardroom A",
      desc: "12 Person Capacity • AV System",
      capacity: "12",
      icons: ["users", "monitor", "camera", "wifi"],
      status: "available",
    },
    {
      name: "Projector X200",
      desc: "4K UHD • Wireless Dongle",
      capacity: "",
      icons: ["monitor"],
      status: "busy",
    },
    {
      name: "Dell XPS 15 #04",
      desc: "i9 • 32GB RAM • Creative",
      capacity: "",
      icons: ["laptop"],
      status: "available",
    },
    {
      name: "Company Van B",
      desc: "In Transit • Returns 4PM",
      capacity: "",
      icons: ["truck"],
      status: "unavailable",
    },
    {
      name: "Focus Pod 02",
      desc: "Soundproof • Standing Desk",
      capacity: "1",
      icons: ["mic", "desk"],
      status: "available",
    },
  ];

  const schedule: ScheduleItem[] = [
    {
      id: "1",
      title: "Marketing Team Sync",
      time: "09:00 - 10:30",
      location: "Boardroom B",
      date: "OCT 05",
    },
    {
      id: "2",
      title: "Hardware Testing",
      time: "13:00 - 17:00",
      location: "Lab Room 4",
      date: "OCT 05",
    },
    {
      id: "3",
      title: "Client Presentation",
      time: "15:00 - 16:00",
      location: "Boardroom A",
      date: "OCT 05",
      selected: true,
    },
  ];

  // Calendar dates mock
  const calendarDays = [
    { num: 25, currentMonth: false },
    { num: 26, currentMonth: false },
    { num: 27, currentMonth: false },
    { num: 28, currentMonth: false },
    { num: 29, currentMonth: false },
    { num: 30, currentMonth: false },
    { num: 1, currentMonth: true },
    { num: 2, currentMonth: true },
    { num: 3, currentMonth: true, booking: "Boardroom A - 9AM" },
    { num: 4, currentMonth: true, booking: "Lap..." },
    { num: 5, currentMonth: true },
    { num: 6, currentMonth: true },
    { num: 7, currentMonth: true },
    { num: 8, currentMonth: true },
    { num: 9, currentMonth: true },
    { num: 10, currentMonth: true },
    { num: 11, currentMonth: true },
    { num: 12, currentMonth: true },
    { num: 13, currentMonth: true },
    { num: 14, currentMonth: true },
    { num: 15, currentMonth: true },
    { num: 16, currentMonth: true },
    { num: 17, currentMonth: true },
    { num: 18, currentMonth: true },
    { num: 19, currentMonth: true },
    { num: 20, currentMonth: true },
    { num: 21, currentMonth: true },
    { num: 22, currentMonth: true },
    { num: 23, currentMonth: true },
    { num: 24, currentMonth: true },
    { num: 25, currentMonth: true },
    { num: 26, currentMonth: true },
    { num: 27, currentMonth: true },
    { num: 28, currentMonth: true },
    { num: 29, currentMonth: true },
    { num: 30, currentMonth: true },
    { num: 31, currentMonth: true },
  ];

  return (
    <SidebarLayout activePage="Resource Booking" searchPlaceholder="Search resources, bookings, or assets...">
      <div className="max-w-[1440px] mx-auto text-left">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#0f172a]">Resource Booking</h1>
          <p className="text-[#475569] text-sm pt-1">
            Reserve and schedule shared resources across facilities.
          </p>
        </div>

        {/* Three-Column Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column 1: Resources list (Left Section, cols-4) */}
          <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
            <h3 className="font-bold text-[#2D3748] text-base mb-4">Resources</h3>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  activeFilter === "all" ? "bg-[#2B6CB0] text-white" : "bg-[#EDF2F7] text-[#2D3748]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("rooms")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  activeFilter === "rooms" ? "bg-[#2B6CB0] text-white" : "bg-[#EDF2F7] text-[#2D3748]"
                }`}
              >
                Rooms
              </button>
              <button
                onClick={() => setActiveFilter("it")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  activeFilter === "it" ? "bg-[#2B6CB0] text-white" : "bg-[#EDF2F7] text-[#2D3748]"
                }`}
              >
                IT
              </button>
            </div>

            {/* Vertical list of resources */}
            <div className="space-y-3">
              {resources.map((res, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-[#E2E8F0] rounded-xl hover:shadow-xs transition-shadow flex items-start justify-between bg-white text-left"
                >
                  <div>
                    <h4 className="font-bold text-sm text-[#2D3748]">{res.name}</h4>
                    <p className="text-[11px] text-[#718096] mt-0.5">{res.desc}</p>
                    {/* SVG Icons bar */}
                    <div className="flex gap-1.5 mt-2.5 text-[#718096]">
                      {res.icons.includes("users") && (
                        <span title="Capacity" className="p-1 bg-[#F8FAFC] rounded border border-[#E2E8F0]">👥</span>
                      )}
                      {res.icons.includes("monitor") && (
                        <span title="AV System" className="p-1 bg-[#F8FAFC] rounded border border-[#E2E8F0]">🖥️</span>
                      )}
                      {res.icons.includes("camera") && (
                        <span title="Video Conferencing" className="p-1 bg-[#F8FAFC] rounded border border-[#E2E8F0]">📷</span>
                      )}
                      {res.icons.includes("wifi") && (
                        <span title="Wifi" className="p-1 bg-[#F8FAFC] rounded border border-[#E2E8F0]">📶</span>
                      )}
                      {res.icons.includes("laptop") && (
                        <span title="Workstation" className="p-1 bg-[#F8FAFC] rounded border border-[#E2E8F0]">💻</span>
                      )}
                      {res.icons.includes("truck") && (
                        <span title="Vehicle" className="p-1 bg-[#F8FAFC] rounded border border-[#E2E8F0]">🚐</span>
                      )}
                    </div>
                  </div>
                  {/* Status dot */}
                  <span className={`w-3.5 h-3.5 rounded-full mt-1 shrink-0 ${
                    res.status === "available" ? "bg-[#48BB78]" :
                    res.status === "busy" ? "bg-[#F6AD55]" : "bg-[#F56565]"
                  }`} />
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Calendar (Middle Section, cols-4) */}
          <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
            {/* Calendar header with navigation */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#2D3748] text-base">October 2023</h3>
              <div className="flex items-center gap-2">
                <button className="p-1 text-[#2D3748] hover:bg-[#EDF2F7] rounded cursor-pointer">&lt;</button>
                <button className="p-1 text-[#2D3748] hover:bg-[#EDF2F7] rounded cursor-pointer">&gt;</button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <span className="font-semibold text-[#718096] pb-2">Mon</span>
              <span className="font-semibold text-[#718096] pb-2">Tue</span>
              <span className="font-semibold text-[#718096] pb-2">Wed</span>
              <span className="font-semibold text-[#718096] pb-2">Thu</span>

              {calendarDays.map((day, idx) => (
                <div
                  key={idx}
                  className={`h-16 border border-[#EDF2F7] rounded-lg p-1.5 flex flex-col justify-between items-stretch ${
                    day.currentMonth ? "bg-white text-[#2D3748]" : "bg-[#EDF2F7]/40 text-[#A0AEC0]"
                  }`}
                >
                  <span className="text-[10px] font-bold text-left">{day.num}</span>
                  {day.booking && (
                    <span className="text-[8px] bg-[#E0F2FE] border border-[#4299E1] text-[#2B6CB0] font-semibold py-0.5 px-1 rounded truncate leading-none mt-1">
                      {day.booking}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Reservation and Schedule details (Right Section, cols-4) */}
          <div className="lg:col-span-4 space-y-6">
            {/* New Reservation Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#2D3748] text-base">New Reservation</h3>
                <button className="text-[#2D3748] hover:text-[#2B6CB0] cursor-pointer">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>

              {/* Form fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-[#718096] uppercase tracking-wider block mb-1">Select Resource</label>
                  <div className="relative">
                    <select
                      value={selectedResource}
                      onChange={(e) => setSelectedResource(e.target.value)}
                      className="w-full bg-white border border-[#EDF2F7] rounded-lg py-2 pl-3 pr-8 text-xs font-semibold text-[#2D3748] focus:outline-none"
                    >
                      <option>Boardroom A</option>
                      <option>Projector X200</option>
                      <option>Dell XPS 15 #04</option>
                      <option>Focus Pod 02</option>
                    </select>
                    <span className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-[#718096]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#718096] uppercase tracking-wider block mb-1">Date</label>
                  <input
                    type="text"
                    value={reservationDate}
                    onChange={(e) => setReservationDate(e.target.value)}
                    className="w-full bg-white border border-[#EDF2F7] rounded-lg py-2 px-3 text-xs font-semibold text-[#2D3748] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#718096] uppercase tracking-wider block mb-1">Time</label>
                  <input
                    type="text"
                    value={reservationTime}
                    onChange={(e) => setReservationTime(e.target.value)}
                    className="w-full bg-white border border-[#EDF2F7] rounded-lg py-2 px-3 text-xs font-semibold text-[#2D3748] focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#718096] uppercase tracking-wider mb-1">
                    <span>Duration</span>
                    <span className="text-[#2D3748]">{duration}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    defaultValue="3"
                    className="w-full h-1 bg-[#EDF2F7] rounded-lg appearance-none cursor-pointer accent-[#2B6CB0]"
                    onChange={(e) => setDuration(`${parseInt(e.target.value) * 30 + 90}m`)}
                  />
                </div>

                <button className="w-full bg-[#2B6CB0] hover:bg-[#1D4ED8] text-white text-xs font-bold py-2.5 rounded-lg shadow-sm cursor-pointer transition-colors">
                  Confirm Booking
                </button>
              </div>
            </div>

            {/* Today's Schedule Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
              <h3 className="font-bold text-[#2D3748] text-base mb-4">Today's Schedule</h3>

              {/* Schedule list */}
              <div className="space-y-3">
                {schedule.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 border border-[#E2E8F0] rounded-xl flex items-center justify-between ${
                      item.selected ? "border-[#4299E1] bg-slate-50" : "bg-white"
                    }`}
                  >
                    <div className="flex gap-3 items-center">
                      {/* Date Badge */}
                      <span className="bg-[#4299E1] text-white text-[9px] font-bold px-2 py-1 rounded">
                        {item.date}
                      </span>
                      <div className="text-left">
                        <h4 className="font-bold text-xs text-[#2D3748]">{item.title}</h4>
                        <p className="text-[10px] text-[#718096] mt-0.5">{item.time} &bull; {item.location}</p>
                      </div>
                    </div>
                    {/* Delete action button */}
                    <button className="text-[#718096] hover:text-[#EF4444] cursor-pointer">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Suggestions Card */}
            <div className="bg-[#2B6CB0] rounded-xl p-5 text-white flex flex-col justify-between relative overflow-hidden">
              <div>
                <h4 className="font-bold text-sm mb-1.5">Smart Suggestions</h4>
                <p className="text-xs text-white/80 leading-normal mb-4">
                  Based on your history, you usually need Boardroom B on Fridays at 10 AM.
                </p>
              </div>
              <button className="self-start bg-white text-[#2B6CB0] text-[10px] font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-white/95">
                Book Now
              </button>

              {/* Decorative icon background */}
              <span className="absolute -bottom-6 -right-6 text-white/10 text-7xl select-none font-bold">
                📅
              </span>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
