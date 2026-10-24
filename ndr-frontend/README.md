# NDR Frontend Spatial Command Center (`ndr-frontend`)

Production-grade, hyper-interactive security simulation and monitoring web console built for deployment on **Vercel**. Connects strictly via HTTPS REST APIs and WebSockets to the Python backend microservice on **Render**, and includes an automatic zero-latency client-side simulation fallback worker.

---

## 🌌 Core Features

- **3D Spatial Topology**: Interactive 3D force-directed mesh rendered on HTML5 Canvas / WebGL with orbital controls (drag to rotate, mouse wheel to zoom, click to inspect nodes).
- **Dynamic Energy & Laser Links**: Healthy connections display pulsating cyan/emerald pulses.
- **Attack Vector Rays & Shockwaves**: Active attack triggers aggressive red particle streams, camera shake, and screen bloom.
- **Attack Simulator Dock**: Animated switches for Volumetric DDoS, Stealth Lateral Recon, App-Layer SQLi/XSS, and Rogue Node Join.
- **Attack Surface Management (ASM)**: Asset vulnerability inventory with CVSS correlation and dynamic Blast Radius compromise propagation calculator.
- **Matrix Cyber-Terminal**: Live streaming terminal with typewriter effect, severity filtering, and search.
- **Fail-Safe Offline Simulation**: Seamless client-side mock telemetry engine ensures full animations and interactivity even during Render cold-starts.

---

## 🚀 Local Development

```bash
cd ndr-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## ☁️ Deployment on Vercel

1. Push this repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the **Root Directory** to `ndr-frontend`.
4. Configure Environment Variables (optional, defaults to client mock worker if omitted):
   - `NEXT_PUBLIC_API_URL`: `https://your-backend.onrender.com`
   - `NEXT_PUBLIC_WS_URL`: `wss://your-backend.onrender.com/ws/telemetry`
5. Deploy! Vercel automatically detects Next.js and builds using `vercel.json`.
