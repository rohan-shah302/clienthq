import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: "200px", background: "#0f0e0c", color: "#fff",
        display: "flex", flexDirection: "column", padding: "24px 16px",
        position: "fixed", height: "100vh"
      }}>
        <div style={{ fontSize: "20px", fontWeight: "700", marginBottom: "32px", paddingLeft: "8px" }}>
          ClientHQ
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          <Link href="/dashboard" style={{
            color: "#fff", textDecoration: "none", padding: "8px 12px",
            borderRadius: "6px", fontSize: "14px", opacity: 0.7
          }}>
            Overview
          </Link>
          <Link href="/dashboard/clients" style={{
            color: "#fff", textDecoration: "none", padding: "8px 12px",
            borderRadius: "6px", fontSize: "14px", opacity: 0.7
          }}>
            Clients
          </Link>
        </nav>
        <UserButton />
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: "200px", flex: 1, padding: "40px" }}>
        {children}
      </main>
    </div>
  );
}