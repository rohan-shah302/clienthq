import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: "600px", margin: "80px auto", padding: "0 20px" }}>
      <h1 style={{ fontSize: "48px", marginBottom: "8px" }}>ClientHQ</h1>
      <p style={{ color: "#666", fontSize: "18px", marginBottom: "40px" }}>
        Your client command center. Manage every client and task in one place.
      </p>
      <div style={{ display: "flex", gap: "12px" }}>
        <Link href="/sign-up" style={{
          background: "#000", color: "#fff", padding: "12px 24px",
          borderRadius: "8px", textDecoration: "none", fontWeight: "600"
        }}>
          Get started free
        </Link>
        <Link href="/sign-in" style={{
          border: "1px solid #ccc", padding: "12px 24px",
          borderRadius: "8px", textDecoration: "none", color: "#000"
        }}>
          Sign in
        </Link>
      </div>
    </main>
  );
}