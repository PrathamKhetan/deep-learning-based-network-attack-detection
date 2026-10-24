"""
WebSocket Connection Manager & Real-Time Telemetry Stream.
Streams packets, telemetry nodes, and threat events directly to connected SOC frontends.
"""
from typing import List, Set
from fastapi import WebSocket, WebSocketDisconnect
import asyncio
import json
import logging
from simulators.attack_generator import get_simulator
from app.services.risk_engine import get_risk_engine

logger = logging.getLogger("ndr.websocket")

class ConnectionManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.simulator = get_simulator()
        self.risk_engine = get_risk_engine()
        self._streaming_task: asyncio.Task = None

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info(f"WebSocket client connected. Active connections: {len(self.active_connections)}")
        
        # Send initial snapshot immediately
        burst = self.simulator.generate_telemetry_burst()
        await websocket.send_text(json.dumps(burst))

        # Start broadcast worker if not already running
        if self._streaming_task is None or self._streaming_task.done():
            self._streaming_task = asyncio.create_task(self._broadcast_loop())

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)
        logger.info(f"WebSocket client disconnected. Remaining: {len(self.active_connections)}")

    async def broadcast(self, data: dict):
        if not self.active_connections:
            return
        message = json.dumps(data)
        dead_connections = []
        for connection in list(self.active_connections):
            try:
                await connection.send_text(message)
            except Exception:
                dead_connections.append(connection)
        for dc in dead_connections:
            self.disconnect(dc)

    async def _broadcast_loop(self):
        """Continuous telemetry push loop running every 1000ms (or faster during attack)"""
        logger.info("Telemetry broadcast loop initialized.")
        try:
            while True:
                if self.active_connections:
                    burst = self.simulator.generate_telemetry_burst()
                    await self.broadcast(burst)
                
                # Dynamic interval: 600ms during attack for intense visual feedback, 1200ms nominal
                delay = 0.6 if self.simulator.active_attack else 1.2
                await asyncio.sleep(delay)
        except asyncio.CancelledError:
            logger.info("Telemetry broadcast loop cancelled.")
        except Exception as e:
            logger.error(f"Error in broadcast loop: {e}", exc_info=True)

manager = ConnectionManager()
