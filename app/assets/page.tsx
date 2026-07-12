"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { insforge } from "../lib/insforge/client";
import Navbar from "../components/Navbar";

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
}

export default function AssetsPage() {
  const router = useRouter();

  // Auth/Role State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [isManager, setIsManager] = useState(false); // Admin or Asset Manager
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Data State
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Filter & UI State
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  
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
        if (error || !data?.user) {
          router.push("/login");
          return;
        }
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
        setLoadingAuth(false);
      } catch (err) {
        console.error("Auth verification failed", err);
        router.push("/login");
      }
    }
    void checkAuth();
  }, [router]);

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

      // Set default category in form if categories exist
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

      // 3. Fetch Assets
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

  // Handle Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setError(null);

    try {
      const { data, error: uploadError } = await insforge.storage
        .from("assets")
        .uploadAuto(file);

      if (uploadError) throw uploadError;

      if (data) {
        setFormPhotos((prev) => [
          ...prev,
          { name: file.name, url: data.url, key: data.key },
        ]);
        setSuccess("Photo uploaded successfully!");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to upload photo.");
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  // Handle Document Upload
  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    setError(null);

    try {
      const { data, error: uploadError } = await insforge.storage
        .from("assets")
        .uploadAuto(file);

      if (uploadError) throw uploadError;

      if (data) {
        setFormDocuments((prev) => [
          ...prev,
          { name: file.name, url: data.url, key: data.key },
        ]);
        setSuccess("Document uploaded successfully!");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to upload document.");
    } finally {
      setUploadingDoc(false);
      if (docInputRef.current) docInputRef.current.value = "";
    }
  };

  // Remove uploaded photo
  const handleRemovePhoto = async (index: number, fileKey: string) => {
    try {
      await insforge.storage.from("assets").remove(fileKey);
      setFormPhotos((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Failed to delete photo from storage", err);
      // Just filter from state anyway to not block user
      setFormPhotos((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Remove uploaded document
  const handleRemoveDoc = async (index: number, fileKey: string) => {
    try {
      await insforge.storage.from("assets").remove(fileKey);
      setFormDocuments((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Failed to delete document from storage", err);
      setFormDocuments((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Handle Asset Registration Submit
  const handleRegisterAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isManager) return;

    if (!formName.trim()) {
      setError("Asset name is required.");
      return;
    }

    if (!formCategoryId) {
      setError("Asset category is required.");
      return;
    }

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
        current_holder_id: null, // Always available and unassigned initially
        status: "available", // Default
        is_shared: formIsShared,
        photos: formPhotos,
        documents: formDocuments,
      };

      // Insert as an array in InsForge
      const { data, error: insertError } = await insforge.database
        .from("assets")
        .insert([payload])
        .select();

      if (insertError) throw insertError;

      setSuccess("Asset registered successfully!");
      
      // Reset form states
      setFormName("");
      setFormSerialNumber("");
      setFormAcquisitionDate(new Date().toISOString().substring(0, 10));
      setFormAcquisitionCost("0");
      setFormCondition("good");
      setFormLocation("");
      setFormIsShared(false);
      setFormPhotos([]);
      setFormDocuments([]);
      
      setShowRegModal(false);
      void fetchData();
    } catch (err: any) {
      setError(err?.message || "Asset registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered Assets list
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.asset_tag &&
        asset.asset_tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (asset.serial_number &&
        asset.serial_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (asset.location &&
        asset.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || asset.category_id === selectedCategory;

    const matchesStatus =
      selectedStatus === "all" || asset.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // KPI card calculations
  const totalAssets = assets.length;
  const availableAssets = assets.filter((a) => a.status === "available").length;
  const allocatedAssets = assets.filter((a) => a.status === "allocated").length;
  const maintenanceAssets = assets.filter(
    (a) => a.status === "under_maintenance"
  ).length;

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-page-background flex flex-col items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-background text-text-primary flex flex-col font-sans">
      <Navbar />

      <main className="max-w-[1440px] mx-auto w-full px-6 py-8 flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Asset Directory</h1>
            <p className="text-text-secondary text-sm pt-1">
              Catalog, register, and track organization physical assets and shared resources.
            </p>
          </div>
          {isManager && (
            <button
              onClick={() => {
                setError(null);
                setSuccess(null);
                setShowRegModal(true);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Register Asset
            </button>
          )}
        </div>

        {/* Global Notifications */}
        {error && (
          <div className="mb-6 p-4 bg-danger-light border border-danger/20 text-danger rounded-xl flex items-center justify-between">
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => setError(null)} className="text-danger hover:text-danger-foreground font-bold text-lg">&times;</button>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-success-light border border-success/20 text-success rounded-xl flex items-center justify-between">
            <span className="text-sm font-medium">{success}</span>
            <button onClick={() => setSuccess(null)} className="text-success hover:text-success-foreground font-bold text-lg">&times;</button>
          </div>
        )}

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-border-default rounded-xl p-5 shadow-sm">
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Total Assets</div>
            <div className="text-2xl font-bold mt-1 text-text-primary">{totalAssets}</div>
          </div>
          <div className="bg-white border border-border-default rounded-xl p-5 shadow-sm">
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Available</div>
            <div className="text-2xl font-bold mt-1 text-success">{availableAssets}</div>
          </div>
          <div className="bg-white border border-border-default rounded-xl p-5 shadow-sm">
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Allocated</div>
            <div className="text-2xl font-bold mt-1 text-primary">{allocatedAssets}</div>
          </div>
          <div className="bg-white border border-border-default rounded-xl p-5 shadow-sm">
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Maintenance</div>
            <div className="text-2xl font-bold mt-1 text-warning">{maintenanceAssets}</div>
          </div>
        </div>

        {/* Toolbar (Search, Filter, View Toggles) */}
        <div className="bg-white border border-border-default rounded-xl p-4 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <svg className="w-5 h-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, tag, location..."
                className="w-full pl-10 pr-4 py-2 border border-border-default rounded-lg text-sm bg-page-background focus:outline-none focus:border-primary transition-colors text-text-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 border border-border-default rounded-lg text-sm bg-page-background focus:outline-none focus:border-primary transition-colors text-text-primary font-medium"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-auto">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 border border-border-default rounded-lg text-sm bg-page-background focus:outline-none focus:border-primary transition-colors text-text-primary font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="allocated">Allocated</option>
                <option value="reserved">Reserved</option>
                <option value="under_maintenance">Under Maintenance</option>
                <option value="lost">Lost</option>
                <option value="retired">Retired</option>
                <option value="disposed">Disposed</option>
              </select>
            </div>
          </div>

          {/* View Toggles */}
          <div className="flex items-center border border-border-default rounded-lg p-0.5 shrink-0 w-fit self-end md:self-auto bg-page-background">
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "kanban" ? "bg-white text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"}`}
              title="Kanban View"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "list" ? "bg-white text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"}`}
              title="List View"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Loading Spinner for data */}
        {loadingData ? (
          <div className="flex items-center justify-center py-20 bg-white border border-border-default rounded-xl shadow-sm">
            <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : filteredAssets.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-border-default rounded-xl p-16 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-text-primary">No Assets Found</h3>
            <p className="text-text-secondary text-sm max-w-sm pt-1.5">
              Try adjusting your search criteria, clearing your filters, or register a new asset.
            </p>
            {isManager && (
              <button
                onClick={() => setShowRegModal(true)}
                className="mt-5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow cursor-pointer transition-all"
              >
                Register Asset
              </button>
            )}
          </div>
        ) : viewMode === "kanban" ? (
          /* Kanban View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssets.map((asset) => {
              const cat = categories.find((c) => c.id === asset.category_id);
              const holder = employees.find((e) => e.id === asset.current_holder_id);

              return (
                <Link
                  key={asset.id}
                  href={`/assets/${asset.id}`}
                  className="bg-white border border-border-default hover:border-primary hover:shadow-md rounded-xl p-5 shadow-sm transition-all flex flex-col h-full group"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-secondary-surface text-text-secondary rounded">
                      {asset.asset_tag}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                        asset.status === "available" ? "bg-success-light text-success" :
                        asset.status === "allocated" ? "bg-primary-light text-primary" :
                        asset.status === "under_maintenance" ? "bg-warning-light text-warning" :
                        asset.status === "lost" ? "bg-danger-light text-danger" :
                        "bg-secondary-surface text-text-secondary"
                      }`}
                    >
                      {asset.status.replace("_", " ")}
                    </span>
                  </div>

                  <h3 className="font-bold text-text-primary text-base group-hover:text-primary transition-colors line-clamp-1">
                    {asset.name}
                  </h3>
                  
                  <span className="text-xs text-text-muted mt-1 leading-none uppercase tracking-wider font-semibold">
                    {cat?.name || "Uncategorized"}
                  </span>

                  <div className="border-t border-border-light my-4" />

                  <div className="space-y-2 text-xs text-text-secondary mt-auto">
                    {asset.serial_number && (
                      <div className="flex justify-between">
                        <span className="text-text-muted">Serial:</span>
                        <span className="font-medium text-text-primary truncate max-w-[150px]">{asset.serial_number}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-text-muted">Location:</span>
                      <span className="font-medium text-text-primary">{asset.location || "Not Set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Holder:</span>
                      <span className="font-medium text-text-primary truncate max-w-[150px]">{holder?.name || "Unassigned"}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* List View Table */
          <div className="bg-white border border-border-default rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary-surface/40 border-b border-border-default text-xs text-text-secondary font-semibold uppercase tracking-wider">
                    <th className="px-6 py-4">Asset Tag</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Holder</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default/40 text-sm text-text-primary">
                  {filteredAssets.map((asset) => {
                    const cat = categories.find((c) => c.id === asset.category_id);
                    const holder = employees.find((e) => e.id === asset.current_holder_id);

                    return (
                      <tr key={asset.id} className="hover:bg-page-background/40 transition-colors">
                        <td className="px-6 py-4 font-mono font-semibold text-xs text-text-secondary">{asset.asset_tag}</td>
                        <td className="px-6 py-4 font-semibold text-text-primary">
                          <Link href={`/assets/${asset.id}`} className="hover:text-primary transition-colors">
                            {asset.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-text-secondary">{cat?.name || "Uncategorized"}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                              asset.status === "available" ? "bg-success-light text-success" :
                              asset.status === "allocated" ? "bg-primary-light text-primary" :
                              asset.status === "under_maintenance" ? "bg-warning-light text-warning" :
                              asset.status === "lost" ? "bg-danger-light text-danger" :
                              "bg-secondary-surface text-text-secondary"
                            }`}
                          >
                            {asset.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-text-secondary">{asset.location || "Not Set"}</td>
                        <td className="px-6 py-4 text-text-secondary font-medium">{holder?.name || "Unassigned"}</td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/assets/${asset.id}`}
                            className="text-primary hover:text-primary-hover font-semibold text-xs"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Register Asset Modal */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-border-default rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-default shrink-0">
              <h2 className="text-xl font-bold text-text-primary">Register New Asset</h2>
              <button
                onClick={() => setShowRegModal(false)}
                className="text-text-muted hover:text-text-primary text-2xl font-semibold leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleRegisterAsset} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* General Section */}
              <div>
                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">General Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5">Asset Name *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. MacBook Pro 16-inch"
                      className="w-full px-3.5 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:border-primary text-text-primary bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5">Category *</label>
                    <select
                      value={formCategoryId}
                      onChange={(e) => setFormCategoryId(e.target.value)}
                      className="w-full px-3.5 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:border-primary text-text-primary bg-white font-medium"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5">Serial Number</label>
                    <input
                      type="text"
                      value={formSerialNumber}
                      onChange={(e) => setFormSerialNumber(e.target.value)}
                      placeholder="e.g. C02X87S1LVC"
                      className="w-full px-3.5 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:border-primary text-text-primary bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Purchase Details */}
              <div>
                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Acquisition Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5">Acquisition Date</label>
                    <input
                      type="date"
                      value={formAcquisitionDate}
                      onChange={(e) => setFormAcquisitionDate(e.target.value)}
                      className="w-full px-3.5 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:border-primary text-text-primary bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5">Acquisition Cost (USD)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formAcquisitionCost}
                      onChange={(e) => setFormAcquisitionCost(e.target.value)}
                      className="w-full px-3.5 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:border-primary text-text-primary bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5">Initial Condition</label>
                    <select
                      value={formCondition}
                      onChange={(e) => setFormCondition(e.target.value as any)}
                      className="w-full px-3.5 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:border-primary text-text-primary bg-white font-medium"
                    >
                      <option value="new">New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5">Location / Storage Room</label>
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="e.g. IT Lab, Room 204"
                      className="w-full px-3.5 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:border-primary text-text-primary bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Flags */}
              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="is_shared"
                  checked={formIsShared}
                  onChange={(e) => setFormIsShared(e.target.checked)}
                  className="w-4 h-4 text-primary border-border-default rounded focus:ring-primary focus:outline-none"
                />
                <label htmlFor="is_shared" className="text-sm font-semibold text-text-secondary cursor-pointer">
                  Mark as Shared Resource (Bookable by employees)
                </label>
              </div>

              {/* Media Uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {/* Photos upload */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-2">Photos</label>
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      disabled={uploadingPhoto}
                      onClick={() => photoInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-border-default rounded-lg text-xs font-medium hover:bg-page-background transition-colors cursor-pointer text-text-secondary disabled:opacity-50"
                    >
                      {uploadingPhoto ? (
                        <svg className="animate-spin h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                      Upload Image
                    </button>
                    <input
                      type="file"
                      ref={photoInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    {/* List of uploaded photos */}
                    {formPhotos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {formPhotos.map((photo, i) => (
                          <div key={photo.key} className="relative group aspect-square rounded-lg border border-border-default overflow-hidden bg-secondary-surface">
                            <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(i, photo.key)}
                              className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-danger text-xs font-bold leading-none cursor-pointer"
                              title="Delete photo"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents upload */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-2">Documents (Manuals, Invoices)</label>
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      disabled={uploadingDoc}
                      onClick={() => docInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-border-default rounded-lg text-xs font-medium hover:bg-page-background transition-colors cursor-pointer text-text-secondary disabled:opacity-50"
                    >
                      {uploadingDoc ? (
                        <svg className="animate-spin h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                      Upload Document
                    </button>
                    <input
                      type="file"
                      ref={docInputRef}
                      onChange={handleDocUpload}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                      className="hidden"
                    />

                    {/* List of uploaded documents */}
                    {formDocuments.length > 0 && (
                      <div className="space-y-1.5">
                        {formDocuments.map((doc, i) => (
                          <div key={doc.key} className="flex items-center justify-between p-2 bg-secondary-surface rounded-lg text-xs border border-border-default/60">
                            <span className="truncate max-w-[180px] font-medium" title={doc.name}>{doc.name}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveDoc(i, doc.key)}
                              className="text-text-muted hover:text-danger font-semibold text-lg leading-none cursor-pointer px-1"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-secondary-surface border-t border-border-default flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowRegModal(false)}
                className="px-4 py-2 border border-border-default rounded-lg text-sm text-text-secondary hover:bg-white transition-colors cursor-pointer font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleRegisterAsset}
                disabled={isSubmitting || uploadingPhoto || uploadingDoc}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Registering..." : "Register Asset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
