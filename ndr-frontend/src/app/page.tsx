"use client";

import React, { useState, useEffect } from "react";
import { TelemetryBurst, NetworkNode } from "@/types/telemetry";
import { telemetryClient } from "@/lib/telemetryClient";
import { CommandCenterHeader } from "@/components/CommandCenterHeader";
import { NetworkTopology3D } from "@/components/NetworkTopology3D";
import { AttackControlsDock } from "@/components/AttackControlsDock";
import { ThreatGauges } from "@/components/ThreatGauges";
import { MatrixTerminal } from "@/components/MatrixTerminal";
import { FlowInspectionCard } from "@/components/FlowInspectionCard";
import { AssetScannerModal } from "@/components/AssetScannerModal";

export default function SOCDashboard() {
  const [telemetry, setTelemetry] = useState<TelemetryBurst | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    // Subscribe to telemetry pipeline (Render WebSocket or client fallback worker)
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
    <main className="min-h-screen flex flex-col bg-cyber-bg text-slate-100">
      {/* 1. High-Tech SOC Top Navbar */}
      <CommandCenterHeader
        telemetry={telemetry}
        onOpenScanner={() => setIsScannerOpen(true)}
      />

      {/* Main Command Center Canvas & Widgets */}
      <div className="flex-1 max-w-[1920px] w-full mx-auto p-3 md:p-4 flex flex-col gap-3 md:gap-4">
        {/* 2. Top Tier: Threat & Accuracy Metric Gauges */}
        <ThreatGauges telemetry={telemetry} />

        {/* 3. Middle Tier: Interactive 3D Spatial Topology & Flow Inspector */}
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

        {/* 4. Bottom Tier: Attack Simulator Dock */}
        <AttackControlsDock telemetry={telemetry} />
      </div>

      {/* 5. Modal: Attack Surface Vulnerability & Blast Radius Scanner */}
      <AssetScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSelectNodeInTopology={(id) => {
          setSelectedNodeId(id);
          setIsScannerOpen(false);
        }}
      />
    </main>
  );
}
