"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Building2,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  X,
  Users,
  KeyRound,
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth, DEMO_CEO, DEMO_MANAGER, DEMO_TEAM_LEAD, DEMO_THREAT_HUNTER, DEMO_EMPLOYEE_DAVID } from "@/lib/authContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeGreetingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { switchUserPersona, login } = useAuth();
  const [greeting, setGreeting] = useState("Welcome to Aegis Enterprise Operations");
  const [manualMode, setManualMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning, Officer");
    } else if (hour < 18) {
      setGreeting("Good afternoon, Commander");
    } else {
      setGreeting("Good evening, Executive");
    }
  }, []);

  const handlePersonaClick = (key: "ceo" | "manager" | "lead" | "hunter" | "employee") => {
    switchUserPersona(key);
    onClose();
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  const PERSONAS = [
    {
      key: "ceo" as const,
      data: DEMO_CEO,
      badge: "TIER 5 SOVEREIGN",
      bgGradient: "from-amber-500/20 via-rose-500/10 to-indigo-600/20",
      accentBorder: "border-amber-400/60 hover:border-amber-400",
      accentText: "text-amber-400",
      btnClass: "bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-lg shadow-amber-500/20",
      roleSummary: "Full Boardroom Metrics, Financial Risk Oversight & Organization Hierarchy.",
      restrictedNotice: "Unrestricted Sovereign Access"
    },
    {
      key: "manager" as const,
      data: DEMO_MANAGER,
      badge: "TIER 4 EXECUTIVE",
      bgGradient: "from-cyan-500/20 via-blue-500/10 to-indigo-600/20",
      accentBorder: "border-cyan-400/60 hover:border-cyan-400",
      accentText: "text-cyan-400",
      btnClass: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20",
      roleSummary: "Full SOC Command, 3D Mesh Control, Employee Action Logs & Quarantine Authority.",
      restrictedNotice: "Can inspect all team member histories"
    },
    {
      key: "lead" as const,
      data: DEMO_TEAM_LEAD,
      badge: "TIER 3 LEAD",
      bgGradient: "from-emerald-500/20 via-teal-500/10 to-cyan-600/20",
      accentBorder: "border-emerald-400/60 hover:border-emerald-400",
      accentText: "text-emerald-400",
      btnClass: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20",
      roleSummary: "Incident Escalation Lead, Shift Triage Queue & Forensic PCAP Dissection.",
      restrictedNotice: "Restricted from CEO strategic briefs"
    },
    {
      key: "hunter" as const,
      data: DEMO_THREAT_HUNTER,
      badge: "TIER 2 SPECIALIST",
      bgGradient: "from-purple-500/20 via-violet-500/10 to-pink-600/20",
      accentBorder: "border-purple-400/60 hover:border-purple-400",
      accentText: "text-purple-300",
      btnClass: "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/20",
      roleSummary: "Cloud K8s Mesh, eBPF Kernel Probes & AI Heuristic Threat Containment.",
      restrictedNotice: "Scoped strictly to Sector C Cloud Containers"
    },
    {
      key: "employee" as const,
      data: DEMO_EMPLOYEE_DAVID,
      badge: "TIER 1 OPERATOR",
      bgGradient: "from-sky-500/20 via-blue-500/10 to-slate-600/20",
      accentBorder: "border-sky-400/60 hover:border-sky-400",
      accentText: "text-sky-300",
      btnClass: "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20",
      roleSummary: "Local DMZ Ingress Triage, HoneyToken Monitoring & Workstation Telemetry.",
      restrictedNotice: "🚫 STRICTLY FORBIDDEN from viewing peer/supervisory history"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-5xl modular-card overflow-hidden my-auto border border-white/15 shadow-2xl relative">
        {/* Colorful Gradient Glows */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        {/* Modal Top Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900/90 via-indigo-950/60 to-slate-900/90 border-b border-white/10 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-0.5">
                <Building2 className="w-3 h-3" />
                <span>Aegis Enterprise Defense &bull; Identity Gateway</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{greeting}!</span>
              </h1>
              <p className="text-xs text-slate-300">
                Please select your corporate identity to access your assigned operational sector & clearance level.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/10"
            title="Continue to Dashboard as current user"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 relative z-10 max-h-[75vh] overflow-y-auto space-y-5">
          {/* Top Info Banner on Information Segregation */}
          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-300 flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white">Strict Role-Based Information Segregation Active:</span>
              <p className="mt-0.5 text-slate-300 text-[11px] leading-relaxed">
                To guarantee zero-trust compliance, data, devices, and operational subnets are unique per account.
                CEOs oversee financial risk & organizational strategy; Managers command network defense; Analysts are
                compartmentalized to local triage and strictly blocked from viewing supervisory histories.
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {manualMode ? "Manual Enterprise Authentication" : "Select Your Corporate Identity to Sign In:"}
            </span>
            <button
              onClick={() => setManualMode(!manualMode)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline"
            >
              {manualMode ? "← Back to 1-Click Persona Accounts" : "Enter Email & Password Instead →"}
            </button>
          </div>

          {!manualMode ? (
            /* 1-Click Corporate Accounts Grid (CEO to Normal Employee) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {PERSONAS.map((p) => {
                return (
                  <div
                    key={p.key}
                    onClick={() => handlePersonaClick(p.key)}
                    className={`modular-card p-4 rounded-xl border bg-gradient-to-b ${p.bgGradient} ${p.accentBorder} cursor-pointer hover:scale-[1.02] transition-all duration-200 group flex flex-col justify-between space-y-3`}
                  >
                    <div>
                      {/* Top Row: Avatar & Clearance Badge */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.data.avatarGradient} p-0.5 shadow-md flex items-center justify-center text-lg`}>
                            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                              {p.data.avatar}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm group-hover:text-indigo-200 transition-colors">
                              {p.data.name}
                            </div>
                            <div className="text-[10px] text-slate-300 truncate max-w-[150px]">
                              {p.data.title}
                            </div>
                          </div>
                        </div>

                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black tracking-wide border border-white/10 ${p.accentText} bg-black/40`}>
                          {p.badge}
                        </span>
                      </div>

                      {/* Role summary */}
                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mt-1">
                        {p.roleSummary}
                      </p>

                      {/* Device & Workstation Attribution */}
                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Workstation:</span>
                        <strong className="text-slate-200">{p.data.assignedDeviceId}</strong>
                      </div>

                      {/* Privacy & Restriction Note */}
                      <div className="text-[10px] text-slate-400 mt-1">
                        Scope: <span className="text-slate-300 italic">{p.restrictedNotice}</span>
                      </div>
                    </div>

                    {/* Sign In Button */}
                    <button
                      type="button"
                      className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${p.btnClass}`}
                    >
                      <span>Sign In as {p.data.name.split(" ")[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Manual Email/Password Form */
            <form onSubmit={handleManualLogin} className="max-w-md mx-auto space-y-4 py-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ceo@aegis-defense.corp or analyst@aegis-defense.corp"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
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
                    placeholder="••••••••••••"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
              >
                {loading ? "Authenticating..." : "Authenticate Corporate Identity"}
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-black/60 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
          <span>Continuous Zero-Trust Attestation (NIST SP 800-207)</span>
          <button
            onClick={onClose}
            className="text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Skip & Explore Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
};
