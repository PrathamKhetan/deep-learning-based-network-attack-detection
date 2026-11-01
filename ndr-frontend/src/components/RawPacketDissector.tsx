"use client";

import React, { useState, useEffect } from "react";
import {
  FileCode,
  Binary,
  Shield,
  Activity,
  X,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  Cpu
} from "lucide-react";
import { RawHexPacket } from "@/types/telemetry";
import { telemetryClient } from "@/lib/telemetryClient";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RawPacketDissector: React.FC<Props> = ({ isOpen, onClose }) => {
  const [packets, setPackets] = useState<RawHexPacket[]>([]);
  const [selectedPacket, setSelectedPacket] = useState<RawHexPacket | null>(null);
  const [filterBpf, setFilterBpf] = useState("");

  useEffect(() => {
    if (isOpen) {
      const data = telemetryClient.getRawHexPackets();
      setPackets(data);
      if (data.length > 0) {
        setSelectedPacket(data[0]);
      }
    }
  }, [isOpen]);

  const handleExportPcap = () => {
    const jsonStr = JSON.stringify(packets, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Aegis_Forensic_PCAP_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-5xl cyber-panel rounded-2xl border border-cyber-cyan/50 shadow-2xl overflow-hidden flex flex-col font-mono text-xs">
        {/* Header */}
        <div className="bg-black/80 px-6 py-4 border-b border-cyber-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyber-cyan/15 border border-cyber-cyan text-cyber-cyan shadow-neon-cyan">
              <Binary className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  RAW HEXADECIMAL PACKET DISSECTOR & FORENSIC SNIFFER
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan">
                  PCAP RING BUFFER
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Full Frame Layer-2 to Layer-7 Binary Inspection &bull; Promiscuous Device Driver
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportPcap}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Export PCAP JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-black/40 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="px-6 py-2.5 bg-black/50 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-slate-400 text-[11px]">BPF Filter:</span>
            <input
              type="text"
              placeholder="e.g. tcp and host 10.0.4.12 and port 443"
              value={filterBpf}
              onChange={(e) => setFilterBpf(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-cyber-cyan"
            />
          </div>
          <span className="text-[10px] text-slate-500">Buffer: 2 Live Captured Packets (Zero Packet Loss)</span>
        </div>

        {/* Dissector Main Split View */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 max-h-[72vh] overflow-y-auto">
          {/* Left Column: Packet List */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Captured Frame Frames
            </div>
            {packets.map((pkt) => {
              const isSelected = selectedPacket?.id === pkt.id;
              return (
                <div
                  key={pkt.id}
                  onClick={() => setSelectedPacket(pkt)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-cyber-cyan/15 border-cyber-cyan shadow-neon-cyan"
                      : "bg-black/50 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-xs">{pkt.id}</span>
                    <span className="text-[10px] text-slate-400">{pkt.timestamp}</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    <span className="text-cyber-cyan font-semibold">{pkt.protocol}</span> &bull; {pkt.lengthBytes} bytes
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 truncate">
                    {pkt.srcIp}:{pkt.srcPort} &rarr; {pkt.dstIp}:{pkt.dstPort}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Hex Dump & Header Fields Breakdown */}
          {selectedPacket && (
            <div className="lg:col-span-8 space-y-3">
              {/* Header Analysis Pill */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{selectedPacket.protocol} Frame</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/60 border border-slate-700 text-cyber-cyan">
                      TTL: {selectedPacket.ttl}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/60 border border-slate-700 text-cyber-emerald">
                      {selectedPacket.checksum}
                    </span>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-red/20 border border-cyber-red/40 text-cyber-red font-bold">
                    {selectedPacket.dnnVerdict || "ANOMALY EVALUATED"}
                  </span>
                </div>

                {/* TCP Flags Breakdown */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[10px]">
                  <span className="text-slate-400">TCP Flags:</span>
                  <span className={`px-1.5 py-0.5 rounded font-bold ${selectedPacket.tcpFlags.syn ? "bg-cyber-red text-black font-black" : "bg-slate-800 text-slate-500"}`}>
                    SYN: {selectedPacket.tcpFlags.syn ? "1" : "0"}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded font-bold ${selectedPacket.tcpFlags.ack ? "bg-cyber-emerald text-black" : "bg-slate-800 text-slate-500"}`}>
                    ACK: {selectedPacket.tcpFlags.ack ? "1" : "0"}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded font-bold ${selectedPacket.tcpFlags.psh ? "bg-cyber-amber text-black" : "bg-slate-800 text-slate-500"}`}>
                    PSH: {selectedPacket.tcpFlags.psh ? "1" : "0"}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded font-bold ${selectedPacket.tcpFlags.fin ? "bg-cyber-red text-black" : "bg-slate-800 text-slate-500"}`}>
                    FIN: {selectedPacket.tcpFlags.fin ? "1" : "0"}
                  </span>
                </div>
              </div>

              {/* Raw Hexadecimal Dump Window */}
              <div className="rounded-xl border border-cyber-border bg-[#030611] overflow-hidden">
                <div className="bg-black/80 px-4 py-2 border-b border-cyber-border flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
                    <span>RAW HEXADECIMAL & ASCII PAYLOAD DUMP</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Offset | Hex Stream | ASCII Decoded</span>
                </div>

                <div className="p-4 font-mono text-[11px] leading-relaxed text-cyber-cyan space-y-1 overflow-x-auto select-all">
                  {selectedPacket.hexLines.map((line, idx) => (
                    <div key={idx} className="hover:bg-slate-800/40 px-1 py-0.5 rounded transition-colors">
                      {line}
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-black/60 border-t border-slate-800/80 text-[10px] text-slate-400">
                  ASCII Translation: <span className="text-white font-semibold">{selectedPacket.asciiDump}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-black/90 px-6 py-2.5 border-t border-cyber-border flex items-center justify-between text-[10px] text-slate-500">
          <span>Wireshark-compatible Ethernet II / IP / TCP Frame Dissection</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
