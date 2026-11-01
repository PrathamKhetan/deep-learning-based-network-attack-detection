# NDR Frontend Spatial Command Center (`ndr-frontend`)

Production-grade, hyper-interactive security simulation and monitoring web console built for deployment on **Vercel**. Connects strictly via HTTPS REST APIs and WebSockets to the Python backend microservice on **Render**, and includes an automatic zero-latency client-side simulation fallback worker.

---

## 🏢 Corporate Role-Based Access Control & Identity Portals

The platform features an enterprise **Aegis Cyber Defense Corp** Zero-Trust Identity Provider (IdP) with role-gated access enforcement:

### 1. Corporate Portals Available
- **Unified Identity Gateway**: [`/login`](file:///Users/pratham/pbl%20cyber%20project/ndr-frontend/src/app/login/page.tsx)
  - Interactive portal selector for **Manager Access Portal** (Tier 4 Executive) and **Employee Access Portal** (Tier 2 Operator).
  - Corporate branding, SOC 2 Type II compliance badges, TLS 1.3 indicator, continuous endpoint verification.
  - One-click instant SSO demo logins for instant evaluation on Vercel.
- **Dedicated Manager Portal**: [`/login/manager`](file:///Users/pratham/pbl%20cyber%20project/ndr-frontend/src/app/login/manager/page.tsx)
- **Dedicated Employee Portal**: [`/login/employee`](file:///Users/pratham/pbl%20cyber%20project/ndr-frontend/src/app/login/employee/page.tsx)

### 2. Role-Based Permissions & Restriction Enforcement
- **Manager (Level 4 Executive Clearance)**:
  - Account: `manager@aegis-defense.corp` / `Manager@2026!` (Cmdr. Sarah Jenkins)
  - **Full access granted** to [`/employee-history`](file:///Users/pratham/pbl%20cyber%20project/ndr-frontend/src/app/employee-history/page.tsx):
    - Inspect entire team action audit trail (node isolations, simulated attacks, PCAP downloads, failed elevation attempts).
    - Filter by employee, severity (Critical/Warn/Info), or action status.
    - View source IP addresses, risk scores, and event timestamps.
    - Revoke employee session tokens and suspend access.
    - Export official SOC 2 compliance audit reports to JSON.
- **Employee (Level 2 Operator Clearance)**:
  - Account: `analyst@aegis-defense.corp` / `Analyst@2026!` (David Vance)
  - Access to live SOC telemetry, 3D topology, flow inspector, and ASM matrix.
  - **VICE VERSA NOT POSSIBLE (403 Forbidden)**:
    - If an Employee attempts to navigate to [`/employee-history`](file:///Users/pratham/pbl%20cyber%20project/ndr-frontend/src/app/employee-history/page.tsx), they are greeted with an enterprise **403 Forbidden Security Barrier**.
    - Cites corporate policy **SEC-OP-403**: employees are prohibited from viewing personnel records or peer operational histories.
    - Includes a one-click button to switch to Manager role so evaluators can easily test both access states.

---

## 🌌 Core Features

- **3D Spatial Topology**: Interactive 3D force-directed mesh rendered on HTML5 Canvas / WebGL with orbital controls (drag to rotate, mouse wheel to zoom, click to inspect nodes).
- **Dynamic Energy & Laser Links**: Healthy connections display pulsating cyan/emerald pulses.
- **Attack Vector Rays & Shockwaves**: Active attack triggers aggressive red particle streams, camera shake, and screen bloom.
- **Attack Simulator Dock**: Animated switches for Volumetric DDoS, Stealth Lateral Recon, App-Layer SQLi/XSS, and Rogue Node Join (automatically logs actions to the employee audit trail).
- **Attack Surface Management (ASM)**: Asset vulnerability inventory with CVSS correlation and dynamic Blast Radius compromise propagation calculator.
- **Matrix Cyber-Terminal**: Live streaming terminal with typewriter effect, severity filtering, and search.
- **Fail-Safe Offline Simulation**: Seamless client-side mock telemetry engine ensures full animations and interactivity even during Render cold-starts.

---

## 🚀 Local Development

```bash
cd ndr-frontend

# Install dependencies
npm install

# Build & test production bundle
npm run build

# Start development server
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## ☁️ Deployment on Vercel

1. Push this repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. If deploying from repository root, Vercel will automatically build using `ndr-frontend/next.config.js` via root `vercel.json`, or you can set the **Root Directory** to `ndr-frontend`.
4. Configure Environment Variables (optional, defaults to client mock worker if omitted):
   - `NEXT_PUBLIC_API_URL`: `https://your-backend.onrender.com`
   - `NEXT_PUBLIC_WS_URL`: `wss://your-backend.onrender.com/ws/telemetry`
5. Deploy! Vercel automatically detects Next.js and builds cleanly.
