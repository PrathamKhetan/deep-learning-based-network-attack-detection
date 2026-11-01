import {
  TelemetryBurst,
  NetworkNode,
  NetworkEdge,
  AttackType,
  Severity,
  SectorScope,
  DeviceHardwareInfo,
  RawHexPacket,
  AiSecurityRecommendation
} from "@/types/telemetry";

/* ===================================================================================
   1. GLOBAL MULTI-ZONE BACKBONE (MANAGER VIEW: CMDR. SARAH JENKINS)
   =================================================================================== */
const GLOBAL_NODES: NetworkNode[] = [
  {
    id: "node-soc-master",
    name: "SOC Master Core",
    ip: "10.0.0.1",
    mac: "00:1A:2B:3C:4D:01",
    type: "soc",
    role: "Central SIEM & SIEM Data Fabric",
    status: "healthy",
    isolated: false,
    os: "Hardened Linux Kernel 6.8 (ZTA Defense)",
    open_ports: [443, 8443, 9092, 5432],
    services: ["HTTPS (TLS 1.3)", "Kafka Event Bus", "PostgreSQL Core"],
    cves: [
      { id: "CVE-2023-44487", name: "HTTP/2 Rapid Reset", cvss: 7.5, severity: "HIGH", remediated: true }
    ],
    risk_score: 2.1,
    x: 0, y: 0, z: 0
  },
  {
    id: "node-core-backbone",
    name: "Global Optical BGP Core",
    ip: "10.0.1.1",
    mac: "00:1A:2B:3C:4D:02",
    type: "router",
    role: "Core Multi-Zone Router",
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
    id: "node-dmz-gateway",
    name: "DMZ Edge Proxy Ingress",
    ip: "10.0.2.1",
    mac: "00:1A:2B:3C:4D:03",
    type: "router",
    role: "Public Perimeter Router",
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
    id: "node-vault-db",
    name: "Primary Vault Multi-Shard DB",
    ip: "10.0.1.50",
    mac: "00:1A:2B:3C:4D:04",
    type: "endpoint",
    role: "Encrypted Data Shard Core",
    status: "healthy",
    isolated: false,
    os: "Ubuntu 22.04 LTS Hardened",
    open_ports: [5432, 6379, 9100],
    services: ["PostgreSQL 16", "Redis Cluster", "Prometheus Exporter"],
    cves: [
      { id: "CVE-2021-44228", name: "Log4Shell Inspection", cvss: 9.8, severity: "CRITICAL", remediated: true },
      { id: "CVE-2023-22515", name: "Broken Access Authorization", cvss: 9.1, severity: "CRITICAL", remediated: false }
    ],
    risk_score: 6.9,
    x: -310, y: -130, z: 100
  },
  {
    id: "node-cloud-apigw",
    name: "Cloud K8s Ingress Gateway",
    ip: "172.16.0.1",
    mac: "00:1A:2B:3C:4D:05",
    type: "endpoint",
    role: "Container Fabric Bridge",
    status: "healthy",
    isolated: false,
    os: "Alpine Linux 3.19",
    open_ports: [8000, 9000, 443],
    services: ["FastAPI Mesh Cluster", "gRPC Internal Mesh"],
    cves: [],
    risk_score: 2.4,
    x: 310, y: -110, z: -120
  },
  {
    id: "node-bastion-hq",
    name: "Executive Bastion Host",
    ip: "10.0.0.5",
    mac: "00:1A:2B:3C:4D:06",
    type: "endpoint",
    role: "Tier-4 Jump Host",
    status: "healthy",
    isolated: false,
    os: "OpenBSD 7.4 Hardened",
    open_ports: [22, 443],
    services: ["OpenSSH Multi-Key", "WireGuard Bastion"],
    cves: [],
    risk_score: 1.2,
    x: 0, y: -240, z: 20
  },
  {
    id: "node-probe-east",
    name: "Optical TAP Sensor East",
    ip: "10.0.1.254",
    mac: "00:1A:2B:3C:4D:07",
    type: "probe",
    role: "PCAP & NetFlow Optical TAP",
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
    name: "Optical TAP Sensor West",
    ip: "10.0.2.254",
    mac: "00:1A:2B:3C:4D:08",
    type: "probe",
    role: "PCAP & NetFlow Optical TAP",
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

const GLOBAL_EDGES: NetworkEdge[] = [
  { source: "node-soc-master", target: "node-core-backbone", latency_ms: 1.2, packet_rate: 450, bytes_sec: 850000, attack_active: false },
  { source: "node-soc-master", target: "node-dmz-gateway", latency_ms: 1.4, packet_rate: 520, bytes_sec: 980000, attack_active: false },
  { source: "node-core-backbone", target: "node-vault-db", latency_ms: 0.8, packet_rate: 340, bytes_sec: 1200000, attack_active: false },
  { source: "node-core-backbone", target: "node-probe-east", latency_ms: 0.4, packet_rate: 890, bytes_sec: 2400000, attack_active: false },
  { source: "node-dmz-gateway", target: "node-cloud-apigw", latency_ms: 0.9, packet_rate: 610, bytes_sec: 1400000, attack_active: false },
  { source: "node-dmz-gateway", target: "node-bastion-hq", latency_ms: 1.1, packet_rate: 780, bytes_sec: 1850000, attack_active: false },
  { source: "node-cloud-apigw", target: "node-vault-db", latency_ms: 1.6, packet_rate: 420, bytes_sec: 920000, attack_active: false },
  { source: "node-dmz-gateway", target: "node-probe-west", latency_ms: 0.5, packet_rate: 860, bytes_sec: 2200000, attack_active: false }
];

/* ===================================================================================
   2. SECTOR B: INGRESS PERIMETER & DMZ (EMPLOYEE 1: DAVID VANCE)
   =================================================================================== */
const DMZ_NODES: NetworkNode[] = [
  {
    id: "node-david-ws",
    name: "David Vance Workstation WS-SOC-104",
    ip: "10.0.4.12",
    mac: "3C:22:FB:4A:11:04",
    type: "soc",
    role: "Analyst Triage Station & Forensics",
    status: "healthy",
    isolated: false,
    os: "macOS Sonoma 14.4 (Apple Silicon M-Series Hardened)",
    open_ports: [22, 5900, 8443],
    services: ["Wireshark Remote Dissector", "Secure Enclave EDR", "eBPF Live Probe"],
    cves: [],
    risk_score: 1.1,
    x: 0, y: -40, z: 0
  },
  {
    id: "node-dmz-waf",
    name: "WAF Envoy Perimeter Filter",
    ip: "10.0.4.1",
    mac: "00:50:56:9A:88:01",
    type: "router",
    role: "L7 Application Firewall",
    status: "healthy",
    isolated: false,
    os: "Envoy Hardened Linux 6.6",
    open_ports: [80, 443, 8080],
    services: ["ModSecurity Core Rules", "TLS 1.3 Termination", "Rate Limiter"],
    cves: [
      { id: "CVE-2024-21626", name: "runc Container Escape Probe", cvss: 8.6, severity: "HIGH", remediated: false }
    ],
    risk_score: 5.4,
    x: -260, y: 110, z: 40
  },
  {
    id: "node-dmz-nginx",
    name: "Edge Reverse Proxy Node",
    ip: "10.0.4.5",
    mac: "00:50:56:9A:88:02",
    type: "endpoint",
    role: "DMZ HTTP/HTTPS Gateway",
    status: "healthy",
    isolated: false,
    os: "Debian 12 Bookworm",
    open_ports: [80, 443],
    services: ["NGINX Plus 1.25", "Certbot Auto-Renewal"],
    cves: [],
    risk_score: 2.8,
    x: 260, y: 110, z: -40
  },
  {
    id: "node-honeypot-canary",
    name: "Active HoneyToken Decoy",
    ip: "10.0.4.99",
    mac: "00:50:56:DE:C0:99",
    type: "endpoint",
    role: "Adversary Deception Canary",
    status: "healthy",
    isolated: false,
    os: "Simulated Windows Server 2019 (Trap)",
    open_ports: [21, 23, 445, 3389],
    services: ["Fake SMB Share", "Telnet Decoy", "RDP Trap Listener"],
    cves: [
      { id: "CVE-2017-0144", name: "EternalBlue Decoy Signature", cvss: 9.3, severity: "CRITICAL", remediated: false }
    ],
    risk_score: 8.9,
    x: 0, y: 220, z: -80
  },
  {
    id: "node-finance-api",
    name: "DMZ Finance API Gateway",
    ip: "10.0.4.20",
    mac: "00:50:56:9A:88:03",
    type: "endpoint",
    role: "PCI-DSS Scoped Ingress",
    status: "healthy",
    isolated: false,
    os: "RHEL 9.3 Hardened",
    open_ports: [8443, 9443],
    services: ["Spring Boot Microservice", "Vault Token Injector"],
    cves: [],
    risk_score: 3.1,
    x: -280, y: -130, z: 90
  },
  {
    id: "node-auth-ldap",
    name: "Kerberos & LDAP Auth Relay",
    ip: "10.0.4.50",
    mac: "00:50:56:9A:88:04",
    type: "endpoint",
    role: "DMZ Authentication Proxy",
    status: "healthy",
    isolated: false,
    os: "Alpine Linux 3.19",
    open_ports: [389, 636, 88],
    services: ["OpenLDAP Proxy", "Kerberos KDC Proxy"],
    cves: [],
    risk_score: 2.2,
    x: 280, y: -130, z: 90
  },
  {
    id: "node-dmz-tap",
    name: "DMZ Mirror TAP Sensor",
    ip: "10.0.4.254",
    mac: "00:50:56:9A:88:05",
    type: "probe",
    role: "Full Packet Flow Inspector",
    status: "healthy",
    isolated: false,
    os: "FreeBSD 14.0 Netmap Engine",
    open_ports: [4789],
    services: ["Suricata IDS 7.0", "Fast NetFlow Consumer"],
    cves: [],
    risk_score: 1.4,
    x: 0, y: -240, z: 120
  }
];

const DMZ_EDGES: NetworkEdge[] = [
  { source: "node-david-ws", target: "node-dmz-waf", latency_ms: 0.6, packet_rate: 180, bytes_sec: 210000, attack_active: false },
  { source: "node-david-ws", target: "node-dmz-nginx", latency_ms: 0.7, packet_rate: 220, bytes_sec: 280000, attack_active: false },
  { source: "node-dmz-waf", target: "node-finance-api", latency_ms: 0.4, packet_rate: 310, bytes_sec: 640000, attack_active: false },
  { source: "node-dmz-nginx", target: "node-auth-ldap", latency_ms: 0.5, packet_rate: 290, bytes_sec: 410000, attack_active: false },
  { source: "node-dmz-waf", target: "node-honeypot-canary", latency_ms: 1.1, packet_rate: 45, bytes_sec: 62000, attack_active: false },
  { source: "node-david-ws", target: "node-dmz-tap", latency_ms: 0.3, packet_rate: 540, bytes_sec: 1100000, attack_active: false },
  { source: "node-dmz-nginx", target: "node-finance-api", latency_ms: 0.8, packet_rate: 190, bytes_sec: 320000, attack_active: false }
];

/* ===================================================================================
   3. SECTOR C: CLOUD KUBERNETES FABRIC (EMPLOYEE 2: ELENA ROSTOVA)
   =================================================================================== */
const CLOUD_NODES: NetworkNode[] = [
  {
    id: "node-elena-rig",
    name: "Elena Rostova Rig WS-SOC-208",
    ip: "10.0.4.18",
    mac: "54:E1:AD:12:88:02",
    type: "soc",
    role: "Adversary Threat Hunter Console",
    status: "healthy",
    isolated: false,
    os: "Arch Linux (Custom Kernel 6.9 Hardened)",
    open_ports: [22, 9090, 3000],
    services: ["eBPF Tetragon Hunter", "KubeCTL Bastion", "Grafana IR Mesh"],
    cves: [],
    risk_score: 1.3,
    x: 0, y: -40, z: 0
  },
  {
    id: "node-k8s-control",
    name: "K8s API Control Plane",
    ip: "172.16.0.10",
    mac: "02:42:AC:10:00:0A",
    type: "router",
    role: "Kubernetes Cluster Master",
    status: "healthy",
    isolated: false,
    os: "CoreOS Container Linux",
    open_ports: [6443, 2379, 10250],
    services: ["kube-apiserver", "etcd Cluster v3.5", "Calico CNI"],
    cves: [
      { id: "CVE-2023-2728", name: "Bypassing ServiceAccount Tokens", cvss: 7.2, severity: "HIGH", remediated: true }
    ],
    risk_score: 4.8,
    x: -250, y: 100, z: 50
  },
  {
    id: "node-payment-pod",
    name: "Payment Gateway Microservice Pod",
    ip: "172.16.2.14",
    mac: "02:42:AC:10:02:0E",
    type: "endpoint",
    role: "Containerized Stripe/SWIFT Worker",
    status: "healthy",
    isolated: false,
    os: "Distroless Container (gcr.io)",
    open_ports: [8080],
    services: ["Go Payment Daemon", "OpenTelemetry Spans"],
    cves: [],
    risk_score: 2.1,
    x: 250, y: 100, z: -50
  },
  {
    id: "node-redis-mesh",
    name: "Redis Distributed Cluster Mesh",
    ip: "172.16.2.80",
    mac: "02:42:AC:10:02:50",
    type: "endpoint",
    role: "In-Memory Session Store",
    status: "healthy",
    isolated: false,
    os: "Alpine Linux Container",
    open_ports: [6379, 16379],
    services: ["Redis Sentinel 7.2", "TLS Clustered Sync"],
    cves: [],
    risk_score: 1.9,
    x: 0, y: 230, z: 80
  },
  {
    id: "node-istio-sidecar",
    name: "Istio Service Mesh Ingress",
    ip: "172.16.0.25",
    mac: "02:42:AC:10:00:19",
    type: "router",
    role: "Mutual-TLS Traffic Director",
    status: "healthy",
    isolated: false,
    os: "Istio Proxy Envoy v1.21",
    open_ports: [15021, 15000, 443],
    services: ["mTLS Enforcer", "Jaeger Tracing Injector"],
    cves: [],
    risk_score: 2.6,
    x: -270, y: -130, z: -90
  },
  {
    id: "node-aws-directconnect",
    name: "AWS DirectConnect Gateway",
    ip: "172.16.9.1",
    mac: "02:42:AC:10:09:01",
    type: "endpoint",
    role: "Hybrid Cloud Direct Link",
    status: "healthy",
    isolated: false,
    os: "AWS Virtual Gateway OS",
    open_ports: [443, 8443],
    services: ["BGP Peering (AS65000)", "IPsec Encrypted Trunk"],
    cves: [],
    risk_score: 3.5,
    x: 270, y: -130, z: -90
  },
  {
    id: "node-ebpf-probe",
    name: "eBPF Kernel Syscall Ring Sensor",
    ip: "172.16.0.99",
    mac: "02:42:AC:10:00:63",
    type: "probe",
    role: "Zero-Overhead Container EDR",
    status: "healthy",
    isolated: false,
    os: "Cilium eBPF Runtime",
    open_ports: [9898],
    services: ["BPF Ring Buffer Exporter", "Syscall Audit Hook"],
    cves: [],
    risk_score: 1.2,
    x: 0, y: -230, z: 90
  }
];

const CLOUD_EDGES: NetworkEdge[] = [
  { source: "node-elena-rig", target: "node-k8s-control", latency_ms: 0.8, packet_rate: 420, bytes_sec: 780000, attack_active: false },
  { source: "node-elena-rig", target: "node-istio-sidecar", latency_ms: 0.7, packet_rate: 390, bytes_sec: 690000, attack_active: false },
  { source: "node-k8s-control", target: "node-payment-pod", latency_ms: 0.4, packet_rate: 850, bytes_sec: 1950000, attack_active: false },
  { source: "node-payment-pod", target: "node-redis-mesh", latency_ms: 0.2, packet_rate: 940, bytes_sec: 2100000, attack_active: false },
  { source: "node-istio-sidecar", target: "node-payment-pod", latency_ms: 0.5, packet_rate: 610, bytes_sec: 1420000, attack_active: false },
  { source: "node-elena-rig", target: "node-ebpf-probe", latency_ms: 0.3, packet_rate: 1100, bytes_sec: 3200000, attack_active: false },
  { source: "node-aws-directconnect", target: "node-istio-sidecar", latency_ms: 1.9, packet_rate: 510, bytes_sec: 950000, attack_active: false }
];

/* ===================================================================================
   4. SECTOR A: CORPORATE LAN & ENDPOINTS (EMPLOYEE 3: MARCUS CHEN)
   =================================================================================== */
const LAN_NODES: NetworkNode[] = [
  {
    id: "node-marcus-console",
    name: "Marcus Chen Console WS-SOC-312",
    ip: "10.0.4.29",
    mac: "70:85:C2:55:90:33",
    type: "soc",
    role: "Junior Triage Console",
    status: "healthy",
    isolated: false,
    os: "Ubuntu 24.04 LTS (Desktop Edition)",
    open_ports: [22, 8080],
    services: ["Sysmon Agent", "Local Wireshark", "Triage Portal"],
    cves: [],
    risk_score: 1.5,
    x: 0, y: -40, z: 0
  },
  {
    id: "node-lan-core",
    name: "Corporate Office Core Switch SW-01",
    ip: "192.168.1.1",
    mac: "00:04:96:11:22:33",
    type: "router",
    role: "L3 Aggregation Switch",
    status: "healthy",
    isolated: false,
    os: "Cisco IOS-XE 17.9",
    open_ports: [22, 161, 443],
    services: ["802.1X NAC", "VLAN Trunking", "SNMPv3"],
    cves: [],
    risk_score: 2.1,
    x: -240, y: 100, z: 50
  },
  {
    id: "node-activedir-dc",
    name: "Domain Controller DC-01",
    ip: "192.168.1.10",
    mac: "00:04:96:11:22:34",
    type: "endpoint",
    role: "Corporate Active Directory & DNS",
    status: "healthy",
    isolated: false,
    os: "Windows Server 2022 Hardened",
    open_ports: [53, 88, 135, 389, 445],
    services: ["Active Directory DS", "Kerberos KDC", "DNS Server"],
    cves: [
      { id: "CVE-2024-21413", name: "Microsoft Outlook RCE Probe", cvss: 9.8, severity: "CRITICAL", remediated: false }
    ],
    risk_score: 7.2,
    x: 240, y: 100, z: -50
  },
  {
    id: "node-hr-workstations",
    name: "HR & Legal Workstation Pool",
    ip: "192.168.1.55",
    mac: "00:04:96:11:22:55",
    type: "endpoint",
    role: "Corporate Endpoints Fleet",
    status: "healthy",
    isolated: false,
    os: "Windows 11 Enterprise (Fleet)",
    open_ports: [445, 3389],
    services: ["CrowdStrike Falcon Sensor", "BitLocker TPM 2.0"],
    cves: [],
    risk_score: 3.4,
    x: 0, y: 220, z: -80
  },
  {
    id: "node-sip-pbx",
    name: "Corporate SIP VoIP Server",
    ip: "192.168.1.80",
    mac: "00:04:96:11:22:80",
    type: "endpoint",
    role: "Enterprise Telephony Gateway",
    status: "healthy",
    isolated: false,
    os: "Asterisk Hardened Linux",
    open_ports: [5060, 5061, 10000],
    services: ["SIP Over TLS", "SRTP Media Stream"],
    cves: [],
    risk_score: 2.7,
    x: -260, y: -130, z: 80
  },
  {
    id: "node-guest-wifi",
    name: "Isolated Guest VLAN-90 Gateway",
    ip: "192.168.90.1",
    mac: "00:04:96:11:22:90",
    type: "router",
    role: "Quarantined Guest WiFi Subnet",
    status: "healthy",
    isolated: false,
    os: "PFSense Enterprise 2.7",
    open_ports: [80, 443],
    services: ["Captive Portal", "Isolated NAT DNS"],
    cves: [],
    risk_score: 4.5,
    x: 260, y: -130, z: 80
  },
  {
    id: "node-lan-tap",
    name: "LAN Passive TAP Sensor SW-01",
    ip: "192.168.1.254",
    mac: "00:04:96:11:22:FE",
    type: "probe",
    role: "Internal NetFlow & PCAP Collector",
    status: "healthy",
    isolated: false,
    os: "Debian Bookworm Sensor",
    open_ports: [4789],
    services: ["Zeek LAN Triage", "ARP Watcher"],
    cves: [],
    risk_score: 1.1,
    x: 0, y: -230, z: 90
  }
];

const LAN_EDGES: NetworkEdge[] = [
  { source: "node-marcus-console", target: "node-lan-core", latency_ms: 0.4, packet_rate: 110, bytes_sec: 140000, attack_active: false },
  { source: "node-lan-core", target: "node-activedir-dc", latency_ms: 0.5, packet_rate: 290, bytes_sec: 450000, attack_active: false },
  { source: "node-lan-core", target: "node-hr-workstations", latency_ms: 0.8, packet_rate: 340, bytes_sec: 580000, attack_active: false },
  { source: "node-lan-core", target: "node-sip-pbx", latency_ms: 0.6, packet_rate: 210, bytes_sec: 320000, attack_active: false },
  { source: "node-lan-core", target: "node-guest-wifi", latency_ms: 1.2, packet_rate: 180, bytes_sec: 240000, attack_active: false },
  { source: "node-marcus-console", target: "node-lan-tap", latency_ms: 0.3, packet_rate: 420, bytes_sec: 890000, attack_active: false }
];

/* ===================================================================================
   ATTACK METADATA BY SECTOR
   =================================================================================== */
const ATTACK_METADATA_BY_SECTOR: Record<SectorScope, Record<AttackType, any>> = {
  global: {
    DDOS_SYN_FLOOD: {
      name: "Global Optical BGP SYN Flood Exhaustion",
      severity: "CRITICAL" as Severity,
      description: "Volumetric Multi-Vector SYN attack saturating global BGP edge links.",
      source: "EXTERNAL_BOTNET_TIER1",
      target: "node-soc-master",
      ports: [80, 443, 8443],
      attack_vector_ray: { source: "node-core-backbone", target: "node-soc-master" }
    },
    STEALTH_RECON: {
      name: "Cross-Zone Optical Lateral Reconnaissance",
      severity: "WARN" as Severity,
      description: "Stealth SYN/FIN port sweep probing database shards and executive jump hosts.",
      source: "node-core-backbone",
      target: "node-vault-db",
      ports: [22, 5432, 6379],
      attack_vector_ray: { source: "node-core-backbone", target: "node-vault-db" }
    },
    APPLAYER_EXPLOIT: {
      name: "Cloud Gateway Microservice Exploitation",
      severity: "CRITICAL" as Severity,
      description: "Polymorphic payload injection via HTTP/2 Rapid Reset vector.",
      source: "node-cloud-apigw",
      target: "node-vault-db",
      ports: [5432, 8000],
      attack_vector_ray: { source: "node-cloud-apigw", target: "node-vault-db" }
    },
    ROGUE_NODE_JOIN: {
      name: "Rogue Unauthorized Optical TAP Injection",
      severity: "CRITICAL" as Severity,
      description: "Shadow tap device detected attempting BGP route hijacking.",
      source: "node-rogue-opt01",
      target: "node-core-backbone",
      ports: [179, 1337],
      attack_vector_ray: { source: "node-rogue-opt01", target: "node-core-backbone" }
    }
  },
  dmz_analyst: {
    DDOS_SYN_FLOOD: {
      name: "DMZ WAF Layer-4 SYN Saturation Burst",
      severity: "CRITICAL" as Severity,
      description: "Targeted TCP SYN flood bombarding DMZ Reverse Proxy and Envoy WAF.",
      source: "DMZ_BOTNET_SWARM",
      target: "node-dmz-waf",
      ports: [80, 443],
      attack_vector_ray: { source: "node-dmz-nginx", target: "node-dmz-waf" }
    },
    STEALTH_RECON: {
      name: "DMZ Lateral Port Scan on HoneyToken Decoy",
      severity: "WARN" as Severity,
      description: "Adversary probe attempting SMB & RCE discovery on Honeypot node.",
      source: "node-dmz-nginx",
      target: "node-honeypot-canary",
      ports: [445, 3389, 21],
      attack_vector_ray: { source: "node-dmz-nginx", target: "node-honeypot-canary" }
    },
    APPLAYER_EXPLOIT: {
      name: "Finance API Gateway SQL Injection Vector",
      severity: "CRITICAL" as Severity,
      description: "Obfuscated UNION SELECT attack against DMZ Finance Gateway endpoint.",
      source: "node-dmz-nginx",
      target: "node-finance-api",
      ports: [8443],
      attack_vector_ray: { source: "node-dmz-nginx", target: "node-finance-api" }
    },
    ROGUE_NODE_JOIN: {
      name: "Rogue Unauthorized Laptop on DMZ Subnet",
      severity: "CRITICAL" as Severity,
      description: "Unauthenticated MAC address attempting ARP poisoning against David's Workstation.",
      source: "node-rogue-dmz-x1",
      target: "node-david-ws",
      ports: [4444],
      attack_vector_ray: { source: "node-rogue-dmz-x1", target: "node-david-ws" }
    }
  },
  cloud_hunter: {
    DDOS_SYN_FLOOD: {
      name: "Kubernetes Ingress Pod Stress Flooding",
      severity: "CRITICAL" as Severity,
      description: "Distributed HTTP flood triggering HPA container autoscaling exhaustion.",
      source: "CLOUD_BOTNET_INBOUND",
      target: "node-istio-sidecar",
      ports: [443, 15021],
      attack_vector_ray: { source: "node-aws-directconnect", target: "node-istio-sidecar" }
    },
    STEALTH_RECON: {
      name: "eBPF Container Escape & Kubelet Reconnaissance",
      severity: "WARN" as Severity,
      description: "Suspicious privileged container attempting to query Kubelet API at 10250.",
      source: "node-payment-pod",
      target: "node-k8s-control",
      ports: [6443, 10250],
      attack_vector_ray: { source: "node-payment-pod", target: "node-k8s-control" }
    },
    APPLAYER_EXPLOIT: {
      name: "Redis Unauthenticated RCE Microservice Exploit",
      severity: "CRITICAL" as Severity,
      description: "Unauthorized CONFIG SET exploitation attempt against Redis Distributed Cluster.",
      source: "node-payment-pod",
      target: "node-redis-mesh",
      ports: [6379],
      attack_vector_ray: { source: "node-payment-pod", target: "node-redis-mesh" }
    },
    ROGUE_NODE_JOIN: {
      name: "Rogue Unauthorized DaemonSet Pod Injected",
      severity: "CRITICAL" as Severity,
      description: "Container without valid Cryptographic Attestation joined the Istio Mesh.",
      source: "node-rogue-k8s-pod",
      target: "node-istio-sidecar",
      ports: [1337],
      attack_vector_ray: { source: "node-rogue-k8s-pod", target: "node-istio-sidecar" }
    }
  },
  lan_junior: {
    DDOS_SYN_FLOOD: {
      name: "Corporate Office Broadcast Storm & DHCP Starvation",
      severity: "CRITICAL" as Severity,
      description: "Rogue workstation flooding UDP 67/68 exhausting LAN DHCP pool.",
      source: "LAN_COMPROMISED_HOST",
      target: "node-lan-core",
      ports: [67, 68, 53],
      attack_vector_ray: { source: "node-hr-workstations", target: "node-lan-core" }
    },
    STEALTH_RECON: {
      name: "Active Directory BloodHound Kerberoasting Sweep",
      severity: "WARN" as Severity,
      description: "Suspicious SPN query burst targeting Domain Controller service accounts.",
      source: "node-hr-workstations",
      target: "node-activedir-dc",
      ports: [88, 389],
      attack_vector_ray: { source: "node-hr-workstations", target: "node-activedir-dc" }
    },
    APPLAYER_EXPLOIT: {
      name: "VoIP SIP INVITE Buffer Overflow Probe",
      severity: "CRITICAL" as Severity,
      description: "Malformed SIP packet stream attempting crash on Enterprise VoIP Gateway.",
      source: "node-guest-wifi",
      target: "node-sip-pbx",
      ports: [5060],
      attack_vector_ray: { source: "node-guest-wifi", target: "node-sip-pbx" }
    },
    ROGUE_NODE_JOIN: {
      name: "Rogue WiFi Bridge Bridging Guest to Corporate LAN",
      severity: "CRITICAL" as Severity,
      description: "Hardware bridge detected crossing 802.1Q VLAN boundary.",
      source: "node-rogue-lan-bridge",
      target: "node-lan-core",
      ports: [8080],
      attack_vector_ray: { source: "node-rogue-lan-bridge", target: "node-lan-core" }
    }
  }
};

export class MockTelemetryWorker {
  private activeSector: SectorScope = "global";
  private nodesBySector: Record<SectorScope, NetworkNode[]> = {
    global: JSON.parse(JSON.stringify(GLOBAL_NODES)),
    dmz_analyst: JSON.parse(JSON.stringify(DMZ_NODES)),
    cloud_hunter: JSON.parse(JSON.stringify(CLOUD_NODES)),
    lan_junior: JSON.parse(JSON.stringify(LAN_NODES))
  };
  private edgesBySector: Record<SectorScope, NetworkEdge[]> = {
    global: JSON.parse(JSON.stringify(GLOBAL_EDGES)),
    dmz_analyst: JSON.parse(JSON.stringify(DMZ_EDGES)),
    cloud_hunter: JSON.parse(JSON.stringify(CLOUD_EDGES)),
    lan_junior: JSON.parse(JSON.stringify(LAN_EDGES))
  };

  private activeAttack: AttackType | null = null;
  private eventCount = 2000;
  private simulatedRecommendations: Record<string, boolean> = {};

  public setSector(sector: SectorScope) {
    this.activeSector = sector;
  }

  public getSector(): SectorScope {
    return this.activeSector;
  }

  public setAttack(attack: AttackType | null) {
    this.activeAttack = attack;
  }

  public getActiveAttack(): AttackType | null {
    return this.activeAttack;
  }

  public isolateNode(nodeId: string, isolate: boolean = true) {
    const currentNodes = this.nodesBySector[this.activeSector];
    const node = currentNodes.find((n) => n.id === nodeId);
    if (node) {
      node.isolated = isolate;
      node.status = isolate ? "isolated" : "healthy";
    }
    const currentEdges = this.edgesBySector[this.activeSector];
    currentEdges.forEach((e) => {
      if (e.source === nodeId || e.target === nodeId) {
        e.severed = isolate;
      }
    });
  }

  public getAssets(): any[] {
    const nodes = this.nodesBySector[this.activeSector];
    return nodes.map((n) => ({
      ...n,
      blast_radius: this.calculateBlastRadius(n.id)
    }));
  }

  public calculateBlastRadius(nodeId: string) {
    const edges = this.edgesBySector[this.activeSector];
    const nodes = this.nodesBySector[this.activeSector];
    const oneHop = edges
      .filter((e) => !e.severed && (e.source === nodeId || e.target === nodeId))
      .map((e) => (e.source === nodeId ? e.target : e.source));

    const twoHopSet = new Set<string>();
    oneHop.forEach((h1) => {
      edges
        .filter((e) => !e.severed && (e.source === h1 || e.target === h1))
        .forEach((e) => {
          const neighbor = e.source === h1 ? e.target : e.source;
          if (neighbor !== nodeId && !oneHop.includes(neighbor)) {
            twoHopSet.add(neighbor);
          }
        });
    });

    const twoHop = Array.from(twoHopSet);
    const all = Array.from(new Set([...oneHop, ...twoHop]));
    const targetNode = nodes.find((n) => n.id === nodeId);
    const exposure = Math.min(10, (targetNode?.risk_score || 3) * (1 + all.length * 0.4));

    return {
      target_node: nodeId,
      one_hop_neighbors: oneHop,
      two_hop_neighbors: twoHop,
      all_affected_nodes: all,
      affected_count: all.length,
      aggregate_exposure_score: parseFloat(exposure.toFixed(2)),
      containment_recommendation:
        exposure > 7
          ? "CRITICAL: Immediate Zero-Trust Subnet Isolation Required."
          : "NOMINAL: Micro-segmentation canary recommended."
    };
  }

  public getDeviceHardwareInfo(): DeviceHardwareInfo {
    switch (this.activeSector) {
      case "dmz_analyst":
        return {
          deviceId: "WS-SOC-104-MBP-M3",
          workstationModel: "Apple MacBook Pro 16\" (Apple M3 Max / 36GB Unified)",
          osName: "macOS Sonoma 14.4 (Darwin 23.4.0 Kernel Hardened)",
          kernelVersion: "Darwin Kernel Version 23.4.0: root:xnu-10063.101.17~1/RELEASE_ARM64_T6030",
          ipAddress: "10.0.4.12",
          macAddress: "3C:22:FB:4A:11:04",
          assignedEmployeeId: "CORP-EMP-4420",
          assignedEmployeeName: "David Vance",
          assignedSector: "Sector B: Ingress DMZ & Threat Triage",
          tpmStatus: "APPLE_SECURE_ENCLAVE",
          secureBoot: true,
          wireguardTunnel: "CONNECTED",
          ebpfProbeState: "RING0_HOOKED",
          cpuUsagePct: 14.2,
          ramAllocatedMb: 12480,
          localPacketBufferCount: 48201,
          networkInterface: "en0 (Wi-Fi 6E 160MHz)",
          lastAttestationCheck: "2 mins ago (Hardware Pass)"
        };
      case "cloud_hunter":
        return {
          deviceId: "WS-SOC-208-HUNTER-X",
          workstationModel: "ThinkPad P1 Gen 6 (Intel Core i9-13900H / 64GB DDR5)",
          osName: "Arch Linux Enterprise (Hardened Kernel 6.9.1)",
          kernelVersion: "Linux 6.9.1-arch1-1-hardened x86_64",
          ipAddress: "10.0.4.18",
          macAddress: "54:E1:AD:12:88:02",
          assignedEmployeeId: "CORP-EMP-3918",
          assignedEmployeeName: "Elena Rostova",
          assignedSector: "Sector C: Cloud Kubernetes & Containers",
          tpmStatus: "ACTIVE_TPM2",
          secureBoot: true,
          wireguardTunnel: "CONNECTED",
          ebpfProbeState: "PROMISCUOUS_CAPTURING",
          cpuUsagePct: 22.8,
          ramAllocatedMb: 24100,
          localPacketBufferCount: 104290,
          networkInterface: "wlan0 (802.11ax MIMO)",
          lastAttestationCheck: "30s ago (Hardware Pass)"
        };
      case "lan_junior":
        return {
          deviceId: "WS-SOC-312-TRIAGE-01",
          workstationModel: "Dell Precision 5680 (Intel Core i7-13800H / 32GB)",
          osName: "Ubuntu 24.04 LTS (Kernel Hardened)",
          kernelVersion: "Linux 6.8.0-31-generic x86_64",
          ipAddress: "10.0.4.29",
          macAddress: "70:85:C2:55:90:33",
          assignedEmployeeId: "CORP-EMP-5102",
          assignedEmployeeName: "Marcus Chen",
          assignedSector: "Sector A: Corporate LAN & Endpoints",
          tpmStatus: "ACTIVE_TPM2",
          secureBoot: true,
          wireguardTunnel: "CONNECTED",
          ebpfProbeState: "RING0_HOOKED",
          cpuUsagePct: 9.4,
          ramAllocatedMb: 8900,
          localPacketBufferCount: 18240,
          networkInterface: "eth0 (1000BASE-T Full-Duplex)",
          lastAttestationCheck: "5 mins ago (Hardware Pass)"
        };
      default:
        // Global Executive Console
        return {
          deviceId: "EXEC-MACBOOK-M3MAX",
          workstationModel: "Apple MacBook Pro 16\" (Apple M3 Max / 64GB Unified)",
          osName: "macOS Sonoma 14.4 (Darwin 23.4.0 Hardened ZTA)",
          kernelVersion: "Darwin Kernel Version 23.4.0: root:xnu-10063.101.17~1/RELEASE_ARM64_T6030",
          ipAddress: "10.0.0.99",
          macAddress: "AC:BC:32:88:99:FF",
          assignedEmployeeId: "CORP-MGR-0091",
          assignedEmployeeName: "Cmdr. Sarah Jenkins",
          assignedSector: "Global Multi-Zone Enterprise Backbone",
          tpmStatus: "APPLE_SECURE_ENCLAVE",
          secureBoot: true,
          wireguardTunnel: "CONNECTED",
          ebpfProbeState: "RING0_HOOKED",
          cpuUsagePct: 18.5,
          ramAllocatedMb: 28400,
          localPacketBufferCount: 184920,
          networkInterface: "en0 (Thunderbolt 10GbE SFP+)",
          lastAttestationCheck: "Just now (Hardware Pass)"
        };
    }
  }

  public getRawHexPackets(): RawHexPacket[] {
    const isAtk = Boolean(this.activeAttack);
    const d = new Date();
    const timeStr = d.toTimeString().split(" ")[0] + "." + Math.floor(d.getMilliseconds() / 10);

    return [
      {
        id: `PKT-${this.eventCount}`,
        timestamp: timeStr,
        lengthBytes: isAtk ? 1514 : 74,
        protocol: isAtk ? "TCP/SYN-FLOOD" : "TLSv1.3",
        srcIp: isAtk ? "185.220.101.5" : "10.0.4.12",
        srcPort: isAtk ? 49152 : 54210,
        dstIp: isAtk ? "10.0.4.1" : "10.0.1.50",
        dstPort: isAtk ? 443 : 8443,
        tcpFlags: { syn: true, ack: !isAtk, fin: false, rst: false, psh: !isAtk },
        ttl: isAtk ? 48 : 64,
        checksum: "0x89f4 [CORRECT]",
        hexLines: [
          "0000  45 00 00 3c 1c 46 40 00  40 06 b1 e6 0a 00 04 0c   E..<.@.@........",
          "0010  0a 00 01 01 01 bb 00 50  7a 12 34 56 00 00 00 00   .......Pz.4V....",
          "0020  a0 02 72 10 89 f4 00 00  02 04 05 b4 04 02 08 0a   ..r.............",
          "0030  3a 4f 91 12 00 00 00 00  01 03 03 07 41 45 47 49   :O..........AEGI"
        ],
        asciiDump: "AEGIS-ZERO-TRUST-PAYLOAD-PROMISCUOUS-ENCLAVE-STREAM",
        signatureMatch: isAtk ? "SIG-EXPLOIT-TCP-SYN-BURST (MITRE T1498)" : undefined,
        dnnVerdict: isAtk ? "CRITICAL ANOMALY (99.8%)" : "NOMINAL ENCRYPTED FLOW"
      },
      {
        id: `PKT-${this.eventCount - 1}`,
        timestamp: timeStr,
        lengthBytes: 128,
        protocol: "DNS/TLS",
        srcIp: "10.0.4.12",
        srcPort: 53120,
        dstIp: "10.0.1.1",
        dstPort: 853,
        tcpFlags: { syn: false, ack: true, fin: false, rst: false, psh: true },
        ttl: 64,
        checksum: "0x21a0 [CORRECT]",
        hexLines: [
          "0000  45 00 00 80 8f 12 40 00  40 06 3f 10 0a 00 04 0c   E.....@.@.?.....",
          "0010  0a 00 01 01 03 55 03 55  10 24 88 a1 7a 12 34 56   .....U.U.$..z.4V",
          "0020  80 18 01 f5 21 a0 00 00  01 01 08 0a 3a 4f 91 00   ....!.......:O..",
          "0030  73 6f 63 2d 61 75 74 68  2e 61 65 67 69 73 2e 63   soc-auth.aegis.c"
        ],
        asciiDump: "soc-auth.aegis.corp query -> resolved to 10.0.0.1",
        dnnVerdict: "BENIGN VERIFIED (100%)"
      }
    ];
  }

  public getAiRecommendations(): AiSecurityRecommendation[] {
    const isAtk = Boolean(this.activeAttack);

    switch (this.activeSector) {
      case "dmz_analyst":
        return [
          {
            id: "AI-REC-01",
            threatTitle: isAtk ? "Active High-Volume SYN Inundation Detected" : "DMZ Perimeter Integrity Scan",
            sectorScope: "dmz_analyst",
            affectedTarget: "node-dmz-waf [10.0.4.1]",
            confidencePct: 98.4,
            recommendedCountermeasure: "Deploy Micro-Segmentation Canary & Flush Edge SYN Cookies",
            actionKey: "MICROSEGMENT_CANARY",
            blastRadiusMitigationPct: 84,
            executed: Boolean(this.simulatedRecommendations["AI-REC-01"])
          },
          {
            id: "AI-REC-02",
            threatTitle: "HoneyToken Decoy Probe Activity (MITRE T1046)",
            sectorScope: "dmz_analyst",
            affectedTarget: "node-honeypot-canary [10.0.4.99]",
            confidencePct: 94.1,
            recommendedCountermeasure: "Quarantine Ingress Proxy Route & Blackhole Attacker Subnet",
            actionKey: "ISOLATE_PERIMETER_HOP",
            blastRadiusMitigationPct: 92,
            executed: Boolean(this.simulatedRecommendations["AI-REC-02"])
          }
        ];
      case "cloud_hunter":
        return [
          {
            id: "AI-REC-03",
            threatTitle: "eBPF Kernel Syscall Escape Anomaly on K8s Mesh",
            sectorScope: "cloud_hunter",
            affectedTarget: "node-payment-pod [172.16.2.14]",
            confidencePct: 96.7,
            recommendedCountermeasure: "Sever Pod Ingress Hop & Rotate Mutual-TLS Ephemeral Certs",
            actionKey: "ISOLATE_PERIMETER_HOP",
            blastRadiusMitigationPct: 88,
            executed: Boolean(this.simulatedRecommendations["AI-REC-03"])
          }
        ];
      case "lan_junior":
        return [
          {
            id: "AI-REC-04",
            threatTitle: "Unusual Kerberos Pre-Auth Burst on DC-01",
            sectorScope: "lan_junior",
            affectedTarget: "node-activedir-dc [192.168.1.10]",
            confidencePct: 89.2,
            recommendedCountermeasure: "Flush Workstation ARP Cache & Enforce Kerberos Golden Ticket Rekey",
            actionKey: "FLUSH_ARP_CACHE",
            blastRadiusMitigationPct: 79,
            executed: Boolean(this.simulatedRecommendations["AI-REC-04"])
          }
        ];
      default:
        return [
          {
            id: "AI-REC-00",
            threatTitle: isAtk ? "Multi-Zone Lateral Movement Vector In Progress" : "Enterprise Core Topology Optimization",
            sectorScope: "global",
            affectedTarget: "node-core-backbone [10.0.1.1]",
            confidencePct: 99.1,
            recommendedCountermeasure: "Execute Automated BGP Route Filtering & Optical Core Shield",
            actionKey: "ISOLATE_PERIMETER_HOP",
            blastRadiusMitigationPct: 95,
            executed: Boolean(this.simulatedRecommendations["AI-REC-00"])
          }
        ];
    }
  }

  public executeAiRecommendation(id: string) {
    this.simulatedRecommendations[id] = true;
  }

  public generateBurst(): TelemetryBurst {
    this.eventCount++;
    const isAtk = Boolean(this.activeAttack);
    const nodes = this.nodesBySector[this.activeSector];
    const edges = this.edgesBySector[this.activeSector];
    const atkMeta = this.activeAttack
      ? ATTACK_METADATA_BY_SECTOR[this.activeSector]?.[this.activeAttack] || null
      : null;

    // Sector-specific throughput & metrics
    let baseThroughput = 1840;
    let baseConns = 8420;
    let sectorName = "Global Multi-Zone Enterprise Backbone";
    let devName = "EXEC-MACBOOK-M3MAX (10.0.0.99)";

    if (this.activeSector === "dmz_analyst") {
      baseThroughput = 145;
      baseConns = 480;
      sectorName = "Sector B • Ingress Perimeter & DMZ Triage";
      devName = "WS-SOC-104 (10.0.4.12 • David Vance)";
    } else if (this.activeSector === "cloud_hunter") {
      baseThroughput = 940;
      baseConns = 4120;
      sectorName = "Sector C • Cloud Kubernetes Fabric & Containers";
      devName = "WS-SOC-208 (10.0.4.18 • Elena Rostova)";
    } else if (this.activeSector === "lan_junior") {
      baseThroughput = 82;
      baseConns = 210;
      sectorName = "Sector A • Corporate LAN & Workstation Fleet";
      devName = "WS-SOC-312 (10.0.4.29 • Marcus Chen)";
    }

    const jitter = (Math.random() - 0.5) * 12;
    const throughput = isAtk ? baseThroughput * 3.4 + jitter : baseThroughput + jitter;
    const conns = isAtk ? baseConns * 4 + Math.floor(Math.random() * 80) : baseConns + Math.floor(Math.random() * 20);

    const d = new Date();
    const timeStr = d.toTimeString().split(" ")[0] + "." + Math.floor(d.getMilliseconds() / 100);

    return {
      type: "TELEMETRY_BURST",
      sector_scope: this.activeSector,
      sector_name: sectorName,
      workstation_device: devName,
      active_attack: this.activeAttack,
      attack_metadata: atkMeta,
      attack_vector_ray: atkMeta ? atkMeta.attack_vector_ray : null,
      metrics: {
        packet_throughput_mbs: parseFloat(throughput.toFixed(1)),
        gnn_latency_ms: isAtk ? 5.8 : 1.4,
        dnn_latency_ms: 0.6,
        false_positive_rate: 0.0018,
        active_connections: conns,
        graph_entropy: isAtk ? 0.94 : 0.12,
        blast_radius_factor: isAtk ? 0.88 : 0.05
      },
      latest_flow: {
        event_id: `EVT-${this.eventCount}`,
        timestamp: Date.now(),
        flow_metrics: {
          flow_duration_ms: isAtk ? 14 : 1240,
          total_fwd_packets: isAtk ? 2400 : 28,
          total_bwd_packets: isAtk ? 2 : 24,
          flow_bytes_per_sec: isAtk ? 14200000 : 420000,
          flow_packets_per_sec: isAtk ? 18000 : 120,
          syn_flag_count: isAtk ? 2400 : 1,
          ack_flag_count: isAtk ? 2 : 24,
          rst_flag_count: 0,
          avg_packet_size: isAtk ? 64 : 840,
          header_entropy: isAtk ? 0.96 : 0.22,
          protocol: "TCP",
          source_ip: isAtk ? (atkMeta?.source || "185.220.101.5") : "10.0.4.12",
          dest_ip: isAtk ? (atkMeta?.target || "10.0.4.1") : "10.0.1.50",
          dest_port: isAtk ? (atkMeta?.ports?.[0] || 443) : 8443,
          payload_sample: isAtk ? "SYN_BURST_FLOOD_VECTOR_STATE_EXHAUST" : "TLS_1.3_ENCRYPTED_APPLICATION_DATA"
        },
        inference: {
          prediction: isAtk ? "MALICIOUS_INTRUSION" : "BENIGN_FLOW",
          confidence: isAtk ? 0.998 : 0.999,
          probabilities: isAtk
            ? { BENIGN: 0.002, SYN_FLOOD: 0.94, RECON: 0.04, EXPLOIT: 0.018 }
            : { BENIGN: 0.999, SYN_FLOOD: 0.0003, RECON: 0.0004, EXPLOIT: 0.0003 },
          inference_latency_ms: 0.6,
          feature_contributions: isAtk
            ? { syn_flag_ratio: 0.84, flow_rate: 0.72, byte_entropy: 0.51 }
            : { tls_handshake_cert: 0.89, packet_cadence: 0.62 },
          severity: isAtk ? "CRITICAL" : "INFO"
        }
      },
      gnn_topology_inference: {
        inference_latency_ms: 1.4,
        node_anomalies: {
          [nodes[0]?.id || "node-1"]: {
            topological_anomaly_score: isAtk ? 0.92 : 0.02,
            is_anomalous: isAtk,
            embedding: [0.12, 0.44, -0.23, 0.88]
          }
        },
        lateral_transitions: isAtk
          ? [
              {
                source: nodes[1]?.id || "node-2",
                target: nodes[0]?.id || "node-1",
                hop_probability: 0.89,
                risk_vector: "SYN_EXHAUSTION_HOP"
              }
            ]
          : [],
        global_graph_entropy: isAtk ? 0.94 : 0.12,
        graph_diameter: 4,
        blast_radius_factor: isAtk ? 0.88 : 0.05
      },
      log: {
        id: `LOG-${this.eventCount}`,
        timestamp: timeStr,
        severity: isAtk ? "CRITICAL" : "INFO",
        source: isAtk ? (atkMeta?.source || "185.220.101.5") : nodes[0]?.ip || "10.0.4.12",
        destination: isAtk ? (atkMeta?.target || "10.0.4.1") : nodes[1]?.ip || "10.0.1.1",
        protocol: isAtk ? "TCP/SYN" : "TLSv1.3",
        detection: isAtk ? (atkMeta?.name || "Attack Vector Active") : "Routine Heartbeat Nominal",
        confidence: isAtk ? 0.998 : 0.999,
        message: isAtk
          ? `[${this.activeSector.toUpperCase()}] CRITICAL INTRUSION: ${atkMeta?.description || "High risk activity detected."}`
          : `[${this.activeSector.toUpperCase()}] Continuous Zero-Trust Hardware Attestation: Status Nominal.`
      },
      topology: {
        nodes,
        edges
      }
    };
  }
}

export const mockTelemetryWorker = new MockTelemetryWorker();
