"use client";

import React from "react";
import { TelemetryBurst } from "@/types/telemetry";
import { Search, Binary, Hash, ArrowUpRight, BarChart3 } from "lucide-react";

interface Props {
  telemetry: TelemetryBurst | null;
}

export const FlowInspectionCard: React.FC<Props> = ({ telemetry }) => {
  const latestFlow = telemetry?.latest_flow;
  const metrics = latestFlow?.flow_metrics;
  const inference = latestFlow?.inference;

  if (!metrics || !inference) {
    return (
      <div className="w-full cyber-panel rounded-xl p-4 border border-cyber-border text-center text-xs font-mono text-slate-500">
        Waiting for packet flow inspection burst...
      </div>
    );
  }

  const isCritical = inference.severity === "CRITICAL";

  return (
    <div className="w-full cyber-panel rounded-xl p-4 border border-cyber-border flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Binary className="w-4 h-4 text-cyber-cyan" />
            <h3 className="text-xs font-bold font-mono tracking-wider text-white uppercase">
              TABULAR DNN FLOW INSPECTION
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            {latestFlow.event_id} &bull; {inference.inference_latency_ms}ms
          </span>
        </div>

        {/* Prediction Header Badge */}
        <div className={`p-2.5 rounded-lg border mb-3 flex items-center justify-between ${
          isCritical 
            ? "bg-cyber-red/15 border-cyber-red text-cyber-red shadow-neon-red" 
            : (inference.severity === "WARN" ? "bg-amber-500/15 border-amber-500 text-amber-300" : "bg-cyber-emerald/15 border-cyber-emerald text-cyber-emerald")
        }`}>
          <div>
            <span className="text-[9px] font-mono block opacity-80 uppercase">DNN CLASSIFICATION</span>
            <span className="text-sm font-bold font-mono tracking-wide">{inference.prediction}</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-mono block opacity-80 uppercase">CONFIDENCE</span>
            <span className="text-sm font-bold font-mono">{(inference.confidence * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Flow Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono mb-3">
          <div className="p-2 rounded bg-black/40 border border-slate-800">
            <span className="text-[9px] text-slate-500 block">PROTOCOL</span>
            <span className="text-cyber-cyan font-bold truncate block">{metrics.protocol}</span>
          </div>
          <div className="p-2 rounded bg-black/40 border border-slate-800">
            <span className="text-[9px] text-slate-500 block">SYN / ACK</span>
            <span className="text-slate-200">{metrics.syn_flag_count} / {metrics.ack_flag_count}</span>
          </div>
          <div className="p-2 rounded bg-black/40 border border-slate-800">
            <span className="text-[9px] text-slate-500 block">ENTROPY</span>
            <span className={`${metrics.header_entropy > 6 ? "text-cyber-red font-bold" : "text-cyber-emerald"}`}>
              {metrics.header_entropy.toFixed(2)}
            </span>
          </div>
          <div className="p-2 rounded bg-black/40 border border-slate-800">
            <span className="text-[9px] text-slate-500 block">DURATION</span>
            <span className="text-slate-200">{metrics.flow_duration_ms.toFixed(1)} ms</span>
          </div>
        </div>

        {/* Feature Importance Attribution Breakdown */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3 text-cyber-cyan" />
              Neural Feature Importance (Attribution)
            </span>
            <span>Relative Weight</span>
          </div>
          <div className="space-y-1.5">
            {Object.entries(inference.feature_contributions).slice(0, 4).map(([k, v]) => {
              const width = Math.min(100, Math.max(8, v * 30));
              return (
                <div key={k} className="text-[10px] font-mono">
                  <div className="flex justify-between text-slate-400 mb-0.5">
                    <span className="truncate">{k}</span>
                    <span className="text-slate-300">{v}</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${isCritical ? "bg-cyber-red" : "bg-cyber-cyan"}`} 
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Raw Payload Banner */}
      <div className="mt-2 p-2 rounded bg-black/70 border border-slate-800 text-[10px] font-mono">
        <span className="text-slate-500 block text-[9px] uppercase">Payload Inspection Sample:</span>
        <span className="text-slate-300 truncate block font-mono">
          {metrics.payload_sample}
        </span>
      </div>
    </div>
  );
};
