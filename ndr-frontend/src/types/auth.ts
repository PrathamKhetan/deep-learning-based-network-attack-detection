import { SectorScope } from "./telemetry";

export type UserRole = "manager" | "employee";

export type ClearanceLevel = "LEVEL_4_EXECUTIVE" | "LEVEL_2_OPERATOR";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clearanceLevel: ClearanceLevel;
  department: string;
  title: string;
  employeeId: string;
  avatar?: string;
  shift: string;
  activeSessionId: string;
  lastLogin: string;
  permissions: string[];
  assignedSector: SectorScope;
  assignedDeviceId: string;
  assignedDeviceIp: string;
}

export type ActionSeverity = "CRITICAL" | "WARN" | "INFO";
export type ActionStatus = "SUCCESS" | "BLOCKED" | "FLAGGED";

export interface EmployeeAuditRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  email: string;
  role: UserRole;
  department: string;
  action: string;
  targetResource: string;
  sourceIp: string;
  timestamp: string;
  severity: ActionSeverity;
  status: ActionStatus;
  riskScore: number;
  details: string;
}

export interface EmployeeProfile {
  employeeId: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  department: string;
  shift: string;
  status: "ONLINE" | "ON_DUTY" | "OFF_DUTY" | "SUSPENDED";
  riskScore: number;
  recentActionsCount: number;
  lastActive: string;
  assignedWorkstation: string;
  assignedSector: SectorScope;
}
