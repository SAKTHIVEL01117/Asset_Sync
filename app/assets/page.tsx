"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import SidebarLayout from "../components/SidebarLayout";
import { insforge } from "../lib/insforge/client";

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department_id?: string | null;
}

interface AssetFile {
  name: string;
  url: string;
  key: string;
}

interface Asset {
  id: string;
  asset_tag: string;
  name: string;
  category_id: string;
  serial_number: string;
  acquisition_date: string;
  acquisition_cost: number;
  condition: "new" | "good" | "fair" | "poor";
  location: string;
  current_holder_id: string | null;
  status: "available" | "allocated" | "reserved" | "under_maintenance" | "lost" | "retired" | "disposed";
  is_shared: boolean;
  documents: AssetFile[];
  photos: AssetFile[];
  created_at: string;
  department?: string;
}

export default function AssetsPage() {
  const router = useRouter();

  // Auth/Role State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [isManager, setIsManager] = useState(true); // Default true for UI preview
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Data State
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Filter & UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  
  // Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "warranty" | "history" | "attachments">("overview");

  // Alert States
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal State
  const [showRegModal, setShowRegModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Field States
  const [formName, setFormName] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formSerialNumber, setFormSerialNumber] = useState("");
  const [formAcquisitionDate, setFormAcquisitionDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [formAcquisitionCost, setFormAcquisitionCost] = useState("0");
  const [formCondition, setFormCondition] = useState<Asset["condition"]>("good");
  const [formLocation, setFormLocation] = useState("");
  const [formIsShared, setFormIsShared] = useState(false);
  const [formPhotos, setFormPhotos] = useState<AssetFile[]>([]);
  const [formDocuments, setFormDocuments] = useState<AssetFile[]>([]);

  // File Upload Uploading States
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Refs for file inputs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Fetch current user and check role
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data, error } = await insforge.auth.getCurrentUser();
        if (data?.user) {
          setCurrentUser(data.user);
          // Fetch current employee role
          const { data: empData, error: empError } = await insforge.database
            .from("employees")
            .select("*")
            .eq("user_id", data.user.id);

          if (!empError && empData && empData.length > 0) {
            const currentEmp = empData[0] as Employee;
            setCurrentEmployee(currentEmp);
            setIsManager(
              currentEmp.role === "admin" || currentEmp.role === "asset_manager"
            );
          }
        }
        setLoadingAuth(false);
      } catch (err) {
        console.error("Auth verification failed", err);
        setLoadingAuth(false);
      }
    }
    void checkAuth();
  }, [router]);

  // Open registration modal if ?register=true query param is present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("register") === "true") {
        setShowRegModal(true);
      }
    }
  }, []);

  // Fetch all categories, employees, and assets
  const fetchData = async () => {
    setLoadingData(true);
    try {
      // 1. Fetch Categories
      const { data: catData, error: catError } = await insforge.database
        .from("categories")
        .select("*")
        .order("name", { ascending: true });
      if (catError) throw catError;
      setCategories(catData || []);

      if (catData && catData.length > 0) {
        setFormCategoryId(catData[0].id);
      }

      // 2. Fetch Employees
      const { data: empData, error: empError } = await insforge.database
        .from("employees")
        .select("*")
        .order("name", { ascending: true });
      if (empError) throw empError;
      setEmployees(empData || []);

      // 3. Fetch Departments
      const { data: deptData, error: deptError } = await insforge.database
        .from("departments")
        .select("*")
        .order("name", { ascending: true });
      if (deptError) throw deptError;
      setDepartments(deptData || []);

      // 4. Fetch Assets
      const { data: assetData, error: assetError } = await insforge.database
        .from("assets")
        .select("*")
        .order("created_at", { ascending: false });
      if (assetError) throw assetError;
      setAssets(assetData || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load assets data.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!loadingAuth) {
      void fetchData();
    }
  }, [loadingAuth]);

  const displayedAssets = assets.map(a => {
    const category = categories.find(c => c.id === a.category_id);
    const holder = employees.find(e => e.id === a.current_holder_id);
    const dept = holder ? departments.find(d => d.id === holder.department_id) : null;
    return {
      ...a,
      department: dept?.name || a.location || "Operations",
      categoryName: category?.name || "Hardware"
    };
  });

  const filteredAssets = displayedAssets.filter(asset => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.asset_tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.serial_number && asset.serial_number.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || asset.categoryName.toLowerCase() === selectedCategory.toLowerCase();

    const matchesStatus =
      selectedStatus === "all" || asset.status === selectedStatus;

    const matchesDepartment =
      selectedDepartment === "all" || asset.department?.toLowerCase() === selectedDepartment.toLowerCase();

    return matchesSearch && matchesCategory && matchesStatus && matchesDepartment;
  });

  const handleRowClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setActiveTab("overview");
    setDrawerOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const { data, error } = await insforge.storage.from("assets").uploadAuto(file);
      if (error) throw error;
      if (data) {
        setFormPhotos(prev => [...prev, { name: file.name, url: data.url, key: data.key }]);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to upload photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(true);
    try {
      const { data, error } = await insforge.storage.from("assets").uploadAuto(file);
      if (error) throw error;
      if (data) {
        setFormDocuments(prev => [...prev, { name: file.name, url: data.url, key: data.key }]);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to upload document.");
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleRegisterAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCategoryId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        name: formName.trim(),
        category_id: formCategoryId,
        serial_number: formSerialNumber.trim() || null,
        acquisition_date: formAcquisitionDate,
        acquisition_cost: parseFloat(formAcquisitionCost) || 0.0,
        condition: formCondition,
        location: formLocation.trim() || null,
        current_holder_id: null,
        status: "available",
        is_shared: formIsShared,
        photos: formPhotos,
        documents: formDocuments,
      };

      const { error: insertError } = await insforge.database.from("assets").insert([payload]);
      if (insertError) throw insertError;
      setSuccess("Asset registered successfully!");
      setShowRegModal(false);
      void fetchData();
    } catch (err: any) {
      setError(err?.message || "Asset registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const drawerContent = selectedAsset && (
    <div className="flex flex-col h-full justify-between text-left">
      <div>
        {/* Close Button, Edit and Actions Row */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 mb-4">
          <button
            onClick={() => router.push(`/assets/${selectedAsset.id}`)}
            className="text-sm font-semibold text-[#3661ED] hover:underline cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => router.push(`/assets/${selectedAsset.id}`)}
            className="bg-[#3661ED] hover:bg-[#1D4ED8] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"
          >
            Actions
          </button>
        </div>

        {/* Thumbnail, Name, Location */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-16 h-16 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative">
            <svg className="w-8 h-8 text-[#A0AEC0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E0F2F7] text-[#2C5282] uppercase tracking-wider mb-1">
              {selectedAsset.status}
            </span>
            <span className="text-[11px] text-[#A0AEC0] font-mono block">{selectedAsset.asset_tag}</span>
            <h4 className="font-bold text-[#1A202C] text-base leading-tight mt-0.5">
              {selectedAsset.name}
            </h4>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-[#718096]">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{selectedAsset.location || "San Francisco HQ, Floor 4, Desk 204"}</span>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-[#E2E8F0] mb-5">
          {(["overview", "warranty", "history", "attachments"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 pb-2.5 text-xs font-semibold text-center border-b-2 capitalize transition-colors cursor-pointer ${
                activeTab === tab
                  ? "border-[#3661ED] text-[#3661ED]"
                  : "border-transparent text-[#718096] hover:text-[#2D3748]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Asset Info list */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-[#A0AEC0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-bold text-[#718096] uppercase tracking-wider">Asset Information</span>
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-xs">
                <div>
                  <span className="text-[9px] text-[#A0AEC0] uppercase font-semibold">Serial Number</span>
                  <span className="font-semibold text-[#1A202C] block mt-0.5">
                    {selectedAsset.serial_number || "C02Z88A9MD6T"}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[#A0AEC0] uppercase font-semibold">Purchase Date</span>
                  <span className="font-semibold text-[#1A202C] block mt-0.5">
                    {selectedAsset.acquisition_date || "Jan 12, 2024"}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[#A0AEC0] uppercase font-semibold">Purchase Cost</span>
                  <span className="font-semibold text-[#1A202C] block mt-0.5">
                    ${selectedAsset.acquisition_cost?.toLocaleString() || "3,499.00"} USD
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[#A0AEC0] uppercase font-semibold">Supplier</span>
                  <button className="font-semibold text-[#3661ED] hover:underline block mt-0.5 text-left cursor-pointer">
                    Apple Business
                  </button>
                </div>
              </div>
            </div>

            {/* QR Card */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex gap-4 items-center">
              <div className="w-16 h-16 bg-white border border-[#E2E8F0] rounded-lg shrink-0 flex items-center justify-center">
                <svg className="w-12 h-12 text-[#2D3748]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h6v6H3zm2 2v2h2V5zm8-2h6v6h-6zm2 2v2h2V5zM3 13h6v6H3zm2 2v2h2v-2zm13-2h2v2h-2zm-2 2h2v2h-2zm2 2h2v2h-2zm-4-4h2v2h-2zm2 2h2v2h-2zm-2 2h2v2h-2zm-3-4h2v2H9zm2 2h2v2h-2zm0 2h2v2h-2zm-4-4h2v2H5z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h5 className="font-bold text-[#1A202C] text-xs">Asset QR ID</h5>
                <p className="text-[10px] text-[#718096] mt-0.5 leading-normal">
                  Scan to quickly access maintenance records or initiate a transfer.
                </p>
                <div className="flex gap-2 mt-2">
                  <button className="border border-[#3661ED] text-[#3661ED] text-[9px] font-bold px-2 py-1 rounded hover:bg-[#3661ED]/5 cursor-pointer">
                    Print Label
                  </button>
                  <button className="border border-[#3661ED] text-[#3661ED] text-[9px] font-bold px-2 py-1 rounded hover:bg-[#3661ED]/5 cursor-pointer">
                    Download
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-[#A0AEC0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-bold text-[#718096] uppercase tracking-wider">Recent Activity</span>
              </div>
              <div className="space-y-4">
                <div className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-[#E2F7E2] text-[#166534] flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  <div>
                    <h6 className="text-xs font-bold text-[#1A202C]">Physical Audit Completed</h6>
                    <p className="text-[10px] text-[#718096] mt-0.5">Verified by Marcus Finch &bull; 2 days ago</p>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-[#E0F2F7] text-[#2C5282] flex items-center justify-center text-[10px] font-bold shrink-0">👤</span>
                  <div>
                    <h6 className="text-xs font-bold text-[#1A202C]">Assigned to Alex Rivera</h6>
                    <p className="text-[10px] text-[#718096] mt-0.5">Location set to SF HQ Floor 4 &bull; Jan 15, 2024</p>
                  </div>
                </div>
              </div>
              <button className="text-[11px] font-semibold text-[#3661ED] hover:underline mt-4 cursor-pointer">
                View Full Audit Log
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky footer action buttons */}
      <div className="border-t border-[#E2E8F0] pt-4 mt-6 flex justify-between gap-3">
        <button className="flex-1 border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#4A5568] text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Label
        </button>
        <button className="flex-1 border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#4A5568] text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Transfer
        </button>
        <button className="flex-1 border border-[#FEE2E2] hover:bg-[#FEF2F2] text-[#EF4444] text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Retire
        </button>
      </div>
    </div>
  );

  return (
    <SidebarLayout
      activePage="Assets"
      drawerOpen={drawerOpen}
      onDrawerClose={() => setDrawerOpen(false)}
      drawerContent={drawerContent}
      searchPlaceholder="Search assets, IDs, or locations..."
      onSearchChange={(val) => setSearchQuery(val)}
    >
      <div className="max-w-[1440px] mx-auto text-left">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Asset Management</h1>
            <p className="text-[#475569] text-sm pt-1">
              Monitor and manage company resources across 12 departments.
            </p>
          </div>
          {isManager && (
            <button
              onClick={() => setShowRegModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3661ED] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Register Asset
            </button>
          )}
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

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Card 1: Total Assets */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-[#E0F2FE] text-[#3661ED] rounded-xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider block">Total Assets</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-[#1A202C]">{assets.length}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Assigned Assets */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-[#E0F2FE] text-[#3661ED] rounded-xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider block">Assigned</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-[#1A202C]">
                  {assets.filter(a => a.status === 'allocated').length}
                </span>
                <span className="text-xs font-semibold text-[#718096]">
                  {Math.round((assets.filter(a => a.status === 'allocated').length / (assets.length || 1)) * 100)}% Occupied
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs mb-6 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#718096] uppercase">Department:</span>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#2D3748] focus:outline-none focus:border-[#3661ED]"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#718096] uppercase">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#2D3748] focus:outline-none focus:border-[#3661ED]"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#718096] uppercase">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#2D3748] focus:outline-none focus:border-[#3661ED]"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="allocated">Allocated</option>
              <option value="under_maintenance">Under Maintenance</option>
              <option value="retired">Retired</option>
            </select>
          </div>
        </div>

        {/* Table Registry */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs font-bold text-[#718096] uppercase tracking-wider">
                <th className="py-4 px-6 w-12">
                  <input type="checkbox" className="rounded border-[#E2E8F0] text-[#3661ED] focus:ring-[#3661ED]" />
                </th>
                <th className="py-4 px-4 w-12 text-center">QR</th>
                <th className="py-4 px-4 w-32">Asset ID</th>
                <th className="py-4 px-6">Asset Name</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Department</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => {
                const isActiveRow = selectedAsset?.id === asset.id && drawerOpen;
                return (
                  <tr
                    key={asset.id}
                    onClick={() => handleRowClick(asset)}
                    className={`border-b border-[#E2E8F0] text-sm text-[#4A5568] hover:bg-[#F8FAFC] cursor-pointer transition-colors ${
                      isActiveRow ? "bg-[#EDF2F7] border-l-4 border-l-[#3661ED]" : ""
                    }`}
                  >
                    <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={isActiveRow} onChange={() => {}} className="rounded border-[#E2E8F0] text-[#3661ED]" />
                    </td>
                    <td className="py-4 px-4 text-center text-[#A0AEC0]">
                      <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m-3.3 3.6l.7.7m6.2 0l-.7-.7M21 12h-1M4 12H3m3.3 4.3l.7-.7m6.2 0l-.7.7M12 21v-1m0-11a3 3 0 110 6 3 3 0 010-6z" />
                      </svg>
                    </td>
                    <td className="py-4 px-4 font-bold text-[#1A202C]">{asset.asset_tag}</td>
                    <td className="py-4 px-6 text-[#1A202C] font-medium">{asset.name}</td>
                    <td className="py-4 px-6">{asset.categoryName}</td>
                    <td className="py-4 px-6">{asset.department}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#718096]">
            <span>Showing 1-{filteredAssets.length} of {filteredAssets.length} assets</span>
          </div>
        </div>
      </div>

      {showRegModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[500px] border border-border-default overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
              <h3 className="font-bold text-lg text-[#0F172A]">Register New Asset</h3>
              <button onClick={() => setShowRegModal(false)} className="text-gray-500 hover:text-black cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleRegisterAsset} className="p-5 space-y-4 overflow-y-auto flex-1 text-left">
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-gray-700">Asset Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dell Latitude 5420"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3661ED] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-gray-700">Category *</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3661ED] text-sm bg-white"
                    required
                  >
                    <option value="">Select category...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-gray-700">Serial Number</label>
                  <input
                    type="text"
                    placeholder="e.g. SN-DELL-5544"
                    value={formSerialNumber}
                    onChange={(e) => setFormSerialNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3661ED] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-gray-700">Acquisition Date</label>
                  <input
                    type="date"
                    value={formAcquisitionDate}
                    onChange={(e) => setFormAcquisitionDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3661ED] text-sm"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-gray-700">Acquisition Cost (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formAcquisitionCost}
                    onChange={(e) => setFormAcquisitionCost(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3661ED] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-gray-700">Condition</label>
                  <select
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3661ED] text-sm bg-white"
                  >
                    <option value="new">New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-gray-700">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Building B, Room 302"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3661ED] text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="formIsShared"
                  checked={formIsShared}
                  onChange={(e) => setFormIsShared(e.target.checked)}
                  className="w-4 h-4 text-[#3661ED] focus:ring-[#3661ED] border-gray-300 rounded"
                />
                <label htmlFor="formIsShared" className="text-xs font-bold text-gray-700 cursor-pointer">
                  Share this resource (available for shared resource booking)
                </label>
              </div>

              <div className="border-t border-gray-200 pt-3 grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Photos</label>
                  <input
                    type="file"
                    ref={photoInputRef}
                    onChange={handlePhotoUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="w-full px-3 py-2 border border-[#3661ED] border-dashed text-[#3661ED] hover:bg-[#3661ED]/5 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    {uploadingPhoto ? "Uploading..." : "＋ Upload Photo"}
                  </button>
                  {formPhotos.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formPhotos.map((p, idx) => (
                        <div key={idx} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1 border border-slate-200">
                          <span className="truncate max-w-[80px]">{p.name}</span>
                          <button type="button" className="text-red-500 font-bold hover:text-red-700" onClick={() => setFormPhotos(prev => prev.filter((_, i) => i !== idx))}>&times;</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Documents</label>
                  <input
                    type="file"
                    ref={docInputRef}
                    onChange={handleDocUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => docInputRef.current?.click()}
                    disabled={uploadingDoc}
                    className="w-full px-3 py-2 border border-[#3661ED] border-dashed text-[#3661ED] hover:bg-[#3661ED]/5 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    {uploadingDoc ? "Uploading..." : "＋ Upload Document"}
                  </button>
                  {formDocuments.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formDocuments.map((d, idx) => (
                        <div key={idx} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1 border border-slate-200">
                          <span className="truncate max-w-[80px]">{d.name}</span>
                          <button type="button" className="text-red-500 font-bold hover:text-red-700" onClick={() => setFormDocuments(prev => prev.filter((_, i) => i !== idx))}>&times;</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRegModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#3661ED] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Registering..." : "Register Asset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
