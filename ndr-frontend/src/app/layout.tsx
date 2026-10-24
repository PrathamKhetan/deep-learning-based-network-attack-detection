import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CYBER-NDR | Dual-Engine Network Detection & Response Platform",
  description: "Live, production-grade security simulation & monitoring platform featuring 3D topological neural mesh, Tabular DNN flow classifier, and E-GraphSAGE GNN lateral movement analytics.",
  keywords: ["NDR", "Cybersecurity", "SOC", "GNN", "GraphSAGE", "DNN", "Intrusion Detection", "Attack Simulator"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-cyber-bg text-slate-100 min-h-screen cyber-grid antialiased selection:bg-cyber-cyan selection:text-black">
        {children}
      </body>
    </html>
  );
}
