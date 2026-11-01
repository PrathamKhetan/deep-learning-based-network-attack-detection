"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Cpu,
  Network,
  Radio,
  AlertTriangle,
  Lock,
  Unlock,
  Users,
  LogOut,
  Building2,
  RefreshCw,
  UserCheck,
  Laptop,
  Brain,
  Binary,
  Layers,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { TelemetryBurst, SectorScope } from "@/types/telemetry";
import { telemetryClient } from "@/lib/telemetryClient";
import { useAuth } from "@/lib/authContext";

interface Props {
  telemetry: TelemetryBurst | null;
  onOpenScanner: () => void;
  onOpenDeviceHud: () => void;
  onOpenAiCopilot: () => void;
  onOpenPacketDissector: () => void;
}

export const CommandCenterHeader: React.FC<Props> = ({
  telemetry,
  onOpenScanner,
  onOpenDeviceHud,
  onOpenAiCopilot,
  onOpenPacketDissector
}) => {
  const {
    user,
    isManager,
    isEmployee,
    currentSector,
    setSector,
    switchUserPersona
  } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<string>("connecting");
  const [timeStr, setTimeStr] = useState<string>("");
  const [isPersonaOpen, setIsPersonaOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsub = telemetryClient.subscribeStatus(setConnectionStatus);
    const timer = setInterval(() => {
      const d = new Date();
      setTimeStr(d.toTimeString().split(" ")[0] + " UTC");
    }, 1000);
    return () => {
      unsub();
      clearInterval(timer);
    };
  }, []);

  const isAttack = Boolean(telemetry?.active_attack);

  const SECTOR_OPTIONS: { id: SectorScope; name: string; employee: string; device: string }[] = [
    { id: "global", name: "🌐 Global Enterprise Backbone", employee: "Cmdr. Sarah Jenkins (Manager)", device: "EXEC-CONSOLE (10.0.0.99)" },
    { id: "dmz_analyst", name: "🛡️ Sector B: DMZ & Perimeter Ingress", employee: "David Vance (Analyst L2)", device: "WS-SOC-104 (10.0.4.12)" },
    { id: "cloud_hunter", name: "🦅 Sector C: Cloud K8s Mesh", employee: "Elena Rostova (Threat Hunter L3)", device: "WS-SOC-208 (10.0.4.18)" },
    { id: "lan_junior", name: "🔰 Sector A: Corporate LAN Fleet", employee: "Marcus Chen (Junior Analyst L1)", device: "WS-SOC-312 (10.0.4.29)" }
  ];

  return (
    <header className="relative w-full cyber-panel border-b border-cyber-border px-3 py-2 z-30 font-mono text-xs">
      <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* 1. Left: Brand & SOC Identification */}
        <div className="flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-95 transition-opacity">
            <div className="relative">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                  isAttack
                    ? "bg-cyber-red/20 border-cyber-red animate-pulse-fast text-cyber-red shadow-neon-red"
                    : "bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan shadow-neon-cyan"
                }`}
              >
                {isAttack ? <ShieldAlert className="w-4 h-4 animate-bounce" /> : <ShieldCheck className="w-4 h-4" />}
              </div>
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isAttack ? "bg-cyber-red" : "bg-cyber-emerald"
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isAttack ? "bg-cyber-red" : "bg-cyber-emerald"
                  }`}
                />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold tracking-wider text-white uppercase flex items-center gap-1">
                  AEGIS-NDR <span className="text-[9px] px-1 py-0.2 rounded bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan">v2.0</span>
                </h1>
                <span className="text-[9px] px-1.5 py-0.1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  DUAL-ENGINE SOC
                </span>
              </div>
              <p className="text-[9px] text-slate-400">
                Tabular DNN &bull; E-GraphSAGE GNN
              </p>
            </div>
          </Link>
        </div>

        {/* 2. Center-Left: SECTOR & WORKSTATION SCOPE SELECTOR */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 border border-cyber-border">
            <Layers className="w-3.5 h-3.5 text-cyber-cyan shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">
                {isManager ? "MANAGER SECTOR SCOPE:" : "LOCKED WORKSTATION SCOPE:"}
              </span>
              {isManager ? (
                <select
                  value={currentSector}
                  onChange={(e) => setSector(e.target.value as SectorScope)}
                  className="bg-transparent text-cyber-cyan text-[11px] font-bold focus:outline-none cursor-pointer"
                >
                  {SECTOR_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-slate-900 text-white">
                      {opt.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-cyber-purple text-[11px] font-bold truncate max-w-[200px]">
                  {SECTOR_OPTIONS.find((s) => s.id === currentSector)?.name || "Assigned Sector"}
                </span>
              )}
            </div>
          </div>

          {/* Device & Hardware EDR Pill */}
          <button
            onClick={onOpenDeviceHud}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-slate-800 border border-slate-700 hover:border-cyber-cyan text-slate-300 hover:text-white transition-all"
            title="Click to view detected device hardware, Secure Enclave, and WireGuard status"
          >
            <Laptop className="w-3.5 h-3.5 text-cyber-emerald" />
            <div className="text-left hidden sm:block">
              <div className="text-[8px] text-slate-400 uppercase font-bold">DEVICE EDR</div>
              <div className="text-[10px] text-cyber-emerald font-bold truncate max-w-[120px]">
                {user?.assignedDeviceId || "WS-SOC-104"}
              </div>
            </div>
          </button>
        </div>

        {/* 3. Center-Right: CRAZY NEW ACTION BUTTONS (AI COPILOT & RAW PACKET DISSECTOR) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* AI Security Copilot Button */}
          <button
            onClick={onOpenAiCopilot}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyber-cyan/15 hover:bg-cyber-cyan/25 border border-cyber-cyan/50 text-cyber-cyan transition-all shadow-neon-cyan animate-pulse"
            title="Open AI Neuro-SOC Copilot & Autonomous Threat Containment"
          >
            <Brain className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold">AI COPILOT</span>
          </button>

          {/* Raw Hex Packet Dissector Button */}
          <button
            onClick={onOpenPacketDissector}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 hover:border-cyber-cyan text-slate-300 hover:text-white transition-all"
            title="Open Wireshark-grade Hexadecimal Packet Sniffer & Dissector"
          >
            <Binary className="w-3.5 h-3.5 text-cyber-amber" />
            <span className="text-[10px]">0x PCAP SNIFFER</span>
          </button>

          {/* Quick ASM Scanner Trigger */}
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all"
          >
            <Network className="w-3.5 h-3.5 text-cyber-cyan" />
            <span className="text-[10px]">ASM MATRIX</span>
          </button>

          {/* Employee Audit Button */}
          <Link
            href="/employee-history"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all font-semibold ${
              isManager
                ? "bg-cyber-cyan/20 hover:bg-cyber-cyan/30 border border-cyber-cyan text-cyber-cyan shadow-neon-cyan"
                : "bg-slate-800/80 hover:bg-cyber-red/20 border border-slate-700 hover:border-cyber-red/50 text-slate-300 hover:text-cyber-red"
            }`}
            title={
              isManager
                ? "Manager Clearance Verified: Access full personnel action audit trail"
                : "Employee Access Restriction: Personnel audit logs restricted to Managers"
            }
          >
            {isManager ? (
              <Unlock className="w-3 h-3 text-cyber-emerald animate-pulse" />
            ) : (
              <Lock className="w-3 h-3 text-cyber-red" />
            )}
            <span className="text-[10px]">
              {isManager ? "AUDIT LOGS" : "AUDIT (403)"}
            </span>
          </Link>
        </div>

        {/* 4. Right: EMPLOYEE / PERSONA QUICK SWITCHER & LOGOUT */}
        <div className="flex items-center gap-2">
          {/* Quick Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaOpen(!isPersonaOpen)}
              className="flex items-center gap-2 px-2 py-1 rounded-lg bg-black/80 border border-slate-700 hover:border-cyber-cyan text-left transition-all"
              title="Click to switch between Manager and different employees with distinct devices and data"
            >
              <UserCheck className={`w-3.5 h-3.5 ${isManager ? "text-cyber-emerald" : "text-cyber-purple"}`} />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-white leading-tight truncate max-w-[100px]">
                  {user?.name || "Cmdr. Jenkins"}
                </span>
                <span
                  className={`text-[8px] font-bold uppercase ${
                    isManager ? "text-cyber-cyan" : "text-purple-300"
                  }`}
                >
                  {isManager ? "MANAGER" : "EMPLOYEE"}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Persona Switcher Dropdown Menu */}
            {isPersonaOpen && (
              <div className="absolute right-0 mt-1 w-64 cyber-panel rounded-xl border border-cyber-cyan shadow-2xl p-2 z-50 space-y-1">
                <div className="text-[9px] uppercase font-bold text-slate-400 px-2 py-1 border-b border-slate-800">
                  Switch Employee Persona & Device
                </div>

                {/* 1. Victoria Sterling (CEO) */}
                <button
                  onClick={() => {
                    switchUserPersona("ceo");
                    setIsPersonaOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-[11px] transition-colors ${
                    user?.id === "usr_ceo_001"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-400"
                      : "hover:bg-slate-800/80 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>👑</span>
                    <div>
                      <div className="font-bold text-white">Victoria Sterling</div>
                      <div className="text-[9px] text-slate-400">CEO &bull; Tier-5 Sovereign</div>
                    </div>
                  </div>
                  <span className="text-[9px] text-amber-300 font-bold">C-SUITE</span>
                </button>

                {/* 2. Sarah Jenkins (Manager) */}
                <button
                  onClick={() => {
                    switchUserPersona("manager");
                    setIsPersonaOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-[11px] transition-colors ${
                    user?.id === "usr_mgr_001"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400"
                      : "hover:bg-slate-800/80 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>👔</span>
                    <div>
                      <div className="font-bold text-white">Cmdr. Sarah Jenkins</div>
                      <div className="text-[9px] text-slate-400">Director of SOC &bull; Tier-4</div>
                    </div>
                  </div>
                  <span className="text-[9px] text-cyan-300 font-bold">EXEC</span>
                </button>

                {/* 3. Alexander Stone (Lead) */}
                <button
                  onClick={() => {
                    switchUserPersona("lead");
                    setIsPersonaOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-[11px] transition-colors ${
                    user?.id === "usr_lead_002"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400"
                      : "hover:bg-slate-800/80 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🛡️</span>
                    <div>
                      <div className="font-bold text-white">Alexander Stone</div>
                      <div className="text-[9px] text-slate-400">Incident Lead &bull; Tier-3</div>
                    </div>
                  </div>
                  <span className="text-[9px] text-emerald-300 font-bold">LEAD</span>
                </button>

                {/* 4. Elena Rostova (Hunter) */}
                <button
                  onClick={() => {
                    switchUserPersona("hunter");
                    setIsPersonaOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-[11px] transition-colors ${
                    user?.id === "usr_hunter_003"
                      ? "bg-purple-500/20 text-purple-200 border border-purple-400"
                      : "hover:bg-slate-800/80 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🦅</span>
                    <div>
                      <div className="font-bold text-white">Elena Rostova</div>
                      <div className="text-[9px] text-slate-400">Threat Hunter L3 &bull; Tier-2</div>
                    </div>
                  </div>
                  <span className="text-[9px] text-purple-300 font-bold">K8S</span>
                </button>

                {/* 5. David Vance (Normal Employee) */}
                <button
                  onClick={() => {
                    switchUserPersona("employee");
                    setIsPersonaOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-[11px] transition-colors ${
                    user?.id === "usr_emp_442"
                      ? "bg-sky-500/20 text-sky-200 border border-sky-400"
                      : "hover:bg-slate-800/80 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🔰</span>
                    <div>
                      <div className="font-bold text-white">David Vance</div>
                      <div className="text-[9px] text-slate-400">Analyst L1 &bull; Tier-1 Operator</div>
                    </div>
                  </div>
                  <span className="text-[9px] text-sky-300 font-bold">STAFF</span>
                </button>
              </div>
            )}
          </div>

          {/* Link to Unified Corporate Portal */}
          <Link
            href="/login"
            className="p-1.5 rounded-lg bg-black/60 border border-slate-700 hover:border-cyber-cyan text-slate-400 hover:text-cyber-cyan transition-colors"
            title="Log out / Switch Corporate Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
};
