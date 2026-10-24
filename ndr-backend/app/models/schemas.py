from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any

class AttackTriggerRequest(BaseModel):
    attack_type: Optional[str] = Field(None, description="Attack type (DDOS_SYN_FLOOD, STEALTH_RECON, APPLAYER_EXPLOIT, ROGUE_NODE_JOIN) or null to stop")

class NodeRemediationRequest(BaseModel):
    node_id: str
    isolate: bool = True

class FlowPredictRequest(BaseModel):
    flow_duration_ms: float = 120.0
    total_fwd_packets: int = 15
    total_bwd_packets: int = 12
    flow_bytes_per_sec: float = 25000.0
    flow_packets_per_sec: float = 80.0
    syn_flag_count: int = 2
    ack_flag_count: int = 15
    rst_flag_count: int = 0
    avg_packet_size: float = 640.0
    header_entropy: float = 4.2
    payload_sample: Optional[str] = "Normal encrypted TLS record"

class GraphPredictRequest(BaseModel):
    active_attack: Optional[str] = None
