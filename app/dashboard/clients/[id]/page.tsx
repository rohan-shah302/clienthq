"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Client, Task } from "../../../types/index";

export default function ClientDetailPage() {
  const { id } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const [clientRes, tasksRes] = await Promise.all([
      fetch(`/api/clients/${id}`),
      fetch(`/api/tasks?client_id=${id}`),
    ]);
    const clientData = await clientRes.json();
    const tasksData = await tasksRes.json();
    setClient(clientData.client);
    setTasks(tasksData.tasks || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    setSaving(true);
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTask, client_id: id }),
    });
    setNewTask("");
    fetchData();
    setSaving(false);
  };

  const handleToggle = async (task: Task) => {
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    fetchData();
  };

  const handleDeleteTask = async (taskId: string) => {
    await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    fetchData();
  };

  if (loading) return <p>Loading...</p>;
  if (!client) return <p>Client not found.</p>;

  const openTasks = tasks.filter(t => !t.completed);
  const doneTasks = tasks.filter(t => t.completed);

  return (
    <div style={{ maxWidth: "600px" }}>
      <Link href="/dashboard/clients" style={{ color: "#666", fontSize: "14px", textDecoration: "none" }}>
        ← Back to clients
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "16px 0 32px" }}>
        <div style={{
          width: "48px", height: "48px", background: "#000", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: "700", fontSize: "18px"
        }}>
          {client.name[0].toUpperCase()}
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px" }}>{client.name}</h1>
          <span style={{
            fontSize: "12px", padding: "2px 8px", borderRadius: "20px",
            background: client.status === "active" ? "#d8f3dc" : "#f0f0f0",
            color: client.status === "active" ? "#2d6a4f" : "#666"
          }}>
            {client.status}
          </span>
        </div>
      </div>

      {client.notes && (
        <div style={{ background: "#f9f9f9", borderRadius: "8px", padding: "12px 16px", marginBottom: "24px", fontSize: "14px", color: "#444" }}>
          {client.notes}
        </div>
      )}

      <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>Tasks</h2>

      {/* Add task */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAddTask()}
          placeholder="Add a task and press Enter..."
          style={{
            flex: 1, padding: "10px 14px", borderRadius: "8px",
            border: "1px solid #ddd", fontSize: "14px"
          }}
        />
        <button onClick={handleAddTask} disabled={saving} style={{
          background: "#000", color: "#fff", border: "none",
          padding: "10px 16px", borderRadius: "8px", cursor: "pointer"
        }}>
          {saving ? "..." : "Add"}
        </button>
      </div>

      {/* Open tasks */}
      {openTasks.length === 0 && (
        <p style={{ color: "#999", fontSize: "14px" }}>No open tasks. Add one above!</p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
        {openTasks.map(task => (
          <div key={task.id} style={{
            display: "flex", alignItems: "center", gap: "12px",
            background: "#fff", border: "1px solid #eee", borderRadius: "8px", padding: "12px 16px"
          }}>
            <button onClick={() => handleToggle(task)} style={{
              width: "20px", height: "20px", borderRadius: "50%",
              border: "2px solid #ddd", background: "none", cursor: "pointer", flexShrink: 0
            }} />
            <span style={{ flex: 1, fontSize: "14px" }}>{task.title}</span>
            <button onClick={() => handleDeleteTask(task.id)} style={{
              background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: "13px"
            }}>✕</button>
          </div>
        ))}
      </div>

      {/* Completed tasks */}
      {doneTasks.length > 0 && (
        <>
          <p style={{ fontSize: "12px", color: "#999", textTransform: "uppercase", letterSpacing: "0.5px" }}>Completed</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {doneTasks.map(task => (
              <div key={task.id} style={{
                display: "flex", alignItems: "center", gap: "12px",
                background: "#f9f9f9", border: "1px solid #eee", borderRadius: "8px", padding: "12px 16px", opacity: 0.6
              }}>
                <button onClick={() => handleToggle(task)} style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  border: "2px solid #4caf50", background: "#4caf50", cursor: "pointer", flexShrink: 0
                }} />
                <span style={{ flex: 1, fontSize: "14px", textDecoration: "line-through", color: "#999" }}>{task.title}</span>
                <button onClick={() => handleDeleteTask(task.id)} style={{
                  background: "none", border: "none", color: "#ccc", cursor: "pointer"
                }}>✕</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}