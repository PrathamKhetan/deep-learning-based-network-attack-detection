from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from datetime import datetime
from app.database import Base

class ThreatEventRecord(Base):
    __tablename__ = "threat_events"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String(64), unique=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    severity = Column(String(32), index=True)
    attack_type = Column(String(64))
    source_ip = Column(String(64))
    dest_ip = Column(String(64))
    protocol = Column(String(32))
    confidence = Column(Float)
    inference_latency_ms = Column(Float)
    message = Column(String(512))

class NodeRemediationLog(Base):
    __tablename__ = "remediation_logs"

    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(String(64), index=True)
    action = Column(String(32)) # "ISOLATE" or "RESTORE"
    timestamp = Column(DateTime, default=datetime.utcnow)
    triggered_by = Column(String(64), default="SOC_OPERATOR")
    notes = Column(String(256))
