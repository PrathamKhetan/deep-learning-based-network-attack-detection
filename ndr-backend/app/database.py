"""
Database connection manager with PostgreSQL (Supabase/Render) support
and automatic fallback for seamless local execution.
"""
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger("ndr.database")

Base = declarative_base()

db_url = settings.DATABASE_URL
# Handle postgres:// vs postgresql:// compatibility in SQLAlchemy
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(db_url, connect_args=connect_args, pool_pre_ping=True)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    logger.info(f"Database connected using: {db_url.split('@')[-1] if '@' in db_url else 'local db'}")
except Exception as e:
    logger.warning(f"Failed to connect to primary DB ({e}). Falling back to local in-memory SQLite.")
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    try:
        from app.models.db_models import ThreatEventRecord, NodeRemediationLog
        Base.metadata.create_all(bind=engine)
        logger.info("Database schemas initialized.")
    except Exception as e:
        logger.warning(f"Database schema initialization warning: {e}")
