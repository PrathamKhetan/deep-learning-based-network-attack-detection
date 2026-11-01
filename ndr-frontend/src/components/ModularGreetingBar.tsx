"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Layers,
  Crown,
  Shield,
  Laptop,
  Users,
  Binary,
  Brain,
  Activity,
  UserCheck,
  ChevronDown,
  RefreshCw,
  LogOut,
  Lock,
  Unlock,
  KeyRound,
  ExternalLink
} from "lucide-react";
import { useAuth } from "@/lib/authContext";

export type ActiveTabKey = "topology" | "executive" | "personnel" | "forensics" | "copilot";

interface Props {
  activeTab: ActiveTabKey;
  onTabChange: (tab: ActiveTabKey) => void;
  onOpenDeviceHud: () => void;
  onOpenAiCopilot: () => void;
  onOpenPacketDissector: () => void;
  onOpenScanner: () => void;
}

export const ModularGreetingBar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  onOpenDeviceHud,
  onOpenAiCopilot,
  onOpenPacketDissector,
  onOpenScanner
}) => {
  const {
    user,
    isCeo,
    isManager,
    isTeamLead,
    isEmployee,
    currentSector,
    setSector,
    switchUserPersona,
    openWelcomeModal,
    logout
  } = useAuth();

  const [greetingText, setGreetingText] = useState("Welcome to Aegis Enterprise Operations");
  const [timeStr, setTimeStr] = useState("");
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      if (hour < 12) setGreetingText("Good morning");
      else if (hour < 18) setGreetingText("Good afternoon");
      else setGreetingText("Good evening");

      setTimeStr(now.toTimeString().split(" ")[0] + " UTC");
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const TABS = [
    {
      id: "topology" as const,
      label: "3D Spatial Mesh & Telemetry",
      icon: <Layers className="w-4 h-4 text-cyan-400" />,
      badge: "LIVE FLOWS",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      allowed: true
    },
    {
      id: "executive" as const,
      label: "Executive Boardroom Suite",
      icon: <Crown className="w-4 h-4 text-amber-400" />,
      badge: isCeo ? "TIER 5 SOVEREIGN" : "CEO ONLY",
      badgeColor: isCeo
        ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
        : "bg-slate-800 text-slate-400 border-slate-700",
      allowed: true
    },
    {
      id: "personnel" as const,
      label: "Personnel Directory & Audits",
      icon: isEmployee ? <Lock className="w-4 h-4 text-rose-400" /> : <Users className="w-4 h-4 text-emerald-400" />,
      badge: isEmployee ? "RESTRICTED (403)" : "FULL AUDIT",
      badgeColor: isEmployee
        ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      allowed: true
    },
    {
      id: "forensics" as const,
      label: "PCAP Forensics & EDR",
      icon: <Binary className="w-4 h-4 text-purple-400" />,
      badge: "WIRESHARK",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      allowed: true
    },
    {
      id: "copilot" as const,
      label: "AI Defense Copilot",
      icon: <Brain className="w-4 h-4 text-indigo-400" />,
      badge: "HEURISTICS",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      allowed: true
    }
  ];

  return (
    <div className="w-full space-y-3">
      {/* 1. Top Colorful Modular Greeting Ribbon */}
      <div className="modular-card p-4 sm:p-5 border border-white/10 bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Left: Greeting, Avatar Picture & Title */}
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${user?.avatarGradient || "from-cyan-400 to-indigo-600"} p-0.5 shadow-lg flex items-center justify-center text-xl shrink-0 cursor-pointer hover:scale-105 transition-transform`}
            onClick={openWelcomeModal}
            title="Click to open Welcome & Account Switcher Modal"
          >
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              {user?.avatar || "👑"}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-indigo-300 font-semibold">{greetingText},</span>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                {user?.name || "Commander"}
              </h2>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider border ${
                  user?.badgeBorder || "border-indigo-400 text-indigo-300 bg-indigo-500/20"
                } bg-black/40`}
              >
                {user?.clearanceLevel?.replace("LEVEL_", "TIER-") || "TIER 5 SOVEREIGN"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5 flex-wrap">
              <span className="font-semibold text-slate-200">{user?.title}</span>
              <span className="text-slate-600 hidden sm:inline">&bull;</span>
              <span className="text-slate-400 hidden sm:inline">{user?.department}</span>
              <span className="text-slate-600 hidden md:inline">&bull;</span>
              <span className="text-emerald-400 font-mono text-[11px] hidden md:inline">
                {user?.assignedDeviceId} ({user?.assignedDeviceIp})
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Controls & Persona Selector */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Hardware EDR Pill */}
          <button
            onClick={onOpenDeviceHud}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 border border-white/10 hover:border-emerald-400/50 transition-all shadow-sm"
            title="Inspect device hardware attestation, TPM 2.0 / Apple Secure Enclave"
          >
            <Laptop className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Device Posture:</span>
            <span className="text-emerald-400 font-bold">Attested</span>
          </button>

          {/* Quick Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600/30 to-purple-600/30 hover:from-indigo-600/40 hover:to-purple-600/40 text-xs font-bold text-white border border-indigo-400/40 shadow-sm transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-300" />
              <span>Switch Account</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isPersonaMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 modular-card p-2 rounded-2xl border border-indigo-400/50 shadow-2xl z-50 space-y-1 bg-slate-950/95 backdrop-blur-2xl">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 border-b border-white/10">
                  Select Corporate Persona (CEO → Employee)
                </div>

                {/* 1. CEO */}
                <button
                  onClick={() => {
                    switchUserPersona("ceo");
                    setIsPersonaMenuOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors ${
                    user?.role === "ceo" ? "bg-amber-500/20 text-amber-300 border border-amber-400/40" : "hover:bg-white/5 text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">👑</span>
                    <div>
                      <div className="font-bold text-white">Victoria Sterling</div>
                      <div className="text-[10px] text-slate-400">CEO &bull; Tier-5 Sovereign</div>
                    </div>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">C-SUITE</span>
                </button>

                {/* 2. Manager */}
                <button
                  onClick={() => {
                    switchUserPersona("manager");
                    setIsPersonaMenuOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors ${
                    user?.role === "manager" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40" : "hover:bg-white/5 text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">👔</span>
                    <div>
                      <div className="font-bold text-white">Cmdr. Sarah Jenkins</div>
                      <div className="text-[10px] text-slate-400">Director of SOC &bull; Tier-4</div>
                    </div>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">EXEC</span>
                </button>

                {/* 3. Team Lead */}
                <button
                  onClick={() => {
                    switchUserPersona("lead");
                    setIsPersonaMenuOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors ${
                    user?.role === "team_lead" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40" : "hover:bg-white/5 text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🛡️</span>
                    <div>
                      <div className="font-bold text-white">Alexander Stone</div>
                      <div className="text-[10px] text-slate-400">Incident Lead &bull; Tier-3</div>
                    </div>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">LEAD</span>
                </button>

                {/* 4. Threat Hunter */}
                <button
                  onClick={() => {
                    switchUserPersona("hunter");
                    setIsPersonaMenuOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors ${
                    user?.role === "threat_hunter" ? "bg-purple-500/20 text-purple-300 border border-purple-400/40" : "hover:bg-white/5 text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🦅</span>
                    <div>
                      <div className="font-bold text-white">Elena Rostova</div>
                      <div className="text-[10px] text-slate-400">Cloud Hunter &bull; Tier-2</div>
                    </div>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">K8S</span>
                </button>

                {/* 5. Normal Employee */}
                <button
                  onClick={() => {
                    switchUserPersona("employee");
                    setIsPersonaMenuOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs transition-colors ${
                    user?.role === "employee" ? "bg-sky-500/20 text-sky-300 border border-sky-400/40" : "hover:bg-white/5 text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🔰</span>
                    <div>
                      <div className="font-bold text-white">David Vance</div>
                      <div className="text-[10px] text-slate-400">Analyst L1 &bull; Tier-1 Operator</div>
                    </div>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">STAFF</span>
                </button>

                <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[11px] px-1">
                  <button
                    onClick={() => {
                      setIsPersonaMenuOpen(false);
                      openWelcomeModal();
                    }}
                    className="text-indigo-400 hover:underline font-semibold"
                  >
                    Open Greeting Gateway →
                  </button>
                  <button onClick={logout} className="text-rose-400 hover:underline">
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Clock */}
          <div className="text-xs text-slate-400 font-mono hidden xl:block bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
            {timeStr}
          </div>
        </div>
      </div>

      {/* 2. Modern Modular Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`modular-card px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border-indigo-400 scale-[1.02]"
                  : "bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border-white/10"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-black tracking-wide border ${tab.badgeColor}`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
