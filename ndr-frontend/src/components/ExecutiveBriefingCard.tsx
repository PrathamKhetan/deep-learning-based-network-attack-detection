"use client";

import React from "react";
import {
  Crown,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  AlertOctagon,
  Building2,
  Lock,
  Users,
  CheckCircle2,
  FileText,
  Zap,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/lib/authContext";

export const ExecutiveBriefingCard: React.FC = () => {
  const { user, isCeo, isManager, executiveBriefing, toggleCrisisMode, switchUserPersona } = useAuth();

  /* ===================================================================================
     IF NORMAL EMPLOYEE / THREAT HUNTER / TEAM LEAD ATTEMPTS ACCESS
     CLEAR RESTRICTION: CEO BOARDROOM CLEARANCE REQUIRED
     =================================================================================== */
  if (!isCeo && !isManager) {
    return (
      <div className="modular-card p-6 border border-amber-500/30 bg-gradient-to-br from-slate-900/90 via-amber-950/20 to-slate-900/90 shadow-xl rounded-2xl text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
          <Lock className="w-7 h-7" />
        </div>
        <div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-400 font-bold uppercase tracking-wider">
            RESTRICTED EXECUTIVE CLEARANCE &bull; TIER 5 REQUIRED
          </span>
          <h2 className="text-lg font-bold text-white mt-2">
            Executive Boardroom & Financial Risk Suite
          </h2>
          <p className="text-xs text-slate-300 max-w-lg mx-auto mt-1 leading-relaxed">
            You are currently authenticated as <strong>{user?.name} ({user?.title})</strong>. Corporate financial
            contingency pools, boardroom risk indices, and sovereign M&A assets are strictly confidential and
            restricted to the Chief Executive Officer.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => switchUserPersona("ceo")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-xs shadow-lg shadow-amber-500/30 hover:scale-105 transition-all inline-flex items-center gap-2"
          >
            <Crown className="w-4 h-4" />
            <span>Switch to CEO Account (Victoria Sterling)</span>
          </button>
        </div>
      </div>
    );
  }

  /* ===================================================================================
     CEO VIEW: FULL STRATEGIC BRIEFING & EXECUTIVE BOARDROOM OVERSIGHT
     =================================================================================== */
  return (
    <div className="space-y-4">
      {/* 1. Executive KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Financial Asset Protected */}
        <div className="modular-card p-5 bg-gradient-to-br from-amber-500/15 via-slate-900/80 to-slate-950 border-amber-400/30 hover:border-amber-400/60 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Asset Value Protected</span>
            <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{executiveBriefing.quarterlyBudgetProtected}</div>
          <div className="text-[11px] text-slate-300 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>0 Downtime &bull; 100% SLA Maintained</span>
          </div>
        </div>

        {/* Metric 2: Compliance Index */}
        <div className="modular-card p-5 bg-gradient-to-br from-emerald-500/15 via-slate-900/80 to-slate-950 border-emerald-400/30 hover:border-emerald-400/60 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Regulatory Compliance</span>
            <div className="p-2 rounded-xl bg-emerald-400/20 text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{executiveBriefing.complianceRating}</div>
          <div className="text-[11px] text-slate-300 mt-1">
            Audited under SOC 2 Type II & ISO 27001
          </div>
        </div>

        {/* Metric 3: Corporate Risk Score */}
        <div className="modular-card p-5 bg-gradient-to-br from-indigo-500/15 via-slate-900/80 to-slate-950 border-indigo-400/30 hover:border-indigo-400/60 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Corporate Risk Index</span>
            <div className="p-2 rounded-xl bg-indigo-400/20 text-indigo-300">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {executiveBriefing.corporateRiskIndex} <span className="text-xs font-normal text-slate-400">/ 100 (Low Risk)</span>
          </div>
          <div className="text-[11px] text-slate-300 mt-1">
            Enterprise threat exposure minimized
          </div>
        </div>

        {/* Metric 4: Crisis Mode Sovereign Authority */}
        <div className="modular-card p-5 bg-gradient-to-br from-purple-500/15 via-slate-900/80 to-slate-950 border-purple-400/30 hover:border-purple-400/60 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Crisis Authority</span>
            <div className="p-2 rounded-xl bg-purple-400/20 text-purple-300">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-white font-bold">
              {executiveBriefing.crisisModeActive ? "🔴 CRISIS MODE ACTIVE" : "🟢 STANDBY NORMAL"}
            </span>

            {isCeo && (
              <button
                onClick={toggleCrisisMode}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  executiveBriefing.crisisModeActive
                    ? "bg-rose-600 text-white shadow-rose-500/40"
                    : "bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-400/40"
                }`}
              >
                {executiveBriefing.crisisModeActive ? "Disarm Crisis" : "Toggle Crisis"}
              </button>
            )}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">CEO Sovereign Air-Gap Toggle</div>
        </div>
      </div>

      {/* 2. Executive Organizational Chart & Department Visibility */}
      <div className="modular-card p-6 border border-white/10 bg-slate-900/70 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                Aegis Corporate Organizational Structure & Clearance Hierarchy
              </h3>
              <p className="text-xs text-slate-400">
                Tier-1 through Tier-5 sovereign oversight & departmental segregation
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
            CEO Master Audit Access Granted
          </span>
        </div>

        {/* Tree Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Node 1: Director */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-cyan-500/30 hover:border-cyan-400 transition-all">
            <div className="text-[10px] text-cyan-400 font-bold uppercase mb-1">Direct Report 1: Operations</div>
            <div className="font-bold text-white text-sm">Cmdr. Sarah Jenkins</div>
            <div className="text-[11px] text-slate-300">Director of Cyber Defense</div>
            <div className="mt-2 text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3 h-3" />
              <span>Full Mesh Ingress Active</span>
            </div>
          </div>

          {/* Node 2: Team Lead */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-emerald-500/30 hover:border-emerald-400 transition-all">
            <div className="text-[10px] text-emerald-400 font-bold uppercase mb-1">Direct Report 2: Incident Lead</div>
            <div className="font-bold text-white text-sm">Alexander Stone</div>
            <div className="text-[11px] text-slate-300">Incident Commander</div>
            <div className="mt-2 text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3 h-3" />
              <span>Alpha Shift Assigned</span>
            </div>
          </div>

          {/* Node 3: Cloud Hunter */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-purple-500/30 hover:border-purple-400 transition-all">
            <div className="text-[10px] text-purple-400 font-bold uppercase mb-1">Specialist 1: Cloud Mesh</div>
            <div className="font-bold text-white text-sm">Elena Rostova</div>
            <div className="text-[11px] text-slate-300">Senior Threat Hunter</div>
            <div className="mt-2 text-[10px] text-purple-300 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3 h-3" />
              <span>eBPF Container Triage</span>
            </div>
          </div>

          {/* Node 4: Operator */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-sky-500/30 hover:border-sky-400 transition-all">
            <div className="text-[10px] text-sky-400 font-bold uppercase mb-1">Operator 1: DMZ Triage</div>
            <div className="font-bold text-white text-sm">David Vance</div>
            <div className="text-[11px] text-slate-300">Tier-1 Security Analyst</div>
            <div className="mt-2 text-[10px] text-sky-300 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3 h-3" />
              <span>Local DMZ Scoped</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
