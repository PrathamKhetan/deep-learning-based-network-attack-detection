"""
REST API routes for NDR Platform.
Endpoints for topology, assets, attack simulation, remediation, ML predictions, and metrics.
"""
from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List
import time
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.schemas import (
    AttackTriggerRequest,
    NodeRemediationRequest,
    FlowPredictRequest,
    GraphPredictRequest
)
from app.models.db_models import ThreatEventRecord, NodeRemediationLog
from simulators.attack_generator import get_simulator, ATTACK_TYPES
from app.services.risk_engine import get_risk_engine
from ml.tabular_dnn import get_tabular_dnn
from ml.graph_sage import get_graph_sage

router = APIRouter()

@router.get("/health")
def health_check() -> Dict[str, Any]:
    sim = get_simulator()
    return {
        "status": "ONLINE",
        "service": "ndr-backend-fastapi",
        "timestamp": time.time(),
        "active_attack": sim.active_attack,
        "models_loaded": {
            "tabular_dnn": True,
            "egraph_sage_gnn": True
        }
    }

@router.get("/topology")
def get_network_topology() -> Dict[str, Any]:
    risk_engine = get_risk_engine()
    return risk_engine.get_topology()

@router.get("/assets")
def get_asset_inventory() -> List[Dict[str, Any]]:
    risk_engine = get_risk_engine()
    return risk_engine.get_assets()

@router.get("/assets/{node_id}/blast-radius")
def get_blast_radius(node_id: str) -> Dict[str, Any]:
    risk_engine = get_risk_engine()
    return risk_engine.calculate_blast_radius(node_id)

@router.post("/simulate/attack")
def trigger_attack(req: AttackTriggerRequest, db: Session = Depends(get_db)) -> Dict[str, Any]:
    sim = get_simulator()
    result = sim.set_attack_state(req.attack_type)
    
    # Record event in DB if attack started
    if req.attack_type:
        meta = ATTACK_TYPES.get(req.attack_type, {})
        event_record = ThreatEventRecord(
            event_id=f"EVT-SIM-{int(time.time()*1000)}",
            severity=meta.get("severity", "WARN"),
            attack_type=req.attack_type,
            source_ip=meta.get("source", "SIMULATED_ATTACKER"),
            dest_ip=meta.get("target", "TARGET_NODE"),
            protocol="SIMULATED",
            confidence=0.98,
            inference_latency_ms=1.4,
            message=f"Attack triggered: {meta.get('name')} - {meta.get('description')}"
        )
        try:
            db.add(event_record)
            db.commit()
        except Exception:
            db.rollback()

    return result

@router.post("/simulate/remediate")
def remediate_node(req: NodeRemediationRequest, db: Session = Depends(get_db)) -> Dict[str, Any]:
    risk_engine = get_risk_engine()
    result = risk_engine.isolate_node(req.node_id, req.isolate)
    
    if result.get("success"):
        log_record = NodeRemediationLog(
            node_id=req.node_id,
            action="ISOLATE" if req.isolate else "RESTORE",
            notes=result.get("message")
        )
        try:
            db.add(log_record)
            db.commit()
        except Exception:
            db.rollback()

    return result

@router.post("/predict/flow")
def predict_flow(req: FlowPredictRequest) -> Dict[str, Any]:
    dnn = get_tabular_dnn()
    return dnn.predict(req.model_dump())

@router.post("/predict/graph")
def predict_graph(req: GraphPredictRequest) -> Dict[str, Any]:
    risk_engine = get_risk_engine()
    graph_sage = get_graph_sage()
    topo = risk_engine.get_topology()
    return graph_sage.infer(
        nodes=topo["nodes"],
        edges=topo["edges"],
        active_attack=req.active_attack
    )

@router.get("/metrics")
def get_soc_metrics() -> Dict[str, Any]:
    sim = get_simulator()
    burst = sim.generate_telemetry_burst()
    return {
        "metrics": burst["metrics"],
        "active_attack": sim.active_attack,
        "timestamp": time.time()
    }

@router.get("/threats/history")
def get_threat_history(limit: int = 20, db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    try:
        records = db.query(ThreatEventRecord).order_by(ThreatEventRecord.timestamp.desc()).limit(limit).all()
        return [
            {
                "event_id": r.event_id,
                "timestamp": r.timestamp.isoformat() if r.timestamp else "",
                "severity": r.severity,
                "attack_type": r.attack_type,
                "source_ip": r.source_ip,
                "dest_ip": r.dest_ip,
                "protocol": r.protocol,
                "confidence": r.confidence,
                "message": r.message
            }
            for r in records
        ]
    except Exception:
        return []
