import { TelemetryBurst, AttackType } from "@/types/telemetry";
import { mockTelemetryWorker } from "./mockTelemetryWorker";

type ConnectionStatus = "connected_render" | "fallback_mock" | "connecting";
type Subscriber = (burst: TelemetryBurst) => void;
type StatusSubscriber = (status: ConnectionStatus) => void;

class TelemetryClient {
  private ws: WebSocket | null = null;
  private subscribers: Set<Subscriber> = new Set();
  private statusSubscribers: Set<StatusSubscriber> = new Set();
  private status: ConnectionStatus = "connecting";
  private fallbackInterval: any = null;
  private reconnectTimeout: any = null;
  private wsUrl: string = "";
  private apiUrl: string = "";

  constructor() {
    if (typeof window !== "undefined") {
      this.apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      this.wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/telemetry";
      this.initConnection();
    }
  }

  public initConnection() {
    if (typeof window === "undefined") return;

    this.setStatus("connecting");
    try {
      this.ws = new WebSocket(this.wsUrl);

      // Fast fallback if WebSocket doesn't connect within 2.5s (e.g. Render spin-up)
      const connectTimer = setTimeout(() => {
        if (this.status === "connecting") {
          console.warn("[NDR] Render WebSocket delayed. Enabling Client Mock Telemetry Engine.");
          this.enableFallback();
        }
      }, 2500);

      this.ws.onopen = () => {
        clearTimeout(connectTimer);
        this.disableFallback();
        this.setStatus("connected_render");
        console.log("[NDR] Live WebSocket connected to Render backend.");
      };

      this.ws.onmessage = (event) => {
        try {
          const burst: TelemetryBurst = JSON.parse(event.data);
          this.notifySubscribers(burst);
        } catch (e) {
          console.error("[NDR] Error parsing telemetry burst:", e);
        }
      };

      this.ws.onerror = () => {
        clearTimeout(connectTimer);
        this.enableFallback();
      };

      this.ws.onclose = () => {
        clearTimeout(connectTimer);
        this.enableFallback();
        // Attempt periodic reconnect every 15s in background
        if (!this.reconnectTimeout) {
          this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = null;
            if (this.status === "fallback_mock") {
              this.initConnection();
            }
          }, 15000);
        }
      };
    } catch {
      this.enableFallback();
    }
  }

  private setStatus(newStatus: ConnectionStatus) {
    this.status = newStatus;
    this.statusSubscribers.forEach(cb => cb(newStatus));
  }

  public getStatus(): ConnectionStatus {
    return this.status;
  }

  public subscribe(cb: Subscriber): () => void {
    this.subscribers.add(cb);
    // Send immediate initial burst
    if (this.status === "fallback_mock" || this.status === "connecting") {
      cb(mockTelemetryWorker.generateBurst());
    }
    return () => this.subscribers.delete(cb);
  }

  public subscribeStatus(cb: StatusSubscriber): () => void {
    this.statusSubscribers.add(cb);
    cb(this.status);
    return () => this.statusSubscribers.delete(cb);
  }

  private notifySubscribers(burst: TelemetryBurst) {
    this.subscribers.forEach(cb => cb(burst));
  }

  private enableFallback() {
    if (this.status === "fallback_mock" && this.fallbackInterval) return;
    this.setStatus("fallback_mock");
    if (this.fallbackInterval) clearInterval(this.fallbackInterval);

    // Run fallback loop
    this.fallbackInterval = setInterval(() => {
      const burst = mockTelemetryWorker.generateBurst();
      this.notifySubscribers(burst);
    }, 1000);
  }

  private disableFallback() {
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval);
      this.fallbackInterval = null;
    }
  }

  public async triggerAttack(attackType: AttackType | null) {
    // If connected to Render backend, send to WS and REST
    if (this.status === "connected_render" && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        action: "TRIGGER_ATTACK",
        attack_type: attackType
      }));
    } else {
      mockTelemetryWorker.setAttack(attackType);
      // Immediately push updated frame
      this.notifySubscribers(mockTelemetryWorker.generateBurst());
    }

    // Fire REST request as well for idempotency
    try {
      await fetch(`${this.apiUrl}/api/v1/simulate/attack`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attack_type: attackType })
      });
    } catch {
      // Offline fallback already handled
    }
  }

  public async remediateNode(nodeId: string, isolate: boolean = true) {
    if (this.status === "connected_render" && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        action: "ISOLATE_NODE",
        node_id: nodeId,
        isolate
      }));
    } else {
      mockTelemetryWorker.isolateNode(nodeId, isolate);
      this.notifySubscribers(mockTelemetryWorker.generateBurst());
    }

    try {
      await fetch(`${this.apiUrl}/api/v1/simulate/remediate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ node_id: nodeId, isolate })
      });
    } catch {
      // Handled
    }
  }

  public async getAssets() {
    try {
      const res = await fetch(`${this.apiUrl}/api/v1/assets`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return mockTelemetryWorker.getAssets();
  }

  public forceMockMode() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.enableFallback();
  }
}

export const telemetryClient = new TelemetryClient();
