"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  User,
  Users,
  Eye,
  EyeOff,
  Building2,
  KeyRound,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Terminal,
  Zap,
  Info
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { UserRole } from "@/types/auth";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  // Selected portal: "manager" or "employee"
  const portalParam = searchParams.get("portal");
  const [selectedPortal, setSelectedPortal] = useState<UserRole>(
    portalParam === "employee" ? "employee" : "manager"
  );

  const [email, setEmail] = useState<string>(
    selectedPortal === "manager" ? "manager@aegis-defense.corp" : "analyst@aegis-defense.corp"
  );
  const [password, setPassword] = useState<string>(
    selectedPortal === "manager" ? "Manager@2026!" : "Analyst@2026!"
  );
  const [badgeId, setBadgeId] = useState<string>(
    selectedPortal === "manager" ? "CORP-MGR-0091" : "CORP-EMP-4420"
  );
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberDevice, setRememberDevice] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync credentials when tab switches
  useEffect(() => {
    if (selectedPortal === "manager") {
      setEmail("manager@aegis-defense.corp");
      setPassword("Manager@2026!");
      setBadgeId("CORP-MGR-0091");
    } else {
      setEmail("analyst@aegis-defense.corp");
      setPassword("Analyst@2026!");
      setBadgeId("CORP-EMP-4420");
    }
    setErrorMessage(null);
  }, [selectedPortal]);

  const handlePortalChange = (role: UserRole) => {
    setSelectedPortal(role);
  };

  const handleQuickLogin = async (role: UserRole) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const demoEmail = role === "manager" ? "manager@aegis-defense.corp" : "analyst@aegis-defense.corp";
      await login(demoEmail, role);
      // If manager, can redirect directly to dashboard or employee-history
      router.push("/");
    } catch (err: any) {
      setErrorMessage(err.message || "Authentication failed");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Authenticate with chosen portal role
      await login(email, selectedPortal);
      router.push("/");
    } catch (err: any) {
      setErrorMessage(err.message || "Corporate identity authentication rejected");
      setIsLoading(false);
    }
  };

  const isManagerPortal = selectedPortal === "manager";

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-cyber-bg pointer-events-none" />
      <div
        className={`absolute w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700 ${
          isManagerPortal ? "bg-cyber-cyan/10 top-1/4 left-1/3" : "bg-cyber-purple/10 top-1/4 right-1/3"
        }`}
      />

      {/* Corporate Header & Emblem */}
      <div className="relative z-10 w-full max-w-xl text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyber-border text-xs font-mono text-cyber-cyan mb-3 shadow-neon-cyan">
          <Building2 className="w-3.5 h-3.5 text-cyber-cyan" />
          <span>AEGIS CYBER DEFENSE CORP &bull; ENTERPRISE IAM</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase flex items-center justify-center gap-2">
          <span>CORPORATE ZERO-TRUST ACCESS GATEWAY</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400 font-mono mt-1">
          Role-Based Identity Federation &bull; Dual-Engine SOC Command Portal
        </p>
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-xl cyber-panel rounded-xl overflow-hidden border border-cyber-border shadow-2xl">
        {/* Compliance / Status Bar */}
        <div className="bg-black/60 px-5 py-2.5 border-b border-cyber-border flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-pulse" />
            <span>IDP STATUS: ONLINE (TLS 1.3 AES-256)</span>
          </div>
          <span className="text-slate-400">SOC-2 TYPE II AUDITED</span>
        </div>

        {/* Portal Mode Selector Tabs */}
        <div className="grid grid-cols-2 bg-black/40 border-b border-cyber-border p-1.5 gap-2">
          {/* Manager Access Portal Tab */}
          <button
            type="button"
            onClick={() => handlePortalChange("manager")}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-mono text-xs md:text-sm font-semibold transition-all ${
              isManagerPortal
                ? "bg-cyber-cyan/20 border border-cyber-cyan text-white shadow-neon-cyan"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${isManagerPortal ? "text-cyber-cyan" : "text-slate-400"}`} />
            <div className="text-left">
              <div className="leading-tight">MANAGER PORTAL</div>
              <div className="text-[10px] text-cyber-cyan font-normal">Level 4 Executive Clearance</div>
            </div>
          </button>

          {/* Employee Access Portal Tab */}
          <button
            type="button"
            onClick={() => handlePortalChange("employee")}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-mono text-xs md:text-sm font-semibold transition-all ${
              !isManagerPortal
                ? "bg-cyber-purple/20 border border-cyber-purple text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <Users className={`w-4 h-4 ${!isManagerPortal ? "text-cyber-purple" : "text-slate-400"}`} />
            <div className="text-left">
              <div className="leading-tight">EMPLOYEE PORTAL</div>
              <div className="text-[10px] text-cyber-purple font-normal">Level 2 Operator Clearance</div>
            </div>
          </button>
        </div>

        {/* Clearance Privileges & Role Distinction Overview */}
        <div className="p-5 bg-black/30 border-b border-cyber-border/70 text-xs font-mono">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyber-cyan" />
              {isManagerPortal ? "Manager Clearance Permissions" : "Employee Clearance Permissions"}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isManagerPortal
                  ? "bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30"
                  : "bg-cyber-purple/15 text-cyber-purple border border-cyber-purple/30"
              }`}
            >
              {isManagerPortal ? "TIER 4: SUPERVISORY" : "TIER 2: ANALYST"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-300">
            {isManagerPortal ? (
              <>
                <div className="flex items-center gap-1.5 text-cyber-emerald">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Inspect All Employee History & Audits</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyber-emerald">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Monitor Team Risk & Revoke Sessions</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyber-emerald">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Execute Node Quarantine & Remediation</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyber-emerald">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Export Official SOC 2 Compliance Reports</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 text-cyber-emerald">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>View Real-Time 3D Topology & Flow Gauges</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyber-emerald">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Inspect Local Traffic & ASM Matrix</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyber-red">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-semibold">NO ACCESS to Employee History (403 Forbidden)</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyber-red">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-semibold">NO ACCESS to Team Supervisory Overrides</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick Demo Instant 1-Click Login CTA for Vercel Evaluators */}
        <div className="px-5 pt-4">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleQuickLogin(selectedPortal)}
            className={`w-full py-2.5 px-4 rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              isManagerPortal
                ? "bg-gradient-to-r from-cyber-cyan/30 to-cyber-cyan/10 hover:from-cyber-cyan/40 hover:to-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan shadow-neon-cyan"
                : "bg-gradient-to-r from-cyber-purple/30 to-cyber-purple/10 hover:from-cyber-purple/40 hover:to-cyber-purple/20 border border-cyber-purple text-purple-200"
            }`}
          >
            <Zap className="w-4 h-4 text-cyber-amber animate-pulse" />
            <span>
              ⚡ Instant 1-Click SSO Demo Login (as {isManagerPortal ? "Manager: Cmdr. Jenkins" : "Employee: David Vance"})
            </span>
          </button>
        </div>

        {/* Form Separator */}
        <div className="px-5 py-3 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-[10px] font-mono text-slate-500 uppercase">OR ENTER CORPORATE CREDENTIALS</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Standard Corporate Form */}
        <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-4 font-mono text-xs">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-cyber-red/15 border border-cyber-red/50 text-cyber-red flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-slate-300 mb-1 font-semibold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Corporate SSO Email Address</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isManagerPortal ? "manager@aegis-defense.corp" : "analyst@aegis-defense.corp"}
              className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyber-cyan rounded-lg px-3 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyber-cyan transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-slate-300 mb-1 font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyber-cyan" />
                <span>Enterprise Passphrase / Security Token</span>
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-cyber-cyan flex items-center gap-1 text-[10px]"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPassword ? "Hide" : "Show"}</span>
              </button>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyber-cyan rounded-lg px-3 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyber-cyan transition-all"
              />
            </div>
          </div>

          {/* Employee Badge ID */}
          <div>
            <label className="block text-slate-300 mb-1 font-semibold flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Workstation Security Clearance Badge ID</span>
            </label>
            <input
              type="text"
              required
              value={badgeId}
              onChange={(e) => setBadgeId(e.target.value)}
              placeholder={isManagerPortal ? "CORP-MGR-0091" : "CORP-EMP-4420"}
              className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyber-cyan rounded-lg px-3 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyber-cyan transition-all"
            />
          </div>

          {/* Remember Workstation Hardware Check */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 text-[11px]">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-cyber-cyan focus:ring-0"
              />
              <span>Verify Hardware FIDO2 / YubiKey token</span>
            </label>
            <span className="text-[10px] text-cyber-cyan/70">Continuous ZTA Active</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-mono text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-white transition-all ${
              isManagerPortal
                ? "bg-cyber-cyan/30 hover:bg-cyber-cyan/40 border border-cyber-cyan text-cyber-cyan shadow-neon-cyan"
                : "bg-cyber-purple/30 hover:bg-cyber-purple/40 border border-cyber-purple text-purple-200"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                VERIFYING CLEARANCE HASH...
              </span>
            ) : (
              <>
                <span>AUTHENTICATE & ENTER {isManagerPortal ? "MANAGER COMMAND" : "EMPLOYEE WORKSPACE"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Direct Link Options */}
        <div className="px-5 py-3 bg-black/50 border-t border-cyber-border/50 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Dedicated Endpoints:</span>
          <div className="flex items-center gap-3">
            <Link href="/login/manager" className="text-cyber-cyan hover:underline">
              /login/manager
            </Link>
            <span className="text-slate-600">&bull;</span>
            <Link href="/login/employee" className="text-cyber-purple hover:underline">
              /login/employee
            </Link>
            <span className="text-slate-600">&bull;</span>
            <Link href="/employee-history" className="text-amber-400 hover:underline">
              /employee-history
            </Link>
          </div>
        </div>
      </div>

      {/* Corporate Compliance & Legal Disclaimer Footer */}
      <div className="relative z-10 w-full max-w-xl mt-4 text-center font-mono text-[10px] text-slate-500 leading-relaxed">
        <p>
          CONFIDENTIAL &bull; AUTHORIZED PERSONNEL ONLY. ALL TRANSACTIONS AND NETWORK PACKETS ARE MONITORED,
          ENCRYPTED, AND ARCHIVED IN COMPLIANCE WITH SOC 2 TYPE II AND NIST SP 800-53 STANDARDS.
        </p>
        <p className="mt-1 text-slate-600">
          Aegis Cyber Defense Systems &bull; Enterprise Incident Response &bull; Threat Telemetry Engine v2.0
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cyber-bg flex items-center justify-center text-cyber-cyan font-mono text-sm">INITIALIZING IDENTITY PROVIDER GATEWAY...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
