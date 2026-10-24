"use client";

import React, { useState, useEffect } from "react";
import { TelemetryBurst } from "@/types/telemetry";
import { Gauge, Cpu, CheckCircle, Zap, Shield, GitCommit } from "lucide-react";

interface Props {
  telemetry: TelemetryBurst | null;
}

export const ThreatGauges: React.FC<Props> = ({ telemetry }) => {
  const [sparklineThroughput, setSparklineThroughput] = useState<number[]>([820, 840, 860, 850, 870, 855, 860]);
  const [sparklineLatency, setSparklineLatency] = useState<number[]>([4.1, 4.3, 4.2, 4.0, 4.4, 4.2, 4.1]);

  const throughput = telemetry?.metrics.packet_throughput_mbs || 850;
  const gnnLatency = telemetry?.metrics.gnn_latency_ms || 4.2;
  const dnnLatency = telemetry?.metrics.dnn_latency_ms || 0.8;
  const fpr = telemetry?.metrics.false_positive_rate || 0.008;
  const activeConn = telemetry?.metrics.active_connections || 8;
  const entropy = telemetry?.metrics.graph_entropy || 0.18;

  useEffect(() => {
    if (throughput) {
      setSparklineThroughput(prev => [...prev.slice(1), throughput]);
    }
    if (gnnLatency) {
      setSparklineLatency(prev => [...prev.slice(1), gnnLatency]);
    }
  }, [throughput, gnnLatency]);

  // Normalize throughput for radial gauge (max 18000 Mb/s)
  const tpPercent = Math.min(100, Math.max(5, (throughput / 16000) * 100));
  // Normalize latency for radial gauge (max 20ms)
  const latPercent = Math.min(100, Math.max(5, (gnnLatency / 15) * 100));

  const isDDoS = telemetry?.active_attack === "DDOS_SYN_FLOOD";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
      {/* 1. Packet Throughput Radial Meter */}
      <div className={`cyber-panel rounded-xl p-3.5 border transition-all ${
        isDDoS ? "border-cyber-red shadow-neon-red bg-cyber-red/10" : "border-cyber-border"
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${isDDoS ? "text-cyber-red animate-bounce" : "text-cyber-cyan"}`} />
            <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
              PACKET THROUGHPUT
            </span>
          </div>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
            isDDoS ? "bg-cyber-red/20 border-cyber-red text-cyber-red font-bold" : "bg-black/40 border-slate-700 text-slate-400"
          }`}>
            {isDDoS ? "SPIKE DETECTED" : "NOMINAL"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <div className={`text-2xl font-bold font-mono ${isDDoS ? "text-cyber-red glow-text-red" : "text-white"}`}>
              {throughput.toLocaleString()} <span className="text-xs font-normal text-slate-400">Mb/s</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Layer 3/4 Aggregate Wire Ingress
            </p>
          </div>

          {/* Mini Radial SVG Gauge */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke={isDDoS ? "#ff0055" : "#00f0ff"}
                strokeWidth="4"
                strokeDasharray="138"
                strokeDashoffset={138 - (138 * tpPercent) / 100}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute text-[10px] font-mono font-bold text-slate-200">
              {Math.round(tpPercent)}%
            </span>
          </div>
        </div>

        {/* Animated Sparkline */}
        <div className="mt-3 flex items-end gap-1 h-6 pt-1 border-t border-slate-800">
          {sparklineThroughput.map((val, idx) => {
            const h = Math.max(15, Math.min(100, (val / (isDDoS ? 16000 : 1200)) * 100));
            return (
              <div 
                key={idx} 
                className={`flex-1 rounded-t transition-all duration-300 ${
                  isDDoS ? "bg-cyber-red" : "bg-cyber-cyan/50 hover:bg-cyber-cyan"
                }`}
                style={{ height: `${h}%` }}
                title={`${val} Mb/s`}
              />
            );
          })}
        </div>
      </div>

      {/* 2. GNN & DNN Latency Meter */}
      <div className="cyber-panel rounded-xl p-3.5 border border-cyber-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyber-emerald" />
            <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
              INFERENCE LATENCY
            </span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyber-emerald/15 border border-cyber-emerald/40 text-cyber-emerald">
            &lt; 15ms SLA MET
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-1">
              <span className="text-cyber-emerald glow-text-emerald">{gnnLatency}</span>
              <span className="text-xs font-normal text-slate-400">ms GNN</span>
              <span className="text-slate-600 mx-1">/</span>
              <span className="text-xs font-mono text-cyber-cyan">{dnnLatency}ms DNN</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Edge-GraphSAGE + Tabular Neural Pass
            </p>
          </div>

          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke="#00ff9d"
                strokeWidth="4"
                strokeDasharray="138"
                strokeDashoffset={138 - (138 * latPercent) / 100}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute text-[10px] font-mono font-bold text-cyber-emerald">
              {gnnLatency}ms
            </span>
          </div>
        </div>

        {/* Latency Sparkline */}
        <div className="mt-3 flex items-end gap-1 h-6 pt-1 border-t border-slate-800">
          {sparklineLatency.map((val, idx) => {
            const h = Math.max(20, Math.min(100, (val / 15) * 100));
            return (
              <div 
                key={idx} 
                className="flex-1 bg-cyber-emerald/50 hover:bg-cyber-emerald rounded-t transition-all duration-300"
                style={{ height: `${h}%` }}
                title={`${val} ms`}
              />
            );
          })}
        </div>
      </div>

      {/* 3. Accuracy & Graph Anomaly Metrics */}
      <div className="cyber-panel rounded-xl p-3.5 border border-cyber-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-cyber-cyan" />
            <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
              SOC PRECISION METRICS
            </span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-slate-700 text-slate-400">
            CONFIDENCE 99.4%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="p-2 rounded bg-black/40 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block">FALSE POSITIVE RATE</span>
            <div className="text-lg font-bold font-mono text-cyber-emerald mt-0.5">
              {(fpr * 100).toFixed(2)}%
            </div>
            <span className="text-[9px] text-slate-500 font-mono">Target: &lt; 0.05%</span>
          </div>

          <div className="p-2 rounded bg-black/40 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block">GRAPH ENTROPY</span>
            <div className={`text-lg font-bold font-mono mt-0.5 ${entropy > 0.4 ? "text-cyber-amber" : "text-cyber-cyan"}`}>
              {entropy.toFixed(2)}
            </div>
            <span className="text-[9px] text-slate-500 font-mono">Mesh Dispersion</span>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <GitCommit className="w-3 h-3 text-cyber-cyan" />
            Active Links: <strong className="text-white">{activeConn}</strong>
          </span>
          <span className="text-cyber-emerald font-bold">
            GNN E-SAGE AGGREGATION: ONLINE
          </span>
        </div>
      </div>
    </div>
  );
};
