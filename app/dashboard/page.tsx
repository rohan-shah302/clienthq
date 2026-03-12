import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Welcome to ClientHQ</h1>
      <p style={{ color: "#666", marginBottom: "32px" }}>
        You're in! Start by adding your first client.
      </p>
      <Link href="/dashboard/clients" style={{
        background: "#000", color: "#fff", padding: "12px 24px",
        borderRadius: "8px", textDecoration: "none", fontWeight: "600"
      }}>
        Go to Clients →
      </Link>
    </div>
  );
}