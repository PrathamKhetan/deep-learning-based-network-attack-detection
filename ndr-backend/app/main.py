"""
FastAPI Main Application Entrypoint for NDR Platform.
Exposes RESTful endpoints, CORS middleware, and WebSocket telemetry stream.
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from app.config import settings
from app.database import init_db
from app.api.routes import router as api_router
from app.api.websocket import manager

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("ndr.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing NDR Platform Backend Engine...")
    init_db()
    logger.info(f"NDR Platform active on port {settings.PORT}. CORS origins: {settings.cors_origin_list}")
    yield
    logger.info("NDR Platform Backend shutting down...")

app = FastAPI(
    title="NDR Platform ML & Simulation Engine",
    description="Dual-Engine Network Detection & Response Backend (Tabular DNN + E-GraphSAGE GNN)",
    version="2.0.0",
    lifespan=lifespan
)

# CORS Middleware explicitly configured for Vercel and local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list if "*" not in settings.cors_origin_list else ["*"],
    allow_origin_regex=r"https://.*\.vercel\.app" if "*" not in settings.cors_origin_list else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount REST endpoints
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {
        "platform": "Network Detection & Response (NDR) Dual-Engine API",
        "status": "OPERATIONAL",
        "docs": "/docs",
        "health": "/api/v1/health",
        "websocket": "/ws/telemetry"
    }

@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Client can send commands via WS (e.g. trigger attack or remediation)
            data_text = await websocket.receive_text()
            try:
                import json
                data = json.loads(data_text)
                action = data.get("action")
                if action == "TRIGGER_ATTACK":
                    manager.simulator.set_attack_state(data.get("attack_type"))
                elif action == "ISOLATE_NODE":
                    manager.risk_engine.isolate_node(data.get("node_id"), data.get("isolate", True))
                # Send back immediate burst with updated state
                burst = manager.simulator.generate_telemetry_burst()
                await websocket.send_text(json.dumps(burst))
            except Exception as e:
                logger.warning(f"Error processing client WS message: {e}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket unhandled error: {e}")
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=False)
