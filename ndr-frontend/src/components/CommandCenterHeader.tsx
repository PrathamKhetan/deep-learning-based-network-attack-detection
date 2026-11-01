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
  UserCheck
} from "lucide-react";
import { TelemetryBurst } from "@/types/telemetry";
import { telemetryClient } from "@/lib/telemetryClient";
import { useAuth } from "@/lib/authContext";

interface Props {
  telemetry: TelemetryBurst | null;
  onOpenScanner: () => void;
}

export const CommandCenterHeader: React.FC<Props> = ({ telemetry, onOpenScanner }) => {
  const { user, isManager, isEmployee, switchRole } = useAuth();
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
    <header className="relative w-full cyber-panel border-b border-cyber-border px-4 py-2.5 z-30">
      <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand & SOC Title */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 hover:opacity-95 transition-opacity">
            <div className="relative">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                  isAttack
                    ? "bg-cyber-red/20 border-cyber-red animate-pulse-fast text-cyber-red shadow-neon-red"
                    : "bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan shadow-neon-cyan"
                }`}
              >
                {isAttack ? <ShieldAlert className="w-5 h-5 animate-bounce" /> : <ShieldCheck className="w-5 h-5" />}
              </div>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isAttack ? "bg-cyber-red" : "bg-cyber-emerald"
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isAttack ? "bg-cyber-red" : "bg-cyber-emerald"
                  }`}
                />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-wider text-white uppercase flex items-center gap-1.5">
                  AEGIS-NDR <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan font-mono">v2.0-PROD</span>
                </h1>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  ENTERPRISE SOC
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight">
                Tabular DNN Flow Inspector &bull; E-GraphSAGE Topological GNN
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Threat Status & Employee History Access Hub */}
        <div className="flex items-center gap-2 flex-wrap font-mono">
          {/* Active Attack or System Nominal Banner */}
          {isAttack ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyber-red/15 border border-cyber-red/50 text-cyber-red animate-pulse text-xs">
              <AlertTriangle className="w-3.5 h-3.5 animate-spin text-cyber-red" />
              <span className="text-[11px] font-bold tracking-wider">
                ACTIVE THREAT: {telemetry?.attack_metadata?.name || telemetry?.active_attack}
              </span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald text-xs">
              <Activity className="w-3.5 h-3.5 text-cyber-emerald" />
              <span className="text-[11px] tracking-wide">
                SYSTEM NOMINAL &bull; 0 CRITICAL INTRUSIONS
              </span>
            </div>
          )}

          {/* Quick ASM Scanner Trigger */}
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-cyber-cyan/15 hover:bg-cyber-cyan/25 border border-cyber-cyan/50 text-cyber-cyan transition-all shadow-sm"
          >
            <Network className="w-3.5 h-3.5" />
            <span className="text-[11px]">ASM MATRIX</span>
          </button>

          {/* The Key Feature: Employee Audit & Operational History Access Button */}
          <Link
            href="/employee-history"
            className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded transition-all font-semibold ${
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
              <Unlock className="w-3.5 h-3.5 text-cyber-emerald animate-pulse" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-cyber-red" />
            )}
            <span className="text-[11px]">
              {isManager ? "EMPLOYEE AUDIT LOGS (GRANTED)" : "EMPLOYEE HISTORY (RESTRICTED)"}
            </span>
          </Link>
        </div>

        {/* Right: Role Identity Pill, Quick Switcher & Telemetry Metrics */}
        <div className="flex items-center gap-3 text-xs font-mono">
          {/* User Profile Pill with Role Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/60 border border-slate-800">
            <div className="flex items-center gap-1.5">
              <UserCheck className={`w-3.5 h-3.5 ${isManager ? "text-cyber-emerald" : "text-cyber-purple"}`} />
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold text-white leading-tight">
                  {user?.name || "Cmdr. Sarah Jenkins"}
                </span>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-[9px] px-1 py-0.1 rounded font-bold uppercase ${
                      isManager
                        ? "bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40"
                        : "bg-cyber-purple/20 text-purple-200 border border-cyber-purple/40"
                    }`}
                  >
                    {isManager ? "MANAGER (TIER 4)" : "EMPLOYEE (TIER 2)"}
                  </span>
                  <span className="text-[9px] text-slate-500 hidden xl:inline">
                    {user?.department}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick 1-Click Role Switcher for instant testing on Vercel */}
            <button
              onClick={() => switchRole(isManager ? "employee" : "manager")}
              className="ml-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[10px] flex items-center gap-1 transition-all"
              title={`Instantly toggle session to test ${isManager ? "Employee (Blocked)" : "Manager (Full Access)"}`}
            >
              <RefreshCw className="w-2.5 h-2.5 text-cyber-amber" />
              <span>Switch to {isManager ? "Employee" : "Manager"}</span>
            </button>

            {/* Link to Corporate Login Portal */}
            <Link
              href="/login"
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyber-cyan transition-colors"
              title="Corporate SSO / Portal Selection"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Connection Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded border border-slate-800 bg-black/60">
            <Radio
              className={`w-3 h-3 ${
                connectionStatus === "connected_render"
                  ? "text-cyber-emerald animate-pulse"
                  : "text-cyber-cyan animate-pulse"
              }`}
            />
            <div className="flex flex-col text-right">
              <span
                className={`text-[9px] font-bold ${
                  connectionStatus === "connected_render" ? "text-cyber-emerald" : "text-cyber-cyan"
                }`}
              >
                {connectionStatus === "connected_render" ? "RENDER WEBSOCKET" : "CLIENT SIMULATION"}
              </span>
              <span className="text-[8px] text-slate-500">
                {connectionStatus === "connected_render" ? "FASTAPI HOSTED" : "VERCEL MODE"}
              </span>
            </div>
          </div>

          {/* Clock */}
          <div className="hidden 2xl:block text-slate-400 font-mono text-xs">
            {timeStr || "12:00:00 UTC"}
          </div>
        </div>
      </div>
    </header>
  );
};
