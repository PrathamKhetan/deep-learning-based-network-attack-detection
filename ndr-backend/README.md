# NDR Dual-Engine Backend Service (`ndr-backend`)

High-performance Python FastAPI microservice powering the Network Detection & Response (NDR) platform. Built for live deployment on **Render** (or Docker/Kubernetes) and completely decoupled from the Next.js frontend.

---

## ⚡ Architecture Highlights

1. **Tabular Deep Neural Network (DNN)**: Statistical flow metric & packet header classifier with sub-2ms latency.
2. **E-GraphSAGE GNN**: Edge-featured Graph Neural Network for topological anomaly detection, lateral movement tracking, and blast radius calculation (<15ms latency).
3. **Synthetic Traffic & Live Attack Simulator**: Sandboxed real-time attack simulator (Volumetric DDoS, Stealth Recon, SQLi/Web Exploit, Rogue Node Join).
4. **WebSocket & SSE Telemetry Pipeline**: Real-time packet bursts and threat logs pushed via `/ws/telemetry`.
5. **PostgreSQL / SQLAlchemy**: Concurrency-ready persistent threat and remediation logs with automatic fallback.

---

## 🚀 Local Quickstart

```bash
cd ndr-backend

# 1. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Launch ASGI Server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive API documentation available at: `http://localhost:8000/docs`

---

## ☁️ Deployment on Render

1. Create a new **Web Service** on [Render](https://render.com).
2. Point to the repository with **Root Directory** set to `ndr-backend`.
3. Set **Build Command**: `pip install -r requirements.txt`
4. Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Configure Environment Variables:
   - `CORS_ORIGINS`: `https://your-app.vercel.app,*`
   - `DATABASE_URL`: Your Render Postgres or Supabase connection string.
