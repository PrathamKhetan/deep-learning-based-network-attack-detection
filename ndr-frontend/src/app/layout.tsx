import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";

export const metadata: Metadata = {
  title: "CYBER-NDR | Dual-Engine Network Detection & Response Platform",
  description: "Enterprise cyber defense command portal with role-based access control, topological neural analytics, and personnel audit inspection.",
  keywords: ["NDR", "Cybersecurity", "SOC", "GNN", "GraphSAGE", "DNN", "Intrusion Detection", "Corporate Access Portal"],
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
