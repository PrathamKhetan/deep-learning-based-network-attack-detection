"use client";

import React from "react";
import { AttackType, TelemetryBurst } from "@/types/telemetry";
import { Zap, Radio, Globe, ShieldOff, Play, Square, AlertOctagon } from "lucide-react";
import { telemetryClient } from "@/lib/telemetryClient";

interface Props {
  telemetry: TelemetryBurst | null;
}

interface AttackOption {
  type: AttackType;
  title: string;
  tagline: string;
  category: string;
  icon: React.ReactNode;
  severityColor: string;
}

const ATTACK_OPTIONS: AttackOption[] = [
  {
    type: "DDOS_SYN_FLOOD",
    title: "Volumetric DDoS / SYN Flood",
    tagline: "High-rate TCP state exhaustion burst",
    category: "L4 Transport",
    icon: <Zap className="w-4 h-4" />,
    severityColor: "border-cyber-red text-cyber-red"
  },
  {
    type: "STEALTH_RECON",
    title: "Stealth Recon Sweep",
    tagline: "Horizontal TCP SYN/FIN lateral scan",
    category: "L3 Reconnaissance",
    icon: <Radio className="w-4 h-4" />,
    severityColor: "border-cyber-amber text-cyber-amber"
  },
  {
    type: "APPLAYER_EXPLOIT",
    title: "App-Layer SQLi / XSS Exploit",
    tagline: "Obfuscated SQL injection & RCE stream",
    category: "L7 Application",
    icon: <Globe className="w-4 h-4" />,
    severityColor: "border-cyber-red text-cyber-red"
  },
  {
    type: "ROGUE_NODE_JOIN",
    title: "Rogue Unauthenticated Node",
    tagline: "Shadow host injection & ARP poisoning",
    category: "L2 Ingress",
    icon: <ShieldOff className="w-4 h-4" />,
    severityColor: "border-cyber-red text-cyber-red"
  }
];

export const AttackControlsDock: React.FC<Props> = ({ telemetry }) => {
  const activeAttack = telemetry?.active_attack || null;

  const handleToggle = (type: AttackType) => {
    if (activeAttack === type) {
      telemetryClient.triggerAttack(null);
    } else {
      telemetryClient.triggerAttack(type);
    }
  };

  const handleDisarm = () => {
    telemetryClient.triggerAttack(null);
  };

  return (
    <div className="w-full cyber-panel rounded-xl p-4 border border-cyber-border">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyber-red animate-ping" />
          <h2 className="text-xs font-bold font-mono tracking-wider text-white uppercase flex items-center gap-1.5">
            LIVE ATTACK & STRESS-TESTING SUITE
          </h2>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-red/10 border border-cyber-red/40 text-cyber-red font-mono">
            SANDBOX ENVIRONMENT
          </span>
        </div>

        {activeAttack && (
          <button
            onClick={handleDisarm}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-cyber-red/20 hover:bg-cyber-red/30 border border-cyber-red text-cyber-red text-xs font-mono font-bold transition-all shadow-neon-red animate-pulse"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>DISARM / CLEAR ATTACK</span>
          </button>
        )}
      </div>

      {/* Grid of Attack Switches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ATTACK_OPTIONS.map((opt) => {
          const isActive = activeAttack === opt.type;
          return (
            <div
              key={opt.type}
              onClick={() => handleToggle(opt.type)}
              className={`cursor-pointer p-3 rounded-lg border transition-all duration-200 relative overflow-hidden group ${
                isActive
                  ? "bg-cyber-red/20 border-cyber-red shadow-neon-red ring-1 ring-cyber-red"
                  : "bg-black/40 hover:bg-black/60 border-slate-800 hover:border-cyber-cyan/40"
              }`}
            >
              {/* Glowing Corner Accents */}
              <div className={`absolute top-0 right-0 w-8 h-8 pointer-events-none transition-opacity ${
                isActive ? "opacity-100 bg-cyber-red/20" : "opacity-0 group-hover:opacity-100 bg-cyber-cyan/10"
              }`} />

              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className={`p-1.5 rounded border ${
                  isActive ? "bg-cyber-red text-black border-cyber-red" : "bg-slate-900 border-slate-700 text-slate-300"
                }`}>
                  {opt.icon}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {opt.category}
                  </span>
                  <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                    isActive ? "border-cyber-red bg-cyber-red" : "border-slate-600 bg-transparent"
                  }`}>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
                  </div>
                </div>
              </div>

              <h3 className={`font-mono font-bold text-xs ${isActive ? "text-white glow-text-red" : "text-slate-200"}`}>
                {opt.title}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5 line-clamp-1">
                {opt.tagline}
              </p>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className={isActive ? "text-cyber-red font-bold animate-pulse" : "text-slate-500"}>
                  {isActive ? "SIMULATING STREAM..." : "CLICK TO LAUNCH"}
                </span>
                <span className="text-slate-500 flex items-center gap-1">
                  {isActive ? <AlertOctagon className="w-3 h-3 text-cyber-red" /> : <Play className="w-2.5 h-2.5" />}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Attack Status Details Banner */}
      {activeAttack && telemetry?.attack_metadata && (
        <div className="mt-3 p-2.5 rounded-lg bg-cyber-red/10 border border-cyber-red/40 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-cyber-red font-bold uppercase tracking-wider">
              [VECTOR INJECTION]
            </span>
            <span className="text-slate-300">
              {telemetry.attack_metadata.description}
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Source: <strong className="text-cyber-cyan">{telemetry.attack_metadata.source}</strong></span>
            <span>&rarr;</span>
            <span>Target: <strong className="text-cyber-red">{telemetry.attack_metadata.target}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
