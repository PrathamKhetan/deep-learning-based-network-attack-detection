"""
Risk Engine & Vulnerability Correlation Matrix.
Calculates dynamic CVSS-based asset risk, attack surface exposure, and blast radius propagation.
"""
from typing import Dict, List, Any
import math

# Baseline Network Topology Nodes
DEFAULT_NODES: List[Dict[str, Any]] = [
    {
        "id": "node-soc-master",
        "name": "SOC Master Core",
        "ip": "10.0.0.1",
        "mac": "00:1A:2B:3C:4D:01",
        "type": "soc",
        "role": "Central Command & SIEM Collector",
        "status": "healthy",
        "isolated": False,
        "os": "Hardened Linux Kernel 6.8",
        "open_ports": [443, 8443, 9092, 5432],
        "services": ["HTTPS (TLS 1.3)", "Kafka Event Bus", "PostgreSQL Core"],
        "cves": [
            {"id": "CVE-2023-44487", "name": "HTTP/2 Rapid Reset", "cvss": 7.5, "severity": "HIGH", "remediated": True}
        ],
        "risk_score": 2.1,
        "x": 0, "y": 0, "z": 0
    },
    {
        "id": "node-gw-alpha",
        "name": "Subnet Alpha Router",
        "ip": "10.0.1.1",
        "mac": "00:1A:2B:3C:4D:02",
        "type": "router",
        "role": "Core Subnet Gateway",
        "status": "healthy",
        "isolated": False,
        "os": "VyOS Enterprise Router 1.4",
        "open_ports": [22, 53, 179, 80],
        "services": ["BGP Routing", "DNS Resolver", "SSH Bastion"],
        "cves": [
            {"id": "CVE-2023-38606", "name": "Kernel State Invalidation", "cvss": 5.4, "severity": "MEDIUM", "remediated": False}
        ],
        "risk_score": 3.8,
        "x": -250, "y": 120, "z": 80
    },
    {
        "id": "node-gw-beta",
        "name": "Subnet Beta Router",
        "ip": "10.0.2.1",
        "mac": "00:1A:2B:3C:4D:03",
        "type": "router",
        "role": "DMZ Application Gateway",
        "status": "healthy",
        "isolated": False,
        "os": "VyOS Enterprise Router 1.4",
        "open_ports": [80, 443, 8080],
        "services": ["NGINX Ingress Proxy", "TLS Offloader"],
        "cves": [
            {"id": "CVE-2024-3094", "name": "XZ Liblzma Backdoor Probe", "cvss": 8.1, "severity": "HIGH", "remediated": True}
        ],
        "risk_score": 4.2,
        "x": 250, "y": 120, "z": -80
    },
    {
        "id": "node-db-cluster",
        "name": "Primary Vault DB",
        "ip": "10.0.1.50",
        "mac": "00:1A:2B:3C:4D:04",
        "type": "endpoint",
        "role": "Database / Web Core",
        "status": "healthy",
        "isolated": False,
        "os": "Ubuntu 22.04 LTS",
        "open_ports": [5432, 6379, 9100],
        "services": ["PostgreSQL 16", "Redis Cache", "Prometheus Exporter"],
        "cves": [
            {"id": "CVE-2021-44228", "name": "Log4Shell Vector Check", "cvss": 9.8, "severity": "CRITICAL", "remediated": True},
            {"id": "CVE-2023-22515", "name": "Broken Access Authorization", "cvss": 9.1, "severity": "CRITICAL", "remediated": False}
        ],
        "risk_score": 6.9,
        "x": -320, "y": -140, "z": 120
    },
    {
        "id": "node-app-srv1",
        "name": "API Service Node Alpha",
        "ip": "10.0.2.10",
        "mac": "00:1A:2B:3C:4D:05",
        "type": "endpoint",
        "role": "REST & GraphQL Workload",
        "status": "healthy",
        "isolated": False,
        "os": "Alpine Linux 3.19",
        "open_ports": [8000, 9000],
        "services": ["FastAPI ASGI Cluster", "gRPC Internal Mesh"],
        "cves": [],
        "risk_score": 2.4,
        "x": 320, "y": -120, "z": -140
    },
    {
        "id": "node-app-srv2",
        "name": "Web Proxy Frontend",
        "ip": "10.0.2.11",
        "mac": "00:1A:2B:3C:4D:06",
        "type": "endpoint",
        "role": "Public Web Traffic Node",
        "status": "healthy",
        "isolated": False,
        "os": "Alpine Linux 3.19",
        "open_ports": [80, 443],
        "services": ["Envoy Proxy", "WAF Engine"],
        "cves": [
            {"id": "CVE-2023-4807", "name": "PKCS#7 Buffer Overflow Check", "cvss": 7.8, "severity": "HIGH", "remediated": False}
        ],
        "risk_score": 5.2,
        "x": 180, "y": -220, "z": -40
    },
    {
        "id": "node-probe-east",
        "name": "Passive TAP Sensor East",
        "ip": "10.0.1.254",
        "mac": "00:1A:2B:3C:4D:07",
        "type": "probe",
        "role": "PCAP & NetFlow Probe",
        "status": "healthy",
        "isolated": False,
        "os": "Debian Bookworm Sensor OS",
        "open_ports": [4789],
        "services": ["VXLAN Mirror Consumer", "Zeek Sensor"],
        "cves": [],
        "risk_score": 1.5,
        "x": -150, "y": 240, "z": 160
    },
    {
        "id": "node-probe-west",
        "name": "Passive TAP Sensor West",
        "ip": "10.0.2.254",
        "mac": "00:1A:2B:3C:4D:08",
        "type": "probe",
        "role": "PCAP & NetFlow Probe",
        "status": "healthy",
        "isolated": False,
        "os": "Debian Bookworm Sensor OS",
        "open_ports": [4789],
        "services": ["VXLAN Mirror Consumer", "Suricata IDS Core"],
        "cves": [],
        "risk_score": 1.7,
        "x": 150, "y": 240, "z": -160
    }
]

DEFAULT_EDGES: List[Dict[str, Any]] = [
    {"source": "node-soc-master", "target": "node-gw-alpha", "latency_ms": 1.2, "packet_rate": 450, "bytes_sec": 850000, "attack_active": False},
    {"source": "node-soc-master", "target": "node-gw-beta", "latency_ms": 1.4, "packet_rate": 520, "bytes_sec": 980000, "attack_active": False},
    {"source": "node-gw-alpha", "target": "node-db-cluster", "latency_ms": 0.8, "packet_rate": 340, "bytes_sec": 1200000, "attack_active": False},
    {"source": "node-gw-alpha", "target": "node-probe-east", "latency_ms": 0.4, "packet_rate": 890, "bytes_sec": 2400000, "attack_active": False},
    {"source": "node-gw-beta", "target": "node-app-srv1", "latency_ms": 0.9, "packet_rate": 610, "bytes_sec": 1400000, "attack_active": False},
    {"source": "node-gw-beta", "target": "node-app-srv2", "latency_ms": 1.1, "packet_rate": 780, "bytes_sec": 1850000, "attack_active": False},
    {"source": "node-app-srv1", "target": "node-db-cluster", "latency_ms": 1.6, "packet_rate": 420, "bytes_sec": 920000, "attack_active": False},
    {"source": "node-gw-beta", "target": "node-probe-west", "latency_ms": 0.5, "packet_rate": 860, "bytes_sec": 2200000, "attack_active": False}
]

class RiskEngine:
    def __init__(self):
        self.nodes: Dict[str, Dict[str, Any]] = {n["id"]: dict(n) for n in DEFAULT_NODES}
        self.edges: List[Dict[str, Any]] = [dict(e) for e in DEFAULT_EDGES]
        self.active_attacks: List[Dict[str, Any]] = []

    def get_topology(self) -> Dict[str, Any]:
        return {
            "nodes": list(self.nodes.values()),
            "edges": self.edges
        }

    def get_assets(self) -> List[Dict[str, Any]]:
        assets = []
        for n in self.nodes.values():
            unremediated_cves = [c for c in n.get("cves", []) if not c.get("remediated", False)]
            max_cvss = max([c["cvss"] for c in unremediated_cves], default=0.0)
            assets.append({
                "id": n["id"],
                "name": n["name"],
                "ip": n["ip"],
                "mac": n["mac"],
                "role": n["role"],
                "type": n["type"],
                "status": n["status"],
                "isolated": n.get("isolated", False),
                "os": n.get("os", "Linux"),
                "open_ports": n.get("open_ports", []),
                "services": n.get("services", []),
                "cve_count": len(n.get("cves", [])),
                "critical_cve_count": len([c for c in unremediated_cves if c["cvss"] >= 9.0]),
                "cves": n.get("cves", []),
                "max_cvss": max_cvss,
                "risk_score": n.get("risk_score", 1.0),
                "blast_radius": self.calculate_blast_radius(n["id"])
            })
        return assets

    def calculate_blast_radius(self, target_node_id: str) -> Dict[str, Any]:
        if target_node_id not in self.nodes:
            return {"affected_nodes": [], "propagation_depth": 0, "aggregate_exposure": 0.0}

        # 1-hop and 2-hop graph traversal
        one_hop = set()
        for e in self.edges:
            if e["source"] == target_node_id and not self.nodes.get(e["target"], {}).get("isolated", False):
                one_hop.add(e["target"])
            elif e["target"] == target_node_id and not self.nodes.get(e["source"], {}).get("isolated", False):
                one_hop.add(e["source"])

        two_hop = set()
        for h in one_hop:
            for e in self.edges:
                if e["source"] == h and e["target"] != target_node_id and not self.nodes.get(e["target"], {}).get("isolated", False):
                    two_hop.add(e["target"])
                elif e["target"] == h and e["source"] != target_node_id and not self.nodes.get(e["source"], {}).get("isolated", False):
                    two_hop.add(e["source"])

        all_affected = list(one_hop.union(two_hop))
        
        # Exposure calculation
        total_risk = 0.0
        for nid in all_affected:
            node = self.nodes.get(nid, {})
            total_risk += float(node.get("risk_score", 1.0))

        exposure = min(10.0, round(total_risk / max(1, len(all_affected)) * 1.4, 2)) if all_affected else 0.0

        return {
            "target_node": target_node_id,
            "one_hop_neighbors": list(one_hop),
            "two_hop_neighbors": list(two_hop - one_hop),
            "all_affected_nodes": all_affected,
            "affected_count": len(all_affected),
            "aggregate_exposure_score": exposure,
            "containment_recommendation": "ISOLATE_IMMEDIATELY" if exposure > 6.0 else "ENHANCE_MONITORING"
        }

    def isolate_node(self, node_id: str, isolate: bool = True) -> Dict[str, Any]:
        if node_id not in self.nodes:
            return {"success": False, "error": f"Node {node_id} not found"}

        self.nodes[node_id]["isolated"] = isolate
        self.nodes[node_id]["status"] = "isolated" if isolate else "healthy"
        
        # Modify active links
        for e in self.edges:
            if e["source"] == node_id or e["target"] == node_id:
                e["severed"] = isolate

        return {
            "success": True,
            "node_id": node_id,
            "isolated": isolate,
            "status": self.nodes[node_id]["status"],
            "message": f"Node {node_id} {'severed & isolated from network mesh' if isolate else 'reconnected and restored'}"
        }

    def register_rogue_node(self) -> Dict[str, Any]:
        rogue_id = "node-rogue-x99"
        if rogue_id not in self.nodes:
            rogue_node = {
                "id": rogue_id,
                "name": "UNAUTH_ROGUE_ENDPOINT",
                "ip": "10.0.2.199",
                "mac": "DE:AD:BE:EF:00:99",
                "type": "endpoint",
                "role": "Unregistered Shadow Device",
                "status": "compromised",
                "isolated": False,
                "os": "Unknown Firmware (Kali Linux Signature)",
                "open_ports": [4444, 1337],
                "services": ["Meterpreter Listener", "Shadow C2 Agent"],
                "cves": [
                    {"id": "CVE-2024-UNAUTH", "name": "Zero-Day Ingress Implant", "cvss": 9.9, "severity": "CRITICAL", "remediated": False}
                ],
                "risk_score": 9.7,
                "x": 390, "y": 80, "z": 200
            }
            self.nodes[rogue_id] = rogue_node
            self.edges.append({
                "source": "node-gw-beta",
                "target": rogue_id,
                "latency_ms": 3.8,
                "packet_rate": 1200,
                "bytes_sec": 3800000,
                "attack_active": True
            })
        return self.nodes[rogue_id]

    def reset_rogue_node(self):
        rogue_id = "node-rogue-x99"
        if rogue_id in self.nodes:
            del self.nodes[rogue_id]
        self.edges = [e for e in self.edges if e["source"] != rogue_id and e["target"] != rogue_id]

_risk_engine = None

def get_risk_engine() -> RiskEngine:
    global _risk_engine
    if _risk_engine is None:
        _risk_engine = RiskEngine()
    return _risk_engine
