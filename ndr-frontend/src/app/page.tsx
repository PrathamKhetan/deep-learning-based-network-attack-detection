"use client";

import React, { useState, useEffect } from "react";
import { TelemetryBurst, NetworkNode } from "@/types/telemetry";
import { telemetryClient } from "@/lib/telemetryClient";
import { useAuth } from "@/lib/authContext";
import { CommandCenterHeader } from "@/components/CommandCenterHeader";
import { NetworkTopology3D } from "@/components/NetworkTopology3D";
import { AttackControlsDock } from "@/components/AttackControlsDock";
import { ThreatGauges } from "@/components/ThreatGauges";
import { MatrixTerminal } from "@/components/MatrixTerminal";
import { FlowInspectionCard } from "@/components/FlowInspectionCard";
import { AssetScannerModal } from "@/components/AssetScannerModal";
import { DeviceHealthHUD } from "@/components/DeviceHealthHUD";
import { AiSecurityCopilot } from "@/components/AiSecurityCopilot";
import { RawPacketDissector } from "@/components/RawPacketDissector";
import { WelcomeGreetingModal } from "@/components/WelcomeGreetingModal";
import { ModularGreetingBar, ActiveTabKey } from "@/components/ModularGreetingBar";
import { ExecutiveBriefingCard } from "@/components/ExecutiveBriefingCard";
import Link from "next/link";
import {
  Layers,
  Laptop,
  ShieldCheck,
  Activity,
  Cpu,
  Radio,
  Sparkles,
  Crown,
  Users,
  Binary,
  Brain,
  Lock,
  ArrowRight
} from "lucide-react";

export default function SOCDashboard() {
  const {
    user,
    currentSector,
    isCeo,
    isManager,
    isTeamLead,
    isEmployee,
    isWelcomeModalOpen,
    closeWelcomeModal,
    openWelcomeModal
  } = useAuth();

  const [telemetry, setTelemetry] = useState<TelemetryBurst | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTabKey>("topology");

  // Modals
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isDeviceHudOpen, setIsDeviceHudOpen] = useState(false);
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState(false);
  const [isPacketDissectorOpen, setIsPacketDissectorOpen] = useState(false);

  useEffect(() => {
    // Subscribe to telemetry pipeline
    const unsubscribe = telemetryClient.subscribe((burst) => {
      setTelemetry(burst);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSelectNode = (node: NetworkNode) => {
    setSelectedNodeId(node.id);
  };

  const handleTabChange = (tab: ActiveTabKey) => {
    if (tab === "forensics") {
      setIsPacketDissectorOpen(true);
    } else if (tab === "copilot") {
      setIsAiCopilotOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <main className="min-h-screen flex flex-col text-slate-100 relative selection:bg-indigo-500 selection:text-white">
      {/* 1. Modern Top Header */}
      <CommandCenterHeader
        telemetry={telemetry}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenDeviceHud={() => setIsDeviceHudOpen(true)}
        onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
        onOpenPacketDissector={() => setIsPacketDissectorOpen(true)}
      />

      {/* Main Command Center Canvas & Widgets */}
      <div className="flex-1 max-w-[1920px] w-full mx-auto p-3 sm:p-5 flex flex-col gap-4">
        {/* 2. Modular Greeting & Navigation Bar */}
        <ModularGreetingBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onOpenDeviceHud={() => setIsDeviceHudOpen(true)}
          onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
          onOpenPacketDissector={() => setIsPacketDissectorOpen(true)}
          onOpenScanner={() => setIsScannerOpen(true)}
        />

        {/* 3. Conditional Modular Views based on Active Tab */}

        {/* TAB 1: 3D Spatial Topology & Telemetry Stream */}
        {activeTab === "topology" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            {/* Device & Sector Scoped Indicator Ribbon */}
            <div className="modular-card px-4 py-2 bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Layers className="w-4 h-4" />
                  <span>ACTIVE SECTOR MESH:</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold uppercase">
                  {telemetry?.sector_name || "Global Multi-Zone Enterprise Backbone"}
                </span>

                <span className="text-slate-600 hidden sm:inline">&bull;</span>

                <span className="hidden sm:flex items-center gap-1.5 text-slate-300">
                  <Laptop className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Workstation:</span>
                  <strong className="text-emerald-400">{user?.assignedDeviceId || "WS-SOC-104"}</strong>
                  <span className="text-slate-400 font-mono">({user?.assignedDeviceIp || "10.0.4.12"})</span>
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-300 text-xs">
                <span className="hidden md:inline">
                  Assigned Operator: <strong className="text-white">{user?.name}</strong> [{user?.clearanceLevel?.replace("LEVEL_", "TIER-")}]
                </span>
                <button
                  onClick={() => setIsAiCopilotOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>Neuro-SOC Heuristics</span>
                </button>
              </div>
            </div>

            {/* Top Tier: Threat & Accuracy Metric Gauges */}
            <ThreatGauges telemetry={telemetry} />

            {/* Middle Tier: Interactive 3D Spatial Topology & Flow Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
              {/* Left: 3D Network Topology Spatial Command Center (8 Cols) */}
              <div className="lg:col-span-8 flex flex-col min-h-[520px]">
                <NetworkTopology3D
                  telemetry={telemetry}
                  onSelectNode={handleSelectNode}
                  selectedNodeId={selectedNodeId}
                />
              </div>

              {/* Right: Live Flow Header Inspector & Tabular DNN Attribution (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <FlowInspectionCard telemetry={telemetry} />
                <div className="flex-1 min-h-[260px]">
                  <MatrixTerminal latestLog={telemetry?.log || null} />
                </div>
              </div>
            </div>

            {/* Bottom Tier: Attack Simulator Dock */}
            <AttackControlsDock telemetry={telemetry} />
          </div>
        )}

        {/* TAB 2: Executive Boardroom Suite (CEO & Manager) */}
        {activeTab === "executive" && (
          <div className="animate-fadeIn">
            <ExecutiveBriefingCard />
          </div>
        )}

        {/* TAB 3: Personnel Directory & Operational Action History */}
        {activeTab === "personnel" && (
          <div className="animate-fadeIn">
            {isEmployee ? (
              /* Access Denied for Normal Employee */
              <div className="modular-card p-8 border border-rose-500/40 bg-gradient-to-br from-slate-900/90 via-rose-950/20 to-slate-900/90 shadow-2xl text-center space-y-4 max-w-2xl mx-auto rounded-2xl">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-400 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
                  <Lock className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400 text-rose-300 font-bold uppercase tracking-wider">
                    POLICY ENFORCEMENT &bull; HTTP 403 FORBIDDEN
                  </span>
                  <h2 className="text-xl font-bold text-white mt-2">
                    Personnel Operational History Is Restricted
                  </h2>
                  <p className="text-xs text-slate-300 max-w-md mx-auto mt-1 leading-relaxed">
                    You are logged in as <strong>{user?.name} ({user?.title})</strong>. Under Corporate Security Policy
                    <strong> SEC-OP-403</strong>, employee accounts cannot inspect supervisory logs or peer actions.
                    Only CEOs, Managers, and Team Leads possess clearance to view personnel history.
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={openWelcomeModal}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-xs shadow-lg shadow-amber-500/30 hover:scale-105 transition-all inline-flex items-center gap-2"
                  >
                    <span>Switch to CEO / Manager Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Full Personnel Hub for CEO, Manager, Team Lead */
              <div className="modular-card p-6 border border-white/10 bg-slate-900/70 space-y-4 rounded-2xl">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-bold text-white text-base">
                      Authorized Personnel Directory & Team Action Log
                    </h3>
                    <p className="text-xs text-slate-400">
                      Clearance: {user?.clearanceLevel} &bull; Full supervisory action visibility active
                    </p>
                  </div>
                  <Link
                    href="/employee-history"
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
                  >
                    <span>Open Standalone Fullscreen Audit Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300">
                  <p>
                    Full cross-employee action histories, source IPs, risk ratings, and session revocation tools
                    are accessible. Click the button above to view the complete interactive data table.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Modals */}
      {/* Default Greeting & Login Modal on Page Open */}
      <WelcomeGreetingModal
        isOpen={isWelcomeModalOpen}
        onClose={closeWelcomeModal}
      />

      {/* Asset Scanner & Blast Radius */}
      <AssetScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSelectNodeInTopology={(id) => {
          setSelectedNodeId(id);
          setIsScannerOpen(false);
        }}
      />

      {/* Device & Hardware EDR Telemetry HUD */}
      <DeviceHealthHUD
        isOpen={isDeviceHudOpen}
        onClose={() => setIsDeviceHudOpen(false)}
      />

      {/* AI Cyber Defense Copilot */}
      <AiSecurityCopilot
        isOpen={isAiCopilotOpen}
        onClose={() => setIsAiCopilotOpen(false)}
      />

      {/* Raw Hexadecimal Packet Dissector */}
      <RawPacketDissector
        isOpen={isPacketDissectorOpen}
        onClose={() => setIsPacketDissectorOpen(false)}
      />
    </main>
  );
}
