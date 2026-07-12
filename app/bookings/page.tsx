"use client";

import React, { useState, useEffect } from "react";
import SidebarLayout from "../components/SidebarLayout";
import { insforge } from "../lib/insforge/client";

interface DBResource {
  id: string;
  name: string;
  desc: string;
  capacity: string;
  icons: string[];
  status: "available" | "busy" | "unavailable";
  categoryName: string;
  location: string;
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
  const [dbResources, setDbResources] = useState<DBResource[]>([]);
  const [selectedResourceId, setSelectedResourceId] = useState("");
  const [reservationDate, setReservationDate] = useState(new Date().toISOString().substring(0, 10));
  const [reservationTime, setReservationTime] = useState("14:00");
  const [duration, setDuration] = useState("2h 30m");
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [calendarDays, setCalendarDays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Fetch current employee
      const { data: userData } = await insforge.auth.getCurrentUser();
      let empId = "";
      let empDeptId = "";
      if (userData?.user) {
        const { data: empData } = await insforge.database
          .from("employees")
          .select("*")
          .eq("user_id", userData.user.id);
        if (empData && empData.length > 0) {
          setEmployee(empData[0]);
          empId = empData[0].id;
          empDeptId = empData[0].department_id || "";
        }
      }

      // 2. Fetch shared assets
      const { data: assetData } = await insforge.database
        .from("assets")
        .select("*, categories(name)")
        .eq("is_shared", true);

      if (assetData) {
        const mappedResources = assetData.map((a: any) => {
          let icons = ["monitor"];
          const catName = a.categories?.name?.toLowerCase() || "";
          if (catName.includes("laptop")) icons = ["laptop"];
          else if (catName.includes("vehicle") || catName.includes("car")) icons = ["truck"];
          else if (catName.includes("room") || catName.includes("office") || catName.includes("desk")) icons = ["users"];
          
          let status: DBResource["status"] = "available";
          if (a.status === "allocated" || a.status === "reserved") status = "busy";
          else if (a.status === "under_maintenance" || a.status === "lost" || a.status === "retired" || a.status === "disposed") status = "unavailable";

          return {
            id: a.id,
            name: a.name,
            desc: a.location ? `${a.location} • ${a.categories?.name || "Shared"}` : a.categories?.name || "Shared",
            capacity: catName.includes("room") ? "12" : "",
            icons,
            status,
            categoryName: a.categories?.name || "Shared",
            location: a.location || ""
          };
        });
        setDbResources(mappedResources);
        if (mappedResources.length > 0) {
          setSelectedResourceId(mappedResources[0].id);
        }
      }

      // 3. Fetch resource bookings
      const { data: bookingsData } = await insforge.database
        .from("resource_bookings")
        .select("*, assets(name, location)")
        .order("booking_date", { ascending: true });

      if (bookingsData) {
        const mappedSchedule = bookingsData.map((b: any) => {
          const start = new Date(b.start_time);
          const end = new Date(b.end_time);
          const timeStr = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          const dateBadge = new Date(b.booking_date).toLocaleDateString([], { month: 'short', day: '2-digit' }).toUpperCase();
          return {
            id: b.id,
            title: `${b.assets?.name || "Shared Resource"} Booking`,
            time: timeStr,
            location: b.assets?.location || "Shared location",
            date: dateBadge
          };
        });
        setSchedule(mappedSchedule);

        // 4. Generate Calendar Days
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const totalDays = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();

        const days: any[] = [];
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
          days.push({ num: prevMonthLastDay - i, currentMonth: false });
        }
        for (let i = 1; i <= totalDays; i++) {
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
          const dayBookings = bookingsData.filter(b => b.booking_date === dateStr);
          days.push({
            num: i,
            currentMonth: true,
            booking: dayBookings.length > 0 ? `${dayBookings[0].assets?.name || "Booked"}` : undefined
          });
        }
        setCalendarDays(days);
      }
    } catch (err: any) {
      console.error("Booking page fetch failed", err);
      setError(err?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResourceId || !employee) {
      setError("Please select a resource and ensure you are logged in.");
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      
      const parsedDurationMinutes = duration.includes("h") 
        ? parseFloat(duration.split("h")[0]) * 60 + (duration.includes("m") ? parseFloat(duration.split("h")[1].replace("m", "").trim()) : 0)
        : parseFloat(duration.replace("m", "").trim());

      const startDateTime = new Date(`${reservationDate}T${reservationTime}`);
      const endDateTime = new Date(startDateTime.getTime() + parsedDurationMinutes * 60000);

      const payload = {
        asset_id: selectedResourceId,
        booked_by: employee.id,
        department_id: employee.department_id || "d0000000-0000-0000-0000-000000000001", // fallback to seed IT dept
        booking_date: reservationDate,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        purpose: "Resource Booking sync",
        booking_status: "pending" as const
      };

      const { error: insertError } = await insforge.database
        .from("resource_bookings")
        .insert([payload]);

      if (insertError) throw insertError;

      // Add activity log
      await insforge.database.from("activity_logs").insert([{
        user_id: employee.id,
        activity_type: "booking_create",
        entity_name: "resource_bookings",
        entity_id: selectedResourceId,
        description: `Booked resource starting at ${reservationTime}`
      }]);

      setSuccess("Resource booked successfully!");
      void fetchData();
    } catch (err: any) {
      console.error("Booking submission failed", err);
      setError(err?.message || "Failed to submit booking");
    }
  };

  const handleQuickBookSuggestion = () => {
    const suggestionResource = dbResources.find(
      r => r.name.toLowerCase().includes("boardroom b") || r.name.toLowerCase().includes("boardroom")
    ) || dbResources[0];

    if (suggestionResource) {
      setSelectedResourceId(suggestionResource.id);
    }

    const nextFriday = new Date();
    nextFriday.setDate(nextFriday.getDate() + ((7 - nextFriday.getDay() + 5) % 7 || 7));
    setReservationDate(nextFriday.toISOString().substring(0, 10));
    setReservationTime("10:00");
    setDuration("120m");
  };

  const handleBookingDelete = async (id: string) => {
    try {
      const { error: deleteError } = await insforge.database
        .from("resource_bookings")
        .delete()
        .eq("id", id);
      if (deleteError) throw deleteError;
      setSuccess("Booking deleted successfully!");
      void fetchData();
    } catch (err: any) {
      setError(err?.message || "Failed to delete booking");
    }
  };

  const filteredResources = dbResources.filter(res => {
    if (activeFilter === "all") return true;
    const catName = res.categoryName.toLowerCase();
    if (activeFilter === "rooms") {
      return catName.includes("room") || catName.includes("furniture") || res.location?.toLowerCase().includes("room");
    }
    if (activeFilter === "it") {
      return catName.includes("laptop") || catName.includes("projector") || catName.includes("computer");
    }
    return true;
  });

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

        {/* Alerts */}
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
              {filteredResources.length === 0 ? (
                <p className="text-xs text-[#718096] text-center py-4">No shared resources found.</p>
              ) : (
                filteredResources.map((res, idx) => (
                  <div
                    key={res.id || idx}
                    onClick={() => setSelectedResourceId(res.id)}
                    className={`p-4 border rounded-xl hover:shadow-xs transition-shadow flex items-start justify-between cursor-pointer text-left ${
                      selectedResourceId === res.id ? "border-[#2B6CB0] bg-slate-50" : "border-[#E2E8F0] bg-white"
                    }`}
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
                ))
              )}
            </div>
          </div>

          {/* Column 2: Calendar (Middle Section, cols-4) */}
          <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
            {/* Calendar header with navigation */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#2D3748] text-base">Active Calendar</h3>
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
                    <span className="text-[8px] bg-[#E0F2FE] border border-[#4299E1] text-[#2B6CB0] font-semibold py-0.5 px-1 rounded truncate leading-none mt-1" title={day.booking}>
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
              </div>

              {/* Form fields */}
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-[#718096] uppercase tracking-wider block mb-1">Select Resource</label>
                  <div className="relative">
                    <select
                      value={selectedResourceId}
                      onChange={(e) => setSelectedResourceId(e.target.value)}
                      className="w-full bg-white border border-[#EDF2F7] rounded-lg py-2 pl-3 pr-8 text-xs font-semibold text-[#2D3748] focus:outline-none"
                    >
                      {dbResources.map(res => (
                        <option key={res.id} value={res.id}>{res.name}</option>
                      ))}
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
                    type="date"
                    value={reservationDate}
                    onChange={(e) => setReservationDate(e.target.value)}
                    min={new Date().toISOString().substring(0, 10)}
                    className="w-full bg-white border border-[#EDF2F7] rounded-lg py-2 px-3 text-xs font-semibold text-[#2D3748] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#718096] uppercase tracking-wider block mb-1">Time</label>
                  <input
                    type="time"
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

                <button type="submit" className="w-full bg-[#2B6CB0] hover:bg-[#1D4ED8] text-white text-xs font-bold py-2.5 rounded-lg shadow-sm cursor-pointer transition-colors">
                  Confirm Booking
                </button>
              </form>
            </div>

            {/* Today's Schedule Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
              <h3 className="font-bold text-[#2D3748] text-base mb-4">Today's Schedule</h3>

              {/* Schedule list */}
              <div className="space-y-3">
                {schedule.length === 0 ? (
                  <p className="text-xs text-[#718096] text-center py-4">No reservations scheduled today.</p>
                ) : (
                  schedule.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 border border-[#E2E8F0] rounded-xl flex items-center justify-between bg-white"
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
                      <button onClick={() => handleBookingDelete(item.id)} className="text-[#718096] hover:text-[#EF4444] cursor-pointer">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
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
              <button
                onClick={handleQuickBookSuggestion}
                className="self-start bg-white text-[#2B6CB0] text-[10px] font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-white/95"
              >
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
