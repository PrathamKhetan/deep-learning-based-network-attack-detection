"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { NetworkNode, NetworkEdge, AttackType, TelemetryBurst } from "@/types/telemetry";
import { Shield, Server, Router, Radio, Skull, Zap, Lock, Unlock, Eye, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import { telemetryClient } from "@/lib/telemetryClient";

interface Props {
  telemetry: TelemetryBurst | null;
  onSelectNode: (node: NetworkNode) => void;
  selectedNodeId?: string | null;
}

interface Particle {
  sourceId: string;
  targetId: string;
  progress: number;
  speed: number;
  isAttack: boolean;
}

export const NetworkTopology3D: React.FC<Props> = ({ telemetry, onSelectNode, selectedNodeId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 3D Orbital camera state
  const cameraRef = useRef({
    rotX: 0.35,
    rotY: -0.45,
    zoom: 1.0,
    panX: 0,
    panY: 0,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    isShaking: false,
    shakeIntensity: 0
  });

  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
  const [activeNode, setActiveNode] = useState<NetworkNode | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  const nodes = telemetry?.topology?.nodes || [];
  const edges = telemetry?.topology?.edges || [];
  const activeAttack = telemetry?.active_attack || null;
  const attackRay = telemetry?.attack_vector_ray || null;

  // Sync selected node from outside
  useEffect(() => {
    if (selectedNodeId) {
      const found = nodes.find(n => n.id === selectedNodeId);
      if (found) setActiveNode(found);
    }
  }, [selectedNodeId, nodes]);

  // Attack shockwave & camera shake trigger
  useEffect(() => {
    if (activeAttack) {
      cameraRef.current.isShaking = true;
      cameraRef.current.shakeIntensity = 12;
      const t = setTimeout(() => {
        cameraRef.current.isShaking = false;
        cameraRef.current.shakeIntensity = 0;
      }, 1400);
      return () => clearTimeout(t);
    }
  }, [activeAttack]);

  // Particle simulation state
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const pList: Particle[] = [];
    edges.forEach((e) => {
      // 2 energy pulses per link
      pList.push({
        sourceId: e.source,
        targetId: e.target,
        progress: Math.random(),
        speed: 0.006 + Math.random() * 0.004,
        isAttack: false
      });
    });
    particlesRef.current = pList;
  }, [edges.length]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      if (containerRef.current && canvas) {
        const rect = containerRef.current.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const dpr = window.devicePixelRatio || 1;

      // Handle subtle auto-rotation if idle
      if (autoRotate && !cameraRef.current.isDragging) {
        cameraRef.current.rotY += 0.0018;
      }

      // Camera shake decay
      let shakeOffsetX = 0;
      let shakeOffsetY = 0;
      if (cameraRef.current.isShaking && cameraRef.current.shakeIntensity > 0.1) {
        shakeOffsetX = (Math.random() - 0.5) * cameraRef.current.shakeIntensity * dpr;
        shakeOffsetY = (Math.random() - 0.5) * cameraRef.current.shakeIntensity * dpr;
        cameraRef.current.shakeIntensity *= 0.94;
      }

      ctx.save();
      ctx.clearRect(0, 0, width, height);

      // Deep space grid backdrop
      const cx = width / 2 + cameraRef.current.panX * dpr + shakeOffsetX;
      const cy = height / 2 + cameraRef.current.panY * dpr + shakeOffsetY;
      const zoom = cameraRef.current.zoom * dpr;

      // 3D Projection math
      const cosX = Math.cos(cameraRef.current.rotX);
      const sinX = Math.sin(cameraRef.current.rotX);
      const cosY = Math.cos(cameraRef.current.rotY);
      const sinY = Math.sin(cameraRef.current.rotY);

      const project3D = (x: number, y: number, z: number) => {
        // Rotate Y
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;

        // Rotate X
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        // Perspective projection
        const fov = 750;
        const scale = fov / (fov + z2 + 350) * zoom;
        const screenX = cx + x1 * scale;
        const screenY = cy + y2 * scale;

        return { screenX, screenY, scale, z: z2 };
      };

      // Map node projection coordinates
      const projectedNodes = new Map<string, { node: NetworkNode; sx: number; sy: number; scale: number; z: number }>();
      nodes.forEach(node => {
        const proj = project3D(node.x, node.y, node.z);
        projectedNodes.set(node.id, { node, sx: proj.screenX, sy: proj.screenY, scale: proj.scale, z: proj.z });
      });

      // 1. Draw Grid Plane in 3D
      ctx.lineWidth = 1;
      const gridSize = 450;
      const gridStep = 90;
      ctx.strokeStyle = "rgba(0, 240, 255, 0.05)";
      ctx.beginPath();
      for (let g = -gridSize; g <= gridSize; g += gridStep) {
        const p1 = project3D(g, 160, -gridSize);
        const p2 = project3D(g, 160, gridSize);
        ctx.moveTo(p1.screenX, p1.screenY);
        ctx.lineTo(p2.screenX, p2.screenY);

        const p3 = project3D(-gridSize, 160, g);
        const p4 = project3D(gridSize, 160, g);
        ctx.moveTo(p3.screenX, p3.screenY);
        ctx.lineTo(p4.screenX, p4.screenY);
      }
      ctx.stroke();

      // 2. Draw Connections / Lasers
      edges.forEach(edge => {
        const pSrc = projectedNodes.get(edge.source);
        const pTgt = projectedNodes.get(edge.target);
        if (!pSrc || !pTgt) return;

        const isSevered = edge.severed || pSrc.node.isolated || pTgt.node.isolated;
        const isAttackLink = activeAttack && attackRay && 
          ((attackRay.source === edge.source && attackRay.target === edge.target) ||
           (attackRay.source === edge.target && attackRay.target === edge.source));

        ctx.beginPath();
        ctx.moveTo(pSrc.sx, pSrc.sy);
        ctx.lineTo(pTgt.sx, pTgt.sy);

        if (isSevered) {
          // Dissolved / severed connection
          ctx.strokeStyle = "rgba(100, 116, 139, 0.2)";
          ctx.lineWidth = 1 * dpr;
          ctx.setLineDash([4 * dpr, 6 * dpr]);
          ctx.stroke();
          ctx.setLineDash([]);
        } else if (isAttackLink) {
          // Aggressive Attack Laser Pulse
          ctx.strokeStyle = "rgba(255, 0, 85, 0.85)";
          ctx.lineWidth = 3.5 * dpr;
          ctx.shadowColor = "#ff0055";
          ctx.shadowBlur = 18 * dpr;
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else {
          // Healthy Laser link (emerald/cyan energy)
          ctx.strokeStyle = "rgba(0, 240, 255, 0.28)";
          ctx.lineWidth = 1.5 * dpr;
          ctx.shadowColor = "#00f0ff";
          ctx.shadowBlur = 4 * dpr;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      });

      // 3. Draw Traveling Energy / Attack Particles
      if (particlesRef.current.length > 0) {
        particlesRef.current.forEach(p => {
          p.progress += p.speed;
          if (p.progress > 1) p.progress = 0;

          const pSrc = projectedNodes.get(p.sourceId);
          const pTgt = projectedNodes.get(p.targetId);
          if (!pSrc || !pTgt || pSrc.node.isolated || pTgt.node.isolated) return;

          const isAttackLink = activeAttack && attackRay && 
            ((attackRay.source === p.sourceId && attackRay.target === p.targetId) ||
             (attackRay.source === p.targetId && attackRay.target === p.sourceId));

          const px = pSrc.sx + (pTgt.sx - pSrc.sx) * p.progress;
          const py = pSrc.sy + (pTgt.sy - pSrc.sy) * p.progress;
          const pRadius = (isAttackLink ? 4.5 : 2.5) * dpr;

          ctx.beginPath();
          ctx.arc(px, py, pRadius, 0, Math.PI * 2);
          if (isAttackLink) {
            ctx.fillStyle = "#ff0055";
            ctx.shadowColor = "#ff0055";
            ctx.shadowBlur = 12 * dpr;
          } else {
            ctx.fillStyle = "#00ff9d";
            ctx.shadowColor = "#00ff9d";
            ctx.shadowBlur = 8 * dpr;
          }
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // Extra Attack Vector Ray Particles if attack is active
      if (activeAttack && attackRay) {
        const pSrc = projectedNodes.get(attackRay.source);
        const pTgt = projectedNodes.get(attackRay.target);
        if (pSrc && pTgt) {
          const t = (Date.now() % 800) / 800;
          const px = pSrc.sx + (pTgt.sx - pSrc.sx) * t;
          const py = pSrc.sy + (pTgt.sy - pSrc.sy) * t;

          ctx.beginPath();
          ctx.arc(px, py, 6 * dpr, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#ff0055";
          ctx.shadowBlur = 24 * dpr;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // 4. Sort Nodes by Z-depth for correct painter's algorithm
      const sortedNodes = Array.from(projectedNodes.values()).sort((a, b) => b.z - a.z);

      sortedNodes.forEach(({ node, sx, sy, scale }) => {
        const isHovered = hoveredNode?.id === node.id;
        const isSelected = activeNode?.id === node.id;
        const isCompromised = node.status === "compromised" || (activeAttack && attackRay?.target === node.id);
        const isAnomalous = node.status === "anomalous";
        const isIsolated = node.isolated;

        const baseRadius = (node.type === "soc" ? 22 : (node.type === "router" ? 17 : 14)) * scale;

        // Draw Pulsating Outer Aura
        const pulse = Math.sin(Date.now() / 250) * 4 * scale;
        ctx.beginPath();
        ctx.arc(sx, sy, baseRadius + 8 * scale + pulse, 0, Math.PI * 2);

        if (isIsolated) {
          ctx.fillStyle = "rgba(100, 116, 139, 0.1)";
          ctx.strokeStyle = "rgba(100, 116, 139, 0.4)";
        } else if (isCompromised) {
          ctx.fillStyle = "rgba(255, 0, 85, 0.25)";
          ctx.strokeStyle = "#ff0055";
          ctx.shadowColor = "#ff0055";
          ctx.shadowBlur = 20 * dpr;
        } else if (isAnomalous) {
          ctx.fillStyle = "rgba(255, 183, 0, 0.2)";
          ctx.strokeStyle = "#ffb700";
        } else {
          ctx.fillStyle = "rgba(0, 240, 255, 0.12)";
          ctx.strokeStyle = isSelected ? "#00ff9d" : "#00f0ff";
          if (isSelected) {
            ctx.shadowColor = "#00ff9d";
            ctx.shadowBlur = 15 * dpr;
          }
        }

        ctx.lineWidth = (isSelected || isHovered ? 2.5 : 1.5) * dpr;
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Core Solid Node Body
        ctx.beginPath();
        ctx.arc(sx, sy, baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = isIsolated ? "#1e293b" : (isCompromised ? "#7f1d1d" : (node.type === "soc" ? "#064e3b" : "#0f172a"));
        ctx.fill();

        // Node Inner Symbol / Dot
        ctx.beginPath();
        ctx.arc(sx, sy, baseRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = isIsolated ? "#64748b" : (isCompromised ? "#ff0055" : (node.type === "soc" ? "#00ff9d" : "#00f0ff"));
        ctx.fill();

        // Node Title & IP Label
        ctx.font = `${Math.max(10, Math.round(11 * scale))}px monospace`;
        ctx.textAlign = "center";
        ctx.fillStyle = isCompromised ? "#ff4d79" : "#e2e8f0";
        ctx.fillText(node.name, sx, sy - baseRadius - 10 * scale);

        ctx.font = `${Math.max(8, Math.round(9 * scale))}px monospace`;
        ctx.fillStyle = isIsolated ? "#64748b" : "rgba(0, 240, 255, 0.75)";
        ctx.fillText(node.ip + (isIsolated ? " [ISOLATED]" : ""), sx, sy + baseRadius + 14 * scale);
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [nodes, edges, activeAttack, attackRay, hoveredNode, activeNode, autoRotate]);

  // Mouse Interaction: Orbital Drag & Click Selection
  const handleMouseDown = (e: React.MouseEvent) => {
    cameraRef.current.isDragging = true;
    cameraRef.current.lastMouseX = e.clientX;
    cameraRef.current.lastMouseY = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (cameraRef.current.isDragging) {
      const dx = e.clientX - cameraRef.current.lastMouseX;
      const dy = e.clientY - cameraRef.current.lastMouseY;
      cameraRef.current.rotY += dx * 0.005;
      cameraRef.current.rotX += dy * 0.005;
      // Clamp elevation
      cameraRef.current.rotX = Math.max(-1.2, Math.min(1.2, cameraRef.current.rotX));
      cameraRef.current.lastMouseX = e.clientX;
      cameraRef.current.lastMouseY = e.clientY;
      return;
    }

    // Hover hit-testing
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
    const dpr = window.devicePixelRatio || 1;

    const cx = canvas.width / 2 + cameraRef.current.panX * dpr;
    const cy = canvas.height / 2 + cameraRef.current.panY * dpr;
    const zoom = cameraRef.current.zoom * dpr;
    const cosX = Math.cos(cameraRef.current.rotX);
    const sinX = Math.sin(cameraRef.current.rotX);
    const cosY = Math.cos(cameraRef.current.rotY);
    const sinY = Math.sin(cameraRef.current.rotY);

    let match: NetworkNode | null = null;
    for (const node of nodes) {
      const x1 = node.x * cosY + node.z * sinY;
      const z1 = -node.x * sinY + node.z * cosY;
      const y2 = node.y * cosX - z1 * sinX;
      const z2 = node.y * sinX + z1 * cosX;
      const fov = 750;
      const scale = fov / (fov + z2 + 350) * zoom;
      const sx = cx + x1 * scale;
      const sy = cy + y2 * scale;
      const radius = 24 * scale;

      const dist = Math.hypot(mouseX - sx, mouseY - sy);
      if (dist <= radius) {
        match = node;
        break;
      }
    }
    setHoveredNode(match);
  };

  const handleMouseUp = () => {
    cameraRef.current.isDragging = false;
  };

  const handleClick = () => {
    if (hoveredNode) {
      setActiveNode(hoveredNode);
      onSelectNode(hoveredNode);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    cameraRef.current.zoom = Math.max(0.4, Math.min(2.5, cameraRef.current.zoom + delta));
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full min-h-[500px] cyber-panel rounded-xl overflow-hidden select-none border border-cyber-border scanlines"
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Screen Bloom Alert Overlay during active attack */}
      {activeAttack && (
        <div className="absolute inset-0 pointer-events-none bg-cyber-red/10 animate-pulse border-2 border-cyber-red/40" />
      )}

      {/* Camera Controls Overlay HUD */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur border border-cyber-border text-xs font-mono text-slate-300">
          <Eye className="w-3.5 h-3.5 text-cyber-cyan" />
          <span>3D SPATIAL MESH</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyber-emerald">{nodes.length} NODES</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyber-cyan">{edges.length} LINKS</span>
        </div>

        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-1.5 rounded-lg border text-xs font-mono transition-colors ${
            autoRotate 
              ? "bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan shadow-sm" 
              : "bg-black/60 border-slate-700 text-slate-400 hover:text-white"
          }`}
          title="Toggle Auto Orbital Rotation"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin" : ""}`} />
        </button>

        <button
          onClick={() => { cameraRef.current.zoom = Math.min(2.5, cameraRef.current.zoom + 0.2); }}
          className="p-1.5 rounded-lg bg-black/60 border border-slate-700 text-slate-300 hover:text-white"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => { cameraRef.current.zoom = Math.max(0.5, cameraRef.current.zoom - 0.2); }}
          className="p-1.5 rounded-lg bg-black/60 border border-slate-700 text-slate-300 hover:text-white"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Node Inspection Drawer */}
      {activeNode && (
        <div className="absolute bottom-4 right-4 max-w-sm w-full cyber-panel rounded-xl p-4 border border-cyber-cyan/30 z-30 shadow-2xl backdrop-blur-xl animate-fade-in">
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg border ${
                activeNode.isolated 
                  ? "bg-slate-800 border-slate-600 text-slate-400" 
                  : (activeNode.status === "compromised" 
                      ? "bg-cyber-red/20 border-cyber-red text-cyber-red" 
                      : "bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan")
              }`}>
                {activeNode.type === "soc" ? <Shield className="w-5 h-5" /> : 
                 activeNode.type === "router" ? <Router className="w-5 h-5" /> : 
                 activeNode.type === "probe" ? <Radio className="w-5 h-5" /> : 
                 <Server className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-bold font-mono text-sm text-white flex items-center gap-1.5">
                  {activeNode.name}
                  {activeNode.isolated && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      ISOLATED
                    </span>
                  )}
                </h3>
                <p className="text-xs text-cyber-cyan font-mono">{activeNode.ip} &bull; {activeNode.mac}</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveNode(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-black/40 border border-slate-800"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Role:</span>
              <span className="text-slate-200">{activeNode.role}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">OS / Banner:</span>
              <span className="text-slate-300">{activeNode.os}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Risk Score:</span>
              <span className={`font-bold ${activeNode.risk_score > 6 ? "text-cyber-red" : "text-cyber-emerald"}`}>
                {activeNode.risk_score.toFixed(1)} / 10.0
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Open Ports:</span>
              <span className="text-cyber-cyan">[{activeNode.open_ports.join(", ")}]</span>
            </div>

            {/* CVE Badges */}
            {activeNode.cves.length > 0 && (
              <div className="pt-1">
                <span className="text-slate-400 block mb-1">Known CVE Exposures:</span>
                <div className="flex flex-wrap gap-1">
                  {activeNode.cves.map(cve => (
                    <span 
                      key={cve.id} 
                      className={`text-[10px] px-2 py-0.5 rounded border ${
                        cve.severity === "CRITICAL" 
                          ? "bg-cyber-red/20 border-cyber-red text-cyber-red" 
                          : "bg-amber-500/20 border-amber-500 text-amber-300"
                      }`}
                    >
                      {cve.id} (CVSS {cve.cvss})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Remediation: Isolate / Restore Node */}
            <div className="pt-3">
              <button
                onClick={() => {
                  const newIsolated = !activeNode.isolated;
                  telemetryClient.remediateNode(activeNode.id, newIsolated);
                  setActiveNode({ ...activeNode, isolated: newIsolated, status: newIsolated ? "isolated" : "healthy" });
                }}
                className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-mono text-xs font-bold transition-all ${
                  activeNode.isolated
                    ? "bg-cyber-emerald/20 hover:bg-cyber-emerald/30 border border-cyber-emerald text-cyber-emerald shadow-neon-emerald"
                    : "bg-cyber-red/20 hover:bg-cyber-red/30 border border-cyber-red text-cyber-red shadow-neon-red"
                }`}
              >
                {activeNode.isolated ? (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>RECONNECT & RESTORE LASER LINK</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>SEVER LINK & ISOLATE NODE</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
