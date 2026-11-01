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
import { Layers, Laptop, ShieldCheck, Activity, Cpu, Radio, Sparkles } from "lucide-react";

export default function SOCDashboard() {
  const { user, currentSector, isManager } = useAuth();
  const [telemetry, setTelemetry] = useState<TelemetryBurst | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
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

  return (
    <main className="min-h-screen flex flex-col bg-cyber-bg text-slate-100 font-mono">
      {/* 1. High-Tech SOC Top Navbar */}
      <CommandCenterHeader
        telemetry={telemetry}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenDeviceHud={() => setIsDeviceHudOpen(true)}
        onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
        onOpenPacketDissector={() => setIsPacketDissectorOpen(true)}
      />

      {/* 2. Device & Sector Identification Ribbon */}
      <div className="w-full bg-black/60 border-b border-cyber-border/60 px-4 py-1.5 text-xs">
        <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="flex items-center gap-1.5 text-cyber-cyan font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>ACTIVE SECTOR:</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan font-bold uppercase">
              {telemetry?.sector_name || "Global Multi-Zone Enterprise Backbone"}
            </span>

            <span className="text-slate-600 hidden sm:inline">&bull;</span>

            <span className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <Laptop className="w-3.5 h-3.5 text-cyber-emerald" />
              <span>Assigned Workstation:</span>
              <strong className="text-cyber-emerald font-bold">{user?.assignedDeviceId || "WS-SOC-104"}</strong>
              <span className="text-slate-400">({user?.assignedDeviceIp || "10.0.4.12"})</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[10px]">
            <span className="hidden md:inline">
              Operator: <strong className="text-white">{user?.name}</strong> [{user?.clearanceLevel}]
            </span>
            <span className="flex items-center gap-1 text-cyber-emerald font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>Device Security: Attested (TPM 2.0 / Enclave)</span>
            </span>
            <button
              onClick={() => setIsAiCopilotOpen(true)}
              className="text-cyber-cyan hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-cyber-amber" />
              <span>AI Copilot Heuristics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Command Center Canvas & Widgets */}
      <div className="flex-1 max-w-[1920px] w-full mx-auto p-3 md:p-4 flex flex-col gap-3 md:gap-4">
        {/* 3. Top Tier: Threat & Accuracy Metric Gauges */}
        <ThreatGauges telemetry={telemetry} />

        {/* 4. Middle Tier: Interactive 3D Spatial Topology & Flow Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 flex-1">
          {/* Left: 3D Network Topology Spatial Command Center (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col min-h-[520px]">
            <NetworkTopology3D
              telemetry={telemetry}
              onSelectNode={handleSelectNode}
              selectedNodeId={selectedNodeId}
            />
          </div>

          {/* Right: Live Flow Header Inspector & Tabular DNN Attribution (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <FlowInspectionCard telemetry={telemetry} />
            <div className="flex-1">
              <MatrixTerminal latestLog={telemetry?.log || null} />
            </div>
          </div>
        </div>

        {/* 5. Bottom Tier: Attack Simulator Dock */}
        <AttackControlsDock telemetry={telemetry} />
      </div>

      {/* 6. Modals */}
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
