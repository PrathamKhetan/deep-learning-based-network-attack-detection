"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Users,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Building2,
  RefreshCw,
  UserX,
  FileText,
  Activity,
  Zap,
  SlidersHorizontal,
  ChevronRight,
  Crown
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { ActionSeverity, ActionStatus } from "@/types/auth";

export default function EmployeeHistoryPage() {
  const router = useRouter();
  const {
    user,
    isCeo,
    isManager,
    isTeamLead,
    isEmployee,
    canViewAllAuditLogs,
    auditRecords,
    employeeProfiles,
    switchUserPersona,
    recordAction,
    revokeEmployeeSession
  } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const hasAccess = isCeo || isManager || isTeamLead;

  // Filtered audit records
  const filteredRecords = useMemo(() => {
    return auditRecords.filter((record) => {
      if (selectedEmployee !== "ALL" && record.employeeId !== selectedEmployee) {
        return false;
      }
      if (selectedSeverity !== "ALL" && record.severity !== selectedSeverity) {
        return false;
      }
      if (selectedStatus !== "ALL" && record.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesAction = record.action.toLowerCase().includes(q);
        const matchesTarget = record.targetResource.toLowerCase().includes(q);
        const matchesName = record.employeeName.toLowerCase().includes(q);
        const matchesIp = record.sourceIp.toLowerCase().includes(q);
        if (!matchesAction && !matchesTarget && !matchesName && !matchesIp) {
          return false;
        }
      }
      return true;
    });
  }, [auditRecords, selectedEmployee, selectedSeverity, selectedStatus, searchQuery]);

  // Export audit logs as downloadable JSON file
  const handleExportAuditReport = () => {
    const reportData = {
      reportType: "SOC_2_TYPE_II_PERSONNEL_AUDIT_REPORT",
      organization: "Aegis Cyber Defense Corp",
      generatedBy: user?.name,
      clearanceLevel: user?.clearanceLevel,
      generatedTimestamp: new Date().toISOString(),
      recordsCount: filteredRecords.length,
      auditTrail: filteredRecords
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Aegis_Employee_Audit_SOC2_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setActionSuccessMsg("Official SOC 2 personnel audit log exported to JSON.");
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Simulate a live simulated employee event
  const handleSimulateLiveAction = () => {
    const sampleActions = [
      {
        action: "Isolated Anomaly Node",
        target: "DATABASE-CLUSTER-01 [10.0.2.20]",
        severity: "CRITICAL" as ActionSeverity,
        details: "Automated trigger executed after GraphSAGE lateral threat spike."
      },
      {
        action: "Exported Forensic PCAP Buffer",
        target: "EDGE-ROUTER-WAN [10.0.1.254]",
        severity: "INFO" as ActionSeverity,
        details: "Exported 128MB pcap file for packet header attribution."
      },
      {
        action: "Restored Firewall Rule Policy",
        target: "FIREWALL-PERIMETER-01",
        severity: "WARN" as ActionSeverity,
        details: "Manual unblock applied following false-positive triage."
      }
    ];
    const picked = sampleActions[Math.floor(Math.random() * sampleActions.length)];
    recordAction(picked.action, picked.target, picked.severity, picked.details);
    setActionSuccessMsg(`New audit record registered in team history: "${picked.action}"`);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  /* =================================================================================
     CASE 1: ACCESS DENIED (WHEN LOGGED IN AS NORMAL EMPLOYEE OR OPERATOR)
     VICE VERSA NOT POSSIBLE - EMPLOYEES CANNOT VIEW EMPLOYEE HISTORY
     ================================================================================= */
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 relative">
        {/* Background Ambience */}
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none bg-rose-500/15 top-1/4" />

        {/* Corporate Breadcrumb */}
        <div className="relative z-10 w-full max-w-2xl mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Operations Command Center</span>
          </Link>
        </div>

        {/* 403 Forbidden Security Barrier Card */}
        <div className="relative z-10 w-full max-w-2xl modular-card p-6 border-rose-500/40 bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-950 shadow-2xl rounded-2xl space-y-5">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-rose-500/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <span>CLEARANCE RESTRICTION &bull; HTTP 403 FORBIDDEN</span>
                </h1>
                <p className="text-xs text-rose-300 font-medium">
                  Corporate Zero-Trust Access Policy &bull; Rule SEC-OP-403 Enforcement
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400 text-rose-300 text-xs font-bold">
              ACCESS BLOCKED
            </span>
          </div>

          {/* Explanation */}
          <div className="p-4 rounded-xl bg-black/50 border border-rose-500/20 space-y-2 text-xs leading-relaxed text-slate-300">
            <div className="text-white font-bold flex items-center gap-2 text-sm text-rose-300">
              <Lock className="w-4 h-4 text-rose-400" />
              <span>Personnel History & Supervisory Logs Are Restricted</span>
            </div>
            <p>
              You are currently authenticated as <strong>{user?.name} ({user?.title})</strong> with clearance level{" "}
              <strong>{user?.clearanceLevel}</strong>. Under Corporate Compliance Rule <strong>SEC-OP-403</strong>,
              employees and specialist operators are prohibited from viewing cross-employee histories, peer activity
              logs, or supervisory oversight data.
            </p>
          </div>

          {/* Clearance Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700">
              <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Your Identity & Clearance</div>
              <div className="text-white font-bold text-sm">{user?.name}</div>
              <div className="text-sky-300 font-semibold text-xs mt-0.5">Role: {user?.role?.toUpperCase()}</div>
              <div className="text-slate-400 text-[11px] mt-1">{user?.clearanceLevel}</div>
              <div className="mt-2 text-rose-400 flex items-center gap-1.5 text-[11px] font-bold">
                <XCircle className="w-3.5 h-3.5" />
                <span>Personnel History: ACCESS DENIED</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-400/40">
              <div className="text-amber-400 text-[10px] uppercase font-bold mb-1">Required Clearance</div>
              <div className="text-white font-bold text-sm">CEO / Manager / Team Lead</div>
              <div className="text-amber-300 font-semibold text-xs mt-0.5">Clearance: TIER 3 - TIER 5</div>
              <div className="text-slate-400 text-[11px] mt-1">Supervisory Personnel Clearance</div>
              <div className="mt-2 text-emerald-400 flex items-center gap-1.5 text-[11px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Personnel Audit: AUTHORIZED</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Switchers */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => switchUserPersona("ceo")}
              className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
            >
              <Crown className="w-4 h-4" />
              <span>Switch to CEO (Victoria Sterling)</span>
            </button>

            <button
              onClick={() => switchUserPersona("manager")}
              className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
            >
              <Unlock className="w-4 h-4" />
              <span>Switch to Manager (Cmdr. Jenkins)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =================================================================================
     CASE 2: ACCESS GRANTED (CEO, MANAGER, TEAM LEAD)
     ================================================================================= */
  return (
    <div className="min-h-screen text-slate-100 flex flex-col p-4 md:p-6 max-w-[1920px] mx-auto w-full space-y-4">
      {/* Top Header */}
      <div className="modular-card p-5 border border-white/10 bg-slate-900/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Link
            href="/"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold uppercase tracking-wider">
                SUPERVISORY CLEARANCE VERIFIED
              </span>
              <h1 className="text-lg font-black text-white">
                Personnel Directory & Operational Action History
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Aegis Corporate Governance &bull; Attributed Device Operations & Action Audits
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={handleSimulateLiveAction}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/40 text-indigo-200 font-semibold transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Simulate Employee Action</span>
          </button>

          <button
            onClick={handleExportAuditReport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/40 text-emerald-200 font-semibold transition-all"
          >
            <Download className="w-3.5 h-3.5 text-emerald-300" />
            <span>Export SOC 2 JSON</span>
          </button>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)}>✕</button>
        </div>
      )}

      {/* Directory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {employeeProfiles.map((emp) => {
          const isSelected = selectedEmployee === emp.employeeId;
          const isSuspended = emp.status === "SUSPENDED";

          return (
            <div
              key={emp.employeeId}
              onClick={() => setSelectedEmployee(isSelected ? "ALL" : emp.employeeId)}
              className={`modular-card p-4 border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-indigo-400 shadow-lg shadow-indigo-500/30 scale-[1.02] bg-indigo-950/40"
                  : "border-white/10 hover:border-white/20 bg-slate-900/60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{emp.avatar}</span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                    isSuspended
                      ? "bg-rose-500/20 text-rose-300"
                      : emp.status === "ONLINE"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {emp.status}
                </span>
              </div>

              <div className="font-bold text-white text-sm truncate">{emp.name}</div>
              <div className="text-[11px] text-slate-400 truncate">{emp.title}</div>
              <div className="text-[10px] text-indigo-300 mt-1">{emp.department}</div>

              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">Risk Score:</span>
                <span className={`font-bold ${emp.riskScore > 50 ? "text-rose-400" : "text-emerald-400"}`}>
                  {emp.riskScore}/100
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table of Audit Records */}
      <div className="modular-card rounded-2xl border border-white/10 bg-slate-900/70 overflow-hidden space-y-3">
        {/* Filter bar */}
        <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter actions by keyword, resource, or employee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
            >
              <option value="ALL">All Employees</option>
              {employeeProfiles.map((e) => (
                <option key={e.employeeId} value={e.employeeId}>
                  {e.name}
                </option>
              ))}
            </select>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="WARN">Warning</option>
              <option value="INFO">Info</option>
            </select>
          </div>
        </div>

        {/* Records Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Event ID / Time</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Action Performed</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Source IP</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-indigo-300">{r.id}</div>
                    <div className="text-[10px] text-slate-400">{r.timestamp}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{r.employeeName}</div>
                    <div className="text-[10px] text-slate-400">{r.department}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-200">{r.action}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-black/40 border border-slate-700 text-slate-300">
                      {r.targetResource}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{r.sourceIp}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.severity === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-300"
                          : r.severity === "WARN"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {r.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-400">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
