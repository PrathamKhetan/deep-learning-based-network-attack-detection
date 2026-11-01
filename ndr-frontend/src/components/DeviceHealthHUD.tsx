"use client";

import React, { useState, useEffect } from "react";
import {
  Laptop,
  Shield,
  ShieldCheck,
  Cpu,
  HardDrive,
  Activity,
  Radio,
  Lock,
  X,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Zap,
  Wifi
} from "lucide-react";
import { DeviceHardwareInfo } from "@/types/telemetry";
import { telemetryClient } from "@/lib/telemetryClient";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceHealthHUD: React.FC<Props> = ({ isOpen, onClose }) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceHardwareInfo | null>(null);
  const [isAttesting, setIsAttesting] = useState(false);
  const [attestSuccess, setAttestSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDeviceInfo(telemetryClient.getDeviceHardwareInfo());
    }
  }, [isOpen]);

  const handleRunAttestation = () => {
    setIsAttesting(true);
    setAttestSuccess(false);
    setTimeout(() => {
      setIsAttesting(false);
      setAttestSuccess(true);
      setTimeout(() => setAttestSuccess(false), 3500);
    }, 1200);
  };

  if (!isOpen || !deviceInfo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl cyber-panel rounded-2xl border border-cyber-cyan/50 shadow-2xl overflow-hidden flex flex-col font-mono text-xs">
        {/* Header */}
        <div className="bg-black/80 px-6 py-4 border-b border-cyber-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyber-cyan/15 border border-cyber-cyan text-cyber-cyan shadow-neon-cyan">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  ENDPOINT DETECTION & RESPONSE (EDR) &bull; WORKSTATION TELEMETRY
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan">
                  DEVICE POSTURE: VERIFIED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Cryptographic Hardware Attestation &bull; Zero-Trust Tunnel Status
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

        {/* Banner if attested */}
        {attestSuccess && (
          <div className="px-6 py-2 bg-cyber-emerald/20 border-b border-cyber-emerald/50 text-cyber-emerald flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              Continuous Hardware Attestation Confirmed: TPM 2.0 / Secure Enclave Hash Matched Root of Trust.
            </span>
            <span className="text-[10px]">Attestation Token: #ZTA-SHA256-{Date.now().toString().slice(-4)}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Top Grid: Machine Identity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-black/60 border border-slate-800 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-cyber-cyan" />
                <span>Workstation Hardware Specification</span>
              </div>
              <div className="text-white font-bold text-sm">{deviceInfo.workstationModel}</div>
              <div className="text-slate-300 text-[11px]">
                Device ID: <strong className="text-cyber-cyan">{deviceInfo.deviceId}</strong>
              </div>
              <div className="text-slate-400 text-[10px] break-all leading-tight">
                Kernel: {deviceInfo.kernelVersion}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-slate-800 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyber-emerald" />
                <span>Zero-Trust Operator Assignment</span>
              </div>
              <div className="text-white font-bold text-sm">
                {deviceInfo.assignedEmployeeName} ({deviceInfo.assignedEmployeeId})
              </div>
              <div className="text-cyber-emerald text-[11px] font-semibold">
                {deviceInfo.assignedSector}
              </div>
              <div className="text-slate-400 text-[11px] flex items-center justify-between">
                <span>Static Local IP: <strong className="text-slate-200">{deviceInfo.ipAddress}</strong></span>
                <span>MAC: <strong className="text-slate-200">{deviceInfo.macAddress}</strong></span>
              </div>
            </div>
          </div>

          {/* Security Posture Modules */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-cyber-cyan/30 flex flex-col justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>Hardware Root of Trust</span>
                </div>
                <div className="text-cyber-cyan font-bold text-xs">{deviceInfo.tpmStatus}</div>
              </div>
              <div className="mt-2 text-[10px] text-cyber-emerald flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Secure Boot: ACTIVE</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-cyber-emerald/30 flex flex-col justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5 mb-1">
                  <Lock className="w-3.5 h-3.5 text-cyber-emerald" />
                  <span>Zero-Trust Microtunnel</span>
                </div>
                <div className="text-cyber-emerald font-bold text-xs">WireGuard AES-256</div>
              </div>
              <div className="mt-2 text-[10px] text-cyber-emerald flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-ping" />
                <span>Tunnel: {deviceInfo.wireguardTunnel}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-cyber-purple/30 flex flex-col justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5 mb-1">
                  <Terminal className="w-3.5 h-3.5 text-cyber-purple" />
                  <span>Kernel EDR Sensor</span>
                </div>
                <div className="text-purple-200 font-bold text-xs">{deviceInfo.ebpfProbeState}</div>
              </div>
              <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                <span>Buffer: {deviceInfo.localPacketBufferCount.toLocaleString()} pkts</span>
              </div>
            </div>
          </div>

          {/* Performance & Real-Time Resource Gauges */}
          <div className="p-4 rounded-xl bg-black/40 border border-slate-800 space-y-3">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Workstation Sensor Load & NIC Cadence</span>
              <span className="text-[10px] text-slate-400">{deviceInfo.networkInterface}</span>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Sensor Engine CPU Usage</span>
                  <span className="text-cyber-cyan font-bold">{deviceInfo.cpuUsagePct}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-cyber-cyan h-full rounded-full transition-all duration-500"
                    style={{ width: `${deviceInfo.cpuUsagePct * 3}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Protected RAM Allocation</span>
                  <span className="text-cyber-emerald font-bold">{(deviceInfo.ramAllocatedMb / 1024).toFixed(1)} GB / 36 GB</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-cyber-emerald h-full rounded-full transition-all duration-500"
                    style={{ width: "35%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-black/90 px-6 py-3 border-t border-cyber-border flex items-center justify-between">
          <span className="text-[10px] text-slate-500">
            Last Attestation: {deviceInfo.lastAttestationCheck}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunAttestation}
              disabled={isAttesting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-cyan/20 hover:bg-cyber-cyan/30 border border-cyber-cyan text-cyber-cyan text-xs font-bold transition-all shadow-neon-cyan"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAttesting ? "animate-spin" : ""}`} />
              <span>{isAttesting ? "CHALLENGING SECURE ENCLAVE..." : "RUN HARDWARE ATTESTATION"}</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
