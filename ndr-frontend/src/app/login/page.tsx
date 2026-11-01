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
  Info,
  Crown,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import {
  useAuth,
  DEMO_CEO,
  DEMO_MANAGER,
  DEMO_TEAM_LEAD,
  DEMO_THREAT_HUNTER,
  DEMO_EMPLOYEE_DAVID
} from "@/lib/authContext";
import { UserRole } from "@/types/auth";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, switchUserPersona } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>("ceo");
  const [email, setEmail] = useState<string>("ceo@aegis-defense.corp");
  const [password, setPassword] = useState<string>("Ceo@2026!");
  const [badgeId, setBadgeId] = useState<string>("CORP-EXEC-0001");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberDevice, setRememberDevice] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const PERSONAS = [
    {
      role: "ceo" as UserRole,
      data: DEMO_CEO,
      badge: "TIER 5 SOVEREIGN",
      bgGradient: "from-amber-500/20 via-rose-500/10 to-indigo-600/20",
      accentBorder: "border-amber-400/50 hover:border-amber-400",
      accentText: "text-amber-400",
      btnClass: "bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-lg shadow-amber-500/20",
      email: "ceo@aegis-defense.corp",
      pass: "Ceo@2026!",
      badgeId: "CORP-EXEC-0001"
    },
    {
      role: "manager" as UserRole,
      data: DEMO_MANAGER,
      badge: "TIER 4 EXECUTIVE",
      bgGradient: "from-cyan-500/20 via-blue-500/10 to-indigo-600/20",
      accentBorder: "border-cyan-400/50 hover:border-cyan-400",
      accentText: "text-cyan-400",
      btnClass: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20",
      email: "manager@aegis-defense.corp",
      pass: "Manager@2026!",
      badgeId: "CORP-MGR-0091"
    },
    {
      role: "team_lead" as UserRole,
      data: DEMO_TEAM_LEAD,
      badge: "TIER 3 LEAD",
      bgGradient: "from-emerald-500/20 via-teal-500/10 to-cyan-600/20",
      accentBorder: "border-emerald-400/50 hover:border-emerald-400",
      accentText: "text-emerald-400",
      btnClass: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20",
      email: "lead@aegis-defense.corp",
      pass: "Lead@2026!",
      badgeId: "CORP-LEAD-2041"
    },
    {
      role: "threat_hunter" as UserRole,
      data: DEMO_THREAT_HUNTER,
      badge: "TIER 2 SPECIALIST",
      bgGradient: "from-purple-500/20 via-violet-500/10 to-pink-600/20",
      accentBorder: "border-purple-400/50 hover:border-purple-400",
      accentText: "text-purple-300",
      btnClass: "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/20",
      email: "hunter@aegis-defense.corp",
      pass: "Hunter@2026!",
      badgeId: "CORP-EMP-3918"
    },
    {
      role: "employee" as UserRole,
      data: DEMO_EMPLOYEE_DAVID,
      badge: "TIER 1 OPERATOR",
      bgGradient: "from-sky-500/20 via-blue-500/10 to-slate-600/20",
      accentBorder: "border-sky-400/50 hover:border-sky-400",
      accentText: "text-sky-300",
      btnClass: "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20",
      email: "analyst@aegis-defense.corp",
      pass: "Analyst@2026!",
      badgeId: "CORP-EMP-4420"
    }
  ];

  const handleSelectPersona = (p: typeof PERSONAS[0]) => {
    setSelectedRole(p.role);
    setEmail(p.email);
    setPassword(p.pass);
    setBadgeId(p.badgeId);
  };

  const handleQuickLogin = async (p: typeof PERSONAS[0]) => {
    setIsLoading(true);
    await login(p.email, p.role);
    router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, selectedRole);
      router.push("/");
    } catch (err: any) {
      setErrorMessage(err.message || "Authentication rejected");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 relative">
      {/* Background Ambience */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 w-full max-w-4xl text-center mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">
          <Building2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>AEGIS CYBER DEFENSE CORP &bull; ENTERPRISE IAM</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Corporate Identity & Access Gateway
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl mx-auto">
          Role-Based Zero-Trust Authentication across 5 Corporate Tiers (CEO to Normal Employee)
        </p>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl modular-card p-6 border border-white/10 shadow-2xl rounded-2xl space-y-6">
        {/* Step 1: Persona Picker */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Choose Your Corporate Persona Account (1-Click Instant SSO):</span>
            </span>
            <span className="text-[11px] text-slate-400">Information Segregated Per Tier</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {PERSONAS.map((p) => {
              const isSelected = selectedRole === p.role;
              return (
                <div
                  key={p.role}
                  onClick={() => handleSelectPersona(p)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? "border-indigo-400 bg-indigo-950/40 shadow-lg shadow-indigo-500/20 scale-[1.03]"
                      : "border-white/10 hover:border-white/20 bg-slate-900/60"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xl">{p.data.avatar}</span>
                      <span className={`text-[8px] px-1.5 py-0.2 rounded font-black ${p.accentText} bg-black/40`}>
                        {p.badge.split(" ")[1]}
                      </span>
                    </div>

                    <div className="font-bold text-white text-xs truncate">{p.data.name}</div>
                    <div className="text-[10px] text-slate-300 truncate">{p.data.title.split("&")[0]}</div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickLogin(p);
                    }}
                    className={`w-full py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all ${p.btnClass}`}
                  >
                    1-Click Sign In
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Form */}
        <div className="pt-4 border-t border-white/10">
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Enterprise Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Badge Clearance Token</label>
              <input
                type="text"
                required
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-400 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? "Authenticating Clearance..." : "Enter Aegis Enterprise Operations"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center text-indigo-400 text-sm">INITIALIZING ENTERPRISE IAM...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
