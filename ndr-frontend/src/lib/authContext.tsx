"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthUser, EmployeeAuditRecord, EmployeeProfile, UserRole } from "@/types/auth";
import { SectorScope } from "@/types/telemetry";
import { telemetryClient } from "./telemetryClient";

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
  assignedSector: "global",
  assignedDeviceId: "EXEC-MACBOOK-M3MAX",
  assignedDeviceIp: "10.0.0.99",
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

export const DEMO_EMPLOYEE_DAVID: AuthUser = {
  id: "usr_emp_442",
  name: "David Vance",
  email: "analyst@aegis-defense.corp",
  role: "employee",
  clearanceLevel: "LEVEL_2_OPERATOR",
  department: "SOC Operations",
  title: "Cyber Threat Analyst (Tier 2)",
  employeeId: "CORP-EMP-4420",
  shift: "Bravo Shift (14:00 - 22:00 UTC)",
  activeSessionId: "SES-EMP-33104-OP",
  lastLogin: "Today, 14:02 UTC",
  assignedSector: "dmz_analyst",
  assignedDeviceId: "WS-SOC-104-MBP-M3",
  assignedDeviceIp: "10.0.4.12",
  permissions: [
    "VIEW_LIVE_TELEMETRY",
    "VIEW_ASSIGNED_INCIDENTS",
    "EXECUTE_LOCAL_ASM_SCAN",
    "ACKNOWLEDGE_ALERT"
  ]
};

export const DEMO_EMPLOYEE_ELENA: AuthUser = {
  id: "usr_emp_391",
  name: "Elena Rostova",
  email: "e.rostova@aegis-defense.corp",
  role: "employee",
  clearanceLevel: "LEVEL_2_OPERATOR",
  department: "Adversary Tracking",
  title: "Senior Threat Hunter (Tier 3)",
  employeeId: "CORP-EMP-3918",
  shift: "Alpha Shift (08:00 - 16:00 UTC)",
  activeSessionId: "SES-EMP-88219-OP",
  lastLogin: "Today, 09:30 UTC",
  assignedSector: "cloud_hunter",
  assignedDeviceId: "WS-SOC-208-HUNTER-X",
  assignedDeviceIp: "10.0.4.18",
  permissions: [
    "VIEW_LIVE_TELEMETRY",
    "VIEW_ASSIGNED_INCIDENTS",
    "EXECUTE_LOCAL_ASM_SCAN",
    "ACKNOWLEDGE_ALERT"
  ]
};

export const DEMO_EMPLOYEE_MARCUS: AuthUser = {
  id: "usr_emp_510",
  name: "Marcus Chen",
  email: "m.chen@aegis-defense.corp",
  role: "employee",
  clearanceLevel: "LEVEL_2_OPERATOR",
  department: "Incident Triage",
  title: "SOC Junior Analyst (Tier 1)",
  employeeId: "CORP-EMP-5102",
  shift: "Bravo Shift (14:00 - 22:00 UTC)",
  activeSessionId: "SES-EMP-11928-OP",
  lastLogin: "Today, 14:15 UTC",
  assignedSector: "lan_junior",
  assignedDeviceId: "WS-SOC-312-TRIAGE-01",
  assignedDeviceIp: "10.0.4.29",
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
    assignedWorkstation: "WS-SOC-104 (10.0.4.12)",
    assignedSector: "dmz_analyst"
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
    assignedWorkstation: "WS-SOC-208 (10.0.4.18)",
    assignedSector: "cloud_hunter"
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
    assignedWorkstation: "WS-SOC-312 (10.0.4.29)",
    assignedSector: "lan_junior"
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
    assignedWorkstation: "WS-DFIR-004 (10.0.5.15)",
    assignedSector: "dmz_analyst"
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
    assignedWorkstation: "WS-ENG-088 (10.0.3.44)",
    assignedSector: "global"
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
    action: "Quarantined DMZ WAF Route",
    targetResource: "node-dmz-waf [10.0.4.1]",
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
    targetResource: "DC-01 [192.168.1.10]",
    sourceIp: "10.0.4.29",
    timestamp: "18 mins ago",
    severity: "WARN",
    status: "FLAGGED",
    riskScore: 78,
    details: "Repeated unauthorized attempt to access Domain Controller without dual-key clearance."
  },
  {
    id: "AUD-9019",
    employeeId: "CORP-EMP-3918",
    employeeName: "Elena Rostova",
    email: "e.rostova@aegis-defense.corp",
    role: "employee",
    department: "Adversary Tracking",
    action: "Executed eBPF Container Audit",
    targetResource: "K8S-CLUSTER [172.16.0.10]",
    sourceIp: "10.0.4.18",
    timestamp: "32 mins ago",
    severity: "INFO",
    status: "SUCCESS",
    riskScore: 15,
    details: "Audited privileged namespaces for container breakout and namespace evasion attempts."
  },
  {
    id: "AUD-9018",
    employeeId: "CORP-EMP-4420",
    employeeName: "David Vance",
    email: "analyst@aegis-defense.corp",
    role: "employee",
    department: "SOC Operations",
    action: "Exported Forensic PCAP Dissection",
    targetResource: "node-dmz-waf [10.0.4.1]",
    sourceIp: "10.0.4.12",
    timestamp: "45 mins ago",
    severity: "INFO",
    status: "SUCCESS",
    riskScore: 10,
    details: "Downloaded 50MB raw hex stream for packet entropy verification."
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
  }
];

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isManager: boolean;
  isEmployee: boolean;
  currentSector: SectorScope;
  setSector: (sector: SectorScope) => void;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  switchUserPersona: (personaKey: "manager" | "david" | "elena" | "marcus") => void;
  auditRecords: EmployeeAuditRecord[];
  employeeProfiles: EmployeeProfile[];
  recordAction: (action: string, targetResource: string, severity?: "CRITICAL" | "WARN" | "INFO", details?: string) => void;
  revokeEmployeeSession: (employeeId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = "aegis_auth_user";
const STORAGE_KEY_AUDITS = "aegis_audit_records";
const STORAGE_KEY_PROFILES = "aegis_employee_profiles";
const STORAGE_KEY_SECTOR = "aegis_active_sector";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(DEMO_MANAGER);
  const [currentSector, setCurrentSectorState] = useState<SectorScope>("global");
  const [auditRecords, setAuditRecords] = useState<EmployeeAuditRecord[]>(INITIAL_AUDIT_RECORDS);
  const [employeeProfiles, setEmployeeProfiles] = useState<EmployeeProfile[]>(INITIAL_EMPLOYEE_PROFILES);

  // Initialize from localStorage
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
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEMO_MANAGER));
        telemetryClient.setSector("global");
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

  const setSector = useCallback((sector: SectorScope) => {
    // If not manager, can only stay in assigned sector!
    if (user && user.role !== "manager" && user.assignedSector !== sector) {
      console.warn("Employee clearance restricted to assigned workstation sector.");
      return;
    }
    setCurrentSectorState(sector);
    telemetryClient.setSector(sector);
    try {
      localStorage.setItem(STORAGE_KEY_SECTOR, sector);
    } catch {}
  }, [user]);

  const switchUserPersona = useCallback((personaKey: "manager" | "david" | "elena" | "marcus") => {
    let nextUser: AuthUser;
    switch (personaKey) {
      case "david":
        nextUser = { ...DEMO_EMPLOYEE_DAVID };
        break;
      case "elena":
        nextUser = { ...DEMO_EMPLOYEE_ELENA };
        break;
      case "marcus":
        nextUser = { ...DEMO_EMPLOYEE_MARCUS };
        break;
      default:
        nextUser = { ...DEMO_MANAGER };
        break;
    }
    nextUser.lastLogin = "Just now";
    setUser(nextUser);
    setCurrentSectorState(nextUser.assignedSector);
    telemetryClient.setSector(nextUser.assignedSector);

    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(nextUser));
    } catch {}
  }, []);

  const login = useCallback(async (email: string, role?: UserRole): Promise<boolean> => {
    let selectedUser: AuthUser;

    const lower = email.toLowerCase();
    if (lower.includes("elena") || lower.includes("rostova") || lower.includes("hunter")) {
      selectedUser = { ...DEMO_EMPLOYEE_ELENA };
    } else if (lower.includes("marcus") || lower.includes("chen") || lower.includes("junior")) {
      selectedUser = { ...DEMO_EMPLOYEE_MARCUS };
    } else if (role === "employee" || lower.includes("analyst") || lower.includes("david")) {
      selectedUser = { ...DEMO_EMPLOYEE_DAVID };
    } else {
      selectedUser = { ...DEMO_MANAGER };
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
      action: `SSO Device Authentication (${selectedUser.assignedDeviceId})`,
      targetResource: `SECTOR: ${selectedUser.assignedSector.toUpperCase()}`,
      sourceIp: selectedUser.assignedDeviceIp,
      timestamp: "Just now",
      severity: "INFO",
      status: "SUCCESS",
      riskScore: selectedUser.role === "manager" ? 0 : 5,
      details: `Zero-trust device authentication confirmed for ${selectedUser.name} on ${selectedUser.assignedDeviceId}.`
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
    if (role === "manager") {
      switchUserPersona("manager");
    } else {
      switchUserPersona("david");
    }
  }, [switchUserPersona]);

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
      sourceIp: user.assignedDeviceIp || "10.0.4.12",
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

    if (user) {
      recordAction(
        `Session Revoked & Device Quarantined`,
        `Personnel: ${employeeId}`,
        "CRITICAL",
        `Manager ${user.name} initiated emergency device attestation revocation.`
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
        currentSector,
        setSector,
        login,
        logout,
        switchRole,
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
