"use client";

import React, { useState, useEffect } from "react";
import {
  Brain,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  X,
  Sparkles,
  Flame,
  ArrowRight,
  Terminal,
  ChevronRight,
  Cpu
} from "lucide-react";
import { AiSecurityRecommendation } from "@/types/telemetry";
import { telemetryClient } from "@/lib/telemetryClient";
import { useAuth } from "@/lib/authContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AiSecurityCopilot: React.FC<Props> = ({ isOpen, onClose }) => {
  const { recordAction, user, currentSector } = useAuth();
  const [recommendations, setRecommendations] = useState<AiSecurityRecommendation[]>([]);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setRecommendations(telemetryClient.getAiRecommendations());
    }
  }, [isOpen, currentSector]);

  const handleExecute = (rec: AiSecurityRecommendation) => {
    setExecutingId(rec.id);
    setTimeout(() => {
      telemetryClient.executeAiRecommendation(rec.id);
      recordAction(
        `AI Autonomous Defense Deployed: ${rec.recommendedCountermeasure}`,
        rec.affectedTarget,
        "CRITICAL",
        `Aegis Neuro-SOC AI agent executed autonomous containment. Blast radius mitigated by ${rec.blastRadiusMitigationPct}%.`
      );
      setRecommendations(telemetryClient.getAiRecommendations());
      setExecutingId(null);
      setSuccessBanner(`Autonomous Countermeasure Deployed: ${rec.recommendedCountermeasure}`);
      setTimeout(() => setSuccessBanner(null), 4500);
    }, 1100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl cyber-panel rounded-2xl border border-cyber-cyan/50 shadow-2xl overflow-hidden flex flex-col font-mono text-xs">
        {/* Header */}
        <div className="bg-black/80 px-6 py-4 border-b border-cyber-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan shadow-neon-cyan animate-pulse">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>AEGIS NEURO-SOC &bull; AUTONOMOUS AI COPILOT</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan">
                    HEURISTIC v3.4
                  </span>
                </h2>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Real-Time Neural Anomaly Correlation &bull; Autonomous Micro-Containment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black/40 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Banner */}
        {successBanner && (
          <div className="px-6 py-2.5 bg-cyber-emerald/20 border-b border-cyber-emerald/50 text-cyber-emerald flex items-center justify-between text-xs animate-fadeIn">
            <span className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              {successBanner}
            </span>
            <span className="text-[10px]">Zero-Trust Enforcement Active</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* AI Threat Summary Pill */}
          <div className="p-4 rounded-xl bg-black/50 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Active Scope Evaluation</div>
              <div className="text-sm font-bold text-white uppercase">{currentSector} SECTOR MESH</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Operator: <strong className="text-cyber-cyan">{user?.name}</strong> &bull; Workstation: {user?.assignedDeviceId}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Neural Confidence</div>
              <div className="text-xl font-black text-cyber-emerald">99.2%</div>
              <div className="text-[10px] text-slate-500">Inference: 0.8ms</div>
            </div>
          </div>

          {/* List of AI Recommendations */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Prioritized Heuristic Incident Containment Actions</span>
            </div>

            {recommendations.map((rec) => {
              const isBusy = executingId === rec.id;
              return (
                <div
                  key={rec.id}
                  className={`p-4 rounded-xl border transition-all ${
                    rec.executed
                      ? "bg-cyber-emerald/10 border-cyber-emerald/40"
                      : "bg-black/60 border-slate-800 hover:border-cyber-cyan/40"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 border border-slate-700 text-cyber-cyan">
                          {rec.id}
                        </span>
                        <h3 className="font-bold text-white text-xs">{rec.threatTitle}</h3>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Target Resource: <span className="text-slate-200 font-semibold">{rec.affectedTarget}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-emerald/15 border border-cyber-emerald/30 text-cyber-emerald font-bold">
                        {rec.blastRadiusMitigationPct}% Blast Radius Mitigation
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-cyan/15 border border-cyber-cyan/30 text-cyber-cyan font-bold">
                        {rec.confidencePct}% Confidence
                      </span>
                    </div>
                  </div>

                  {/* Recommendation Action Block */}
                  <div className="mt-3 p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-slate-300 text-xs">
                      <Zap className="w-4 h-4 text-cyber-amber shrink-0 animate-pulse" />
                      <span>{rec.recommendedCountermeasure}</span>
                    </div>

                    {rec.executed ? (
                      <span className="flex items-center gap-1.5 text-cyber-emerald font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>CONTAINMENT ENFORCED</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleExecute(rec)}
                        disabled={isBusy}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-cyan/20 hover:bg-cyber-cyan/30 border border-cyber-cyan text-cyber-cyan font-bold text-xs transition-all shadow-neon-cyan shrink-0"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>{isBusy ? "DEPLOYING CANARY..." : "DEPLOY AUTONOMOUS COUNTERMEASURE"}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-black/90 px-6 py-3 border-t border-cyber-border flex items-center justify-between text-[10px] text-slate-500">
          <span>Continuous ML Attestation: Tabular DNN Flow Classifier &bull; E-GraphSAGE GNN Active</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
          >
            Close Copilot
          </button>
        </div>
      </div>
    </div>
  );
};
