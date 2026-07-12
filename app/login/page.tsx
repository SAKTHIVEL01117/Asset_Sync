"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signInUser, signUpUser, verifyEmailOtp, resendOtp, initiateOAuth } from "../actions";

export default function LoginPage() {
  // Mode: "signin" | "signup" | "verify"
  const [mode, setMode] = useState<"signin" | "signup" | "verify">("signin");
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  // Handle URL query parameters (e.g. for errors or redirects)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const err = params.get("error");
      const status = params.get("insforge_status");
      const type = params.get("insforge_type");

      if (err) {
        if (err === "oauth_failed") setError("Social login failed. Please try again.");
        else if (err === "missing_verifier") setError("OAuth verifier missing. Please try again.");
        else if (err === "exchange_failed") setError("Failed to exchange OAuth code for session.");
        else setError(err);
      }

      if (status === "success" && type === "verify_email") {
        setSuccess("Email successfully verified! Please log in.");
        setMode("signin");
      }
    }
  }, []);

  // Handle countdown timer for resending OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("otp", otp);

    try {
      if (mode === "signin") {
        const res = await signInUser(null, formData);
        if (res && res.error) {
          setError(res.error);
          if (res.requireVerification) {
            setMode("verify");
            setSuccess("Please enter the verification code sent to your email.");
          }
        }
      } else if (mode === "signup") {
        const res = await signUpUser(null, formData);
        if (res && res.error) {
          setError(res.error);
        } else if (res && res.requireVerification) {
          setSuccess("Account registered! Please check your email for the verification code.");
          setMode("verify");
        } else if (res && res.success) {
          setSuccess("Account registered successfully! You can now log in.");
          setMode("signin");
        }
      } else if (mode === "verify") {
        const res = await verifyEmailOtp(null, formData);
        if (res && res.error) {
          setError(res.error);
        }
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || !email) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await resendOtp(email);
      if (res && res.error) {
        setError(res.error);
      } else {
        setSuccess("A new verification code has been sent to your email.");
        setResendTimer(60);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to resend code.");
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setLoading(true);
    setError(null);
    try {
      await initiateOAuth(provider);
    } catch (err: any) {
      setError(err?.message || `Failed to sign in with ${provider}.`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page-background text-text-primary font-sans flex items-stretch">
      {/* Decorative Branding Sidebar (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-hover to-info p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] right-[-20%] w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-black/10 blur-3xl"></div>

        {/* Top Header */}
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-2xl tracking-tight cursor-pointer">
          <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center p-1.5 border border-white/20">
            <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <span>AssetFlow</span>
        </Link>

        {/* Middle Feature Cards Showcase */}
        <div className="space-y-8 max-w-lg z-10 my-auto">
          <h2 className="text-4xl font-bold text-white tracking-tight leading-tight">
            Simplify Your Enterprise Resource & Asset Lifecycle
          </h2>
          <p className="text-white/80 text-lg">
            A centralized hub to register assets, track audits, validate bookings, schedule maintenance, and analyze department utilization.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex gap-4 p-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold">Durable Asset Audits</h4>
                <p className="text-white/70 text-sm">Organize periodic verification cycles and generate instant discrepancy reports.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold">Conflict-free Reservations</h4>
                <p className="text-white/70 text-sm">Real-time scheduling with automatic booking overlap detection and validations.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-white/55 text-sm">
          &copy; {new Date().getFullYear()} AssetFlow. All rights reserved.
        </div>
      </div>

      {/* Main Action Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white">
        <div className="w-full max-w-[440px] flex flex-col space-y-8">
          
          {/* Header */}
          <div className="flex flex-col space-y-2">
            <Link href="/" className="lg:hidden flex items-center gap-2 text-text-primary font-bold text-xl mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center p-1.5">
                <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span>AssetFlow</span>
            </Link>

            <h1 className="text-3xl font-bold tracking-tight text-text-primary">
              {mode === "signin" && "Sign In"}
              {mode === "signup" && "Get Started"}
              {mode === "verify" && "Verify Email"}
            </h1>
            <p className="text-text-secondary text-sm">
              {mode === "signin" && "Welcome back! Enter your details to continue."}
              {mode === "signup" && "Create your employee account to manage assets."}
              {mode === "verify" && `We've sent a 6-digit verification code to ${email}.`}
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="p-4 rounded-lg bg-danger-light border border-danger/20 text-danger-foreground text-sm flex gap-2.5 items-start">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-lg bg-success-light border border-success/20 text-success-foreground text-sm flex gap-2.5 items-start">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* Forms */}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {mode === "signup" && (
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="name" className="text-xs font-semibold text-text-secondary">Full Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border-default hover:border-primary/50 focus:border-primary focus:outline-none transition-all text-sm"
                />
              </div>
            )}

            {mode !== "verify" && (
              <>
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-text-secondary">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-border-default hover:border-primary/50 focus:border-primary focus:outline-none transition-all text-sm"
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-xs font-semibold text-text-secondary">Password</label>
                    {mode === "signin" && (
                      <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                    )}
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-border-default hover:border-primary/50 focus:border-primary focus:outline-none transition-all text-sm"
                  />
                </div>
              </>
            )}

            {mode === "verify" && (
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="otp" className="text-xs font-semibold text-text-secondary">Verification Code</label>
                <input
                  id="otp"
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 text-center tracking-[0.5em] font-mono text-lg rounded-lg border border-border-default hover:border-primary/50 focus:border-primary focus:outline-none transition-all"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-semibold text-sm shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {mode === "signin" && "Sign In"}
              {mode === "signup" && "Create Account"}
              {mode === "verify" && "Verify Code"}
            </button>

            {mode === "verify" && (
              <div className="flex justify-center items-center pt-2">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0}
                  className="text-xs font-medium text-primary hover:underline disabled:text-text-muted disabled:no-underline cursor-pointer"
                >
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend verification code"}
                </button>
              </div>
            )}
          </form>

          {/* Social Logins */}
          {mode !== "verify" && (
            <div className="flex flex-col space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-default"></div>
                </div>
                <span className="relative px-3 bg-white text-xs text-text-muted font-medium">Or continue with</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleOAuth("google")}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-border-default hover:bg-page-background transition-colors cursor-pointer text-sm font-medium"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.626 5.626 0 1 1 18 12.013c0 .356-.03.708-.09 1.05H12.24z"/>
                    <path fill="#FBBC05" d="M5.154 8.241A5.602 5.602 0 0 1 12 6.386c1.402 0 2.68.513 3.667 1.353l3.056-3.056A10.021 10.021 0 0 0 12 2.012a9.98 9.98 0 0 0-6.846 2.613l3.056 3.056c-.987.84-2.265 1.354-3.667 1.354c.205-.27.42-.525.61-.794z"/>
                    <path fill="#4285F4" d="M12 21.988a9.98 9.98 0 0 0 6.846-2.613l-3.056-3.056c-.987.84-2.265 1.354-3.667 1.354A5.602 5.602 0 0 1 5.154 15.61l-3.056 3.056A9.98 9.98 0 0 0 12 21.988z"/>
                    <path fill="#34A853" d="M2.098 18.666l3.056-3.056a5.612 5.612 0 0 1-.027-7.235L2.07 5.32A9.99 9.99 0 0 0 12 2.012c1.402 0 2.68.513 3.667 1.353l3.056-3.056A10.021 10.021 0 0 0 12 2.012a9.99 9.99 0 0 0-9.902 16.654z"/>
                  </svg>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleOAuth("github")}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-border-default hover:bg-page-background transition-colors cursor-pointer text-sm font-medium"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>
            </div>
          )}

          {/* Switch Modes */}
          {mode !== "verify" && (
            <div className="text-center text-sm text-text-secondary">
              {mode === "signin" ? (
                <>
                  Don't have an account?{" "}
                  <button type="button" onClick={() => { setMode("signup"); setError(null); setSuccess(null); }} className="font-semibold text-primary hover:underline cursor-pointer">
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button type="button" onClick={() => { setMode("signin"); setError(null); setSuccess(null); }} className="font-semibold text-primary hover:underline cursor-pointer">
                    Sign in
                  </button>
                </>
              )}
            </div>
          )}

          {mode === "verify" && (
            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => { setMode("signin"); setError(null); setSuccess(null); }}
                className="font-semibold text-primary hover:underline cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
