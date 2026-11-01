"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthUser, EmployeeAuditRecord, EmployeeProfile, UserRole, ExecutiveBriefing } from "@/types/auth";
import { SectorScope } from "@/types/telemetry";
import { telemetryClient } from "./telemetryClient";

/* ===================================================================================
   5 COMPLETE CORPORATE PERSONAS: FROM CEO TO NORMAL EMPLOYEE
   =================================================================================== */

// 1. CEO / C-Suite Sovereign
export const DEMO_CEO: AuthUser = {
  id: "usr_ceo_001",
  name: "Victoria Sterling",
  email: "ceo@aegis-defense.corp",
  role: "ceo",
  clearanceLevel: "LEVEL_5_SOVEREIGN",
  department: "Executive Office & Board of Directors",
  title: "Chief Executive Officer & Board Chair",
  employeeId: "CORP-EXEC-0001",
  avatar: "👑",
  avatarGradient: "from-amber-400 via-rose-500 to-indigo-600",
  badgeBorder: "border-amber-400 shadow-amber-500/30",
  shift: "Executive Availability (24/7 Global Sovereign)",
  activeSessionId: "SES-CEO-00001-SOV",
  lastLogin: "Today, 07:45 UTC",
  assignedSector: "global",
  assignedDeviceId: "CEO-SECURE-IPAD-MAX",
  assignedDeviceIp: "10.0.0.1",
  quote: "Corporate integrity and shareholder trust are maintained through uncompromising zero-trust governance.",
  permissions: [
    "VIEW_EXECUTIVE_BRIEFING",
    "VIEW_BOARD_FINANCIAL_METRICS",
    "VIEW_ALL_MANAGERS",
    "VIEW_ALL_EMPLOYEES",
    "INSPECT_FULL_AUDIT_TRAIL",
    "AUTHORIZE_CRISIS_SHUTDOWN",
    "OVERRIDE_ENTERPRISE_POLICIES",
    "FULL_SECTOR_JUMP"
  ]
};

// 2. Director of SOC / Security Manager
export const DEMO_MANAGER: AuthUser = {
  id: "usr_mgr_001",
  name: "Cmdr. Sarah Jenkins",
  email: "manager@aegis-defense.corp",
  role: "manager",
  clearanceLevel: "LEVEL_4_EXECUTIVE",
  department: "Security Command & Threat Operations",
  title: "Director of Cyber Defense Operations",
  employeeId: "CORP-MGR-0091",
  avatar: "👔",
  avatarGradient: "from-cyan-400 via-blue-500 to-indigo-600",
  badgeBorder: "border-cyan-400 shadow-cyan-500/30",
  shift: "Alpha Command (08:00 - 18:00 UTC)",
  activeSessionId: "SES-MGR-99482-SEC",
  lastLogin: "Today, 08:14 UTC",
  assignedSector: "global",
  assignedDeviceId: "EXEC-MACBOOK-M3MAX",
  assignedDeviceIp: "10.0.0.99",
  quote: "Full operational visibility ensures zero unmonitored lateral transitions across our network mesh.",
  permissions: [
    "VIEW_ALL_EMPLOYEES",
    "INSPECT_AUDIT_LOGS",
    "EXPORT_SOC2_COMPLIANCE",
    "REVOKE_CREDENTIALS",
    "ISOLATE_NODES",
    "TRIGGER_ATTACK_SIMULATIONS",
    "FULL_TOPOLOGY_CONTROL",
    "FULL_SECTOR_JUMP"
  ]
};

// 3. Incident Response & Operations Lead
export const DEMO_TEAM_LEAD: AuthUser = {
  id: "usr_lead_002",
  name: "Alexander Stone",
  email: "lead@aegis-defense.corp",
  role: "team_lead",
  clearanceLevel: "LEVEL_3_OPERATIONS_LEAD",
  department: "Incident Response & Forensics",
  title: "Incident Commander & Operations Lead",
  employeeId: "CORP-LEAD-2041",
  avatar: "🛡️",
  avatarGradient: "from-emerald-400 via-teal-500 to-cyan-600",
  badgeBorder: "border-emerald-400 shadow-emerald-500/30",
  shift: "Alpha Shift Lead (07:00 - 16:00 UTC)",
  activeSessionId: "SES-LEAD-48190-OP",
  lastLogin: "Today, 07:10 UTC",
  assignedSector: "dmz_analyst",
  assignedDeviceId: "STONE-THINKPAD-P16",
  assignedDeviceIp: "10.0.3.15",
  quote: "Swift containment and forensic integrity are the foundation of effective team threat mitigation.",
  permissions: [
    "VIEW_ASSIGNED_TEAM",
    "INSPECT_TEAM_AUDITS",
    "ISOLATE_NODES",
    "ACKNOWLEDGE_INCIDENTS",
    "RUN_ASM_SCANS"
  ]
};

// 4. Senior Threat Hunter
export const DEMO_THREAT_HUNTER: AuthUser = {
  id: "usr_hunter_003",
  name: "Elena Rostova",
  email: "hunter@aegis-defense.corp",
  role: "threat_hunter",
  clearanceLevel: "LEVEL_2_SPECIALIST",
  department: "Adversary Tracking & Container Mesh",
  title: "Lead Cloud Infrastructure Hunter",
  employeeId: "CORP-EMP-3918",
  avatar: "🦅",
  avatarGradient: "from-purple-400 via-violet-500 to-pink-600",
  badgeBorder: "border-purple-400 shadow-purple-500/30",
  shift: "Alpha Hunting (08:00 - 16:00 UTC)",
  activeSessionId: "SES-EMP-88219-OP",
  lastLogin: "Today, 09:30 UTC",
  assignedSector: "cloud_hunter",
  assignedDeviceId: "WS-SOC-208-HUNTER-X",
  assignedDeviceIp: "10.0.4.18",
  quote: "Tracing advanced persistent adversary vectors deep within container mesh eBPF ring buffers.",
  permissions: [
    "VIEW_LIVE_TELEMETRY",
    "EXECUTE_EBPF_PROBES",
    "DISSECT_RAW_PACKETS",
    "DEPLOY_AI_CONTAINMENT"
  ]
};

// 5. Normal Employee / Junior SOC Analyst
export const DEMO_EMPLOYEE_DAVID: AuthUser = {
  id: "usr_emp_442",
  name: "David Vance",
  email: "analyst@aegis-defense.corp",
  role: "employee",
  clearanceLevel: "LEVEL_1_OPERATOR",
  department: "SOC Operations",
  title: "Tier-1 Incident Triage Analyst",
  employeeId: "CORP-EMP-4420",
  avatar: "🔰",
  avatarGradient: "from-sky-400 via-blue-500 to-slate-600",
  badgeBorder: "border-sky-400 shadow-sky-500/30",
  shift: "Bravo Shift (14:00 - 22:00 UTC)",
  activeSessionId: "SES-EMP-33104-OP",
  lastLogin: "Today, 14:02 UTC",
  assignedSector: "dmz_analyst",
  assignedDeviceId: "WS-SOC-104-MBP-M3",
  assignedDeviceIp: "10.0.4.12",
  quote: "Dedicated to rapid alert triage and continuous workstation telemetry monitoring.",
  permissions: [
    "VIEW_LIVE_TELEMETRY",
    "VIEW_ASSIGNED_INCIDENTS",
    "EXECUTE_LOCAL_ASM_SCAN",
    "ACKNOWLEDGE_ALERT"
  ]
};

export const INITIAL_EMPLOYEE_PROFILES: EmployeeProfile[] = [
  {
    employeeId: "CORP-EXEC-0001",
    name: "Victoria Sterling",
    email: "ceo@aegis-defense.corp",
    role: "ceo",
    title: "Chief Executive Officer & Board Chair",
    department: "Executive Office",
    shift: "Global Executive",
    status: "ONLINE",
    riskScore: 2,
    recentActionsCount: 48,
    lastActive: "Just now",
    assignedWorkstation: "CEO-SECURE-IPAD-MAX (10.0.0.1)",
    assignedSector: "global",
    avatar: "👑",
    avatarGradient: "from-amber-400 via-rose-500 to-indigo-600"
  },
  {
    employeeId: "CORP-MGR-0091",
    name: "Cmdr. Sarah Jenkins",
    email: "manager@aegis-defense.corp",
    role: "manager",
    title: "Director of Cyber Defense Operations",
    department: "Security Command",
    shift: "Alpha Command",
    status: "ONLINE",
    riskScore: 6,
    recentActionsCount: 52,
    lastActive: "1 min ago",
    assignedWorkstation: "EXEC-MACBOOK-M3MAX (10.0.0.99)",
    assignedSector: "global",
    avatar: "👔",
    avatarGradient: "from-cyan-400 via-blue-500 to-indigo-600"
  },
  {
    employeeId: "CORP-LEAD-2041",
    name: "Alexander Stone",
    email: "lead@aegis-defense.corp",
    role: "team_lead",
    title: "Incident Commander & Operations Lead",
    department: "Incident Response",
    shift: "Alpha Shift Lead",
    status: "ON_DUTY",
    riskScore: 10,
    recentActionsCount: 34,
    lastActive: "4 mins ago",
    assignedWorkstation: "STONE-THINKPAD-P16 (10.0.3.15)",
    assignedSector: "dmz_analyst",
    avatar: "🛡️",
    avatarGradient: "from-emerald-400 via-teal-500 to-cyan-600"
  },
  {
    employeeId: "CORP-EMP-3918",
    name: "Elena Rostova",
    email: "hunter@aegis-defense.corp",
    role: "threat_hunter",
    title: "Lead Cloud Infrastructure Hunter",
    department: "Adversary Tracking",
    shift: "Alpha Shift",
    status: "ONLINE",
    riskScore: 14,
    recentActionsCount: 42,
    lastActive: "6 mins ago",
    assignedWorkstation: "WS-SOC-208-HUNTER-X (10.0.4.18)",
    assignedSector: "cloud_hunter",
    avatar: "🦅",
    avatarGradient: "from-purple-400 via-violet-500 to-pink-600"
  },
  {
    employeeId: "CORP-EMP-4420",
    name: "David Vance",
    email: "analyst@aegis-defense.corp",
    role: "employee",
    title: "Tier-1 Incident Triage Analyst",
    department: "SOC Operations",
    shift: "Bravo Shift",
    status: "ONLINE",
    riskScore: 24,
    recentActionsCount: 28,
    lastActive: "2 mins ago",
    assignedWorkstation: "WS-SOC-104-MBP-M3 (10.0.4.12)",
    assignedSector: "dmz_analyst",
    avatar: "🔰",
    avatarGradient: "from-sky-400 via-blue-500 to-slate-600"
  }
];

export const INITIAL_AUDIT_RECORDS: EmployeeAuditRecord[] = [
  {
    id: "AUD-9025",
    employeeId: "CORP-EXEC-0001",
    employeeName: "Victoria Sterling",
    email: "ceo@aegis-defense.corp",
    role: "ceo",
    department: "Executive Office",
    action: "Approved Crisis Mode Contingency Budget",
    targetResource: "FINANCIAL_RISK_POOL [$12.5M]",
    sourceIp: "10.0.0.1",
    timestamp: "8 mins ago",
    severity: "INFO",
    status: "SUCCESS",
    riskScore: 0,
    details: "Executive verified quarterly SOC 2 and ISO 27001 sovereign attestation."
  },
  {
    id: "AUD-9024",
    employeeId: "CORP-MGR-0091",
    employeeName: "Cmdr. Sarah Jenkins",
    email: "manager@aegis-defense.corp",
    role: "manager",
    department: "Security Command",
    action: "Authorized Zero-Trust Perimeter Micro-Isolation",
    targetResource: "BGP-OPTICAL-CORE [10.0.1.1]",
    sourceIp: "10.0.0.99",
    timestamp: "14 mins ago",
    severity: "CRITICAL",
    status: "SUCCESS",
    riskScore: 12,
    details: "Activated automated BGP route shield to deflect cross-zone anomalous bursts."
  },
  {
    id: "AUD-9023",
    employeeId: "CORP-LEAD-2041",
    employeeName: "Alexander Stone",
    email: "lead@aegis-defense.corp",
    role: "team_lead",
    department: "Incident Response",
    action: "Assigned Critical Triage Ticket to David Vance",
    targetResource: "INC-2026-881 [DMZ SQLi Probe]",
    sourceIp: "10.0.3.15",
    timestamp: "22 mins ago",
    severity: "WARN",
    status: "SUCCESS",
    riskScore: 15,
    details: "Escalated priority to Tier-1 triage operator with live PCAP buffer review."
  },
  {
    id: "AUD-9022",
    employeeId: "CORP-EMP-3918",
    employeeName: "Elena Rostova",
    email: "hunter@aegis-defense.corp",
    role: "threat_hunter",
    department: "Adversary Tracking",
    action: "Executed eBPF Kernel Container Audit",
    targetResource: "K8S-CLUSTER [172.16.0.10]",
    sourceIp: "10.0.4.18",
    timestamp: "35 mins ago",
    severity: "INFO",
    status: "SUCCESS",
    riskScore: 14,
    details: "Audited privileged container namespaces for syscall breakout signatures."
  },
  {
    id: "AUD-9021",
    employeeId: "CORP-EMP-4420",
    employeeName: "David Vance",
    email: "analyst@aegis-defense.corp",
    role: "employee",
    department: "SOC Operations",
    action: "Quarantined DMZ WAF Route",
    targetResource: "node-dmz-waf [10.0.4.1]",
    sourceIp: "10.0.4.12",
    timestamp: "45 mins ago",
    severity: "CRITICAL",
    status: "SUCCESS",
    riskScore: 35,
    details: "Initiated zero-trust microsegmentation quarantine in response to local GNN anomaly."
  }
];

export const INITIAL_EXECUTIVE_BRIEFING: ExecutiveBriefing = {
  quarterlyBudgetProtected: "$12.8M USD",
  complianceRating: "100% (SOC 2 Type II / ISO 27001)",
  activeEnterpriseVulnerabilities: 3,
  executiveActionRequired: false,
  corporateRiskIndex: 12,
  boardReportDate: "Nov 2026 Board Review Ready",
  crisisModeActive: false
};

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isCeo: boolean;
  isManager: boolean;
  isTeamLead: boolean;
  isThreatHunter: boolean;
  isEmployee: boolean;
  canViewExecutiveBriefing: boolean;
  canViewAllAuditLogs: boolean;
  canSwitchSector: boolean;
  currentSector: SectorScope;
  setSector: (sector: SectorScope) => void;
  executiveBriefing: ExecutiveBriefing;
  toggleCrisisMode: () => void;
  isWelcomeModalOpen: boolean;
  openWelcomeModal: () => void;
  closeWelcomeModal: () => void;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchUserPersona: (personaKey: "ceo" | "manager" | "lead" | "hunter" | "employee") => void;
  auditRecords: EmployeeAuditRecord[];
  employeeProfiles: EmployeeProfile[];
  recordAction: (action: string, targetResource: string, severity?: "CRITICAL" | "WARN" | "INFO", details?: string) => void;
  revokeEmployeeSession: (employeeId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = "aegis_auth_user_v2";
const STORAGE_KEY_AUDITS = "aegis_audit_records_v2";
const STORAGE_KEY_WELCOME_SEEN = "aegis_welcome_modal_seen";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to CEO so the full executive suite can be enjoyed immediately, but welcome modal opens by default!
  const [user, setUser] = useState<AuthUser | null>(DEMO_CEO);
  const [currentSector, setCurrentSectorState] = useState<SectorScope>("global");
  const [auditRecords, setAuditRecords] = useState<EmployeeAuditRecord[]>(INITIAL_AUDIT_RECORDS);
  const [employeeProfiles, setEmployeeProfiles] = useState<EmployeeProfile[]>(INITIAL_EMPLOYEE_PROFILES);
  const [executiveBriefing, setExecutiveBriefing] = useState<ExecutiveBriefing>(INITIAL_EXECUTIVE_BRIEFING);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState<boolean>(true);

  // Initialize
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        const sec = parsed.assignedSector || "global";
        setCurrentSectorState(sec);
        telemetryClient.setSector(sec);
      } else {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEMO_CEO));
        telemetryClient.setSector("global");
      }

      const storedAudits = localStorage.getItem(STORAGE_KEY_AUDITS);
      if (storedAudits) {
        setAuditRecords(JSON.parse(storedAudits));
      }
    } catch (e) {
      console.warn("Auth init error:", e);
    }
  }, []);

  const openWelcomeModal = useCallback(() => setIsWelcomeModalOpen(true), []);
  const closeWelcomeModal = useCallback(() => {
    setIsWelcomeModalOpen(false);
  }, []);

  const toggleCrisisMode = useCallback(() => {
    setExecutiveBriefing((prev) => ({
      ...prev,
      crisisModeActive: !prev.crisisModeActive
    }));
  }, []);

  const setSector = useCallback((sector: SectorScope) => {
    // Only CEO and Manager can switch sectors!
    if (user && user.role !== "ceo" && user.role !== "manager" && user.assignedSector !== sector) {
      console.warn("Operator clearance restricted to assigned workstation sector.");
      return;
    }
    setCurrentSectorState(sector);
    telemetryClient.setSector(sector);
  }, [user]);

  const switchUserPersona = useCallback((personaKey: "ceo" | "manager" | "lead" | "hunter" | "employee") => {
    let nextUser: AuthUser;
    switch (personaKey) {
      case "ceo":
        nextUser = { ...DEMO_CEO };
        break;
      case "manager":
        nextUser = { ...DEMO_MANAGER };
        break;
      case "lead":
        nextUser = { ...DEMO_TEAM_LEAD };
        break;
      case "hunter":
        nextUser = { ...DEMO_THREAT_HUNTER };
        break;
      case "employee":
      default:
        nextUser = { ...DEMO_EMPLOYEE_DAVID };
        break;
    }

    nextUser.lastLogin = "Just now";
    setUser(nextUser);
    setCurrentSectorState(nextUser.assignedSector);
    telemetryClient.setSector(nextUser.assignedSector);

    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(nextUser));
    } catch {}

    setIsWelcomeModalOpen(false);
  }, []);

  const login = useCallback(async (email: string, role?: UserRole): Promise<boolean> => {
    let selectedUser: AuthUser;
    const lower = email.toLowerCase();

    if (role === "ceo" || lower.includes("ceo") || lower.includes("victoria")) {
      selectedUser = { ...DEMO_CEO };
    } else if (role === "manager" || lower.includes("manager") || lower.includes("jenkins")) {
      selectedUser = { ...DEMO_MANAGER };
    } else if (role === "team_lead" || lower.includes("lead") || lower.includes("stone")) {
      selectedUser = { ...DEMO_TEAM_LEAD };
    } else if (role === "threat_hunter" || lower.includes("hunter") || lower.includes("rostova")) {
      selectedUser = { ...DEMO_THREAT_HUNTER };
    } else {
      selectedUser = { ...DEMO_EMPLOYEE_DAVID };
    }

    if (email && email.trim().length > 0) {
      selectedUser.email = email;
    }
    selectedUser.lastLogin = "Just now";

    setUser(selectedUser);
    setCurrentSectorState(selectedUser.assignedSector);
    telemetryClient.setSector(selectedUser.assignedSector);

    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(selectedUser));
    } catch {}

    const newRecord: EmployeeAuditRecord = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      employeeId: selectedUser.employeeId,
      employeeName: selectedUser.name,
      email: selectedUser.email,
      role: selectedUser.role,
      department: selectedUser.department,
      action: `SSO Device Authentication (${selectedUser.clearanceLevel})`,
      targetResource: `SECTOR: ${selectedUser.assignedSector.toUpperCase()}`,
      sourceIp: selectedUser.assignedDeviceIp,
      timestamp: "Just now",
      severity: "INFO",
      status: "SUCCESS",
      riskScore: selectedUser.role === "ceo" ? 0 : 5,
      details: `Zero-trust identity confirmed for ${selectedUser.name} on ${selectedUser.assignedDeviceId}.`
    };

    setAuditRecords((prev) => {
      const updated = [newRecord, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY_AUDITS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setIsWelcomeModalOpen(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsWelcomeModalOpen(true);
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch {}
  }, []);

  const recordAction = useCallback((
    action: string,
    targetResource: string,
    severity: "CRITICAL" | "WARN" | "INFO" = "INFO",
    details: string = "Standard corporate operations logged."
  ) => {
    if (!user) return;

    const newRecord: EmployeeAuditRecord = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      employeeId: user.employeeId,
      employeeName: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      action,
      targetResource,
      sourceIp: user.assignedDeviceIp || "10.0.4.12",
      timestamp: "Just now",
      severity,
      status: "SUCCESS",
      riskScore: severity === "CRITICAL" ? 65 : severity === "WARN" ? 30 : 10,
      details
    };

    setAuditRecords((prev) => {
      const updated = [newRecord, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY_AUDITS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [user]);

  const revokeEmployeeSession = useCallback((employeeId: string) => {
    setEmployeeProfiles((prev) => {
      const updated = prev.map((p) =>
        p.employeeId === employeeId ? { ...p, status: "SUSPENDED" as const, riskScore: 99 } : p
      );
      return updated;
    });

    if (user) {
      recordAction(
        `Session Revoked & Clearance Suspended`,
        `Personnel: ${employeeId}`,
        "CRITICAL",
        `Executive ${user.name} revoked active device token and credentials.`
      );
    }
  }, [user, recordAction]);

  const isCeo = user?.role === "ceo";
  const isManager = user?.role === "manager";
  const isTeamLead = user?.role === "team_lead";
  const isThreatHunter = user?.role === "threat_hunter";
  const isEmployee = user?.role === "employee";

  const canViewExecutiveBriefing = isCeo;
  const canViewAllAuditLogs = isCeo || isManager;
  const canSwitchSector = isCeo || isManager;
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isCeo,
        isManager,
        isTeamLead,
        isThreatHunter,
        isEmployee,
        canViewExecutiveBriefing,
        canViewAllAuditLogs,
        canSwitchSector,
        currentSector,
        setSector,
        executiveBriefing,
        toggleCrisisMode,
        isWelcomeModalOpen,
        openWelcomeModal,
        closeWelcomeModal,
        login,
        logout,
        switchUserPersona,
        auditRecords,
        employeeProfiles,
        recordAction,
        revokeEmployeeSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
