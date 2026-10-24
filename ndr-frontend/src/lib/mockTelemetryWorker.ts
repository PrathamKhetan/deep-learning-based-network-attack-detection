import { TelemetryBurst, NetworkNode, NetworkEdge, AttackType, Severity } from "@/types/telemetry";

const INITIAL_NODES: NetworkNode[] = [
  {
    id: "node-soc-master",
    name: "SOC Master Core",
    ip: "10.0.0.1",
    mac: "00:1A:2B:3C:4D:01",
    type: "soc",
    role: "Central Command & SIEM Collector",
    status: "healthy",
    isolated: false,
    os: "Hardened Linux Kernel 6.8",
    open_ports: [443, 8443, 9092, 5432],
    services: ["HTTPS (TLS 1.3)", "Kafka Event Bus", "PostgreSQL Core"],
    cves: [
      { id: "CVE-2023-44487", name: "HTTP/2 Rapid Reset", cvss: 7.5, severity: "HIGH", remediated: true }
    ],
    risk_score: 2.1,
    x: 0, y: 0, z: 0
  },
  {
    id: "node-gw-alpha",
    name: "Subnet Alpha Router",
    ip: "10.0.1.1",
    mac: "00:1A:2B:3C:4D:02",
    type: "router",
    role: "Core Subnet Gateway",
    status: "healthy",
    isolated: false,
    os: "VyOS Enterprise Router 1.4",
    open_ports: [22, 53, 179, 80],
    services: ["BGP Routing", "DNS Resolver", "SSH Bastion"],
    cves: [
      { id: "CVE-2023-38606", name: "Kernel State Invalidation", cvss: 5.4, severity: "MEDIUM", remediated: false }
    ],
    risk_score: 3.8,
    x: -240, y: 90, z: 60
  },
  {
    id: "node-gw-beta",
    name: "Subnet Beta Router",
    ip: "10.0.2.1",
    mac: "00:1A:2B:3C:4D:03",
    type: "router",
    role: "DMZ Application Gateway",
    status: "healthy",
    isolated: false,
    os: "VyOS Enterprise Router 1.4",
    open_ports: [80, 443, 8080],
    services: ["NGINX Ingress Proxy", "TLS Offloader"],
    cves: [
      { id: "CVE-2024-3094", name: "XZ Liblzma Backdoor Probe", cvss: 8.1, severity: "HIGH", remediated: true }
    ],
    risk_score: 4.2,
    x: 240, y: 90, z: -60
  },
  {
    id: "node-db-cluster",
    name: "Primary Vault DB",
    ip: "10.0.1.50",
    mac: "00:1A:2B:3C:4D:04",
    type: "endpoint",
    role: "Database / Web Core",
    status: "healthy",
    isolated: false,
    os: "Ubuntu 22.04 LTS",
    open_ports: [5432, 6379, 9100],
    services: ["PostgreSQL 16", "Redis Cache", "Prometheus Exporter"],
    cves: [
      { id: "CVE-2021-44228", name: "Log4Shell Vector Check", cvss: 9.8, severity: "CRITICAL", remediated: true },
      { id: "CVE-2023-22515", name: "Broken Access Authorization", cvss: 9.1, severity: "CRITICAL", remediated: false }
    ],
    risk_score: 6.9,
    x: -310, y: -130, z: 100
  },
  {
    id: "node-app-srv1",
    name: "API Service Node Alpha",
    ip: "10.0.2.10",
    mac: "00:1A:2B:3C:4D:05",
    type: "endpoint",
    role: "REST & GraphQL Workload",
    status: "healthy",
    isolated: false,
    os: "Alpine Linux 3.19",
    open_ports: [8000, 9000],
    services: ["FastAPI ASGI Cluster", "gRPC Internal Mesh"],
    cves: [],
    risk_score: 2.4,
    x: 310, y: -110, z: -120
  },
  {
    id: "node-app-srv2",
    name: "Web Proxy Frontend",
    ip: "10.0.2.11",
    mac: "00:1A:2B:3C:4D:06",
    type: "endpoint",
    role: "Public Web Traffic Node",
    status: "healthy",
    isolated: false,
    os: "Alpine Linux 3.19",
    open_ports: [80, 443],
    services: ["Envoy Proxy", "WAF Engine"],
    cves: [
      { id: "CVE-2023-4807", name: "PKCS#7 Buffer Overflow Check", cvss: 7.8, severity: "HIGH", remediated: false }
    ],
    risk_score: 5.2,
    x: 170, y: -200, z: -30
  },
  {
    id: "node-probe-east",
    name: "Passive TAP Sensor East",
    ip: "10.0.1.254",
    mac: "00:1A:2B:3C:4D:07",
    type: "probe",
    role: "PCAP & NetFlow Probe",
    status: "healthy",
    isolated: false,
    os: "Debian Bookworm Sensor OS",
    open_ports: [4789],
    services: ["VXLAN Mirror Consumer", "Zeek Sensor"],
    cves: [],
    risk_score: 1.5,
    x: -140, y: 220, z: 140
  },
  {
    id: "node-probe-west",
    name: "Passive TAP Sensor West",
    ip: "10.0.2.254",
    mac: "00:1A:2B:3C:4D:08",
    type: "probe",
    role: "PCAP & NetFlow Probe",
    status: "healthy",
    isolated: false,
    os: "Debian Bookworm Sensor OS",
    open_ports: [4789],
    services: ["VXLAN Mirror Consumer", "Suricata IDS Core"],
    cves: [],
    risk_score: 1.7,
    x: 140, y: 220, z: -140
  }
];

const INITIAL_EDGES: NetworkEdge[] = [
  { source: "node-soc-master", target: "node-gw-alpha", latency_ms: 1.2, packet_rate: 450, bytes_sec: 850000, attack_active: false },
  { source: "node-soc-master", target: "node-gw-beta", latency_ms: 1.4, packet_rate: 520, bytes_sec: 980000, attack_active: false },
  { source: "node-gw-alpha", target: "node-db-cluster", latency_ms: 0.8, packet_rate: 340, bytes_sec: 1200000, attack_active: false },
  { source: "node-gw-alpha", target: "node-probe-east", latency_ms: 0.4, packet_rate: 890, bytes_sec: 2400000, attack_active: false },
  { source: "node-gw-beta", target: "node-app-srv1", latency_ms: 0.9, packet_rate: 610, bytes_sec: 1400000, attack_active: false },
  { source: "node-gw-beta", target: "node-app-srv2", latency_ms: 1.1, packet_rate: 780, bytes_sec: 1850000, attack_active: false },
  { source: "node-app-srv1", target: "node-db-cluster", latency_ms: 1.6, packet_rate: 420, bytes_sec: 920000, attack_active: false },
  { source: "node-gw-beta", target: "node-probe-west", latency_ms: 0.5, packet_rate: 860, bytes_sec: 2200000, attack_active: false }
];

const ATTACK_METADATA: Record<AttackType, any> = {
  DDOS_SYN_FLOOD: {
    name: "Volumetric DDoS / SYN Flood Simulation",
    severity: "CRITICAL" as Severity,
    description: "High-velocity TCP SYN burst exhausting connection state tables.",
    source: "EXTERNAL_BOTNET_SWARM",
    target: "node-soc-master",
    ports: [80, 443, 8443],
    attack_vector_ray: { source: "node-gw-alpha", target: "node-soc-master" }
  },
  STEALTH_RECON: {
    name: "Stealth Lateral Reconnaissance Sweep",
    severity: "WARN" as Severity,
    description: "Slow horizontal TCP SYN/FIN port sweep scanning internal endpoints.",
    source: "node-gw-alpha",
    target: "node-db-cluster",
    ports: [22, 80, 443, 5432, 6379, 8080],
    attack_vector_ray: { source: "node-gw-alpha", target: "node-db-cluster" }
  },
  APPLAYER_EXPLOIT: {
    name: "Application-Layer Exploit Payload (SQLi / XSS Mock)",
    severity: "CRITICAL" as Severity,
    description: "Obfuscated SQL injection and remote code execution payload in HTTP POST stream.",
    source: "node-app-srv2",
    target: "node-db-cluster",
    ports: [5432, 8000],
    attack_vector_ray: { source: "node-app-srv2", target: "node-db-cluster" }
  },
  ROGUE_NODE_JOIN: {
    name: "Rogue Unauthenticated Node Join",
    severity: "CRITICAL" as Severity,
    description: "Shadow endpoint MAC spoofing and ARP poisoning on Subnet Beta.",
    source: "node-rogue-x99",
    target: "node-gw-beta",
    ports: [4444, 1337],
    attack_vector_ray: { source: "node-rogue-x99", target: "node-gw-beta" }
  }
};

export class MockTelemetryWorker {
  private nodes: NetworkNode[] = JSON.parse(JSON.stringify(INITIAL_NODES));
  private edges: NetworkEdge[] = JSON.parse(JSON.stringify(INITIAL_EDGES));
  private activeAttack: AttackType | null = null;
  private eventCount = 1000;

  public setAttack(attack: AttackType | null) {
    this.activeAttack = attack;
    if (attack === "ROGUE_NODE_JOIN") {
      this.addRogueNode();
    } else {
      this.removeRogueNode();
    }
  }

  public getActiveAttack(): AttackType | null {
    return this.activeAttack;
  }

  public isolateNode(nodeId: string, isolate: boolean = true) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) {
      node.isolated = isolate;
      node.status = isolate ? "isolated" : "healthy";
    }
    this.edges.forEach(e => {
      if (e.source === nodeId || e.target === nodeId) {
        e.severed = isolate;
      }
    });
  }

  private addRogueNode() {
    if (!this.nodes.some(n => n.id === "node-rogue-x99")) {
      this.nodes.push({
        id: "node-rogue-x99",
        name: "UNAUTH_ROGUE_ENDPOINT",
        ip: "10.0.2.199",
        mac: "DE:AD:BE:EF:00:99",
        type: "endpoint",
        role: "Unregistered Shadow Device",
        status: "compromised",
        isolated: false,
        os: "Unknown Firmware (Kali Signature)",
        open_ports: [4444, 1337],
        services: ["Meterpreter Listener", "Shadow C2 Agent"],
        cves: [{ id: "CVE-2024-UNAUTH", name: "Zero-Day Ingress Implant", cvss: 9.9, severity: "CRITICAL", remediated: false }],
        risk_score: 9.7,
        x: 360, y: 70, z: 180
      });
      this.edges.push({
        source: "node-gw-beta",
        target: "node-rogue-x99",
        latency_ms: 3.8,
        packet_rate: 1200,
        bytes_sec: 3800000,
        attack_active: true
      });
    }
  }

  private removeRogueNode() {
    this.nodes = this.nodes.filter(n => n.id !== "node-rogue-x99");
    this.edges = this.edges.filter(e => e.source !== "node-rogue-x99" && e.target !== "node-rogue-x99");
  }

  public generateBurst(): TelemetryBurst {
    this.eventCount++;
    const attack = this.activeAttack;

    let prediction = "BENIGN";
    let confidence = 0.98;
    let severity: Severity = "INFO";
    let throughput = 850 + (Math.random() * 80 - 40);
    let proto = "TLS_1.3";
    let srcIp = "10.0.2.10";
    let dstIp = "10.0.0.1";
    let dstPort = 443;
    let payload = "Encrypted TLS Application Record";

    if (attack === "DDOS_SYN_FLOOD") {
      prediction = "DDOS_SYN_FLOOD";
      confidence = 0.992;
      severity = "CRITICAL";
      throughput = 14200 + Math.random() * 800;
      proto = "TCP/SYN_BURST";
      srcIp = `198.51.100.${Math.floor(Math.random() * 240) + 2}`;
      dstIp = "10.0.0.1";
      dstPort = 443;
      payload = "0x00020405b40103030801010402 (SYN-FLOOD-BURST)";
    } else if (attack === "STEALTH_RECON") {
      prediction = "STEALTH_RECON";
      confidence = 0.915;
      severity = "WARN";
      throughput = 2400 + Math.random() * 300;
      proto = "TCP/SYN_SCAN";
      srcIp = "10.0.1.1";
      dstIp = "10.0.1.50";
      dstPort = [22, 80, 443, 5432, 6379, 8080][Math.floor(Math.random() * 6)];
      payload = "TCP FIN/PSH stealth probe sweep";
    } else if (attack === "APPLAYER_EXPLOIT") {
      prediction = "APPLAYER_EXPLOIT";
      confidence = 0.967;
      severity = "CRITICAL";
      throughput = 3800 + Math.random() * 400;
      proto = "HTTP/POST";
      srcIp = "10.0.2.11";
      dstIp = "10.0.1.50";
      dstPort = 5432;
      payload = "UNION SELECT username, password_hash FROM admin_users--";
    } else if (attack === "ROGUE_NODE_JOIN") {
      prediction = "ROGUE_NODE_JOIN";
      confidence = 0.984;
      severity = "CRITICAL";
      throughput = 4500 + Math.random() * 500;
      proto = "RAW_ETHER/ARP";
      srcIp = "10.0.2.199";
      dstIp = "10.0.2.1";
      dstPort = 4444;
      payload = "Gratuitous ARP Poison [DE:AD:BE:EF:00:99 -> 10.0.2.1]";
    }

    const dnnLatency = +(Math.random() * 0.8 + 0.4).toFixed(2);
    const gnnLatency = +(Math.random() * 2.5 + 4.1).toFixed(2);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    // Update node statuses in response to attack
    this.nodes.forEach(n => {
      if (n.isolated) return;
      if (attack === "DDOS_SYN_FLOOD" && n.type === "soc") {
        n.status = "anomalous";
      } else if (attack === "APPLAYER_EXPLOIT" && n.id === "node-db-cluster") {
        n.status = "compromised";
      } else if (attack === "STEALTH_RECON" && (n.id === "node-db-cluster" || n.id === "node-gw-alpha")) {
        n.status = "anomalous";
      } else if (n.id === "node-rogue-x99") {
        n.status = "compromised";
      } else {
        n.status = "healthy";
      }
    });

    const nodeAnomalies: Record<string, any> = {};
    this.nodes.forEach((n, idx) => {
      const isAnom = n.status !== "healthy";
      nodeAnomalies[n.id] = {
        topological_anomaly_score: isAnom ? +(Math.random() * 0.25 + 0.72).toFixed(3) : +(Math.random() * 0.15 + 0.05).toFixed(3),
        is_anomalous: isAnom,
        embedding: [+(Math.sin(idx) * 0.5 + 0.5).toFixed(3), +(Math.cos(idx) * 0.5 + 0.5).toFixed(3), 0.1, 0.2]
      };
    });

    return {
      type: "TELEMETRY_BURST",
      active_attack: attack,
      attack_metadata: attack ? ATTACK_METADATA[attack] : null,
      attack_vector_ray: attack ? ATTACK_METADATA[attack].attack_vector_ray : null,
      metrics: {
        packet_throughput_mbs: +throughput.toFixed(1),
        gnn_latency_ms: gnnLatency,
        dnn_latency_ms: dnnLatency,
        false_positive_rate: attack ? 0.002 : 0.008,
        active_connections: this.edges.filter(e => !e.severed).length,
        graph_entropy: attack ? 0.68 : 0.18,
        blast_radius_factor: attack ? 0.62 : 0.12
      },
      latest_flow: {
        event_id: `EVT-${this.eventCount}`,
        timestamp: Date.now() / 1000,
        flow_metrics: {
          flow_duration_ms: Math.floor(Math.random() * 120 + 20),
          total_fwd_packets: Math.floor(Math.random() * 50 + 10),
          total_bwd_packets: Math.floor(Math.random() * 40 + 8),
          flow_bytes_per_sec: +(throughput * 1024).toFixed(0),
          flow_packets_per_sec: +(throughput * 12).toFixed(0),
          syn_flag_count: attack === "DDOS_SYN_FLOOD" ? 640 : 2,
          ack_flag_count: 14,
          rst_flag_count: 0,
          avg_packet_size: 512,
          header_entropy: attack === "APPLAYER_EXPLOIT" ? 8.2 : 4.1,
          protocol: proto,
          source_ip: srcIp,
          dest_ip: dstIp,
          dest_port: dstPort,
          payload_sample: payload
        },
        inference: {
          prediction,
          confidence,
          probabilities: {
            BENIGN: prediction === "BENIGN" ? 0.98 : 0.02,
            DDOS_SYN_FLOOD: prediction === "DDOS_SYN_FLOOD" ? 0.99 : 0.01,
            STEALTH_RECON: prediction === "STEALTH_RECON" ? 0.92 : 0.03,
            APPLAYER_EXPLOIT: prediction === "APPLAYER_EXPLOIT" ? 0.97 : 0.01,
            ROGUE_NODE_JOIN: prediction === "ROGUE_NODE_JOIN" ? 0.98 : 0.01
          },
          inference_latency_ms: dnnLatency,
          feature_contributions: {
            flow_duration_ms: 0.42,
            syn_flag_count: attack === "DDOS_SYN_FLOOD" ? 2.85 : 0.12,
            header_entropy: attack === "APPLAYER_EXPLOIT" ? 3.12 : 0.25,
            flow_bytes_per_sec: 1.15
          },
          severity
        }
      },
      gnn_topology_inference: {
        inference_latency_ms: gnnLatency,
        node_anomalies: nodeAnomalies,
        lateral_transitions: this.edges.map(e => ({
          source: e.source,
          target: e.target,
          hop_probability: attack ? 0.78 : 0.15,
          risk_vector: attack ? "ELEVATED" : "NOMINAL"
        })),
        global_graph_entropy: attack ? 0.68 : 0.18,
        graph_diameter: 3,
        blast_radius_factor: attack ? 0.62 : 0.12
      },
      log: {
        id: `log-${this.eventCount}`,
        timestamp: timeStr,
        severity,
        source: srcIp,
        destination: `${dstIp}:${dstPort}`,
        protocol: proto,
        detection: prediction,
        confidence,
        message: `[${prediction}] conf=${(confidence * 100).toFixed(1)}% | ${payload.slice(0, 42)}`
      },
      topology: {
        nodes: this.nodes,
        edges: this.edges
      }
    };
  }

  public getAssets() {
    return this.nodes.map(n => {
      const unremediated = n.cves.filter(c => !c.remediated);
      const maxCvss = unremediated.reduce((max, c) => Math.max(max, c.cvss), 0);
      return {
        ...n,
        cve_count: n.cves.length,
        critical_cve_count: unremediated.filter(c => c.cvss >= 9.0).length,
        max_cvss: maxCvss,
        blast_radius: this.calculateBlastRadius(n.id)
      };
    });
  }

  public calculateBlastRadius(nodeId: string) {
    const oneHop = new Set<string>();
    this.edges.forEach(e => {
      if (e.source === nodeId && !e.severed) oneHop.add(e.target);
      if (e.target === nodeId && !e.severed) oneHop.add(e.source);
    });

    const twoHop = new Set<string>();
    oneHop.forEach(h => {
      this.edges.forEach(e => {
        if (e.source === h && e.target !== nodeId && !e.severed) twoHop.add(e.target);
        if (e.target === h && e.source !== nodeId && !e.severed) twoHop.add(e.source);
      });
    });

    const allAffected = Array.from(new Set([...Array.from(oneHop), ...Array.from(twoHop)]));
    let totalRisk = 0;
    allAffected.forEach(nid => {
      const node = this.nodes.find(n => n.id === nid);
      if (node) totalRisk += node.risk_score;
    });

    const exposure = allAffected.length > 0 ? Math.min(10, +(totalRisk / allAffected.length * 1.4).toFixed(1)) : 0;

    return {
      target_node: nodeId,
      one_hop_neighbors: Array.from(oneHop),
      two_hop_neighbors: Array.from(twoHop).filter(x => !oneHop.has(x)),
      all_affected_nodes: allAffected,
      affected_count: allAffected.length,
      aggregate_exposure_score: exposure,
      containment_recommendation: exposure > 6.0 ? "ISOLATE_IMMEDIATELY" : "ENHANCE_MONITORING"
    };
  }
}

export const mockTelemetryWorker = new MockTelemetryWorker();
