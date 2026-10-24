"use client";

import React, { useState, useEffect } from "react";
import { NetworkNode, BlastRadiusResult } from "@/types/telemetry";
import { telemetryClient } from "@/lib/telemetryClient";
import { Shield, Server, Router, Radio, AlertTriangle, Lock, Unlock, Search, X, Check, Flame } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectNodeInTopology?: (nodeId: string) => void;
}

export const AssetScannerModal: React.FC<Props> = ({ isOpen, onClose, onSelectNodeInTopology }) => {
  const [assets, setAssets] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [blastRadius, setBlastRadius] = useState<BlastRadiusResult | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAssets();
    }
  }, [isOpen]);

  const loadAssets = async () => {
    setLoading(true);
    const data = await telemetryClient.getAssets();
    setAssets(data);
    if (data.length > 0 && !selectedAsset) {
      setSelectedAsset(data[0]);
      setBlastRadius(data[0].blast_radius);
    }
    setLoading(false);
  };

  const handleSelectAsset = (asset: any) => {
    setSelectedAsset(asset);
    setBlastRadius(asset.blast_radius);
  };

  const handleIsolateToggle = async (nodeId: string, currentIsolated: boolean) => {
    await telemetryClient.remediateNode(nodeId, !currentIsolated);
    // Reload updated asset list
    await loadAssets();
    if (selectedAsset?.id === nodeId) {
      setSelectedAsset((prev: any) => ({
        ...prev,
        isolated: !currentIsolated,
        status: !currentIsolated ? "isolated" : "healthy"
      }));
    }
  };

  if (!isOpen) return null;

  const filteredAssets = assets.filter(a => {
    const q = searchTerm.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.ip.includes(q) ||
      a.role.toLowerCase().includes(q) ||
      a.cves.some((c: any) => c.id.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-6xl cyber-panel rounded-2xl border border-cyber-cyan/40 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-black/60 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyber-cyan/15 border border-cyber-cyan text-cyber-cyan">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-mono text-white tracking-wider uppercase">
                ATTACK SURFACE MANAGEMENT (ASM) & BLAST RADIUS SCANNER
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Continuous CVSS Vulnerability Correlation & Network Compromise Propagation Modeling
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

        {/* Search & Stats Bar */}
        <div className="px-6 py-3 bg-black/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Filter by IP, Hostname, Service, or CVE ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-black/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyber-cyan"
            />
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Discovered Assets: <strong className="text-white">{assets.length}</strong></span>
            <span>Unremediated CVEs: <strong className="text-cyber-red">
              {assets.reduce((acc, a) => acc + (a.cves?.filter((c: any) => !c.remediated).length || 0), 0)}
            </strong></span>
          </div>
        </div>

        {/* Main Content: Split View Matrix & Blast Radius */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Asset Matrix Table (7 Cols) */}
          <div className="lg:col-span-7 p-4 overflow-x-auto">
            <h3 className="text-xs font-mono font-bold text-cyber-cyan uppercase tracking-wider mb-3">
              ACTIVE NETWORK ASSET INVENTORY
            </h3>
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500">
                  <th className="pb-2">ASSET / IP</th>
                  <th className="pb-2">ROLE</th>
                  <th className="pb-2">OPEN PORTS</th>
                  <th className="pb-2">MAX CVSS</th>
                  <th className="pb-2">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {filteredAssets.map((asset) => {
                  const isSelected = selectedAsset?.id === asset.id;
                  return (
                    <tr
                      key={asset.id}
                      onClick={() => handleSelectAsset(asset)}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? "bg-cyber-cyan/15 text-white" 
                          : "hover:bg-black/40 text-slate-300"
                      }`}
                    >
                      <td className="py-2.5 pr-2">
                        <div className="font-bold flex items-center gap-1.5">
                          {asset.name}
                        </div>
                        <span className="text-[10px] text-cyber-cyan">{asset.ip}</span>
                      </td>
                      <td className="py-2.5 pr-2 text-slate-400">{asset.role}</td>
                      <td className="py-2.5 pr-2">
                        <span className="px-1.5 py-0.5 rounded bg-black/60 border border-slate-800 text-slate-300 text-[10px]">
                          {asset.open_ports?.join(", ")}
                        </span>
                      </td>
                      <td className="py-2.5 pr-2">
                        {asset.max_cvss > 0 ? (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            asset.max_cvss >= 9.0 
                              ? "bg-cyber-red/20 border border-cyber-red text-cyber-red" 
                              : "bg-amber-500/20 border border-amber-500 text-amber-300"
                          }`}>
                            {asset.max_cvss.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-slate-600">None</span>
                        )}
                      </td>
                      <td className="py-2.5">
                        {asset.isolated ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            ISOLATED
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/40">
                            ONLINE
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Blast Radius & Risk Calculator Panel (5 Cols) */}
          <div className="lg:col-span-5 p-6 bg-black/30 flex flex-col justify-between">
            {selectedAsset ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Selected Target Analysis</span>
                    <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
                      {selectedAsset.name}
                    </h3>
                    <p className="text-xs text-cyber-cyan font-mono">{selectedAsset.ip} &bull; {selectedAsset.mac}</p>
                  </div>
                  <button
                    onClick={() => handleIsolateToggle(selectedAsset.id, selectedAsset.isolated)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                      selectedAsset.isolated
                        ? "bg-cyber-emerald/20 border border-cyber-emerald text-cyber-emerald"
                        : "bg-cyber-red/20 border border-cyber-red text-cyber-red shadow-neon-red"
                    }`}
                  >
                    {selectedAsset.isolated ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>{selectedAsset.isolated ? "RESTORE LINK" : "ISOLATE NODE"}</span>
                  </button>
                </div>

                {/* Blast Radius Heatmap Card */}
                {blastRadius && (
                  <div className="cyber-panel rounded-xl p-4 border border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-cyber-red" />
                        <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                          COMPROMISE BLAST RADIUS
                        </h4>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        blastRadius.aggregate_exposure_score > 6 
                          ? "bg-cyber-red/20 border-cyber-red text-cyber-red" 
                          : "bg-cyber-emerald/20 border-cyber-emerald text-cyber-emerald"
                      }`}>
                        {blastRadius.containment_recommendation}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 mb-3">
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono block">AGGREGATE EXPOSURE</span>
                        <div className="text-2xl font-bold font-mono text-cyber-red">
                          {blastRadius.aggregate_exposure_score} <span className="text-xs text-slate-400">/ 10.0</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 font-mono block">AFFECTED NODES</span>
                        <div className="text-2xl font-bold font-mono text-white">
                          {blastRadius.affected_count} <span className="text-xs text-slate-400">HOSTS</span>
                        </div>
                      </div>
                    </div>

                    {/* Neighbor Propagation List */}
                    <div className="space-y-2 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">Direct 1-Hop Adjacent Neighbors:</span>
                        <div className="flex flex-wrap gap-1">
                          {blastRadius.one_hop_neighbors.map(n => (
                            <span key={n} className="px-2 py-0.5 rounded bg-black/60 border border-cyber-red/40 text-cyber-red text-[10px]">
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>

                      {blastRadius.two_hop_neighbors.length > 0 && (
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-1">Secondary 2-Hop Subnet Radius:</span>
                          <div className="flex flex-wrap gap-1">
                            {blastRadius.two_hop_neighbors.map(n => (
                              <span key={n} className="px-2 py-0.5 rounded bg-black/60 border border-amber-500/40 text-amber-300 text-[10px]">
                                {n}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* CVE Exposure Details */}
                <div className="space-y-2 text-xs font-mono">
                  <h4 className="text-[11px] font-bold text-slate-300 uppercase">
                    Vulnerability Signatures ({selectedAsset.cves?.length || 0})
                  </h4>
                  {selectedAsset.cves?.length === 0 ? (
                    <div className="p-3 rounded bg-black/40 border border-slate-800 text-slate-500 italic">
                      Zero known CVEs reported on this network endpoint.
                    </div>
                  ) : (
                    selectedAsset.cves.map((c: any) => (
                      <div key={c.id} className="p-2.5 rounded bg-black/40 border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-200">{c.id}: {c.name}</div>
                          <span className="text-[10px] text-slate-400">
                            Status: {c.remediated ? "Remediated in Base Image" : "Active Exposure / Exploit Risk"}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          c.cvss >= 9.0 ? "bg-cyber-red/20 border-cyber-red text-cyber-red" : "bg-amber-500/20 border-amber-500 text-amber-300"
                        }`}>
                          CVSS {c.cvss}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 font-mono py-12">
                Select an asset from the table to calculate compromise blast radius.
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-black/60 hover:bg-black/80 border border-slate-700 text-xs font-mono text-slate-300 transition-colors"
              >
                Close Scanner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
