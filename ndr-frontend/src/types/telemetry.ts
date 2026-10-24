export type Severity = "INFO" | "WARN" | "CRITICAL";

export type AttackType = 
  | "DDOS_SYN_FLOOD"
  | "STEALTH_RECON"
  | "APPLAYER_EXPLOIT"
  | "ROGUE_NODE_JOIN";

export interface NetworkNode {
  id: string;
  name: string;
  ip: string;
  mac: string;
  type: "soc" | "router" | "endpoint" | "probe";
  role: string;
  status: "healthy" | "anomalous" | "compromised" | "isolated";
  isolated: boolean;
  os: string;
  open_ports: number[];
  services: string[];
  cves: Array<{
    id: string;
    name: string;
    cvss: number;
    severity: string;
    remediated: boolean;
  }>;
  risk_score: number;
  x: number;
  y: number;
  z: number;
}

export interface NetworkEdge {
  source: string;
  target: string;
  latency_ms: number;
  packet_rate: number;
  bytes_sec: number;
  attack_active: boolean;
  severed?: boolean;
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  severity: Severity;
  source: string;
  destination: string;
  protocol: string;
  detection: string;
  confidence: number;
  message: string;
}

export interface FlowMetrics {
  flow_duration_ms: number;
  total_fwd_packets: number;
  total_bwd_packets: number;
  flow_bytes_per_sec: number;
  flow_packets_per_sec: number;
  syn_flag_count: number;
  ack_flag_count: number;
  rst_flag_count: number;
  avg_packet_size: number;
  header_entropy: number;
  protocol: string;
  source_ip: string;
  dest_ip: string;
  dest_port: number;
  payload_sample: string;
}

export interface DnnInferenceResult {
  prediction: string;
  confidence: number;
  probabilities: Record<string, number>;
  inference_latency_ms: number;
  feature_contributions: Record<string, number>;
  severity: Severity;
}

export interface GnnInferenceResult {
  inference_latency_ms: number;
  node_anomalies: Record<string, {
    topological_anomaly_score: number;
    is_anomalous: boolean;
    embedding: number[];
  }>;
  lateral_transitions: Array<{
    source: string;
    target: string;
    hop_probability: number;
    risk_vector: string;
  }>;
  global_graph_entropy: number;
  graph_diameter: number;
  blast_radius_factor: number;
}

export interface TelemetryBurst {
  type: "TELEMETRY_BURST";
  active_attack: AttackType | null;
  attack_metadata: {
    name: string;
    severity: Severity;
    description: string;
    source: string;
    target: string;
    ports: number[];
  } | null;
  attack_vector_ray: {
    source: string;
    target: string;
  } | null;
  metrics: {
    packet_throughput_mbs: number;
    gnn_latency_ms: number;
    dnn_latency_ms: number;
    false_positive_rate: number;
    active_connections: number;
    graph_entropy: number;
    blast_radius_factor: number;
  };
  latest_flow: {
    event_id: string;
    timestamp: number;
    flow_metrics: FlowMetrics;
    inference: DnnInferenceResult;
  };
  gnn_topology_inference: GnnInferenceResult;
  log: TerminalLog;
  topology: {
    nodes: NetworkNode[];
    edges: NetworkEdge[];
  };
}

export interface BlastRadiusResult {
  target_node: string;
  one_hop_neighbors: string[];
  two_hop_neighbors: string[];
  all_affected_nodes: string[];
  affected_count: number;
  aggregate_exposure_score: number;
  containment_recommendation: string;
}
