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
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { ActionSeverity, ActionStatus } from "@/types/auth";

export default function EmployeeHistoryPage() {
  const router = useRouter();
  const {
    user,
    isManager,
    isEmployee,
    auditRecords,
    employeeProfiles,
    switchRole,
    recordAction,
    revokeEmployeeSession
  } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

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
     CASE 1: ACCESS DENIED (WHEN LOGGED IN AS EMPLOYEE)
     VICE VERSA NOT POSSIBLE - EMPLOYEES CANNOT VIEW EMPLOYEE HISTORY
     ================================================================================= */
  if (isEmployee || !isManager) {
    return (
      <div className="min-h-screen bg-cyber-bg flex flex-col justify-center items-center px-4 py-8 relative">
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none bg-cyber-red/15 top-1/4" />

        {/* Corporate Breadcrumb */}
        <div className="relative z-10 w-full max-w-2xl mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyber-cyan transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to SOC Command Dashboard</span>
          </Link>
        </div>

        {/* 403 Forbidden Security Barrier Card */}
        <div className="relative z-10 w-full max-w-2xl cyber-panel-red rounded-xl overflow-hidden border border-cyber-red/60 shadow-2xl">
          {/* Header Bar */}
          <div className="bg-black/80 px-6 py-4 border-b border-cyber-red/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyber-red/20 border border-cyber-red flex items-center justify-center text-cyber-red shadow-neon-red">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-wider text-cyber-red uppercase flex items-center gap-2">
                  <span>SECURITY VIOLATION &bull; HTTP 403 FORBIDDEN</span>
                </h1>
                <p className="text-xs text-slate-400 font-mono">
                  Corporate Zero-Trust Access Gateway &bull; Policy Enforcement Rule SEC-802
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded bg-cyber-red/20 border border-cyber-red text-cyber-red text-xs font-mono font-bold animate-pulse">
              RESTRICTED
            </span>
          </div>

          {/* Core Access Barrier Explanation */}
          <div className="p-6 space-y-5 font-mono text-xs">
            <div className="p-4 rounded-lg bg-black/60 border border-cyber-red/30 space-y-2">
              <div className="text-slate-200 font-bold uppercase tracking-wider text-sm flex items-center gap-2 text-cyber-red">
                <Lock className="w-4 h-4 text-cyber-red" />
                <span>Personnel Operational History Is Restricted to Managers</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                You are currently authenticated as an <strong>Employee (Level 2 Operator)</strong>. Under Aegis
                Corporate Security Policy <strong>SEC-OP-403</strong>, employee accounts are strictly prohibited from
                viewing personnel audit logs, peer employee histories, or managerial oversight data.
              </p>
            </div>

            {/* Clearance Comparison Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-700">
                <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Your Identity & Clearance</div>
                <div className="text-white font-bold text-sm">{user?.name || "David Vance"}</div>
                <div className="text-cyber-purple font-mono text-xs mt-0.5">Role: {user?.role?.toUpperCase()}</div>
                <div className="text-slate-400 text-[11px] mt-1">Clearance: LEVEL_2_OPERATOR</div>
                <div className="mt-2 text-cyber-red flex items-center gap-1.5 text-[11px] font-semibold">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Access to Employee History: DENIED</span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/80 border border-cyber-cyan/40">
                <div className="text-cyber-cyan text-[10px] uppercase font-bold mb-1">Required Clearance</div>
                <div className="text-white font-bold text-sm">Manager / SOC Commander</div>
                <div className="text-cyber-cyan font-mono text-xs mt-0.5">Role: MANAGER</div>
                <div className="text-slate-400 text-[11px] mt-1">Clearance: LEVEL_4_EXECUTIVE</div>
                <div className="mt-2 text-cyber-emerald flex items-center gap-1.5 text-[11px] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Full Personnel History: AUTHORIZED</span>
                </div>
              </div>
            </div>

            {/* Compliance Policy Note */}
            <div className="p-3 bg-black/40 rounded border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="font-bold text-slate-300">Why is vice-versa not possible?</div>
              <p>
                In corporate cyber defense operations, managers possess supervisory oversight over team actions to detect
                insider threats and audit remediation workflows. Tier 1/2 employees are compartmentalized to personal
                workstation telemetry to prevent unauthorized lateral surveillance between peer analysts.
              </p>
            </div>

            {/* Action Buttons for Easy Testing on Vercel */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => switchRole("manager")}
                className="w-full sm:w-auto flex-1 py-3 px-4 rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-cyber-cyan/20 hover:bg-cyber-cyan/30 border border-cyber-cyan text-cyber-cyan shadow-neon-cyan transition-all"
              >
                <Unlock className="w-4 h-4 text-cyber-cyan" />
                <span>Switch to Manager Role (Test Unlocked View)</span>
              </button>

              <Link
                href="/"
                className="w-full sm:w-auto py-3 px-4 rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all text-center"
              >
                <span>Return to Command Center</span>
              </Link>
            </div>
          </div>

          {/* Footer Warning */}
          <div className="bg-black/90 px-6 py-2.5 border-t border-cyber-red/30 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>AUDIT EVENT LOGGED: SEC_FORBIDDEN_ATTEMPT</span>
            <span>INCIDENT ID: #SEC-403-{Date.now().toString().slice(-6)}</span>
          </div>
        </div>
      </div>
    );
  }

  /* =================================================================================
     CASE 2: ACCESS GRANTED (WHEN LOGGED IN AS MANAGER)
     MANAGERS ARE ABLE TO SEE ALL EMPLOYEE HISTORY & AUDIT LOGS
     ================================================================================= */
  return (
    <div className="min-h-screen bg-cyber-bg text-slate-100 flex flex-col">
      {/* Top Corporate Command Bar */}
      <header className="relative w-full cyber-panel border-b border-cyber-border px-4 py-3 z-30">
        <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-4 font-mono">
          {/* Left: Branding & Page Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyber-cyan border border-slate-700 transition-all"
              title="Return to SOC Command Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan font-bold">
                  EXECUTIVE AUDIT SUITE
                </span>
                <h1 className="text-sm md:text-base font-bold text-white uppercase tracking-wider">
                  EMPLOYEE OPERATIONAL HISTORY & AUDIT TRAIL
                </h1>
              </div>
              <p className="text-[11px] text-slate-400">
                Aegis Cyber Defense Systems &bull; Level 4 Supervisory Oversight & Compliance
              </p>
            </div>
          </div>

          {/* Center: Clearance Stamp */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-md bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald text-xs">
            <ShieldCheck className="w-4 h-4 text-cyber-emerald" />
            <span>MANAGER CLEARANCE VERIFIED &bull; FULL PERSONNEL AUDIT ACCESS GRANTED</span>
          </div>

          {/* Right: Quick Switcher / Export Controls */}
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={handleSimulateLiveAction}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyber-cyan/15 hover:bg-cyber-cyan/25 border border-cyber-cyan/40 text-cyber-cyan transition-all"
              title="Add a simulated live employee action to the audit trail"
            >
              <Zap className="w-3.5 h-3.5 text-cyber-amber" />
              <span>Simulate Employee Action</span>
            </button>

            <button
              onClick={handleExportAuditReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export SOC 2 Report</span>
            </button>

            {/* Quick Demo Switcher to Employee Role */}
            <button
              onClick={() => switchRole("employee")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-cyber-purple/20 hover:bg-cyber-purple/30 border border-cyber-purple/40 text-purple-200 transition-all text-[11px]"
              title="Test the 403 Forbidden lockout by switching to Employee role"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Test Employee View (Blocked)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 md:p-6 flex flex-col gap-5 font-mono">
        {/* Banner Notification if an action occurred */}
        {actionSuccessMsg && (
          <div className="p-3 rounded-lg bg-cyber-emerald/15 border border-cyber-emerald/50 text-cyber-emerald text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button onClick={() => setActionSuccessMsg(null)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* 1. Top Tier: Supervisory KPI Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="cyber-panel p-4 rounded-xl border border-cyber-border">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>MONITORED PERSONNEL</span>
              <Users className="w-4 h-4 text-cyber-cyan" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {employeeProfiles.length} <span className="text-xs text-cyber-emerald font-normal">Active</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Tier 1 & Tier 2 SOC Operators</div>
          </div>

          <div className="cyber-panel p-4 rounded-xl border border-cyber-border">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>LOGGED SHIFT ACTIONS</span>
              <Activity className="w-4 h-4 text-cyber-emerald" />
            </div>
            <div className="text-2xl font-bold text-cyber-emerald tracking-tight">
              {auditRecords.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">100% Attributed with Source IP</div>
          </div>

          <div className="cyber-panel p-4 rounded-xl border border-cyber-border">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>FLAGGED / CRITICAL EVENTS</span>
              <AlertTriangle className="w-4 h-4 text-cyber-red" />
            </div>
            <div className="text-2xl font-bold text-cyber-red tracking-tight">
              {auditRecords.filter((r) => r.severity === "CRITICAL" || r.status === "FLAGGED").length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Requires Managerial Sign-Off</div>
          </div>

          <div className="cyber-panel p-4 rounded-xl border border-cyber-border">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>COMPLIANCE STATUS</span>
              <ShieldCheck className="w-4 h-4 text-cyber-cyan" />
            </div>
            <div className="text-2xl font-bold text-cyber-cyan tracking-tight">SOC 2 / ISO</div>
            <div className="text-[11px] text-slate-400 mt-1">Continuous Audit Hash: Valid</div>
          </div>
        </div>

        {/* 2. Middle Tier: Personnel Directory & Status Overview */}
        <div className="cyber-panel p-4 rounded-xl border border-cyber-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyber-cyan" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                ACTIVE SOC PERSONNEL DIRECTORY
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Click personnel card to filter action history</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {employeeProfiles.map((emp) => {
              const isSelected = selectedEmployee === emp.employeeId;
              const isSuspended = emp.status === "SUSPENDED";

              return (
                <div
                  key={emp.employeeId}
                  onClick={() => setSelectedEmployee(isSelected ? "ALL" : emp.employeeId)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-cyber-cyan/15 border-cyber-cyan shadow-neon-cyan"
                      : "bg-black/40 border-slate-800 hover:border-slate-700"
                  } ${isSuspended ? "opacity-60 border-cyber-red/50" : ""}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-slate-400">{emp.employeeId}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                        isSuspended
                          ? "bg-cyber-red/20 text-cyber-red border border-cyber-red"
                          : emp.status === "ONLINE"
                          ? "bg-cyber-emerald/20 text-cyber-emerald"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </div>

                  <div className="font-bold text-white text-xs truncate">{emp.name}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{emp.title}</div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Risk Score:</span>
                    <span
                      className={`font-bold ${
                        emp.riskScore > 50
                          ? "text-cyber-red"
                          : emp.riskScore > 20
                          ? "text-cyber-amber"
                          : "text-cyber-emerald"
                      }`}
                    >
                      {emp.riskScore}/100
                    </span>
                  </div>

                  {/* Manager Session Revocation Action */}
                  <div className="mt-2 flex items-center justify-between gap-1">
                    <span className="text-[9px] text-slate-500 truncate">{emp.assignedWorkstation}</span>
                    {!isSuspended && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Revoke active token and suspend clearance for ${emp.name}?`)) {
                            revokeEmployeeSession(emp.employeeId);
                          }
                        }}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-cyber-red/15 hover:bg-cyber-red/30 border border-cyber-red/40 text-cyber-red shrink-0"
                        title="Revoke active employee session token"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Lower Tier: Action History Log with Search & Filter Controls */}
        <div className="cyber-panel rounded-xl border border-cyber-border overflow-hidden flex flex-col">
          {/* Filter Bar */}
          <div className="p-4 bg-black/60 border-b border-cyber-border flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search by action, target resource, employee name, or IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-cyber-cyan rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Filter Selectors */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Filter by Employee */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300">
                <Users className="w-3.5 h-3.5 text-cyber-cyan" />
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Employees ({auditRecords.length})</option>
                  {employeeProfiles.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.name} ({emp.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Severity */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300">
                <Filter className="w-3.5 h-3.5 text-cyber-cyan" />
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Severities</option>
                  <option value="CRITICAL">Critical Only</option>
                  <option value="WARN">Warning Only</option>
                  <option value="INFO">Info Only</option>
                </select>
              </div>

              {/* Reset Filters */}
              {(selectedEmployee !== "ALL" || selectedSeverity !== "ALL" || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedEmployee("ALL");
                    setSelectedSeverity("ALL");
                    setSelectedStatus("ALL");
                    setSearchQuery("");
                  }}
                  className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Audit Records Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black/40 text-slate-400 border-b border-cyber-border text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Event ID / Time</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Action Performed</th>
                  <th className="py-3 px-4">Target Resource</th>
                  <th className="py-3 px-4">Source IP</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Risk</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-500">
                      No employee audit actions match the current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* ID & Time */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-cyber-cyan">{record.id}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{record.timestamp}</span>
                        </div>
                      </td>

                      {/* Employee */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-white">{record.employeeName}</div>
                        <div className="text-[10px] text-slate-400">
                          {record.employeeId} &bull; {record.department}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200">{record.action}</div>
                      </td>

                      {/* Target */}
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-black/40 border border-slate-700">
                          {record.targetResource}
                        </span>
                      </td>

                      {/* IP */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                        {record.sourceIp}
                      </td>

                      {/* Severity */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            record.severity === "CRITICAL"
                              ? "bg-cyber-red/20 text-cyber-red border border-cyber-red/40"
                              : record.severity === "WARN"
                              ? "bg-cyber-amber/20 text-cyber-amber border border-cyber-amber/40"
                              : "bg-slate-800 text-slate-300 border border-slate-700"
                          }`}
                        >
                          {record.severity}
                        </span>
                      </td>

                      {/* Risk Score */}
                      <td className="py-3 px-4 whitespace-nowrap font-bold">
                        <span
                          className={
                            record.riskScore > 50
                              ? "text-cyber-red"
                              : record.riskScore > 20
                              ? "text-cyber-amber"
                              : "text-cyber-emerald"
                          }
                        >
                          {record.riskScore}/100
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                            record.status === "SUCCESS"
                              ? "text-cyber-emerald"
                              : record.status === "FLAGGED"
                              ? "text-cyber-red animate-pulse"
                              : "text-slate-400"
                          }`}
                        >
                          {record.status === "SUCCESS" ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          )}
                          <span>{record.status}</span>
                        </span>
                      </td>

                      {/* Details */}
                      <td className="py-3 px-4 text-slate-400 max-w-xs truncate text-[11px]">
                        {record.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Status */}
          <div className="p-3 bg-black/60 border-t border-cyber-border flex items-center justify-between text-[11px] text-slate-500">
            <span>Showing {filteredRecords.length} of {auditRecords.length} recorded personnel events</span>
            <span>Cryptographic Chain: HMAC-SHA256 VERIFIED</span>
          </div>
        </div>
      </main>
    </div>
  );
}

