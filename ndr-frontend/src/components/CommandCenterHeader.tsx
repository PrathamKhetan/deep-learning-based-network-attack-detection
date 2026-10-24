"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, ShieldCheck, Activity, Cpu, Network, Radio, AlertTriangle } from "lucide-react";
import { TelemetryBurst } from "@/types/telemetry";
import { telemetryClient } from "@/lib/telemetryClient";

interface Props {
  telemetry: TelemetryBurst | null;
  onOpenScanner: () => void;
}

export const CommandCenterHeader: React.FC<Props> = ({ telemetry, onOpenScanner }) => {
  const [connectionStatus, setConnectionStatus] = useState<string>("connecting");
  const [timeStr, setTimeStr] = useState<string>("");

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

  return (
    <header className="relative w-full cyber-panel border-b border-cyber-border px-4 py-3 z-30">
      <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Brand & SOC Title */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
              isAttack 
                ? "bg-cyber-red/20 border-cyber-red animate-pulse-fast text-cyber-red shadow-neon-red" 
                : "bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan shadow-neon-cyan"
            }`}>
              {isAttack ? <ShieldAlert className="w-6 h-6 animate-bounce" /> : <ShieldCheck className="w-6 h-6" />}
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAttack ? "bg-cyber-red" : "bg-cyber-emerald"}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isAttack ? "bg-cyber-red" : "bg-cyber-emerald"}`}></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-wider text-white uppercase flex items-center gap-2">
                CYBER-NDR <span className="text-xs px-2 py-0.5 rounded bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan font-mono">v2.0-PROD</span>
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                DUAL-ENGINE SOC
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono tracking-tight">
              Tabular DNN Flow Inspector &bull; E-GraphSAGE Topological GNN Engine
            </p>
          </div>
        </div>

        {/* Center: Real-time Threat Status Banner */}
        <div className="flex items-center gap-3">
          {isAttack ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyber-red/15 border border-cyber-red/50 text-cyber-red animate-pulse">
              <AlertTriangle className="w-4 h-4 animate-spin text-cyber-red" />
              <span className="text-xs font-bold font-mono tracking-wider">
                ACTIVE ATTACK: {telemetry?.attack_metadata?.name || telemetry?.active_attack}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald">
              <Activity className="w-4 h-4 text-cyber-emerald" />
              <span className="text-xs font-mono tracking-wide">
                SYSTEM NOMINAL &bull; 0 CRITICAL INTRUSIONS
              </span>
            </div>
          )}

          {/* Quick ASM Scanner trigger */}
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded bg-cyber-cyan/15 hover:bg-cyber-cyan/25 border border-cyber-cyan/50 text-cyber-cyan transition-all shadow-sm hover:shadow-neon-cyan"
          >
            <Network className="w-4 h-4" />
            <span>ASM VULNERABILITY MATRIX</span>
          </button>
        </div>

        {/* Right: Engine Telemetry & Connection Status */}
        <div className="flex items-center gap-4 text-xs font-mono">
          {/* Latency Quick Pill */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-black/40 border border-slate-800 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>GNN: <strong className="text-cyber-cyan">{telemetry?.metrics.gnn_latency_ms || 4.2}ms</strong></span>
            <span className="text-slate-600">|</span>
            <span>DNN: <strong className="text-cyber-emerald">{telemetry?.metrics.dnn_latency_ms || 0.8}ms</strong></span>
          </div>

          {/* Connection Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1 rounded border bg-black/60">
            <Radio className={`w-3.5 h-3.5 ${
              connectionStatus === "connected_render" 
                ? "text-cyber-emerald animate-pulse" 
                : "text-cyber-cyan animate-pulse"
            }`} />
            <div className="flex flex-col text-right">
              <span className={`text-[10px] font-bold ${
                connectionStatus === "connected_render" ? "text-cyber-emerald" : "text-cyber-cyan"
              }`}>
                {connectionStatus === "connected_render" ? "RENDER WEBSOCKET LIVE" : "CLIENT SIMULATION WORKER"}
              </span>
              <span className="text-[9px] text-slate-400">
                {connectionStatus === "connected_render" ? "FASTAPI HOSTED" : "VERCEL STANDALONE MODE"}
              </span>
            </div>
          </div>

          {/* Clock */}
          <div className="hidden lg:block text-slate-400 font-mono text-xs">
            {timeStr || "12:00:00 UTC"}
          </div>
        </div>
      </div>
    </header>
  );
};
