# 🛡️ Dual-Engine Network Detection & Response (NDR) Platform

> **Live, Production-Grade, Hyper-Interactive Security Simulation & Monitoring Platform**  
> Architected as two completely decoupled and independent microservices: **Next.js Frontend on Vercel** & **Python FastAPI ML Engine on Render**.

[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://render.com)
[![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![PyTorch](https://img.shields.io/badge/PyTorch-GNN_%26_DNN-EE4C2C?style=for-the-badge&logo=pytorch)](https://pytorch.org)

---

## 🏛️ System Architecture & Decoupled Design

```
                     ┌─────────────────────────────────────────────────────────┐
                     │            CYBER-NDR SPATIAL COMMAND CENTER             │
                     │          (Next.js 14 + Tailwind CSS + Canvas 3D)        │
                     │                  Hosted on Vercel                       │
                     └────────────────────────────┬────────────────────────────┘
                                                  │
                                   HTTPS REST & WebSockets (/ws/telemetry)
                                   (With Zero-Latency Client Offline Fallback)
                                                  │
                                                  ▼
                     ┌─────────────────────────────────────────────────────────┐
                     │          NDR DUAL-ENGINE FASTAPI MICROSERVICE           │
                     │                 Hosted on Render                        │
                     ├────────────────────────────┬────────────────────────────┤
                     │   TABULAR DNN CLASSIFIER   │      E-GraphSAGE GNN       │
                     │   Flow Metric Inspection   │  Topological Lateral Recon │
                     │   Sub-2ms Latency SLA      │  Blast Radius Correlation  │
                     ├────────────────────────────┴────────────────────────────┤
                     │            SYNTHETIC ATTACK SIMULATION ENGINE           │
                     │   DDoS SYN Flood • Stealth Recon • SQLi/XSS • Rogue Host│
                     ├─────────────────────────────────────────────────────────┤
                     │         POSTGRESQL THREAT & REMEDIATION DATABASE        │
                     └─────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
.
├── ndr-frontend/                   # Standalone Next.js SPA/SSR (Vercel Ready)
│   ├── src/
│   │   ├── app/                    # Next.js App Router (Dashboard, Layout, Styles)
│   │   ├── components/             # 3D Topology, Attack Dock, Threat Gauges, Terminal, ASM
│   │   ├── lib/                    # WebSocket client, Mock Telemetry Worker & Auto-Fallback
│   │   └── types/                  # NetworkNode, TelemetryBurst, ThreatEvent interfaces
│   ├── vercel.json                 # Vercel deployment blueprint
│   ├── tailwind.config.js          # Cyberpunk SOC color palette & glow keyframes
│   ├── package.json
│   └── README.md
│
├── ndr-backend/                    # Standalone FastAPI Engine (Render Ready)
│   ├── app/
│   │   ├── api/                    # REST routes (/api/v1/*) & WebSockets (/ws/telemetry)
│   │   ├── models/                 # SQLAlchemy DB models & Pydantic schemas
│   │   ├── services/               # Risk engine, CVSS matrix, Blast radius calculator
│   │   ├── config.py               # Settings (DATABASE_URL, CORS_ORIGINS, PORT)
│   │   ├── database.py             # PostgreSQL connection with SQLite automatic fallback
│   │   └── main.py                 # FastAPI application entrypoint with CORSMiddleware
│   ├── ml/
│   │   ├── tabular_dnn.py          # Tabular DNN flow metric classifier (<2ms latency)
│   │   └── graph_sage.py           # E-GraphSAGE GNN topological anomaly detector (<15ms)
│   ├── simulators/
│   │   └── attack_generator.py     # Safe sandboxed synthetic event payload generator
│   ├── Dockerfile                  # Containerized deployment blueprint
│   ├── render.yaml                 # Render Infrastructure-as-Code Blueprint
│   ├── requirements.txt
│   └── README.md
│
├── .gitignore
└── README.md
```

---

## 🎨 Crazy Visual & Feature Capabilities

### 1. 🌌 3D Interactive Topology & Spatial Command Center
- **Force-Directed 3D Mesh**: Real-time projected graph of SOC Master Core, Subnet Routers, Edge Endpoints, and Passive Probes.
- **Orbital Controls**: 360° mouse drag orbital rotation, pan, zoom, and auto-rotation toggle.
- **Dynamic Energy Pulses**: Healthy connections pulse with emerald and cyan energy particles.
- **Attack Shockwaves & Screen Bloom**: Active attacks trigger critical-red particle rays, viewport camera shake, and animated shockwave rings.
- **Interactive Node Drawer**: Click any node to view IP, MAC, hardware/OS profile, open ports, running services, and CVE exposures.
- **Node Sever / Isolation**: Interactive "Sever Link & Isolate Node" trigger with real-time dissolving link animations.

### 2. ⚡ Live Attack & Stress-Testing Suite
Sandboxed attack generator with glowing cyberpunk toggle switches:
- **Volumetric DDoS / SYN Flood**: High-velocity TCP SYN burst exhausting state tables.
- **Stealth Lateral Recon Sweep**: Horizontal TCP SYN/FIN port scanning internal database endpoints.
- **App-Layer Exploit Payload (SQLi / XSS)**: Obfuscated SQL injection and remote code execution payload in HTTP POST stream.
- **Rogue Unauthenticated Node Join**: Shadow device MAC spoofing and ARP poisoning on Subnet Beta.

### 3. 🔍 Asset Vulnerability & Attack Surface Scanner (ASM)
- **Interactive Asset Matrix**: Real-time IP inventory with open port mappings, active service banners, and CVSS exposure ratings.
- **Compromise Blast Radius Calculator**: Calculates multi-hop propagation depth and aggregate exposure score if a node is compromised.

### 4. 📊 High-Octane SOC Dashboard Widgets
- **Matrix Cyber-Terminal**: Live typewriter-effect log stream with color-coded severity badges (`INFO`, `WARN`, `CRITICAL`), auto-scroll pause/resume, search query filter, and log clearing.
- **Radial Gauge Meters & Animated Sparklines**: Real-time tracking of packet throughput (Mb/s), GNN inference latency (<15ms SLA), and False Positive Rates (<0.01%).
- **Tabular DNN Flow Inspector**: Live header inspection showing duration, packet counts, SYN/ACK ratios, header entropy, and neural feature attribution bars.

---

## 🚀 Quickstart: Running Locally

### 1. Launch the Backend (`ndr-backend`)
```bash
cd ndr-backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Uvicorn ASGI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be live at: `http://localhost:8000/docs`

### 2. Launch the Frontend (`ndr-frontend`)
```bash
cd ndr-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Open `http://localhost:3000` to interact with the live SOC console.

---

## ☁️ Deployment Strategy

### 🌐 Deploying Frontend to Vercel
1. Import repository to Vercel.
2. Set **Root Directory** to `ndr-frontend`.
3. Set Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g. `https://ndr-backend.onrender.com`)
   - `NEXT_PUBLIC_WS_URL`: Your Render WebSocket URL (e.g. `wss://ndr-backend.onrender.com/ws/telemetry`)
4. Deploy! The application builds using `vercel.json`.
> **Note**: Even if the backend is cold-starting or offline, the frontend's built-in **Client Mock Telemetry Worker** ensures the entire 3D topology, attack simulations, and terminal logs remain 100% interactive without UI breakage!

### ⚙️ Deploying Backend to Render
1. Create a new **Web Service** on Render connected to this repository.
2. Set **Root Directory** to `ndr-backend`.
3. Set **Runtime**: `Python 3` or `Docker`.
4. Set **Build Command**: `pip install -r requirements.txt`
5. Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variables:
   - `CORS_ORIGINS`: `https://your-vercel-domain.vercel.app,*`
   - `DATABASE_URL`: Your Render Managed Postgres or Supabase database URL.
   - `PORT`: `8000`

---

## 🛡️ License
MIT License &copy; 2026 NDR Project Contributors.
