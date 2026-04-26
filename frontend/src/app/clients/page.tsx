"use client";

import { useEffect, useState } from "react";
import { getClients, createClient, deleteClient } from "@/lib/clientApi";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Fetch clients on load
  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const data = await getClients();
      setClients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: any) {
    e.preventDefault();

    try {
      await createClient({ name, email });
      setName("");
      setEmail("");
      loadClients();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this client?")) return;

    await deleteClient(id);
    loadClients();
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Clients</h1>

      {/* Create Form */}
      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input
          className="border p-2 rounded"
          placeholder="Client name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 rounded">Add</button>
      </form>

      {/* Client List */}
      <div className="space-y-2">
        {clients.map((client) => (
          <div
            key={client.id}
            className="border p-3 rounded flex justify-between"
          >
            <div>
              <p className="font-medium">{client.name}</p>
              <p className="text-sm text-gray-500">{client.email}</p>
            </div>

            <button
              onClick={() => handleDelete(client.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
