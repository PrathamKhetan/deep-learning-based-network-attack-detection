"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthUser, EmployeeAuditRecord, EmployeeProfile, UserRole } from "@/types/auth";

export const DEMO_MANAGER: AuthUser = {
  id: "usr_mgr_001",
  name: "Cmdr. Sarah Jenkins",
  email: "manager@aegis-defense.corp",
  role: "manager",
  clearanceLevel: "LEVEL_4_EXECUTIVE",
  department: "Security Command & Governance",
  title: "Chief of SOC & Cyber Defense Operations",
  employeeId: "CORP-MGR-0091",
  shift: "Alpha Command (08:00 - 18:00 UTC)",
  activeSessionId: "SES-MGR-99482-SEC",
  lastLogin: "Today, 08:14 UTC",
  permissions: [
    "VIEW_ALL_EMPLOYEES",
    "INSPECT_AUDIT_LOGS",
    "EXPORT_SOC2_COMPLIANCE",
    "REVOKE_CREDENTIALS",
    "OVERRIDE_SECURITY_POLICIES",
    "ISOLATE_NODES",
    "TRIGGER_ATTACK_SIMULATIONS",
    "FULL_TOPOLOGY_CONTROL"
  ]
};

export const DEMO_EMPLOYEE: AuthUser = {
  id: "usr_emp_442",
  name: "David Vance",
  email: "analyst@aegis-defense.corp",
  role: "employee",
  clearanceLevel: "LEVEL_2_OPERATOR",
  department: "Security Operations Center (SOC)",
  title: "Cyber Threat Analyst (Tier 2)",
  employeeId: "CORP-EMP-4420",
  shift: "Bravo Shift (14:00 - 22:00 UTC)",
  activeSessionId: "SES-EMP-33104-OP",
  lastLogin: "Today, 14:02 UTC",
  permissions: [
    "VIEW_LIVE_TELEMETRY",
    "VIEW_ASSIGNED_INCIDENTS",
    "EXECUTE_LOCAL_ASM_SCAN",
    "ACKNOWLEDGE_ALERT"
  ]
};

export const INITIAL_EMPLOYEE_PROFILES: EmployeeProfile[] = [
  {
    employeeId: "CORP-EMP-4420",
    name: "David Vance",
    email: "analyst@aegis-defense.corp",
    role: "employee",
    title: "Cyber Threat Analyst (Tier 2)",
    department: "SOC Operations",
    shift: "Bravo Shift",
    status: "ONLINE",
    riskScore: 24,
    recentActionsCount: 28,
    lastActive: "2 mins ago",
    assignedWorkstation: "WS-SOC-104 (10.0.4.12)"
  },
  {
    employeeId: "CORP-EMP-3918",
    name: "Elena Rostova",
    email: "e.rostova@aegis-defense.corp",
    role: "employee",
    title: "Senior Threat Hunter (Tier 3)",
    department: "Adversary Tracking",
    shift: "Alpha Shift",
    status: "ON_DUTY",
    riskScore: 12,
    recentActionsCount: 42,
    lastActive: "8 mins ago",
    assignedWorkstation: "WS-SOC-208 (10.0.4.18)"
  },
  {
    employeeId: "CORP-EMP-5102",
    name: "Marcus Chen",
    email: "m.chen@aegis-defense.corp",
    role: "employee",
    title: "SOC Junior Analyst (Tier 1)",
    department: "Incident Triage",
    shift: "Bravo Shift",
    status: "ONLINE",
    riskScore: 68,
    recentActionsCount: 19,
    lastActive: "1 min ago",
    assignedWorkstation: "WS-SOC-312 (10.0.4.29)"
  },
  {
    employeeId: "CORP-EMP-2884",
    name: "Sophia Martinez",
    email: "s.martinez@aegis-defense.corp",
    role: "employee",
    title: "Forensics Specialist",
    department: "Digital Forensics & IR",
    shift: "Night Operations",
    status: "OFF_DUTY",
    riskScore: 8,
    recentActionsCount: 31,
    lastActive: "3 hours ago",
    assignedWorkstation: "WS-DFIR-004 (10.0.5.15)"
  },
  {
    employeeId: "CORP-EMP-1903",
    name: "Alex Mercer",
    email: "a.mercer@aegis-defense.corp",
    role: "employee",
    title: "Network Security Engineer",
    department: "Infrastructure Defense",
    shift: "Alpha Shift",
    status: "ON_DUTY",
    riskScore: 18,
    recentActionsCount: 22,
    lastActive: "14 mins ago",
    assignedWorkstation: "WS-ENG-088 (10.0.3.44)"
  }
];

export const INITIAL_AUDIT_RECORDS: EmployeeAuditRecord[] = [
  {
    id: "AUD-9021",
    employeeId: "CORP-EMP-4420",
    employeeName: "David Vance",
    email: "analyst@aegis-defense.corp",
    role: "employee",
    department: "SOC Operations",
    action: "Remediated Network Node (Isolate)",
    targetResource: "CORE-SWITCH-01 [10.0.1.1]",
    sourceIp: "10.0.4.12",
    timestamp: "10 mins ago",
    severity: "CRITICAL",
    status: "SUCCESS",
    riskScore: 35,
    details: "Initiated zero-trust microsegmentation quarantine in response to GNN topological lateral anomaly."
  },
  {
    id: "AUD-9020",
    employeeId: "CORP-EMP-5102",
    employeeName: "Marcus Chen",
    email: "m.chen@aegis-defense.corp",
    role: "employee",
    department: "Incident Triage",
    action: "Failed Sudo Privilege Elevation",
    targetResource: "PROBE-SOC-GATEWAY [10.0.3.50]",
    sourceIp: "10.0.4.29",
    timestamp: "18 mins ago",
    severity: "WARN",
    status: "FLAGGED",
    riskScore: 78,
    details: "Repeated unauthorized attempt to access supervisor shell without dual-key clearance."
  },
  {
    id: "AUD-9019",
    employeeId: "CORP-EMP-3918",
    employeeName: "Elena Rostova",
    email: "e.rostova@aegis-defense.corp",
    role: "employee",
    department: "Adversary Tracking",
    action: "Triggered Attack Vector Simulation",
    targetResource: "SIM-ENGINE [DDoS SYN Flood]",
    sourceIp: "10.0.4.18",
    timestamp: "32 mins ago",
    severity: "INFO",
    status: "SUCCESS",
    riskScore: 15,
    details: "Authorized simulated adversary stress test against Tabular DNN model."
  },
  {
    id: "AUD-9018",
    employeeId: "CORP-EMP-4420",
    employeeName: "David Vance",
    email: "analyst@aegis-defense.corp",
    role: "employee",
    department: "SOC Operations",
    action: "Exported Flow Packet Inspection",
    targetResource: "DATABASE-CLUSTER-01 [10.0.2.20]",
    sourceIp: "10.0.4.12",
    timestamp: "45 mins ago",
    severity: "INFO",
    status: "SUCCESS",
    riskScore: 10,
    details: "Downloaded 50MB PCAP flow stream for entropy inspection and header attribution."
  },
  {
    id: "AUD-9017",
    employeeId: "CORP-EMP-1903",
    employeeName: "Alex Mercer",
    email: "a.mercer@aegis-defense.corp",
    role: "employee",
    department: "Infrastructure Defense",
    action: "Executed ASM Vulnerability Scan",
    targetResource: "ALL_ACTIVE_NODES (8/8)",
    sourceIp: "10.0.3.44",
    timestamp: "1 hour ago",
    severity: "INFO",
    status: "SUCCESS",
    riskScore: 12,
    details: "Scanned perimeter for CVE-2023-44487 and CVE-2024-21626 blast radius."
  },
  {
    id: "AUD-9016",
    employeeId: "CORP-EMP-5102",
    employeeName: "Marcus Chen",
    email: "m.chen@aegis-defense.corp",
    role: "employee",
    department: "Incident Triage",
    action: "Restored Severed Neural Edge",
    targetResource: "EDGE: 10.0.1.1 -> 10.0.2.10",
    sourceIp: "10.0.4.29",
    timestamp: "1 hour 20 mins ago",
    severity: "WARN",
    status: "SUCCESS",
    riskScore: 40,
    details: "Restored connectivity after automated containment window expired."
  },
  {
    id: "AUD-9015",
    employeeId: "CORP-EMP-2884",
    employeeName: "Sophia Martinez",
    email: "s.martinez@aegis-defense.corp",
    role: "employee",
    department: "Digital Forensics & IR",
    action: "Submitted Forensic Incident Report",
    targetResource: "INC-2026-0881 [Stealth Recon]",
    sourceIp: "10.0.5.15",
    timestamp: "2 hours ago",
    severity: "INFO",
    status: "SUCCESS",
    riskScore: 5,
    details: "Closed triage ticket; identified reconnaissance port scan originating from external proxy."
  }
];

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isManager: boolean;
  isEmployee: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  auditRecords: EmployeeAuditRecord[];
  employeeProfiles: EmployeeProfile[];
  recordAction: (action: string, targetResource: string, severity?: "CRITICAL" | "WARN" | "INFO", details?: string) => void;
  revokeEmployeeSession: (employeeId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = "aegis_auth_user";
const STORAGE_KEY_AUDITS = "aegis_audit_records";
const STORAGE_KEY_PROFILES = "aegis_employee_profiles";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(DEMO_MANAGER); // Default to manager so dashboard is full-featured out of the box
  const [auditRecords, setAuditRecords] = useState<EmployeeAuditRecord[]>(INITIAL_AUDIT_RECORDS);
  const [employeeProfiles, setEmployeeProfiles] = useState<EmployeeProfile[]>(INITIAL_EMPLOYEE_PROFILES);
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage if present
  useEffect(() => {
    setMounted(true);
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Pre-save default manager session
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEMO_MANAGER));
      }

      const storedAudits = localStorage.getItem(STORAGE_KEY_AUDITS);
      if (storedAudits) {
        setAuditRecords(JSON.parse(storedAudits));
      }

      const storedProfiles = localStorage.getItem(STORAGE_KEY_PROFILES);
      if (storedProfiles) {
        setEmployeeProfiles(JSON.parse(storedProfiles));
      }
    } catch (e) {
      console.warn("Error loading persistent auth state:", e);
    }
  }, []);

  const login = useCallback(async (email: string, role?: UserRole): Promise<boolean> => {
    // If role is explicitly provided or detected from email
    const targetRole = role || (email.toLowerCase().includes("manager") || email.toLowerCase().includes("boss") ? "manager" : "employee");
    const selectedUser = targetRole === "manager" ? { ...DEMO_MANAGER } : { ...DEMO_EMPLOYEE };

    if (email && email.trim().length > 0) {
      selectedUser.email = email;
    }
    selectedUser.lastLogin = "Just now";

    setUser(selectedUser);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(selectedUser));
    } catch {}

    // Record login in audit trail
    const newRecord: EmployeeAuditRecord = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      employeeId: selectedUser.employeeId,
      employeeName: selectedUser.name,
      email: selectedUser.email,
      role: selectedUser.role,
      department: selectedUser.department,
      action: `Corporate Portal SSO Login (${selectedUser.clearanceLevel})`,
      targetResource: "AUTH-GATEWAY-IDP",
      sourceIp: "10.0.4.12",
      timestamp: "Just now",
      severity: "INFO",
      status: "SUCCESS",
      riskScore: selectedUser.role === "manager" ? 0 : 5,
      details: "Authenticated via Enterprise Identity Provider with Multi-Factor Clearance."
    };

    setAuditRecords(prev => {
      const updated = [newRecord, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY_AUDITS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch {}
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    const newUser = role === "manager" ? { ...DEMO_MANAGER } : { ...DEMO_EMPLOYEE };
    newUser.lastLogin = "Just now";
    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    } catch {}
  }, []);

  const recordAction = useCallback((
    action: string,
    targetResource: string,
    severity: "CRITICAL" | "WARN" | "INFO" = "INFO",
    details: string = "Standard SOC operations logged."
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
      sourceIp: "10.0.4.12",
      timestamp: "Just now",
      severity,
      status: "SUCCESS",
      riskScore: severity === "CRITICAL" ? 65 : severity === "WARN" ? 30 : 10,
      details
    };

    setAuditRecords(prev => {
      const updated = [newRecord, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY_AUDITS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [user]);

  const revokeEmployeeSession = useCallback((employeeId: string) => {
    setEmployeeProfiles(prev => {
      const updated = prev.map(p => 
        p.employeeId === employeeId ? { ...p, status: "SUSPENDED" as const, riskScore: 99 } : p
      );
      try {
        localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Record revocation in audit log
    if (user) {
      recordAction(
        `Session Revoked & Clearance Suspended`,
        `Personnel: ${employeeId}`,
        "CRITICAL",
        `Manager ${user.name} initiated emergency credential revocation.`
      );
    }
  }, [user, recordAction]);

  const isManager = user?.role === "manager";
  const isEmployee = user?.role === "employee";
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isManager,
        isEmployee,
        login,
        logout,
        switchRole,
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

