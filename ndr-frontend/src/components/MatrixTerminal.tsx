"use client";

import React, { useState, useEffect, useRef } from "react";
import { TerminalLog, Severity } from "@/types/telemetry";
import { Terminal, Pause, Play, Trash2, Filter, Search } from "lucide-react";

interface Props {
  latestLog: TerminalLog | null;
}

export const MatrixTerminal: React.FC<Props> = ({ latestLog }) => {
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Append new logs as they stream in
  useEffect(() => {
    if (latestLog) {
      setLogs(prev => {
        // Prevent duplicate IDs
        if (prev.some(l => l.id === latestLog.id)) return prev;
        const next = [...prev, latestLog];
        // Keep max 150 entries in memory for performance
        return next.length > 150 ? next.slice(-150) : next;
      });
    }
  }, [latestLog]);

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter(log => {
    if (severityFilter !== "ALL" && log.severity !== severityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.message.toLowerCase().includes(q) ||
        log.source.toLowerCase().includes(q) ||
        log.destination.toLowerCase().includes(q) ||
        log.detection.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getSeverityBadge = (sev: Severity) => {
    switch (sev) {
      case "CRITICAL":
        return <span className="px-1.5 py-0.5 rounded bg-cyber-red/20 border border-cyber-red text-cyber-red font-bold text-[9px]">CRITICAL</span>;
      case "WARN":
        return <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500 text-amber-300 font-bold text-[9px]">WARN</span>;
      case "INFO":
      default:
        return <span className="px-1.5 py-0.5 rounded bg-cyber-emerald/15 border border-cyber-emerald/40 text-cyber-emerald font-bold text-[9px]">INFO</span>;
    }
  };

  return (
    <div className="w-full cyber-panel rounded-xl border border-cyber-border overflow-hidden flex flex-col h-[320px]">
      {/* Terminal Title Bar */}
      <div className="bg-black/60 px-3 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyber-emerald" />
          <span className="font-bold text-white tracking-wider uppercase">
            MATRIX CYBER-TERMINAL
          </span>
          <span className="text-[10px] text-slate-500">
            [{logs.length} EVENTS RECORDED]
          </span>
        </div>

        {/* Filters and Controls */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2 top-2 text-slate-500" />
            <input
              type="text"
              placeholder="Filter logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-6 pr-2 py-0.5 text-[11px] bg-black/50 border border-slate-800 rounded text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyber-cyan w-28 md:w-36"
            />
          </div>

          {/* Severity Buttons */}
          <div className="flex items-center rounded border border-slate-800 overflow-hidden text-[10px]">
            {["ALL", "CRITICAL", "WARN", "INFO"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2 py-0.5 transition-colors ${
                  severityFilter === sev
                    ? "bg-cyber-cyan/20 text-cyber-cyan font-bold"
                    : "bg-black/40 text-slate-400 hover:text-white"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Auto-scroll toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1 rounded border text-[10px] ${
              autoScroll ? "bg-cyber-emerald/20 border-cyber-emerald text-cyber-emerald" : "bg-black/40 border-slate-800 text-slate-400"
            }`}
            title={autoScroll ? "Pause Auto-Scroll" : "Resume Auto-Scroll"}
          >
            {autoScroll ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>

          {/* Clear */}
          <button
            onClick={() => setLogs([])}
            className="p-1 rounded bg-black/40 border border-slate-800 text-slate-400 hover:text-cyber-red"
            title="Clear Terminal Logs"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div 
        ref={scrollRef}
        className="flex-1 p-3 overflow-y-auto space-y-1.5 font-mono text-[11px] select-text bg-[#03060f]/90"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-slate-600 italic py-6 text-center">
            Awaiting streaming NDR packet bursts and threat detections...
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div 
              key={log.id} 
              className={`flex items-start gap-2 py-0.5 px-1.5 rounded transition-colors ${
                log.severity === "CRITICAL" ? "bg-cyber-red/10 border-l-2 border-cyber-red" : "hover:bg-slate-900/60"
              }`}
            >
              <span className="text-slate-500 whitespace-nowrap">{log.timestamp}</span>
              {getSeverityBadge(log.severity)}
              <span className="text-cyber-cyan whitespace-nowrap">{log.source}</span>
              <span className="text-slate-600">&rarr;</span>
              <span className="text-slate-300 whitespace-nowrap">{log.destination}</span>
              <span className="text-slate-400 truncate flex-1">{log.message}</span>
            </div>
          ))
        )}
        {/* Blinking Cyber Cursor */}
        <div className="flex items-center gap-1 text-cyber-emerald pt-1">
          <span className="text-[10px] text-slate-600">&gt; telemetry_worker_daemon:</span>
          <span className="w-2 h-3.5 bg-cyber-emerald animate-pulse inline-block" />
        </div>
      </div>
    </div>
  );
};
