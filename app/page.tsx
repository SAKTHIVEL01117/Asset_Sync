"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { insforge } from "./lib/insforge/client";

export default function Home() {
  const router = useRouter();

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);


  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How does AssetFlow handle multi-location inventory?",
      answer: "Our platform supports unlimited locations, branches, and sites with hierarchical management and global search capabilities."
    },
    {
      question: "Is there a mobile app for field technicians?",
      answer: "Yes, our native iOS and Android apps allow technicians to scan barcodes, update work orders, and perform audits in the field."
    },
    {
      question: "Can we integrate with our existing ERP?",
      answer: "AssetFlow offers robust API integrations for popular ERPs like SAP, Oracle, and Odoo, ensuring seamless data flow."
    }
  ];

  const capabilities = [
    {
      title: "Asset Lifecycle Management",
      description: "Track every stage from procurement to disposal with automated depreciation and value monitoring.",
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      bgColor: "bg-primary-light"
    },
    {
      title: "Smart Resource Booking",
      description: "Real-time scheduling for equipment, rooms, and personnel with collision detection and automated approvals.",
      icon: (
        <svg className="w-6 h-6 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: "bg-info-light"
    },
    {
      title: "Asset Allocation & Transfers",
      description: "Seamlessly transfer responsibility between departments with digital chain-of-custody verification.",
      icon: (
        <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      bgColor: "bg-success-light"
    },
    {
      title: "Preventive Maintenance",
      description: "Automate service schedules and alerts to prevent downtime and extend asset longevity.",
      icon: (
        <svg className="w-6 h-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
      bgColor: "bg-danger-light"
    },
    {
      title: "Audit & Compliance",
      description: "Simplified regulatory reporting and digital audit trails that guarantee data integrity.",
      icon: (
        <svg className="w-6 h-6 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      bgColor: "bg-info-light"
    },
    {
      title: "Reports & Analytics",
      description: "Custom dashboards with real-time KPIs to drive data-informed operational decisions.",
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2zm12 0v-3a2 2 0 00-2-2h-2a2 2 0 00-2 2v3a2 2 0 002 2h2a2 2 0 002-2zm0 0v-7a2 2 0 00-2-2h-2a2 2 0 00-2 2v7a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      ),
      bgColor: "bg-primary-light"
    }
  ];

  const lifecycleSteps = [
    {
      step: 1,
      title: "Register",
      description: "Catalog assets with QR codes."
    },
    {
      step: 2,
      title: "Allocate",
      description: "Assign to teams or users."
    },
    {
      step: 3,
      title: "Transfer",
      description: "Track location movements."
    },
    {
      step: 4,
      title: "Maintain",
      description: "Scheduled health checks."
    },
    {
      step: 5,
      title: "Audit",
      description: "Verify physical presence."
    },
    {
      step: 6,
      title: "Retire",
      description: "Manage end-of-life cycle."
    }
  ];

  return (
    <div className="min-h-screen bg-page-background text-text-primary selection:bg-primary selection:text-white font-sans overflow-x-hidden">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border-default transition-all duration-200">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-9 h-9 rounded-lg bg-primary flex flex-col items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="text-xl font-bold text-text-primary tracking-tight">Asset<span className="text-primary">Flow</span></span>
          </div>


          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors px-4 py-2 rounded-md">
              Login
            </Link>
            <Link href="/login" className="text-sm font-semibold bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-150">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-primary-light/30 via-transparent to-transparent">
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Content */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light/50 border border-primary/20 text-xs font-semibold text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              NEW: v4.0 is now live
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-[1.15]">
              Smart Asset & Resource Management for Modern Organizations
            </h1>
            
            <p className="text-lg text-text-secondary leading-relaxed">
              Manage assets, allocate resources, schedule maintenance, track audits, and optimize operations—all from one unified platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
              <Link href="/login" className="flex items-center justify-center bg-primary hover:bg-primary-hover text-white text-base font-semibold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150 cursor-pointer">
                Get Started Free
              </Link>
              <button className="flex items-center justify-center gap-2 border border-border-default hover:border-primary/30 hover:bg-primary-light/10 text-text-primary text-base font-semibold px-6 py-3.5 rounded-xl transition-all duration-150 cursor-pointer">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Explore Features
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="lg:col-span-6 flex justify-center items-center relative">
            <div className="w-full max-w-[560px] relative rounded-2xl overflow-hidden shadow-2xl border border-border-default/55 bg-white aspect-[16/10] group">
              <Image 
                src="/dashboard_mockup.jpg" 
                alt="AssetFlow Dashboard Mockup" 
                fill
                priority
                className="object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
              />
            </div>
            {/* Background glowing gradients for aesthetic depth */}
            <div className="absolute -z-10 -top-8 -right-8 w-72 h-72 rounded-full bg-primary/5 blur-[120px]"></div>
            <div className="absolute -z-10 -bottom-8 -left-8 w-72 h-72 rounded-full bg-info/5 blur-[120px]"></div>
          </div>
        </div>
      </section>

      {/* Stats Row Section */}
      <section className="py-12 bg-white border-y border-border-default">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-page-background rounded-xl border border-border-light hover:border-primary/10 transition-colors">
              <span className="text-3xl md:text-4xl font-bold text-primary">10k+</span>
              <span className="text-sm font-medium text-text-secondary mt-2">Assets Managed</span>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-page-background rounded-xl border border-border-light hover:border-primary/10 transition-colors">
              <span className="text-3xl md:text-4xl font-bold text-primary">98%</span>
              <span className="text-sm font-medium text-text-secondary mt-2">Resource Utilization</span>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-page-background rounded-xl border border-border-light hover:border-primary/10 transition-colors">
              <span className="text-3xl md:text-4xl font-bold text-primary">500+</span>
              <span className="text-sm font-medium text-text-secondary mt-2">Organizations</span>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-page-background rounded-xl border border-border-light hover:border-primary/10 transition-colors">
              <span className="text-3xl md:text-4xl font-bold text-primary">99.9%</span>
              <span className="text-sm font-medium text-text-secondary mt-2">System Availability</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise-grade capabilities */}
      <section className="py-24 bg-page-background">
        <div className="max-w-[1440px] mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
              Enterprise-grade capabilities
            </h2>
            <p className="text-lg text-text-secondary">
              Scalable tools designed to manage complex infrastructure across global organizations.
            </p>
          </div>

          {/* Grid of Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {capabilities.map((item, index) => (
              <div 
                key={index} 
                className="group p-8 bg-white border border-border-default rounded-2xl shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center mb-6`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mt-3">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Complete Asset Lifecycle (Progress Steps) */}
      <section className="py-24 bg-white border-t border-border-default overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
              The Complete Asset Lifecycle
            </h2>
            <p className="text-lg text-text-secondary">
              A unified flow for maximum operational visibility.
            </p>
          </div>

          {/* Steps Timeline Row */}
          <div className="relative">
            {/* Connecting Horizontal Line (desktop) */}
            <div className="hidden lg:block absolute top-7 left-1/12 right-1/12 h-0.5 bg-border-default -z-10"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-4 relative z-10">
              {lifecycleSteps.map((stepItem, index) => (
                <div key={index} className="flex flex-col items-center text-center group">
                  {/* Step Badge */}
                  <div className="w-14 h-14 rounded-full bg-primary text-white font-bold text-lg flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-primary-hover transition-all duration-200 cursor-default">
                    {stepItem.step}
                  </div>
                  {/* Title */}
                  <h3 className="text-base font-bold text-text-primary mt-6 group-hover:text-primary transition-colors">
                    {stepItem.title}
                  </h3>
                  {/* Description */}
                  <p className="text-xs text-text-secondary leading-relaxed mt-2 px-4 max-w-[200px]">
                    {stepItem.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why leading enterprises choose AssetFlow (Split with Bento Grid) */}
      <section className="py-24 bg-page-background">
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
              Why leading enterprises choose AssetFlow
            </h2>
            
            <div className="space-y-6">
              {[
                {
                  title: "Centralized Asset Management",
                  desc: "One single source of truth for all physical and digital assets across every department."
                },
                {
                  title: "Increased Productivity",
                  desc: "Reduce time spent on inventory by 60% through automated tracking and intelligent search."
                },
                {
                  title: "Better Resource Utilization",
                  desc: "Identify underused assets and optimize allocation to save on unnecessary procurement costs."
                },
                {
                  title: "Complete Operational Visibility",
                  desc: "Real-time tracking of asset health and location ensures your business never stops moving."
                }
              ].map((benefit, bIdx) => (
                <div key={bIdx} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-primary">{benefit.title}</h3>
                    <p className="text-sm text-text-secondary mt-1 leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Bento Grid Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1 */}
            <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-2xl flex flex-col justify-between aspect-[4/3] sm:aspect-square hover:shadow-sm hover:border-indigo-200 transition-all">
              <span className="text-4xl md:text-5xl font-extrabold text-indigo-900">60%</span>
              <div>
                <h4 className="text-base font-bold text-indigo-950">Faster Audits</h4>
                <p className="text-xs text-indigo-700/80 mt-1 leading-relaxed">Streamlined digital reporting saves auditing overhead.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-8 bg-sky-50 border border-sky-100 rounded-2xl flex flex-col justify-between aspect-[4/3] sm:aspect-square hover:shadow-sm hover:border-sky-200 transition-all">
              <span className="text-4xl md:text-5xl font-extrabold text-sky-900">99.9%</span>
              <div>
                <h4 className="text-base font-bold text-sky-950">Data Accuracy</h4>
                <p className="text-xs text-sky-700/80 mt-1 leading-relaxed">Automated entries eliminate duplicate fields and errors.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-8 bg-slate-100 border border-slate-200 rounded-2xl flex flex-col justify-between aspect-[4/3] sm:aspect-square hover:shadow-sm hover:border-slate-300 transition-all">
              <span className="text-4xl md:text-5xl font-extrabold text-slate-900">40k+</span>
              <div>
                <h4 className="text-base font-bold text-slate-950">Daily Actions</h4>
                <p className="text-xs text-slate-700/80 mt-1 leading-relaxed">Handling enterprise scale asset activities seamlessly.</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-8 bg-emerald-500 border border-emerald-600 rounded-2xl flex flex-col justify-between aspect-[4/3] sm:aspect-square shadow-md shadow-emerald-500/10 hover:shadow-lg hover:bg-emerald-600 transition-all text-white">
              <span className="text-4xl md:text-5xl font-extrabold">24/7</span>
              <div>
                <h4 className="text-base font-bold">Support Response</h4>
                <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">Our dedicated engineers are here to assist 24 hours a day.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="bg-primary rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-xl shadow-primary/20">
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -z-1"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -z-1"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Ready to streamline your operations?
              </h2>
              <p className="text-base md:text-lg text-primary-light leading-relaxed">
                Join 500+ organizations using AssetFlow to optimize their resource management today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button className="w-full sm:w-auto bg-white hover:bg-primary-light text-primary text-base font-bold px-6 py-3.5 rounded-xl shadow transition-colors cursor-pointer">
                  Schedule a Demo
                </button>
                <button className="w-full sm:w-auto bg-transparent hover:bg-white/10 border border-white text-white text-base font-bold px-6 py-3.5 rounded-xl transition-colors cursor-pointer">
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-page-background">
        <div className="max-w-[800px] mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary">
              Frequently Asked Questions
            </h2>
          </div>

          {/* Accordion Panels */}
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className="bg-white border border-border-default rounded-xl overflow-hidden transition-all duration-200"
                >
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left flex items-center justify-between font-bold text-text-primary hover:text-primary transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <span className="ml-4 flex-shrink-0 text-text-secondary">
                      {isOpen ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                    </span>
                  </button>
                  
                  {/* Collapsible Content */}
                  <div 
                    className={`transition-all duration-200 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-40 border-t border-border-light" : "max-h-0"
                    }`}
                  >
                    <p className="p-6 text-sm text-text-secondary leading-relaxed bg-page-background">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border-default pt-16 pb-8">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-border-default">
            {/* Column 1: Info */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-primary flex items-center justify-center p-1.5 text-white">
                  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-text-primary tracking-tight">AssetFlow</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed max-w-sm">
                Empowering organizations to track, manage, and optimize their assets with precision and ease.
              </p>
            </div>

            {/* Column 2: Product */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold text-text-primary tracking-wider uppercase">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs text-text-secondary hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="text-xs text-text-secondary hover:text-primary transition-colors">Security</a></li>
                <li><a href="#" className="text-xs text-text-secondary hover:text-primary transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold text-text-primary tracking-wider uppercase">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs text-text-secondary hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="text-xs text-text-secondary hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="text-xs text-text-secondary hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold text-text-primary tracking-wider uppercase">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs text-text-secondary hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-xs text-text-secondary hover:text-primary transition-colors">Terms</a></li>
              </ul>
            </div>

            {/* Column 5: Social */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold text-text-primary tracking-wider uppercase">Social</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs text-text-secondary hover:text-primary transition-colors">LinkedIn</a></li>
                <li><a href="#" className="text-xs text-text-secondary hover:text-primary transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer Info */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-text-muted">
            <span>© 2026 AssetFlow Enterprise. All rights reserved.</span>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span>System Status: Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
