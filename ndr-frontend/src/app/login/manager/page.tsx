"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  User,
  Building2,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  Zap,
  ArrowLeft,
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth } from "@/lib/authContext";

export default function ManagerLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("manager@aegis-defense.corp");
  const [password, setPassword] = useState("Manager@2026!");
  const [badgeId, setBadgeId] = useState("CORP-MGR-0091");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickLogin = async () => {
    setIsLoading(true);
    await login(email, "manager");
    router.push("/employee-history");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, "manager");
    router.push("/employee-history");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 relative bg-cyber-bg">
      <div className="absolute w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none bg-cyber-cyan/10 top-1/4" />

      {/* Corporate Nav Header */}
      <div className="relative z-10 w-full max-w-lg mb-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyber-cyan transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Unified Identity Gateway</span>
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyber-cyan/40 text-xs font-mono text-cyber-cyan mb-2 shadow-neon-cyan">
          <Building2 className="w-3.5 h-3.5 text-cyber-cyan" />
          <span>AEGIS CYBER DEFENSE CORP &bull; EXECUTIVE SUITE</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white uppercase">
          MANAGER ACCESS PORTAL
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Security Operations Directorate &bull; Personnel Audit & Strategic Oversight
        </p>
      </div>

      {/* Main Panel */}
      <div className="relative z-10 w-full max-w-lg cyber-panel rounded-xl overflow-hidden border border-cyber-cyan/30 shadow-2xl">
        <div className="bg-black/60 px-5 py-3 border-b border-cyber-border flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-cyber-cyan">
            <ShieldCheck className="w-4 h-4 text-cyber-cyan" />
            <span className="font-bold">TIER 4: EXECUTIVE CLEARANCE REQUIRED</span>
          </div>
          <span className="text-slate-400">RESTRICTED</span>
        </div>

        {/* Manager Privileges Badge */}
        <div className="p-4 bg-cyber-cyan/5 border-b border-cyber-border/50 text-xs font-mono text-slate-300 space-y-1.5">
          <div className="text-cyber-cyan font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyber-cyan" />
            <span>Authorized Managerial Capabilities</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan" />
            <span>Full Personnel History Inspection & Incident Action Audit</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan" />
            <span>Employee Risk Scoring, Session Revocation & Quarantine</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan" />
            <span>SOC 2 Compliance Report Verification & JSON/CSV Export</span>
          </div>
        </div>

        {/* 1-Click Instant SSO Demo Button */}
        <div className="p-5 pb-2">
          <button
            type="button"
            onClick={handleQuickLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-cyber-cyan/30 to-cyber-cyan/10 hover:from-cyber-cyan/40 hover:to-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan shadow-neon-cyan transition-all"
          >
            <Zap className="w-4 h-4 text-cyber-amber animate-pulse" />
            <span>⚡ Instant 1-Click Login as Manager (Cmdr. Sarah Jenkins)</span>
          </button>
        </div>

        <div className="px-5 py-2 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-[10px] font-mono text-slate-500 uppercase">OR MANUAL AUTHENTICATION</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-3.5 font-mono text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-semibold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Manager Corporate Email</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyber-cyan rounded-lg px-3 py-2 text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyber-cyan" />
                <span>Executive Master Password</span>
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
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyber-cyan rounded-lg px-3 py-2 text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Manager Badge ID</span>
            </label>
            <input
              type="text"
              required
              value={badgeId}
              onChange={(e) => setBadgeId(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyber-cyan rounded-lg px-3 py-2 text-slate-100 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg font-mono text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-cyber-cyan/30 hover:bg-cyber-cyan/40 border border-cyber-cyan text-cyber-cyan shadow-neon-cyan transition-all mt-4"
          >
            {isLoading ? "VERIFYING EXECUTIVE PRIVILEGES..." : "ENTER MANAGER COMMAND & AUDIT LOGS"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="px-5 py-3 bg-black/60 border-t border-cyber-border/50 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Need employee view?</span>
          <Link href="/login/employee" className="text-cyber-purple hover:underline">
            Switch to Employee Login &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

