"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import { Client } from "../../types/index";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", status: "active", notes: "" });
  const [saving, setSaving] = useState(false);

  const fetchClients = async () => {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data.clients || []);
    setLoading(false);
  };

  useEffect(() => { fetchClients(); }, []);

  const handleAdd = async () => {
    if (!newClient.name.trim()) return;
    setSaving(true);
    await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newClient),
    });
    setNewClient({ name: "", status: "active", notes: "" });
    setShowForm(false);
    fetchClients();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this client?")) return;
    await fetch(`/api/clients/${id}`, { method: "DELETE" });
    fetchClients();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", margin: 0 }}>Clients</h1>
        <button onClick={() => setShowForm(!showForm)} style={{
          background: "#000", color: "#fff", border: "none",
          padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "14px"
        }}>
          + Add client
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#f9f9f9", border: "1px solid #eee", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
          <h3 style={{ margin: "0 0 16px" }}>New Client</h3>
          <input
            placeholder="Client name"
            value={newClient.name}
            onChange={e => setNewClient({ ...newClient, name: e.target.value })}
            style={{ display: "block", width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box" }}
          />
          <select
            value={newClient.status}
            onChange={e => setNewClient({ ...newClient, status: e.target.value })}
            style={{ display: "block", width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }}
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="done">Done</option>
          </select>
          <textarea
            placeholder="Notes (optional)"
            value={newClient.notes}
            onChange={e => setNewClient({ ...newClient, notes: e.target.value })}
            rows={3}
            style={{ display: "block", width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box" }}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={handleAdd} disabled={saving} style={{
              background: "#000", color: "#fff", border: "none",
              padding: "10px 20px", borderRadius: "8px", cursor: "pointer"
            }}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setShowForm(false)} style={{
              background: "none", border: "1px solid #ddd",
              padding: "10px 20px", borderRadius: "8px", cursor: "pointer"
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {clients.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#999" }}>
          No clients yet. Add your first one!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {clients.map(client => (
            <div key={client.id} style={{
              background: "#fff", border: "1px solid #eee", borderRadius: "12px",
              padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div>
                <Link href={`/dashboard/clients/${client.id}`} style={{ fontWeight: "600", marginBottom: "4px", color: "inherit", textDecoration: "none", cursor: "pointer" }}>{client.name}</Link>
                {client.notes && <div style={{ fontSize: "13px", color: "#666" }}>{client.notes}</div>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{
                  fontSize: "12px", padding: "4px 10px", borderRadius: "20px", fontWeight: "500",
                  background: client.status === "active" ? "#d8f3dc" : client.status === "paused" ? "#fef9c3" : "#f0f0f0",
                  color: client.status === "active" ? "#2d6a4f" : client.status === "paused" ? "#9e7c0a" : "#666"
                }}>
                  {client.status}
                </span>
                <button onClick={() => handleDelete(client.id)} style={{
                  background: "none", border: "none", color: "#999",
                  cursor: "pointer", fontSize: "13px"
                }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}